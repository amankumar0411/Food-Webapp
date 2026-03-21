import axiosInstance from '../../api/axiosInstance';
import { useState } from 'react'
import toast from 'react-hot-toast';

function Addfood() {
    const [food, setfood] = useState({ fid: "", fname: "", price: "", imageUrl: "" });
    const [preview, setPreview] = useState("");

    const refreshData = () => {
        setfood({ fid: "", fname: "", price: "", imageUrl: "" });
        setPreview("");
    }

    const addData = () => {
        if (!food.fid || !food.fname || !food.price) {
            toast.error("Please fill all required fields.");
            return;
        }
        const loadingToast = toast.loading("Adding food item...");
        axiosInstance.post("/food/add", food)
            .then((res) => {
                toast.dismiss(loadingToast);
                toast.success(res.data || "Food added successfully! 🎉");
                refreshData();
            })
            .catch(() => {
                toast.dismiss(loadingToast);
                toast.error("Failed to add food. Please try again.");
            });
    }

    const inputStyle = {
        padding: '12px 14px',
        borderRadius: '10px',
        border: '1.5px solid var(--border-color, #ddd)',
        background: 'var(--input-bg, #f9f9f9)',
        color: 'var(--text-color)',
        fontSize: '0.95rem',
        width: '100%',
        outline: 'none',
        marginBottom: '14px',
        transition: 'border-color 0.2s',
    };

    return (
        <div style={{ padding: '30px 20px', maxWidth: 600, margin: '0 auto' }}>
            <div style={{
                background: 'var(--card-bg)',
                borderRadius: 20,
                padding: '32px 28px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                border: '1px solid var(--border-color, #eee)'
            }}>
                <h2 style={{ fontWeight: 900, color: 'var(--text-color)', marginBottom: 4 }}>➕ Add Food Item</h2>
                <p style={{ color: '#888', marginBottom: 24, fontSize: '0.9rem' }}>Fill in the details to add a new item to the menu</p>

                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Food ID *</label>
                <input
                    style={inputStyle}
                    type='text'
                    value={food.fid}
                    onChange={e => setfood({ ...food, fid: e.target.value })}
                    placeholder='e.g. P001'
                />

                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Food Name *</label>
                <input
                    style={inputStyle}
                    type='text'
                    value={food.fname}
                    onChange={e => setfood({ ...food, fname: e.target.value })}
                    placeholder='e.g. Margherita Pizza'
                />

                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price (₹) *</label>
                <input
                    style={inputStyle}
                    type='number'
                    value={food.price}
                    onChange={e => setfood({ ...food, price: e.target.value })}
                    placeholder='e.g. 299'
                />

                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Image URL <span style={{ color: '#bbb', fontWeight: 400, textTransform: 'none' }}>(optional)</span>
                </label>
                <input
                    style={inputStyle}
                    type='url'
                    value={food.imageUrl}
                    onChange={e => { setfood({ ...food, imageUrl: e.target.value }); setPreview(e.target.value); }}
                    placeholder='https://example.com/food-image.jpg'
                />

                {/* Live Image Preview */}
                {preview && (
                    <div style={{ marginBottom: 18 }}>
                        <img
                            src={preview}
                            alt="Preview"
                            onError={() => setPreview("")}
                            style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12, border: '1.5px solid var(--border-color, #eee)' }}
                        />
                        <p style={{ fontSize: '0.78rem', color: '#888', marginTop: 4 }}>Image preview</p>
                    </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button
                        onClick={addData}
                        style={{
                            flex: 1, padding: '13px', borderRadius: 12, border: 'none',
                            background: 'var(--primary-color, #e23744)', color: '#fff',
                            fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >ADD FOOD</button>
                    <button
                        onClick={refreshData}
                        style={{
                            padding: '13px 20px', borderRadius: 12, cursor: 'pointer',
                            background: 'transparent', fontWeight: 700, fontSize: '0.95rem',
                            border: '1.5px solid var(--border-color, #ddd)', color: 'var(--text-color)',
                        }}
                    >RESET</button>
                </div>
            </div>
        </div>
    );
}

export default Addfood