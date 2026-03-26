import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const citizenLinks = [
  { to: '/citizen',              label: 'Dashboard',        icon: '🏠' },
  { to: '/citizen/complaints',   label: 'My Complaints',    icon: '🔔' },
  { to: '/citizen/apply',        label: 'Apply for Service',icon: '📄' },
  { to: '/citizen/schedules',    label: 'Schedules',        icon: '📅' },
  { to: '/citizen/payments',     label: 'My Payments',      icon: '💳' },
];

const adminLinks = [
  { to: '/admin',                 label: 'Dashboard',        icon: '📊' },
  { to: '/admin/complaints',      label: 'Manage Complaints',icon: '🗂️' },
  { to: '/admin/services',        label: 'Manage Services',  icon: '⚙️' },
  { to: '/admin/schedules',       label: 'Manage Schedules', icon: '📅' },
  { to: '/admin/employees',       label: 'Employees',        icon: '👥' },
];

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location         = useLocation();
  const navigate         = useNavigate();
  const links            = user?.role === 'Admin' ? adminLinks : citizenLinks;

  const isActive = (to) =>
    to === '/citizen' || to === '/admin'
      ? location.pathname === to
      : location.pathname.startsWith(to);

  return (
    <aside style={{
      width: '240px', minHeight: '100vh', flexShrink: 0,
      background: 'linear-gradient(180deg,#1e1b4b 0%,#312e81 100%)',
      display: 'flex', flexDirection: 'column',
      boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
      position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '0.65rem', background: 'linear-gradient(135deg,#818cf8,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.5)' }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', fontFamily: "'Outfit',sans-serif", lineHeight: 1.2 }}>E-Municipal</div>
            <div style={{ fontSize: '0.65rem', color: '#a5b4fc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Portal</div>
          </div>
        </div>
      </div>

      {/* User info */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#818cf8,#c4b5fd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: '#1e1b4b', flexShrink: 0 }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e0e7ff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{user?.role}</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
        {links.map(link => {
          const active = isActive(link.to);
          return (
            <Link key={link.to} to={link.to} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.65rem 0.9rem', borderRadius: '0.75rem', textDecoration: 'none',
              background: active ? 'rgba(129,140,248,0.2)' : 'transparent',
              border: active ? '1px solid rgba(129,140,248,0.35)' : '1px solid transparent',
              color: active ? '#e0e7ff' : '#a5b4fc',
              fontWeight: active ? 700 : 500, fontSize: '0.875rem',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='#e0e7ff'; } }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#a5b4fc'; } }}
            >
              <span style={{ fontSize: '1rem' }}>{link.icon}</span>
              {link.label}
              {active && <span style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8' }} />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={() => { logout(); navigate('/login'); }} style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%',
          padding: '0.65rem 0.9rem', borderRadius: '0.75rem', border: '1px solid rgba(239,68,68,0.3)',
          background: 'rgba(239,68,68,0.1)', color: '#fca5a5', cursor: 'pointer',
          fontSize: '0.875rem', fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.18s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.2)'; e.currentTarget.style.color='#fecaca'; }}
        onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.1)'; e.currentTarget.style.color='#fca5a5'; }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
