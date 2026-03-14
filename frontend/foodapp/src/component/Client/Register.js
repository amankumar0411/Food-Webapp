import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Particles from '../common/Particles';

function Register() {
    const navigate = useNavigate();
    let [user, setUser] = useState({
        uname: "",
        pass: "",
        nm: "",
        email: "",
        phno: ""
    });
    let [msg, setMsg] = useState("");

    const addData = () => {
        axios.post("https://foodapp-api1.onrender.com/register/add", user)
            .then((res) => {
                alert("Registration Successful! Please Login.");
                navigate('/login');
            })
            .catch((error) => {
                setMsg(error.response?.data || "REGISTRATION FAILED");
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
            {/* Background Particles Layer */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                <Particles
                    particleColors={["#e23744", "var(--text-muted)"]}
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
                maxWidth: "450px", 
                width: "90%", 
                backgroundColor: 'var(--card-bg)',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                zIndex: 2,
                position: 'relative'
            }}>
                <h2 style={{ fontWeight: '800', marginBottom: '5px', color: 'var(--text-color)', letterSpacing: '-0.5px' }}>Sign up</h2>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '30px' }}>
                    or <a href="/login" style={{ textDecoration: 'none', color: 'var(--primary-color)' }}>log in to your account</a>
                </p>

                <div className="mb-2">
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{ height: '52px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)' }}
                        placeholder="Username" 
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
                        placeholder="Full Name" 
                        value={user.nm}
                        onChange={(e) => setUser({...user, nm: e.target.value})} 
                    />
                </div>
                <div className="mb-2">
                    <input 
                        type="email" 
                        className="form-control" 
                        style={{ height: '52px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)' }}
                        placeholder="Email" 
                        value={user.email}
                        onChange={(e) => setUser({...user, email: e.target.value})} 
                    />
                </div>
                <div className="mb-4">
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{ height: '52px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)' }}
                        placeholder="Phone Number" 
                        value={user.phno}
                        onChange={(e) => setUser({...user, phno: e.target.value})} 
                    />
                </div>
                
                <button 
                    className="btn w-100" 
                    onClick={addData}
                    style={{ 
                        backgroundColor: 'var(--primary-color)', 
                        color: 'white', 
                        fontWeight: '600', 
                        height: '52px',
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        marginTop: '10px'
                    }}
                >
                    Create account
                </button>
                
                <p style={{ fontSize: '11px', color: 'var(--label-color)', marginTop: '15px' }}>
                    By creating an account, I accept the Terms & Conditions & Privacy Policy
                </p>
                <p className="text-danger text-center mt-2">{msg}</p>
            </div>
        </div>
    );
}

export default Register;