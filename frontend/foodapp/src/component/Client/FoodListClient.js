import React, { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'

function FoodlistClient({ searchQuery }) {
    let [food, setFood] = useState([]);
    let [msg, setMsg] = useState("");

    // Modal States
    let [selectedItem, setSelectedItem] = useState(null);
    let [modalQty, setModalQty] = useState(1);

    const currentUser = localStorage.getItem("user");

    useEffect(() => {
        axios.get("https://foodapp-api1.onrender.com/food/fetch")
            .then((res) => {

                setFood(res.data);

            })
            .catch((error) => {

            })
    }, [])

    // Filter food array based on search query match
    const filteredFood = food.filter((item) => {
        const query = searchQuery?.toLowerCase() || "";
        const itemName = item?.fname?.toLowerCase() || "";
        return itemName.includes(query);
    });

    const openModal = (food) => {
        if (!currentUser) {
            alert("Please login to add items to your cart");
            return;
        }
        setSelectedItem(food);
        setModalQty(1);
    };

    const confirmAddToCart = () => {
        if (!selectedItem) return;

        const cartItem = {
            fid: selectedItem.fid,
            qty: String(modalQty),
            uname: currentUser
        };

        axios.post("https://foodapp-api1.onrender.com/orders/add", cartItem)
            .then((res) => {
                setMsg(`Added ${modalQty}x ${selectedItem.fname} to cart!`);
                setSelectedItem(null); // Close modal
                setTimeout(() => setMsg(""), 3000); 
            })
            .catch((error) => {

                setMsg("Failed to add item to cart.");
            });
    };

    return (
        <div style={{ padding: "20px", position: 'relative' }}>
            <h2 className='text-center mt-4 mb-4' style={{ color: '#0d6efd', fontWeight: '800', textTransform: 'uppercase' }}>
                EXPLORE DELICIOUS FOODS
            </h2>
            
            {/* Success/Error Message */}
            {msg && <div className="alert alert-success text-center w-50 mx-auto mt-3" role="alert">{msg}</div>}

            {
                filteredFood.length > 0 ?
                    <div className="container mt-4">
                        <div className="row justify-content-center">
                            <div className="col-12 col-lg-10">
                                <div className="table-responsive shadow-sm rounded">
                                    <table className='table table-hover mb-0'>
                            <thead className='table-light'>
                                <tr>
                                    <th>FOOD ID</th>
                                    <th>FOOD NAME</th>
                                    <th>PRICE (₹)</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredFood.map((element, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{element.fid}</td>
                                                <td><strong>{element.fname}</strong></td>
                                                <td className='text-success fw-bold'>{element.price}</td>
                                                <td>
                                                    <button 
                                                        className="btn btn-sm text-white fw-bold" 
                                                        style={{ backgroundColor: 'var(--primary-color)' }}
                                                        onClick={() => openModal(element)}
                                                    >
                                                        Add to Cart +
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    : <h4 style={{ color: "red", textAlign: "center", marginTop: "40px" }}>NO FOOD ITEMS FOUND MATCHING '{searchQuery}' 🍲</h4>
            }
            {/* QUANTITY MODAL (Swiggy Style) */}
            {selectedItem && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow-lg border-0" style={{ borderRadius: '15px', backgroundColor: 'var(--card-bg)' }}>
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold" style={{ color: 'var(--text-color)' }}>{selectedItem.fname}</h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedItem(null)} style={{ filter: 'var(--invert-filter)' }}></button>
                            </div>
                            <div className="modal-body text-center pt-2">
                                <h6 className="text-success fw-bold mb-4">₹{selectedItem.price}</h6>
                                <p className="text-muted small mb-2">Select Quantity</p>
                                
                                <div className="d-flex justify-content-center mb-4">
                                    <div className="btn-group border rounded-pill shadow-sm" role="group">
                                        <button className="btn px-3" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-color)' }} onClick={() => setModalQty(modalQty > 1 ? modalQty - 1 : 1)}>-</button>
                                        <button className="btn fw-bold px-4 disabled" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }}>{modalQty}</button>
                                        <button className="btn px-3" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-color)' }} onClick={() => setModalQty(modalQty + 1)}>+</button>
                                    </div>
                                </div>
                                
                                <button 
                                    className="btn w-100 fw-bold py-2 rounded-pill text-white" 
                                    style={{ backgroundColor: 'var(--primary-color)', fontSize: '1.1rem' }}
                                    onClick={confirmAddToCart}
                                >
                                    Add item | ₹{(Number(selectedItem.price) * modalQty).toFixed(2)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FoodlistClient