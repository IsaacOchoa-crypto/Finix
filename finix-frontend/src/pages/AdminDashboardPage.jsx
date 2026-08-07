import React, { useState } from 'react'; // Importamos useState
import { 
  Users, DollarSign, Activity, Search, MoreVertical, 
  ShieldCheck, User, AlertTriangle, CheckCircle, Clock, Server 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboardPage = () => {
  // 1. Estado del buscador
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { id: 1, name: 'Richard Admin', email: 'richard@finix.app', role: 'Admin', plan: 'Free', status: 'Active' },
    { id: 2, name: 'Juan Pérez', email: 'juan@gmail.com', role: 'User', plan: 'Pro', status: 'Active' },
    { id: 3, name: 'Maria Lopez', email: 'maria@outlook.com', role: 'User', plan: 'Free', status: 'Inactive' },
    { id: 4, name: 'Carlos Ruiz', email: 'carlos@tech.co', role: 'User', plan: 'Pro', status: 'Active' },
  ];

  // 2. Lógica de filtrado
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = [
    { name: 'Ene', revenue: 4000, newUsers: 24 },
    { name: 'Feb', revenue: 3000, newUsers: 13 },
    { name: 'Mar', revenue: 2000, newUsers: 98 },
    { name: 'Abr', revenue: 2780, newUsers: 39 },
    { name: 'May', revenue: 1890, newUsers: 48 },
    { name: 'Jun', revenue: 2390, newUsers: 38 },
    { name: 'Jul', revenue: 3490, newUsers: 43 },
  ];

  const auditLogs = [
    { id: 1, action: 'Nuevo usuario registrado', details: 'Carlos Ruiz se unió', time: '10:42 AM', type: 'success' },
    { id: 2, action: 'Pago Fallido', details: 'Tarjeta rechazada (Maria)', time: '11:00 AM', type: 'error' },
    { id: 3, action: 'Plan Actualizado', details: 'Juan pasó a Plan Pro', time: '12:30 PM', type: 'info' },
    { id: 4, action: 'Backup Automático', details: 'Base de datos respaldada', time: '02:00 AM', type: 'system' },
  ];

  const liquidCard = "bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-xl relative overflow-hidden group hover:border-red-500/20 transition-all duration-300 hover:-translate-y-1";
  
  const badgeStyle = (status) => status === 'Active' 
    ? "bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]" 
    : "bg-gray-500/10 text-gray-400 border border-gray-500/20";

  return (
    <>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white drop-shadow-md">Panel de Control</h1>
          <p className="text-gray-400 flex items-center gap-2">
            Visión general del negocio <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]"></span>
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm text-gray-400 flex items-center gap-2">
              <Server size={14} className="text-green-400"/> Sistema Estable
           </div>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={liquidCard}>
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-110"><Users size={60} /></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20"><Users size={24} /></div>
          </div>
          <p className="text-gray-400 text-sm">Usuarios Totales</p>
          <h3 className="text-3xl font-bold text-white mt-1">{users.length}</h3>
        </div>
        <div className={liquidCard}>
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-110"><DollarSign size={60} /></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-500/10 rounded-lg text-green-400 border border-green-500/20"><DollarSign size={24} /></div>
            <span className="text-xs font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/10">+12%</span>
          </div>
          <p className="text-gray-400 text-sm">MRR (Ingresos Mensuales)</p>
          <h3 className="text-3xl font-bold text-white mt-1">$45,200</h3>
        </div>
        <div className={liquidCard}>
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-110"><Activity size={60} /></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20"><Activity size={24} /></div>
          </div>
          <p className="text-gray-400 text-sm">Tasa de Actividad</p>
          <h3 className="text-3xl font-bold text-white mt-1">85%</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className={`lg:col-span-2 ${liquidCard}`}>
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Activity className="text-red-500" size={20}/> Rendimiento Financiero</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenueAdmin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#525252" tick={{fill: '#737373'}} />
                <YAxis stroke="#525252" tick={{fill: '#737373'}} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#fff' }}/>
                <Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenueAdmin)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={liquidCard}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><ShieldCheck className="text-red-500" size={20}/> Bitácora</h3>
            <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20 animate-pulse">Live</span>
          </div>
          <div className="space-y-6 relative">
            <div className="absolute left-[19px] top-2 bottom-2 w-[1px] bg-white/10"></div>
            {auditLogs.map((log) => (
              <div key={log.id} className="flex gap-4 relative z-10 group">
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border bg-[#0a0a0a] ${log.type === 'success' ? 'border-green-500/30 text-green-500' : ''} ${log.type === 'error' ? 'border-red-500/30 text-red-500' : ''} ${log.type === 'info' ? 'border-blue-500/30 text-blue-500' : ''} ${log.type === 'system' ? 'border-gray-500/30 text-gray-400' : ''}`}>
                  {log.type === 'success' && <User size={16} />}
                  {log.type === 'error' && <AlertTriangle size={16} />}
                  {log.type === 'info' && <CheckCircle size={16} />}
                  {log.type === 'system' && <Server size={16} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-red-400 transition">{log.action}</p>
                  <p className="text-xs text-gray-500">{log.details}</p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-600"><Clock size={10} /> {log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-bold text-white">Usuarios Recientes</h3>
          {/* BUSCADOR ACTIVO */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar usuario..." 
              className="w-full bg-black/40 text-white pl-10 pr-4 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-red-500/50 transition placeholder-gray-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition duration-150 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-white/10">
                        <User size={14} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white group-hover:text-red-400 transition">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.role === 'Admin' ? <ShieldCheck size={14} className="text-red-500"/> : <User size={14} className="text-gray-500"/>}
                      <span className={user.role === 'Admin' ? 'text-white font-bold' : 'text-gray-400'}>{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded border ${user.plan === 'Pro' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>{user.plan}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeStyle(user.status)}`}>● {user.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition"><MoreVertical size={18} /></button>
                  </td>
                </tr>
              )) : (
                 <tr><td colSpan="5" className="p-6 text-center text-gray-500">No se encontraron usuarios.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;