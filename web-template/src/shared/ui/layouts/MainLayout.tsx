import { Layout, theme, Drawer, ConfigProvider, 
  //Dropdown, Avatar,  Input, Button,  Switch 
} from 'antd';
import {
  LogoutOutlined, ProfileOutlined,
  //MenuOutlined, UserOutlined, DownOutlined, BulbOutlined, GlobalOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import type { MenuProps } from 'antd';
import { Outlet } from 'react-router-dom';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { useTranslation } from 'react-i18next';
//import { languageItems, handleLanguageChange } from '../../i18n';
import Sidebar from './Sidebar';
import Header from './Header';


const {  Sider, Content, Footer } = Layout;

export interface MainLayoutProps {
  handleLanguageChange: MenuProps['onClick'];
  languageItems: MenuProps['items'];
}


const MainLayout = ({
  handleLanguageChange,
  languageItems,
}: MainLayoutProps) =>  {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const screens = useBreakpoint();
  const { t } = useTranslation();

  const currentTheme = isDark ? theme.darkAlgorithm : theme.defaultAlgorithm;

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    if (key === 'profile') {
      alert('Go to profile page');
    }
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: t('profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('logout'),
    },
  ];

  // const menuContent = (
  //   <Menu
  //     theme={isDark ? 'dark' : 'light'}
  //     mode="inline"
  //     defaultSelectedKeys={['1']}
  //     items={[
  //       { key: '1', icon: <UserOutlined />, label: t('menu.intro') },
  //       { key: '2', icon: <UserOutlined />, label: t('menu.design') },
  //       { key: '3', icon: <UserOutlined />, label: t('menu.cases') },
  //     ]}
  //   />
  // );

  return (
    <ConfigProvider theme={{ algorithm: currentTheme }}>
      <Layout style={{ minHeight: '100vh' }}>
          <Header
          isDark={isDark}
          setIsDark={setIsDark}
          screens={screens}
          t={t}
          languageItems={languageItems}
          handleLanguageChange={handleLanguageChange}
          userMenuItems={userMenuItems}
          handleMenuClick={handleMenuClick}
          setMobileOpen={setMobileOpen}
        />

        {/* <Header
          style={{
            background: isDark ? '#141414' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
          }}
        >
          <div
            style={{ color: isDark ? 'white' : 'black', fontSize: 20, fontWeight: 'bold', marginRight: 16, display: 'flex', alignItems: 'center' }}
          >
            {!screens.lg && (
              <Button
                type="text"
                icon={<MenuOutlined style={{ color: isDark ? 'white' : 'black' }} />}
                onClick={() => setMobileOpen(true)}
              />
            )}
            <span style={{ marginLeft: 8 }}>{t('logo')}</span>
          </div>
          {screens.lg && (
            <Input.Search placeholder={t('search.placeholder')} style={{ maxWidth: 320 }} allowClear />
          )}
          <div style={{ flex: 1 }} />
          <Dropdown
            menu={{ items: languageItems, onClick: handleLanguageChange }}
            placement="bottomRight"
          >
            <GlobalOutlined style={{ fontSize: 18, marginRight: 16, cursor: 'pointer', color: isDark ? 'white' : 'black' }} />
          </Dropdown>
          <Switch
            checkedChildren={<BulbOutlined />}
            unCheckedChildren={<BulbOutlined />}
            checked={isDark}
            onChange={setIsDark}
            style={{ marginRight: 16 }}
          />
          <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} placement="bottomRight">
            <div style={{ color: isDark ? 'white' : 'black', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} size="small" />
              <DownOutlined style={{ fontSize: 10 }} />
            </div>
          </Dropdown>
        </Header> */}
        <Layout style={{ flex: 1 }}>
          {screens.lg ? (
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={setCollapsed}
              width={208}
              theme={isDark ? 'dark' : 'light'}
            >
              {/* {menuContent} */}
              <Sidebar />
            </Sider>
          ) : (
            <Drawer
              title={t('menu.title')}
              placement="left"
              onClose={() => setMobileOpen(false)}
              open={mobileOpen}
              styles={{ body: { padding: 0 } }}
            >
              {/* {menuContent} */}
              <Sidebar />
            </Drawer>
          )}
          <Layout style={{ flex: 1 }}>
            <Content style={{ padding: 24, margin: 0 }}>
              <Outlet />
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              {t('footer')}
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
