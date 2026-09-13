import React from 'react';

function ProfileMobile({
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
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen w-full flex flex-col">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl border-b border-surface-dim/50 shadow-[0_1px_8px_rgba(30,27,21,0.03)]">
        <div className="h-16 px-margin flex items-center justify-between">
          <button 
            aria-label="Go back" 
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high border border-surface-dim/50 transition-colors cursor-pointer" 
            onClick={() => navigate('/')}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          
          <div className="flex flex-col items-center">
            <span className="font-headline-sm text-[16px] font-semibold text-on-surface">Profile &amp; Account</span>
          </div>

          <button 
            aria-label="Settings" 
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary hover:bg-surface-container-high border border-surface-dim/50 transition-colors cursor-pointer" 
            onClick={() => alert("Settings preferences saved.")}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-col relative w-full pt-16 pb-20 bg-surface flex-1">
        <div className="flex flex-col w-full pb-10 max-w-lg mx-auto">
          {/* Member Profile Avatar & Summary */}
          <div className="pt-6 pb-5 px-margin flex flex-col items-center text-center">
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md text-[28px] font-bold shadow-[0_4px_16px_rgba(149,0,16,0.25)] border-4 border-surface-container-lowest">
                {initials}
              </div>
              <button 
                aria-label="Edit photo" 
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-md border border-surface-dim/60 hover:bg-surface-container cursor-pointer" 
                onClick={() => alert("Change avatar photo.")}
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">photo_camera</span>
              </button>
            </div>
            
            <div className="flex items-center gap-1.5">
              <h2 className="font-headline-md text-[20px] font-bold text-on-surface">{displayName}</h2>
              <button 
                aria-label="Edit name" 
                className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer" 
                onClick={() => alert("Edit profile details.")}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>
            <p className="font-label-sm text-[11px] text-on-surface-variant mt-0.5">{contactString}</p>
          </div>

          {/* Navigation & Action Tiles */}
          <div className="px-margin flex flex-col gap-2.5">
            {/* 1. Orders & Receipts */}
            <button 
              className="flex items-center justify-between p-3.5 bg-surface-container-lowest rounded-xl border border-surface-dim/50 shadow-sm hover:border-secondary transition-all cursor-pointer text-left w-full" 
              onClick={() => navigate('/billing')}
              type="button"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">order_approve</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-[14px] font-semibold text-on-surface">My Orders &amp; Receipts</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant font-mono">
                    {orderStats?.totalOrders != null ? `${orderStats.totalOrders} Orders Completed • ${orderStats.rewardsPoints || 0} Pts` : "View order history and receipts"}
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">chevron_right</span>
            </button>

            {/* 2. Favorites & Wishlist */}
            <button 
              className="flex items-center justify-between p-3.5 bg-surface-container-lowest rounded-xl border border-surface-dim/50 shadow-sm hover:border-secondary transition-all cursor-pointer text-left w-full" 
              onClick={() => navigate('/foodlistclient')}
              type="button"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-[14px] font-semibold text-on-surface">Favorites &amp; Wishlist</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Toscano, Truffles &amp; artisanal menu</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">chevron_right</span>
            </button>

            {/* 3. Saved Addresses */}
            <button 
              className="flex items-center justify-between p-3.5 bg-surface-container-lowest rounded-xl border border-surface-dim/50 shadow-sm hover:border-secondary transition-all cursor-pointer text-left w-full" 
              onClick={() => navigate('/billing')}
              type="button"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-[14px] font-semibold text-on-surface">Saved Addresses</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant truncate max-w-[200px]">
                    {addresses && addresses.length > 0 ? `${addresses.length} Saved: ${addresses[0].label}` : "Home, Indiranagar, Bengaluru"}
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">chevron_right</span>
            </button>

            {/* 4. Payment Methods */}
            <button 
              className="flex items-center justify-between p-3.5 bg-surface-container-lowest rounded-xl border border-surface-dim/50 shadow-sm hover:border-secondary transition-all cursor-pointer text-left w-full" 
              onClick={() => navigate('/billing')}
              type="button"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-raw-ochre">
                  <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-[14px] font-semibold text-on-surface">Payment Methods</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant truncate max-w-[200px] font-mono">
                    {paymentMethods && paymentMethods.length > 0 ? `${paymentMethods[0].provider} (${paymentMethods[0].type})` : "HDFC Card • Google Pay UPI"}
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">chevron_right</span>
            </button>

            {/* 5. Notifications & Sounds */}
            <button 
              className="flex items-center justify-between p-3.5 bg-surface-container-lowest rounded-xl border border-surface-dim/50 shadow-sm hover:border-secondary transition-all cursor-pointer text-left w-full" 
              onClick={() => alert("SMS and WhatsApp notifications active.")}
              type="button"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-botanical-sage">
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-[14px] font-semibold text-on-surface">Notifications &amp; Sounds</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">SMS, WhatsApp updates, delivery alerts</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">chevron_right</span>
            </button>

            {/* 6. Concierge & Help Desk */}
            <button 
              className="flex items-center justify-between p-3.5 bg-surface-container-lowest rounded-xl border border-surface-dim/50 shadow-sm hover:border-secondary transition-all cursor-pointer text-left w-full" 
              onClick={() => alert("Connecting to 24/7 dedicated member concierge...")}
              type="button"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-charcoal-ink">
                  <span className="material-symbols-outlined text-[20px]">support_agent</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-[14px] font-semibold text-on-surface">Concierge &amp; Help Desk</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">24/7 dedicated member support</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">chevron_right</span>
            </button>

            {/* Distinct Crimson Log Out Button */}
            <button 
              className="mt-3 flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-primary/20 text-primary hover:bg-primary/5 transition-all text-left cursor-pointer w-full" 
              onClick={handleLogout}
              type="button"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-[14px] font-semibold text-primary">Log Out of Account</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Safely end your session on this device</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Nav Bar (Mobile Navigation Shell) */}
      <nav className="fixed bottom-0 left-0 right-0 w-full z-50 pb-safe bg-surface/95 backdrop-blur-xl border-t border-surface-dim/60 shadow-[0_-4px_20px_rgba(30,27,21,0.04)]">
        <div className="h-14 px-6 flex items-center justify-around text-on-surface-variant">
          <button 
            className="flex flex-col items-center justify-center hover:text-primary transition-colors cursor-pointer bg-transparent border-0"
            onClick={() => navigate('/')}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">restaurant</span>
            <span className="font-label-sm text-[10px]">Food</span>
          </button>
          <button 
            className="flex flex-col items-center justify-center hover:text-primary transition-colors cursor-pointer bg-transparent border-0"
            onClick={() => navigate('/foodlistclient')}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
            <span className="font-label-sm text-[10px]">Explore</span>
          </button>
          <button 
            className="flex flex-col items-center justify-center text-primary font-bold cursor-pointer bg-transparent border-0"
            onClick={() => navigate('/account')}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            <span className="font-label-sm text-[10px]">Account</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default ProfileMobile;
