import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useContext(AuthContext);
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.role === 'Admin') navigate('/admin');
      else navigate('/citizen');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #e0f2fe 100%)',
      padding: '1rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Decorative blobs */}
      <div style={{ position:'absolute', top:'-5%', left:'-5%', width:'350px', height:'350px', borderRadius:'50%', background:'rgba(99,102,241,0.15)', filter:'blur(80px)' }} />
      <div style={{ position:'absolute', bottom:'-5%', right:'-5%', width:'350px', height:'350px', borderRadius:'50%', background:'rgba(79,70,229,0.12)', filter:'blur(80px)' }} />

      <div style={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        borderRadius: '1.5rem',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            width:'60px', height:'60px', borderRadius:'1rem',
            background:'linear-gradient(135deg,#6366f1,#4f46e5)',
            boxShadow:'0 8px 24px rgba(99,102,241,0.4)',
            marginBottom:'1rem'
          }}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 style={{ fontSize:'1.75rem', fontWeight:800, color:'#1e293b', margin:0, fontFamily:"'Outfit',sans-serif" }}>
            E-Municipal Portal
          </h1>
          <p style={{ color:'#64748b', marginTop:'0.4rem', fontSize:'0.9rem' }}>Sign in to your government account</p>
        </div>

        {error && (
          <div style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', borderRadius:'0.75rem', padding:'0.75rem 1rem', marginBottom:'1.25rem', fontSize:'0.875rem', textAlign:'center', fontWeight:500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:'1.25rem' }}>
            <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.4rem', fontSize:'0.875rem' }}>Email Address</label>
            <input
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ display:'block', width:'100%', padding:'0.75rem 1rem', border:'1.5px solid #e2e8f0', borderRadius:'0.75rem', background:'#f8fafc', color:'#1e293b', fontSize:'0.875rem', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}
              onFocus={e => { e.target.style.borderColor='#6366f1'; e.target.style.background='#fff'; }}
              onBlur={e  => { e.target.style.borderColor='#e2e8f0'; e.target.style.background='#f8fafc'; }}
            />
          </div>
          <div style={{ marginBottom:'1.75rem' }}>
            <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.4rem', fontSize:'0.875rem' }}>Password</label>
            <input
              type="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ display:'block', width:'100%', padding:'0.75rem 1rem', border:'1.5px solid #e2e8f0', borderRadius:'0.75rem', background:'#f8fafc', color:'#1e293b', fontSize:'0.875rem', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}
              onFocus={e => { e.target.style.borderColor='#6366f1'; e.target.style.background='#fff'; }}
              onBlur={e  => { e.target.style.borderColor='#e2e8f0'; e.target.style.background='#f8fafc'; }}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            display:'flex', alignItems:'center', justifyContent:'center', width:'100%',
            padding:'0.85rem', borderRadius:'0.75rem', border:'none', cursor:'pointer',
            background: loading ? '#a5b4fc' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
            color:'#fff', fontWeight:700, fontSize:'0.95rem', fontFamily:'inherit',
            boxShadow:'0 4px 14px rgba(99,102,241,0.4)',
            transition:'all 0.2s ease',
          }}>
            {loading ? 'Signing in...' : 'Sign In to Portal'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.5rem', color:'#64748b', fontSize:'0.875rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color:'#6366f1', fontWeight:600, textDecoration:'none' }}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
