import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Download, CreditCard, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const AdminSubscriptionsPage = () => {
  // 1. Estado para la animación de la barra
  const [progress, setProgress] = useState(0);

  // 2. Efecto para iniciar la animación al cargar
  useEffect(() => {
    const timer = setTimeout(() => setProgress(70), 300); // 70% es el valor ejemplo
    return () => clearTimeout(timer);
  }, []);

  const transactions = [
    { id: 1, user: 'Juan Pérez', plan: 'Pro Mensual', amount: 449.00, status: 'Success', date: '2026-01-22' },
    { id: 2, user: 'Empresa Agricola SA', plan: 'Business Anual', amount: 4500.00, status: 'Success', date: '2026-01-21' },
    { id: 3, user: 'Carlos Ruiz', plan: 'Pro Mensual', amount: 449.00, status: 'Failed', date: '2026-01-20' },
    { id: 4, user: 'Ana García', plan: 'Pro Mensual', amount: 449.00, status: 'Success', date: '2026-01-19' },
  ];

  const handleDownload = () => {
    toast.success('Reporte generado', { description: 'El archivo Excel se está descargando.' });
  };

  const liquidCard = "bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-xl relative overflow-hidden group hover:border-red-500/20 transition-all duration-300";

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white drop-shadow-md">Suscripciones & Pagos</h1>
          <p className="text-gray-400">Control de facturación y planes activos</p>
        </div>
        <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition text-gray-300 hover:text-white active:scale-95">
          <Download size={18} /> Reporte Financiero
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={liquidCard}>
          <div className="flex items-center gap-2 mb-2 text-green-400 text-sm font-bold"><TrendingUp size={16}/> +15% este mes</div>
          <p className="text-gray-400 text-sm">Ingresos Totales (MRR)</p>
          <h3 className="text-4xl font-bold text-white mt-1">$45,200.00</h3>
        </div>
        
        {/* --- BARRA DE PROGRESO ANIMADA --- */}
        <div className={liquidCard}>
          <div className="flex items-center gap-2 mb-4 text-blue-400 font-medium"><CreditCard size={20}/> 850 Activos</div>
          <p className="text-gray-400 text-sm mb-2">Suscripciones Pro</p>
          
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden relative">
            {/* Barra Azul con transición */}
            <div 
              className="h-full bg-blue-500 rounded-full relative shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            >
                {/* Punta Brillante (Glow Tip) */}
                <div className="absolute right-0 top-0 h-full w-2 bg-white blur-[2px] opacity-80 shadow-[0_0_10px_white]"></div>
            </div>
          </div>
        </div>

        <div className={`${liquidCard} border-red-500/20`}>
          <div className="flex items-center gap-2 mb-4 text-red-400 font-medium"><AlertCircle size={20}/> Acción requerida</div>
          <p className="text-gray-400 text-sm">Pagos Fallidos (Hoy)</p>
          <h3 className="text-3xl font-bold text-white mt-1">3</h3>
        </div>
      </div>

      {/* Tabla Pagos */}
      <div className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5"><h3 className="text-lg font-bold text-white">Últimos Pagos</h3></div>
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Usuario / Empresa</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Monto</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-white/5 transition">
                <td className="px-6 py-4 font-medium text-white">{tx.user}</td>
                <td className="px-6 py-4"><span className="bg-white/10 px-2 py-1 rounded text-xs border border-white/10">{tx.plan}</span></td>
                <td className="px-6 py-4 text-gray-400 text-sm">{tx.date}</td>
                <td className="px-6 py-4 font-bold text-white">${tx.amount}</td>
                <td className="px-6 py-4">
                  {tx.status === 'Success' 
                    ? <span className="flex items-center gap-1 text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded border border-green-500/20"><CheckCircle size={12}/> Exitoso</span>
                    : <span className="flex items-center gap-1 text-red-400 text-xs bg-red-500/10 px-2 py-1 rounded border border-red-500/20"><XCircle size={12}/> Fallido</span>
                  }
                </td>
                <td className="px-6 py-4 text-right"><button className="text-blue-400 hover:text-blue-300 text-sm">Ver Factura</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminSubscriptionsPage;