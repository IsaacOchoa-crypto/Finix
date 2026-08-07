const { Router } = require("express");
const router = Router();
// Importamos la lógica de base de datos (Separación de responsabilidades)
const { obtenerCategorias } = require("../db/categoriasBD");
// Importamos la seguridad
const { usuarioAutorizado } = require("../middlewares/funcionesPassword");

// ==========================================
// MIDDLEWARE DE SEGURIDAD
// ==========================================
const validarToken = async (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
    const auth = await usuarioAutorizado(token, req);
    
    // Si el token no sirve, adiós.
    if (auth.status !== 200) return res.status(auth.status).json(auth);
    
    next();
};

// ==========================================
// RUTA: OBTENER CATEGORÍAS
// ==========================================
router.get("/categorias", validarToken, async (req, res) => {
    // req.usuario.id viene del token validado
    const respuesta = await obtenerCategorias(req.usuario.id);

    // Respondemos con el formato estándar que espera tu Frontend
    res.status(respuesta.status).json({
        estado: respuesta.status === 200,
        mensaje: respuesta.mensajeUsuario || "Datos cargados",
        datos: respuesta.datos
    });
});

module.exports = router;