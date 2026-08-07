import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Target, Car, Plane, Home, Smartphone, Gamepad2, Gift, Briefcase, GraduationCap, Heart, Music, ShoppingBag } from 'lucide-react';

// 1. DICCIONARIO DE ÍCONOS DISPONIBLES
// Mapeamos el nombre (string) al componente (React Element)
const ICON_MAP = {
  'Target': Target,
  'Car': Car,
  'Plane': Plane,
  'Home': Home,
  'Smartphone': Smartphone,
  'Gamepad': Gamepad2,
  'Gift': Gift,
  'Work': Briefcase,
  'School': GraduationCap,
  'Health': Heart,
  'Music': Music,
  'Shop': ShoppingBag
};

const GoalModal = ({ isOpen, onClose, onSave, initialData }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    current: '',
    iconName: 'Target', // Ícono por defecto
    color: 'bg-indigo-500'
  });

  // Estado para mostrar/ocultar el selector de íconos
  const [showIconSelector, setShowIconSelector] = useState(false);
  
  // Referencia para cerrar el selector si clicamos fuera (opcional, mejora UX)
  const selectorRef = useRef(null);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name,
        target: initialData.target,
        current: initialData.current,
        iconName: initialData.iconName || 'Target',
        color: initialData.color || 'bg-indigo-500'
      });
    } else {
      // Resetear si es nuevo
      setFormData({ name: '', target: '', current: '', iconName: 'Target', color: 'bg-indigo-500' });
    }
    setShowIconSelector(false);
  }, [initialData, isOpen]);

  // Cerrar selector al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setShowIconSelector(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // Componente del ícono actual
  const CurrentIcon = ICON_MAP[formData.iconName] || Target;

  const colors = [
    { bg: 'bg-indigo-500', glow: 'text-indigo-500' },
    { bg: 'bg-blue-500', glow: 'text-blue-500' },
    { bg: 'bg-green-500', glow: 'text-green-500' },
    { bg: 'bg-purple-500', glow: 'text-purple-500' },
    { bg: 'bg-finix-orange', glow: 'text-finix-orange' },
    { bg: 'bg-pink-500', glow: 'text-pink-500' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Encontramos el objeto de color completo para enviarlo
    const selectedColorObj = colors.find(c => c.bg === formData.color) || colors[0];
    
    onSave({
      ...formData,
      glow: selectedColorObj.glow // Añadimos el glow correspondiente
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0f172a] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">{initialData ? 'Editar Meta' : 'Nueva Meta'}</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition"><X className="text-gray-400 hover:text-white" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* --- CAMPO DE NOMBRE CON SELECTOR DE ÍCONO --- */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nombre de la meta</label>
            <div className="flex items-center gap-3" ref={selectorRef}>
              
              {/* BOTÓN DEL ÍCONO (TRIGGER) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowIconSelector(!showIconSelector)}
                  className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-finix-orange hover:bg-white/10 hover:border-finix-orange/50 transition-all shadow-lg"
                  title="Cambiar ícono"
                >
                  <CurrentIcon size={24} />
                  {/* Pequeño indicador de edición */}
                  <div className="absolute -bottom-1 -right-1 bg-gray-800 rounded-full p-0.5 border border-gray-600">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </button>

                {/* MENÚ FLOTANTE DE ÍCONOS */}
                {showIconSelector && (
                  <div className="absolute top-14 left-0 z-50 bg-[#1e293b] border border-white/10 rounded-xl p-3 shadow-2xl w-64 grid grid-cols-4 gap-2 animate-in zoom-in-95 duration-200">
                    {Object.keys(ICON_MAP).map((iconKey) => {
                      const IconComp = ICON_MAP[iconKey];
                      return (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, iconName: iconKey });
                            setShowIconSelector(false);
                          }}
                          className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                            formData.iconName === iconKey 
                              ? 'bg-finix-orange text-black shadow-lg scale-110' 
                              : 'text-gray-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <IconComp size={20} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* INPUT DE NOMBRE */}
              <input 
                type="text" 
                placeholder="Ej: Comprar Coche"
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="flex-1 bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-finix-orange outline-none h-12"
                required
              />
            </div>
          </div>

          {/* Montos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Meta Total ($)</label>
              <input 
                type="number" 
                placeholder="0.00"
                value={formData.target} 
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white mt-1 focus:border-finix-orange outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Ahorrado ($)</label>
              <input 
                type="number" 
                placeholder="0.00"
                value={formData.current} 
                onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white mt-1 focus:border-finix-orange outline-none"
              />
            </div>
          </div>

          {/* Selección de Color */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Color de la barra</label>
            <div className="flex gap-3 mt-2 overflow-x-auto pb-2">
              {colors.map((c) => (
                <button 
                  key={c.bg}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: c.bg })}
                  className={`w-10 h-10 rounded-full ${c.bg} border-2 transition-all flex items-center justify-center shrink-0 ${formData.color === c.bg ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  {formData.color === c.bg && <Check size={16} className="text-white drop-shadow-md" />}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-finix-orange to-orange-600 text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(255,107,0,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Target size={20} /> {initialData ? 'Guardar Cambios' : 'Crear Meta'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;