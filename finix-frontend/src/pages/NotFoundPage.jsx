import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
      {/* Luz de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-finix-orange/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <h1 className="text-9xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(255,107,0,0.5)]">404</h1>
      <p className="text-2xl text-gray-300 mb-8">Oops. Parece que te has perdido en el espacio financiero.</p>
      
      <Link to="/dashboard" className="flex items-center gap-2 px-6 py-3 bg-finix-orange text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/20">
        <Home size={20} /> Regresar a la Base
      </Link>
    </div>
  );
};

export default NotFoundPage;