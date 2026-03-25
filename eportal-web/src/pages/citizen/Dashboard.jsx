import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, Droplets, Calendar, CreditCard } from 'lucide-react';

const Dashboard = () => {
  const customCards = [
    { title: 'Register Complaint', icon: <AlertTriangle className="w-8 h-8 text-red-500" />, link: '/citizen/complaints' },
    { title: 'Apply for Service', icon: <FileText className="w-8 h-8 text-blue-500" />, link: '/citizen/apply' },
    { title: 'Pay Bills', icon: <CreditCard className="w-8 h-8 text-green-500" />, link: '/citizen/apply' }, // Simulated in apply/service
    { title: 'Schedules', icon: <Calendar className="w-8 h-8 text-purple-500" />, link: '/citizen/schedules' }
  ];

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Citizen Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {customCards.map((card, idx) => (
          <Link key={idx} to={card.link} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-center space-x-4 border border-gray-100">
            <div className="bg-gray-50 p-3 rounded-full">{card.icon}</div>
            <h3 className="text-lg font-medium text-gray-800">{card.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
