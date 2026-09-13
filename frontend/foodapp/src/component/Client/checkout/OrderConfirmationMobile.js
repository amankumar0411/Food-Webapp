import React from 'react';

function OrderConfirmationMobile({
  orderData,
  navigate
}) {
  const {
    orderId = "#ZYK-84920",
    cartItems = [],
    grandTotal = 775,
    itemSubtotal = 837,
    discountAmount = 62,
    resolvedAddress = "Penthouse 402, 12th Main, Indiranagar",
    paymentMethod = "UPI AutoPay"
  } = orderData || {};

  const displayItems = cartItems.length > 0 ? cartItems : [
    {
      fname: "Artisanal Pepperoni Pizza",
      currentQty: 1,
      fprice: 399,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbL2P9xH7U3n4AtiCKHjRzTyQFfgZ2m6oCgOqzSqz5bZEh-5EavM7uq8v-lYFGEUmP019D28K4kau1hBcnINczu_XNKGNysQ4xr3yMLJy7oilMHtQZ52bWlDKy5TSYwkHOdrTFcV5AQ6ll5Cv7d1uzYe01DIqm9Pzz-7pj94rev94MpfF0ARLi6hN31JGTe9h2Z4ZwLYczjsnyrkr1bwqdOtt9NO2Ty6i3C-peeb0J-FTLd8SktyfS"
    },
    {
      fname: "Smoky BBQ Burger",
      currentQty: 1,
      fprice: 249,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9RU5UsXtklpQgAnkzmAqnAKvmqYv6SIrHI61ftQjBKZeVdIl-5S9yzlL8f7XOoXtszZqPk7wOS3IXhqjVsMgrpQvTPtrAWOFQ8ImHXthRX67jUH7sO0TanbNiP00iMk2vEqug371pg-r6xzvKWxmdw4r-Y96cuGselPjB665A_bjhwDcM__ABxPvu5WMhP5xDxGR3B5eeBkgf5zAPlh0eRic1K4ASQ_Th83SBMObARDT2gHldHhqR"
    },
    {
      fname: "Belgian Dark Lava Cake",
      currentQty: 1,
      fprice: 189,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQsq4DD-ZIyMaAsRwqLObVoq-bIlVw-anFpWqQWAU_apGHGjtdeDXsjR6V-_v5yME6ptUMo562vHvgSdAtBEyqTPlzQla8ZkhIBpgKHVbT-ABZqDsz0azUi8fk9GN6bKgWwHEdH9VovjSqUaUpGaFGR5FZ5xw2wLlOuSKHJBiCHy2q4KDqWRwMoMnhRZQevcLToFEqGI_QhHhVlrbFZTjzcOi3Q98-JiW7iY001hZun0DOiNbXeBHj"
    }
  ];

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-gutter-sm flex items-center justify-between">
          <button 
            aria-label="Go back" 
            className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer" 
            onClick={() => navigate('/')}
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <div className="flex flex-col items-center justify-center flex-1 pr-11">
            <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight leading-none">Order Confirmation</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col relative w-full pt-16 pb-safe bg-surface min-h-screen">
        <div className="flex flex-col w-full px-margin-sm space-y-space-md pb-space-xl">
          {/* Celebration Sparkle & Badge Section */}
          <div className="relative flex flex-col items-center justify-center pt-space-md pb-space-sm">
            {/* Confetti & Ambient Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <div className="w-48 h-48 rounded-full bg-secondary-fixed/50 blur-2xl opacity-60"></div>
              <div className="w-32 h-32 rounded-full bg-botanical-sage/20 blur-xl opacity-70"></div>
            </div>

            {/* Pulsing Animated Checkmark Badge */}
            <div className="relative z-10 flex items-center justify-center mb-space-sm">
              <div className="absolute w-20 h-20 rounded-full bg-primary-container/20 animate-ping opacity-40"></div>
              <div className="w-20 h-20 rounded-full bg-surface-container-lowest shadow-md flex items-center justify-center relative">
                <div className="w-14 h-14 rounded-full bg-tertiary-fixed flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-tertiary text-[32px] animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
              </div>
            </div>

            {/* Editorial Celebration Header */}
            <div className="text-center z-10 space-y-space-xs">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest bg-secondary-fixed/60 px-space-sm py-0.5 rounded-full inline-block">
                Order Confirmed
              </span>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-charcoal-ink tracking-tight font-headline-sm">
                Order Placed!
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[280px] mx-auto">
                Your artisanal kitchen selection is freshly being prepared with care.
              </p>
            </div>

            {/* Quick Meta Chips */}
            <div className="z-10 flex flex-wrap items-center justify-center gap-space-xs mt-space-sm">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-surface-container-high rounded-full">
                <span className="material-symbols-outlined text-[16px] text-raw-ochre">tag</span>
                <span className="font-label-md text-label-md text-charcoal-ink font-bold tracking-wider">{orderId}</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-tertiary-fixed text-on-tertiary-fixed rounded-full shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-tertiary">schedule</span>
                <span className="font-body-sm text-body-sm font-semibold">25–30 mins</span>
              </div>
            </div>
          </div>

          {/* Delivery Trajectory Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-charcoal-ink">
                  <span className="material-symbols-outlined text-[18px]">near_me</span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Delivery To</span>
                  <p className="font-headline-sm text-headline-sm text-charcoal-ink leading-tight">Indiranagar Sanctuary</p>
                </div>
              </div>
              <span className="bg-botanical-sage/20 text-tertiary font-label-sm text-label-sm px-2.5 py-1 rounded-full uppercase font-medium">
                On Schedule
              </span>
            </div>

            {/* Progress Indicator Strip */}
            <div className="pt-space-xs pb-space-xs">
              <div className="relative w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-2/5 bg-primary-container rounded-full transition-all duration-1000 ease-out"></div>
              </div>
              <div className="flex justify-between text-on-surface-variant pt-1.5 font-label-sm text-label-sm">
                <span className="text-primary-container font-semibold">Kitchen Prepping</span>
                <span>Out for Delivery</span>
                <span>Arrived</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-space-sm bg-surface-container rounded-2xl">
              <div className="flex items-center space-x-space-sm min-w-0">
                <span className="material-symbols-outlined text-secondary text-[20px]">home_pin</span>
                <p className="font-body-sm text-body-sm text-charcoal-ink truncate font-medium">{resolvedAddress}</p>
              </div>
              <button 
                aria-label="View Map" 
                className="text-primary hover:text-charcoal-ink transition-colors p-1 cursor-pointer"
                onClick={() => navigate('/tracking')}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">north_east</span>
              </button>
            </div>
          </div>

          {/* Food Illustration Spotlight */}
          <div className="relative w-full h-36 rounded-3xl overflow-hidden shadow-sm flex items-end p-space-md bg-surface-container-high">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDKyBo-kav9OLTe3BGUyyrXOjMJNv52M-xE3sgj8naq0f_5IWzYwKs-m5z59Pn5j9I1dg7-rLsfMxGLkp_795j6cfa1GPCdi5lxc5pSGqZ0sYVNS2BZii5UbtN5xhqOQoDOKmdUZzeplZWEtKmL8uC0i9DdtmvHJ5mmZCYCoXz1RJhK1tMa61XJI1Qk_2mBpCcIf8Po0BsVrGua-EdUQDIk-0KTLce-5CXNePis8SgbqDuLHXb0QmgZ')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-ink/80 via-charcoal-ink/30 to-transparent"></div>
            <div className="relative z-10 flex items-center justify-between w-full text-on-primary">
              <div>
                <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed">Handcrafted Batch</p>
                <p className="font-headline-sm text-headline-sm text-surface-container-lowest">Order in Kitchen Queue</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-surface-container-lowest/20 backdrop-blur-md flex items-center justify-center">
                <span className="material-symbols-outlined text-surface-container-lowest text-[20px]">skillet</span>
              </div>
            </div>
          </div>

          {/* Ordered Items Summary List */}
          <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm space-y-space-md">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-charcoal-ink font-semibold">Order Summary</h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">{displayItems.length} ITEMS</span>
            </div>

            <div className="space-y-space-sm">
              {displayItems.map((item, index) => {
                const qty = item.currentQty || item.qty || 1;
                const price = Number(item.fprice || item.FPRICE || item.price || 0) * qty;
                const imageSrc = item.image || item.imgUrl || (
                  index === 0
                    ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCbL2P9xH7U3n4AtiCKHjRzTyQFfgZ2m6oCgOqzSqz5bZEh-5EavM7uq8v-lYFGEUmP019D28K4kau1hBcnINczu_XNKGNysQ4xr3yMLJy7oilMHtQZ52bWlDKy5TSYwkHOdrTFcV5AQ6ll5Cv7d1uzYe01DIqm9Pzz-7pj94rev94MpfF0ARLi6hN31JGTe9h2Z4ZwLYczjsnyrkr1bwqdOtt9NO2Ty6i3C-peeb0J-FTLd8SktyfS"
                    : index === 1
                    ? "https://lh3.googleusercontent.com/aida-public/AB6AXuD9RU5UsXtklpQgAnkzmAqnAKvmqYv6SIrHI61ftQjBKZeVdIl-5S9yzlL8f7XOoXtszZqPk7wOS3IXhqjVsMgrpQvTPtrAWOFQ8ImHXthRX67jUH7sO0TanbNiP00iMk2vEqug371pg-r6xzvKWxmdw4r-Y96cuGselPjB665A_bjhwDcM__ABxPvu5WMhP5xDxGR3B5eeBkgf5zAPlh0eRic1K4ASQ_Th83SBMObARDT2gHldHhqR"
                    : "https://lh3.googleusercontent.com/aida-public/AB6AXuCQsq4DD-ZIyMaAsRwqLObVoq-bIlVw-anFpWqQWAU_apGHGjtdeDXsjR6V-_v5yME6ptUMo562vHvgSdAtBEyqTPlzQla8ZkhIBpgKHVbT-ABZqDsz0azUi8fk9GN6bKgWwHEdH9VovjSqUaUpGaFGR5FZ5xw2wLlOuSKHJBiCHy2q4KDqWRwMoMnhRZQevcLToFEqGI_QhHhVlrbFZTjzcOi3Q98-JiW7iY001hZun0DOiNbXeBHj"
                );

                return (
                  <div key={index} className="flex items-center justify-between py-1">
                    <div className="flex items-center space-x-space-sm min-w-0">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-surface-container flex-shrink-0">
                        <img className="w-full h-full object-cover" alt={item.fname || item.FNAME} src={imageSrc} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-body-md text-body-md text-charcoal-ink font-medium truncate">{item.fname || item.FNAME}</h4>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Qty: {qty}</span>
                      </div>
                    </div>
                    <span className="font-headline-sm text-headline-sm text-charcoal-ink font-semibold flex-shrink-0">₹{price}</span>
                  </div>
                );
              })}
            </div>

            {/* Total Payment Breakdown */}
            <div className="bg-surface-container-low rounded-2xl p-space-sm space-y-space-xs">
              <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                <span>Payment Method</span>
                <span className="font-medium text-charcoal-ink inline-flex items-center space-x-1">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                  <span>{paymentMethod}</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                <span>Subtotal</span>
                <span>₹{itemSubtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-secondary font-body-sm text-body-sm">
                  <span>Gourmet Voucher Applied</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-space-xs border-t border-surface-container/60">
                <span className="font-headline-sm text-headline-sm text-charcoal-ink">Total Paid</span>
                <span className="font-headline-md text-headline-md text-primary font-bold">₹{grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Delivery Partner / Courier Mini Profile */}
          <div className="bg-surface-container rounded-3xl p-space-md flex items-center justify-between">
            <div className="flex items-center space-x-space-sm">
              <div className="w-12 h-12 rounded-full bg-clay-terracotta/20 flex items-center justify-center text-clay-terracotta">
                <span className="material-symbols-outlined text-[24px]">electric_moped</span>
              </div>
              <div>
                <h4 className="font-body-md text-body-md font-semibold text-charcoal-ink">Kabir S.</h4>
                <div className="flex items-center space-x-1">
                  <span className="material-symbols-outlined text-raw-ochre text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">4.9 • Express Delivery</span>
                </div>
              </div>
            </div>
            <a 
              href="tel:+919876543210"
              aria-label="Call Delivery Partner" 
              className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-charcoal-ink active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]">call</span>
            </a>
          </div>

          {/* Action CTA Buttons */}
          <div className="space-y-space-sm pt-space-xs">
            <button 
              className="w-full h-14 bg-primary-container text-on-primary rounded-full font-label-md text-label-md uppercase tracking-wider font-bold shadow-md hover:bg-charcoal-ink transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer" 
              onClick={() => navigate('/tracking')}
              type="button"
            >
              <span>Track Order Live</span>
              <span className="material-symbols-outlined text-[18px]">trending_flat</span>
            </button>
            <button 
              className="w-full h-12 bg-surface-container-highest text-charcoal-ink rounded-full font-label-md text-label-md uppercase tracking-wider font-medium hover:bg-surface-dim transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer" 
              onClick={() => navigate('/')}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderConfirmationMobile;
