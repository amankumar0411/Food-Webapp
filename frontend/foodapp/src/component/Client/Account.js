import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import ProfileMobile from './profile/ProfileMobile';
import ProfileDesktop from './profile/ProfileDesktop';

function Account() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('user');

  // Profile State
  const [profile, setProfile] = useState({ uname: '', nm: '', email: '', phno: '', role: '' });
  const [orderStats, setOrderStats] = useState({ totalOrders: 0, totalSpent: 0, rewardsPoints: 250, favoriteCuisine: "Woodfired Margherita Sourdough", tier: "Zayka Connoisseur" });
  const [orderHistory, setOrderHistory] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Responsive Breakpoint check matching Home.js (1024px)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const refreshAddresses = (uname) => {
    axiosInstance.get(`/api/addresses/${uname}`)
      .then(res => {
        if (Array.isArray(res.data)) setAddresses(res.data);
      })
      .catch(() => {});
  };

  const refreshPaymentMethods = (uname) => {
    axiosInstance.get(`/api/payment-methods/${uname}`)
      .then(res => {
        if (Array.isArray(res.data)) setPaymentMethods(res.data);
      })
      .catch(() => {});
  };

  // Fetch Profile Info, Stats, Orders, Addresses, Cards
  useEffect(() => {
    if (currentUser) {
      // 1. Profile details
      axiosInstance.get(`/register/profile/${currentUser}`)
        .then(res => {
          if (res.data) setProfile(res.data);
        })
        .catch(() => {
          setProfile({
            uname: currentUser,
            nm: currentUser === "patron@zayka.kitchen" ? "Aman Verma" : currentUser,
            email: currentUser.includes("@") ? currentUser : `${currentUser}@domain.com`,
            phno: "9876543210"
          });
        });

      // 2. Lifetime aggregated stats
      axiosInstance.get(`/order-dtls/stats/${currentUser}`)
        .then(res => {
          if (res.data) setOrderStats(res.data);
        })
        .catch(() => {});

      // 3. User order history
      axiosInstance.get(`/order-dtls/user/${currentUser}`)
        .then(res => {
          if (Array.isArray(res.data)) setOrderHistory(res.data);
        })
        .catch(() => {});

      // 4. Saved addresses
      refreshAddresses(currentUser);

      // 5. Saved payment methods
      refreshPaymentMethods(currentUser);
    }
  }, [currentUser]);

  // Derived Display Details
  const displayName = profile.nm || (currentUser ? (currentUser.includes("@") ? currentUser.split("@")[0] : currentUser) : "Aman Verma");
  
  const getInitials = (name) => {
    if (!name) return "AV";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };
  const initials = getInitials(displayName);

  const phoneDisplay = profile.phno ? (profile.phno.startsWith('+') ? profile.phno : `+91 ${profile.phno}`) : "+91 98765 43210";
  const emailDisplay = profile.email || (currentUser ? (currentUser.includes("@") ? currentUser : `${currentUser}@domain.com`) : "aman.verma@domain.com");
  const contactString = `${phoneDisplay} • ${emailDisplay}`;

  // Reorder Handler: Adds items from past order into active cart
  const handleReorder = (order) => {
    if (!order || !order.fid) {
      navigate('/foodlistclient');
      return;
    }
    const payload = {
      fid: order.fid,
      fname: order.fname,
      qty: order.qty || 1,
      uname: currentUser
    };
    const toastId = toast.loading(`Reordering ${order.fname}...`);
    axiosInstance.post('/orders/add', payload)
      .then(() => {
        toast.dismiss(toastId);
        toast.success(`Reordered ${order.fname}! Heading to checkout 🌿`);
        navigate('/billing');
      })
      .catch(() => {
        toast.dismiss(toastId);
        toast.error("Could not reorder item");
      });
  };

  // Set Default Address Handler
  const handleSetDefaultAddress = (addrId) => {
    axiosInstance.put(`/api/addresses/${addrId}/default?uname=${currentUser}`)
      .then(() => {
        toast.success("Default delivery sanctuary updated!");
        refreshAddresses(currentUser);
      })
      .catch(() => toast.error("Could not update default address"));
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("fullName");
    toast.success("Successfully logged out of your patron account. 🌿");
    navigate('/login');
  };

  const sharedProps = {
    displayName,
    initials,
    contactString,
    orderStats,
    orderHistory,
    addresses,
    paymentMethods,
    handleReorder,
    handleSetDefaultAddress,
    handleLogout,
    navigate
  };

  return (
    <>
      {isMobile ? (
        <ProfileMobile {...sharedProps} />
      ) : (
        <ProfileDesktop {...sharedProps} />
      )}
    </>
  );
}

export default Account;
