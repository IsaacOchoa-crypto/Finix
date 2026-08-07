import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Lock, User, Sparkles, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';
import AuthSplitLayout from '../components/layout/AuthSplitLayout';
import api from '../api/axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estados para los datos del formulario
  const [username, setusername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptDataProtection, setAcceptDataProtection] = useState(false);
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false);

  const openDoc = (url) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!acceptDataProtection || !acceptPrivacyPolicy) {
      toast.error('Debes aceptar ambos documentos para continuar', {
        description: 'Revisa la protección de datos y la política de privacidad antes de registrarte.',
        icon: '⚠️'
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden', {
        description: 'Por favor verifica que ambas sean iguales.',
        icon: '⚠️'
      });
      return;
    }

    setLoading(true);

    try {
      await api.post('/registro', {
        username,
        email,
        password
      });

      toast.success('¡Cuenta creada con éxito!', {
        description: 'Ahora puedes iniciar sesión con tus credenciales.',
        icon: '🎉'
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
      console.error('Error registro:', error);
      const mensaje = error.response?.data?.mensaje || 'Error al crear la cuenta.';
      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-[#0a0a0a]/60 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-finix-orange focus:ring-4 focus:ring-finix-orange/10 focus:bg-white/5 group-hover:border-white/20";

  return (
    <AuthSplitLayout
      title="Crear Cuenta"
      subtitle="Únete a Finix y toma el control total."
      isDarkApp={false} 
      themeGradient="from-finix-orange to-pink-600"
      footerLink={{ text: "¿Ya tienes cuenta?", linkText: "Inicia Sesión", to: "/login" }}
    >
      <form onSubmit={handleRegister} className="space-y-5 mt-6 relative z-10">
        
        {/* username */}
        <div className="group relative">
          <User className="absolute left-3 top-3.5 text-finix-orange opacity-70 group-focus-within:opacity-100 transition-opacity" size={20} />
          <input 
            type="text" 
            placeholder="username completo" 
            className={inputClasses} 
            value={username}
            onChange={(e) => setusername(e.target.value)}
            required 
          />
        </div>

        {/* EMAIL */}
        <div className="group relative">
          <Mail className="absolute left-3 top-3.5 text-finix-orange opacity-70 group-focus-within:opacity-100 transition-opacity" size={20} />
          <input 
            type="email" 
            placeholder="tucorreo@ejemplo.com" 
            className={inputClasses} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        
        {/* PASSWORD ORIGINAL */}
        <div className="group relative">
          <Lock className="absolute left-3 top-3.5 text-finix-orange opacity-70 group-focus-within:opacity-100 transition-opacity" size={20} />
          <input 
            type="password" 
            placeholder="Crea una contraseña" 
            className={inputClasses} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        {/* 3. CONFIRMAR PASSWORD (NUEVO CAMPO) */}
        <div className="group relative">
          {/* Usamos un ícono ligeramente diferente o el mismo Lock */}
          <CheckCircle2 className="absolute left-3 top-3.5 text-finix-orange opacity-70 group-focus-within:opacity-100 transition-opacity" size={20} />
          <input 
            type="password" 
            placeholder="Confirma tu contraseña" 
            className={inputClasses} 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-black/25 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <input
              id="accept-data-protection"
              type="checkbox"
              checked={acceptDataProtection}
              onChange={(e) => setAcceptDataProtection(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border border-white/20 bg-transparent text-finix-orange focus:ring-finix-orange/40"
              required
            />
            <label htmlFor="accept-data-protection" className="text-sm leading-relaxed text-gray-300">
              <span className="flex items-center gap-2 font-medium text-white">
                <ShieldCheck size={16} className="text-finix-orange" />
                Acepto la protección de datos personales
              </span>
              <span className="mt-1 block text-gray-400">
                Puedes leer el documento{' '}
                <button type="button" aria-label="ver protección de datos" onClick={() => openDoc((import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/') + 'docs/proteccion-datos.pdf')} className="font-medium text-finix-orange underline underline-offset-2 hover:text-orange-400">
                  aquí
                </button>
                .
              </span>
            </label>
          </div>

          <div className="flex items-start gap-3">
            <input
              id="accept-privacy-policy"
              type="checkbox"
              checked={acceptPrivacyPolicy}
              onChange={(e) => setAcceptPrivacyPolicy(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border border-white/20 bg-transparent text-finix-orange focus:ring-finix-orange/40"
              required
            />
            <label htmlFor="accept-privacy-policy" className="text-sm leading-relaxed text-gray-300">
              <span className="flex items-center gap-2 font-medium text-white">
                <FileText size={16} className="text-finix-orange" />
                Acepto la política de privacidad
              </span>
              <span className="mt-1 block text-gray-400">
                Revisa el documento{' '}
                <button type="button" aria-label="ver política de privacidad" onClick={() => openDoc((import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/') + 'docs/politica-privacidad.pdf')} className="font-medium text-finix-orange underline underline-offset-2 hover:text-orange-400">
                  aquí
                </button>
                .
              </span>
            </label>
          </div>
        </div>

        {/* BOTÓN DE ACCIÓN */}
        <button 
          type="submit" 
          disabled={loading || !acceptDataProtection || !acceptPrivacyPolicy}
          className={`w-full py-3.5 rounded-xl font-bold text-white bg-finix-orange hover:bg-orange-500 shadow-lg shadow-orange-500/30 transition-all duration-500 transform active:scale-95 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}`}
        >
          {loading ? (
            'Creando perfil...'
          ) : (
            <> <Sparkles size={20} /> Registrarme Gratis </>
          )}
        </button>
      </form>
    </AuthSplitLayout>
  );
};

export default RegisterPage;