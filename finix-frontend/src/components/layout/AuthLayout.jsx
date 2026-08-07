import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { User, ShieldAlert, Loader2 } from 'lucide-react';

const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [success, setSuccess] = useState(false); // Controla la animación de salida

  // Detectamos modo basado en la URL
  const isUser = location.pathname === '/login';
  
  // Variables de estilo dinámico (Compartidas)
  const activeBg = isUser ? 'bg-finix-orange' : 'bg-red-600';
  const activeBorder = isUser ? 'border-finix-orange' : 'border-red-500';
  const activeShadow = isUser ? 'shadow-finix-orange/30' : 'shadow-red-600/30';

  // Función que los hijos (Forms) llamarán para activar la salida
  const triggerSuccessAnimation = () => {
    setSuccess(true);
    setTimeout(() => {
      if (isUser) navigate('/dashboard');
      else navigate('/admin');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-finix-dark p-4 relative overflow-hidden">
      
      {/* 1. FONDO (Mantiene la transición suave) */}
      <div className={`absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none transition-colors duration-1000 ${isUser ? 'bg-orange-900' : 'bg-red-900'}`} />

      {/* 2. OVERLAY DE ÉXITO (Animación final) */}
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${success ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-110 pointer-events-none'} ${isUser ? 'bg-finix-orange' : 'bg-black'}`}>
        {!isUser && <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>}
        
        <div className="text-center relative z-10 animate-in fade-in zoom-in duration-500">
          {isUser ? (
             <>
               <div className="bg-white text-finix-orange p-6 rounded-full mb-6 mx-auto w-fit shadow-2xl"><User size={64} /></div>
               <h2 className="text-5xl font-black text-white mb-2">¡Hola de nuevo!</h2>
               <p className="text-white/80 text-xl">Preparando tu Dashboard...</p>
             </>
          ) : (
             <>
               <div className="bg-red-600/20 border-2 border-red-500 text-red-500 p-6 rounded-full mb-6 mx-auto w-fit shadow-[0_0_50px_rgba(220,38,38,0.6)] animate-pulse"><ShieldAlert size={64} /></div>
               <h2 className="text-5xl font-black text-white mb-2 tracking-wider">BIENVENIDO, ADMIN</h2>
               <p className="text-red-500 font-mono text-xl flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> CARGANDO PANEL...</p>
             </>
          )}
        </div>
      </div>

      {/* 3. TARJETA CONTENEDORA */}
      <div className={`w-full max-w-md bg-finix-gray border rounded-2xl overflow-hidden relative z-10 transition-all duration-500 ease-in-out ${activeBorder} shadow-[0_0_50px_-12px] ${activeShadow} ${success ? 'opacity-0 scale-90 blur-sm' : 'opacity-100 scale-100'}`}>
        
        {/* PESTAÑAS DE NAVEGACIÓN */}
        <div className="grid grid-cols-2 relative border-b border-gray-700">
          {/* Barra deslizadora MÁGICA (Se mueve suavemente) */}
          <div className={`absolute bottom-0 h-1 transition-all duration-500 ease-in-out ${activeBg}`} style={{ width: '50%', left: isUser ? '0%' : '50%' }} />

          <button onClick={() => navigate('/login')} className={`py-4 font-bold flex items-center justify-center gap-2 transition-colors duration-300 ${isUser ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
            <User size={18} className={`transition-transform duration-300 ${isUser ? 'scale-110' : 'scale-100'}`} /> Usuario
          </button>
          
          <button onClick={() => navigate('/admin-login')} className={`py-4 font-bold flex items-center justify-center gap-2 transition-colors duration-300 ${!isUser ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
            <ShieldAlert size={18} className={`transition-transform duration-300 ${!isUser ? 'scale-110' : 'scale-100'}`} /> Admin
          </button>
        </div>

        {/* AQUÍ SE RENDERIZAN LOS FORMULARIOS HIJOS */}
        <div className="p-8">
            <Outlet context={{ triggerSuccessAnimation }} />
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;