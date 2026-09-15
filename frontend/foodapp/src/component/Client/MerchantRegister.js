import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const CULINARY_CRAFTS = [
  "Artisanal Woodfired",
  "Heritage Awadhi",
  "Slow-Ferment Patisserie",
  "Gourmet Burgers & Grills",
  "Artisanal Gelato & Desserts",
  "Micro-Batch Asian & Bowls",
  "Coastal & Regional Heritage"
];

const HUB_SECTORS = [
  "Bangalore — East (Indiranagar / Koramangala)",
  "Bangalore — Central (Lavelle Road)",
  "Bangalore — South (JP Nagar)",
  "Mumbai — Bandra West",
  "Delhi — South Ex / GK"
];

const CAPACITIES = [
  { id: "BOUTIQUE", label: "Boutique", orders: "<50 orders/day" },
  { id: "ATELIER", label: "Atelier", orders: "50–150 orders/day" },
  { id: "SCALE", label: "Scale", orders: "150+ orders/day" }
];

function MerchantRegister() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    restaurantName: "",
    fssaiNumber: "",
    culinaryCraft: "Artisanal Woodfired",
    contactName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    hubSector: "Bangalore — East (Indiranagar / Koramangala)",
    capacity: "ATELIER",
    zeroSyntheticCommitment: true,
    bioPackagingCommitment: true
  });

  // UI Interactive States
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState(null);

  // OTP Verification States
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // FSSAI Lookup States
  const [isCheckingFssai, setIsCheckingFssai] = useState(false);
  const [fssaiStatus, setFssaiStatus] = useState(null); // { valid: bool, message: string }

  // Header Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // FSSAI Auto-Lookup / Verification
  const handleFssaiLookup = () => {
    const clean = formData.fssaiNumber.replace(/\D/g, '');
    if (!clean) {
      toast.error("Please enter a 14-digit FSSAI License Number");
      return;
    }
    if (clean.length !== 14) {
      setFssaiStatus({
        valid: false,
        message: `Current length is ${clean.length} digits. FSSAI License must be exactly 14 digits.`
      });
      toast.error("FSSAI License must be exactly 14 digits");
      return;
    }

    setIsCheckingFssai(true);
    axiosInstance.get(`/register/fssai/check/${clean}`)
      .then((res) => {
        setIsCheckingFssai(false);
        if (res.data.available) {
          setFssaiStatus({
            valid: true,
            message: "14-digit FSSAI License format verified & available for kitchen registration"
          });
          toast.success("FSSAI license verified & available ✓");
        } else {
          setFssaiStatus({
            valid: false,
            message: "This FSSAI License is already registered with another kitchen."
          });
          toast.error("FSSAI number is already registered in Guild system");
        }
      })
      .catch((err) => {
        setIsCheckingFssai(false);
        setFssaiStatus({
          valid: false,
          message: err.response?.data?.error || "FSSAI validation failed. Please check format."
        });
      });
  };

  // OTP Send
  const handleSendOtp = () => {
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsSendingOtp(true);
    axiosInstance.post("/register/otp/request", { identifier: cleanPhone })
      .then((res) => {
        setIsSendingOtp(false);
        setOtpSent(true);
        setResendCountdown(30);
        const demoOtp = res.data?.demoOtp;
        if (demoOtp) {
          setOtpCode(demoOtp);
          toast.success(`Verification code dispatched! (Dev Code: ${demoOtp})`, { duration: 6000 });
        } else {
          toast.success(`6-digit passcode dispatched to +91 ${cleanPhone}`);
        }

        // Countdown timer
        const timer = setInterval(() => {
          setResendCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      })
      .catch((err) => {
        setIsSendingOtp(false);
        toast.error(err.response?.data?.error || "Could not dispatch verification code. Try again.");
      });
  };

  // OTP Verification
  const handleVerifyOtp = () => {
    const cleanPhone = formData.phone.replace(/\D/g, '');
    const code = otpCode.trim();
    if (code.length < 6) {
      toast.error("Please enter the complete 6-digit passcode");
      return;
    }

    setIsVerifyingOtp(true);
    axiosInstance.post("/register/otp/verify-phone", { identifier: cleanPhone, otpCode: code })
      .then((res) => {
        setIsVerifyingOtp(false);
        if (res.data.verified) {
          setIsOtpVerified(true);
          toast.success("Mobile number verified with cryptographic passcode ✓");
        }
      })
      .catch((err) => {
        setIsVerifyingOtp(false);
        toast.error(err.response?.data?.error || "Invalid or expired verification passcode");
      });
  };

  // Submit Application
  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Validations
    if (!formData.restaurantName.trim()) {
      toast.error("Please specify your Restaurant / Cloud Kitchen Brand Name");
      return;
    }

    const cleanFssai = formData.fssaiNumber.replace(/\D/g, '');
    if (cleanFssai.length !== 14) {
      toast.error("FSSAI License Number must be exactly 14 digits");
      return;
    }

    if (!formData.contactName.trim()) {
      toast.error("Please provide the Primary Contact Name");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please provide a valid official dispatch email address");
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      toast.error("Kitchen portal access password must be at least 6 characters");
      return;
    }

    if (!formData.address.trim()) {
      toast.error("Please provide the Kitchen Facility Address");
      return;
    }

    if (!formData.zeroSyntheticCommitment) {
      toast.error("Please accept the Zero Synthetic Additives Commitment");
      return;
    }

    if (!formData.bioPackagingCommitment) {
      toast.error("Please accept the 100% Biodegradable Guild Packaging standard");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting kitchen application to Guild Council...");

    // Generate unique merchant username slug
    const brandSlug = formData.restaurantName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const uname = (brandSlug.length >= 3 ? brandSlug.slice(0, 12) : "merchant") + "_" + cleanPhone.slice(-4);

    const payload = {
      uname: uname,
      pass: formData.password,
      nm: formData.contactName.trim(),
      email: formData.email.trim(),
      phno: cleanPhone,
      role: "merchant",
      restaurantName: formData.restaurantName.trim(),
      fssaiNumber: cleanFssai,
      culinaryCraft: formData.culinaryCraft,
      facilityAddress: formData.address.trim(),
      hubSector: formData.hubSector,
      mealCapacity: formData.capacity,
      zeroSyntheticCommitment: formData.zeroSyntheticCommitment,
      bioPackagingCommitment: formData.bioPackagingCommitment,
      merchantStatus: "SUBMITTED"
    };

    axiosInstance.post("/register/add", payload)
      .then(() => {
        toast.dismiss(loadingToast);
        setIsSubmitting(false);
        toast.success("Application Submitted to Zayka Guild Council! 🌿", { duration: 5000 });
        setSubmittedReceipt({
          ...payload,
          submittedAt: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        });
      })
      .catch((err) => {
        toast.dismiss(loadingToast);
        setIsSubmitting(false);
        const errMsg = err.response?.data?.error || err.response?.data?.message || "Application submission failed. Please check details.";
        toast.error(errMsg);
      });
  };

  return (
    <div className="min-h-screen bg-[#FAF3E8] text-[#191816] flex flex-col selection:bg-[#C20019] selection:text-white font-sans antialiased">
      
      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
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

          {/* Quick Search */}
          <div className="flex-1 max-w-xl mx-2 md:mx-4 hidden sm:block">
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A766F]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <input 
                className="w-full pl-10 pr-4 py-2 bg-[#FDFBF7]/80 hover:bg-[#FDFBF7] focus:bg-white text-sm text-[#191816] placeholder-[#7A766F] rounded-full border border-[#E8E1D5] focus:outline-none focus:ring-1 focus:ring-[#C20019] focus:border-[#C20019] transition-all" 
                placeholder="Search dish or restaurant..." 
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/foodlistclient?search=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
              />
            </div>
          </div>

          {/* Partner Action */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => navigate('/merchant/login')}
              className="text-xs font-bold uppercase tracking-wider text-[#191816] hover:text-[#C20019] transition-colors cursor-pointer"
            >
              Partner Sign In →
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
              className="flex items-center gap-2 px-5 md:px-6 py-2 rounded-xl bg-[#191816] text-white font-bold text-xs tracking-wider uppercase shadow-md transition-all cursor-default"
              type="button"
            >
              REGISTER NEW KITCHEN
            </button>
            <button 
              className="flex items-center gap-2 px-5 md:px-6 py-2 rounded-xl text-[#7A766F] hover:text-[#191816] font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
              type="button"
              onClick={() => navigate('/merchant/login')}
            >
              PARTNER SIGN IN
            </button>
          </div>

          {/* Hero Titles */}
          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#191816] tracking-tight leading-tight">
              Partner with <span className="italic font-normal text-[#C20019]">Zayka Culinary Guild</span>
            </h1>
            <p className="text-sm md:text-base text-[#4A4843] leading-relaxed">
              Apply to join India’s premier artisanal food collective. Showcase your craft to mindful epicureans across Bangalore, Mumbai, and Delhi.
            </p>
          </div>
        </div>

        {/* ── TWO COLUMN PORTAL LAYOUT ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Registration Application Form or Success Receipt */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8E1D5] shadow-[0_8px_24px_-6px_rgba(25,24,22,0.06)] p-5 md:p-8 space-y-8">
            
            {submittedReceipt ? (
              /* SUCCESS RECEIPT STATE */
              <div className="space-y-6 text-left animate-fadeIn">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-emerald-900">Application Submitted to Zayka Guild Council</h3>
                    <p className="text-xs text-emerald-700">Application ID: <span className="font-mono font-bold">{submittedReceipt.uname}</span> • Status: <span className="font-bold uppercase tracking-wider">{submittedReceipt.merchantStatus}</span></p>
                  </div>
                </div>

                <div className="border border-[#E8E1D5] rounded-2xl p-5 bg-[#FAF3E8]/60 space-y-3">
                  <div className="flex justify-between items-start border-b border-[#E8E1D5] pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C20019]">KITCHEN DOSSIER</span>
                      <h4 className="text-lg font-bold text-[#191816]">{submittedReceipt.restaurantName}</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-[#191816] text-white">
                      UNDER REVIEW
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-[#7A766F] block text-[11px]">Primary Culinary Craft:</span>
                      <span className="font-semibold text-[#191816]">{submittedReceipt.culinaryCraft}</span>
                    </div>
                    <div>
                      <span className="text-[#7A766F] block text-[11px]">FSSAI License:</span>
                      <span className="font-mono font-semibold text-[#191816]">{submittedReceipt.fssaiNumber}</span>
                    </div>
                    <div>
                      <span className="text-[#7A766F] block text-[11px]">Primary Contact:</span>
                      <span className="font-semibold text-[#191816]">{submittedReceipt.nm} (+91 {submittedReceipt.phno})</span>
                    </div>
                    <div>
                      <span className="text-[#7A766F] block text-[11px]">Official Email:</span>
                      <span className="font-semibold text-[#191816]">{submittedReceipt.email}</span>
                    </div>
                    <div>
                      <span className="text-[#7A766F] block text-[11px]">Hub Sector:</span>
                      <span className="font-semibold text-[#191816]">{submittedReceipt.hubSector}</span>
                    </div>
                    <div>
                      <span className="text-[#7A766F] block text-[11px]">Daily Prep Capacity:</span>
                      <span className="font-semibold text-[#191816]">{submittedReceipt.mealCapacity}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-[#7A766F] leading-relaxed">
                    Our artisanal standards committee conducts sensory tasting and hygiene evaluation. You may immediately sign in to your merchant dashboard to inspect your menu drafts and configure kitchen settings.
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('/merchant/login')}
                      className="flex-1 bg-[#C20019] hover:bg-[#950010] text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest shadow-md transition-all text-center cursor-pointer"
                    >
                      Sign In as Merchant →
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmittedReceipt(null);
                        setFormData({
                          restaurantName: "",
                          fssaiNumber: "",
                          culinaryCraft: "Artisanal Woodfired",
                          contactName: "",
                          email: "",
                          phone: "",
                          password: "",
                          address: "",
                          hubSector: "Bangalore — East (Indiranagar / Koramangala)",
                          capacity: "ATELIER",
                          zeroSyntheticCommitment: true,
                          bioPackagingCommitment: true
                        });
                        setIsOtpVerified(false);
                        setOtpSent(false);
                      }}
                      className="border border-[#E8E1D5] hover:border-[#191816] bg-white text-[#191816] font-semibold py-3.5 px-5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
                    >
                      Register Another Kitchen
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* REAL APPLICATION FORM */
              <form className="space-y-8" onSubmit={handleSubmit}>
                
                {/* ── SECTION 01: Establishment Details ──────────────────────── */}
                <div className="space-y-4 border-b border-[#E8E1D5]/60 pb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-[#C20019] tracking-widest uppercase">
                      01 / ESTABLISHMENT DETAILS
                    </span>
                    <span className="text-[11px] text-[#7A766F]">Identity &amp; License</span>
                  </div>

                  <div className="space-y-4">
                    {/* Brand Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#191816] mb-1.5" htmlFor="restaurantName">
                        Restaurant / Cloud Kitchen Brand Name *
                      </label>
                      <input 
                        id="restaurantName"
                        name="restaurantName"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7]/50 text-[#191816] text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C20019] focus:border-[#C20019] transition-all" 
                        placeholder="Enter your restaurant brand name (e.g. Toscano Hearth & Pizzeria)" 
                        type="text" 
                        value={formData.restaurantName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* FSSAI Number & Auto-Lookup */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#191816]" htmlFor="fssaiNumber">
                          Registered FSSAI 14-Digit License Number *
                        </label>
                        {fssaiStatus && (
                          <span className={`text-[10px] font-semibold ${fssaiStatus.valid ? 'text-emerald-700' : 'text-[#C20019]'}`}>
                            {fssaiStatus.valid ? "✓ 14-Digit Format Valid" : "✕ Format Incomplete"}
                          </span>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <div className="absolute left-3.5 text-emerald-800">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path clipRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" fillRule="evenodd"></path>
                          </svg>
                        </div>
                        <input 
                          id="fssaiNumber"
                          name="fssaiNumber"
                          maxLength={14}
                          className="w-full pl-10 pr-28 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7]/50 text-[#191816] text-sm font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C20019] focus:border-[#C20019] transition-all" 
                          placeholder="Enter 14-digit FSSAI number" 
                          type="text" 
                          value={formData.fssaiNumber}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setFormData((prev) => ({ ...prev, fssaiNumber: val }));
                            if (fssaiStatus) setFssaiStatus(null);
                          }}
                          required
                        />
                        <button 
                          className="absolute right-2 px-3 py-1 bg-[#F3EAD8] hover:bg-[#E7DCBE] text-[#191816] text-[11px] font-bold rounded-lg uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50" 
                          type="button"
                          onClick={handleFssaiLookup}
                          disabled={isCheckingFssai}
                        >
                          {isCheckingFssai ? "Checking..." : "Auto-Lookup"}
                        </button>
                      </div>
                      {fssaiStatus && (
                        <p className={`text-[11px] mt-1 ${fssaiStatus.valid ? 'text-emerald-700' : 'text-[#C20019]'}`}>
                          {fssaiStatus.message}
                        </p>
                      )}
                    </div>

                    {/* Primary Culinary Craft Chips */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#191816] mb-2">
                        Primary Culinary Craft *
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {CULINARY_CRAFTS.map((craft) => {
                          const isSelected = formData.culinaryCraft === craft;
                          return (
                            <button
                              key={craft}
                              type="button"
                              onClick={() => setFormData((prev) => ({ ...prev, culinaryCraft: craft }))}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                isSelected 
                                  ? 'bg-[#C20019] text-white shadow-sm' 
                                  : 'bg-[#FAF3E8] text-[#191816] border border-[#E8E1D5] hover:border-[#191816]'
                              }`}
                            >
                              {craft}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── SECTION 02: Kitchen Lead ────────────────────────────────── */}
                <div className="space-y-4 border-b border-[#E8E1D5]/60 pb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-[#C20019] tracking-widest uppercase">
                      02 / KITCHEN LEAD
                    </span>
                    <span className="text-[11px] text-[#7A766F]">Leadership &amp; Credentials</span>
                  </div>

                  <div className="space-y-4">
                    {/* Mobile Number & OTP Row */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#191816]" htmlFor="phone">
                          Verified Mobile Number *
                        </label>
                        {isOtpVerified && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            ✓ Mobile Verified
                          </span>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-xs font-mono font-bold text-[#7A766F] select-none">+91</span>
                        <input 
                          id="phone"
                          name="phone"
                          maxLength={10}
                          className="w-full pl-12 pr-28 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7]/50 text-[#191816] text-sm font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C20019] focus:border-[#C20019] transition-all" 
                          placeholder="98450 12345" 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => {
                            const clean = e.target.value.replace(/\D/g, '');
                            setFormData((prev) => ({ ...prev, phone: clean }));
                            if (isOtpVerified) setIsOtpVerified(false);
                          }}
                          required
                        />
                        <button 
                          className={`absolute right-2 px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider transition-colors shadow-sm cursor-pointer ${
                            isOtpVerified
                              ? 'bg-emerald-700 text-white cursor-default'
                              : 'bg-[#191816] hover:bg-[#C20019] text-white'
                          }`} 
                          type="button"
                          onClick={handleSendOtp}
                          disabled={isSendingOtp || (resendCountdown > 0 && otpSent)}
                        >
                          {isOtpVerified 
                            ? "Verified" 
                            : isSendingOtp 
                              ? "Sending..." 
                              : resendCountdown > 0 
                                ? `Resend (${resendCountdown}s)` 
                                : otpSent 
                                  ? "Resend OTP" 
                                  : "Send OTP"}
                        </button>
                      </div>

                      {/* OTP Input Card (Shown after Send OTP is clicked) */}
                      {otpSent && !isOtpVerified && (
                        <div className="mt-2.5 p-3 rounded-xl bg-[#FDFBF7] border border-[#E8E1D5] flex flex-col sm:flex-row items-center gap-2">
                          <input 
                            type="text"
                            maxLength={6}
                            placeholder="Enter 6-digit OTP"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            className="w-full sm:w-48 px-3 py-1.5 rounded-lg border border-[#E8E1D5] bg-white text-center font-mono text-sm font-bold tracking-widest focus:outline-none focus:ring-1 focus:ring-[#C20019]"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={isVerifyingOtp}
                            className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            {isVerifyingOtp ? "Verifying..." : "Verify Code"}
                          </button>
                          <span className="text-[10px] text-[#7A766F]">
                            Local testing code: <strong className="font-mono text-[#191816]">123456</strong>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Contact Name & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#191816] mb-1.5" htmlFor="contactName">
                          Primary Contact Name *
                        </label>
                        <input 
                          id="contactName"
                          name="contactName"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7]/50 text-[#191816] text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C20019] focus:border-[#C20019] transition-all" 
                          placeholder="e.g. Chef Marco D'Souza" 
                          type="text" 
                          value={formData.contactName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#191816] mb-1.5" htmlFor="email">
                          Official Kitchen Dispatch Email *
                        </label>
                        <input 
                          id="email"
                          name="email"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7]/50 text-[#191816] text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C20019] focus:border-[#C20019] transition-all" 
                          placeholder="chef@restaurant.kitchen" 
                          type="email" 
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Kitchen Portal Access Password */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#191816] mb-1.5" htmlFor="password">
                        Kitchen Portal Access Password * (min 6 characters)
                      </label>
                      <div className="relative flex items-center">
                        <input 
                          id="password"
                          name="password"
                          className="w-full px-4 pr-12 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7]/50 text-[#191816] text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C20019] focus:border-[#C20019] transition-all" 
                          placeholder="Set secure password for merchant portal login" 
                          type={showPassword ? "text" : "password"} 
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-[#7A766F] hover:text-[#191816] text-xs font-medium cursor-pointer"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── SECTION 03: Location & Capacity Hub ──────────────────────── */}
                <div className="space-y-4 border-b border-[#E8E1D5]/60 pb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-[#C20019] tracking-widest uppercase">
                      03 / LOCATION &amp; CAPACITY HUB
                    </span>
                    <span className="text-[11px] text-[#7A766F]">Logistics &amp; Output</span>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Facility Address */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#191816] mb-1.5" htmlFor="address">
                          Kitchen Facility Address *
                        </label>
                        <input 
                          id="address"
                          name="address"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7]/50 text-[#191816] text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C20019] focus:border-[#C20019] transition-all" 
                          placeholder="e.g. 12th Main, HAL 2nd Stage, Indiranagar" 
                          type="text" 
                          value={formData.address}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Hub Sector */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#191816] mb-1.5" htmlFor="hubSector">
                          Hub Sector *
                        </label>
                        <select 
                          id="hubSector"
                          name="hubSector"
                          value={formData.hubSector}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7]/50 text-[#191816] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C20019] focus:border-[#C20019] transition-all cursor-pointer"
                        >
                          {HUB_SECTORS.map((sector) => (
                            <option key={sector} value={sector}>
                              {sector}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Daily Meal Preparation Capacity Cards */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#191816] mb-2">
                        Daily Meal Preparation Capacity *
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {CAPACITIES.map((cap) => {
                          const isSelected = formData.capacity === cap.id;
                          return (
                            <div 
                              key={cap.id}
                              onClick={() => setFormData((prev) => ({ ...prev, capacity: cap.id }))}
                              className={`p-3 rounded-xl text-center cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-2 border-[#C20019] bg-[#C20019]/10 shadow-sm'
                                  : 'border border-[#E8E1D5] bg-[#FAF3E8]/70 hover:border-[#191816]'
                              }`}
                            >
                              <div className={`text-xs font-bold ${isSelected ? 'text-[#C20019]' : 'text-[#191816]'}`}>
                                {cap.label}
                              </div>
                              <div className={`text-[10px] sm:text-[11px] mt-0.5 ${isSelected ? 'text-[#191816] font-medium' : 'text-[#7A766F]'}`}>
                                {cap.orders}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── SECTION 04: Quality Charter & Botanical Protocol ─────────── */}
                <div className="space-y-4 border-b border-[#E8E1D5]/60 pb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-[#C20019] tracking-widest uppercase">
                      04 / QUALITY CHARTER &amp; BOTANICAL PROTOCOL
                    </span>
                    <span className="text-[11px] text-[#7A766F]">Pledge &amp; Standards</span>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-3 bg-[#FAF3E8]/80 rounded-xl border border-[#E8E1D5] cursor-pointer hover:border-[#7A766F] transition-colors">
                      <input 
                        type="checkbox"
                        name="zeroSyntheticCommitment"
                        checked={formData.zeroSyntheticCommitment}
                        onChange={handleChange}
                        className="mt-1 text-[#C20019] focus:ring-[#C20019] rounded border-[#E8E1D5] cursor-pointer"
                      />
                      <span className="text-xs text-[#4A4843] leading-relaxed">
                        <strong className="text-[#191816] block mb-0.5">Zero Synthetic Additives &amp; Heritage Extraction Commitment</strong>
                        We commit to pure heritage cold-pressed oils, zero hydrogenated fats, zero artificial coloring, and whole raw spices across all guild menu items.
                      </span>
                    </label>

                    <label className="flex items-start gap-3 p-3 bg-[#FAF3E8]/80 rounded-xl border border-[#E8E1D5] cursor-pointer hover:border-[#7A766F] transition-colors">
                      <input 
                        type="checkbox"
                        name="bioPackagingCommitment"
                        checked={formData.bioPackagingCommitment}
                        onChange={handleChange}
                        className="mt-1 text-[#C20019] focus:ring-[#C20019] rounded border-[#E8E1D5] cursor-pointer"
                      />
                      <span className="text-xs text-[#4A4843] leading-relaxed">
                        <strong className="text-[#191816] block mb-0.5">100% Biodegradable, Heat-Retentive Guild Packaging</strong>
                        We agree to utilize Zayka-certified bagasse, unbleached unvarnished kraft, and compostable PLA heat seals for customer dispatches.
                      </span>
                    </label>
                  </div>
                </div>

                {/* ── CTA Action ──────────────────────────────────────────────── */}
                <div className="pt-2 space-y-3 text-center">
                  <button 
                    className="w-full bg-[#C20019] hover:bg-[#950010] text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <span>{isSubmitting ? "TRANSMITTING APPLICATION..." : "SUBMIT APPLICATION TO GUILD COUNCIL"}</span>
                    <span className="text-base leading-none">→</span>
                  </button>

                  <p className="text-xs text-[#7A766F]">
                    Already an approved Zayka kitchen partner?{' '}
                    <a 
                      className="text-[#C20019] font-semibold hover:underline cursor-pointer" 
                      href="/merchant/login"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/merchant/login');
                      }}
                    >
                      Log in to Kitchen
                    </a>
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: Partner Economics & Guild Perks ─────────────────── */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="space-y-2 text-left">
              <h2 className="text-2xl font-serif font-bold text-[#191816]">Why Partner with Zayka?</h2>
              <p className="text-xs text-[#7A766F]">An ecosystem calibrated for artisanal chefs and culinary entrepreneurs, not mass volume discounts.</p>
            </div>

            {/* Metric Card 1 */}
            <div className="bg-white rounded-2xl border border-[#E8E1D5] p-5 shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(25,24,22,0.06)] transition-all space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold font-serif text-[#C20019]">3.4x</span>
                <span className="text-[10px] font-mono uppercase tracking-wider bg-[#FAF3E8] text-[#191816] px-2 py-0.5 rounded font-bold">
                  Economics
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#191816]">Higher Average Order Value</h3>
              <p className="text-xs text-[#4A4843] leading-relaxed">
                Connect directly with patrons seeking authentic micro-batches and high-value dining hampers rather than discounted fast food.
              </p>
            </div>

            {/* Metric Card 2 */}
            <div className="bg-white rounded-2xl border border-[#E8E1D5] p-5 shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(25,24,22,0.06)] transition-all space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold font-serif text-emerald-800">15-min</span>
                <span className="text-[10px] font-mono uppercase tracking-wider bg-[#FAF3E8] text-[#191816] px-2 py-0.5 rounded font-bold">
                  Cold &amp; Hot Chain
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#191816]">Climate-Stabilized Dispatch</h3>
              <p className="text-xs text-[#4A4843] leading-relaxed">
                Dedicated temperature-monitored carrier fleet ensures sourdough crusts remain crisp and emulsions maintain pristine balance.
              </p>
            </div>

            {/* Metric Card 3 */}
            <div className="bg-white rounded-2xl border border-[#E8E1D5] p-5 shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(25,24,22,0.06)] transition-all space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold font-serif text-[#191816]">12% Flat</span>
                <span className="text-[10px] font-mono uppercase tracking-wider bg-[#FAF3E8] text-[#191816] px-2 py-0.5 rounded font-bold">
                  No Surges
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#191816]">Zero Hidden Commissions</h3>
              <p className="text-xs text-[#4A4843] leading-relaxed">
                Transparent flat partnership guild fee. Guaranteed weekly automated payouts with no forced discount participation or listing racketeering.
              </p>
            </div>

            {/* Chef Testimonial Card */}
            <div className="bg-[#191816] text-white rounded-2xl p-5 space-y-3 shadow-md text-left">
              <div className="text-[#C20019] text-2xl font-serif leading-none font-bold">“</div>
              <p className="text-xs text-[#F3EAD8] italic font-light leading-relaxed">
                “Zayka completely transformed our hearth kitchen. We don’t deal with low-margin bargain hunters—only patrons who genuinely respect slow fermentation and heritage ingredients.”
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <div>
                  <div className="font-bold text-white">Chef Marco D’Souza</div>
                  <div className="text-[10px] text-[#D5C7A3]">Toscano Hearth, Indiranagar</div>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#D5C7A3]">
                  <span className="text-emerald-400">✓</span> FSSAI Compliant
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="mt-16 md:mt-20 border-t border-[#E8E1D5] bg-[#F3EAD8]/60 pt-12 md:pt-16 pb-16 md:pb-24 text-[#191816]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10 text-left">
            {/* Column 1: Brand Philosophy */}
            <div className="md:col-span-2 space-y-3">
              <a 
                className="inline-flex items-center gap-1.5 cursor-pointer" 
                href="/" 
                onClick={(e) => { e.preventDefault(); navigate('/'); }}
              >
                <span className="text-xl md:text-2xl font-bold tracking-tighter uppercase font-serif text-[#C20019]">
                  ZAYKA
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C20019] mb-1"></span>
              </a>
              <p className="text-xs text-[#4A4843] max-w-sm leading-relaxed">
                Botanical editorial dining delivered fresh. We curate premier local kitchens, fine roasters, and artisanal patisseries straight to your doorstep across Bengaluru.
              </p>
              <div className="pt-2 text-[11px] text-[#7A766F]">
                © {new Date().getFullYear()} Zayka Food Technologies Pvt. Ltd. All rights reserved.
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#191816] font-sans">Company</h4>
              <ul className="space-y-2 text-xs text-[#4A4843] font-medium">
                <li><a className="hover:text-[#C20019] transition-colors" href="/home">About Us</a></li>
                <li><a className="hover:text-[#C20019] transition-colors" href="/merchant/login">Merchant Portal</a></li>
                <li><a className="hover:text-[#C20019] transition-colors" href="/driver/login">Carrier Fleet</a></li>
                <li><a className="hover:text-[#C20019] transition-colors" href="/allorders">Orders</a></li>
              </ul>
            </div>

            {/* Column 3: Available Cities */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#191816] font-sans">Available Hubs</h4>
              <ul className="space-y-2 text-xs text-[#4A4843] font-medium">
                <li><span className="text-[#4A4843]">Bengaluru Central</span></li>
                <li><span className="text-[#4A4843]">Bengaluru East (Indiranagar)</span></li>
                <li><span className="text-[#4A4843]">Mumbai Bandra</span></li>
                <li><span className="text-[#4A4843]">Delhi NCR</span></li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#191816] font-sans">The Epicurean Letter</h4>
              <p className="text-xs text-[#7A766F]">Receive weekly restaurant spotlights and secret culinary tasting codes.</p>
              <div className="flex items-center gap-2 pt-1">
                <input 
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-[#E8E1D5] focus:outline-none focus:ring-1 focus:ring-[#C20019]" 
                  placeholder="Your email" 
                  type="email" 
                />
                <button 
                  onClick={() => toast.success("Subscribed to the Epicurean Letter 🌿")}
                  className="bg-[#191816] text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-[#C20019] transition-colors shrink-0 cursor-pointer"
                  type="button"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MerchantRegister;
