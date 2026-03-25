import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { useContext } from 'react';

// Layouts
import Navbar from './components/layout/Navbar';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Citizen Pages
import CitizenDashboard from './pages/citizen/Dashboard';
import Complaints from './pages/citizen/Complaints';
import ApplyService from './pages/citizen/ApplyService';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageComplaints from './pages/admin/ManageComplaints';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'Admin' ? '/admin' : '/citizen'} replace />;
  }
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">{children}</div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Citizen Routes */}
          <Route path="/citizen" element={<ProtectedRoute allowedRoles={['Citizen']}><CitizenDashboard /></ProtectedRoute>} />
          <Route path="/citizen/complaints" element={<ProtectedRoute allowedRoles={['Citizen']}><Complaints /></ProtectedRoute>} />
          <Route path="/citizen/apply" element={<ProtectedRoute allowedRoles={['Citizen']}><ApplyService /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/complaints" element={<ProtectedRoute allowedRoles={['Admin']}><ManageComplaints /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
