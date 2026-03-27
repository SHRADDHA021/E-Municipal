import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const inp = {
  display:'block', width:'100%', padding:'0.75rem 1rem', border:'1.5px solid #e2e8f0',
  borderRadius:'0.75rem', background:'#f8fafc', color:'#1e293b', fontSize:'0.875rem',
  fontFamily:'inherit', outline:'none', boxSizing:'border-box'
};

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', role: 'Citizen' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await login(form.email, form.password, form.role);
      if (data.role === 'Admin') navigate('/admin');
      else if (data.role === 'Employee') navigate('/employee');
      else navigate('/citizen');
    } catch (err) {
      setError(err?.response?.data || 'Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  };

  const onFocus = e => { e.target.style.borderColor='#6366f1'; e.target.style.background='#fff'; };
  const onBlur  = e => { e.target.style.borderColor='#e2e8f0'; e.target.style.background='#f8fafc'; };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)', padding:'1.5rem', fontFamily:"'Inter',sans-serif" }}>
      <div style={{ background:'rgba(255,255,255,0.95)', backdropFilter:'blur(20px)', borderRadius:'1.5rem', padding:'2.5rem', width:'100%', maxWidth:'420px', boxShadow:'0 25px 60px rgba(0,0,0,0.35)' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontSize:'3rem', marginBottom:'0.5rem' }}>🏛️</div>
          <h1 style={{ fontSize:'1.75rem', fontWeight:800, color:'#1e293b', margin:0, fontFamily:"'Outfit',sans-serif" }}>E-Municipal Portal</h1>
          <p style={{ color:'#64748b', marginTop:'0.4rem', fontSize:'0.875rem' }}>Sign in to your account</p>
        </div>

        {error && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', borderRadius:'0.75rem', padding:'0.75rem 1rem', marginBottom:'1rem', fontSize:'0.875rem', fontWeight:500 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:'1rem' }}>
            <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Role</label>
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} style={{ ...inp, cursor:'pointer' }} onFocus={onFocus} onBlur={onBlur}>
              <option value="Citizen">👤 Citizen</option>
              <option value="Admin">🔑 Admin (Department)</option>
              <option value="Employee">👷 Employee</option>
            </select>
          </div>

          <div style={{ marginBottom:'1rem' }}>
            <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" style={inp} onFocus={onFocus} onBlur={onBlur} />
          </div>

          <div style={{ marginBottom:'1.5rem' }}>
            <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Password</label>
            <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" style={inp} onFocus={onFocus} onBlur={onBlur} />
          </div>

          <button type="submit" disabled={loading} style={{ width:'100%', padding:'0.85rem', borderRadius:'0.75rem', border:'none', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? '#a5b4fc' : 'linear-gradient(135deg,#6366f1,#4f46e5)', color:'#fff', fontWeight:700, fontSize:'0.95rem', fontFamily:'inherit', boxShadow:'0 4px 14px rgba(99,102,241,0.4)' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.5rem', color:'#64748b', fontSize:'0.875rem' }}>
          New citizen? <Link to="/register" style={{ color:'#6366f1', fontWeight:600, textDecoration:'none' }}>Create account</Link>
        </p>
      </div>
    </div>
  );
}
