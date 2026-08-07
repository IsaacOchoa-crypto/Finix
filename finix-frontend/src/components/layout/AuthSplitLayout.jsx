import React from 'react';
import { Link } from 'react-router-dom';
import InteractiveNetwork from '../ui/InteractiveNetwork';

const AuthSplitLayout = ({ children, title, subtitle, isDarkApp, themeGradient, footerLink }) => {
  
  const particleColor = isDarkApp ? "#dc2626" : "#ff6b00";
  const glowColor = isDarkApp ? "bg-red-600" : "bg-finix-orange";

  return (
    <div className="min-h-screen flex bg-[#020202] font-sans overflow-hidden relative selection:bg-white/20">
      
      {/* ==================================================================
          FONDO UNIFICADO (OCUPA TODA LA PANTALLA)
         ================================================================== */}
      
      {/* 1. La Red Interactiva ahora está DETRÁS de todo, cubriendo el 100% */}
      <div className="absolute inset-0 z-0">
         <InteractiveNetwork themeColor={particleColor} />
      </div>

      {/* 2. Grid Sutil para textura */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" 
           style={{
             backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), 
                               linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
             backgroundSize: '100px 100px'
           }}>
      </div>

      {/* 3. Vignette y Oscurecimiento Estratégico */}
      {/* Oscurecemos un poco más el lado derecho para que el formulario se lea bien */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-r from-black/40 via-black/60 to-black/90"></div>
      
      {/* 4. Glow Ambiental Central */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ${glowColor} rounded-full blur-[250px] opacity-10 z-0 animate-pulse`} style={{ animationDuration: '8s' }}></div>


      {/* ==================================================================
          CONTENIDO (FLOTA ENCIMA)
         ================================================================== */}
      
      <div className="relative z-10 w-full flex">
        
        {/* --- LADO IZQUIERDO (TEXTO) --- */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-xl">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-bold tracking-widest uppercase mb-6 text-gray-400`}>
                <span className={`w-2 h-2 rounded-full ${glowColor} animate-pulse`}></span>
                {isDarkApp ? 'System Access' : 'Finance OS v2.0'}
              </div>
              
              <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
                Finix <br />
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${themeGradient}`}>
                  Platform.
                </span>
              </h1>
              
              <p className="text-lg text-gray-300 leading-relaxed max-w-md border-l-2 border-white/20 pl-6 drop-shadow-md">
                {isDarkApp 
                  ? "Infraestructura crítica para la gestión y seguridad del ecosistema."
                  : "La nueva era de la inteligencia financiera. Control total, diseño sin límites."
                }
              </p>
          </div>
        </div>

        {/* --- LADO DERECHO (FORMULARIO) --- */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          
          <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-700">
            
            {/* TARJETA GLASS */}
            {/* Nota: backdrop-blur-xl asegura que las partículas se vean borrosas detrás del form */}
            <div className="bg-[#050505]/60 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] shadow-[0_0_80px_-20px_rgba(0,0,0,1)] relative overflow-hidden group">
              
              {/* Ruido y Brillo */}
              <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
              <div className={`absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine`} />
              
              <div className="relative z-10">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-white text-center tracking-tight">{title}</h2>
                  <p className="text-gray-400 text-center mt-3 text-sm">{subtitle}</p>
                </div>

                {children}
              </div>

            </div>
             
            {footerLink && (
                <p className="text-center text-gray-500 mt-8 text-sm relative z-30 font-medium">
                    {footerLink.text}{' '}
                    <Link to={footerLink.to} className={`font-bold hover:underline bg-clip-text text-transparent bg-gradient-to-r ${themeGradient} hover:opacity-80 transition-opacity`}>
                        {footerLink.linkText}
                    </Link>
                </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthSplitLayout;