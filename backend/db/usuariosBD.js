const { db } = require('./db');
const { encriptarPassword, validarPassword } = require('../middlewares/funcionesPassword');
const { mensajes } = require('../libs/mensajes');
const { crearToken } = require('../libs/jwt');
const UsuarioModelo = require('../models/usuarioModelo');

// ==========================================
// 1. REGISTER
// ==========================================
async function register(datos) {
    const username = datos.username || datos.nombre; 
    const email = datos.email;
    const password = datos.password;

    try {
        const userQuery = await db.collection('usuarios').where('perfil.nombre', '==', username).get();
        const emailQuery = await db.collection('usuarios').where('perfil.email', '==', email).get();

        if (!userQuery.empty || !emailQuery.empty) {
            return mensajes(400, "Usuario o correo ya registrados");
        }

        const { hash, salt } = encriptarPassword(password);
        const docRef = db.collection('usuarios').doc();
        const nuevoUsuario = new UsuarioModelo({ username, email, password: hash, salt });

        await docRef.set(nuevoUsuario.getDatosParaGuardar(docRef.id));

        const token = await crearToken({
            id: docRef.id,
            username,
            email,
            tipoUsuario: "cliente"
        });

        return mensajes(200, "Registro exitoso", "", token);
    } catch (error) {
        console.error("🔴 ERROR REGISTRO:", error);
        return mensajes(500, "Error al registrar", error);
    }
}

// ==========================================
// 2. LOGIN 
// ==========================================
const login = async (datos) => {
    const identificador = datos.usuario || datos.email; 
    const password = datos.password;

    try {
        console.log("Intentando login con:", identificador); 

        let snapshot = await db.collection('usuarios').where('perfil.email', '==', identificador).limit(1).get();
        
        if (snapshot.empty) {
            snapshot = await db.collection('usuarios').where('perfil.nombre', '==', identificador).limit(1).get();
        }

        if (snapshot.empty) {
             snapshot = await db.collection('usuarios').where('email', '==', identificador).limit(1).get();
        }

        if (snapshot.empty) return mensajes(400, "Usuario no encontrado");

        const doc = snapshot.docs[0];
        const usuarioData = doc.data();

        if (!validarPassword(password, usuarioData.salt, usuarioData.password)) {
            return mensajes(400, "Contraseña incorrecta");
        }

        let rolFinal = "cliente"; 
        if (usuarioData.perfil && usuarioData.perfil.tipoUsuario) {
            rolFinal = usuarioData.perfil.tipoUsuario;
        } else if (usuarioData.tipoUsuario) {
            rolFinal = usuarioData.tipoUsuario;
        }

        const datosPerfil = usuarioData.perfil || usuarioData;

        const token = await crearToken({
            id: doc.id,
            username: datosPerfil.nombre,
            email: datosPerfil.email,
            tipoUsuario: rolFinal 
        });

        console.log(`🔑 Login OK: ${datosPerfil.email} | Rol: ${rolFinal}`);

        return {
            status: 200,
            mensajeUsuario: "Login exitoso",
            token: token,
            usuario: {
                uid: doc.id,
                nombre: datosPerfil.nombre,
                email: datosPerfil.email,
                tipoUsuario: rolFinal,
                perfil: usuarioData.perfil
            }
        };

    } catch (error) {
        console.error("Error Login:", error);
        return mensajes(500, "Error en login", error);
    }
};

// ==========================================
// 3. OBTENER POR ID (VERSIÓN BLINDADA CON HISTORIAL)
// ==========================================
const obtenerUsuarioPorId = async (id) => {
    try {
        // PASO 1: Buscar al Usuario
        const doc = await db.collection('usuarios').doc(id).get();
        if (!doc.exists) return mensajes(404, "Usuario no encontrado");
        
        const data = doc.data();
        delete data.password;
        delete data.salt;

        // PASO 2: Intentar buscar el Historial de Transacciones
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
            console.warn("⚠️ No se pudo cargar el historial (pero mostramos al usuario):", errorHistorial.message);
        }
        
        // PASO 3: Entregar datos combinados
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
        
        if (snapshot.empty) {
            return { status: 200, mensajeUsuario: "No hay usuarios", datos: [] };
        }

        const todosLosUsuarios = snapshot.docs.map(doc => {
            const data = doc.data();
            const infoPrincipal = data.perfil || data;
            const infoFinanciera = data.resumen_financiero || {};

            let rol = "cliente";
            if (infoPrincipal.tipoUsuario) rol = infoPrincipal.tipoUsuario;
            else if (data.tipoUsuario) rol = data.tipoUsuario;

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
        
        return {
            status: 200,
            mensajeUsuario: "Lista de usuarios",
            datos: todosLosUsuarios 
        };

    } catch (error) {
        console.error("Error obtenerUsuarios:", error);
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
        
        const data = doc.data();
        const rol = data.tipoUsuario || data.perfil?.tipoUsuario || "cliente";
        if (String(rol).toLowerCase() === "admin" || String(rol).toLowerCase() === "administrador") {
            return mensajes(403, "Operación denegada: No puedes eliminar a otro administrador");
        }

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
        
        const data = doc.data();
        const rol = data.tipoUsuario || data.perfil?.tipoUsuario || "cliente";
        if (String(rol).toLowerCase() === "admin" || String(rol).toLowerCase() === "administrador") {
            return mensajes(403, "Operación denegada: No puedes modificar a otro administrador");
        }

        await db.collection('usuarios').doc(id).update(datos);
        return mensajes(200, "Usuario actualizado");
    } catch (error) {
        return mensajes(500, "Error al actualizar", error);
    }
};

module.exports = { register, login, obtenerUsuarioPorId, obtenerUsuarios, borrarUsuario, actualizarUsuario };