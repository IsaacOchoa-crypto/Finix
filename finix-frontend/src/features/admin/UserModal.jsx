import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Shield, ShieldCheck } from 'lucide-react';

const UserModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('User');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setRole(initialData.role);
      setStatus(initialData.status);
    } else {
      setName('');
      setEmail('');
      setRole('User');
      setStatus('Active');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || Date.now(),
      name,
      email,
      role,
      status,
      plan: initialData?.plan || 'Free', // Default
      date: initialData?.date || new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  // Estilos Red Admin
  const inputStyle = "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition pl-10";
  const labelStyle = "block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.1)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {initialData ? <ShieldCheck className="text-red-500"/> : <User className="text-red-500"/>}
            {initialData ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={labelStyle}>Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-gray-500" size={18} />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} placeholder="Ej. Juan Pérez" required />
            </div>
          </div>

          <div>
            <label className={labelStyle}>Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyle} placeholder="juan@ejemplo.com" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Rol</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50">
                <option value="User">Usuario</option>
                <option value="Admin">Administrador</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Estado</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50">
                <option value="Active">Activo</option>
                <option value="Inactive">Inactivo</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full py-3.5 mt-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2">
            <Save size={20} /> Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserModal;