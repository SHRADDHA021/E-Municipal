import { useState, useEffect, useContext } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { AuthContext } from '../../contexts/AuthContext';

const inp = { display:'block', width:'100%', padding:'0.75rem 1rem', border:'1.5px solid #e2e8f0', borderRadius:'0.75rem', background:'#f8fafc', color:'#1e293b', fontSize:'1rem', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const btn = (col) => ({ padding:'0.8rem 1.5rem', borderRadius:'0.75rem', border:'none', cursor:'pointer', fontWeight:700, fontSize:'0.9rem', background: col === 'blue' ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : '#f1f5f9', color: col === 'blue' ? '#fff' : '#475569', width:'100%', marginTop:'1rem' });

export default function UtilityBills() {
  const [type, setType] = useState('Property Tax');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  const { user } = useContext(AuthContext);
  const [myBills, setMyBills] = useState([]);
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    if (user?.userId) {
      api.get('/bills').then(res => setMyBills(res.data)).catch(err => console.error(err));
      api.get('/serviceRequests/my').then(res => setMyRequests(res.data)).catch(err => console.error(err));
    }
  }, [user]);

  const handleFetch = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setBill(null);
    try {
      const { data } = await api.get(`/bills/fetch?type=${type}&consumerNumber=${consumerNumber}`);
      setBill(data);
    } catch (err) {
      setError(err?.response?.status === 404 ? 'No bill found for this ID/Number.' : 'Failed to fetch bill details.');
    } finally { setLoading(false); }
  };

  const handlePay = async () => {
    if (!bill) return;
    setPaying(true);
    try {
      await api.post(`/bills/${bill.bill_ID}/pay`, { paymentMethod: 'Card (Utility Portal)' });
      // Refresh
      const { data } = await api.get(`/bills/fetch?type=${type}&consumerNumber=${consumerNumber}`);
      setBill(data);
      alert('✅ Payment successful!');
    } catch {
      alert('❌ Payment failed.');
    } finally { setPaying(false); }
  };

  return (
    <Layout>
      <div style={{ maxWidth:'600px', margin:'0 auto', padding:'1rem' }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <h1 style={{ fontSize:'2.25rem', fontWeight:800, color:'#1e293b', margin:'0 0 0.5rem', fontFamily:"'Outfit',sans-serif" }}>Municipal Utilities</h1>
          <p style={{ color:'#64748b', fontSize:'1.1rem' }}>Pay your Property Tax, Water, or Electricity bills</p>
        </div>

        <div style={{ background:'#fff', borderRadius:'1.5rem', padding:'2rem', boxShadow:'0 10px 40px rgba(0,0,0,0.08)', border:'1px solid #f1f5f9' }}>
          <form onSubmit={handleFetch}>
            <div style={{ marginBottom:'1.5rem' }}>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.5rem' }}>Select Service</label>
              <select value={type} onChange={e => setType(e.target.value)} style={inp}>
                <option value="Property Tax">Property Tax</option>
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
              </select>
            </div>
            <div style={{ marginBottom:'1rem' }}>
              <label style={{ display:'block', fontWeight:600, color:'#374151', marginBottom:'0.5rem' }}>Property ID / Consumer Number</label>
              <input required value={consumerNumber} onChange={e => setConsumerNumber(e.target.value)} placeholder="e.g. PROP-123456" style={inp} />
            </div>
            <button type="submit" disabled={loading} style={btn('blue')}>
              {loading ? 'Searching...' : 'Fetch Bill Details'}
            </button>
          </form>

          {error && <div style={{ marginTop:'1.5rem', color:'#dc2626', background:'#fef2f2', padding:'1rem', borderRadius:'0.75rem', fontSize:'0.9rem', textAlign:'center', border:'1px solid #fecaca' }}>{error}</div>}

          {bill && (
            <div style={{ marginTop:'2.5rem', borderTop:'2px dashed #e2e8f0', paddingTop:'2rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                 <h3 style={{ margin:0, color:'#1e293b' }}>Bill Summary</h3>
                 <span style={{ fontSize:'0.75rem', fontWeight:800, padding:'0.2rem 0.6rem', borderRadius:'999px', background: bill.isPaid ? '#d1fae5' : '#fee2e2', color: bill.isPaid ? '#065f46' : '#991b1b' }}>
                    {bill.isPaid ? 'PAID' : 'PENDING'}
                 </span>
              </div>

              <div style={{ background:'#f8fafc', borderRadius:'1rem', padding:'1.5rem' }}>
                 {[
                    ['Consumer ID', bill.consumerNumber],
                    ['Owner Name', bill.citizenName || '—'],
                    ['Service', bill.billType],
                    ['Generated On', new Date(bill.p_date).toLocaleDateString()],
                    ['Due Date', bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : '—'],
                    ['Total Amount', `₹${bill.total_amt}`]
                 ].map(([k,v]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'0.6rem 0', borderBottom:'1px solid #e2e8f0' }}>
                        <span style={{ color:'#64748b', fontSize:'0.875rem' }}>{k}</span>
                        <span style={{ color:'#1e293b', fontWeight:700, fontSize:'0.875rem' }}>{v}</span>
                    </div>
                 ))}
              </div>

              {!bill.isPaid && (
                <button onClick={handlePay} disabled={paying} style={{ ...btn('blue'), height:'50px', fontSize:'1rem' }}>
                   {paying ? 'Processing...' : `Pay ₹${bill.total_amt} Now`}
                </button>
              )}
            </div>
          )}
        </div>

        {(myBills.length > 0 || myRequests.length > 0) && (
          <div style={{ marginTop:'3rem' }}>
            <h2 style={{ fontSize:'1.25rem', fontWeight:800, color:'#1e293b', marginBottom:'1.25rem', borderBottom:'2px solid #6366f1', display:'inline-block', paddingBottom:'0.25rem' }}>
              My Active Utility Tasks & Bills
            </h2>
            <div style={{ display:'grid', gap:'1rem' }}>
              {myBills.map(b => (
                <div key={b.bill_ID} style={{ background:'#fff', borderRadius:'1.25rem', padding:'1.25rem', border:'1px solid #e2e8f0', boxShadow:'0 4px 12px rgba(0,0,0,0.05)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontWeight:700, color:'#1e293b' }}>{b.billType} - {b.consumerNumber}</div>
                    <div style={{ fontSize:'0.8rem', color:'#64748b', marginTop:'0.2rem' }}>Due: {b.dueDate ? new Date(b.dueDate).toLocaleDateString() : 'N/A'}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontWeight:800, color:'#4f46e5', fontSize:'1.1rem' }}>₹{b.total_amt}</div>
                    <button onClick={() => { setBill(b); setType(b.billType); setConsumerNumber(b.consumerNumber); }} style={{ background:'none', border:'none', color:'#6366f1', fontSize:'0.75rem', fontWeight:700, cursor:'pointer', padding:0, marginTop:'0.3rem' }}>View Details →</button>
                  </div>
                </div>
              ))}
              {myRequests.map(r => (
                <div key={r.id} style={{ background:'#f8fafc', borderRadius:'1.25rem', padding:'1.25rem', border:'1px dashed #cbd5e1', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontWeight:700, color:'#475569' }}>Service: {r.serviceName || 'Task'}</div>
                    <div style={{ fontSize:'0.8rem', color:'#94a3b8', marginTop:'0.2rem' }}>Requested: {new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span style={{ fontSize:'0.7rem', fontWeight:800, padding:'0.2rem 0.6rem', borderRadius:'999px', background:'#eef2ff', color:'#6366f1' }}>
                    {r.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
