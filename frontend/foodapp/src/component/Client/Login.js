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
                
                // STORE SECURE TOKEN AND USER DATA
                localStorage.setItem("token", token);
                localStorage.setItem("user", username);
                localStorage.setItem("role", role);
                
                if (syncAuth) syncAuth(); // Sync App.js state
                
                toast.success(`Welcome back, ${username}!`);
                
                // DYNAMIC REDIRECT
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
            backgroundColor: 'var(--bg-color)',
            flexDirection: 'column',
            padding: '40px 20px'
        }}>
            {/* Background Particles Layer */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                <Particles
                    particleColors={["#e23744", "#6c757d"]}
                    particleCount={150}
                    particleSpread={15}
                    speed={0.4}
                    particleBaseSize={120}
                    moveParticlesOnHover={true}
                    alphaParticles={true}
                    disableRotation={false}
                />
            </div>

            <div className="container p-5 shadow-sm" style={{ 
                maxWidth: "420px", 
                width: "90%", 
                margin: "auto", 
                backgroundColor: 'var(--card-bg)',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                zIndex: 2,
                position: 'relative'
            }}>
                <h2 style={{ fontWeight: '800', color: 'var(--text-color)', letterSpacing: '-0.5px' }}>Customer Login</h2>
                <p style={{ fontSize: '13px', color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '30px' }}>
                    Enter your credentials to continue
                </p>

                <div className="mb-3">
                    <label style={{fontSize:'12px', fontWeight:'bold', color:'var(--label-color)'}}>USERNAME</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{ height: '55px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)' }}
                        placeholder="e.g. aman" 
                        value={creds.uname}
                        onChange={(e) => setCreds({...creds, uname: e.target.value})} 
                    />
                </div>
                <div className="mb-4">
                    <label style={{fontSize:'12px', fontWeight:'bold', color:'var(--label-color)'}}>PASSWORD</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        style={{ height: '55px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)' }}
                        placeholder="********" 
                        value={creds.pass}
                        onChange={(e) => setCreds({...creds, pass: e.target.value})} 
                    />
                </div>
                
                <button 
                    className="btn w-100 mt-2" 
                    onClick={performLogin}
                    style={{ backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: '600', height: '54px', borderRadius: '12px', fontSize: '1.1rem' }}
                >
                    Continue
                </button>
                <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Don't have an account? <a href="/register" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>Sign up</a>
                </p>

                {/* Bottom Merchant & Driver Banners */}
                <div style={{
                    marginTop: '25px',
                    paddingTop: '20px',
                    borderTop: '1px solid var(--border-color)',
                    textAlign: 'center'
                }}>
                    <div className="mb-3">
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                            Are you a Restaurant Partner?
                        </p>
                        <a 
                            href="/merchant/login" 
                            style={{ color: '#10b981', fontWeight: '700', textDecoration: 'none', fontSize: '14px' }}
                        >
                            Access Merchant Portal &rarr;
                        </a>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                            Want to deliver food & earn with us?
                        </p>
                        <a 
                            href="/driver/login" 
                            style={{ color: '#f59e0b', fontWeight: '700', textDecoration: 'none', fontSize: '14px' }}
                        >
                            Access Delivery Partner Portal &rarr;
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;