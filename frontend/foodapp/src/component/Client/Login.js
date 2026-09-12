import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Particles from '../common/Particles';
import toast from 'react-hot-toast';

function Login({ syncAuth }) {
    const navigate = useNavigate();
    let [creds, setCreds] = useState({ uname: "", pass: "" });

    const performLogin = () => {
        const loadingToast = toast.loading("Verifying credentials...");
        
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
                    toast.error("Invalid Username or Password");
                } else {
                    toast.error("Could not connect to server. Ensure Backend is running.");
                }
            });
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'radial-gradient(circle at 50% 20%, rgba(255, 87, 17, 0.2) 0%, transparent 60%), linear-gradient(180deg, #18030d 0%, #110108 100%)',
            flexDirection: 'column',
            padding: '60px 20px'
        }}>
            {/* Background Particles Layer */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
                <Particles
                    particleColors={["#ff5711", "#f5bf2d", "#ffffff"]}
                    particleCount={150}
                    particleSpread={15}
                    speed={0.4}
                    particleBaseSize={120}
                    moveParticlesOnHover={true}
                    alphaParticles={true}
                />
            </div>

            <div className="card p-4 p-md-5 shadow-lg" style={{ 
                maxWidth: "440px", 
                width: "100%", 
                margin: "auto", 
                backgroundColor: 'rgba(36, 8, 21, 0.9)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                zIndex: 2,
                position: 'relative'
            }}>
                <div className="text-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255, 87, 17, 0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px', color: '#ff5711' }}>person</span>
                    </div>
                    <h2 style={{ fontWeight: '800', color: 'var(--text-color)', letterSpacing: '-0.5px', margin: 0 }}>Customer Sign In</h2>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Welcome back to Food Delivery
                    </p>
                </div>

                <div className="mb-3">
                    <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--label-color)', letterSpacing: '0.5px' }}>USERNAME</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{ height: '50px', borderRadius: '14px' }}
                        placeholder="Enter your username" 
                        value={creds.uname}
                        onChange={(e) => setCreds({...creds, uname: e.target.value})} 
                    />
                </div>
                <div className="mb-4">
                    <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--label-color)', letterSpacing: '0.5px' }}>PASSWORD</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        style={{ height: '50px', borderRadius: '14px' }}
                        placeholder="••••••••" 
                        value={creds.pass}
                        onChange={(e) => setCreds({...creds, pass: e.target.value})} 
                    />
                </div>
                
                <button 
                    className="btn btn-primary w-100 py-3 fw-bold" 
                    onClick={performLogin}
                    style={{ borderRadius: '999px', fontSize: '1.05rem' }}
                >
                    Sign In to Account
                </button>
                
                <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13.5px', color: 'var(--text-muted)' }}>
                    Don't have an account? <a href="/register" style={{ color: '#ff5711', fontWeight: '700', textDecoration: 'none' }}>Sign up</a>
                </p>

                {/* Merchant & Driver Quick Switch Links */}
                <div style={{
                    marginTop: '20px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    textAlign: 'center'
                }}>
                    <div className="mb-2">
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Merchant Partner? </span>
                        <a 
                            href="/merchant/login" 
                            style={{ color: '#ff9e44', fontWeight: '700', textDecoration: 'none', fontSize: '12.5px' }}
                        >
                            Merchant Portal &rarr;
                        </a>
                    </div>
                    <div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Delivery Partner? </span>
                        <a 
                            href="/driver/login" 
                            style={{ color: '#f5bf2d', fontWeight: '700', textDecoration: 'none', fontSize: '12.5px' }}
                        >
                            Driver Portal &rarr;
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;