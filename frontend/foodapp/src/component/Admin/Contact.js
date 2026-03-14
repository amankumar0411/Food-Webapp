import React from 'react'

function Contact() {
    const glassStyle = {
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.8)"
    }

    const neonText = {
        color: "#00d4ff",
        textShadow: "0 0 10px #00d4ff, 0 0 20px #00d4ff",
        letterSpacing: "2px"
    }

    return (
        <div style={{ 
            minHeight: "100vh", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            padding: "20px"
        }}>
            <div className="card p-4" style={glassStyle}>
                <div className="row g-0">
                    {/* Left Side: Visual/Image */}
                    <div className="col-md-5 d-none d-md-block">
                        <img 
                            src="https://images.unsplash.com/photo-1614850523296-e8c041db24c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                            className="img-fluid rounded-start h-100" 
                            alt="Futuristic Contact"
                            style={{ objectFit: "cover", opacity: "0.7" }}
                        />
                    </div>

                    {/* Right Side: Content */}
                    <div className="col-md-7">
                        <div className="card-body text-white p-4">
                            <h2 className="mb-4 font-weight-bold" style={neonText}>SYSTEM CONTACT</h2>
                            
                            <div className="mb-4">
                                <h6 className="text-uppercase text-info" style={{fontSize: "0.8rem"}}>Neural Link</h6>
                                <p className="lead">support@amanfood.io</p>
                            </div>

                            <div className="mb-4">
                                <h6 className="text-uppercase text-info" style={{fontSize: "0.8rem"}}>Secure Line</h6>
                                <p className="lead">+91 [SECURE] 43210</p>
                            </div>

                            <div className="mb-4">
                                <h6 className="text-uppercase text-info" style={{fontSize: "0.8rem"}}>HQ Coordinates</h6>
                                <p className="lead">Sector 7, Neo-Durgapur<br/>Grid: 23.48°N, 87.32°E</p>
                            </div>

                            <div className="mt-5 pt-3 border-top border-secondary">
                                <div className="d-flex justify-content-between">
                                    <span className="badge badge-pill badge-outline-info" style={{border: "1px solid #00d4ff", color: "#00d4ff", padding: "8px 15px"}}>ACTIVE NODE</span>
                                    <span className="text-muted small">v2.0.26 // ENCRYPTED</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact