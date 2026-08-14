const { db } = require('./db');
const { mensajes } = require('../libs/mensajes');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// 🕵️‍♂️ COMPROBACIÓN DE LLAVE
console.log("--- ESTADO DEL MOTOR IA ---");
if (!process.env.GEMINI_API_KEY) {
    console.log("❌ ERROR: No hay GEMINI_API_KEY en el .env");
} else {
    console.log("✅ Llave cargada. Empieza con:", process.env.GEMINI_API_KEY.substring(0, 7));
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const consultarAsesorIA = async (req, res) => {
    try {

        const { pregunta } = req.body;

        // 🔐 Verificar si el usuario está autenticado
        if (!req.usuario) {
            return res.status(401).json(
                mensajes(401, "Usuario no autenticado")
            );
        }

        const usuarioId = req.usuario.id;

        // Buscar usuario en Firestore
        const docUser = await db.collection('usuarios').doc(usuarioId).get();

        if (!docUser.exists) {
            return res.status(404).json(
                mensajes(404, "Usuario no encontrado")
            );
        }

        const userData = docUser.data();
        const saldo = userData?.resumen_financiero?.saldo_actual || 0;
        const nombre = userData?.perfil?.nombre || "Usuario";

        // Obtener historial de transacciones para la IA
        const snapshotTx = await db.collection('transacciones')
            .where('uid', '==', usuarioId)
            .orderBy('fecha', 'desc')
            .limit(30)
            .get();
        
        let transaccionesTexto = "No hay transacciones recientes.";
        if (!snapshotTx.empty) {
            transaccionesTexto = snapshotTx.docs.map(doc => {
                const data = doc.data();
                const tipo = data.tipo === 'ingreso' ? '+' : '-';
                let fecha = '';
                if (data.fecha && typeof data.fecha.toDate === 'function') {
                    fecha = data.fecha.toDate().toLocaleDateString('es-MX');
                } else {
                    fecha = String(data.fecha).split('T')[0];
                }
                const categoria = data.categoria?.nombre || 'General';
                return `[${fecha}] ${categoria}: ${tipo}$${data.monto}`;
            }).join('\n');
        }

        // Obtener metas financieras para la IA
        const snapshotMetas = await db.collection('metas').where('uid', '==', usuarioId).get();
        let metasTexto = "No tiene metas registradas.";
        if (!snapshotMetas.empty) {
            metasTexto = snapshotMetas.docs.map(doc => {
                const data = doc.data();
                return `- Meta: ${data.name || 'Sin nombre'}, Objetivo: $${data.target || 0}, Ahorrado: $${data.current || 0}`;
            }).join('\n');
        }

        // 🔹 Modelo actualizado de Gemini
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-lite-latest"
        });

        console.log(`Conectando con Gemini para el usuario: ${nombre}...`);

        const prompt = `
Eres Finix AI, un asistente financiero personal.

Información del usuario:
Nombre: ${nombre}
Saldo actual: $${saldo}

Metas Financieras del usuario:
${metasTexto}

Últimas transacciones:
${transaccionesTexto}

Reglas:
- Responde en español
- Sé claro y breve
- Da consejos financieros simples
- Usa el saldo, las transacciones y las metas del usuario para dar contexto a tus respuestas.

Pregunta del usuario:
${pregunta}
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const texto = response.text();

        return res.status(200).json(
            mensajes(200, "OK", texto)
        );

    } catch (error) {

        console.error("🔴 ERROR EN EL CHAT:", error);

        return res.status(500).json(
            mensajes(500, "Error en el motor de IA")
        );
    }
};

module.exports = { consultarAsesorIA };
