import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Menu, X, ShieldCheck, Loader2 } from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { toast } from 'sonner';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const { user, role, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si el contexto sigue cargando, esperamos
    if (loading) return;

    const verificarAccesoAdmin = async () => {
      try {
        // Validación 1: ¿El estado global dice que somos admin?
        if (!isAuthenticated) {
          toast.error("Acceso denegado", { description: "Debes iniciar sesión primero" });
          navigate('/admin-login');
          return;
        }

        if (role?.toLowerCase() !== 'admin' && role?.toLowerCase() !== 'administrador') {
          // Si es un cliente intentando entrar al admin, lo regresamos a su dashboard
          toast.error("Área Restringida", { description: "Los clientes no pueden acceder al panel administrativo" });
          navigate('/dashboard');
          return;
        }

        // Validación 2: ¿El backend confirma que nuestro token es de admin válido?
        await api.get('/administradores');
        
        // Todo en orden
        setIsVerifying(false);
      } catch (error) {
        toast.error("Sesión expirada o inválida", { description: "Por favor vuelve a iniciar sesión" });
        navigate('/admin-login');
      }
    };

    verificarAccesoAdmin();
  }, [loading, isAuthenticated, role, navigate]);

  if (loading || isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020202] text-white">
        <Loader2 className="animate-spin text-red-500 mb-4" size={40} />
        <p className="text-gray-400">Verificando credenciales de seguridad...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#020202] font-sans selection:bg-red-500/30">
      
      {/* Fondo Rojo Sutil para Admin */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* --- 1. BOTÓN HAMBURGUESA (SOLO MÓVIL) --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between shadow-lg shadow-red-900/10">
        <div className="flex items-center gap-2">
           {/* Icono de Escudo para diferenciar Admin */}
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center border border-white/10">
              <ShieldCheck size={16} className="text-white" />
           </div>
           <span className="font-bold text-white tracking-tight">Finix Admin</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg border border-white/10 hover:bg-red-500/10 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* --- 2. SIDEBAR (RESPONSIVO) --- */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#050505] border-r border-white/5 transform transition-transform duration-300 ease-in-out shadow-2xl
        md:translate-x-0 md:static md:inset-auto md:flex md:flex-col md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Pasamos la función para cerrar */}
        <AdminSidebar onClose={() => setIsMobileMenuOpen(false)} />
        
        {/* Botón Cerrar (Solo móvil) */}
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg"
        >
          <X size={18} />
        </button>
      </div>

      {/* --- 3. OVERLAY (FONDO NEGRO) --- */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
        ></div>
      )}

      {/* --- 4. CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 w-full relative z-10 pt-20 md:pt-0 overflow-x-hidden">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
           <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;