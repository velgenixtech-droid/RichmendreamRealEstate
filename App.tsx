import React, { ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PropertiesPage from './pages/PropertiesPage';
import DealsPage from './pages/DealsPage';
import CommissionsPage from './pages/CommissionsPage';
import UsersPage from './pages/UsersPage';
import LeadsPage from './pages/LeadsPage';
import AgentsPage from './pages/AgentsPage';
import DocumentsPage from './pages/DocumentsPage';
import CallsPage from './pages/CallsPage';
import EmailsPage from './pages/EmailsPage'; // Import the new EmailsPage
import ProfilePage from './pages/ProfilePage';
import ReportsPage from './pages/ReportsPage';
import { NAV_ITEMS } from './constants';
import { UserRole } from './types';

const ProtectedRoute: React.FC<{ children: ReactNode; roles?: UserRole[] }> = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (roles && user && !roles.includes(user.role)) {
     return <Navigate to="/" replace />; // Or a dedicated "Access Denied" page
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    const agentAdminRoles = [UserRole.Admin, UserRole.Agent];
    
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
            <Route path="/properties" element={<ProtectedRoute><Layout><PropertiesPage /></Layout></ProtectedRoute>} />
            <Route path="/deals" element={<ProtectedRoute roles={agentAdminRoles}><Layout><DealsPage /></Layout></ProtectedRoute>} />
            <Route path="/commissions" element={<ProtectedRoute roles={agentAdminRoles}><Layout><CommissionsPage /></Layout></ProtectedRoute>} />
            <Route path="/leads" element={<ProtectedRoute roles={agentAdminRoles}><Layout><LeadsPage /></Layout></ProtectedRoute>} />
            <Route path="/agents" element={<ProtectedRoute roles={agentAdminRoles}><Layout><AgentsPage /></Layout></ProtectedRoute>} />
            <Route path="/documents" element={<ProtectedRoute roles={agentAdminRoles}><Layout><DocumentsPage /></Layout></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute roles={agentAdminRoles}><Layout><ReportsPage /></Layout></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute roles={[UserRole.Admin]}><Layout><UsersPage /></Layout></ProtectedRoute>} />
            <Route path="/calls" element={<ProtectedRoute roles={agentAdminRoles}><Layout><CallsPage /></Layout></ProtectedRoute>} />
            <Route path="/emails" element={<ProtectedRoute roles={agentAdminRoles}><Layout><EmailsPage /></Layout></ProtectedRoute>} />
            
            <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
    </AuthProvider>
  );
};

export default App;