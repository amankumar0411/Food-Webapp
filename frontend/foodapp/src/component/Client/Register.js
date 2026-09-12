import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from '../common/Particles';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

function Register() {
    const navigate = useNavigate();
    let [user, setUser] = useState({ 
        uname: "", 
        pass: "", 
        nm: "", 
        email: "", 
        phno: "",
        role: "user"
    });

    const addData = () => {
        const loadingToast = toast.loading("Creating your account...");
        axiosInstance.post("/register/add", user)
            .then(() => {
                toast.dismiss(loadingToast);
                toast.success("Registration Successful! Please Login 🎉");
                navigate('/login');
            })
            .catch(() => {
                toast.dismiss(loadingToast);
                toast.error("Registration Failed. Please check your details.");
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
            padding: '60px 20px' 
        }}>
            {/* Background Particles Layer */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
                <Particles
                    particleColors={["#ff5711", "#f5bf2d", "#ffffff"]}
                    particleCount={180}
                    particleSpread={15}
                    speed={0.4}
                    particleBaseSize={120}
                    moveParticlesOnHover={true}
                    alphaParticles={true}
                />
            </div>

            <div className="card p-4 p-md-5 shadow-lg" style={{ 
                maxWidth: "460px", 
                width: "100%", 
                backgroundColor: 'rgba(36, 8, 21, 0.9)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                zIndex: 2,
                position: 'relative'
            }}>
                <div className="text-center mb-4">
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255, 87, 17, 0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#ff5711' }}>person_add</span>
                    </div>
                    <h2 style={{ fontWeight: '800', marginBottom: '4px', color: 'var(--text-color)', letterSpacing: '-0.5px' }}>Create Account</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                        Already registered? <a href="/login" style={{ textDecoration: 'none', color: '#ff5711', fontWeight: '700' }}>Sign in here</a>
                    </p>
                </div>

                <div className="mb-2.5">
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{ height: '48px', borderRadius: '12px' }}
                        placeholder="Username" 
                        value={user.uname}
                        onChange={(e) => setUser({...user, uname: e.target.value})} 
                    />
                </div>
                <div className="mb-2.5">
                    <input 
                        type="password" 
                        className="form-control" 
                        style={{ height: '48px', borderRadius: '12px' }}
                        placeholder="Password" 
                        value={user.pass}
                        onChange={(e) => setUser({...user, pass: e.target.value})} 
                    />
                </div>
                <div className="mb-2.5">
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{ height: '48px', borderRadius: '12px' }}
                        placeholder="Full Name" 
                        value={user.nm}
                        onChange={(e) => setUser({...user, nm: e.target.value})} 
                    />
                </div>
                <div className="mb-2.5">
                    <input 
                        type="email" 
                        className="form-control" 
                        style={{ height: '48px', borderRadius: '12px' }}
                        placeholder="Email Address" 
                        value={user.email}
                        onChange={(e) => setUser({...user, email: e.target.value})} 
                    />
                </div>
                <div className="mb-3.5">
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{ height: '48px', borderRadius: '12px' }}
                        placeholder="Phone Number" 
                        value={user.phno}
                        onChange={(e) => setUser({...user, phno: e.target.value})} 
                    />
                </div>
                
                <button 
                    className="btn btn-primary w-100 py-3 fw-bold" 
                    onClick={addData}
                    style={{ borderRadius: '999px', fontSize: '1.05rem' }}
                >
                    Complete Sign Up
                </button>
                
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '14px', textAlign: 'center' }}>
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                </p>

                {/* Merchant & Delivery Partner Banners */}
                <div style={{
                    marginTop: '20px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    textAlign: 'center'
                }}>
                    <div className="mb-2">
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Restaurant Owner? </span>
                        <a 
                            href="/merchant/register" 
                            style={{ color: '#ff9e44', fontWeight: '700', textDecoration: 'none', fontSize: '12.5px' }}
                        >
                            Sign up Merchant &rarr;
                        </a>
                    </div>

                    <div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Want to deliver with us? 🛵 </span>
                        <a 
                            href="/driver/register" 
                            style={{ color: '#f5bf2d', fontWeight: '700', textDecoration: 'none', fontSize: '12.5px' }}
                        >
                            Sign up Driver &rarr;
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;