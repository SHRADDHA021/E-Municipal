import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const statusColor = (s) => s==='Completed'?'#059669':s==='In Progress'?'#d97706':'#6366f1';
const statusBg    = (s) => s==='Completed'?'#d1fae5':s==='In Progress'?'#fef3c7':'#ede9fe';

export default function CitizenComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', image: null });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [preview, setPreview] = useState(null);

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    const { data } = await api.get('/complaints').catch(() => ({ data: [] }));
    setComplaints(data);
    setLoading(false);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('Title', form.title);
    fd.append('Description', form.description);
    if (form.image) fd.append('Image', form.image);
    try {
      await api.post('/complaints', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('✅ Complaint submitted successfully!');
      setShowForm(false);
      setForm({ title: '', description: '', image: null });
      fetchComplaints();
    } catch { showToast('❌ Failed to submit. Please try again.'); }
  };

  return (
    <Layout>
      {toast && <div style={{ position:'fixed', top:'2rem', right:'2rem', background:'#1e293b', color:'#fff', padding:'0.9rem 1.5rem', borderRadius:'0.75rem', boxShadow:'0 10px 25px rgba(0,0,0,0.2)', zIndex:9999, fontWeight:600 }}>{toast}</div>}

      {preview && (
        <div onClick={() => setPreview(null)} style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, cursor:'pointer' }}>
          <img src={`http://localhost:5000${preview}`} style={{ maxWidth:'90vw', maxHeight:'90vh', borderRadius:'1rem' }} alt="complaint" />
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#1e293b', margin:'0 0 0.3rem', fontFamily:"'Outfit',sans-serif" }}>Community Complaints</h1>
          <p style={{ color:'#64748b', margin:0 }}>Community-wide issues and their resolution status</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding:'0.7rem 1.4rem', borderRadius:'0.75rem', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'#fff', border:'none', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
          {showForm ? '✕ Cancel' : '+ Report Issue'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background:'#fff', border:'1.5px solid #e0e7ff', borderTop:'4px solid #6366f1', borderRadius:'1.25rem', padding:'1.75rem', marginBottom:'1.5rem' }}>
          <h3 style={{ margin:'0 0 1.25rem', fontWeight:700, color:'#1e293b' }}>New Complaint</h3>
          <div style={{ marginBottom:'1rem' }}>
            <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Title *</label>
            <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Brief title of the issue" style={{ display:'block', width:'100%', padding:'0.65rem 0.9rem', border:'1.5px solid #e2e8f0', borderRadius:'0.6rem', background:'#f8fafc', color:'#1e293b', fontSize:'0.875rem', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }} />
          </div>
          <div style={{ marginBottom:'1rem' }}>
            <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the problem in detail..." style={{ display:'block', width:'100%', padding:'0.65rem 0.9rem', border:'1.5px solid #e2e8f0', borderRadius:'0.6rem', background:'#f8fafc', color:'#1e293b', fontSize:'0.875rem', fontFamily:'inherit', outline:'none', boxSizing:'border-box', resize:'vertical' }} />
          </div>
          <div style={{ marginBottom:'1.25rem' }}>
            <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Attach Image (optional)</label>
            <input type="file" accept="image/*" onChange={e => setForm({...form, image: e.target.files[0]})} style={{ fontSize:'0.875rem', color:'#475569' }} />
          </div>
          <button type="submit" style={{ padding:'0.7rem 2rem', borderRadius:'0.75rem', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'#fff', border:'none', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>Submit Complaint</button>
        </form>
      )}

      {loading ? <div style={{ textAlign:'center', padding:'4rem', color:'#94a3b8' }}>Loading...</div> : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {complaints.map(c => (
            <div key={c.cid} style={{ background:'#fff', borderRadius:'1rem', padding:'1.25rem 1.5rem', boxShadow:'0 2px 12px rgba(0,0,0,0.05)', borderLeft:`4px solid ${statusColor(c.c_status)}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'0.5rem' }}>
                <div>
                  <div style={{ fontWeight:700, color:'#1e293b', marginBottom:'0.25rem' }}>#{c.cid} — {c.title}</div>
                  <div style={{ color:'#64748b', fontSize:'0.8rem', marginBottom:'0.35rem' }}>{c.description}</div>
                  <div style={{ color:'#94a3b8', fontSize:'0.75rem' }}>
                    📅 {new Date(c.c_date).toLocaleDateString()}
                    {c.employee && ` · 👷 Assigned: ${c.employee.eName}`}
                    {c.department && ` · 🏢 Dept: ${c.department.dName}`}
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.5rem' }}>
                  <span style={{ background:statusBg(c.c_status), color:statusColor(c.c_status), borderRadius:'999px', padding:'0.2rem 0.65rem', fontSize:'0.72rem', fontWeight:800, textTransform:'uppercase' }}>{c.c_status}</span>
                  {c.imageUrl && <button onClick={() => setPreview(c.imageUrl)} style={{ background:'#e0e7ff', color:'#6366f1', border:'none', borderRadius:'0.4rem', padding:'0.2rem 0.5rem', fontSize:'0.75rem', cursor:'pointer', fontWeight:600 }}>📷 View</button>}
                </div>
              </div>
              {c.proofImageUrl && (
                <div style={{ marginTop:'0.75rem', padding:'0.5rem 0.75rem', background:'#d1fae5', borderRadius:'0.5rem', fontSize:'0.8rem', color:'#065f46', fontWeight:600 }}>
                  ✅ Proof provided · <button onClick={() => setPreview(c.proofImageUrl)} style={{ background:'none', border:'none', color:'#059669', cursor:'pointer', fontWeight:700, textDecoration:'underline', fontSize:'0.8rem' }}>View proof</button>
                </div>
              )}
            </div>
          ))}
          {complaints.length === 0 && <div style={{ textAlign:'center', padding:'4rem', color:'#94a3b8', background:'#fff', borderRadius:'1rem' }}>No complaints yet. Report an issue above.</div>}
        </div>
      )}
    </Layout>
  );
}
