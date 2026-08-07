const admin = require('firebase-admin');
const { mensajes } = require('../libs/mensajes');
const serviceAccount = require('../serviceAccountKey.json'); // Asegúrate de tener este archivo

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

function conectarBD() {
    if (db) return mensajes(200, "Conexión a Firebase exitosa");
    return mensajes(500, "Error de conexión");
}

module.exports = { conectarBD, db };