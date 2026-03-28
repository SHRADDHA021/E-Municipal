import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const btn = (col) => ({ padding:'0.45rem 0.9rem', borderRadius:'0.5rem', border:'none', cursor:'pointer', fontWeight:700, fontSize:'0.78rem', background: col==='red'?'#fef2f2':col==='blue'?'linear-gradient(135deg,#6366f1,#4f46e5)':col==='green'?'#d1fae5':'#f1f5f9', color: col==='red'?'#dc2626':col==='blue'?'#fff':col==='green'?'#065f46':'#475569' });
const statusColor = (s) => s==='Completed'?'#059669':s==='In Progress'?'#d97706':'#6366f1';
const statusBg    = (s) => s==='Completed'?'#d1fae5':s==='In Progress'?'#fef3c7':'#ede9fe';

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [emps, setEmps] = useState([]);
  const [depts, setDepts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [assignForm, setAssignForm] = useState({ EID: '', DNo: '' });
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
    api.get('/employees').then(r => setEmps(r.data)).catch(() => {});
    api.get('/departments').then(r => setDepts(r.data)).catch(() => {});
  }, []);

  const fetchAll = async () => {
    const { data } = await api.get('/complaints').catch(() => ({ data: [] }));
    setComplaints(data);
    setLoading(false);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/complaints/${selected.cid}/assign`, {
        EID: assignForm.EID ? parseInt(assignForm.EID) : null,
        DNo: assignForm.DNo ? parseInt(assignForm.DNo) : null
      });
      showToast('✅ Complaint assigned!');
      setSelected(null);
      fetchAll();
    } catch { showToast('❌ Assign failed'); }
  };

  const handleStatus = async (cid, status) => {
    try {
      const fd = new FormData();
      fd.append('C_status', status);
      await api.put(`/complaints/${cid}/status`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast(`✅ Status → ${status}`);
      fetchAll();
    } catch { showToast('❌ Status update failed'); }
  };

  return (
    <Layout>
      {toast && <div style={{ position:'fixed', top:'2rem', right:'2rem', background:'#1e293b', color:'#fff', padding:'0.9rem 1.5rem', borderRadius:'0.75rem', boxShadow:'0 10px 25px rgba(0,0,0,0.2)', zIndex:9999, fontWeight:600 }}>{toast}</div>}

      {/* Assign Modal */}
      {selected && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(15,23,42,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'1rem' }}>
          <div style={{ background:'#fff', padding:'2rem', borderRadius:'1.25rem', width:'100%', maxWidth:'480px', boxShadow:'0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
              <h2 style={{ margin:0, fontSize:'1.25rem', fontWeight:800, color:'#1e293b' }}>📋 Complaint #{selected.cid}</h2>
              <button onClick={() => setSelected(null)} style={{ background:'#f1f5f9', border:'none', width:'32px', height:'32px', borderRadius:'50%', cursor:'pointer', color:'#64748b', fontSize:'1rem' }}>✕</button>
            </div>
            <div style={{ marginBottom:'0.5rem', color:'#1e293b', fontWeight:700 }}>{selected.title}</div>
            <div style={{ color:'#94a3b8', fontSize:'0.75rem', marginTop:'0.4rem' }}>{selected.department?.dname || selected.department?.dName || 'No department'}</div>
            <div style={{ fontSize:'0.8rem', color:'#94a3b8', marginBottom:'1rem' }}>
              Citizen: {selected.citizen?.name || selected.idNo} · Date: {new Date(selected.c_date).toLocaleDateString()}
            </div>
            {selected.imageUrl && <img src={`http://localhost:5000${selected.imageUrl}`} alt="complaint" style={{ width:'100%', borderRadius:'0.75rem', marginBottom:'1rem', maxHeight:'200px', objectFit:'cover' }} />}
            <form onSubmit={handleAssign}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'1rem' }}>
                <div>
                  <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.8rem' }}>Assign Employee</label>
                  <select value={assignForm.EID} onChange={e => setAssignForm({...assignForm, EID: e.target.value})} style={{ width:'100%', padding:'0.6rem', border:'1.5px solid #e2e8f0', borderRadius:'0.6rem', background:'#f8fafc', fontSize:'0.875rem', fontFamily:'inherit' }}>
                    <option value="">-- Select --</option>
                    {emps.map(em => <option key={em.eid || em.eID || em.EID} value={em.eid || em.eID || em.EID}>{em.ename || em.eName || em.EName}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.8rem' }}>Assign Department</label>
                  <select value={assignForm.DNo} onChange={e => setAssignForm({...assignForm, DNo: e.target.value})} style={{ width:'100%', padding:'0.6rem', border:'1.5px solid #e2e8f0', borderRadius:'0.6rem', background:'#f8fafc', fontSize:'0.875rem', fontFamily:'inherit' }}>
                    <option value="">-- Select --</option>
                    {depts.map(d => <option key={d.dno || d.dNo || d.DNo} value={d.dno || d.dNo || d.DNo}>{d.dname || d.dName || d.DName}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
                <button type="submit" style={btn('blue')}>Assign & Mark In Progress</button>
                <button type="button" onClick={() => handleStatus(selected.cid, 'Completed')} style={btn('green')}>✅ Mark Completed</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#1e293b', margin:'0 0 0.3rem', fontFamily:"'Outfit',sans-serif" }}>Complaints</h1>
        <p style={{ color:'#64748b', margin:0 }}>Monitor and assign complaints to employees/departments</p>
      </div>

      {loading ? <div style={{ textAlign:'center', padding:'4rem', color:'#94a3b8' }}>Loading...</div> : (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {complaints.map(c => (
            <div key={c.cid} onClick={() => { setSelected(c); setAssignForm({ EID: c.eid || c.eID || '', DNo: c.dno || c.dNo || '' }); }}
              style={{ background:'#fff', borderRadius:'1rem', padding:'1.25rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.05)', cursor:'pointer', borderLeft:`4px solid ${statusColor(c.c_status)}`, transition:'box-shadow 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.05)'}
            >
              <div>
                <div style={{ fontWeight:700, color:'#1e293b', marginBottom:'0.25rem' }}>#{c.cid} — {c.title}</div>
                <div style={{ color:'#64748b', fontSize:'0.8rem' }}>
                  👤 {c.citizen?.name || `ID ${c.idNo}`} · 📅 {new Date(c.c_date).toLocaleDateString()}
                  {c.employee && ` · 👷 ${c.employee.ename || c.employee.eName}`}
                </div>
              </div>
              <span style={{ background:statusBg(c.c_status), color:statusColor(c.c_status), borderRadius:'999px', padding:'0.25rem 0.75rem', fontSize:'0.72rem', fontWeight:800, textTransform:'uppercase', whiteSpace:'nowrap' }}>
                {c.c_status}
              </span>
            </div>
          ))}
          {complaints.length === 0 && <div style={{ textAlign:'center', padding:'4rem', color:'#94a3b8', background:'#fff', borderRadius:'1rem' }}>No complaints yet</div>}
        </div>
      )}
    </Layout>
  );
}
