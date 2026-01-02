import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTabContext } from '@/app/providers/TabProvider';
import { tCommon } from '@/shared/i18n/helpers';
import { APP_ROUTES } from '@/app/router/routes';

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar = ({ onNavigate }: SidebarProps): JSX.Element => {
  const { openTab } = useTabContext();
  const navigate = useNavigate();
  const location = useLocation();

  const items = APP_ROUTES.map((route) => ({
    key: route.path,
    label: tCommon(route.titleKey)
  }));

  const handleClick = (path: string, titleKey?: string): void => {
    const label = titleKey ? tCommon(titleKey) : path;
    openTab(path, label, path, path !== '/');
    navigate(path);

    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      items={items}
      onClick={(info): void => {
        handleClick(info.key, APP_ROUTES.find((route) => route.path === info.key)?.titleKey);
      }}
    />
  );
};

export default Sidebar;
