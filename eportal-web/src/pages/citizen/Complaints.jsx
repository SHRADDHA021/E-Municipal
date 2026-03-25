import { useState, useEffect } from 'react';
import api from '../../api/axios';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', image: null });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get('/complaints');
      setComplaints(data);
    } catch (e) { console.error('Error fetching complaints', e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('Title', formData.title);
    data.append('Description', formData.description);
    if (formData.image) data.append('Image', formData.image);

    try {
      await api.post('/complaints', data, { headers: { 'Content-Type': 'multipart/form-data' }});
      setShowForm(false);
      setFormData({ title: '', description: '', image: null });
      fetchComplaints();
    } catch (err) { alert('Failed to create complaint'); }
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Complaints</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          {showForm ? 'Cancel' : 'New Complaint'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1 w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 w-full p-2 border rounded" rows="3"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium">Attach Image (Optional)</label>
              <input type="file" onChange={e => setFormData({...formData, image: e.target.files[0]})} className="mt-1" />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {complaints.map(c => (
          <div key={c.id} className="bg-white p-4 rounded shadow flex justify-between items-center bg-white border border-gray-200">
            <div>
              <h3 className="font-bold text-lg">{c.title}</h3>
              <p className="text-gray-600">{c.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                Created: {new Date(c.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${c.status === 'Completed' ? 'bg-green-100 text-green-800' : c.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                {c.status}
              </span>
              {c.proofImageUrl && (
                <a href={`http://localhost:5000${c.proofImageUrl}`} target="_blank" rel="noreferrer" className="block mt-2 text-blue-600 text-sm underline">
                  View Proof
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Complaints;
