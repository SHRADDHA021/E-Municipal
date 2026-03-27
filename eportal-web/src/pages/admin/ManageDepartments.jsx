import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const inp = { display:'block', width:'100%', padding:'0.65rem 0.9rem', border:'1.5px solid #e2e8f0', borderRadius:'0.6rem', background:'#f8fafc', color:'#1e293b', fontSize:'0.875rem', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const btn = (col) => ({ padding:'0.5rem 1.1rem', borderRadius:'0.5rem', border:'none', cursor:'pointer', fontWeight:700, fontSize:'0.8rem', background: col === 'red' ? '#fef2f2' : col === 'blue' ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : '#f1f5f9', color: col === 'red' ? '#dc2626' : col === 'blue' ? '#fff' : '#475569' });

const EMPTY = { DName: '' };

export default function ManageDepartments() {
  const [depts, setDepts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { fetchDepts(); }, []);

  const fetchDepts = async () => {
    const { data } = await api.get('/departments').catch(() => ({ data: [] }));
    setDepts(data);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/departments/${editing}`, form);
        showToast('✅ Department updated!');
      } else {
        await api.post('/departments', form);
        showToast('✅ Department added!');
      }
      setForm(EMPTY); setEditing(null); setShowForm(false);
      fetchDepts();
    } catch (err) { showToast('❌ ' + (err?.response?.data || 'Operation failed')); }
  };

  const handleEdit = (d) => { setForm({ DName: d.dName }); setEditing(d.dNo); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!confirm('Delete this department?')) return;
    try {
      await api.delete(`/departments/${id}`);
      showToast('🗑️ Deleted'); fetchDepts();
    } catch { showToast('❌ Delete failed'); }
  };

  return (
    <Layout>
      {toast && <div style={{ position:'fixed', top:'2rem', right:'2rem', background:'#1e293b', color:'#fff', padding:'0.9rem 1.5rem', borderRadius:'0.75rem', boxShadow:'0 10px 25px rgba(0,0,0,0.2)', zIndex:9999, fontWeight:600 }}>{toast}</div>}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#1e293b', margin:'0 0 0.3rem', fontFamily:"'Outfit',sans-serif" }}>Departments</h1>
          <p style={{ color:'#64748b', margin:0 }}>Manage municipal departments</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(!showForm); }} style={{ ...btn(showForm ? 'grey' : 'blue'), padding:'0.7rem 1.4rem' }}>
          {showForm ? '✕ Cancel' : '+ Add Department'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background:'#fff', border:'1.5px solid #e0e7ff', borderTop:'4px solid #6366f1', borderRadius:'1.25rem', padding:'1.75rem', marginBottom:'1.5rem' }}>
          <h3 style={{ margin:'0 0 1rem', color:'#1e293b', fontWeight:700 }}>{editing ? 'Edit Department' : 'New Department'}</h3>
          <div style={{ display:'flex', gap:'1rem', alignItems:'flex-end' }}>
            <div style={{ flex:1 }}>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Department Name</label>
              <input required value={form.DName} onChange={e => setForm({DName: e.target.value})} placeholder="e.g. Water Supply" style={inp} />
            </div>
            <button type="submit" style={{ ...btn('blue'), padding:'0.65rem 1.5rem', whiteSpace:'nowrap' }}>{editing ? 'Update' : 'Add'}</button>
          </div>
        </form>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1rem' }}>
        {depts.map(d => {
          const dname = d.dName ?? d.DName;
          const dno = d.dNo ?? d.DNo;
          const emps = d.employees ?? d.Employees ?? [];
          return (
            <div key={dno} style={{ background:'#fff', borderRadius:'1rem', padding:'1.5rem', boxShadow:'0 4px 16px rgba(0,0,0,0.06)', borderLeft:'4px solid #6366f1' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ fontSize:'1.5rem', marginBottom:'0.25rem' }}>🏢</div>
                  <div style={{ fontWeight:700, color:'#1e293b', fontSize:'1rem', fontFamily:"'Outfit',sans-serif" }}>{dname}</div>
                  <div style={{ color:'#94a3b8', fontSize:'0.78rem', marginTop:'0.25rem' }}>DNo: {dno} · {emps.length} employees</div>
                </div>
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  <button onClick={() => handleEdit(d)} style={btn('grey')}>✏️</button>
                  <button onClick={() => handleDelete(dno)} style={btn('red')}>🗑</button>
                </div>
              </div>
            </div>
          );
        })}
        {depts.length === 0 && <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'3rem', color:'#94a3b8' }}>No departments yet. Add one above.</div>}
      </div>
    </Layout>
  );
}
