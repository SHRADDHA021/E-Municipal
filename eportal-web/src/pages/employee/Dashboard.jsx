import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const statusColor = (s) => s==='Completed'?'#059669':s==='In Progress'?'#d97706':'#6366f1';
const statusBg    = (s) => s==='Completed'?'#d1fae5':s==='In Progress'?'#fef3c7':'#ede9fe';

export default function EmployeeDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [proof, setProof] = useState({ id: null, file: null });

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    const { data } = await api.get('/complaints').catch(() => ({ data: [] }));
    setComplaints(data);
    setLoading(false);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const updateStatus = async (cid, status, file = null) => {
    try {
      const fd = new FormData();
      fd.append('C_status', status);
      if (file) fd.append('ProofImage', file);
      await api.put(`/complaints/${cid}/status`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast(`✅ Complaint #${cid} → ${status}`);
      setProof({ id: null, file: null });
      fetchComplaints();
    } catch { showToast('❌ Update failed'); }
  };

  return (
    <Layout>
      {toast && <div style={{ position:'fixed', top:'2rem', right:'2rem', background:'#1e293b', color:'#fff', padding:'0.9rem 1.5rem', borderRadius:'0.75rem', boxShadow:'0 10px 25px rgba(0,0,0,0.2)', zIndex:9999, fontWeight:600 }}>{toast}</div>}

      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#1e293b', margin:'0 0 0.3rem', fontFamily:"'Outfit',sans-serif" }}>My Assigned Complaints</h1>
        <p style={{ color:'#64748b', margin:0 }}>View and resolve complaints assigned to you</p>
      </div>

      {loading ? <div style={{ textAlign:'center', padding:'4rem', color:'#94a3b8' }}>Loading...</div> : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {complaints.map(c => (
            <div key={c.cid} style={{ background:'#fff', borderRadius:'1rem', padding:'1.5rem', boxShadow:'0 4px 16px rgba(0,0,0,0.06)', borderLeft:`4px solid ${statusColor(c.c_status)}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'0.75rem', marginBottom:'0.75rem' }}>
                <div>
                  <div style={{ fontWeight:700, color:'#1e293b', fontSize:'1rem' }}>#{c.cid} — {c.title}</div>
                  <div style={{ color:'#64748b', fontSize:'0.8rem', marginTop:'0.3rem' }}>{c.description}</div>
                  <div style={{ color:'#94a3b8', fontSize:'0.75rem', marginTop:'0.3rem' }}>
                    👤 {c.citizen?.name || `Citizen ${c.idNo}`} · 📅 {new Date(c.c_date).toLocaleDateString()}
                    {c.department && ` · 🏢 ${c.department.dName}`}
                  </div>
                </div>
                <span style={{ background:statusBg(c.c_status), color:statusColor(c.c_status), borderRadius:'999px', padding:'0.25rem 0.75rem', fontSize:'0.72rem', fontWeight:800, textTransform:'uppercase' }}>
                  {c.c_status}
                </span>
              </div>

              {c.imageUrl && (
                <div style={{ marginBottom:'0.75rem' }}>
                  <img src={`http://localhost:5000${c.imageUrl}`} alt="complaint" style={{ width:'100%', maxHeight:'180px', objectFit:'cover', borderRadius:'0.6rem' }} />
                </div>
              )}

              {c.c_status !== 'Completed' && (
                <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', alignItems:'center' }}>
                  <button onClick={() => updateStatus(c.cid, 'In Progress')} style={{ padding:'0.5rem 1rem', borderRadius:'0.5rem', background:'#fef3c7', color:'#d97706', border:'1px solid #fde68a', fontWeight:700, cursor:'pointer', fontSize:'0.8rem' }}>
                    🔧 Mark In Progress
                  </button>
                  <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
                    <input type="file" accept="image/*" onChange={e => setProof({ id: c.cid, file: e.target.files[0] })} style={{ fontSize:'0.78rem', color:'#475569' }} />
                    <button onClick={() => updateStatus(c.cid, 'Completed', proof.id === c.cid ? proof.file : null)} style={{ padding:'0.5rem 1rem', borderRadius:'0.5rem', background:'#d1fae5', color:'#059669', border:'1px solid #a7f3d0', fontWeight:700, cursor:'pointer', fontSize:'0.8rem' }}>
                      ✅ Mark Completed
                    </button>
                  </div>
                </div>
              )}
              {c.proofImageUrl && (
                <div style={{ marginTop:'0.75rem', padding:'0.5rem 0.75rem', background:'#d1fae5', borderRadius:'0.5rem', fontSize:'0.8rem', color:'#065f46', fontWeight:600 }}>
                  ✅ Proof uploaded
                </div>
              )}
            </div>
          ))}
          {complaints.length === 0 && <div style={{ textAlign:'center', padding:'4rem', color:'#94a3b8', background:'#fff', borderRadius:'1rem' }}>No complaints assigned to you yet</div>}
        </div>
      )}
    </Layout>
  );
}
