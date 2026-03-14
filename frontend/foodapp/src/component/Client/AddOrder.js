import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

function AddOrder() {
    const navigate = useNavigate();
    const currentUserName = localStorage.getItem("user");
    
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");

    // Fetch user's cart items from the database (Using the same query as Billing)
    useEffect(() => {
        if (currentUserName) {
            axiosInstance.get(`/orders/user/details/${currentUserName}`)
                .then(res => {
                    // Initialize all fetched items with the database's native quantity, mapped safely
                    const initializedCart = res.data.map(item => ({
                        ...item,
                        // Convert DB quantity to number, default to 1 if it fails
                        currentQty: Number(item.qty || item.QTY) || 1
                    }));
                    setCartItems(initializedCart);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching cart data:", err);
                    setMsg("Failed to load your cart. Check if Backend is running.");
                    setLoading(false);
                });
        }
    }, [currentUserName]);

    // Handle Quantity Changes locally
    const handleQtyChange = (index, delta) => {
        const updatedCart = [...cartItems];
        const newQty = updatedCart[index].currentQty + delta;
        if (newQty > 0) {
            updatedCart[index].currentQty = newQty;
            setCartItems(updatedCart);
        }
    };

    // Remove item from cart (Swiggy Style UI + Backend Delete)
    const handleRemoveItem = async (index, oid) => {
        try {
            // Delete from database
            await axiosInstance.delete(`/orders/delete/${oid}`);
            
            // Remove from React State dynamically
            const updatedCart = [...cartItems];
            updatedCart.splice(index, 1);
            setCartItems(updatedCart);
            
            setMsg("Item removed from cart 🗑️");
            setTimeout(() => setMsg(""), 3000);
        } catch (error) {
            console.error("Error deleting item:", error);
            setMsg("Failed to remove item. Please try again.");
        }
    };

    // Push final quantities to backend line-by-line, then Pay
    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            setMsg("Your cart is empty!");
            return;
        }

        setMsg("Saving cart and redirecting to payment...");

        try {
            // Wait for ALL update requests to finish synchronously
            await Promise.all(
                cartItems.map(item => 
                    axiosInstance.put(`/orders/update/${item.oid || item.OID}/${item.currentQty}`)
                )
            );
            
            setMsg("Cart synchronized! Redirecting...");
            setTimeout(() => navigate("/billing"), 1500);

        } catch (error) {
            console.error("Error updating cart quantities", error);
            setMsg("Error synchronizing cart quantities before branch. Please try again.");
        }
    };

    // Calculate dynamic subtotal
    const cartTotal = cartItems.reduce((sum, item) => {
        const unitPrice = Number(item.fprice || item.FPRICE) || 0;
        return sum + (unitPrice * item.currentQty);
    }, 0);

    return (
        <div style={{ minHeight: '90vh', padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
            <div className="container shadow-sm p-4" style={{ borderRadius: '24px', maxWidth: '900px', backgroundColor: 'var(--card-bg)' }}>
                <h2 className="fw-bold mb-1" style={{ color: 'var(--text-color)' }}>Your Cart</h2>
                <p style={{ color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '30px' }}>
                    Customer: {currentUserName}
                </p>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-warning" role="status"></div>
                        <p className="mt-2">Loading your cart items...</p>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-5">
                        <h4>Your cart is empty 🍕</h4>
                        <button className="btn btn-outline-dark mt-3" onClick={() => navigate('/')}>
                            Explore Food
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle border">
                                <thead className="table-light">
                                    <tr>
                                        <th>ITEM</th>
                                        <th>PRICE</th>
                                        <th className="text-center">QUANTITY</th>
                                        <th className="text-end">TOTAL</th>
                                        <th className="text-center">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item, index) => {
                                        const unitPrice = Number(item.fprice || item.FPRICE) || 0;
                                        const totalLinePrice = unitPrice * item.currentQty;
                                        
                                        return (
                                            <tr key={index}>
                                                <td className="fw-bold">{item.fname || item.FNAME}</td>
                                                <td>₹{unitPrice}</td>
                                                <td className="text-center">
                                                    <div className="btn-group border rounded" role="group">
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-sm btn-light border-end"
                                                            onClick={() => handleQtyChange(index, -1)}
                                                        >-</button>
                                                        
                                                        <button type="button" className="btn" style={{ width: '45px', color: 'var(--text-color)', fontWeight: '600' }} disabled>
                                                            {item.currentQty}
                                                        </button>
                                                        
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-sm btn-light border-start"
                                                            onClick={() => handleQtyChange(index, 1)}
                                                        >+</button>
                                                    </div>
                                                </td>
                                                <td className="text-end text-success fw-bold flex-grow-1" style={{minWidth: '70px'}}>₹{totalLinePrice.toFixed(2)}</td>
                                                <td className="text-center">
                                                    <button 
                                                        className="btn btn-sm btn-outline-danger border-0" 
                                                        title="Remove item"
                                                        style={{ borderRadius: '50%', padding: '5px 8px' }}
                                                        onClick={() => handleRemoveItem(index, item.oid || item.OID)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-4 p-4 rounded-4" style={{ backgroundColor: 'var(--header-bg)', border: '1px solid var(--border-color)' }}>
                            <h4 className="m-0 text-muted fw-bold" style={{fontSize: '1.1rem'}}>Estimated total</h4>
                            <h3 className="m-0 fw-bold" style={{ color: 'var(--text-color)' }}>₹{cartTotal.toFixed(2)}</h3>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <button className="btn fw-bold px-4 py-3 border-0" onClick={() => navigate('/')} 
                                style={{ backgroundColor: 'var(--header-bg)', color: 'var(--text-color)', borderRadius: '12px' }}>
                                ← Add more items
                            </button>
                            <button className="btn fw-bold px-5 py-3 border-0 shadow-sm" onClick={handleCheckout} 
                                style={{backgroundColor: 'var(--primary-color)', color: '#fff', borderRadius: '12px', fontSize: '1.1rem'}}>
                                Proceed to checkout →
                            </button>
                        </div>
                    </div>
                )}
                
                {msg && <p className={`mt-3 text-center fw-bold ${msg.includes("empty") || msg.includes("Error") ? "text-danger" : "text-success"}`}>{msg}</p>}
            </div>
        </div>
    );
}

export default AddOrder;