import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate         = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:999,
      background: scrolled ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
      backdropFilter:'blur(12px)',
      borderBottom: scrolled ? '1px solid #e2e8f0' : '1px solid transparent',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
      transition:'all 0.3s ease',
    }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', height:'64px' }}>
        <Link to={user?.role==='Admin' ? '/admin' : '/citizen'} style={{ display:'flex', alignItems:'center', gap:'0.6rem', textDecoration:'none' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'0.625rem', background:'linear-gradient(135deg,#6366f1,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(99,102,241,0.4)' }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span style={{ fontSize:'1.1rem', fontWeight:800, color:'#1e293b', fontFamily:"'Outfit',sans-serif", letterSpacing:'-0.02em' }}>
            E-Municipal<span style={{ color:'#6366f1' }}>Portal</span>
          </span>
        </Link>

        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <div style={{ background:'#f1f5f9', border:'1px solid #e2e8f0', borderRadius:'999px', padding:'0.35rem 0.9rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <div style={{ width:'26px', height:'26px', borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#818cf8)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'0.7rem', fontWeight:800 }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <span style={{ fontSize:'0.8rem', fontWeight:600, color:'#475569' }}>{user?.name}</span>
            <span style={{ fontSize:'0.65rem', fontWeight:700, color:'#6366f1', textTransform:'uppercase', letterSpacing:'0.05em', background:'#e0e7ff', borderRadius:'999px', padding:'0.1rem 0.4rem' }}>{user?.role}</span>
          </div>
          <button onClick={handleLogout} style={{
            display:'flex', alignItems:'center', gap:'0.4rem',
            padding:'0.45rem 1rem', borderRadius:'999px',
            background:'#fef2f2', border:'1px solid #fecaca',
            color:'#dc2626', fontWeight:600, fontSize:'0.8rem', cursor:'pointer', fontFamily:'inherit'
          }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
