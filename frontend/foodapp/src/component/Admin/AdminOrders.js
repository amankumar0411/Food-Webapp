import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

function AdminOrders() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filterUser, setFilterUser] = useState('All');

  useEffect(() => {
    axiosInstance.get('/orders/all')
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const uniqueUsers = ['All', ...new Set(orders.map(o => o.uname).filter(Boolean))];

  const filtered = orders.filter(o => {
    const matchUser   = filterUser === 'All' || o.uname === filterUser;
    const matchSearch = !search ||
      (o.fname || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.uname || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.fid   || '').toLowerCase().includes(search.toLowerCase());
    return matchUser && matchSearch;
  });

  const grandTotal = filtered.reduce((s, o) => s + (Number(o.totalPrice) || 0), 0);

  return (
    <div style={{ padding: '30px 20px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontWeight: 900, color: 'var(--text-color)', margin: 0 }}>📋 All Orders</h2>
        <p style={{ color: 'var(--text-muted, #888)', margin: '4px 0 0' }}>
          Live order feed — {orders.length} total orders received
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Orders',    value: orders.length,      color: '#5227FF', icon: '📦' },
          { label: 'Unique Customers',value: uniqueUsers.length - 1, color: '#21a447', icon: '👤' },
          { label: 'Revenue (shown)', value: `₹${grandTotal.toFixed(0)}`, color: '#e23744', icon: '💰' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color, #eee)',
            borderRadius: 16,
            padding: '18px 20px',
            textAlign: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '1.8rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by food name, user, or food ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: '1 1 220px',
            padding: '10px 16px',
            borderRadius: 10,
            border: '1.5px solid var(--border-color, #ddd)',
            background: 'var(--input-bg, #f9f9f9)',
            color: 'var(--text-color)',
            fontSize: '0.9rem',
            outline: 'none',
          }}
        />
        <select
          value={filterUser}
          onChange={e => setFilterUser(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: 10,
            border: '1.5px solid var(--border-color, #ddd)',
            background: 'var(--input-bg, #f9f9f9)',
            color: 'var(--text-color)',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          {uniqueUsers.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="spinner-border" style={{ color: 'var(--primary-color)' }} role="status" />
          <p style={{ marginTop: 12, color: 'var(--text-muted)' }}>Loading orders...</p>
        </div>
      ) : (
        <div style={{ background: 'var(--card-bg)', borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border-color, #eee)', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--header-bg, #f5f5f5)', borderBottom: '2px solid var(--border-color, #eee)' }}>
                  {['Order ID', 'Food ID', 'Food Name', 'Customer', 'Qty', 'Total Price', 'Date & Time'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-color)', whiteSpace: 'nowrap', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
                      No orders found
                    </td>
                  </tr>
                ) : filtered.map((o, i) => (
                  <tr key={o.oid} style={{
                    borderBottom: '1px solid var(--border-color, #f0f0f0)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)',
                    transition: 'background 0.15s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(226,55,68,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)'}
                  >
                    <td style={{ padding: '13px 16px', fontWeight: 700, color: 'var(--primary-color, #e23744)' }}>
                      #ORD-{o.oid}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ background: 'rgba(82,39,255,0.1)', color: '#5227FF', padding: '3px 8px', borderRadius: 6, fontWeight: 600, fontSize: '0.82rem' }}>
                        {o.fid}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', fontWeight: 600, color: 'var(--text-color)' }}>
                      {o.fname || <span style={{ color: '#aaa', fontStyle: 'italic' }}>—</span>}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ background: 'rgba(33,164,71,0.1)', color: '#21a447', padding: '3px 10px', borderRadius: 20, fontWeight: 600, fontSize: '0.82rem' }}>
                        {o.uname}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', fontWeight: 700, textAlign: 'center', color: 'var(--text-color)' }}>
                      {o.qty}
                    </td>
                    <td style={{ padding: '13px 16px', fontWeight: 800, color: '#e23744' }}>
                      ₹{o.totalPrice != null ? Number(o.totalPrice).toFixed(2) : '—'}
                    </td>
                    <td style={{ padding: '13px 16px', color: 'var(--text-muted, #888)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      {o.odt ? new Date(o.odt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              {filtered.length > 0 && (
                <tfoot>
                  <tr style={{ background: 'var(--header-bg, #f5f5f5)', borderTop: '2px solid var(--border-color)' }}>
                    <td colSpan={5} style={{ padding: '14px 16px', fontWeight: 800, color: 'var(--text-color)', textAlign: 'right' }}>
                      TOTAL REVENUE ({filtered.length} orders):
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 900, fontSize: '1.1rem', color: '#e23744' }}>
                      ₹{grandTotal.toFixed(2)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
