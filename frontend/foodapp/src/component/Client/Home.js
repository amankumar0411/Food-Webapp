import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import DesktopNavbarAndModeBar from './desktop/DesktopNavbarAndModeBar';
import DesktopFoodContent from './desktop/DesktopFoodContent';
import DesktopQuickOrderContent from './desktop/DesktopQuickOrderContent';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = localStorage.getItem("user");
  const parsedUser = auth ? (auth.startsWith("{") ? JSON.parse(auth) : { username: auth }) : null;
  const userNameDisplay = parsedUser?.username ? parsedUser.username : "Aman";
  const userInitials = parsedUser?.username ? parsedUser.username.substring(0, 2).toUpperCase() : "AM";

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [activeTab, setActiveTab] = useState("food"); // Mobile tab: 'food' | 'quick'
  const [desktopTab, setDesktopTab] = useState("food"); // Desktop tab: 'food' | 'quick'
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState({});

  // Matrix Orb Canvas State & Voice Logic for Mobile Quick Order Tab
  const [orbStateIndex, setOrbStateIndex] = useState(2); // 0: listening, 1: thinking, 2: idle
  const [mobileTranscript, setMobileTranscript] = useState("Tap orb to speak or enter your craving");
  const [mobileMatchedItem, setMobileMatchedItem] = useState({
    fid: "F101",
    fname: "Artisanal Pepperoni Pizza (Medium)",
    qty: 1,
    unitPrice: 399.0,
    totalPrice: 399.0,
    originalPrice: 499.0,
    customization: "Customizing: Stuffed Crust Cheese Burst",
    veg: false,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuALTjgUzSzn9bovRKCGYz-KLdWKW8EanwJaO7D4b2PjZe8CaTILOkdN973GuNhDR267TCtgsYPRX8CcYzFRJ-aVF7R9IAluJdtpWnSA0PbtI2odNuJ27ROJGQKWj9ltPP_KfTfaOHL9TGfN0i33IKagitxkt_FBSow9NrrT9-7pQYRSwcP0Lm7Rj_vsdEh4hbmwX-0U3lgjQ50FrAs8fA7V2LcSpu_mDw5_uyTUzFXN7pppHPGTaH9c"
  });
  const [isMobileAutoConfirmActive, setIsMobileAutoConfirmActive] = useState(false);
  const [mobileAutoConfirmCanceled, setMobileAutoConfirmCanceled] = useState(false);
  const [mobileAutoConfirmProgress, setMobileAutoConfirmProgress] = useState(100);

  const canvasRef = useRef(null);
  const mobileRecognitionRef = useRef(null);
  const mobileTranscriptRef = useRef(mobileTranscript);
  useEffect(() => {
    mobileTranscriptRef.current = mobileTranscript;
  }, [mobileTranscript]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen to tab query parameter (?tab=quick)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'quick') {
      setActiveTab('quick');
      setDesktopTab('quick');
    }
  }, [location.search]);

  const toggleFavorite = (id) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchQuery.trim()) {
        navigate(`/foodlistclient?search=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate('/foodlistclient');
      }
    }
  };

  const submitMobileVoiceOrder = (text) => {
    if (!text || !text.trim() || text.startsWith("Listening...") || text.startsWith("Tap orb")) return;
    setOrbStateIndex(1); // Thinking
    setMobileTranscript(text);

    toast.loading("Finding matches in kitchen menu...", { id: 'mobile-voice' });

    axiosInstance.post("/api/voice-order/text", {
      transcript: text,
      uname: userNameDisplay
    })
    .then((res) => {
      toast.dismiss('mobile-voice');
      setOrbStateIndex(2); // Return to idle/matched
      if (res.data?.matchedItems && res.data.matchedItems.length > 0) {
        const item = res.data.matchedItems[0];
        setMobileMatchedItem({
          fid: item.fid || "F101",
          fname: item.fname || text,
          qty: item.qty || 1,
          unitPrice: item.unitPrice || 399.0,
          totalPrice: item.totalPrice || (item.unitPrice ? item.unitPrice * (item.qty || 1) : 399.0),
          originalPrice: (item.totalPrice ? item.totalPrice + 100 : 499.0),
          customization: item.customization || "Customizing: Chef Special Seasoning",
          veg: item.veg !== undefined ? item.veg : false,
          image: item.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuALTjgUzSzn9bovRKCGYz-KLdWKW8EanwJaO7D4b2PjZe8CaTILOkdN973GuNhDR267TCtgsYPRX8CcYzFRJ-aVF7R9IAluJdtpWnSA0PbtI2odNuJ27ROJGQKWj9ltPP_KfTfaOHL9TGfN0i33IKagitxkt_FBSow9NrrT9-7pQYRSwcP0Lm7Rj_vsdEh4hbmwX-0U3lgjQ50FrAs8fA7V2LcSpu_mDw5_uyTUzFXN7pppHPGTaH9c"
        });
        toast.success(`Matched: ${item.fname}! Added to cart 🌿`);
        setMobileAutoConfirmCanceled(false);
        setMobileAutoConfirmProgress(100);
        setIsMobileAutoConfirmActive(true);
      } else {
        toast.error("Could not match dish in menu. Try saying Pizza, Biryani, or Burger.");
      }
    })
    .catch((err) => {
      toast.dismiss('mobile-voice');
      setOrbStateIndex(2); // Idle
      toast.error("Could not process voice order. Please try again.");
    });
  };

  const startMobileListening = async () => {
    // Stop any existing instance
    if (mobileRecognitionRef.current) {
      try { mobileRecognitionRef.current.stop(); } catch (e) {}
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast("Voice recognition not supported in this browser. Tap text to enter order.", { id: 'mobile-unsupported' });
      return;
    }

    // Request microphone permission first so browser prompt appears reliably
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        console.warn("Microphone access prompt error:", err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          toast.error("Microphone permission denied. Please allow microphone in browser bar.");
          setOrbStateIndex(2);
          return;
        }
      }
    }

    try {
      const recognition = new SpeechRecognition();
      // On mobile devices, non-continuous single utterance recognition is standard and reliable
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = (navigator.language && navigator.language.startsWith('en')) ? navigator.language : 'en-US';

      recognition.onstart = () => {
        setOrbStateIndex(0); // Listening
        setMobileTranscript("Listening... Speak your craving 🎙️");
        toast("Listening to your craving... Speak now 🎙️", { id: 'mobile-listening' });
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            final += res[0].transcript + ' ';
          } else {
            interim += res[0].transcript;
          }
        }
        const fullText = (final + interim).trim();
        if (fullText) {
          setMobileTranscript(fullText);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Mobile recognition error:", event.error);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          toast.error("Microphone permission denied. Tap text to type craving.");
        } else if (event.error === 'no-speech') {
          toast("No voice detected. Speak closer to your microphone or tap text.", { id: 'no-speech-mobile' });
        } else if (event.error === 'network') {
          toast.error("Speech service network error. Tap text to enter craving.");
        }
        setOrbStateIndex(2);
      };

      recognition.onend = () => {
        const text = mobileTranscriptRef.current;
        if (text && !text.startsWith("Listening...") && !text.startsWith("Tap orb") && text.trim().length > 2) {
          // Automatically submit recognized voice craving!
          submitMobileVoiceOrder(text.trim());
        } else {
          setOrbStateIndex(2);
        }
      };

      mobileRecognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn("Mobile recognition start error:", e);
      toast.error("Could not start microphone. Tap text to type craving.");
      setOrbStateIndex(2);
    }
  };

  const cycleOrbState = () => {
    if (orbStateIndex === 0) {
      // currently listening -> stop and submit
      if (mobileRecognitionRef.current) {
        try { mobileRecognitionRef.current.stop(); } catch (e) {}
      }
      const text = mobileTranscriptRef.current;
      if (text && !text.startsWith("Listening...") && !text.startsWith("Tap orb")) {
        submitMobileVoiceOrder(text);
      } else {
        setOrbStateIndex(1);
        submitMobileVoiceOrder("1 Farmhouse Pizza and 2 Cold Coffees");
      }
    } else if (orbStateIndex === 1) {
      // thinking -> switch to idle
      setOrbStateIndex(2);
    } else {
      // idle -> start listening
      startMobileListening();
    }
  };

  // Clean up any ongoing recognition on unmount
  useEffect(() => {
    return () => {
      if (mobileRecognitionRef.current) {
        try { mobileRecognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  // Mobile auto-confirm countdown timer
  useEffect(() => {
    if (!isMobile || activeTab !== 'quick' || !isMobileAutoConfirmActive || mobileAutoConfirmCanceled) return;
    const interval = setInterval(() => {
      setMobileAutoConfirmProgress(prev => {
        if (prev <= 5) {
          clearInterval(interval);
          navigate('/billing');
          return 0;
        }
        return prev - 5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isMobile, activeTab, isMobileAutoConfirmActive, mobileAutoConfirmCanceled, navigate]);

  // MatrixOrb Canvas Animation Engine
  useEffect(() => {
    if (!isMobile || activeTab !== 'quick') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const states = ['listening', 'thinking', 'idle'];
    const currentState = states[orbStateIndex];

    const GRID_SIZE = 11;
    let amplitude = 0.65;
    let targetAmplitude = currentState === 'listening' ? 0.85 : currentState === 'thinking' ? 0.55 : 0.15;

    const dpr = window.devicePixelRatio || 1;
    const w = 190;
    const h = 190;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    function intensityOf(state, d, nx, ny, t, amp) {
      if (state === 'listening') {
        const ripple = 0.5 + 0.5 * Math.sin(d * 4.2 - t * 3);
        return 0.32 + amp * (0.34 + 0.38 * ripple);
      } else if (state === 'thinking') {
        const angle = Math.atan2(ny, nx);
        const spin = 0.5 + 0.5 * Math.sin(angle * 3 - t * 3.5);
        const pulse = 0.5 + 0.5 * Math.sin(d * 5.0 - t * 2.0);
        return 0.28 + amp * 0.45 * (0.6 * spin + 0.4 * pulse);
      } else {
        const breathe = 0.5 + 0.5 * Math.sin(t * 1.5 - d * 2.0);
        return 0.25 + 0.2 * breathe;
      }
    }

    let animationFrameId;
    let startTime = null;

    function render(timestamp) {
      if (!startTime) startTime = timestamp;
      const t = (timestamp - startTime) / 1000;

      if (currentState === 'listening') {
        targetAmplitude = 0.55 + 0.38 * Math.abs(Math.sin(t * 2.4) * Math.cos(t * 1.1));
      }
      amplitude += (targetAmplitude - amplitude) * 0.08;

      ctx.clearRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2;
      const orbRadius = Math.min(w, h) * 0.44;
      const step = (orbRadius * 2) / (GRID_SIZE - 1);
      const maxRadius = step * 0.46;

      const grad = ctx.createRadialGradient(centerX, centerY, 4, centerX, centerY, orbRadius * 1.05);
      if (currentState === 'listening') {
        grad.addColorStop(0, 'rgba(194, 0, 25, 0.16)');
        grad.addColorStop(0.6, 'rgba(195, 105, 83, 0.08)');
        grad.addColorStop(1, 'rgba(194, 0, 25, 0)');
      } else if (currentState === 'thinking') {
        grad.addColorStop(0, 'rgba(201, 142, 87, 0.20)');
        grad.addColorStop(0.7, 'rgba(201, 142, 87, 0.06)');
        grad.addColorStop(1, 'rgba(201, 142, 87, 0)');
      } else {
        grad.addColorStop(0, 'rgba(93, 63, 61, 0.08)');
        grad.addColorStop(1, 'rgba(93, 63, 61, 0)');
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbRadius * 1.05, 0, Math.PI * 2);
      ctx.fill();

      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const x = centerX - orbRadius + col * step;
          const y = centerY - orbRadius + row * step;

          const nx = (x - centerX) / orbRadius;
          const ny = (y - centerY) / orbRadius;
          const d = Math.hypot(nx, ny);

          if (d > 1.05) continue;

          const intensity = intensityOf(currentState, d, nx, ny, t, amplitude);
          const gaussianFalloff = Math.exp(-d * d * 1.55);
          const dotRadius = Math.max(0.75, maxRadius * gaussianFalloff * intensity * 1.35);

          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);

          if (currentState === 'listening') {
            const alpha = Math.min(0.96, Math.max(0.18, gaussianFalloff * (0.4 + 0.6 * intensity)));
            const r = Math.round(194 - d * 20);
            const g = Math.round(0 + d * 75);
            const b = Math.round(25 + d * 55);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          } else if (currentState === 'thinking') {
            const alpha = Math.min(0.95, Math.max(0.2, gaussianFalloff * (0.35 + 0.65 * intensity)));
            ctx.fillStyle = `rgba(201, 142, 87, ${alpha})`;
          } else {
            const alpha = Math.min(0.5, Math.max(0.15, gaussianFalloff * 0.45));
            ctx.fillStyle = `rgba(141, 77, 59, ${alpha})`;
          }

          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isMobile, activeTab, orbStateIndex]);

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE VERSION                                                         */}
      {/* ========================================================================= */}
      {isMobile ? (
        <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen">
          {/* Header */}
          <header className="fixed top-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl border-b border-surface-dim/50 shadow-[0_1px_8px_rgba(30,27,21,0.03)]">
            <div className="h-16 px-margin flex items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm min-w-0 max-w-[55%]">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-headline-sm text-[17px] text-on-surface font-semibold truncate">{userNameDisplay}</span>
                    <span className="material-symbols-outlined text-primary text-[18px]">keyboard_arrow_down</span>
                  </div>
                  <span className="font-body-sm text-[12px] text-on-surface-variant truncate">12th Main, Indiranagar, Bengaluru</span>
                </div>
              </div>
              <div className="flex items-center gap-space-xs shrink-0">
                <button aria-label="Menu" className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-primary transition-colors" type="button"></button>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm cursor-pointer" onClick={() => navigate('/account')}>
                  <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
                </div>
              </div>
            </div>
          </header>

          {/* ===================================================================== */}
          {/* A. MOBILE FOOD TAB VIEW                                               */}
          {/* ===================================================================== */}
          {activeTab === 'food' ? (
            <main className="flex flex-col relative w-full pt-16 pb-20 bg-surface">
              <div className="flex flex-col w-full pb-8">
                {/* 1. TOP OVERLAPPING TABS */}
                <div className="px-margin pt-space-md">
                  <div className="grid grid-cols-2 gap-space-sm p-1.5 bg-surface-container rounded-2xl border border-surface-dim/40">
                    {/* Tab 1: Food (Active) */}
                    <button 
                      className="relative flex flex-col items-center justify-center py-2.5 px-space-md bg-surface-container-lowest rounded-xl shadow-sm transition-all duration-200 active:scale-95 border border-surface-dim/30 cursor-pointer" 
                      type="button"
                      onClick={() => setActiveTab('food')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>lunch_dining</span>
                        <span className="font-headline-sm text-[15px] font-bold text-primary">Food</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Delivery in 25m</span>
                      <div className="absolute -bottom-1.5 w-8 h-1 bg-primary rounded-full shadow-[0_2px_6px_rgba(149,0,16,0.35)]"></div>
                    </button>
                    {/* Tab 2: Quick Order (Inactive) */}
                    <button 
                      className="flex flex-col items-center justify-center py-2.5 px-space-md rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 active:scale-95 cursor-pointer" 
                      type="button"
                      onClick={() => setActiveTab('quick')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">graphic_eq</span>
                        <span className="font-headline-sm text-[15px] font-medium text-on-surface">Quick Order</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-tertiary mt-0.5 font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">mic</span> Voice Mode
                      </span>
                    </button>
                  </div>
                </div>

                {/* 2. SEARCH BAR & VEG TOGGLE ROW */}
                <div className="px-margin pt-space-md flex items-center gap-space-sm">
                  {/* Search Bar */}
                  <div className="relative flex-1 flex items-center bg-surface-container-lowest rounded-full px-space-md py-2.5 border border-surface-dim/60 shadow-[0_2px_12px_rgba(30,27,21,0.04)] group">
                    <span className="material-symbols-outlined text-secondary text-[20px] mr-2 transition-transform group-hover:scale-110">search</span>
                    <input 
                      className="w-full bg-transparent font-body-sm text-[13px] text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none" 
                      placeholder="Search for 'Cake'" 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchSubmit}
                    />
                    <div className="flex items-center gap-1.5 text-on-surface-variant pl-1">
                      <span className="w-px h-4 bg-surface-dim"></span>
                      <button aria-label="Voice Search" className="p-1 text-secondary hover:text-primary transition-colors cursor-pointer" type="button" onClick={() => { setActiveTab('quick'); startMobileListening(); }}>
                        <span className="material-symbols-outlined text-[18px]">mic</span>
                      </button>
                    </div>
                  </div>
                  {/* Veg Toggle Switch */}
                  <div className="shrink-0 flex items-center bg-surface-container-lowest px-3 py-2 rounded-full border border-surface-dim/60 shadow-[0_2px_12px_rgba(30,27,21,0.04)]">
                    <div className="flex flex-col items-start mr-2">
                      <span className="font-label-sm text-[9px] uppercase tracking-wider font-bold text-tertiary">VEG</span>
                      <span className="font-label-sm text-[8px] leading-tight text-on-surface-variant">ONLY</span>
                    </div>
                    <button 
                      aria-label="Toggle Vegetarian Only" 
                      className={`relative w-9 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 cursor-pointer ${isVegOnly ? 'bg-tertiary' : 'bg-surface-variant'}`} 
                      id="vegToggleBtn" 
                      onClick={() => setIsVegOnly(!isVegOnly)} 
                      type="button"
                    >
                      <div className={`w-4 h-4 rounded-full bg-surface-container-lowest shadow-sm transform transition-transform duration-200 flex items-center justify-center ${isVegOnly ? 'translate-x-4' : 'translate-x-0'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 3. WHAT'S ON YOUR MIND? CATEGORY SECTION */}
                <div className="pt-space-xl flex flex-col">
                  <div className="px-margin flex items-center justify-between">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">What's on your mind?</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Handcrafted picks from your favorite cuisines</p>
                    </div>
                  </div>
                  {/* Category Circular Carousel */}
                  <div className="flex items-center gap-space-md overflow-x-auto px-margin pt-space-md pb-2 no-scrollbar">
                    {/* Pizzas */}
                    <div className="shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition-transform" onClick={() => navigate('/foodlistclient?category=Pizzas')}>
                      <div className="w-16 h-16 rounded-full p-1 bg-surface-container-lowest shadow-sm border border-surface-dim/60 group-hover:border-secondary transition-colors">
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <img alt="Pizzas" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida/AEtjO1Ui_cOF5_kyu5jYWSYHLw0VHAGEQm019f7ZqZeJQhX9QF7PwcyobJB-LsMa7UqbXRvQ7qLgvE8vnRCeVV_bxErTPL1lL7_sAUmwze8qAMMwR79uGtOyjLELrsBqidP4n32kCmvoBDRoTNOckfcaew9_gBXu2O7p5vU6hOS0IvXjceDBq5tHYeyQqsKN67rxW_mw9ok56OwazEoqS3Lq8W8zeCVJ8EdNzofatZQnldM1zMBV7RcdDZQwPa4" />
                        </div>
                      </div>
                      <span className="font-body-sm text-[13px] font-medium text-on-surface">Pizzas</span>
                    </div>
                    {/* Biryani */}
                    <div className="shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition-transform" onClick={() => navigate('/foodlistclient?category=Biryani')}>
                      <div className="w-16 h-16 rounded-full p-1 bg-surface-container-lowest shadow-sm border border-surface-dim/60 group-hover:border-secondary transition-colors">
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <img alt="Biryani" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida/AEtjO1U4XGlam0qgUODevjdR-on30nyrJHlnQaZ2toPSPifUsEYDTxaBm47uBWuKP5WaD81SSPTyBdrvHspguUnesKEgXKjfXX3ZC_f6hZ4MsvMiiGZ5Nlpp9NtJmS4PbYtIVDO3yXdKC3Fd-LMPF6tPvX0vJEq2Jzb8p1kzyZCUCWXCNZrV3FSj_F8mKZRMVRwwcBGXzX1goUVubrcAKyyJu0gvHvezD5Fpky1a5YtFSflJnoMUYQ3-22cnER4" />
                        </div>
                      </div>
                      <span className="font-body-sm text-[13px] font-medium text-on-surface">Biryani</span>
                    </div>
                    {/* Burgers */}
                    <div className="shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition-transform" onClick={() => navigate('/foodlistclient?category=Burgers')}>
                      <div className="w-16 h-16 rounded-full p-1 bg-surface-container-lowest shadow-sm border border-surface-dim/60 group-hover:border-secondary transition-colors">
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <img alt="Burgers" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida/AEtjO1Uh8vPHaa957jH_ybx62VW-h30Efz_7c3x7elPRCfYYXU-iN6KyA07dSz8TuptMpSjqKBJiJTlhRFI1MzEWgwVZH4uX9tvXaNoZ6opw5wUJWaR0ZqTkoZzm0tKzr8vuuOqzSoxlya51Js7Or4Is5TPCcrYZkxYywfpe-lX_bjpXbjBTY1Hrrr3CJ4bVL1XQ2Yj8E3Wa9OFr6r5Pkc_KgvgnA1DRHrIGroa0aGHfGNWD1QhStwESVn9XVaE" />
                        </div>
                      </div>
                      <span className="font-body-sm text-[13px] font-medium text-on-surface">Burgers</span>
                    </div>
                    {/* Cakes */}
                    <div className="shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition-transform" onClick={() => navigate('/foodlistclient?category=Cakes')}>
                      <div className="w-16 h-16 rounded-full p-1 bg-surface-container-lowest shadow-sm border border-surface-dim/60 group-hover:border-secondary transition-colors">
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <img alt="Cakes" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida/AEtjO1U48K4NkA9_YjeBZjEi6UUjsMpvAtAJ7JsbltRihM3EP5gQ__3OUJfGiKZtPFZC9vQ02UKkq7XeLiP1wULgEdWQfbIO6_Hj1FQqZ--8VmpgYnTdmSuD66BCZpeJUMuzhoax3HHSd1K_-_z3VwJNyiOQcsoBGDrV7uVXfI7WUI-Nbnu4-i2hL4mAElbXOVU3ys6S5uixJoUSj5CYPwOUwxY3hgVvyvuSU9sOt3bXU3BqbX7K7anXXZyDuwU" />
                        </div>
                      </div>
                      <span className="font-body-sm text-[13px] font-medium text-on-surface">Cakes</span>
                    </div>
                    {/* Rolls */}
                    <div className="shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition-transform" onClick={() => navigate('/foodlistclient?category=Rolls')}>
                      <div className="w-16 h-16 rounded-full p-1 bg-surface-container-lowest shadow-sm border border-surface-dim/60 group-hover:border-secondary transition-colors">
                        <div className="w-full h-full rounded-full overflow-hidden bg-surface-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-secondary text-[26px]">kebab_dining</span>
                        </div>
                      </div>
                      <span className="font-body-sm text-[13px] font-medium text-on-surface">Rolls</span>
                    </div>
                    {/* Ice Creams */}
                    <div className="shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition-transform" onClick={() => navigate('/foodlistclient?category=IceCream')}>
                      <div className="w-16 h-16 rounded-full p-1 bg-surface-container-lowest shadow-sm border border-surface-dim/60 group-hover:border-secondary transition-colors">
                        <div className="w-full h-full rounded-full overflow-hidden bg-surface-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-raw-ochre text-[26px]">icecream</span>
                        </div>
                      </div>
                      <span className="font-body-sm text-[13px] font-medium text-on-surface">Ice Cream</span>
                    </div>
                    {/* Momos */}
                    <div className="shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition-transform" onClick={() => navigate('/foodlistclient?category=Momos')}>
                      <div className="w-16 h-16 rounded-full p-1 bg-surface-container-lowest shadow-sm border border-surface-dim/60 group-hover:border-secondary transition-colors">
                        <div className="w-full h-full rounded-full overflow-hidden bg-surface-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-botanical-sage text-[26px]">ramen_dining</span>
                        </div>
                      </div>
                      <span className="font-body-sm text-[13px] font-medium text-on-surface">Momos</span>
                    </div>
                  </div>
                </div>

                {/* 4. TOP RATED NEAR YOU SECTION */}
                <div className="pt-space-xl flex flex-col">
                  <div className="px-margin flex items-center justify-between mb-space-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-tertiary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">Top rated near you</h3>
                    </div>
                    <a className="flex items-center font-label-md text-label-md text-primary font-semibold hover:underline" href="/foodlistclient" onClick={(e) => { e.preventDefault(); navigate('/foodlistclient'); }}>
                      <span>See all</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </a>
                  </div>

                  {/* Horizontal Restaurant Cards Carousel */}
                  <div className="flex items-start gap-space-md overflow-x-auto px-margin pt-1 pb-4 no-scrollbar">
                    {/* Card 1: Toscano Artisan Pizzeria */}
                    <div className="shrink-0 w-64 bg-surface-container-lowest rounded-2xl border border-surface-dim/60 shadow-[0_4px_16px_rgba(30,27,21,0.05)] overflow-hidden flex flex-col group">
                      <div className="relative w-full h-36 overflow-hidden">
                        <img alt="Pepperoni artisan pizza" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida/AEtjO1Ui_cOF5_kyu5jYWSYHLw0VHAGEQm019f7ZqZeJQhX9QF7PwcyobJB-LsMa7UqbXRvQ7qLgvE8vnRCeVV_bxErTPL1lL7_sAUmwze8qAMMwR79uGtOyjLELrsBqidP4n32kCmvoBDRoTNOckfcaew9_gBXu2O7p5vU6hOS0IvXjceDBq5tHYeyQqsKN67rxW_mw9ok56OwazEoqS3Lq8W8zeCVJ8EdNzofatZQnldM1zMBV7RcdDZQwPa4" />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-ink/75 via-transparent to-transparent"></div>
                        <button aria-label="Add to favorites" className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface-bright/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer" onClick={() => toggleFavorite('toscano')} type="button">
                          <span className={`material-symbols-outlined text-[18px] ${favorites['toscano'] ? 'text-primary' : ''}`} style={{ fontVariationSettings: favorites['toscano'] ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                        </button>
                        <div className="absolute bottom-2.5 left-2.5 bg-secondary text-surface-bright px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 border border-surface-bright/20">
                          <span className="material-symbols-outlined text-[12px]">local_offer</span>
                          <span className="font-label-sm text-[9px] uppercase tracking-wider font-bold">70% OFF UPTO ₹120</span>
                        </div>
                      </div>
                      <div className="p-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-headline-sm text-[15px] font-semibold text-on-surface truncate flex-1 cursor-pointer" onClick={() => navigate('/foodlistclient?restaurant=Toscano')}>Toscano Artisan Pizzeria</h4>
                          <div className="flex items-center gap-1 bg-tertiary text-on-tertiary px-1.5 py-0.5 rounded-md shrink-0">
                            <span className="font-label-sm text-[11px] font-bold">4.6</span>
                            <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 font-body-sm text-[12px] text-on-surface-variant">
                          <span className="flex items-center gap-0.5 font-medium text-on-surface">
                            <span className="material-symbols-outlined text-[14px] text-raw-ochre">schedule</span>
                            25-30 mins
                          </span>
                          <span>•</span>
                          <span className="truncate">Pizzas, Italian, Desserts</span>
                        </div>
                        <div className="mt-1 pt-1.5 border-t-0 bg-surface-container-low px-2 py-1 rounded-lg flex items-center justify-between text-on-surface-variant border border-surface-dim/40">
                          <span className="font-body-sm text-[11px]">Free delivery with Bolt</span>
                          <span className="font-label-sm text-[9px] text-tertiary uppercase font-bold">1.2k+ ratings</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Meghana Foods */}
                    <div className="shrink-0 w-64 bg-surface-container-lowest rounded-2xl border border-surface-dim/60 shadow-[0_4px_16px_rgba(30,27,21,0.05)] overflow-hidden flex flex-col group">
                      <div className="relative w-full h-36 overflow-hidden">
                        <img alt="Spicy Dum Biryani" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida/AEtjO1U4XGlam0qgUODevjdR-on30nyrJHlnQaZ2toPSPifUsEYDTxaBm47uBWuKP5WaD81SSPTyBdrvHspguUnesKEgXKjfXX3ZC_f6hZ4MsvMiiGZ5Nlpp9NtJmS4PbYtIVDO3yXdKC3Fd-LMPF6tPvX0vJEq2Jzb8p1kzyZCUCWXCNZrV3FSj_F8mKZRMVRwwcBGXzX1goUVubrcAKyyJu0gvHvezD5Fpky1a5YtFSflJnoMUYQ3-22cnER4" />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-ink/75 via-transparent to-transparent"></div>
                        <button aria-label="Add to favorites" className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface-bright/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer" onClick={() => toggleFavorite('meghana')} type="button">
                          <span className={`material-symbols-outlined text-[18px] ${favorites['meghana'] ? 'text-primary' : ''}`} style={{ fontVariationSettings: favorites['meghana'] ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                        </button>
                        <div className="absolute bottom-2.5 left-2.5 bg-secondary text-surface-bright px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 border border-surface-bright/20">
                          <span className="material-symbols-outlined text-[12px]">percent</span>
                          <span className="font-label-sm text-[9px] uppercase tracking-wider font-bold">50% OFF</span>
                        </div>
                      </div>
                      <div className="p-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-headline-sm text-[15px] font-semibold text-on-surface truncate flex-1 cursor-pointer" onClick={() => navigate('/foodlistclient?restaurant=Meghana')}>Meghana Foods</h4>
                          <div className="flex items-center gap-1 bg-tertiary text-on-tertiary px-1.5 py-0.5 rounded-md shrink-0">
                            <span className="font-label-sm text-[11px] font-bold">4.8</span>
                            <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 font-body-sm text-[12px] text-on-surface-variant">
                          <span className="flex items-center gap-0.5 font-medium text-on-surface">
                            <span className="material-symbols-outlined text-[14px] text-raw-ochre">schedule</span>
                            20-25 mins
                          </span>
                          <span>•</span>
                          <span className="truncate">Biryani, Andhra, Spicy</span>
                        </div>
                        <div className="mt-1 pt-1.5 border-t-0 bg-surface-container-low px-2 py-1 rounded-lg flex items-center justify-between text-on-surface-variant border border-surface-dim/40">
                          <span className="font-body-sm text-[11px]">Iconic Local Favorite</span>
                          <span className="font-label-sm text-[9px] text-tertiary uppercase font-bold">5k+ ratings</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Truffles */}
                    <div className="shrink-0 w-64 bg-surface-container-lowest rounded-2xl border border-surface-dim/60 shadow-[0_4px_16px_rgba(30,27,21,0.05)] overflow-hidden flex flex-col group">
                      <div className="relative w-full h-36 overflow-hidden">
                        <img alt="Smash burger with french fries" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida/AEtjO1Uh8vPHaa957jH_ybx62VW-h30Efz_7c3x7elPRCfYYXU-iN6KyA07dSz8TuptMpSjqKBJiJTlhRFI1MzEWgwVZH4uX9tvXaNoZ6opw5wUJWaR0ZqTkoZzm0tKzr8vuuOqzSoxlya51Js7Or4Is5TPCcrYZkxYywfpe-lX_bjpXbjBTY1Hrrr3CJ4bVL1XQ2Yj8E3Wa9OFr6r5Pkc_KgvgnA1DRHrIGroa0aGHfGNWD1QhStwESVn9XVaE" />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-ink/75 via-transparent to-transparent"></div>
                        <button aria-label="Add to favorites" className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface-bright/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer" onClick={() => toggleFavorite('truffles')} type="button">
                          <span className={`material-symbols-outlined text-[18px] ${favorites['truffles'] ? 'text-primary' : ''}`} style={{ fontVariationSettings: favorites['truffles'] ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                        </button>
                        <div className="absolute bottom-2.5 left-2.5 bg-secondary text-surface-bright px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 border border-surface-bright/20">
                          <span className="material-symbols-outlined text-[12px]">currency_rupee</span>
                          <span className="font-label-sm text-[9px] uppercase tracking-wider font-bold">FLAT ₹150 OFF</span>
                        </div>
                      </div>
                      <div className="p-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-headline-sm text-[15px] font-semibold text-on-surface truncate flex-1 cursor-pointer" onClick={() => navigate('/foodlistclient?restaurant=Truffles')}>Truffles Gourmet Bistro</h4>
                          <div className="flex items-center gap-1 bg-tertiary text-on-tertiary px-1.5 py-0.5 rounded-md shrink-0">
                            <span className="font-label-sm text-[11px] font-bold">4.5</span>
                            <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 font-body-sm text-[12px] text-on-surface-variant">
                          <span className="flex items-center gap-0.5 font-medium text-on-surface">
                            <span className="material-symbols-outlined text-[14px] text-raw-ochre">schedule</span>
                            30 mins
                          </span>
                          <span>•</span>
                          <span className="truncate">Burgers, Fast Food, Shakes</span>
                        </div>
                        <div className="mt-1 pt-1.5 border-t-0 bg-surface-container-low px-2 py-1 rounded-lg flex items-center justify-between text-on-surface-variant border border-surface-dim/40">
                          <span className="font-body-sm text-[11px]">Trending in Indiranagar</span>
                          <span className="font-label-sm text-[9px] text-tertiary uppercase font-bold">4.1k+ orders</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 4: The Chocolate Room */}
                    <div className="shrink-0 w-64 bg-surface-container-lowest rounded-2xl border border-surface-dim/60 shadow-[0_4px_16px_rgba(30,27,21,0.05)] overflow-hidden flex flex-col group">
                      <div className="relative w-full h-36 overflow-hidden">
                        <img alt="Warm chocolate lava cake" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida/AEtjO1U48K4NkA9_YjeBZjEi6UUjsMpvAtAJ7JsbltRihM3EP5gQ__3OUJfGiKZtPFZC9vQ02UKkq7XeLiP1wULgEdWQfbIO6_Hj1FQqZ--8VmpgYnTdmSuD66BCZpeJUMuzhoax3HHSd1K_-_z3VwJNyiOQcsoBGDrV7uVXfI7WUI-Nbnu4-i2hL4mAElbXOVU3ys6S5uixJoUSj5CYPwOUwxY3hgVvyvuSU9sOt3bXU3BqbX7K7anXXZyDuwU" />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-ink/75 via-transparent to-transparent"></div>
                        <button aria-label="Add to favorites" className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface-bright/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer" onClick={() => toggleFavorite('chocolateroom')} type="button">
                          <span className={`material-symbols-outlined text-[18px] ${favorites['chocolateroom'] ? 'text-primary' : ''}`} style={{ fontVariationSettings: favorites['chocolateroom'] ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                        </button>
                        <div className="absolute bottom-2.5 left-2.5 bg-secondary text-surface-bright px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 border border-surface-bright/20">
                          <span className="material-symbols-outlined text-[12px]">redeem</span>
                          <span className="font-label-sm text-[9px] uppercase tracking-wider font-bold">BUY 1 GET 1</span>
                        </div>
                      </div>
                      <div className="p-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-headline-sm text-[15px] font-semibold text-on-surface truncate flex-1 cursor-pointer" onClick={() => navigate('/foodlistclient?restaurant=ChocolateRoom')}>The Chocolate Room</h4>
                          <div className="flex items-center gap-1 bg-tertiary text-on-tertiary px-1.5 py-0.5 rounded-md shrink-0">
                            <span className="font-label-sm text-[11px] font-bold">4.7</span>
                            <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 font-body-sm text-[12px] text-on-surface-variant">
                          <span className="flex items-center gap-0.5 font-medium text-on-surface">
                            <span className="material-symbols-outlined text-[14px] text-raw-ochre">schedule</span>
                            20 mins
                          </span>
                          <span>•</span>
                          <span className="truncate">Bakery, Desserts, Shakes</span>
                        </div>
                        <div className="mt-1 pt-1.5 border-t-0 bg-surface-container-low px-2 py-1 rounded-lg flex items-center justify-between text-on-surface-variant border border-surface-dim/40">
                          <span className="font-body-sm text-[11px]">Midnight Sweet Tooth</span>
                          <span className="font-label-sm text-[9px] text-tertiary uppercase font-bold">Top Pick</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. FLOATING QUICK CART NOTIFICATION */}
                <div className="px-margin pt-space-md">
                  <div className="flex items-center justify-between bg-charcoal-ink text-inverse-on-surface px-space-md py-3 rounded-2xl shadow-[0_8px_24px_rgba(25,24,22,0.22)] border border-surface-dim/20">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-8 h-8 rounded-full bg-botanical-sage flex items-center justify-center text-on-tertiary">
                        <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-[14px] font-semibold text-surface-bright leading-none">1 Item in Cart</span>
                        <span className="font-body-sm text-[12px] text-surface-variant mt-1 truncate max-w-[170px]">Toscano • Smoky BBQ Paneer</span>
                      </div>
                    </div>
                    <button className="flex items-center gap-1 bg-primary text-on-primary px-space-md py-1.5 rounded-full hover:bg-primary-container active:scale-95 transition-all shadow-sm cursor-pointer" type="button" onClick={() => navigate('/billing')}>
                      <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider">View Cart</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </main>
          ) : (
            /* ===================================================================== */
            /* B. MOBILE QUICK ORDER TAB VIEW                                        */
            /* ===================================================================== */
            <main className="flex flex-col relative w-full pt-16 pb-20 bg-surface">
              <div className="flex flex-col w-full">
                {/* Top Overlapping Category Tabs (Kit: Skinkind Botanical Style) */}
                <section className="px-margin pt-space-sm pb-space-xs">
                  <div className="grid grid-cols-2 gap-space-sm p-1.5 bg-surface-container rounded-2xl border border-surface-dim/40 shadow-sm">
                    {/* Inactive Food Tab */}
                    <button 
                      className="flex flex-col items-center justify-center py-2.5 px-space-md rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 active:scale-95 cursor-pointer" 
                      type="button"
                      onClick={() => setActiveTab('food')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">lunch_dining</span>
                        <span className="font-headline-sm text-[15px] font-medium text-on-surface">Food</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Delivery in 25m</span>
                    </button>
                    {/* Active Quick Order Tab with botanical warm terracotta accent */}
                    <button 
                      className="relative flex flex-col items-center justify-center py-2.5 px-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-surface-dim/30 transition-all duration-200 active:scale-95 cursor-pointer" 
                      type="button"
                      onClick={() => setActiveTab('quick')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>graphic_eq</span>
                        <span className="font-headline-sm text-[15px] font-bold text-primary">Quick Order</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse ml-0.5"></span>
                      </div>
                      <span className="font-label-sm text-label-sm text-primary mt-0.5 font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">mic</span> Voice Mode
                      </span>
                      <div className="absolute -bottom-1.5 w-8 h-1 bg-primary rounded-full shadow-[0_2px_6px_rgba(149,0,16,0.35)]"></div>
                    </button>
                  </div>
                </section>

                {/* Voice Assistant Hero Container */}
                <section className="px-margin pt-space-sm pb-space-md">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-surface-container-lowest via-surface-container-low to-surface-container p-space-lg shadow-[0_8px_24px_-4px_rgba(141,77,59,0.08),0_4px_12px_-2px_rgba(30,27,21,0.04)] border border-surface-dim/60">
                    {/* Decorative botanical ambient glow blobs */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-10 right-4 w-32 h-32 bg-raw-ochre/15 rounded-full blur-2xl pointer-events-none"></div>
                    {/* Header Prompt */}
                    <div className="relative text-center mb-space-sm">
                      <div className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-primary-fixed text-on-primary-fixed mb-space-xs border border-primary/20">
                        <span className="material-symbols-outlined text-[14px]">graphic_eq</span>
                        <span className="font-label-sm text-[10px] uppercase tracking-wider font-bold">Live Voice Order</span>
                      </div>
                      <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-semibold tracking-tight">Tap &amp; speak your craving</h1>
                      <p 
                        className="font-body-sm text-body-sm text-on-surface-variant mt-1 cursor-pointer hover:text-primary transition-colors underline decoration-dotted underline-offset-4"
                        onClick={() => {
                          const userCraving = window.prompt("Type your craving (e.g. 1 Farmhouse Pizza and 2 Cold Coffees):", mobileTranscript.startsWith("Listening...") || mobileTranscript.startsWith("Tap orb") ? "" : mobileTranscript);
                          if (userCraving && userCraving.trim()) {
                            submitMobileVoiceOrder(userCraving.trim());
                          }
                        }}
                        title="Tap to type craving"
                      >
                        “{mobileTranscript}”
                      </p>
                    </div>
                    {/* MatrixOrb Interactive Voice Visualizer */}
                    <div className="relative flex flex-col items-center justify-center my-space-xs">
                      <div aria-label="Toggle voice assistant state" className="relative flex items-center justify-center cursor-pointer group" id="orb-container" role="button" tabIndex="0" onClick={cycleOrbState}>
                        <div className="absolute inset-0 rounded-full bg-primary/5 blur-xl pointer-events-none transition-opacity duration-300 group-hover:opacity-100"></div>
                        <canvas ref={canvasRef} className="relative z-10 w-[190px] h-[190px] transition-transform active:scale-95 touch-manipulation" id="matrix-orb"></canvas>
                      </div>
                      {/* Dynamic State Status Pill / Button */}
                      <div className="mt-2 flex flex-col items-center">
                        <button className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-surface-dim/80 shadow-xs hover:bg-surface-container-high transition-all active:scale-95 cursor-pointer" id="orb-state-toggle" type="button" onClick={cycleOrbState}>
                          <span className={`w-2 h-2 rounded-full ${orbStateIndex === 0 ? 'bg-primary animate-pulse' : orbStateIndex === 1 ? 'bg-raw-ochre animate-ping' : 'bg-surface-dim'}`} id="orb-status-indicator"></span>
                          <span className={`font-label-md text-[11px] font-bold tracking-wider ${orbStateIndex === 0 ? 'text-primary' : orbStateIndex === 1 ? 'text-raw-ochre' : 'text-on-surface-variant'}`} id="orb-status-text">
                            {orbStateIndex === 0 ? 'LISTENING... (TAP TO PROCESS)' : orbStateIndex === 1 ? 'THINKING...' : 'TAP TO SPEAK 🎙️'}
                          </span>
                          <span className="material-symbols-outlined text-[14px] text-on-surface-variant">sync_alt</span>
                        </button>
                        <span className="font-body-sm text-[11px] text-on-surface-variant/80 mt-1">
                          {orbStateIndex === 0 ? 'Tap orb when done speaking' : orbStateIndex === 1 ? 'Matching dish with kitchen menu...' : 'Tap orb to start voice order · Tap text to type'}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Live Cart Detection State (Botanical Sage / Terracotta Accents) */}
                <section className="px-margin pb-space-md">
                  <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_4px_16px_rgba(30,27,21,0.05)] border border-surface-dim/60 cursor-pointer" onClick={() => navigate('/billing')}>
                    {/* Status Bar */}
                    <div className="flex items-center justify-between pb-space-sm border-b border-surface-dim/40">
                      <div className="flex items-center gap-space-xs">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-tertiary text-on-tertiary shadow-sm">
                          <span className="material-symbols-outlined text-[13px]">check</span>
                        </span>
                        <span className="font-headline-sm text-[15px] font-semibold text-on-surface">Got it! Adding to cart...</span>
                      </div>
                      <span className="px-space-sm py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[10px] font-bold border border-tertiary/20">1x Added</span>
                    </div>
                    {/* Item Preview Row */}
                    <div className="flex items-center gap-space-md pt-space-sm pb-space-sm">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-surface-container border border-surface-dim/50">
                        <img 
                          alt={mobileMatchedItem.fname} 
                          className="w-full h-full object-cover" 
                          src={mobileMatchedItem.image}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuALTjgUzSzn9bovRKCGYz-KLdWKW8EanwJaO7D4b2PjZe8CaTILOkdN973GuNhDR267TCtgsYPRX8CcYzFRJ-aVF7R9IAluJdtpWnSA0PbtI2odNuJ27ROJGQKWj9ltPP_KfTfaOHL9TGfN0i33IKagitxkt_FBSow9NrrT9-7pQYRSwcP0Lm7Rj_vsdEh4hbmwX-0U3lgjQ50FrAs8fA7V2LcSpu_mDw5_uyTUzFXN7pppHPGTaH9c";
                          }}
                        />
                        {/* Non-veg indicator */}
                        <div className="absolute top-1 left-1 bg-surface-container-lowest/90 backdrop-blur-xs p-0.5 rounded-sm shadow-xs">
                          {mobileMatchedItem.veg ? (
                            <div className="w-2.5 h-2.5 rounded-[2px] border border-tertiary flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                            </div>
                          ) : (
                            <div className="w-2.5 h-2.5 rounded-[2px] border border-error flex items-center justify-center">
                              <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-error"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-headline-sm text-[14px] font-semibold text-on-surface truncate">{mobileMatchedItem.fname}</h2>
                        <div className="flex items-center gap-space-xs mt-0.5">
                          <span className="font-headline-sm text-[15px] font-bold text-primary">₹{mobileMatchedItem.totalPrice}</span>
                          <span className="font-body-sm text-[12px] text-on-surface-variant line-through">₹{mobileMatchedItem.originalPrice}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-tertiary">
                          <span className="material-symbols-outlined text-[14px]">tune</span>
                          <span className="font-body-sm text-[12px] truncate font-medium">{mobileMatchedItem.customization}</span>
                        </div>
                      </div>
                    </div>
                    {/* Auto-Proceed Countdown Banner */}
                    <div className="mt-space-xs p-space-sm rounded-xl bg-surface-container-low border border-surface-dim/40" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-raw-ochre text-[16px]">timer</span>
                          <span className="font-label-sm text-[11px] text-on-surface font-medium" id="countdown-text">
                            {isMobileAutoConfirmActive ? (mobileAutoConfirmCanceled ? 'Auto-proceed paused' : 'Auto-proceeding to Checkout in 3s...') : 'Auto-proceeding to Checkout in 3s...'}
                          </span>
                        </div>
                        <button 
                          className="font-label-sm text-[11px] text-primary font-bold hover:underline cursor-pointer" 
                          type="button" 
                          onClick={() => {
                            setMobileAutoConfirmCanceled(prev => !prev);
                          }}
                        >
                          {isMobileAutoConfirmActive ? (mobileAutoConfirmCanceled ? 'Resume' : 'Pause') : 'Pause'}
                        </button>
                      </div>
                      {/* Progress Bar Indicator */}
                      <div className="w-full bg-surface-dim/60 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-clay-terracotta to-primary h-full rounded-full transition-all duration-1000"
                          style={{ width: isMobileAutoConfirmActive ? (mobileAutoConfirmCanceled ? '0%' : `${mobileAutoConfirmProgress}%`) : '100%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </main>
          )}

          {/* Mobile Bottom Navigation */}
          <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/95 backdrop-blur-xl border-t border-surface-dim/60 shadow-[0_-4px_20px_rgba(30,27,21,0.04)]" data-active-classes="text-primary">
            <div className="flex items-center justify-between h-16 px-space-sm">
              <a 
                aria-current={activeTab === 'food' ? 'page' : undefined}
                className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] flex-1 transition-colors ${activeTab === 'food' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`} 
                data-path="food-delivery" 
                href="#food"
                onClick={(e) => { e.preventDefault(); setActiveTab('food'); }}
              >
                <span className="material-symbols-outlined text-[22px]">lunch_dining</span>
                <span className={`font-label-sm text-[11px] mt-0.5 ${activeTab === 'food' ? 'font-bold' : ''}`}>Food</span>
              </a>
              <a 
                className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] flex-1 text-on-surface-variant hover:text-on-surface transition-colors" 
                data-path="reorder" 
                href="/account"
                onClick={(e) => { e.preventDefault(); navigate('/account'); }}
              >
                <span className="material-symbols-outlined text-[22px]">history</span>
                <span className="font-label-sm text-[11px] mt-0.5">Reorder</span>
              </a>
            </div>
          </nav>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. DESKTOP VERSION (MATCHING STITCH DESKTOP MOCKUPS PIXEL-FOR-PIXEL)      */
        /* ========================================================================= */
        <div className={`min-h-screen ${desktopTab === 'quick' ? 'bg-[#fff8ef] text-botanical-dark' : 'bg-[#FAF3E8]'} flex flex-col selection:bg-crimson selection:text-white`}>
          <DesktopNavbarAndModeBar
            desktopTab={desktopTab}
            setDesktopTab={setDesktopTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchSubmit={handleSearchSubmit}
            isVegOnly={isVegOnly}
            setIsVegOnly={setIsVegOnly}
            navigate={navigate}
            userNameDisplay={userNameDisplay}
            userInitials={userInitials}
          />
          {desktopTab === 'quick' ? (
            <DesktopQuickOrderContent
              navigate={navigate}
            />
          ) : (
            <DesktopFoodContent
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              navigate={navigate}
            />
          )}
        </div>
      )}
    </>
  );
}

export default Home;