import React from 'react';

const ProgressBar = ({ label, current, total, color = "bg-finix-orange" }) => {
  const percentage = Math.min((current / total) * 100, 100); // Máximo 100%
  const isOverBudget = current > total;

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="font-semibold text-white">{label}</span>
        <span className={`text-sm font-bold ${isOverBudget ? 'text-red-400' : 'text-gray-400'}`}>
          ${current} / ${total}
        </span>
      </div>
      {/* Barra Fondo */}
      <div className="h-3 w-full bg-gray-700 rounded-full overflow-hidden">
        {/* Barra Relleno */}
        <div 
          className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : color}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isOverBudget && <p className="text-xs text-red-400 mt-1">⚠️ Presupuesto excedido</p>}
    </div>
  );
};

export default ProgressBar;