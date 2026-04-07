import { Hero }     from '../components/Hero';
import { OurStory } from '../components/OurStory';
import { Menu }     from '../components/Menu';
import { Reviews }  from '../components/Reviews';
import { ContactForm } from '../components/ContactForm';
import { Link }     from 'react-router-dom';
import { motion }   from 'framer-motion';

export const Home = () => {
  return (
    <main className="flex-grow">
      <Hero />

      {/* ── Our Story ── */}
      <OurStory />

      {/* ── Menu Preview ── */}
      <section
        id="menu"
        style={{ background: '#FAF7F4', padding: '7rem 1.5rem', textAlign: 'center' }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* label */}
            <span style={{ fontFamily: '"Inter",sans-serif', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A64B2A', fontWeight: 500 }}>
              Notre Carte
            </span>

            {/* heading */}
            <h2 style={{ fontFamily: '"Playfair Display",Georgia,serif', fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: '#2A2118', marginTop: '1rem', marginBottom: '1rem', lineHeight: 1.1 }}>
              Découvrez notre Menu
            </h2>

            {/* arch line divider */}
            <div className="flex items-center justify-center gap-5 mb-10">
              <span className="h-px w-16 bg-[#A64B2A] opacity-20" />
              <svg width="20" height="26" viewBox="0 0 100 130" fill="none" aria-hidden="true">
                <path d="M10 130 V52 Q10 10 50 10 Q90 10 90 52 V130 Z" stroke="#A64B2A" strokeWidth="6" fill="none"/>
                <line x1="10" y1="72" x2="90" y2="72" stroke="#A64B2A" strokeWidth="3"/>
                <line x1="50" y1="72" x2="50" y2="130" stroke="#A64B2A" strokeWidth="3"/>
              </svg>
              <span className="h-px w-16 bg-[#A64B2A] opacity-20" />
            </div>

            <p style={{ fontFamily: '"Inter",sans-serif', color: '#7A6A5A', maxWidth: '36rem', margin: '0 auto 3rem', lineHeight: 1.75, fontSize: '1.0625rem' }}>
              Pâtisseries fines, café d'exception et brunchs gourmands.
              Consultez notre carte complète en ligne.
            </p>
          </motion.div>

          <Menu isPreview={true} />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-14"
          >
            <Link to="/menu" id="home-full-menu-btn" className="btn-primary inline-flex">
              Voir la Carte Complète
            </Link>
          </motion.div>
        </div>
      </section>

      <Reviews />
      <ContactForm />
    </main>
  );
};
