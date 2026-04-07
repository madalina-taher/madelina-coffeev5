import { MapPin, Clock, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const infoItems = [
  {
    icon: <MapPin size={18} strokeWidth={1.5} />,
    label: 'Adresse',
    value: 'Sidi Salem, Bizerte, Tunisie',
  },
  {
    icon: <Phone size={18} strokeWidth={1.5} />,
    label: 'Téléphone',
    value: '72 413 676',
    href: 'tel:72413676',
  },
  {
    icon: <Clock size={18} strokeWidth={1.5} />,
    label: 'Horaires',
    value: '07:00 — 23:00 · Tous les jours',
  },
];

export const ContactForm = () => (
  <section
    id="contact"
    style={{ background: '#F2E9E1', padding: '7rem 1.5rem', position: 'relative', overflow: 'hidden' }}
  >
    {/* background circle accent */}
    <div
      style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '56rem', height: '56rem',
        background: 'rgba(166,75,42,0.04)',
        borderRadius: '9999px',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }}
    />

    <div className="max-w-7xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        {/* ── Left: info ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <span style={{ fontFamily: '"Inter",sans-serif', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A64B2A', fontWeight: 500 }}>
            Nous Trouver
          </span>

          <h2 style={{ fontFamily: '"Allenoire",serif', fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#2A2118', marginTop: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.1 }}>
            Venez nous
            <br />
            <span style={{ color: '#A64B2A' }}>Rendre Visite</span>
          </h2>

          {/* divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <span style={{ height: '1px', width: '3rem', background: '#A64B2A', opacity: 0.25 }} />
            <svg width="16" height="21" viewBox="0 0 100 130" fill="none" aria-hidden="true">
              <path d="M10 130 V52 Q10 10 50 10 Q90 10 90 52 V130 Z" stroke="#A64B2A" strokeWidth="7" fill="none" opacity="0.4"/>
            </svg>
            <span style={{ height: '1px', flex: 1, background: '#A64B2A', opacity: 0.25 }} />
          </div>

          <p style={{ fontFamily: '"Inter",sans-serif', color: '#7A6A5A', fontSize: '1.0625rem', lineHeight: 1.8, maxWidth: '30rem', marginBottom: '2.5rem' }}>
            Une commande spéciale, une réservation ou simplement l&rsquo;envie de partager un moment gourmand ? Passez nous voir ou appelez-nous.
          </p>

          {/* Info cards */}
          <div className="space-y-4">
            {infoItems.map((item) => (
              <div
                key={item.label}
                id={`contact-${item.label.toLowerCase()}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '1.25rem 1.5rem',
                  background: '#FAF7F4',
                  borderRadius: '1rem',
                  border: '1px solid rgba(166,75,42,0.1)',
                }}
              >
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'rgba(166,75,42,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A64B2A', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontFamily: '"Inter",sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(42,33,24,0.4)', marginBottom: '0.2rem' }}>{item.label}</p>
                  {item.href
                    ? <a href={item.href} style={{ fontFamily: '"Inter",sans-serif', fontSize: '0.9375rem', color: '#2A2118', fontWeight: 500 }}>{item.value}</a>
                    : <p style={{ fontFamily: '"Inter",sans-serif', fontSize: '0.9375rem', color: '#2A2118', fontWeight: 500 }}>{item.value}</p>
                  }
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: '2.5rem' }}>
            <a
              href="tel:72413676"
              id="contact-call-btn"
              className="btn-primary inline-flex"
            >
              <Phone size={16} strokeWidth={1.5} />
              Appeler Maintenant
            </a>
          </div>
        </motion.div>

        {/* ── Right: Google Map ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          style={{
            borderRadius: '2rem',
            overflow: 'hidden',
            height: '520px',
            boxShadow: '0 24px 80px rgba(42,33,24,0.12)',
            border: '6px solid #FAF7F4',
          }}
          className="group"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3184.862413481232!2d9.87020031530733!3d37.28678007985145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12e31f004e47d6bb%3A0xc204697bd9860a29!2smadelina%20%F0%9F%A7%A1!5e0!3m2!1sen!2stn!4v1711910452000!5m2!1sen!2stn"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localisation madélina — Sidi Salem, Bizerte"
            className="grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
          />
        </motion.div>

      </div>
    </div>
  </section>
);
