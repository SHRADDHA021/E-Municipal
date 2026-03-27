import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const inp = { display:'block', width:'100%', padding:'0.65rem 0.9rem', border:'1.5px solid #e2e8f0', borderRadius:'0.6rem', background:'#f8fafc', color:'#1e293b', fontSize:'0.875rem', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const btn = (col) => ({ padding:'0.5rem 1.1rem', borderRadius:'0.5rem', border:'none', cursor:'pointer', fontWeight:700, fontSize:'0.8rem', background: col==='red'?'#fef2f2':col==='blue'?'linear-gradient(135deg,#6366f1,#4f46e5)':'#f1f5f9', color: col==='red'?'#dc2626':col==='blue'?'#fff':'#475569' });

const EMPTY = { idNo: '', citizenName: '', billType: 'Property Tax', total_amt: '', consumerNumber: '', dueDate: '' };

export default function ManageBills() {
  const [bills, setBills] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { fetchBills(); fetchCitizens(); }, []);

  const fetchBills = async () => { const { data } = await api.get('/bills/all').catch(() => ({ data: [] })); setBills(data); };
  const fetchCitizens = async () => { const { data } = await api.get('/citizens').catch(() => ({ data: [] })); setCitizens(data); };
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...form, 
        idNo: form.idNo ? parseInt(form.idNo) : null,
        total_amt: parseFloat(form.total_amt)
      };
      if (editing) { await api.put(`/bills/${editing}/admin`, payload); showToast('✅ Updated!'); }
      else { await api.post('/bills/admin', payload); showToast('✅ Bill created!'); }
      setForm(EMPTY); setEditing(null); setShowForm(false); fetchBills();
    } catch (err) { showToast('❌ ' + (err?.response?.data || 'Failed')); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/bills/${id}/admin`); showToast('🗑️ Deleted'); setConfirmDelete(null); fetchBills(); }
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
            <p style={{ color:'#64748b', marginBottom:'2rem' }}>Are you sure you want to delete this bill record? This action cannot be undone.</p>
            <div style={{ display:'flex', gap:'1rem', justifyContent:'center' }}>
              <button onClick={() => setConfirmDelete(null)} style={btn('grey')}>Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} style={btn('red')}>Delete Record</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#1e293b', margin:'0 0 0.3rem', fontFamily:"'Outfit',sans-serif" }}>Utility Billing</h1>
          <p style={{ color:'#64748b', margin:0 }}>Manage Property Tax, Water, and Electricity bills</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(!showForm); }} style={{ ...btn(showForm?'grey':'blue'), padding:'0.7rem 1.4rem' }}>
          {showForm ? '✕ Cancel' : '+ Create manual bill'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background:'#fff', border:'1.5px solid #e0e7ff', borderTop:'4px solid #6366f1', borderRadius:'1.25rem', padding:'1.75rem', marginBottom:'1.5rem' }}>
          <h3 style={{ margin:'0 0 1.25rem', color:'#1e293b', fontWeight:700 }}>{editing ? 'Edit Bill Record' : 'Create Manual Bill'}</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', marginBottom:'1rem' }}>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Bill Type *</label>
              <select value={form.billType} onChange={set('billType')} style={inp}>
                <option value="Property Tax">Property Tax</option>
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Consumer / Property ID *</label>
              <input required value={form.consumerNumber} onChange={set('consumerNumber')} placeholder="e.g. PROP-12345" style={inp} />
            </div>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Amount (₹) *</label>
              <input type="number" required min="0" value={form.total_amt} onChange={set('total_amt')} placeholder="1200" style={inp} />
            </div>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Due Date *</label>
              <input type="date" required value={form.dueDate} onChange={set('dueDate')} style={inp} />
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
             <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Citizen Name (For display)</label>
              <input value={form.citizenName} onChange={set('citizenName')} placeholder="e.g. John Doe" style={inp} />
            </div>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Link to Citizen Account (Optional)</label>
              <select value={form.idNo} onChange={set('idNo')} style={inp}>
                <option value="">-- None --</option>
                {citizens.map(c => <option key={c.idNo} value={c.idNo}>{c.name} ({c.email})</option>)}
              </select>
            </div>
          </div>
          <button type="submit" style={{ ...btn('blue'), padding:'0.65rem 2rem' }}>{editing ? 'Update Bill' : 'Generate Bill'}</button>
        </form>
      )}

      <div style={{ background:'#fff', borderRadius:'1rem', overflow:'hidden', boxShadow:'0 4px 16px rgba(0,0,0,0.06)' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.875rem' }}>
          <thead style={{ background:'#f8fafc' }}>
            <tr>{['ID','Type','Consumer #','Citizen','Amount','Due Date','Status','Actions'].map(h => (
              <th key={h} style={{ textAlign:'left', padding:'0.85rem 1rem', color:'#64748b', fontWeight:700, fontSize:'0.75rem', textTransform:'uppercase' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {bills.map(b => (
              <tr key={b.bill_ID} style={{ borderTop:'1px solid #f1f5f9' }}>
                <td style={{ padding:'0.85rem 1rem', color:'#6366f1', fontWeight:700 }}>#{b.bill_ID}</td>
                <td style={{ padding:'0.85rem 1rem' }}>
                   <span style={{ padding:'0.2rem 0.6rem', borderRadius:'0.4rem', fontSize:'0.75rem', fontWeight:700, background:'#eef2ff', color:'#4f46e5' }}>{b.billType}</span>
                </td>
                <td style={{ padding:'0.85rem 1rem', fontWeight:600 }}>{b.consumerNumber}</td>
                <td style={{ padding:'0.85rem 1rem' }}>{b.citizenName || b.citizen?.name || '—'}</td>
                <td style={{ padding:'0.85rem 1rem', color:'#059669', fontWeight:700 }}>₹{b.total_amt}</td>
                <td style={{ padding:'0.85rem 1rem', color:'#64748b' }}>{b.dueDate ? new Date(b.dueDate).toLocaleDateString() : '—'}</td>
                <td style={{ padding:'0.85rem 1rem' }}>
                   <span style={{ color: b.isPaid ? '#059669' : '#dc2626', fontWeight:700, fontSize:'0.75rem' }}>{b.isPaid ? '● PAID' : '○ UNPAID'}</span>
                </td>
                <td style={{ padding:'0.85rem 1rem' }}>
                   <div style={{ display:'flex', gap:'0.4rem' }}>
                     {!b.isPaid && <button onClick={() => {
                        setForm({
                            idNo: b.idNo || '',
                            citizenName: b.citizenName || '',
                            billType: b.billType || '',
                            total_amt: b.total_amt,
                            consumerNumber: b.consumerNumber || '',
                            dueDate: b.dueDate ? b.dueDate.split('T')[0] : ''
                        });
                        setEditing(b.bill_ID);
                        setShowForm(true);
                     }} style={btn('grey')}>✏️</button>}
                     <button onClick={() => setConfirmDelete(b.bill_ID)} style={btn('red')}>🗑</button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bills.length === 0 && <div style={{ textAlign:'center', padding:'3rem', color:'#94a3b8' }}>No bills found.</div>}
      </div>
    </Layout>
  );
}
