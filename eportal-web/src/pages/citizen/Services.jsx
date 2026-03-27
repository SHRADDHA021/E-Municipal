import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function CitizenServices() {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState([]);
  const [uploadModal, setUploadModal] = useState(null);
  const [billModal, setBillModal] = useState(null);
  const [payModal, setPayModal] = useState(null);
  const [files, setFiles] = useState({}); // { sid: [File, File] }
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/services').then(r => { 
      setServices(r.data); 
      setLoading(false); 
    }).catch(() => setLoading(false));
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const toggleSelect = (sid) => {
    setSelected(prev => prev.includes(sid) ? prev.filter(x => x !== sid) : [...prev, sid]);
  };

  const handleGenerateBill = () => {
    if (!selected.length) return showToast('⚠️ Select at least one service');
    
    // Check if any service requires docs (Handle both sid/SID and requiredDocs/RequiredDocs)
    const needsDocs = services.filter(s => {
      const sid = s.sid ?? s.SID;
      const reqDocs = s.requiredDocs ?? s.RequiredDocs;
      const isSelected = selected.some(id => String(id) === String(sid));
      return isSelected && reqDocs && reqDocs.trim() !== "";
    });

    if (needsDocs.length > 0) {
      setUploadModal(needsDocs);
    } else {
      proceedToBill();
    }
  };

  const proceedToBill = () => {
    const selectedSvcs = services.filter(s => selected.some(id => String(id) === String(s.sid ?? s.SID)));
    const total = selectedSvcs.reduce((sum, s) => sum + (Number(s.rate ?? s.Rate ?? 0)), 0);
    setBillModal({ 
      services: selectedSvcs, 
      total, 
      billNo: `B-${Math.floor(Math.random() * 90000) + 10000}`, 
      date: new Date().toLocaleDateString() 
    });
    setUploadModal(null);
  };

  const handleFileChange = (sid, newFiles) => {
    setFiles(prev => ({ ...prev, [sid]: Array.from(newFiles) }));
  };

  const handleProceedToPay = () => { setPayModal(billModal); setBillModal(null); };

  const handlePay = async (method) => {
    try {
      const sids = payModal.services.map(s => s.sid);
      
      // 1. Create Bill
      const billRes = await api.post('/bills', { serviceIds: sids });
      const billId = billRes.data.bill_ID;

      // 2. Process Payment
      await api.post(`/bills/${billId}/pay`, { paymentMethod: method });

      // 3. Create Service Requests
      for (const svc of payModal.services) {
        const sid = svc.sid ?? svc.SID;
        const formData = new FormData();
        formData.append('SID', sid);
        formData.append('Bill_ID', billId);
        
        if (files[sid]) {
          files[sid].forEach(file => formData.append('Documents', file));
        }

        await api.post('/ServiceRequests/apply', formData);
      }

      setPayModal(null);
      setSelected([]);
      setFiles({});
      showToast(`✅ ₹${payModal.total} paid! Application submitted to Admin.`);
      setTimeout(() => navigate('/citizen/bills'), 1500);
    } catch (err) { 
      showToast('❌ ' + (err?.response?.data || 'Payment/Application failed')); 
    }
  };

  return (
    <Layout>
      {toast && <div style={{ position:'fixed', top:'2rem', right:'2rem', background:'#1e293b', color:'#fff', padding:'0.9rem 1.5rem', borderRadius:'0.75rem', boxShadow:'0 10px 25px rgba(0,0,0,0.2)', zIndex:9999, fontWeight:600 }}>{toast}</div>}

      {/* Upload Modal */}
      {uploadModal && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(15,23,42,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'1rem' }}>
          <div style={{ background:'#fff', padding:'2rem', borderRadius:'1.25rem', width:'100%', maxWidth:'500px', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 40px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize:'1.4rem', fontWeight:800, color:'#1e293b', marginBottom:'1.5rem' }}>📤 Upload Documents</h2>
            <p style={{ color:'#64748b', fontSize:'0.9rem', marginBottom:'1.5rem' }}>Please upload required documents for the selected services.</p>
            
            {uploadModal.map(s => (
              <div key={s.sid} style={{ marginBottom:'1.5rem', padding:'1rem', background:'#f8fafc', borderRadius:'0.75rem', border:'1.5px solid #e2e8f0' }}>
                <div style={{ fontWeight:700, color:'#1e293b', marginBottom:'0.25rem' }}>{s.sName}</div>
                <div style={{ fontSize:'0.75rem', color:'#6366f1', fontWeight:600, marginBottom:'0.75rem' }}>REQUIRED: {s.requiredDocs}</div>
                <input 
                  type="file" 
                  multiple 
                  onChange={(e) => handleFileChange(s.sid, e.target.files)}
                  style={{ fontSize:'0.8rem', width:'100%' }}
                />
              </div>
            ))}

            <div style={{ display:'flex', gap:'1rem' }}>
              <button onClick={() => setUploadModal(null)} style={{ flex:1, padding:'0.8rem', borderRadius:'0.75rem', background:'#f1f5f9', color:'#64748b', border:'none', fontWeight:700, cursor:'pointer' }}>Cancel</button>
              <button onClick={proceedToBill} style={{ flex:2, padding:'0.8rem', borderRadius:'0.75rem', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'#fff', border:'none', fontWeight:700, cursor:'pointer' }}>Continue →</button>
            </div>
          </div>
        </div>
      )}

      {/* Bill Modal */}
      {billModal && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(15,23,42,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'1rem' }}>
          <div style={{ background:'#fff', padding:'2rem', borderRadius:'1.25rem', width:'100%', maxWidth:'420px', boxShadow:'0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h2 style={{ margin:0, fontSize:'1.4rem', fontWeight:800, color:'#1e293b' }}>📄 Service Bill</h2>
              <button onClick={() => setBillModal(null)} style={{ background:'#f1f5f9', border:'none', width:'32px', height:'32px', borderRadius:'50%', cursor:'pointer', color:'#64748b' }}>✕</button>
            </div>
            <div style={{ border:'1px dashed #cbd5e1', padding:'1.5rem', borderRadius:'0.75rem', marginBottom:'1.25rem', background:'#fafafa' }}>
              <div style={{ textAlign:'center', borderBottom:'1px dashed #cbd5e1', paddingBottom:'1rem', marginBottom:'1rem' }}>
                <div style={{ fontWeight:800, fontSize:'1.1rem', color:'#0f172a' }}>E-Municipal Portal</div>
                <div style={{ color:'#64748b', fontSize:'0.75rem' }}>Official Service Receipt</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:'0.5rem', fontSize:'0.85rem' }}>
                <span style={{ color:'#64748b', fontWeight:600 }}>Bill No:</span><span>{billModal.billNo}</span>
              </div>
              <div style={{ marginTop:'1rem' }}>
                {billModal.services.map(s => (
                  <div key={s.sid} style={{ display:'flex', justifyContent:'space-between', padding:'0.35rem 0', borderBottom:'1px solid #f1f5f9', fontSize:'0.875rem' }}>
                    <span style={{ color:'#1e293b' }}>{s.sName}</span>
                    <span style={{ fontWeight:700, color:'#059669' }}>₹{s.rate}</span>
                  </div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between', paddingTop:'0.75rem', marginTop:'0.25rem', borderTop:'2px solid #1e293b' }}>
                  <span style={{ fontWeight:800, color:'#1e293b' }}>Total</span>
                  <span style={{ fontWeight:900, color:'#059669', fontSize:'1.2rem' }}>₹{billModal.total}</span>
                </div>
              </div>
            </div>
            <button onClick={handleProceedToPay} style={{ width:'100%', padding:'0.8rem', borderRadius:'0.75rem', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'#fff', border:'none', fontWeight:700, fontSize:'1rem', cursor:'pointer' }}>
              Proceed to Pay →
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {payModal && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(15,23,42,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'1rem' }}>
          <div style={{ background:'#fff', padding:'2rem', borderRadius:'1.25rem', width:'100%', maxWidth:'400px', boxShadow:'0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h2 style={{ margin:0, fontSize:'1.4rem', fontWeight:800, color:'#1e293b' }}>💳 Payment</h2>
              <button onClick={() => setPayModal(null)} style={{ background:'#f1f5f9', border:'none', width:'32px', height:'32px', borderRadius:'50%', cursor:'pointer', color:'#64748b' }}>✕</button>
            </div>
            <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'0.75rem', padding:'1.25rem', textAlign:'center', marginBottom:'1.5rem' }}>
              <div style={{ color:'#64748b', fontSize:'0.8rem', fontWeight:600 }}>Amount Due</div>
              <div style={{ color:'#059669', fontSize:'2.5rem', fontWeight:900 }}>₹{payModal.total}</div>
            </div>
            <h3 style={{ fontSize:'0.875rem', fontWeight:700, color:'#334155', marginBottom:'0.75rem' }}>Select Payment Method</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.65rem' }}>
              {[['📱 UPI / QR Code','UPI'],['💳 Credit/Debit Card','Card'],['🏦 Net Banking','NetBanking']].map(([label,val]) => (
                <button key={val} onClick={() => handlePay(val)} style={{ padding:'0.9rem', background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:'0.75rem', fontWeight:600, color:'#1e293b', cursor:'pointer', fontSize:'0.9rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span>{label}</span><span style={{ color:'#94a3b8' }}>→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#1e293b', margin:'0 0 0.3rem' }}>Available Services</h1>
        <p style={{ color:'#64748b', margin:0 }}>Select services and upload documents to apply</p>
      </div>

      {loading ? <div style={{ textAlign:'center', padding:'4rem', color:'#94a3b8' }}>Loading...</div> : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
            {services.map(s => {
              const sid = s.sid ?? s.SID;
              const sname = s.sName ?? s.SName;
              const rate = s.rate ?? s.Rate ?? 0;
              const reqDocs = s.requiredDocs ?? s.RequiredDocs;
              const deptName = s.department?.dName ?? s.department?.DName ?? 'Municipal Dept';

              const isSelected = selected.some(id => String(id) === String(sid));
              return (
                <div key={sid} onClick={() => toggleSelect(sid)} style={{ background:'#fff', borderRadius:'1rem', padding:'1.5rem', boxShadow:'0 4px 16px rgba(0,0,0,0.06)', cursor:'pointer', border: isSelected ? '2px solid #6366f1' : '2px solid transparent', transition:'all 0.2s' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, color:'#1e293b', fontSize:'1rem', marginBottom:'0.25rem' }}>{sname}</div>
                      <div style={{ fontSize:'0.75rem', color:'#94a3b8', marginBottom:'0.5rem' }}>{deptName}</div>
                      {reqDocs && reqDocs.trim() !== "" && (
                        <div style={{ fontSize:'0.7rem', color:'#6366f1', background:'#eef2ff', padding:'0.25rem 0.5rem', borderRadius:'0.5rem', display:'inline-block' }}>
                          📄 Needs: {reqDocs}
                        </div>
                      )}
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.4rem' }}>
                      <span style={{ background:'#d1fae5', color:'#065f46', borderRadius:'999px', padding:'0.2rem 0.65rem', fontSize:'0.8rem', fontWeight:800 }}>₹{rate}</span>
                      {isSelected && <span style={{ color:'#6366f1', fontSize:'1.2rem' }}>✓</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selected.length > 0 && (
            <div style={{ background:'linear-gradient(135deg,#6366f1,#4f46e5)', borderRadius:'1rem', padding:'1.25rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', color:'#fff', position:'sticky', bottom:'1.5rem', boxShadow:'0 10px 30px rgba(79,70,229,0.3)' }}>
              <div>
                <div style={{ fontWeight:700, fontSize:'1rem' }}>{selected.length} service(s) selected</div>
                <div style={{ opacity:0.85, fontSize:'0.875rem' }}>Total: ₹{services.filter(s => selected.includes(s.sid)).reduce((sum,s) => sum+s.rate, 0)}</div>
              </div>
              <button onClick={handleGenerateBill} style={{ padding:'0.7rem 1.5rem', borderRadius:'0.75rem', background:'#fff', color:'#6366f1', border:'none', fontWeight:800, cursor:'pointer', fontSize:'0.9rem' }}>
                Next: Upload Docs →
              </button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
