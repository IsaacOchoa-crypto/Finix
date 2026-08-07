import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, role, isAuthenticated, loading } = useAuth();

  React.useEffect(() => {
    if (loading) return;
    
    // Si no está autenticado, al login normal
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Si un admin intenta entrar al dashboard de cliente, lo sacamos
    const rolUsuario = String(role).toLowerCase();
    if (rolUsuario === 'admin' || rolUsuario === 'administrador') {
      navigate('/admin');
    }
  }, [loading, isAuthenticated, role, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020202] text-white">
        <Loader2 className="animate-spin text-finix-orange mb-4" size={40} />
        <p className="text-gray-400">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] font-sans selection:bg-finix-orange/30">
      
      {/* 1. FONDO DE PARTÍCULAS (Global) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-finix-orange/5 rounded-full blur-[120px]"></div>
      </div>

      {/* =========================================
          MÓVIL: BARRA SUPERIOR Y MENÚ FLOTANTE
         ========================================= */}
      
      {/* Barra Superior (Solo visible en Móvil) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-finix-orange to-orange-600 flex items-center justify-center">
              <span className="font-bold text-white text-sm">F.</span>
           </div>
           <span className="font-bold text-white">Finix.</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg border border-white/10"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Menú Lateral MÓVIL (Con transición deslizante) */}
      <div className={`
        md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[#050505] border-r border-white/5 transform transition-transform duration-300 ease-in-out shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg"
        >
          <X size={18} />
        </button>
      </div>

      {/* Overlay Negro (Solo Móvil) */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
        ></div>
      )}

      {/* =========================================
          DESKTOP: SIDEBAR FIJO (SIN ANIMACIÓN)
         ========================================= */}
      
      {/* Este bloque SOLO aparece en PC (md:block) y siempre está fijo a la izquierda */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-30 w-64 bg-[#050505] border-r border-white/5">
         <Sidebar />
      </div>

      {/* =========================================
          CONTENIDO PRINCIPAL
         ========================================= */}
      
      {/* Agregamos 'md:pl-64' para dejar espacio al Sidebar Fijo */}
      <main className="flex-1 w-full relative z-10 pt-20 md:pt-0 md:pl-64 transition-all duration-300">
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
           <Outlet />
        </div>
      </main>

    </div>
  );
};

export default MainLayout;