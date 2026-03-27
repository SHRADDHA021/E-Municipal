import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const inp = { display:'block', width:'100%', padding:'0.65rem 0.9rem', border:'1.5px solid #e2e8f0', borderRadius:'0.6rem', background:'#f8fafc', color:'#1e293b', fontSize:'0.875rem', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const btn = (col) => ({ padding:'0.5rem 1.1rem', borderRadius:'0.6rem', border:'none', cursor:'pointer', fontWeight:800, fontSize:'0.85rem', background: col === 'red' ? '#ef4444' : col === 'blue' ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : '#f1f5f9', color: col === 'red' || col === 'blue' ? '#fff' : '#475569', transition:'all 0.2s', boxShadow: col==='red'?'0 2px 8px rgba(239,68,68,0.3)':'none' });

const EMPTY = { EName:'', Email:'', Password:'', DNo:'', Phno:'', EAdd:'', Salary: 0 };

export default function ManageEmployees() {
  const [emps, setEmps] = useState([]);
  const [depts, setDepts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState('');
  const [selected, setSelected] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { fetchEmps(); fetchDepts(); }, []);

  const fetchEmps = async () => { const { data } = await api.get('/employees').catch(() => ({ data: [] })); setEmps(data); };
  const fetchDepts = async () => { const { data } = await api.get('/departments').catch(() => ({ data: [] })); setDepts(data); };
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, DNo: parseInt(form.DNo), Salary: parseFloat(form.Salary || 0) };
      if (editing) { await api.put(`/employees/${editing}`, payload); showToast('✅ Updated!'); }
      else { await api.post('/employees', payload); showToast('✅ Employee added!'); }
      setForm(EMPTY); setEditing(null); setShowForm(false); fetchEmps();
    } catch (err) { showToast('❌ ' + (err?.response?.data || 'Failed')); }
  };

  const handleEdit = (e) => {
    setForm({ EName: e.eName, Email: e.email, Password: '', DNo: e.dNo, Phno: e.phno || '', EAdd: e.eAdd || '', Salary: e.salary || 0 });
    setEditing(e.eID); setShowForm(true);
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/employees/${id}`); showToast('🗑️ Deleted'); setConfirmDelete(null); fetchEmps(); }
    catch { showToast('❌ Delete failed'); }
  };

  return (
    <Layout>
      {toast && <div style={{ position:'fixed', top:'2rem', right:'2rem', background:'#1e293b', color:'#fff', padding:'0.9rem 1.5rem', borderRadius:'0.75rem', boxShadow:'0 10px 25px rgba(0,0,0,0.2)', zIndex:9999, fontWeight:600 }}>{toast}</div>}

      {confirmDelete && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(15,23,42,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1100 }}>
          <div style={{ background:'#fff', padding:'2rem', borderRadius:'1.25rem', width:'100%', maxWidth:'400px', textAlign:'center', boxShadow:'0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>⚠️</div>
            <h2 style={{ margin:'0 0 1rem', fontSize:'1.25rem', fontWeight:800, color:'#1e293b' }}>Confirm Deletion</h2>
            <p style={{ color:'#64748b', marginBottom:'2rem' }}>Are you sure you want to delete this employee? This action cannot be undone.</p>
            <div style={{ display:'flex', gap:'1rem', justifyContent:'center' }}>
              <button onClick={() => setConfirmDelete(null)} style={btn('grey')}>Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} style={btn('red')}>Delete Anyway</button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(15,23,42,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'#fff', padding:'2rem', borderRadius:'1.25rem', width:'100%', maxWidth:'400px', boxShadow:'0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h2 style={{ margin:0, fontSize:'1.3rem', fontWeight:800, color:'#1e293b' }}>👷 Employee Info</h2>
              <button onClick={() => setSelected(null)} style={{ background:'#f1f5f9', border:'none', width:'32px', height:'32px', borderRadius:'50%', cursor:'pointer', color:'#64748b', fontSize:'1.1rem' }}>✕</button>
            </div>
            {[['EID', selected.eID], ['Name', selected.eName], ['Email', selected.email], ['Phone', selected.phno], ['Address', selected.eAdd], ['Salary', `₹${selected.salary}`], ['Department', selected.department?.dName || `DNo ${selected.dNo}`]].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'0.6rem 0', borderBottom:'1px solid #f1f5f9' }}>
                <span style={{ color:'#64748b', fontWeight:600, fontSize:'0.875rem' }}>{k}</span>
                <span style={{ color:'#1e293b', fontWeight:500, fontSize:'0.875rem' }}>{v || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#1e293b', margin:'0 0 0.3rem', fontFamily:"'Outfit',sans-serif" }}>Employees</h1>
          <p style={{ color:'#64748b', margin:0 }}>Manage municipal employees</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(!showForm); }} style={{ ...btn(showForm ? 'grey' : 'blue'), padding:'0.7rem 1.4rem' }}>
          {showForm ? '✕ Cancel' : '+ Add Employee'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background:'#fff', border:'1.5px solid #e0e7ff', borderTop:'4px solid #6366f1', borderRadius:'1.25rem', padding:'1.75rem', marginBottom:'1.5rem' }}>
          <h3 style={{ margin:'0 0 1.25rem', color:'#1e293b', fontWeight:700 }}>{editing ? 'Edit Employee' : 'New Employee'}</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            {[['EName','Full Name','text',true],['Email','Email','email',true],['Password', editing ? 'Password (leave blank to keep)' : 'Password','password',!editing],['Phno','Phone','text',false],['EAdd','Address','text',false],['Salary','Salary (₹)','number',true]].map(([k,label,type,req]) => (
              <div key={k}>
                <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>{label}</label>
                <input type={type} required={req} value={form[k]} onChange={set(k)} style={inp} />
              </div>
            ))}
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Department *</label>
              <select required value={form.DNo} onChange={set('DNo')} style={{ ...inp, cursor:'pointer' }}>
                <option value="">-- Select --</option>
                {depts.map(d => <option key={d.dNo} value={d.dNo}>{d.dName}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop:'1.25rem' }}>
            <button type="submit" style={{ ...btn('blue'), padding:'0.7rem 2rem' }}>{editing ? 'Update' : 'Add Employee'}</button>
          </div>
        </form>
      )}

      <div style={{ background:'#fff', borderRadius:'1rem', overflow:'hidden', boxShadow:'0 4px 16px rgba(0,0,0,0.06)' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.875rem' }}>
          <thead style={{ background:'#f8fafc' }}>
            <tr>{['EID','Name','Email','Phone','Salary','Dept'].map(h => (
              <th key={h} style={{ textAlign:'left', padding:'0.85rem 1rem', color:'#64748b', fontWeight:700, fontSize:'0.78rem', textTransform:'uppercase', letterSpacing:'0.04em' }}>{h}</th>
            ))}
            <th style={{ textAlign:'right', padding:'0.85rem 1rem', color:'#64748b', fontWeight:700, fontSize:'0.78rem', textTransform:'uppercase', minWidth:'140px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {emps.map(e => (
              <tr key={e.eID} style={{ borderTop:'1px solid #f1f5f9' }}>
                <td style={{ padding:'0.85rem 1rem', color:'#6366f1', fontWeight:700 }}>#{e.eID}</td>
                <td style={{ padding:'0.85rem 1rem', color:'#1e293b', fontWeight:600 }}>{e.eName}</td>
                <td style={{ padding:'0.85rem 1rem', color:'#475569' }}>{e.email}</td>
                <td style={{ padding:'0.85rem 1rem', color:'#64748b' }}>{e.phno || '—'}</td>
                <td style={{ padding:'0.85rem 1rem', color:'#059669', fontWeight:700 }}>₹{e.salary}</td>
                <td style={{ padding:'0.85rem 1rem', color:'#475569' }}>{e.department?.dName || `DNo ${e.dNo}`}</td>
                <td style={{ padding:'0.85rem 1rem', textAlign:'right' }}>
                  <div style={{ display:'flex', gap:'0.5rem', justifyContent:'flex-end' }}>
                    <button onClick={() => setSelected(e)} style={btn('grey')}>👁</button>
                    <button onClick={() => handleEdit(e)} style={btn('grey')}>✏️</button>
                    <button onClick={() => setConfirmDelete(e.eid || e.eID || e.EID)} style={btn('red')}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {emps.length === 0 && <div style={{ textAlign:'center', padding:'3rem', color:'#94a3b8' }}>No employees. Add one above.</div>}
      </div>
    </Layout>
  );
}
