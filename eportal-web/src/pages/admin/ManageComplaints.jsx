import { useState, useEffect } from 'react';
import api from '../../api/axios';

const mockEmployees = [
  { id: 1, name: 'Ramesh Kumar – Sanitation' },
  { id: 2, name: 'Priya Sharma – Water Dept' },
  { id: 3, name: 'Ajay Mehta – Roads & Infra' },
];

const badge = (status) => {
  const styles = {
    Completed:   { background:'#d1fae5', color:'#065f46', border:'1px solid #a7f3d0' },
    'In Progress':{ background:'#dbeafe', color:'#1e40af', border:'1px solid #bfdbfe' },
    Pending:     { background:'#fef3c7', color:'#92400e', border:'1px solid #fde68a' },
  };
  const s = styles[status] || styles.Pending;
  return <span style={{ ...s, borderRadius:'999px', padding:'0.2rem 0.65rem', fontSize:'0.72rem', fontWeight:800 }}>{status}</span>;
};

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [proofFiles, setProofFiles] = useState({});   // complaintId => File

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    try { const { data } = await api.get('/complaints'); setComplaints(data); }
    catch { /* backend offline - no data shown */ }
  };

  const handleAssign = async (id, empId) => {
    try { await api.put(`/complaints/${id}/assign`, { employeeId: parseInt(empId) }); fetchComplaints(); }
    catch { alert('Assign failed – start backend first.'); }
  };

  const handleStatus = async (id, status) => {
    try {
      const fd = new FormData();
      fd.append('Status', status);
      if (status === 'Completed' && proofFiles[id]) fd.append('ProofImage', proofFiles[id]);
      await api.put(`/complaints/${id}/status`, fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      setProofFiles(prev => { const n = {...prev}; delete n[id]; return n; });
      fetchComplaints();
    } catch { alert('Status update failed – start backend first.'); }
  };

  return (
    <div style={{ fontFamily:"'Inter',sans-serif" }}>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#1e293b', margin:'0 0 0.4rem', fontFamily:"'Outfit',sans-serif" }}>Manage Complaints</h1>
        <p style={{ color:'#64748b', margin:0 }}>Assign staff and resolve citizen-reported issues.</p>
      </div>

      <div style={{ background:'rgba(255,255,255,0.9)', border:'1px solid #e2e8f0', borderRadius:'1.25rem', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.875rem' }}>
            <thead>
              <tr style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
                {['Issue Details', 'Status', 'Assign To', 'Actions'].map(h => (
                  <th key={h} style={{ padding:'1rem 1.25rem', textAlign:'left', fontWeight:700, color:'#64748b', fontSize:'0.72rem', textTransform:'uppercase', letterSpacing:'0.07em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c.id} style={{ borderBottom:'1px solid #f1f5f9' }}
                  onMouseEnter={e => e.currentTarget.style.background='#fafafa'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}
                >
                  <td style={{ padding:'1.25rem', verticalAlign:'middle' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.85rem' }}>
                      <div style={{ width:'40px', height:'40px', borderRadius:'0.75rem', background:'linear-gradient(135deg,#e0e7ff,#c7d2fe)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'0.75rem', color:'#6366f1', flexShrink:0 }}>#{c.id}</div>
                      <div>
                        <div style={{ fontWeight:700, color:'#1e293b', marginBottom:'0.15rem', fontFamily:"'Outfit',sans-serif" }}>{c.title}</div>
                        <div style={{ fontSize:'0.74rem', color:'#94a3b8', fontWeight:500 }}>Citizen ID: {c.userId}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'1.25rem', verticalAlign:'middle' }}>{badge(c.status)}</td>
                  <td style={{ padding:'1.25rem', verticalAlign:'middle' }}>
                    <select
                      disabled={c.status === 'Completed'}
                      value={c.assignedEmployeeId || ''}
                      onChange={e => handleAssign(c.id, e.target.value)}
                      style={{ padding:'0.5rem 0.75rem', borderRadius:'0.6rem', border:'1.5px solid #e2e8f0', background:'#f8fafc', color:'#1e293b', fontSize:'0.8rem', fontFamily:'inherit', cursor:'pointer', width:'190px' }}
                    >
                      <option value="" disabled>Unassigned</option>
                      {mockEmployees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                  </td>
                  <td style={{ padding:'1.25rem', verticalAlign:'middle' }}>
                    {c.status !== 'Completed' ? (
                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap' }}>
                        <button onClick={() => handleStatus(c.id, 'In Progress')} style={{ padding:'0.45rem 0.9rem', borderRadius:'0.6rem', background:'#dbeafe', color:'#1e40af', border:'1px solid #bfdbfe', fontWeight:700, fontSize:'0.75rem', cursor:'pointer', fontFamily:'inherit' }}>
                          ▶ Activate
                        </button>
                        <label style={{ padding:'0.45rem 0.9rem', borderRadius:'0.6rem', background:'#f0fdf4', color:'#065f46', border:'1px solid #a7f3d0', fontWeight:700, fontSize:'0.75rem', cursor:'pointer', whiteSpace:'nowrap' }}>
                          📎 {proofFiles[c.id] ? '✓ Ready' : 'Proof'}
                          <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => setProofFiles(p => ({...p, [c.id]: e.target.files[0]}))} />
                        </label>
                        <button onClick={() => handleStatus(c.id, 'Completed')} style={{ padding:'0.45rem 0.9rem', borderRadius:'0.6rem', background:'linear-gradient(135deg,#059669,#047857)', color:'#fff', border:'none', fontWeight:700, fontSize:'0.75rem', cursor:'pointer', fontFamily:'inherit', boxShadow:'0 2px 8px rgba(5,150,105,0.35)' }}>
                          ✓ Resolve
                        </button>
                        {c.imageUrl && (
                          <a href={`http://localhost:5000${c.imageUrl}`} target="_blank" rel="noreferrer"
                            style={{ padding:'0.45rem 0.9rem', borderRadius:'0.6rem', background:'#f1f5f9', color:'#64748b', border:'1px solid #e2e8f0', fontWeight:600, fontSize:'0.75rem', textDecoration:'none' }}>
                            🖼 Evidence
                          </a>
                        )}
                      </div>
                    ) : (
                      <span style={{ color:'#94a3b8', fontSize:'0.8rem', fontWeight:500 }}>✓ Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign:'center', padding:'4rem', color:'#94a3b8' }}>
                    <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>✅</div>
                    <div style={{ fontWeight:600, fontFamily:"'Outfit',sans-serif" }}>No complaints to manage</div>
                    <div style={{ fontSize:'0.8rem', marginTop:'0.25rem' }}>Start the backend and register complaints as a citizen</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageComplaints;
