import { useState, useEffect } from 'react';
import api from '../../api/axios';

const ManageEmployees = () => {
  const [departments, setDepartments] = useState([]);
  const [employees,   setEmployees]   = useState([]);
  const [deptForm,    setDeptForm]    = useState('');
  const [empForm,     setEmpForm]     = useState({ name: '', departmentId: '' });
  const [showDept,    setShowDept]    = useState(false);
  const [showEmp,     setShowEmp]     = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [dRes, eRes] = await Promise.all([
        api.get('/departments').catch(() => ({ data: [] })),
        api.get('/employees').catch(()   => ({ data: [] })),
      ]);
      setDepartments(dRes.data);
      setEmployees(eRes.data);
    } catch {}
  };

  const handleAddDept = async (e) => {
    e.preventDefault();
    try { await api.post('/departments', { name: deptForm }); setDeptForm(''); setShowDept(false); fetchAll(); }
    catch { alert('Failed – check backend. /api/departments endpoint needed.'); }
  };

  const handleAddEmp = async (e) => {
    e.preventDefault();
    try { await api.post('/employees', { name: empForm.name, departmentId: parseInt(empForm.departmentId) }); setEmpForm({ name: '', departmentId: '' }); setShowEmp(false); fetchAll(); }
    catch { alert('Failed – check backend. /api/employees endpoint needed.'); }
  };

  const inputStyle = { display: 'block', width: '100%', padding: '0.7rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '0.75rem', background: '#f8fafc', color: '#1e293b', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ fontFamily: "'Inter',sans-serif" }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.4rem', fontFamily: "'Outfit',sans-serif" }}>Employees & Departments</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Manage municipal staff and department assignments.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* Departments */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Departments</h2>
            <button onClick={() => setShowDept(!showDept)} style={{ padding: '0.35rem 0.9rem', borderRadius: '0.6rem', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>+ Add</button>
          </div>
          {showDept && (
            <form onSubmit={handleAddDept} style={{ background: '#fff', border: '1px solid #e0e7ff', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
              <input type="text" required placeholder="Department name" value={deptForm} onChange={e => setDeptForm(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '0.6rem', background: '#6366f1', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Add</button>
            </form>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {departments.map(d => (
              <div key={d.id} style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0', borderRadius: '0.9rem', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '0.625rem', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🏢</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{d.name}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{employees.filter(e => e.departmentId === d.id).length} staff members</div>
                </div>
              </div>
            ))}
            {departments.length === 0 && <div style={{ color: '#94a3b8', padding: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.7)', border: '2px dashed #e2e8f0', borderRadius: '0.9rem', fontSize: '0.85rem' }}>No departments yet</div>}
          </div>
        </div>

        {/* Employees */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Employees</h2>
            <button onClick={() => setShowEmp(!showEmp)} style={{ padding: '0.35rem 0.9rem', borderRadius: '0.6rem', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>+ Add Employee</button>
          </div>
          {showEmp && (
            <form onSubmit={handleAddEmp} style={{ background: '#fff', border: '1px solid #e0e7ff', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 2, minWidth: '160px' }}>
                <input type="text" required placeholder="Employee full name" value={empForm.name} onChange={e => setEmpForm({...empForm, name: e.target.value})} style={inputStyle} />
              </div>
              <div style={{ flex: 1, minWidth: '140px' }}>
                <select required value={empForm.departmentId} onChange={e => setEmpForm({...empForm, departmentId: e.target.value})} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="" disabled>Select dept</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <button type="submit" style={{ padding: '0.7rem 1.25rem', borderRadius: '0.75rem', background: '#6366f1', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Add</button>
            </form>
          )}
          <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
            {employees.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
                <p style={{ fontWeight: 600 }}>No employees yet</p>
                <p>Add departments first, then add employees</p>
              </div>
            ) : employees.map((emp, i) => (
              <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '1rem 1.25rem', borderBottom: i < employees.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#818cf8,#c4b5fd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1e1b4b', fontSize: '0.9rem', flexShrink: 0 }}>
                  {emp.name?.charAt(0)?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{emp.name}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{departments.find(d => d.id === emp.departmentId)?.name || `Dept #${emp.departmentId}`}</div>
                </div>
                <span style={{ background: '#eef2ff', color: '#6366f1', borderRadius: '999px', padding: '0.2rem 0.65rem', fontSize: '0.72rem', fontWeight: 700 }}>Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageEmployees;
