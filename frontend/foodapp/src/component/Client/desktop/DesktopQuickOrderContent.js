import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import toast from 'react-hot-toast';

function DesktopQuickOrderContent({
  navigate,
  refreshCart
}) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoConfirmProgress, setAutoConfirmProgress] = useState(100);
  const [autoConfirmCanceled, setAutoConfirmCanceled] = useState(false);
  const [isAutoConfirmActive, setIsAutoConfirmActive] = useState(false);
  const [transcript, setTranscript] = useState("1 Artisanal Pepperoni Pizza with stuffed crust");
  const [confidence, setConfidence] = useState("98.4%");
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState("");
  
  const [matchedItem, setMatchedItem] = useState({
    fid: "F101",
    fname: "Artisanal Pepperoni Pizza",
    subtitle: "Crust & Co. Pizzeria • 11.5 inch medium",
    customization: "Customizing: Stuffed Crust Cheese Burst",
    qty: 1,
    unitPrice: 399.0,
    totalPrice: 399.0,
    originalPrice: 499.0,
    discountBadge: "20% OFF",
    veg: false,
    image: "https://lh3.googleusercontent.com/aida/AEtjO1Ui_cOF5_kyu5jYWSYHLw0VHAGEQm019f7ZqZeJQhX9QF7PwcyobJB-LsMa7UqbXRvQ7qLgvE8vnRCeVV_bxErTPL1lL7_sAUmwze8qAMMwR79uGtOyjLELrsBqidP4n32kCmvoBDRoTNOckfcaew9_gBXu2O7p5vU6hOS0IvXjceDBq5tHYeyQqsKN67rxW_mw9ok56OwazEoqS3Lq8W8zeCVJ8EdNzofatZQnldM1zMBV7RcdDZQwPa4"
  });

  const recognitionRef = useRef(null);
  const transcriptRef = useRef(transcript);
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Extract current user from storage
  const rawAuth = localStorage.getItem("user");
  let currentUser = "aman";
  if (rawAuth) {
    try {
      const parsed = rawAuth.startsWith("{") ? JSON.parse(rawAuth) : null;
      currentUser = parsed?.username || rawAuth;
    } catch (e) {
      currentUser = rawAuth;
    }
  }

  // Derived orb state: 'Listening' | 'Thinking' | 'Idle'
  const orbState = isProcessing ? 'Thinking' : isListening ? 'Listening' : 'Idle';

  // Core Voice Order Handler - Connects to Spring Boot backend
  const submitVoiceOrder = (text) => {
    if (!text || !text.trim()) {
      toast.error("Please say or type a dish craving.");
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
    setIsProcessing(true);
    setTranscript(text);

    toast.loading("Finding matches in kitchen menu...", { id: 'voice-order' });

    axiosInstance.post("/api/voice-order/text", {
      transcript: text,
      uname: currentUser
    })
    .then((res) => {
      setIsProcessing(false);
      toast.dismiss('voice-order');
      if (res.data?.matchedItems && res.data.matchedItems.length > 0) {
        const item = res.data.matchedItems[0];
        setMatchedItem({
          fid: item.fid || "F101",
          fname: item.fname || text,
          subtitle: "Crust & Co. Pizzeria • Freshly Prepared",
          customization: item.customization || "Customizing: Chef Special Seasoning",
          qty: item.qty || 1,
          unitPrice: item.unitPrice || 399.0,
          totalPrice: item.totalPrice || (item.unitPrice ? item.unitPrice * (item.qty || 1) : 399.0),
          originalPrice: (item.totalPrice ? item.totalPrice + 100 : 499.0),
          discountBadge: "20% OFF",
          veg: item.veg !== undefined ? item.veg : false,
          image: item.image || "https://lh3.googleusercontent.com/aida/AEtjO1Ui_cOF5_kyu5jYWSYHLw0VHAGEQm019f7ZqZeJQhX9QF7PwcyobJB-LsMa7UqbXRvQ7qLgvE8vnRCeVV_bxErTPL1lL7_sAUmwze8qAMMwR79uGtOyjLELrsBqidP4n32kCmvoBDRoTNOckfcaew9_gBXu2O7p5vU6hOS0IvXjceDBq5tHYeyQqsKN67rxW_mw9ok56OwazEoqS3Lq8W8zeCVJ8EdNzofatZQnldM1zMBV7RcdDZQwPa4"
        });
        toast.success(`Matched: ${item.fname}! Added to cart 🌿`);
        if (refreshCart) refreshCart();
        setAutoConfirmCanceled(false);
        setAutoConfirmProgress(100);
        setIsAutoConfirmActive(true);
      } else {
        toast.error("Could not match dish in menu. Try saying Margherita, Pepperoni, or Biryani.");
      }
    })
    .catch((err) => {
      setIsProcessing(false);
      toast.dismiss('voice-order');
      console.error("Voice order error:", err);
      toast.error("Could not process voice order. Please try again.");
    });
  };

  // Helper to start fresh speech recognition
  const startListening = async () => {
    if (isProcessing) return;

    // Stop any existing instance
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast("Voice recognition not supported in this browser. Use 'Edit text' to enter your craving!");
      handleEditTextClick();
      return;
    }

    // Request microphone permission first so browser prompt appears reliably
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        console.warn("Microphone access prompt error:", err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          toast.error("Microphone permission was denied. Please allow microphone access in your browser bar.");
          return;
        }
      }
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      // Default to user browser language if English, otherwise fallback
      recognition.lang = (navigator.language && navigator.language.startsWith('en')) ? navigator.language : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("Listening... Speak your order now 🎙️");
        toast("Listening... Speak your craving now 🎙️", { id: 'voice-active' });
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        let latestConfidence = null;

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            final += res[0].transcript + ' ';
          } else {
            interim += res[0].transcript;
          }
          if (res[0].confidence > 0) {
            latestConfidence = res[0].confidence;
          }
        }

        const fullText = (final + interim).trim();
        if (fullText) {
          setTranscript(fullText);
          if (latestConfidence) {
            setConfidence(`${Math.round(latestConfidence * 100)}% Confidence`);
          } else {
            setConfidence("98% Confidence");
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          toast.error("Microphone permission denied. Please allow microphone access in your browser bar.");
        } else if (event.error === 'no-speech') {
          toast("No speech detected. Speak closer to your microphone or click Edit text.", { id: 'no-speech' });
        } else if (event.error === 'network') {
          toast.error("Speech service network error. Try again or click Edit text to order.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        const current = transcriptRef.current;
        if (current && !current.startsWith("Listening...") && current.trim().length > 2) {
          // Auto-submit recognized craving when user stops speaking!
          submitVoiceOrder(current.trim());
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn("Recognition start error:", e);
      toast.error("Could not start microphone. Click 'Edit text' to enter craving.");
      handleEditTextClick();
    }
  };

  const stopListeningAndSubmit = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
    const current = transcriptRef.current;
    if (current && !current.startsWith("Listening...")) {
      submitVoiceOrder(current);
    } else {
      submitVoiceOrder("1 Artisanal Pepperoni Pizza with stuffed crust");
    }
  };

  const toggleVoiceInteraction = () => {
    if (isListening) {
      stopListeningAndSubmit();
    } else {
      startListening();
    }
  };

  // Clean up any ongoing recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  // Auto-confirm countdown timer to /billing (only active after an item is matched)
  useEffect(() => {
    if (!isAutoConfirmActive || autoConfirmCanceled) return;
    const interval = setInterval(() => {
      setAutoConfirmProgress(prev => {
        if (prev <= 5) {
          clearInterval(interval);
          navigate('/billing');
          return 0;
        }
        return prev - 5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isAutoConfirmActive, autoConfirmCanceled, navigate]);

  // Keyboard shortcut: Spacebar toggles listening state when not typing in inputs
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault();
        toggleVoiceInteraction();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening, isProcessing]);

  const handleEditTextClick = () => {
    setEditedTranscript(transcript.startsWith("Listening...") ? "" : transcript);
    setIsEditingTranscript(true);
  };

  const handleSaveEditedText = (e) => {
    e.preventDefault();
    if (editedTranscript.trim()) {
      setIsEditingTranscript(false);
      submitVoiceOrder(editedTranscript);
    }
  };

  return (
    <div className="flex-grow flex flex-col justify-between">
      {/* MAIN CONTENT: 2-Column Voice Studio & Live Order Resolution Grid matching desktop-quick-order.html */}
      <main className="max-w-[1440px] mx-auto px-8 py-8 flex-1 w-full space-y-12">
        <div className="grid grid-cols-12 gap-8">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Voice Orb & Live Transcript Studio (7 Cols)                  */}
          {/* ========================================================================= */}
          <section 
            className="col-span-12 lg:col-span-7 bg-white rounded-3xl border border-botanical-border shadow-warm-md p-8 relative overflow-hidden flex flex-col justify-between min-h-[640px]" 
            data-purpose="voice-interactive-orb"
          >
            {/* Subtle matrix dot radial background */}
            <div className="absolute inset-0 bg-matrix-dots opacity-40 pointer-events-none"></div>

            {/* Voice Studio Top Bar */}
            <div className="relative z-10 flex items-center justify-between border-b border-botanical-border/60 pb-5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-crimson/10 text-crimson text-[11px] font-mono font-bold tracking-wider uppercase">
                  Live Conversational Ordering
                </span>
              </div>
              {/* Mic Sensitivity Switch */}
              <div className="flex items-center gap-2 text-xs text-botanical-muted font-mono">
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
                  className={`relative group w-36 h-36 rounded-full bg-gradient-to-br from-crimson to-crimson-dark flex flex-col items-center justify-center text-white shadow-orb-glow transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-crimson/30 cursor-pointer ${
                    orbState === 'Thinking' ? 'ring-4 ring-amber-400/50 animate-pulse' : orbState === 'Listening' ? 'ring-4 ring-crimson/40 animate-pulse' : ''
                  }`}
                  onClick={toggleVoiceInteraction}
                >
                  {/* Audio Wave Visualizer Bars inside center button */}
                  <div className="flex items-center gap-1.5 h-7 mb-1">
                    <span className={`w-1 bg-white rounded-full ${orbState === 'Listening' ? 'wave-bar' : 'h-2'}`}></span>
                    <span className={`w-1 bg-white rounded-full ${orbState === 'Listening' ? 'wave-bar' : 'h-3'}`}></span>
                    <span className={`w-1 bg-white rounded-full ${orbState === 'Listening' ? 'wave-bar' : 'h-4'}`}></span>
                    <span className={`w-1 bg-white rounded-full ${orbState === 'Listening' ? 'wave-bar' : 'h-3'}`}></span>
                    <span className={`w-1 bg-white rounded-full ${orbState === 'Listening' ? 'wave-bar' : 'h-2'}`}></span>
                  </div>
                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase">
                    {orbState === 'Listening' ? 'Listening' : orbState === 'Thinking' ? 'Thinking' : 'Tap to Speak'}
                  </span>
                </button>
              </div>

              {/* Status Indicator Pill */}
              <div className="mt-4 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-botanical-surface border border-botanical-border text-[11px] font-mono text-botanical-dark">
                  <span className={`w-2 h-2 rounded-full ${orbState === 'Listening' ? 'bg-crimson animate-pulse' : orbState === 'Thinking' ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></span>
                  {orbState === 'Listening' ? 'LISTENING • INDIRANAGAR KITCHEN' : orbState === 'Thinking' ? 'THINKING • MATCHING DISH...' : 'READY • INDIRANAGAR KITCHEN'}
                </span>
              </div>
              <p className="text-[11px] text-botanical-muted font-mono mt-2">
                Tap or hit Spacebar to start or stop: <span className="text-botanical-dark font-medium">Listening · Thinking · Idle</span>
              </p>
            </div>

            {/* Live Transcript Card Container */}
            <div className="relative z-10 bg-botanical-surface rounded-2xl p-4 border border-botanical-border shadow-warm-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold uppercase tracking-wider text-botanical-dark">Live Transcript</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold">{confidence}</span>
                </div>
                <button 
                  className="text-crimson hover:underline text-xs font-medium flex items-center gap-1 cursor-pointer"
                  onClick={handleEditTextClick}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  Edit text
                </button>
              </div>

              {isEditingTranscript ? (
                <form onSubmit={handleSaveEditedText} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-white border border-botanical-border rounded-xl px-3 py-1.5 text-xs text-botanical-dark focus:ring-1 focus:ring-crimson focus:border-crimson"
                    value={editedTranscript}
                    onChange={(e) => setEditedTranscript(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="px-3 py-1 bg-crimson text-white text-xs font-bold rounded-xl cursor-pointer">
                    Order
                  </button>
                  <button type="button" onClick={() => setIsEditingTranscript(false)} className="px-3 py-1 bg-stone-200 text-stone-700 text-xs font-bold rounded-xl cursor-pointer">
                    Cancel
                  </button>
                </form>
              ) : (
                /* Verbatim recognized text */
                <p className="font-serif italic text-base text-botanical-dark leading-relaxed">
                  “{transcript}”
                </p>
              )}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Real-Time Order Resolution & Predictive Cart (5 Cols)       */}
          {/* ========================================================================= */}
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
                  {matchedItem?.qty || 1}x Added
                </span>
              </div>

              {/* Product Detailed Box */}
              <div className="flex gap-4 p-3.5 bg-botanical-surface rounded-2xl border border-botanical-border/80">
                {/* Product Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-botanical-border/40">
                  <img 
                    alt={matchedItem?.fname || "Artisanal Pepperoni Pizza"} 
                    className="w-full h-full object-cover" 
                    src={matchedItem?.image || "https://lh3.googleusercontent.com/aida/AEtjO1Ui_cOF5_kyu5jYWSYHLw0VHAGEQm019f7ZqZeJQhX9QF7PwcyobJB-LsMa7UqbXRvQ7qLgvE8vnRCeVV_bxErTPL1lL7_sAUmwze8qAMMwR79uGtOyjLELrsBqidP4n32kCmvoBDRoTNOckfcaew9_gBXu2O7p5vU6hOS0IvXjceDBq5tHYeyQqsKN67rxW_mw9ok56OwazEoqS3Lq8W8zeCVJ8EdNzofatZQnldM1zMBV7RcdDZQwPa4"} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://lh3.googleusercontent.com/aida/AEtjO1Ui_cOF5_kyu5jYWSYHLw0VHAGEQm019f7ZqZeJQhX9QF7PwcyobJB-LsMa7UqbXRvQ7qLgvE8vnRCeVV_bxErTPL1lL7_sAUmwze8qAMMwR79uGtOyjLELrsBqidP4n32kCmvoBDRoTNOckfcaew9_gBXu2O7p5vU6hOS0IvXjceDBq5tHYeyQqsKN67rxW_mw9ok56OwazEoqS3Lq8W8zeCVJ8EdNzofatZQnldM1zMBV7RcdDZQwPa4";
                    }}
                  />
                  <div className="absolute top-1.5 left-1.5 w-4 h-4 bg-white/90 rounded flex items-center justify-center p-0.5 shadow-sm">
                    {/* veg / non-veg mark */}
                    {matchedItem?.veg ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 block"></span>
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-crimson block"></span>
                    )}
                  </div>
                </div>

                {/* Product Information */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm text-botanical-dark truncate">
                      {matchedItem?.fname || "Artisanal Pepperoni Pizza"}
                    </h3>
                    <p className="text-xs text-botanical-muted truncate">
                      {matchedItem?.subtitle || "Crust & Co. Pizzeria • 11.5 inch medium"}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-botanical-muted">
                      <svg className="w-3 h-3 text-crimson" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                      <span className="text-botanical-dark font-medium">
                        {matchedItem?.customization || "Customizing: Stuffed Crust Cheese Burst"}
                      </span>
                    </div>
                  </div>

                  {/* Pricing line */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-mono font-bold text-crimson text-base">
                      ₹{matchedItem?.totalPrice || matchedItem?.unitPrice || 399}
                    </span>
                    <span className="font-mono text-xs text-botanical-muted line-through">
                      ₹{matchedItem?.originalPrice || 499}
                    </span>
                    <span className="text-[10px] font-mono bg-crimson/10 text-crimson px-1.5 py-0.5 rounded font-bold">
                      {matchedItem?.discountBadge || "20% OFF"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Countdown Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-botanical-muted flex items-center gap-1.5">
                    <svg className={`w-3.5 h-3.5 text-botanical-muted ${isAutoConfirmActive && !autoConfirmCanceled ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    {isAutoConfirmActive 
                      ? (autoConfirmCanceled ? 'Auto-confirm paused' : 'Auto-confirming in 3s...') 
                      : 'Dish ready in order'}
                  </span>
                  {isAutoConfirmActive && (
                    <button 
                      className="text-crimson font-bold hover:underline cursor-pointer"
                      onClick={() => setAutoConfirmCanceled(!autoConfirmCanceled)}
                    >
                      {autoConfirmCanceled ? 'Resume' : 'Cancel'}
                    </button>
                  )}
                </div>
                {/* Progress Line */}
                <div className="w-full bg-botanical-border h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-crimson h-full rounded-full transition-all duration-1000" 
                    style={{ width: isAutoConfirmActive ? (autoConfirmCanceled ? '0%' : `${autoConfirmProgress}%`) : '100%' }}
                  ></div>
                </div>
              </div>

              {/* Interactive Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  className="w-full py-2.5 rounded-xl border border-botanical-border text-botanical-dark text-xs font-bold hover:bg-botanical-surface transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  onClick={startListening}
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

      {/* BEGIN: MainEditorialFooter */}
      <footer className="bg-botanical-surface border-t border-botanical-border mt-16 pt-12 pb-8 text-botanical-muted text-xs">
        <div className="max-w-[1440px] mx-auto px-8">
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

export default DesktopQuickOrderContent;
