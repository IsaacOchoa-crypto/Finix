const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { mensajes } = require("../libs/mensajes");

// 🔥 CAMBIO CLAVE: Importamos la SECRET_KEY desde el archivo anterior
const { SECRET_KEY } = require("../libs/jwt"); 

// ==========================================
// 1. FUNCIONES CRIPTOGRÁFICAS (Scrypt - Para que funcionen tus usuarios actuales)
// ==========================================
function encriptarPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(password, salt, 10, 64, "sha512").toString("hex");
    return { salt, hash };
}

function validarPassword(password, salt, hash) {
    const hashEvaluar = crypto.scryptSync(password, salt, 10, 64, "sha512").toString("hex");
    return hashEvaluar === hash;
}

// ==========================================
// 2. MIDDLEWARE: USUARIO AUTORIZADO
// ==========================================
function usuarioAutorizado(token, req) {
    return new Promise((resolve) => {
        // 1. Buscamos el token
        if (!token) {
            token = req.cookies?.token || (req.headers?.authorization ? req.headers.authorization.split(" ")[1] : null);
        }

        if (!token) {
            return resolve(mensajes(400, "No autorizado (Falta Token)"));
        }
        
        // 2. Verificamos que tengamos la clave maestra importada
        if (!SECRET_KEY) {
            console.error("🔴 ERROR: No se importó la SECRET_KEY en funcionesPassword.js");
            return resolve(mensajes(500, "Error de servidor (Clave no encontrada)"));
        }

        // 3. Validamos usando la MISMA clave
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log("❌ Token inválido:", err.message);
                return resolve(mensajes(400, "Token inválido"));
            }
            req.usuario = decoded;
            resolve(mensajes(200, "Autorizado"));
        });
    });
}

// ==========================================
// 3. MIDDLEWARE: ADMIN AUTORIZADO
// ==========================================
async function adminAutorizado(token, req) {
    // 1. Validar que el token sea auténtico
    const auth = await usuarioAutorizado(token, req);
    if (auth.status !== 200) {
        return auth;
    }

    // 2. Verificar Rol (Leemos el token, NO la base de datos)
    const rol = req.usuario.tipoUsuario || req.usuario.rol || req.usuario.perfil?.tipoUsuario;
    const rolLimpio = String(rol).toLowerCase().trim();

    console.log(`🛡️ Middleware Admin: Rol detectado -> '${rolLimpio}'`);

    if (rolLimpio === "admin") {
        return mensajes(200, "Admin Autorizado");
    } else {
        return mensajes(403, "Acceso denegado: Se requieren permisos de Administrador.");
    }
}

module.exports = { encriptarPassword, validarPassword, usuarioAutorizado, adminAutorizado };