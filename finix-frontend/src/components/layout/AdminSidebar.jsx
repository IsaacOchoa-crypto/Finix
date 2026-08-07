import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, ShieldCheck } from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Resumen Admin', path: '/admin' },
    { icon: Users, label: 'Usuarios', path: '/admin/users' },
    { icon: CreditCard, label: 'Suscripciones', path: '/admin/subscriptions' },
    { icon: Settings, label: 'Configuración', path: '/admin/settings' },
  ];

  // Calculamos el índice activo para mover la pastilla
  // Si la ruta coincide exactamente O si empieza con la ruta (para subpáginas)
  const activeIndex = menuItems.findIndex(item => 
    location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
  );

  return (
    <aside 
      className="w-64 h-screen fixed left-0 top-0 bg-[#050505]/60 backdrop-blur-2xl flex flex-col z-50 transition-all duration-300 border-r border-white/5"
      style={{ boxShadow: '1px 0 30px rgba(239, 68, 68, 0.1)' }}
    >
      
      {/* LOGO ADMIN */}
      <div className="p-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
             <div className="absolute inset-0 bg-red-600 rounded-xl blur-lg opacity-20 animate-pulse"></div>
             <div className="relative bg-gradient-to-br from-gray-900 to-black border border-red-500/30 w-10 h-10 rounded-xl flex items-center justify-center shadow-xl">
               <ShieldCheck className="text-red-500" size={24} />
             </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Finix.</h1>
            <span className="text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full tracking-widest uppercase shadow-[0_0_10px_rgba(239,68,68,0.2)]">
              Admin
            </span>
          </div>
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="flex-1 px-4 relative z-10">
        
        {/* 🔴 LA PASTILLA DESLIZANTE (Fondo Rojo Tecnológico) */}
        {activeIndex !== -1 && (
          <div 
            className="absolute left-4 w-[calc(100%-2rem)] h-12 bg-red-600/10 border border-red-500/50 rounded-xl transition-all duration-300 ease-in-out shadow-[0_0_20px_rgba(220,38,38,0.25)]"
            // Multiplicamos por 56px (48px de altura + 8px de gap en space-y-2)
            style={{ top: `${activeIndex * 56}px`, zIndex: 0 }}
          />
        )}

        <div className="space-y-2 relative z-10">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 h-12 rounded-xl transition-all duration-300 group
                ${isActive 
                  ? 'text-red-500 font-bold' // Texto rojo neón cuando está activo
                  : 'text-gray-400 hover:text-white hover:bg-white/5' // Hover sutil cuando no
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    size={20} 
                    className={isActive ? 'animate-pulse drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'group-hover:scale-110 transition'} 
                  />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* BOTÓN SALIR */}
      <div className="p-4 border-t border-white/5 relative z-10">
        <button 
          onClick={() => navigate('/login')}
          className="flex w-full items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span>Salir del Admin</span>
        </button>
      </div>
      
    </aside>
  );
};

export default AdminSidebar;