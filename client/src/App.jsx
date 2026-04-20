import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import SystemBanner from './components/SystemBanner';
// Pages Placeholder
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import JobDetails from './pages/JobDetails';
import CompleteProfile from './pages/CompleteProfile';
import Discovery from './pages/Discovery';
// Protected Route Component (Inline for now)
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminJobs from './pages/AdminJobs';
import AdminOverview from './pages/AdminOverview';
import MyApplications from './pages/MyApplications';
import KanbanTracker from './pages/KanbanTracker';
import AuditLogs from './pages/AuditLogs';
import AdminApplications from './pages/AdminApplications';
import AdminSettings from './pages/AdminSettings';
import ProviderDashboard from './pages/ProviderDashboard';
import Settings from './pages/Settings';
import ChatInbox from './pages/ChatInbox';
import { ChatProvider } from './context/ChatContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

const ProviderRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user && (user.role === 'job_provider' || user.role === 'admin') ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <SystemBanner />
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/jobs/:id" element={
                <ProtectedRoute>
                  <JobDetails />
                </ProtectedRoute>
              } />
              <Route path="/complete-profile" element={
                <ProtectedRoute>
                  <CompleteProfile />
                </ProtectedRoute>
              } />
              <Route path="/discovery" element={
                <ProtectedRoute>
                  <Discovery />
                </ProtectedRoute>
              } />
              <Route path="/applications" element={
                <ProtectedRoute>
                  <KanbanTracker />
                </ProtectedRoute>
              } />
              <Route path="/provider-dashboard" element={
                <ProviderRoute>
                  <ProviderDashboard />
                </ProviderRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <ChatInbox />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }>
                <Route index element={<AdminOverview />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="jobs" element={<AdminJobs />} />
                <Route path="applications" element={<AdminApplications />} />
                <Route path="audit" element={<AuditLogs />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
