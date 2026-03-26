import { Link } from 'react-router-dom';

const card = (icon, title, desc, link, color) => ({ icon, title, desc, link, color });

const cards = [
  card('🔔', 'Register Complaint', 'Report road damage, water leaks & more', '/citizen/complaints', { bg:'#fef3c7', icon:'#d97706', border:'#fde68a' }),
  card('📄', 'Apply for Service', 'Birth certificate, licenses & permits', '/citizen/apply', { bg:'#dbeafe', icon:'#2563eb', border:'#bfdbfe' }),
  card('💳', 'Pay Municipal Bills', 'Water bill, property tax & more', '/citizen/apply', { bg:'#d1fae5', icon:'#059669', border:'#a7f3d0' }),
  card('📅', 'View Schedules', 'Garbage & water supply timetables', '/citizen/complaints', { bg:'#f3e8ff', icon:'#7c3aed', border:'#e9d5ff' }),
];

const CitizenDashboard = () => (
  <div style={{ fontFamily:"'Inter',sans-serif" }}>
    {/* Header */}
    <div style={{ marginBottom:'2.5rem' }}>
      <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#1e293b', margin:'0 0 0.5rem', fontFamily:"'Outfit',sans-serif" }}>Citizen Dashboard</h1>
      <p style={{ color:'#64748b', margin:0, fontSize:'1rem' }}>Access all municipal services in one place.</p>
    </div>

    {/* Cards Grid */}
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'1.25rem', marginBottom:'2.5rem' }}>
      {cards.map((c, i) => (
        <Link key={i} to={c.link} style={{ textDecoration:'none' }}>
          <div style={{
            background:'rgba(255,255,255,0.9)', border:'1px solid #e2e8f0',
            borderRadius:'1.25rem', padding:'1.75rem',
            boxShadow:'0 4px 16px rgba(0,0,0,0.06)',
            transition:'all 0.25s ease', cursor:'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.06)'; }}
          >
            <div style={{ width:'56px', height:'56px', borderRadius:'1rem', background:c.color.bg, border:`1.5px solid ${c.color.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', marginBottom:'1.25rem' }}>
              {c.icon}
            </div>
            <h3 style={{ fontSize:'1rem', fontWeight:700, color:'#1e293b', margin:'0 0 0.4rem', fontFamily:"'Outfit',sans-serif" }}>{c.title}</h3>
            <p style={{ fontSize:'0.82rem', color:'#64748b', margin:'0 0 1rem', lineHeight:'1.5' }}>{c.desc}</p>
            <span style={{ fontSize:'0.78rem', fontWeight:700, color:c.color.icon, display:'flex', alignItems:'center', gap:'0.3rem' }}>
              Access Service →
            </span>
          </div>
        </Link>
      ))}
    </div>

    {/* Banner */}
    <div style={{
      background:'linear-gradient(135deg,#6366f1,#4f46e5)',
      borderRadius:'1.5rem', padding:'2.5rem',
      position:'relative', overflow:'hidden',
      boxShadow:'0 12px 40px rgba(99,102,241,0.35)',
    }}>
      <div style={{ position:'absolute', right:'-2rem', top:'-2rem', width:'180px', height:'180px', borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
      <div style={{ position:'absolute', right:'4rem', bottom:'-3rem', width:'120px', height:'120px', borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
      <div style={{ position:'relative', zIndex:1, maxWidth:'500px' }}>
        <div style={{ fontSize:'0.75rem', fontWeight:700, color:'#a5b4fc', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>New Feature</div>
        <h2 style={{ fontSize:'1.5rem', fontWeight:800, color:'#fff', margin:'0 0 0.75rem', fontFamily:"'Outfit',sans-serif" }}>Digital Services Now Available 24/7!</h2>
        <p style={{ color:'#c7d2fe', fontSize:'0.9rem', lineHeight:'1.6', margin:'0 0 1.5rem' }}>
          Apply for certificates, register complaints, and pay bills anytime — all from this portal.
        </p>
        <Link to="/citizen/apply" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'#fff', color:'#6366f1', padding:'0.65rem 1.5rem', borderRadius:'0.75rem', fontWeight:700, fontSize:'0.875rem', textDecoration:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)' }}>
          Explore Services →
        </Link>
      </div>
    </div>
  </div>
);

export default CitizenDashboard;
