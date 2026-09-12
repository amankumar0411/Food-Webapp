import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import './FoodListClient.css';

// Category detection from food name
function detectCategory(fname = '') {
  const n = fname.toLowerCase();
  if (n.includes('pizza'))                                return 'Pizzas';
  if (n.includes('burger') || n.includes('sandwich'))    return 'Burgers';
  if (n.includes('pasta') || n.includes('noodle'))        return 'Pasta';
  if (n.includes('biryani') || n.includes('rice'))         return 'Biryani';
  if (n.includes('curry') || n.includes('masala') || n.includes('paneer') || n.includes('chicken')) return 'Curries';
  if (n.includes('cake') || n.includes('dessert') || n.includes('mousse') || n.includes('cookie')) return 'Cakes';
  if (n.includes('juice') || n.includes('shake') || n.includes('coffee') || n.includes('tea'))      return 'Beverages';
  return 'Main Course';
}

const CATEGORY_IMAGES = {
  'Pizzas':      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
  'Burgers':     'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  'Pasta':       'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80',
  'Biryani':     'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&q=80',
  'Curries':     'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80',
  'Cakes':       'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80',
  'Beverages':   'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80',
  'Main Course': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
};

const CATEGORIES_RAIL = [
  { name: 'Pizzas', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&q=80' },
  { name: 'Cakes', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&q=80' },
  { name: 'Cookies', img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=150&q=80' },
  { name: 'Mousse', img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=150&q=80' },
  { name: 'Biryani', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&q=80' },
  { name: 'Burgers', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&q=80' },
];

function getStaticRating(fid = '') {
  const ratings = [4.3, 4.5, 4.7, 4.2, 4.6, 4.8, 4.4, 4.9];
  let sum = 0;
  for (let i = 0; i < fid.length; i++) sum += fid.charCodeAt(i);
  return ratings[sum % ratings.length];
}

function FoodlistClient({ searchQuery: globalSearchQuery }) {
  const navigate = useNavigate();
  const [food, setFood] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [topTab, setTopTab] = useState('food'); // 'food' | 'quick'
  const [subTab, setSubTab] = useState('ALL'); // 'ALL' | 'OFFERS' | 'FOOD ON TRAIN' | 'GOURMET'
  const [vegOnly, setVegOnly] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalQty, setModalQty] = useState(1);

  // Quick Voice Order Stage States
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("“2 Belgian Chocolate Cupcakes from Glen's”");
  const [voiceMatchedItem, setVoiceMatchedItem] = useState(null);
  const [voiceQty, setVoiceQty] = useState(2);

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
      .then(res => {
        setFood(res.data || []);
        if (res.data && res.data.length > 0) {
          setVoiceMatchedItem(res.data[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetchCart();
  }, [currentUser, fetchCart]);

  const handleMicPress = () => {
    setIsRecording(true);
    toast.loading("Listening... Speak your order!", { id: 'voice-toast' });

    // Try Web Speech API if available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(`“${text}”`);
        setIsRecording(false);
        toast.dismiss('voice-toast');
        toast.success(`Recognized: "${text}"`);
        
        // Find matching item
        const match = food.find(item => text.toLowerCase().includes(item.fname.toLowerCase()));
        if (match) {
          setVoiceMatchedItem(match);
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
        toast.dismiss('voice-toast');
        toast.error("Could not capture audio. Try speaking again.");
      };
    } else {
      setTimeout(() => {
        setIsRecording(false);
        toast.dismiss('voice-toast');
        setTranscript("“Order Paneer Butter Masala”");
        toast.success("Recognized: Paneer Butter Masala");
      }, 2500);
    }
  };

  const handleProceedVoicePay = () => {
    if (!voiceMatchedItem) return;
    if (!currentUser) {
      toast.error("Please login to proceed to checkout");
      return;
    }
    const cartItem = {
      fid: voiceMatchedItem.fid,
      fname: voiceMatchedItem.fname,
      qty: voiceQty,
      uname: currentUser,
    };
    axiosInstance.post('/orders/add', cartItem)
      .then(() => {
        toast.success(`Added ${voiceQty}x ${voiceMatchedItem.fname}! Redirecting to Payment...`);
        fetchCart();
        setTimeout(() => navigate('/billing'), 800);
      })
      .catch(() => toast.error("Could not add item to cart."));
  };

  const enriched = food.map(item => {
    const cat = item.category || detectCategory(item.fname);
    const isV = item.isVeg !== undefined ? item.isVeg : true;
    return {
      ...item,
      category: cat,
      isVeg: isV,
      image: item.imageUrl || CATEGORY_IMAGES[cat] || CATEGORY_IMAGES['Main Course'],
      rating: getStaticRating(item.fid),
    };
  });

  const query = (globalSearchQuery || localSearch).toLowerCase();
  const filtered = enriched.filter(item => {
    const matchSearch = item.fname?.toLowerCase().includes(query);
    const matchVeg = !vegOnly || item.isVeg;
    const matchSub = subTab === 'ALL' || (subTab === 'OFFERS' && item.price < 250);
    return matchSearch && matchVeg && matchSub;
  });

  const openModal = (item) => {
    if (!currentUser) { toast.error('Please login to add items to your cart'); return; }
    setSelectedItem(item);
    setModalQty(1);
  };

  const confirmAddToCart = () => {
    if (!selectedItem) return;
    const cartItem = {
      fid: selectedItem.fid,
      fname: selectedItem.fname,
      qty: modalQty,
      uname: currentUser,
    };
    axiosInstance.post('/orders/add', cartItem)
      .then(() => {
        toast.success(`${modalQty}× ${selectedItem.fname} added! 🛒`);
        setSelectedItem(null);
        fetchCart();
      })
      .catch(() => toast.error('Failed to add item.'));
  };

  const cartTotal = cartItems.reduce((sum, i) => sum + (Number(i.totalprice || i.TOTALPRICE) || 0), 0);
  const totalItemCount = cartItems.reduce((sum, i) => sum + (Number(i.qty || i.QTY) || 1), 0);

  return (
    <div className="stitch-stage">
      {/* ── USER GREETING & QUICK BADGES ── */}
      <div className="stitch-user-bar">
        <div className="stitch-user-info">
          <div className="stitch-user-name flex items-center gap-1">
            <span>Aman</span>
            <span className="material-symbols-outlined text-muted" style={{ fontSize: '20px' }}>chevron_right</span>
          </div>
          <div className="stitch-user-sub">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '14px' }}>location_on</span>
            <span>HSR Layout, Sector 4, Bengaluru</span>
          </div>
        </div>

        <div className="stitch-badges">
          <div className="stitch-gold-badge">
            <span className="material-symbols-outlined fill" style={{ fontSize: '15px' }}>moped</span>
            <span>FREE DEL</span>
          </div>
          <button className="stitch-icon-btn">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>

      {/* ── OVERLAPPING TOP SEGMENTED SWITCHER (FOOD vs QUICK ORDER) ── */}
      <div className="stitch-segmented-container">
        <div className="stitch-segmented-pill">
          {/* Tab 1: Food */}
          <button 
            className={`stitch-seg-btn ${topTab === 'food' ? 'active' : ''}`}
            onClick={() => setTopTab('food')}
          >
            <span className={`material-symbols-outlined ${topTab === 'food' ? 'fill' : ''}`} style={{ fontSize: '20px' }}>lunch_dining</span>
            <span>Food</span>
            {topTab === 'food' && <div className="stitch-active-indicator" />}
          </button>

          {/* Tab 2: Quick Order */}
          <button 
            className={`stitch-seg-btn ${topTab === 'quick' ? 'active' : ''}`}
            onClick={() => setTopTab('quick')}
          >
            <div className="relative flex items-center justify-center">
              <span className={`material-symbols-outlined ${topTab === 'quick' ? 'fill text-primary' : ''}`} style={{ fontSize: '20px' }}>mic</span>
              {topTab === 'quick' && <span className="stitch-live-dot" />}
            </div>
            <span>Quick Order</span>
            {topTab === 'quick' && <div className="stitch-active-indicator" />}
          </button>
        </div>
      </div>

      {/* ────────────────── VIEW 1: FOOD TAB ────────────────── */}
      {topTab === 'food' && (
        <div className="stitch-food-view">
          {/* Search Bar + VEG Switch Row */}
          <div className="stitch-search-row">
            <div className="stitch-search-bar">
              <span className="material-symbols-outlined text-primary">search</span>
              <input 
                type="text"
                placeholder="Search for 'Cake', 'Pizza'..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
              <button className="stitch-mic-trigger" onClick={() => setTopTab('quick')}>
                <span className="material-symbols-outlined">mic</span>
              </button>
            </div>

            <button 
              className={`stitch-veg-toggle ${vegOnly ? 'active' : ''}`}
              onClick={() => setVegOnly(!vegOnly)}
            >
              <div className="stitch-veg-box">
                <div className={`stitch-veg-circle ${vegOnly ? 'bg-green-500' : ''}`} />
              </div>
              <span>VEG</span>
            </button>
          </div>

          {/* Sub-Tabs Row */}
          <div className="stitch-subtabs-row">
            {['ALL', 'OFFERS', 'FOOD ON TRAIN', 'GOURMET', 'GUILT FREE'].map(tab => (
              <button 
                key={tab}
                className={`stitch-subtab-btn ${subTab === tab ? 'active' : ''}`}
                onClick={() => setSubTab(tab)}
              >
                <span>{tab}</span>
                {subTab === tab && <div className="stitch-subtab-line" />}
              </button>
            ))}
          </div>

          {/* Hero Promotional Banner Card */}
          <div className="stitch-promo-banner">
            <div className="stitch-promo-content">
              <div className="stitch-promo-pill">
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>bolt</span>
                <span>LIMITED TIME</span>
              </div>
              <h2 className="stitch-promo-title">Feast On Your Cravings</h2>
              <p className="stitch-promo-sub">Up to 60% OFF + Free Delivery on trending spots</p>
              <button className="stitch-promo-cta">
                <span>ORDER NOW</span>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
              </button>
            </div>
            <div className="stitch-promo-img-wrap">
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80" 
                alt="Feast" 
              />
            </div>
          </div>

          {/* Category Rail */}
          <div className="stitch-rail-section">
            <div className="stitch-rail-header">
              <h3>What's on your mind?</h3>
              <span className="stitch-rail-link">EXPLORE</span>
            </div>
            <div className="stitch-rail-items">
              {CATEGORIES_RAIL.map(cat => (
                <div 
                  key={cat.name} 
                  className="stitch-rail-item"
                  onClick={() => setLocalSearch(cat.name)}
                >
                  <div className="stitch-rail-img-circle">
                    <img src={cat.img} alt={cat.name} />
                  </div>
                  <span>{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Rated Near You Section */}
          <div className="stitch-section">
            <div className="stitch-section-header">
              <div>
                <h3>Top rated near you</h3>
                <p className="stitch-section-sub">Handpicked culinary gems around Indiranagar</p>
              </div>
              <span className="stitch-rail-link">SEE ALL ›</span>
            </div>

            {loading ? (
              <div className="stitch-loading-skeleton">Loading fresh dishes...</div>
            ) : filtered.length > 0 ? (
              <div className="stitch-cards-grid">
                {filtered.map(item => (
                  <div key={item.fid} className="stitch-food-card">
                    <div className="stitch-card-img-wrap">
                      <img src={item.image} alt={item.fname} />
                      <div className="stitch-discount-badge">50% OFF UP TO ₹120</div>
                      <button className="stitch-heart-btn">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>favorite</span>
                      </button>
                    </div>

                    <div className="stitch-card-body">
                      <div className="stitch-card-title-row">
                        <h4 className="stitch-card-title">{item.fname}</h4>
                        <div className="stitch-rating-badge">
                          <span className="material-symbols-outlined fill" style={{ fontSize: '12px', color: '#f5bf2d' }}>star</span>
                          <span>{item.rating}</span>
                        </div>
                      </div>
                      <p className="stitch-card-meta">{item.category} • Fast Delivery</p>

                      <div className="stitch-card-footer">
                        <span className="stitch-card-price">₹{item.price}</span>
                        <button className="stitch-add-btn" onClick={() => openModal(item)}>
                          ADD +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-menu">
                <div className="emoji">🥺</div>
                <h4>No items found</h4>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ────────────────── VIEW 2: QUICK VOICE ORDER TAB ────────────────── */}
      {topTab === 'quick' && (
        <div className="stitch-quick-view">
          {/* Listening Live Header Pill */}
          <div className="stitch-listening-header">
            <div className="stitch-live-pill">
              <span className="stitch-pulse-dot" />
              <span>LISTENING LIVE</span>
            </div>
            <h2 className="stitch-voice-heading">Tap & speak your order</h2>
            <p className="stitch-voice-sub">
              Try: <span className="italic text-secondary">“Order 2 Paneer Butter Masala”</span>
            </p>
          </div>

          {/* Centered Large Glowing Mic Button with Sonic Pulse Rings */}
          <div className="stitch-mic-stage">
            <div className={`stitch-ring-outer ${isRecording ? 'animate-pulse-ring' : ''}`} />
            <div className="stitch-ring-inner" />
            
            <button 
              className={`stitch-main-mic-btn ${isRecording ? 'recording' : ''}`}
              onClick={handleMicPress}
            >
              <div className="stitch-mic-icon-circle">
                <span className="material-symbols-outlined fill" style={{ fontSize: '42px' }}>mic</span>
              </div>
            </button>
          </div>

          {/* Equalizer Soundwave Visualizer Bars */}
          <div className="stitch-sound-waves">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="wave-bar" 
                style={{ 
                  animationDelay: `${i * 90}ms`,
                  height: isRecording ? `${Math.random() * 20 + 10}px` : '8px',
                  background: i % 2 === 0 ? 'var(--primary-color)' : 'var(--tertiary-gold)'
                }} 
              />
            ))}
          </div>

          {/* Recognized Transcript Pill */}
          <div className="stitch-transcript-card">
            <div className="stitch-eq-icon">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>graphic_eq</span>
            </div>
            <p className="stitch-transcript-text">{transcript}</p>
            <span className="stitch-recognized-tag">RECOGNIZED</span>
          </div>

          {/* Auto-Checkout Timer Pill */}
          <div className="stitch-auto-timer-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined fill text-tertiary" style={{ fontSize: '18px' }}>timer</span>
                <span className="font-bold text-sm">Instant Voice Checkout ready</span>
              </div>
              <span className="stitch-timer-badge">Auto in 2s</span>
            </div>
            <div className="stitch-progress-track">
              <div className="stitch-progress-bar" />
            </div>
          </div>

          {/* Matched Cart Item Confirmation Card */}
          {voiceMatchedItem && (
            <div className="stitch-voice-matched-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="stitch-check-circle">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#10b981' }}>check</span>
                  </div>
                  <span className="font-bold text-sm">Got it! Adding to cart...</span>
                </div>
                <span className="font-extrabold text-tertiary">₹{voiceMatchedItem.price * voiceQty}</span>
              </div>

              <div className="stitch-matched-item-row">
                <img 
                  src={voiceMatchedItem.imageUrl || CATEGORY_IMAGES['Main Course']} 
                  alt={voiceMatchedItem.fname} 
                  className="stitch-matched-img"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm truncate">{voiceMatchedItem.fname}</h3>
                  <p className="text-xs text-muted truncate">Glen's Bakehouse • 4.8 ★</p>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-primary font-medium">Extra Fudge</span>
                    <div className="stitch-qty-stepper">
                      <button onClick={() => setVoiceQty(q => Math.max(1, q - 1))}>−</button>
                      <span>{voiceQty}</span>
                      <button onClick={() => setVoiceQty(q => q + 1)}>+</button>
                    </div>
                  </div>
                </div>
              </div>

              <button className="stitch-voice-pay-cta" onClick={handleProceedVoicePay}>
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>shopping_bag</span>
                  <span>Proceed to Pay</span>
                </span>
                <span className="flex items-center gap-1 font-extrabold">
                  <span>₹{voiceMatchedItem.price * voiceQty}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </span>
              </button>
            </div>
          )}

          {/* Fallback Suggestion Chips */}
          <div className="stitch-suggestions-card">
            <h4 className="font-bold text-sm mb-2">Did you mean one of these popular specials?</h4>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Chocolate Truffle Cake', price: 450, icon: '🍫' },
                { name: 'Belgian Dark Mousse', price: 190, icon: '🍮' },
                { name: 'Choco Lava Cupcake', price: 120, icon: '🧁' },
              ].map(sug => (
                <div 
                  key={sug.name} 
                  className="stitch-suggestion-row"
                  onClick={() => {
                    const found = food.find(f => f.fname.toLowerCase().includes(sug.name.toLowerCase()));
                    if (found) setVoiceMatchedItem(found);
                    toast.success(`Selected ${sug.name}`);
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span>{sug.icon}</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs">{sug.name}</span>
                      <span className="text-xs text-muted">Glen's • ₹{sug.price}</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-muted" style={{ fontSize: '18px' }}>add_circle</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FLOATING CHECKOUT CAPSULE ── */}
      {cartItems.length > 0 && (
        <div 
          className="stitch-floating-cart"
          onClick={() => navigate('/billing')}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '1.4rem' }}>🛒</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
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
          <div className="qty-modal-card">
            <button className="modal-close-btn" onClick={() => setSelectedItem(null)}>✕</button>

            <img
              src={selectedItem.image}
              alt={selectedItem.fname}
              className="qty-modal-img"
            />

            <h5 style={{ fontWeight: 800, color: 'var(--text-color)', marginBottom: 2 }}>{selectedItem.fname}</h5>
            <p style={{ color: '#ff5711', fontWeight: 700, fontSize: '1.1rem', marginBottom: 16 }}>₹{selectedItem.price} per item</p>

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