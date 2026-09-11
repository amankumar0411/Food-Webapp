import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

function DriverDashboard() {
  const driverUname = localStorage.getItem('user');

  const [isOnline, setIsOnline] = useState(true);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [earnings, setEarnings] = useState({ completedTrips: 0, totalEarnings: 0, trips: [] });
  const [loading, setLoading] = useState(true);

  // Fetch available delivery tasks
  const fetchAvailableTasks = useCallback(() => {
    if (!isOnline) return;
    axiosInstance.get('/order-dtls/driver/available')
      .then(res => {
        setAvailableOrders(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOnline]);

  // Fetch driver earnings
  const fetchEarnings = useCallback(() => {
    if (!driverUname) return;
    axiosInstance.get(`/order-dtls/driver/earnings/${driverUname}`)
      .then(res => {
        setEarnings(res.data || { completedTrips: 0, totalEarnings: 0, trips: [] });
      })
      .catch(() => {});
  }, [driverUname]);

  useEffect(() => {
    fetchAvailableTasks();
    fetchEarnings();

    const interval = setInterval(() => {
      fetchAvailableTasks();
      fetchEarnings();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchAvailableTasks, fetchEarnings]);

  // Driver Accept Trip
  const acceptTask = (id) => {
    const loadingToast = toast.loading("Accepting trip & setting pickup...");
    axiosInstance.put(`/order-dtls/driver/accept/${id}`, { driverUname })
      .then(() => {
        toast.dismiss(loadingToast);
        toast.success("Trip Accepted! Drive to restaurant for pickup. 🛵");
        fetchAvailableTasks();
        fetchEarnings();
      })
      .catch(() => {
        toast.dismiss(loadingToast);
        toast.error("Failed to accept trip.");
      });
  };

  // Driver Mark Delivered
  const deliverTask = (id) => {
    const loadingToast = toast.loading("Confirming customer delivery...");
    axiosInstance.put(`/order-dtls/driver/deliver/${id}`)
      .then(() => {
        toast.dismiss(loadingToast);
        toast.success("Order Delivered! ₹45 credited to your wallet. 🎉");
        fetchAvailableTasks();
        fetchEarnings();
      })
      .catch(() => {
        toast.dismiss(loadingToast);
        toast.error("Failed to update status.");
      });
  };

  return (
    <div style={{ padding: '30px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '85vh' }}>
      {/* Header & Status Toggle */}
      <div style={{ background: 'var(--card-bg)', borderRadius: '24px', padding: '28px 32px', border: '1px solid #f59e0b', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '2rem' }}>🛵</span>
            <div>
              <h2 style={{ margin: 0, fontWeight: 900, color: 'var(--text-color)' }}>Delivery Partner Portal</h2>
              <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Logged in as @<strong>{driverUname}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Online Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--input-bg)', padding: '10px 18px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontWeight: '700', color: isOnline ? '#10b981' : '#ef4444', fontSize: '0.95rem' }}>
            {isOnline ? '🟢 ONLINE & AVAILABLE' : '🔴 OFFLINE'}
          </span>
          <button 
            onClick={() => setIsOnline(!isOnline)} 
            style={{ 
              padding: '8px 16px', borderRadius: '10px', border: 'none', 
              background: isOnline ? '#ef4444' : '#10b981', color: '#fff', 
              fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem' 
            }}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </div>

      {/* Driver Wallet & Trip Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: 'var(--card-bg)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem' }}>📦</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f59e0b', marginTop: '4px' }}>{earnings.completedTrips}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>Completed Deliveries</div>
        </div>

        <div style={{ background: 'var(--card-bg)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem' }}>💰</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>₹{earnings.totalEarnings.toFixed(0)}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total Wallet Earnings</div>
        </div>

        <div style={{ background: 'var(--card-bg)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem' }}>⚡</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#5227FF', marginTop: '4px' }}>₹45 / trip</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>Standard Delivery Payout</div>
        </div>
      </div>

      {/* Available Delivery Requests */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h4 style={{ fontWeight: 800, color: 'var(--text-color)', margin: 0 }}>📍 Nearby Orders for Delivery</h4>
        <button onClick={fetchAvailableTasks} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', cursor: 'pointer', fontWeight: 600 }}>
          🔄 Refresh Orders
        </button>
      </div>

      {!isOnline ? (
        <div style={{ background: 'var(--card-bg)', borderRadius: '24px', padding: '50px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '3rem' }}>😴</div>
          <h4 style={{ marginTop: '10px' }}>You are currently Offline</h4>
          <p style={{ color: 'var(--text-muted)' }}>Switch status to "ONLINE" above to start accepting nearby delivery orders.</p>
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner-border text-warning" role="status" />
          <p style={{ marginTop: '10px', color: 'var(--text-muted)' }}>Scanning for nearby pickup orders...</p>
        </div>
      ) : availableOrders.length === 0 ? (
        <div style={{ background: 'var(--card-bg)', borderRadius: '24px', padding: '50px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '3rem' }}>🔍</div>
          <h4 style={{ marginTop: '10px' }}>No active orders ready for pickup</h4>
          <p style={{ color: 'var(--text-muted)' }}>New orders will appear automatically as kitchens finish preparation.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {availableOrders.map((ord, idx) => {
            const isMyTrip = ord.driverUname === driverUname;
            const currentStatus = ord.orderStatus || ord.order_status || 'PAID';
            const address = ord.deliveryAddress || ord.delivery_address || 'Customer Location';
            const phone = ord.phoneNumber || ord.phone_number || 'N/A';
            const orderId = ord.id || ord.ID;

            return (
              <div 
                key={orderId || idx} 
                style={{ 
                  background: 'var(--card-bg)', borderRadius: '20px', padding: '24px', 
                  border: isMyTrip ? '2px solid #10b981' : '1px solid var(--border-color)', 
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '6px', fontWeight: '800' }}>
                      #ORD-{orderId}
                    </span>
                    <h5 style={{ fontWeight: 800, color: 'var(--text-color)', margin: '8px 0 2px' }}>
                      {ord.fname || ord.FNAME} × {ord.qty || ord.QTY}
                    </h5>
                  </div>
                  <span style={{ fontWeight: 900, color: '#10b981', fontSize: '1.1rem' }}>+ ₹45</span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px', background: 'var(--input-bg)', padding: '12px', borderRadius: '12px' }}>
                  <div>📍 <strong>Drop Address:</strong> {address}</div>
                  <div style={{ marginTop: '4px' }}>📞 <strong>Customer Phone:</strong> {phone}</div>
                  <div style={{ marginTop: '4px' }}>👤 <strong>Customer:</strong> {ord.uname || ord.UNAME}</div>
                </div>

                {/* TRIP ACTIONS */}
                {currentStatus === 'OUT_FOR_DELIVERY' && isMyTrip ? (
                  <button 
                    onClick={() => deliverTask(orderId)}
                    style={{ 
                      width: '100%', padding: '12px', borderRadius: '12px', border: 'none', 
                      background: '#10b981', color: '#fff', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer' 
                    }}
                  >
                    ✅ Mark as Delivered (Earn ₹45)
                  </button>
                ) : (
                  <button 
                    onClick={() => acceptTask(orderId)}
                    disabled={ord.driverUname && !isMyTrip}
                    style={{ 
                      width: '100%', padding: '12px', borderRadius: '12px', border: 'none', 
                      background: ord.driverUname ? '#cbd5e1' : '#f59e0b', color: '#fff', 
                      fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer' 
                    }}
                  >
                    {ord.driverUname ? 'Already Assigned' : '🛵 Accept Pickup Task'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DriverDashboard;
