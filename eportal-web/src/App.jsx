import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { useContext } from 'react';

import Sidebar from './components/layout/Sidebar';

// Auth
import Login    from './pages/auth/Login';
import Register from './pages/auth/Register';

// Citizen
import CitizenDashboard from './pages/citizen/Dashboard';
import Complaints       from './pages/citizen/Complaints';
import ApplyService     from './pages/citizen/ApplyService';
import CitizenSchedules from './pages/citizen/Schedules';
import CitizenPayments  from './pages/citizen/Payments';

// Admin
import AdminDashboard    from './pages/admin/Dashboard';
import ManageComplaints  from './pages/admin/ManageComplaints';
import ManageServices    from './pages/admin/ManageServices';
import ManageSchedules   from './pages/admin/ManageSchedules';
import ManageEmployees   from './pages/admin/ManageEmployees';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'Admin' ? '/admin' : '/citizen'} replace />;
  }
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Inter',sans-serif" }}>
      <Sidebar />
      <main style={{ marginLeft: '240px', flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"               element={<Navigate to="/login" replace />} />
          <Route path="/login"          element={<Login />} />
          <Route path="/register"       element={<Register />} />

          {/* Citizen */}
          <Route path="/citizen"              element={<ProtectedRoute allowedRoles={['Citizen']}><CitizenDashboard /></ProtectedRoute>} />
          <Route path="/citizen/complaints"   element={<ProtectedRoute allowedRoles={['Citizen']}><Complaints /></ProtectedRoute>} />
          <Route path="/citizen/apply"        element={<ProtectedRoute allowedRoles={['Citizen']}><ApplyService /></ProtectedRoute>} />
          <Route path="/citizen/schedules"    element={<ProtectedRoute allowedRoles={['Citizen']}><CitizenSchedules /></ProtectedRoute>} />
          <Route path="/citizen/payments"     element={<ProtectedRoute allowedRoles={['Citizen']}><CitizenPayments /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin"                element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/complaints"     element={<ProtectedRoute allowedRoles={['Admin']}><ManageComplaints /></ProtectedRoute>} />
          <Route path="/admin/services"       element={<ProtectedRoute allowedRoles={['Admin']}><ManageServices /></ProtectedRoute>} />
          <Route path="/admin/schedules"      element={<ProtectedRoute allowedRoles={['Admin']}><ManageSchedules /></ProtectedRoute>} />
          <Route path="/admin/employees"      element={<ProtectedRoute allowedRoles={['Admin']}><ManageEmployees /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
