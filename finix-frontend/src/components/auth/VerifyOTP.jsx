import React, { useState } from 'react';
import { toast } from 'sonner';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const VerifyOTP = ({ confirmationResult, onVerified, onCancel }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error('El código debe tener 6 dígitos');
      return;
    }
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(code);
      const user = result.user;
      toast.success('¡Teléfono verificado exitosamente!');
      onVerified(user);
    } catch (error) {
      console.error('Error verificando OTP:', error);
      toast.error('Código incorrecto o expirado.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-[#0a0a0a]/60 border border-white/10 rounded-xl px-4 py-3.5 text-center text-2xl tracking-widest text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-finix-orange focus:ring-4 focus:ring-finix-orange/10 focus:bg-white/5";

  return (
    <div className="space-y-5 mt-6 relative z-10">
      <div className="text-center mb-6">
        <ShieldCheck className="mx-auto text-finix-orange mb-3" size={40} />
        <h3 className="text-xl font-bold text-white">Verifica tu teléfono</h3>
        <p className="text-gray-400 mt-2 text-sm">Ingresa el código de 6 dígitos que enviamos por SMS a tu número.</p>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <input 
          type="text" 
          maxLength="6"
          placeholder="000000" 
          className={inputClasses} 
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          required 
        />

        <button 
          type="submit" 
          disabled={loading || code.length !== 6}
          className={`w-full py-3.5 rounded-xl font-bold text-white bg-finix-orange hover:bg-orange-500 shadow-lg shadow-orange-500/30 transition-all duration-500 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}`}
        >
          {loading ? 'Verificando...' : <> Confirmar <ArrowRight size={20} /> </>}
        </button>
        
        <button 
          type="button" 
          onClick={onCancel}
          className="w-full py-2 text-sm text-gray-400 hover:text-white transition"
        >
          Cancelar / Cambiar número
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;
