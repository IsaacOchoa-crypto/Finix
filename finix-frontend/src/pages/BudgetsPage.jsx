import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, Target, Car, Plane, Home, Pencil, Trash2, TrendingUp, Loader2, AlertTriangle, Smartphone, Gamepad2, Gift, Briefcase, GraduationCap, Heart, Music, ShoppingBag } from 'lucide-react';
import GoalModal from '../features/budget/GoalModal';
import LimitModal from '../features/budget/LimitModal';
import api from '../api/axios';

// Importamos los componentes mágicos
import { MagicGrid, MagicCard } from '../components/ui/MagicCard';

const BudgetsPage = () => {
  const [loadingData, setLoadingData] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [goals, setGoals] = useState([]);
  const [limits, setLimits] = useState([]);
  
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [editingLimit, setEditingLimit] = useState(null);

  const iconMap = {
    'Target': Target, 'Car': Car, 'Plane': Plane, 'Home': Home, 'Smartphone': Smartphone,
    'Gamepad': Gamepad2, 'Gift': Gift, 'Work': Briefcase, 'School': GraduationCap,
    'Health': Heart, 'Music': Music, 'Shop': ShoppingBag
  };

  const fetchData = useCallback(async () => {
    try {
      const { data } = await api.get('/presupuesto');
      if (data.estado) {
        setGoals(data.metas.map(g => ({ ...g, icon: iconMap[g.iconName] || Target })));
        setLimits(data.limites);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
      toast.error("Error de conexión al cargar presupuestos");
    } finally {
      setLoadingData(false);
      setTimeout(() => setLoaded(true), 100);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- GUARDAR METAS ---
  const handleSaveGoal = async (goalData) => {
    const payload = { ...goalData, target: Number(goalData.target), current: Number(goalData.current), iconName: goalData.iconName || 'Target' };
    try {
        if (editingGoal) { 
            await api.put(`/meta/${editingGoal.id}`, payload); 
        } else { 
            await api.post('/meta', payload); 
        }
        setIsGoalModalOpen(false); 
        fetchData(); 
        toast.success(editingGoal ? 'Meta actualizada' : 'Meta creada');
    } catch (e) { 
        toast.error("Error al guardar la meta"); 
    }
  };

  // --- ELIMINAR METAS ---
  const handleDeleteGoal = async (id, e) => {
      e.stopPropagation();
      if (!window.confirm("¿Estás seguro de eliminar esta meta?")) return;
      try { 
          await api.delete(`/meta/${id}`); 
          setGoals(prev => prev.filter(g => g.id !== id)); 
          toast.success('Meta eliminada'); 
      } catch (e) {
          toast.error('Error al eliminar');
      }
  };
  
  // --- GUARDAR LÍMITES ---
  const handleEditLimit = (item) => { 
      setEditingLimit(item); 
      setIsLimitModalOpen(true); 
  };

  const handleSaveLimit = async (limitData) => { 
      try { 
          // Si el límite ya tiene un ID, usamos PUT para actualizar. Si no, POST para crear.
          if (editingLimit && editingLimit.id) {
              await api.put(`/limite/${editingLimit.id}`, limitData);
          } else {
              await api.post('/limite', limitData); 
          }
          setIsLimitModalOpen(false); 
          fetchData(); 
          toast.success('Límite actualizado correctamente'); 
      } catch(e) {
          console.error("Error guardando límite:", e);
          toast.error('Error al actualizar el límite');
      } 
  };

  if (loadingData) return <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin text-finix-orange" size={40}/></div>;

  return (
    <div className="space-y-8 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-white drop-shadow-md">Planificación</h1>
          <p className="text-gray-400">Controla tus gastos reales vs tus metas.</p>
        </div>
        <button onClick={() => { setEditingGoal(null); setIsGoalModalOpen(true); }} className="flex items-center gap-2 px-5 py-3 bg-finix-orange text-black font-bold rounded-xl hover:bg-orange-600 transition shadow-lg shadow-orange-500/20 active:scale-95">
          <Plus size={20} /> Nueva Meta
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* === SECCIÓN LÍMITES (Izquierda) === */}
        <div className="space-y-6">
          <MagicCard className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 relative z-10">
              <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400"><TrendingUp size={24} /></div>
              <div>
                <h3 className="text-xl font-bold text-white">Límites Mensuales</h3>
                <p className="text-xs text-gray-500">Basado en tus transacciones reales</p>
              </div>
            </div>
            
            <div className="space-y-4 relative z-10 flex-1">
               {limits.length === 0 ? (
                 <p className="text-center text-gray-500 py-10">Sin límites configurados.</p>
               ) : (
                 limits.map((item, idx) => {
                  const percentage = item.limit > 0 ? (item.spent / item.limit) * 100 : 0;
                  const isOverLimit = item.spent > item.limit && item.limit > 0;
                  
                  return (
                    <div key={idx} className="group/item p-3 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5 space-y-3">
                       <div className="flex justify-between items-center">
                          <span className="font-medium text-white flex items-center gap-2">
                             {item.category} 
                             {isOverLimit && <AlertTriangle size={15} className="text-red-500 animate-pulse" title="Límite excedido"/>}
                          </span>
                          
                          <div className="flex items-center gap-4">
                             <div className="text-right text-sm">
                                <span className="text-gray-400 font-medium">${item.spent.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                                <span className="text-gray-600 mx-1.5">/</span>
                                <span className="text-white font-bold">${Number(item.limit).toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                             </div>
                             
                             {/* Botón de edición siempre visible */}
                             <button 
                                onClick={() => handleEditLimit(item)} 
                                className="p-2 bg-gray-800/80 text-gray-400 rounded-lg hover:text-finix-orange hover:bg-finix-orange/10 transition-all border border-white/5 shadow-sm active:scale-95"
                                title={`Editar límite de ${item.category}`}
                             >
                                <Pencil size={14}/>
                             </button>
                          </div>
                       </div>
                       
                       <div className="h-3 w-full bg-gray-900 rounded-full overflow-hidden border border-white/5">
                          <div 
                              className={`h-full rounded-full ${isOverLimit ? 'bg-red-600' : (item.color || 'bg-finix-orange')} shadow-[0_0_10px_currentColor] transition-all duration-[1500ms] ease-out`} 
                              style={{ width: loaded ? `${Math.min(percentage, 100)}%` : '0%' }}
                          ></div>
                       </div>
                    </div>
                  )
               })
               )}
            </div>
          </MagicCard>
        </div>

        {/* === SECCIÓN METAS DE AHORRO (Derecha) === */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="text-finix-orange"/> Mis Metas
            </h3>
          </div>

          {goals.length === 0 ? (
            <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/5">
              <p className="text-gray-400 mb-2">No tienes metas de ahorro.</p>
              <button onClick={() => { setEditingGoal(null); setIsGoalModalOpen(true); }} className="text-finix-orange font-bold hover:underline">Crear primera meta</button>
            </div>
          ) : (
            <MagicGrid className="grid-cols-1">
              {goals.map((goal) => {
                const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                const IconComponent = goal.icon || Target;

                return (
                  <MagicCard 
                    key={goal.id} 
                    className="p-5 flex items-center gap-6 relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform"
                    onClick={() => { setEditingGoal(goal); setIsGoalModalOpen(true); }}
                  >
                    
                    {/* FONDO DE ÍCONO */}
                    <div className="absolute -right-10 -top-10 z-0 pointer-events-none opacity-[0.03] group-hover:opacity-10 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                        <IconComponent className="text-white w-64 h-64" strokeWidth={1} />
                    </div>

                    {/* LADO IZQUIERDO: Ícono + Textos */}
                    <div className="relative z-10 flex items-center gap-5 flex-1">
                        <div className={`w-14 h-14 rounded-2xl ${goal.color.replace('bg-', 'bg-opacity-20 bg-')} flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.3)] shrink-0`}>
                            <IconComponent className="text-white" size={28} />
                        </div>
                        
                        <div className="flex-1">
                            <h4 className="text-lg font-bold text-white group-hover:text-finix-orange transition-colors">{goal.name}</h4>
                            <div className="flex gap-4 text-xs mt-1 items-center">
                                <span className="text-gray-400">Meta: <span className="text-white font-medium">${goal.target.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span></span>
                                <button onClick={(e) => handleDeleteGoal(goal.id, e)} className="text-red-400/50 hover:text-red-400 transition flex items-center gap-1">
                                    <Trash2 size={12} /> Eliminar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* LADO DERECHO: Progreso */}
                    <div className="relative z-10 w-1/3 min-w-[130px] flex flex-col items-end justify-center pl-4 border-l border-white/5">
                        <span className="text-2xl font-bold text-white tracking-tight">${goal.current.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                        
                        <div className="h-2 w-full bg-gray-900/80 rounded-full overflow-hidden border border-white/10 mt-2 relative">
                            <div 
                              className={`h-full ${goal.color} shadow-[0_0_10px_currentColor] transition-all duration-[1500ms] ease-out`}
                              style={{ width: loaded ? `${progress}%` : '0%' }}
                            />
                        </div>
                        <div className="flex justify-between w-full mt-1">
                            <span className="text-[10px] text-finix-orange font-bold uppercase tracking-wider">Ahorrado</span>
                            <span className="text-[10px] text-gray-400 font-bold">{progress.toFixed(0)}%</span>
                        </div>
                    </div>
                  </MagicCard>
                );
              })}
            </MagicGrid>
          )}
        </div>
      </div>

      <GoalModal 
        isOpen={isGoalModalOpen} 
        onClose={() => { setIsGoalModalOpen(false); setEditingGoal(null); }} 
        onSave={handleSaveGoal} 
        initialData={editingGoal} 
      />
      <LimitModal 
        isOpen={isLimitModalOpen} 
        onClose={() => { setIsLimitModalOpen(false); setEditingLimit(null); }} 
        onSave={handleSaveLimit} 
        initialData={editingLimit} 
      />
    </div>
  );
};

export default BudgetsPage;