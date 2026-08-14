const nodemailer = require("nodemailer");
const twilio = require("twilio");

// ==============================
// CONFIGURACIÓN DE NODEMAILER (Email)
// ==============================
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'kirsten.mcglynn1@ethereal.email', 
        pass: '6JgM2QzPqJg3Hst2Xz' 
    }
});

async function enviarCorreoAlertaAnomalia({ emailDestino, nombreUsuario, alerta }) {
    try {
        const mailOptions = {
            from: '"Finix Security Bot" <alertas@finix.com>',
            to: emailDestino,
            subject: `⚠️ ALERTA FINANCIERA: Nivel ${alerta.nivelRiesgo} - ${alerta.titulo}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
                    <div style="background-color: #ff3333; color: white; padding: 20px; text-align: center;">
                        <h2>⚠️ Alerta de Anomalía Financiera</h2>
                    </div>
                    <div style="padding: 20px;">
                        <p>Hola <strong>${nombreUsuario}</strong>,</p>
                        <p>Nuestra inteligencia artificial detectó un comportamiento inusual en tus cuentas de Finix.</p>
                        
                        <div style="background-color: #fff3f3; border-left: 4px solid #ff3333; padding: 15px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #cc0000;">${alerta.titulo}</h3>
                            <p><strong>Nivel de Riesgo:</strong> ${alerta.nivelRiesgo}</p>
                            <p>${alerta.descripcion}</p>
                        </div>
                        
                        <p><strong>💡 Recomendación:</strong></p>
                        <p>${alerta.recomendacion}</p>
                        
                        <p style="margin-top: 30px;">Si no reconoces estos movimientos, por favor revisa tu aplicación Finix inmediatamente.</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("📨 Correo enviado exitosamente: %s", info.messageId);
        console.log("🔗 URL del correo de prueba (Ethereal): %s", nodemailer.getTestMessageUrl(info));
        
        return { exito: true, url: nodemailer.getTestMessageUrl(info) };
    } catch (error) {
        console.error("❌ Error enviando correo:", error);
        return { exito: false, error: error.message };
    }
}

// ==============================
// CONFIGURACIÓN DE TWILIO (SMS)
// ==============================
async function enviarSMSAlerta({ telefonoDestino, nombreUsuario, alerta }) {
    try {
        // En un entorno de producción, estos vienen de process.env
        const accountSid = process.env.TWILIO_ACCOUNT_SID || "ACA_TU_SID";
        const authToken = process.env.TWILIO_AUTH_TOKEN || "ACA_TU_TOKEN";
        const fromNumber = process.env.TWILIO_PHONE_NUMBER || "+1234567890";

        // Prevenimos error si no han configurado Twilio pero prueban la app
        if (accountSid === "ACA_TU_SID") {
            console.log(`📱 (SIMULACIÓN SMS a ${telefonoDestino}): Finix Alerta - ${alerta.titulo}. Riesgo: ${alerta.nivelRiesgo}.`);
            return { exito: true, simulado: true };
        }

        const client = twilio(accountSid, authToken);

        const mensaje = `FINIX ALERTA (${alerta.nivelRiesgo}): ${alerta.titulo}. Hola ${nombreUsuario}, hemos detectado movimientos anómalos. Recomendación: ${alerta.recomendacion}`;

        const response = await client.messages.create({
            body: mensaje,
            from: fromNumber,
            to: telefonoDestino
        });

        console.log("📱 SMS enviado exitosamente. SID: ", response.sid);
        return { exito: true, sid: response.sid };
    } catch (error) {
        console.error("❌ Error enviando SMS vía Twilio:", error);
        return { exito: false, error: error.message };
    }
}

module.exports = { enviarCorreoAlertaAnomalia, enviarSMSAlerta };
