import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages', 'Snacks'];

const CAT_DESC = {
  'Pizza':       'Wood-fired, crispy & loaded with toppings',
  'Burgers':     'Juicy patties stacked with fresh veggies',
  'Pasta':       'Al-dente pasta in rich, aromatic sauces',
  'Rice':        'Aromatic basmati with spices & herbs',
  'Curries':     'Rich, slow-cooked gravies & masalas',
  'Rolls':       'Stuffed wraps, hot off the tawa',
  'Soups':       'Warm & wholesome comfort bowls',
  'Desserts':    'Indulgent sweets to end your meal',
  'Beverages':   'Refreshing & chilled beverages',
  'Starters':    'Crispy bites & small plates',
  'Main Course': 'Hearty mains for the perfect meal',
  'Snacks':      'Crispy snacks & quick bites',
};

function FoodlistClient({ searchQuery }) {
  const navigate = useNavigate();
  const [food, setFood] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [vegFilter, setVegFilter] = useState('All'); // 'All' | 'Veg' | 'NonVeg'
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalQty, setModalQty] = useState(1);

  // Review Modal States
  const [reviewItem, setReviewItem] = useState(null);
  const [reviewsData, setReviewsData] = useState({ reviews: [], averageRating: 0, totalReviews: 0 });
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const currentUser = localStorage.getItem('user');

  const fetchCart = React.useCallback(() => {
    if (currentUser) {
      axiosInstance.get(`/orders/user/details/${currentUser}`)
        .then(res => setCartItems(res.data || []))
        .catch(() => {});
    }
  }, [currentUser]);

  useEffect(() => {
    setLoading(true);
    axiosInstance.get('/food/fetch')
      .then(res => setFood(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));

    fetchCart();
  }, [currentUser, fetchCart]);

  const fetchReviews = (fid) => {
    axiosInstance.get(`/reviews/food/${fid}`)
      .then(res => setReviewsData(res.data))
      .catch(() => setReviewsData({ reviews: [], averageRating: 0, totalReviews: 0 }));
  };

  const openReviewModal = (item, e) => {
    e.stopPropagation();
    setReviewItem(item);
    fetchReviews(item.fid);
  };

  const submitReview = () => {
    if (!currentUser) {
      toast.error("Please log in to write a review");
      return;
    }
    setSubmittingReview(true);
    axiosInstance.post('/reviews/add', {
      fid: reviewItem.fid,
      uname: currentUser,
      rating: newRating,
      comment: newComment
    })
    .then(() => {
      toast.success("Review posted successfully! ⭐");
      setNewComment("");
      fetchReviews(reviewItem.fid);
    })
    .catch(() => toast.error("Could not post review."))
    .finally(() => setSubmittingReview(false));
  };

  // Enrich each food item with fallback category, image, rating
  const enriched = food.map(item => {
    const cat = item.category || detectCategory(item.fname);
    const isV = item.isVeg !== undefined && item.isVeg !== null ? item.isVeg : true;
    return {
      ...item,
      category: cat,
      isVeg:    isV,
      image:    item.imageUrl || CATEGORY_IMAGES[cat] || CATEGORY_IMAGES['Main Course'],
      rating:   getStaticRating(item.fid),
      best:     isBestseller(item.fid),
      desc:     CAT_DESC[cat] || 'Freshly prepared with authentic ingredients',
    };
  });

  // Filter by search + category + veg preference
  const filtered = enriched.filter(item => {
    const matchSearch = item.fname?.toLowerCase().includes(searchQuery?.toLowerCase() || '');
    const matchCat    = activeCategory === 'All' || item.category.toLowerCase() === activeCategory.toLowerCase();
    const matchVeg    = vegFilter === 'All' || (vegFilter === 'Veg' && item.isVeg) || (vegFilter === 'NonVeg' && !item.isVeg);
    return matchSearch && matchCat && matchVeg;
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
        fetchCart(); // Instant UX cart update
      })
      .catch(() => {
        toast.dismiss(t);
        toast.error('Failed to add item.');
      });
  };

  const cartTotal = cartItems.reduce((sum, i) => sum + (Number(i.totalprice || i.TOTALPRICE) || 0), 0);
  const totalItemCount = cartItems.reduce((sum, i) => sum + (Number(i.qty || i.QTY) || 1), 0);

  return (
    <div className="menu-wrapper" style={{ paddingBottom: cartItems.length > 0 ? '120px' : '60px' }}>
      {/* ── Header ── */}
      <div className="menu-header">
        <h2>🍽️ Explore Our Menu</h2>
        <p>Fresh ingredients, bold flavours — order in minutes</p>
      </div>

      {/* ── Filter Controls ── */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        {/* Category Tabs */}
        <div className="category-tabs" style={{ marginBottom: 0 }}>
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

        {/* Veg / Non-Veg Toggle Buttons */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--card-bg)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setVegFilter('All')} 
            style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: vegFilter === 'All' ? 'var(--primary-color)' : 'transparent', color: vegFilter === 'All' ? '#fff' : 'var(--text-color)', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
          >
            All
          </button>
          <button 
            onClick={() => setVegFilter('Veg')} 
            style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: vegFilter === 'Veg' ? '#10b981' : 'transparent', color: vegFilter === 'Veg' ? '#fff' : '#10b981', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
          >
            🟢 Veg Only
          </button>
          <button 
            onClick={() => setVegFilter('NonVeg')} 
            style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: vegFilter === 'NonVeg' ? '#ef4444' : 'transparent', color: vegFilter === 'NonVeg' ? '#fff' : '#ef4444', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
          >
            🔴 Non-Veg
          </button>
        </div>
      </div>

      {/* ── Card Grid (Skeleton UX vs Product Cards) ── */}
      {loading ? (
        <div className="food-grid">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="food-card" style={{ height: '340px', opacity: 0.6, animation: 'pulse 1.5s infinite' }}>
              <div style={{ height: '180px', backgroundColor: 'var(--input-bg)' }} />
              <div className="food-card-body" style={{ gap: '12px' }}>
                <div style={{ height: '20px', width: '70%', backgroundColor: 'var(--border-color)', borderRadius: '6px' }} />
                <div style={{ height: '14px', width: '40%', backgroundColor: 'var(--border-color)', borderRadius: '6px' }} />
                <div style={{ height: '30px', width: '100%', backgroundColor: 'var(--border-color)', borderRadius: '6px', marginTop: 'auto' }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="food-grid">
          {filtered.map((item) => (
            <div className="food-card" key={item.fid}>
              <div className="food-card-img-wrap">
                <img src={item.image} alt={item.fname} loading="lazy" />
                {/* Veg / Non-Veg Badge */}
                <div style={{
                  position: 'absolute', top: '10px', left: '10px',
                  background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)',
                  padding: '3px 8px', borderRadius: '8px',
                  border: `1.5px solid ${item.isVeg ? '#10b981' : '#ef4444'}`,
                  display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: '800'
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: item.isVeg ? '50%' : '0', backgroundColor: item.isVeg ? '#10b981' : '#ef4444' }} />
                  <span style={{ color: item.isVeg ? '#047857' : '#b91c1c' }}>{item.isVeg ? 'VEG' : 'NON-VEG'}</span>
                </div>
                {item.best && <span className="bestseller-badge">⭐ Bestseller</span>}
              </div>

              <div className="food-card-body">
                <h5 className="food-card-name">{item.fname}</h5>

                <div className="food-card-meta" style={{ cursor: 'pointer' }} onClick={(e) => openReviewModal(item, e)}>
                  <span className="rating-chip">⭐ {item.rating}</span>
                  <span>• {item.category}</span>
                  <span style={{ textDecoration: 'underline', color: 'var(--primary-color)' }}>• Reviews &rsaquo;</span>
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
          <p>Try a different category or filter term</p>
        </div>
      )}

      {/* ── SHOP.APP FLOATING QUICK CART CAPSULE BAR (UX UPGRADE) ── */}
      {cartItems.length > 0 && (
        <div 
          onClick={() => navigate('/billing')}
          style={{
            position: 'fixed',
            bottom: '25px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: 'var(--primary-gradient)',
            color: '#ffffff',
            borderRadius: '100px',
            padding: '14px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            boxShadow: '0 16px 40px rgba(112, 0, 255, 0.45)',
            cursor: 'pointer',
            minWidth: '320px',
            maxWidth: '90%',
            animation: 'slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: '1.4rem' }}>🛒</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.1 }}>
                {totalItemCount} ITEM{totalItemCount > 1 ? 'S' : ''} ADDED
              </div>
              <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>
                Subtotal: ₹{cartTotal.toFixed(2)}
              </div>
            </div>
          </div>
          <div style={{ fontWeight: 900, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Checkout</span>
            <span>&rarr;</span>
          </div>
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

      {/* ── Reviews Modal ── */}
      {reviewItem && (
        <div className="qty-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setReviewItem(null); }}>
          <div className="qty-modal-card" style={{ position: 'relative', maxWidth: '500px', width: '92%', maxHeight: '85vh', overflowY: 'auto' }}>
            <button className="modal-close-btn" onClick={() => setReviewItem(null)}>✕</button>

            <h4 style={{ fontWeight: 800, color: 'var(--text-color)', marginBottom: 4 }}>⭐ Customer Reviews</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 16 }}>{reviewItem.fname} (#{reviewItem.fid})</p>

            <div style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' }}>
              <h2 style={{ margin: 0, fontWeight: 900, color: '#f59e0b' }}>
                {reviewsData.averageRating > 0 ? reviewsData.averageRating : reviewItem.rating} ★
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Based on {reviewsData.totalReviews} user ratings
              </span>
            </div>

            {/* Write Review Form */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginBottom: '20px' }}>
              <h6 style={{ fontWeight: 700, color: 'var(--text-color)', marginBottom: '8px' }}>Write a Review</h6>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Rating:</span>
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    onClick={() => setNewRating(star)} 
                    style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: star <= newRating ? '#f59e0b' : '#ccc', padding: 0 }}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea 
                className="form-control mb-2" 
                rows="2" 
                placeholder="Share your thoughts about this dish..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                style={{ borderRadius: '10px', fontSize: '0.88rem' }}
              />
              <button 
                onClick={submitReview} 
                disabled={submittingReview || !newComment.trim()} 
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: 'var(--primary-color)', color: '#fff', fontWeight: '700', cursor: 'pointer' }}
              >
                {submittingReview ? 'Posting...' : 'Submit Review'}
              </button>
            </div>

            {/* Existing Reviews List */}
            <div>
              <h6 style={{ fontWeight: 700, color: 'var(--text-color)', marginBottom: '12px' }}>Recent Comments</h6>
              {reviewsData.reviews && reviewsData.reviews.length > 0 ? (
                reviewsData.reviews.map(rev => (
                  <div key={rev.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-color)' }}>{rev.uname}</span>
                      <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '0.85rem' }}>{"★".repeat(rev.rating)}</span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', margin: '20px 0' }}>No customer comments yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodlistClient;