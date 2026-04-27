import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './HomePage.css';

// ─── Fallback news (shown until API data loads) ──────────────────────────────
const FALLBACK_NEWS = [
  '📢 Newasa Nagar Parishad invites applications for Ladki Bahin Yojana – last date 30 April 2026',
  '🚰 Water supply disruption on 26 April in Ward No. 5 & 7 for pipeline maintenance',
  '📋 Property Tax payment deadline extended to 31 May 2026 – pay online and get 5% rebate',
];

// ─── Yojanas ──────────────────────────────────────────────────────────────────
const YOJANAS = [
  {
    img: '/ladki_bahin.png',
    title: 'Mukhyamantri Ladki Bahin Yojana',
    badge: 'Active Scheme',
    badgeColor: '#16a34a',
    desc: 'Financial assistance of ₹1,500 per month to eligible women aged 21-65 years. Maharashtra government\'s flagship women empowerment initiative.',
    tag: 'Women Empowerment',
  },
  {
    img: '/awas_yojana.png',
    title: 'PM Awas Yojana (Urban)',
    badge: 'Ongoing',
    badgeColor: '#2563eb',
    desc: 'Affordable housing scheme providing financial aid up to ₹2.5 lakh for construction of pucca houses for eligible beneficiaries.',
    tag: 'Housing',
  },
  {
    img: '/swachh_bharat.png',
    title: 'Swachh Bharat Mission',
    badge: 'Year-round',
    badgeColor: '#ea580c',
    desc: 'Newasa Municipal Corporation\'s cleanliness drive covering garbage collection, drainage cleaning and public sanitation awareness.',
    tag: 'Sanitation',
  },
];

// ─── Services menu ────────────────────────────────────────────────────────────
const SERVICES_MENU = [
  { label: '📜 Birth Certificate',       key: 'birth' },
  { label: '📋 Caste Certificate',       key: 'caste' },
  { label: '🏠 Domicile Certificate',    key: 'domicile' },
  { label: '💧 Water Connection',        key: 'water' },
  { label: '⚡ Electricity Complaint',   key: 'electricity' },
  { label: '🗑️ Garbage Complaint',      key: 'garbage' },
  { label: '🛣️ Road/Pothole Complaint', key: 'road' },
  { label: '💰 Property Tax Payment',   key: 'tax' },
  { label: '📄 All Services →',         key: 'all' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [newsItems, setNewsItems] = useState(FALLBACK_NEWS);
  const [newsIdx, setNewsIdx]     = useState(0);
  const [showServices, setShowServices] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const servicesRef = useRef(null);

  // Fetch live news from API
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/news`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setNewsItems(data.map(n => `${n.emoji || ''} ${n.title}`.trim()));
          setNewsIdx(0);
        }
      })
      .catch(() => {}); // keep fallback on error
  }, []);

  // Rotate news ticker
  useEffect(() => {
    const t = setInterval(() => setNewsIdx(i => (i + 1) % newsItems.length), 4000);
    return () => clearInterval(t);
  }, [newsItems]);

  // Close services dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setShowServices(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const goToLogin = (service) => {
    navigate('/login', { state: { service } });
  };

  const scrollTo = (id) => {
    setMobileMenu(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  };

  return (
    <div className="hp-root">
      {/* ── Top utility bar ─────────────────────────────────────────── */}
      <div className="hp-topbar">
        <span>📞 Toll Free: <b>1800-233-4455</b></span>
        <span>|</span>
        <a href="mailto:newasamunicipal@gmail.com" className="hp-toplink">✉ newasamunicipal@gmail.com</a>
        <span>|</span>
        <span>⏰ Mon–Sat: 10:00 AM – 5:00 PM</span>
      </div>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="hp-header">
        <div className="hp-logo-wrap">
          <div className="hp-logo-icon">🏛️</div>
          <div>
            <div className="hp-logo-title">Newasa Nagar Parishad</div>
            <div className="hp-logo-sub">नेवासा नगर परिषद | Ahmednagar, Maharashtra</div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hp-nav">
          <button className={`hp-nav-btn${activeSection==='home'?' hp-nav-active':''}`} onClick={() => scrollTo('home')}>🏠 Home</button>

          <div className="hp-nav-dropdown" ref={servicesRef}>
            <button
              className={`hp-nav-btn${showServices?' hp-nav-active':''}`}
              onClick={() => setShowServices(v => !v)}
            >
              ⚙️ Services ▾
            </button>
            {showServices && (
              <div className="hp-dropdown-menu">
                <div className="hp-dropdown-title">Municipal Services</div>
                {SERVICES_MENU.map(s => (
                  <button key={s.key} className="hp-dropdown-item" onClick={() => { setShowServices(false); goToLogin(s.label); }}>
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className={`hp-nav-btn${activeSection==='cityinfo'?' hp-nav-active':''}`} onClick={() => scrollTo('cityinfo')}>🌆 City Info</button>
          <button className={`hp-nav-btn${activeSection==='yojanas'?' hp-nav-active':''}`} onClick={() => scrollTo('yojanas')}>📋 Schemes</button>
          <button className={`hp-nav-btn${activeSection==='contact'?' hp-nav-active':''}`} onClick={() => scrollTo('contact')}>📞 Contact</button>
          <button className="hp-login-btn" onClick={() => navigate('/login')}>🔐 Login / Register</button>
        </nav>

        {/* Mobile hamburger */}
        <button className="hp-hamburger" onClick={() => setMobileMenu(v => !v)}>☰</button>
      </header>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="hp-mobile-menu">
          <button onClick={() => scrollTo('home')}>🏠 Home</button>
          <button onClick={() => scrollTo('cityinfo')}>🌆 City Info</button>
          <button onClick={() => { setMobileMenu(false); setShowServices(true); scrollTo('services'); }}>⚙️ Services</button>
          <button onClick={() => scrollTo('yojanas')}>📋 Schemes</button>
          <button onClick={() => scrollTo('contact')}>📞 Contact</button>
          <button onClick={() => navigate('/login')}>🔐 Login</button>
        </div>
      )}

      {/* ── News Ticker ──────────────────────────────────────────────── */}
      <div className="hp-ticker">
        <span className="hp-ticker-label">🔴 LIVE NEWS</span>
        <div className="hp-ticker-track">
          <span className="hp-ticker-text" key={newsIdx}>{newsItems[newsIdx]}</span>
        </div>
      </div>

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section id="home" className="hp-hero">
        <div className="hp-hero-overlay" />
        <img src="/newasa_municipal.png" alt="Newasa Municipal" className="hp-hero-img" />
        <div className="hp-hero-content">
          <div className="hp-hero-badge">🇮🇳 Government of Maharashtra</div>
          <h1 className="hp-hero-title">Newasa Nagar Parishad</h1>
          <p className="hp-hero-sub">नेवासे – संत ज्ञानेश्वरांची पवित्र भूमि<br/>Your gateway to smart, transparent municipal services</p>
          <div className="hp-hero-btns">
            <button className="hp-hero-btn-primary" onClick={() => navigate('/login')}>
              Apply for Services
            </button>
            <button className="hp-hero-btn-outline" onClick={() => scrollTo('services')}>
              View All Services
            </button>
          </div>
          <div className="hp-hero-stats">
            <div className="hp-stat"><span className="hp-stat-num">45,000+</span><span>Citizens</span></div>
            <div className="hp-stat-div" />
            <div className="hp-stat"><span className="hp-stat-num">9</span><span>Departments</span></div>
            <div className="hp-stat-div" />
            <div className="hp-stat"><span className="hp-stat-num">24/7</span><span>Online Services</span></div>
          </div>
        </div>
      </section>

      {/* ── Quick Services ───────────────────────────────────────────── */}
      <section id="services" className="hp-section hp-bg-light">
        <div className="hp-container">
          <div className="hp-section-head">
            <span className="hp-section-tag">⚙️ E-Services</span>
            <h2>Municipal Services at Your Fingertips</h2>
            <p>Click any service to apply online. You will be directed to login before proceeding.</p>
          </div>
          <div className="hp-services-grid">
            {[
              { icon:'📜', label:'Birth Certificate',       desc:'Apply for newborn birth registration' },
              { icon:'☠️', label:'Death Certificate',       desc:'Register and obtain death certificate' },
              { icon:'📋', label:'Caste Certificate',       desc:'SC/ST/OBC caste certificate application' },
              { icon:'🏠', label:'Domicile Certificate',    desc:'Residence proof certificate' },
              { icon:'💧', label:'Water Connection',        desc:'New water tap connection request' },
              { icon:'💰', label:'Property Tax',            desc:'Pay property tax online' },
              { icon:'🛣️', label:'Road Complaint',         desc:'Report potholes and road damage' },
              { icon:'🗑️', label:'Garbage Complaint',      desc:'Report missed garbage collection' },
            ].map(s => (
              <button key={s.label} className="hp-service-card" onClick={() => goToLogin(s.label)}>
                <div className="hp-service-icon">{s.icon}</div>
                <div className="hp-service-label">{s.label}</div>
                <div className="hp-service-desc">{s.desc}</div>
                <div className="hp-service-arrow">Apply Now →</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── City Info ────────────────────────────────────────────────── */}
      <section id="cityinfo" className="hp-section hp-bg-dark">
        <div className="hp-container">
          <div className="hp-section-head hp-light">
            <span className="hp-section-tag hp-tag-gold">🌆 About Our City</span>
            <h2 style={{ color:'#fff' }}>Newasa – The Sacred City</h2>
            <p style={{ color:'#cbd5e1' }}>Historic heritage, progressive development</p>
          </div>
          <div className="hp-city-grid">
            <div className="hp-city-text">
              <h3 style={{ color:'#fbbf24', marginTop:0 }}>About Newasa</h3>
              <p>Newasa (नेवासे) is a historic town in Ahmednagar district of Maharashtra, renowned as the birthplace of <strong>Dnyaneshwari</strong> — the great Marathi commentary on Bhagavad Gita written by Saint Dnyaneshwar in the 13th century.</p>
              <p>The town sits on the banks of the <strong>Pravara River</strong> and holds immense religious and cultural significance. The famous Dnyaneshwar temple attracts thousands of pilgrims year-round.</p>
              <div className="hp-city-facts">
                <div className="hp-fact"><span className="hp-fact-icon">📍</span><div><strong>Location</strong><br/>Ahmednagar District, Maharashtra</div></div>
                <div className="hp-fact"><span className="hp-fact-icon">🌊</span><div><strong>River</strong><br/>Pravara River</div></div>
                <div className="hp-fact"><span className="hp-fact-icon">⛪</span><div><strong>Famous For</strong><br/>Dnyaneshwar Temple</div></div>
                <div className="hp-fact"><span className="hp-fact-icon">👥</span><div><strong>Population</strong><br/>~45,000</div></div>
              </div>
            </div>
            <div className="hp-city-dev">
              <h3 style={{ color:'#fbbf24', marginTop:0 }}>Development Work 2025–26</h3>
              {[
                { icon:'🛣️', title:'Road Widening Project', status:'In Progress', color:'#f59e0b', desc:'Phase-2 of NH expansion covering 12 km stretch' },
                { icon:'💧', title:'Underground Water Pipeline', status:'Completed', color:'#22c55e', desc:'New pipeline network covering all 15 wards' },
                { icon:'🌿', title:'Smart Garden Development', status:'In Progress', color:'#f59e0b', desc:'5 new parks with walking tracks and lights' },
                { icon:'💡', title:'LED Street Light Project', status:'Completed', color:'#22c55e', desc:'2,500 LED lights installed across the city' },
                { icon:'🏫', title:'Municipal School Renovation', status:'Planned', color:'#60a5fa', desc:'Digital classrooms in 8 municipal schools' },
              ].map(d => (
                <div key={d.title} className="hp-dev-item">
                  <span className="hp-dev-icon">{d.icon}</span>
                  <div style={{ flex:1 }}>
                    <div className="hp-dev-title">{d.title}</div>
                    <div className="hp-dev-desc">{d.desc}</div>
                  </div>
                  <span className="hp-dev-badge" style={{ background: d.color+'22', color: d.color, border:`1px solid ${d.color}44` }}>{d.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Yojanas ──────────────────────────────────────────────────── */}
      <section id="yojanas" className="hp-section hp-bg-light">
        <div className="hp-container">
          <div className="hp-section-head">
            <span className="hp-section-tag">📋 Government Schemes</span>
            <h2>Current Yojanas &amp; Schemes</h2>
            <p>Active government welfare programs available to Newasa citizens</p>
          </div>
          <div className="hp-yojana-grid">
            {YOJANAS.map(y => (
              <div key={y.title} className="hp-yojana-card">
                <div className="hp-yojana-img-wrap">
                  <img src={y.img} alt={y.title} className="hp-yojana-img" />
                  <span className="hp-yojana-badge" style={{ background: y.badgeColor }}>{y.badge}</span>
                </div>
                <div className="hp-yojana-body">
                  <span className="hp-yojana-tag">{y.tag}</span>
                  <h3 className="hp-yojana-title">{y.title}</h3>
                  <p className="hp-yojana-desc">{y.desc}</p>
                  <button className="hp-yojana-btn" onClick={() => goToLogin(y.title)}>
                    Apply Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Notice Board ─────────────────────────────────────────────── */}
      <section className="hp-section hp-bg-white">
        <div className="hp-container">
          <div className="hp-notice-wrap">
            <div className="hp-notice-left">
              <span className="hp-section-tag">📌 Notice Board</span>
              <h2>Latest Municipal Notices</h2>
              {[
                { date:'24 Apr 2026', title:'Property Tax rebate of 5% for early payment before 31 May 2026', type:'Finance' },
                { date:'22 Apr 2026', title:'Tender notice for construction of Community Hall at Ward No. 8', type:'Tender' },
                { date:'20 Apr 2026', title:'Water supply schedule for upcoming week – Ward 3, 5, 9', type:'Water' },
                { date:'18 Apr 2026', title:'Recruitment notice for Sanitation Workers – 12 posts', type:'Recruitment' },
                { date:'15 Apr 2026', title:'Meeting of Standing Committee scheduled for 28 April 2026', type:'Meeting' },
              ].map(n => (
                <div key={n.title} className="hp-notice-item">
                  <div className="hp-notice-date">{n.date}</div>
                  <div className="hp-notice-content">
                    <span className="hp-notice-type">{n.type}</span>
                    <div className="hp-notice-title">{n.title}</div>
                  </div>
                  <span className="hp-notice-new">NEW</span>
                </div>
              ))}
            </div>
            <div className="hp-notice-right">
              <span className="hp-section-tag">📊 At a Glance</span>
              <h2>Municipal at a Glance</h2>
              <div className="hp-glance-grid">
                {[
                  { num:'9', label:'Departments', icon:'🏢' },
                  { num:'15', label:'Wards', icon:'🗺️' },
                  { num:'45K+', label:'Citizens', icon:'👥' },
                  { num:'24/7', label:'Online Services', icon:'💻' },
                  { num:'₹12Cr', label:'Annual Budget', icon:'💰' },
                  { num:'2,500', label:'Street Lights', icon:'💡' },
                ].map(g => (
                  <div key={g.label} className="hp-glance-card">
                    <div className="hp-glance-icon">{g.icon}</div>
                    <div className="hp-glance-num">{g.num}</div>
                    <div className="hp-glance-label">{g.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────── */}
      <section id="contact" className="hp-section hp-bg-light">
        <div className="hp-container">
          <div className="hp-section-head">
            <span className="hp-section-tag">📞 Contact Us</span>
            <h2>Get in Touch with Newasa Nagar Parishad</h2>
            <p>We are here to serve you — reach us through any of the following channels</p>
          </div>
          <div className="hp-contact-grid">
            {/* Phone */}
            <div className="hp-contact-card">
              <div className="hp-contact-icon">📞</div>
              <h3>Phone Numbers</h3>
              <div className="hp-contact-list">
                <a href="tel:02428222100" className="hp-contact-link">📱 02428-222100 (Main Office)</a>
                <a href="tel:02428222200" className="hp-contact-link">📱 02428-222200 (Complaints)</a>
                <a href="tel:02428222300" className="hp-contact-link">📱 02428-222300 (Water Supply)</a>
              </div>
              <div className="hp-contact-whatsapp">
                <span>💬 WhatsApp Your Requirement:</span>
                <a href="https://wa.me/919699336687" target="_blank" rel="noreferrer" className="hp-wa-btn">
                  📲 9699336687
                </a>
              </div>
            </div>

            {/* Email & Address */}
            <div className="hp-contact-card">
              <div className="hp-contact-icon">✉️</div>
              <h3>Email &amp; Address</h3>
              <div className="hp-contact-list">
                <a href="mailto:newasamunicipal@gmail.com" className="hp-contact-link">📧 newasamunicipal@gmail.com</a>
                <p style={{ color:'#64748b', marginTop:'1rem', lineHeight:1.6 }}>
                  🏛️ Newasa Nagar Parishad,<br />
                  Newasa Phata, Tal. Newasa,<br />
                  Dist. Ahmednagar,<br />
                  Maharashtra – 414 603
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="hp-contact-card">
              <div className="hp-contact-icon">🌐</div>
              <h3>Follow Us</h3>
              <p style={{ color:'#64748b', marginBottom:'1rem' }}>Stay updated with the latest news and announcements</p>
              <div className="hp-social-btns">
                <a href="https://www.facebook.com/NewasaNagarParishad" target="_blank" rel="noreferrer" className="hp-social-fb">
                  <span>f</span> Facebook
                </a>
                <a href="https://www.instagram.com/newasa_nagar_parishad" target="_blank" rel="noreferrer" className="hp-social-ig">
                  <span>📷</span> Instagram
                </a>
              </div>
              <div className="hp-contact-hours">
                <strong>Office Hours</strong>
                <div>Monday – Saturday: 10:00 AM – 5:00 PM</div>
                <div style={{ color:'#dc2626' }}>Sunday & Holidays: Closed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="hp-footer">
        <div className="hp-container">
          <div className="hp-footer-grid">
            <div>
              <div className="hp-footer-logo">🏛️ Newasa Nagar Parishad</div>
              <p className="hp-footer-desc">Serving the citizens of Newasa with transparency, efficiency and dedication since 1965.</p>
              <div className="hp-footer-social">
                <a href="https://www.facebook.com/NewasaNagarParishad" target="_blank" rel="noreferrer" className="hp-footer-social-btn">f</a>
                <a href="https://www.instagram.com/newasa_nagar_parishad" target="_blank" rel="noreferrer" className="hp-footer-social-btn">📷</a>
                <a href="https://wa.me/919699336687" target="_blank" rel="noreferrer" className="hp-footer-social-btn">💬</a>
              </div>
            </div>
            <div>
              <h4 className="hp-footer-heading">Quick Links</h4>
              <div className="hp-footer-links">
                <button onClick={() => scrollTo('home')}>Home</button>
                <button onClick={() => scrollTo('cityinfo')}>City Info</button>
                <button onClick={() => scrollTo('yojanas')}>Schemes</button>
                <button onClick={() => scrollTo('contact')}>Contact Us</button>
                <button onClick={() => navigate('/login')}>Login / Register</button>
              </div>
            </div>
            <div>
              <h4 className="hp-footer-heading">Services</h4>
              <div className="hp-footer-links">
                {['Birth Certificate','Caste Certificate','Water Connection','Property Tax','Road Complaint','Garbage Complaint'].map(s => (
                  <button key={s} onClick={() => goToLogin(s)}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="hp-footer-heading">Contact</h4>
              <div className="hp-footer-contact">
                <div>📧 newasamunicipal@gmail.com</div>
                <div>📞 02428-222100</div>
                <div>📞 02428-222200</div>
                <div>💬 WhatsApp: 9699336687</div>
                <div>📍 Newasa, Ahmednagar, MH</div>
              </div>
            </div>
          </div>
          <div className="hp-footer-bottom">
            <div>© 2026 Newasa Nagar Parishad. All rights reserved.</div>
            <div>Government of Maharashtra | Designed for citizens of Newasa</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
