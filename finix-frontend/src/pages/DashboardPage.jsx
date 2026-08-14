import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner'; 
import TransactionModal from '../features/transactions/TransactionModal';
import { Wallet, TrendingUp, TrendingDown, Plus, Bell, RefreshCw, User, LogOut, ShieldAlert, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TransactionIcon from '../components/ui/TransactionIcon';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

// Componentes UI de Finix
import DotGrid from '../components/ui/DotGrid'; 
import AnomalyAlertBanner from '../components/ui/AnomalyAlertBanner';
import ExportButtons from '../components/ui/ExportButtons';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); 

  const [rawTransactions, setRawTransactions] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [financialSummary, setFinancialSummary] = useState({
    saldo: 0, ingresosMes: 0, gastosMes: 0
  });

  // Estado para la alerta de anomalías (RF-07)
  const [alertaAnomalia, setAlertaAnomalia] = useState(null);
  const [emailEnviadoAlert, setEmailEnviadoAlert] = useState(false);
  const [analyzingAnomalies, setAnalyzingAnomalies] = useState(false);

  const toggleMenu = (menu) => setActiveMenu(activeMenu === menu ? null : menu);

  // Función para escanear anomalías usando el backend y Gemini AI (RF-07)
  const handleCheckAnomalies = async (transactionsToAnalyze) => {
    setAnalyzingAnomalies(true);
    try {
      const { data } = await api.post('/anomalias/analizar', { 
        transacciones: transactionsToAnalyze || rawTransactions 
      });

      if (data.estado && data.hayAnomalia) {
        setAlertaAnomalia(data.alerta);
        setEmailEnviadoAlert(data.emailEnviado);
        toast.warning('🚨 Anomalía financiera detectada por Finix AI', {
          description: data.alerta?.titulo || 'Se identificó un patrón de riesgo en tus transacciones.'
        });
      } else {
        setAlertaAnomalia(null);
      }
    } catch (error) {
      console.error("Error al analizar anomalías:", error);
    } finally {
      setAnalyzingAnomalies(false);
    }
  };

  const fetchDashboardData = useCallback(async () => {
    setRefreshing(true);
    try {
      const { data } = await api.get('/transacciones');
      if (data.estado && Array.isArray(data.datos)) {
        setRawTransactions(data.datos);
        processTransactions(data.datos);
        // Disparar análisis de anomalías
        handleCheckAnomalies(data.datos);
      }
    } catch (error) {
      console.error("Error Dashboard:", error);
      toast.error("No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 500);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const processTransactions = (transactions) => {
    if (!Array.isArray(transactions)) return;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalSaldo = 0;
    let mesIngresos = 0;
    let mesGastos = 0;

    transactions.forEach(t => {
      const amount = Number(t.monto) || 0;
      const tDate = t.fecha ? new Date(t.fecha) : new Date(); 
      const tipo = t.tipo || 'gasto';
      if (tipo === 'ingreso') totalSaldo += amount;
      else totalSaldo -= amount;
      if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
        if (tipo === 'ingreso') mesIngresos += amount;
        else mesGastos += amount;
      }
    });

    setFinancialSummary({ saldo: totalSaldo, ingresosMes: mesIngresos, gastosMes: mesGastos });

    const sortedTx = [...transactions].sort((a, b) => (b.fecha ? new Date(b.fecha) : new Date()) - (a.fecha ? new Date(a.fecha) : new Date()));
    setRecentTransactions(sortedTx.slice(0, 10).map(t => ({
      ...t,
      monto: Number(t.monto),
      categoria_nombre: t.categoria_nombre || "General", 
      fechaFormatted: t.fecha ? new Date(t.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }) : 'Reciente'
    })));

    const last7Days = [];
    const daysMap = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayTotal = transactions
            .filter(t => (t.tipo === 'gasto') && t.fecha && typeof t.fecha === 'string' && t.fecha.startsWith(dateStr))
            .reduce((acc, curr) => acc + Number(curr.monto), 0);
        last7Days.push({ name: daysMap[d.getDay()], monto: dayTotal });
    }
    setChartData(last7Days);
  };

  const handleSaveTransaction = async (formData) => {
    const montoNum = parseFloat(formData.amount);
    const categoria = formData.category || formData.categoria_nombre || "General";
    
    if (isNaN(montoNum) || montoNum <= 0) {
      return toast.error("El monto debe ser mayor a 0.");
    }

    const payload = {
      categoria_nombre: categoria, 
      monto: montoNum,
      tipo: formData.type || 'gasto', 
      fecha: formData.date ? new Date(formData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    };

    try {
      const response = await api.post('/transaccion', payload);
      if (response.data.estado) {
        toast.success('¡Movimiento guardado!');
        setIsModalOpen(false);
        fetchDashboardData(); 
      } else {
        toast.error(response.data.mensaje || 'Error al guardar.');
      }
    } catch (error) {
      const mensajeError = error.response?.data?.mensaje || 'Error de red al guardar.';
      console.error("Detalle del error 400:", error.response?.data);
      toast.error(mensajeError);
    }
  };

  const liquidCardStyle = "bg-gray-900/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden group hover:bg-gray-900/80 transition-all duration-300 hover:-translate-y-1 cursor-pointer";
  const dropdownStyle = "absolute top-14 right-0 w-80 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200";

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      
      {/* CAPA DE FONDO INTERACTIVA */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <DotGrid
          dotSize={4}
          gap={20}
          baseColor="#334155" 
          activeColor="#ff6b00" 
          proximity={150}
          shockRadius={300}
          returnDuration={2}
        />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-10 space-y-6 pb-10 px-4 md:px-8 max-w-7xl mx-auto" onClick={() => activeMenu && setActiveMenu(null)}> 
        
        {/* HEADER Y ACCIONES */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pt-6">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Resumen Financiero</h1>
            <p className="text-gray-400 mt-1 flex items-center gap-2">
              Bienvenido de nuevo, Usuario <span className="animate-pulse">👋</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative" onClick={(e) => e.stopPropagation()}>
            {/* BOTONES DE EXPORTACIÓN (RF-08) */}
            <ExportButtons 
              targetContainerId="dashboard-report" 
              transactions={rawTransactions} 
              summary={financialSummary} 
            />

            {/* BOTÓN ESCANEAR ANOMALÍAS CON IA (RF-07) */}
            <button
              onClick={() => handleCheckAnomalies(rawTransactions)}
              disabled={analyzingAnomalies}
              title="Analizar riesgos financieros con Gemini AI"
              className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition flex items-center gap-2 text-sm font-semibold disabled:opacity-50"
            >
              <ShieldAlert size={18} className={analyzingAnomalies ? 'animate-bounce' : ''} />
              <span className="hidden xl:inline">Auditar Riesgos</span>
            </button>

            {/* NOTIFICACIONES */}
            <div className="relative">
              <button 
                onClick={() => toggleMenu('notifications')}
                className={`p-3 rounded-xl transition relative group ${activeMenu === 'notifications' ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                {alertaAnomalia && (
                  <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
                )}
                <Bell size={20} className={activeMenu === 'notifications' ? 'rotate-12' : 'group-hover:rotate-12 transition'}/>
              </button>
              {activeMenu === 'notifications' && (
                <div className={dropdownStyle}>
                  <div className="p-4 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-white">Notificaciones</h3>
                    <span className="text-xs bg-orange-500 text-black px-2 py-0.5 rounded-full font-bold">
                      {alertaAnomalia ? '1 Alerta AI' : 'Al Día'}
                    </span>
                  </div>
                  {alertaAnomalia ? (
                    <div className="p-4 bg-red-500/10 hover:bg-red-500/20 transition cursor-pointer border-b border-white/5">
                      <p className="text-sm text-red-300 font-bold flex items-center gap-1.5">
                        <ShieldAlert size={16} /> {alertaAnomalia.titulo || 'Anomalía de Riesgo'}
                      </p>
                      <p className="text-xs text-gray-300 mt-1 line-clamp-2">{alertaAnomalia.descripcion}</p>
                    </div>
                  ) : (
                    <div className="p-4 hover:bg-white/5 transition cursor-pointer">
                        <p className="text-sm text-white font-medium">Sistema Conectado 🟢</p>
                        <p className="text-xs text-gray-400 mt-1">Sin anomalías detectadas en tus movimientos.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* USER MENU */}
            <div className="relative">
              <div onClick={() => toggleMenu('user')} className="flex items-center gap-3 pl-3 border-l border-white/10 cursor-pointer group">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-white group-hover:text-orange-500 transition">Mi Cuenta</p>
                  <p className="text-xs text-gray-500">Premium</p>
                </div>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-purple-600 p-[2px] transition ${activeMenu === 'user' ? 'shadow-[0_0_20px_rgba(255,107,0,0.6)] scale-105' : 'group-hover:shadow-[0_0_20px_rgba(255,107,0,0.4)]'}`}>
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                      <User size={18} className="text-white" />
                  </div>
                </div>
              </div>
              {activeMenu === 'user' && (
                <div className={`${dropdownStyle} right-0 w-64`}>
                  <div className="p-4 border-b border-white/5 bg-gradient-to-br from-orange-500/20 to-transparent">
                    <p className="font-bold text-white">Usuario</p>
                    <p className="text-xs text-gray-300">usuario@finix.app</p>
                  </div>
                  <div className="p-2">
                    <button onClick={() => navigate('/login')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition">
                        <LogOut size={16} /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button onClick={fetchDashboardData} className={`p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition ${refreshing ? 'animate-spin' : ''}`}>
                <RefreshCw size={20} />
            </button>
            
            <button onClick={() => setIsModalOpen(true)} className="bg-orange-500 text-black px-5 py-3 rounded-xl font-bold hover:bg-orange-400 transition shadow-lg shadow-orange-500/20 flex items-center gap-2 hover:-translate-y-1">
              <Plus size={20} /> <span className="hidden md:inline">Nuevo</span>
            </button>
          </div>
        </div>

        {/* 🚨 BANNER DE ALERTA DE ANOMALÍAS DETECTADAS POR GEMINI AI (RF-07) */}
        {alertaAnomalia && (
          <AnomalyAlertBanner 
            alerta={alertaAnomalia}
            emailEnviado={emailEnviadoAlert}
            onDismiss={() => setAlertaAnomalia(null)}
          />
        )}

        {/* CONTENEDOR EXPORTABLE A PDF/EXCEL (RF-08) */}
        <div id="dashboard-report" className="space-y-6 bg-slate-950/40 p-4 rounded-3xl border border-white/5">
          
          {/* TARJETAS RESUMEN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={liquidCardStyle}>
               <div className="flex justify-between mb-4"><div className="p-3 bg-blue-500/20 rounded-lg text-blue-400"><Wallet size={24} /></div></div>
               <p className="text-gray-400 text-sm">Saldo Total</p>
               <h3 className="text-3xl font-bold text-white">
                 {loading ? <span translate="no">...</span> : <span translate="no">${financialSummary.saldo.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>}
               </h3>
            </div>
            <div className={liquidCardStyle}>
               <div className="flex justify-between mb-4"><div className="p-3 bg-green-500/20 rounded-lg text-green-400"><TrendingUp size={24} /></div></div>
               <p className="text-gray-400 text-sm">Ingresos Mes</p>
               <h3 className="text-3xl font-bold text-white">
                 {loading ? <span translate="no">...</span> : <span translate="no">${financialSummary.ingresosMes.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>}
               </h3>
            </div>
            <div className={liquidCardStyle}>
               <div className="flex justify-between mb-4"><div className="p-3 bg-red-500/20 rounded-lg text-red-400"><TrendingDown size={24} /></div></div>
               <p className="text-gray-400 text-sm">Gastos Mes</p>
               <h3 className="text-3xl font-bold text-white">
                 {loading ? <span translate="no">...</span> : <span translate="no">${financialSummary.gastosMes.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>}
               </h3>
            </div>
          </div>

          {/* GRÁFICA Y MOVIMIENTOS RECIENTES */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 bg-gray-900/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Gastos (Últimos 7 días)</h3>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Sparkles size={14} className="text-orange-400" /> Proyección Finix
                  </span>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.4}/><stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip contentStyle={{backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px'}} itemStyle={{color: '#fff'}} formatter={(val) => `$${val}`} />
                            <Area type="monotone" dataKey="monto" stroke="#FF6B00" strokeWidth={3} fill="url(#colorMonto)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Reciente</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {recentTransactions.length === 0 ? <p className="text-gray-500 text-center">Sin movimientos.</p> : recentTransactions.map((t, i) => (
                        <div key={i} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl transition">
                            <div className="flex items-center gap-3">
                                <TransactionIcon description={t.categoria_nombre} type={t.tipo} />
                                <div>
                                    <p className="font-semibold text-white capitalize">{t.categoria_nombre}</p>
                                    <p className="text-xs text-gray-400">{t.fechaFormatted}</p>
                                </div>
                            </div>
                            <span className={`font-bold ${t.tipo === 'ingreso' ? 'text-green-400' : 'text-red-400'}`}>
                                {t.tipo === 'ingreso' ? '+' : '-'}${t.monto.toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
             </div>
          </div>
        </div>

        <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveTransaction} />
      </div>
    </div>
  );
};

export default DashboardPage;