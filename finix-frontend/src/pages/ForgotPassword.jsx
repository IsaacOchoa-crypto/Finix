import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import AuthSplitLayout from '../components/layout/AuthSplitLayout';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSubmitted(true);
      toast.success('Correo enviado', {
        description: 'Revisa tu bandeja de entrada para restablecer tu contraseña.'
      });
    } catch (error) {
      console.error('Error enviando correo de restablecimiento:', error);
      toast.error('Error al enviar el correo. Verifica que esté bien escrito o que tengas conexión.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-[#0a0a0a]/60 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-finix-orange focus:ring-4 focus:ring-finix-orange/10 focus:bg-white/5";

  return (
    <AuthSplitLayout
      title="Recuperar Contraseña"
      subtitle="Te enviaremos un enlace seguro para que puedas crear una nueva contraseña."
      isDarkApp={false}
      themeGradient="from-finix-orange to-pink-600"
      footerLink={{ text: "¿Recordaste tu contraseña?", linkText: "Inicia Sesión", to: "/login" }}
    >
      {!submitted ? (
        <form onSubmit={handleResetPassword} className="space-y-5 mt-6 relative z-10">
          <div className="group relative">
            <Mail className="absolute left-3 top-3.5 text-finix-orange opacity-70 group-focus-within:opacity-100 transition-opacity" size={20} />
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              className={inputClasses} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-bold text-white bg-finix-orange hover:bg-orange-500 shadow-lg shadow-orange-500/30 transition-all duration-500 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}`}
          >
            {loading ? 'Enviando...' : <> Enviar Enlace <ArrowRight size={20} /> </>}
          </button>

          <button 
            type="button"
            onClick={() => navigate('/login')}
            className="w-full mt-4 py-3.5 text-sm text-gray-400 hover:text-white transition flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> Volver a Inicio de Sesión
          </button>
        </form>
      ) : (
        <div className="mt-8 text-center space-y-6">
          <div className="w-16 h-16 bg-finix-orange/20 rounded-full flex items-center justify-center mx-auto">
            <Mail className="text-finix-orange" size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">¡Revisa tu correo!</h3>
            <p className="text-gray-400 leading-relaxed">
              Hemos enviado un enlace de recuperación a<br/>
              <span className="text-white font-medium">{email}</span>
            </p>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-3.5 rounded-xl font-bold text-finix-orange border border-finix-orange/30 hover:bg-finix-orange/10 transition-all"
          >
            Volver a Inicio de Sesión
          </button>
        </div>
      )}
    </AuthSplitLayout>
  );
};

export default ForgotPassword;
