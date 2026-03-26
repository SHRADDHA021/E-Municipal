import { useState, useEffect } from 'react';
import api from '../../api/axios';

const CitizenSchedules = () => {
  const [garbage, setGarbage] = useState([]);
  const [water,   setWater]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/schedules?type=Garbage').catch(() => ({ data: [] })),
      api.get('/schedules?type=Water').catch(()   => ({ data: [] })),
    ]).then(([g, w]) => { setGarbage(g.data); setWater(w.data); })
      .finally(() => setLoading(false));
  }, []);

  const ScheduleTable = ({ items, type, color }) => (
    <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
      <div style={{ background: color.header, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <span style={{ fontSize: '1.4rem' }}>{type === 'Garbage' ? '🗑️' : '💧'}</span>
        <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', fontFamily: "'Outfit',sans-serif" }}>
          {type} Collection Schedule
        </h2>
      </div>
      {items.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{type === 'Garbage' ? '🗑️' : '💧'}</div>
          <p style={{ fontWeight: 600 }}>No schedule available yet</p>
          <p style={{ fontSize: '0.8rem' }}>Admin will add schedules soon</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <th style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Area</th>
              <th style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i < items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <td style={{ padding: '1rem 1.25rem', color: '#1e293b', fontWeight: 600 }}>📍 {s.area}</td>
                <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontWeight: 500 }}>🕐 {s.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter',sans-serif" }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.4rem', fontFamily: "'Outfit',sans-serif" }}>Municipal Schedules</h1>
        <p style={{ color: '#64748b', margin: 0 }}>View garbage collection and water supply timings for your area.</p>
      </div>
      {loading ? <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading schedules...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <ScheduleTable items={garbage} type="Garbage" color={{ header: '#fef3c7' }} />
          <ScheduleTable items={water}   type="Water"   color={{ header: '#dbeafe' }} />
        </div>
      )}
    </div>
  );
};

export default CitizenSchedules;
