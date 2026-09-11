import axiosInstance from '../../api/axiosInstance';
import { useState } from 'react'
import toast from 'react-hot-toast';

function UpdateFood() {
    const [food, setFood] = useState({ 
        fid: "", 
        fname: "", 
        price: "", 
        imageUrl: "", 
        category: "Main Course", 
        isVeg: true 
    });
    const [preview, setPreview] = useState("");
    const [fetching, setFetching] = useState(false);

    const refreshData = () => {
        setFood({ fid: "", fname: "", price: "", imageUrl: "", category: "Main Course", isVeg: true });
        setPreview("");
    }

    // Fetch existing food details by FID so admin can see current values
    const fetchExisting = () => {
        if (!food.fid) { toast.error("Enter a Food ID to fetch existing details"); return; }
        setFetching(true);
        axiosInstance.get(`/food/fetch/${food.fid}`)
            .then(res => {
                const f = res.data;
                setFood({ 
                    fid: f.fid, 
                    fname: f.fname || "", 
                    price: f.price || "", 
                    imageUrl: f.imageUrl || "",
                    category: f.category || "Main Course",
                    isVeg: f.isVeg !== undefined && f.isVeg !== null ? f.isVeg : true
                });
                setPreview(f.imageUrl || "");
                toast.success("Food details loaded! Edit and save below.");
            })
            .catch(() => toast.error("Food ID not found."))
            .finally(() => setFetching(false));
    }

    const updateData = () => {
        if (!food.fid) { toast.error("Please enter a Food ID to update"); return; }
        const loadingToast = toast.loading("Updating food item...");
        axiosInstance.put(`/food/upd/${food.fid}`, food)
            .then((res) => {
                toast.dismiss(loadingToast);
                toast.success(res.data || "Food updated successfully! ✅");
                refreshData();
            })
            .catch(() => {
                toast.dismiss(loadingToast);
                toast.error("Failed to update food. Please try again.");
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
                <h2 style={{ fontWeight: 900, color: 'var(--text-color)', marginBottom: 4 }}>✏️ Update Food Item</h2>
                <p style={{ color: '#888', marginBottom: 24, fontSize: '0.9rem' }}>Enter Food ID to load existing details, then update</p>

                {/* FID + Fetch row */}
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Food ID *</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                    <input
                        style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                        type='text'
                        value={food.fid}
                        onChange={e => setFood({ ...food, fid: e.target.value })}
                        placeholder='e.g. P001'
                    />
                    <button
                        onClick={fetchExisting}
                        disabled={fetching}
                        style={{
                            padding: '0 16px', borderRadius: 10, border: '1.5px solid var(--border-color, #ddd)',
                            background: 'var(--input-bg, #f9f9f9)', color: 'var(--text-color)',
                            fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.88rem'
                        }}
                    >{fetching ? '...' : 'FETCH'}</button>
                </div>

                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Food Name</label>
                <input
                    style={inputStyle}
                    type='text'
                    value={food.fname}
                    onChange={e => setFood({ ...food, fname: e.target.value })}
                    placeholder='e.g. Margherita Pizza'
                />

                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price (₹)</label>
                <input
                    style={inputStyle}
                    type='number'
                    value={food.price}
                    onChange={e => setFood({ ...food, price: e.target.value })}
                    placeholder='e.g. 299'
                />

                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</label>
                <select
                    style={inputStyle}
                    value={food.category}
                    onChange={e => setFood({ ...food, category: e.target.value })}
                >
                    <option value="Starters">Starters 🥗</option>
                    <option value="Main Course">Main Course 🍕</option>
                    <option value="Desserts">Desserts 🍰</option>
                    <option value="Beverages">Beverages 🥤</option>
                    <option value="Snacks">Snacks 🍟</option>
                </select>

                <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Dietary Classification</label>
                    <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                            <input 
                                type="radio" 
                                name="isVeg" 
                                checked={food.isVeg === true} 
                                onChange={() => setFood({...food, isVeg: true})} 
                            />
                            <span style={{ color: '#10b981' }}>🟢 Veg</span>
                        </label>
                        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                            <input 
                                type="radio" 
                                name="isVeg" 
                                checked={food.isVeg === false} 
                                onChange={() => setFood({...food, isVeg: false})} 
                            />
                            <span style={{ color: '#ef4444' }}>🔴 Non-Veg</span>
                        </label>
                    </div>
                </div>

                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Image URL <span style={{ color: '#bbb', fontWeight: 400, textTransform: 'none' }}>(optional)</span>
                </label>
                <input
                    style={inputStyle}
                    type='url'
                    value={food.imageUrl}
                    onChange={e => { setFood({ ...food, imageUrl: e.target.value }); setPreview(e.target.value); }}
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
                        onClick={updateData}
                        style={{
                            flex: 1, padding: '13px', borderRadius: 12, border: 'none',
                            background: '#21a447', color: '#fff',
                            fontWeight: 800, fontSize: '1rem', cursor: 'pointer'
                        }}
                    >UPDATE FOOD</button>
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

export default UpdateFood