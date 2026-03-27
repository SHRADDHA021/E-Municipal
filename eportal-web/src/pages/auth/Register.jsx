import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const inp = {
  display:'block', width:'100%', padding:'0.75rem 1rem', border:'1.5px solid #e2e8f0',
  borderRadius:'0.75rem', background:'#f8fafc', color:'#1e293b', fontSize:'0.875rem',
  fontFamily:'inherit', outline:'none', boxSizing:'border-box'
};

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', phno:'', gender:'', bday:'', house_no:'', street_no_name:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const onFocus = e => { e.target.style.borderColor='#6366f1'; e.target.style.background='#fff'; };
  const onBlur  = e => { e.target.style.borderColor='#e2e8f0'; e.target.style.background='#f8fafc'; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register({ name: form.name, email: form.email, password: form.password, phno: form.phno, gender: form.gender, bday: form.bday, house_no: form.house_no, street_no_name: form.street_no_name });
      navigate('/login');
    } catch (err) {
      setError(err?.response?.data || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)', padding:'1.5rem', fontFamily:"'Inter',sans-serif" }}>
      <div style={{ background:'rgba(255,255,255,0.95)', backdropFilter:'blur(20px)', borderRadius:'1.5rem', padding:'2.5rem', width:'100%', maxWidth:'500px', boxShadow:'0 25px 60px rgba(0,0,0,0.35)' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontSize:'3rem', marginBottom:'0.5rem' }}>🏛️</div>
          <h1 style={{ fontSize:'1.75rem', fontWeight:800, color:'#1e293b', margin:0, fontFamily:"'Outfit',sans-serif" }}>Citizen Registration</h1>
          <p style={{ color:'#64748b', marginTop:'0.4rem', fontSize:'0.875rem' }}>Create your E-Municipal Portal account</p>
        </div>

        {error && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', borderRadius:'0.75rem', padding:'0.75rem 1rem', marginBottom:'1rem', fontSize:'0.875rem', fontWeight:500 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Full Name *</label>
              <input type="text" required value={form.name} onChange={set('name')} placeholder="John Doe" style={inp} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Phone</label>
              <input type="text" value={form.phno} onChange={set('phno')} placeholder="+91 9999900000" style={inp} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Gender</label>
              <select value={form.gender} onChange={set('gender')} style={{ ...inp, cursor:'pointer' }} onFocus={onFocus} onBlur={onBlur}>
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Date of Birth</label>
              <input type="date" value={form.bday} onChange={set('bday')} style={inp} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>House No</label>
              <input type="text" value={form.house_no} onChange={set('house_no')} placeholder="A-12" style={inp} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Street</label>
              <input type="text" value={form.street_no_name} onChange={set('street_no_name')} placeholder="MG Road" style={inp} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>

          <div style={{ marginBottom:'0.75rem' }}>
            <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Email *</label>
            <input type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" style={inp} onFocus={onFocus} onBlur={onBlur} />
          </div>

          <div style={{ marginBottom:'1.5rem' }}>
            <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Password *</label>
            <input type="password" required value={form.password} onChange={set('password')} placeholder="Min 6 characters" style={inp} onFocus={onFocus} onBlur={onBlur} />
          </div>

          <button type="submit" disabled={loading} style={{ width:'100%', padding:'0.85rem', borderRadius:'0.75rem', border:'none', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? '#a5b4fc' : 'linear-gradient(135deg,#6366f1,#4f46e5)', color:'#fff', fontWeight:700, fontSize:'0.95rem', fontFamily:'inherit' }}>
            {loading ? 'Creating account...' : 'Register as Citizen'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.5rem', color:'#64748b', fontSize:'0.875rem' }}>
          Already registered? <Link to="/login" style={{ color:'#6366f1', fontWeight:600, textDecoration:'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
