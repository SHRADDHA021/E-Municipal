import { useEffect, useState, useContext } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { AuthContext } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ citizens: 0, complaints: 0, employees: 0, departments: 0, services: 0, bills: 0, requests: 0 });
  const [complaints, setComplaints] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [cmp, emp, dept, svcs, bills, fbs, sreq] = await Promise.all([
          api.get('/complaints').catch(() => ({ data: [] })),
          api.get('/employees').catch(() => ({ data: [] })),
          api.get('/departments').catch(() => ({ data: [] })),
          api.get('/services').catch(() => ({ data: [] })),
          api.get('/bills/all').catch(() => ({ data: [] })),
          api.get('/feedbacks').catch(() => ({ data: [] })),
          api.get('/ServiceRequests').catch(() => ({ data: [] })),
        ]);
        setComplaints(cmp.data.slice(0, 5));
        setFeedbacks(fbs.data.slice(0, 5));
        setRequests(sreq.data.slice(0, 5));
        setStats({
          complaints: cmp.data.length,
          employees: emp.data.length,
          departments: dept.data.length,
          services: svcs.data.length,
          bills: bills.data.length,
          requests: sreq.data.length,
          pending: cmp.data.filter(c => c.c_status === 'Pending').length,
        });
      } finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const statCards = [
    { label: 'Depts', value: stats.departments, bg: 'linear-gradient(135deg,#6366f1,#4f46e5)', icon: '🏢' },
    { label: 'Employees', value: stats.employees, bg: 'linear-gradient(135deg,#10b981,#059669)', icon: '👷' },
    { label: 'Complaints', value: stats.complaints, bg: 'linear-gradient(135deg,#f59e0b,#d97706)', icon: '📋' },
    { label: 'Requests', value: stats.requests, bg: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', icon: '📥' },
  ];

  const statusColor = (s) => s === 'Completed' || s === 'Approved' ? '#059669' : s === 'In Progress' || s === 'Pending' ? '#d97706' : '#6366f1';
  const statusBg    = (s) => s === 'Completed' || s === 'Approved' ? '#d1fae5' : s === 'In Progress' || s === 'Pending' ? '#fef3c7' : '#ede9fe';

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.3rem', fontFamily: "'Outfit',sans-serif" }}>Admin Dashboard</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Welcome back, <strong>{user?.name}</strong> 👋</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {statCards.map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: '1rem', padding: '1.25rem', color: '#fff', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}>
                <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: "'Outfit',sans-serif" }}>{s.value}</div>
                <div style={{ opacity: 0.85, fontSize: '0.75rem', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>Recent Complaints</h2>
            {complaints.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No complaints yet</div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {complaints.map(c => (
                  <div key={c.cid} style={{ padding:'1rem', borderRadius:'0.75rem', background:'#f8fafc', border:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <div style={{ fontWeight:700, color:'#1e293b', fontSize:'0.9rem' }}>{c.title}</div>
                      <div style={{ fontSize:'0.75rem', color:'#64748b' }}>#{c.cid} · {new Date(c.c_date).toLocaleDateString()}</div>
                    </div>
                    <span style={{ background: statusBg(c.c_status), color: statusColor(c.c_status), borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.65rem', fontWeight: 800 }}>{c.c_status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>Feedback & Community Updates</h2>
            {feedbacks.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No feedback yet</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
                {feedbacks.map(f => (
                  <div key={f.fid} style={{ padding: '1rem', borderRadius: '0.75rem', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }}>{f.citizen?.name || 'User'}</span>
                      <span style={{ color: '#f59e0b' }}>{'★'.repeat(f.rating)}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>{f.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
