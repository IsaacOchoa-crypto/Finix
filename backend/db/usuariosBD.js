const { db } = require('./db');
const { mensajes } = require('../libs/mensajes');
const UsuarioModelo = require('../models/usuarioModelo');

// ==========================================
// 1. REGISTER (MODIFICADO PARA FIREBASE)
// ==========================================
async function register(datos) {
    const username = datos.username || datos.nombre; 
    const email = datos.email || "";
    const telefono = datos.telefono || "";
    const uid = datos.uid; // Ahora el ID lo provee Firebase

    try {
        if (!uid) {
            return mensajes(400, "Se requiere el UID de Firebase");
        }

        const docRef = db.collection('usuarios').doc(uid);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            return mensajes(400, "El usuario ya existe en Firestore");
        }

        // Guardar sin contraseña
        const nuevoUsuario = new UsuarioModelo({ username, email });
        const dataToSave = nuevoUsuario.getDatosParaGuardar(uid);
        dataToSave.telefono = telefono;
        dataToSave.firebaseUid = uid;

        await docRef.set(dataToSave);

        return mensajes(200, "Registro exitoso en Firestore", "", null);
    } catch (error) {
        console.error("🔴 ERROR REGISTRO:", error);
        return mensajes(500, "Error al registrar en DB", error);
    }
}

// ==========================================
// 2. LOGIN (MANTENIDO PARA COMPATIBILIDAD, AUNQUE AHORA FRONTEND USA FIREBASE)
// ==========================================
const login = async (datos) => {
    // Si el frontend envía el firebase_uid tras iniciar sesión en Firebase
    if (datos.firebase_uid) {
        const doc = await db.collection('usuarios').doc(datos.firebase_uid).get();
        if (!doc.exists) return mensajes(400, "Usuario no encontrado en la base de datos");
        const usuarioData = doc.data();
        let rolFinal = usuarioData.perfil?.tipoUsuario || usuarioData.tipoUsuario || "cliente";
        return {
            status: 200,
            mensajeUsuario: "Login exitoso",
            token: "firebase-token-handled-by-client", // El frontend ya tiene el token de Firebase
            usuario: {
                uid: doc.id,
                nombre: usuarioData.perfil?.nombre,
                email: usuarioData.perfil?.email,
                tipoUsuario: rolFinal,
                perfil: usuarioData.perfil
            }
        };
    }
    return mensajes(400, "Debes iniciar sesión con Firebase");
};

// ==========================================
// 3. OBTENER POR ID
// ==========================================
const obtenerUsuarioPorId = async (id) => {
    try {
        const doc = await db.collection('usuarios').doc(id).get();
        if (!doc.exists) return mensajes(404, "Usuario no encontrado");
        
        const data = doc.data();

        let historial = [];
        try {
            const transaccionesSnapshot = await db.collection('transacciones')
                                                  .where('usuarioId', '==', id)
                                                  .get();
            
            if (!transaccionesSnapshot.empty) {
                transaccionesSnapshot.forEach(t => {
                    historial.push({ id: t.id, ...t.data() });
                });
            }
        } catch (errorHistorial) {
            console.warn("⚠️ No se pudo cargar el historial", errorHistorial.message);
        }
        
        return {
            status: 200,
            mensajeUsuario: "Usuario encontrado",
            datos: {
                ...data,
                historial: historial,
                movimientos: historial
            } 
        };
    } catch (error) {
        return mensajes(500, "Error al buscar usuario", error);
    }
};

// ==========================================
// 4. OBTENER TODOS LOS USUARIOS
// ==========================================
const obtenerUsuarios = async () => {
    try {
        const snapshot = await db.collection('usuarios').get();
        if (snapshot.empty) return { status: 200, mensajeUsuario: "No hay usuarios", datos: [] };

        const todosLosUsuarios = snapshot.docs.map(doc => {
            const data = doc.data();
            const infoPrincipal = data.perfil || data;
            const infoFinanciera = data.resumen_financiero || {};
            let rol = infoPrincipal.tipoUsuario || data.tipoUsuario || "cliente";

            return {
                id: doc.id,
                nombre: infoPrincipal.nombre || "Usuario Sin Nombre",
                email: infoPrincipal.email || "Sin email",
                rol: rol, 
                tipoUsuario: rol, 
                saldo_total: infoFinanciera.saldo_actual || 0 
            };
        }).filter(user => {
            const r = String(user.rol).toLowerCase();
            return r !== 'admin' && r !== 'administrador';
        });
        
        return { status: 200, mensajeUsuario: "Lista de usuarios", datos: todosLosUsuarios };
    } catch (error) {
        return mensajes(500, "Error al obtener usuarios", error);
    }
};

// ==========================================
// 5. BORRAR USUARIO
// ==========================================
const borrarUsuario = async (id) => {
    try {
        const doc = await db.collection('usuarios').doc(id).get();
        if (!doc.exists) return mensajes(404, "Usuario no encontrado");
        await db.collection('usuarios').doc(id).delete();
        return mensajes(200, "Usuario eliminado");
    } catch (error) {
        return mensajes(500, "Error al eliminar", error);
    }
};

// ==========================================
// 6. ACTUALIZAR USUARIO
// ==========================================
const actualizarUsuario = async (id, datos) => {
    try {
        const doc = await db.collection('usuarios').doc(id).get();
        if (!doc.exists) return mensajes(404, "Usuario no encontrado");
        await db.collection('usuarios').doc(id).update(datos);
        return mensajes(200, "Usuario actualizado");
    } catch (error) {
        return mensajes(500, "Error al actualizar", error);
    }
};

module.exports = { register, login, obtenerUsuarioPorId, obtenerUsuarios, borrarUsuario, actualizarUsuario };