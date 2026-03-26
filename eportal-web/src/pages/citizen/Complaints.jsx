import { useState, useEffect } from 'react';
import api from '../../api/axios';

const statusBadge = (status) => {
  const map = {
    'Completed':   { bg:'#d1fae5', color:'#065f46', border:'#a7f3d0', dot:'#10b981' },
    'Pending':     { bg:'#fef3c7', color:'#92400e', border:'#fde68a', dot:'#f59e0b' },
    'In Progress': { bg:'#dbeafe', color:'#1e40af', border:'#bfdbfe', dot:'#3b82f6' },
  };
  const s = map[status] || map['Pending'];
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'0.35rem', background:s.bg, color:s.color, border:`1px solid ${s.border}`, borderRadius:'999px', padding:'0.25rem 0.75rem', fontSize:'0.75rem', fontWeight:700 }}>
      <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:s.dot, display:'inline-block' }} />
      {status}
    </span>
  );
};

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm]     = useState(false);
  const [formData, setFormData]     = useState({ title:'', description:'', image:null });
  const [loading, setLoading]       = useState(false);
  const [toastMsg, setToastMsg]     = useState('');

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    try { const { data } = await api.get('/complaints'); setComplaints(data); }
    catch { /* backend offline */ }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('Title', formData.title);
    data.append('Description', formData.description);
    if (formData.image) data.append('Image', formData.image);
    try {
      await api.post('/complaints', data, { headers: { 'Content-Type': 'multipart/form-data' }});
      setShowForm(false);
      setFormData({ title:'', description:'', image:null });
      
      setToastMsg('✅ Complaint submitted successfully!');
      setTimeout(() => setToastMsg(''), 4000);
      
      fetchComplaints();
    } catch { 
      setToastMsg('❌ Failed – check backend connection.');
      setTimeout(() => setToastMsg(''), 4000);
    }
    finally { setLoading(false); }
  };

  const inputStyle = { display:'block', width:'100%', padding:'0.7rem 1rem', border:'1.5px solid #e2e8f0', borderRadius:'0.75rem', background:'#f8fafc', color:'#1e293b', fontSize:'0.875rem', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", position: 'relative' }}>
      {toastMsg && (
        <div style={{ position: 'fixed', top: '2rem', right: '2rem', background: '#1e293b', color: '#fff', padding: '1rem 1.5rem', borderRadius: '0.75rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 9999, fontWeight: 600, animation: 'slideIn 0.3s ease' }}>
          {toastMsg}
        </div>
      )}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#1e293b', margin:'0 0 0.4rem', fontFamily:"'Outfit',sans-serif" }}>My Complaints</h1>
          <p style={{ color:'#64748b', margin:0 }}>Track and manage your reported issues.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.7rem 1.5rem',
          borderRadius:'0.75rem', border: showForm ? '1.5px solid #e2e8f0' : 'none',
          background: showForm ? '#f1f5f9' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
          color: showForm ? '#475569' : '#fff', fontWeight:700, fontSize:'0.875rem',
          cursor:'pointer', fontFamily:'inherit', boxShadow: showForm ? 'none' : '0 4px 14px rgba(99,102,241,0.4)',
        }}>
          {showForm ? '✕ Cancel' : '+ File New Complaint'}
        </button>
      </div>

      {showForm && (
        <div style={{ background:'rgba(255,255,255,0.95)', border:'1.5px solid #e0e7ff', borderTop:'4px solid #6366f1', borderRadius:'1.25rem', padding:'2rem', marginBottom:'2rem', boxShadow:'0 8px 30px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize:'1.2rem', fontWeight:700, color:'#1e293b', marginTop:0, marginBottom:'1.5rem', fontFamily:"'Outfit',sans-serif" }}>Complaint Details</h2>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.4rem', fontSize:'0.875rem' }}>Issue Title</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title:e.target.value})} placeholder="e.g. Broken road on Main Street" style={inputStyle} />
            </div>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.4rem', fontSize:'0.875rem' }}>Description</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description:e.target.value})} placeholder="Describe exact location and issue..." style={{ ...inputStyle, minHeight:'100px', resize:'vertical' }} />
            </div>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.4rem', fontSize:'0.875rem' }}>Attach Photo (Optional)</label>
              <div style={{ border:'2px dashed #e2e8f0', borderRadius:'0.75rem', padding:'1.25rem', textAlign:'center', background:'#f8fafc', cursor:'pointer' }}>
                <input type="file" accept="image/*" onChange={e => setFormData({...formData, image:e.target.files[0]})} style={{ fontSize:'0.85rem', color:'#64748b', fontFamily:'inherit' }} />
                {formData.image && <p style={{ color:'#059669', fontSize:'0.8rem', marginTop:'0.5rem', fontWeight:600 }}>✓ {formData.image.name}</p>}
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end' }}>
              <button type="submit" disabled={loading} style={{ padding:'0.75rem 2rem', borderRadius:'0.75rem', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'#fff', fontWeight:700, fontSize:'0.875rem', border:'none', cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 14px rgba(99,102,241,0.4)' }}>
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        {complaints.map(c => (
          <div key={c.id} style={{ background:'rgba(255,255,255,0.9)', border:'1px solid #e2e8f0', borderRadius:'1.25rem', padding:'1.5rem', boxShadow:'0 2px 12px rgba(0,0,0,0.05)', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem', flexWrap:'wrap' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'0.72rem', fontWeight:700, color:'#94a3b8', textTransform:'uppercase', marginBottom:'0.3rem' }}>Complaint #{c.id}</div>
              <h3 style={{ fontSize:'1.05rem', fontWeight:700, color:'#1e293b', margin:'0 0 0.4rem', fontFamily:"'Outfit',sans-serif" }}>{c.title}</h3>
              <p style={{ color:'#64748b', fontSize:'0.875rem', margin:'0 0 0.75rem', lineHeight:'1.5' }}>{c.description}</p>
              <span style={{ fontSize:'0.75rem', color:'#94a3b8', fontWeight:500 }}>📅 Filed on {new Date(c.createdAt).toLocaleDateString()}</span>
            </div>
            <div style={{ textAlign:'right', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.75rem' }}>
              {statusBadge(c.status)}
              {c.proofImageUrl && (
                <a href={`http://localhost:5000${c.proofImageUrl}`} target="_blank" rel="noreferrer"
                  style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', fontSize:'0.8rem', fontWeight:600, color:'#6366f1', background:'#eef2ff', border:'1px solid #c7d2fe', borderRadius:'0.5rem', padding:'0.3rem 0.75rem', textDecoration:'none' }}>
                  🖼 View Proof
                </a>
              )}
            </div>
          </div>
        ))}
        {complaints.length === 0 && !showForm && (
          <div style={{ textAlign:'center', padding:'4rem 2rem', background:'rgba(255,255,255,0.7)', border:'2px dashed #e2e8f0', borderRadius:'1.25rem' }}>
            <div style={{ fontSize:'3rem', marginBottom:'0.75rem' }}>✅</div>
            <h3 style={{ color:'#1e293b', fontWeight:700, fontSize:'1.1rem', fontFamily:"'Outfit',sans-serif", margin:'0 0 0.5rem' }}>No Complaints Yet</h3>
            <p style={{ color:'#94a3b8', fontSize:'0.875rem' }}>Click "File New Complaint" to report a community issue.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaints;
