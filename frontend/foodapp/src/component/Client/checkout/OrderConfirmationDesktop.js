import React from 'react';

function OrderConfirmationDesktop({
  orderData,
  navigate
}) {
  const {
    orderId = "#ZYK-84920",
    cartItems = [],
    grandTotal = 775,
    itemSubtotal = 837,
    discountAmount = 112,
    resolvedAddress = "12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038",
    paymentMethod = "Google Pay UPI",
    placedAt = "8:24 PM"
  } = orderData || {};

  const displayItems = cartItems.length > 0 ? cartItems : [
    {
      fname: "Artisanal Pepperoni Pizza",
      currentQty: 1,
      fprice: 399,
      subtext: "Medium size • Sourdough Stuffed Crust",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgGCmIOo8PQo854jFOS7S4Xq-36jbI8EHHgx_hw2GJ238mAqRRyAS_0YDZcJmFT7DCidk-Sopx82cL5sFl24l4Fd8AXqlKUoSHs-6DlYpNP02GrMhAnRJEoxerX5wyONG2-2_LSArWFYOkqYP_U6jF28jbwm9KvNyKk0eIJFt25vm9l3UrGncrulqyCpKu9TwwPUpqgMC81O7g9xjkLhpxx93Rtklv7VuH6rcmdtwrChEG8HL8gh-T"
    },
    {
      fname: "Smoky BBQ Brioche Burger",
      currentQty: 1,
      fprice: 249,
      subtext: "Grass-fed patty • Truffle Aioli Glaze",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKE7yAaSLNq7wbPCxzeXwSM6Jysgmy9QwB1rvRW1osu5CGkLZJG9ZoDVOG-CbqoFE8PLb4WjuafSW4XSi4sR_aD1sPcJ7QC-rCR4HH-PN9gUd1QPi6lkC0gNpas6V46tUqAercVRgSKyHHcyEiP6QpQIdz6JcZy9FB0fOMY31I8Ao2Kwn88vXhRyBMWwTtb8Gj6j1Z02jpii4L7G3aXBf7-jjm-MU8JvxSWwtkDnAlc2TZ5kNmWHNR"
    },
    {
      fname: "Belgian Dark Lava Cake",
      currentQty: 1,
      fprice: 189,
      subtext: "70% Single Origin Cocoa • Micro-Mint",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBarUCA_P5-2UEltF1_TECKqwDd-In7HXKj2w1Qe9bDw9szJZroEjhFBX2G-6-V7Nld8IAJCDlDYT1LvprKx7hqWk692aQETeuNXMAOMH7JoE7bfVHTmoRSghbet8GIL-oQ-1vtszvZGhreeUI6D-_3pQeofSEsWZH5_etBGFBEsdxnIpIy3BupmYU0Sl2xd-kNRgvwCmnKA_YlU2WVYyBR8EEF5o0Qip1QOwOXEOLzo-ePPSXrbPT"
    }
  ];

  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-surface-container-highest/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <button 
            aria-label="Go back" 
            className="w-10 h-10 flex items-center justify-center text-charcoal-ink hover:text-primary transition-colors cursor-pointer" 
            onClick={() => navigate('/')}
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <span className="font-serif text-2xl font-bold tracking-tight text-charcoal-ink">Zayka</span>
            <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded bg-surface-container text-tertiary font-bold">Confirmation</span>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-20 bg-background min-h-screen">
        <div className="flex flex-col w-full">
          {/* Celebration Top Hero Section */}
          <section className="relative w-full overflow-hidden px-6 lg:px-12 pt-10 pb-16">
            {/* Ambient Botanical Rings */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-tertiary-fixed/30 via-surface-container/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>
            <div className="absolute top-12 right-12 w-64 h-64 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none -z-10"></div>
            
            <div className="max-w-4xl mx-auto flex flex-col items-center">
              {/* Main Celebration Module Card */}
              <div className="w-full bg-surface-container-lowest rounded-3xl p-8 lg:p-14 shadow-xl shadow-charcoal-ink/5 relative flex flex-col items-center text-center overflow-hidden">
                <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full bg-surface-container-low opacity-60 pointer-events-none"></div>
                
                {/* Checkmark Badge */}
                <div className="relative mb-8 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-tertiary-fixed flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full bg-botanical-sage/25 animate-ping opacity-75 scale-110"></div>
                    <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary shadow-md">
                      <span className="material-symbols-outlined text-[36px]">check</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-2 bg-surface-container-lowest px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-clay-terracotta">local_fire_department</span>
                    <span className="font-label-sm text-[10px] text-charcoal-ink uppercase font-bold tracking-wider">Fired Up</span>
                  </div>
                </div>

                {/* Headline & Subtitle */}
                <div className="space-y-3 max-w-xl">
                  <h1 className="font-headline-lg text-headline-lg text-charcoal-ink tracking-tight font-medium">
                    Order Placed Successfully!
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">
                    Your order is confirmed and heading to Toscano's hearth. Fresh harvest ingredients are being gathered right now.
                  </p>
                </div>

                {/* Order ID & Timestamp Bar */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-on-surface-variant font-label-md text-label-md">
                  <span className="px-3 py-1 rounded bg-surface-container text-charcoal-ink font-semibold">
                    Order ID: {orderId}
                  </span>
                  <span className="text-on-surface-variant/40">•</span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-clay-terracotta">schedule</span>
                    Placed at {placedAt}
                  </span>
                  <span className="text-on-surface-variant/40">•</span>
                  <span className="text-botanical-sage font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">verified</span> Pre-Authorized
                  </span>
                </div>

                {/* Delivery Estimation Pill Banner */}
                <div className="mt-8 w-full max-w-2xl bg-surface-container-low rounded-2xl p-4 lg:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 text-left">
                    <div className="w-10 h-10 rounded-xl bg-botanical-sage/20 text-tertiary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[22px]">moped</span>
                    </div>
                    <div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Estimated Dispatch Arrival</div>
                      <div className="font-headline-sm text-headline-sm text-charcoal-ink font-semibold">
                        25–30 mins <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">(8:50 – 8:55 PM)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest text-charcoal-ink font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px] text-clay-terracotta">near_me</span>
                    <span>Indiranagar, BLR</span>
                  </div>
                </div>

                {/* Primary Action CTAs */}
                <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <button 
                    className="w-full sm:w-auto px-8 py-4 bg-primary-container text-on-primary font-label-md text-label-md uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-charcoal-ink transition-colors group rounded-xl shadow-md cursor-pointer" 
                    onClick={() => navigate('/tracking')}
                    type="button"
                  >
                    <span>Track Order Live</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                  <button 
                    className="w-full sm:w-auto px-8 py-4 bg-transparent text-charcoal-ink hover:bg-surface-container font-label-md text-label-md uppercase tracking-widest transition-colors flex items-center justify-center rounded-xl cursor-pointer" 
                    onClick={() => navigate('/')}
                    type="button"
                  >
                    Back to Home / Explore Menu
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Detailed Order Breakdown & Logistics Grid */}
          <section className="w-full px-6 lg:px-12 pb-20">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Itemized Cart (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="bg-surface-container-lowest rounded-3xl p-6 lg:p-8 shadow-sm">
                  <div className="flex items-center justify-between pb-6 border-b border-surface-container">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-charcoal-ink">
                        <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
                      </div>
                      <div>
                        <h2 className="font-headline-sm text-headline-sm text-charcoal-ink font-semibold">Ordered Harvest ({displayItems.length} items)</h2>
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Prepared fresh to order</span>
                      </div>
                    </div>
                    <span className="font-label-sm text-label-sm px-2.5 py-1 bg-surface-container-low text-tertiary font-semibold rounded">
                      Toscano Hearth Kitchen
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-4 mt-6">
                    {displayItems.map((item, index) => {
                      const qty = item.currentQty || item.qty || 1;
                      const price = Number(item.fprice || item.FPRICE || item.price || 0) * qty;
                      const imageSrc = item.image || item.imgUrl || (
                        index === 0
                          ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAgGCmIOo8PQo854jFOS7S4Xq-36jbI8EHHgx_hw2GJ238mAqRRyAS_0YDZcJmFT7DCidk-Sopx82cL5sFl24l4Fd8AXqlKUoSHs-6DlYpNP02GrMhAnRJEoxerX5wyONG2-2_LSArWFYOkqYP_U6jF28jbwm9KvNyKk0eIJFt25vm9l3UrGncrulqyCpKu9TwwPUpqgMC81O7g9xjkLhpxx93Rtklv7VuH6rcmdtwrChEG8HL8gh-T"
                          : index === 1
                          ? "https://lh3.googleusercontent.com/aida-public/AB6AXuBKE7yAaSLNq7wbPCxzeXwSM6Jysgmy9QwB1rvRW1osu5CGkLZJG9ZoDVOG-CbqoFE8PLb4WjuafSW4XSi4sR_aD1sPcJ7QC-rCR4HH-PN9gUd1QPi6lkC0gNpas6V46tUqAercVRgSKyHHcyEiP6QpQIdz6JcZy9FB0fOMY31I8Ao2Kwn88vXhRyBMWwTtb8Gj6j1Z02jpii4L7G3aXBf7-jjm-MU8JvxSWwtkDnAlc2TZ5kNmWHNR"
                          : "https://lh3.googleusercontent.com/aida-public/AB6AXuDBarUCA_P5-2UEltF1_TECKqwDd-In7HXKj2w1Qe9bDw9szJZroEjhFBX2G-6-V7Nld8IAJCDlDYT1LvprKx7hqWk692aQETeuNXMAOMH7JoE7bfVHTmoRSghbet8GIL-oQ-1vtszvZGhreeUI6D-_3pQeofSEsWZH5_etBGFBEsdxnIpIy3BupmYU0Sl2xd-kNRgvwCmnKA_YlU2WVYyBR8EEF5o0Qip1QOwOXEOLzo-ePPSXrbPT"
                      );
                      const subtitle = item.subtext || (
                        index === 0 ? "Medium size • Sourdough Stuffed Crust" :
                        index === 1 ? "Grass-fed patty • Truffle Aioli Glaze" : "70% Single Origin Cocoa • Micro-Mint"
                      );

                      return (
                        <div key={index} className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <img className="w-14 h-14 rounded-xl object-cover shrink-0" alt={item.fname || item.FNAME} src={imageSrc} />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-body-md text-body-md font-semibold text-charcoal-ink truncate">{item.fname || item.FNAME}</h3>
                                <span className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant font-label-sm text-[10px] uppercase font-bold shrink-0">x{qty}</span>
                              </div>
                              <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{subtitle}</p>
                            </div>
                          </div>
                          <div className="font-label-md text-label-md font-semibold text-charcoal-ink whitespace-nowrap text-right">
                            ₹{price}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Financial Calculation Breakdown */}
                  <div className="mt-6 pt-6 bg-surface-container/40 p-5 rounded-2xl space-y-3">
                    <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                      <span>Items Subtotal</span>
                      <span className="font-label-md text-label-md text-charcoal-ink">₹{itemSubtotal}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between font-body-sm text-body-sm text-botanical-sage">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">eco</span>
                          Artisanal Member Courtesy (-₹{discountAmount})
                        </span>
                        <span className="font-label-md text-label-md">-₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                      <span>Insulated Temperature Vault Packaging</span>
                      <span className="font-label-sm text-label-sm uppercase font-semibold text-tertiary">Complimentary</span>
                    </div>
                    <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                      <span>Carbon-Neutral Dispatch Courier</span>
                      <span className="font-label-md text-label-md text-charcoal-ink">₹50</span>
                    </div>
                    <div className="pt-3 flex justify-between items-baseline text-charcoal-ink border-t border-surface-container-high/60">
                      <div>
                        <span className="font-headline-sm text-headline-sm font-semibold">Total Paid</span>
                        <span className="block font-label-sm text-label-sm text-on-surface-variant">Incl. all gourmet tariffs &amp; GST</span>
                      </div>
                      <div className="text-right">
                        <span className="font-headline-md text-headline-md font-bold text-primary">₹{grandTotal}</span>
                        <div className="flex items-center justify-end gap-1.5 font-label-sm text-label-sm text-botanical-sage font-medium mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
                          via {paymentMethod}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chef Note */}
                  <div className="mt-6 p-4 rounded-2xl bg-surface-container-low flex items-start gap-3">
                    <span className="material-symbols-outlined text-[20px] text-raw-ochre shrink-0 mt-0.5">outdoor_grill</span>
                    <div className="space-y-1">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-charcoal-ink font-semibold">Kitchen Dispatch Instruction</span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        "Keep crust extra crisp on the brick hearth stone. Place lava cake in separate thermo-pouch to preserve molten core temperature."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Dispatch Sanctuary (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-surface-container-lowest rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-clay-terracotta/15 text-clay-terracotta flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">home_pin</span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-charcoal-ink font-semibold">Delivery Sanctuary</h3>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">Primary</span>
                  </div>

                  {/* Static Map Preview */}
                  <div 
                    className="relative w-full h-36 rounded-2xl overflow-hidden bg-surface-container-high" 
                    style={{ 
                      backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3rAOHTl318Z851Pi8WcGS02TfnCU7f8gYNlLOXqnA1vnxFZe-KOfv0X14D4s2jMcRBpHyu2MnJPlPZGzbFurg05AFp7_yNQVPj_j2_PTqy6fW3n5qscGhrP2h3xRI4u102sqaMA7WMc2f2uDSrhm0dzuLa9oq6tMYT3n1h-yZcThDls--C0xlUKpl2idQR8q_l4ElEouzJeylmTqx2KULBtLuYWXxLDX2vKF0Z1dTiZQygXBvyDpx')",
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 bg-charcoal-ink/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm shadow-md">
                        <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
                        <span className="font-label-sm text-label-sm text-charcoal-ink font-semibold">Target: Penthouse 402</span>
                      </div>
                    </div>
                  </div>

                  {/* Address Specifics */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md uppercase tracking-wider text-charcoal-ink font-bold">Home Sanctuary</span>
                      <span className="font-label-sm text-label-sm text-botanical-sage font-medium">Contactless Safe</span>
                    </div>
                    <p className="font-body-md text-body-md text-charcoal-ink font-medium leading-snug">
                      Penthouse 402, The Banyan Terraces
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      {resolvedAddress}
                    </p>
                  </div>

                  {/* Handover Protocol */}
                  <div className="p-3.5 rounded-xl bg-surface-container flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-tertiary">door_front</span>
                    <div className="text-left">
                      <span className="font-label-sm text-label-sm uppercase tracking-wide text-charcoal-ink font-semibold block">Protocol Handover</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Contactless Doorstep Placement requested</span>
                    </div>
                  </div>

                  {/* Courier Profile */}
                  <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        className="w-11 h-11 rounded-full object-cover shrink-0" 
                        alt="Rameshwar K." 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHwBOYdTQ1zKVlORbHemvkcVUVEE5qy7HScCuQvsDUQ5xFr4ARc7WluE582RdIVCGq4gE-gOtpRFwyErCBcrEF2DjwqUglFVdEMSZsh-kH0xI-GFzYcmF7MifmOjMoWlGybSftRoVO_jcyeBj8WhpGdImxsRQ0S5LOGvBLzzZLgSVeAaspMYZPNYVIqAd5YYfSFXttINz3d88T0JD92CdHpIGbAXmW3Q0nohzpkwgSv8mJah0Wqf42" 
                      />
                      <div>
                        <div className="font-body-sm text-body-sm font-semibold text-charcoal-ink">Rameshwar K.</div>
                        <div className="font-label-sm text-label-sm text-on-surface-variant">Master Courier • 4.96 ★</div>
                      </div>
                    </div>
                    <a 
                      href="tel:+919876543210" 
                      className="w-9 h-9 rounded-full bg-surface-container-lowest flex items-center justify-center text-charcoal-ink hover:text-primary transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">call</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Live Dispatch Mini-Timeline Bar */}
          <aside className="w-full bg-surface-container-high/60 py-6 px-6 lg:px-12 mt-auto">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-charcoal-ink shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-[24px] text-primary">local_shipping</span>
                </div>
                <div>
                  <div className="font-body-md text-body-md font-semibold text-charcoal-ink">
                    Keep tabs with real-time GPS telemetry
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">
                    You'll receive an SMS dispatch link once Rameshwar departs the hearth oven.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  className="px-4 py-2.5 rounded bg-surface-container-lowest hover:bg-surface text-charcoal-ink font-label-sm text-label-sm uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer" 
                  onClick={() => alert('Digital receipt sent to registered email & WhatsApp.')} 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                  <span>Download Invoice</span>
                </button>
                <button 
                  className="px-5 py-2.5 rounded bg-charcoal-ink text-surface font-label-sm text-label-sm uppercase tracking-wider hover:bg-primary transition-colors flex items-center gap-1.5 cursor-pointer" 
                  onClick={() => navigate('/tracking')}
                  type="button"
                >
                  <span>Live Radar</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="w-full bg-surface-container-low border-t border-surface-container-highest py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
          <span>© 2026 Zayka Artisanal Gastronomy. All rights reserved.</span>
          <span>Sanctuary Dispatch Protocol • Bangalore</span>
        </div>
      </footer>
    </div>
  );
}

export default OrderConfirmationDesktop;
