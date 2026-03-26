import { useState, useEffect } from 'react';
import api from '../../api/axios';

const statCards = [
  { key:'totalCitizens',      label:'Registered Citizens', icon:'👥', gradient:'linear-gradient(135deg,#eef2ff,#e0e7ff)', border:'#c7d2fe', valueColor:'#4f46e5' },
  { key:'pendingComplaints',  label:'Pending Issues',      icon:'⚠️', gradient:'linear-gradient(135deg,#fffbeb,#fef3c7)', border:'#fde68a', valueColor:'#d97706' },
  { key:'completedComplaints',label:'Resolved Cases',      icon:'✅', gradient:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'#a7f3d0', valueColor:'#059669' },
  { key:'totalRevenue',       label:'Revenue Collected',   icon:'💰', gradient:'linear-gradient(135deg,#eff6ff,#dbeafe)', border:'#bfdbfe', valueColor:'#2563eb' },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalCitizens:0, pendingComplaints:0, completedComplaints:0, totalRevenue:0, citizensList: [], pendingComplaintsList: [] });
  const [activeModal, setActiveModal] = useState(null); // 'citizens' or 'complaints'

  useEffect(() => {
    api.get('/admin/stats')
      .then(r => setStats({ 
        totalCitizens: r.data.totalCitizens||0, 
        pendingComplaints: r.data.pendingComplaints||0, 
        completedComplaints: r.data.completedComplaints||0, 
        totalRevenue: r.data.totalRevenue||0,
        citizensList: r.data.citizensList||[],
        pendingComplaintsList: r.data.pendingComplaintsList||[]
      }))
      .catch(() => {});
  }, []);

  const formatValue = (key, v) => key === 'totalRevenue' ? `₹${parseFloat(v).toFixed(2)}` : v;

  const handleCardClick = (key) => {
    if (key === 'totalCitizens') setActiveModal('citizens');
    else if (key === 'pendingComplaints') setActiveModal('complaints');
  };

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", position: 'relative' }}>
      <div style={{ marginBottom:'2.5rem' }}>
        <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#1e293b', margin:'0 0 0.4rem', fontFamily:"'Outfit',sans-serif" }}>Admin Dashboard</h1>
        <p style={{ color:'#64748b', margin:0 }}>Municipal operations overview & real-time statistics.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1.25rem', marginBottom:'2.5rem' }}>
        {statCards.map(c => (
          <div 
            key={c.key} 
            onClick={() => handleCardClick(c.key)}
            style={{ 
              background:c.gradient, border:`1.5px solid ${c.border}`, borderRadius:'1.25rem', padding:'1.75rem', 
              boxShadow:'0 4px 16px rgba(0,0,0,0.06)', cursor: (c.key === 'totalCitizens' || c.key === 'pendingComplaints') ? 'pointer' : 'default',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => { if (c.key === 'totalCitizens' || c.key === 'pendingComplaints') e.currentTarget.style.transform = 'translateY(-4px)' }}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>{c.icon}</div>
            <div style={{ fontSize:'0.72rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.35rem' }}>{c.label}</div>
            <div style={{ fontSize:'2.25rem', fontWeight:900, color:c.valueColor, fontFamily:"'Outfit',sans-serif" }}>
              {formatValue(c.key, stats[c.key])}
            </div>
            {(c.key === 'totalCitizens' || c.key === 'pendingComplaints') && (
              <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: c.valueColor, fontWeight: 600 }}>Click to view details →</div>
            )}
          </div>
        ))}
      </div>

      {/* System Status + Activity */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.5rem', flexWrap:'wrap' }}>
        {/* Activity Placeholder */}
        <div style={{ background:'rgba(255,255,255,0.8)', border:'1px solid #e2e8f0', borderRadius:'1.25rem', padding:'2rem', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'220px' }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'3rem', marginBottom:'0.75rem' }}>📊</div>
            <h3 style={{ color:'#94a3b8', fontWeight:700, margin:'0 0 0.4rem', fontFamily:"'Outfit',sans-serif" }}>Activity Chart Placeholder</h3>
            <p style={{ color:'#cbd5e1', fontSize:'0.85rem' }}>Integrate Recharts/Chart.js to show complaint trends</p>
          </div>
        </div>

        {/* System Status */}
        <div style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81)', borderRadius:'1.25rem', padding:'2rem', color:'#fff', boxShadow:'0 12px 40px rgba(30,27,75,0.35)' }}>
          <h3 style={{ fontSize:'1.1rem', fontWeight:700, margin:'0 0 0.5rem', fontFamily:"'Outfit',sans-serif" }}>System Status</h3>
          <p style={{ color:'#a5b4fc', fontSize:'0.82rem', margin:'0 0 1.5rem', lineHeight:'1.5' }}>All services & database fully operational.</p>
          {[
            { label:'API Uptime', val:99, color:'#10b981' },
            { label:'DB Load',    val:24, color:'#6366f1' },
          ].map(b => (
            <div key={b.label} style={{ marginBottom:'1rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.8rem', fontWeight:600, marginBottom:'0.4rem', color:'#c7d2fe' }}>
                <span>{b.label}</span><span>{b.val}%</span>
              </div>
              <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:'999px', height:'6px' }}>
                <div style={{ width:`${b.val}%`, height:'6px', borderRadius:'999px', background:b.color, transition:'width 0.6s ease' }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#10b981', display:'inline-block', boxShadow:'0 0 8px #10b981' }} />
            <span style={{ fontSize:'0.78rem', color:'#a5b4fc', fontWeight:600 }}>All systems operational</span>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {activeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '1.25rem', width: '100%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', fontFamily: "'Outfit',sans-serif" }}>
                {activeModal === 'citizens' ? 'Registered Citizens' : 'Pending Complaints'}
              </h2>
              <button 
                onClick={() => setActiveModal(null)} 
                style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}
              >✕</button>
            </div>
            
            {activeModal === 'citizens' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {stats.citizensList.length > 0 ? stats.citizensList.map(c => (
                  <div key={c.id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', background: '#f8fafc' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>📧 {c.email} | 📞 {c.phone}</div>
                  </div>
                )) : <div style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No citizens registered yet.</div>}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {stats.pendingComplaintsList.length > 0 ? stats.pendingComplaintsList.map(c => (
                  <div key={c.id} style={{ padding: '1rem', border: '1px solid #fde68a', borderRadius: '0.75rem', background: '#fffbeb' }}>
                    <div style={{ fontWeight: 700, color: '#92400e' }}>#{c.id} - {c.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#b45309', marginTop: '0.25rem' }}>By Citizen: <b>{c.citizenName}</b></div>
                    <div style={{ fontSize: '0.85rem', color: '#b45309', marginTop: '0.25rem' }}>{c.description}</div>
                  </div>
                )) : <div style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No pending complaints.</div>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
