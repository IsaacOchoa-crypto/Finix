import React from 'react';
import { AlertCircle, AlertTriangle, X } from 'lucide-react';

const ExpenseAlert = ({ limitData, onDismiss }) => {
  if (!limitData) return null;

  const { category, limit, spent } = limitData;
  const isOverdraft = spent > limit && limit > 0;
  const isWarning = spent >= limit * 0.85 && spent <= limit && limit > 0;

  if (!isOverdraft && !isWarning) return null;

  const excessAmount = isOverdraft ? spent - limit : 0;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl p-5 border backdrop-blur-xl transition-all duration-300 flex items-start gap-4 ${
        isOverdraft
          ? 'bg-red-500/10 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)] text-red-200'
          : 'bg-yellow-500/10 border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.05)] text-yellow-200'
      }`}
    >
      {/* Glow decorativo de fondo */}
      <div
        className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-[80px] pointer-events-none opacity-25 ${
          isOverdraft ? 'bg-red-500' : 'bg-yellow-500'
        }`}
      />

      <div className="shrink-0 mt-0.5 relative z-10">
        {isOverdraft ? (
          <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
            <AlertCircle size={20} />
          </div>
        ) : (
          <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <AlertTriangle size={20} />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-3 relative z-10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
            Alerta de Consumo
          </span>
          <h4 className="text-lg font-bold text-white leading-snug">
            {isOverdraft ? 'Presupuesto Excedido' : 'Límite Cercano'} en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 font-extrabold">
              {category}
            </span>
          </h4>
        </div>

        <p className="text-sm opacity-85 leading-relaxed max-w-xl text-gray-300">
          {isOverdraft ? (
            'Has excedido el límite de tu presupuesto mensual. Te sugerimos revisar tus gastos recientes para optimizar tu balance financiero.'
          ) : (
            `Estás cerca de alcanzar el límite mensual. Has consumido el ${((spent / limit) * 100).toFixed(0)}% del total asignado.`
          )}
        </p>

        {/* Desglose de totales en badges con micro-glassmorphism */}
        <div className="flex flex-wrap gap-4 pt-1">
          <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 backdrop-blur-md">
            <span className="block text-[10px] uppercase tracking-wider opacity-50 font-medium">Límite</span>
            <span className="text-sm font-bold text-white">
              ${limit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 backdrop-blur-md">
            <span className="block text-[10px] uppercase tracking-wider opacity-50 font-medium">Gastado</span>
            <span className="text-sm font-bold text-white">
              ${spent.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>
          {isOverdraft && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-1.5 backdrop-blur-md">
              <span className="block text-[10px] uppercase tracking-wider text-red-400 font-semibold">Exceso</span>
              <span className="text-sm font-bold text-red-400">
                ${excessAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Cerrar"
          className="shrink-0 p-1.5 text-white/40 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-lg transition-all duration-200 active:scale-95 self-start relative z-10"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ExpenseAlert;
