const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Configura el transportador de Nodemailer.
 * Intenta utilizar credenciales del .env si están disponibles, 
 * o crea una cuenta Ethereal / transporte simulado seguro para pruebas.
 */
const obtenerTransporter = async () => {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para otros puertos
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    // Fallback: Crear cuenta de prueba interactiva en Ethereal Email si no se configuro SMTP real
    console.log('⚠️ [Nodemailer] Sin credenciales de correo en .env. Generando transportador de prueba...');
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });
};

/**
 * Envía un correo electrónico de alerta financiera al usuario.
 * @param {Object} params - Datos del correo y la anomalía
 * @param {string} params.emailDestino - Correo del usuario
 * @param {string} params.nombreUsuario - Nombre del usuario
 * @param {Object} params.alerta - Detalles de la anomalía detectada por Gemini
 */
const enviarCorreoAlertaAnomalia = async ({ emailDestino, nombreUsuario, alerta }) => {
    try {
        const transporter = await obtenerTransporter();

        const fechaLegible = new Date().toLocaleString('es-MX', {
            dateStyle: 'full',
            timeStyle: 'short'
        });

        const colorRiesgo = alerta.nivelRiesgo === 'Crítico' || alerta.nivelRiesgo === 'Alto' ? '#ef4444' : '#f59e0b';

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
                .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); }
                .logo { font-size: 24px; font-weight: bold; color: #ff6b00; letter-spacing: 1px; }
                .badge { display: inline-block; padding: 6px 16px; background-color: ${colorRiesgo}; color: #ffffff; border-radius: 20px; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-top: 15px; }
                .content { margin-top: 25px; line-height: 1.6; }
                .title { font-size: 20px; font-weight: bold; color: #ffffff; margin-bottom: 10px; }
                .card { background: rgba(15, 23, 42, 0.6); border-left: 4px solid ${colorRiesgo}; padding: 15px 20px; border-radius: 8px; margin: 20px 0; }
                .recommendation { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 10px; padding: 15px; margin-top: 20px; }
                .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">⚡ FINIX AI FINANCIAL GUARDIAN</div>
                    <div><span class="badge">Nivel de Riesgo: ${alerta.nivelRiesgo || 'Alto'}</span></div>
                </div>
                <div class="content">
                    <p>Hola <strong>${nombreUsuario || 'Usuario'}</strong>,</p>
                    <p>Nuestro sistema de Inteligencia Artificial ha analizado tus movimientos recientes y ha detectado una <strong>anomalía o patrón de riesgo financiero</strong> que requiere tu atención.</p>

                    <div class="card">
                        <div class="title">${alerta.titulo || 'Alerta de Patrón Financiero Anómalo'}</div>
                        <p style="margin: 0; color: #cbd5e1;">${alerta.descripcion}</p>
                    </div>

                    ${alerta.recomendacion ? `
                    <div class="recommendation">
                        <strong style="color: #60a5fa;">💡 Recomendación de Finix AI:</strong>
                        <p style="margin: 5px 0 0 0; color: #e2e8f0;">${alerta.recomendacion}</p>
                    </div>
                    ` : ''}

                    <p style="font-size: 13px; color: #94a3b8; margin-top: 25px;">
                        Fecha de análisis: ${fechaLegible}
                    </p>
                </div>
                <div class="footer">
                    <p>Este es un correo automático generado por Finix AI Financial Assistant.</p>
                    <p>&copy; ${new Date().getFullYear()} Finix Personal Finance. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"Finix AI Guardian" <no-reply@finix.app>',
            to: emailDestino,
            subject: `🚨 Alerta de Finanzas Finix: ${alerta.titulo || 'Anomalía Detectada'}`,
            html: htmlContent
        });

        console.log(`✅ [Nodemailer] Correo de alerta enviado exitosamente a ${emailDestino}. MessageID: ${info.messageId}`);
        
        // Si usamos Ethereal, mostramos el enlace de vista previa en desarrollo
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log(`🔗 [Nodemailer Ethereal Preview]: ${previewUrl}`);
        }

        return { exito: true, messageId: info.messageId, previewUrl };
    } catch (error) {
        console.error('🔴 [Nodemailer] Error al enviar correo de alerta:', error);
        return { exito: false, error: error.message };
    }
};

module.exports = { enviarCorreoAlertaAnomalia };
