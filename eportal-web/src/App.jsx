import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageDepartments from './pages/admin/ManageDepartments';
import ManageEmployees from './pages/admin/ManageEmployees';
import ManageComplaints from './pages/admin/ManageComplaints';
import ManageServices from './pages/admin/ManageServices';
import ManageBills from './pages/admin/ManageBills';

// Citizen pages
import CitizenDashboard from './pages/citizen/Dashboard';
import CitizenComplaints from './pages/citizen/Complaints';
import CitizenServices from './pages/citizen/Services';
import CitizenBills from './pages/citizen/Bills';
import UtilityBills from './pages/citizen/UtilityBills';
import CitizenFeedback from './pages/citizen/Feedback';

// Employee pages
import EmployeeDashboard from './pages/employee/Dashboard';

function ProtectedRoute({ children, roles }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute roles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/departments" element={<ProtectedRoute roles={['Admin']}><ManageDepartments /></ProtectedRoute>} />
          <Route path="/admin/employees" element={<ProtectedRoute roles={['Admin']}><ManageEmployees /></ProtectedRoute>} />
          <Route path="/admin/complaints" element={<ProtectedRoute roles={['Admin']}><ManageComplaints /></ProtectedRoute>} />
          <Route path="/admin/services" element={<ProtectedRoute roles={['Admin']}><ManageServices /></ProtectedRoute>} />
          <Route path="/admin/bills" element={<ProtectedRoute roles={['Admin']}><ManageBills /></ProtectedRoute>} />

          {/* Citizen routes */}
          <Route path="/citizen" element={<ProtectedRoute roles={['Citizen']}><CitizenDashboard /></ProtectedRoute>} />
          <Route path="/citizen/complaints" element={<ProtectedRoute roles={['Citizen']}><CitizenComplaints /></ProtectedRoute>} />
          <Route path="/citizen/services" element={<ProtectedRoute roles={['Citizen']}><CitizenServices /></ProtectedRoute>} />
          <Route path="/citizen/bills" element={<ProtectedRoute roles={['Citizen']}><CitizenBills /></ProtectedRoute>} />
          <Route path="/citizen/utility" element={<ProtectedRoute roles={['Citizen']}><UtilityBills /></ProtectedRoute>} />
          <Route path="/citizen/feedback" element={<ProtectedRoute roles={['Citizen']}><CitizenFeedback /></ProtectedRoute>} />

          {/* Employee routes */}
          <Route path="/employee" element={<ProtectedRoute roles={['Employee']}><EmployeeDashboard /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
