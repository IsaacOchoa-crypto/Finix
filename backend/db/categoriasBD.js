const { db } = require('./db');
const { mensajes } = require('../libs/mensajes');

async function obtenerCategorias(uid) {
    try {
        // 1. Buscamos categorías GLOBALES (las que ve todo el mundo)
        const globalesSnapshot = await db.collection('categorias')
            .where('es_global', '==', true)
            .get();

        // 2. Buscamos categorías PRIVADAS (las que creó solo este usuario)
        // (Opcional: Si tu app permite crear categorías propias)
        const privadasSnapshot = await db.collection('categorias')
            .where('uid', '==', uid)
            .get();

        // 3. Unimos ambas listas
        const listaGlobales = globalesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const listaPrivadas = privadasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const todas = [...listaGlobales, ...listaPrivadas];

        // Si no hay ninguna en la BD, devolvemos un array vacío pero con éxito
        return {
            status: 200,
            mensajeUsuario: "Categorías obtenidas",
            datos: todas
        };

    } catch (error) {
        console.error("Error obteniendo categorías:", error);
        return mensajes(500, "Error al cargar categorías", error);
    }
}

module.exports = { obtenerCategorias };