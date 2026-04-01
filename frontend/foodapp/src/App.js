import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";
import Grainient from './component/common/Grainient';

// ADMIN COMPONENTS
import Nav from './component/Admin/Nav';
import Addfood from './component/Admin/Addfood';
import Foodlist from './component/Admin/Foodlist';
import UpdateFood from './component/Admin/UpdateFood';
import DeleteFood from './component/Admin/DeleteFood';
import AdminOrders from './component/Admin/AdminOrders';
import AdminOrderDtls from './component/Admin/AdminOrderDtls';
// CLIENT COMPONENTS
import NavClient from './component/Client/NavClient';
import FoodListClient from './component/Client/FoodListClient';
import AddOrder from './component/Client/AddOrder';
import Billing from './component/Client/Billing';
import Register from './component/Client/Register';
import Login from './component/Client/Login';
import Home from './component/Client/Home';

import { Toaster } from 'react-hot-toast';

/**
 * Medium #11 — localStorage is XSS-accessible (tradeoff vs httpOnly cookies).
 * We mitigate this by eagerly purging expired tokens on every page load.
 * Decodes the JWT payload without a library (base64url → JSON).
 */
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return Date.now() / 1000 > payload.exp; // exp is in seconds
  } catch {
    return true; // malformed token → treat as expired
  }
}

function clearAuthStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
}

function App() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Medium #11 — purge stale token before reading auth state
  const storedToken = localStorage.getItem('token');
  if (storedToken && isTokenExpired(storedToken)) {
    clearAuthStorage();
  }

  // REACTIVE AUTH STATE
  const [auth, setAuth] = useState(localStorage.getItem("user"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const isAdmin = auth && role && role.toLowerCase() === "admin";

  // Function to sync auth state from other components
  const syncAuth = () => {
    setAuth(localStorage.getItem("user"));
    setRole(localStorage.getItem("role"));
  };

  // Selective background logic: Grainient on inner pages (excluding home)
  const isHomePage = location.pathname === "/" || location.pathname === "/home";
  const showGrainient = auth && !isHomePage;

  // THEME STATE LOGIC (Default to Light Mode, Check LocalStorage)
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkTheme) {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem("theme", "dark");
    } else {
      document.body.removeAttribute('data-theme');
      localStorage.setItem("theme", "light");
    }

    // LOCK SCROLL ON HOME PAGE
    if (isHomePage) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [isDarkTheme, isHomePage]);

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  return (
    <div className="App" style={{ minHeight: '100vh', width: '100%', position: 'relative' }}>
      <Toaster position="top-right" reverseOrder={false} />
      {/* 1. DYNAMIC SUBTLE GRAINIENT (Inner pages only) */}
      {showGrainient && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          zIndex: -1,
          pointerEvents: 'none',
          opacity: 0.4 // Even more subtle for white background
        }}>
          <Grainient
            color1="#FF9FFC"
            color2="#5227FF"
            color3="#ffffff" // Blend with white
            timeSpeed={0.05}
            warpStrength={0.5}
            grainAmount={0.03}
          />
        </div>
      )}

      {/* 2. DYNAMIC NAVIGATION SELECTION */}
      {auth && (isAdmin ?
        <Nav toggleTheme={toggleTheme} isDark={isDarkTheme} searchQuery={searchQuery} setSearchQuery={setSearchQuery} isHomePage={isHomePage} /> :
        <NavClient toggleTheme={toggleTheme} isDark={isDarkTheme} searchQuery={searchQuery} setSearchQuery={setSearchQuery} isHomePage={isHomePage} />
      )}

      <div className="container-fluid main-content-area" style={{ 
        paddingTop: auth ? (isHomePage ? '0' : '180px') : '0', 
        paddingLeft: isHomePage ? '0' : '15px',
        paddingRight: isHomePage ? '0' : '15px',
        position: 'relative', 
        zIndex: 1, 
        minHeight: isHomePage ? '100vh' : 'auto' 
      }}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login syncAuth={syncAuth} />} />
          <Route path="/register" element={<Register />} />

          {/* 2. ADMIN-ONLY ROUTES */}
          {isAdmin && (
            <>
              <Route path="/addfood" element={<Addfood />} />
              <Route path="/foodlist" element={<Foodlist searchQuery={searchQuery} />} />
              <Route path="/updatefood" element={<UpdateFood />} />
              <Route path="/deletefood" element={<DeleteFood />} />
              <Route path="/adminorders" element={<AdminOrders />} />
              <Route path="/adminorderdtls" element={<AdminOrderDtls />} />
            </>
          )}

          {/* 3. CLIENT-ONLY ROUTES */}
          {(auth && !isAdmin) && (
            <>
              <Route path="/foodlistclient" element={<FoodListClient searchQuery={searchQuery} />} />
              <Route path="/addorder" element={<AddOrder />} />
              <Route path="/billing" element={<Billing />} />
            </>
          )}

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;