import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  id: string;
  category: string;
  title: string;
  price: number;
  image?: string;
  description?: string;
}

// ── Parse menu-data.html fragment → MenuItem[] ──
function parseMenuHTML(html: string): MenuItem[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const container = doc.querySelector('#menu-container');
  if (!container) return [];

  const items: MenuItem[] = [];
  container.querySelectorAll('.menu-item').forEach(div => {
    items.push({
      id: div.id,
      category: div.getAttribute('data-category') || '',
      title: div.querySelector('.item-title')?.textContent || '',
      price: parseFloat(div.querySelector('.item-price')?.textContent || '0') || 0,
      image: div.querySelector('.item-image')?.getAttribute('src') || '',
      description: div.querySelector('.item-description')?.textContent || '',
    });
  });
  return items;
}


// ── Local / GitHub Pages URL ──
// We use the deployed file on GitHub Pages to avoid the 5-minute cache of raw.githubusercontent.com
const MENU_RAW_URL = '/madelina-coffeev5/menu-data.html';

export const Menu = ({ isPreview = false }: { isPreview?: boolean }) => {
  const [plats, setPlats] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Instant category switch — no blocking at all
  const handleCategoryChange = (cat: string) => {
    if (activeCategory === cat) return;
    setActiveCategory(cat);
  };

  // Fetch menu-data.html from GitHub Raw API on mount
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${MENU_RAW_URL}?t=${Date.now()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        const items = parseMenuHTML(html);
        setPlats(items);
      } catch (e) {
        console.error('Failed to load menu:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const categories = Array.from(new Set(plats.map(item => item.category))) as string[];

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // Force hardcore prefetch of ALL images natively into browser RAM cache in background
  useEffect(() => {
    if (!plats || plats.length === 0) return;
    const timer = setTimeout(() => {
      plats.forEach((item: MenuItem) => {
        if (item.image) {
          const img = new Image();
          img.src = item.image;
        }
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [plats]);

  if (loading) {
    return (
      <section id="menu" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="flex flex-col items-center animate-fadeIn">
              <div className="w-8 h-8 border-4 border-madelina-terracotta/20 border-t-madelina-terracotta rounded-full animate-spin mb-4"></div>
              <div className="font-display text-madelina-navy/40">Chargement...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className={`section-padding bg-white relative overflow-hidden ${isPreview ? 'pt-0 pb-10' : ''}`}>
      {!isPreview && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-[0.02] flex items-center justify-center">
          <span className="text-[30vw] font-display whitespace-nowrap select-none">MADELINA</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {!isPreview && (
          <div className="text-center mb-20 px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl mb-6 font-allenoire text-madelina-navy"
            >
              La carte <span className="text-madelina-terracotta font-allenoire">madélina</span>
            </motion.h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 100 }}
              viewport={{ once: true }}
              className="h-1 bg-madelina-terracotta mx-auto mb-10"
            ></motion.div>
          </div>
        )}

        {!isPreview && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-16 px-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`relative px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${
                  activeCategory === cat 
                    ? 'bg-madelina-navy text-white shadow-lg scale-105' 
                    : 'bg-transparent text-madelina-navy hover:text-madelina-terracotta hover:bg-madelina-navy/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

          <div className="px-6">
            <div className="min-h-[50vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {categories.map(cat => {
                  const catItems = isPreview ? plats.filter(item => item.category === cat).slice(0, 3) : plats.filter(item => item.category === cat);
                  return (
                    <div key={cat} className={activeCategory === cat ? "contents" : "hidden"} style={activeCategory === cat ? { animation: 'fadeIn 0.2s ease-out' } : undefined}>
                      {catItems.map((item) => (
                        <div
                          key={item.id}
                          className="group glass-card rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white border border-madelina-terracotta/5"
                        >
                          {/* Skeleton shimmer while image loads */}
                          <div className="relative h-72 overflow-hidden bg-madelina-cream">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              loading="eager"
                              fetchPriority="high"
                              decoding="async"
                              onLoad={e => (e.currentTarget.style.opacity = '1')}
                              style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
                            />
                            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg">
                              <span className="font-bold text-madelina-terracotta tracking-tight">
                                {typeof item.price === 'number' ? item.price.toFixed(1) : item.price} DT
                              </span>
                            </div>
                          </div>
                          <div className="p-8 text-left">
                            <h3 className="text-2xl mb-3 font-display text-madelina-navy group-hover:text-madelina-terracotta transition-colors duration-300">
                              {item.title}
                            </h3>
                            <p className="text-madelina-navy/60 leading-relaxed text-sm mb-6 line-clamp-3">{item.description}</p>
                            <button 
                              onClick={() => setSelectedItem(item)}
                              className="text-[10px] font-bold uppercase tracking-[0.2em] text-madelina-terracotta flex items-center gap-2 hover:translate-x-1.5 transition-transform cursor-pointer"
                            >
                              Détails <span className="text-lg">→</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", bounce: 0.2 }}
              className="bg-white rounded-[2rem] overflow-hidden max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.image && (
                <div className="h-64 overflow-hidden bg-madelina-cream">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    onLoad={e => (e.currentTarget.style.opacity = '1')}
                    style={{ opacity: 0, transition: 'opacity 0.25s ease' }}
                  />
                </div>
              )}
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-3xl font-display text-madelina-navy">{selectedItem.title}</h3>
                  <span className="bg-madelina-terracotta/10 text-madelina-terracotta font-bold px-4 py-2 rounded-full text-sm whitespace-nowrap ml-4">
                    {typeof selectedItem.price === 'number' ? selectedItem.price.toFixed(1) : selectedItem.price} DT
                  </span>
                </div>
                <p className="text-sm text-madelina-navy/40 uppercase tracking-widest font-bold mb-4">{selectedItem.category}</p>
                {selectedItem.description && (
                  <p className="text-madelina-navy/70 leading-relaxed mb-6">{selectedItem.description}</p>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-full py-3 bg-madelina-navy text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-madelina-terracotta transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};