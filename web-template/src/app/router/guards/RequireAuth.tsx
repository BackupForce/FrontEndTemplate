import { Navigate, Outlet } from 'react-router-dom';
import { authToken } from '@/core/auth/authToken';

export default function RequireAuth() {
  const token = authToken.get();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
