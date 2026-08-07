import React from 'react';
import { ShoppingCart, Car, Zap, Heart, Coffee, Briefcase, DollarSign, Home, Gift, Smartphone, Film, AlertCircle } from 'lucide-react';

const TransactionIcon = ({ description, type }) => {
  // 🛡️ PROTECCIÓN CRÍTICA:
  // Si description es null/undefined, usamos una cadena vacía para evitar el crash de 'toLowerCase'
  const safeDescription = (description || '').toLowerCase();

  // Diccionario de iconos
  const icons = {
    'supermercado': ShoppingCart,
    'comida': ShoppingCart,
    'tacos': ShoppingCart,
    'alimentación': ShoppingCart,
    'gasolina': Car,
    'transporte': Car,
    'uber': Car,
    'luz': Zap,
    'agua': Zap,
    'internet': Zap,
    'servicios': Zap,
    'salud': Heart,
    'farmacia': Heart,
    'café': Coffee,
    'restaurante': Coffee,
    'nómina': Briefcase,
    'salario': Briefcase,
    'freelance': Briefcase,
    'venta': DollarSign,
    'renta': Home,
    'hogar': Home,
    'regalo': Gift,
    'celular': Smartphone,
    'entretenimiento': Film,
    'cine': Film,
    'netflix': Film
  };

  // Buscar icono por palabra clave
  let IconComponent = AlertCircle; // Icono por defecto (si no encuentra nada)
  
  // Si es ingreso, ponemos signo de dolar por defecto, si no, buscamos
  if (type === 'ingreso' || type === 'income') {
      IconComponent = DollarSign;
  }

  // Buscamos si alguna clave está dentro de la descripción
  const foundKey = Object.keys(icons).find(key => safeDescription.includes(key));
  if (foundKey) {
    IconComponent = icons[foundKey];
  }

  // Colores según tipo
  const bgClass = (type === 'ingreso' || type === 'income') 
    ? 'bg-green-500/20 text-green-400' 
    : 'bg-red-500/20 text-red-400';

  return (
    <div className={`p-3 rounded-lg ${bgClass} shadow-inner flex items-center justify-center`}>
      <IconComponent size={24} />
    </div>
  );
};

export default TransactionIcon;