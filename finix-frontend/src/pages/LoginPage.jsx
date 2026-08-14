import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User, Lock, ArrowRight } from 'lucide-react'; 
import AuthSplitLayout from '../components/layout/AuthSplitLayout';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');

  const { loginAction } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Iniciar sesión con Firebase usando Email y Contraseña
      const userCredential = await signInWithEmailAndPassword(auth, identifier, password);
      
      // 2. Si es exitoso, obtener el UID de Firebase y enviarlo a nuestro backend
      const firebase_uid = userCredential.user.uid;

      const respuesta = await api.post('/inicioSesion', {
        firebase_uid
      });

      const userRol = respuesta.data.usuario?.tipoUsuario?.toLowerCase() || respuesta.data.rol?.toLowerCase();
      
      // Guardamos en el contexto
      loginAction(respuesta.data.usuario, respuesta.data.rol);

      toast.success('¡Bienvenido de nuevo!', { icon: '👋' });
      
      setTimeout(() => {
        if (userRol === 'admin' || userRol === 'administrador') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 1000);

    } catch (error) {
      console.error("Error login:", error);
      let mensaje = "Credenciales incorrectas";
      
      // Manejar errores de Firebase
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        mensaje = "El correo o la contraseña son incorrectos.";
      } else if (error.code === 'auth/invalid-email') {
        mensaje = "El correo electrónico no es válido.";
      } else if (error.response?.data?.mensaje) {
        mensaje = error.response.data.mensaje; // Mensaje de nuestro backend
      }

      toast.error(mensaje);
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-[#0a0a0a]/60 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-finix-orange focus:ring-4 focus:ring-finix-orange/10 focus:bg-white/5";

  return (
    <AuthSplitLayout
      title="Bienvenido de nuevo"
      subtitle="Ingresa a tu cuenta para gestionar tus finanzas."
      isDarkApp={false} 
      themeGradient="from-finix-orange to-pink-600"
      footerLink={{ text: "¿No tienes cuenta?", linkText: "Regístrate gratis", to: "/register" }}
    >
      <form onSubmit={handleLogin} className="space-y-5 mt-6 relative z-10">
        
        {/* Campo de Usuario o Email */}
        <div className="group relative">
          {/* Usamos el icono User para denotar ambas opciones */}
          <User className="absolute left-3 top-3.5 text-finix-orange opacity-70 group-focus-within:opacity-100 transition-opacity" size={20} />
          <input 
            type="text" // IMPORTANTE: tipo texto para aceptar usernames sin @
            placeholder="Usuario o Correo Electrónico"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className={inputClasses}
            autoComplete="username"
            required
          />
        </div>

        {/* Campo de Password */}
        <div className="group relative">
          <Lock className="absolute left-3 top-3.5 text-finix-orange opacity-70 group-focus-within:opacity-100 transition-opacity" size={20} />
          <input 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClasses}
            required
          />
        </div>

        <div className="flex justify-end">
          <button type="button" className="text-sm text-gray-400 hover:text-white transition">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3.5 rounded-xl font-bold text-white bg-finix-orange hover:bg-orange-500 shadow-lg shadow-orange-500/30 transition-all duration-500 transform active:scale-95 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}`}
        >
          {loading ? 'Validando...' : <> Ingresar <ArrowRight size={20} /> </>}
        </button>
      </form>
    </AuthSplitLayout>
  );
};

export default LoginPage; 