import React from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from '../common/Particles';

function Home() {
  const navigate = useNavigate();
  const auth = localStorage.getItem("user");

  return (
    <div className="home-wrapper" style={{ 
        height: '100vh', 
        width: '100%',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        margin: '0',
        padding: '0'
    }}>
        {/* Particles Background Layer */}
        <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            zIndex: 1,
            pointerEvents: 'none' 
        }}>
            <Particles
                particleColors={["#ffffff", "#e23744", "#f1f1f1"]}
                particleCount={300}
                particleSpread={12}
                speed={0.6}
                particleBaseSize={150}
                moveParticlesOnHover={true}
                alphaParticles={true}
                disableRotation={false}
                pixelRatio={window.devicePixelRatio || 1}
            />
        </div>

        <div className="content-box text-center" style={{ maxWidth: '850px', width: '100%', zIndex: 2, position: 'relative' }}>
            <h1 style={{ 
                fontSize: 'clamp(3rem, 10vw, 5.5rem)', 
                fontWeight: '900', 
                letterSpacing: '-2px',
                color: '#ffffff', 
                marginBottom: '10px',
                textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                textTransform: 'uppercase'
            }}>
                TASTY WHEELS
            </h1>
            <p style={{ 
                fontSize: 'clamp(1rem, 4vw, 1.8rem)', 
                color: '#f1f1f1', 
                marginBottom: '50px', 
                fontWeight: '400',
                letterSpacing: '1px',
                opacity: 0.9
            }}>
                Experience the Future of Fine Dining & Delivery
            </p>
            
            <div className="logo-container" style={{ position: 'relative', display: 'inline-block', marginBottom: '50px' }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '320px',
                    height: '320px',
                    background: 'radial-gradient(circle, rgba(226, 55, 68, 0.2) 0%, transparent 70%)',
                    zIndex: -1,
                    borderRadius: '50%'
                }}></div>
                <img 
                    src="https://tastywheels.rf.gd/wp-content/uploads/2024/04/cropped-logo-4.png" 
                    height={280} 
                    width={280} 
                    alt="Tasty Wheels"
                    style={{ 
                        borderRadius: '50%', 
                        border: '8px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 15px 45px rgba(0,0,0,0.7)',
                        transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05) rotate(5deg)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                />
            </div>
            
            <div className="button-group" style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                {!auth ? (
                    <>
                        <button 
                            className='btn btn-lg' 
                            onClick={() => navigate('/login')}
                            style={{ 
                                backgroundColor: 'var(--primary-color)', 
                                color: 'white', 
                                fontWeight: '700', 
                                padding: '15px 45px',
                                border: 'none',
                                borderRadius: '50px',
                                fontSize: '1.2rem',
                                boxShadow: '0 10px 20px rgba(226, 55, 68, 0.4)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            Log in
                        </button>
                        <button 
                            className='btn btn-lg' 
                            onClick={() => navigate('/register')}
                            style={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                                color: '#ffffff', 
                                fontWeight: '700', 
                                padding: '15px 45px',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '50px',
                                fontSize: '1.2rem',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                e.currentTarget.style.transform = 'translateY(-3px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            Sign up
                        </button>
                    </>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button 
                            className='btn btn-lg' 
                            onClick={() => {
                                const isAdmin = auth && auth.toLowerCase() === "admin";
                                navigate(isAdmin ? '/foodlist' : '/foodlistclient');
                            }}
                            style={{ 
                                backgroundColor: 'var(--primary-color)', 
                                color: 'white', 
                                fontWeight: '700', 
                                padding: '18px 40px',
                                borderRadius: '50px',
                                border: 'none',
                                fontSize: '1.1rem',
                                boxShadow: '0 12px 24px rgba(226, 55, 68, 0.5)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
                        >
                            Explore Menu
                        </button>
                        
                        {/* Mobile Theme Toggle Beside Explore */}
                        <div className="mobile-only-theme-toggle" style={{
                            display: window.innerWidth <= 850 ? 'flex' : 'none',
                            alignItems: 'center',
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            padding: '10px',
                            borderRadius: '50px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            cursor: 'pointer'
                        }} onClick={() => {
                            // Find the hidden header button or manually trigger theme change
                            const themeInput = document.querySelector('.theme-switch input');
                            if (themeInput) themeInput.click();
                        }}>
                             <span style={{ fontSize: '1.5rem' }}>🌓</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}

export default Home;