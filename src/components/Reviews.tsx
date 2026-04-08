import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const reviews = [
  {
    name: 'Tia Maria',
    text: 'Un endroit magnifique, une décoration soignée et des pâtisseries dignes des plus grands salons parisiens. Le fraisier est à tomber !',
    rating: 5,
    date: 'Il y a 2 mois',
  },
  {
    name: 'Houyem',
    text: "Le meilleur brunch de Bizerte. L'accueil est chaleureux et l'ambiance vintage avec les vinyles est juste parfaite.",
    rating: 5,
    date: 'Il y a 3 semaines',
  },
  {
    name: 'Ahmed B.',
    text: 'Une expérience authentique. On sent le goût du fait maison dans chaque bouchée. Je recommande vivement la tarte au citron.',
    rating: 4,
    date: 'Il y a 1 mois',
  },
];

export const Reviews = () => (
  <section
    id="reviews"
    style={{ background: '#2A2118', paddingTop: '7rem', paddingBottom: '2.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', position: 'relative', overflow: 'hidden' }}
  >
    {/* Subtle ambient glow */}
    <div
      style={{
        position: 'absolute', top: '-12rem', left: '-12rem',
        width: '30rem', height: '30rem',
        background: 'rgba(166,75,42,0.08)', borderRadius: '9999px',
        filter: 'blur(100px)', pointerEvents: 'none',
      }}
    />
    <div
      style={{
        position: 'absolute', bottom: '-12rem', right: '-12rem',
        width: '30rem', height: '30rem',
        background: 'rgba(166,75,42,0.05)', borderRadius: '9999px',
        filter: 'blur(100px)', pointerEvents: 'none',
      }}
    />

    <div className="max-w-7xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>

      {/* Header row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12 mb-20">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "150px" }}
          transition={{ duration: 0.6 }}
        >
          <span style={{ fontFamily: '"Inter",sans-serif', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A64B2A', fontWeight: 500 }}>
            Témoignages
          </span>
          <h2 style={{ fontFamily: '"Allenoire",serif', fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#F2E9E1', marginTop: '0.75rem', lineHeight: 1.1 }}>
            L&rsquo;expérience{' '}
            <span style={{ color: '#A64B2A' }}>madélina</span>
            <br />vue par vous
          </h2>
        </motion.div>

        {/* Rating badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "150px" }}
          transition={{ delay: 0.1, duration: 0.6 }}
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(166,75,42,0.2)',
            borderRadius: '1.5rem',
            padding: '1.5rem 2.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '3rem', color: '#A64B2A', lineHeight: 1 }}>4.8</div>
            <div style={{ fontFamily: '"Inter",sans-serif', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,233,225,0.35)', marginTop: '0.2rem' }}>Sur 5</div>
          </div>
          <div style={{ width: '1px', height: '3rem', background: 'rgba(166,75,42,0.2)' }} />
          <div>
            <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.5rem' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#A64B2A" color="#A64B2A" />
              ))}
            </div>
            <div style={{ fontFamily: '"Inter",sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,233,225,0.4)' }}>Google Reviews</div>
          </div>
        </motion.div>
      </div>

      {/* Review cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review, i) => (
          <motion.article
            key={i}
            id={`review-card-${i + 1}`}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "150px" }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(166,75,42,0.15)',
              borderRadius: '2rem',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              transition: 'background 0.5s, border-color 0.5s',
              cursor: 'default',
            }}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
          >
            {/* Quote icon + date */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'rgba(166,75,42,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Quote size={16} color="#A64B2A" strokeWidth={1.5} />
              </div>
              <span style={{ fontFamily: '"Inter",sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(242,233,225,0.25)' }}>
                {review.date}
              </span>
            </div>

            {/* Text */}
            <p style={{ fontFamily: '"Lora","Playfair Display",serif', fontSize: '1rem', color: 'rgba(242,233,225,0.8)', lineHeight: 1.8, fontStyle: 'italic', flexGrow: 1, marginBottom: '2rem' }}>
              &ldquo;{review.text}&rdquo;
            </p>

            {/* Author + stars */}
            <div style={{ borderTop: '1px solid rgba(166,75,42,0.12)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontFamily: '"Playfair Display",serif', fontSize: '0.975rem', color: '#F2E9E1' }}>{review.name}</p>
                <p style={{ fontFamily: '"Inter",sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,233,225,0.3)', marginTop: '0.15rem' }}>Client vérifié</p>
              </div>
              <div style={{ display: 'flex', gap: '0.2rem' }}>
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={11} fill={j < review.rating ? '#A64B2A' : 'none'} color="#A64B2A" strokeWidth={1.5} />
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);
