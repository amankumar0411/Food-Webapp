import React, { useState } from 'react';

function LoginMobile({
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
  const [authMode, setAuthMode] = useState('otp'); // 'otp' | 'email'
  const [dispatchState, setDispatchState] = useState('idle'); // 'idle' | 'dispatching' | 'dispatched'

  const handleMobileRequestOtp = () => {
    setDispatchState('dispatching');
    handleRequestOtp();
    setTimeout(() => {
      setDispatchState('dispatched');
      setTimeout(() => {
        setDispatchState('idle');
      }, 2500);
    }, 800);
  };

  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md flex flex-col min-h-screen antialiased selection:bg-secondary-container w-full">
      <main className="flex-1 flex flex-col relative w-full pt-safe pb-safe bg-surface max-w-md mx-auto">
        <div className="flex flex-col w-full px-margin-sm py-space-md">
          {/* Editorial Headline Section & Brand Logo */}
          <div className="flex justify-center items-center mb-space-lg pt-2 cursor-pointer" onClick={() => navigate('/')}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG7Xug8HHwC0BRS_sw38PfHE9p5da7wnPDQhFDW_cEJdqtCqVGA290nzITOjRUkmGeScijI4XFNRicEJJK3y5pSOiwZ3_kOSNvrLoGURwKQNwKME6eZiFiYhu4dvVw4mGIX7sotHKR2LCm2tT2YdTq0FnBDrX7LicLp4gZQbzCq-VoWGt6sIma9xPQZ_85WtyEjcofpRPzZdEDWrGum_HWnDYlh-yztbYmJ_vD4qa4YRtPQEUZaWyV0NXVO0zaCU7Ecw" 
              alt="ZAYKA" 
              className="h-9 w-auto object-contain" 
            />
          </div>

          <div className="mb-space-lg">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight mb-space-xs">
              Welcome back
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Sign in to access your saved kitchens, past orders, and curated botanical taste profile.
            </p>
          </div>

          {/* Authentication Mode Switcher */}
          <div className="bg-surface-container-high p-1 rounded-lg flex items-center mb-space-lg" id="authModeTabs" role="tablist">
            <button 
              aria-selected={authMode === 'otp'} 
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md font-label-sm text-label-sm tracking-wider uppercase transition-all ${
                authMode === 'otp' 
                  ? 'bg-surface-container-lowest text-charcoal-ink shadow-sm font-semibold' 
                  : 'bg-transparent text-on-surface-variant'
              }`} 
              onClick={() => setAuthMode('otp')} 
              role="tab" 
              type="button"
            >
              <span className="material-symbols-outlined text-base text-clay-terracotta">dialpad</span>
              <span>Phone OTP</span>
            </button>
            <button 
              aria-selected={authMode === 'email'} 
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md font-label-sm text-label-sm tracking-wider uppercase transition-all ${
                authMode === 'email' 
                  ? 'bg-surface-container-lowest text-charcoal-ink shadow-sm font-semibold' 
                  : 'bg-transparent text-on-surface-variant'
              }`} 
              onClick={() => setAuthMode('email')} 
              role="tab" 
              type="button"
            >
              <span className="material-symbols-outlined text-base">mail</span>
              <span>Email &amp; PASSWORD</span>
            </button>
          </div>

          {/* Input Form Container */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm mb-space-lg">
            {/* Phone OTP View */}
            {authMode === 'otp' && (
              <div className="space-y-space-md mb-space-md">
                {!otpSent ? (
                  <>
                    <div>
                      <label className="block font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="mobileInput">
                        Mobile Number
                      </label>
                      <div className="flex items-center gap-2">
                        {/* Country Code Picker Pill */}
                        <div className="bg-surface-container-low px-3 py-3 rounded-lg flex items-center gap-1.5 cursor-pointer select-none">
                          <span className="font-label-sm text-label-sm text-on-surface font-bold">IN +91</span>
                          <span className="material-symbols-outlined text-xs text-outline">expand_more</span>
                        </div>
                        {/* Primary Field Input */}
                        <div className="flex-1 relative">
                          <input 
                            className="w-full bg-surface-container-low px-3 py-3 rounded-lg font-label-md text-label-md text-charcoal-ink tracking-wider focus:outline-none focus:bg-surface-container" 
                            id="mobileInput" 
                            inputMode="numeric" 
                            maxLength="12" 
                            placeholder="98450 12345" 
                            type="tel" 
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                          <span className="material-symbols-outlined absolute right-3 top-3 text-botanical-sage text-lg">verified_user</span>
                        </div>
                      </div>
                    </div>
                    {/* Security Guidance Callout */}
                    <div className="flex items-start gap-2 bg-surface-container-low p-2.5 rounded-lg">
                      <span className="material-symbols-outlined text-clay-terracotta text-sm mt-0.5">encrypted</span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-[0.8rem] leading-tight">
                        A 6-digit cryptographic passcode will be dispatched via SMS &amp; WhatsApp.
                      </p>
                    </div>
                    {/* Main Action Button */}
                    <button 
                      className="w-full bg-primary-container hover:bg-primary text-on-primary py-3.5 px-4 rounded-lg font-label-sm text-label-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform" 
                      onClick={handleMobileRequestOtp} 
                      type="button"
                    >
                      <span>
                        {dispatchState === 'idle' && 'Request Secure Passcode'}
                        {dispatchState === 'dispatching' && 'DISPATCHING CRYPTO-KEY...'}
                        {dispatchState === 'dispatched' && 'PASSCODE DISPATCHED ✓'}
                      </span>
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                  </>
                ) : (
                  /* OTP Verification Step */
                  <div className="space-y-space-md">
                    <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-botanical-sage text-lg">check_circle</span>
                        <div>
                          <span className="block font-label-sm text-[10px] text-on-surface-variant uppercase">Passcode sent to</span>
                          <span className="font-label-md text-xs font-bold text-on-surface">+91 {phoneNumber}</span>
                        </div>
                      </div>
                      <button 
                        className="font-label-sm text-xs text-clay-terracotta font-bold hover:underline" 
                        onClick={() => handleRequestOtp(false)}
                        type="button"
                      >
                        CHANGE
                      </button>
                    </div>

                    <div>
                      <label className="block font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                        6-Digit Security Code
                      </label>
                      <input 
                        className="w-full bg-surface-container-low text-center tracking-[0.4em] font-mono font-bold text-xl py-3 rounded-lg border border-outline-variant focus:outline-none focus:bg-surface-container" 
                        maxLength="6"
                        placeholder="••••••"
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant">
                      <span>Didn't receive code?</span>
                      {resendCountdown > 0 ? (
                        <span>Resend in {resendCountdown}s</span>
                      ) : (
                        <button 
                          className="text-primary font-bold hover:underline" 
                          onClick={handleResendOtp}
                          type="button"
                        >
                          RESEND CODE
                        </button>
                      )}
                    </div>

                    <button 
                      className="w-full bg-primary-container hover:bg-primary text-on-primary py-3.5 px-4 rounded-lg font-label-sm text-label-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform" 
                      onClick={handleVerifyOtp} 
                      type="button"
                    >
                      <span>Verify &amp; Proceed</span>
                      <span className="material-symbols-outlined text-base">lock_open</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Email & Key View */}
            {authMode === 'email' && (
              <form 
                className="space-y-space-md mb-space-md" 
                onSubmit={(e) => { e.preventDefault(); performLogin(); }}
              >
                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="emailField">
                    EMAIL ADDRESS / USERNAME
                  </label>
                  <input 
                    className="w-full bg-surface-container-low px-3 py-3 rounded-lg font-body-sm text-body-sm text-charcoal-ink focus:outline-none focus:bg-surface-container" 
                    id="emailField" 
                    placeholder="patron@zayka.kitchen" 
                    type="text"
                    value={creds.uname}
                    onChange={(e) => setCreds({ ...creds, uname: e.target.value })}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant" htmlFor="passwordField">
                      PASSWORD
                    </label>
                    <button 
                      className="font-label-sm text-[0.6875rem] text-clay-terracotta uppercase tracking-wider underline" 
                      type="button"
                      onClick={() => alert("Password reset link has been dispatched to your email.")}
                    >
                      Forgot?
                    </button>
                  </div>
                  <input 
                    className="w-full bg-surface-container-low px-3 py-3 rounded-lg font-body-sm text-body-sm text-charcoal-ink focus:outline-none focus:bg-surface-container" 
                    id="passwordField" 
                    placeholder="••••••••••••" 
                    type="password"
                    value={creds.pass}
                    onChange={(e) => setCreds({ ...creds, pass: e.target.value })}
                  />
                </div>
                <button 
                  className="w-full bg-charcoal-ink hover:bg-primary text-surface py-3.5 px-4 rounded-lg font-label-sm text-label-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform cursor-pointer" 
                  type="submit"
                >
                  <span>Authenticate Patron</span>
                  <span className="material-symbols-outlined text-base">lock_open</span>
                </button>
              </form>
            )}
          </div>

          {/* Soft Hairline Divider with Badge */}
          <div className="relative flex items-center justify-center my-space-sm mb-space-lg">
            <div className="w-full h-px bg-surface-container-highest"></div>
            <span className="absolute bg-surface px-3 font-label-sm text-label-sm tracking-widest text-outline uppercase text-[0.6875rem]">
              Or sign in with
            </span>
          </div>

          {/* Social Fast Authentications */}
          <div className="grid grid-cols-2 gap-3 mb-space-lg">
            <button 
              className="flex items-center justify-center gap-2 py-3 px-3 bg-surface-container-lowest hover:bg-surface-container rounded-lg shadow-sm text-charcoal-ink font-label-sm text-label-sm tracking-wider uppercase active:scale-[0.98] transition-transform" 
              type="button"
              onClick={() => alert("Connecting to Google authentication...")}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
              </svg>
              <span>Google</span>
            </button>
            <button 
              className="flex items-center justify-center gap-2 py-3 px-3 bg-surface-container-lowest hover:bg-surface-container rounded-lg shadow-sm text-charcoal-ink font-label-sm text-label-sm tracking-wider uppercase active:scale-[0.98] transition-transform" 
              type="button"
              onClick={() => alert("Connecting to Apple ID authentication...")}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.9.04-2 .6-2.63 1.34-.56.64-1.04 1.71-.91 2.74 1 .08 2.01-.48 2.62-1.21Z"></path>
              </svg>
              <span>Apple ID</span>
            </button>
          </div>

          {/* Secondary Actions and Guild Registration Link */}
          <div className="space-y-space-md mb-space-md text-center">
            <div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">New patron to the Zayka guild? </span>
              <button 
                className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider underline hover:text-clay-terracotta ml-1 cursor-pointer" 
                type="button"
                onClick={() => navigate('/register')}
              >
                Create Account
              </button>
            </div>

            {/* Merchant & Driver Portals Switch */}
            <div className="pt-4 border-t border-surface-container-highest/60 flex items-center justify-center gap-4 text-xs font-mono">
              <a href="/merchant/login" className="text-secondary hover:text-primary transition-colors">
                Merchant Partner &rarr;
              </a>
              <span className="text-outline-variant">•</span>
              <a href="/driver/login" className="text-raw-ochre hover:text-primary transition-colors">
                Delivery Driver &rarr;
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginMobile;
