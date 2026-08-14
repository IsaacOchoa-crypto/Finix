const { Router } = require("express");
const router = Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { db } = require("../db/db");
const { usuarioAutorizado } = require("../middlewares/funcionesPassword");
const { enviarCorreoAlertaAnomalia, enviarSMSAlerta } = require("../libs/emailService");
require("dotenv").config();

// Inicializar Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Middleware para validar el token JWT
const validarToken = async (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
    
    if (!token) {
        return res.status(401).json({ estado: false, mensaje: "Token no proporcionado" });
    }

    const auth = await usuarioAutorizado(token, req);
    if (auth.status !== 200) {
        return res.status(auth.status).json(auth);
    }
    
    const userDet = auth.usuario || auth.datos || auth;
    req.usuario = { ...userDet, id: userDet.id || userDet.uid || auth.id };
    next();
};

/**
 * @route POST /api/anomalias/analizar
 * @desc Analiza el historial transaccional del usuario con Gemini AI para detectar anomalías y enviar alertas por email
 * @access Privado
 */
router.post("/anomalias/analizar", validarToken, async (req, res) => {
    try {
        const idUsuario = req.usuario.id || req.usuario.uid;

        if (!idUsuario) {
            return res.status(400).json({ estado: false, mensaje: "ID de usuario no identificado." });
        }

        // 1. Obtener datos del usuario desde Firestore
        const userDoc = await db.collection("usuarios").doc(idUsuario).get();
        const userData = userDoc.exists ? userDoc.data() : {};
        const perfil = userData.perfil || userData;
        const nombreUsuario = perfil.nombre || perfil.username || "Usuario";
        const emailUsuario = perfil.email || userData.email || req.usuario.email;
        const telefonoUsuario = userData.telefono || perfil.telefono;

        // 2. Obtener transacciones (de la petición o desde Firestore)
        let transacciones = req.body.transacciones;
        
        if (!Array.isArray(transacciones) || transacciones.length === 0) {
            const snapshot = await db.collection("transacciones")
                .where("uid", "==", idUsuario)
                .orderBy("fecha", "desc")
                .limit(30)
                .get();

            transacciones = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    monto: Number(data.monto) || 0,
                    tipo: data.tipo || "gasto",
                    categoria: data.categoria?.nombre || data.categoria_nombre || "General",
                    fecha: data.fecha && typeof data.fecha.toDate === "function" 
                           ? data.fecha.toDate().toISOString().split("T")[0] 
                           : data.fecha
                };
            });
        }

        const saldoActual = userData.resumen_financiero?.saldo_actual ?? userData.saldo_total ?? 0;

        // 3. Preparar Prompt para Google Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
Eres un sistema experto en auditoría financiera y detección de riesgos de la plataforma Finix.
Analiza la siguiente información financiera y transacciones del usuario:

DATOS DEL USUARIO:
- Nombre: ${nombreUsuario}
- Saldo Actual: $${saldoActual}

HISTORIAL DE TRANSACCIONES RECIENTES:
${JSON.stringify(transacciones, null, 2)}

INSTRUCCIONES DE EVALUACIÓN:
1. Determina si existe alguna ANOMALÍA O PATRÓN DE RIESGO FINANCIERO. 
Considera anomalías:
- Gastos inusualmente altos o desproporcionados con respecto al saldo actual.
- Frecuencia atípica de compras en categorías no esenciales (entretenimiento, lujo, compras compulsivas).
- Saldo negativo o cercano a cero por racha de gastos.
- Picos de gastos repentinos en un periodo muy corto.

2. Responde ÚNICAMENTE con un objeto JSON estricto sin marcado de código ni introducciones, usando la siguiente estructura:
{
  "hayAnomalia": boolean,
  "nivelRiesgo": "Ninguno" | "Bajo" | "Medio" | "Alto" | "Crítico",
  "titulo": "Título breve y descriptivo del hallazgo",
  "descripcion": "Explicación detallada del patrón de riesgo o anomalía encontrada en las transacciones",
  "recomendacion": "Consejo o acción correctiva clara para el usuario"
}
`;

        const result = await model.generateContent(prompt);
        const rawText = result.response.text().trim();

        // Limpiar posible formato Markdown ```json ... ```
        const jsonCleanText = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "").trim();

        let diagnosticoIA;
        try {
            diagnosticoIA = JSON.parse(jsonCleanText);
        } catch (e) {
            console.warn("⚠️ No se pudo parsear JSON exacto de Gemini, aplicando fallback seguro. Raw:", rawText);
            diagnosticoIA = {
                hayAnomalia: rawText.toLowerCase().includes("anomalía") || rawText.toLowerCase().includes("riesgo"),
                nivelRiesgo: "Medio",
                titulo: "Análisis de Movimientos Financieros",
                descripcion: rawText,
                recomendacion: "Mantén un registro regular de tus gastos para evitar imprevistos."
            };
        }

        let resultadoEmail = { exito: false };
        let resultadoSMS = { exito: false };

        // 4. Si Gemini detecta anomalía, disparar correo o SMS
        if (diagnosticoIA.hayAnomalia) {
            if (telefonoUsuario) {
                console.log(`🚨 Anomalía detectada. Enviando alerta por SMS a ${telefonoUsuario}...`);
                resultadoSMS = await enviarSMSAlerta({
                    telefonoDestino: telefonoUsuario,
                    nombreUsuario: nombreUsuario,
                    alerta: diagnosticoIA
                });
            } else if (emailUsuario) {
                console.log(`🚨 Anomalía detectada para ${emailUsuario}. Enviando alerta por correo...`);
                resultadoEmail = await enviarCorreoAlertaAnomalia({
                    emailDestino: emailUsuario,
                    nombreUsuario: nombreUsuario,
                    alerta: diagnosticoIA
                });
            }
        }

        return res.status(200).json({
            estado: true,
            hayAnomalia: diagnosticoIA.hayAnomalia,
            alerta: diagnosticoIA,
            emailEnviado: resultadoEmail.exito,
            smsEnviado: resultadoSMS.exito,
            mensaje: diagnosticoIA.hayAnomalia 
                ? "Anomalía detectada. Alerta procesada y notificada." 
                : "No se detectaron anomalías en las transacciones analizadas."
        });

    } catch (error) {
        console.error("🔴 Error en POST /api/anomalias/analizar:", error);
        return res.status(500).json({
            estado: false,
            mensaje: "Error al procesar el análisis de anomalías.",
            error: error.message
        });
    }
});

module.exports = router;
