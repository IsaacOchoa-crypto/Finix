import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Search, Download, Plus, ArrowUpRight, ArrowDownLeft, MoreHorizontal, Loader2, FileSpreadsheet } from 'lucide-react';
import TransactionModal from '../features/transactions/TransactionModal';
import api from '../api/axios'; 

const TransactionsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // 1. Estados de Datos y Filtros
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'ingreso', 'gasto'

  // ---------------------------------------------------------
  // 2. CARGAR DATOS DEL BACKEND (GET)
  // ---------------------------------------------------------
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/transacciones');
      if (data.estado && Array.isArray(data.datos)) {
        // Ordenamos por fecha (más reciente primero)
        const sortedData = data.datos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setTransactions(sortedData);
      }
    } catch (error) {
      console.error("Error al cargar transacciones:", error);
      toast.error("No se pudo sincronizar el historial.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // ---------------------------------------------------------
  // 3. GUARDAR NUEVA TRANSACCIÓN (POST)
  // ---------------------------------------------------------
  const handleSaveTransaction = async (formData) => {
    // Preparamos el payload para el backend
    const payload = {
      categoria_nombre: formData.category,
      monto: parseFloat(formData.amount),
      tipo: formData.type, // 'ingreso' o 'gasto'
      fecha: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString()
    };

    try {
      const response = await api.post('/transaccion', payload);
      
      if (response.data.estado) {
        toast.success('¡Movimiento registrado!', { description: `${formData.category} se ha guardado correctamente.` });
        setIsModalOpen(false);
        fetchTransactions(); // Recargamos la tabla
      } else {
        toast.error(response.data.mensaje || 'Error al guardar');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión al guardar.');
    }
  };

  // ---------------------------------------------------------
  // 4. LÓGICA DE FILTRADO (FRONTEND)
  // ---------------------------------------------------------
  const filteredTransactions = transactions.filter(tx => {
    // Normalizamos textos para búsqueda segura
    const desc = (tx.categoria_nombre || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    
    // A. Filtro Texto
    const matchesSearch = desc.includes(search);
    
    // B. Filtro Tipo (Mapeamos 'income'/'expense' del front a 'ingreso'/'gasto' del back si es necesario)
    let matchesFilter = true;
    if (filterType === 'income') matchesFilter = tx.tipo === 'ingreso';
    if (filterType === 'expense') matchesFilter = tx.tipo === 'gasto';

    return matchesSearch && matchesFilter;
  });

  // ---------------------------------------------------------
  // 5. EXPORTAR A CSV (FUNCIONALIDAD EXTRA)
  // ---------------------------------------------------------
  const handleExport = () => {
    if (filteredTransactions.length === 0) return toast.info("No hay datos para exportar");

    const headers = "Fecha,Categoria,Tipo,Monto\n";
    const rows = filteredTransactions.map(tx => {
      const date = new Date(tx.fecha).toLocaleDateString();
      return `${date},${tx.categoria_nombre},${tx.tipo},${tx.monto}`;
    }).join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reporte_finix_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Archivo descargado correctamente");
  };

  // ---------------------------------------------------------
  // ESTILOS Y RENDER
  // ---------------------------------------------------------
  const liquidCard = "bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-xl relative overflow-hidden group hover:border-finix-orange/20 transition-all duration-300";

  const getFilterButtonClass = (type) => 
    `px-4 py-2 rounded-xl text-sm whitespace-nowrap border transition-all duration-300 ${
      filterType === type 
      ? 'bg-white/10 text-white border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)] font-medium' 
      : 'bg-transparent text-gray-500 hover:text-white border-white/5 hover:bg-white/5'
    }`;

  // Formateador de moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  };

  // Formateador de fecha
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white drop-shadow-md">Transacciones</h1>
          <p className="text-gray-400">Gestiona tus movimientos financieros</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition active:scale-95"
          >
            <FileSpreadsheet size={18} /> <span className="hidden md:inline">Exportar CSV</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-finix-orange text-black px-5 py-2.5 rounded-xl font-bold hover:bg-orange-400 transition shadow-[0_0_15px_rgba(255,107,0,0.4)] flex items-center gap-2 active:scale-95">
            <Plus size={20} /> Nuevo Movimiento
          </button>
        </div>
      </div>

      <div className={`${liquidCard} p-4 mb-6 flex flex-col md:flex-row gap-4 items-center`}>
        {/* BUSCADOR */}
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-finix-orange transition-colors" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por categoría..." 
            className="w-full bg-black/40 text-white pl-10 pr-4 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-finix-orange/50 transition placeholder-gray-600"
          />
        </div>
        
        {/* FILTROS */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button onClick={() => setFilterType('all')} className={getFilterButtonClass('all')}>Todos</button>
          <button onClick={() => setFilterType('income')} className={getFilterButtonClass('income')}>Ingresos</button>
          <button onClick={() => setFilterType('expense')} className={getFilterButtonClass('expense')}>Gastos</button>
        </div>
      </div>

      <div className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Categoría / Descripción</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4 text-right">Monto</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              
              {loading ? (
                 /* ESTADO DE CARGA */
                 <tr>
                    <td colSpan="5" className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <Loader2 className="animate-spin text-finix-orange" size={40} />
                            <p className="text-gray-400 animate-pulse">Cargando movimientos...</p>
                        </div>
                    </td>
                 </tr>
              ) : filteredTransactions.length > 0 ? (
                /* LISTA DE TRANSACCIONES */
                filteredTransactions.map((tx) => (
                <tr key={tx._id || Math.random()} className="hover:bg-white/5 transition duration-150 group">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3 capitalize">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.tipo === 'ingreso' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {tx.tipo === 'ingreso' ? <ArrowUpRight size={16}/> : <ArrowDownLeft size={16}/>}
                    </div>
                    {tx.categoria_nombre}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(tx.fecha)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full border ${tx.tipo === 'ingreso' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                      {tx.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${tx.tipo === 'ingreso' ? 'text-green-500' : 'text-white'}`}>
                    {tx.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(tx.monto)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-white transition opacity-0 group-hover:opacity-100">
                        <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))) : (
                /* ESTADO VACÍO */
                <tr><td colSpan="6" className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <Search size={32} className="opacity-20 mb-2"/>
                       <p>No se encontraron movimientos.</p>
                       <p className="text-xs text-gray-600">Intenta registrar uno nuevo.</p>
                    </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveTransaction} />
    </>
  );
};

export default TransactionsPage;