import { useState, useEffect, useCallback, memo, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface MenuItem {
  id: string;
  category: string;
  title: string;
  price: number;
  image?: string;
  description?: string;
}

const ORDER = [
  "☕ Boisson chaude",
  "🧃 Boisson fraîche",
  "🥐 Viennoiseries",
  "🍰 Gâteaux et tartes",
  "🍽️ Plats",
  "✨ Autres"
];

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

// ── Cloudinary fetch proxy — serves any image optimized (auto WebP/AVIF, smart compression) ──
const CLOUDINARY_CLOUD = 'dr7xf4gui';
function optimizeImage(url: string | undefined, width = 800): string {
  if (!url) return '';
  if (url.includes('res.cloudinary.com')) return url;
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/fetch/f_auto,q_auto,w_${width},c_limit/${url}`;
}

// Memoized card components — avoid re-renders when category changes
const DrinkCard = memo(({ item, onClick }: { item: MenuItem; onClick: () => void }) => (
  <div
    className="group flex items-center bg-white border border-madelina-terracotta/10 rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    onClick={onClick}
  >
    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 mr-4">
      {item.image ? (
        <img
          src={optimizeImage(item.image, 400)}
          alt={item.title}
          className="w-full h-full object-cover rounded-xl"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      ) : (
        <div className="w-full h-full bg-madelina-navy/5 rounded-xl flex items-center justify-center">
          <span className="text-xl">🍹</span>
        </div>
      )}
    </div>
    <div className="flex-grow min-w-0 pr-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1">
        <h3 className="text-base sm:text-lg font-display text-madelina-navy truncate">{item.title}</h3>
        <span className="font-bold text-sm sm:text-base text-madelina-terracotta whitespace-nowrap">
          {typeof item.price === 'number' ? item.price.toFixed(1) : item.price} DT
        </span>
      </div>
      {item.description && (
        <p className="text-madelina-navy/60 text-xs sm:text-sm line-clamp-2">{item.description}</p>
      )}
    </div>
    <div className="flex-shrink-0 text-madelina-terracotta/30 group-hover:text-madelina-terracotta transition-colors ml-auto mr-2">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
    </div>
  </div>
));

const FoodCard = memo(({ item, onClick }: { item: MenuItem; onClick: () => void }) => (
  <div className="group glass-card rounded-[1.75rem] sm:rounded-[2.5rem] overflow-hidden bg-white border border-madelina-terracotta/5 shadow-sm hover:shadow-2xl transition-shadow duration-300">
    <div className="relative h-40 sm:h-72 overflow-hidden bg-madelina-cream">
      {item.image && (
        <img
          src={optimizeImage(item.image)}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      )}
      <div className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-white/90 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg">
        <span className="font-bold text-[13px] sm:text-base text-madelina-terracotta tracking-tight">
          {typeof item.price === 'number' ? item.price.toFixed(1) : item.price} DT
        </span>
      </div>
    </div>
    <div className="p-4 sm:p-8">
      <h3 className="text-[17px] sm:text-2xl mb-1.5 sm:mb-3 font-display text-madelina-navy group-hover:text-madelina-terracotta transition-colors">{item.title}</h3>
      <p className="text-madelina-navy/60 text-[13px] sm:text-sm mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 leading-snug">{item.description}</p>
      <button
        onClick={onClick}
        className="text-[10px] font-bold uppercase tracking-[0.2em] text-madelina-terracotta flex items-center gap-2 hover:gap-4 transition-all cursor-pointer"
      >
        Détails <span>→</span>
      </button>
    </div>
  </div>
));

// ── Local / GitHub Pages URL ──
// We use the deployed file on GitHub Pages to avoid the 5-minute cache of raw.githubusercontent.com
const MENU_RAW_URL = '/madelina-coffeev5/menu-data.html';

const MenuPage = () => {
  const [plats, setPlats] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isPending, startTransition] = useTransition();

  // Fetch menu-data.html from GitHub Raw API on mount
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Cache-busting: append timestamp to bypass CDN/browser cache
        const res = await fetch(`${MENU_RAW_URL}?t=${Date.now()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        const items = parseMenuHTML(html);
        setPlats(items);

        // Set initial category
        const cats = Array.from(new Set(items.map(i => i.category)))
          .sort((a, b) => {
            const iA = ORDER.indexOf(a);
            const iB = ORDER.indexOf(b);
            if (iA === -1 && iB === -1) return a.localeCompare(b);
            if (iA === -1) return 1;
            if (iB === -1) return -1;
            return iA - iB;
          });
        if (cats.length > 0) {
          setActiveCategory(cats[0]);
          setActiveTab(cats[0]);
        }
      } catch (e) {
        console.error('Failed to load menu:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Compute categories from loaded items
  const categories = Array.from(new Set(plats.map(item => item.category)))
    .sort((a, b) => {
      const indexA = ORDER.indexOf(a);
      const indexB = ORDER.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

  // Force hardcore prefetch of ALL images natively into browser RAM cache in background
  // Defer it to not block the main thread and avoid FPS drops
  useEffect(() => {
    if (!plats || plats.length === 0) return;

    const prefetchImages = () => {
      plats.forEach(item => {
        if (item.image) {
          const img = new Image();
          img.src = optimizeImage(item.image);
        }
      });
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(prefetchImages);
    } else {
      setTimeout(prefetchImages, 500);
    }
  }, [plats]);

  // We compute whether a category is drink-like to apply the correct grid structure per category.
  const isCategoryDrinkLike = (cat: string) => cat.includes("Boisson") || cat.includes("Viennoiserie");

  const handleCategoryChange = useCallback((cat: string) => {
    if (activeTab === cat) return;
    setActiveTab(cat);
    setIsCategoryLoading(true);
    
    // Find images for this category
    const itemsInCat = plats.filter(item => item.category === cat);
    const imagesToLoad = itemsInCat.map(item => optimizeImage(item.image)).filter(Boolean);

    if (imagesToLoad.length === 0) {
      setTimeout(() => {
        startTransition(() => {
          setActiveCategory(cat);
          setIsCategoryLoading(false);
        });
      }, 50);
      return;
    }

    // Preload images and wait for them to finish before removing loader
    Promise.all(imagesToLoad.map(url => {
      return new Promise(resolve => {
        const img = new window.Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = resolve; // Continue even if an image fails to load
      });
    })).then(() => {
      startTransition(() => {
        setActiveCategory(cat);
        setIsCategoryLoading(false);
      });
    });
  }, [activeTab, plats]);

  const openModal = useCallback((item: MenuItem) => setSelectedItem(item), []);
  const closeModal = useCallback(() => setSelectedItem(null), []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow pt-28 pb-20 relative overflow-hidden">
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="flex flex-col items-center animate-fadeIn">
              <div className="w-8 h-8 border-4 border-madelina-terracotta/20 border-t-madelina-terracotta rounded-full animate-spin mb-4"></div>
              <div className="font-display text-madelina-navy/40">Chargement...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow pt-28 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 px-6">
          {/* Heading */}
          <div className="text-center mb-6 sm:mb-10 md:mb-16">
            <h2 className="text-5xl md:text-7xl mb-6 font-allenoire text-madelina-navy">
              La carte <span className="text-madelina-terracotta font-allenoire">madélina</span>
            </h2>
            <div className="h-1 w-24 bg-madelina-terracotta mx-auto" />
          </div>

          {/* Categories Tab */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3 mb-8 sm:mb-12 md:mb-16">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`relative px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-full text-[10px] sm:text-[11px] md:text-[12px] font-bold uppercase tracking-widest transition-all duration-200 ${
                    activeTab === cat 
                      ? 'bg-madelina-navy text-white shadow-lg scale-105' 
                      : 'bg-transparent text-madelina-navy hover:text-madelina-terracotta hover:bg-madelina-navy/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Items Grid/List — Render loader if switching, else render grid */}
          <div className="min-h-[50vh]">
            {isCategoryLoading ? (
              <div className="flex items-center justify-center h-full pt-20">
                <div className="flex flex-col items-center animate-fadeIn">
                  <div className="w-8 h-8 border-4 border-madelina-terracotta/20 border-t-madelina-terracotta rounded-full animate-spin mb-4"></div>
                </div>
              </div>
            ) : (
              <div className={`transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                {categories.map((cat) => {
                  if (activeCategory !== cat) return null;

                  const drinkLike = isCategoryDrinkLike(cat);
                  const itemsInCat = plats.filter(item => item.category === cat);
                  return (
                    <div
                      key={cat}
                      style={{ animation: 'fadeIn 0.25s ease-out' }}
                      className={drinkLike ? "flex flex-col gap-4 max-w-3xl mx-auto" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10"}
                    >
                      {itemsInCat.map((item) =>
                        drinkLike ? (
                          <DrinkCard key={item.id} item={item} onClick={() => openModal(item)} />
                        ) : (
                          <FoodCard key={item.id} item={item} onClick={() => openModal(item)} />
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-[2rem] overflow-hidden max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.image && (
                <div className="h-64 overflow-hidden">
                  <img src={optimizeImage(selectedItem.image, 1000)} alt={selectedItem.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
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
                  onClick={closeModal}
                  className="w-full py-3 bg-madelina-navy text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-madelina-terracotta transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default MenuPage;