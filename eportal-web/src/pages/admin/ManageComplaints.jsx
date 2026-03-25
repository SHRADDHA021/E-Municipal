import { useState, useEffect } from 'react';
import api from '../../api/axios';

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [employees, setEmployees] = useState([]); // In real app, fetch from /admin/employees
  const [proofImage, setProofImage] = useState(null);

  useEffect(() => {
    fetchComplaints();
    // mock employees
    setEmployees([{ id: 1, name: 'John Doe - Sanitation' }, { id: 2, name: 'Jane Smith - Water' }]);
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get('/complaints');
      setComplaints(data);
    } catch (e) { console.error('Error fetching complaints', e); }
  };

  const handleAssign = async (complaintId, employeeId) => {
    try {
      await api.put(`/complaints/${complaintId}/assign`, { employeeId: parseInt(employeeId) });
      fetchComplaints();
    } catch (e) { alert('Failed to assign'); }
  };

  const handleStatusUpdate = async (complaintId, status) => {
    try {
      const formData = new FormData();
      formData.append('Status', status);
      if (status === 'Completed' && proofImage) {
        formData.append('ProofImage', proofImage);
      }
      await api.put(`/complaints/${complaintId}/status`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      setProofImage(null);
      fetchComplaints();
    } catch (e) { alert('Failed to update status'); }
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Manage All Complaints</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {complaints.map(c => (
              <tr key={c.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">#{c.id} - {c.title}</div>
                  <div className="text-sm text-gray-500">Citizen: {c.userId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${c.status === 'Completed' ? 'bg-green-100 text-green-800' : c.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select 
                    value={c.assignedEmployeeId || ''} 
                    onChange={e => handleAssign(c.id, e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm"
                    disabled={c.status === 'Completed'}
                  >
                    <option value="" disabled>Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                  {c.status !== 'Completed' && (
                    <>
                      <button onClick={() => handleStatusUpdate(c.id, 'In Progress')} className="text-blue-600 hover:text-blue-900 border px-2 py-1 rounded">Set In Progress</button>
                      
                      <div className="flex border p-1 rounded items-center">
                        <input type="file" onChange={e => setProofImage(e.target.files[0])} className="text-xs mr-2 w-32" />
                        <button onClick={() => handleStatusUpdate(c.id, 'Completed')} className="text-green-600 hover:text-green-900 font-bold px-2 py-1 rounded bg-green-50">Complete</button>
                      </div>
                    </>
                  )}
                  {c.imageUrl && (
                    <a href={`http://localhost:5000${c.imageUrl}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-900 px-2 py-1">View Evidence</a>
                  )}
                </td>
              </tr>
            ))}
            {complaints.length === 0 && <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No complaints found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageComplaints;
