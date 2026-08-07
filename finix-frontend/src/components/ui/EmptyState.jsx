import React from 'react';
import { Ghost } from 'lucide-react'; // Un icono divertido

const EmptyState = ({ title, description, icon: Icon = Ghost }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5 animate-in fade-in zoom-in duration-500">
      <div className="p-4 bg-finix-orange/10 rounded-full mb-4 shadow-[0_0_20px_rgba(255,107,0,0.1)]">
        <Icon size={48} className="text-finix-orange/70" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-sm">{description}</p>
    </div>
  );
};

export default EmptyState;