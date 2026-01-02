import { useContext } from 'react';
import { AuthContext } from '@/core/context/AuthContext'; // 注意要 export AuthContext

export const useAuth = () => useContext(AuthContext);
