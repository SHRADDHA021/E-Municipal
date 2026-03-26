import { useState, useEffect } from 'react';
import api from '../../api/axios';

const ManageSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [form, setForm]           = useState({ type: 'Garbage', area: '', time: '' });
  const [showForm, setShowForm]   = useState(false);

  useEffect(() => { fetchSchedules(); }, []);

  const fetchSchedules = async () => {
    try { const { data } = await api.get('/schedules'); setSchedules(data); }
    catch { /* backend offline */ }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/schedules', form);
      setForm({ type: 'Garbage', area: '', time: '' });
      setShowForm(false);
      fetchSchedules();
    } catch { alert('Failed – check backend.'); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/schedules/${id}`); fetchSchedules(); }
    catch { alert('Delete failed – check backend.'); }
  };

  const inputStyle = { display: 'block', width: '100%', padding: '0.7rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '0.75rem', background: '#f8fafc', color: '#1e293b', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };

  const gar = schedules.filter(s => s.type === 'Garbage');
  const wat = schedules.filter(s => s.type === 'Water');

  return (
    <div style={{ fontFamily: "'Inter',sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.4rem', fontFamily: "'Outfit',sans-serif" }}>Manage Schedules</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Add and delete garbage & water supply schedules by area.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.7rem 1.4rem', borderRadius: '0.75rem', background: showForm ? '#f1f5f9' : 'linear-gradient(135deg,#6366f1,#4f46e5)', color: showForm ? '#475569' : '#fff', border: showForm ? '1.5px solid #e2e8f0' : 'none', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit', boxShadow: showForm ? 'none' : '0 4px 14px rgba(99,102,241,0.4)' }}>
          {showForm ? '✕ Cancel' : '+ Add Schedule'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ background: '#fff', border: '1.5px solid #e0e7ff', borderTop: '4px solid #6366f1', borderRadius: '1.25rem', padding: '1.75rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 2fr 2fr auto', gap: '1rem', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="Garbage">🗑️ Garbage</option>
              <option value="Water">💧 Water</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Area</label>
            <input type="text" required value={form.area} onChange={e => setForm({...form, area: e.target.value})} placeholder="e.g. Sector 14, West Zone" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Time</label>
            <input type="text" required value={form.time} onChange={e => setForm({...form, time: e.target.value})} placeholder="e.g. Mon/Wed/Fri 7:00 AM" style={inputStyle} />
          </div>
          <button type="submit" style={{ padding: '0.7rem 1.25rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            Add
          </button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {[{ label: '🗑️ Garbage Collection', items: gar, color: '#fef3c7', type: 'Garbage' }, { label: '💧 Water Supply', items: wat, color: '#dbeafe', type: 'Water' }].map(cat => (
          <div key={cat.type} style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
            <div style={{ background: cat.color, padding: '1.1rem 1.5rem', fontWeight: 700, color: '#1e293b', fontSize: '1rem', fontFamily: "'Outfit',sans-serif" }}>{cat.label} ({cat.items.length})</div>
            {cat.items.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>No schedules yet</div>
            ) : (
              cat.items.map((s, i) => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1.25rem', borderBottom: i < cat.items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>📍 {s.area}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '0.2rem' }}>🕐 {s.time}</div>
                  </div>
                  <button onClick={() => handleDelete(s.id)} style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                    🗑 Delete
                  </button>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSchedules;
