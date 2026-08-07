import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'motion/react'; // Ajustado a motion/react según tu setup anterior
import { useNavigate } from 'react-router-dom';
import { Menu, X, Bot, Bell, ShieldCheck, PieChart, TrendingUp, ArrowRight, CheckCircle, Smartphone } from 'lucide-react';

// 1. IMPORTAMOS EL MARQUEE
import { ThreeDMarquee } from '../components/ui/ThreeDMarquee';

// --- IMÁGENES DE MUESTRA (Idealmente reemplaza estas con screenshots de tu App) ---
const sampleImages = [
    "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
    "https://assets.aceternity.com/animated-modal.png",
    "https://assets.aceternity.com/animated-testimonials.webp",
    "https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png",
    "https://assets.aceternity.com/github-globe.png",
    "https://assets.aceternity.com/glare-card.png",
    "https://assets.aceternity.com/layout-grid.png",
    "https://assets.aceternity.com/flip-text.png",
    "https://assets.aceternity.com/hero-highlight.png",
    "https://assets.aceternity.com/carousel.webp",
    "https://assets.aceternity.com/placeholders-and-vanish-input.png",
    "https://assets.aceternity.com/shooting-stars-and-stars-background.png",
    "https://assets.aceternity.com/signup-form.png",
    "https://assets.aceternity.com/cloudinary_bkp/stars_sxle3d.png",
    "https://assets.aceternity.com/spotlight-new.webp",
    "https://assets.aceternity.com/cloudinary_bkp/Spotlight_ar5jpr.png",
    "https://assets.aceternity.com/cloudinary_bkp/Parallax_Scroll_pzlatw_anfkh7.png",
    "https://assets.aceternity.com/tabs.png",
    "https://assets.aceternity.com/cloudinary_bkp/Tracing_Beam_npujte.png",
    "https://assets.aceternity.com/cloudinary_bkp/typewriter-effect.png",
    "https://assets.aceternity.com/glowing-effect.webp",
    "https://assets.aceternity.com/hover-border-gradient.png",
    "https://assets.aceternity.com/cloudinary_bkp/Infinite_Moving_Cards_evhzur.png",
    "https://assets.aceternity.com/cloudinary_bkp/Lamp_hlq3ln.png",
    "https://assets.aceternity.com/macbook-scroll.png",
    "https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png",
    "https://assets.aceternity.com/cloudinary_bkp/Moving_Border_yn78lv.png",
    "https://assets.aceternity.com/multi-step-loader.png",
    "https://assets.aceternity.com/vortex.png",
    "https://assets.aceternity.com/wobble-card.png",
    "https://assets.aceternity.com/world-map.webp",
];

// --- VARIANTES Y COMPONENTES AUXILIARES (Igual que antes) ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
};

const MagneticButton = ({ children, className, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative overflow-hidden px-8 py-4 rounded-full font-mono text-sm uppercase tracking-wider transition-all duration-300 ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <motion.div className="absolute inset-0 bg-white/20" initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.5 }} />
    </motion.button>
  );
};

const BentoCard = ({ title, subtitle, tag, icon: Icon, size = "md" }) => {
    const sizeClasses = { sm: "col-span-1 row-span-1", md: "col-span-1 md:col-span-2 row-span-1", lg: "col-span-1 md:col-span-1 row-span-2" };
    return (
      <motion.div variants={fadeInUp} whileHover="hover" className={`group relative overflow-hidden bg-finix-gray rounded-2xl border border-white/5 p-8 flex flex-col justify-between ${sizeClasses[size]}`}>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />
        <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 rotate-12">{Icon && <Icon size={120} />}</div>
        <div className="z-10 relative">
          <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] font-mono text-finix-orange border border-finix-orange/30 rounded-full bg-finix-orange/5"><div className="w-1.5 h-1.5 rounded-full bg-finix-orange animate-pulse" />{tag}</span>
          <h3 className="font-sans text-2xl font-bold text-white mb-3 group-hover:text-finix-orange transition-colors duration-300">{title}</h3>
          <p className="font-body text-finix-light/70 text-sm leading-relaxed max-w-sm">{subtitle}</p>
        </div>
        <motion.div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" initial={{ x: -10 }} whileHover={{ x: 0 }}><div className="bg-finix-orange rounded-full p-2 text-black"><ArrowRight size={16} /></div></motion.div>
      </motion.div>
    );
  };

const PriceCard = ({ title, price, features, recommended = false }) => (
  <motion.div variants={fadeInUp} className={`relative p-8 rounded-2xl border ${recommended ? 'border-finix-orange bg-finix-gray' : 'border-white/10 bg-transparent'} flex flex-col gap-6`}>
    {recommended && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-finix-orange text-black px-4 py-1 rounded-full text-xs font-bold font-mono uppercase">Más Popular</div>}
    <div><h3 className="font-sans text-xl font-bold text-white mb-2">{title}</h3><div className="flex items-end gap-1"><span className="text-4xl font-black text-white">{price}</span><span className="text-finix-light/50 text-sm mb-1">/mes</span></div></div>
    <ul className="flex flex-col gap-4">{features.map((feat, i) => (<li key={i} className="flex items-center gap-3 text-sm text-finix-light/80"><CheckCircle size={16} className={recommended ? "text-finix-orange" : "text-white/30"} />{feat}</li>))}</ul>
    <button className={`w-full py-3 rounded-lg font-bold text-sm transition-colors ${recommended ? 'bg-finix-orange text-black hover:bg-orange-400' : 'bg-white/5 text-white hover:bg-white/10'}`}>Elegir Plan</button>
  </motion.div>
);

// --- PÁGINA PRINCIPAL ---

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroRef = useRef(null);
  
  // Mouse Spring effect (Opcional, se mantiene sutil)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 200 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div className="min-h-screen bg-finix-dark text-finix-light selection:bg-finix-orange selection:text-white overflow-x-hidden">

      {/* --- NAVBAR --- */}
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-finix-dark/60 backdrop-blur-xl border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <motion.img initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} src="/logo-finix2.png" alt="Finix Logo" className="h-14 w-auto object-contain" />
        </div>
        <div className="hidden md:flex gap-8 font-mono text-xs items-center font-medium text-white/70">
          {['Características', 'Proceso', 'Precios'].map((item, i) => (
            <motion.a initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + (i * 0.1) }} key={item} href={`#${item.toLowerCase()}`} className="hover:text-finix-orange transition-colors relative group">{item}<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-finix-orange transition-all duration-300 group-hover:w-full"></span></motion.a>
          ))}
          <div className="flex gap-4 ml-4">
            <MagneticButton onClick={() => navigate('/login')} className="bg-white/5 border border-white/10 hover:bg-white hover:text-finix-black">Login</MagneticButton>
            <MagneticButton onClick={() => navigate('/register')} className="bg-finix-orange text-finix-black font-bold">Empezar</MagneticButton>
          </div>
        </div>
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-40 bg-finix-dark pt-32 px-10 flex flex-col gap-8 border-l border-white/10">
            <button onClick={() => navigate('/login')} className="text-4xl font-bold font-sans text-left text-white/50">Login</button>
            <button onClick={() => navigate('/register')} className="text-4xl font-bold font-sans text-left text-finix-orange">Crear Cuenta</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION CON 3D MARQUEE --- */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center px-6 md:px-20 pt-20 overflow-hidden" onMouseMove={handleMouseMove}>
        
        {/* === AQUI COMIENZA EL CAMBIO DE FONDO === */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            {/* 1. Contenedor del Marquee con Opacidad Controlada */}
            <div className="absolute inset-0 opacity-200 scale-110"> 
                {/* scale-110 ayuda a que los bordes del 3d no se vean cortados si la pantalla es grande */}
                <ThreeDMarquee images={sampleImages} className="h-full w-full" />
            </div>

            {/* 2. Capa oscura para legibilidad del texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-finix-dark via-finix-dark/45 to-finix-dark/40" />
            
            {/* 3. Viñeta Radial para centrar la atención */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0f172a_100%)]" />
        </div>
        {/* === FIN CAMBIO DE FONDO === */}


        {/* Luz del Mouse */}
        <motion.div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen" style={{ background: useTransform([mouseXSpring, mouseYSpring], ([x, y]) => `radial-gradient(800px circle at ${x}px ${y}px, rgba(255, 107, 0, 0.1), transparent 70%)`) }} />

        {/* Contenido Hero (Texto y botones) */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ y: yHero }} className="z-20 max-w-6xl relative mx-auto md:mx-0">
          <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-finix-orange shadow-[0_0_10px_#FF6B00]"></div>
            <span className="font-mono text-finix-orange text-sm tracking-[0.2em] uppercase font-bold">Finanzas Personales 2.0</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="font-sans text-6xl md:text-9xl font-black leading-[0.9] mb-8 tracking-tight">
            DEL CAOS AL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-finix-orange to-orange-400">ORDEN</span> VISUAL.
          </motion.h1>

          <motion.p variants={fadeInUp} className="font-body text-xl md:text-2xl text-finix-light/70 max-w-2xl mb-12 leading-relaxed font-light">
            Centraliza tus ingresos, recibe alertas y toma decisiones con <strong className="text-white font-bold">Inteligencia Artificial</strong>.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6">
            <MagneticButton onClick={() => navigate('/register')} className="bg-finix-orange text-black font-bold px-10 py-5 text-lg">Empezar Gratis Ahora</MagneticButton>
            <MagneticButton className="border border-white/20 hover:bg-white/10 flex items-center gap-3 backdrop-blur-md px-8"><Bot size={20} className="text-finix-orange" /> Demo con IA</MagneticButton>
          </motion.div>
        </motion.div>
      </section>

      {/* --- CINTA MARQUEE --- */}
      <div className="relative z-30 py-6 bg-finix-orange overflow-hidden border-y-4 border-finix-dark rotate-1 scale-105 shadow-2xl">
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 15 }} className="flex whitespace-nowrap gap-16">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 opacity-90">
              <ShieldCheck className="text-black stroke-[3px]" size={32} />
              <span className="font-sans text-4xl font-black text-black uppercase tracking-tighter">EDUCACIÓN FINANCIERA</span>
              <span className="font-serif italic text-4xl text-black font-bold">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* --- SECCIÓN: CÓMO FUNCIONA --- */}
      <section id="proceso" className="py-24 px-6 md:px-20 bg-finix-dark relative z-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
          <h2 className="font-sans text-4xl md:text-5xl font-bold mb-4">¿CÓMO <span className="text-finix-orange">FUNCIONA?</span></h2>
          <p className="text-finix-light/60">Toma el control en tres pasos simples.</p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{ icon: Smartphone, title: "1. Conecta", desc: "Registra tus cuentas o ingresa gastos manualmente en segundos." }, { icon: Bot, title: "2. Analiza", desc: "Nuestra IA detecta patrones y te alerta sobre gastos hormiga." }, { icon: TrendingUp, title: "3. Optimiza", desc: "Establece metas y observa cómo crece tu patrimonio." }].map((step, i) => (
            <motion.div key={i} variants={fadeInUp} className="flex flex-col items-center text-center p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-finix-orange/30 transition-colors">
              <div className="w-16 h-16 bg-finix-orange/10 rounded-full flex items-center justify-center text-finix-orange mb-4"><step.icon size={32} /></div>
              <h3 className="font-bold text-xl text-white mb-2">{step.title}</h3>
              <p className="text-sm text-finix-light/60">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- CARACTERÍSTICAS Y PRECIOS (Resto del código igual) --- */}
      <section id="características" className="py-24 px-6 md:px-20 bg-finix-dark relative z-20">
         {/* ... (Tu código de Bento Grid va aquí, lo he resumido para brevedad ya que no cambia) ... */}
         <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mb-24">
          <motion.h2 variants={fadeInUp} className="font-sans text-5xl md:text-7xl font-bold mb-8 leading-none">TECNOLOGÍA PARA <br /><span className="text-finix-orange font-serif italic">TU LIBERTAD.</span></motion.h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 md:h-[800px]">
          <BentoCard size="lg" tag="Visualización" title="Dashboard Interactivo" subtitle="Gráficos dinámicos de ingresos vs. egresos." icon={PieChart} />
          <BentoCard size="md" tag="Inteligencia Artificial" title="Tu Asistente Financiero" subtitle="Consulta en lenguaje natural." icon={Bot} />
          <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} className="col-span-1 row-span-1 bg-gradient-to-br from-[#1a1a1a] to-black rounded-2xl border border-white/10 p-8 flex flex-col justify-between group hover:border-red-500/50 transition-colors relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5"></div>
            <div className="flex justify-between items-start z-10"><div className="p-3 bg-red-500/10 rounded-full text-red-500"><Bell size={28} /></div><div className="flex items-center gap-2"><span className="text-[10px] font-mono text-red-500 animate-pulse">LIVE</span><div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_red]"></div></div></div>
            <div className="z-10"><p className="font-mono text-xs text-red-400 mb-2 tracking-widest">WORKFLOWS N8N</p><h3 className="font-sans text-2xl font-bold text-white mb-2">Alertas Proactivas</h3><p className="text-sm text-white/50">Te avisamos antes de que excedas tu presupuesto.</p></div>
          </motion.div>
          <BentoCard size="sm" tag="Crecimiento" title="Metas de Ahorro" subtitle="Establece objetivos visuales." icon={TrendingUp} />
        </motion.div>
      </section>

      <section id="precios" className="py-24 px-6 md:px-20 bg-black relative z-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16"><h2 className="font-sans text-4xl font-bold mb-4">PLANES <span className="text-finix-orange">FLEXIBLES</span></h2><p className="text-finix-light/60">Comienza gratis, mejora cuando crezcas.</p></motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PriceCard title="Starter" price="$0" features={['Dashboard Básico', '5 Categorías', 'Exportación CSV']} />
          <PriceCard title="Pro Finix" price="$99" recommended features={['IA Ilimitada', 'Alertas WhatsApp', 'Presupuestos Infinitos', 'Soporte 24/7']} />
          <PriceCard title="Empresas" price="$399" features={['Multi-usuario', 'API Access', 'Gestor Dedicado', 'Reportes Fiscales']} />
        </motion.div>
      </section>

      <section className="py-32 px-6 flex flex-col items-center justify-center bg-finix-orange text-black text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/backgroundLnPage.png')] opacity-10 mix-blend-multiply bg-cover bg-center"></div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="z-10">
          <h2 className="font-sans text-5xl md:text-7xl font-black mb-6">TOMA EL CONTROL HOY.</h2>
          <p className="font-body text-xl max-w-2xl mx-auto mb-10 font-bold opacity-80">Deja de adivinar a dónde se va tu dinero. Únete a los más de 10,000 usuarios que confían en Finix.</p>
          <button onClick={() => navigate('/register')} className="bg-black text-white px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl">Crear Cuenta Gratis</button>
        </motion.div>
      </section>

      <footer className="py-10 text-center font-mono text-[10px] text-white/20 uppercase tracking-widest bg-finix-dark">© 2026 Finix App. All Systems Operational.</footer>
    </div>
  );
};

export default LandingPage;