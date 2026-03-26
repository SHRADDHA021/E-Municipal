import { useState, useEffect } from 'react';
import api from '../../api/axios';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [form, setForm]         = useState({ name: '', amount: '' });
  const [showForm, setShowForm] = useState(false);
  const [applications, setApplications] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [sRes, aRes] = await Promise.all([
        api.get('/services').catch(() => ({ data: [] })),
        api.get('/services/applications').catch(() => ({ data: [] })),
      ]);
      setServices(sRes.data);
      setApplications(aRes.data);
    } catch {}
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/services', { name: form.name, amount: parseFloat(form.amount) });
      setForm({ name: '', amount: '' });
      setShowForm(false);
      fetchData();
    } catch { alert('Failed – check backend.'); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/services/applications/${id}/status`, JSON.stringify(status), { headers: { 'Content-Type': 'application/json' } });
      fetchData();
    } catch { alert('Failed – check backend.'); }
  };

  const inputStyle = { display: 'block', width: '100%', padding: '0.7rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '0.75rem', background: '#f8fafc', color: '#1e293b', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ fontFamily: "'Inter',sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.4rem', fontFamily: "'Outfit',sans-serif" }}>Manage Services</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Create services and approve/reject citizen applications.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.7rem 1.4rem', borderRadius: '0.75rem', background: showForm ? '#f1f5f9' : 'linear-gradient(135deg,#6366f1,#4f46e5)', color: showForm ? '#475569' : '#fff', border: showForm ? '1.5px solid #e2e8f0' : 'none', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit', boxShadow: showForm ? 'none' : '0 4px 14px rgba(99,102,241,0.4)' }}>
          {showForm ? '✕ Cancel' : '+ Add Service'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ background: '#fff', border: '1.5px solid #e0e7ff', borderTop: '4px solid #6366f1', borderRadius: '1.25rem', padding: '1.75rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: '200px' }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Service Name</label>
            <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Birth Certificate" style={inputStyle} />
          </div>
          <div style={{ flex: 1, minWidth: '140px' }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Fee (₹)</label>
            <input type="number" min="0" step="0.01" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="500" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" style={{ padding: '0.7rem 1.5rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              Create Service
            </button>
          </div>
        </form>
      )}

      {/* Available Services */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>Available Services ({services.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '1rem' }}>
          {services.map(s => (
            <div key={s.id} style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📋</div>
              <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem', fontFamily: "'Outfit',sans-serif" }}>{s.name}</div>
              <div style={{ background: '#d1fae5', color: '#065f46', display: 'inline-block', borderRadius: '999px', padding: '0.15rem 0.65rem', fontSize: '0.75rem', fontWeight: 700 }}>₹{s.amount}</div>
            </div>
          ))}
          {services.length === 0 && <div style={{ color: '#94a3b8', padding: '1rem', fontSize: '0.875rem' }}>No services yet. Create one above.</div>}
        </div>
      </div>

      {/* Applications */}
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>Citizen Applications ({applications.length})</h2>
        <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Applicant', 'Service', 'Date', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.71rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map((a, i) => (
                <tr key={a.id} style={{ borderBottom: i < applications.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#1e293b' }}>Citizen #{a.userId}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#475569' }}>{a.service?.name || `Service #${a.serviceId}`}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.8rem' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ borderRadius: '999px', padding: '0.2rem 0.65rem', fontSize: '0.72rem', fontWeight: 800,
                      background: a.status === 'Approved' ? '#d1fae5' : a.status === 'Rejected' ? '#fef2f2' : '#fef3c7',
                      color: a.status === 'Approved' ? '#065f46' : a.status === 'Rejected' ? '#991b1b' : '#92400e' }}>
                      {a.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    {a.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => handleStatusChange(a.id, 'Approved')} style={{ padding: '0.35rem 0.8rem', borderRadius: '0.5rem', background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>✓ Approve</button>
                        <button onClick={() => handleStatusChange(a.id, 'Rejected')} style={{ padding: '0.35rem 0.8rem', borderRadius: '0.5rem', background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>✕ Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No applications yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageServices;
