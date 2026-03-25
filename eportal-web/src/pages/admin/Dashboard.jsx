import { useState, useEffect } from 'react';
import { Users, AlertCircle, CheckCircle, DollarSign } from 'lucide-react';
import api from '../../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCitizens: 0,
    pendingComplaints: 0,
    completedComplaints: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats({
        totalCitizens: data.totalCitizens || 0,
        pendingComplaints: data.pendingComplaints || 0,
        completedComplaints: data.completedComplaints || 0,
        totalRevenue: data.totalRevenue || 0
      });
    } catch (e) { console.error('Error fetching admin stats', e); }
  };

  const statCards = [
    { title: 'Total Citizens', value: stats.totalCitizens, icon: <Users className="w-8 h-8 text-blue-500" />, bgColor: 'bg-blue-50' },
    { title: 'Pending Complaints', value: stats.pendingComplaints, icon: <AlertCircle className="w-8 h-8 text-yellow-500" />, bgColor: 'bg-yellow-50' },
    { title: 'Resolved Complaints', value: stats.completedComplaints, icon: <CheckCircle className="w-8 h-8 text-green-500" />, bgColor: 'bg-green-50' },
    { title: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: <DollarSign className="w-8 h-8 text-purple-500" />, bgColor: 'bg-purple-50' }
  ];

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
            <div className={`${card.bgColor} p-4 rounded-full mb-4`}>
              {card.icon}
            </div>
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{card.title}</h3>
            <span className="text-3xl font-bold mt-2 text-gray-800">{card.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
