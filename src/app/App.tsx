import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import UserListPage from '@/features/users/pages/UserListPage';
import SettingsPage from '@/features/settings/pages/SettingsPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { TabProvider } from '@/app/providers/TabProvider';
import RequireAuth from '@/app/router/guards/RequireAuth';
import { setNavigator } from '@/app/router/navigator';
import MainLayout from '@/shared/ui/layouts/MainLayout';
import ResponsiveTabsLayout from '@/shared/ui/layouts/ResponsiveTabsLayout';

const NavigatorHandler = (): null => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return null;
};

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <NavigatorHandler />
      <AuthProvider>
        <TabProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<RequireAuth />}>
              <Route element={<MainLayout />}>
                <Route element={<ResponsiveTabsLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="users" element={<UserListPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </TabProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
