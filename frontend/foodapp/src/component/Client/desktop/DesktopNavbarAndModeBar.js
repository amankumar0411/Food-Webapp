import React from 'react';

function DesktopNavbarAndModeBar({
  desktopTab,
  setDesktopTab,
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  isVegOnly,
  setIsVegOnly,
  navigate,
  userNameDisplay,
  userInitials
}) {
  return (
    <div className="bg-[#FAF3E8] border-b border-sandborder">
      {/* BEGIN: Sticky MainHeader */}
      <header className="sticky top-0 z-40 bg-oat-100/95 backdrop-blur-md border-b border-sandborder transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
          {/* Brand Logo & Location */}
          <div className="flex items-center gap-8 shrink-0">
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

            {/* Location Selector Card */}
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
                  onClick={() => setDesktopTab('quick')}
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

      {/* BEGIN: Mode Switcher Bar */}
      <div className="max-w-7xl mx-auto px-6 py-4 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Segmented Dual Mode Switcher Pill */}
          <div className="inline-flex items-center gap-1.5 bg-oat-50 p-1.5 rounded-2xl border border-sandborder shadow-inner self-start md:self-auto h-12">
            {/* Button 1: FOOD DELIVERY */}
            <button 
              className={`flex items-center gap-2.5 px-5 h-full rounded-xl text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                desktopTab === 'food'
                  ? 'bg-white text-ink font-bold shadow-subtle border border-sandborder/50'
                  : 'text-ink-muted hover:text-ink font-semibold border border-transparent'
              }`}
              onClick={() => setDesktopTab('food')}
              type="button"
            >
              <span className={`w-2 h-2 rounded-full bg-crimson ${desktopTab === 'food' ? 'animate-pulse' : ''}`}></span>
              <span>FOOD DELIVERY</span>
              <span className="text-[10px] font-normal text-ink-muted normal-case border-l border-sandborder pl-2">25 mins</span>
            </button>

            {/* Button 2: QUICK ORDER */}
            <button 
              className={`flex items-center gap-2 px-5 h-full rounded-xl text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                desktopTab === 'quick'
                  ? 'bg-white text-ink font-bold shadow-subtle border border-sandborder/50'
                  : 'text-ink-muted hover:text-ink font-semibold border border-transparent'
              }`}
              onClick={() => setDesktopTab('quick')}
              type="button"
            >
              <svg 
                className={`w-4 h-4 ${desktopTab === 'quick' ? 'text-crimson' : 'text-ink-soft'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <span>QUICK ORDER</span>
              <span className="text-[9px] bg-crimson/10 text-crimson px-1.5 py-0.5 rounded font-bold">VOICE</span>
            </button>
          </div>

          {/* Right Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
            <button 
              className="px-4 py-1.5 rounded-full bg-ink text-white text-xs font-bold tracking-wide shrink-0 shadow-sm cursor-pointer hover:bg-black transition-colors"
              onClick={() => navigate('/foodlistclient')}
              type="button"
            >
              All
            </button>
            <button 
              className="px-3.5 py-1.5 rounded-full bg-white border border-sandborder hover:border-ink-soft text-ink-soft text-xs font-semibold tracking-wide shrink-0 transition-colors cursor-pointer"
              onClick={() => navigate('/foodlistclient')}
              type="button"
            >
              Fast Delivery (&lt;25 mins)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesktopNavbarAndModeBar;
