import React, { useState } from 'react';

function CartDesktop({
  cartItems,
  onUpdateQty,
  onRemoveItem,
  appliedCoupon,
  couponInput,
  setCouponInput,
  onApplyCoupon,
  onRemoveCoupon,
  discountAmount,
  itemSubtotal,
  packagingFee = 58,
  deliveryFee = 0,
  grandTotal,
  onProceedToCheckout,
  onAddPairing,
  navigate
}) {
  const [directives, setDirectives] = useState({
    doorstep: false,
    silent: true,
    cutlery: false,
    zeroPlastics: false
  });
  const [chefNotes, setChefNotes] = useState("");

  const toggleDirective = (key) => {
    setDirectives(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + (Number(item.currentQty || item.qty || 1)), 0);

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased flex flex-col min-h-screen">
      {/* Fixed Desktop Header */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-gutter flex items-center justify-between max-w-6xl mx-auto">
          <button 
            aria-label="Go back" 
            className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer" 
            onClick={() => navigate(-1)}
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <div className="flex flex-col items-center justify-center flex-1">
            <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight leading-none">Cart Review</h1>
          </div>
          <div className="w-11"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col relative w-full pt-16 pb-safe bg-surface min-h-screen">
        <div className="flex flex-col w-full">
          {/* Desktop Architectural Shell / Cart Stage */}
          <div className="w-full bg-surface-container-low py-6 px-gutter">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2 font-label-sm text-label-sm text-secondary uppercase tracking-widest">
                  <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/')}>Sanctuary</span>
                  <span>/</span>
                  <span className="text-charcoal-ink font-bold">Harvest Cart Manifest</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-charcoal-ink tracking-tight">Consignment Review</h2>
              </div>
            </div>
          </div>

          {/* Primary Desktop Grid */}
          <div className="max-w-6xl mx-auto w-full px-gutter py-8">
            <div className="grid grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: Manifest & Directives (Col 7) */}
              <div className="col-span-12 lg:col-span-7 flex flex-col space-y-6">
                {/* Restaurant Identity Card */}
                <div className="bg-surface-container p-6 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-charcoal-ink text-surface rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[28px] text-raw-ochre">local_fire_department</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-headline-sm text-headline-sm text-charcoal-ink">Toscano Artisan Pizzeria</h3>
                        <span className="material-symbols-outlined text-primary text-[18px]" title="Artisanal Guild Verified">verified</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Indiranagar 100ft Rd • Hearth Chamber No. 4</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-botanical-sage/20 text-tertiary text-label-sm font-label-sm rounded uppercase">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          <span>20–25 Mins Dispatch</span>
                        </span>
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-clay-terracotta/15 text-secondary text-label-sm font-label-sm rounded uppercase">
                          <span>Woodfired Hearth</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right hidden md:block">
                    <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase">Apothecary Tier</span>
                    <span className="font-headline-sm text-headline-sm text-charcoal-ink">4.92 ★</span>
                  </div>
                </div>

                {/* Items Manifest List */}
                <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm flex flex-col space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                    <span className="font-label-md text-label-md text-on-surface uppercase tracking-widest">Tray Delicacies</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{totalItemsCount} Manifested</span>
                  </div>

                  {cartItems.length === 0 ? (
                    <div className="text-center py-10 flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[32px]">shopping_bag</span>
                      </div>
                      <h4 className="font-headline-sm text-charcoal-ink">Your Consignment Tray is Empty</h4>
                      <p className="font-body-sm text-on-surface-variant">Select artisanal woodfired dishes and botanical drinks to begin.</p>
                      <button 
                        onClick={() => navigate('/')} 
                        className="mt-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-sm uppercase tracking-wider font-semibold hover:bg-primary-container transition-colors"
                        type="button"
                      >
                        Explore Curated Dishes
                      </button>
                    </div>
                  ) : (
                    cartItems.map((item, index) => {
                      const qty = item.currentQty || item.qty || 1;
                      const unitPrice = Number(item.fprice || item.FPRICE || item.price || 0);
                      const isVeg = item.isVeg || (index === 2);
                      const imageSrc = item.image || item.imgUrl || (
                        index === 0
                          ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAHFLPPOepRnvXdaAjO4XTZ2RLWaYc2D6LveC6yXjxKKGacVJNnREzs6yv-kCHT3I1PX99PhxpGnT7BXLy8coRw0ts44We4awft0tJqiEeG3Ox5RA7pJ8aWopIsZifMEy7y2F_fByaM_ggeI6pTmVNo7r8mjrjikAvYJjOvR2wVvwZpmCIMFzzDkj-bxk5XfHFMixJqQvZw52YanxJdN_TwGILNEavSuUr8XSZBMwMJjpT_8JP4Iaxi"
                          : index === 1
                          ? "https://lh3.googleusercontent.com/aida-public/AB6AXuBlhBp170MZCElEjAIpOPsEtsO7ceHBa0QrZa-6w1kFEb5frkrGMD_jo2fKqLL-fVgr7CLFcXZ2U_XVskl5plIv_v4nj3HvQ7vrRfC3YK3jlZdoze2dHDWYOEIIZcL0UZCtSsNtGO8M13mlBxORWjcPyANIIyUoELS0qehS_mrncAug3mgCkNy4Sw8LQE_txqFLR5_Qnp9Jh7xSIlhmLkcbLbQQNK3WLw3fgNHOvFKH39QCLokQcdD0"
                          : "https://lh3.googleusercontent.com/aida-public/AB6AXuDHAX14G9fleFWgAN4Jn6dZyCYgjXELHayt9epxwj1a1m0BrdnfSHsFevaE_H5ssMz3JC_ocvfo-ZWZsgVoQ_nPK7bV8wuFCGcEj2xECPXwT9FYfbNGdRQOL9FZ65qZZ57vGZexLeYPr1mfxQPGzaIjxldzrrK_a2cMLz89_K8oHjff2Gaq7CPnDCz4IeqnSQNedOgNrivi97luu-sks1arbjrF92bAk6kS9f3cNBPsLY-hoQwZYr5-"
                      );
                      const subtitle = item.subtext || (
                        index === 0 ? "Medium • 48hr Sourdough Stuffed Crust, Fior Di Latte" :
                        index === 1 ? "Oak smoked cheddar, shaved winter truffle aioli" : "Warm molten core • Macerated wild forest berries"
                      );

                      return (
                        <div key={item.oid || item.OID || index} className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg transition-all hover:bg-surface-container">
                          <div className="flex items-center space-x-4 min-w-0 flex-1">
                            <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 relative">
                              <img 
                                className="w-full h-full object-cover" 
                                alt={item.fname || item.FNAME} 
                                src={imageSrc} 
                              />
                              <div 
                                className={`absolute top-1.5 left-1.5 w-3 h-3 rounded-full flex items-center justify-center ${isVeg ? 'bg-tertiary' : 'bg-primary'}`} 
                                title={isVeg ? "Pure Vegetarian" : "Non-Vegetarian"}
                              >
                                <div className="w-1 h-1 bg-surface rounded-full"></div>
                              </div>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-headline-sm text-headline-sm text-charcoal-ink truncate">{item.fname || item.FNAME}</h4>
                              </div>
                              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 truncate">{subtitle}</p>
                              <span className="font-label-md text-label-md text-primary font-bold mt-1.5">₹{unitPrice}.00</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 bg-surface px-3 py-1.5 rounded shadow-sm shrink-0 ml-4">
                            <button 
                              className="w-7 h-7 flex items-center justify-center font-label-md text-charcoal-ink hover:text-primary transition-colors cursor-pointer"
                              onClick={() => onUpdateQty(index, -1)}
                              type="button"
                            >−</button>
                            <span className="font-label-md text-label-md text-charcoal-ink font-bold w-4 text-center">{qty}</span>
                            <button 
                              className="w-7 h-7 flex items-center justify-center font-label-md text-charcoal-ink hover:text-primary transition-colors cursor-pointer"
                              onClick={() => onUpdateQty(index, 1)}
                              type="button"
                            >+</button>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Add More Action Button */}
                  <button 
                    className="w-full py-3.5 bg-surface-container-high hover:bg-surface-dim transition-colors rounded-lg flex items-center justify-center space-x-2 text-charcoal-ink font-label-sm text-label-sm uppercase tracking-wider cursor-pointer"
                    onClick={() => navigate('/')}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
                    <span>+ Explore More Curated Plates</span>
                  </button>
                </div>

                {/* Sensory Delivery Directives */}
                <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-charcoal-ink uppercase tracking-widest">Sensory &amp; Delivery Directives</span>
                    <span className="font-label-sm text-label-sm text-botanical-sage">Bespoke Handoff</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Chip 1 */}
                    <label 
                      onClick={() => toggleDirective('doorstep')}
                      className={`cursor-pointer flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        directives.doorstep ? 'bg-charcoal-ink text-surface' : 'bg-surface-container text-charcoal-ink hover:bg-surface-container-high'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={directives.doorstep} 
                        onChange={() => {}}
                        className="accent-primary w-4 h-4 rounded cursor-pointer" 
                      />
                      <span className="font-body-sm text-body-sm">Leave at doorstep sanctuary</span>
                    </label>

                    {/* Chip 2 (Active/Selected) */}
                    <label 
                      onClick={() => toggleDirective('silent')}
                      className={`cursor-pointer flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        directives.silent ? 'bg-charcoal-ink text-surface' : 'bg-surface-container text-charcoal-ink hover:bg-surface-container-high'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={directives.silent} 
                        onChange={() => {}}
                        className="accent-primary w-4 h-4 rounded cursor-pointer" 
                      />
                      <span className="font-body-sm text-body-sm font-medium">Silent handoff • No doorbell</span>
                    </label>

                    {/* Chip 3 */}
                    <label 
                      onClick={() => toggleDirective('cutlery')}
                      className={`cursor-pointer flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        directives.cutlery ? 'bg-charcoal-ink text-surface' : 'bg-surface-container text-charcoal-ink hover:bg-surface-container-high'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={directives.cutlery} 
                        onChange={() => {}}
                        className="accent-primary w-4 h-4 rounded cursor-pointer" 
                      />
                      <span className="font-body-sm text-body-sm">Compostable birch cutlery</span>
                    </label>

                    {/* Chip 4 */}
                    <label 
                      onClick={() => toggleDirective('zeroPlastics')}
                      className={`cursor-pointer flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        directives.zeroPlastics ? 'bg-charcoal-ink text-surface' : 'bg-surface-container text-charcoal-ink hover:bg-surface-container-high'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={directives.zeroPlastics} 
                        onChange={() => {}}
                        className="accent-primary w-4 h-4 rounded cursor-pointer" 
                      />
                      <span className="font-body-sm text-body-sm">Zero single-use plastics</span>
                    </label>
                  </div>

                  {/* Culinary Directives Text Box */}
                  <div className="mt-2 flex flex-col space-y-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Notes for the Chef or Dispatch Courier</label>
                    <div className="relative">
                      <textarea 
                        className="w-full bg-surface-container p-3 text-body-sm font-body-sm text-charcoal-ink placeholder:text-on-surface-variant/60 rounded-lg focus:outline-none focus:bg-surface transition-colors resize-none" 
                        placeholder="Special culinary notes or gate access instructions (e.g. Ring code 402, extra organic basil)..." 
                        rows="3"
                        maxLength={140}
                        value={chefNotes}
                        onChange={(e) => setChefNotes(e.target.value)}
                      />
                      <span className="absolute bottom-2.5 right-3 font-label-sm text-label-sm text-on-surface-variant">{chefNotes.length} / 140</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Ledger & Summary (Col 5) */}
              <div className="col-span-12 lg:col-span-5 flex flex-col space-y-6">
                {/* Promotional Voucher Deck */}
                <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-charcoal-ink uppercase tracking-widest">Patronage Token</span>
                    <span className="font-label-sm text-label-sm text-botanical-sage font-bold">
                      {appliedCoupon ? '1 Applied' : 'Available'}
                    </span>
                  </div>

                  {/* Active Applied Coupon Box */}
                  {appliedCoupon && (
                    <div className="flex items-center justify-between p-3.5 bg-botanical-sage/15 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="material-symbols-outlined text-tertiary text-[24px]">eco</span>
                        <div className="flex flex-col">
                          <span className="font-label-md text-label-md font-bold text-tertiary">{appliedCoupon}</span>
                          <span className="font-body-sm text-body-sm text-tertiary-container">₹{discountAmount} seasonal blessing applied</span>
                        </div>
                      </div>
                      <button 
                        className="font-label-sm text-label-sm text-primary hover:text-charcoal-ink font-bold uppercase transition-colors cursor-pointer"
                        onClick={onRemoveCoupon}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Voucher Input */}
                  <div className="flex items-center space-x-2">
                    <input 
                      className="flex-1 bg-surface-container px-3.5 py-2.5 text-body-sm font-body-sm text-charcoal-ink placeholder:text-on-surface-variant/50 rounded uppercase font-label-md focus:outline-none focus:bg-surface transition-colors" 
                      placeholder="Enter alternate code..." 
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && onApplyCoupon(couponInput)}
                    />
                    <button 
                      className="bg-charcoal-ink text-surface hover:bg-primary transition-colors px-4 py-2.5 font-label-sm text-label-sm uppercase rounded font-bold cursor-pointer"
                      onClick={() => onApplyCoupon(couponInput || 'BOTANICAL50')}
                      type="button"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Sommelier & Pantry Recommendations (Mini Upsell) */}
                <div className="bg-surface-container p-6 rounded-lg shadow-sm flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-charcoal-ink uppercase tracking-widest">Sommelier's Pairings</span>
                    <span className="material-symbols-outlined text-raw-ochre text-[20px]">wine_bar</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-surface p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded bg-surface-dim overflow-hidden flex-shrink-0">
                          <img 
                            className="w-full h-full object-cover" 
                            alt="Blood Orange Artisanal Soda" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjBxoNDVz1yFJG-HJCnz3RgWb4WG0hDb0wswZSYpGbQHd53l7bHwUjWh3KRerx8Cou9g5OztWxVoEl0bMO0JYEs_bEME_PGFRuei5uXF73D8vcCcIUlaAD-n8JW4I4eEc6WQI7rEnon0rDyPbq0B40uAFnd2goydfxfWswvNZgJ4x-sm4CsIBho0betb6YHGfQmFIIPCwZSI0jEIjaslDXQ1-9gHWDBRtw74SL-u9_Jusbs_61HSNQ" 
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-body-sm text-body-sm font-semibold text-charcoal-ink">Blood Orange Artisanal Soda</span>
                          <span className="font-label-sm text-label-sm text-primary font-bold">+₹82.00</span>
                        </div>
                      </div>
                      <button 
                        className="px-3 py-1 bg-surface-container-high hover:bg-primary hover:text-surface transition-colors text-charcoal-ink rounded font-label-sm text-label-sm uppercase font-bold cursor-pointer"
                        onClick={() => onAddPairing && onAddPairing({ fid: 'pairing-soda', fname: 'Blood Orange Artisanal Soda', fprice: 82, currentQty: 1 })}
                        type="button"
                      >
                        + Add
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-surface p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded bg-surface-dim overflow-hidden flex-shrink-0">
                          <img 
                            className="w-full h-full object-cover" 
                            alt="Truffled Polenta Frites" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6GBKlhPwcvtCx8Qdw7NijpLUD_lS1h5GBo1qL3oYuAJCriK-dT24gH4p4tSMWk2Nx4kaiAFyUlSyj0vxJAaXRtfe0TT3EUDdX0ieEppAP6JkFmjOPMsBaLPaHLXx99gTzptRU_Q9FGBb6ONQqI6h5Hpog_0r1rjHkbgJU7uUF1xnKFWuAZ0c8KKm2EIv0N-0YIPF0CBJlOXwyBYLqTf46NpciqjODFErpAXpHJodXLimrJ56BxWYK" 
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-body-sm text-body-sm font-semibold text-charcoal-ink">Truffled Polenta Frites</span>
                          <span className="font-label-sm text-label-sm text-primary font-bold">+₹210.00</span>
                        </div>
                      </div>
                      <button 
                        className="px-3 py-1 bg-surface-container-high hover:bg-primary hover:text-surface transition-colors text-charcoal-ink rounded font-label-sm text-label-sm uppercase font-bold cursor-pointer"
                        onClick={() => onAddPairing && onAddPairing({ fid: 'pairing-frites', fname: 'Truffled Polenta Frites', fprice: 210, currentQty: 1 })}
                        type="button"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Financial Manifest / Ledger */}
                <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm flex flex-col space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                    <span className="font-label-md text-label-md text-charcoal-ink uppercase tracking-widest">Financial Ledger</span>
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">receipt_long</span>
                  </div>
                  <div className="flex flex-col space-y-2.5">
                    <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
                      <span>Tray Subtotal ({totalItemsCount} items)</span>
                      <span className="font-label-md text-charcoal-ink">₹{itemSubtotal}.00</span>
                    </div>
                    <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
                      <span>Botanical Eco-Packaging &amp; Sanctuary Levies</span>
                      <span className="font-label-md text-charcoal-ink">₹{packagingFee}.00</span>
                    </div>
                    <div className="flex justify-between items-center text-body-sm font-body-sm text-tertiary">
                      <span className="flex items-center space-x-1">
                        <span>Sanctuary Dispatch (Guild Courier)</span>
                        <span className="material-symbols-outlined text-[15px]">verified</span>
                      </span>
                      <span className="font-label-md font-bold uppercase tracking-wider text-tertiary">
                        {deliveryFee === 0 ? 'Complimentary' : `₹${deliveryFee}.00`}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between items-center text-body-sm font-body-sm text-primary">
                        <span>Seasonal Patron Blessing ({appliedCoupon})</span>
                        <span className="font-label-md font-bold">−₹{discountAmount}.00</span>
                      </div>
                    )}
                  </div>

                  {/* Total Settlement Highlight Block */}
                  <div className="p-4 bg-surface-container-high rounded-lg flex items-center justify-between mt-2">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Grand Settlement</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant/80">Inclusive of statutory culinary GST</span>
                    </div>
                    <div className="text-right">
                      <span className="font-headline-lg text-headline-lg text-primary font-bold">₹{grandTotal}.00</span>
                    </div>
                  </div>

                  {/* Primary Checkout CTA Button */}
                  <button 
                    className="w-full py-4 bg-primary hover:bg-primary-container text-on-primary transition-colors rounded shadow-md flex items-center justify-center space-x-3 mt-2 group cursor-pointer disabled:opacity-50"
                    onClick={onProceedToCheckout}
                    disabled={cartItems.length === 0}
                    type="button"
                  >
                    <span className="font-label-md text-label-md font-bold uppercase tracking-widest text-on-primary">
                      Proceed to Dispatch • ₹{grandTotal}.00
                    </span>
                    <span className="material-symbols-outlined text-[20px] text-on-primary group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>

                  {/* Assurance Guarantee Microcopy */}
                  <div className="flex items-center justify-center space-x-2 pt-2">
                    <span className="material-symbols-outlined text-[16px] text-botanical-sage">shield</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant text-center">
                      256-bit botanical encrypted • Zero micro-plastic guarantee
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CartDesktop;
