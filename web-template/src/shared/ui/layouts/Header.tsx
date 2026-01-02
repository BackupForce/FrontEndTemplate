import { Layout, Dropdown, Avatar, Input, Button, Switch } from "antd";
import type { MenuProps } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  DownOutlined,
  BulbOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

export interface HeaderProps {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  screens: Partial<Record<string, boolean>>;
  t: (key: string) => string;
  languageItems: MenuProps["items"];
  handleLanguageChange: MenuProps["onClick"];
  userMenuItems: MenuProps["items"];
  handleMenuClick: MenuProps["onClick"];
  setMobileOpen: (open: boolean) => void;
}

const tempHeader = ({
  isDark,
  setIsDark,
  screens,
  t,
  languageItems,
  handleLanguageChange,
  userMenuItems,
  handleMenuClick,
  setMobileOpen,
}: HeaderProps) => {
  return (
    <Header
      style={{
        background: isDark ? "#141414" : "#ffffff",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
      }}
    >
      <div
        style={{
          color: isDark ? "white" : "black",
          fontSize: 20,
          fontWeight: "bold",
          marginRight: 16,
          display: "flex",
          alignItems: "center",
        }}
      >
        {!screens.lg && (
          <Button
            type="text"
            icon={
              <MenuOutlined style={{ color: isDark ? "white" : "black" }} />
            }
            onClick={() => setMobileOpen(true)}
          />
        )}
        <span style={{ marginLeft: 8 }}>{t("logo")}</span>
      </div>
      {screens.lg && (
        <Input.Search
          placeholder={t("search.placeholder")}
          style={{ maxWidth: 320 }}
          allowClear
        />
      )}
      <div style={{ flex: 1 }} />
      <Dropdown
        menu={{ items: languageItems, onClick: handleLanguageChange }}
        placement="bottomRight"
      >
        <GlobalOutlined
          style={{
            fontSize: 18,
            marginRight: 16,
            cursor: "pointer",
            color: isDark ? "white" : "black",
          }}
        />
      </Dropdown>
      <Switch
        checkedChildren={<BulbOutlined />}
        unCheckedChildren={<BulbOutlined />}
        checked={isDark}
        onChange={setIsDark}
        style={{ marginRight: 16 }}
      />
      <Dropdown
        menu={{ items: userMenuItems, onClick: handleMenuClick }}
        placement="bottomRight"
      >
        <div
          style={{
            color: isDark ? "white" : "black",
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <Avatar icon={<UserOutlined />} size="small" />
          <DownOutlined style={{ fontSize: 10 }} />
        </div>
      </Dropdown>
    </Header>
  );
};

export default tempHeader;
