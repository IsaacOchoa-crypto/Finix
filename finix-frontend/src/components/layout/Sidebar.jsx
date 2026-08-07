import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, PiggyBank, Bot, LogOut, Hexagon } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ArrowRightLeft, label: 'Transacciones', path: '/transactions' },
    { icon: PiggyBank, label: 'Presupuestos', path: '/budgets' },
    { icon: Bot, label: 'Asistente IA', path: '/ai-agent' },
  ];

  const activeIndex = menuItems.findIndex(item => item.path === location.pathname);

  return (
    <aside 
      className="w-64 h-screen fixed left-0 top-0 bg-black/40 backdrop-blur-2xl flex flex-col z-50 transition-all duration-300 border-r border-white/5"
      // ✨ EL TRUCO SEGURO: Sombra manual para el efecto de luz
      style={{ boxShadow: '1px 0 30px rgba(255, 255, 255, 0.1)' }}
    >
      
      {/* --- LOGO --- */}
      <div 
        onClick={() => navigate('/dashboard')}
        className="p-8 cursor-pointer group select-none relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Brillo naranja detrás del logo */}
            <div className="absolute inset-0 bg-finix-orange rounded-xl blur-lg opacity-20 group-hover:opacity-60 transition duration-500"></div>
            
            {/* Contenedor del icono */}
            <div className="relative bg-gradient-to-br from-gray-800 to-black border border-white/10 w-10 h-10 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 transition duration-300 group-hover:border-finix-orange/50">
              <Hexagon className="text-finix-orange group-hover:rotate-180 transition duration-700 ease-in-out" size={24} strokeWidth={2.5} />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-finix-orange to-purple-500 group-hover:to-finix-orange transition-all duration-500">
                Finix.
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* --- NAVEGACIÓN --- */}
      <nav className="flex-1 px-4 relative z-10">
        {/* Pastilla Naranja (Fondo del item activo) */}
        {activeIndex !== -1 && (
          <div 
            className="absolute left-4 w-[calc(100%-2rem)] h-12 bg-finix-orange/90 rounded-xl transition-all duration-300 ease-in-out shadow-[0_0_15px_rgba(255,107,0,0.4)]"
            style={{ top: `${activeIndex * 56}px`, zIndex: 0 }}
          />
        )}

        <div className="space-y-2 relative z-10"> 
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 h-12 rounded-xl transition-colors duration-200
                ${isActive ? 'text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}
              `}
            >
              <item.icon size={20} />
              <span className="drop-shadow-sm">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* --- BOTÓN SALIR --- */}
      <div className="p-4 border-t border-white/5 relative z-10">
        <button 
          onClick={() => navigate('/login')}
          className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
      
    </aside>
  );
};

export default Sidebar;