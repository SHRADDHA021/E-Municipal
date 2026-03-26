import { useState, useEffect } from 'react';
import api from '../../api/axios';

const CitizenPayments = () => {
  const [payments, setPayments] = useState([]);
  const [amount,   setAmount]   = useState('');
  const [loading,  setLoading]  = useState(true);
  const [paying,   setPaying]   = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [toastMsg, setToastMsg]         = useState('');

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    try { const { data } = await api.get('/payments'); setPayments(data); }
    catch { /* backend may be offline */ }
    finally { setLoading(false); }
  };

  const handlePayClick = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) { 
        setToastMsg('❌ Enter a valid amount'); 
        setTimeout(() => setToastMsg(''), 4000);
        return; 
    }
    setPaymentModal(true);
  };

  const processPayment = async (method) => {
    setPaymentModal(false);
    setPaying(true);
    try {
      await api.post('/payments', parseFloat(amount), { headers: { 'Content-Type': 'application/json' }});
      setToastMsg(`✅ Payment of ₹${amount} via ${method} processed successfully!`);
      setTimeout(() => setToastMsg(''), 4000);
      setAmount('');
      fetchPayments();
    } catch { 
      setToastMsg('❌ Payment failed – check backend connection.');
      setTimeout(() => setToastMsg(''), 4000);
    }
    finally { setPaying(false); }
  };

  const total = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", position: 'relative' }}>
      {toastMsg && (
        <div style={{ position: 'fixed', top: '2rem', right: '2rem', background: '#1e293b', color: '#fff', padding: '1rem 1.5rem', borderRadius: '0.75rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 9999, fontWeight: 600, animation: 'slideIn 0.3s ease' }}>
          {toastMsg}
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.4rem', fontFamily: "'Outfit',sans-serif" }}>My Payments</h1>
        <p style={{ color: '#64748b', margin: 0 }}>View your payment history and pay municipal bills.</p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Pay Now Form */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)', borderRadius: '1.25rem', padding: '1.75rem', color: '#fff', boxShadow: '0 12px 40px rgba(30,27,75,0.3)', marginBottom: '1rem' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>💳</div>
            <div style={{ fontSize: '0.72rem', color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Paid</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: "'Outfit',sans-serif", margin: '0.25rem 0' }}>₹{total.toFixed(2)}</div>
            <div style={{ fontSize: '0.78rem', color: '#818cf8' }}>{payments.length} payment{payments.length !== 1 ? 's' : ''} on record</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: '0 0 1.25rem', fontFamily: "'Outfit',sans-serif" }}>Make a Payment</h2>
            <form onSubmit={handlePayClick}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Amount (₹)</label>
                <input type="number" min="1" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  style={{ display: 'block', width: '100%', padding: '0.7rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '0.75rem', background: '#f8fafc', color: '#1e293b', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <button type="submit" disabled={paying} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: paying ? '#a5b4fc' : 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
                {paying ? 'Processing...' : '💳 Continue to Payment'}
              </button>
            </form>
          </div>
        </div>

        {/* Payment History */}
        <div style={{ flex: '2 1 500px', background: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b', fontFamily: "'Outfit',sans-serif" }}>Payment History</h2>
          </div>
          {loading ? <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading...</div> :
          payments.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💳</div>
              <p style={{ fontWeight: 600 }}>No payments yet</p>
            </div>
          ) : (
            <div>
              {payments.map((p, i) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: i < payments.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>Municipal Bill Payment</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.2rem' }}>📅 {new Date(p.paymentDate).toLocaleDateString()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: '#059669', fontSize: '1.05rem', fontFamily: "'Outfit',sans-serif" }}>₹{parseFloat(p.amount).toFixed(2)}</div>
                    <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: '999px', padding: '0.1rem 0.6rem', fontSize: '0.68rem', fontWeight: 700 }}>✓ {p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {paymentModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '1.25rem', width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', fontFamily: "'Outfit',sans-serif" }}>Select Payment</h2>
              <button onClick={() => setPaymentModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.1rem', color: '#64748b' }}>✕</button>
            </div>
            
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: '0.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Amount to Pay</div>
              <div style={{ color: '#10b981', fontSize: '2.5rem', fontWeight: 900, fontFamily: "'Outfit',sans-serif", margin: '0.5rem 0' }}>₹{parseFloat(amount).toFixed(2)}</div>
            </div>

            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.75rem' }}>Select Payment Method</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['UPI / QR Code', 'Credit/Debit Card', 'Net Banking'].map(method => (
                <button 
                  key={method} 
                  onClick={() => processPayment(method)}
                  style={{ padding: '1rem', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '0.75rem', fontWeight: 600, color: '#1e293b', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.2s', textAlign: 'left' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <span>{method}</span>
                  <span style={{ color: '#94a3b8' }}>→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenPayments;
