import React, { useState, useEffect, useRef } from 'react';

function OrderTrackingMobile({
  orderData,
  navigate
}) {
  const {
    orderId = "#ZY-883921",
    resolvedAddress = "Penthouse 402, Casa Bella Residences, 12th Main Road, HAL 2nd Stage, Indiranagar"
  } = orderData || {};

  const [callBtnText, setCallBtnText] = useState("Call Rider");
  const [msgBtnText, setMsgBtnText] = useState("Message");
  const [isRecentering, setIsRecentering] = useState(false);

  // Floating animation for live rider pin
  const [pinOffset, setPinOffset] = useState({ x: 0, y: 0 });
  const animRef = useRef(null);

  useEffect(() => {
    let angle = 0;
    const animate = () => {
      angle += 0.04;
      const x = Math.sin(angle) * 6;
      const y = Math.cos(angle * 0.8) * 3.5;
      setPinOffset({ x, y });
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleCall = () => {
    setCallBtnText("Connecting...");
    setTimeout(() => {
      setCallBtnText("Call Rider");
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

  const handleRecenter = () => {
    setIsRecentering(true);
    setTimeout(() => setIsRecentering(false), 400);
  };

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
            <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight leading-none">Live Order Tracking</h1>
            <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider mt-0.5">{orderId}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col relative w-full pt-16 pb-safe bg-surface min-h-screen">
        <div className="flex flex-col w-full px-gutter-sm space-y-4 pb-12 mt-2">
          {/* Section 1: Stylized Delivery Route Map */}
          <div className="relative w-full h-60 rounded-3xl overflow-hidden shadow-sm bg-surface-container">
            <div 
              className="w-full h-full bg-cover bg-center" 
              style={{ 
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAxB0Gt40C-1QpJX0cL17-Lk56Plj5YkZvbn-CcDmuw0jNXmJbItq1IUB7GT5WRRg6n592l69CNk4UGje0lC_a_bLbxsStsQs80KHWHb8SKD4QUEQ7uJ8Khv_zaZJ16-y7ILa6t3gr90M3szw1BX0VvMASbKpyDYwHaKRYgZRKec7lIlXg8Jbz5RRT1dD5JegNPguMoFomXoymwy8TIBM_f60rrONmvITpqzMCCI6g24AQd9H7_tRwo')" 
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-ink/40 via-transparent to-transparent pointer-events-none"></div>
            
            {/* Interactive Route Canvas Visual Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" viewBox="0 0 360 240">
              <path d="M 60 170 C 120 170, 140 100, 210 110 S 270 50, 305 60" opacity="0.9" stroke="#FAF3E8" strokeLinecap="round" strokeWidth="6"></path>
              <path className="animate-pulse" d="M 60 170 C 120 170, 140 100, 210 110 S 270 50, 305 60" stroke="#C20019" strokeDasharray="4 4" strokeLinecap="round" strokeWidth="3"></path>
              <g transform="translate(60, 170)">
                <circle className="shadow-sm" fill="#FAF3E8" r="12"></circle>
                <circle fill="#191816" r="6"></circle>
              </g>
              <g transform="translate(305, 60)">
                <circle className="shadow-sm" fill="#FAF3E8" r="12"></circle>
                <circle fill="#C20019" r="6"></circle>
              </g>
            </svg>

            {/* Moving Vehicle Marker */}
            <div 
              className="absolute transition-transform duration-75 ease-out flex flex-col items-center pointer-events-none"
              style={{
                top: '104px',
                left: '180px',
                transform: `translate(calc(-50% + ${pinOffset.x}px), calc(-50% + ${pinOffset.y}px))`
              }}
            >
              <div className="px-2 py-0.5 bg-charcoal-ink text-surface font-label-sm text-label-sm rounded-full shadow-md flex items-center space-x-1 mb-1 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-ping"></span>
                <span>Rider on way</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
              </div>
            </div>

            {/* Map Floating Controls */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center space-x-2 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-primary">near_me</span>
                <span className="font-label-sm text-label-sm text-on-surface">1.8 km away • 100ft Rd</span>
              </div>
              <button 
                aria-label="Center Map" 
                className={`w-8 h-8 bg-surface-container-lowest/90 backdrop-blur-md text-charcoal-ink rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform cursor-pointer ${
                  isRecentering ? 'rotate-45' : ''
                }`}
                onClick={handleRecenter}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">my_location</span>
              </button>
            </div>
          </div>

          {/* Section 2: ETA Countdown Banner Card */}
          <div className="w-full bg-surface-container-lowest rounded-3xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase block font-semibold">Estimated Arrival</span>
                <div className="flex items-baseline space-x-2">
                  <h2 className="font-display-lg-mobile text-display-lg-mobile text-charcoal-ink leading-tight">22</h2>
                  <span className="font-headline-sm text-headline-sm text-charcoal-ink">mins</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium tracking-normal">(08:42 PM)</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                <span className="material-symbols-outlined text-[26px]">skillet</span>
              </div>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="mt-4 pt-1">
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '48%' }}></div>
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                  <p className="font-body-sm text-body-sm text-on-surface font-semibold">Kitchen Preparing Your Order</p>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Step 2 of 4</span>
              </div>
            </div>
          </div>

          {/* Section 3: Editorial Step-by-Step Progress Timeline */}
          <div className="w-full bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-charcoal-ink mb-4">Milestones</h3>
            <div className="space-y-0 relative">
              {/* Step 1: Completed */}
              <div className="flex items-start group">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed shadow-sm z-10">
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </div>
                  <div className="w-0.5 h-10 bg-tertiary-fixed my-0.5"></div>
                </div>
                <div className="pt-1 flex-1 flex justify-between items-baseline">
                  <div>
                    <p className="font-body-md text-body-md text-charcoal-ink font-semibold">Order Confirmed</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Payment authenticated via UPI</p>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">08:18 PM</span>
                </div>
              </div>

              {/* Step 2: Active / Kitchen Preparing */}
              <div className="flex items-start group">
                <div className="flex flex-col items-center mr-4">
                  <div className="relative w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm z-10">
                    <span className="w-2.5 h-2.5 rounded-full bg-surface-container-lowest"></span>
                    <span className="animate-ping absolute inset-0 rounded-full bg-primary opacity-30"></span>
                  </div>
                  <div className="w-0.5 h-10 bg-surface-container-highest my-0.5"></div>
                </div>
                <div className="pt-1 flex-1 flex justify-between items-baseline">
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-body-md text-body-md text-primary font-bold">Kitchen Preparing</p>
                      <span className="px-1.5 py-0.2 bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[10px] rounded uppercase font-semibold">Now</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Flame roasting artisanal flatbreads</p>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary font-semibold">In Progress</span>
                </div>
              </div>

              {/* Step 3: Pending Rider Picked Up */}
              <div className="flex items-start group">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant z-10">
                    <span className="material-symbols-outlined text-[16px]">sports_motorsports</span>
                  </div>
                  <div className="w-0.5 h-10 bg-surface-container-highest my-0.5"></div>
                </div>
                <div className="pt-1 flex-1 flex justify-between items-baseline opacity-60">
                  <div>
                    <p className="font-body-md text-body-md text-charcoal-ink font-medium">Rider Picked Up</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Thermal insulated bag dispatched</p>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Est. 08:31</span>
                </div>
              </div>

              {/* Step 4: Pending Delivered */}
              <div className="flex items-start group">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant z-10">
                    <span className="material-symbols-outlined text-[16px]">home_pin</span>
                  </div>
                </div>
                <div className="pt-1 flex-1 flex justify-between items-baseline opacity-60">
                  <div>
                    <p className="font-body-md text-body-md text-charcoal-ink font-medium">Delivered to Sanctuary</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Handover at doorstep</p>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Est. 08:42</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Delivery Partner Card */}
          <div className="w-full bg-surface-container-lowest rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-surface-container">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Ramesh Kumar" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7ytosoi0uDkk1T1cCtNDGOwDCHdxOem49Ier_CBhB-OQYwYKMfMw0WAPC3NETe5bp8ofsgH--kT_ikW4ZuSZmCkh-Ontuhmv6-kYzev6m0ZdG_9N9oi52mAI1bK8aL8zxjFJt1Ea2hpD7bALIKmIPShuEImOb-bOtUFVHsWYnyM_bAhbKoafTMoW0vnhqrmBcbr79hj-aEopGcXexGWs30oRFXnUiC3pX4l000O0VfcOJFxv_LYCB" 
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-botanical-sage text-surface-container-lowest flex items-center justify-center text-[11px] shadow-sm">
                  <span className="material-symbols-outlined text-[13px]">eco</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h4 className="font-headline-sm text-headline-sm text-charcoal-ink truncate">Ramesh Kumar</h4>
                  <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <div className="flex items-center space-x-2 mt-0.5 text-on-surface-variant">
                  <div className="flex items-center text-raw-ochre">
                    <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-label-md text-label-md font-semibold text-charcoal-ink ml-1">4.9</span>
                  </div>
                  <span className="text-surface-dim">•</span>
                  <span className="font-body-sm text-body-sm truncate">Electric Bike</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button 
                className="h-11 rounded-2xl bg-surface-container-high hover:bg-surface-container active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-charcoal-ink cursor-pointer"
                onClick={handleCall}
                type="button"
              >
                <span className="material-symbols-outlined text-[19px] text-secondary">call</span>
                <span className="font-label-md text-label-md uppercase font-semibold">{callBtnText}</span>
              </button>
              <button 
                className="h-11 rounded-2xl bg-charcoal-ink hover:bg-primary active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-surface-container-lowest cursor-pointer"
                onClick={handleMsg}
                type="button"
              >
                <span className="material-symbols-outlined text-[19px]">chat</span>
                <span className="font-label-md text-label-md uppercase font-semibold">{msgBtnText}</span>
              </button>
            </div>
          </div>

          {/* Section 5: Delivery Address Card */}
          <div className="w-full bg-surface-container-lowest rounded-3xl p-5 shadow-sm space-y-3.5">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-charcoal-ink flex-shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[20px]">apartment</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-surface-container-high font-label-sm text-[10px] uppercase font-bold text-charcoal-ink tracking-wider">Home</span>
                  <h4 className="font-body-md text-body-md font-semibold text-charcoal-ink truncate">Penthouse 402, Indiranagar</h4>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{resolvedAddress}</p>
              </div>
            </div>
            {/* Special instructions pill banner */}
            <div className="bg-surface-container-low p-3 rounded-2xl flex items-center space-x-2.5">
              <span className="material-symbols-outlined text-[18px] text-clay-terracotta flex-shrink-0">doorbell</span>
              <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
                Instruction: <span className="text-charcoal-ink font-semibold">Leave at door • Don't ring bell</span>
              </p>
            </div>
          </div>

          {/* Return button */}
          <div className="pt-2">
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 rounded-2xl bg-surface-container hover:bg-surface-container-high text-charcoal-ink font-label-sm uppercase tracking-wider font-semibold transition-colors cursor-pointer flex items-center justify-center space-x-2"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              <span>Back to Sanctuary Home</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderTrackingMobile;
