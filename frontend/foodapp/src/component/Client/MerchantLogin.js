import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

function MerchantLogin({ syncAuth }) {
  const navigate = useNavigate();

  // Tab State: 'otp' | 'password'
  const [authMode, setAuthMode] = useState('otp');

  // Phone OTP States
  const [phone, setPhone] = useState("9845018290");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Username/Password States
  const [creds, setCreds] = useState({ uname: "", pass: "" });
  const [showPassword, setShowPassword] = useState(false);

  // General Loading & Keep Logged In
  const [isLoading, setIsLoading] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);

  // Refs for 6-digit OTP inputs
  const inputRefs = useRef([]);

  // Resend Countdown Timer Effect
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Format seconds as MM:SS
  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Handle OTP Digit Change & Auto-Focus next
  const handleDigitChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      // Clear current digit
      const newDigits = [...otpDigits];
      newDigits[index] = "";
      setOtpDigits(newDigits);
      return;
    }

    // If pasted multiple digits
    if (cleanVal.length > 1) {
      const pasted = cleanVal.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        if (pasted[i]) newDigits[i] = pasted[i];
      }
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    // Single digit
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal.slice(-1);
    setOtpDigits(newDigits);

    // Advance focus
    if (index < 5 && cleanVal) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace in OTP boxes
  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Send OTP handler
  const handleSendOtp = () => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid 10-digit registered mobile number");
      return;
    }

    setIsSendingOtp(true);
    axiosInstance.post("/register/otp/request", { identifier: cleanPhone })
      .then((res) => {
        setIsSendingOtp(false);
        setOtpSent(true);
        setResendCountdown(45);
        const demoOtp = res.data?.demoOtp;
        if (demoOtp) {
          // Auto-fill demo OTP for developer convenience
          const digits = demoOtp.slice(0, 6).split('');
          while (digits.length < 6) digits.push('');
          setOtpDigits(digits);
          toast.success(`Verification code dispatched! (Dev Code: ${demoOtp})`, { duration: 6000 });
        } else {
          toast.success(`6-digit verification code dispatched to +91 ${cleanPhone}`);
        }
        inputRefs.current[0]?.focus();
      })
      .catch((err) => {
        setIsSendingOtp(false);
        toast.error(err.response?.data?.error || "Could not dispatch verification code");
      });
  };

  // Verify Phone OTP and Sign In
  const handleOtpSignIn = (e) => {
    if (e) e.preventDefault();

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error("Please provide your registered mobile number");
      return;
    }

    const code = otpDigits.join('').trim();
    if (code.length < 6) {
      toast.error("Please enter the complete 6-digit verification code");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Authenticating kitchen terminal...");

    axiosInstance.post("/register/otp/verify", { identifier: cleanPhone, otpCode: code })
      .then((res) => {
        toast.dismiss(loadingToast);
        setIsLoading(false);
        const { token, username, role, name } = res.data;
        const rLower = role ? role.toLowerCase() : "";

        if (rLower !== "merchant" && rLower !== "admin") {
          toast.error("Account exists but is registered as Customer. Please use Customer sign-in.");
          return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", username);
        localStorage.setItem("role", role);
        if (name) localStorage.setItem("fullName", name);

        if (syncAuth) syncAuth();
        toast.success(`Welcome to Kitchen Command, ${name || username}! 👨‍🍳`);
        navigate('/foodlist');
      })
      .catch((err) => {
        toast.dismiss(loadingToast);
        setIsLoading(false);
        toast.error(err.response?.data?.error || "Invalid or expired verification code");
      });
  };

  // Password / Credentials Sign In
  const handlePasswordSignIn = (e) => {
    if (e) e.preventDefault();

    if (!creds.uname.trim()) {
      toast.error("Please enter your Merchant Username, Email, or Mobile Number");
      return;
    }
    if (!creds.pass) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Authenticating Merchant...");

    axiosInstance.post("/register/login", creds)
      .then((res) => {
        toast.dismiss(loadingToast);
        setIsLoading(false);
        const { token, username, role } = res.data;
        const rLower = role ? role.toLowerCase() : "";

        if (rLower !== "merchant" && rLower !== "admin") {
          toast.error("Account exists but is registered as Customer. Please use Customer sign-in.");
          return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", username);
        localStorage.setItem("role", role);

        if (syncAuth) syncAuth();
        toast.success(`Welcome to Merchant Portal, ${username}! 👨‍🍳`);
        navigate('/foodlist');
      })
      .catch((err) => {
        toast.dismiss(loadingToast);
        setIsLoading(false);
        if (err.response && err.response.status === 401) {
          toast.error("Invalid Merchant Username or Password");
        } else {
          toast.error(err.response?.data?.error || "Could not connect to server. Check connection.");
        }
      });
  };

  return (
    <div className="min-h-screen bg-[#FAF3E8] text-[#191816] flex flex-col selection:bg-[#C20019] selection:text-white font-sans antialiased">
      
      {/* ── STICKY HEADER ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#FAF3E8]/95 backdrop-blur-md border-b border-[#E8E1D5] transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-4 md:gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-8 shrink-0">
            <a 
              className="group flex items-center gap-1.5 cursor-pointer" 
              href="/" 
              onClick={(e) => { e.preventDefault(); navigate('/'); }}
            >
              <span className="text-xl md:text-2xl font-bold tracking-tighter uppercase font-serif text-[#C20019] group-hover:text-[#950010] transition-colors">
                ZAYKA
              </span>
              <span className="w-2 h-2 rounded-full bg-[#C20019] mb-1"></span>
            </a>
          </div>

          {/* Header Action */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => navigate('/merchant/register')}
              className="text-xs font-bold uppercase tracking-wider text-[#191816] hover:text-[#C20019] transition-colors cursor-pointer"
            >
              Register New Kitchen →
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-6 py-6 w-full space-y-8 md:space-y-10">
        
        {/* Switcher & Hero Header */}
        <div className="space-y-4 text-center md:text-left pt-2 pb-2">
          {/* Switcher Pill */}
          <div className="inline-flex bg-[#F3EAD8]/70 p-1.5 rounded-2xl border border-[#E8E1D5] shadow-inner">
            <button 
              className="flex items-center gap-2 px-5 md:px-6 py-2 rounded-xl text-[#7A766F] hover:text-[#191816] font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
              type="button"
              onClick={() => navigate('/merchant/register')}
            >
              REGISTER NEW KITCHEN
            </button>
            <button 
              className="flex items-center gap-2 px-5 md:px-6 py-2 rounded-xl bg-[#191816] text-white font-bold text-xs tracking-wider uppercase shadow-md transition-all cursor-default"
              type="button"
            >
              PARTNER SIGN IN
            </button>
          </div>

          {/* Hero Titles */}
          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#191816] tracking-tight leading-tight">
              Partner Sign In to <span className="italic font-normal text-[#C20019]">Zayka Kitchen</span>
            </h1>
            <p className="text-sm md:text-base text-[#4A4843] leading-relaxed">
              Access your live kitchen dispatch, order management, menu controls, and settlement analytics.
            </p>
          </div>
        </div>

        {/* ── TWO COLUMN PORTAL LAYOUT ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Sign In Application Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8E1D5] shadow-[0_8px_24px_-6px_rgba(25,24,22,0.06)] p-5 md:p-8 space-y-6">
            
            {/* Auth Method Tabs */}
            <div className="flex border-b border-[#E8E1D5]/60 pb-3 justify-between items-center text-xs font-semibold">
              <div className="flex space-x-6">
                <button
                  type="button"
                  onClick={() => setAuthMode('otp')}
                  className={`pb-2 text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                    authMode === 'otp'
                      ? 'text-[#C20019] border-b-2 border-[#C20019] -mb-[13px]'
                      : 'text-[#7A766F] hover:text-[#191816]'
                  }`}
                >
                  Phone OTP
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('password')}
                  className={`pb-2 text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                    authMode === 'password'
                      ? 'text-[#C20019] border-b-2 border-[#C20019] -mb-[13px]'
                      : 'text-[#7A766F] hover:text-[#191816]'
                  }`}
                >
                  Username &amp; Password
                </button>
              </div>
              <span className="text-[11px] text-[#7A766F] hidden sm:inline">
                Guild Security Standard
              </span>
            </div>

            {/* Form Container */}
            {authMode === 'otp' ? (
              /* ── PHONE OTP FLOW ───────────────────────────────────────────── */
              <form className="space-y-5" onSubmit={handleOtpSignIn}>
                {/* Mobile Number Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#191816] mb-1.5" htmlFor="merchantPhone">
                    Registered Merchant / Kitchen Mobile Number
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-mono font-bold text-[#7A766F] select-none">+91</span>
                    <input 
                      id="merchantPhone"
                      name="phone"
                      maxLength={10}
                      className="w-full pl-12 pr-28 py-3 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7]/50 text-[#191816] text-sm font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C20019] focus:border-[#C20019] transition-all" 
                      placeholder="98450 18290" 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                    <button 
                      className="absolute right-2 px-3 py-1.5 bg-[#191816] hover:bg-[#C20019] text-white text-[11px] font-bold rounded-lg uppercase tracking-wider transition-colors shadow-sm cursor-pointer disabled:opacity-50" 
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp || (resendCountdown > 0 && otpSent)}
                    >
                      {isSendingOtp ? "Sending..." : resendCountdown > 0 ? `Resend (${resendCountdown}s)` : otpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-[11px] text-[#7A766F]">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-emerald-700" fill="currentColor" viewBox="0 0 20 20">
                        <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                      </svg>
                      OTP dispatched via SMS &amp; WhatsApp
                    </span>
                    {resendCountdown > 0 && (
                      <span className="font-mono font-medium text-[#C20019]">
                        Resend code in {formatCountdown(resendCountdown)}
                      </span>
                    )}
                  </div>
                </div>

                {/* 6-Digit OTP Input Boxes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#191816]">
                      Enter 6-Digit Verification Code
                    </label>
                    <span className="font-mono text-[11px] text-[#7A766F] tracking-widest">
                      Code: {otpDigits.map((d) => (d ? d : '•')).join(' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-6 gap-2 sm:gap-3">
                    {otpDigits.map((digit, index) => {
                      const isFilled = Boolean(digit);
                      return (
                        <input 
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          placeholder="•"
                          onChange={(e) => handleDigitChange(index, e.target.value)}
                          onKeyDown={(e) => handleDigitKeyDown(index, e)}
                          className={`w-full py-2.5 sm:py-3 text-center font-mono font-bold text-base sm:text-lg rounded-xl transition-all ${
                            isFilled
                              ? 'border-2 border-[#C20019] bg-white text-[#191816] shadow-sm'
                              : 'border border-[#E8E1D5] bg-[#FDFBF7]/60 text-[#191816] focus:bg-white focus:border-[#C20019]'
                          } focus:outline-none focus:ring-1 focus:ring-[#C20019]`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Keep Logged In & Help Row */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-[#4A4843] select-none">
                    <input 
                      type="checkbox"
                      checked={keepLoggedIn}
                      onChange={(e) => setKeepLoggedIn(e.target.checked)}
                      className="rounded border-[#E8E1D5] text-[#C20019] focus:ring-[#C20019] cursor-pointer" 
                    />
                    <span>Keep Kitchen Terminal logged in (30 days)</span>
                  </label>
                  <a 
                    className="text-[#C20019] font-medium hover:underline text-[11px] cursor-pointer" 
                    href="#help"
                    onClick={(e) => {
                      e.preventDefault();
                      toast("For merchant credential support, contact support@zayka.kitchen or use OTP login.", { icon: "ℹ️" });
                    }}
                  >
                    Trouble Signing In?
                  </a>
                </div>

                {/* Primary Sign In CTA */}
                <div className="pt-2 space-y-3">
                  <button 
                    className="w-full bg-[#C20019] hover:bg-[#950010] text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50" 
                    type="submit"
                    disabled={isLoading}
                  >
                    <span>{isLoading ? "VERIFYING PASSCODE..." : "SIGN IN TO KITCHEN COMMAND"}</span>
                    <span className="text-base leading-none">→</span>
                  </button>
                </div>

                {/* Bottom Register Switch */}
                <div className="border-t border-[#E8E1D5]/60 pt-4 text-center">
                  <p className="text-xs text-[#7A766F]">
                    Not yet an approved partner?{' '}
                    <a 
                      className="text-[#C20019] font-bold hover:underline cursor-pointer" 
                      href="/merchant/register"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/merchant/register');
                      }}
                    >
                      Register New Kitchen →
                    </a>
                  </p>
                </div>
              </form>
            ) : (
              /* ── USERNAME & PASSWORD FLOW ──────────────────────────────────── */
              <form className="space-y-5" onSubmit={handlePasswordSignIn}>
                {/* Username / Email Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#191816] mb-1.5" htmlFor="merchantUname">
                    Merchant Username / Official Email / Phone
                  </label>
                  <input 
                    id="merchantUname"
                    name="uname"
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7]/50 text-[#191816] text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C20019] focus:border-[#C20019] transition-all" 
                    placeholder="e.g. admin or artisanheart_8290" 
                    type="text" 
                    value={creds.uname}
                    onChange={(e) => setCreds({ ...creds, uname: e.target.value })}
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#191816]" htmlFor="merchantPass">
                      Kitchen Portal Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-[#7A766F] hover:text-[#191816] font-medium cursor-pointer"
                    >
                      {showPassword ? "Hide Password" : "Show Password"}
                    </button>
                  </div>
                  <input 
                    id="merchantPass"
                    name="pass"
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7]/50 text-[#191816] text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C20019] focus:border-[#C20019] transition-all" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"} 
                    value={creds.pass}
                    onChange={(e) => setCreds({ ...creds, pass: e.target.value })}
                    required
                  />
                </div>

                {/* Keep Logged In & Help Row */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-[#4A4843] select-none">
                    <input 
                      type="checkbox"
                      checked={keepLoggedIn}
                      onChange={(e) => setKeepLoggedIn(e.target.checked)}
                      className="rounded border-[#E8E1D5] text-[#C20019] focus:ring-[#C20019] cursor-pointer" 
                    />
                    <span>Keep Kitchen Terminal logged in (30 days)</span>
                  </label>
                  <a 
                    className="text-[#C20019] font-medium hover:underline text-[11px] cursor-pointer" 
                    href="#help"
                    onClick={(e) => {
                      e.preventDefault();
                      toast("Use Phone OTP login if you have forgotten your password.", { icon: "💡" });
                      setAuthMode('otp');
                    }}
                  >
                    Trouble Signing In?
                  </a>
                </div>

                {/* Primary Sign In CTA */}
                <div className="pt-2 space-y-3">
                  <button 
                    className="w-full bg-[#C20019] hover:bg-[#950010] text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50" 
                    type="submit"
                    disabled={isLoading}
                  >
                    <span>{isLoading ? "AUTHENTICATING..." : "SIGN IN TO KITCHEN COMMAND"}</span>
                    <span className="text-base leading-none">→</span>
                  </button>
                </div>

                {/* Bottom Register Switch */}
                <div className="border-t border-[#E8E1D5]/60 pt-4 text-center">
                  <p className="text-xs text-[#7A766F]">
                    Not yet an approved partner?{' '}
                    <a 
                      className="text-[#C20019] font-bold hover:underline cursor-pointer" 
                      href="/merchant/register"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/merchant/register');
                      }}
                    >
                      Register New Kitchen →
                    </a>
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: Live Kitchen Operations Hub ──────────────────────── */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="space-y-2 text-left">
              <h2 className="text-2xl font-serif font-bold text-[#191816]">Live Kitchen Operations Hub</h2>
              <p className="text-xs text-[#7A766F]">Synchronized terminal commands directly integrated with Zayka delivery logistics.</p>
            </div>

            {/* Operational Status Card 1: Live Sync */}
            <div className="bg-white rounded-2xl border border-[#E8E1D5] p-5 shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(25,24,22,0.06)] transition-all space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold font-serif text-[#C20019]">&lt; 0.8s</span>
                <span className="text-[10px] font-mono uppercase tracking-wider bg-[#FAF3E8] text-[#191816] px-2 py-0.5 rounded font-bold">
                  Live Sync
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#191816]">Live Orders &amp; Dispatch Management</h3>
              <p className="text-xs text-[#4A4843] leading-relaxed">
                Instantaneous KOT tickets routing straight to thermal station printers with automated rider assignment.
              </p>
            </div>

            {/* Operational Status Card 2: Inventory Toggle */}
            <div className="bg-white rounded-2xl border border-[#E8E1D5] p-5 shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(25,24,22,0.06)] transition-all space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold font-serif text-emerald-800">82 Items</span>
                <span className="text-[10px] font-mono uppercase tracking-wider bg-[#FAF3E8] text-[#191816] px-2 py-0.5 rounded font-bold">
                  In Stock
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#191816]">Instant Menu &amp; Inventory Toggle</h3>
              <p className="text-xs text-[#4A4843] leading-relaxed">
                Active micro-batches across categories. Pause dishes in real-time when fresh prep runs low or adjust batch pricing with zero lag.
              </p>
            </div>

            {/* Operational Status Card 3: Weekly Settlement */}
            <div className="bg-white rounded-2xl border border-[#E8E1D5] p-5 shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(25,24,22,0.06)] transition-all space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold font-serif text-[#191816]">Tuesday 10 AM</span>
                <span className="text-[10px] font-mono uppercase tracking-wider bg-[#FAF3E8] text-[#191816] px-2 py-0.5 rounded font-bold">
                  Weekly Settlement
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#191816]">Transparent 12% Flat Rate</h3>
              <p className="text-xs text-[#4A4843] leading-relaxed">
                Weekly automated payouts directly into your merchant account with detailed itemized GST &amp; fee breakdown.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="mt-16 md:mt-20 border-t border-[#E8E1D5] bg-[#F3EAD8]/60 pt-10 pb-16 text-[#191816]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xl font-bold tracking-tighter uppercase font-serif text-[#C20019]">
              ZAYKA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C20019] mb-0.5"></span>
          </div>
          <p className="text-xs text-[#7A766F] max-w-sm mx-auto">
            Authorized merchant and kitchen staff terminal access only.
          </p>
          <div className="text-[11px] text-[#7A766F]">
            © {new Date().getFullYear()} Zayka Food Technologies Pvt. Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MerchantLogin;
