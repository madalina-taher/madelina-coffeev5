import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeInUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Arched window icon divider (logo mark) ─────────────────── */
const ArchDivider = () => (
  <div className="flex items-center justify-center gap-6 my-4">
    <span className="h-px flex-1 bg-[#A64B2A] opacity-20" />
    <svg width="28" height="36" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 130 V52 Q10 10 50 10 Q90 10 90 52 V130 Z" stroke="#A64B2A" strokeWidth="5" fill="none"/>
      <path d="M26 118 V56 Q26 24 50 24 Q74 24 74 56 V118" stroke="#A64B2A" strokeWidth="2.5" fill="none"/>
      <line x1="10" y1="74" x2="90" y2="74" stroke="#A64B2A" strokeWidth="2.5"/>
      <line x1="50" y1="74" x2="50" y2="130" stroke="#A64B2A" strokeWidth="2.5"/>
      <path d="M50 42 Q44 30 36 34 Q38 44 50 42 Z" stroke="#A64B2A" strokeWidth="2" fill="none"/>
      <path d="M50 42 Q56 30 64 34 Q62 44 50 42 Z" stroke="#A64B2A" strokeWidth="2" fill="none"/>
      <line x1="50" y1="26" x2="50" y2="43" stroke="#A64B2A" strokeWidth="2"/>
    </svg>
    <span className="h-px flex-1 bg-[#A64B2A] opacity-20" />
  </div>
);

/* ─── Stat pill ─────────────────────────────────────────────── */
const Stat = ({ number, label }: { number: string; label: string }) => (
  <div className="text-center flex-1 sm:flex-none">
    <p style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', color: '#A64B2A', lineHeight: 1 }}>{number}</p>
    <p className="text-[9px] sm:text-[10px]" style={{ fontFamily: '"Inter",sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7A6A5A', marginTop: '0.4rem' }}>{label}</p>
  </div>
);

export const OurStory = () => {
  return (
    <section
      id="our-story"
      style={{ background: '#F2E9E1', padding: '7rem 0', overflow: 'hidden' }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">

        {/* ── Section label + heading ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span style={{ fontFamily: '"Inter",sans-serif', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A64B2A', fontWeight: 500 }}>
            Notre Histoire
          </span>
          <h2 style={{ fontFamily: '"Allenoire",Georgia,serif', fontSize: 'clamp(1.75rem, 6vw, 3.8rem)', color: '#2A2118', marginTop: '1rem', lineHeight: 1.25 }}>
            Plus qu'un Café,
            <br className="hidden sm:block" />
            <span style={{ color: '#A64B2A' }}> Une Galerie de Saveurs</span>
          </h2>
          <ArchDivider />
        </motion.div>

        {/* ── Two-column content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left — image with floating elements */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative p-2 md:p-3 bg-white rounded-[2.5rem] shadow-[0_24px_80px_rgba(42,33,24,0.08)] border border-[#A64B2A]/10">
              <div className="img-hover rounded-[2rem] overflow-hidden">
                <img
                  src="https://i.ibb.co/7xFdCVrx/unnamed-14.jpg"
                  alt="madélina — pâtisserie artisanale et café"
                  className="w-full aspect-[3/4] object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Floating badge top-right */}
            <motion.div
              className="absolute -top-3 right-0 sm:-top-6 sm:-right-6 w-[6.5rem] h-[6.5rem] sm:w-[8rem] sm:h-[8rem] flex flex-col items-center justify-center bg-[#A64B2A] text-[#F2E9E1] rounded-full border-[3px] border-[#FAF7F4] shadow-[0_8px_32px_rgba(166,75,42,0.35)] z-10 p-3 animate-float"
            >
              <span style={{ fontFamily: '"Inter",sans-serif', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.4, textAlign: 'center' }}>
                L’Art<br />de Créer
              </span>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="absolute -bottom-8 w-[94%] left-[3%] sm:w-auto sm:left-1/2 sm:-translate-x-1/2 bg-[#FAF7F4] rounded-[1.25rem] p-4 sm:p-5 flex items-center justify-around sm:justify-center sm:gap-8 shadow-[0_12px_48px_rgba(42,33,24,0.10)] z-10 whitespace-nowrap"
            >
              <Stat number="100%" label="Fait maison" />
              <div className="w-px h-8 bg-[#A64B2A]/15 hidden sm:block" />
              <Stat number="4.8★" label="Note Google" />
              <div className="w-px h-8 bg-[#A64B2A]/15 hidden sm:block" />
              <Stat number="∞" label="Saveurs" />
            </motion.div>
          </motion.div>

          {/* Right — text */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ paddingTop: '3rem' }}
          >
            <p style={{ fontFamily: '"Inter",sans-serif', color: '#7A6A5A', fontSize: '1.0625rem', lineHeight: 1.85, marginBottom: '1.75rem' }}>
              Haifa Ben Salem a imaginé madélina comme un lieu intime, à mi-chemin entre l'atelier parisien et la chaleur du foyer tunisien — un endroit où chaque création est pensée avec soin, des ingrédients jusqu'à la présentation.
            </p>
            <p style={{ fontFamily: '"Inter",sans-serif', color: '#7A6A5A', fontSize: '1.0625rem', lineHeight: 1.85, marginBottom: '2.5rem' }}>
              Nos pâtisseries portent en elles un savoir-faire artisanal qui allie techniques françaises et saveurs du Maghreb, dans une harmonie simple et rare.
            </p>
            {/* Pillars list */}
            <div className="space-y-5">
              {[
                { icon: '✦', title: 'Ingrédients d’exception',      desc: 'Sélectionnés chaque matin avec soin et passion.' },
                { icon: '✦', title: 'Le geste juste, chaque fois',    desc: 'Chaque pâtisserie est façonnée à la main, sans compromis.' },
                { icon: '✦', title: 'Une ambiance qui vous accueille', desc: 'Un espace pensé pour le calme, la beauté et le partage.' },
              ].map((p) => (
                <div key={p.title} className="flex items-start gap-4">
                  <span style={{ color: '#A64B2A', fontSize: '0.75rem', marginTop: '0.3rem', flexShrink: 0 }}>{p.icon}</span>
                  <div>
                    <p style={{ fontFamily: '"Playfair Display",serif', fontSize: '1rem', color: '#2A2118', marginBottom: '0.2rem' }}>{p.title}</p>
                    <p style={{ fontFamily: '"Inter",sans-serif', fontSize: '0.875rem', color: '#7A6A5A', lineHeight: 1.6 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 relative z-20 flex flex-wrap gap-3 sm:justify-start lg:justify-end">
              <a
                href="/madelina-coffeev5/#contact"
                id="story-contact-btn"
                className="btn-primary inline-flex"
              >
                Nous Trouver
              </a>
              <Link
                to="/menu"
                id="story-menu-btn"
                className="btn-outline inline-flex items-center gap-2"
              >
                <span>La Carte</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
