import { Tabs } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTabContext } from '@/app/providers/TabProvider';
import { APP_ROUTES } from '@/app/router/routes';
import { tCommon } from '@/shared/i18n/helpers';

const ResponsiveTabsLayout = (): JSX.Element => {
  const { tabs, activeKey, setActiveKey, closeTab, openTab } = useTabContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = (): void => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const exists = tabs.some((tab) => tab.Path === currentPath);

    if (!exists) {
      const route = APP_ROUTES.find((item) => item.path === currentPath);
      const title = route ? tCommon(route.titleKey) : currentPath;
      openTab(currentPath, title, currentPath, currentPath !== '/');
      if (!route) {
        navigate(currentPath);
      }
    }
  }, [location.pathname, navigate, openTab, tabs]);

  const tabItems = useMemo(
    () =>
      tabs.map((tab) => ({
        key: tab.Key,
        label: tab.Title,
        closable: tab.Closable
      })),
    [tabs]
  );

  if (isMobile) {
    return <Outlet />;
  }

  return (
    <div>
      <Tabs
        type="editable-card"
        hideAdd
        activeKey={activeKey}
        items={tabItems}
        onChange={(key): void => {
          setActiveKey(key);
        }}
        onEdit={(targetKey, action): void => {
          if (action === 'remove' && typeof targetKey === 'string') {
            closeTab(targetKey);
          }
        }}
      />
      <Outlet />
    </div>
  );
};

export default ResponsiveTabsLayout;
