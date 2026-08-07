import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const LimitModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [limit, setLimit] = useState('');
  const [color, setColor] = useState('bg-blue-500');

  useEffect(() => {
    if (initialData) {
      setLimit(initialData.limit);
      setColor(initialData.color || 'bg-blue-500');
    }
  }, [initialData]);

  if (!isOpen) return null;

  const colors = [
    { bg: 'bg-green-500', name: 'Verde' },
    { bg: 'bg-blue-500', name: 'Azul' },
    { bg: 'bg-red-500', name: 'Rojo' },
    { bg: 'bg-yellow-500', name: 'Amarillo' },
    { bg: 'bg-purple-500', name: 'Morado' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0f172a] border border-white/10 w-full max-w-sm rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Editar Límite: {initialData?.category}</h3>
          <button onClick={onClose}><X className="text-gray-400 hover:text-white" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Límite Mensual ($)</label>
            <input 
              type="number" 
              value={limit} 
              onChange={(e) => setLimit(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white mt-1 focus:border-finix-orange outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Color de alerta</label>
            <div className="flex gap-2 mt-2">
              {colors.map((c) => (
                <button 
                  key={c.bg}
                  onClick={() => setColor(c.bg)}
                  className={`w-8 h-8 rounded-full ${c.bg} border-2 transition ${color === c.bg ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>

          <button 
            onClick={() => onSave({ ...initialData, limit, color })}
            className="w-full bg-finix-orange text-black font-bold py-3 rounded-xl mt-4 hover:bg-orange-500 transition"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default LimitModal;