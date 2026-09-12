import React from 'react';

function RegisterMobile({
  formData,
  setFormData,
  handleRegisterSubmit,
  navigate
}) {
  return (
    <div className="min-h-screen flex justify-center items-start sm:py-6 text-zayka-dark bg-[#fbf6ee] w-full font-sans antialiased">
      <main className="w-full max-w-[420px] min-h-screen flex flex-col justify-between px-4 py-6 bg-[#fbf6ee] sm:shadow-2xl sm:rounded-[36px] sm:min-h-[850px] sm:border sm:border-[#efe6d5]">
        <div className="w-full">
          {/* Header Section */}
          <header className="flex flex-col items-center pt-2 pb-5 text-center cursor-pointer" onClick={() => navigate('/')}>
            {/* Zayka Official Logo Image */}
            <div className="h-9 mb-6 flex items-center justify-center">
              <img 
                alt="Zayka Brand Logo" 
                className="h-7 w-auto object-contain" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3gevOzzpamvU4KCoZ5OJY-W0KqIn6dG5rlcrLeDgr3ZY6Own3g_xU-ro6H-e_hDAfW0tZq42gmKs07Q1P5SpxppsgFesJY7kWw4Cwwz1MYtY7BUh6nsqWv6Wr4HMCB7LCkeOY_uPedYA8_awP2Hjl_bYwhlRU4v3hbY1dbY3RKvUVd7UZXr3b5hbwjIgTfGilk3DPSsnRFHj7TEIPzOaF24wJT4XcrEqIWeV9PnLBTb31KuBMRPhwkQ4MMa_u8QKdeg"
              />
            </div>
            {/* Headline & Editorial Subtitle */}
            <h1 className="text-[28px] leading-tight font-normal tracking-tight text-zayka-dark font-serif px-2">
              Create your Zayka account
            </h1>
          </header>

          {/* SignUp Card */}
          <section className="bg-white rounded-[28px] p-5 sm:p-6 shadow-editorial border border-[#f0e8d9]">
            {/* Social Quick Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {/* Google Sign Up */}
              <button 
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#ded5c2] bg-white active:bg-[#fbf7f0] transition-colors cursor-pointer" 
                type="button"
                onClick={() => alert("Connecting to Google registration...")}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4"></path>
                  <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z" fill="#34A853"></path>
                  <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" fill="#FBBC05"></path>
                  <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"></path>
                </svg>
                <span className="text-[11px] font-semibold tracking-widest text-[#2c2b28] uppercase">GOOGLE</span>
              </button>

              {/* Apple Sign Up */}
              <button 
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#ded5c2] bg-white active:bg-[#fbf7f0] transition-colors cursor-pointer" 
                type="button"
                onClick={() => alert("Connecting to Apple ID registration...")}
              >
                <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.07-7.66-7.85-11.91-14.34-6.42-9.78-11.45-21.2-15.08-34.27-3.63-13.06-5.45-25.13-5.45-36.21 0-15.09 3.78-27.57 11.35-37.44 7.57-9.87 17.06-14.93 28.47-15.19 4.35 0 9.28 1.17 14.78 3.52 5.51 2.34 9.4 3.57 11.68 3.69 1.9 0 5.92-1.3 12.06-3.91 6.13-2.61 11.66-3.74 16.59-3.41 12.72.63 22.84 4.96 30.36 12.98-10.96 6.64-16.32 15.82-16.08 27.54.26 9.27 3.82 17.09 10.68 23.47 6.86 6.38 15.03 10.02 24.51 10.93-2.11 6.6-4.75 13.02-7.91 19.26zM119.22 31.42c0-7.39 2.67-14.51 8.01-21.36 5.34-6.85 11.97-10.74 19.9-11.68.21 1.05.32 2.05.32 3 0 7.39-2.73 14.5-8.19 21.33-5.46 6.84-12.18 10.74-20.16 11.71-.11-1-.18-2-.18-3z"></path>
                </svg>
                <span className="text-[11px] font-semibold tracking-widest text-[#2c2b28] uppercase">APPLE</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="border-t border-[#ede4d4] w-full"></div>
              <span className="bg-white px-3 text-[10px] uppercase tracking-[0.18em] font-medium text-[#999182] absolute">
                OR REGISTER WITH ZAYKA
              </span>
            </div>

            {/* Registration Form */}
            <form className="space-y-4" onSubmit={handleRegisterSubmit}>
              {/* Full Name Field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold tracking-[0.16em] text-[#3e3b35] uppercase">
                  FULL NAME <span className="text-zayka-crimson font-serif text-xs">*</span>
                </label>
                <div className="relative flex items-center bg-[#f4ede2] rounded-xl px-3.5 py-3 border border-transparent focus-within:border-[#ded2be]">
                  <svg className="w-4 h-4 text-[#797367] mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"></path>
                  </svg>
                  <input 
                    className="w-full bg-transparent border-0 p-0 text-sm text-[#272522] focus:ring-0 focus:border-0 font-normal outline-none" 
                    placeholder="e.g. Aman Verma" 
                    required 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              {/* Contact Number Field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold tracking-[0.16em] text-[#3e3b35] uppercase">
                  CONTACT NUMBER <span className="text-zayka-crimson font-serif text-xs">*</span>
                </label>
                <div className="relative flex items-center bg-[#f4ede2] rounded-xl px-3.5 py-3 border border-transparent focus-within:border-[#ded2be]">
                  <svg className="w-4 h-4 text-[#797367] mr-2.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect height="20" rx="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" width="10" x="7" y="2"></rect>
                    <path d="M11 18h2" strokeLinecap="round" strokeWidth="1.8"></path>
                  </svg>
                  <span className="text-xs font-semibold text-[#4a453e] pr-2.5 mr-2.5 border-r border-[#ded2be] select-none">
                    +91
                  </span>
                  <input 
                    className="w-full bg-transparent border-0 p-0 text-sm text-[#272522] focus:ring-0 focus:border-0 font-normal tracking-wide outline-none font-mono" 
                    placeholder="98765 43210" 
                    required 
                    type="tel" 
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>
              </div>

              {/* Email Address Field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold tracking-[0.16em] text-[#3e3b35] uppercase">
                  EMAIL ADDRESS <span className="text-zayka-crimson font-serif text-xs">*</span>
                </label>
                <div className="relative flex items-center bg-[#f4ede2] rounded-xl px-3.5 py-3 border border-transparent focus-within:border-[#ded2be]">
                  <svg className="w-4 h-4 text-[#797367] mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"></path>
                  </svg>
                  <input 
                    className="w-full bg-transparent border-0 p-0 text-sm text-[#272522] focus:ring-0 focus:border-0 font-normal outline-none" 
                    placeholder="aman.verma@domain.com" 
                    required 
                    type="email" 
                    value={formData.emailAddress}
                    onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold tracking-[0.16em] text-[#3e3b35] uppercase">
                  PASSWORD <span className="text-zayka-crimson font-serif text-xs">*</span>
                </label>
                <div className="relative flex items-center bg-[#f4ede2] rounded-xl px-3.5 py-3 border border-transparent focus-within:border-[#ded2be]">
                  <span className="material-symbols-outlined text-[18px] text-[#797367] mr-3 shrink-0">lock</span>
                  <input 
                    className="w-full bg-transparent border-0 p-0 text-sm text-[#272522] focus:ring-0 focus:border-0 font-normal outline-none" 
                    placeholder="Create your secure password" 
                    required 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              {/* Microcopy Disclaimer */}
              <p className="pt-1.5 pb-1 text-[11px] leading-relaxed text-[#7a7469] text-center font-normal px-2">
                By creating an account, you agree to Zayka’s{' '}
                <button type="button" className="underline underline-offset-2 hover:text-[#322f2a] bg-transparent border-0 p-0 cursor-pointer">
                  Terms of Service
                </button>{' '}
                &amp;{' '}
                <button type="button" className="underline underline-offset-2 hover:text-[#322f2a] bg-transparent border-0 p-0 cursor-pointer">
                  Privacy Policy
                </button>
                , including our Cold-Chain &amp; Sensory Precision assurance protocols.
              </p>

              {/* Primary Call to Action */}
              <button 
                className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl bg-zayka-crimson active:bg-zayka-crimsonHover text-white text-xs sm:text-[13px] font-semibold tracking-[0.14em] uppercase shadow-sm transition duration-150 cursor-pointer" 
                type="submit"
              >
                CREATE ACCOUNT &amp; CONTINUE →
              </button>
            </form>

            {/* Existing Account Row */}
            <div className="mt-3.5 bg-[#f4ede2] rounded-xl p-3 flex items-center justify-between text-xs">
              <span className="text-[#5c564b] font-normal pl-1">Already registered in our circle?</span>
              <button 
                className="font-bold tracking-wider text-zayka-crimson uppercase text-[11px] flex items-center hover:opacity-80 bg-transparent border-0 cursor-pointer" 
                onClick={() => navigate('/login')}
                type="button"
              >
                SIGN IN <span className="ml-1 text-sm font-normal">↗</span>
              </button>
            </div>
          </section>
        </div>

        {/* Footer Copyright */}
        <footer className="py-5 text-center">
          <p className="text-[11px] font-mono tracking-tight text-[#8c8476]">
            © 2026 Zayka Botanical Kitchens. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default RegisterMobile;
