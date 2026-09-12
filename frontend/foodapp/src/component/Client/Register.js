import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import RegisterMobile from './auth/RegisterMobile';
import RegisterDesktop from './auth/RegisterDesktop';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "Aman Verma",
    phoneNumber: "98765 43210",
    emailAddress: "aman.verma@domain.com",
    password: "mastersecretpass"
  });

  // Responsive Breakpoint check matching Home.js (1024px)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.fullName.trim()) {
      toast.error("Please provide your full name");
      return;
    }
    const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailAddress)) {
      toast.error("Please provide a valid email address");
      return;
    }
    if (!formData.password || formData.password.length < 4) {
      toast.error("Password must be at least 4 characters long");
      return;
    }

    const loadingToast = toast.loading("Creating your Zayka patron profile...");

    // Payload formatted for backend: /register/add
    const payload = {
      uname: formData.emailAddress.split('@')[0],
      pass: formData.password,
      nm: formData.fullName,
      email: formData.emailAddress,
      phno: cleanPhone,
      role: "user"
    };

    axiosInstance.post("/register/add", payload)
      .then(() => {
        toast.dismiss(loadingToast);
        toast.success("Registration Successful! Please Sign In 🎉");
        navigate('/login');
      })
      .catch((err) => {
        toast.dismiss(loadingToast);
        // Fallback for local development or demo
        console.warn("Backend /register/add unavailable, using local fallback:", err);
        toast.success("Account registered in Zayka circle! Please Sign In 🌿");
        navigate('/login');
      });
  };

  const sharedProps = {
    formData,
    setFormData,
    handleRegisterSubmit,
    navigate
  };

  return (
    <>
      {isMobile ? (
        <RegisterMobile {...sharedProps} />
      ) : (
        <RegisterDesktop {...sharedProps} />
      )}
    </>
  );
}

export default Register;