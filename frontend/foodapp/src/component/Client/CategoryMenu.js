import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import FoodMenuSkeleton from '../common/FoodMenuSkeleton';

export default function CategoryMenu() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [cartCount, setCartCount] = useState(0);

  const currentUser = localStorage.getItem('user');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchCategoryDishes = () => {
    setLoading(true);
    setError(null);
    axiosInstance.get(`/food/category/${encodeURIComponent(categoryId)}`)
      .then(res => {
        setDishes(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Failed to load category dishes:", err);
        setError("Unable to load dishes for this category. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchCartCount = () => {
    if (currentUser) {
      axiosInstance.get(`/orders/user/details/${currentUser}`)
        .then(res => {
          if (Array.isArray(res.data)) {
            setCartCount(res.data.length);
          }
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    fetchCategoryDishes();
    fetchCartCount();
  }, [categoryId]);

  // Clean formatting for header (e.g. "pizzas" -> "Pizzas", "biryani" -> "Biryani")
  const displayName = categoryId
    ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1).toLowerCase()
    : 'Category';

  const handleAddToCart = async (item) => {
    if (!currentUser) {
      toast.error("Please sign in to add items to your cart");
      navigate('/login');
      return;
    }

    const toastId = toast.loading(`Adding ${item.fname}...`);
    try {
      await axiosInstance.post('/orders/add', {
        uname: currentUser,
        fid: item.fid,
        fname: item.fname,
        qty: 1
      });
      toast.dismiss(toastId);
      toast.success(`${item.fname} added to your bag! 🌿`);
      setCartCount(prev => prev + 1);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Could not add item to bag. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface-container-low font-body-md text-on-surface antialiased pt-6 pb-24">
      {/* Editorial Header / Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 mb-6">
        <div className="flex items-center gap-2 text-xs font-label-md text-on-surface-variant uppercase tracking-wider mb-2">
          <button 
            onClick={() => navigate('/home')} 
            className="hover:text-primary transition-colors flex items-center gap-1 font-semibold"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Home</span>
          </button>
          <span>/</span>
          <span>Categories</span>
          <span>/</span>
          <span className="text-primary font-bold">{displayName}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-surface-dim/60 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-clay-terracotta">Curated Catalog</span>
            <h1 className="font-headline-lg text-3xl lg:text-4xl font-bold tracking-tight text-on-surface mt-1">
              Popular {displayName}
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Handcrafted selections freshly prepared by artisanal hearths
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface-container border border-surface-dim/40 text-on-surface-variant">
              {loading ? 'Discovering...' : `${dishes.length} Dish${dishes.length === 1 ? '' : 'es'} Available`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <FoodMenuSkeleton isMobile={isMobile} />
      ) : error ? (
        <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl border border-red-200 text-center shadow-sm">
          <span className="material-symbols-outlined text-4xl text-red-500 mb-2">error_outline</span>
          <h3 className="font-headline-sm text-lg font-bold text-gray-900 mb-1">Catalog Temporarily Unavailable</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchCategoryDishes}
            className="px-4 py-2 bg-charcoal-ink text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : dishes.length === 0 ? (
        <div className="max-w-md mx-auto my-16 p-8 bg-surface-container-lowest rounded-2xl border border-surface-dim/60 text-center shadow-sm">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3">restaurant_menu</span>
          <h3 className="font-headline-sm text-xl font-bold text-on-surface mb-2">No {displayName} Dishes Found</h3>
          <p className="text-sm text-on-surface-variant mb-6">
            We currently don't have dishes listed under this category. Explore other popular culinary choices!
          </p>
          <button 
            onClick={() => navigate('/home')}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary-container transition-colors shadow-sm"
          >
            Back to Categories
          </button>
        </div>
      ) : (
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
          {/* Bento Dish Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dishes.map((dish) => (
              <article 
                key={dish.fid}
                className="group bg-surface-container-lowest rounded-2xl border border-surface-dim/60 overflow-hidden shadow-sm hover:shadow-card transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-container">
                  <img 
                    src={dish.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"}
                    alt={dish.fname}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Veg / Non-Veg Indicator */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-sm shadow-sm">
                    <span 
                      className={`w-2.5 h-2.5 rounded-full ${dish.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`}
                    />
                    <span className="text-[10px] font-bold tracking-wider uppercase text-gray-800">
                      {dish.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </div>

                  {/* Restaurant Tag */}
                  {dish.restaurantName && (
                    <div className="absolute bottom-3 left-3 right-3 truncate px-2.5 py-1 rounded bg-charcoal-ink/80 backdrop-blur-sm text-white text-[11px] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-amber-300">storefront</span>
                      <span className="truncate">{dish.restaurantName}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
                        {dish.fname}
                      </h3>
                    </div>
                    <span className="text-xs text-on-surface-variant capitalize mt-0.5 inline-block">
                      {dish.category}
                    </span>
                  </div>

                  {/* Price & Add Button */}
                  <div className="pt-3 border-t border-surface-dim/40 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-on-surface-variant font-medium">Price</span>
                      <div className="text-lg font-bold text-on-surface">
                        ₹{Math.round(dish.price)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(dish)}
                      className="px-4 py-2 bg-charcoal-ink hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm active:scale-95 flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>ADD</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Floating Bag Indicator if cart has items */}
      {cartCount > 0 && (
        <aside 
          onClick={() => navigate('/cart')}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-charcoal-ink/95 backdrop-blur-md px-4 py-3 rounded-2xl text-white shadow-2xl hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-clay-terracotta animate-ping"></div>
          <div className="flex flex-col pr-1">
            <span className="text-xs font-bold">{cartCount} Item{cartCount === 1 ? '' : 's'} in Bag</span>
            <span className="text-[10px] text-gray-300">View Cart & Checkout</span>
          </div>
          <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </div>
        </aside>
      )}
    </div>
  );
}
