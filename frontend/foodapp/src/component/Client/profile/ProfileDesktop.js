import React, { useState } from 'react';

function ProfileDesktop({
  displayName,
  initials,
  contactString,
  orderStats,
  orderHistory,
  addresses,
  paymentMethods,
  handleReorder,
  handleSetDefaultAddress,
  handleLogout,
  navigate
}) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 4000);
    }
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen w-full flex flex-col">
      {/* Fixed Desktop Header with Breadcrumb */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-margin-sm lg:px-margin-lg pt-3 pb-3 flex flex-col gap-3">
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <button 
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-on-surface transition-colors cursor-pointer" 
                onClick={() => navigate('/')} 
                title="Back"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </button>
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant">
                <button 
                  className="hover:text-primary transition-colors bg-transparent border-0 cursor-pointer p-0 font-label-sm uppercase" 
                  onClick={() => navigate('/')}
                  type="button"
                >
                  Home
                </button>
                <span>/</span>
                <span className="text-primary font-bold">My Account</span>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="text-xs font-mono text-primary font-bold hover:underline cursor-pointer bg-transparent border-0" 
                onClick={() => navigate('/foodlistclient')}
                type="button"
              >
                BROWSE KITCHENS &rarr;
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="w-full pt-28 lg:pt-32 pb-12 bg-surface min-h-screen flex-1">
        <div className="max-w-7xl mx-auto px-margin-sm lg:px-margin-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Member Profile & Account Navigation Menu (col-span-4) */}
            <aside className="lg:col-span-4 flex flex-col gap-6">
              {/* Member Identity Card */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 shadow-sm flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md text-2xl font-bold tracking-tight shadow-[0_4px_20px_rgba(149,0,16,0.25)] border-4 border-surface-container-lowest">
                    {initials}
                  </div>
                  <button 
                    aria-label="Update avatar" 
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-charcoal-ink text-surface-container-lowest flex items-center justify-center shadow-md hover:bg-primary transition-colors border-2 border-surface-container-lowest cursor-pointer" 
                    onClick={() => alert("Change avatar photo.")}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 mb-1">
                  <h1 className="font-headline-md text-xl font-bold text-on-surface tracking-tight">{displayName}</h1>
                  <button 
                    aria-label="Edit member name" 
                    className="text-on-surface-variant hover:text-primary transition-colors p-0.5 cursor-pointer bg-transparent border-0" 
                    onClick={() => alert("Edit profile details.")}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[17px]">edit</span>
                  </button>
                </div>
                
                <p className="font-label-sm text-[12px] text-on-surface-variant tracking-normal font-mono mb-3">
                  {contactString}
                </p>

                {/* Membership Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full text-xs font-mono text-charcoal-ink">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="font-bold">{orderStats?.tier || "Botanical Guild Patron"} • {orderStats?.rewardsPoints != null ? orderStats.rewardsPoints : 250} Pts</span>
                </div>
              </div>

              {/* Account Navigation Links */}
              <nav className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-3 shadow-sm flex flex-col gap-1.5">
                {/* 1. My Orders & Receipts */}
                <button 
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container transition-all group cursor-pointer text-left w-full" 
                  onClick={() => alert("All orders and receipts.")}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">order_approve</span>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-headline-sm text-[14px] font-semibold text-on-surface leading-tight">My Orders &amp; Receipts</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">View order history and live track deliveries</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[18px]">chevron_right</span>
                </button>

                {/* 2. Favorites & Wishlist */}
                <button 
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-all group cursor-pointer text-left w-full" 
                  onClick={() => navigate('/foodlistclient')}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">favorite</span>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-headline-sm text-[14px] font-semibold text-on-surface leading-tight">Favorites &amp; Wishlist</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">Toscano, Truffles &amp; 12 saved items</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[18px]">chevron_right</span>
                </button>

                {/* 3. Saved Addresses */}
                <button 
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-all group cursor-pointer text-left w-full" 
                  onClick={() => alert("Managing addresses.")}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-tertiary group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">location_on</span>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-headline-sm text-[14px] font-semibold text-on-surface leading-tight">Saved Addresses</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">Home, Work, 12th Main Indiranagar</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[18px]">chevron_right</span>
                </button>

                {/* 4. Payment Methods */}
                <button 
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-all group cursor-pointer text-left w-full" 
                  onClick={() => alert("Managing cards.")}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-raw-ochre group-hover:bg-raw-ochre group-hover:text-on-secondary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-headline-sm text-[14px] font-semibold text-on-surface leading-tight">Payment Methods</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">HDFC Card ending 4242 • Google Pay UPI</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[18px]">chevron_right</span>
                </button>

                {/* 5. Notifications & Sounds */}
                <button 
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-all group cursor-pointer text-left w-full" 
                  onClick={() => alert("Notification settings.")}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-botanical-sage group-hover:bg-tertiary-container group-hover:text-on-tertiary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">notifications</span>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-headline-sm text-[14px] font-semibold text-on-surface leading-tight">Notifications &amp; Sounds</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">SMS, WhatsApp updates, delivery alerts</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[18px]">chevron_right</span>
                </button>

                {/* 6. Concierge & Help Desk */}
                <button 
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-all group cursor-pointer text-left w-full" 
                  onClick={() => alert("Connecting to 24/7 dedicated member support...")}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-charcoal-ink group-hover:bg-charcoal-ink group-hover:text-surface transition-colors">
                      <span className="material-symbols-outlined text-[20px]">support_agent</span>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-headline-sm text-[14px] font-semibold text-on-surface leading-tight">Concierge &amp; Help Desk</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">24/7 dedicated member support</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[18px]">chevron_right</span>
                </button>

                {/* Distinct Crimson Log Out Button */}
                <button 
                  className="mt-2 flex items-center justify-between p-3.5 bg-primary-container/10 hover:bg-primary-container/20 rounded-xl border border-primary/30 text-primary transition-all text-left w-full group cursor-pointer" 
                  onClick={handleLogout}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">logout</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-[14px] font-semibold text-primary leading-tight">Log Out of Account</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">Safely end your active session on this device</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-0.5 transition-transform text-[18px]">arrow_forward</span>
                </button>
              </nav>
            </aside>

            {/* RIGHT COLUMN: Detailed Profile & Account Panels (col-span-8) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* 1. Saved Addresses Snapshot Card */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-[22px]">home_pin</span>
                    <h2 className="font-headline-sm text-lg font-bold text-on-surface">Saved Addresses</h2>
                    <span className="text-xs font-label-sm bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                      {addresses && addresses.length > 0 ? `${addresses.length} Saved` : '2 Saved'}
                    </span>
                  </div>
                  <button 
                    className="text-primary hover:text-charcoal-ink font-label-sm text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-0" 
                    onClick={() => navigate('/billing')}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span> Add New Address
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
                  {(addresses && addresses.length > 0 ? addresses : [
                    { id: 1, label: "Home", fullAddress: "#402, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru - 560038", tagInfo: "Express Hub: 15-25 min", default: true },
                    { id: 2, label: "Office / Studio", fullAddress: "7th Floor, Ecoworld Tech Park, Outer Ring Road, Bellandur, Bengaluru - 560103", tagInfo: "Commercial Lobby Delivery", default: false }
                  ]).map((addr, idx) => {
                    const isDef = addr.default || addr.isDefault;
                    return (
                      <div key={addr.id || idx} className={`p-4 rounded-xl flex flex-col justify-between gap-3 relative ${isDef ? 'bg-surface-container-low border-2 border-primary/20' : 'bg-surface-container-lowest border border-outline-variant/40'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[18px]">
                              {addr.label?.toLowerCase().includes("office") || addr.label?.toLowerCase().includes("studio") ? "apartment" : "home"}
                            </span>
                            <span className="font-headline-sm text-sm font-bold text-on-surface">{addr.label}</span>
                          </div>
                          {isDef ? (
                            <span className="font-label-sm text-[10px] bg-primary text-on-primary font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Default</span>
                          ) : (
                            <button 
                              className="font-label-sm text-[10px] text-on-surface-variant hover:text-primary uppercase tracking-wider cursor-pointer bg-transparent border-0"
                              onClick={() => handleSetDefaultAddress && handleSetDefaultAddress(addr.id)}
                              type="button"
                            >
                              Set Default
                            </button>
                          )}
                        </div>
                        <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                          {addr.fullAddress}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 font-label-sm text-[11px]">
                          <span className="text-botanical-sage font-medium">• {addr.tagInfo || "Express Hub: 15-25 min"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Saved Payment Methods Snapshot Card */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-raw-ochre text-[22px]">credit_card</span>
                    <h2 className="font-headline-sm text-lg font-bold text-on-surface">Saved Payment Methods</h2>
                  </div>
                  <button 
                    className="text-primary hover:text-charcoal-ink font-label-sm text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer bg-transparent border-0" 
                    onClick={() => navigate('/billing')}
                    type="button"
                  >
                    Manage Cards
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
                  {(paymentMethods && paymentMethods.length > 0 ? paymentMethods : [
                    { id: 1, type: "CARD", provider: "HDFC Millennia", maskedDetails: "•••• 4242 • Exp 08/28", default: true },
                    { id: 2, type: "UPI", provider: "Google Pay", maskedDetails: "patron@okhdfcbank", default: false }
                  ]).map((pm, idx) => (
                    <div key={pm.id || idx} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-7 rounded bg-charcoal-ink text-surface flex items-center justify-center font-bold text-[10px] tracking-wider uppercase font-mono shadow-sm">
                          {pm.type === 'UPI' ? 'UPI' : 'CARD'}
                        </div>
                        <div>
                          <div className="font-headline-sm text-sm font-semibold text-on-surface">{pm.provider}</div>
                          <span className="font-label-sm text-xs text-on-surface-variant font-mono">{pm.maskedDetails}</span>
                        </div>
                      </div>
                      {pm.default || pm.isDefault ? (
                        <span className="font-label-sm text-[10px] bg-surface-container px-2 py-0.5 rounded text-on-surface font-semibold uppercase">Primary</span>
                      ) : (
                        <span className="material-symbols-outlined text-botanical-sage text-[18px]">verified</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Recent Order Preview Card */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[22px]">receipt_long</span>
                    <h2 className="font-headline-sm text-lg font-bold text-on-surface">Recent Order Summary</h2>
                  </div>
                  <button 
                    className="text-primary hover:text-charcoal-ink font-label-sm text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer bg-transparent border-0" 
                    onClick={() => navigate('/billing')}
                    type="button"
                  >
                    View All {orderStats?.totalOrders != null ? orderStats.totalOrders : (orderHistory ? orderHistory.length : 1)} Orders
                  </button>
                </div>

                {orderHistory && orderHistory.length > 0 ? (
                  <div className="pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/40">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center text-primary flex-shrink-0 border border-outline-variant/30">
                        <span className="material-symbols-outlined text-2xl">lunch_dining</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-headline-sm text-base font-bold text-on-surface">{orderHistory[0].fname || "Artisanal Kitchen Order"}</h3>
                          <span className="font-label-sm text-[10px] bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded font-semibold uppercase">
                            {orderHistory[0].order_status || orderHistory[0].orderStatus || "Delivered"}
                          </span>
                        </div>
                        <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                          {orderHistory[0].fname} • {orderHistory[0].qty || 1} item
                        </p>
                        <span className="font-label-sm text-[11px] text-on-surface-variant block mt-1 font-mono">
                          Paid ₹{orderHistory[0].grand_total || orderHistory[0].total_price || orderHistory[0].totalPrice || 680} • {orderHistory[0].payment_method || "Online Card"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button 
                        className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-label-sm text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer" 
                        onClick={() => navigate('/billing')}
                        type="button"
                      >
                        Track Receipt
                      </button>
                      <button 
                        className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-label-sm text-xs uppercase tracking-wider font-semibold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer border-0" 
                        onClick={() => handleReorder && handleReorder(orderHistory[0])}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[15px]">refresh</span> Reorder
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/40">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center text-primary flex-shrink-0 border border-outline-variant/30">
                        <span className="material-symbols-outlined text-2xl">local_pizza</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-headline-sm text-base font-bold text-on-surface">Toscano Artisan Pizzeria</h3>
                          <span className="font-label-sm text-[10px] bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded font-semibold uppercase">Delivered</span>
                        </div>
                        <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                          Wood-fired Margherita Sourdough • 1 item
                        </p>
                        <span className="font-label-sm text-[11px] text-on-surface-variant block mt-1 font-mono">
                          Delivered Yesterday • Paid ₹420 via HDFC Card
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button 
                        className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-label-sm text-xs uppercase tracking-wider font-semibold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer border-0" 
                        onClick={() => navigate('/foodlistclient')}
                        type="button"
                      >
                        Explore Menu
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Editorial Atelier Footer */}
      <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 mt-space-xl">
        <div className="max-w-7xl mx-auto px-margin-sm lg:px-margin-lg py-margin-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter-lg">
            
            <div className="lg:col-span-4 space-y-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-md text-headline-md uppercase tracking-tight text-primary">ZAYKA</span>
                <span className="font-label-sm text-label-sm uppercase px-1.5 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed rounded">Atelier</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm leading-relaxed">
                Culinary alchemy grounded in wild botanicals, single-estate cold pressings, and ancestral slow-heat techniques. Delivered at kitchen temperature in compostable vessels.
              </p>
              <div className="flex items-center gap-space-md text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px] hover:text-on-surface cursor-pointer">eco</span>
                <span className="material-symbols-outlined text-[20px] hover:text-on-surface cursor-pointer">local_florist</span>
                <span className="material-symbols-outlined text-[20px] hover:text-on-surface cursor-pointer">nest_clock_farsight_analog</span>
                <span className="material-symbols-outlined text-[20px] hover:text-on-surface cursor-pointer">verified_user</span>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-space-sm">
              <h4 className="font-label-md text-label-md uppercase tracking-wider text-on-surface font-semibold">Culinary Hubs</h4>
              <ul className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
                <li className="flex items-center justify-between">
                  <span>Bengaluru</span>
                  <span className="font-label-sm text-[10px] text-botanical-sage">6 Kitchens</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Mumbai</span>
                  <span className="font-label-sm text-[10px] text-botanical-sage">4 Kitchens</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Delhi NCR</span>
                  <span className="font-label-sm text-[10px] text-botanical-sage">5 Kitchens</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Hyderabad</span>
                  <span className="font-label-sm text-[10px] text-botanical-sage">3 Kitchens</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-space-sm">
              <h4 className="font-label-md text-label-md uppercase tracking-wider text-on-surface font-semibold">Company</h4>
              <ul className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
                <li><button className="hover:text-on-surface transition-colors bg-transparent border-0 p-0 text-left cursor-pointer" type="button">Our Herbalists</button></li>
                <li><button className="hover:text-on-surface transition-colors bg-transparent border-0 p-0 text-left cursor-pointer" type="button">Farm Traceability</button></li>
                <li><button className="hover:text-on-surface transition-colors bg-transparent border-0 p-0 text-left cursor-pointer" type="button">Zero-Microplastic Seal</button></li>
                <li><button className="hover:text-on-surface transition-colors bg-transparent border-0 p-0 text-left cursor-pointer" type="button">Lab Certifications</button></li>
              </ul>
            </div>

            <div className="lg:col-span-4 space-y-space-sm">
              <h4 className="font-label-md text-label-md uppercase tracking-wider text-on-surface font-semibold">Editorial Gazette</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-normal">
                Fortnightly field notes on wild foraging, terroir profiles, and seasonal tasting schedules.
              </p>
              <form className="flex items-stretch gap-space-xs mt-space-sm" onSubmit={handleNewsletterSubmit}>
                <input 
                  className="bg-surface px-space-md py-2 border border-outline-variant/50 text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm rounded-none focus:outline-none flex-1" 
                  placeholder="herbalist@domain.com" 
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button 
                  className="bg-charcoal-ink text-surface-container-low px-space-md py-2 font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors cursor-pointer border-0" 
                  type="submit"
                >
                  {newsletterSubscribed ? 'Subscribed ✓' : 'Join'}
                </button>
              </form>
              <span className="font-label-sm text-label-sm text-on-surface-variant block mt-1">
                No promotional blasts. Strict sensorial literature only.
              </span>
            </div>
          </div>

          <div className="border-t border-outline-variant/30 mt-space-xl pt-space-md flex flex-col md:flex-row items-center justify-between gap-space-sm font-label-sm text-label-sm text-on-surface-variant">
            <span>© 2025 Zayka Botanical Provisions &amp; Co. Hand-crafted with reverence.</span>
            <div className="flex items-center gap-space-lg">
              <button className="hover:text-on-surface transition-colors bg-transparent border-0 p-0 cursor-pointer" type="button">Privacy Manifesto</button>
              <button className="hover:text-on-surface transition-colors bg-transparent border-0 p-0 cursor-pointer" type="button">Terms of Provision</button>
              <span className="text-on-surface-variant">FSSAI Central Lic. #10022043000192</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ProfileDesktop;
