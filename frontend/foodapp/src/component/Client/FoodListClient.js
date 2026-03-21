import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import './FoodListClient.css';

// ── Category detection from food name ──────────────────────────────────────
function detectCategory(fname = '') {
  const n = fname.toLowerCase();
  if (n.includes('pizza'))                                return 'Pizza';
  if (n.includes('burger') || n.includes('sandwich'))    return 'Burgers';
  if (n.includes('pasta') || n.includes('noodle') || n.includes('spaghetti')) return 'Pasta';
  if (n.includes('biryani') || n.includes('rice') || n.includes('pulao'))     return 'Rice';
  if (n.includes('curry') || n.includes('masala') || n.includes('paneer') || n.includes('chicken') || n.includes('mutton')) return 'Curries';
  if (n.includes('roll') || n.includes('wrap') || n.includes('kati'))        return 'Rolls';
  if (n.includes('soup') || n.includes('salad'))                              return 'Soups';
  if (n.includes('cake') || n.includes('ice cream') || n.includes('dessert') || n.includes('sweet') || n.includes('gulab') || n.includes('kheer')) return 'Desserts';
  if (n.includes('juice') || n.includes('lassi') || n.includes('shake') || n.includes('coffee') || n.includes('tea') || n.includes('drink'))      return 'Drinks';
  if (n.includes('samosa') || n.includes('chat') || n.includes('chaat') || n.includes('tikka') || n.includes('starter') || n.includes('snack'))   return 'Starters';
  return 'Main Course';
}

// ── Food image map by category ──────────────────────────────────────────────
const CATEGORY_IMAGES = {
  'Pizza':       'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
  'Burgers':     'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  'Pasta':       'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80',
  'Rice':        'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&q=80',
  'Curries':     'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80',
  'Rolls':       'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80',
  'Soups':       'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80',
  'Desserts':    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80',
  'Drinks':      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80',
  'Starters':    'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&q=80',
  'Main Course': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
};

// ── Static ratings per food (deterministic from fid) ───────────────────────
function getStaticRating(fid = '') {
  const ratings = [4.1, 4.3, 4.5, 3.9, 4.2, 4.7, 4.0, 4.4, 4.6, 3.8];
  let sum = 0;
  for (let i = 0; i < fid.length; i++) sum += fid.charCodeAt(i);
  return ratings[sum % ratings.length];
}

// ── Bestseller flag (every 3rd item roughly) ───────────────────────────────
function isBestseller(fid = '') {
  let sum = 0;
  for (let i = 0; i < fid.length; i++) sum += fid.charCodeAt(i);
  return sum % 3 === 0;
}

const CATEGORIES = ['All', 'Starters', 'Pizza', 'Burgers', 'Curries', 'Rice', 'Pasta', 'Rolls', 'Soups', 'Desserts', 'Drinks', 'Main Course'];

// ── Short descriptions per category ────────────────────────────────────────
const CAT_DESC = {
  'Pizza':       'Wood-fired, crispy & loaded with toppings',
  'Burgers':     'Juicy patties stacked with fresh veggies',
  'Pasta':       'Al-dente pasta in rich, aromatic sauces',
  'Rice':        'Aromatic basmati with spices & herbs',
  'Curries':     'Rich, slow-cooked gravies & masalas',
  'Rolls':       'Stuffed wraps, hot off the tawa',
  'Soups':       'Warm & wholesome comfort bowls',
  'Desserts':    'Indulgent sweets to end your meal',
  'Drinks':      'Refreshing & chilled beverages',
  'Starters':    'Crispy bites & small plates',
  'Main Course': 'Hearty mains for the perfect meal',
};

function FoodlistClient({ searchQuery }) {
  const [food, setFood] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalQty, setModalQty] = useState(1);

  const currentUser = localStorage.getItem('user');

  useEffect(() => {
    axiosInstance.get('/food/fetch')
      .then(res => setFood(res.data))
      .catch(() => {});
  }, []);

  // Enrich each food item with category, image, rating
  const enriched = food.map(item => ({
    ...item,
    category: detectCategory(item.fname),
    image:    item.imageUrl || CATEGORY_IMAGES[detectCategory(item.fname)],
    rating:   getStaticRating(item.fid),
    best:     isBestseller(item.fid),
    desc:     CAT_DESC[detectCategory(item.fname)] || '',
  }));

  // Filter by search + category
  const filtered = enriched.filter(item => {
    const matchSearch = item.fname?.toLowerCase().includes(searchQuery?.toLowerCase() || '');
    const matchCat    = activeCategory === 'All' || item.category === activeCategory;
    return matchSearch && matchCat;
  });

  const openModal = (item) => {
    if (!currentUser) { toast.error('Please login to add items to your cart'); return; }
    setSelectedItem(item);
    setModalQty(1);
  };

  const confirmAddToCart = () => {
    if (!selectedItem) return;
    const cartItem = {
      fid:   selectedItem.fid,
      fname: selectedItem.fname,
      qty:   modalQty,
      uname: currentUser,
    };
    const t = toast.loading(`Adding ${selectedItem.fname}...`);
    axiosInstance.post('/orders/add', cartItem)
      .then(() => {
        toast.dismiss(t);
        toast.success(`${modalQty}× ${selectedItem.fname} added! 🛒`);
        setSelectedItem(null);
      })
      .catch(() => {
        toast.dismiss(t);
        toast.error('Failed to add item.');
      });
  };

  return (
    <div className="menu-wrapper">
      {/* ── Header ── */}
      <div className="menu-header">
        <h2>🍽️ Explore Our Menu</h2>
        <p>Fresh ingredients, bold flavours — order in minutes</p>
      </div>

      {/* ── Category Tabs ── */}
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`cat-tab${activeCategory === cat ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Card Grid ── */}
      {filtered.length > 0 ? (
        <div className="food-grid">
          {filtered.map((item) => (
            <div className="food-card" key={item.fid}>
              <div className="food-card-img-wrap">
                <img src={item.image} alt={item.fname} loading="lazy" />
                {/* Veg marker */}
                <div className="veg-badge"><div className="veg-dot" /></div>
                {item.best && <span className="bestseller-badge">⭐ Bestseller</span>}
              </div>

              <div className="food-card-body">
                <h5 className="food-card-name">{item.fname}</h5>

                <div className="food-card-meta">
                  <span className="rating-chip">⭐ {item.rating}</span>
                  <span>• {item.category}</span>
                  <span>• #{item.fid}</span>
                </div>

                <p className="food-card-desc">{item.desc}</p>

                <div className="food-card-footer">
                  <span className="food-price">₹{item.price}</span>
                  <button className="add-btn" onClick={() => openModal(item)}>ADD +</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-menu">
          <div className="emoji">🥺</div>
          <h4>No items found{searchQuery ? ` for "${searchQuery}"` : ''}</h4>
          <p>Try a different category or search term</p>
        </div>
      )}

      {/* ── Quantity Modal ── */}
      {selectedItem && (
        <div className="qty-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedItem(null); }}>
          <div className="qty-modal-card" style={{ position: 'relative' }}>
            <button className="modal-close-btn" onClick={() => setSelectedItem(null)}>✕</button>

            <img
              src={selectedItem.image}
              alt={selectedItem.fname}
              className="qty-modal-img"
            />

            <h5 style={{ fontWeight: 800, color: 'var(--text-color)', marginBottom: 2 }}>{selectedItem.fname}</h5>
            <p style={{ color: '#21a447', fontWeight: 700, fontSize: '1.1rem', marginBottom: 16 }}>₹{selectedItem.price} per item</p>

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 12 }}>Select quantity</p>

            <div className="qty-controls">
              <button className="qty-btn" onClick={() => setModalQty(q => Math.max(1, q - 1))}>−</button>
              <span className="qty-count">{modalQty}</span>
              <button className="qty-btn" onClick={() => setModalQty(q => q + 1)}>+</button>
            </div>

            <button className="confirm-btn" onClick={confirmAddToCart}>
              Add to Cart • ₹{(Number(selectedItem.price) * modalQty).toFixed(2)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodlistClient;