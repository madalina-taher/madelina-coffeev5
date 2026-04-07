import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  const { scrollY } = useScroll();
  const bgY     = useTransform(scrollY, [0, 600], [0, 160]);
  const opacity = useTransform(scrollY, [0, 350], [1, 0]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: '#FAF7F4' }}
    >
      {/* ── Parallax hero image ── */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
        <img
          src="https://i.ibb.co/NdDBpDYh/11.jpg"
          alt="L'Atelier madélina — Pâtisserie artisanale"
          className="w-full h-full object-cover scale-110"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(250,247,244,0.97) 0%, rgba(250,247,244,0.82) 50%, rgba(250,247,244,0.10) 100%)',
          }}
        />
      </motion.div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-16 sm:pt-28 pb-20 flex items-center justify-between">

        {/* Left — text */}
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-4 text-[10px] uppercase tracking-[0.3em] text-[#A64B2A] font-medium"
          >
            <span className="w-6 h-px bg-[#A64B2A]" />
            L&rsquo;Art de Vivre à Bizerte
            <span className="w-6 h-px bg-[#A64B2A]" />
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-allenoire mb-8 leading-[0.92] whitespace-nowrap"
            style={{ fontSize: 'clamp(2.2rem, 5.5vw, 5rem)', color: '#2A2118' }}
          >
            Fait{' '}
            <span style={{ color: '#A64B2A' }}>
              maison
            </span>
            <br />
            Fait avec le{' '}
            <span style={{ color: '#A64B2A' }}>
              cœur
            </span>
            <br />
            Fait pour{' '}
            <span style={{ color: '#A64B2A' }}>
              vous
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.65 }}
            className="text-lg leading-relaxed mb-12 text-balance"
            style={{ color: '#7A6A5A', maxWidth: '36rem' }}
          >
            Une pâtisserie artisanale, du café bien fait et des brunchs généreux, voilà l&rsquo;esprit madélina.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/menu" id="hero-menu-btn" className="btn-primary">
              Découvrir le Menu
            </Link>
            <Link to="/#contact" id="hero-reserve-btn" className="btn-outline">
              Réserver une Table
            </Link>
          </motion.div>
        </div>

        {/* Right — real sticker badge PNG */}
        <div className="hidden lg:flex flex-col items-center gap-8 pr-8">
          {/* Floating sticker badge — real brand asset */}
          <motion.div
            className="select-none relative animate-float"
          >
            <div className="absolute inset-0 rounded-full border border-[#A64B2A]/20 scale-105" />
            <img
              src="/madelina-coffeev5/logos/logo_madelina-4.png"
              alt="madélina — Fait maison. Fait avec le cœur."
              className="w-56 h-56 object-cover rounded-full shadow-[0_16px_40px_rgba(166,75,42,0.25)] border-[6px] border-white/60 bg-white"
            />
          </motion.div>

          {/* Glass rating card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="glass-card rounded-2xl px-6 py-4 flex items-center gap-4"
          >
            <span style={{ fontFamily: '"Playfair Display",serif', fontSize: '2rem', color: '#A64B2A', lineHeight: 1 }}>4.8</span>
            <div>
              <p style={{ fontFamily: '"Inter",sans-serif', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#7A6A5A' }}>Google Rating</p>
              <p style={{ fontFamily: '"Playfair Display",serif', fontSize: '0.875rem', color: '#2A2118' }}>Excellent</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer animate-bounce"
        onClick={() => document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span style={{ fontFamily: '"Inter",sans-serif', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(42,33,24,0.35)' }}>
          Découvrir
        </span>
        <ArrowDown size={14} color="#A64B2A" strokeWidth={1.5} />
      </motion.div>
    </section>
  );
};
