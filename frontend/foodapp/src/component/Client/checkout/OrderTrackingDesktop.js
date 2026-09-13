import React, { useState } from 'react';

function OrderTrackingDesktop({
  orderData,
  navigate
}) {
  const {
    orderId = "#ZY-883921",
    grandTotal = 775,
    resolvedAddress = "Penthouse 402, Casa Botanica, 12th Main Road, Indiranagar"
  } = orderData || {};

  const [callBtnText, setCallBtnText] = useState("Call Courier");
  const [msgBtnText, setMsgBtnText] = useState("Message");

  const handleCall = () => {
    setCallBtnText("Connecting...");
    setTimeout(() => {
      setCallBtnText("Call Courier");
      alert("Connecting safely to delivery valet Ramesh Kumar (+91 98765 43210)");
    }, 1200);
  };

  const handleMsg = () => {
    setMsgBtnText("Chat Opened");
    setTimeout(() => {
      setMsgBtnText("Message");
      alert("Opening encrypted courier dispatch channel...");
    }, 1200);
  };

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
            <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded bg-surface-container text-tertiary font-bold">Live Radar</span>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-20 bg-background min-h-screen">
        <div className="flex flex-col w-full">
          <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 py-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-1">
                  <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/')}>Sanctuary</span>
                  <span>/</span>
                  <span className="text-charcoal-ink font-bold">Telemetry Live</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-charcoal-ink font-semibold tracking-tight">Order {orderId}</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3.5 py-2 bg-surface-container rounded-full flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">cloud_download</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-charcoal-ink">Est. Arrival: 8:46 PM (22 Mins)</span>
                </div>
                <button 
                  className="px-4 py-2 bg-surface-container-high hover:bg-surface-dim transition-colors text-charcoal-ink font-label-sm text-label-sm uppercase tracking-wider rounded-full flex items-center gap-1.5 cursor-pointer" 
                  onClick={() => alert('Digital tax invoice downloaded.')}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                  <span>Invoice</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* Map Card */}
                <div className="relative bg-surface-container rounded-3xl overflow-hidden shadow-sm aspect-[4/3] w-full flex flex-col justify-between p-6">
                  <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center" 
                    style={{ 
                      backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAxB0Gt40C-1QpJX0cL17-Lk56Plj5YkZvbn-CcDmuw0jNXmJbItq1IUB7GT5WRRg6n592l69CNk4UGje0lC_a_bLbxsStsQs80KHWHb8SKD4QUEQ7uJ8Khv_zaZJ16-y7ILa6t3gr90M3szw1BX0VvMASbKpyDYwHaKRYgZRKec7lIlXg8Jbz5RRT1dD5JegNPguMoFomXoymwy8TIBM_f60rrONmvITpqzMCCI6g24AQd9H7_tRwo')" 
                    }}
                  >
                    <div className="absolute inset-0 bg-surface/75 backdrop-blur-[2px]"></div>
                  </div>
                  
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" viewBox="0 0 600 450">
                    <path className="opacity-80" d="M 120 110 C 180 130, 240 100, 290 190 C 330 260, 390 280, 480 340" stroke="#C98E57" strokeDasharray="6 8" strokeLinecap="round" strokeWidth="4"></path>
                    <path d="M 120 110 C 180 130, 230 115, 270 170" stroke="#950010" strokeLinecap="round" strokeWidth="4"></path>
                    <circle className="animate-pulse" cx="270" cy="170" fill="#950010" r="8"></circle>
                    <circle cx="270" cy="170" opacity="0.4" r="16" stroke="#950010" strokeWidth="2"></circle>
                  </svg>

                  <div className="relative z-10 flex justify-between items-start gap-4">
                    <div className="bg-surface-container-lowest/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-charcoal-ink">
                        <span className="material-symbols-outlined text-[18px]">restaurant</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm uppercase tracking-wider text-charcoal-ink font-semibold">Toscano Artisan</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant/80 text-[11px] leading-none">Indiranagar 100ft Rd</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 self-center flex items-center gap-2 bg-charcoal-ink text-surface px-3 py-1.5 rounded-full shadow-md">
                    <span className="material-symbols-outlined text-[16px] text-primary-fixed">near_me</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-[11px]">En Route Kitchen</span>
                  </div>

                  <div className="relative z-10 self-end bg-surface-container-lowest/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-3">
                    <div className="flex flex-col text-right">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-charcoal-ink font-semibold">Penthouse 402</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant/80 text-[11px] leading-none">Casa Botanica, HAL 2nd Stg</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-charcoal-ink">
                      <span className="material-symbols-outlined text-[18px]">home_pin</span>
                    </div>
                  </div>
                </div>

                {/* Ramesh Kumar Courier Card */}
                <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative">
                      <img 
                        className="w-16 h-16 rounded-2xl object-cover" 
                        alt="Ramesh Kumar" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc0gQuUM3rELbe-vyx5QdHvkClfm0gw4hQ63hO-UTGOp_PlU37EFMJaXHyOD1cNsmwvRIemDekcYURUYpqs6C_AQmP1ZG9dFjPn1MC_vqkxOzk7cM3LBluua3Vl5OK8tuMEGjnU-SU8tPcIU0KvJSmgXcaa_WDAghhz_ZHr6FYvqVhpqISXeATGkD8bAwN-RFqFnp2Yyho0vLANakD-jGuFv3MAhGFzeLBuA-qePSjDxZyB8r7rIbz" 
                      />
                      <div className="absolute -bottom-1 -right-1 bg-surface-container-lowest rounded-full p-0.5 shadow-sm">
                        <span className="material-symbols-outlined text-clay-terracotta text-[16px] block">verified</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-headline-sm text-headline-sm text-charcoal-ink font-semibold">Ramesh Kumar</h3>
                        <span className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-charcoal-ink font-label-sm text-label-sm">
                          <span className="material-symbols-outlined text-[14px] text-clay-terracotta">star</span> 4.9
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">1,240 Pristine Deliveries • Master Courier</p>
                      <div className="flex items-center gap-2 text-on-surface-variant/70 font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[14px]">bolt</span>
                        <span>Electric Cargo Pod (KA-03-EK-4819)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button 
                      className="flex-1 md:flex-none px-4 py-3 rounded-full bg-surface-container hover:bg-surface-dim transition-colors text-charcoal-ink font-label-sm text-label-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer" 
                      onClick={handleMsg}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
                      <span>{msgBtnText}</span>
                    </button>
                    <button 
                      className="flex-1 md:flex-none px-5 py-3 rounded-full bg-primary-container text-on-primary hover:bg-primary transition-colors font-label-sm text-label-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer" 
                      onClick={handleCall}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">phone</span>
                      <span>{callBtnText}</span>
                    </button>
                  </div>
                </div>

                {/* Drop-off Directive */}
                <div className="bg-surface-container-low rounded-3xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-surface-container-high flex items-center justify-center text-charcoal-ink shrink-0">
                      <span className="material-symbols-outlined text-[20px]">sensor_door</span>
                    </div>
                    <div className="space-y-1">
                      <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant/80">Drop-off Directive</span>
                      <p className="font-body-md text-body-md text-charcoal-ink font-medium">{resolvedAddress}</p>
                      <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-surface-container rounded-lg text-charcoal-ink font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[16px] text-clay-terracotta">do_not_disturb_on</span>
                        <span>Leave at sanctuary door • Do not ring chime</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Status Update Card */}
                <div className="bg-surface-container-lowest rounded-3xl p-7 shadow-sm">
                  <div className="flex items-start justify-between pb-6">
                    <div className="space-y-1">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-clay-terracotta font-semibold">Status Update</span>
                      <h2 className="font-headline-sm text-headline-sm text-charcoal-ink font-semibold leading-snug">Kitchen is preparing your handcrafted plates</h2>
                    </div>
                    <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-label-sm uppercase font-bold">Active</span>
                  </div>

                  <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container">
                    {/* Step 1 */}
                    <div className="relative flex items-start gap-4">
                      <div className="absolute -left-[30px] top-0 w-6 h-6 rounded-full bg-botanical-sage text-surface flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </div>
                      <div className="flex-1 flex items-baseline justify-between gap-2">
                        <div>
                          <h4 className="font-body-md text-body-md font-semibold text-charcoal-ink">Order Confirmed</h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">Validated by Toscano Maitre d'</p>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant/60">8:24 PM</span>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative flex items-start gap-4">
                      <div className="absolute -left-[30px] top-0 w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-md animate-pulse">
                        <span className="material-symbols-outlined text-[14px]">skillet</span>
                      </div>
                      <div className="flex-1 flex items-baseline justify-between gap-2">
                        <div>
                          <h4 className="font-body-md text-body-md font-semibold text-charcoal-ink">Artisan Preparation</h4>
                          <p className="font-body-sm text-body-sm text-primary font-medium">Chef baking 72-hour sourdough crust in wood kiln</p>
                        </div>
                        <span className="font-label-sm text-label-sm text-primary font-bold">8:28 PM</span>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative flex items-start gap-4 opacity-50">
                      <div className="absolute -left-[30px] top-0 w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                      </div>
                      <div className="flex-1 flex items-baseline justify-between gap-2">
                        <div>
                          <h4 className="font-body-md text-body-md font-semibold text-charcoal-ink">Rider Collection</h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">Thermal sealed in insulated bamboo box</p>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant/60">~ 8:36 PM</span>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="relative flex items-start gap-4 opacity-50">
                      <div className="absolute -left-[30px] top-0 w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px]">door_front</span>
                      </div>
                      <div className="flex-1 flex items-baseline justify-between gap-2">
                        <div>
                          <h4 className="font-body-md text-body-md font-semibold text-charcoal-ink">Delivered to Sanctuary</h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">Contactless release at Penthouse threshold</p>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant/60">~ 8:46 PM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Curated Selection Card */}
                <div className="bg-surface-container-lowest rounded-3xl p-7 shadow-sm flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-charcoal-ink font-semibold">Curated Selection (3 Items)</span>
                    <span className="font-label-sm text-label-sm text-clay-terracotta bg-surface-container px-2.5 py-1 rounded">Paid • UPI Transfer</span>
                  </div>

                  <div className="divide-y divide-surface-container-high/40 flex flex-col gap-3">
                    <div className="pt-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img 
                          className="w-12 h-12 rounded-xl object-cover" 
                          alt="Burrata & Fig Rustica" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhVkv3SYEFFBJutwru8KVlkvArxdkKxNonk30SbGA7gRALzNEBApuHMvs241CV-zDykX--PC0dIq20tXsfLrct5zC-r6d2OwCXzgPNksq7Y1r2GiPyiXZ07jdSB7S2IgITenw_zj5sHBb3ZZxcWyW3GZJix8ecfjh2FL92rfZ_KgDtpSN4u52G1djbIOED657ypJPECmARQWHV_Y_hq34yoMNFUhq4juwmSZgzyDz8EGJjGdqutoc9" 
                        />
                        <div>
                          <h5 className="font-body-md text-body-md font-semibold text-charcoal-ink">Burrata &amp; Fig Rustica</h5>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">1x • Extra Aged Balsamic</p>
                        </div>
                      </div>
                      <span className="font-body-md text-body-md font-medium text-charcoal-ink">₹425</span>
                    </div>

                    <div className="pt-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img 
                          className="w-12 h-12 rounded-xl object-cover" 
                          alt="Truffled Polenta Frites" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8KkOOQLxbVsiizYRjBqUwcXTVwG-SilgENAkbFdx1H8fo91zEwVBAQvqRcS8tScx93NR4xg_h5_XDZE8vNlZnXlV5pMksZcVrhY_CD3w-2_kwyFZ5v4FXwJWBx7amJQuLNMaED5CyAHjdniqN7-zb-gv7qDOAuSTW4jNDDM7M0pjcvMQeJRd1rgXVxAG_4xHQM7u5h6ED2ehbLo8KLw1FgLBT8kruNVa5Ktybea992srhkXnKOtVB" 
                        />
                        <div>
                          <h5 className="font-body-md text-body-md font-semibold text-charcoal-ink">Truffled Polenta Frites</h5>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">1x • Rosemary Sea Salt</p>
                        </div>
                      </div>
                      <span className="font-body-md text-body-md font-medium text-charcoal-ink">₹210</span>
                    </div>

                    <div className="pt-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img 
                          className="w-12 h-12 rounded-xl object-cover" 
                          alt="Blood Orange Artisanal Soda" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBH2_slwPnUYomh1Iv6v5UFNbjkRWhpVYi3Ru_E15ZGFUtpAp2i-TcFo98Vs3HBXLEkznXg7cFB8SmPbkr1vC3lz7u3cTna3McQ4gbYNqoDkEBLNZmS5_Xaf6Mc2cudqB4yKecstWWfky8dRm_nd4KaxeCWLVzY3QYIiscZgpvXa1z4MR2V7P1uvc56E4mBo7jrqvpJBiLoIWatI0uVNWYGXMP8ZXBmuoNf7GxrUP1YP36ngfCnhIoz" 
                        />
                        <div>
                          <h5 className="font-body-md text-body-md font-semibold text-charcoal-ink">Blood Orange Artisanal Soda</h5>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">1x • Chilled Glass Flagon</p>
                        </div>
                      </div>
                      <span className="font-body-md text-body-md font-medium text-charcoal-ink">₹140</span>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-surface-container-high/40">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Total Remittance</span>
                    <span className="font-headline-sm text-headline-sm text-charcoal-ink font-semibold">₹{grandTotal}</span>
                  </div>

                  <div className="pt-2">
                    <button 
                      className="w-full py-3 rounded-2xl bg-surface-container hover:bg-surface-dim transition-colors text-charcoal-ink font-label-sm text-label-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                      onClick={() => alert("Zayka Concierge is available 24/7 at +91 80 4012 9000.")}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px] text-tertiary">support_agent</span>
                      <span>Need Help? Contact Zayka Concierge</span>
                    </button>
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
          <span>Live Radar Telemetry • Bangalore</span>
        </div>
      </footer>
    </div>
  );
}

export default OrderTrackingDesktop;
