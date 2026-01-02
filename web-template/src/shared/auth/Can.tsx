import type { ReactNode } from 'react';
import { useAuth } from '@/shared/auth/useAuth';

interface CanProps {
  permission: string;
  children: ReactNode;
}

const Can = ({ permission, children }: CanProps) => {
  const { hasPermission } = useAuth();
  return hasPermission(permission) ? <>{children}</> : null;
};

export default Can;

