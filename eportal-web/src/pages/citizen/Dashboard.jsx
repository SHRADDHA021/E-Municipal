import { useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const tile = (bg) => ({ background: bg, borderRadius: '1rem', padding: '1.75rem', color: '#fff', boxShadow: '0 6px 20px rgba(0,0,0,0.15)', textDecoration: 'none', display: 'block', transition: 'transform 0.2s', position: 'relative', overflow: 'hidden' });

export default function CitizenDashboard() {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    api.get('/feedbacks/community').then(r => setFeedbacks(r.data.slice(0, 3))).catch(() => {});
  }, []);

  const links = [
    { to: '/citizen/complaints', icon: '📣', label: 'My Complaints', sub: 'Report & track issues', bg: 'linear-gradient(135deg,#ef4444,#dc2626)' },
    { to: '/citizen/services', icon: '🛠', label: 'Apply Services', sub: 'Request municipal services', bg: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
    { to: '/citizen/bills', icon: '💳', label: 'My Bills', sub: 'View & pay your bills', bg: 'linear-gradient(135deg,#0ea5e9,#0284c7)' },
    { to: '/citizen/feedback', icon: '⭐', label: 'Feedback', sub: 'Rate completed services', bg: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  ];

  return (
    <Layout>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.3rem', fontFamily: "'Outfit',sans-serif" }}>Welcome, {user?.name} 👋</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Access all municipal services from one place</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {links.map(l => (
          <Link key={l.to} to={l.to} style={tile(l.bg)}
            onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{l.icon}</div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', fontFamily: "'Outfit',sans-serif", marginBottom: '0.3rem' }}>{l.label}</div>
            <div style={{ opacity: 0.85, fontSize: '0.875rem' }}>{l.sub}</div>
          </Link>
        ))}
      </div>

      {feedbacks.length > 0 && (
        <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🌟</span> Community Updates
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '1rem' }}>
            {feedbacks.map(f => (
              <div key={f.fid} style={{ padding: '1.25rem', borderRadius: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#6366f1' }}>{f.citizenName}</span>
                  <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>{'★'.repeat(f.rating)}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>"{f.message}"</p>
                <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(f.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
