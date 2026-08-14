const { Router } = require("express");
const router = Router();
const { consultarAsesorIA } = require('../db/chatBD');
const { 
    register, 
    login, 
    obtenerUsuarioPorId, 
    obtenerUsuarios, 
    borrarUsuario, 
    actualizarUsuario 
} = require("../db/usuariosBD");
const { usuarioAutorizado, adminAutorizado } = require("../middlewares/funcionesPassword");

// ==========================================
// 1. RUTA LIBRE
// ==========================================
router.get("/libre", (req, res) => {
    res.status(200).json({ estado: true, mensaje: "Todo correcto 🚀" });
});

// ==========================================
// 2. REGISTRO
// ==========================================
router.post("/registro", async (req, res) => {
    const datos = req.body; 
    const respuesta = await register(datos);
    
    if (respuesta.status === 200) {
        res.cookie("token", respuesta.token, { httpOnly: true, secure: false });
    }
    
    res.status(respuesta.status).json({
        estado: respuesta.status === 200,
        mensaje: respuesta.mensajeUsuario,
        token: respuesta.token,
        usuario: respuesta.usuario
    });
});

// ==========================================
// 3. INICIO SESIÓN 
// ==========================================
router.post("/inicioSesion", async (req, res) => {
    const datos = req.body; 
    const respuesta = await login(datos);

    if (respuesta.status === 200) {
        res.cookie("token", respuesta.token, { httpOnly: true, secure: false });
    }

    let rolDetectado = "cliente";
    if (respuesta.usuario) {
        if (respuesta.usuario.perfil && respuesta.usuario.perfil.tipoUsuario) {
            rolDetectado = respuesta.usuario.perfil.tipoUsuario;
        } else if (respuesta.usuario.tipoUsuario) {
            rolDetectado = respuesta.usuario.tipoUsuario;
        }
    }
    
    res.status(respuesta.status || 200).json({
        estado: respuesta.status === 200,
        rol: rolDetectado,
        mensaje: respuesta.mensajeUsuario,
        token: respuesta.token,
        usuario: respuesta.usuario
    });
});

// ==========================================
// 4. CERRAR SESIÓN
// ==========================================
router.get("/cerrarSesion", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ estado: true, mensaje: "Sesión cerrada" });
});

// ==========================================
// 5. USUARIO LOGUEADO
// ==========================================
router.get("/usuarioLogueado", async (req, res) => {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
    const auth = await usuarioAutorizado(token, req);
    
    if (auth.status !== 200) return res.status(auth.status).json(auth);

    // Mapeo seguro de ID
    const userDet = auth.usuario || auth.datos || auth;
    req.usuario = { ...userDet, id: userDet.id || userDet.uid || auth.id };

    const respuesta = await obtenerUsuarioPorId(req.usuario.id);
    res.status(respuesta.status).json(respuesta);
});

// ==========================================
// 6. ACTUALIZAR SALDO
// ==========================================
router.put("/actualizarSaldo", async (req, res) => {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
    const auth = await usuarioAutorizado(token, req);
    
    if (auth.status !== 200) return res.status(auth.status).json(auth);

    // Mapeo seguro de ID
    const userDet = auth.usuario || auth.datos || auth;
    req.usuario = { ...userDet, id: userDet.id || userDet.uid || auth.id };

    const nuevoSaldo = Number(req.body.saldo);
    if (isNaN(nuevoSaldo)) {
        return res.status(400).json({ estado: false, mensaje: "Saldo inválido" });
    }

    const respuesta = await actualizarUsuario(req.usuario.id, { 
        "saldo_total": nuevoSaldo,
        "resumen_financiero.saldo_actual": nuevoSaldo
    });

    res.status(respuesta.status).json(respuesta);
});

// ==========================================
// 7. ADMINISTRADORES (VALIDACIÓN)
// ==========================================
router.get("/administradores", async (req, res) => {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
    const auth = await adminAutorizado(token, req);
    if (auth.status !== 200) return res.status(auth.status).json({ estado: false });

    res.status(200).json({ estado: true, mensaje: "Acceso Admin OK" });
});

// ==========================================
// 8. OBTENER LISTA DE TODOS LOS USUARIOS (ADMIN)
// ==========================================
router.get("/usuarios", async (req, res) => {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
    const auth = await adminAutorizado(token, req);
    if (auth.status !== 200) return res.status(auth.status).json(auth);

    const respuesta = await obtenerUsuarios();
    res.status(respuesta.status).json(respuesta);
});

// ==========================================
// 9. OBTENER UN USUARIO POR ID (ADMIN)
// ==========================================
router.get("/usuarios/:id", async (req, res) => {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
    const auth = await adminAutorizado(token, req);
    if (auth.status !== 200) return res.status(auth.status).json(auth);

    const idUsuario = req.params.id;
    const respuesta = await obtenerUsuarioPorId(idUsuario);

    res.status(respuesta.status).json(respuesta);
});

// ==========================================
// 10. ELIMINAR USUARIO (ADMIN)
// ==========================================
router.delete("/usuarios/:id", async (req, res) => {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
    const auth = await adminAutorizado(token, req);
    if (auth.status !== 200) return res.status(auth.status).json(auth);

    const respuesta = await borrarUsuario(req.params.id);
    res.status(respuesta.status).json(respuesta);
});

// ==========================================
// 11. ACTUALIZAR USUARIO (ADMIN)
// ==========================================
router.put("/usuarios/:id", async (req, res) => {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
    const auth = await adminAutorizado(token, req);
    if (auth.status !== 200) return res.status(auth.status).json(auth);

    const respuesta = await actualizarUsuario(req.params.id, req.body);
    res.status(respuesta.status).json(respuesta);
});

// ==========================================
// 🤖 12. RUTA DEL CHATBOT DE IA (CON ASESORÍA PERSONALIZADA)
// ==========================================
// En backend/routes/usuarioRutas.js
router.post("/chat", async (req, res) => {
    try {
        const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
        const auth = await usuarioAutorizado(token, req);
        
        // 🕵️‍♂️ RASTREADOR: Esto aparecerá en tu terminal negra del backend
        console.log("--- DEBUG CHAT ---");
        console.log("Token recibido:", token ? "SÍ" : "NO");
        console.log("Resultado Auth Status:", auth.status);
        console.log("Datos del usuario encontrados:", auth.usuario || auth.datos || "NINGUNO");

        if (auth.status !== 200) return res.status(auth.status).json(auth);

        const usuarioDetectado = auth.token || auth.usuario || auth.datos || auth;
        
        req.usuario = {
            ...usuarioDetectado,
            id: usuarioDetectado.id || usuarioDetectado.uid || auth.id
        };

        if (!req.usuario.id) {
            console.log("❌ ERROR: El ID sigue siendo indefinido");
            return res.status(400).json({ estado: false, mensaje: "No se pudo identificar el ID" });
        }

        await consultarAsesorIA(req, res);
    } catch (error) {
        console.error("Error en ruta /chat:", error);
        res.status(500).json({ estado: false, mensaje: "Error interno" });
    }
});

module.exports = router;