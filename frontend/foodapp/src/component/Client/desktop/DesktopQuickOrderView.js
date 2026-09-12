import React, { useState, useEffect } from 'react';

function DesktopQuickOrderView({
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  isVegOnly,
  setIsVegOnly,
  onSwitchToFood,
  navigate,
  userNameDisplay,
  userInitials
}) {
  const [orbState, setOrbState] = useState('Listening'); // 'Listening' | 'Thinking' | 'Idle'
  const [autoConfirmProgress, setAutoConfirmProgress] = useState(75);
  const [autoConfirmCanceled, setAutoConfirmCanceled] = useState(false);

  useEffect(() => {
    if (autoConfirmCanceled) return;
    const interval = setInterval(() => {
      setAutoConfirmProgress(prev => (prev > 0 ? prev - 5 : 100));
    }, 200);
    return () => clearInterval(interval);
  }, [autoConfirmCanceled]);

  // Cycle states: Listening -> Thinking -> Idle -> Listening
  const cycleOrbState = () => {
    setOrbState(prev => {
      if (prev === 'Listening') return 'Thinking';
      if (prev === 'Thinking') return 'Idle';
      return 'Listening';
    });
  };

  // Keyboard shortcut: Spacebar triggers/cycles state when not typing in inputs
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault();
        cycleOrbState();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-[#FAF3E8] text-botanical-dark font-sans antialiased selection:bg-crimson selection:text-white min-h-screen flex flex-col justify-between">
      {/* BEGIN: MainHeader */}
      <header className="sticky top-0 z-40 bg-oat-100/95 backdrop-blur-md border-b border-sandborder transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
          {/* Brand & Location */}
          <div className="flex items-center gap-8 shrink-0">
            {/* Logo: ZAYKA • */}
            <a 
              className="group flex items-center gap-1.5 shrink-0 cursor-pointer" 
              href="/"
              onClick={(e) => { e.preventDefault(); navigate('/'); }}
            >
              <span className="text-2xl font-bold tracking-tighter uppercase font-serif text-crimson group-hover:text-crimson-dark transition-colors">
                ZAYKA
              </span>
              <span className="w-2 h-2 rounded-full bg-crimson mb-1"></span>
            </a>

            {/* Location Selector */}
            <button 
              aria-label="Select delivery address" 
              className="hidden lg:flex items-center gap-2.5 text-left text-xs tracking-tight group hover:bg-oat-200/50 py-1.5 px-3.5 rounded-2xl border border-sandborder transition-all cursor-pointer"
              onClick={() => navigate('/foodlistclient')}
            >
              <svg className="w-4 h-4 text-crimson shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <div>
                <div className="font-bold flex items-center gap-1 text-ink uppercase tracking-wider text-[11px]">
                  <span>Indiranagar, Bengaluru</span>
                  <svg className="w-3.5 h-3.5 text-ink-muted group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <span className="text-ink-muted text-[11px] block truncate max-w-[180px]">12th Main, HAL 2nd Stage</span>
              </div>
            </button>
          </div>

          {/* Search Bar with Mic Icon */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <input 
                className="w-full pl-10 pr-10 py-2.5 bg-white text-sm text-ink placeholder-ink-muted rounded-full border border-sandborder focus:outline-none focus:ring-1 focus:ring-crimson focus:border-crimson shadow-sm transition-all" 
                placeholder="Search dish or restaurant..." 
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                <button 
                  aria-label="Voice Search"
                  className="p-1 text-crimson hover:opacity-75 rounded-full hover:bg-crimson/10 transition-colors cursor-pointer" 
                  title="Voice Search"
                  type="button"
                  onClick={cycleOrbState}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-5 shrink-0">
            {/* VEG Toggle Switch */}
            <label className="hidden md:flex items-center gap-2 cursor-pointer select-none bg-white border border-sandborder px-3.5 py-1.5 rounded-full hover:border-ink-faint transition">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">VEG</span>
              <div className="relative">
                <input 
                  className="sr-only peer" 
                  type="checkbox"
                  checked={isVegOnly}
                  onChange={(e) => setIsVegOnly(e.target.checked)}
                />
                <div className="w-8 h-4 bg-oat-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
              </div>
            </label>

            {/* Cart with 1 badge */}
            <a 
              aria-label="Cart" 
              className="relative p-2 rounded-full hover:bg-oat-200 text-ink transition-colors cursor-pointer" 
              href="/billing"
              onClick={(e) => { e.preventDefault(); navigate('/billing'); }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-crimson text-white text-[10px] font-bold flex items-center justify-center shadow-sm">1</span>
            </a>

            {/* User Profile Avatar with Chevron */}
            <div className="flex items-center gap-3 pl-2 border-l border-sandborder">
              <button 
                aria-label="User Account" 
                className="flex items-center gap-2 p-1 rounded-full hover:bg-oat-200 transition-colors cursor-pointer"
                onClick={() => navigate('/account')}
              >
                <div className="w-8 h-8 rounded-full bg-crimson text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-sm">
                  {userInitials}
                </div>
                <span className="text-xs font-bold text-ink hidden sm:inline">
                  {userNameDisplay ? userNameDisplay.split(' ')[0] : 'Aman'}
                </span>
                <svg className="w-3.5 h-3.5 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* BEGIN: Subheader Mode Bar */}
      <section className="max-w-7xl mx-auto px-6 pt-6 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sandborder pb-6">
          {/* Left: Segmented Toggle Pill Container matching screenshot */}
          <div className="inline-flex bg-oat-50 p-1.5 rounded-2xl border border-sandborder shadow-inner self-start md:self-auto">
            {/* Inactive FOOD DELIVERY Pill */}
            <button 
              className="flex items-center gap-2.5 px-5 py-2 rounded-xl text-ink-muted hover:text-ink font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
              onClick={onSwitchToFood}
            >
              <span className="w-2 h-2 rounded-full bg-crimson"></span>
              <span className="tracking-wider uppercase">FOOD DELIVERY</span>
              <span className="text-[10px] font-normal text-ink-muted normal-case border-l border-sandborder pl-2">25 mins</span>
            </button>

            {/* Active QUICK ORDER Pill */}
            <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white text-ink font-bold text-xs tracking-wider uppercase shadow-subtle border border-sandborder/50 transition-all cursor-pointer">
              <svg className="w-4 h-4 text-crimson" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <span className="tracking-wider uppercase">QUICK ORDER</span>
              <span className="text-[9px] bg-crimson/10 text-crimson px-1.5 py-0.5 rounded font-bold">VOICE</span>
            </button>
          </div>

          {/* Right: Filter Pills matching screenshot */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            <button 
              className="px-4 py-1.5 rounded-full bg-ink text-white text-xs font-bold tracking-wide shrink-0 shadow-sm cursor-pointer"
              onClick={() => navigate('/foodlistclient')}
            >
              All
            </button>
            <button 
              className="px-3.5 py-1.5 rounded-full bg-white border border-sandborder hover:border-ink-soft text-ink-soft text-xs font-semibold tracking-wide shrink-0 transition-colors cursor-pointer"
              onClick={() => navigate('/foodlistclient')}
            >
              Fast Delivery (&lt;25 mins)
            </button>
          </div>
        </div>
      </section>
      {/* END: Subheader Mode Bar */}

      {/* BEGIN: MainStudioContent */}
      <main className="max-w-7xl mx-auto px-6 py-6 flex-1 w-full space-y-12">
        {/* 2-Column Voice Studio & Live Order Resolution Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* LEFT COLUMN: Voice Orb & Live Transcript Studio (7 Cols) */}
          <section className="col-span-12 lg:col-span-7 bg-white rounded-3xl border border-botanical-border shadow-warm-md p-8 relative overflow-hidden flex flex-col justify-between min-h-[640px]" data-purpose="voice-interactive-orb">
            {/* Subtle matrix dot radial background */}
            <div className="absolute inset-0 bg-matrix-dots opacity-40 pointer-events-none"></div>

            {/* Voice Studio Top Bar */}
            <div className="relative z-10 flex items-center justify-between border-b border-botanical-border/60 pb-5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-crimson/10 text-crimson text-[11px] font-mono font-bold tracking-wider uppercase">
                  Live Conversational Ordering
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-botanical-muted font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Studio Ready</span>
              </div>
            </div>

            {/* Voice Prompt Header */}
            <div className="relative z-10 text-center pt-4 pb-2 space-y-2">
              <h1 className="font-serif text-3xl md:text-4xl text-botanical-dark font-semibold tracking-tight" style={{ fontFamily: 'Newsreader, "Playfair Display", serif' }}>
                Tap &amp; speak your craving
              </h1>
              <p className="font-serif italic text-botanical-muted text-base md:text-lg max-w-lg mx-auto" style={{ fontFamily: 'Newsreader, "Playfair Display", serif' }}>
                “Add one artisanal pepperoni pizza with stuffed crust and extra parmesan...”
              </p>
            </div>

            {/* Concentric Dot-Matrix Voice Orb Display */}
            <div className="relative z-10 flex flex-col items-center justify-center my-6">
              <div className="relative w-80 h-80 flex items-center justify-center">
                {/* Outer Glow Rings */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-crimson/10 via-amber-200/20 to-crimson/5 ${orbState === 'Listening' ? 'animate-pulse-ring' : ''}`}></div>

                {/* Concentric SVG Dot Matrix Radiating Pattern */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 320">
                  {/* Outer concentric circle of dots */}
                  <g fill="#d89b6c" opacity="0.45">
                    <circle cx="160" cy="20" r="3"></circle>
                    <circle cx="230" cy="38" r="3"></circle>
                    <circle cx="282" cy="90" r="3"></circle>
                    <circle cx="300" cy="160" r="3"></circle>
                    <circle cx="282" cy="230" r="3"></circle>
                    <circle cx="230" cy="282" r="3"></circle>
                    <circle cx="160" cy="300" r="3"></circle>
                    <circle cx="90" cy="282" r="3"></circle>
                    <circle cx="38" cy="230" r="3"></circle>
                    <circle cx="20" cy="160" r="3"></circle>
                    <circle cx="38" cy="90" r="3"></circle>
                    <circle cx="90" cy="38" r="3"></circle>
                  </g>
                  {/* Middle concentric dots ring */}
                  <g fill="#c20019" opacity="0.6">
                    <circle cx="160" cy="55" r="3.5"></circle>
                    <circle cx="215" cy="70" r="3.5"></circle>
                    <circle cx="255" cy="115" r="3.5"></circle>
                    <circle cx="265" cy="160" r="3.5"></circle>
                    <circle cx="255" cy="205" r="3.5"></circle>
                    <circle cx="215" cy="250" r="3.5"></circle>
                    <circle cx="160" cy="265" r="3.5"></circle>
                    <circle cx="105" cy="250" r="3.5"></circle>
                    <circle cx="65" cy="205" r="3.5"></circle>
                    <circle cx="55" cy="160" r="3.5"></circle>
                    <circle cx="65" cy="115" r="3.5"></circle>
                    <circle cx="105" cy="70" r="3.5"></circle>
                  </g>
                  {/* Inner ring dots */}
                  <g fill="#c20019" opacity="0.8">
                    <circle cx="160" cy="90" r="4"></circle>
                    <circle cx="195" cy="100" r="4"></circle>
                    <circle cx="225" cy="130" r="4"></circle>
                    <circle cx="230" cy="160" r="4"></circle>
                    <circle cx="225" cy="190" r="4"></circle>
                    <circle cx="195" cy="220" r="4"></circle>
                    <circle cx="160" cy="230" r="4"></circle>
                    <circle cx="125" cy="220" r="4"></circle>
                    <circle cx="95" cy="190" r="4"></circle>
                    <circle cx="90" cy="160" r="4"></circle>
                    <circle cx="95" cy="130" r="4"></circle>
                    <circle cx="125" cy="100" r="4"></circle>
                  </g>
                </svg>

                {/* Center Voice Mic Orb Button */}
                <button 
                  aria-label="Trigger Listening State" 
                  className={`relative group w-36 h-36 rounded-full bg-gradient-to-br from-crimson to-crimson-dark flex flex-col items-center justify-center text-white shadow-orb-glow transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-crimson/30 cursor-pointer ${orbState === 'Thinking' ? 'ring-4 ring-amber-400/50' : ''}`}
                  onClick={cycleOrbState}
                >
                  {/* Audio Wave Visualizer Bars inside center button */}
                  <div className="flex items-center gap-1.5 h-7 mb-1">
                    <span className={`w-1 bg-white rounded-full ${orbState === 'Listening' ? 'wave-bar' : 'h-2'}`}></span>
                    <span className={`w-1 bg-white rounded-full ${orbState === 'Listening' ? 'wave-bar' : 'h-3'}`}></span>
                    <span className={`w-1 bg-white rounded-full ${orbState === 'Listening' ? 'wave-bar' : 'h-4'}`}></span>
                    <span className={`w-1 bg-white rounded-full ${orbState === 'Listening' ? 'wave-bar' : 'h-3'}`}></span>
                    <span className={`w-1 bg-white rounded-full ${orbState === 'Listening' ? 'wave-bar' : 'h-2'}`}></span>
                  </div>
                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase">{orbState}</span>
                </button>
              </div>

              {/* Status Indicator Pill */}
              <div className="mt-4 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-botanical-surface border border-botanical-border text-[11px] font-mono text-botanical-dark">
                  <span className={`w-2 h-2 rounded-full ${orbState === 'Listening' ? 'bg-crimson animate-pulse' : orbState === 'Thinking' ? 'bg-amber-500 animate-ping' : 'bg-stone-400'}`}></span>
                  {orbState.toUpperCase()} • INDIRANAGAR KITCHEN
                </span>
              </div>
              <p className="text-[11px] text-botanical-muted font-mono mt-2">
                Tap or hit Spacebar to switch: <span className="text-botanical-dark font-medium">Listening · Thinking · Idle</span>
              </p>
            </div>

            {/* Live Transcript Card Container */}
            <div className="relative z-10 bg-botanical-surface rounded-2xl p-4 border border-botanical-border shadow-warm-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold uppercase tracking-wider text-botanical-dark">Live Transcript</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold">98.4% Confidence</span>
                </div>
                <button className="text-crimson hover:underline text-xs font-medium flex items-center gap-1 cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  Edit text
                </button>
              </div>
              {/* Verbatim recognized text */}
              <p className="font-serif italic text-base text-botanical-dark leading-relaxed">
                “Add one medium artisanal pepperoni pizza with stuffed crust and check for truffle cake...”
              </p>
            </div>
          </section>

          {/* RIGHT COLUMN: Real-Time Order Resolution & Predictive Cart (5 Cols) */}
          <section className="col-span-12 lg:col-span-5 space-y-6 h-full flex flex-col" data-purpose="order-resolution-and-suggestions">
            {/* CARD 1: Confirmed Added Product Card */}
            <article className="bg-white rounded-3xl border border-botanical-border shadow-warm-md space-y-5 h-full flex flex-col justify-between p-8">
              {/* Card Header status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                    </svg>
                  </div>
                  <h2 className="font-serif font-bold text-lg text-botanical-dark">Got it! Adding to order...</h2>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full font-mono text-xs font-semibold border border-emerald-200">
                  1x Added
                </span>
              </div>

              {/* Product Detailed Box */}
              <div className="flex gap-4 p-3.5 bg-botanical-surface rounded-2xl border border-botanical-border/80">
                {/* Product Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-botanical-border/40">
                  <img 
                    alt="Artisanal Pepperoni Pizza" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida/AEtjO1Ui_cOF5_kyu5jYWSYHLw0VHAGEQm019f7ZqZeJQhX9QF7PwcyobJB-LsMa7UqbXRvQ7qLgvE8vnRCeVV_bxErTPL1lL7_sAUmwze8qAMMwR79uGtOyjLELrsBqidP4n32kCmvoBDRoTNOckfcaew9_gBXu2O7p5vU6hOS0IvXjceDBq5tHYeyQqsKN67rxW_mw9ok56OwazEoqS3Lq8W8zeCVJ8EdNzofatZQnldM1zMBV7RcdDZQwPa4" 
                  />
                  <div className="absolute top-1.5 left-1.5 w-4 h-4 bg-white/90 rounded flex items-center justify-center p-0.5 shadow-sm">
                    {/* Non-veg red square mark */}
                    <span className="w-2.5 h-2.5 rounded-full bg-crimson block"></span>
                  </div>
                </div>

                {/* Product Information */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm text-botanical-dark truncate">Artisanal Pepperoni Pizza</h3>
                    <p className="text-xs text-botanical-muted truncate">Crust &amp; Co. Pizzeria • 11.5 inch medium</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-botanical-muted">
                      <svg className="w-3 h-3 text-crimson" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                      <span className="text-botanical-dark font-medium">Customizing: Stuffed Crust Cheese Burst</span>
                    </div>
                  </div>
                  {/* Pricing line */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-mono font-bold text-crimson text-base">₹399</span>
                    <span className="font-mono text-xs text-botanical-muted line-through">₹499</span>
                    <span className="text-[10px] font-mono bg-crimson/10 text-crimson px-1.5 py-0.5 rounded font-bold">20% OFF</span>
                  </div>
                </div>
              </div>

              {/* Progress Countdown Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-botanical-muted flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-botanical-muted animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    {autoConfirmCanceled ? 'Auto-confirm paused' : 'Auto-confirming in 2s...'}
                  </span>
                  <button 
                    className="text-crimson font-bold hover:underline cursor-pointer"
                    onClick={() => setAutoConfirmCanceled(!autoConfirmCanceled)}
                  >
                    {autoConfirmCanceled ? 'Resume' : 'Cancel'}
                  </button>
                </div>
                {/* Progress Line */}
                <div className="w-full bg-botanical-border h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-crimson h-full rounded-full transition-all duration-1000" 
                    style={{ width: autoConfirmCanceled ? '0%' : `${autoConfirmProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Interactive Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  className="w-full py-2.5 rounded-xl border border-botanical-border text-botanical-dark text-xs font-bold hover:bg-botanical-surface transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  onClick={() => setOrbState('Listening')}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  Keep Talking
                </button>
                <button 
                  className="w-full py-2.5 rounded-xl bg-crimson hover:bg-crimson-dark text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-warm-sm cursor-pointer"
                  onClick={() => navigate('/billing')}
                >
                  Checkout Now →
                </button>
              </div>
            </article>
          </section>
        </div>
      </main>
      {/* END: MainStudioContent */}

      {/* BEGIN: MainEditorialFooter */}
      <footer className="bg-botanical-surface border-t border-botanical-border mt-16 pt-12 pb-8 text-botanical-muted text-xs">
        <div className="max-w-7xl mx-auto px-6">
          {/* 4 Columns Editorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-botanical-border">
            {/* Column 1: Brand Lore */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-crimson" style={{ fontFamily: 'Newsreader, "Playfair Display", serif' }}>
                  ZAYKA
                </span>
                <span className="w-2 h-2 rounded-full bg-crimson inline-block mb-1"></span>
              </div>
              <p className="text-botanical-muted leading-relaxed">
                Botanical editorial dining delivered fresh. We curate premier local kitchens, fine roasters, and artisanal patisseries straight to your doorstep across Bengaluru.
              </p>
            </div>
            {/* Column 2: Company */}
            <div className="space-y-2">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-botanical-dark">Company</h3>
              <ul className="space-y-1.5 text-botanical-muted">
                <li><a className="hover:text-crimson transition-colors" href="#about" onClick={(e) => e.preventDefault()}>About Us</a></li>
                <li><a className="hover:text-crimson transition-colors" href="#corporate" onClick={(e) => e.preventDefault()}>Zayka Corporate</a></li>
                <li><a className="hover:text-crimson transition-colors" href="#careers" onClick={(e) => e.preventDefault()}>Careers &amp; Kitchens</a></li>
                <li><a className="hover:text-crimson transition-colors" href="#press" onClick={(e) => e.preventDefault()}>Press &amp; Media</a></li>
              </ul>
            </div>
            {/* Column 3: Available Cities */}
            <div className="space-y-2">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-botanical-dark">Available Cities</h3>
              <ul className="space-y-1.5 text-botanical-muted">
                <li><a className="hover:text-crimson transition-colors" href="#bengaluru" onClick={(e) => e.preventDefault()}>Bengaluru Central</a></li>
                <li><a className="hover:text-crimson transition-colors" href="#mumbai" onClick={(e) => e.preventDefault()}>Mumbai Bandra</a></li>
                <li><a className="hover:text-crimson transition-colors" href="#delhi" onClick={(e) => e.preventDefault()}>Delhi NCR</a></li>
                <li><a className="hover:text-crimson transition-colors" href="#hyderabad" onClick={(e) => e.preventDefault()}>Hyderabad Jubilee</a></li>
              </ul>
            </div>
            {/* Column 4: Newsletter & Contact */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-botanical-dark">The Epicurean Letter</h3>
              <p className="text-botanical-muted leading-relaxed">Receive weekly restaurant spotlights and secret chef codes.</p>
              <div className="flex gap-2">
                <input className="w-full bg-white border border-botanical-border rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-crimson focus:border-crimson placeholder:text-botanical-muted/60" placeholder="Your email" type="email" />
                <button className="px-4 py-2 bg-botanical-dark hover:bg-black text-white rounded-xl font-bold font-display text-xs transition-colors cursor-pointer">
                  Join
                </button>
              </div>
            </div>
          </div>
          {/* Bottom Bar */}
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-mono">
            <div>
              © 2025 Zayka Food Technologies Pvt. Ltd. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      {/* END: MainEditorialFooter */}
    </div>
  );
}

export default DesktopQuickOrderView;
