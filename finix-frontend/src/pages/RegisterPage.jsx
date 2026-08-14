import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Phone, User, Sparkles, ShieldCheck, FileText } from 'lucide-react';
import AuthSplitLayout from '../components/layout/AuthSplitLayout';
import VerifyOTP from '../components/auth/VerifyOTP';
import api from '../api/axios';

import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  signOut
} from 'firebase/auth';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'phone'
  
  // States
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptData, setAcceptData] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  // Phone Auth States
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [showOTP, setShowOTP] = useState(false);

  useEffect(() => {
    // Inicializar Recaptcha
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log("Recaptcha resuelto");
        }
      });
    }
  }, []);

  const openDoc = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  const saveUserToDB = async (uid, verifiedEmail = "", verifiedPhone = "") => {
    try {
      await api.post('/registro', {
        uid,
        username,
        email: verifiedEmail,
        telefono: verifiedPhone
      });
      toast.success('¡Perfil creado exitosamente en Finix!');
      navigate('/login');
    } catch (error) {
      toast.error('Error al guardar el perfil en la base de datos.');
    }
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    if (!acceptData || !acceptPrivacy) return toast.error('Debes aceptar los términos.');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      
      await saveUserToDB(userCredential.user.uid, email, "");

      toast.success('Cuenta creada. Revisa tu correo para verificar tu cuenta antes de iniciar sesión.', { duration: 6000 });
      await signOut(auth); // Forzar a que inicien sesión de nuevo tras verificar
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Error al registrar con correo.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneRegister = async (e) => {
    e.preventDefault();
    if (!acceptData || !acceptPrivacy) return toast.error('Debes aceptar los términos.');
    if (!phone.startsWith('+')) return toast.error('El teléfono debe incluir el código de país (Ej: +52...)');
    
    setLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setShowOTP(true);
      toast.success('SMS enviado. Ingresa el código.');
    } catch (error) {
      console.error(error);
      toast.error('Error al enviar SMS. Verifica el número.');
    } finally {
      setLoading(false);
    }
  };

  const onOTPVerified = async (user) => {
    // Si la verificación de SMS es exitosa
    await saveUserToDB(user.uid, "", phone);
  };

  const inputClasses = "w-full bg-[#0a0a0a]/60 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-finix-orange focus:ring-4 focus:ring-finix-orange/10 focus:bg-white/5";

  if (showOTP && confirmationResult) {
    return (
      <AuthSplitLayout title="Verificación" subtitle="Comprueba tu celular" isDarkApp={false} themeGradient="from-finix-orange to-pink-600">
        <VerifyOTP 
          confirmationResult={confirmationResult} 
          onVerified={onOTPVerified} 
          onCancel={() => setShowOTP(false)} 
        />
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      title="Crear Cuenta"
      subtitle="Únete a Finix con validación obligatoria."
      isDarkApp={false} 
      themeGradient="from-finix-orange to-pink-600"
      footerLink={{ text: "¿Ya tienes cuenta?", linkText: "Inicia Sesión", to: "/login" }}
    >
      <div id="recaptcha-container"></div>
      
      <div className="flex gap-2 mb-6 mt-4 relative z-10">
        <button 
          onClick={() => setAuthMethod('email')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${authMethod === 'email' ? 'bg-finix-orange text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
        >
          Por Correo
        </button>
        <button 
          onClick={() => setAuthMethod('phone')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${authMethod === 'phone' ? 'bg-finix-orange text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
        >
          Por Teléfono (SMS)
        </button>
      </div>

      <form onSubmit={authMethod === 'email' ? handleEmailRegister : handlePhoneRegister} className="space-y-4 relative z-10">
        <div className="group relative">
          <User className="absolute left-3 top-3.5 text-finix-orange opacity-70 group-focus-within:opacity-100" size={20} />
          <input type="text" placeholder="Nombre completo" className={inputClasses} value={username} onChange={e => setUsername(e.target.value)} required />
        </div>

        {authMethod === 'email' ? (
          <>
            <div className="group relative">
              <Mail className="absolute left-3 top-3.5 text-finix-orange opacity-70 group-focus-within:opacity-100" size={20} />
              <input type="email" placeholder="tucorreo@ejemplo.com" className={inputClasses} value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="group relative">
              <ShieldCheck className="absolute left-3 top-3.5 text-finix-orange opacity-70 group-focus-within:opacity-100" size={20} />
              <input type="password" placeholder="Crea una contraseña" className={inputClasses} value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </>
        ) : (
          <div className="group relative">
            <Phone className="absolute left-3 top-3.5 text-finix-orange opacity-70 group-focus-within:opacity-100" size={20} />
            <input type="tel" placeholder="+52 55 1234 5678" className={inputClasses} value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>
        )}

        <div className="rounded-xl border border-white/10 bg-black/25 p-4 space-y-3 mt-4">
          <div className="flex items-start gap-3">
            <input id="data-prot" type="checkbox" checked={acceptData} onChange={e => setAcceptData(e.target.checked)} className="mt-1 accent-finix-orange" required />
            <div className="flex-1">
              <label htmlFor="data-prot" className="text-sm text-gray-300 cursor-pointer block"><span className="text-white font-medium">Acepto protección de datos</span></label>
              <button type="button" onClick={() => openDoc('/docs/proteccion-datos.pdf')} className="text-xs text-finix-orange hover:text-orange-400 mt-1 flex items-center gap-1"><FileText size={12}/> Ver documento</button>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <input id="priv-pol" type="checkbox" checked={acceptPrivacy} onChange={e => setAcceptPrivacy(e.target.checked)} className="mt-1 accent-finix-orange" required />
            <div className="flex-1">
              <label htmlFor="priv-pol" className="text-sm text-gray-300 cursor-pointer block"><span className="text-white font-medium">Acepto políticas de privacidad</span></label>
              <button type="button" onClick={() => openDoc('/docs/politica-privacidad.pdf')} className="text-xs text-finix-orange hover:text-orange-400 mt-1 flex items-center gap-1"><FileText size={12}/> Ver documento</button>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full mt-4 py-3.5 rounded-xl font-bold text-white bg-finix-orange hover:bg-orange-500 shadow-lg shadow-orange-500/30 flex justify-center gap-2 disabled:opacity-50">
          {loading ? 'Procesando...' : <><Sparkles size={20}/> Registrarme</>}
        </button>
      </form>
    </AuthSplitLayout>
  );
};

export default RegisterPage;