import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/admin/Dashboard';
import UserDashboard from './pages/user/Dashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import ChangePasswordPage from './pages/ChangePasswordPage';
import StoreListPage from './pages/StoreListPage';
import StoreDetailPage from './pages/StoreDetailPage';
import UserListPage from './pages/admin/UserListPage';
import StoreListPageAdmin from './pages/admin/StoreListPage';
import CreateUserPage from './pages/admin/CreateUserPage';
import CreateStorePage from './pages/admin/CreateStorePage';
import Navbar from './components/Navbar';

// Simplified route protection components
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/admin" />;
};

const StoreOwnerRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === 'store_owner' ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/stores" element={<StoreListPage />} />
            
            <Route path="/store/:id" element={
              <ProtectedRoute>
                <StoreDetailPage />
              </ProtectedRoute>
            } />
            
            <Route path="/change-password" element={
              <ProtectedRoute>
                <ChangePasswordPage />
              </ProtectedRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            <Route path="/admin/users" element={
              <AdminRoute>
                <UserListPage />
              </AdminRoute>
            } />
            
            <Route path="/admin/stores" element={
              <AdminRoute>
                <StoreListPageAdmin />
              </AdminRoute>
            } />
            
            <Route path="/admin/create-user" element={
              <AdminRoute>
                <CreateUserPage />
              </AdminRoute>
            } />
            
            <Route path="/admin/create-store" element={
              <AdminRoute>
                <CreateStorePage />
              </AdminRoute>
            } />
            
            {/* Store owner routes */}
            <Route path="/store-owner" element={
              <StoreOwnerRoute>
                <StoreOwnerDashboard />
              </StoreOwnerRoute>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;