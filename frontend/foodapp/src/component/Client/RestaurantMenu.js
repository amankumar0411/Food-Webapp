import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import FoodMenuSkeleton from '../common/FoodMenuSkeleton';

export default function RestaurantMenu() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [cartCount, setCartCount] = useState(0);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');

  const currentUser = localStorage.getItem('user');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch restaurant details & menu items using restaurantId
  useEffect(() => {
    // Clear previous restaurant state to prevent cross-contamination
    setRestaurant(null);
    setDishes([]);
    setLoading(true);
    setError(null);
    setActiveCategoryFilter('ALL');

    const fetchDetails = axiosInstance.get(`/api/restaurants/${encodeURIComponent(restaurantId)}`)
      .then(res => res.data)
      .catch(() => null);

    const fetchMenu = axiosInstance.get(`/food/restaurant/${encodeURIComponent(restaurantId)}`)
      .then(res => Array.isArray(res.data) ? res.data : [])
      .catch(err => {
        console.error("Failed to load restaurant menu:", err);
        return [];
      });

    Promise.all([fetchDetails, fetchMenu])
      .then(([restData, menuData]) => {
        if (restData) {
          setRestaurant(restData);
        } else {
          // Fallback metadata if not seeded
          setRestaurant({
            id: restaurantId,
            name: restaurantId.charAt(0).toUpperCase() + restaurantId.slice(1) + " Restaurant",
            rating: 4.6,
            deliveryTime: "25–30 mins",
            cuisines: "Curated Cuisine",
            discountBadge: "PROMO AVAILABLE",
            location: "Indiranagar, Bengaluru"
          });
        }
        setDishes(menuData);
      })
      .catch(err => {
        console.error("Error in restaurant data loading:", err);
        setError("Unable to load menu for this restaurant.");
      })
      .finally(() => {
        setLoading(false);
      });

    // Cart count
    if (currentUser) {
      axiosInstance.get(`/orders/user/details/${currentUser}`)
        .then(res => {
          if (Array.isArray(res.data)) setCartCount(res.data.length);
        })
        .catch(() => {});
    }
  }, [restaurantId, currentUser]);

  const handleAddToCart = async (item) => {
    if (!currentUser) {
      toast.error("Please sign in to order from this restaurant");
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
      toast.success(`${item.fname} added to your order! 🌿`);
      setCartCount(prev => prev + 1);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Could not add item. Please try again.");
    }
  };

  // Distinct categories in this restaurant's menu
  const availableCategories = ['ALL', ...Array.from(new Set(dishes.map(d => d.category).filter(Boolean)))];

  const filteredDishes = activeCategoryFilter === 'ALL'
    ? dishes
    : dishes.filter(d => d.category === activeCategoryFilter);

  return (
    <div className="w-full min-h-screen bg-surface-container-low font-body-md text-on-surface antialiased pt-6 pb-24">
      {/* Breadcrumb & Navigation */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 mb-6">
        <div className="flex items-center gap-2 text-xs font-label-md text-on-surface-variant uppercase tracking-wider mb-3">
          <button 
            onClick={() => navigate('/home')} 
            className="hover:text-primary transition-colors flex items-center gap-1 font-semibold"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Home</span>
          </button>
          <span>/</span>
          <span>Restaurants</span>
          <span>/</span>
          <span className="text-primary font-bold">{restaurant?.name || restaurantId}</span>
        </div>

        {/* Restaurant Header Banner Card */}
        {restaurant && (
          <div className="bg-surface-container-lowest rounded-3xl border border-surface-dim/60 p-6 lg:p-8 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center gap-1">
                    <span>{restaurant.rating || 4.6}</span>
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    (1,200+ Verified Dining Ratings)
                  </span>
                  {restaurant.discountBadge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary text-[11px] font-bold tracking-wide">
                      {restaurant.discountBadge}
                    </span>
                  )}
                </div>

                <h1 className="font-headline-lg text-3xl lg:text-4xl font-bold tracking-tight text-on-surface">
                  {restaurant.name}
                </h1>

                <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
                  <span className="font-medium text-on-surface">{restaurant.cuisines}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-raw-ochre">schedule</span>
                    {restaurant.deliveryTime || '25-30 mins'}
                  </span>
                  <span>•</span>
                  <span>{restaurant.location || 'Indiranagar, Bengaluru'}</span>
                </div>
              </div>

              {restaurant.imageUrl && (
                <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shadow-inner shrink-0 bg-surface-container">
                  <img 
                    src={restaurant.imageUrl} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
            </div>

            {/* In-Menu Category Filter Chips */}
            {availableCategories.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-surface-dim/40 mt-6 no-scrollbar">
                {availableCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      activeCategoryFilter === cat 
                        ? 'bg-charcoal-ink text-white shadow-sm' 
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-dim'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Menu Listing */}
      {loading ? (
        <FoodMenuSkeleton isMobile={isMobile} />
      ) : error ? (
        <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl border border-red-200 text-center shadow-sm">
          <span className="material-symbols-outlined text-4xl text-red-500 mb-2">error_outline</span>
          <h3 className="font-headline-sm text-lg font-bold text-gray-900 mb-1">Menu Unavailable</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-charcoal-ink text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
          >
            Refresh Page
          </button>
        </div>
      ) : filteredDishes.length === 0 ? (
        <div className="max-w-md mx-auto my-16 p-8 bg-surface-container-lowest rounded-2xl border border-surface-dim/60 text-center shadow-sm">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3">menu_book</span>
          <h3 className="font-headline-sm text-xl font-bold text-on-surface mb-2">No Items in This Category</h3>
          <p className="text-sm text-on-surface-variant mb-6">
            There are no dishes matching "{activeCategoryFilter}". Reset filter to see all dishes from {restaurant?.name}.
          </p>
          <button 
            onClick={() => setActiveCategoryFilter('ALL')}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary-container transition-colors shadow-sm"
          >
            Show All Dishes
          </button>
        </div>
      ) : (
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-on-surface">
              {activeCategoryFilter === 'ALL' ? 'Complete Menu' : `${activeCategoryFilter}`} ({filteredDishes.length})
            </h2>
            <span className="text-xs text-on-surface-variant">Only from {restaurant?.name}</span>
          </div>

          {/* Grid of Dishes for this restaurant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDishes.map((dish) => (
              <article 
                key={dish.fid}
                className="group bg-surface-container-lowest rounded-2xl border border-surface-dim/60 overflow-hidden shadow-sm hover:shadow-card transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-container">
                  <img 
                    src={dish.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"}
                    alt={dish.fname}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-sm shadow-sm">
                    <span 
                      className={`w-2.5 h-2.5 rounded-full ${dish.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`}
                    />
                    <span className="text-[10px] font-bold tracking-wider uppercase text-gray-800">
                      {dish.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
                      {dish.fname}
                    </h3>
                    <span className="text-xs text-on-surface-variant capitalize mt-0.5 inline-block">
                      {dish.category}
                    </span>
                  </div>

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

      {/* Floating Bag Indicator */}
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
