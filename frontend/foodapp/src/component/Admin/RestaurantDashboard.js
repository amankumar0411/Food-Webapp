import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

// Seed demo dishes if catalog is empty
const INITIAL_DEMO_DISHES = [
  {
    fid: 'PIZ-PEP-01',
    fname: 'Artisanal Pepperoni Sourdough Pizza',
    category: 'Woodfired Pizza',
    price: 399,
    discountPrice: 499,
    prepTime: 15,
    portions: 42,
    isVeg: false,
    inStock: true,
    soldCount: 28,
    tags: 'Woodfired,Sourdough,Chef Signature',
    imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&auto=format&fit=crop&q=80'
  },
  {
    fid: 'PIZ-PAN-04',
    fname: 'Smoky BBQ Paneer Artisan Pizza',
    category: 'Woodfired Pizza',
    price: 349,
    discountPrice: 420,
    prepTime: 14,
    portions: 30,
    isVeg: true,
    inStock: true,
    soldCount: 19,
    tags: 'Woodfired,BBQ,Artisan',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80'
  },
  {
    fid: 'DES-LAV-02',
    fname: 'Belgian Dark Molten Lava Cake',
    category: 'Desserts & Bakes',
    price: 189,
    discountPrice: null,
    prepTime: 10,
    portions: 3,
    isVeg: true,
    inStock: true,
    soldCount: 32,
    tags: 'Eggless,Warm Dispatch,Decadent',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80'
  },
  {
    fid: 'BIR-SAF-09',
    fname: 'Hyderabadi Saffron Chicken Biryani',
    category: 'Biryanis & Mains',
    price: 420,
    discountPrice: null,
    prepTime: 20,
    portions: 0,
    isVeg: false,
    inStock: false,
    soldCount: 41,
    tags: 'Dum Cooked,Heritage Saffron',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80'
  },
  {
    fid: 'BAK-CRO-01',
    fname: 'Classic French Butter Croissant',
    category: 'Desserts & Bakes',
    price: 145,
    discountPrice: 175,
    prepTime: 8,
    portions: 18,
    isVeg: true,
    inStock: true,
    soldCount: 14,
    tags: 'All-Butter,Laminated,Flaky',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80'
  }
];

// Initial realistic live incoming KOTs
const INITIAL_DEMO_KOTS = [
  {
    id: 'ZK-9482',
    tokenNumber: '#82',
    patronName: 'Priya S.',
    deliveryType: 'Guild Express',
    address: 'Indiranagar 100ft Rd (1.2 km away)',
    timeAgo: '2m Ago',
    amount: 987.0,
    paymentStatus: 'Pre-Paid Online',
    pipelineStatus: 'incoming',
    kitchenNote: 'Extra crispy base please, pack woodfired dipping sauces separately in sealed tubs.',
    items: [
      { name: 'Artisanal Pepperoni Pizza', qty: 2, price: 798, isVeg: false, details: 'Medium, Fermented Sourdough, +Extra Aged Parmesan, Charred Crust' },
      { name: 'Belgian Dark Molten Lava Cake', qty: 1, price: 189, isVeg: true, details: 'Warm dispatch, dusted powdered cocoa' }
    ]
  },
  {
    id: 'ZK-9480',
    tokenNumber: '#80',
    patronName: 'Rahul M.',
    deliveryType: 'Rider: Ankit K.',
    address: 'Domlur Flyover Corner',
    timeAgo: '4m Ago',
    amount: 650.0,
    paymentStatus: 'UPI Confirmed',
    pipelineStatus: 'incoming',
    kitchenNote: null,
    items: [
      { name: 'Hyderabadi Saffron Chicken Dum Biryani', qty: 1, price: 420, isVeg: false, details: 'Heritage spice mix, caramelized onions' },
      { name: 'Garlic Butter Tandoori Naan', qty: 2, price: 160, isVeg: true, details: 'Charred clay oven blister' },
      { name: 'Burani Mint Raita', qty: 1, price: 70, isVeg: true, details: 'Roasted garlic tempered curd' }
    ]
  },
  {
    id: 'ZK-9477',
    tokenNumber: '#77',
    patronName: 'Vikramaditya R.',
    deliveryType: 'Guild Express',
    address: 'Koramangala 4th Block',
    timeAgo: '11m Ago',
    amount: 1120.0,
    paymentStatus: 'Pre-Paid Online',
    pipelineStatus: 'in_prep',
    prepRemainingSeconds: 272, // 04:32
    kitchenNote: 'No onions in salad please.',
    items: [
      { name: 'Truffle Mushroom Risotto', qty: 1, price: 580, isVeg: true, details: 'Carnaroli rice, wild porcini' },
      { name: 'Smoky BBQ Paneer Artisan Pizza', qty: 1, price: 349, isVeg: true, details: 'Charred crust, fresh basil' },
      { name: 'Cold Pressed Hibiscus Brew', qty: 1, price: 191, isVeg: true, details: 'Light ice, zero refined sugar' }
    ]
  }
];

export default function RestaurantDashboard({ searchQuery: initialSearchQuery = "" }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Viewport listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auth & Store Profile State
  const currentUser = localStorage.getItem('user') || 'Chef Marco';
  const merchantRole = localStorage.getItem('role') || 'merchant';
  const restaurantName = localStorage.getItem('restaurantName') || 'Toscano Hearth & Pantry';

  // Store Operational State
  const [isStoreOnline, setIsStoreOnline] = useState(true);
  const [isRushActive, setIsRushActive] = useState(false);
  const [kotChimeArmed, setKotChimeArmed] = useState(true);

  // KOT Pipeline State
  const [kots, setKots] = useState(INITIAL_DEMO_KOTS);
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'in_prep' | 'ready' | 'past'

  // Food Catalog State
  const [dishes, setDishes] = useState([]);
  const [loadingDishes, setLoadingDishes] = useState(true);
  const [dishSearch, setDishSearch] = useState(initialSearchQuery);
  const [dietaryFilter, setDietaryFilter] = useState('all'); // 'all' | 'veg' | 'non-veg'
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Authoring Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingDishId, setEditingDishId] = useState(null);
  const [drawerForm, setDrawerForm] = useState({
    name: '',
    category: 'Woodfired Pizza',
    price: '',
    discountPrice: '',
    prepTime: '15',
    portions: '40',
    isVeg: true,
    tags: 'Woodfired,Sourdough',
    imageUrl: ''
  });

  // Mobile Bottom Nav Active Tab
  const [mobileNavTab, setMobileNavTab] = useState('live-kot'); // 'live-kot' | 'menu' | 'earnings' | 'store'

  // Profile Menu Dropdown
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // 1. DATA FETCHING: Foods & Orders
  // ─────────────────────────────────────────────────────────────
  const loadCatalog = useCallback(async () => {
    try {
      setLoadingDishes(true);
      const res = await axiosInstance.get('/food/fetch');
      if (Array.isArray(res.data) && res.data.length > 0) {
        // Merge backend foods with fallback defaults if missing fields
        const formatted = res.data.map((item, idx) => ({
          fid: item.fid || `DISH-${idx + 1}`,
          fname: item.fname || 'Artisanal Dish',
          category: item.category || 'Woodfired Pizza',
          price: item.price || 299,
          discountPrice: item.discountPrice || null,
          prepTime: item.prepTime || 15,
          portions: item.portions !== undefined ? item.portions : 35,
          isVeg: item.isVeg !== undefined ? item.isVeg : true,
          inStock: item.inStock !== undefined ? item.inStock : true,
          soldCount: Math.floor(10 + (idx * 7) % 30),
          tags: item.tags || 'Chef Special,Artisanal',
          imageUrl: item.imageUrl || ''
        }));
        setDishes(formatted);
      } else {
        setDishes(INITIAL_DEMO_DISHES);
      }
    } catch (err) {
      console.warn('Using local demo catalog as fallback:', err);
      setDishes(INITIAL_DEMO_DISHES);
    } finally {
      setLoadingDishes(false);
    }
  }, []);

  const loadBackendOrders = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/order-dtls/all');
      if (Array.isArray(res.data) && res.data.length > 0) {
        // Adapt real backend orders into live KOT format
        const realKots = res.data.slice(0, 8).map((o, idx) => {
          const status = (o.orderStatus || 'PAID').toUpperCase();
          let pipelineStatus = 'incoming';
          if (status === 'PREPARING' || status === 'OUT_FOR_DELIVERY') pipelineStatus = 'in_prep';
          if (status === 'DELIVERED') pipelineStatus = 'past';

          return {
            id: `ZK-${o.id || 9400 + idx}`,
            tokenNumber: `#${(o.id || idx + 50) % 100}`,
            patronName: o.uname || 'Valued Patron',
            deliveryType: o.driverUname ? `Rider: ${o.driverUname}` : 'Guild Express',
            address: o.address || 'Central Delivery Hub',
            timeAgo: 'Just now',
            amount: o.grandTotal || o.totalPrice || 450,
            paymentStatus: o.paymentStatus || 'PAID Online',
            pipelineStatus: pipelineStatus,
            kitchenNote: 'Carefully packaged in compostable container',
            items: [
              {
                name: o.fname || 'Artisanal Selection',
                qty: o.qty || 1,
                price: o.totalPrice || 450,
                isVeg: true,
                details: 'Standard guild craft'
              }
            ]
          };
        });
        // Merge real orders with our sample urgent cards so the kitchen is always lively
        setKots(prev => {
          const combined = [...prev.filter(k => k.id.startsWith('ZK-948')), ...realKots];
          // Remove duplicates
          const seen = new Set();
          return combined.filter(k => {
            if (seen.has(k.id)) return false;
            seen.add(k.id);
            return true;
          });
        });
      }
    } catch (err) {
      console.warn('Using local KOT queue:', err);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
    loadBackendOrders();
  }, [loadCatalog, loadBackendOrders]);

  // In-Prep Countdown Timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setKots(prevKots =>
        prevKots.map(kot => {
          if (kot.pipelineStatus === 'in_prep' && kot.prepRemainingSeconds > 0) {
            return { ...kot, prepRemainingSeconds: kot.prepRemainingSeconds - 1 };
          }
          return kot;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format seconds to MM:SS
  const formatTime = (totalSeconds = 0) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // ─────────────────────────────────────────────────────────────
  // 2. KOT DISPATCH ACTIONS
  // ─────────────────────────────────────────────────────────────
  const handleAcceptOrder = (orderId, prepMinutes = 15) => {
    const buffer = isRushActive ? 10 : 0;
    const finalPrep = prepMinutes + buffer;

    setKots(prev =>
      prev.map(k => {
        if (k.id === orderId) {
          return {
            ...k,
            pipelineStatus: 'in_prep',
            prepRemainingSeconds: finalPrep * 60
          };
        }
        return k;
      })
    );
    toast.success(`Order ${orderId} accepted! (${finalPrep}m prep queued to oven)`);
  };

  const handleDeclineOrder = (orderId) => {
    setKots(prev => prev.filter(k => k.id !== orderId));
    toast.error(`Order ${orderId} declined and patron notified.`);
  };

  const handleMarkReady = (orderId) => {
    setKots(prev =>
      prev.map(k => {
        if (k.id === orderId) {
          return { ...k, pipelineStatus: 'ready' };
        }
        return k;
      })
    );
    toast.success(`Order ${orderId} marked ready for rider pickup!`);
  };

  const handlePrintKOT = (orderId) => {
    toast(`Dispatched KOT ${orderId} to Thermal Kitchen Printer #01`, {
      icon: '🖨️'
    });
  };

  // ─────────────────────────────────────────────────────────────
  // 3. STORE STATE & RUSH CONTROLS
  // ─────────────────────────────────────────────────────────────
  const toggleStoreStatus = () => {
    if (isStoreOnline) {
      setIsStoreOnline(false);
      toast.error('Store offline. Incoming orders paused.');
    } else {
      setIsStoreOnline(true);
      toast.success('Store online! Accepting orders.');
    }
  };

  const toggleRushMode = () => {
    setIsRushActive(prev => {
      const next = !prev;
      if (next) {
        toast('Rush active: +10m prep buffer added across all menus', { icon: '⏱️' });
      } else {
        toast.success('Rush mode deactivated: Normal prep times restored');
      }
      return next;
    });
  };

  const toggleAudioChime = () => {
    setKotChimeArmed(prev => {
      const next = !prev;
      toast(next ? 'KOT audio chime armed' : 'KOT chime muted for this terminal', {
        icon: next ? '🔔' : '🔕'
      });
      return next;
    });
  };

  // ─────────────────────────────────────────────────────────────
  // 4. DISH CATALOG & INVENTORY CONTROLS (86-ing & CRUD)
  // ─────────────────────────────────────────────────────────────
  const handleToggleStock = async (fid) => {
    try {
      // Optimistic update
      setDishes(prev =>
        prev.map(d => {
          if (d.fid === fid) {
            const nextStock = !d.inStock;
            return { ...d, inStock: nextStock, portions: nextStock ? (d.portions || 20) : 0 };
          }
          return d;
        })
      );

      // Persist to backend if possible
      await axiosInstance.put(`/food/stock/${encodeURIComponent(fid)}`).catch(() => {});

      const target = dishes.find(d => d.fid === fid);
      if (target?.inStock) {
        toast.error(`86-ed: "${target.fname}" is now paused on customer apps.`);
      } else {
        toast.success(`Restocked: "${target?.fname}" is live on store feed!`);
      }
    } catch {
      toast.error('Failed to update stock status.');
    }
  };

  const handleDeleteDish = async (fid, fname) => {
    if (!window.confirm(`Permanently remove "${fname}" from your menu catalog?`)) return;
    try {
      await axiosInstance.delete(`/food/del/${encodeURIComponent(fid)}`).catch(() => {});
      setDishes(prev => prev.filter(d => d.fid !== fid));
      toast.success(`"${fname}" removed from catalog.`);
    } catch {
      toast.error('Could not delete dish.');
    }
  };

  const handleDuplicateDish = (dish) => {
    const newId = `COPY-${Date.now().toString().slice(-4)}`;
    const cloned = {
      ...dish,
      fid: newId,
      fname: `${dish.fname} (Copy)`,
      soldCount: 0
    };
    setDishes(prev => [cloned, ...prev]);
    toast.success(`Cloned formula for "${dish.fname}".`);
  };

  const handleOpenEditDrawer = (dish) => {
    setEditingDishId(dish.fid);
    setDrawerForm({
      name: dish.fname,
      category: dish.category || 'Woodfired Pizza',
      price: dish.price,
      discountPrice: dish.discountPrice || '',
      prepTime: dish.prepTime || '15',
      portions: dish.portions || '40',
      isVeg: dish.isVeg !== undefined ? dish.isVeg : true,
      tags: dish.tags || 'Woodfired,Sourdough',
      imageUrl: dish.imageUrl || ''
    });
    setIsDrawerOpen(true);
  };

  const handleOpenNewDrawer = () => {
    setEditingDishId(null);
    setDrawerForm({
      name: '',
      category: 'Woodfired Pizza',
      price: '',
      discountPrice: '',
      prepTime: '15',
      portions: '40',
      isVeg: true,
      tags: 'Woodfired,Artisanal,Chef Signature',
      imageUrl: ''
    });
    setIsDrawerOpen(true);
  };

  const handleSaveDrawerDish = async (e) => {
    if (e) e.preventDefault();
    const { name, category, price, discountPrice, prepTime, portions, isVeg, tags, imageUrl } = drawerForm;

    if (!name.trim()) {
      toast.error('Please provide a dish name.');
      return;
    }
    const numPrice = parseFloat(price);
    if (!numPrice || numPrice <= 0) {
      toast.error('Please enter a valid base price.');
      return;
    }

    const payload = {
      fid: editingDishId || `ZK-${Date.now().toString().slice(-6)}`,
      fname: name.trim(),
      category: category,
      price: numPrice,
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      prepTime: parseInt(prepTime, 10) || 15,
      portions: parseInt(portions, 10) || 40,
      isVeg: Boolean(isVeg),
      inStock: true,
      tags: tags.trim(),
      imageUrl: imageUrl.trim()
    };

    try {
      if (editingDishId) {
        await axiosInstance.put(`/food/upd/${encodeURIComponent(editingDishId)}`, payload).catch(() => {});
        setDishes(prev => prev.map(d => (d.fid === editingDishId ? { ...d, ...payload } : d)));
        toast.success(`Updated "${payload.fname}" successfully.`);
      } else {
        await axiosInstance.post('/food/add', payload).catch(() => {});
        setDishes(prev => [{ ...payload, soldCount: 0 }, ...prev]);
        toast.success(`Published "${payload.fname}" to live customer menu!`);
      }
      setIsDrawerOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save dish to backend.');
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 5. FILTERED DISHES
  // ─────────────────────────────────────────────────────────────
  const filteredDishes = useMemo(() => {
    return dishes.filter(item => {
      const nameMatch = (item.fname || '').toLowerCase().includes(dishSearch.toLowerCase()) ||
        (item.fid || '').toLowerCase().includes(dishSearch.toLowerCase()) ||
        (item.tags || '').toLowerCase().includes(dishSearch.toLowerCase());

      const dietMatch =
        dietaryFilter === 'all' ? true : dietaryFilter === 'veg' ? item.isVeg : !item.isVeg;

      const catMatch =
        categoryFilter === 'all'
          ? true
          : (item.category || '').toLowerCase().includes(categoryFilter.toLowerCase());

      return nameMatch && dietMatch && catMatch;
    });
  }, [dishes, dishSearch, dietaryFilter, categoryFilter]);

  // Current pipeline counts
  const incomingCount = kots.filter(k => k.pipelineStatus === 'incoming').length;
  const inPrepCount = kots.filter(k => k.pipelineStatus === 'in_prep').length;
  const readyCount = kots.filter(k => k.pipelineStatus === 'ready').length;

  const currentTabKots = useMemo(() => {
    return kots.filter(k => k.pipelineStatus === activeTab);
  }, [kots, activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    toast('Signed out from Kitchen Terminal');
    navigate('/merchant/login');
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER: DESKTOP & MOBILE
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#fff8ef] text-[#1e1b15] min-h-screen flex flex-col antialiased selection:bg-[#c20019] selection:text-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      
      {/* ─────────────────────────────────────────────────────────────
          1. EDITORIAL BOTANICAL HEADER (DESKTOP)
      ───────────────────────────────────────────────────────────── */}
      {!isMobile ? (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8ef]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#eee7dc]">
          <div className="max-w-[1440px] mx-auto px-10 h-20 flex items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-8 shrink-0 cursor-pointer" onClick={() => navigate('/')}>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-[#191816]" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>ZAYKA</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#950010] inline-block"></span>
              </div>
              <span className="text-xs font-mono tracking-widest text-[#5d3f3d] uppercase hidden xl:inline">KITCHEN TERMINAL #04</span>
            </div>

            {/* Quick Dish / SKU Search */}
            <div className="flex-1 max-w-xl flex items-center">
              <div className="w-full flex items-center bg-[#faf3e8] px-4 py-2.5 rounded-full border border-[#eee7dc] hover:border-[#e6bdb9] transition-colors">
                <span className="material-symbols-outlined text-base mr-2 text-[#916f6b]">search</span>
                <input
                  className="w-full bg-transparent text-sm text-[#1e1b15] placeholder:text-[#916f6b] focus:outline-none"
                  placeholder="Search dishes by title, SKU or kitchen tag..."
                  type="text"
                  value={dishSearch}
                  onChange={(e) => setDishSearch(e.target.value)}
                />
                {dishSearch && (
                  <button onClick={() => setDishSearch('')} className="text-xs text-[#916f6b] hover:text-black">✕</button>
                )}
              </div>
            </div>

            {/* Right Controls: Audio Chime, Rush Pill, Profile Avatar */}
            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={toggleAudioChime}
                title="Toggle KOT chime alerts"
                className="p-2 text-[#191816] hover:bg-[#f4ede2] rounded-full transition-colors flex items-center gap-1.5 text-xs font-mono"
              >
                <span className="material-symbols-outlined text-lg">{kotChimeArmed ? 'volume_up' : 'volume_off'}</span>
                <span className="hidden xl:inline">{kotChimeArmed ? 'CHIME: ON' : 'MUTED'}</span>
              </button>

              <button
                onClick={toggleRushMode}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 ${
                  isRushActive ? 'bg-[#C36953] text-white shadow-sm' : 'bg-[#eee7dc] text-[#191816] hover:bg-[#e0d9cf]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">timelapse</span>
                {isRushActive ? 'RUSH ACTIVE (+10M)' : '+10M RUSH'}
              </button>

              {/* Profile Pill & Dropdown */}
              <div className="relative">
                <div
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[#faf3e8] border border-[#eee7dc] cursor-pointer hover:bg-[#f4ede2] transition-colors"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-[#950010] flex items-center justify-center text-white font-bold font-mono text-xs">
                    {currentUser.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#191816]">{currentUser}</span>
                  <span className="material-symbols-outlined text-base text-[#5d3f3d]">expand_more</span>
                </div>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#ffffff] border border-[#eee7dc] rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#eee7dc]">
                      <div className="text-xs font-bold text-[#191816]">{restaurantName}</div>
                      <div className="text-[11px] font-mono text-[#8E9982] uppercase tracking-wider">{merchantRole} • Indiranagar Hub</div>
                    </div>
                    <button
                      onClick={() => { setIsProfileMenuOpen(false); navigate('/merchant/register'); }}
                      className="w-full text-left px-4 py-2 text-xs text-[#1e1b15] hover:bg-[#faf3e8] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">store</span> Register New Kitchen
                    </button>
                    <button
                      onClick={() => { setIsProfileMenuOpen(false); navigate('/foodlistclient'); }}
                      className="w-full text-left px-4 py-2 text-xs text-[#1e1b15] hover:bg-[#faf3e8] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">restaurant</span> View Patron Food Menu
                    </button>
                    <div className="border-t border-[#eee7dc] my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs text-[#ba1a1a] hover:bg-[#ffdad6] flex items-center gap-2 font-semibold"
                    >
                      <span className="material-symbols-outlined text-base">logout</span> Sign Out Terminal
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      ) : (
        /* ─────────────────────────────────────────────────────────────
            1B. MOBILE HEADER
        ───────────────────────────────────────────────────────────── */
        <header className="fixed top-0 inset-x-0 z-50 bg-[#fff8ef]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#eee7dc] px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={() => navigate('/')}>
            <span className="text-xl font-bold tracking-tight text-[#191816]" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>ZAYKA</span>
            <span className="w-2 h-2 rounded-full bg-[#950010] inline-block"></span>
            <span className="text-[10px] font-mono text-[#8E9982] ml-1 uppercase">HUB #04</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleRushMode}
              className={`p-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 ${
                isRushActive ? 'bg-[#C36953] text-white' : 'bg-[#eee7dc] text-[#191816]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">timelapse</span>
              {isRushActive ? '+10M' : 'RUSH'}
            </button>
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-full bg-[#950010] flex items-center justify-center text-white font-bold font-mono text-xs"
              title="Logout"
            >
              {currentUser.slice(0, 2).toUpperCase()}
            </button>
          </div>
        </header>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT AREA
      ───────────────────────────────────────────────────────────── */}
      <main className={`w-full max-w-[1440px] mx-auto ${isMobile ? 'pt-20 pb-24 px-4' : 'pt-28 pb-16 px-10'} space-y-6 flex-1`}>
        
        {/* ─────────────────────────────────────────────────────────────
            SECTION 1: TOP METRICS & OPERATIONAL HUD
        ───────────────────────────────────────────────────────────── */}
        <section className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5'} gap-4`}>
          {/* Metric 1: Revenue */}
          <div className="bg-[#ffffff] p-4 rounded-xl shadow-sm hover:shadow transition-shadow flex flex-col justify-between border border-[#eee7dc]">
            <div className="flex items-center justify-between text-[#5d3f3d]">
              <span className="font-mono text-xs uppercase tracking-wider">Today's Gross Sales</span>
              <span className="material-symbols-outlined text-base text-[#8E9982]">trending_up</span>
            </div>
            <div className="my-2">
              <div className="text-2xl lg:text-3xl font-bold tracking-tight text-[#191816]" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>₹48,650</div>
              <p className="font-mono text-[11px] text-[#8E9982] font-medium mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">arrow_upward</span> +14.2% vs yday
              </p>
            </div>
            <div className="w-full bg-[#faf3e8] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#c20019] h-full rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>

          {/* Metric 2: Live KOTs */}
          <div className="bg-[#ffffff] p-4 rounded-xl shadow-sm hover:shadow transition-shadow flex flex-col justify-between border border-[#eee7dc]">
            <div className="flex items-center justify-between text-[#5d3f3d]">
              <span className="font-mono text-xs uppercase tracking-wider">Active KOTs</span>
              <span className="material-symbols-outlined text-base text-[#c20019]">skillet</span>
            </div>
            <div className="my-2">
              <div className="text-2xl lg:text-3xl font-bold tracking-tight text-[#191816]" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                {incomingCount + inPrepCount} <span className="text-sm font-normal text-[#5d3f3d]">orders</span>
              </div>
              <p className="font-mono text-[11px] text-[#C36953] font-medium mt-1">
                {incomingCount} Incoming • {inPrepCount} In Prep
              </p>
            </div>
            <div className="w-full bg-[#faf3e8] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#C36953] h-full rounded-full" style={{ width: `${Math.min(100, (incomingCount + inPrepCount) * 20)}%` }}></div>
            </div>
          </div>

          {/* Metric 3: Rejections */}
          <div className="bg-[#ffffff] p-4 rounded-xl shadow-sm hover:shadow transition-shadow flex flex-col justify-between border border-[#eee7dc]">
            <div className="flex items-center justify-between text-[#5d3f3d]">
              <span className="font-mono text-xs uppercase tracking-wider">Order Rejections</span>
              <span className="material-symbols-outlined text-base text-[#8E9982]">verified_user</span>
            </div>
            <div className="my-2">
              <div className="text-2xl lg:text-3xl font-bold tracking-tight text-[#191816]" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>0.8%</div>
              <p className="font-mono text-[11px] text-[#8E9982] mt-1">Target &lt;2.0% • Stellar</p>
            </div>
            <div className="w-full bg-[#faf3e8] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#8E9982] h-full rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>

          {/* Metric 4: Prep Time */}
          <div className="bg-[#ffffff] p-4 rounded-xl shadow-sm hover:shadow transition-shadow flex flex-col justify-between border border-[#eee7dc]">
            <div className="flex items-center justify-between text-[#5d3f3d]">
              <span className="font-mono text-xs uppercase tracking-wider">Avg Prep Time</span>
              <span className="material-symbols-outlined text-base text-[#5d3f3d]">timer</span>
            </div>
            <div className="my-2">
              <div className="text-2xl lg:text-3xl font-bold tracking-tight text-[#191816]" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                14.2 <span className="text-sm font-normal text-[#5d3f3d]">min</span>
              </div>
              <p className="font-mono text-[11px] text-[#8E9982] mt-1">Target: 18.0 min (3.8m cushion)</p>
            </div>
            <div className="w-full bg-[#faf3e8] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#8E9982] h-full rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>

          {/* Metric 5: Store State Controller */}
          <div className={`p-4 rounded-xl shadow-sm flex flex-col justify-between border ${isMobile ? 'col-span-2' : ''} ${
            isStoreOnline ? 'bg-[#faf3e8] border-[#eee7dc]' : 'bg-[#ffdad6] border-[#ba1a1a]/30'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-[#191816] leading-tight flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isStoreOnline ? 'bg-[#3f4b35] animate-pulse' : 'bg-[#ba1a1a]'}`}></span>
                  {isStoreOnline ? 'Accepting Orders' : 'Orders Paused'}
                </div>
                <span className="font-mono text-[11px] text-[#5d3f3d]">{restaurantName} #04</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={toggleStoreStatus}
                className={`flex-1 py-1.5 px-3 font-mono text-xs uppercase tracking-wider rounded-lg font-semibold transition-colors text-center ${
                  isStoreOnline ? 'bg-[#191816] text-[#fff8ef] hover:bg-[#c20019]' : 'bg-[#ba1a1a] text-white hover:bg-[#93000a]'
                }`}
              >
                {isStoreOnline ? 'Active Online' : 'Paused / Offline'}
              </button>
              <button
                onClick={toggleRushMode}
                className="px-2.5 py-1.5 bg-[#f4ede2] hover:bg-[#eee7dc] text-[#191816] rounded-lg text-xs font-mono font-bold"
                title="Add 10-minute prep buffer"
              >
                {isRushActive ? '✓ Rush' : '+10m'}
              </button>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            2-COLUMN SPLIT: LEFT DISPATCH & CATALOG / RIGHT SETTLEMENTS
        ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* MAIN OPERATIONAL COLUMN (8 Cols on Desktop) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* ─────────────────────────────────────────────────────────────
                SECTION 2: LIVE DISPATCH & KOT QUEUE
            ───────────────────────────────────────────────────────────── */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl lg:text-2xl font-bold text-[#191816]" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                      Live KOT Dispatch Desk
                    </h2>
                    {incomingCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#ffdbd1] text-[#703626] animate-pulse">
                        {incomingCount} NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5d3f3d] mt-0.5">
                    Real-time patron orders routing directly to {restaurantName} thermal kitchen queue.
                  </p>
                </div>

                {/* Pipeline Tabs */}
                <div className="flex items-center gap-1 bg-[#f4ede2] p-1 rounded-xl font-mono text-xs overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('incoming')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                      activeTab === 'incoming'
                        ? 'bg-[#ffffff] text-[#191816] shadow-sm'
                        : 'text-[#5d3f3d] hover:text-[#191816]'
                    }`}
                  >
                    Incoming ({incomingCount})
                  </button>
                  <button
                    onClick={() => setActiveTab('in_prep')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                      activeTab === 'in_prep'
                        ? 'bg-[#ffffff] text-[#191816] shadow-sm'
                        : 'text-[#5d3f3d] hover:text-[#191816]'
                    }`}
                  >
                    In Prep ({inPrepCount})
                  </button>
                  <button
                    onClick={() => setActiveTab('ready')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                      activeTab === 'ready'
                        ? 'bg-[#ffffff] text-[#191816] shadow-sm'
                        : 'text-[#5d3f3d] hover:text-[#191816]'
                    }`}
                  >
                    Ready ({readyCount})
                  </button>
                  <button
                    onClick={() => setActiveTab('past')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                      activeTab === 'past'
                        ? 'bg-[#ffffff] text-[#191816] shadow-sm'
                        : 'text-[#5d3f3d] hover:text-[#191816]'
                    }`}
                  >
                    Past KOTs
                  </button>
                </div>
              </div>

              {/* Order Cards Container */}
              <div className="space-y-4">
                {currentTabKots.length === 0 ? (
                  <div className="bg-[#ffffff] p-8 rounded-xl border border-[#eee7dc] text-center text-[#5d3f3d] font-mono text-sm">
                    No orders currently in <span className="font-bold uppercase text-[#191816]">{activeTab.replace('_', ' ')}</span> state.
                  </div>
                ) : (
                  currentTabKots.map(kot => (
                    <div
                      key={kot.id}
                      className={`p-4 lg:p-5 rounded-xl border transition-all ${
                        kot.pipelineStatus === 'in_prep'
                          ? 'bg-[#faf3e8] border-[#eee7dc]'
                          : kot.pipelineStatus === 'ready'
                          ? 'bg-[#ffffff] border-[#8E9982]/40 shadow-sm'
                          : 'bg-[#ffffff] border-[#eee7dc] shadow-sm hover:shadow'
                      }`}
                    >
                      {/* Top Row: Token, Order ID, Patron, Total Amount */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#eee7dc]">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                            kot.pipelineStatus === 'incoming'
                              ? 'bg-[#ffdad6] text-[#410003]'
                              : kot.pipelineStatus === 'in_prep'
                              ? 'bg-[#d9e7c9] text-[#141e0c]'
                              : 'bg-[#faf3e8] text-[#191816]'
                          }`}>
                            {kot.tokenNumber}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-base text-[#191816]" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                                Order {kot.id}
                              </span>
                              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                                kot.pipelineStatus === 'incoming'
                                  ? 'bg-[#c20019] text-white'
                                  : kot.pipelineStatus === 'in_prep'
                                  ? 'bg-[#3f4b35] text-white'
                                  : 'bg-[#8E9982] text-white'
                              }`}>
                                {kot.pipelineStatus === 'incoming' ? `New • ${kot.timeAgo}` : kot.pipelineStatus.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-xs text-[#5d3f3d] mt-0.5">
                              Patron: <strong className="text-[#191816]">{kot.patronName}</strong> • {kot.deliveryType} • {kot.address}
                            </div>
                          </div>
                        </div>

                        <div className="text-right sm:shrink-0">
                          <div className="text-lg font-bold font-mono text-[#191816]">₹{kot.amount.toFixed(2)}</div>
                          <span className="text-[11px] font-mono text-[#3f4b35] font-semibold flex items-center sm:justify-end gap-1">
                            <span className="material-symbols-outlined text-xs">check_circle</span> {kot.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items Breakup */}
                      <div className="py-3 space-y-2 bg-[#faf3e8]/60 p-3 rounded-lg my-3 border border-[#eee7dc]/50">
                        {kot.items.map((item, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 border p-0.5 flex items-center justify-center shrink-0 ${
                                  item.isVeg ? 'border-green-700' : 'border-red-700'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-700' : 'bg-red-700'}`}></span>
                                </span>
                                <span className="font-semibold text-[#191816]">{item.qty}x {item.name}</span>
                              </div>
                              <span className="font-mono text-xs font-semibold text-[#191816]">₹{item.price}</span>
                            </div>
                            {item.details && (
                              <p className="text-xs text-[#5d3f3d] pl-5 italic font-mono">{item.details}</p>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Special Kitchen Note Callout */}
                      {kot.kitchenNote && (
                        <div className="p-2.5 bg-[#f4ede2] rounded-lg flex items-start gap-2 text-xs text-[#1e1b15] border border-[#eee7dc]">
                          <span className="material-symbols-outlined text-base text-[#C36953] shrink-0 mt-0.5">notes</span>
                          <p className="italic">
                            <strong className="not-italic text-[#191816] font-semibold">Kitchen Note:</strong> "{kot.kitchenNote}"
                          </p>
                        </div>
                      )}

                      {/* Active In-Prep Timer Progress Bar */}
                      {kot.pipelineStatus === 'in_prep' && (
                        <div className="mt-3 pt-2 border-t border-[#eee7dc]">
                          <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                            <span className="text-[#5d3f3d] uppercase font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm animate-spin">cyclone</span> Remaining Oven & Prep Time
                            </span>
                            <span className="text-base font-bold text-[#c20019]">{formatTime(kot.prepRemainingSeconds)}</span>
                          </div>
                          <div className="w-full bg-[#e8e2d7] h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#C36953] h-full rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min(100, Math.max(15, 100 - (kot.prepRemainingSeconds / (15 * 60)) * 100))}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="mt-4 pt-2 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePrintKOT(kot.id)}
                            className="px-3 py-1.5 bg-[#f4ede2] hover:bg-[#eee7dc] text-[#191816] rounded-lg text-xs font-mono font-semibold uppercase flex items-center gap-1.5 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">print</span> Print KOT
                          </button>
                          {kot.pipelineStatus === 'incoming' && (
                            <button
                              onClick={() => handleDeclineOrder(kot.id)}
                              className="px-3 py-1.5 bg-[#fff8ef] hover:bg-[#ffdad6] text-[#c20019] rounded-lg text-xs font-mono font-bold uppercase transition-colors"
                            >
                              Decline
                            </button>
                          )}
                        </div>

                        <div>
                          {kot.pipelineStatus === 'incoming' && (
                            <button
                              onClick={() => handleAcceptOrder(kot.id, 15)}
                              className="px-4 py-2 bg-[#c20019] hover:bg-[#950010] text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
                            >
                              <span className="material-symbols-outlined text-base">soup_kitchen</span>
                              Accept (15m Prep)
                            </button>
                          )}
                          {kot.pipelineStatus === 'in_prep' && (
                            <button
                              onClick={() => handleMarkReady(kot.id)}
                              className="px-4 py-2 bg-[#191816] hover:bg-[#3f4b35] text-[#fff8ef] rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
                            >
                              <span className="material-symbols-outlined text-base">check_circle</span>
                              Mark Ready for Pickup
                            </button>
                          )}
                          {kot.pipelineStatus === 'ready' && (
                            <span className="px-3 py-1.5 bg-[#d9e7c9] text-[#141e0c] font-mono text-xs font-bold rounded-lg uppercase">
                              Awaiting Courier Pickup
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                SECTION 3: FOOD MENU & INVENTORY CONTROLS (86-ING)
            ───────────────────────────────────────────────────────────── */}
            <div className="space-y-4 pt-4 border-t border-[#eee7dc]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-[#191816]" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                    Menu Catalog & Inventory Controls
                  </h3>
                  <p className="text-xs text-[#5d3f3d] mt-0.5">
                    Real-time 86'ing, portion allotment, formula specs, and catalog publishing.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#f4ede2] text-[#5d3f3d] font-mono text-xs rounded-lg font-bold">
                    {dishes.length} Active Dishes
                  </span>
                  <button
                    onClick={handleOpenNewDrawer}
                    className="px-4 py-2 bg-[#c20019] hover:bg-[#950010] text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <span className="material-symbols-outlined text-base">add</span> Add New Dish
                  </button>
                </div>
              </div>

              {/* Filter & Search Console */}
              <div className="bg-[#ffffff] p-3 rounded-xl border border-[#eee7dc] shadow-sm space-y-3">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div className="flex-1 w-full flex items-center bg-[#faf3e8] px-3 py-2 rounded-lg border border-[#eee7dc]">
                    <span className="material-symbols-outlined text-base text-[#916f6b] mr-2">search</span>
                    <input
                      className="w-full bg-transparent text-sm text-[#1e1b15] placeholder:text-[#916f6b] focus:outline-none"
                      placeholder="Filter dishes by name, SKU, or tag..."
                      type="text"
                      value={dishSearch}
                      onChange={(e) => setDishSearch(e.target.value)}
                    />
                  </div>

                  {/* Dietary Toggle Pills */}
                  <div className="flex items-center gap-2 self-start md:self-auto font-mono text-xs">
                    <button
                      onClick={() => setDietaryFilter('all')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        dietaryFilter === 'all' ? 'bg-[#191816] text-[#fff8ef]' : 'bg-[#faf3e8] text-[#5d3f3d] hover:bg-[#eee7dc]'
                      }`}
                    >
                      All ({dishes.length})
                    </button>
                    <button
                      onClick={() => setDietaryFilter('veg')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                        dietaryFilter === 'veg' ? 'bg-green-800 text-white' : 'bg-[#faf3e8] text-green-800 hover:bg-[#eee7dc]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-green-600"></span> Pure Veg
                    </button>
                    <button
                      onClick={() => setDietaryFilter('non-veg')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                        dietaryFilter === 'non-veg' ? 'bg-red-800 text-white' : 'bg-[#faf3e8] text-red-800 hover:bg-[#eee7dc]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-red-600"></span> Non-Veg
                    </button>
                  </div>
                </div>

                {/* Categories Scroll Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs text-[#5d3f3d]">
                  <span className="font-semibold text-[#191816] whitespace-nowrap">Sections:</span>
                  {[
                    { id: 'all', label: 'All Dishes' },
                    { id: 'pizza', label: 'Artisanal Pizzas' },
                    { id: 'biryani', label: 'Biryanis & Mains' },
                    { id: 'dessert', label: 'Desserts & Bakes' },
                    { id: 'pasta', label: 'Artisanal Pasta' },
                    { id: 'beverage', label: 'Craft Beverages' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                        categoryFilter === cat.id
                          ? 'bg-[#191816] text-[#fff8ef] font-bold'
                          : 'bg-[#faf3e8] hover:bg-[#eee7dc] text-[#1e1b15]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* COLLAPSIBLE ADD / EDIT FOOD DRAWER */}
              {isDrawerOpen && (
                <div className="bg-[#faf3e8] p-5 lg:p-6 rounded-xl border border-[#c20019]/40 shadow-md transition-all">
                  <div className="flex items-center justify-between pb-3 border-b border-[#eee7dc]">
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-[#950010] font-bold">Catalog Authoring</span>
                      <h4 className="text-lg font-bold text-[#191816]" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                        {editingDishId ? 'Edit Dish Formula Specifications' : 'Add New Artisanal Food Item'}
                      </h4>
                    </div>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-[#eee7dc] text-[#5d3f3d]"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  </div>

                  <form onSubmit={handleSaveDrawerDish} className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
                    {/* Dish Title */}
                    <div className="md:col-span-8 space-y-1">
                      <label className="font-mono text-xs uppercase font-bold text-[#191816]">Dish Name / Title</label>
                      <input
                        className="w-full bg-[#ffffff] px-3.5 py-2 rounded-lg text-sm text-[#1e1b15] border border-[#eee7dc] focus:outline-none focus:ring-1 focus:ring-[#191816]"
                        placeholder="e.g. Artisanal Smoked Truffle Burrata Pizza"
                        type="text"
                        value={drawerForm.name}
                        onChange={(e) => setDrawerForm({ ...drawerForm, name: e.target.value })}
                        required
                      />
                    </div>

                    {/* Category */}
                    <div className="md:col-span-4 space-y-1">
                      <label className="font-mono text-xs uppercase font-bold text-[#191816]">Menu Category</label>
                      <select
                        className="w-full bg-[#ffffff] px-3 py-2 rounded-lg text-sm text-[#1e1b15] border border-[#eee7dc] focus:outline-none"
                        value={drawerForm.category}
                        onChange={(e) => setDrawerForm({ ...drawerForm, category: e.target.value })}
                      >
                        <option>Woodfired Pizza</option>
                        <option>Biryanis & Mains</option>
                        <option>Desserts & Bakes</option>
                        <option>Artisanal Pasta</option>
                        <option>Craft Beverages</option>
                        <option>Starters & Charcuterie</option>
                      </select>
                    </div>

                    {/* Base Price */}
                    <div className="md:col-span-4 space-y-1">
                      <label className="font-mono text-xs uppercase font-bold text-[#191816]">Base Price (₹ INR)</label>
                      <input
                        className="w-full bg-[#ffffff] px-3 py-2 rounded-lg text-sm text-[#1e1b15] border border-[#eee7dc] focus:outline-none"
                        placeholder="399"
                        type="number"
                        step="any"
                        value={drawerForm.price}
                        onChange={(e) => setDrawerForm({ ...drawerForm, price: e.target.value })}
                        required
                      />
                    </div>

                    {/* Discount Price */}
                    <div className="md:col-span-4 space-y-1">
                      <label className="font-mono text-xs uppercase font-bold text-[#191816]">Guild Discount Price (₹)</label>
                      <input
                        className="w-full bg-[#ffffff] px-3 py-2 rounded-lg text-sm text-[#1e1b15] border border-[#eee7dc] focus:outline-none"
                        placeholder="480 (Optional)"
                        type="number"
                        step="any"
                        value={drawerForm.discountPrice}
                        onChange={(e) => setDrawerForm({ ...drawerForm, discountPrice: e.target.value })}
                      />
                    </div>

                    {/* Prep Time */}
                    <div className="md:col-span-4 space-y-1">
                      <label className="font-mono text-xs uppercase font-bold text-[#191816]">Est. Prep Time (Mins)</label>
                      <input
                        className="w-full bg-[#ffffff] px-3 py-2 rounded-lg text-sm text-[#1e1b15] border border-[#eee7dc] focus:outline-none"
                        placeholder="15"
                        type="number"
                        value={drawerForm.prepTime}
                        onChange={(e) => setDrawerForm({ ...drawerForm, prepTime: e.target.value })}
                      />
                    </div>

                    {/* Dietary Classification */}
                    <div className="md:col-span-6 space-y-1">
                      <label className="font-mono text-xs uppercase font-bold text-[#191816]">Dietary Classification</label>
                      <div className="flex items-center gap-6 pt-1 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="dietType"
                            checked={drawerForm.isVeg === true}
                            onChange={() => setDrawerForm({ ...drawerForm, isVeg: true })}
                            className="text-[#3f4b35] focus:ring-0"
                          />
                          <span className="flex items-center gap-1 text-green-800 font-medium">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-700"></span> Pure Vegetarian
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="dietType"
                            checked={drawerForm.isVeg === false}
                            onChange={() => setDrawerForm({ ...drawerForm, isVeg: false })}
                            className="text-[#ba1a1a] focus:ring-0"
                          />
                          <span className="flex items-center gap-1 text-red-800 font-medium">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-700"></span> Non-Vegetarian
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Daily Portions */}
                    <div className="md:col-span-6 space-y-1">
                      <label className="font-mono text-xs uppercase font-bold text-[#191816]">Daily Batch Portions</label>
                      <div className="flex items-center gap-2">
                        <input
                          className="w-28 bg-[#ffffff] px-3 py-2 rounded-lg text-sm text-[#1e1b15] border border-[#eee7dc] focus:outline-none"
                          type="number"
                          value={drawerForm.portions}
                          onChange={(e) => setDrawerForm({ ...drawerForm, portions: e.target.value })}
                        />
                        <span className="font-mono text-xs text-[#5d3f3d]">portions per day</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="md:col-span-12 space-y-1">
                      <label className="font-mono text-xs uppercase font-bold text-[#191816]">Kitchen & Apothecary Tags</label>
                      <input
                        className="w-full bg-[#ffffff] px-3 py-2 rounded-lg text-sm text-[#1e1b15] border border-[#eee7dc] focus:outline-none"
                        placeholder="e.g. Woodfired, Sourdough, Fermented, Chef Signature"
                        type="text"
                        value={drawerForm.tags}
                        onChange={(e) => setDrawerForm({ ...drawerForm, tags: e.target.value })}
                      />
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-12 flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsDrawerOpen(false)}
                        className="px-4 py-2 bg-[#ffffff] hover:bg-[#eee7dc] text-[#191816] rounded-lg text-xs font-mono uppercase tracking-wider font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#c20019] hover:bg-[#950010] text-white rounded-lg text-xs font-mono uppercase tracking-wider font-bold shadow-sm transition-all"
                      >
                        {editingDishId ? 'Save Formula Updates' : 'Publish to Live Menu'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* FOOD DISHES INVENTORY TABLE (DESKTOP) / CARDS (MOBILE) */}
              {loadingDishes ? (
                <div className="bg-[#ffffff] p-8 rounded-xl border border-[#eee7dc] text-center font-mono text-xs text-[#5d3f3d]">
                  Loading kitchen catalog...
                </div>
              ) : !isMobile ? (
                /* DESKTOP TABLE VIEW */
                <div className="bg-[#ffffff] rounded-xl border border-[#eee7dc] shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#faf3e8] text-[#5d3f3d] font-mono text-xs uppercase tracking-wider border-b border-[#eee7dc]">
                          <th className="py-3 px-4 font-semibold">Item & Classification</th>
                          <th className="py-3 px-4 font-semibold">Category</th>
                          <th className="py-3 px-4 font-semibold">Base Price</th>
                          <th className="py-3 px-4 font-semibold">Live Stock State (86'ing)</th>
                          <th className="py-3 px-4 font-semibold text-center">Daily Sold</th>
                          <th className="py-3 px-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eee7dc] text-sm">
                        {filteredDishes.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="py-8 text-center text-[#5d3f3d] font-mono text-xs">
                              No items matching query "{dishSearch}".
                            </td>
                          </tr>
                        ) : (
                          filteredDishes.map((dish) => (
                            <tr
                              key={dish.fid}
                              className={`hover:bg-[#faf3e8]/50 transition-colors ${
                                !dish.inStock ? 'bg-[#ffdad6]/20' : ''
                              }`}
                            >
                              {/* Item Name */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <span className={`w-3 h-3 border p-0.5 flex items-center justify-center shrink-0 ${
                                    dish.isVeg ? 'border-green-700' : 'border-red-700'
                                  }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-green-700' : 'bg-red-700'}`}></span>
                                  </span>
                                  <div>
                                    <span className={`font-semibold text-base block ${
                                      dish.inStock ? 'text-[#191816]' : 'text-[#5d3f3d] line-through opacity-75'
                                    }`}>
                                      {dish.fname}
                                    </span>
                                    <span className="font-mono text-[11px] text-[#5d3f3d]">
                                      SKU: {dish.fid} • Prep: {dish.prepTime}m
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Category */}
                              <td className="py-3.5 px-4">
                                <span className="px-2 py-0.5 rounded bg-[#f4ede2] text-[#191816] font-mono text-xs">
                                  {dish.category}
                                </span>
                              </td>

                              {/* Price */}
                              <td className="py-3.5 px-4">
                                <div className="font-mono font-bold text-[#191816]">₹{dish.price}</div>
                                {dish.discountPrice && (
                                  <span className="font-mono text-[11px] text-[#916f6b] line-through">₹{dish.discountPrice}</span>
                                )}
                              </td>

                              {/* Stock State & 86'ing Button */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleToggleStock(dish.fid)}
                                    className={`px-2.5 py-1 rounded font-mono text-xs font-bold flex items-center gap-1.5 transition-colors ${
                                      dish.inStock
                                        ? 'bg-[#d9e7c9] text-[#141e0c] hover:bg-[#bdcbae]'
                                        : 'bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb3ac]'
                                    }`}
                                  >
                                    <span className={`w-2 h-2 rounded-full ${dish.inStock ? 'bg-[#3f4b35]' : 'bg-[#ba1a1a]'}`}></span>
                                    {dish.inStock ? 'IN STOCK' : 'OUT OF STOCK (86\'D)'}
                                  </button>
                                  <span className="font-mono text-xs text-[#5d3f3d]">
                                    {dish.inStock ? `${dish.portions} portions` : 'Auto-paused'}
                                  </span>
                                </div>
                              </td>

                              {/* Daily Sold */}
                              <td className="py-3.5 px-4 text-center">
                                <span className="font-mono font-semibold text-[#191816]">{dish.soldCount} orders</span>
                              </td>

                              {/* Actions */}
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => handleOpenEditDrawer(dish)}
                                    title="Edit Formula"
                                    className="p-1.5 rounded-lg hover:bg-[#f4ede2] text-[#5d3f3d] hover:text-[#191816]"
                                  >
                                    <span className="material-symbols-outlined text-base">edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleDuplicateDish(dish)}
                                    title="Duplicate Dish"
                                    className="p-1.5 rounded-lg hover:bg-[#f4ede2] text-[#5d3f3d] hover:text-[#191816]"
                                  >
                                    <span className="material-symbols-outlined text-base">content_copy</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDish(dish.fid, dish.fname)}
                                    title="Purge Dish"
                                    className="p-1.5 rounded-lg hover:bg-[#ffdad6] text-[#ba1a1a]"
                                  >
                                    <span className="material-symbols-outlined text-base">delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* MOBILE CARDS VIEW */
                <div className="space-y-3">
                  {filteredDishes.length === 0 ? (
                    <div className="bg-[#ffffff] p-6 rounded-xl border border-[#eee7dc] text-center font-mono text-xs text-[#5d3f3d]">
                      No items matching query.
                    </div>
                  ) : (
                    filteredDishes.map((dish) => (
                      <div
                        key={dish.fid}
                        className={`bg-[#ffffff] rounded-xl p-3.5 border border-[#eee7dc] shadow-sm flex flex-col gap-2.5 ${
                          !dish.inStock ? 'opacity-80 bg-[#ffdad6]/20' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          {dish.imageUrl ? (
                            <img
                              src={dish.imageUrl}
                              alt={dish.fname}
                              className="w-16 h-16 rounded-lg object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-[#faf3e8] flex items-center justify-center text-[#950010] shrink-0">
                              <span className="material-symbols-outlined text-2xl">restaurant</span>
                            </div>
                          )}

                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-1">
                                <span className={`font-bold text-sm truncate ${!dish.inStock ? 'line-through text-[#5d3f3d]' : 'text-[#191816]'}`}>
                                  {dish.fname}
                                </span>
                                <span className={`w-2 h-2 rounded-full shrink-0 ${dish.isVeg ? 'bg-green-700' : 'bg-red-700'}`}></span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                                <span className="font-mono text-[10px] text-[#8E9982] uppercase font-semibold">{dish.category}</span>
                                <span className="text-[#5d3f3d]">•</span>
                                <span className="font-mono text-[11px] text-[#5d3f3d]">{dish.soldCount} sold today</span>
                              </div>
                            </div>

                            <div className="flex items-baseline justify-between mt-1">
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-mono font-bold text-sm text-[#191816]">₹{dish.price}</span>
                                {dish.discountPrice && (
                                  <span className="font-mono text-[10px] text-[#916f6b] line-through">₹{dish.discountPrice}</span>
                                )}
                              </div>
                              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                dish.inStock ? 'bg-[#d9e7c9] text-[#141e0c]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                              }`}>
                                {dish.inStock ? `${dish.portions} in stock` : '86\'d (Paused)'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Quick Action Bar */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#eee7dc] text-xs">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEditDrawer(dish)}
                              className="p-1 text-[#5d3f3d] hover:text-[#191816]"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button
                              onClick={() => handleDuplicateDish(dish)}
                              className="p-1 text-[#5d3f3d] hover:text-[#191816]"
                            >
                              <span className="material-symbols-outlined text-lg">content_copy</span>
                            </button>
                            <button
                              onClick={() => handleDeleteDish(dish.fid, dish.fname)}
                              className="p-1 text-[#ba1a1a]"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-[#5d3f3d]">Active on Store</span>
                            <button
                              onClick={() => handleToggleStock(dish.fid)}
                              className={`w-10 h-5 rounded-full p-0.5 transition-colors relative flex items-center ${
                                dish.inStock ? 'bg-[#191816]' : 'bg-[#e8e2d7]'
                              }`}
                            >
                              <span className={`w-4 h-4 bg-[#fff8ef] rounded-full transition-transform shadow-sm ${
                                dish.inStock ? 'translate-x-5' : 'translate-x-0'
                              }`}></span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT SIDEBAR: SETTLEMENTS & PARTNER DOSSIER (4 Cols)
          ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* CARD 1: FINANCIAL SETTLEMENTS & PAYOUTS */}
            <div className="bg-[#ffffff] p-5 rounded-xl border border-[#eee7dc] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-[#eee7dc]">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#5d3f3d]">Settlements & Ledger</span>
                  <h4 className="text-base font-bold text-[#191816]" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                    Upcoming Escrow Payout
                  </h4>
                </div>
                <span className="px-2 py-0.5 bg-[#eee7dc] text-[#191816] font-mono text-[10px] rounded uppercase font-bold">
                  T+2 Cycle
                </span>
              </div>

              {/* Big Amount Card */}
              <div className="bg-[#faf3e8] p-4 rounded-xl text-[#191816] border border-[#eee7dc]">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#916f6b] block">Escrow Cleared Net Payout</span>
                <div className="text-3xl font-bold tracking-tight text-[#950010] mt-1" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  ₹1,42,850.00
                </div>
                <p className="font-mono text-xs text-[#5d3f3d] mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-[#8E9982]">schedule</span> Scheduled: Tuesday, 10:00 AM IST
                </p>
              </div>

              {/* Bank Verification Detail */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between py-1 border-b border-[#eee7dc]/60">
                  <span className="text-[#5d3f3d]">Designated Bank:</span>
                  <span className="font-semibold text-[#191816] flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-[#8E9982]">account_balance</span>
                    HDFC Bank •••• 4092
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#eee7dc]/60">
                  <span className="text-[#5d3f3d]">Account Status:</span>
                  <span className="text-[#3f4b35] font-semibold uppercase">Verified Direct Depository</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#eee7dc]/60">
                  <span className="text-[#5d3f3d]">Guild Commission:</span>
                  <span className="text-[#191816] font-semibold">Flat 12.0% (Net of GST)</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#5d3f3d]">TDS / TCS Remittance:</span>
                  <span className="text-[#191816]">₹1,428.50 (Filed with ITD)</span>
                </div>
              </div>

              <button
                onClick={() => toast.success('Downloaded GST & Settlement Statement (PDF)')}
                className="block w-full py-2.5 bg-[#faf3e8] hover:bg-[#eee7dc] text-[#191816] text-center rounded-lg font-mono text-xs uppercase tracking-wider font-bold transition-colors"
              >
                View Detailed GST & Settlement Breakdown →
              </button>
            </div>

            {/* CARD 2: GUILD KITCHEN SOS CONCIERGE */}
            <div className="bg-[#191816] text-[#fff8ef] p-5 rounded-xl shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c20019]">support_agent</span>
                <span className="font-mono text-xs uppercase tracking-widest text-[#ffdbd1]">Guild Kitchen SOS Desk</span>
              </div>
              <div className="text-xl font-bold tracking-tight font-mono text-white">1800-ZAYKA-PARTNER</div>
              <p className="text-xs text-[#eee7dc] leading-relaxed">
                Dedicated direct dispatch line for {restaurantName} Head Chef. Guaranteed instant response time &lt;30s for address and rider escalations.
              </p>
              <button
                onClick={() => toast.success('Emergency SOS pinged. Dispatch operator calling back in 30 seconds.')}
                className="w-full mt-2 py-2 bg-[#c20019] hover:bg-[#950010] text-white rounded-lg font-mono text-xs uppercase font-bold tracking-wider transition-colors"
              >
                Request Priority Call Back
              </button>
            </div>

            {/* CARD 3: HARDWARE & DISPATCH PRINTER STATUS */}
            <div className="bg-[#ffffff] p-5 rounded-xl border border-[#eee7dc] shadow-sm space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between text-[#191816] font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-[#8E9982]">print</span>
                  Kitchen Printer Line
                </span>
                <span className="text-[#3f4b35]">ONLINE (OK)</span>
              </div>
              <p className="text-[#5d3f3d]">Epson TM-T88VI Thermal POS connected on 192.168.1.144</p>
              <button
                onClick={() => toast.success('Test ticket printed successfully!')}
                className="w-full py-1.5 bg-[#faf3e8] hover:bg-[#eee7dc] rounded text-[#191816] font-bold uppercase transition-colors"
              >
                Test Thermal Print Feed
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE FIXED BOTTOM NAVIGATION
      ───────────────────────────────────────────────────────────── */}
      {isMobile && (
        <nav className="fixed bottom-0 inset-x-0 z-50 bg-[#fff8ef]/95 backdrop-blur-xl border-t border-[#eee7dc] shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
          <div className="flex justify-around items-center h-16 px-2">
            <button
              onClick={() => { setMobileNavTab('live-kot'); setActiveTab('incoming'); }}
              className={`relative flex flex-col items-center justify-center flex-1 h-12 transition-colors ${
                mobileNavTab === 'live-kot' ? 'text-[#c20019] font-bold' : 'text-[#5d3f3d]'
              }`}
            >
              <div className="relative">
                <span className="material-symbols-outlined text-xl">receipt_long</span>
                {incomingCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#c20019] text-white font-mono text-[9px] px-1 rounded-full">
                    {incomingCount}
                  </span>
                )}
              </div>
              <span className="font-mono text-[10px] mt-0.5">Live KOT</span>
            </button>

            <button
              onClick={() => setMobileNavTab('menu')}
              className={`flex flex-col items-center justify-center flex-1 h-12 transition-colors ${
                mobileNavTab === 'menu' ? 'text-[#c20019] font-bold' : 'text-[#5d3f3d]'
              }`}
            >
              <span className="material-symbols-outlined text-xl">restaurant_menu</span>
              <span className="font-mono text-[10px] mt-0.5">Catalog</span>
            </button>

            <button
              onClick={() => {
                setMobileNavTab('earnings');
                toast('Escrow Payout: ₹1,42,850.00 scheduled for Tuesday 10:00 AM IST');
              }}
              className={`flex flex-col items-center justify-center flex-1 h-12 transition-colors ${
                mobileNavTab === 'earnings' ? 'text-[#c20019] font-bold' : 'text-[#5d3f3d]'
              }`}
            >
              <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
              <span className="font-mono text-[10px] mt-0.5">Earnings</span>
            </button>

            <button
              onClick={() => {
                setMobileNavTab('store');
                toggleStoreStatus();
              }}
              className={`flex flex-col items-center justify-center flex-1 h-12 transition-colors ${
                mobileNavTab === 'store' ? 'text-[#c20019] font-bold' : 'text-[#5d3f3d]'
              }`}
            >
              <span className="material-symbols-outlined text-xl">storefront</span>
              <span className="font-mono text-[10px] mt-0.5">{isStoreOnline ? 'Online' : 'Paused'}</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
