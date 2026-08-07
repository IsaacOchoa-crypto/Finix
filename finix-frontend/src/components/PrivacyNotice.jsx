import React, { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';

export const PrivacyNotice = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Revisar si el usuario ya aceptó las políticas previamente
    const hasAccepted = localStorage.getItem('finix_privacy_accepted');
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('finix_privacy_accepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-900 border-t border-slate-700 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-300">
      <div className="flex items-start md:items-center gap-3">
        <Shield className="w-6 h-6 text-blue-500 shrink-0 mt-1 md:mt-0" />
        <p>
          <strong>Aviso de Privacidad (Cumplimiento LFPDPPP / GDPR):</strong> Utilizamos cookies y 
          tecnologías similares para proteger tus datos financieros y ofrecerte una experiencia segura. 
          Al continuar navegando, aceptas nuestra directiva de tratamiento de datos personales. 
          <a href="/docs/politica-privacidad.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">Ver políticas completas.</a>
        </p>
      </div>
      
      <div className="flex gap-2 w-full md:w-auto shrink-0">
        <button 
          onClick={handleAccept}
          className="flex-1 md:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Aceptar
        </button>
        <button 
          onClick={() => setIsVisible(false)}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PrivacyNotice;
