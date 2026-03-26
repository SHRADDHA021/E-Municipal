import { useState, useEffect } from 'react';
import api from '../../api/axios';

const ApplyService = () => {
  const [services, setServices]         = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [paymentModal, setPaymentModal] = useState(null); // stores the service object being paid for
  const [toastMsg, setToastMsg]         = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [sRes, aRes] = await Promise.all([
        api.get('/services').catch(() => ({ data: [] })),
        api.get('/services/applications').catch(() => ({ data: [] })),
      ]);
      setServices(sRes.data);
      setApplications(aRes.data);
    } finally { setLoading(false); }
  };

  const handleApplyClick = (service) => {
    setPaymentModal(service);
  };

  const processPayment = async (method) => {
    const { id, amount } = paymentModal;
    setPaymentModal(null);
    try {
      await api.post(`/services/apply/${id}`);
      await api.post(`/payments`, amount, { headers: { 'Content-Type': 'application/json' }});
      
      setToastMsg(`✅ Payment of ₹${amount} via ${method} successful! Application submitted.`);
      setTimeout(() => setToastMsg(''), 4000);
      fetchData();
    } catch { 
      setToastMsg('❌ Action failed - check backend connection.');
      setTimeout(() => setToastMsg(''), 4000);
    }
  };

  const statusColor = (s) => s === 'Approved' ? '#059669' : s === 'Rejected' ? '#dc2626' : '#d97706';
  const statusBg    = (s) => s === 'Approved' ? '#d1fae5' : s === 'Rejected' ? '#fef2f2' : '#fef3c7';

  if (loading) return <div style={{ textAlign:'center', padding:'4rem', color:'#94a3b8', fontSize:'1.2rem' }}>Loading services...</div>;

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", position: 'relative' }}>
      
      {toastMsg && (
        <div style={{ position: 'fixed', top: '2rem', right: '2rem', background: '#1e293b', color: '#fff', padding: '1rem 1.5rem', borderRadius: '0.75rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 9999, fontWeight: 600, animation: 'slideIn 0.3s ease' }}>
          {toastMsg}
        </div>
      )}

      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#1e293b', margin:'0 0 0.4rem', fontFamily:"'Outfit',sans-serif" }}>Municipal Services</h1>
        <p style={{ color:'#64748b', margin:0 }}>Apply for official documents and pay your bills online.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2.5rem', flexWrap:'wrap' }}>
        {/* Left: Services */}
        <div>
          <h2 style={{ fontSize:'1.1rem', fontWeight:700, color:'#1e293b', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
            📋 Available Services
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {services.map(s => (
              <div key={s.id} style={{ background:'rgba(255,255,255,0.9)', border:'1px solid #e2e8f0', borderRadius:'1rem', padding:'1.25rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.04)', gap:'1rem' }}>
                <div>
                  <div style={{ fontWeight:700, color:'#1e293b', marginBottom:'0.25rem', fontFamily:"'Outfit',sans-serif" }}>{s.name}</div>
                  <div style={{ background:'#d1fae5', color:'#065f46', border:'1px solid #a7f3d0', borderRadius:'999px', padding:'0.15rem 0.6rem', fontSize:'0.75rem', fontWeight:700, display:'inline-block' }}>
                    Fee: ₹{s.amount}
                  </div>
                </div>
                <button onClick={() => handleApplyClick(s)} style={{ padding:'0.6rem 1.25rem', borderRadius:'0.65rem', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'#fff', border:'none', fontWeight:700, fontSize:'0.8rem', cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', boxShadow:'0 4px 12px rgba(99,102,241,0.35)' }}>
                  Apply & Pay
                </button>
              </div>
            ))}
            {services.length === 0 && (
              <div style={{ textAlign:'center', padding:'3rem', background:'rgba(255,255,255,0.7)', border:'2px dashed #e2e8f0', borderRadius:'1rem', color:'#94a3b8', fontSize:'0.875rem' }}>
                No services available yet
              </div>
            )}
          </div>
        </div>

        {/* Right: Applications */}
        <div>
          <h2 style={{ fontSize:'1.1rem', fontWeight:700, color:'#1e293b', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
            ⏳ My Applications
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {applications.map(a => (
              <div key={a.id} style={{ background:'rgba(255,255,255,0.9)', border:'1px solid #e2e8f0', borderLeft:`4px solid ${statusColor(a.status)}`, borderRadius:'1rem', padding:'1.25rem 1.5rem', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div style={{ fontWeight:700, color:'#1e293b', fontFamily:"'Outfit',sans-serif" }}>{a.service?.name || `Service #${a.serviceId}`}</div>
                  <span style={{ background:statusBg(a.status), color:statusColor(a.status), borderRadius:'999px', padding:'0.2rem 0.65rem', fontSize:'0.72rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.04em' }}>
                    {a.status}
                  </span>
                </div>
                <div style={{ fontSize:'0.78rem', color:'#94a3b8', marginTop:'0.4rem', fontWeight:500 }}>
                  📅 {new Date(a.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
            {applications.length === 0 && (
              <div style={{ textAlign:'center', padding:'3rem', background:'rgba(255,255,255,0.7)', border:'2px dashed #e2e8f0', borderRadius:'1rem', color:'#94a3b8', fontSize:'0.875rem' }}>
                No applications submitted yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {paymentModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '1.25rem', width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', fontFamily: "'Outfit',sans-serif" }}>Payment Required</h2>
              <button onClick={() => setPaymentModal(null)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.1rem', color: '#64748b' }}>✕</button>
            </div>
            
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: '0.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Amount to Pay</div>
              <div style={{ color: '#10b981', fontSize: '2.5rem', fontWeight: 900, fontFamily: "'Outfit',sans-serif", margin: '0.5rem 0' }}>₹{paymentModal.amount}</div>
              <div style={{ color: '#475569', fontSize: '0.9rem', fontWeight: 500 }}>For: {paymentModal.name}</div>
            </div>

            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.75rem' }}>Select Payment Method</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['UPI / QR Code', 'Credit/Debit Card', 'Net Banking'].map(method => (
                <button 
                  key={method} 
                  onClick={() => processPayment(method)}
                  style={{ padding: '1rem', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '0.75rem', fontWeight: 600, color: '#1e293b', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.2s', textAlign: 'left' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <span>{method}</span>
                  <span style={{ color: '#94a3b8' }}>→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyService;
