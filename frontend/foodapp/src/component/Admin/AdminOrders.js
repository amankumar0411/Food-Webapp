import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';

const POLL_INTERVAL = 10000; // refresh every 10 seconds

function AdminOrders() {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [search, setSearch]       = useState('');
  const [filterUser, setFilterUser] = useState('All');
  const [newOrderIds, setNewOrderIds] = useState(new Set()); // flash animation for new rows
  const prevOidsRef = useRef(new Set());
  const intervalRef = useRef(null);

  const fetchOrders = useCallback((silent = false) => {
    axiosInstance.get('/orders/all')
      .then(res => {
        const incoming = res.data || [];
        // Detect truly new orders
        const incomingIds = new Set(incoming.map(o => o.oid));
        const brandNew = new Set([...incomingIds].filter(id => !prevOidsRef.current.has(id)));
        if (brandNew.size > 0 && prevOidsRef.current.size > 0) {
          setNewOrderIds(brandNew);
          setTimeout(() => setNewOrderIds(new Set()), 3000);
        }
        prevOidsRef.current = incomingIds;
        setOrders(incoming);
        setLastUpdated(new Date());
        if (!silent) setLoading(false);
      })
      .catch(() => { if (!silent) setLoading(false); });
  }, []);

  useEffect(() => {
    fetchOrders(false);
    intervalRef.current = setInterval(() => fetchOrders(true), POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchOrders]);

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
  const todayOrders = orders.filter(o => {
    if (!o.odt) return false;
    const d = new Date(o.odt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  return (
    <div style={{ padding: '30px 20px', maxWidth: 1200, margin: '0 auto' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontWeight: 900, color: 'var(--text-color)', margin: 0 }}>📋 All Orders</h2>
          <p style={{ color: 'var(--text-muted, #888)', margin: '4px 0 0', fontSize: '0.88rem' }}>
            Live feed — auto-refreshes every 10 seconds
            {lastUpdated && (
              <span style={{ marginLeft: 10, color: '#21a447', fontWeight: 600 }}>
                ● Last updated: {lastUpdated.toLocaleTimeString('en-IN')}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => fetchOrders(false)}
          style={{
            padding: '9px 18px', borderRadius: 10, border: '1.5px solid var(--border-color, #ddd)',
            background: 'var(--card-bg)', color: 'var(--text-color)', fontWeight: 700,
            cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6
          }}
        >🔄 Refresh Now</button>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Orders',   value: orders.length,        color: '#5227FF', icon: '📦' },
          { label: "Today's Orders", value: todayOrders.length,   color: '#f59e0b', icon: '🕐' },
          { label: 'Customers',      value: uniqueUsers.length - 1, color: '#21a447', icon: '👤' },
          { label: 'Total Revenue',  value: `₹${orders.reduce((s,o)=>s+Number(o.totalPrice||0),0).toFixed(0)}`, color: '#e23744', icon: '💰' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--card-bg)', border: '1px solid var(--border-color, #eee)',
            borderRadius: 14, padding: '16px 18px', textAlign: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '1.6rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #888)', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by food name, customer, or food ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: '1 1 200px', padding: '10px 14px', borderRadius: 10,
            border: '1.5px solid var(--border-color, #ddd)', background: 'var(--input-bg, #f9f9f9)',
            color: 'var(--text-color)', fontSize: '0.9rem', outline: 'none',
          }}
        />
        <select
          value={filterUser}
          onChange={e => setFilterUser(e.target.value)}
          style={{
            padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--border-color, #ddd)',
            background: 'var(--input-bg, #f9f9f9)', color: 'var(--text-color)', fontSize: '0.9rem', cursor: 'pointer',
          }}
        >
          {uniqueUsers.map(u => <option key={u} value={u}>{u === 'All' ? '👤 All Customers' : u}</option>)}
        </select>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="spinner-border" style={{ color: 'var(--primary-color, #e23744)', width: 40, height: 40 }} role="status" />
          <p style={{ marginTop: 14, color: 'var(--text-muted)' }}>Loading orders...</p>
        </div>
      ) : (
        <div style={{
          background: 'var(--card-bg)', borderRadius: 18, overflow: 'hidden',
          border: '1px solid var(--border-color, #eee)', boxShadow: '0 2px 16px rgba(0,0,0,0.07)'
        }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem' }}>📭</div>
              <h4 style={{ marginTop: 12, color: 'var(--text-color)' }}>No orders found</h4>
              <p style={{ fontSize: '0.88rem' }}>
                {orders.length === 0
                  ? 'No orders received yet. Orders will appear here as customers place them.'
                  : 'No orders match your current filters.'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--header-bg, #f5f5f5)', borderBottom: '2px solid var(--border-color, #eee)' }}>
                    {['Order ID', 'Food ID', 'Food Name', 'Customer', 'Qty', 'Total Price', 'Date & Time'].map(h => (
                      <th key={h} style={{
                        padding: '13px 16px', textAlign: 'left', fontWeight: 700,
                        color: 'var(--text-color)', whiteSpace: 'nowrap',
                        fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o, i) => {
                    const isNew = newOrderIds.has(o.oid);
                    return (
                      <tr
                        key={o.oid}
                        style={{
                          borderBottom: '1px solid var(--border-color, #f0f0f0)',
                          background: isNew
                            ? 'rgba(33,164,71,0.12)'
                            : i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)',
                          transition: 'background 0.5s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(226,55,68,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = isNew ? 'rgba(33,164,71,0.12)' : (i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)')}
                      >
                        <td style={{ padding: '13px 16px', fontWeight: 700, color: 'var(--primary-color, #e23744)' }}>
                          #ORD-{o.oid} {isNew && <span style={{ fontSize: '0.7rem', background: '#21a447', color: '#fff', padding: '2px 6px', borderRadius: 10, marginLeft: 4 }}>NEW</span>}
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{ background: 'rgba(82,39,255,0.1)', color: '#5227FF', padding: '3px 8px', borderRadius: 6, fontWeight: 700, fontSize: '0.82rem' }}>
                            {o.fid}
                          </span>
                        </td>
                        <td style={{ padding: '13px 16px', fontWeight: 600, color: 'var(--text-color)' }}>
                          {o.fname || <span style={{ color: '#aaa', fontStyle: 'italic' }}>N/A</span>}
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{ background: 'rgba(33,164,71,0.1)', color: '#21a447', padding: '3px 10px', borderRadius: 20, fontWeight: 600, fontSize: '0.82rem' }}>
                            {o.uname}
                          </span>
                        </td>
                        <td style={{ padding: '13px 16px', fontWeight: 700, textAlign: 'center', color: 'var(--text-color)' }}>
                          ×{o.qty}
                        </td>
                        <td style={{ padding: '13px 16px', fontWeight: 800, color: '#e23744' }}>
                          {o.totalPrice != null ? `₹${Number(o.totalPrice).toFixed(2)}` : '—'}
                        </td>
                        <td style={{ padding: '13px 16px', color: 'var(--text-muted, #888)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                          {o.odt ? new Date(o.odt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: 'var(--header-bg, #f5f5f5)', borderTop: '2px solid var(--border-color)' }}>
                    <td colSpan={5} style={{ padding: '13px 16px', fontWeight: 800, color: 'var(--text-color)', textAlign: 'right' }}>
                      SHOWING {filtered.length} ORDERS — TOTAL:
                    </td>
                    <td style={{ padding: '13px 16px', fontWeight: 900, fontSize: '1.1rem', color: '#e23744' }}>
                      ₹{grandTotal.toFixed(2)}
                    </td>
                    <td />
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

export default AdminOrders;
