import { useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const navMap = {
  Admin: [
    { label: '🏠 Dashboard', path: '/admin' },
    { label: '🏢 Departments', path: '/admin/departments' },
    { label: '👷 Employees', path: '/admin/employees' },
    { label: '📋 Complaints', path: '/admin/complaints' },
    { label: '🛠 Services', path: '/admin/services' },
    { label: '📂 Utility Bills', path: '/admin/bills' },
  ],
  Citizen: [
    { label: '🏠 Dashboard', path: '/citizen' },
    { label: '📣 Complaints', path: '/citizen/complaints' },
    { label: '🛠 Services', path: '/citizen/services' },
    { label: '💳 Application Bills', path: '/citizen/bills' },
    { label: '🚰 Utility Bills', path: '/citizen/utility' },
    { label: '⭐ Feedback', path: '/citizen/feedback' },
  ],
  Employee: [
    { label: '🏠 My Tasks', path: '/employee' },
  ],
};

export default function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const links = navMap[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter',sans-serif", background: 'linear-gradient(135deg,#f0f4ff,#e8edf8)' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', background: 'linear-gradient(180deg,#1e1b4b,#312e81)', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
        <div style={{ textAlign: 'center', padding: '0 0 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>🏛️</div>
          <div style={{ color: '#c7d2fe', fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '1rem' }}>E-Municipal</div>
          <div style={{ color: '#818cf8', fontSize: '0.73rem', marginTop: '0.2rem' }}>{user?.role} Portal</div>
        </div>

        {links.map(l => {
          const active = location.pathname === l.path;
          return (
            <Link key={l.path} to={l.path} style={{
              display: 'block', padding: '0.65rem 1rem', borderRadius: '0.6rem', textDecoration: 'none',
              color: active ? '#fff' : '#a5b4fc', fontWeight: active ? 700 : 500, fontSize: '0.875rem',
              background: active ? 'rgba(99,102,241,0.35)' : 'transparent', border: active ? '1px solid rgba(99,102,241,0.5)' : '1px solid transparent',
              transition: 'all 0.2s'
            }}>
              {l.label}
            </Link>
          );
        })}

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ color: '#a5b4fc', fontSize: '0.78rem', marginBottom: '0.5rem' }}>Logged in as</div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.75rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
          <button onClick={handleLogout} style={{ width: '100%', padding: '0.6rem', borderRadius: '0.6rem', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
