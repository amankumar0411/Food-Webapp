import React, { useState, useRef } from 'react';

function LoginDesktop({
  creds,
  setCreds,
  performLogin,
  phoneNumber,
  setPhoneNumber,
  handleRequestOtp,
  otpSent,
  otpCode,
  setOtpCode,
  handleVerifyOtp,
  resendCountdown,
  handleResendOtp,
  navigate
}) {
  const [activeTab, setActiveTab] = useState('phone'); // 'phone' | 'email'
  const otpInputRefs = useRef([]);

  // Handles 6-box OTP input logic
  const handleSingleOtpChange = (index, value) => {
    const char = value.slice(-1);
    const otpArray = otpCode.padEnd(6, ' ').split('');
    otpArray[index] = char || ' ';
    const newOtp = otpArray.join('').trimEnd();
    setOtpCode(newOtp);

    // Auto-advance
    if (char && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleSingleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpCode[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#B82025]/10 selection:text-[#B82025] bg-[#FAF5ED] text-[#1A1817] font-sans antialiased w-full">
      {/* Main Content Container */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[490px] flex flex-col items-center">
          
          {/* Brand Logo Header */}
          <div className="mb-8 flex justify-center cursor-pointer" onClick={() => navigate('/')}>
            <a aria-label="Zayka Home" className="transition-opacity hover:opacity-85" href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
              <img 
                alt="ZAYKA" 
                className="h-10 sm:h-11 w-auto object-contain" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcT_q2WDbmMjwBYHyz8whBDj376WevnCepybf3xXPuwAQp7LKWNT_9lcWcB-0Aelswk3Zqo0CTnxrR8I4RFvvitoKpbAMt5CsxSzTzDpitxWII0HfFbw67kVpsMTEm3OhI-3Ye6OLTVLDCDzW5Zbapr0O28GpVqhfgJ9NEH2dvHrrUPW_s0nAPABkhK2sqi6wU_HFpR0eGKgIo1nLev0ZxTMG6TeydDv7QOF27oThmL3dN7x3mXfFMRJDjRxcdcZc6YA"
              />
            </a>
          </div>

          {/* Welcome Header */}
          <header className="text-center mb-8 px-2">
            <h1 className="font-display text-3xl sm:text-[34px] font-bold text-stone-900 tracking-tight mb-2.5">
              Welcome back
            </h1>
            <p className="text-brand-muted text-sm sm:text-base font-normal max-w-sm mx-auto leading-relaxed">
              Sign in to access your saved kitchens, past orders, and curated botanical taste profile.
            </p>
          </header>

          {/* Auth Tab Switcher */}
          <div aria-label="Authentication Method" className="w-full bg-[#EFE7D8] p-1.5 rounded-2xl flex items-center gap-1.5 mb-6 shadow-inner" role="tablist">
            {/* Tab: Phone OTP */}
            <button 
              aria-selected={activeTab === 'phone'} 
              className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 text-xs font-mono tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === 'phone' 
                  ? 'bg-white shadow-sm font-bold text-stone-900 border border-black/5' 
                  : 'text-stone-600 font-semibold hover:text-stone-900'
              }`} 
              onClick={() => setActiveTab('phone')} 
              role="tab" 
              type="button"
            >
              <svg aria-hidden="true" className={`w-4 h-4 ${activeTab === 'phone' ? 'text-brand-crimson' : 'text-stone-600 opacity-80'}`} fill="currentColor" viewBox="0 0 24 24">
                <circle cx="6" cy="6" r="1.7"></circle>
                <circle cx="12" cy="6" r="1.7"></circle>
                <circle cx="18" cy="6" r="1.7"></circle>
                <circle cx="6" cy="12" r="1.7"></circle>
                <circle cx="12" cy="12" r="1.7"></circle>
                <circle cx="18" cy="12" r="1.7"></circle>
                <circle cx="6" cy="18" r="1.7"></circle>
                <circle cx="12" cy="18" r="1.7"></circle>
                <circle cx="18" cy="18" r="1.7"></circle>
              </svg>
              <span>PHONE OTP</span>
            </button>

            {/* Tab: Email & Password */}
            <button 
              aria-selected={activeTab === 'email'} 
              className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 text-xs font-mono tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === 'email' 
                  ? 'bg-white shadow-sm font-bold text-stone-900 border border-black/5' 
                  : 'text-stone-600 font-semibold hover:text-stone-900'
              }`} 
              onClick={() => setActiveTab('email')} 
              role="tab" 
              type="button"
            >
              <svg aria-hidden="true" className={`w-4 h-4 ${activeTab === 'email' ? 'text-stone-800' : 'text-stone-600 opacity-80'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect height="14" rx="2" width="20" x="2" y="5"></rect>
                <path d="m2 7 10 7 10-7"></path>
              </svg>
              <span>EMAIL &amp; PASSWORD</span>
            </button>
          </div>

          {/* Authentication Card */}
          <div className="w-full bg-white rounded-3xl p-7 sm:p-9 shadow-[0_12px_40px_-15px_rgba(40,30,20,0.07)] border border-[#EBE3D6]">
            {/* PHONE OTP VIEW */}
            {activeTab === 'phone' && (
              <div className="space-y-6">
                {!otpSent ? (
                  /* Step 1: Request OTP */
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block font-mono text-[11px] font-bold text-stone-600 tracking-editorial" htmlFor="desktop-phone-number">
                          MOBILE PHONE NUMBER
                        </label>
                        <span className="font-mono text-[10px] text-stone-500 uppercase">SMS OTP Verification</span>
                      </div>
                      <div className="relative flex items-center rounded-xl bg-brand-inputBg border border-[#E7DDCE] focus-within:border-stone-800 focus-within:ring-1 focus-within:ring-stone-800 transition duration-150 overflow-hidden">
                        {/* Country Code Prefix */}
                        <div className="flex items-center gap-1.5 pl-4 pr-3 py-3.5 border-r border-[#E0D5C3] bg-[#F1E8D9]/70 text-stone-800 font-mono text-[13px] font-semibold select-none">
                          <span className="text-base leading-none">🇮🇳</span>
                          <span>+91</span>
                          <svg className="w-3 h-3 text-stone-500 ml-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="m19.5 8.25-7.5 7.5-7.5-7.5" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </div>
                        {/* Phone Input */}
                        <input 
                          autoComplete="tel" 
                          className="w-full bg-transparent text-stone-900 font-mono text-[15px] px-4 py-3.5 border-0 focus:ring-0 focus:outline-none placeholder:text-stone-400 placeholder:font-sans" 
                          id="desktop-phone-number" 
                          name="phoneNumber" 
                          placeholder="98765 43210" 
                          required 
                          type="tel" 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                      <p className="text-[11px] text-stone-500 font-sans mt-2">
                        We'll text you a 6-digit authentication passcode to verify your patron profile.
                      </p>
                    </div>

                    {/* Request OTP Button */}
                    <div className="pt-1">
                      <button 
                        className="w-full bg-[#181615] hover:bg-[#252220] active:scale-[0.99] text-white font-mono text-[12px] font-bold tracking-editorial py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-150 shadow-md hover:shadow-lg cursor-pointer" 
                        onClick={handleRequestOtp} 
                        type="button"
                      >
                        <span>REQUEST OTP</span>
                        <svg aria-hidden="true" className="w-4 h-4 text-stone-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Step 2: Verify OTP */
                  <div className="space-y-6">
                    <div className="bg-[#FAF5ED] rounded-2xl p-4 border border-[#E7DDCE] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                          ✓
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">Passcode sent to</p>
                          <p className="text-xs font-mono font-bold text-stone-900">+91 {phoneNumber}</p>
                        </div>
                      </div>
                      <button 
                        className="text-xs font-mono text-brand-crimson hover:underline font-bold tracking-wide cursor-pointer" 
                        onClick={() => handleRequestOtp(false)} 
                        type="button"
                      >
                        EDIT
                      </button>
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] font-bold text-stone-600 tracking-editorial mb-3 text-center">
                        ENTER 6-DIGIT VERIFICATION CODE
                      </label>
                      <div className="flex justify-between gap-2 sm:gap-2.5">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <input 
                            key={i}
                            ref={(el) => (otpInputRefs.current[i] = el)}
                            className="w-11 h-13 sm:w-12 sm:h-14 bg-brand-inputBg text-center font-mono font-bold text-xl text-stone-900 rounded-xl border border-[#E7DDCE] focus:border-stone-800 focus:ring-1 focus:ring-stone-800 outline-none transition duration-150" 
                            inputMode="numeric" 
                            maxLength="1" 
                            type="text" 
                            value={otpCode[i] || ''}
                            onChange={(e) => handleSingleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleSingleOtpKeyDown(i, e)}
                          />
                        ))}
                      </div>
                      {/* Resend Timer */}
                      <div className="flex items-center justify-between mt-4 px-1 text-xs font-mono">
                        <span className="text-stone-500">Didn't receive code?</span>
                        {resendCountdown > 0 ? (
                          <span className="text-stone-400 font-bold">
                            Resend OTP in <span>{resendCountdown}s</span>
                          </span>
                        ) : (
                          <button 
                            className="text-brand-crimson hover:underline cursor-pointer font-bold transition-colors" 
                            onClick={handleResendOtp} 
                            type="button"
                          >
                            RESEND OTP
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Verify Button */}
                    <div className="pt-1">
                      <button 
                        className="w-full bg-[#181615] hover:bg-[#252220] active:scale-[0.99] text-white font-mono text-[12px] font-bold tracking-editorial py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-150 shadow-md hover:shadow-lg cursor-pointer" 
                        onClick={handleVerifyOtp} 
                        type="button"
                      >
                        <span>VERIFY &amp; PROCEED</span>
                        <svg aria-hidden="true" className="w-4 h-4 text-stone-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect height="10" rx="2" stroke="currentColor" width="16" x="4" y="11"></rect>
                          <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* EMAIL & PASSWORD VIEW */}
            {activeTab === 'email' && (
              <form 
                className="space-y-6" 
                onSubmit={(e) => { e.preventDefault(); performLogin(); }}
              >
                {/* Email Address Input Field */}
                <div>
                  <label className="block font-mono text-[11px] font-bold text-stone-600 tracking-editorial mb-2" htmlFor="desktop-email">
                    EMAIL ADDRESS / USERNAME
                  </label>
                  <div className="relative">
                    <input 
                      autoComplete="username" 
                      className="w-full bg-brand-inputBg text-stone-900 font-sans text-[15px] px-4 py-3.5 rounded-xl border border-[#E7DDCE] focus:border-stone-800 focus:ring-1 focus:ring-stone-800 transition duration-150 outline-none placeholder:text-stone-400" 
                      id="desktop-email" 
                      name="email" 
                      placeholder="patron@zayka.kitchen" 
                      required 
                      type="text" 
                      value={creds.uname}
                      onChange={(e) => setCreds({ ...creds, uname: e.target.value })}
                    />
                  </div>
                </div>

                {/* Password Input Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-mono text-[11px] font-bold text-stone-600 tracking-editorial" htmlFor="desktop-password">
                      PASSWORD
                    </label>
                    <button 
                      type="button"
                      className="font-mono text-[11px] font-bold text-brand-crimson hover:text-brand-crimsonHover underline underline-offset-4 tracking-wider transition-colors cursor-pointer bg-transparent border-0" 
                      onClick={() => alert("Password reset link has been dispatched to your email.")}
                    >
                      FORGOT?
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      autoComplete="current-password" 
                      className="w-full bg-brand-inputBg text-stone-900 tracking-widest text-[17px] px-4 py-3 rounded-xl border border-[#E7DDCE] focus:border-stone-800 focus:ring-1 focus:ring-stone-800 transition duration-150 outline-none" 
                      id="desktop-password" 
                      name="password" 
                      required 
                      type="password" 
                      value={creds.pass}
                      onChange={(e) => setCreds({ ...creds, pass: e.target.value })}
                    />
                  </div>
                </div>

                {/* Primary Submit Button */}
                <div className="pt-1">
                  <button 
                    className="w-full bg-[#181615] hover:bg-[#252220] active:scale-[0.99] text-white font-mono text-[12px] font-bold tracking-editorial py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-150 shadow-md hover:shadow-lg cursor-pointer" 
                    type="submit"
                  >
                    <span>AUTHENTICATE PATRON</span>
                    <svg aria-hidden="true" className="w-4 h-4 text-stone-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect height="10" rx="2" stroke="currentColor" width="16" x="4" y="11"></rect>
                      <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Social Alternative Sign In */}
          <section aria-label="Alternative Login Methods" className="w-full mt-7">
            {/* Divider Line */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-full border-t border-[#E5DCce]"></div>
              <span className="absolute bg-[#FAF5ED] px-4 font-mono text-[11px] font-medium tracking-editorial text-stone-500">
                OR SIGN IN WITH
              </span>
            </div>

            {/* Social Buttons Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* Google Button */}
              <button 
                className="flex items-center justify-center gap-2.5 py-3 px-4 bg-white hover:bg-stone-50/90 active:scale-[0.99] rounded-xl border border-[#E8DFC8] font-mono text-[11px] font-bold text-stone-800 tracking-wider shadow-sm transition-all cursor-pointer" 
                type="button"
                onClick={() => alert("Connecting to Google authentication...")}
              >
                <svg aria-hidden="true" className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" fill="#4285F4"></path>
                  <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" fill="#34A853"></path>
                  <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z" fill="#FBBC05"></path>
                  <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"></path>
                </svg>
                <span>GOOGLE</span>
              </button>

              {/* Apple Button */}
              <button 
                className="flex items-center justify-center gap-2.5 py-3 px-4 bg-white hover:bg-stone-50/90 active:scale-[0.99] rounded-xl border border-[#E8DFC8] font-mono text-[11px] font-bold text-stone-800 tracking-wider shadow-sm transition-all cursor-pointer" 
                type="button"
                onClick={() => alert("Connecting to Apple ID authentication...")}
              >
                <svg aria-hidden="true" className="w-4 h-4 shrink-0 fill-current text-stone-900" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.7-7.94-12.04-14.58-6.19-9.52-11.13-20.67-14.81-33.45-3.69-12.78-5.54-24.87-5.54-36.27 0-14.42 3.52-26.68 10.57-36.78 7.05-10.1 16.14-15.28 27.27-15.54 4.58 0 9.87 1.25 15.86 3.75 6 2.5 10.02 3.79 12.07 3.87 1.63 0 5.86-1.32 12.71-3.95 6.84-2.63 12.44-3.82 16.79-3.56 12.57.88 22.84 5.39 30.82 13.53-11.05 6.69-16.44 16.12-16.18 28.29.26 9.4 3.96 17.26 11.11 23.59 7.15 6.33 15.68 9.88 25.59 10.66-2.01 6.33-4.55 12.87-7.62 19.63zM119.22 32.64c0-7.39 2.65-14.47 7.95-21.25 5.3-6.77 12.05-10.98 20.25-12.63.13 1.05.2 2.05.2 3 0 7.39-2.73 14.51-8.19 21.36-5.46 6.84-12.28 10.96-20.47 12.35-.26-.92-.39-1.87-.39-2.83z"></path>
                </svg>
                <span>APPLE ID</span>
              </button>
            </div>
          </section>

          {/* Guild Registration Link */}
          <footer className="mt-8 text-center">
            <p className="text-xs sm:text-[13px] text-stone-600 font-sans">
              New patron to the Zayka guild? 
              <button 
                className="font-mono font-bold text-brand-crimson hover:text-brand-crimsonHover underline underline-offset-4 tracking-wider ml-1 transition-colors cursor-pointer bg-transparent border-0" 
                onClick={() => navigate('/register')}
                type="button"
              >
                CREATE ACCOUNT
              </button>
            </p>

            {/* Merchant & Driver Portal links */}
            <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-center gap-4 text-xs font-mono">
              <a href="/merchant/login" className="text-stone-500 hover:text-stone-900 transition-colors">
                Merchant Portal &rarr;
              </a>
              <span className="text-stone-300">•</span>
              <a href="/driver/login" className="text-stone-500 hover:text-stone-900 transition-colors">
                Driver Portal &rarr;
              </a>
            </div>
          </footer>

        </div>
      </main>

      {/* Desktop Utility Footer */}
      <footer className="py-4 text-center text-[11px] font-mono text-stone-600/70">
        <p>© 2026 Zayka Botanical Kitchens. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LoginDesktop;
