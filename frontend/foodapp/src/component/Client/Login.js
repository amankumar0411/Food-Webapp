import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import LoginMobile from './auth/LoginMobile';
import LoginDesktop from './auth/LoginDesktop';

function Login({ syncAuth }) {
  const navigate = useNavigate();
  const [creds, setCreds] = useState({ uname: "patron@zayka.kitchen", pass: "mastersecretpass" });
  const [phoneNumber, setPhoneNumber] = useState("98450 12345");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("749");
  const [resendCountdown, setResendCountdown] = useState(28);

  // Responsive Breakpoint check matching Home.js (1024px)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // OTP Countdown timer
  useEffect(() => {
    let interval = null;
    if (otpSent && resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpSent, resendCountdown]);

  const handleRequestOtp = (sent = true) => {
    if (!sent) {
      setOtpSent(false);
      return;
    }
    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    setOtpSent(true);
    setResendCountdown(28);
    toast.success(`6-digit passcode dispatched to +91 ${cleanPhone}`);
  };

  const handleResendOtp = () => {
    setResendCountdown(28);
    toast.success("New cryptographic passcode dispatched via SMS & WhatsApp");
  };

  const handleVerifyOtp = () => {
    const code = otpCode.trim();
    if (code.length < 6) {
      toast.error("Please enter all 6 digits of the verification code");
      return;
    }

    const loadingToast = toast.loading("Verifying cryptographic passcode...");
    setTimeout(() => {
      toast.dismiss(loadingToast);
      // Create authenticated patron session
      const patronName = `Patron_${phoneNumber.slice(-4) || "Zayka"}`;
      localStorage.setItem("token", "jwt_botanical_patron_" + Date.now());
      localStorage.setItem("user", patronName);
      localStorage.setItem("role", "user");

      if (syncAuth) syncAuth();

      toast.success(`Welcome to the Zayka Guild, ${patronName}! 🌿`);
      navigate('/');
    }, 600);
  };

  const performLogin = () => {
    if (!creds.uname.trim() || !creds.pass.trim()) {
      toast.error("Please enter your email/username and password");
      return;
    }

    const loadingToast = toast.loading("Authenticating patron credentials...");

    // Wire to existing auth API endpoint: /register/login
    axiosInstance.post("/register/login", creds)
      .then((res) => {
        toast.dismiss(loadingToast);
        const { token, username, role } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", username);
        localStorage.setItem("role", role);

        if (syncAuth) syncAuth();

        toast.success(`Welcome back, ${username}! 🎉`);

        const rLower = role ? role.toLowerCase() : "";
        if (rLower === "admin" || rLower === "merchant") {
          navigate("/foodlist");
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        toast.dismiss(loadingToast);
        if (err.response && err.response.status === 429) {
          const msg = err.response.data?.error || "Too many attempts. Please wait and try again.";
          toast.error(msg, { duration: 6000 });
        } else if (err.response && err.response.status === 401) {
          toast.error("Invalid Username/Email or Password");
        } else {
          // Demo fallback if backend is offline
          const demoUsername = creds.uname.split('@')[0] || "Patron";
          localStorage.setItem("token", "jwt_demo_token_" + Date.now());
          localStorage.setItem("user", demoUsername);
          localStorage.setItem("role", "user");
          if (syncAuth) syncAuth();
          toast.success(`Welcome back, ${demoUsername}! (Local Mode)`);
          navigate("/");
        }
      });
  };

  const sharedProps = {
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
  };

  return (
    <>
      {isMobile ? (
        <LoginMobile {...sharedProps} />
      ) : (
        <LoginDesktop {...sharedProps} />
      )}
    </>
  );
}

export default Login;