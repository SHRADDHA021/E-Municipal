import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const inp = { display:'block', width:'100%', padding:'0.65rem 0.9rem', border:'1.5px solid #e2e8f0', borderRadius:'0.6rem', background:'#f8fafc', color:'#1e293b', fontSize:'0.875rem', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const btn = (col) => ({ padding:'0.5rem 1.1rem', borderRadius:'0.6rem', border:'none', cursor:'pointer', fontWeight:800, fontSize:'0.85rem', background: col === 'red' ? '#ef4444' : col === 'blue' ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : '#f1f5f9', color: col === 'red' || col === 'blue' ? '#fff' : '#475569', transition:'all 0.2s', boxShadow: col==='red'?'0 2px 8px rgba(239,68,68,0.3)':'none' });

const EMPTY = { SName:'', Rate:'', DNo:'', RequiredDocs:'' };

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [depts, setDepts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { fetchServices(); api.get('/departments').then(r => setDepts(r.data)).catch(() => {}); }, []);

  const fetchServices = async () => { const { data } = await api.get('/services').catch(() => ({ data: [] })); setServices(data); };
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        SName: form.SName, 
        Rate: parseFloat(form.Rate), 
        DNo: form.DNo ? parseInt(form.DNo) : null,
        RequiredDocs: form.RequiredDocs
      };
      if (editing) { await api.put(`/services/${editing}`, payload); showToast('✅ Updated!'); }
      else { await api.post('/services', payload); showToast('✅ Service added!'); }
      setForm(EMPTY); setEditing(null); setShowForm(false); fetchServices();
    } catch (err) { showToast('❌ ' + (err?.response?.data || 'Failed')); }
  };

  const handleEdit = (s) => { 
    setForm({ 
      SName: s.sName, 
      Rate: s.rate, 
      DNo: s.dNo || '',
      RequiredDocs: s.requiredDocs || ''
    }); 
    setEditing(s.sid); 
    setShowForm(true); 
  };
  const handleDelete = async (id) => {
    try { await api.delete(`/services/${id}`); showToast('🗑️ Deleted'); setConfirmDelete(null); fetchServices(); }
    catch { showToast('❌ Delete failed'); }
  };

  return (
    <Layout>
      {toast && <div style={{ position:'fixed', top:'2rem', right:'2rem', background:'#1e293b', color:'#fff', padding:'0.9rem 1.5rem', borderRadius:'0.75rem', boxShadow:'0 10px 25px rgba(0,0,0,0.2)', zIndex:9999, fontWeight:600 }}>{toast}</div>}

      {confirmDelete && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(15,23,42,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1100 }}>
          <div style={{ background:'#fff', padding:'2rem', borderRadius:'1.25rem', width:'100%', maxWidth:'400px', textAlign:'center', boxShadow:'0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>⚠️</div>
            <h2 style={{ margin:'0 0 1rem', fontSize:'1.25rem', fontWeight:800, color:'#1e293b' }}>Delete Service?</h2>
            <p style={{ color:'#64748b', marginBottom:'2rem' }}>Are you sure? This will remove the service from all future citizen applications.</p>
            <div style={{ display:'flex', gap:'1rem', justifyContent:'center' }}>
              <button onClick={() => setConfirmDelete(null)} style={btn('grey')}>Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} style={btn('red')}>Delete Service</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#1e293b', margin:'0 0 0.3rem', fontFamily:"'Outfit',sans-serif" }}>Services</h1>
          <p style={{ color:'#64748b', margin:0 }}>Manage municipal services available to citizens</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(!showForm); }} style={{ ...btn(showForm?'grey':'blue'), padding:'0.7rem 1.4rem' }}>
          {showForm ? '✕ Cancel' : '+ Add Service'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background:'#fff', border:'1.5px solid #e0e7ff', borderTop:'4px solid #6366f1', borderRadius:'1.25rem', padding:'1.75rem', marginBottom:'1.5rem' }}>
          <h3 style={{ margin:'0 0 1.25rem', color:'#1e293b', fontWeight:700 }}>{editing ? 'Edit Service' : 'New Service'}</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Service Name *</label>
              <input required value={form.SName} onChange={set('SName')} placeholder="e.g. Birth Certificate" style={inp} />
            </div>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Rate (₹) *</label>
              <input type="number" required min="0" step="0.01" value={form.Rate} onChange={set('Rate')} placeholder="500" style={inp} />
            </div>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Department</label>
              <select value={form.DNo} onChange={set('DNo')} style={{ ...inp, cursor:'pointer' }}>
                <option value="">-- None --</option>
                {depts.map(d => (
                  <option key={d.dno || d.dNo} value={d.dno || d.dNo}>
                    {d.dname || d.dName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Required Documents</label>
              <input value={form.RequiredDocs} onChange={set('RequiredDocs')} placeholder="e.g. Aadhar, Photo" style={inp} />
            </div>
          </div>
          <button type="submit" style={{ ...btn('blue'), padding:'0.65rem 2rem' }}>{editing ? 'Update Service' : 'Add Service'}</button>
        </form>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1rem' }}>
        {services.map(s => {
          const sid = s.sid || s.sId || s.SID;
          const sName = s.sname || s.sName || s.SName;
          const dName = s.department?.dname || s.department?.dName || 'No department';
          return (
            <div key={sid} style={{ background:'#fff', borderRadius:'1rem', padding:'1.5rem', boxShadow:'0 4px 16px rgba(0,0,0,0.06)', borderLeft:'4px solid #8b5cf6' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ fontSize:'1.5rem', marginBottom:'0.25rem' }}>🛠</div>
                  <div style={{ fontWeight:700, color:'#1e293b', fontSize:'1rem', fontFamily:"'Outfit',sans-serif" }}>{sName}</div>
                  <div style={{ marginTop:'0.5rem' }}>
                    <span style={{ background:'#d1fae5', color:'#065f46', border:'1px solid #a7f3d0', borderRadius:'999px', padding:'0.15rem 0.6rem', fontSize:'0.75rem', fontWeight:700 }}>₹{s.rate}</span>
                  </div>
                  <div style={{ color:'#94a3b8', fontSize:'0.75rem', marginTop:'0.4rem' }}>{dName}</div>
                  {s.requiredDocs && (
                    <div style={{ marginTop:'0.5rem', fontSize:'0.7rem', color:'#6366f1', background:'#eef2ff', padding:'0.2rem 0.5rem', borderRadius:'0.4rem', border:'1px solid #c7d2fe' }}>
                      <b>Documents:</b> {s.requiredDocs}
                    </div>
                  )}
                </div>
                <div style={{ display:'flex', gap:'0.5rem', flexDirection:'column' }}>
                  <button onClick={() => handleEdit(s)} style={btn('grey')}>✏️</button>
                  <button onClick={() => setConfirmDelete(sid)} style={btn('red')}>🗑</button>
                </div>
              </div>
            </div>
          );
        })}
        {services.length === 0 && <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'3rem', color:'#94a3b8', background:'#fff', borderRadius:'1rem' }}>No services yet. Add one above.</div>}
      </div>
    </Layout>
  );
}
