import React from 'react';
import { AlertTriangle, AlertCircle, ShieldAlert, CheckCircle, Mail, X, Sparkles } from 'lucide-react';

const AnomalyAlertBanner = ({ alerta, emailEnviado, onDismiss }) => {
  if (!alerta || !alerta.hayAnomalia) return null;

  const { nivelRiesgo, titulo, descripcion, recomendacion } = alerta;

  const isCritical = nivelRiesgo === 'Crítico' || nivelRiesgo === 'Alto';

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl p-5 border backdrop-blur-xl transition-all duration-300 shadow-2xl mb-6 ${
      isCritical 
        ? 'bg-red-950/40 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)] text-red-100'
        : 'bg-amber-950/40 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)] text-amber-100'
    }`}>
      {/* Glow decorativo animado de fondo */}
      <div className={`absolute -right-24 -top-24 w-48 h-48 rounded-full blur-[100px] pointer-events-none opacity-40 animate-pulse ${
        isCritical ? 'bg-red-500' : 'bg-amber-500'
      }`} />

      <div className="flex flex-col md:flex-row items-start justify-between gap-4 relative z-10">
        
        {/* Ícono de alerta */}
        <div className="flex items-start gap-4 flex-1">
          <div className={`shrink-0 p-3 rounded-2xl border ${
            isCritical 
              ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
              : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
          }`}>
            {isCritical ? <ShieldAlert size={28} /> : <AlertTriangle size={28} />}
          </div>

          <div className="space-y-2 flex-1">
            {/* Header badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isCritical 
                  ? 'bg-red-500/20 border-red-500/40 text-red-300' 
                  : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              }`}>
                {nivelRiesgo ? `Riesgo ${nivelRiesgo}` : 'Anomalía Financiera'}
              </span>

              <span className="text-xs text-gray-400 flex items-center gap-1 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                <Sparkles size={12} className="text-orange-400" /> Finix AI Guardian
              </span>

              {emailEnviado && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <Mail size={12} /> Alerta enviada por correo
                </span>
              )}
            </div>

            {/* Título y Descripción */}
            <h4 className="text-xl font-bold text-white leading-snug">
              {titulo || 'Patrón de Riesgo Financiero Detectado'}
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed max-w-3xl">
              {descripcion}
            </p>

            {/* Recomendación personalizada de Gemini */}
            {recomendacion && (
              <div className="mt-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <p className="text-xs font-bold text-orange-400 flex items-center gap-1.5 mb-1">
                  <CheckCircle size={14} /> Recomendación de Finix AI:
                </p>
                <p className="text-xs text-gray-200 leading-relaxed">
                  {recomendacion}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Botón para cerrar */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Cerrar alerta"
            className="shrink-0 p-2 text-white/50 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 rounded-xl transition-all duration-200 active:scale-95 self-start"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AnomalyAlertBanner;
