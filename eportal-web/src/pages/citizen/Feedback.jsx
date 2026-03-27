import { useEffect, useState, useContext } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { AuthContext } from '../../contexts/AuthContext';

export default function CitizenFeedback() {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({ CID: '', Subject: '', Message: '', Rating: 5, IsCompleted: false, WorkDoneDescription: '' });
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    // Fetch all complaints, filter for 'Completed' AND owned by current user for the FORM
    api.get('/complaints').then(r => {
      const myCompleted = r.data.filter(c => c.c_status === 'Completed' && c.idNo === user?.userId);
      setComplaints(myCompleted);
    }).catch(() => {});
    
    // Fetch ALL feedbacks for the community view
    api.get('/feedbacks').then(r => setFeedbacks(r.data)).catch(() => {});
  }, [user]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/feedbacks', { ...form, CID: form.CID ? parseInt(form.CID) : null, Rating: parseInt(form.Rating) });
      showToast('✅ Feedback submitted!');
      setShowForm(false);
      setForm({ CID: '', Subject: '', Message: '', Rating: 5, IsCompleted: false, WorkDoneDescription: '' });
      api.get('/feedbacks').then(r => setFeedbacks(r.data)).catch(() => {});
    } catch { showToast('❌ Failed to submit feedback'); }
  };

  const stars = (n) => Array.from({ length: 5 }, (_, i) => i < n ? '⭐' : '☆').join('');

  return (
    <Layout>
      {toast && <div style={{ position:'fixed', top:'2rem', right:'2rem', background:'#1e293b', color:'#fff', padding:'0.9rem 1.5rem', borderRadius:'0.75rem', boxShadow:'0 10px 25px rgba(0,0,0,0.2)', zIndex:9999, fontWeight:600 }}>{toast}</div>}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#1e293b', margin:'0 0 0.3rem', fontFamily:"'Outfit',sans-serif" }}>Feedback</h1>
          <p style={{ color:'#64748b', margin:0 }}>Give feedback on resolved complaints</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding:'0.7rem 1.4rem', borderRadius:'0.75rem', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'#fff', border:'none', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
          {showForm ? '✕ Cancel' : '+ Give Feedback'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background:'#fff', border:'1.5px solid #e0e7ff', borderTop:'4px solid #6366f1', borderRadius:'1.25rem', padding:'1.75rem', marginBottom:'1.5rem' }}>
          <h3 style={{ margin:'0 0 1.25rem', fontWeight:700, color:'#1e293b' }}>Submit Feedback</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Complaint (optional)</label>
              <select value={form.CID} onChange={e => setForm({...form, CID: e.target.value})} style={{ width:'100%', padding:'0.65rem', border:'1.5px solid #e2e8f0', borderRadius:'0.6rem', background:'#f8fafc', fontSize:'0.875rem', fontFamily:'inherit' }}>
                <option value="">-- General Feedback --</option>
                {complaints.map(c => <option key={c.cid} value={c.cid}>#{c.cid} — {c.title}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Rating</label>
              <select value={form.Rating} onChange={e => setForm({...form, Rating: e.target.value})} style={{ width:'100%', padding:'0.65rem', border:'1.5px solid #e2e8f0', borderRadius:'0.6rem', background:'#f8fafc', fontSize:'0.875rem', fontFamily:'inherit' }}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{stars(n)} ({n}/5)</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom:'0.75rem' }}>
            <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Subject</label>
            <input value={form.Subject} onChange={e => setForm({...form, Subject: e.target.value})} placeholder="e.g. Road repair done" style={{ display:'block', width:'100%', padding:'0.65rem 0.9rem', border:'1.5px solid #e2e8f0', borderRadius:'0.6rem', background:'#f8fafc', fontSize:'0.875rem', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }} />
          </div>
          <div style={{ marginBottom:'0.75rem' }}>
            <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Message</label>
            <textarea rows={3} value={form.Message} onChange={e => setForm({...form, Message: e.target.value})} placeholder="Share your experience..." style={{ display:'block', width:'100%', padding:'0.65rem 0.9rem', border:'1.5px solid #e2e8f0', borderRadius:'0.6rem', background:'#f8fafc', fontSize:'0.875rem', fontFamily:'inherit', outline:'none', boxSizing:'border-box', resize:'vertical' }} />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.75rem' }}>
            <input type="checkbox" id="isCompleted" checked={form.IsCompleted} onChange={e => setForm({...form, IsCompleted: e.target.checked})} />
            <label htmlFor="isCompleted" style={{ fontWeight:600, color:'#374151', fontSize:'0.875rem' }}>Work was completed satisfactorily</label>
          </div>
          {form.IsCompleted && (
            <div style={{ marginBottom:'0.75rem' }}>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Describe the work done</label>
              <input value={form.WorkDoneDescription} onChange={e => setForm({...form, WorkDoneDescription: e.target.value})} placeholder="What work was completed?" style={{ display:'block', width:'100%', padding:'0.65rem 0.9rem', border:'1.5px solid #e2e8f0', borderRadius:'0.6rem', background:'#f8fafc', fontSize:'0.875rem', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }} />
            </div>
          )}
          <button type="submit" style={{ padding:'0.7rem 2rem', borderRadius:'0.75rem', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'#fff', border:'none', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>Submit Feedback</button>
        </form>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        {feedbacks.map(f => (
          <div key={f.fID} style={{ background:'#fff', borderRadius:'1rem', padding:'1.25rem 1.5rem', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ fontWeight:700, color:'#1e293b', marginBottom:'0.2rem' }}>{f.subject || 'General Feedback'}</div>
                <div style={{ color:'#f59e0b', fontSize:'1.1rem', marginBottom:'0.3rem' }}>{stars(f.rating)}</div>
                {f.message && <div style={{ color:'#64748b', fontSize:'0.875rem' }}>{f.message}</div>}
                {f.complaint && <div style={{ color:'#94a3b8', fontSize:'0.78rem', marginTop:'0.3rem' }}>Re: #{f.complaint.cid} — {f.complaint.title}</div>}
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.3rem' }}>
                <span style={{ fontSize:'0.75rem', color:'#94a3b8' }}>{new Date(f.createdAt).toLocaleDateString()}</span>
                {f.isCompleted && <span style={{ background:'#d1fae5', color:'#065f46', borderRadius:'999px', padding:'0.15rem 0.5rem', fontSize:'0.7rem', fontWeight:700 }}>✅ Completed</span>}
              </div>
            </div>
          </div>
        ))}
        {feedbacks.length === 0 && <div style={{ textAlign:'center', padding:'4rem', color:'#94a3b8', background:'#fff', borderRadius:'1rem' }}>No feedback given yet</div>}
      </div>
    </Layout>
  );
}
