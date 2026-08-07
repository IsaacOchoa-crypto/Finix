const { db } = require('./db');
const { mensajes } = require('../libs/mensajes');

// ==========================================
// 1. CREAR TRANSACCIÓN (ATÓMICA Y SEGURA)
// ==========================================
async function crearTransaccion(datos, uid) {
    try {
        const monto = Number(datos.monto);
        if (isNaN(monto) || monto <= 0) return mensajes(400, "Monto inválido");

        // Referencias a los documentos
        const usuarioRef = db.collection('usuarios').doc(uid);
        const transaccionRef = db.collection('transacciones').doc(); // ID automático

        // Preparar el objeto de la transacción (Snapshot)
        const nuevaTransaccion = {
            uid: uid,
            monto: monto,
            tipo: datos.tipo, // 'ingreso' o 'gasto'
            fecha: new Date(), // Guardamos fecha real (Timestamp)
            nota: datos.nota || "",
            // SNAPSHOT: Guardamos la foto de la categoría en este momento
            categoria: {
                id: datos.categoria?.id || "general",
                nombre: datos.categoria?.nombre || "General",
                icono: datos.categoria?.icono || "📝"
            }
        };

        // 🔥 TRANSACCIÓN ATÓMICA: O se hace todo, o no se hace nada.
        await db.runTransaction(async (t) => {
            // 1. LEER
            const usuarioDoc = await t.get(usuarioRef);
            if (!usuarioDoc.exists) throw "Usuario no encontrado";

            const dataUsuario = usuarioDoc.data();
            const financiero = dataUsuario.resumen_financiero || { saldo_actual: 0, total_gastos: 0, total_ingresos: 0 };

            // 2. CALCULAR
            let nuevoSaldo = Number(financiero.saldo_actual) || 0;
            let nuevoTotalGastos = Number(financiero.total_gastos) || 0;
            let nuevoTotalIngresos = Number(financiero.total_ingresos) || 0;

            if (datos.tipo === 'gasto') {
                nuevoSaldo -= monto;
                nuevoTotalGastos += monto;
            } else {
                nuevoSaldo += monto;
                nuevoTotalIngresos += monto;
            }

            // 3. ESCRIBIR
            t.set(transaccionRef, nuevaTransaccion);
            
            t.update(usuarioRef, {
                "resumen_financiero.saldo_actual": nuevoSaldo,
                "resumen_financiero.total_gastos": nuevoTotalGastos,
                "resumen_financiero.total_ingresos": nuevoTotalIngresos,
                "saldo_total": nuevoSaldo 
            });
        });

        // ✅ CAMBIO: Retorno manual para asegurar que viajen los datos
        return {
            status: 200,
            mensajeUsuario: "Transacción registrada exitosamente",
            datos: nuevaTransaccion
        };

    } catch (error) {
        console.error("Error en crearTransaccion:", error);
        return mensajes(500, "Error al procesar la transacción", error);
    }
}

// ==========================================
// 2. OBTENER HISTORIAL (CORREGIDO - RETORNO MANUAL)
// ==========================================
async function obtenerHistorial(uid) {
    try {
        const snapshot = await db.collection('transacciones')
            .where('uid', '==', uid)
            .orderBy('fecha', 'desc') 
            .limit(50) 
            .get();

        // ✅ CAMBIO: Retorno manual si está vacío
        if (snapshot.empty) {
            return {
                status: 200,
                mensajeUsuario: "Sin movimientos",
                datos: [] 
            };
        }

        const historial = snapshot.docs.map(doc => {
            const data = doc.data();
            
            // 🛡️ BLINDAJE DE FECHAS
            let fechaSegura;
            if (data.fecha && typeof data.fecha.toDate === 'function') {
                fechaSegura = data.fecha.toDate().toISOString();
            } else {
                fechaSegura = data.fecha;
            }

            return {
                id: doc.id,
                ...data,
                fecha: fechaSegura 
            };
        });

        // ✅ CAMBIO: Retorno manual con los datos (¡ESTO ES LO QUE FALTABA!)
        return {
            status: 200,
            mensajeUsuario: "Historial obtenido",
            datos: historial
        };

    } catch (error) {
        console.error("Error historial:", error);
        return mensajes(500, "Error al obtener historial", error);
    }
}

// ==========================================
// 3. DATOS PARA GRÁFICA (CORREGIDO - RETORNO MANUAL)
// ==========================================
async function obtenerDatosGrafica(uid) {
    try {
        const snapshot = await db.collection('transacciones')
            .where('uid', '==', uid)
            .orderBy('fecha', 'asc')
            .get();
        
        let ingresos = [];
        let gastos = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            
            // 🛡️ BLINDAJE DE FECHAS
            let fechaLegible;
            if (data.fecha && typeof data.fecha.toDate === 'function') {
                fechaLegible = data.fecha.toDate().toISOString().split('T')[0];
            } else {
                fechaLegible = String(data.fecha).split('T')[0];
            }
            
            const punto = { 
                fecha: fechaLegible,
                monto: data.monto 
            };
            
            if (data.tipo === 'ingreso') ingresos.push(punto);
            else if (data.tipo === 'gasto') gastos.push(punto);
        });

        // ✅ CAMBIO: Retorno manual con los datos
        return {
            status: 200,
            mensajeUsuario: "Datos gráfica generados",
            datos: { ingresos, gastos }
        };

    } catch (error) {
        console.error("Error gráfica:", error);
        return mensajes(500, "Error al obtener datos de gráfica", error);
    }
}

module.exports = { crearTransaccion, obtenerHistorial, obtenerDatosGrafica };