import { useState, useEffect } from 'react';
import api from '../../api/axios';

const ApplyService = () => {
  const [services, setServices] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [svcRes, appRes] = await Promise.all([
        api.get('/services'),
        api.get('/services/applications')
      ]);
      setServices(svcRes.data);
      setApplications(appRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (serviceId, amount) => {
    if (window.confirm(`Applying for this service costs $${amount}. Mock payment will be processed.`)) {
      try {
        await api.post(`/services/apply/${serviceId}`);
        await api.post(`/payments`, amount); // Mock payment
        alert('Application submitted & mock payment successful!');
        fetchData();
      } catch (e) {
        alert('Action failed');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="py-6 grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Available Services</h2>
        <div className="space-y-4">
          {services.map(s => (
            <div key={s.id} className="bg-white p-4 rounded shadow border border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="font-bold">{s.name}</h3>
                <p className="text-gray-600">Fee: ${s.amount}</p>
              </div>
              <button onClick={() => handleApply(s.id, s.amount)} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                Apply & Pay
              </button>
            </div>
          ))}
          {services.length === 0 && <p className="text-gray-500">No services created yet (Admin needs to add them).</p>}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">My Applications</h2>
        <div className="space-y-4">
          {applications.map(a => (
            <div key={a.id} className="bg-white p-4 rounded shadow border border-gray-200">
              <div className="flex justify-between">
                <h3 className="font-bold">{a.service?.name}</h3>
                <span className={`text-sm ${a.status === 'Approved' ? 'text-green-600' : a.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                  {a.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Applied: {new Date(a.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
          {applications.length === 0 && <p className="text-gray-500">No applications found.</p>}
        </div>
      </div>
    </div>
  );
};

export default ApplyService;
