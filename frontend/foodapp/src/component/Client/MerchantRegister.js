import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from '../common/Particles';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

function MerchantRegister() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ 
        uname: "", 
        pass: "", 
        nm: "", 
        email: "", 
        phno: "",
        role: "merchant"
    });

    const addData = () => {
        const loadingToast = toast.loading("Registering your restaurant...");
        axiosInstance.post("/register/add", user)
            .then(() => {
                toast.dismiss(loadingToast);
                toast.success("Merchant Account Created! Please Sign In.");
                navigate('/merchant/login');
            })
            .catch(() => {
                toast.dismiss(loadingToast);
                toast.error("Merchant Registration Failed. Please check your details.");
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
            padding: '40px 20px' 
        }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                <Particles
                    particleColors={["#10b981", "#059669", "#6c757d"]}
                    particleCount={180}
                    particleSpread={15}
                    speed={0.4}
                    particleBaseSize={120}
                    moveParticlesOnHover={true}
                    alphaParticles={true}
                    disableRotation={false}
                />
            </div>

            <div className="container p-5 shadow-sm" style={{ 
                maxWidth: "460px", 
                width: "90%", 
                backgroundColor: 'var(--card-bg)',
                borderRadius: '24px',
                border: '1px solid #10b981',
                zIndex: 2,
                position: 'relative'
            }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                    <span style={{ fontSize: '24px' }}>🏪</span>
                    <h2 style={{ fontWeight: '800', marginBottom: 0, color: 'var(--text-color)', letterSpacing: '-0.5px' }}>Partner Registration</h2>
                </div>
                <p style={{ fontSize: '13px', color: '#10b981', fontWeight: 'bold', marginBottom: '25px' }}>
                    Create a Merchant Partner Account
                </p>

                <div className="mb-2">
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{ height: '52px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)' }}
                        placeholder="Merchant Username" 
                        value={user.uname}
                        onChange={(e) => setUser({...user, uname: e.target.value})} 
                    />
                </div>
                <div className="mb-2">
                    <input 
                        type="password" 
                        className="form-control" 
                        style={{ height: '52px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)' }}
                        placeholder="Password" 
                        value={user.pass}
                        onChange={(e) => setUser({...user, pass: e.target.value})} 
                    />
                </div>
                <div className="mb-2">
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{ height: '52px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)' }}
                        placeholder="Restaurant / Owner Name" 
                        value={user.nm}
                        onChange={(e) => setUser({...user, nm: e.target.value})} 
                    />
                </div>
                <div className="mb-2">
                    <input 
                        type="email" 
                        className="form-control" 
                        style={{ height: '52px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)' }}
                        placeholder="Business Email" 
                        value={user.email}
                        onChange={(e) => setUser({...user, email: e.target.value})} 
                    />
                </div>
                <div className="mb-4">
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{ height: '52px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)' }}
                        placeholder="Contact Phone Number" 
                        value={user.phno}
                        onChange={(e) => setUser({...user, phno: e.target.value})} 
                    />
                </div>
                
                <button 
                    className="btn w-100" 
                    onClick={addData}
                    style={{ 
                        backgroundColor: '#10b981', 
                        color: 'white', 
                        fontWeight: '600', 
                        height: '52px',
                        borderRadius: '12px',
                        fontSize: '1.1rem'
                    }}
                >
                    Register Restaurant
                </button>
                
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        Already registered? <a href="/merchant/login" style={{ color: '#10b981', fontWeight: '600', textDecoration: 'none' }}>Sign In here</a>
                    </p>
                    <a href="/register" style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                        &larr; Switch to Customer Signup
                    </a>
                </div>
            </div>
        </div>
    );
}

export default MerchantRegister;
