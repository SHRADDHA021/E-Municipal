import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name:'', email:'', phone:'', password:'', role:'Citizen' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { register }          = useContext(AuthContext);
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.phone, formData.password, formData.role);
      navigate('/login');
    } catch {
      setError('Registration failed. This email might already exist.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    display:'block', width:'100%', padding:'0.75rem 1rem',
    border:'1.5px solid #e2e8f0', borderRadius:'0.75rem',
    background:'#f8fafc', color:'#1e293b', fontSize:'0.875rem',
    fontFamily:'inherit', outline:'none', boxSizing:'border-box'
  };

  const handleFocus = e => { e.target.style.borderColor='#6366f1'; e.target.style.background='#fff'; };
  const handleBlur  = e => { e.target.style.borderColor='#e2e8f0'; e.target.style.background='#f8fafc'; };

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg,#e0e7ff 0%,#c7d2fe 50%,#e0f2fe 100%)',
      padding:'1.5rem', fontFamily:"'Inter',sans-serif"
    }}>
      <div style={{
        background:'rgba(255,255,255,0.9)', backdropFilter:'blur(20px)',
        border:'1px solid rgba(255,255,255,0.6)',
        boxShadow:'0 20px 60px rgba(0,0,0,0.12)',
        borderRadius:'1.5rem', padding:'2.5rem', width:'100%', maxWidth:'440px',
      }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            width:'56px', height:'56px', borderRadius:'1rem',
            background:'linear-gradient(135deg,#6366f1,#4f46e5)',
            boxShadow:'0 8px 24px rgba(99,102,241,0.4)', marginBottom:'1rem'
          }}>
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 style={{ fontSize:'1.75rem', fontWeight:800, color:'#1e293b', margin:0, fontFamily:"'Outfit',sans-serif" }}>Create Account</h1>
          <p style={{ color:'#64748b', marginTop:'0.4rem', fontSize:'0.9rem' }}>Join the municipal digital services platform</p>
        </div>

        {error && (
          <div style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', borderRadius:'0.75rem', padding:'0.75rem 1rem', marginBottom:'1.25rem', fontSize:'0.875rem', fontWeight:500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { label:'Full Name',      key:'name',     type:'text',     placeholder:'John Doe' },
            { label:'Email Address',  key:'email',    type:'email',    placeholder:'you@example.com' },
            { label:'Phone Number',   key:'phone',    type:'text',     placeholder:'+91 99999 00000' },
            { label:'Password',       key:'password', type:'password', placeholder:'••••••••' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom:'1rem' }}>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>{f.label}</label>
              <input type={f.type} required value={formData[f.key]}
                onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                placeholder={f.placeholder} style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur}
              />
            </div>
          ))}

          <div style={{ marginBottom:'1.5rem' }}>
            <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.35rem', fontSize:'0.875rem' }}>Account Role</label>
            <select value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
              style={{ ...inputStyle, cursor:'pointer' }}
              onFocus={handleFocus} onBlur={handleBlur}
            >
              <option value="Citizen">Citizen</option>
              <option value="Admin">Administrator</option>
            </select>
          </div>

          <button type="submit" disabled={loading} style={{
            display:'flex', alignItems:'center', justifyContent:'center', width:'100%',
            padding:'0.85rem', borderRadius:'0.75rem', border:'none', cursor:'pointer',
            background: loading ? '#a5b4fc' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
            color:'#fff', fontWeight:700, fontSize:'0.95rem', fontFamily:'inherit',
            boxShadow:'0 4px 14px rgba(99,102,241,0.4)',
          }}>
            {loading ? 'Creating account...' : 'Register Account'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.5rem', color:'#64748b', fontSize:'0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'#6366f1', fontWeight:600, textDecoration:'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
