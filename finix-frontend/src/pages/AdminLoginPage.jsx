import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Lock, ShieldCheck, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import AuthSplitLayout from '../components/layout/AuthSplitLayout';
import api from '../api/axios'; // Importamos tu instancia de axios
import { useAuth } from '../context/AuthContext'; // Importamos el contexto

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { loginAction } = useAuth(); // Obtenemos la función para actualizar el estado
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorShake, setErrorShake] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorShake(false);

    try {
      // 1. Petición al backend (usando la lógica del back antiguo)
      const respuesta = await api.post('/inicioSesion', {
        email, 
        password
      });

      // 2. VALIDACIÓN DE ROL (Lógica del back antiguo)
      // Verificamos si el rol devuelto es administrador
      const userRol = respuesta.data.rol?.toLowerCase();
      if (userRol !== 'admin' && userRol !== 'administrador') {
         toast.error("ACCESO DENEGADO", { 
           description: "No tienes privilegios de administrador.",
           icon: <AlertCircle className="text-red-500" />
         });
         setLoading(false);
         setErrorShake(true);
         setTimeout(() => setErrorShake(false), 400);
         return;
      }

      // 3. ÉXITO
      // Actualizamos el estado global antes de redirigir
      loginAction(respuesta.data.usuario, respuesta.data.rol);
      
      toast.success('Acceso Admin concedido', { icon: '🛡️' });
      
      // Pequeño delay para feedback visual
      setTimeout(() => {
        navigate('/admin');
      }, 1500);

    } catch (error) {
      console.error("Error Admin Login:", error);
      const mensaje = error.response?.data?.mensaje || "Error de autenticación";
      
      setErrorShake(true);
      toast.error(mensaje, { description: 'El intento de acceso ha sido registrado.' });
      setLoading(false);
      
      // Quitamos el temblor después de la animación
      setTimeout(() => setErrorShake(false), 400);
    }
  };

  const inputClasses = "w-full bg-[#0a0a0a]/60 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-red-600 focus:ring-4 focus:ring-red-600/10 focus:bg-white/5 group-hover:border-red-900/30";

  return (
    <AuthSplitLayout
      title="Acceso Administrativo"
      subtitle="Portal de gestión y seguridad del sistema Finix."
      isDarkApp={true} 
      themeGradient="from-red-700 to-black"
      footerLink={null} 
    >
      
      <form onSubmit={handleLogin} className={`space-y-5 mt-6 relative z-10 ${errorShake ? 'animate-shake' : ''}`}>
        
        {/* Etiqueta de Seguridad */}
        <div className="flex justify-center mb-4">
           <span className="flex items-center gap-2 text-[10px] font-bold border border-red-500/30 text-red-400 px-3 py-1 rounded-full bg-red-950/40 tracking-widest shadow-[0_0_10px_rgba(220,38,38,0.2)]">
              <ShieldCheck size={12} /> SECURE AREA
           </span>
        </div>
        
        {/* EMAIL CORPORATIVO */}
        <div className="group relative">
          <Mail className="absolute left-3 top-3.5 text-red-500 opacity-70 group-focus-within:opacity-100 transition-opacity" size={20} />
          <input 
            type="email" 
            placeholder="admin@finix.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses}
            autoComplete="off"
            required
          />
        </div>

        {/* PASSWORD / LLAVE */}
        <div className="group relative">
          <Lock className="absolute left-3 top-3.5 text-red-500 opacity-70 group-focus-within:opacity-100 transition-opacity" size={20} />
          <input 
            type="password" 
            placeholder="Llave de seguridad"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClasses}
            required
          />
        </div>

        {/* BOTÓN DE ACCIÓN */}
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3.5 rounded-xl font-bold text-white bg-red-700 hover:bg-red-600 shadow-lg shadow-red-900/40 transition-all duration-500 transform active:scale-95 flex items-center justify-center gap-2 border border-red-500/20 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}`}
        >
          {loading ? (
            <> <Loader2 className="animate-spin" size={20} /> Verificando núcleo... </>
          ) : (
             <> Entrar al Sistema <ArrowRight size={20} /> </>
          )}
        </button>
        
        {/* Footer de Seguridad */}
        <div className="text-center pt-2 flex justify-center items-center gap-2 opacity-50">
            <AlertCircle size={12} className="text-red-500" />
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">Acceso monitoreado • IP Registrada</p>
        </div>

      </form>
    </AuthSplitLayout>
  );
};

export default AdminLoginPage;