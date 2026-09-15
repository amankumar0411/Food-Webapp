import React from 'react';

function CheckoutDesktop({
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
  const appendNote = (text) => {
    if (!instructions.trim()) {
      setInstructions(text);
    } else {
      setInstructions(prev => `${prev} • ${text}`);
    }
  };

  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-surface-container-highest/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <button 
            aria-label="Go back" 
            className="w-10 h-10 flex items-center justify-center text-charcoal-ink hover:text-primary transition-colors cursor-pointer" 
            onClick={() => navigate(-1)}
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <span className="font-serif text-2xl font-bold tracking-tight text-charcoal-ink">Zayka</span>
            <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded bg-surface-container text-tertiary font-bold">Sanctuary</span>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-20 bg-background min-h-screen">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-1">
                  <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/')}>Sanctuary</span>
                  <span>/</span>
                  <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/addorder')}>Tray</span>
                  <span>/</span>
                  <span className="text-charcoal-ink font-bold">Checkout</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-charcoal-ink tracking-tight font-semibold">Checkout &amp; Settlement</h1>
              </div>
              <div className="flex items-center gap-6 text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-botanical-sage" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-charcoal-ink font-medium">Artisanal Guild Certified</span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-clay-terracotta">nest_clock_farsight_analog</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider">Estimated Dispatch: 32 Mins</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* LEFT COLUMN: 3 Numbered Sections */}
              <div className="lg:col-span-7 flex flex-col gap-8">
                {/* Section 1: Delivery Sanctuary */}
                <section className="bg-surface-container rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-charcoal-ink text-surface-container flex items-center justify-center font-label-md text-label-md font-bold">1</span>
                      <div>
                        <h2 className="font-headline-sm text-headline-sm text-charcoal-ink font-semibold">Delivery Sanctuary</h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Designate your private table or concierge drop point</p>
                      </div>
                    </div>
                    <button 
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest text-primary hover:bg-primary-fixed transition-colors font-label-sm text-label-sm uppercase tracking-wider font-semibold cursor-pointer"
                      onClick={() => navigate('/account')}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>New Address</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Home Option */}
                    <label 
                      className={`group relative flex items-start gap-4 p-5 rounded-2xl cursor-pointer transition-all ${
                        selectedAddress === 'home' ? 'bg-surface-container-lowest shadow-sm ring-2 ring-primary/20' : 'bg-surface-container-low hover:bg-surface-container-lowest'
                      }`}
                      onClick={() => setSelectedAddress('home')}
                    >
                      <input 
                        type="radio" 
                        name="delivery_address" 
                        value="home" 
                        checked={selectedAddress === 'home'}
                        onChange={() => setSelectedAddress('home')}
                        className="mt-1 w-4 h-4 text-charcoal-ink accent-charcoal-ink cursor-pointer" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="font-headline-sm text-headline-sm text-charcoal-ink font-medium">Home Sanctuary</span>
                          <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-label-sm text-[10px] uppercase font-bold tracking-wider">Default</span>
                          <span className="px-2 py-0.5 rounded bg-surface-container-high text-tertiary font-label-sm text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">contactless</span> Verified Contactless
                          </span>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                          {addresses.find(a => a.tag === 'home')?.streetAddress || 'Penthouse 402, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru — 560038'}
                        </p>
                        <span className="mt-2 inline-flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                          <span className="material-symbols-outlined text-[14px]">format_image_left</span> Resident Access Code Active
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-clay-terracotta text-[22px]">location_on</span>
                    </label>

                    {/* Office Option */}
                    <label 
                      className={`group relative flex items-start gap-4 p-5 rounded-2xl cursor-pointer transition-all ${
                        selectedAddress === 'office' ? 'bg-surface-container-lowest shadow-sm ring-2 ring-primary/20' : 'bg-surface-container-low hover:bg-surface-container-lowest'
                      }`}
                      onClick={() => setSelectedAddress('office')}
                    >
                      <input 
                        type="radio" 
                        name="delivery_address" 
                        value="office" 
                        checked={selectedAddress === 'office'}
                        onChange={() => setSelectedAddress('office')}
                        className="mt-1 w-4 h-4 text-charcoal-ink accent-charcoal-ink cursor-pointer" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="font-headline-sm text-headline-sm text-charcoal-ink font-medium">Design Atelier / Office</span>
                          <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-[10px] uppercase font-medium">Secondary</span>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                          {addresses.find(a => a.tag === 'office')?.streetAddress || '7th Floor, North Wing, Ecoworld Tech Park, Outer Ring Road, Bellandur, Bengaluru — 560103'}
                        </p>
                        <span className="mt-2 inline-flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                          <span className="material-symbols-outlined text-[14px]">corporate_fare</span> Tower Front Concierge Desk
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant text-[22px]">business</span>
                    </label>
                  </div>
                </section>

                {/* Section 2: Kitchen & Dispatch Directives */}
                <section className="bg-surface-container rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-full bg-charcoal-ink text-surface-container flex items-center justify-center font-label-md text-label-md font-bold">2</span>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-charcoal-ink font-semibold">Kitchen &amp; Dispatch Directives</h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Tailor temperature profiles, crust textures, or courier gate procedures</p>
                    </div>
                  </div>
                  <div className="relative mt-4">
                    <textarea 
                      className="w-full rounded-2xl bg-surface-container-lowest p-4 text-charcoal-ink placeholder:text-on-surface-variant/60 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-charcoal-ink transition-all resize-none shadow-sm" 
                      placeholder="e.g. Please bake crust blistered &amp; well-done, leave package with penthouse front concierge, ring chime once..." 
                      rows="3"
                      maxLength={250}
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                    />
                    <div className="flex items-center justify-between mt-2.5 px-1">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Shared strictly with Head Chef &amp; Courier Pilot</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{instructions.length} / 250 Chars</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button 
                      className="px-3 py-1.5 rounded-full bg-surface-container-lowest hover:bg-surface-container-high text-charcoal-ink font-label-sm text-label-sm transition-colors flex items-center gap-1.5 cursor-pointer" 
                      onClick={() => appendNote('Leave at concierge')}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px] text-clay-terracotta">done</span>
                      Leave at concierge
                    </button>
                    <button 
                      className="px-3 py-1.5 rounded-full bg-surface-container-lowest hover:bg-surface-container-high text-charcoal-ink font-label-sm text-label-sm transition-colors flex items-center gap-1.5 cursor-pointer" 
                      onClick={() => appendNote('Extra charred blistered crust')}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px] text-clay-terracotta">done</span>
                      Extra charred blistered crust
                    </button>
                    <button 
                      className="px-3 py-1.5 rounded-full bg-surface-container-lowest hover:bg-surface-container-high text-charcoal-ink font-label-sm text-label-sm transition-colors flex items-center gap-1.5 cursor-pointer" 
                      onClick={() => appendNote('Eco biodegradable packaging only')}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px] text-clay-terracotta">done</span>
                      Eco biodegradable packaging only
                    </button>
                  </div>
                </section>

                {/* Section 3: Payment Instrument */}
                <section className="bg-surface-container rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-charcoal-ink text-surface-container flex items-center justify-center font-label-md text-label-md font-bold">3</span>
                      <div>
                        <h2 className="font-headline-sm text-headline-sm text-charcoal-ink font-semibold">Payment Instrument</h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Direct settlement via secure instant clearing channels</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-botanical-sage font-label-sm text-label-sm uppercase font-bold">
                      <span className="material-symbols-outlined text-[16px]">lock</span> Encrypted
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* UPI */}
                    <label 
                      className={`relative p-5 rounded-2xl cursor-pointer transition-all flex flex-col justify-between group ${
                        paymentMethod === 'upi' ? 'bg-surface-container-lowest shadow-sm ring-2 ring-primary/20' : 'bg-surface-container-low hover:bg-surface-container-lowest'
                      }`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-charcoal-ink">
                            <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
                          </div>
                          <div>
                            <span className="font-headline-sm text-headline-sm text-charcoal-ink font-medium block">Google Pay / PhonePe</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">Direct UPI Protocol</span>
                          </div>
                        </div>
                        <input 
                          type="radio" 
                          name="payment_method_desk" 
                          value="upi" 
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="mt-1 w-4 h-4 accent-primary cursor-pointer" 
                        />
                      </div>
                      <div className="mt-4 pt-3 flex items-center justify-between border-t border-surface-container/60">
                        <span className="font-label-sm text-label-sm text-charcoal-ink font-semibold">aman.verma@okhdfcbank</span>
                        <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-[10px] uppercase font-bold">Verified</span>
                      </div>
                    </label>

                    {/* Card */}
                    <label 
                      className={`relative p-5 rounded-2xl cursor-pointer transition-all flex flex-col justify-between group ${
                        paymentMethod === 'card' ? 'bg-surface-container-lowest shadow-sm ring-2 ring-primary/20' : 'bg-surface-container-low hover:bg-surface-container-lowest'
                      }`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-charcoal-ink">
                            <span className="material-symbols-outlined text-[22px]">credit_card</span>
                          </div>
                          <div>
                            <span className="font-headline-sm text-headline-sm text-charcoal-ink font-medium block">Credit / Debit Card</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">HDFC Millennia Black</span>
                          </div>
                        </div>
                        <input 
                          type="radio" 
                          name="payment_method_desk" 
                          value="card" 
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="mt-1 w-4 h-4 accent-primary cursor-pointer" 
                        />
                      </div>
                      <div className="mt-4 pt-3 flex items-center justify-between border-t border-surface-container/60">
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">•••• •••• •••• 4242</span>
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-[10px] uppercase font-bold tracking-wider">VISA INFINITE</span>
                      </div>
                    </label>

                    {/* Net Banking */}
                    <label 
                      className={`relative p-5 rounded-2xl cursor-pointer transition-all flex flex-col justify-between group ${
                        paymentMethod === 'netbanking' ? 'bg-surface-container-lowest shadow-sm ring-2 ring-primary/20' : 'bg-surface-container-low hover:bg-surface-container-lowest'
                      }`}
                      onClick={() => setPaymentMethod('netbanking')}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-charcoal-ink">
                            <span className="material-symbols-outlined text-[22px]">account_balance</span>
                          </div>
                          <div>
                            <span className="font-headline-sm text-headline-sm text-charcoal-ink font-medium block">Net Banking</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">54 Partner Institutes</span>
                          </div>
                        </div>
                        <input 
                          type="radio" 
                          name="payment_method_desk" 
                          value="netbanking" 
                          checked={paymentMethod === 'netbanking'}
                          onChange={() => setPaymentMethod('netbanking')}
                          className="mt-1 w-4 h-4 accent-primary cursor-pointer" 
                        />
                      </div>
                      <div className="mt-4 pt-3 flex items-center justify-between border-t border-surface-container/60">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">HDFC, ICICI, SBI, Axis</span>
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_forward</span>
                      </div>
                    </label>

                    {/* Cash */}
                    <label 
                      className={`relative p-5 rounded-2xl cursor-pointer transition-all flex flex-col justify-between group ${
                        paymentMethod === 'cod' ? 'bg-surface-container-lowest shadow-sm ring-2 ring-primary/20' : 'bg-surface-container-low hover:bg-surface-container-lowest'
                      }`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-charcoal-ink">
                            <span className="material-symbols-outlined text-[22px]">payments</span>
                          </div>
                          <div>
                            <span className="font-headline-sm text-headline-sm text-charcoal-ink font-medium block">Cash on Handover</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">Exact denomination advised</span>
                          </div>
                        </div>
                        <input 
                          type="radio" 
                          name="payment_method_desk" 
                          value="cod" 
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="mt-1 w-4 h-4 accent-primary cursor-pointer" 
                        />
                      </div>
                      <div className="mt-4 pt-3 flex items-center justify-between border-t border-surface-container/60">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Settlement at doorstep</span>
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-[10px] uppercase font-bold">Standard</span>
                      </div>
                    </label>
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN: Sticky Itemized Manifest & Ledger */}
              <div className="lg:col-span-5 flex flex-col gap-6 sticky top-28">
                <div className="bg-surface-container rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-surface-container-high">
                    <div>
                      <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant font-semibold">Kitchen Order Specification</span>
                      <h2 className="font-headline-sm text-headline-sm text-charcoal-ink font-bold">Itemized Manifest</h2>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-charcoal-ink font-label-sm text-label-sm font-semibold">
                      {cartItems.length} Delicacies
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item, index) => {
                      const qty = item.currentQty || item.qty || 1;
                      const unitPrice = Number(item.fprice || item.FPRICE || item.price || 0);
                      const linePrice = unitPrice * qty;
                      const imageSrc = item.image || item.imgUrl || (
                        index === 0
                          ? "https://lh3.googleusercontent.com/aida-public/AB6AXuC9aK0IQg9PPrSUaDo1GBZWhgciV_rCxbCY48rk7ksB6sOIkL4SmOX4fMOe0FpGxdaSqSq52byJi8OtwM0lYht2x8YjCMAVXZF2BpSW0ca17prRRzw2BxRk6g1rL3stzQ7a7qUICXYjpbiZ3wQMx6ga3VI2MyRG4y4wO7MvM5VL9XIoZ3nklo8viLzTZt_9Du11y2eNUSeQHjn7wD0FuUkakdgOSnGw9W9PmOrc1MmyESCPc_rwcB9R"
                          : index === 1
                          ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAIONmKOHxf6sdxyzDQvLXOzebO9cFUTctmXimDxQ3i9qWzuUvKENYhhoSfS-KMitVmZRwsSvd8-xDHcRS4eq6nF85ZVLixfTVk0btztnYSC-PtcrQPWvbW9Z_ooxZNcKTC8JlcPf6YjMrNVzmA55Iw5WQnOu-TSnVSVSZT0NQnexTb0sExPbKfsXvnkpDcKOrldfVxyGVhOnEJZPZFO3mJXesHozOe-4FRMmqoPibkNmOi1tR4JBxk"
                          : "https://lh3.googleusercontent.com/aida-public/AB6AXuA48Kg9fJo37Z1qwmdMUeTChxQTmpxYj7_1NMuf2h17Bqc5Bm-f6Yd6EMtRo19PRi2IPoRmObSctE_Oo1v0PzKqcpX6jzf40I9ixkOvR7i93kha1hWC-SBsX021gEP6i56kmmLyDw2d0xliJ_QvjyuZcVV8UjfCPidk_K-yABgLWNqrofFgrkC4LO1x2r6qmpXSJ1saeE2Yd5Pyqfh4vgqZ7S0752Npv2AU40N4R-yn2YT3MJsYXlTj"
                      );
                      const subtitle = item.subtext || (
                        index === 0 ? "48h slow-ferment, buffalo mozzarella" :
                        index === 1 ? "Smoked cheddar, espresso reduction bun" : "Single-origin Idukki cocoa, sea salt crystals"
                      );
                      const tagLabel = index === 0 ? "Wood-Fired Hearth" : index === 1 ? "Oak Smoked" : "Warm Center";
                      const tagColor = index === 0 ? "text-tertiary" : index === 1 ? "text-clay-terracotta" : "text-raw-ochre";

                      return (
                        <div key={item.oid || item.OID || index} className="flex items-center gap-4 p-3 rounded-2xl bg-surface-container-lowest shadow-sm">
                          <img className="w-16 h-16 rounded-xl object-cover" alt={item.fname || item.FNAME} src={imageSrc} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-headline-sm text-headline-sm text-charcoal-ink truncate font-medium">{item.fname || item.FNAME}</h4>
                              <span className="font-label-md text-label-md text-charcoal-ink font-bold ml-2">₹{linePrice}</span>
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{subtitle}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`font-label-sm text-[11px] font-semibold uppercase ${tagColor}`}>{tagLabel}</span>
                              <span className="text-on-surface-variant/40">•</span>
                              <span className="font-label-sm text-[11px] text-on-surface-variant">Qty: {qty}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Culinary Voucher Active */}
                  <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-charcoal-ink font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-botanical-sage">local_offer</span>
                        Culinary Voucher Active
                      </span>
                      {appliedCoupon && (
                        <span 
                          className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider cursor-pointer hover:underline"
                          onClick={onRemoveCoupon}
                        >
                          Remove
                        </span>
                      )}
                    </div>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-tertiary-fixed/30 p-2.5 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-tertiary text-on-tertiary font-label-sm text-label-sm font-bold tracking-wider">{appliedCoupon}</span>
                          <span className="font-body-sm text-body-sm text-tertiary font-medium">₹{discountAmount} Seasonal Savings Applied</span>
                        </div>
                        <span className="material-symbols-outlined text-tertiary text-[20px]">check_circle</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-2">
                        <input 
                          type="text" 
                          placeholder="Enter voucher code..." 
                          className="flex-1 bg-surface-container-low px-3 py-2 rounded-xl font-label-sm text-label-sm uppercase tracking-wider text-charcoal-ink outline-none"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && onApplyCoupon(couponCode)}
                          disabled={isCouponApplying}
                        />
                        <button 
                          className="px-4 py-2 bg-charcoal-ink text-surface rounded-xl font-label-sm uppercase font-bold hover:bg-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                          onClick={() => onApplyCoupon(couponCode)}
                          disabled={isCouponApplying || !couponCode?.trim()}
                          type="button"
                        >
                          {isCouponApplying ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              <span>Checking...</span>
                            </>
                          ) : (
                            <span>Apply</span>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="p-4 rounded-2xl bg-surface-container-low space-y-3 mb-6">
                    <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                      <span>Items Subtotal</span>
                      <span className="font-label-md text-label-md text-charcoal-ink font-medium">₹{itemSubtotal}</span>
                    </div>
                    <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                      <div className="flex items-center gap-1">
                        <span>Botanical Eco-Packaging &amp; GST</span>
                        <span className="material-symbols-outlined text-[14px] cursor-pointer" title="Compostable bagasse packaging and statutory culinary tax">info</span>
                      </div>
                      <span className="font-label-md text-label-md text-charcoal-ink font-medium">₹{taxFee}</span>
                    </div>
                    <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                      <span>Artisanal Dispatch Courier</span>
                      <span className="font-label-md text-label-md text-botanical-sage font-bold uppercase tracking-wide">Complimentary</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between font-body-sm text-body-sm text-primary">
                        <span className="font-medium">Promotional Concession</span>
                        <span className="font-label-md text-label-md font-bold">-₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="pt-3 flex items-center justify-between border-t border-surface-container-highest/60">
                      <div>
                        <span className="font-headline-sm text-headline-sm text-charcoal-ink font-bold block">Final Settlement</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Including all statutory levies</span>
                      </div>
                      <span className="font-display-lg-mobile text-display-lg-mobile text-charcoal-ink font-bold tracking-tight">₹{grandTotal}</span>
                    </div>
                  </div>

                  {/* Primary Checkout CTA */}
                  <button 
                    className="w-full py-4 px-6 rounded-2xl bg-primary hover:bg-primary-container text-on-primary transition-all duration-200 flex items-center justify-between shadow-md hover:shadow-lg active:scale-[0.99] group cursor-pointer disabled:opacity-60" 
                    id="placeOrderCta" 
                    onClick={onPlaceOrder}
                    disabled={isPlacingOrder}
                    type="button"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-label-md uppercase tracking-wider font-bold">
                        {isPlacingOrder ? 'Securing Allocation...' : 'Authorize & Place Order'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isPlacingOrder ? (
                        <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                      ) : (
                        <>
                          <span className="font-headline-sm text-headline-sm font-bold">₹{grandTotal}</span>
                          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-clay-terracotta shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
                  </div>
                  <div className="text-on-surface">
                    <p className="font-body-sm text-body-sm font-semibold leading-tight">Chefs are on standby</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Indiranagar Central Hearth starts preparations upon seal.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-surface-container-low border-t border-surface-container-highest py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
          <span>© 2026 Zayka Artisanal Gastronomy. All rights reserved.</span>
          <span>Sanctuary Dispatch Protocol • Bangalore</span>
        </div>
      </footer>
    </div>
  );
}

export default CheckoutDesktop;
