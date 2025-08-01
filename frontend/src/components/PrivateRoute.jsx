import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // make sure the path is correct

const PrivateRoute = () => {
  const { userInfo } = useAuth();
  const location = useLocation();

  return userInfo ? (
    <Outlet />
  ) : (
    <Navigate to='/login' replace state={{ from: location }} />
  );
};

export default PrivateRoute;
