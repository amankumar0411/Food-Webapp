import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

function Account() {
  const currentUser = localStorage.getItem('user');
  const userRole = localStorage.getItem('role');

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security' | 'orders'

  // Profile State
  const [profile, setProfile] = useState({ uname: '', nm: '', email: '', phno: '', role: '' });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Security State
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPass, setChangingPass] = useState(false);

  // Orders State
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Fetch Profile Info
  useEffect(() => {
    if (currentUser) {
      axiosInstance.get(`/register/profile/${currentUser}`)
        .then(res => {
          setProfile(res.data || {});
        })
        .catch(() => {
          toast.error("Could not fetch profile info");
        })
        .finally(() => setLoadingProfile(false));
    }
  }, [currentUser]);

  // Fetch User Orders
  const fetchUserOrders = useCallback(() => {
    if (currentUser) {
      axiosInstance.get(`/order-dtls/user/${currentUser}`)
        .then(res => {
          setUserOrders(res.data || []);
        })
        .catch(() => { })
        .finally(() => setLoadingOrders(false));
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchUserOrders();
      const interval = setInterval(fetchUserOrders, 10000); // Live polling every 10s
      return () => clearInterval(interval);
    }
  }, [activeTab, fetchUserOrders]);

  // Update Profile Submit
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    const loadingToast = toast.loading("Updating profile...");

    axiosInstance.put(`/register/profile/${currentUser}`, {
      nm: profile.nm,
      email: profile.email,
      phno: profile.phno
    })
      .then(res => {
        toast.dismiss(loadingToast);
        toast.success("Profile details updated successfully! ✅");
        setProfile(res.data || profile);
      })
      .catch(() => {
        toast.dismiss(loadingToast);
        toast.error("Failed to update profile.");
      })
      .finally(() => setUpdatingProfile(false));
  };

  // Change Password Submit
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    setChangingPass(true);
    const loadingToast = toast.loading("Changing password...");

    axiosInstance.put(`/register/change-password/${currentUser}`, {
      oldPassword: passwords.oldPassword,
      newPassword: passwords.newPassword
    })
      .then(() => {
        toast.dismiss(loadingToast);
        toast.success("Password changed successfully! 🔒");
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      })
      .catch((err) => {
        toast.dismiss(loadingToast);
        const msg = err.response?.data?.error || "Incorrect current password.";
        toast.error(msg);
      })
      .finally(() => setChangingPass(false));
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    const s = (status || 'PAID').toUpperCase();
    switch (s) {
      case 'PREPARING':
        return <span style={{ background: '#fef3c7', color: '#b45309', padding: '6px 14px', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem' }}>🍳 PREPARING</span>;
      case 'OUT_FOR_DELIVERY':
        return <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '6px 14px', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem' }}>🛵 OUT FOR DELIVERY</span>;
      case 'DELIVERED':
        return <span style={{ background: '#d1fae5', color: '#047857', padding: '6px 14px', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem' }}>✅ DELIVERED</span>;
      case 'CANCELLED':
        return <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '6px 14px', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem' }}>❌ CANCELLED</span>;
      default:
        return <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '6px 14px', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem' }}>💵 PAID</span>;
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto', minHeight: '80vh' }}>
      {/* Account Header */}
      <div style={{ background: 'var(--card-bg)', borderRadius: '24px', padding: '32px', border: '1px solid var(--border-color)', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '900' }}>
            {currentUser ? currentUser.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ margin: 0, fontWeight: 900, color: 'var(--text-color)' }}>{profile.nm || currentUser}</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              @{currentUser} • <span style={{ textTransform: 'capitalize', color: 'var(--primary-color)', fontWeight: 700 }}>{userRole || 'Customer'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '12px 24px', borderRadius: '14px',
            background: activeTab === 'profile' ? 'var(--primary-color)' : 'var(--card-bg)',
            color: activeTab === 'profile' ? '#fff' : 'var(--text-color)',
            fontWeight: '700', cursor: 'pointer', border: '1px solid var(--border-color)'
          }}
        >
          👤 Profile Details
        </button>

        <button
          onClick={() => setActiveTab('security')}
          style={{
            padding: '12px 24px', borderRadius: '14px',
            background: activeTab === 'security' ? 'var(--primary-color)' : 'var(--card-bg)',
            color: activeTab === 'security' ? '#fff' : 'var(--text-color)',
            fontWeight: '700', cursor: 'pointer', border: '1px solid var(--border-color)'
          }}
        >
          🔒 Security
        </button>

        <button
          onClick={() => { setActiveTab('orders'); fetchUserOrders(); }}
          style={{
            padding: '12px 24px', borderRadius: '14px',
            background: activeTab === 'orders' ? 'var(--primary-color)' : 'var(--card-bg)',
            color: activeTab === 'orders' ? '#fff' : 'var(--text-color)',
            fontWeight: '700', cursor: 'pointer', border: '1px solid var(--border-color)'
          }}
        >
          My Orders
        </button>
      </div>

      {/* TAB 1: PROFILE DETAILS */}
      {activeTab === 'profile' && (
        <div style={{ background: 'var(--card-bg)', borderRadius: '24px', padding: '32px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontWeight: 800, color: 'var(--text-color)', marginBottom: '20px' }}>Personal Information</h4>
          {loadingProfile ? (
            <p>Loading profile information...</p>
          ) : (
            <form onSubmit={handleUpdateProfile} style={{ maxWidth: '600px' }}>
              <div className="mb-3">
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--label-color)' }}>USERNAME (Read-only)</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.uname}
                  disabled
                  style={{ height: '50px', borderRadius: '12px', backgroundColor: 'var(--input-bg)' }}
                />
              </div>

              <div className="mb-3">
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--label-color)' }}>FULL NAME</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.nm || ''}
                  onChange={e => setProfile({ ...profile, nm: e.target.value })}
                  style={{ height: '50px', borderRadius: '12px', backgroundColor: 'var(--input-bg)' }}
                />
              </div>

              <div className="mb-3">
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--label-color)' }}>EMAIL ADDRESS</label>
                <input
                  type="email"
                  className="form-control"
                  value={profile.email || ''}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  style={{ height: '50px', borderRadius: '12px', backgroundColor: 'var(--input-bg)' }}
                />
              </div>

              <div className="mb-4">
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--label-color)' }}>PHONE NUMBER</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.phno || ''}
                  onChange={e => setProfile({ ...profile, phno: e.target.value })}
                  style={{ height: '50px', borderRadius: '12px', backgroundColor: 'var(--input-bg)' }}
                />
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="btn px-4 py-3 fw-bold"
                style={{ backgroundColor: 'var(--primary-color)', color: '#fff', borderRadius: '12px' }}
              >
                {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: SECURITY SETTINGS */}
      {activeTab === 'security' && (
        <div style={{ background: 'var(--card-bg)', borderRadius: '24px', padding: '32px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontWeight: 800, color: 'var(--text-color)', marginBottom: '20px' }}>Change Password</h4>
          <form onSubmit={handleChangePassword} style={{ maxWidth: '600px' }}>
            <div className="mb-3">
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--label-color)' }}>CURRENT PASSWORD</label>
              <input
                type="password"
                className="form-control"
                value={passwords.oldPassword}
                onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })}
                required
                style={{ height: '50px', borderRadius: '12px', backgroundColor: 'var(--input-bg)' }}
              />
            </div>

            <div className="mb-3">
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--label-color)' }}>NEW PASSWORD</label>
              <input
                type="password"
                className="form-control"
                value={passwords.newPassword}
                onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                required
                style={{ height: '50px', borderRadius: '12px', backgroundColor: 'var(--input-bg)' }}
              />
            </div>

            <div className="mb-4">
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--label-color)' }}>CONFIRM NEW PASSWORD</label>
              <input
                type="password"
                className="form-control"
                value={passwords.confirmPassword}
                onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                required
                style={{ height: '50px', borderRadius: '12px', backgroundColor: 'var(--input-bg)' }}
              />
            </div>

            <button
              type="submit"
              disabled={changingPass}
              className="btn px-4 py-3 fw-bold"
              style={{ backgroundColor: 'var(--primary-color)', color: '#fff', borderRadius: '12px' }}
            >
              {changingPass ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: MY ORDERS  */}
      {activeTab === 'orders' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontWeight: 800, color: 'var(--text-color)', margin: 0 }}>My Order History & Live Delivery Status</h4>
            <button onClick={fetchUserOrders} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', cursor: 'pointer', fontWeight: 600 }}>
              🔄 Refresh Status
            </button>
          </div>

          {loadingOrders ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner-border text-primary" role="status" />
              <p style={{ marginTop: '10px', color: 'var(--text-muted)' }}>Fetching live orders...</p>
            </div>
          ) : userOrders.length === 0 ? (
            <div style={{ background: 'var(--card-bg)', borderRadius: '24px', padding: '50px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '3rem' }}>🛍️</div>
              <h4 style={{ marginTop: '10px' }}>No orders placed yet</h4>
              <p style={{ color: 'var(--text-muted)' }}>Explore our menu and place your first food order!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {userOrders.map((ord, idx) => {
                const status = (ord.orderStatus || ord.order_status || ord.paymentStatus || 'PAID').toUpperCase();
                const address = ord.deliveryAddress || ord.delivery_address || 'Standard Address';
                const date = ord.paymentDate || ord.payment_date;
                const driver = ord.driverUname || ord.driver_uname;

                // Step status mapper (1 to 4)
                let currentStep = 1;
                if (status === 'PREPARING') currentStep = 2;
                if (status === 'OUT_FOR_DELIVERY') currentStep = 3;
                if (status === 'DELIVERED') currentStep = 4;

                const steps = [
                  { label: 'Order Placed', icon: '🧾' },
                  { label: 'Preparing Food', icon: '🍳' },
                  { label: 'Out for Delivery', icon: '🛵' },
                  { label: 'Delivered', icon: '🎉' }
                ];

                return (
                  <div key={ord.id || ord.ID || idx} style={{ background: 'var(--card-bg)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-color)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                      <div>
                        <h5 style={{ fontWeight: 800, color: 'var(--text-color)', margin: 0 }}>
                          {ord.fname || ord.FNAME} <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>× {ord.qty || ord.QTY}</span>
                        </h5>
                        <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                          Order ID: #{ord.id || ord.ID} • {date ? new Date(date).toLocaleString('en-IN') : 'Recently'}
                        </p>
                      </div>
                      <div>
                        {getStatusBadge(status)}
                      </div>
                    </div>

                    {/* LIVE 4-STAGE DELIVERY TRACKER STEPPER */}
                    {status !== 'CANCELLED' ? (
                      <div style={{ margin: '20px 0', padding: '16px', background: 'var(--input-bg)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', alignItems: 'center' }}>
                          {/* Connecting Line */}
                          <div style={{
                            position: 'absolute',
                            top: '18px',
                            left: '5%',
                            right: '5%',
                            height: '4px',
                            background: '#e5e7eb',
                            zIndex: 1
                          }} />
                          <div style={{
                            position: 'absolute',
                            top: '18px',
                            left: '5%',
                            width: `${((currentStep - 1) / (steps.length - 1)) * 90}%`,
                            height: '4px',
                            background: 'var(--primary-color)',
                            transition: 'width 0.4s ease',
                            zIndex: 2
                          }} />

                          {steps.map((st, sIdx) => {
                            const stepNum = sIdx + 1;
                            const isCompleted = stepNum <= currentStep;
                            const isCurrent = stepNum === currentStep;

                            return (
                              <div key={sIdx} style={{ zIndex: 3, textAlign: 'center', flex: 1 }}>
                                <div style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  background: isCompleted ? 'var(--primary-color)' : '#fff',
                                  color: isCompleted ? '#fff' : '#6b7280',
                                  border: `3px solid ${isCompleted ? 'var(--primary-color)' : '#d1d5db'}`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  margin: '0 auto 6px',
                                  fontWeight: 'bold',
                                  fontSize: '14px',
                                  boxShadow: isCurrent ? '0 0 0 4px rgba(226,55,68,0.2)' : 'none',
                                  transition: 'all 0.3s ease'
                                }}>
                                  {st.icon}
                                </div>
                                <div style={{ fontSize: '0.75rem', fontWeight: isCurrent ? '800' : '600', color: isCurrent ? 'var(--primary-color)' : 'var(--text-color)' }}>
                                  {st.label}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {driver && (
                          <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '0.82rem', color: '#047857', fontWeight: '700', background: '#d1fae5', padding: '6px 12px', borderRadius: '10px' }}>
                            🛵 Delivery Partner <strong>@{driver}</strong> is assigned to your order
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="alert alert-danger my-3 py-2 small fw-bold text-center">
                        This order was cancelled.
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        📍 <strong>Delivery Address:</strong> {address}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary-color)' }}>
                        Total: ₹{ord.totalPrice || ord.total_price || ord.grandTotal || 0}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Account;
