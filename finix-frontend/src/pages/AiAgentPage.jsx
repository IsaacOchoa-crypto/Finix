import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, TrendingUp, AlertTriangle, PieChart } from 'lucide-react';
import api from '../api/axios'; // Importamos tu instancia de axios configurada para el backend

const AiAgentPage = () => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
  // Estado inicial con un mensaje de bienvenida del sistema
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'bot', 
      text: '¡Hola! Soy tu copiloto financiero de Finix. 🤖\n\nPuedo analizar tus gastos reales, consultar tu saldo o darte consejos personalizados basándome en tu historial. ¿En qué te ayudo hoy?' 
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Sugerencias Rápidas vinculadas a datos reales
  const suggestions = [
    { icon: TrendingUp, text: "¿Cuál es mi saldo actual?", color: "text-green-400 border-green-500/30 hover:bg-green-500/10" },
    { icon: AlertTriangle, text: "¿En qué he gastado más?", color: "text-finix-orange border-finix-orange/30 hover:bg-finix-orange/10" },
    { icon: PieChart, text: "Dame un consejo de ahorro", color: "text-blue-400 border-blue-500/30 hover:bg-blue-500/10" },
  ];

  // Efecto para mantener el scroll al final del chat cada vez que hay mensajes nuevos
  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages, isTyping]);

  // FUNCIÓN PRINCIPAL: Conecta tu UI con el Backend real de la IA
  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    
    // 1. Agregar mensaje del usuario a la interfaz de inmediato
    const userMsg = { id: Date.now(), role: 'user', text: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
        // 2. PETICIÓN REAL A TU API (Backend)
        const res = await api.post('/chat', { pregunta: text });

        // Extraemos la respuesta generada por OpenAI (GPT-3.5) desde tu controlador
        const botResponse = res.data.datos || "He recibido la información, pero no pude procesar una respuesta en este momento.";

        // 3. Agregar la respuesta inteligente a la lista de mensajes
        setMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            role: 'bot', 
            text: botResponse 
        }]);

    } catch (error) {
        console.error("Error al consultar la IA:", error);
        setMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            role: 'bot', 
            text: "Lo siento, tuve un problema al conectar con mis circuitos. ¿Está el backend encendido?" 
        }]);
    } finally {
        setIsTyping(false);
    }
  };

  const liquidContainer = "bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col h-[calc(100vh-6rem)]";

  return (
    <div className={liquidContainer}>
      
      {/* Header Finix AI con animación de pulso */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-black/20 z-10">
        <div className="p-2 bg-finix-orange/20 rounded-lg shadow-[0_0_15px_rgba(255,107,0,0.3)] animate-pulse">
          <Sparkles className="text-finix-orange" size={24} />
        </div>
        <div>
          <h2 className="font-bold text-white drop-shadow">Finix AI</h2>
          <p className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span> Inteligencia Activa
          </p>
        </div>
      </div>

      {/* Área de Mensajes Dinámica con scroll personalizado */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative">
        {/* Fondo decorativo sutil */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-finix-orange/5 rounded-full blur-[100px] pointer-events-none"></div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-2 duration-300`}>
            
            {/* Avatar del Usuario o Bot */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border border-white/5 ${
              msg.role === 'user' ? 'bg-gray-700' : 'bg-finix-orange text-black'
            }`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>

            {/* Burbuja de Texto */}
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-md backdrop-blur-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600/90 text-white rounded-tr-none border border-blue-500/30' 
                : 'bg-black/40 border border-white/10 text-gray-200 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Indicador de carga (Escribiendo...) */}
        {isTyping && (
           <div className="flex gap-4 animate-in fade-in duration-300">
             <div className="w-10 h-10 bg-finix-orange rounded-full flex items-center justify-center">
               <Bot size={20} className="text-black"/>
             </div>
             <div className="bg-black/40 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
               <span className="w-2 h-2 bg-finix-orange rounded-full animate-bounce"></span>
               <span className="w-2 h-2 bg-finix-orange rounded-full animate-bounce delay-75"></span>
               <span className="w-2 h-2 bg-finix-orange rounded-full animate-bounce delay-150"></span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sección Inferior: Sugerencias e Input de Texto */}
      <div className="p-4 bg-black/30 border-t border-white/10 z-10 space-y-4">
        
        {/* Chips de Sugerencia (Se ocultan si el chat es largo o está escribiendo) */}
        {!isTyping && messages.length < 4 && (
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {suggestions.map((sug, i) => (
              <button 
                key={i}
                onClick={() => handleSend(sug.text)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border bg-black/40 backdrop-blur-md text-xs font-medium transition whitespace-nowrap ${sug.color}`}
              >
                <sug.icon size={14} />
                {sug.text}
              </button>
            ))}
          </div>
        )}

        {/* Formulario de Entrada */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregúntame sobre tus finanzas..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-4 text-white focus:outline-none focus:border-finix-orange/50 focus:ring-1 focus:ring-finix-orange/50 transition shadow-inner placeholder-gray-500"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping} 
            className="absolute right-2 top-2 p-2 bg-finix-orange rounded-lg text-black hover:bg-orange-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiAgentPage;