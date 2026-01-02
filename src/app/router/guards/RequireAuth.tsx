import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

const RequireAuth = (): JSX.Element => {
  const { IsAuthenticated } = useAuth();
  const location = useLocation();

  if (!IsAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
