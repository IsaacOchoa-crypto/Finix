const jwt = require("jsonwebtoken");
require('dotenv').config();
const { mensajes } = require("./mensajes");

// 1. DEFINIMOS LA CLAVE MAESTRA AQUÍ (Afuera de la función)
// Esta es la "Fuente de la Verdad". Si cambias esto, cambias todo.
const SECRET_KEY = process.env.SECRET_TOKEN || "clave_secreta_buen_trueque_2026";

function crearToken(dato) {
    return new Promise((resolve, reject) => {
        // Usamos la variable SECRET_KEY de arriba
        jwt.sign(dato, SECRET_KEY, { expiresIn: "1d" }, (err, token) => {
            if (err) {
                console.error("Error generando token:", err);
                reject(mensajes(500, "Error al crear token", err));
            } else {
                resolve(token);
            }
        });
    });
}

// 2. IMPORTANTE: Exportamos 'crearToken' Y TAMBIÉN 'SECRET_KEY'
module.exports = { crearToken, SECRET_KEY };