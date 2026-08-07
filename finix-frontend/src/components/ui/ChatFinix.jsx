import { useState } from 'react';
import api from '../../api/axios'; // Importa tu configuración de axios

export default function ChatFinix() {
    const [pregunta, setPregunta] = useState('');
    const [respuesta, setRespuesta] = useState('');
    const [cargando, setCargando] = useState(false);

    const enviarPregunta = async (e) => {
        e.preventDefault();
        if (!pregunta.trim()) return;
        setCargando(true);

        try {
            // Realizamos la petición al endpoint de tu backend
            const res = await api.post('/chat', { pregunta });
            
            // Extraemos los datos de la respuesta generada por la IA
            setRespuesta(res.data.datos || "Respuesta recibida.");
            
        } catch (error) {
            // [SOLUCIÓN AL ERROR] Ahora usamos la variable 'error' para depuración
            console.error("Error en la conexión con el asesor financiero:", error);
            setRespuesta("Error al conectar con el asesor. Revisa la consola para más detalles.");
        } finally {
            setCargando(false);
            setPregunta('');
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200 mt-10">
            <h3 className="text-xl font-bold mb-4 text-blue-600">🤖 Asesor Finix</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4 min-h-[100px] text-gray-800">
                {cargando ? (
                    <span className="italic text-gray-500 animate-pulse">Pensando...</span>
                ) : (
                    respuesta || "¡Hola! ¿En qué puedo ayudarte hoy con tus finanzas?"
                )}
            </div>

            <form onSubmit={enviarPregunta} className="flex gap-2">
                <input 
                    type="text" 
                    className="flex-1 p-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
                    value={pregunta}
                    onChange={(e) => setPregunta(e.target.value)}
                    placeholder="¿Cuál es mi saldo?" 
                    disabled={cargando}
                />
                <button 
                    type="submit" 
                    disabled={cargando}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-blue-300"
                >
                    {cargando ? "Enviando..." : "Enviar"}
                </button>
            </form>
        </div>
    );
}