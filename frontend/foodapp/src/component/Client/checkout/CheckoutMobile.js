import React, { useState } from 'react';

function CheckoutMobile({
  cartItems,
  addresses,
  selectedAddress,
  setSelectedAddress,
  instructions,
  setInstructions,
  paymentMethod,
  setPaymentMethod,
  couponCode,
  setCouponCode,
  appliedCoupon,
  isCouponApplying,
  onApplyCoupon,
  onRemoveCoupon,
  discountAmount,
  itemSubtotal,
  taxFee = 58,
  grandTotal,
  onPlaceOrder,
  isPlacingOrder,
  navigate
}) {
  const [promoNoticePulse, setPromoNoticePulse] = useState(false);

  const appendNote = (text) => {
    if (!instructions.trim()) {
      setInstructions(text);
    } else {
      setInstructions(prev => `${prev} • ${text}`);
    }
  };

  const handleApplyPromo = () => {
    if (!couponCode?.trim()) return;
    onApplyCoupon(couponCode);
    setPromoNoticePulse(true);
    setTimeout(() => setPromoNoticePulse(false), 1000);
  };

  const totalOriginal = grandTotal + discountAmount + 62;

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-gutter-sm flex items-center justify-between">
          <button 
            aria-label="Go back" 
            className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer" 
            onClick={() => navigate(-1)}
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <div className="flex flex-col items-center justify-center flex-1 pr-11">
            <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight leading-none">Checkout</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col relative w-full pt-16 pb-safe bg-surface min-h-screen">
        <div className="flex flex-col w-full pb-32">
          {/* Main Stacked Form Content */}
          <div className="flex flex-col gap-space-md px-gutter-sm mt-space-xs">
            {/* Section 1: Delivery Sanctuary */}
            <div className="bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-space-sm mt-2">
              <div className="flex items-center justify-between mb-space-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>nature_people</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Delivery Sanctuary</h2>
                </div>
                <button 
                  className="font-label-sm text-label-sm text-primary uppercase hover:opacity-80 transition-opacity cursor-pointer" 
                  type="button"
                  onClick={() => navigate('/account')}
                >
                  + Add New
                </button>
              </div>

              <div className="flex flex-col gap-2.5" id="address-selector-group">
                {/* Address Option 1: Home */}
                <label 
                  className={`cursor-pointer flex items-start gap-3 p-3.5 transition-all ${
                    selectedAddress === 'home' ? 'bg-surface-container-low border-l-2 border-primary' : 'bg-surface-container'
                  }`}
                  onClick={() => setSelectedAddress('home')}
                >
                  <input 
                    type="radio" 
                    name="delivery_sanctuary" 
                    value="home" 
                    checked={selectedAddress === 'home'} 
                    onChange={() => setSelectedAddress('home')}
                    className="mt-1 w-4 h-4 accent-primary cursor-pointer" 
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-headline-sm text-[1rem] leading-snug text-charcoal-ink font-semibold">Home Sanctuary</span>
                      <span className="font-label-sm text-label-sm uppercase px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed font-medium">Default</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 truncate">
                      {addresses.find(a => a.tag === 'home')?.streetAddress || 'Penthouse 402, Casa Botanica, 12th Main, Indiranagar'}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-botanical-sage">
                      <span className="material-symbols-outlined text-[16px]">timer</span>
                      <span className="font-label-sm text-label-sm text-on-surface font-medium">Est. 28-34 mins • Discreet Doorstep Placement</span>
                    </div>
                  </div>
                </label>

                {/* Address Option 2: Office */}
                <label 
                  className={`cursor-pointer flex items-start gap-3 p-3.5 transition-all ${
                    selectedAddress === 'office' ? 'bg-surface-container-low border-l-2 border-primary' : 'bg-surface-container'
                  }`}
                  onClick={() => setSelectedAddress('office')}
                >
                  <input 
                    type="radio" 
                    name="delivery_sanctuary" 
                    value="office" 
                    checked={selectedAddress === 'office'} 
                    onChange={() => setSelectedAddress('office')}
                    className="mt-1 w-4 h-4 accent-primary cursor-pointer" 
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-headline-sm text-[1rem] leading-snug text-charcoal-ink font-semibold">Creative Atelier</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Office</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 truncate">
                      {addresses.find(a => a.tag === 'office')?.streetAddress || 'Tower 4B, 6th Floor, RMZ Ecoworld, Bellandur Outer Ring'}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
                      <span className="font-label-sm text-label-sm text-on-surface">Reception Concierge Drop</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Section 2: Culinary & Access Guidance */}
            <div className="bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2" htmlFor="instructions">
                  <span className="material-symbols-outlined text-secondary text-[20px]">room_service</span>
                  Culinary &amp; Access Notes
                </label>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Optional</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Guide our courier on quiet access, zero doorbell chimes, or gentle herb warm-up preferences.
              </p>
              <div className="relative mt-1">
                <textarea 
                  id="instructions"
                  className="w-full bg-surface-container-low text-on-surface p-3 font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:shadow-inner transition-all placeholder:text-outline resize-none rounded-lg"
                  placeholder="Special culinary requests, gate access codes, leave at doorstep planter..." 
                  rows="2"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>
              {/* Quick micro tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button 
                  className="font-label-sm text-label-sm bg-surface-container text-on-surface px-2.5 py-1 hover:bg-surface-dim transition-colors text-left rounded cursor-pointer"
                  onClick={() => appendNote('Do not ring bell (sleeping infant)')}
                  type="button"
                >
                  + No doorbell
                </button>
                <button 
                  className="font-label-sm text-label-sm bg-surface-container text-on-surface px-2.5 py-1 hover:bg-surface-dim transition-colors text-left rounded cursor-pointer"
                  onClick={() => appendNote('Package in thermal paper')}
                  type="button"
                >
                  + Zero single-use plastic
                </button>
                <button 
                  className="font-label-sm text-label-sm bg-surface-container text-on-surface px-2.5 py-1 hover:bg-surface-dim transition-colors text-left rounded cursor-pointer"
                  onClick={() => appendNote('Call upon arrival at tower gate')}
                  type="button"
                >
                  + Gate code call
                </button>
              </div>
            </div>

            {/* Section 3: Selectable Payment Methods */}
            <div className="bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Payment Settlement</h2>
                </div>
                <span className="font-label-sm text-label-sm text-botanical-sage flex items-center gap-1 uppercase">
                  <span className="material-symbols-outlined text-[14px]">lock</span> 256-bit Encrypted
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {/* Option A: Google Pay UPI */}
                <label 
                  className={`cursor-pointer flex items-center justify-between p-3.5 transition-all rounded-lg ${
                    paymentMethod === 'gpay' ? 'bg-primary-container/10 border-l-2 border-primary' : 'bg-surface-container'
                  }`}
                  onClick={() => setPaymentMethod('gpay')}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="gpay" 
                      checked={paymentMethod === 'gpay'}
                      onChange={() => setPaymentMethod('gpay')}
                      className="w-4 h-4 accent-primary cursor-pointer" 
                    />
                    <div className="w-10 h-10 bg-surface-container-lowest flex items-center justify-center shadow-sm rounded">
                      <span className="material-symbols-outlined text-primary text-[22px]">account_balance_wallet</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-[0.95rem] text-charcoal-ink font-semibold">Google Pay UPI</span>
                        <span className="font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed px-1.5 py-0.2 font-semibold rounded">Fast</span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant truncate">instant bank direct auth • aman@okhdfc</span>
                    </div>
                  </div>
                  <span 
                    className={`material-symbols-outlined text-[20px] ${paymentMethod === 'gpay' ? 'text-primary' : 'text-outline'}`}
                    style={{ fontVariationSettings: paymentMethod === 'gpay' ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {paymentMethod === 'gpay' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </label>

                {/* Option B: HDFC Credit Card */}
                <label 
                  className={`cursor-pointer flex items-center justify-between p-3.5 transition-all rounded-lg ${
                    paymentMethod === 'hdfc' ? 'bg-primary-container/10 border-l-2 border-primary' : 'bg-surface-container'
                  }`}
                  onClick={() => setPaymentMethod('hdfc')}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="hdfc" 
                      checked={paymentMethod === 'hdfc'}
                      onChange={() => setPaymentMethod('hdfc')}
                      className="w-4 h-4 accent-primary cursor-pointer" 
                    />
                    <div className="w-10 h-10 bg-surface-container-lowest flex items-center justify-center shadow-sm rounded">
                      <span className="material-symbols-outlined text-secondary text-[22px]">credit_card</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-[0.95rem] text-charcoal-ink font-semibold">HDFC Millennia Credit</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Visa</span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">•••• 4242 • Exp 08/27</span>
                    </div>
                  </div>
                  <span 
                    className={`material-symbols-outlined text-[20px] ${paymentMethod === 'hdfc' ? 'text-primary' : 'text-outline'}`}
                    style={{ fontVariationSettings: paymentMethod === 'hdfc' ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {paymentMethod === 'hdfc' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </label>

                {/* Option C: Cash on Handover */}
                <label 
                  className={`cursor-pointer flex items-center justify-between p-3.5 transition-all rounded-lg ${
                    paymentMethod === 'cash' ? 'bg-primary-container/10 border-l-2 border-primary' : 'bg-surface-container'
                  }`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="cash" 
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="w-4 h-4 accent-primary cursor-pointer" 
                    />
                    <div className="w-10 h-10 bg-surface-container-lowest flex items-center justify-center shadow-sm rounded">
                      <span className="material-symbols-outlined text-secondary text-[22px]">currency_rupee</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-headline-sm text-[0.95rem] text-charcoal-ink font-semibold">Cash on Handover</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Exact notes requested • QR code at door</span>
                    </div>
                  </div>
                  <span 
                    className={`material-symbols-outlined text-[20px] ${paymentMethod === 'cash' ? 'text-primary' : 'text-outline'}`}
                    style={{ fontVariationSettings: paymentMethod === 'cash' ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {paymentMethod === 'cash' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </label>
              </div>
            </div>

            {/* Section 4: Itemized Invoice & Culinary Basket */}
            <div className="bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-clay-terracotta text-[20px]">restaurant_menu</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Toscano Provisions</h2>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  {cartItems.length} Articles
                </span>
              </div>

              {/* Items List */}
              {cartItems.map((item, index) => {
                const qty = item.currentQty || item.qty || 1;
                const unitPrice = Number(item.fprice || item.FPRICE || item.price || 0);
                const linePrice = unitPrice * qty;
                const subtitle = item.subtext || (
                  index === 0 ? "Fermented sourdough, thyme mascarpone" :
                  index === 1 ? "Aged Modena drizzle, roasted pine nuts" : "Botanical cold-pressed soda (330ml)"
                );

                return (
                  <div key={item.oid || item.OID || index} className="flex items-center justify-between py-2 bg-surface-container-low px-3 rounded-lg">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-5 h-5 flex items-center justify-center bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold rounded">
                        {qty}×
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-headline-sm text-[0.9375rem] text-charcoal-ink truncate">{item.fname || item.FNAME}</span>
                        <span className="font-body-sm text-[0.75rem] text-on-surface-variant truncate">{subtitle}</span>
                      </div>
                    </div>
                    <span className="font-headline-sm text-[0.9375rem] text-charcoal-ink ml-2 whitespace-nowrap">₹{linePrice}</span>
                  </div>
                );
              })}

              {/* Promo Code Bar */}
              {appliedCoupon ? (
                <div className={`bg-tertiary-fixed/40 px-3.5 py-2 flex items-center justify-between rounded-lg ${promoNoticePulse ? 'animate-pulse' : ''}`}>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
                    <div className="flex flex-col">
                      <span className="font-label-sm uppercase font-bold text-tertiary tracking-wider">{appliedCoupon}</span>
                      <span className="font-body-sm text-[0.75rem] text-on-tertiary-container font-medium">Saved ₹{discountAmount} on this order</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={onRemoveCoupon}
                    className="text-[11px] font-bold uppercase tracking-wider text-primary hover:underline px-2 py-1 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="mt-space-xs flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      className="w-full bg-surface-container-low text-charcoal-ink px-3 py-2.5 font-label-md text-label-md uppercase tracking-wider focus:outline-none focus:bg-surface-container-lowest rounded" 
                      placeholder="Enter coupon voucher..." 
                      type="text" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                      disabled={isCouponApplying}
                    />
                    <span className="absolute right-3 top-2.5 material-symbols-outlined text-botanical-sage text-[18px]">local_offer</span>
                  </div>
                  <button 
                    className="bg-charcoal-ink text-soft-cream px-4 font-label-sm text-label-sm uppercase tracking-wider hover:bg-primary transition-colors rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[75px]" 
                    onClick={handleApplyPromo}
                    disabled={isCouponApplying || !couponCode?.trim()}
                    type="button"
                  >
                    {isCouponApplying ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      'Apply'
                    )}
                  </button>
                </div>
              )}

              {/* Accounting Breakdown */}
              <div className="flex flex-col gap-2 pt-2 bg-surface-container-low p-3.5 rounded-lg">
                <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
                  <span>Provisions Subtotal</span>
                  <span className="font-label-md text-label-md text-charcoal-ink">₹{itemSubtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-body-sm font-body-sm text-primary">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">local_offer</span>
                      Botanica Privilege Discount
                    </span>
                    <span className="font-label-md text-label-md font-bold">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    State Botanical Cess &amp; GST (5%)
                    <span className="material-symbols-outlined text-[14px] text-outline cursor-help" title="Calculated as per culinary hospitality norms">info</span>
                  </span>
                  <span className="font-label-md text-label-md text-charcoal-ink">₹{taxFee}</span>
                </div>
                <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
                  <span>Carbon-Neutral Zero-Emission Dispatch</span>
                  <span className="font-label-sm text-label-sm text-botanical-sage uppercase font-bold">Complimentary</span>
                </div>
                <div className="mt-2 pt-3 flex justify-between items-baseline bg-surface-container-lowest p-2.5 shadow-sm rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-charcoal-ink font-bold">Grand Settlement</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Inclusive of all local duties</span>
                  </div>
                  <span className="font-display-lg-mobile text-display-lg-mobile text-primary font-bold tracking-tight">₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Checkout Deck */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(25,24,22,0.08)] pb-safe">
            <div className="max-w-md mx-auto px-gutter-sm py-3 flex items-center gap-4">
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Due</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display-lg-mobile text-headline-lg-mobile text-charcoal-ink font-bold leading-none">₹{grandTotal}</span>
                  <span className="font-label-sm text-[0.625rem] text-primary line-through leading-none">₹{totalOriginal}</span>
                </div>
              </div>
              <button 
                className="flex-1 bg-primary-container text-on-primary py-3.5 px-5 flex items-center justify-between font-label-md text-label-md uppercase tracking-wider font-semibold hover:opacity-95 active:scale-[0.99] transition-all shadow-md rounded-2xl cursor-pointer disabled:opacity-60" 
                onClick={onPlaceOrder}
                disabled={isPlacingOrder}
                type="button"
              >
                {isPlacingOrder ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-on-primary border-t-transparent animate-spin inline-block"></span>
                    Transmitting Sanctuary Order...
                  </span>
                ) : (
                  <>
                    <span>Place Order • ₹{grandTotal}</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CheckoutMobile;
