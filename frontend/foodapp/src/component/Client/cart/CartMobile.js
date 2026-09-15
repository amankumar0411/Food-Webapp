import React, { useState } from 'react';

function CartMobile({
  cartItems,
  onUpdateQty,
  onRemoveItem,
  appliedCoupon,
  isCouponApplying,
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
  navigate
}) {
  // Delivery preferences directive states
  const [directives, setDirectives] = useState({
    leaveAtDoor: false,
    noBell: true,
    addCutlery: false
  });

  const toggleDirective = (key) => {
    setDirectives(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + (Number(item.currentQty || item.qty || 1)), 0);

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
            <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight leading-none">Cart Review</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col relative w-full pt-16 pb-safe bg-surface min-h-screen">
        <div className="flex flex-col w-full px-gutter-sm space-y-4 pb-32">
          {/* Restaurant Identifier Banner */}
          <div className="bg-surface-container rounded-3xl p-4 flex items-center justify-between shadow-sm mt-2">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-charcoal-ink flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-surface text-[22px]">local_pizza</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline-sm text-headline-sm text-charcoal-ink truncate">Toscano Artisan Pizzeria</span>
                <div className="flex items-center space-x-1.5 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[13px] text-clay-terracotta">pin_drop</span>
                  <span>Indiranagar</span>
                  <span>•</span>
                  <span className="text-tertiary font-semibold">20–25 MINS</span>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-charcoal-ink shrink-0">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex flex-col space-y-3">
            {cartItems.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-3xl p-8 text-center shadow-sm flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[32px]">shopping_bag</span>
                </div>
                <h3 className="font-headline-sm text-charcoal-ink">Your Tray is Empty</h3>
                <p className="font-body-sm text-on-surface-variant max-w-xs">
                  Experience woodfired delicacies and botanical refreshments curated fresh for today.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-2 px-6 py-2.5 bg-primary text-on-primary rounded-xl font-label-sm uppercase tracking-wider font-semibold hover:bg-primary-container transition-colors"
                  type="button"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => {
                const qty = item.currentQty || item.qty || 1;
                const unitPrice = Number(item.fprice || item.FPRICE || item.price || 0);
                const linePrice = unitPrice * qty;
                const imageSrc = item.image || item.imgUrl || (
                  index === 0 
                    ? "https://lh3.googleusercontent.com/aida/AEtjO1Xjjm4_ZVVqauAS7mcQM4PLiAulZzogk040b5i_Un70iDimkklimkLWu2Y54_4Xc8irxT8jOH3zqAzXsbOvxer0qNLtCIsbku-fOIZtVTpdDAaZUd9aRtkGr4cA_hBjeYA0zQLJEZNIYCR7q8rWRWtrMWtDsBgoMW4xci-mT13yiUxFkSE0JwoNUvZfj2vo8ie4TEWzouUqWZFBmokJUtEpL3Z2HUjlrcM7lXVXF_T9qS7Hu1Y1_rYIq6I"
                    : index === 1
                    ? "https://lh3.googleusercontent.com/aida/AEtjO1V-_y0s5klUGPhsCnJZt6llTDZKMvMDxxgR5S4TexJFNrzpEb4BGJF6pdIyw_KwqdEB96-dUJUP0Ph6CoGfqSPp7dUfetEXE6VGPuY5H0bC_g_2B1Bs07RE3mjDZwO0HzRCTaQBVOxKYw47UsrUHfJ6GaztY75KRwcUeZQHg0l0IrX2jCB_MmsdeVZOmpMg70l_SKSSJVh6LQnDkvldVlOpDXGl-UA1KeLRnp1tT_YedPk883C-xHC0IAk"
                    : "https://lh3.googleusercontent.com/aida/AEtjO1VCl1Tj2rbSwfnrLsN0BocsQ9nCNJnxrTojifnqdTZlmy5tSV6nkay8e1zpe-UsZM4Sw_n-OlzD-UohGbL615NA-dKfPDo6FjQH9lBHvl-cBmxOQS3jv1mHP-62sBN68mpo21tdcpXC6BDtMNQZWCm9220dAfDCnCoDJkoVUbsO_eVoQQ8gQd1Alc_gqJGEu1Lx1fTD1eERU9R7NF1m0_fxW_cNfRzbNoi5G7qIngE3zwBbl0zn0UNqFCc"
                );
                const subtitle = item.subtext || (
                  index === 0 ? "Medium • Stuffed Crust Cheese Burst" :
                  index === 1 ? "Woodfired Brioche • Double Glaze" : "Warm Molten • Wild Berries"
                );

                return (
                  <div key={item.oid || item.OID || index} className="bg-surface-container-lowest rounded-3xl p-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <img 
                        alt={item.fname || item.FNAME || "Cart item"} 
                        className="w-20 h-20 rounded-2xl object-cover shrink-0" 
                        src={imageSrc} 
                      />
                      <div className="flex flex-col min-w-0 space-y-0.5">
                        <span className="font-headline-sm text-headline-sm text-charcoal-ink truncate">
                          {item.fname || item.FNAME}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                          {subtitle}
                        </span>
                        <span className="font-label-md text-label-md text-charcoal-ink font-semibold">
                          ₹{linePrice}
                        </span>
                      </div>
                    </div>
                    <div className="bg-surface-container-high rounded-full px-2.5 py-1 flex items-center space-x-2 shrink-0 ml-2">
                      <button 
                        className="w-6 h-6 flex items-center justify-center text-charcoal-ink hover:text-primary active:scale-95 transition-transform cursor-pointer" 
                        onClick={() => onUpdateQty(index, -1)} 
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                      </button>
                      <span className="font-label-md text-label-md font-semibold text-charcoal-ink item-qty">
                        {qty}
                      </span>
                      <button 
                        className="w-6 h-6 flex items-center justify-center text-charcoal-ink hover:text-primary active:scale-95 transition-transform cursor-pointer" 
                        onClick={() => onUpdateQty(index, 1)} 
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Explore More Action */}
          <button 
            className="w-full py-3.5 px-4 rounded-2xl bg-surface-container text-charcoal-ink font-label-md text-label-md tracking-wider flex items-center justify-center space-x-2 shadow-sm hover:bg-surface-container-high transition-colors cursor-pointer" 
            onClick={() => navigate('/')}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
            <span>+ EXPLORE MORE CURATED PLATES</span>
          </button>

          {/* Delivery Directives */}
          <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md uppercase tracking-wider text-charcoal-ink font-semibold">Delivery Preferences</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Tap to select</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-3 py-1.5 rounded-xl font-body-sm text-body-sm flex items-center space-x-1.5 transition-all cursor-pointer ${
                  directives.leaveAtDoor ? 'bg-charcoal-ink text-surface' : 'bg-surface-container text-on-surface'
                }`} 
                onClick={() => toggleDirective('leaveAtDoor')} 
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-tertiary">door_front</span>
                <span>Leave at door</span>
              </button>
              <button 
                className={`px-3 py-1.5 rounded-xl font-body-sm text-body-sm flex items-center space-x-1.5 transition-all cursor-pointer ${
                  directives.noBell ? 'bg-charcoal-ink text-surface' : 'bg-surface-container text-on-surface'
                }`} 
                onClick={() => toggleDirective('noBell')} 
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary-fixed">notifications_off</span>
                <span>Don't ring bell</span>
              </button>
              <button 
                className={`px-3 py-1.5 rounded-xl font-body-sm text-body-sm flex items-center space-x-1.5 transition-all cursor-pointer ${
                  directives.addCutlery ? 'bg-charcoal-ink text-surface' : 'bg-surface-container text-on-surface'
                }`} 
                onClick={() => toggleDirective('addCutlery')} 
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-clay-terracotta">flatware</span>
                <span>Add cutlery</span>
              </button>
            </div>
          </div>

          {/* Promo Code Voucher */}
          <div className="bg-surface-container-lowest rounded-3xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between bg-surface-container-low rounded-2xl px-3 py-2">
              <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[18px]">local_offer</span>
                </div>
                {appliedCoupon ? (
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-md text-label-md tracking-wider font-semibold text-charcoal-ink">{appliedCoupon}</span>
                    <span className="font-body-sm text-body-sm text-botanical-sage">₹{discountAmount} savings unlocked</span>
                  </div>
                ) : (
                  <div className="flex items-center flex-1 mr-2">
                    <input 
                      type="text" 
                      placeholder="ENTER PROMO CODE..." 
                      className="bg-transparent font-label-md text-label-md text-charcoal-ink outline-none uppercase w-full placeholder:text-on-surface-variant/60"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && onApplyCoupon(couponInput)}
                      disabled={isCouponApplying}
                    />
                  </div>
                )}
              </div>
              {appliedCoupon ? (
                <button 
                  className="px-3 py-1 rounded-xl bg-charcoal-ink text-surface font-label-sm text-label-sm tracking-wider uppercase hover:bg-primary transition-colors cursor-pointer" 
                  onClick={onRemoveCoupon}
                  type="button"
                >
                  REMOVE
                </button>
              ) : (
                <button 
                  className="px-3 py-1 rounded-xl bg-primary text-on-primary font-label-sm text-label-sm tracking-wider uppercase hover:bg-primary-container transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[65px]" 
                  onClick={() => onApplyCoupon(couponInput)}
                  disabled={isCouponApplying || !couponInput?.trim()}
                  type="button"
                >
                  {isCouponApplying ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    'APPLY'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm space-y-2.5">
            <span className="font-label-md text-label-md uppercase tracking-wider text-charcoal-ink font-semibold block">Bill Summary</span>
            <div className="space-y-1.5 text-on-surface">
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Item Subtotal</span>
                <span className="font-label-md text-label-md text-charcoal-ink">₹{itemSubtotal}</span>
              </div>
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Packaging &amp; Taxes</span>
                <span className="font-label-md text-label-md text-charcoal-ink">₹{packagingFee}</span>
              </div>
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Delivery Partner Fee</span>
                <span className="font-label-md text-label-md text-tertiary font-medium">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between font-body-sm text-body-sm">
                  <span className="text-clay-terracotta">Promo Discount ({appliedCoupon})</span>
                  <span className="font-label-md text-label-md text-clay-terracotta font-semibold">-₹{discountAmount}</span>
                </div>
              )}
            </div>
            <div className="pt-2.5 flex items-center justify-between bg-surface-container-low px-3 py-2.5 rounded-2xl">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">To Pay</span>
                <span className="font-headline-sm text-headline-sm text-charcoal-ink font-semibold">Grand Total</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">₹{grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Sticky Mobile Checkout Bar */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md pb-safe px-gutter-sm pt-3 shadow-[0_-4px_16px_rgba(25,24,22,0.06)]">
            <div className="flex items-center justify-between bg-charcoal-ink rounded-3xl p-2.5 pl-5 mb-2 shadow-md">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-wider">
                  {totalItemsCount} {totalItemsCount === 1 ? 'ITEM' : 'ITEMS'} IN TRAY
                </span>
                <span className="font-headline-sm text-headline-sm text-surface font-semibold">₹{grandTotal}</span>
              </div>
              <button 
                className="bg-primary hover:bg-primary-container text-on-primary px-5 py-3 rounded-2xl font-label-md text-label-md tracking-wider flex items-center space-x-1.5 active:scale-95 transition-all cursor-pointer" 
                onClick={onProceedToCheckout}
                type="button"
              >
                <span>PROCEED TO CHECKOUT</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CartMobile;
