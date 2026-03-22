import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react'; // Added useState and useEffect imports

function Billing() {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Payment Gateway States
    const [isPaying, setIsPaying] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("confirm"); // 'confirm' | 'processing' | 'success' | 'error'

    const uname = localStorage.getItem("user");

    useEffect(() => {
        if (uname) {
            axiosInstance.get(`/orders/user/details/${uname}`)
                .then((res) => {

                    setInvoices(res.data);
                    setLoading(false);
                })
                .catch((err) => {

                    setLoading(false);
                });
        }
    }, [uname]);

    // Calculate Grand Total 
    const grandTotal = invoices.reduce((sum, item) => {
        return sum + (Number(item.totalprice) || Number(item.TOTALPRICE) || 0);
    }, 0);

    // Mock Zomato Payment Gateway & Cart Clearance
    const handlePayment = async () => {
        setPaymentStatus("processing");
        const loadingToast = toast.loading("Connecting to payment gateway...");
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 1. Build order_dtls payload — one entry per cart line
            const orderDtlsPayload = invoices.map(item => ({
                uname:      item.uname      || item.UNAME      || uname,
                fid:        item.fid        || item.FID        || '',
                fname:      item.fname      || item.FNAME      || '',
                qty:        Number(item.qty        || item.QTY)        || 1,
                unitPrice:  Number(item.fprice     || item.FPRICE)     || 0,
                totalPrice: Number(item.totalprice || item.TOTALPRICE) || 0,
                grandTotal: grandTotal,
            }));

            // 2. Persist to order_dtls table (required — must succeed before clearing cart)
            await axiosInstance.post("/order-dtls/save", orderDtlsPayload);

            // 3. Clear cart (delete from order_table)
            await Promise.all(
                invoices.map(item =>
                    axiosInstance.delete(`/orders/delete/${item.oid || item.OID}`)
                )
            );
            
            toast.dismiss(loadingToast);
            toast.success("Payment Received! Order Placed. 🎉");
            setPaymentStatus("success");
            
            setTimeout(() => {
                setIsPaying(false);
                navigate('/');
            }, 2500);
            
        } catch (error) {
            toast.dismiss(loadingToast);
            const status = error?.response?.status;
            const msg = status === 401 ? "Session expired. Please login again."
                      : status === 403 ? "Permission denied. Contact admin."
                      : "Payment failed. Could not save order details. Please try again.";
            toast.error(msg);
            setPaymentStatus("error");
            setTimeout(() => setPaymentStatus("confirm"), 3000);
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
            <div className="container p-5 shadow-sm" style={{ borderRadius: '24px', backgroundColor: 'var(--card-bg)', maxWidth: '900px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                    <div>
                        <h2 style={{ fontWeight: '800', color: 'var(--text-color)', margin: 0 }}>FINAL BILL</h2>
                        <p className="text-muted small">Invoice Generated on {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="text-end">
                        <p className="m-0 text-muted" style={{ fontSize: '12px' }}>CUSTOMER</p>
                        <h5 className="fw-bold m-0" style={{ color: 'var(--primary-color)' }}>{uname?.toUpperCase()}</h5>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-warning" role="status"></div>
                        <p className="mt-2">Fetching your cart items...</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover border">
                            <thead className="table-light">
                                <tr>
                                    <th>ORDER ID</th>
                                    <th>FOOD ITEM</th>
                                    <th>UNIT PRICE</th>
                                    <th className="text-center">QTY</th>
                                    <th className="text-end">TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.length > 0 ? invoices.map((inv, index) => (
                                    <tr key={index}>
                                        <td>#ORD-{inv.oid || inv.OID}</td>
                                        <td className="fw-bold">{inv.fname || inv.FNAME}</td>
                                        <td>₹{inv.fprice || inv.FPRICE}</td>
                                        <td className="text-center">{inv.qty || inv.QTY}</td>
                                        <td className="text-end fw-bold text-success">
                                            ₹{(inv.totalprice || inv.TOTALPRICE || 0).toFixed(2)}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            No items found in your cart for this session.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            {invoices.length > 0 && (
                                <tfoot>
                                    <tr>
                                        <td colSpan="4" className="text-end fw-bold" style={{ backgroundColor: 'var(--header-bg)', color: 'var(--text-color)' }}>GRAND TOTAL:</td>
                                        <td className="text-end fw-bold text-danger" style={{ fontSize: '1.4rem', backgroundColor: 'var(--header-bg)' }}>
                                            ₹{grandTotal.toFixed(2)}
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                )}

                <div className="mt-5 d-flex justify-content-between align-items-center border-top pt-4">
                    <button className="btn px-4 py-2" style={{ border: '1px solid var(--border-color)', color: 'var(--text-color)', borderRadius: '12px' }} onClick={() => window.location.href = '/addorder'}>
                       ← BACK TO CART
                    </button>
                    <div>
                        <button className="btn px-4 py-2 me-3" style={{ backgroundColor: 'var(--text-color)', color: 'var(--bg-color)', borderRadius: '12px' }} onClick={() => window.print()}>PRINT INVOICE</button>
                        <button className="btn btn-warning px-5 py-2 fw-bold" 
                                style={{ backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px' }}
                                onClick={() => setIsPaying(true)}>
                            PAY NOW
                        </button>
                    </div>
                </div>
            </div>

            {/* ZOMATO PAY FULLSCREEN OVERLAY */}
            {isPaying && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div className="card shadow-lg p-5 text-center" style={{ maxWidth: '450px', width: '90%', borderRadius: '24px', backgroundColor: 'var(--card-bg)' }}>
                        <h3 className="fw-bold mb-4" style={{ color: 'var(--text-color)' }}>💳 Zomato Pay</h3>
                        
                        <div className="mb-4 p-4 rounded-4" style={{ backgroundColor: 'var(--header-bg)', border: '1px solid var(--border-color)' }}>
                            <p className="text-muted mb-1">Amount to pay</p>
                            <h2 className="fw-bold mb-0" style={{ color: 'var(--text-color)' }}>₹{grandTotal.toFixed(2)}</h2>
                        </div>

                        {paymentStatus === "confirm" && (
                            <>
                                <button className="btn w-100 py-3 mb-3 fw-bold flex-grow-1" 
                                    style={{ backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '14px', fontSize: '1.1rem' }}
                                    onClick={handlePayment}
                                >
                                    Confirm Secure Payment
                                </button>
                                <button className="btn text-muted fw-bold" onClick={() => setIsPaying(false)}>
                                    Cancel Transaction
                                </button>
                            </>
                        )}
                        
                        {paymentStatus === "processing" && (
                            <div className="py-4">
                                <div className="spinner-border mb-3" style={{ color: 'var(--primary-color)' }} role="status"></div>
                                <h5 className="fw-bold" style={{ color: 'var(--text-color)' }}>Processing Secure Payment...</h5>
                                <p className="text-muted small">Please don't close this window.</p>
                            </div>
                        )}

                        {paymentStatus === "success" && (
                            <div className="py-4">
                                <span style={{ fontSize: '4rem' }}>✅</span>
                                <h4 className="fw-bold text-success mt-3">Payment Successful!</h4>
                                <p className="text-muted">Your order has been placed. Redirecting to home...</p>
                            </div>
                        )}

                        {paymentStatus === "error" && (
                            <div className="py-4">
                                <span style={{ fontSize: '4rem' }}>❌</span>
                                <h4 className="fw-bold text-danger mt-3">Transaction Failed</h4>
                                <p className="text-muted">Could not synchronize with the database. Please try again.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Billing;