import { useState, useCallback, useMemo } from 'react';
import menuData from '../data/menu.json';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

// ─── Types ────────────────────────────────────────────────────
interface MenuItem {
  category: string;
  title: string;
  price: number;
  image?: string;
  description?: string;
}

// ─── Available categories ─────────────────────────────────────
const CATEGORIES = [
  "☕ Boisson chaude",
  "🧃 Boisson fraîche",
  "🥐 Viennoiseries",
  "🍰 Gâteaux et tartes",
  "🍽️ Plats",
  "✨ Autres",
];

// ─── Empty form state ─────────────────────────────────────────
const EMPTY_FORM: MenuItem = {
  category: CATEGORIES[0],
  title: '',
  price: 0,
  image: '',
  description: '',
};

// ─── Component ────────────────────────────────────────────────
const AdminPage = () => {
  // All menu items — local mutable copy from the imported JSON
  const [items, setItems] = useState<MenuItem[]>(() => [...(menuData?.plats || [])]);

  // UI state
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<MenuItem>({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // ─── Filtered items for display ─────────────────────────────
  const filteredItems = useMemo(() => {
    if (filterCategory === 'all') return items;
    return items.filter(item => item.category === filterCategory);
  }, [items, filterCategory]);

  // ─── Get the real index in the full `items` array ───────────
  const getRealIndex = useCallback((filteredIdx: number): number => {
    if (filterCategory === 'all') return filteredIdx;
    const targetItem = filteredItems[filteredIdx];
    return items.findIndex(
      i => i.title === targetItem.title && i.category === targetItem.category && i.price === targetItem.price
    );
  }, [items, filteredItems, filterCategory]);

  // ─── Open modal (add or edit) ───────────────────────────────
  const openAddModal = useCallback(() => {
    setEditingIndex(null);
    setFormData({ ...EMPTY_FORM });
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((filteredIdx: number) => {
    const realIdx = getRealIndex(filteredIdx);
    setEditingIndex(realIdx);
    setFormData({ ...items[realIdx] });
    setIsModalOpen(true);
  }, [items, getRealIndex]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setFormData({ ...EMPTY_FORM });
  }, []);

  // ─── Form change handler ───────────────────────────────────
  const handleFormChange = useCallback((field: keyof MenuItem, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // ─── Save item (add or update) ─────────────────────────────
  const handleSaveItem = useCallback(() => {
    if (!formData.title.trim()) return;

    setItems(prev => {
      const next = [...prev];
      if (editingIndex !== null) {
        // Update existing
        next[editingIndex] = { ...formData, price: Number(formData.price) };
      } else {
        // Add new
        next.push({ ...formData, price: Number(formData.price) });
      }
      return next;
    });

    setHasUnsavedChanges(true);
    closeModal();
  }, [formData, editingIndex, closeModal]);

  // ─── Delete item ───────────────────────────────────────────
  const handleDelete = useCallback((filteredIdx: number) => {
    const realIdx = getRealIndex(filteredIdx);
    setItems(prev => prev.filter((_, i) => i !== realIdx));
    setDeleteConfirm(null);
    setHasUnsavedChanges(true);
  }, [getRealIndex]);

  // ─── Move item up/down in the list ─────────────────────────
  const moveItem = useCallback((filteredIdx: number, direction: 'up' | 'down') => {
    const realIdx = getRealIndex(filteredIdx);
    setItems(prev => {
      const next = [...prev];
      const swapIdx = direction === 'up' ? realIdx - 1 : realIdx + 1;
      if (swapIdx < 0 || swapIdx >= next.length) return prev;
      [next[realIdx], next[swapIdx]] = [next[swapIdx], next[realIdx]];
      return next;
    });
    setHasUnsavedChanges(true);
  }, [getRealIndex]);

  // ─── Save to menu.json via Vite API ────────────────────────
  const handleSaveToFile = useCallback(async () => {
    setSaving(true);
    setSaveStatus(null);

    try {
      const res = await fetch('/api/save-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plats: items }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setSaveStatus({ ok: true, message: `✅ Sauvegardé! ${data.items} éléments enregistrés.` });
        setHasUnsavedChanges(false);
      } else {
        setSaveStatus({ ok: false, message: `❌ Erreur: ${data.error || 'Réponse inattendue'}` });
      }
    } catch (err: any) {
      setSaveStatus({ ok: false, message: `❌ Erreur réseau: ${err.message}` });
    } finally {
      setSaving(false);
      // Auto-clear success message after 4s
      setTimeout(() => setSaveStatus(null), 4000);
    }
  }, [items]);

  // ─── Count items per category ──────────────────────────────
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    CATEGORIES.forEach(cat => {
      counts[cat] = items.filter(i => i.category === cat).length;
    });
    return counts;
  }, [items]);

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* ── Page Header ── */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-allenoire text-madelina-navy mb-4">
              Admin <span className="text-madelina-terracotta font-allenoire">Menu</span>
            </h1>
            <div className="h-1 w-20 bg-madelina-terracotta mx-auto mb-4" />
            <p className="text-madelina-navy/50 text-sm">
              Gérez votre carte — ajoutez, modifiez ou supprimez des éléments.
            </p>
          </div>

          {/* ── Top Action Bar ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <button
              onClick={openAddModal}
              id="admin-add-item-btn"
              className="inline-flex items-center gap-2 px-6 py-3 bg-madelina-terracotta text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-madelina-terracotta/90 transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Ajouter un élément
            </button>

            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <span className="text-xs text-amber-600 font-medium animate-pulse">● Modifications non sauvegardées</span>
              )}
              <button
                onClick={handleSaveToFile}
                disabled={saving || !hasUnsavedChanges}
                id="admin-save-btn"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  hasUnsavedChanges
                    ? 'bg-madelina-navy text-white hover:bg-madelina-navy/90 shadow-md hover:shadow-lg'
                    : 'bg-madelina-navy/20 text-madelina-navy/40 cursor-not-allowed'
                }`}
              >
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Sauvegarder dans menu.json
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Save status message ── */}
          <AnimatePresence>
            {saveStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-6 px-5 py-3 rounded-2xl text-sm font-medium ${
                  saveStatus.ok
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {saveStatus.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Category Filter Tabs ── */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-madelina-navy text-white shadow-md'
                  : 'bg-madelina-navy/5 text-madelina-navy hover:bg-madelina-navy/10'
              }`}
            >
              Tout ({categoryCounts.all})
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-madelina-navy text-white shadow-md'
                    : 'bg-madelina-navy/5 text-madelina-navy hover:bg-madelina-navy/10'
                }`}
              >
                {cat} ({categoryCounts[cat] || 0})
              </button>
            ))}
          </div>

          {/* ── Items Table ── */}
          <div className="bg-white rounded-3xl border border-madelina-terracotta/10 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-[60px_2fr_1.5fr_80px_1fr_140px] gap-4 px-6 py-4 bg-madelina-cream/50 border-b border-madelina-terracotta/10 text-[10px] font-bold uppercase tracking-widest text-madelina-navy/50">
              <span>Image</span>
              <span>Titre</span>
              <span>Catégorie</span>
              <span>Prix</span>
              <span>Description</span>
              <span className="text-right">Actions</span>
            </div>

            {/* Table Rows */}
            {filteredItems.length === 0 ? (
              <div className="px-6 py-16 text-center text-madelina-navy/30 text-sm">
                Aucun élément dans cette catégorie.
              </div>
            ) : (
              filteredItems.map((item, filteredIdx) => (
                <div
                  key={`${item.title}-${filteredIdx}`}
                  className="group grid grid-cols-1 sm:grid-cols-[60px_2fr_1.5fr_80px_1fr_140px] gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-b border-madelina-terracotta/5 hover:bg-madelina-cream/30 transition-colors items-center"
                >
                  {/* Image thumbnail */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-madelina-cream flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <span className="font-display text-madelina-navy text-sm sm:text-base font-semibold">{item.title}</span>
                  </div>

                  {/* Category */}
                  <div>
                    <span className="inline-block px-3 py-1 bg-madelina-terracotta/10 text-madelina-terracotta text-[10px] font-bold uppercase tracking-wider rounded-full">
                      {item.category}
                    </span>
                  </div>

                  {/* Price */}
                  <div>
                    <span className="font-bold text-madelina-navy text-sm">
                      {typeof item.price === 'number' ? item.price.toFixed(1) : item.price} DT
                    </span>
                  </div>

                  {/* Description */}
                  <div className="hidden sm:block">
                    <p className="text-madelina-navy/50 text-xs line-clamp-2">{item.description || '—'}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Move Up */}
                    <button
                      onClick={() => moveItem(filteredIdx, 'up')}
                      title="Monter"
                      className="p-2 rounded-xl text-madelina-navy/30 hover:text-madelina-navy hover:bg-madelina-navy/5 transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                    </button>
                    {/* Move Down */}
                    <button
                      onClick={() => moveItem(filteredIdx, 'down')}
                      title="Descendre"
                      className="p-2 rounded-xl text-madelina-navy/30 hover:text-madelina-navy hover:bg-madelina-navy/5 transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(filteredIdx)}
                      title="Modifier"
                      className="p-2 rounded-xl text-madelina-terracotta/50 hover:text-madelina-terracotta hover:bg-madelina-terracotta/5 transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    {/* Delete */}
                    {deleteConfirm === filteredIdx ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(filteredIdx)}
                          className="px-2.5 py-1 bg-red-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          Oui
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2.5 py-1 bg-madelina-navy/10 text-madelina-navy text-[9px] font-bold uppercase tracking-wider rounded-lg hover:bg-madelina-navy/20 transition-colors cursor-pointer"
                        >
                          Non
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(filteredIdx)}
                        title="Supprimer"
                        className="p-2 rounded-xl text-red-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── Item count ── */}
          <div className="mt-4 text-center text-xs text-madelina-navy/30">
            {filteredItems.length} élément{filteredItems.length !== 1 ? 's' : ''} affiché{filteredItems.length !== 1 ? 's' : ''}
            {filterCategory !== 'all' && ` sur ${items.length} au total`}
          </div>
        </div>
      </main>

      {/* ── Add/Edit Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-[2rem] overflow-hidden max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="px-8 pt-8 pb-4 border-b border-madelina-terracotta/10">
                <h2 className="text-2xl font-display text-madelina-navy">
                  {editingIndex !== null ? 'Modifier l\'élément' : 'Ajouter un élément'}
                </h2>
                <p className="text-xs text-madelina-navy/40 mt-1">
                  {editingIndex !== null ? 'Modifiez les détails ci-dessous.' : 'Remplissez les détails du nouvel élément.'}
                </p>
              </div>

              {/* Form */}
              <div className="px-8 py-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-madelina-navy/50 mb-2">
                    Titre *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    placeholder="Ex: Cappuccino"
                    className="w-full px-4 py-3 rounded-xl border border-madelina-terracotta/15 text-sm text-madelina-navy focus:outline-none focus:ring-2 focus:ring-madelina-terracotta/30 focus:border-madelina-terracotta/30 transition-all bg-madelina-cream/20"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-madelina-navy/50 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-madelina-terracotta/15 text-sm text-madelina-navy focus:outline-none focus:ring-2 focus:ring-madelina-terracotta/30 focus:border-madelina-terracotta/30 transition-all bg-madelina-cream/20 cursor-pointer"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-madelina-navy/50 mb-2">
                    Prix (DT)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleFormChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="0.0"
                    className="w-full px-4 py-3 rounded-xl border border-madelina-terracotta/15 text-sm text-madelina-navy focus:outline-none focus:ring-2 focus:ring-madelina-terracotta/30 focus:border-madelina-terracotta/30 transition-all bg-madelina-cream/20"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-madelina-navy/50 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image || ''}
                    onChange={(e) => handleFormChange('image', e.target.value)}
                    placeholder="https://i.ibb.co/..."
                    className="w-full px-4 py-3 rounded-xl border border-madelina-terracotta/15 text-sm text-madelina-navy focus:outline-none focus:ring-2 focus:ring-madelina-terracotta/30 focus:border-madelina-terracotta/30 transition-all bg-madelina-cream/20"
                  />
                  {/* Image preview */}
                  {formData.image && (
                    <div className="mt-3 w-20 h-20 rounded-xl overflow-hidden border border-madelina-terracotta/10">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-madelina-navy/50 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    placeholder="Une brève description..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-madelina-terracotta/15 text-sm text-madelina-navy focus:outline-none focus:ring-2 focus:ring-madelina-terracotta/30 focus:border-madelina-terracotta/30 transition-all bg-madelina-cream/20 resize-none"
                  />
                </div>
              </div>

              {/* Modal actions */}
              <div className="px-8 pb-8 flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 py-3 bg-madelina-navy/5 text-madelina-navy rounded-full text-xs font-bold uppercase tracking-widest hover:bg-madelina-navy/10 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveItem}
                  disabled={!formData.title.trim()}
                  className={`flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                    formData.title.trim()
                      ? 'bg-madelina-terracotta text-white hover:bg-madelina-terracotta/90'
                      : 'bg-madelina-terracotta/30 text-white/60 cursor-not-allowed'
                  }`}
                >
                  {editingIndex !== null ? 'Mettre à jour' : 'Ajouter'}
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

export default AdminPage;
