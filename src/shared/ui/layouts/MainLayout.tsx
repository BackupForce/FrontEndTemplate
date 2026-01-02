import { MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, SunOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, ConfigProvider, Dropdown, Layout, Space, Switch, Typography, theme as antdTheme, Drawer } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import Sidebar from './Sidebar';
import { tCommon } from '@/shared/i18n/helpers';

const { Header, Content, Sider, Footer } = Layout;

const MainLayout = (): JSX.Element => {
  const { User, SignOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

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

  const themeConfig = useMemo(() => {
    return {
      algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm
    };
  }, [isDarkMode]);

  const userMenu = {
    items: [
      {
        key: 'logout',
        label: tCommon('logout'),
        onClick: (): void => {
          void SignOut();
        }
      }
    ]
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <Layout style={{ minHeight: '100vh' }}>
        {!isMobile && (
          <Sider width={220} collapsible theme={isDarkMode ? 'dark' : 'light'}>
            <div style={{ padding: '12px', color: isDarkMode ? '#fff' : '#111', fontWeight: 600 }}>
              {tCommon('appTitle')}
            </div>
            <Sidebar />
          </Sider>
        )}
        <Layout>
          <Header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingInline: 16
            }}
          >
            <Space>
              {isMobile && (
                <Button
                  icon={drawerOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  type="text"
                  onClick={(): void => {
                    setDrawerOpen((open) => !open);
                  }}
                />
              )}
              <Typography.Title level={5} style={{ margin: 0 }}>
                {tCommon('appTitle')}
              </Typography.Title>
              <Space>
                <SunOutlined />
                <Switch
                  checked={isDarkMode}
                  onChange={(checked): void => {
                    setIsDarkMode(checked);
                  }}
                  aria-label={tCommon('theme.toggle')}
                />
                <MoonOutlined />
              </Space>
            </Space>
            <Dropdown menu={userMenu} trigger={['click']}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <Typography.Text>{User?.Name ?? 'Guest'}</Typography.Text>
              </Space>
            </Dropdown>
          </Header>
          <Content style={{ padding: 16 }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design Template</Footer>
        </Layout>
        <Drawer
          placement="left"
          open={drawerOpen}
          onClose={(): void => {
            setDrawerOpen(false);
          }}
          width={220}
          styles={{ body: { padding: 0 } }}
        >
          <Sidebar
            onNavigate={(): void => {
              setDrawerOpen(false);
            }}
          />
        </Drawer>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
