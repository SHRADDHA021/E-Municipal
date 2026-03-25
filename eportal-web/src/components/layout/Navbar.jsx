import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to={user?.role === 'Admin' ? '/admin' : '/citizen'} className="text-xl font-bold tracking-tight">
          E-Municipal Portal
        </Link>
        <div className="flex items-center space-x-4">
          <span className="flex items-center text-sm">
             <User className="w-4 h-4 mr-1" />
             {user?.name} ({user?.role})
          </span>
          <button onClick={handleLogout} className="flex items-center bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm transition-colors">
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
