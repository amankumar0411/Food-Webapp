import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Particles from '../common/Particles';
import toast from 'react-hot-toast';

function DriverLogin({ syncAuth }) {
    const navigate = useNavigate();
    const [creds, setCreds] = useState({ uname: "", pass: "" });

    const performLogin = () => {
        const loadingToast = toast.loading("Authenticating Delivery Partner...");
        
        axiosInstance.post("/register/login", creds)
            .then((res) => {
                toast.dismiss(loadingToast);
                const { token, username, role } = res.data;
                const rLower = role ? role.toLowerCase() : "";
                
                if (rLower !== "driver" && rLower !== "admin") {
                    toast.error("Account exists but is not registered as Delivery Partner.");
                    return;
                }

                localStorage.setItem("token", token);
                localStorage.setItem("user", username);
                localStorage.setItem("role", role);
                
                if (syncAuth) syncAuth();
                toast.success(`Welcome to Delivery Portal, ${username}! 🛵`);
                navigate("/driver/dashboard"); 
            })
            .catch((err) => {
                toast.dismiss(loadingToast);
                if (err.response && err.response.status === 401) {
                    toast.error("Invalid Driver Credentials");
                } else {
                    toast.error("Could not connect to server. Check backend connection.");
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
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                <Particles
                    particleColors={["#f59e0b", "#d97706", "#6c757d"]}
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
                maxWidth: "440px", 
                width: "90%", 
                margin: "auto", 
                backgroundColor: 'var(--card-bg)',
                borderRadius: '24px',
                border: '1px solid #f59e0b',
                zIndex: 2,
                position: 'relative'
            }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                    <span style={{ fontSize: '26px' }}>🛵</span>
                    <h2 style={{ fontWeight: '800', color: 'var(--text-color)', margin: 0, letterSpacing: '-0.5px' }}>Driver Portal</h2>
                </div>
                <p style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 'bold', marginBottom: '25px' }}>
                    Deliver food orders & earn instant trip payouts
                </p>

                <div className="mb-3">
                    <label style={{fontSize:'12px', fontWeight:'bold', color:'var(--label-color)'}}>DRIVER USERNAME</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{ height: '55px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)' }}
                        placeholder="e.g. driver_ramesh" 
                        value={creds.uname}
                        onChange={(e) => setCreds({...creds, uname: e.target.value})} 
                    />
                </div>
                <div className="mb-4">
                    <label style={{fontSize:'12px', fontWeight:'bold', color:'var(--label-color)'}}>PASSWORD</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        style={{ height: '55px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)' }}
                        placeholder="********" 
                        value={creds.pass}
                        onChange={(e) => setCreds({...creds, pass: e.target.value})} 
                    />
                </div>
                
                <button 
                    className="btn w-100 mt-2" 
                    onClick={performLogin}
                    style={{ backgroundColor: '#f59e0b', color: 'white', fontWeight: '700', height: '54px', borderRadius: '12px', fontSize: '1.1rem' }}
                >
                    Sign In as Delivery Partner
                </button>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        Want to deliver food with us? <a href="/driver/register" style={{ color: '#f59e0b', fontWeight: '700', textDecoration: 'none' }}>Register as Partner</a>
                    </p>
                    <a href="/login" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                        &larr; Customer Sign In
                    </a>
                </div>
            </div>
        </div>
    );
}

export default DriverLogin;
