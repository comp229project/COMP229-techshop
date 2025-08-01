import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { userInfo } = useAuth();
  const location = useLocation();

  return userInfo?.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to='/login' replace state={{ from: location }} />
  );
};

export default AdminRoute;
