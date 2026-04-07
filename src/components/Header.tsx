import { useState, useEffect } from 'react';
import { Menu as MenuIcon, X, Phone, Instagram } from 'lucide-react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';


export const Header = () => {
  const [isScrolled, setIsScrolled]       = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on('change', (v) => setIsScrolled(v > 60));
  }, [scrollY]);

  const navItems = [
    { label: 'Le Menu',   href: '/menu',      external: true  },
    { label: "L'Atelier", href: '/#our-story',  external: false },
    { label: 'Contact',   href: '/#contact',  external: false },
  ];

  return (
    <header
      id="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#FAF7F4]/90 backdrop-blur-xl py-3 border-b border-[#A64B2A]/10 shadow-[0_2px_24px_rgba(166,75,42,0.06)]'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link 
          to="/" 
          id="nav-logo" 
          className="flex items-center group" 
          aria-label="madélina — Accueil"
          onClick={(e) => {
            if (window.location.pathname === '/' || window.location.pathname === '/madelina-coffeev5/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <div className="relative transition-transform duration-500 group-hover:scale-105 h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden bg-white shadow-sm border border-[#A64B2A]/20 flex items-center justify-center">
            <img
              src="/madelina-coffeev5/logos/logo_madelina-4.png"
              alt="madélina par Haifa Ben Salem"
              className="w-full h-full object-cover scale-[1.45]"
            />
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-10" aria-label="Navigation principale">
          {navItems.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
            >
              <Link
                to={item.href}
                id={`nav-${item.label.toLowerCase().replace(/\W+/g, '-')}`}
                className="relative text-[11px] uppercase tracking-[0.2em] font-medium text-[#2A2118] hover:text-[#A64B2A] transition-colors duration-300 group"
              >
                {item.label}
                <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-[#A64B2A] transition-all duration-500 group-hover:w-full" />
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* ── CTA ── */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://www.instagram.com/madelina_bizerte/"
            target="_blank"
            rel="noopener noreferrer"
            id="nav-instagram"
            className="flex items-center justify-center bg-[#A64B2A]/10 text-[#A64B2A] rounded-full w-9 h-9 hover:bg-[#A64B2A] hover:text-white transition-all shadow-sm"
            aria-label="Instagram"
          >
            <Instagram size={16} strokeWidth={1.5} />
          </a>
          <motion.a
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            href="tel:72413676"
            id="nav-phone-btn"
            className="btn-primary flex items-center gap-2 text-[12px] px-5 py-2.5"
          >
            <Phone size={14} strokeWidth={1.5} />
            72 413 676
          </motion.a>
        </div>

        {/* ── Mobile Toggle ── */}
        <button
          id="nav-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-[#2A2118] hover:text-[#A64B2A] transition-colors"
          aria-label="Ouvrir le menu"
        >
          {isMobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <MenuIcon size={22} strokeWidth={1.5} />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FAF7F4] border-b border-[#A64B2A]/10 overflow-hidden"
          >
            <div className="px-6 py-10 flex flex-col gap-7">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-serif text-[#2A2118] hover:text-[#A64B2A] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-[#A64B2A]/10 my-2" />
              <a href="tel:72413676" className="flex items-center gap-2 text-[#A64B2A] font-medium">
                <Phone size={16} strokeWidth={1.5} />
                72 413 676
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
