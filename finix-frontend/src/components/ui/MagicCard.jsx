import React, { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';

// Configuración Finix (Naranja)
const DEFAULT_GLOW_COLOR = '255, 107, 0'; 
const DEFAULT_SPOTLIGHT_RADIUS = 300;

// --- UTILIDADES ---
const createParticleElement = (x, y, color) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute; width: 4px; height: 4px; border-radius: 50%;
    background: rgba(${color}, 1); box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none; z-index: 20; left: ${x}px; top: ${y}px;
  `;
  return el;
};

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--glow-x', `${((mouseX - rect.left) / rect.width) * 100}%`);
  card.style.setProperty('--glow-y', `${((mouseY - rect.top) / rect.height) * 100}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
};

// --- COMPONENTE: GRID CON SPOTLIGHT (CONTENEDOR) ---
export const MagicGrid = ({ children, className = "" }) => {
  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current) return;
    
    // Crear el spotlight global
    const spotlight = document.createElement('div');
    spotlight.style.cssText = `
      position: fixed; width: 600px; height: 600px; border-radius: 50%; pointer-events: none;
      background: radial-gradient(circle, rgba(${DEFAULT_GLOW_COLOR}, 0.15) 0%, transparent 70%);
      z-index: 50; opacity: 0; transform: translate(-50%, -50%); mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);

    const handleMouseMove = (e) => {
      if (!gridRef.current) return;
      const cards = gridRef.current.querySelectorAll('.magic-card');
      
      // Mover spotlight
      gsap.to(spotlight, { left: e.clientX, top: e.clientY, duration: 0.1, ease: 'power2.out' });
      
      // Calcular cercanía para el borde brillante
      let isInside = false;
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const distance = Math.hypot(e.clientX - (rect.left + rect.width/2), e.clientY - (rect.top + rect.height/2));
        const opacity = Math.max(0, 1 - (distance / DEFAULT_SPOTLIGHT_RADIUS));
        
        updateCardGlowProperties(card, e.clientX, e.clientY, opacity, DEFAULT_SPOTLIGHT_RADIUS);
        if (opacity > 0) isInside = true;
      });

      gsap.to(spotlight, { opacity: isInside ? 0.6 : 0, duration: 0.3 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      spotlight.remove();
    };
  }, []);

  return (
    <div ref={gridRef} className={`grid gap-6 ${className || 'grid-cols-1 md:grid-cols-2'}`}>
      {children}
    </div>
  );
};

// --- COMPONENTE: TARJETA MÁGICA (ITEM) ---
export const MagicCard = ({ children, className = "", onClick }) => {
  const cardRef = useRef(null);
  const isHovered = useRef(false);

  // Efecto de partículas y Tilt
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const handleMouseEnter = () => {
      isHovered.current = true;
      // Tilt In
      gsap.to(el, { rotateX: 2, rotateY: 2, scale: 1.02, duration: 0.3, ease: 'power2.out' });
      
      // Crear Partículas (Efecto sutil)
      for(let i=0; i<6; i++) {
        const p = createParticleElement(Math.random() * el.clientWidth, Math.random() * el.clientHeight, DEFAULT_GLOW_COLOR);
        el.appendChild(p);
        gsap.to(p, {
            y: "-=50", opacity: 0, duration: 1 + Math.random(),
            onComplete: () => p.remove()
        });
      }
    };

    const handleMouseLeave = () => {
      isHovered.current = false;
      gsap.to(el, { rotateX: 0, rotateY: 0, scale: 1, x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    };

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Magnetismo suave
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      gsap.to(el, {
        x: (x - centerX) * 0.05,
        y: (y - centerY) * 0.05,
        rotateX: ((y - centerY) / centerY) * -3, // Tilt suave
        rotateY: ((x - centerX) / centerX) * 3,
        duration: 0.1
      });
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mousemove', handleMouseMove);
    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      onClick={onClick}
      className={`magic-card relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl group cursor-pointer transition-colors ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        '--glow-color': DEFAULT_GLOW_COLOR
      }}
    >
      {/* Borde Brillante Dinámico */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(400px circle at var(--glow-x) var(--glow-y), rgba(${DEFAULT_GLOW_COLOR}, 0.15), transparent 40%)`
        }}
      />
      <div 
        className="absolute inset-0 z-0 rounded-2xl"
        style={{
          border: '1px solid transparent',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          background: `radial-gradient(200px circle at var(--glow-x) var(--glow-y), rgba(${DEFAULT_GLOW_COLOR}, 0.5), transparent 60%) border-box`,
          opacity: 'var(--glow-intensity, 0)'
        }}
      />

      {/* Contenido Real */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};