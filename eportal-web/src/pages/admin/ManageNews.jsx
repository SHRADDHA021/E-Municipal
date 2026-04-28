import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const inp = { display:'block', width:'100%', padding:'0.65rem 0.9rem', border:'1.5px solid #e2e8f0', borderRadius:'0.6rem', background:'#f8fafc', color:'#1e293b', fontSize:'0.875rem', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const btn = (col) => ({ padding:'0.5rem 1.1rem', borderRadius:'0.6rem', border:'none', cursor:'pointer', fontWeight:800, fontSize:'0.85rem', background: col === 'red' ? '#ef4444' : col === 'blue' ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : '#f1f5f9', color: col === 'red' || col === 'blue' ? '#fff' : '#475569', transition:'all 0.2s', boxShadow: col==='red'?'0 2px 8px rgba(239,68,68,0.3)':'none' });

const EMPTY = { Title: '', IsActive: true };

export default function ManageNews() {
  const [newsList, setNewsList] = useState([]);
  const [form, setForm]         = useState(EMPTY);
  const [editing, setEditing]   = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast]       = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { fetchNews(); }, []);

  const fetchNews = async () => {
    const { data } = await api.get('/news/all').catch(() => ({ data: [] }));
    setNewsList(data);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.Title.trim()) return showToast('❌ Title is required');
    try {
      const payload = { Title: form.Title.trim(), Emoji: null, IsActive: form.IsActive };
      if (editing) {
        await api.put(`/news/${editing}`, payload);
        showToast('✅ News updated!');
      } else {
        await api.post('/news', payload);
        showToast('✅ News added!');
      }
      setForm(EMPTY); setEditing(null); setShowForm(false); fetchNews();
    } catch (err) {
      showToast('❌ ' + (err?.response?.data || 'Failed'));
    }
  };

  const handleEdit = (n) => {
    setForm({ Title: n.title, IsActive: n.isActive });
    setEditing(n.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/news/${id}`);
      showToast('🗑️ News deleted');
      setConfirmDelete(null);
      fetchNews();
    } catch { showToast('❌ Delete failed'); }
  };

  const handleToggleActive = async (n) => {
    try {
      await api.put(`/news/${n.id}`, { Title: n.title, Emoji: n.emoji || null, IsActive: !n.isActive }); // keep existing emoji on toggle
      showToast(n.isActive ? '⏸️ News hidden from ticker' : '▶️ News shown on ticker');
      fetchNews();
    } catch { showToast('❌ Failed to update'); }
  };

  return (
    <Layout>
      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:'2rem', right:'2rem', background:'#1e293b', color:'#fff', padding:'0.9rem 1.5rem', borderRadius:'0.75rem', boxShadow:'0 10px 25px rgba(0,0,0,0.2)', zIndex:9999, fontWeight:600 }}>
          {toast}
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(15,23,42,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1100 }}>
          <div style={{ background:'#fff', padding:'2rem', borderRadius:'1.25rem', width:'100%', maxWidth:'400px', textAlign:'center', boxShadow:'0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🗑️</div>
            <h2 style={{ margin:'0 0 1rem', fontSize:'1.25rem', fontWeight:800, color:'#1e293b' }}>Delete News Item?</h2>
            <p style={{ color:'#64748b', marginBottom:'2rem' }}>This news item will be permanently removed from the home page ticker.</p>
            <div style={{ display:'flex', gap:'1rem', justifyContent:'center' }}>
              <button onClick={() => setConfirmDelete(null)} style={btn('grey')}>Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} style={btn('red')}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#1e293b', margin:'0 0 0.3rem', fontFamily:"'Outfit',sans-serif" }}>
            📰 Manage Live News
          </h1>
          <p style={{ color:'#64748b', margin:0 }}>
            News items shown in the <b>🔴 LIVE NEWS</b> ticker on the home page. Only <b>active</b> items appear.
          </p>
        </div>
        <button
          onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(!showForm); }}
          style={{ ...btn(showForm ? 'grey' : 'blue'), padding:'0.7rem 1.4rem' }}
        >
          {showForm ? '✕ Cancel' : '+ Add News'}
        </button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ background:'#fff', border:'1.5px solid #e0e7ff', borderTop:'4px solid #6366f1', borderRadius:'1.25rem', padding:'1.75rem', marginBottom:'1.5rem' }}>
          <h3 style={{ margin:'0 0 1.25rem', color:'#1e293b', fontWeight:700 }}>
            {editing ? '✏️ Edit News Item' : '➕ New News Item'}
          </h3>

          <div style={{ marginBottom:'1rem' }}>
            <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>
              News Title *
            </label>
            <input
              required
              value={form.Title}
              onChange={set('Title')}
              placeholder="e.g. Property Tax deadline extended to 31 May 2026"
              style={inp}
            />
          </div>

          {/* Active toggle */}
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.25rem' }}>
            <input
              type="checkbox"
              id="news-active"
              checked={form.IsActive}
              onChange={e => setForm({ ...form, IsActive: e.target.checked })}
              style={{ width:'1.1rem', height:'1.1rem', cursor:'pointer', accentColor:'#6366f1' }}
            />
            <label htmlFor="news-active" style={{ fontWeight:600, color:'#374151', fontSize:'0.875rem', cursor:'pointer' }}>
              Show on home page ticker (Active)
            </label>
          </div>

          {/* Preview */}
          {form.Title && (
            <div style={{ background:'linear-gradient(90deg,#1e3a5f,#0f2744)', color:'#fff', padding:'0.6rem 1rem', borderRadius:'0.5rem', fontSize:'0.9rem', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <span style={{ background:'#dc2626', color:'#fff', borderRadius:'0.25rem', padding:'0.1rem 0.4rem', fontSize:'0.7rem', fontWeight:800, letterSpacing:'0.05em' }}>🔴 LIVE</span>
              <span>{form.Title}</span>
            </div>
          )}

          <button type="submit" style={{ ...btn('blue'), padding:'0.65rem 2rem' }}>
            {editing ? '💾 Update News' : '➕ Add News'}
          </button>
        </form>
      )}

      {/* News list table */}
      <div style={{ background:'#fff', borderRadius:'1.25rem', boxShadow:'0 4px 16px rgba(0,0,0,0.06)', overflow:'hidden' }}>
        <div style={{ padding:'1.25rem 1.5rem', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <span style={{ fontWeight:700, color:'#1e293b', fontSize:'1rem' }}>📋 All News Items</span>
          <span style={{ background:'#eef2ff', color:'#6366f1', borderRadius:'999px', padding:'0.1rem 0.6rem', fontSize:'0.75rem', fontWeight:700 }}>
            {newsList.length} total
          </span>
          <span style={{ background:'#d1fae5', color:'#065f46', borderRadius:'999px', padding:'0.1rem 0.6rem', fontSize:'0.75rem', fontWeight:700 }}>
            {newsList.filter(n => n.isActive).length} active
          </span>
        </div>

        {newsList.length === 0 ? (
          <div style={{ textAlign:'center', padding:'3rem', color:'#94a3b8' }}>
            No news items yet. Click <b>"+ Add News"</b> to create the first one.
          </div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#f8fafc' }}>
                <th style={{ padding:'0.75rem 1.5rem', textAlign:'left', fontSize:'0.75rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em' }}>#</th>
                <th style={{ padding:'0.75rem 1rem', textAlign:'left', fontSize:'0.75rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em' }}>News</th>
                <th style={{ padding:'0.75rem 1rem', textAlign:'center', fontSize:'0.75rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em' }}>Status</th>
                <th style={{ padding:'0.75rem 1rem', textAlign:'left', fontSize:'0.75rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em' }}>Created</th>
                <th style={{ padding:'0.75rem 1.5rem', textAlign:'right', fontSize:'0.75rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {newsList.map((n, idx) => (
                <tr key={n.id} style={{ borderTop:'1px solid #f1f5f9', transition:'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background=''}
                >
                  <td style={{ padding:'1rem 1.5rem', color:'#94a3b8', fontSize:'0.85rem', fontWeight:600 }}>{idx + 1}</td>
                  <td style={{ padding:'1rem', maxWidth:'480px' }}>
                    <span style={{ color:'#1e293b', fontWeight:600, fontSize:'0.9rem', lineHeight:1.4 }}>{n.title}</span>
                  </td>
                  <td style={{ padding:'1rem', textAlign:'center' }}>
                    <button
                      onClick={() => handleToggleActive(n)}
                      title={n.isActive ? 'Click to hide from ticker' : 'Click to show on ticker'}
                      style={{ background: n.isActive ? '#d1fae5' : '#fee2e2', color: n.isActive ? '#065f46' : '#991b1b', border:'none', borderRadius:'999px', padding:'0.25rem 0.75rem', fontSize:'0.75rem', fontWeight:700, cursor:'pointer' }}
                    >
                      {n.isActive ? '✅ Active' : '⏸️ Hidden'}
                    </button>
                  </td>
                  <td style={{ padding:'1rem', color:'#64748b', fontSize:'0.8rem' }}>
                    {new Date(n.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                  </td>
                  <td style={{ padding:'1rem 1.5rem', textAlign:'right' }}>
                    <div style={{ display:'flex', gap:'0.5rem', justifyContent:'flex-end' }}>
                      <button onClick={() => handleEdit(n)} style={{ ...btn('grey'), padding:'0.4rem 0.8rem' }}>✏️ Edit</button>
                      <button onClick={() => setConfirmDelete(n.id)} style={{ ...btn('red'), padding:'0.4rem 0.8rem' }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
