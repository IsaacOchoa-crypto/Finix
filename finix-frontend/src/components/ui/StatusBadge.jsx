import React from 'react';

const StatusBadge = ({ type }) => {
  const isExpense = type === 'expense';
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
      isExpense 
        ? 'bg-red-500/10 text-red-400 border-red-500/20' 
        : 'bg-green-500/10 text-green-400 border-green-500/20'
    }`}>
      {isExpense ? 'Gasto' : 'Ingreso'}
    </span>
  );
};

export default StatusBadge;