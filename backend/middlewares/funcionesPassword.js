const admin = require("firebase-admin");
const { mensajes } = require("../libs/mensajes");

// ==========================================
// INICIALIZACIÓN DE FIREBASE ADMIN
// ==========================================
// Asegúrate de tener tu archivo serviceAccountKey.json o variables de entorno
// Si usas las credenciales por defecto de AWS u otra nube:
if (!admin.apps.length) {
    admin.initializeApp(); // Esto requiere GOOGLE_APPLICATION_CREDENTIALS
}

// ==========================================
// 1. MIDDLEWARE: USUARIO AUTORIZADO
// ==========================================
async function usuarioAutorizado(token, req) {
    // 1. Buscamos el token en cookies o headers
    if (!token) {
        token = req.cookies?.token || (req.headers?.authorization ? req.headers.authorization.split(" ")[1] : null);
    }

    if (!token) {
        return mensajes(400, "No autorizado (Falta Token)");
    }

    try {
        // 2. Verificamos el token con Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Asignamos el decodedToken a req.usuario
        // Firebase usa 'uid' como ID principal
        req.usuario = {
            ...decodedToken,
            id: decodedToken.uid
        };
        
        return mensajes(200, "Autorizado", "", req.usuario);
    } catch (error) {
        console.log("❌ Token de Firebase inválido:", error.message);
        return mensajes(400, "Token inválido o expirado");
    }
}

// ==========================================
// 2. MIDDLEWARE: ADMIN AUTORIZADO
// ==========================================
async function adminAutorizado(token, req) {
    const auth = await usuarioAutorizado(token, req);
    if (auth.status !== 200) {
        return auth;
    }

    // Como Firebase no almacena roles por defecto en el token (a menos que uses custom claims),
    // deberíamos buscar el usuario en Firestore para validar su rol.
    try {
        const { db } = require("../db/db");
        const doc = await db.collection("usuarios").doc(req.usuario.uid).get();
        if (!doc.exists) return mensajes(403, "Usuario no existe en DB");

        const data = doc.data();
        const rol = data.tipoUsuario || data.perfil?.tipoUsuario || "cliente";
        const rolLimpio = String(rol).toLowerCase().trim();

        if (rolLimpio === "admin" || rolLimpio === "administrador") {
            return mensajes(200, "Admin Autorizado");
        } else {
            return mensajes(403, "Acceso denegado: Se requieren permisos de Administrador.");
        }
    } catch (err) {
        return mensajes(500, "Error verificando administrador");
    }
}

module.exports = { usuarioAutorizado, adminAutorizado };