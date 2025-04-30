import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StoreOwnerRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== 'store_owner') {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default StoreOwnerRoute;
