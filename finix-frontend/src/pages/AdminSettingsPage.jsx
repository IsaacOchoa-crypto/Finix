import React from 'react';
import { toast } from 'sonner';
import { Save, Lock, Globe, Server, Shield } from 'lucide-react';

const AdminSettingsPage = () => {
  
  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Configuración guardada', { description: 'Los cambios del sistema se han aplicado.' });
  };

  const inputStyle = "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition";
  const sectionStyle = "bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 p-8 rounded-2xl mb-8";

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white drop-shadow-md">Configuración del Sistema</h1>
        <p className="text-gray-400">Ajustes globales de la plataforma Finix</p>
      </header>

      <form onSubmit={handleSave} className="max-w-4xl">
        
        {/* GENERAL */}
        <div className={sectionStyle}>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Globe className="text-red-500"/> General</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Nombre de la App</label>
              <input type="text" defaultValue="Finix Platform" className={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Email de Soporte</label>
              <input type="email" defaultValue="support@finix.app" className={inputStyle} />
            </div>
          </div>
        </div>

        {/* SEGURIDAD */}
        <div className={sectionStyle}>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Shield className="text-red-500"/> Seguridad & Acceso</h3>
          
          <div className="flex items-center justify-between py-4 border-b border-white/5">
            <div>
              <p className="font-medium text-white">Modo Mantenimiento</p>
              <p className="text-sm text-gray-500">Desactiva el acceso a usuarios no administradores.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-white">Registro de Usuarios Nuevos</p>
              <p className="text-sm text-gray-500">Permitir que cualquiera se cree una cuenta.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>

        {/* API KEYS */}
        <div className={sectionStyle}>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Server className="text-red-500"/> API Keys (Stripe)</h3>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Stripe Public Key</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-500" size={16}/>
              <input type="password" value="pk_live_51Mz..." readOnly className={`${inputStyle} text-gray-400 bg-black/60`} />
            </div>
          </div>
        </div>

        <div className="flex justify-end pb-12">
          <button type="submit" className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition shadow-lg flex items-center gap-2">
            <Save size={20}/> Guardar Cambios
          </button>
        </div>

      </form>
    </>
  );
};

export default AdminSettingsPage;