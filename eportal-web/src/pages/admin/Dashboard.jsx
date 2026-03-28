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
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

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
        setRequests(sreq.data);
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

          {/* NEW: Service Requests for Review */}
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📝 Service Requests for Review</span>
              <span style={{ fontSize: '0.75rem', background: '#eef2ff', color: '#6366f1', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                {requests.filter(r => (r.status || r.Status) === 'Pending').length} Action Required
              </span>
            </h2>
            {requests.filter(r => (r.status || r.Status) === 'Pending').length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem', border: '2px dashed #f1f5f9', borderRadius: '0.75rem' }}>
                No requests pending review (must have documents & payment)
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {requests.filter(r => (r.status || r.Status) === 'Pending').map(r => (
                  <div key={r.id} style={{ padding: '1.25rem', borderRadius: '1rem', background: '#fff', border: '1px solid #e0e7ff', borderTop: '4px solid #6366f1', boxShadow: '0 4px 12px rgba(99,102,241,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 800, color: '#1e293b' }}>{r.serviceName}</span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>#{r.id}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
                      Citizen: <strong>{r.citizenName}</strong><br/>
                      Date: {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {(r.isPaid || r.IsPaid) ? (
                        <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>✓ PAID</span>
                      ) : (
                        <span style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>⌛ UNPAID</span>
                      )}
                      {(r.documentUrls || r.DocumentUrls) ? (
                        <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>📄 DOCS UPLOADED</span>
                      ) : (
                        <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>❌ NO DOCUMENTS</span>
                      )}
                    </div>
                    <button onClick={() => setSelectedRequest(r)} style={{ width: '100%', padding: '0.6rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                      Review Request
                    </button>
                  </div>
                ))}
              </div>
            )}
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

          {/* Review Modal */}
          {selectedRequest && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding:'1rem' }}>
              <div style={{ background: '#fff', borderRadius: '1.5rem', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation:'modalIn 0.3s ease' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>Review Service Request</h2>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Request ID: #{selectedRequest.id || selectedRequest.Id}</p>
                  </div>
                  <button onClick={() => setSelectedRequest(null)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', color:'#64748b' }}>✕</button>
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                      <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6366f1', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '0.05em' }}>👤 Citizen Profile</h3>
                      <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                        <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}><span style={{ color:'#64748b' }}>Full Name:</span> <span style={{ fontWeight:700 }}>{(selectedRequest.citizenName || selectedRequest.CitizenName) || 'Not Provided'}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color:'#64748b' }}>Citizen ID:</span> <span style={{ fontWeight:700 }}>{selectedRequest.idNo || selectedRequest.IDNo || 'N/A'}</span></div>
                      </div>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6366f1', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '0.05em' }}>🛠️ Service Applied</h3>
                      <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                        <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}><span style={{ color:'#64748b' }}>Service Name:</span> <span style={{ fontWeight:700 }}>{selectedRequest.serviceName || selectedRequest.ServiceName}</span></div>
                        <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}><span style={{ color:'#64748b' }}>Applied Date:</span> <span style={{ fontWeight:700 }}>{new Date(selectedRequest.createdAt || selectedRequest.CreatedAt).toLocaleString()}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems:'center' }}><span style={{ color:'#64748b' }}>Payment Status:</span> <span style={{ color: (selectedRequest.isPaid || selectedRequest.IsPaid) ? '#059669' : '#b91c1c', background: (selectedRequest.isPaid || selectedRequest.IsPaid) ? '#d1fae5' : '#fee2e2', padding:'0.2rem 0.6rem', borderRadius:'999px', fontSize:'0.7rem', fontWeight: 800 }}>{(selectedRequest.isPaid || selectedRequest.IsPaid) ? '✓ PAID' : '⌛ UNPAID'}</span></div>
                      </div>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6366f1', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '0.05em' }}>📄 Proof of Documents</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
                    {(selectedRequest.documentUrls || selectedRequest.DocumentUrls)?.split(',').map((url, idx) => (
                      <a key={idx} href={`http://localhost:5000${url}`} target="_blank" rel="noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', background: '#f8fafc', padding:'1rem', borderRadius:'0.75rem', border: '1px solid #e2e8f0', transition: '0.2s' }}>
                        <div style={{ fontSize: '2.5rem' }}>📄</div>
                        <span style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 800, textAlign: 'center' }}>Document {idx + 1}</span>
                        <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>Click to view</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {toast && <div style={{ position:'fixed', bottom:'2rem', left:'50%', transform:'translateX(-50%)', background:'#1e293b', color:'#fff', padding:'1rem 2rem', borderRadius:'1rem', boxShadow:'0 20px 25px -5px rgba(0,0,0,0.1)', zIndex:10001, fontWeight:700, display:'flex', alignItems:'center', gap:'0.75rem', animation:'toastIn 0.3s ease' }}>{toast}</div>}
          
          <style>{`
            @keyframes modalIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
          `}</style>
        </>
      )}
    </Layout>
  );
}
