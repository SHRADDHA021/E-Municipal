import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function CitizenBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payModal, setPayModal] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => { fetchBills(); }, []);

  const fetchBills = async () => {
    const { data } = await api.get('/bills').catch(() => ({ data: [] }));
    setBills(data);
    setLoading(false);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const handlePay = async (method) => {
    try {
      await api.post(`/bills/${payModal.bill_ID}/pay`, { paymentMethod: method });
      showToast(`✅ ₹${payModal.total_amt} paid via ${method}!`);
      setPayModal(null);
      fetchBills();
    } catch { showToast('❌ Payment failed'); }
  };

  return (
    <Layout>
      {toast && <div style={{ position:'fixed', top:'2rem', right:'2rem', background:'#1e293b', color:'#fff', padding:'0.9rem 1.5rem', borderRadius:'0.75rem', boxShadow:'0 10px 25px rgba(0,0,0,0.2)', zIndex:9999, fontWeight:600 }}>{toast}</div>}

      {payModal && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(15,23,42,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'1rem' }}>
          <div style={{ background:'#fff', padding:'2rem', borderRadius:'1.25rem', width:'100%', maxWidth:'400px', boxShadow:'0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h2 style={{ margin:0, fontSize:'1.3rem', fontWeight:800, color:'#1e293b' }}>💳 Pay Bill #{payModal.bill_ID}</h2>
              <button onClick={() => setPayModal(null)} style={{ background:'#f1f5f9', border:'none', width:'32px', height:'32px', borderRadius:'50%', cursor:'pointer', color:'#64748b', fontSize:'1rem' }}>✕</button>
            </div>
            <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'0.75rem', padding:'1.25rem', textAlign:'center', marginBottom:'1.5rem' }}>
              <div style={{ color:'#64748b', fontSize:'0.8rem', fontWeight:600 }}>Amount Due</div>
              <div style={{ color:'#059669', fontSize:'2.5rem', fontWeight:900, fontFamily:"'Outfit',sans-serif" }}>₹{payModal.total_amt}</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.65rem' }}>
              {[['📱 UPI / QR Code','UPI'],['💳 Card','Card'],['🏦 Net Banking','NetBanking']].map(([label,val]) => (
                <button key={val} onClick={() => handlePay(val)} style={{ padding:'0.9rem', background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:'0.75rem', fontWeight:600, color:'#1e293b', cursor:'pointer', fontSize:'0.9rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='#6366f1'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='#e2e8f0'}
                >
                  <span>{label}</span><span style={{ color:'#94a3b8' }}>→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#1e293b', margin:'0 0 0.3rem', fontFamily:"'Outfit',sans-serif" }}>My Bills</h1>
        <p style={{ color:'#64748b', margin:0 }}>View and pay all your municipal bills</p>
      </div>

      {loading ? <div style={{ textAlign:'center', padding:'4rem', color:'#94a3b8' }}>Loading...</div> : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {bills.map(b => (
            <div key={b.bill_ID} style={{ background:'#fff', borderRadius:'1rem', padding:'1.5rem', boxShadow:'0 4px 16px rgba(0,0,0,0.06)', borderLeft:`4px solid ${b.isPaid ? '#059669' : '#f59e0b'}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'0.75rem' }}>
                <div>
                  <div style={{ fontWeight:700, color:'#1e293b', marginBottom:'0.3rem', fontSize:'1rem' }}>Bill #{b.bill_ID}</div>
                  <div style={{ color:'#64748b', fontSize:'0.8rem', marginBottom:'0.25rem' }}>📅 {new Date(b.p_date).toLocaleDateString()}</div>
                  {b.billServices?.length > 0 && (
                    <div style={{ fontSize:'0.8rem', color:'#475569', marginTop:'0.3rem' }}>
                      Services: {b.billServices.map(bs => bs.service?.sName || `SID ${bs.sID}`).join(', ')}
                    </div>
                  )}
                  {b.paymentMethod && <div style={{ fontSize:'0.78rem', color:'#94a3b8', marginTop:'0.2rem' }}>Paid via: {b.paymentMethod}</div>}
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.5rem' }}>
                  <div style={{ fontSize:'1.5rem', fontWeight:900, color: b.isPaid ? '#059669' : '#f59e0b', fontFamily:"'Outfit',sans-serif" }}>₹{b.total_amt}</div>
                  {b.isPaid ? (
                    <div style={{ display:'flex', gap:'0.5rem' }}>
                      <span style={{ background:'#d1fae5', color:'#065f46', borderRadius:'999px', padding:'0.2rem 0.75rem', fontSize:'0.72rem', fontWeight:800, display:'inline-block' }}>✅ PAID</span>
                      <button 
                        onClick={() => {
                          const w = window.open('', '_blank');
                          w.document.write(`
                            <html><head><title>Receipt #${b.bill_ID}</title>
                            <style>body{font-family:sans-serif;padding:40px;color:#1e293b} .h{font-size:24px;font-weight:bold;margin-bottom:20px;border-bottom:2px solid #6366f1;padding-bottom:10px} .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f1f5f9} .total{font-size:20px;font-weight:bold;color:#059669;margin-top:20px}</style>
                            </head><body>
                            <div class="h">Municipal Service Receipt</div>
                            <div class="row"><span>Bill ID</span><span>#${b.bill_ID}</span></div>
                            <div class="row"><span>Date</span><span>${new Date(b.p_date).toLocaleDateString()}</span></div>
                            <div class="row"><span>Payment Method</span><span>${b.paymentMethod || 'N/A'}</span></div>
                            <div class="row"><span>Status</span><span>PAID</span></div>
                            <div class="row"><span>Services</span><span>${b.billServices?.map(bs=>bs.service?.sName).join(', ') || 'N/A'}</span></div>
                            <div class="total"><span>Total Amount</span><span>₹${b.total_amt}</span></div>
                            <p style="margin-top:40px;font-size:12px;color:#64748b">This is a computer generated receipt. No signature required.</p>
                            <script>window.print();</script></body></html>
                          `);
                          w.document.close();
                        }}
                        style={{ padding:'0.5rem 1rem', borderRadius:'0.6rem', background:'#f1f5f9', color:'#475569', border:'none', fontWeight:700, cursor:'pointer', fontSize:'0.8rem' }}
                      >
                        🖨️ Receipt
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setPayModal(b)} style={{ padding:'0.5rem 1.25rem', borderRadius:'0.6rem', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'#fff', border:'none', fontWeight:700, cursor:'pointer', fontSize:'0.8rem' }}>
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {bills.length === 0 && <div style={{ textAlign:'center', padding:'4rem', color:'#94a3b8', background:'#fff', borderRadius:'1rem' }}>No bills yet. Apply for services to generate bills.</div>}
        </div>
      )}
    </Layout>
  );
}
