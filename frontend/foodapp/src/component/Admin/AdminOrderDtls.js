import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';

const POLL_INTERVAL = 15000;

// Safely convert LocalDateTime — Spring may serialize as string OR as [y,m,d,h,min,s] array
function safeDate(val) {
  if (!val) return null;
  if (typeof val === 'string') return new Date(val);
  // Array format: [year, month(1-based), day, hour, min, sec]
  if (Array.isArray(val)) {
    const [y, mo, d, h = 0, mi = 0, s = 0] = val;
    return new Date(y, mo - 1, d, h, mi, s);
  }
  return new Date(val);
}

function AdminOrderDtls() {
  const [records, setRecords]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [search, setSearch]         = useState('');
  const [filterUser, setFilterUser] = useState('All');
  const [newIds, setNewIds]         = useState(new Set());
  const prevIds = useRef(new Set());
  const timerRef = useRef(null);

  const fetchRecords = useCallback((silent = false) => {
    axiosInstance.get('/order-dtls/all')
      .then(res => {
        const data = res.data || [];
        const incoming = new Set(data.map(r => r.id));
        const brandNew = new Set([...incoming].filter(id => !prevIds.current.has(id)));
        if (brandNew.size > 0 && prevIds.current.size > 0) {
          setNewIds(brandNew);
          setTimeout(() => setNewIds(new Set()), 4000);
        }
        prevIds.current = incoming;
        setRecords(data);
        setError(null);
        setLastUpdated(new Date());
        if (!silent) setLoading(false);
      })
      .catch((err) => {
        const status = err?.response?.status;
        const msg = status === 401 ? 'Session expired — please log in again.'
                  : status === 403 ? 'Access denied.'
                  : status === 500 ? 'Server error (500) — check backend logs.'
                  : `Failed to load order details (${status || 'network error'}).`;
        setError(msg);
        if (!silent) setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchRecords(false);
    timerRef.current = setInterval(() => fetchRecords(true), POLL_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [fetchRecords]);

  const uniqueUsers = ['All', ...new Set(records.map(r => r.uname).filter(Boolean))];

  const filtered = records.filter(r => {
    const matchUser   = filterUser === 'All' || r.uname === filterUser;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (r.fname || '').toLowerCase().includes(q) ||
      (r.uname || '').toLowerCase().includes(q) ||
      (r.fid   || '').toLowerCase().includes(q);
    return matchUser && matchSearch;
  });

  const totalRevenue   = records.reduce((s, r) => s + Number(r.totalPrice || r.total_price || 0), 0);
  const todayStr        = new Date().toDateString();
  const todayCount      = records.filter(r => { const d = safeDate(r.paymentDate || r.payment_date); return d && d.toDateString() === todayStr; }).length;
  const uniquePayments  = new Set(records.map(r => { const d = safeDate(r.paymentDate || r.payment_date); return (r.uname || r.UNAME) + '_' + (d ? d.toISOString().substring(0, 16) : ''); })).size;

  const updateStatus = (id, newStatus) => {
    axiosInstance.put(`/order-dtls/status/${id}`, { orderStatus: newStatus })
      .then(() => {
        setRecords(prev => prev.map(r => (r.id === id || r.ID === id) ? { ...r, orderStatus: newStatus, order_status: newStatus } : r));
      })
      .catch(() => {
        alert("Failed to update order status");
      });
  };

  return (
    <div style={{ padding: '30px 20px', maxWidth: 1350, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontWeight: 900, color: 'var(--text-color)', margin: 0 }}>🏪 Merchant Order Management</h2>
          <p style={{ color: '#888', margin: '4px 0 0', fontSize: '0.88rem' }}>
            Manage order preparation, dispatch, delivery status, and customer details
            {lastUpdated && <span style={{ marginLeft: 10, color: '#10b981', fontWeight: 600 }}>● {lastUpdated.toLocaleTimeString('en-IN')}</span>}
          </p>
        </div>
        <button onClick={() => fetchRecords(false)} style={{
          padding: '9px 18px', borderRadius: 10, border: '1.5px solid var(--border-color, #ddd)',
          background: 'var(--card-bg)', color: 'var(--text-color)', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem'
        }}>🔄 Refresh</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total Line Items', value: records.length,      color: '#5227FF', icon: '📋' },
          { label: "Today's Orders",   value: todayCount,          color: '#f59e0b', icon: '🕐' },
          { label: 'Transactions',     value: uniquePayments,      color: '#06b6d4', icon: '💳' },
          { label: 'Total Revenue',    value: `₹${totalRevenue.toFixed(0)}`, color: '#10b981', icon: '💰' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--card-bg)', border: '1px solid var(--border-color, #eee)',
            borderRadius: 14, padding: '16px 18px', textAlign: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '1.6rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#888', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          type="text" placeholder="Search by food name, customer, phone..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            flex: '1 1 200px', padding: '10px 14px', borderRadius: 10,
            border: '1.5px solid var(--border-color, #ddd)', background: 'var(--input-bg, #f9f9f9)',
            color: 'var(--text-color)', fontSize: '0.9rem', outline: 'none',
          }}
        />
        <select value={filterUser} onChange={e => setFilterUser(e.target.value)} style={{
          padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--border-color, #ddd)',
          background: 'var(--input-bg, #f9f9f9)', color: 'var(--text-color)', fontSize: '0.9rem', cursor: 'pointer',
        }}>
          {uniqueUsers.map(u => <option key={u} value={u}>{u === 'All' ? '👤 All Customers' : u}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="spinner-border" style={{ color: '#10b981', width: 40, height: 40 }} role="status" />
          <p style={{ marginTop: 14, color: '#888' }}>Loading order details...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#e23744' }}>
          <div style={{ fontSize: '3rem' }}>⚠️</div>
          <h4 style={{ marginTop: 12 }}>Could not load order details</h4>
          <p style={{ fontSize: '0.9rem', color: '#888' }}>{error}</p>
          <button onClick={() => fetchRecords(false)} style={{ marginTop: 10, padding: '8px 20px', borderRadius: 10, background: '#10b981', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Retry</button>
        </div>
      ) : (
        <div style={{ background: 'var(--card-bg)', borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border-color, #eee)', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
              <div style={{ fontSize: '3rem' }}>🧾</div>
              <h4 style={{ marginTop: 12, color: 'var(--text-color)' }}>No paid orders yet</h4>
              <p style={{ fontSize: '0.88rem' }}>Order details will appear here after customers complete payment.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--header-bg, #f5f5f5)', borderBottom: '2px solid var(--border-color, #eee)' }}>
                    {['#', 'Customer Info', 'Item', 'Qty & Price', 'Total', 'Delivery Address', 'Payment', 'Order Status Action', 'Ordered At'].map(h => (
                      <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--text-color)', whiteSpace: 'nowrap', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => {
                    const isNew = newIds.has(r.id || r.ID);
                    const recId = r.id || r.ID;
                    const uPrice = r.unitPrice  || r.unit_price  || r.UNIT_PRICE;
                    const tPrice = r.totalPrice || r.total_price || r.TOTAL_PRICE;
                    const gTotal = r.grandTotal || r.grand_total || r.GRAND_TOTAL;
                    const pDate   = r.paymentDate   || r.payment_date   || r.PAYMENT_DATE;
                    const userName = r.uname || r.UNAME;
                    const address = r.deliveryAddress || r.delivery_address || 'Standard Delivery';
                    const phone = r.phoneNumber || r.phone_number || 'N/A';
                    const payMethod = r.paymentMethod || r.payment_method || 'Online';
                    const currentStatus = r.orderStatus || r.order_status || r.paymentStatus || 'PAID';

                    return (
                      <tr key={recId || i}
                        style={{ borderBottom: '1px solid var(--border-color, #f0f0f0)', background: isNew ? 'rgba(33,164,71,0.1)' : i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.013)', transition: 'background 0.4s' }}
                      >
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#10b981' }}>
                          #{recId} {isNew && <span style={{ fontSize: '0.65rem', background: '#21a447', color: '#fff', padding: '2px 5px', borderRadius: 8, marginLeft: 4 }}>NEW</span>}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-color)' }}>{userName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#888' }}>📞 {phone}</div>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-color)' }}>
                          {r.fname || r.FNAME}
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--text-muted, #888)' }}>
                          ×{r.qty || r.QTY} @ ₹{uPrice != null ? Number(uPrice).toFixed(0) : '—'}
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: '#10b981' }}>
                          ₹{tPrice != null ? Number(tPrice).toFixed(0) : (gTotal != null ? Number(gTotal).toFixed(0) : '—')}
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '0.8rem', maxWidth: '200px' }}>
                          <span style={{ color: 'var(--text-color)', display: 'block', wordBreak: 'break-word' }}>📍 {address}</span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '3px 9px', borderRadius: 8, fontWeight: 700, fontSize: '0.78rem' }}>
                            💳 {payMethod}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <select 
                            value={currentStatus} 
                            onChange={(e) => updateStatus(recId, e.target.value)}
                            style={{ 
                              padding: '6px 10px', 
                              borderRadius: '8px', 
                              fontWeight: '700', 
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              border: '1.5px solid #10b981',
                              backgroundColor: currentStatus === 'DELIVERED' ? '#d1fae5' : currentStatus === 'PREPARING' ? '#fef3c7' : currentStatus === 'OUT_FOR_DELIVERY' ? '#e0e7ff' : '#f3f4f6',
                              color: currentStatus === 'DELIVERED' ? '#047857' : currentStatus === 'PREPARING' ? '#b45309' : currentStatus === 'OUT_FOR_DELIVERY' ? '#4338ca' : '#374151'
                            }}
                          >
                            <option value="PAID">PAID 💵</option>
                            <option value="PREPARING">PREPARING 🍳</option>
                            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY 🛵</option>
                            <option value="DELIVERED">DELIVERED ✅</option>
                            <option value="CANCELLED">CANCELLED ❌</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#888', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                          {(() => { const d = safeDate(pDate); return d ? d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'; })()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: 'var(--header-bg, #f5f5f5)', borderTop: '2px solid var(--border-color)' }}>
                    <td colSpan={4} style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-color)', textAlign: 'right' }}>
                      TOTAL REVENUE ({filtered.length} items):
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 900, fontSize: '1.05rem', color: '#10b981' }}>₹{filtered.reduce((s,r)=>s+Number(r.totalPrice || r.total_price || 0),0).toFixed(2)}</td>

                    <td colSpan={4} />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminOrderDtls;
