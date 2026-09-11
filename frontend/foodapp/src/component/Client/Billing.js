import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react'; // Added useState and useEffect imports

function Billing() {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Payment & Checkout States
    const [isPaying, setIsPaying] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("confirm"); // 'confirm' | 'processing' | 'success' | 'error'
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [notes, setNotes] = useState("");

    // Swiggy Billing & Coupon States
    const [couponInput, setCouponInput] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [isVipMember, setIsVipMember] = useState(false);

    const uname = localStorage.getItem("user");

    useEffect(() => {
        if (uname) {
            axiosInstance.get(`/orders/user/details/${uname}`)
                .then((res) => {
                    setInvoices(res.data);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, [uname]);

    // Swiggy Fee Structure Calculations
    const itemTotal = invoices.reduce((sum, item) => {
        return sum + (Number(item.totalprice) || Number(item.TOTALPRICE) || 0);
    }, 0);

    const platformFee = itemTotal > 0 ? 5.00 : 0.00;
    const deliveryFee = itemTotal > 0 ? (isVipMember ? 0.00 : 25.00) : 0.00;
    const vipPassFee = isVipMember ? 49.00 : 0.00;

    // Apply Coupon Logic
    const handleApplyCoupon = (codeToApply) => {
        const code = (codeToApply || couponInput).trim().toUpperCase();
        if (!code) {
            toast.error("Please enter a coupon code.");
            return;
        }

        if (code === "SWIGGY50") {
            const disc = Math.min(itemTotal * 0.5, 100);
            setDiscountAmount(disc);
            setAppliedCoupon("SWIGGY50");
            toast.success("Coupon SWIGGY50 applied! Saved ₹" + disc.toFixed(2));
        } else if (code === "WELCOME100") {
            const disc = Math.min(100, itemTotal);
            setDiscountAmount(disc);
            setAppliedCoupon("WELCOME100");
            toast.success("Coupon WELCOME100 applied! Saved ₹" + disc.toFixed(2));
        } else {
            toast.error("Invalid coupon code. Try SWIGGY50 or WELCOME100.");
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponInput("");
        toast("Coupon removed");
    };

    const grandTotal = Math.max(0, itemTotal + platformFee + deliveryFee + vipPassFee - discountAmount);

    const handlePayment = async () => {
        if (!deliveryAddress.trim()) {
            toast.error("Please enter a valid delivery address.");
            return;
        }
        if (!phoneNumber.trim()) {
            toast.error("Please enter a contact phone number.");
            return;
        }

        setPaymentStatus("processing");
        const loadingToast = toast.loading("Processing order & payment...");
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 1. Build order_dtls payload — one entry per cart line
            const orderDtlsPayload = invoices.map(item => ({
                uname:           item.uname           || item.UNAME           || uname,
                fid:             item.fid             || item.FID             || '',
                fname:           item.fname           || item.FNAME           || '',
                qty:             Number(item.qty             || item.QTY)             || 1,
                unitPrice:       Number(item.fprice          || item.FPRICE)          || 0,
                totalPrice:      Number(item.totalprice      || item.TOTALPRICE)      || 0,
                deliveryFee:     deliveryFee,
                platformFee:     platformFee,
                discountAmount:  discountAmount,
                couponCode:      appliedCoupon || '',
                grandTotal:      grandTotal,
                deliveryAddress: deliveryAddress,
                phoneNumber:     phoneNumber,
                paymentMethod:   paymentMethod,
                notes:           notes,
                orderStatus:     "PAID"
            }));

            // 2. Persist to order_dtls table
            await axiosInstance.post("/order-dtls/save", orderDtlsPayload);

            // 3. Clear cart (delete from order_table)
            await Promise.all(
                invoices.map(item =>
                    axiosInstance.delete(`/orders/delete/${item.oid || item.OID}`)
                )
            );
            
            toast.dismiss(loadingToast);
            toast.success("Order Placed Successfully! 🎉");
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
                        <h2 style={{ fontWeight: '800', color: 'var(--text-color)', margin: 0 }}>FINAL BILL & CHECKOUT</h2>
                        <p className="text-muted small">Invoice Generated on {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="text-end">
                        <p className="m-0 text-muted" style={{ fontSize: '12px' }}>CUSTOMER</p>
                        <h5 className="fw-bold m-0" style={{ color: 'var(--primary-color)' }}>{uname?.toUpperCase()}</h5>
                    </div>
                </div>

                {/* Delivery Information Section */}
                <div className="mb-4 p-4 rounded-4" style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)' }}>
                    <h5 className="fw-bold mb-3" style={{ color: 'var(--text-color)' }}>📍 Delivery & Contact Details</h5>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--label-color)' }}>DELIVERY ADDRESS *</label>
                            <textarea 
                                className="form-control" 
                                rows="2" 
                                placeholder="House / Flat No., Street, City, Pincode"
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                style={{ borderRadius: '12px', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                        <div className="col-md-6">
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--label-color)' }}>PHONE NUMBER *</label>
                            <input 
                                type="text" 
                                className="form-control mb-2" 
                                placeholder="10-digit mobile number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                style={{ height: '45px', borderRadius: '12px', border: '1px solid var(--border-color)' }}
                            />
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--label-color)' }}>SPECIAL INSTRUCTIONS</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="e.g., Less spicy, Leave at doorstep"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                style={{ height: '45px', borderRadius: '12px', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Swiggy Offers & VIP Membership Section */}
                <div className="row g-3 mb-4">
                    {/* Coupons Box */}
                    <div className="col-md-6">
                        <div className="p-3 rounded-4" style={{ border: '1px dashed var(--primary-color)', backgroundColor: 'rgba(226,55,68,0.04)' }}>
                            <h6 className="fw-bold mb-2" style={{ color: 'var(--text-color)' }}>🏷️ Coupons & Offers</h6>
                            {appliedCoupon ? (
                                <div className="d-flex justify-content-between align-items-center bg-white p-2 rounded-3 border">
                                    <div>
                                        <span className="badge bg-success me-2">{appliedCoupon}</span>
                                        <span className="small text-success fw-bold">Saved ₹{discountAmount.toFixed(2)}</span>
                                    </div>
                                    <button className="btn btn-sm btn-outline-danger" onClick={handleRemoveCoupon}>Remove</button>
                                </div>
                            ) : (
                                <div>
                                    <div className="input-group mb-2">
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Enter Coupon (e.g. SWIGGY50)"
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                            style={{ borderRadius: '8px 0 0 8px' }}
                                        />
                                        <button className="btn btn-danger fw-bold" onClick={() => handleApplyCoupon()}>Apply</button>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-light border fw-bold text-danger" onClick={() => handleApplyCoupon("SWIGGY50")}>
                                            🔥 SWIGGY50 (50% OFF)
                                        </button>
                                        <button className="btn btn-sm btn-light border fw-bold text-primary" onClick={() => handleApplyCoupon("WELCOME100")}>
                                            🎉 WELCOME100 (₹100 OFF)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FoodApp One Membership Box */}
                    <div className="col-md-6">
                        <div className="p-3 rounded-4" style={{ border: '1px solid #f59e0b', backgroundColor: '#fffbe8' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="fw-bold mb-1" style={{ color: '#b45309' }}>⭐ FoodApp One VIP Pass</h6>
                                    <p className="small text-muted mb-0">Get FREE Delivery on all orders for ₹49/mo!</p>
                                </div>
                                <div className="form-check form-switch">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        role="switch" 
                                        id="vipSwitch"
                                        checked={isVipMember}
                                        onChange={(e) => {
                                            setIsVipMember(e.target.checked);
                                            if (e.target.checked) toast.success("FoodApp One VIP Pass Added! Free Delivery unlocked 🎉");
                                        }}
                                        style={{ width: '45px', height: '22px', cursor: 'pointer' }}
                                    />
                                </div>
                            </div>
                        </div>
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
                                        <td colSpan="4" className="text-end fw-bold" style={{ backgroundColor: 'var(--header-bg)', color: 'var(--text-color)' }}>Items Total:</td>
                                        <td className="text-end fw-bold" style={{ backgroundColor: 'var(--header-bg)' }}>₹{itemTotal.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4" className="text-end text-muted small">Platform Fee:</td>
                                        <td className="text-end text-muted small">₹{platformFee.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4" className="text-end text-muted small">
                                            Delivery Partner Fee: {isVipMember && <span className="badge bg-success ms-1">FREE with VIP</span>}
                                        </td>
                                        <td className="text-end text-muted small">
                                            {deliveryFee === 0 ? <s className="text-muted">₹25.00</s> : `₹${deliveryFee.toFixed(2)}`}
                                        </td>
                                    </tr>
                                    {isVipMember && (
                                        <tr>
                                            <td colSpan="4" className="text-end text-warning fw-bold small">FoodApp One VIP Pass Subscription:</td>
                                            <td className="text-end text-warning fw-bold small">₹49.00</td>
                                        </tr>
                                    )}
                                    {discountAmount > 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-end text-success fw-bold">Coupon Discount ({appliedCoupon}):</td>
                                            <td className="text-end text-success fw-bold">- ₹{discountAmount.toFixed(2)}</td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td colSpan="4" className="text-end fw-bold fs-5" style={{ backgroundColor: 'var(--header-bg)', color: 'var(--text-color)' }}>FINAL GRAND TOTAL:</td>
                                        <td className="text-end fw-bold text-danger fs-4" style={{ backgroundColor: 'var(--header-bg)' }}>
                                            ₹{grandTotal.toFixed(2)}
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                )}

                <div className="mt-5 d-flex justify-content-between align-items-center border-top pt-4">
                    <button className="btn px-4 py-2" style={{ border: '1px solid var(--border-color)', color: 'var(--text-color)', borderRadius: '12px' }} onClick={() => navigate('/addorder')}>
                       ← BACK TO CART
                    </button>
                    <div>
                        <button className="btn px-4 py-2 me-3" style={{ backgroundColor: 'var(--text-color)', color: 'var(--bg-color)', borderRadius: '12px' }} onClick={() => window.print()}>PRINT INVOICE</button>
                        <button className="btn btn-warning px-5 py-2 fw-bold" 
                                style={{ backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px' }}
                                onClick={() => {
                                    if (!deliveryAddress.trim() || !phoneNumber.trim()) {
                                        toast.error("Please fill in delivery address and phone number above.");
                                        return;
                                    }
                                    setIsPaying(true);
                                }}>
                            PROCEED TO PAYMENT
                        </button>
                    </div>
                </div>
            </div>

            {/* PAYMENT METHOD OVERLAY */}
            {isPaying && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div className="card shadow-lg p-5 text-center" style={{ maxWidth: '480px', width: '90%', borderRadius: '24px', backgroundColor: 'var(--card-bg)' }}>
                        <h3 className="fw-bold mb-4" style={{ color: 'var(--text-color)' }}>💳 Checkout & Payment</h3>
                        
                        <div className="mb-3 p-3 rounded-4" style={{ backgroundColor: 'var(--header-bg)', border: '1px solid var(--border-color)' }}>
                            <p className="text-muted mb-1" style={{ fontSize: '13px' }}>Total Payable Amount</p>
                            <h2 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>₹{grandTotal.toFixed(2)}</h2>
                        </div>

                        {paymentStatus === "confirm" && (
                            <>
                                <div className="text-start mb-4">
                                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--label-color)', marginBottom: '8px', display: 'block' }}>SELECT PAYMENT METHOD</label>
                                    <div className="d-grid gap-2">
                                        {[
                                            { id: 'UPI', label: 'UPI / GooglePay / PhonePe 📱' },
                                            { id: 'CARD', label: 'Credit / Debit Card 💳' },
                                            { id: 'NETBANKING', label: 'Net Banking 🏦' },
                                            { id: 'COD', label: 'Cash on Delivery 💵' }
                                        ].map(method => (
                                            <div 
                                                key={method.id} 
                                                onClick={() => setPaymentMethod(method.id)}
                                                style={{
                                                    padding: '12px 16px',
                                                    borderRadius: '12px',
                                                    border: `2px solid ${paymentMethod === method.id ? 'var(--primary-color)' : 'var(--border-color)'}`,
                                                    backgroundColor: paymentMethod === method.id ? 'rgba(226,55,68,0.08)' : 'transparent',
                                                    cursor: 'pointer',
                                                    fontWeight: '600',
                                                    fontSize: '0.95rem',
                                                    display: 'flex',
                                                    justify: 'space-between',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <span>{method.label}</span>
                                                {paymentMethod === method.id && <span style={{ color: 'var(--primary-color)' }}>✓</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button className="btn w-100 py-3 mb-3 fw-bold" 
                                    style={{ backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '14px', fontSize: '1.1rem' }}
                                    onClick={handlePayment}
                                >
                                    Confirm Order ({paymentMethod})
                                </button>
                                <button className="btn text-muted fw-bold" onClick={() => setIsPaying(false)}>
                                    Cancel & Return
                                </button>
                            </>
                        )}
                        
                        {paymentStatus === "processing" && (
                            <div className="py-4">
                                <div className="spinner-border mb-3" style={{ color: 'var(--primary-color)' }} role="status"></div>
                                <h5 className="fw-bold" style={{ color: 'var(--text-color)' }}>Processing Payment & Order...</h5>
                                <p className="text-muted small">Communicating with payment server...</p>
                            </div>
                        )}

                        {paymentStatus === "success" && (
                            <div className="py-4">
                                <span style={{ fontSize: '4rem' }}>🎉</span>
                                <h4 className="fw-bold text-success mt-3">Order Confirmed!</h4>
                                <p className="text-muted">Your order has been placed successfully.</p>
                            </div>
                        )}

                        {paymentStatus === "error" && (
                            <div className="py-4">
                                <span style={{ fontSize: '4rem' }}>❌</span>
                                <h4 className="fw-bold text-danger mt-3">Transaction Failed</h4>
                                <p className="text-muted">Could not save order details. Please try again.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Billing;