import React from 'react';

function DesktopFoodContent({
  favorites,
  toggleFavorite,
  navigate
}) {
  return (
    <div className="flex-grow flex flex-col justify-between">
      {/* BEGIN: MainContent */}
      <main className="max-w-7xl mx-auto px-6 py-6 w-full space-y-10">
        {/* BEGIN: HeroShowcase */}
        <section className="relative overflow-hidden rounded-3xl bg-ink text-oat-50 border border-sandborder/30 shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            {/* Editorial Copy & Offer Box */}
            <div className="md:col-span-7 p-8 md:p-12 z-10 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson text-white text-[10px] font-bold uppercase tracking-widest">
                <span>Botanical Kitchen Specials</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                Feast on your cravings,<br />
                <span className="italic font-normal text-oat-200">handcrafted daily.</span>
              </h1>
              <p className="text-sm text-oat-300 max-w-md font-light leading-relaxed">
                Experience restaurant dining delivered to your table. Woodfired artisan sourdough pizzas, slow-cooked royal biryanis, and decadent desserts.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button 
                  className="px-6 py-3 bg-crimson hover:bg-crimson-dark text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-transform hover:-translate-y-0.5 shadow-md cursor-pointer"
                  onClick={() => navigate('/foodlistclient')}
                >
                  Order Now →
                </button>
                <div className="flex items-center gap-2 border border-dashed border-oat-400/50 bg-white/5 px-3 py-2 rounded-xl text-xs text-oat-200">
                  <span className="text-ink-faint font-mono text-[11px]">USE CODE:</span>
                  <span className="font-bold tracking-wider text-white">ZAYKA60</span>
                </div>
              </div>
            </div>
            {/* Hero Featured Imagery Banner */}
            <div className="md:col-span-5 h-64 md:h-full relative min-h-[300px]">
              <img 
                alt="Artisanal hot pizza with melting mozzarella" 
                className="absolute inset-0 w-full h-full object-cover object-center" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgyNIWbuwY9G_yJDZqnLgz1Q1JmnuNwO4JRxd-jIR9pre0IMmgeQTk7LzfA0hJx3BkWBeM4-5J4rAzYacsTnI1l2WFbSKR0ItLMKAstkV27K5iIzrCc9nd9WKrWr0DClbBMtsk5M2T9Gfj8MMSr9Cr1UuEGmA7vgZCO4Ns6EQ-zeEkzITOoufe155SmhmfaLJur36mzHxuFB2SyTpz4-KT1JhG1y7dtxKijaMhe6ON-nOgQ8nfO5wd" 
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-ink via-transparent to-transparent"></div>
            </div>
          </div>
        </section>
        {/* END: HeroShowcase */}

        {/* BEGIN: CuisineCategories */}
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink font-serif">What’s on your mind?</h2>
              <p className="text-xs text-ink-muted uppercase tracking-wider mt-1">Handcrafted picks from your favorite cuisines</p>
            </div>
            <div className="flex items-center gap-2">
              <button aria-label="Previous categories" className="w-8 h-8 rounded-full border border-sandborder bg-white flex items-center justify-center text-ink-muted hover:text-ink hover:border-ink transition cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </button>
              <button aria-label="Next categories" className="w-8 h-8 rounded-full border border-sandborder bg-white flex items-center justify-center text-ink-muted hover:text-ink hover:border-ink transition cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </button>
            </div>
          </div>
          {/* Cuisine Round Elements Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 sm:gap-6 text-center">
            {/* Pizzas */}
            <a className="group flex flex-col items-center space-y-2 cursor-pointer" href="/foodlistclient?category=Pizzas" onClick={(e) => { e.preventDefault(); navigate('/foodlistclient?category=Pizzas'); }}>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-crimson group-hover:scale-105 transition-all shadow-subtle bg-white">
                <img alt="Pizzas" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBB-KiIQVIVWDwSUO98G728FZY5yUj1zc5A2bByDJLaWIdiD_sGLZpKThOLZbNJ84NAjQ0V6VZQ5H9AvBitSL9_B4QRrZTO-CsURTQ-De3lJhBW8CxVsPKLF-HsyfemQ073Z2ERXx4digo-7n7TeLFbcqlplb6Jq-jhP-VXitNSpq52B68djc2CBwP-y8gF5H71gLkyMTf2TZ-WKZ2Xfzn-gaFDMuMuEluuxkloimSAFxxfBhpYWkV2" />
              </div>
              <span className="text-xs font-semibold text-ink group-hover:text-crimson transition-colors">Pizzas</span>
            </a>
            {/* Biryani */}
            <a className="group flex flex-col items-center space-y-2 cursor-pointer" href="/foodlistclient?category=Biryani" onClick={(e) => { e.preventDefault(); navigate('/foodlistclient?category=Biryani'); }}>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-crimson group-hover:scale-105 transition-all shadow-subtle bg-white">
                <img alt="Biryani" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcFugny5y-BAB93-dEbgIcN9TVt0aJFwaGfX5rNMvIrFjaQIxwF4_Jp-EWY8elrHhJ3iHiGlTZDrwFwl9WwNTFGT-riLGbwEgp1pL0J1h1h93ygdGoYgP_3nu_aSwXp0NuE6YkDZuHqQ8zqg82YcADOBTAOMZE6JUL58vWyTyERB8KSqGtlmZSsHsF9Agm5mXsvDB-n1fqBm1_kfRQwe6vtZ86iERfEy2yaQhQMJ-zFQ4RixB4HKB5" />
              </div>
              <span className="text-xs font-semibold text-ink group-hover:text-crimson transition-colors">Biryani</span>
            </a>
            {/* Burgers */}
            <a className="group flex flex-col items-center space-y-2 cursor-pointer" href="/foodlistclient?category=Burgers" onClick={(e) => { e.preventDefault(); navigate('/foodlistclient?category=Burgers'); }}>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-transparent group-hover:border-crimson group-hover:scale-105 transition-all shadow-subtle bg-white overflow-hidden">
                <img alt="Burgers" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnTvAs90fjgBXkAyDu4rwlkbjGlSalr6guUk9sdFS17qibfPd-kKv2UYiDdIfdyakx9G6c4VpHGf5oKWWzmC1ZnzRfSKYanCLIfDJa_uKnZXZL7dzkAFr3KzOEIl_ZAtZYTL9fchggAcvbV_qAzIp6RsfjdODiqpLM0gwSUscKEOcUVaWl-FH22ZevDbNZIzKY7sgPifAsnDJDX-2uelpZLgUn7g7aIThHX1eA9OJyPRbJB9oilAiv" />
              </div>
              <span className="text-xs font-semibold text-ink group-hover:text-crimson transition-colors">Burgers</span>
            </a>
            {/* Cakes & Pastries */}
            <a className="group flex flex-col items-center space-y-2 cursor-pointer" href="/foodlistclient?category=Cakes" onClick={(e) => { e.preventDefault(); navigate('/foodlistclient?category=Cakes'); }}>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-transparent group-hover:border-crimson group-hover:scale-105 transition-all shadow-subtle bg-white overflow-hidden">
                <img alt="Cakes and Desserts" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWK15IdkufWwyj_ciHSz4M7fhVTUdh5atsvEMt65ALnWD0AfxoWamtqUeftWYnuJkmVRK-o2w5ZTsBkzoQCwHSB8ShN9bTdktZEB5brmEtecnEgH8dWVmfyrSA9uoXHTZ-J3YkSFyyKxq-kKYubqdMkrbra2hnP1gbL3wj2WfkV2f_b8cmUSB_LXtLxC4mg2y4bALKd4VfDR9zobwikjN1CEAK2tgrCsBElcluLybsRXtxpb6lq73D" />
              </div>
              <span className="text-xs font-semibold text-ink group-hover:text-crimson transition-colors">Cakes</span>
            </a>
            {/* Rolls & Wraps */}
            <a className="group flex flex-col items-center space-y-2 cursor-pointer" href="/foodlistclient?category=Rolls" onClick={(e) => { e.preventDefault(); navigate('/foodlistclient?category=Rolls'); }}>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-transparent group-hover:border-crimson group-hover:scale-105 transition-all shadow-subtle bg-white overflow-hidden">
                <img alt="Rolls and Wraps" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADSFB1Fx2cl2ErMxv3L3-2lee1oUbw683amEMC1-N5zlVU3H_sztmKtrtHBs2vK4f9eStKJBinSlocuH_npNTUxIjluN8taTJoCQDpnpZnPdTgg0uoRKS57Zx4hBLnkK6SFQH_Bjh_cUPw7SvIpvefgtYEE4C3cFqHj2527t8rBnA79mQTznvwi9oI_uL_8qZkLIHi2FP1Co4IdbSJkR9X-wdwbvUpLrQ4HZv5dNq7EGSbeHzX8xxL" />
              </div>
              <span className="text-xs font-semibold text-ink group-hover:text-crimson transition-colors">Rolls</span>
            </a>
            {/* Pastas */}
            <a className="group flex flex-col items-center space-y-2 cursor-pointer" href="/foodlistclient?category=Pastas" onClick={(e) => { e.preventDefault(); navigate('/foodlistclient?category=Pastas'); }}>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-transparent group-hover:border-crimson group-hover:scale-105 transition-all shadow-subtle bg-white overflow-hidden">
                <img alt="Pastas" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAPBNcoCG6gPAse0zns0lu4i5AZrMFn3l1qC2m2kvsXgrt2z73kWkDUQ-hjiqxD6QlBWoQQGS6h87WB5G___gXGMj2Pn4fB8UFh62KRpIha-kdLDC78M9mu127SQXDfE8DW_bXUIwEWxUPV0oHuW943UTQ07WWD0WXgLP1Hz8P_EkAKLn3S5erX0X-po0rpRP_ndE-seUts5t4-YTFRXZa2sVkFKspEh9VNLs3i7EOGn2MYvjMfIWI" />
              </div>
              <span className="text-xs font-semibold text-ink group-hover:text-crimson transition-colors">Pastas</span>
            </a>
            {/* Gelato & Ice Creams */}
            <a className="group flex flex-col items-center space-y-2 cursor-pointer" href="/foodlistclient?category=Gelato" onClick={(e) => { e.preventDefault(); navigate('/foodlistclient?category=Gelato'); }}>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-transparent group-hover:border-crimson group-hover:scale-105 transition-all shadow-subtle bg-white overflow-hidden">
                <img alt="Gelato and desserts" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ4rE7W4ptwQLHJ0EoSQ8vLZNxysY47nCzqYzrGDLeG6b0c0Pkvy3OcJTuIwfzwFaVsZP7DOJmR8jG6NLXuUa7JFLNfHcWe72BCW2GmTOjx9Un4VG49ryTxmlQsbU7SbhnBeShrMKw5JkocvXGAs7NIbv20Rg4aGfmByds7q7X4Les398QBagHMy-b3ujYvuQ4RC3N9pYKi97sk_qOJApRh2DmC5oF7I5_wz-rEPPRWJxRaOONETDi" />
              </div>
              <span className="text-xs font-semibold text-ink group-hover:text-crimson transition-colors">Gelato</span>
            </a>
            {/* Grain & Salad Bowls */}
            <a className="group flex flex-col items-center space-y-2 cursor-pointer" href="/foodlistclient?category=Bowls" onClick={(e) => { e.preventDefault(); navigate('/foodlistclient?category=Bowls'); }}>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-transparent group-hover:border-crimson group-hover:scale-105 transition-all shadow-subtle bg-white overflow-hidden">
                <img alt="Healthy Bowls" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfLbQu8uPbsDN7HRpyrHZ_MMtK5iAnGo1QOEJ6i23ZH9I9P1tM9gY4SdUp7kuLOGF_bTXkFSjGpBKmT6g4zUqFAc6DGzWEO2c9HwRT1lU-pwXUpZcmmK3hspERTRFt8cXck7RwAsmjYtSyVYNZTwTIoDoJSxyX6OXkxiJDZMXY42ixmaMsaD6vsmwdPSyDmvu37qVc2wOtXeuJBsOt_yUnR-9m5njTcci9EHQT7Z4LzGhq0Z1ksqO6" />
              </div>
              <span className="text-xs font-semibold text-ink group-hover:text-crimson transition-colors">Bowls</span>
            </a>
          </div>
        </section>
        {/* END: CuisineCategories */}

        {/* BEGIN: TopRatedRestaurants */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink font-serif">Top rated near you</h2>
              <p className="text-xs text-ink-muted uppercase tracking-wider mt-1">Curated dining partners around Indiranagar</p>
            </div>
            <a className="text-xs font-bold uppercase tracking-wider text-crimson hover:text-crimson-dark flex items-center gap-1 cursor-pointer" href="/foodlistclient" onClick={(e) => { e.preventDefault(); navigate('/foodlistclient'); }}>
              See all restaurants →
            </a>
          </div>
          {/* Restaurant Cards Grid: 4 Columns on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Toscano Artisan Pizzeria */}
            <article className="group bg-white rounded-2xl border border-sandborder overflow-hidden hover:shadow-card transition-all duration-300 flex flex-col">
              <div className="relative h-48 w-full overflow-hidden bg-oat-200">
                <img alt="Toscano Artisan Pizzeria wood-fired pizza" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuwD-4csL15oSZLbYVafbr4_eqD3x9qr6gioUfG5xoOsYyvixS0vwmF06FrG-EJyf2zslZPOZzcZwF2waME8glfGUJtZRQMEEp57G-yH1FvrgoCdkBNT9QK8An2P46A4HFGtyBymWiDapI3vdm-taiTgjDkg42JHujfpgDYvdhz663xWzojkPX_Zvr4vdJTW8eoXGqH9K45Hn6Qo181BEJVvrHAOmkLIB2H-lPylus5Jy1ItBicpmS" />
                <button 
                  aria-label="Add to wishlist" 
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center ${favorites['toscano'] ? 'text-crimson' : 'text-ink-muted'} hover:text-crimson shadow-sm transition-colors cursor-pointer`}
                  onClick={() => toggleFavorite('toscano')}
                >
                  <svg className="w-4 h-4" fill={favorites['toscano'] ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </button>
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-crimson/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" fillRule="evenodd"></path></svg>
                  <span>70% OFF UPTO ₹120</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-ink group-hover:text-crimson transition-colors line-clamp-1">Toscano Artisan Pizzeria</h3>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-800 text-white text-[11px] font-bold">4.6 ★</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-ink-muted mt-1">
                    <span className="flex items-center gap-1 text-ink font-medium">
                      <svg className="w-3.5 h-3.5 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                      25–30 mins
                    </span>
                    <span>•</span>
                    <span className="truncate">Pizzas, Italian, Desserts</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-sandborder flex items-center justify-between text-[11px]">
                  <span className="text-ink-soft bg-oat-100 px-2 py-0.5 rounded font-medium">Free delivery with Bolt</span>
                  <span className="text-ink-muted font-bold tracking-wider uppercase text-[9px]">1.2K+ Ratings</span>
                </div>
              </div>
            </article>

            {/* Card 2: Meghana Foods */}
            <article className="group bg-white rounded-2xl border border-sandborder overflow-hidden hover:shadow-card transition-all duration-300 flex flex-col">
              <div className="relative h-48 w-full overflow-hidden bg-oat-200">
                <img alt="Meghana Foods authentic Hyderabadi Dum Biryani" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_fZTjLWEVipIyFY271VoDyURcERuT7j7v5MjcG4TlevSwIu3aRNEnjpOPQE4RUsxLfx3ArF4vuRbKv2-wZceVazVYWWsNjsryP-T4B2ude-T_s_ujxgY5ozov5ff9Irv2ktYa0olHQK0huVhboazkJfSeWKT0S8P2Wzc3RN-OZaZTxePvl8ykn3oK_wRsQTnw2No7r5br-Dda9yQEOdcDJ2TeqjsudclpGst4Uj8la3gsb7-wf2al" />
                <button 
                  aria-label="Add to wishlist" 
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center ${favorites['meghana'] ? 'text-crimson' : 'text-ink-muted'} hover:text-crimson shadow-sm transition-colors cursor-pointer`}
                  onClick={() => toggleFavorite('meghana')}
                >
                  <svg className="w-4 h-4" fill={favorites['meghana'] ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </button>
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-crimson/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" fillRule="evenodd"></path></svg>
                  <span>FLAT 50% OFF</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-ink group-hover:text-crimson transition-colors line-clamp-1">Meghana Foods</h3>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-800 text-white text-[11px] font-bold">4.8 ★</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-ink-muted mt-1">
                    <span className="flex items-center gap-1 text-ink font-medium">
                      <svg className="w-3.5 h-3.5 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                      20–25 mins
                    </span>
                    <span>•</span>
                    <span className="truncate">Biryani, Andhra Special</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-sandborder flex items-center justify-between text-[11px]">
                  <span className="text-ink-soft bg-oat-100 px-2 py-0.5 rounded font-medium">Iconic Local Favorite</span>
                  <span className="text-ink-muted font-bold tracking-wider uppercase text-[9px]">₹650 for two</span>
                </div>
              </div>
            </article>

            {/* Card 3: Truffles Burgers */}
            <article className="group bg-white rounded-2xl border border-sandborder overflow-hidden hover:shadow-card transition-all duration-300 flex flex-col">
              <div className="relative h-48 w-full overflow-hidden bg-oat-200">
                <img alt="Truffles Gourmet burger and fries" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVeGUNJM5HMi_F-WjJZWe4qMc3RQaygn6LlRt-uZF3Nosbf-eEXiMfbnN34gNnQ3hTje549mGzFq_gV5ROjxzaLYjWaPxqMTc28o1kN1zC6_3Xn6nwXk-AsYFObH98axi1147DDYcSNLU0ABNzYL8BQ3MYP9HsuFnuEfSr3VY7kT1AZf2OofHohXnHXoO-o8m6zraChngVaTX2vYj7nHbsG6LQvhvWgJPTXOZsppsd3jZkLix7MuEY" />
                <button 
                  aria-label="Add to wishlist" 
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center ${favorites['truffles'] ? 'text-crimson' : 'text-ink-muted'} hover:text-crimson shadow-sm transition-colors cursor-pointer`}
                  onClick={() => toggleFavorite('truffles')}
                >
                  <svg className="w-4 h-4" fill={favorites['truffles'] ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </button>
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-crimson/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" fillRule="evenodd"></path></svg>
                  <span>50% OFF UPTO ₹100</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-ink group-hover:text-crimson transition-colors line-clamp-1">Truffles Cafe &amp; Burgers</h3>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-800 text-white text-[11px] font-bold">4.7 ★</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-ink-muted mt-1">
                    <span className="flex items-center gap-1 text-ink font-medium">
                      <svg className="w-3.5 h-3.5 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                      25–30 mins
                    </span>
                    <span>•</span>
                    <span className="truncate">Burgers, American, Shakes</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-sandborder flex items-center justify-between text-[11px]">
                  <span className="text-ink-soft bg-oat-100 px-2 py-0.5 rounded font-medium">Trending Gourmet</span>
                  <span className="text-ink-muted font-bold tracking-wider uppercase text-[9px]">₹500 for two</span>
                </div>
              </div>
            </article>

            {/* Card 4: Belgian Waffle & Co */}
            <article className="group bg-white rounded-2xl border border-sandborder overflow-hidden hover:shadow-card transition-all duration-300 flex flex-col">
              <div className="relative h-48 w-full overflow-hidden bg-oat-200">
                <img alt="Belgian Waffle warm dessert chocolate cake" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA42fgoc5KpinOhqk_j10kDBdfDpDfqtvJVLjolum2cUiNQ-ZFQE2dVroT10kSTbvxNo4DMIh_Z_2nGuxI_coBqW0okZw-uTditpYnAPdaXeglHU30Zd-zwsz2feTH0o_QdBSWnovd9pponS03aPwMK79Hr8k4acFG1t8tV7Us8YWpYBRUollUXhAhH7rVDxrNq5IrFf43XJCEFMA79UL7Mz87FgzVT--yWaQxYC5ZwUSZiqsgedzTy" />
                <button 
                  aria-label="Add to wishlist" 
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center ${favorites['waffle'] ? 'text-crimson' : 'text-ink-muted'} hover:text-crimson shadow-sm transition-colors cursor-pointer`}
                  onClick={() => toggleFavorite('waffle')}
                >
                  <svg className="w-4 h-4" fill={favorites['waffle'] ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </button>
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-crimson/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" fillRule="evenodd"></path></svg>
                  <span>100% EGGLESS DESSERTS</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-ink group-hover:text-crimson transition-colors line-clamp-1">Belgian Waffle &amp; Co</h3>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-800 text-white text-[11px] font-bold">4.9 ★</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-ink-muted mt-1">
                    <span className="flex items-center gap-1 text-ink font-medium">
                      <svg className="w-3.5 h-3.5 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                      15–20 mins
                    </span>
                    <span>•</span>
                    <span className="truncate">Waffles, Ice Creams, Pastry</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-sandborder flex items-center justify-between text-[11px]">
                  <span className="text-ink-soft bg-oat-100 px-2 py-0.5 rounded font-medium">Express Dispatch</span>
                  <span className="text-ink-muted font-bold tracking-wider uppercase text-[9px]">₹400 for two</span>
                </div>
              </div>
            </article>
          </div>
        </section>
        {/* END: TopRatedRestaurants */}
      </main>
      {/* END: MainContent */}

      {/* BEGIN: FloatingBottomCartDock */}
      <aside aria-label="Current Active Cart" className="fixed bottom-6 inset-x-0 z-50 pointer-events-none px-4 flex justify-center">
        <div className="pointer-events-auto bg-ink text-white max-w-lg w-full rounded-2xl shadow-floating p-2.5 pl-4 flex items-center justify-between border border-sandborder/20 backdrop-blur-xl animate-fade-in-up">
          <div className="flex items-center gap-3 truncate pr-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-oat-200 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
            <div className="truncate">
              <div className="text-xs font-bold uppercase tracking-wider text-oat-200">1 Item in Cart</div>
              <div className="text-sm font-medium text-white truncate">Toscano • Smoky BBQ Paneer Pizza</div>
            </div>
          </div>
          <button 
            className="shrink-0 bg-crimson hover:bg-crimson-dark text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-transform active:scale-95 shadow-md cursor-pointer"
            onClick={() => navigate('/billing')}
          >
            <span>View Cart</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </button>
        </div>
      </aside>
      {/* END: FloatingBottomCartDock */}

      {/* BEGIN: MainFooter */}
      <footer className="mt-20 border-t border-sandborder bg-oat-200/60 pt-16 pb-24 text-ink">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            {/* Column 1: Brand Philosophy */}
            <div className="md:col-span-2 space-y-4">
              <a className="inline-flex items-center gap-2" href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                <span className="text-2xl font-bold tracking-tighter uppercase font-serif text-crimson">ZAYKA</span>
                <span className="w-1.5 h-1.5 rounded-full bg-crimson mb-1"></span>
              </a>
              <p className="text-xs text-ink-soft max-w-sm leading-relaxed">
                Botanical editorial dining delivered fresh. We curate premier local kitchens, fine roasters, and artisanal patisseries straight to your doorstep across Bengaluru.
              </p>
              <div className="pt-2 text-[11px] text-ink-muted">
                © 2025 Zayka Food Technologies Pvt. Ltd. All rights reserved.
              </div>
            </div>
            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-ink font-sans">Company</h4>
              <ul className="space-y-2 text-xs text-ink-soft font-medium">
                <li><a className="hover:text-crimson transition-colors" href="#about" onClick={(e) => e.preventDefault()}>About Us</a></li>
                <li><a className="hover:text-crimson transition-colors" href="#corporate" onClick={(e) => e.preventDefault()}>Zayka Corporate</a></li>
                <li><a className="hover:text-crimson transition-colors" href="#careers" onClick={(e) => e.preventDefault()}>Careers &amp; Kitchens</a></li>
                <li><a className="hover:text-crimson transition-colors" href="#press" onClick={(e) => e.preventDefault()}>Press &amp; Media</a></li>
              </ul>
            </div>
            {/* Column 3: Culinary Discovery */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-ink font-sans">Available Cities</h4>
              <ul className="space-y-2 text-xs text-ink-soft font-medium">
                <li><a className="hover:text-crimson transition-colors" href="#bengaluru" onClick={(e) => e.preventDefault()}>Bengaluru Central</a></li>
                <li><a className="hover:text-crimson transition-colors" href="#mumbai" onClick={(e) => e.preventDefault()}>Mumbai Bandra</a></li>
                <li><a className="hover:text-crimson transition-colors" href="#delhi" onClick={(e) => e.preventDefault()}>Delhi NCR</a></li>
                <li><a className="hover:text-crimson transition-colors" href="#hyderabad" onClick={(e) => e.preventDefault()}>Hyderabad Jubilee</a></li>
              </ul>
            </div>
            {/* Column 4: Newsletter Sign-up */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-ink font-sans">The Epicurean Letter</h4>
              <p className="text-xs text-ink-muted">Receive weekly restaurant spotlights and secret chef codes.</p>
              <div className="flex items-center gap-2 pt-1">
                <input className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-sandborder focus:outline-none focus:ring-1 focus:ring-crimson" placeholder="Your email" type="email" />
                <button className="bg-ink text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-crimson transition-colors shrink-0 cursor-pointer">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* END: MainFooter */}
    </div>
  );
}

export default DesktopFoodContent;
