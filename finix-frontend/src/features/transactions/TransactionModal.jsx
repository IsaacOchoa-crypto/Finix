import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import api from '../../api/axios';

// 1. DEFINIMOS LAS OPCIONES DE INGRESO (Estáticas)
// Como los tipos de ingreso suelen ser estándar, los definimos aquí.
const CATEGORIAS_INGRESO = [
  { nombre: 'Nómina / Salario' },
  { nombre: 'Freelance / Servicios' },
  { nombre: 'Ventas' },
  { nombre: 'Inversiones / Rendimientos' },
  { nombre: 'Regalo / Donación' },
  { nombre: 'Reembolso' },
  { nombre: 'Otros Ingresos' }
];

const TransactionModal = ({ isOpen, onClose, onSave }) => {
  const [type, setType] = useState('gasto'); // 'gasto' | 'ingreso'
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [expenseCategories, setExpenseCategories] = useState([]); // Categorías de la BD (Gastos)
  const [loadingCats, setLoadingCats] = useState(false);

  // Cargar categorías de GASTOS al abrir
  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        setLoadingCats(true);
        try {
          const { data } = await api.get('/categorias');
          if (data.estado && data.datos) {
            setExpenseCategories(data.datos);
          }
        } catch (error) {
          console.error("Error cargando categorías");
        } finally {
          setLoadingCats(false);
        }
      };
      
      // Solo cargamos si no las tenemos ya, o forzamos recarga siempre que se abre
      fetchCategories();
      
      // Resetear form
      setAmount('');
      setCategory('');
      setType('gasto'); // Por defecto siempre abre en gasto
    }
  }, [isOpen]);

  // 2. LÓGICA PARA ELEGIR QUÉ LISTA MOSTRAR
  // Si es ingreso -> Usamos la constante. Si es gasto -> Usamos la API.
  const currentCategories = type === 'ingreso' ? CATEGORIAS_INGRESO : expenseCategories;

  // Resetear la categoría seleccionada cuando cambiamos entre Gasto/Ingreso
  // para evitar que se quede seleccionada "Gasolina" cuando estás en Ingresos.
  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(''); // Limpiamos la selección
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;

    onSave({
      amount,
      type, 
      category, 
      date
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">Nuevo Movimiento</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Toggle Tipo */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
            <button 
                type="button"
                onClick={() => handleTypeChange('gasto')}
                className={`py-2 rounded-lg font-bold text-sm transition-all ${type === 'gasto' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-400 hover:text-white'}`}
            >
                Gasto
            </button>
            <button 
                type="button"
                onClick={() => handleTypeChange('ingreso')}
                className={`py-2 rounded-lg font-bold text-sm transition-all ${type === 'ingreso' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'text-gray-400 hover:text-white'}`}
            >
                Ingreso
            </button>
          </div>

          {/* Monto */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Monto</label>
            <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400 text-lg">$</span>
                <input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white text-lg focus:border-finix-orange focus:ring-1 focus:ring-finix-orange outline-none transition"
                    autoFocus
                    required
                />
            </div>
          </div>

          {/* Categoría (Select Dinámico según Tipo) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                {type === 'ingreso' ? 'Fuente de Ingreso' : 'Categoría de Gasto'}
            </label>
            <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-finix-orange outline-none appearance-none cursor-pointer"
                required
            >
                <option value="" disabled>Seleccionar opción...</option>
                
                {/* 3. RENDERIZADO CONDICIONAL DE OPCIONES */}
                {loadingCats && type === 'gasto' ? (
                    <option>Cargando categorías...</option>
                ) : (
                    currentCategories.map((cat, i) => (
                        <option key={i} value={cat.nombre}>{cat.nombre}</option>
                    ))
                )}

            </select>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Fecha</label>
            <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-500" size={18} />
                <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-finix-orange outline-none [color-scheme:dark]"
                />
            </div>
          </div>

          {/* Botón Guardar - Cambia de color según el tipo */}
          <button 
            type="submit" 
            className={`w-full font-bold py-3.5 rounded-xl transition shadow-lg active:scale-95 ${
                type === 'ingreso' 
                ? 'bg-green-500 hover:bg-green-400 text-white shadow-green-500/20' 
                : 'bg-finix-orange hover:bg-orange-400 text-black shadow-orange-500/20'
            }`}
          >
            {type === 'ingreso' ? 'Registrar Ingreso' : 'Registrar Gasto'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default TransactionModal;