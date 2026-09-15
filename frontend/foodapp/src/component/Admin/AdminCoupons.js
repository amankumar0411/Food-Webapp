import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    expiryDate: '',
    usageLimit: '',
    perUserUsageLimit: '1',
    active: true
  });

  const fetchCoupons = () => {
    setLoading(true);
    axiosInstance.get('/coupons/admin')
      .then(res => {
        setCoupons(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Failed to fetch coupons:", err);
        toast.error("Failed to load discount coupons");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minOrderAmount: '',
      maxDiscountAmount: '',
      expiryDate: '',
      usageLimit: '',
      perUserUsageLimit: '1',
      active: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code || '',
      discountType: coupon.discountType || 'PERCENTAGE',
      discountValue: coupon.discountValue || '',
      minOrderAmount: coupon.minOrderAmount || '',
      maxDiscountAmount: coupon.maxDiscountAmount || '',
      expiryDate: coupon.expiryDate ? coupon.expiryDate.substring(0, 16) : '',
      usageLimit: coupon.usageLimit || '',
      perUserUsageLimit: coupon.perUserUsageLimit || '1',
      active: coupon.active !== false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue) {
      toast.error("Code and discount value are required");
      return;
    }

    const payload = {
      code: formData.code.trim().toUpperCase(),
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : 0,
      maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
      expiryDate: formData.expiryDate ? `${formData.expiryDate}:00` : null,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      perUserUsageLimit: formData.perUserUsageLimit ? Number(formData.perUserUsageLimit) : 1,
      active: formData.active
    };

    try {
      if (editingCoupon) {
        await axiosInstance.put(`/coupons/admin/${editingCoupon.id}`, payload);
        toast.success(`Coupon ${payload.code} updated successfully`);
      } else {
        await axiosInstance.post('/coupons/admin', payload);
        toast.success(`Coupon ${payload.code} created successfully`);
      }
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err) {
      const errMsg = err.response?.data?.error || "Operation failed. Please check your inputs.";
      toast.error(errMsg);
    }
  };

  const handleToggle = async (coupon) => {
    try {
      await axiosInstance.put(`/coupons/admin/${coupon.id}/toggle`);
      toast.success(`Coupon ${coupon.code} is now ${coupon.active ? 'inactive' : 'active'}`);
      fetchCoupons();
    } catch (err) {
      toast.error("Failed to toggle coupon status");
    }
  };

  const handleDelete = async (coupon) => {
    if (!window.confirm(`Are you sure you want to permanently delete coupon "${coupon.code}"?`)) {
      return;
    }
    try {
      await axiosInstance.delete(`/coupons/admin/${coupon.id}`);
      toast.success(`Coupon ${coupon.code} deleted`);
      fetchCoupons();
    } catch (err) {
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-12 py-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-dim/60">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-clay-terracotta font-label-md">
            Administration Portal
          </span>
          <h1 className="font-headline-lg text-3xl font-bold tracking-tight text-on-surface mt-1">
            Discount Code Management
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Centrally create, monitor, and configure promotional vouchers and percentage discounts
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          <span>Create Voucher</span>
        </button>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-dim/60 shadow-sm">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Total Coupons</span>
          <div className="text-2xl font-bold text-on-surface mt-1">{coupons.length}</div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-dim/60 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Active</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {coupons.filter(c => c.active).length}
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-dim/60 shadow-sm">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Percentage (%)</span>
          <div className="text-2xl font-bold text-on-surface mt-1">
            {coupons.filter(c => c.discountType === 'PERCENTAGE').length}
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-dim/60 shadow-sm">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Flat Cash (₹)</span>
          <div className="text-2xl font-bold text-on-surface mt-1">
            {coupons.filter(c => c.discountType === 'FIXED').length}
          </div>
        </div>
      </div>

      {/* Coupons Table / Cards */}
      {loading ? (
        <div className="py-16 text-center text-on-surface-variant text-sm flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <span>Loading discount registry...</span>
        </div>
      ) : coupons.length === 0 ? (
        <div className="my-12 p-8 bg-surface-container-lowest rounded-2xl border border-surface-dim/60 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">loyalty</span>
          <h3 className="font-bold text-lg text-on-surface">No Discount Codes Created Yet</h3>
          <p className="text-xs text-on-surface-variant mt-1 mb-4">
            Click "Create Voucher" above to add your first promotional campaign code.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-charcoal-ink text-white rounded-xl text-xs font-bold"
          >
            Create First Coupon
          </button>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-dim/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-dim/60 text-on-surface-variant uppercase tracking-wider font-semibold font-label-md">
                  <th className="p-4">Code</th>
                  <th className="p-4">Benefit</th>
                  <th className="p-4">Min. Order</th>
                  <th className="p-4">Expiry Date</th>
                  <th className="p-4">Redemptions</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-dim/40 font-body-sm">
                {coupons.map(coupon => {
                  const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
                  return (
                    <tr key={coupon.id} className="hover:bg-surface-container/40 transition-colors">
                      <td className="p-4 font-bold font-mono text-primary text-sm">
                        {coupon.code}
                      </td>
                      <td className="p-4 font-medium">
                        {coupon.discountType === 'PERCENTAGE' ? (
                          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                            {coupon.discountValue}% OFF
                            {coupon.maxDiscountAmount && ` (Up to ₹${coupon.maxDiscountAmount})`}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                            FLAT ₹{coupon.discountValue} OFF
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-on-surface-variant">
                        {coupon.minOrderAmount ? `₹${coupon.minOrderAmount}` : 'No minimum'}
                      </td>
                      <td className="p-4 text-on-surface-variant">
                        {coupon.expiryDate ? (
                          <span className={isExpired ? 'text-red-600 font-semibold' : ''}>
                            {new Date(coupon.expiryDate).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                            {isExpired && ' (Expired)'}
                          </span>
                        ) : (
                          'Never'
                        )}
                      </td>
                      <td className="p-4 text-on-surface-variant">
                        <span className="font-semibold text-on-surface">{coupon.timesUsed || 0}</span>
                        {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggle(coupon)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                            coupon.active && !isExpired
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {coupon.active && !isExpired ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(coupon)}
                          className="px-3 py-1 bg-surface-container hover:bg-surface-dim text-on-surface rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(coupon)}
                          className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-3xl border border-surface-dim/60 w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-dim/40">
              <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                {editingCoupon ? `Edit Coupon "${editingCoupon.code}"` : 'Create New Discount Voucher'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-on-surface mb-1 uppercase tracking-wider">
                  Voucher Code *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. ZAYKA50"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-surface-dim focus:outline-none focus:border-primary font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1 uppercase tracking-wider">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-surface-dim focus:outline-none focus:border-primary font-semibold"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat Cash (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-on-surface mb-1 uppercase tracking-wider">
                    {formData.discountType === 'PERCENTAGE' ? 'Discount Percentage (%) *' : 'Flat Discount (₹) *'}
                  </label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    placeholder={formData.discountType === 'PERCENTAGE' ? 'e.g. 20' : 'e.g. 100'}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-surface-dim focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1 uppercase tracking-wider">
                    Min Order Amount (₹)
                  </label>
                  <input 
                    type="number"
                    placeholder="e.g. 200"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-surface-dim focus:outline-none focus:border-primary"
                  />
                </div>

                {formData.discountType === 'PERCENTAGE' && (
                  <div>
                    <label className="block font-bold text-on-surface mb-1 uppercase tracking-wider">
                      Max Discount Cap (₹)
                    </label>
                    <input 
                      type="number"
                      placeholder="e.g. 150"
                      value={formData.maxDiscountAmount}
                      onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-surface-dim focus:outline-none focus:border-primary"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1 uppercase tracking-wider">
                    Expiry Date & Time
                  </label>
                  <input 
                    type="datetime-local"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-surface-dim focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-on-surface mb-1 uppercase tracking-wider">
                    Total Usage Limit
                  </label>
                  <input 
                    type="number"
                    placeholder="Unlimited if blank"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-surface-dim focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox"
                  id="couponActiveToggle"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 rounded text-primary cursor-pointer"
                />
                <label htmlFor="couponActiveToggle" className="font-bold text-on-surface cursor-pointer">
                  Activate this discount code immediately
                </label>
              </div>

              <div className="pt-4 border-t border-surface-dim/40 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-surface-container hover:bg-surface-dim text-on-surface rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl font-bold uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  {editingCoupon ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
