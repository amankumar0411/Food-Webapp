import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import MatrixOrb from '../common/MatrixOrb';

export function VoiceOrderModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultData, setResultData] = useState(null);
    const recognitionRef = useRef(null);

    // Compute orb state ('idle' | 'listening' | 'thinking')
    const orbState = isProcessing ? 'thinking' : isListening ? 'listening' : 'idle';

    useEffect(() => {
        // Web Speech Recognition setup
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const startListening = () => {
        setTranscript("");
        setResultData(null);
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (err) {
                console.error("Start error:", err);
            }
        } else {
            toast.error("Web Speech is not active. Type your order below or try Chrome/Edge.");
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    };

    const handleSubmitVoiceOrder = async (overrideText) => {
        const textToSubmit = overrideText || transcript;
        if (!textToSubmit.trim()) {
            toast.error("Please speak or type your food order.");
            return;
        }

        setIsProcessing(true);
        const loadingToast = toast.loading("Processing your voice order...");

        try {
            const audioBlob = new Blob([textToSubmit], { type: 'audio/wav' });
            const formData = new FormData();
            formData.append("file", audioBlob, "voice_order.wav");
            
            const username = localStorage.getItem("user");
            if (username) {
                formData.append("uname", username);
            }

            const response = await axiosInstance.post("/api/voice-order", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.dismiss(loadingToast);
            const data = response.data;
            setResultData(data);

            if (data.matchedItems && data.matchedItems.length > 0) {
                toast.success(`🎉 Added ${data.matchedItems.length} item(s) directly to your cart!`);
            }

            if (data.redirectTo === "/billing" && (!data.unmatchedItems || data.unmatchedItems.length === 0)) {
                setTimeout(() => {
                    onClose();
                    navigate("/billing");
                }, 1200);
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("Failed to process voice order. Please try again.");
            console.error("Voice order error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 99999
        }}>
            <div className="card p-4 text-center shadow-lg" style={{
                maxWidth: '520px', width: '92%', borderRadius: '28px',
                backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)'
            }}>
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: '1.8rem' }}>🎙️</span>
                        <h4 className="fw-bold m-0" style={{ color: 'var(--text-color)' }}>Quick Voice Order</h4>
                    </div>
                    <button className="btn-close" onClick={onClose} style={{ filter: 'var(--close-filter)' }} />
                </div>

                <p className="text-muted small mb-3">
                    Speak your order naturally (e.g. <em>"Order 2 chicken fried with garlic bread"</em>) and we'll add items directly to your cart!
                </p>

                {/* MATRIX ORB ANIMATED SPEECH STATE */}
                <div className="my-3 d-flex flex-column align-items-center justify-content-center">
                    <MatrixOrb 
                        state={orbState}
                        size={210}
                        color="var(--primary-color)"
                        onClick={isListening ? stopListening : startListening}
                    />
                    <button 
                        className={`btn btn-sm mt-2 px-4 fw-bold ${isListening ? 'btn-danger' : 'btn-outline-danger'}`}
                        onClick={isListening ? stopListening : startListening}
                        style={{ borderRadius: '20px' }}
                    >
                        {isListening ? '🛑 Stop Listening' : '🎙️ Tap Orb to Speak'}
                    </button>
                </div>

                {/* Live Transcript Display Box */}
                <div className="mb-3 p-3 rounded-4" style={{
                    backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)',
                    minHeight: '80px', textAlign: 'left'
                }}>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--label-color)' }}>SPOKEN TRANSCRIPT:</label>
                    <textarea 
                        className="form-control border-0 bg-transparent"
                        rows="2"
                        placeholder='Your spoken text will appear here... or type: "2 chicken fried with garlic bread"'
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        style={{ fontSize: '0.95rem', fontWeight: '600', resize: 'none' }}
                    />
                </div>

                {/* Result Status Display */}
                {resultData && (
                    <div className="mb-3 text-start">
                        {resultData.matchedItems && resultData.matchedItems.length > 0 && (
                            <div className="alert alert-success py-2 mb-2 small">
                                <strong>✅ Matched & Added to Cart:</strong>
                                <ul className="m-0 ps-3">
                                    {resultData.matchedItems.map((m, i) => (
                                        <li key={i}>{m.fname} × {m.qty} (₹{m.totalPrice})</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {resultData.unmatchedItems && resultData.unmatchedItems.length > 0 && (
                            <div className="alert alert-warning py-2 mb-2 small">
                                <strong>❓ Could not match:</strong>
                                <ul className="m-0 ps-3">
                                    {resultData.unmatchedItems.map((u, i) => (
                                        <li key={i}>"{u.item}" (Qty: {u.quantity})</li>
                                    ))}
                                </ul>
                                <span className="small text-muted">Please clarify or browse the menu to add manually.</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="d-flex gap-2">
                    <button 
                        className="btn btn-outline-secondary w-50 py-2 fw-bold"
                        onClick={onClose}
                        style={{ borderRadius: '12px' }}
                    >
                        Cancel
                    </button>
                    <button 
                        className="btn btn-warning w-50 py-2 fw-bold"
                        disabled={isProcessing || !transcript.trim()}
                        onClick={() => handleSubmitVoiceOrder()}
                        style={{ backgroundColor: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '12px' }}
                    >
                        {isProcessing ? "Processing..." : "Submit Voice Order 🚀"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VoiceOrderModal;
