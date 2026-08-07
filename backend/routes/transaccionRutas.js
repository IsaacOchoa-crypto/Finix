const { Router } = require("express");
const router = Router();
const { crearTransaccion, obtenerHistorial } = require("../db/transaccionesBD");
const { usuarioAutorizado } = require("../middlewares/funcionesPassword");

// ==========================================
// MIDDLEWARE: VALIDAR TOKEN
// ==========================================
const validarToken = async (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
    
    if (!token) {
        return res.status(401).json({ estado: false, mensaje: "Token no proporcionado" });
    }

    const auth = await usuarioAutorizado(token, req);
    
    if (auth.status !== 200) {
        return res.status(auth.status).json(auth);
    }
    
    // ⚠️ LÍNEA ELIMINADA ⚠️
    // Ya no hacemos "req.usuario = auth..." porque la función "usuarioAutorizado" 
    // en funcionesPassword.js ya se encargó de decodificar el JWT y guardarlo en req.usuario.
    
    next();
};

// ==========================================
// 1. CREAR TRANSACCIÓN (POST)
// ==========================================
router.post("/transaccion", validarToken, async (req, res) => {
    const { monto, tipo, categoria_nombre } = req.body;

    // VALIDACIÓN BÁSICA
    if (!monto || isNaN(monto) || Number(monto) <= 0) {
        return res.status(400).json({ estado: false, mensaje: "El monto debe ser un número positivo." });
    }
    if (!['ingreso', 'gasto'].includes(tipo)) {
        return res.status(400).json({ estado: false, mensaje: "Tipo de transacción inválido." });
    }
    if (!categoria_nombre) {
        return res.status(400).json({ estado: false, mensaje: "La categoría es obligatoria." });
    }

    try {
        // Extraemos el ID dinámicamente (por si lo guardaste como 'id' o 'uid' en el token)
        const idUsuario = req.usuario.id || req.usuario.uid;

        if (!idUsuario) {
            return res.status(400).json({ estado: false, mensaje: "Token inválido: No contiene ID de usuario." });
        }

        const respuesta = await crearTransaccion(req.body, idUsuario);
        
        res.status(respuesta.status || 200).json({
            estado: respuesta.status === 200,
            mensaje: respuesta.mensajeUsuario,
            datos: respuesta.datos
        });
    } catch (error) {
        console.error("Error en POST /transaccion:", error);
        res.status(500).json({ estado: false, mensaje: "Error interno del servidor" });
    }
});

// ==========================================
// 2. VER HISTORIAL (GET)
// ==========================================
router.get("/transacciones", validarToken, async (req, res) => {
    try {
        // Extraemos el ID dinámicamente
        const idUsuario = req.usuario.id || req.usuario.uid;

        if (!idUsuario) {
            return res.status(400).json({ estado: false, mensaje: "Token inválido: No contiene ID de usuario." });
        }

        const respuesta = await obtenerHistorial(idUsuario); 
        
        res.status(respuesta.status || 200).json({
            estado: respuesta.status === 200,
            mensaje: respuesta.mensajeUsuario,
            datos: respuesta.datos 
        });
    } catch (error) {
        console.error("Error en GET /transacciones:", error);
        res.status(500).json({ estado: false, mensaje: "Error interno del servidor" });
    }
});

module.exports = router;