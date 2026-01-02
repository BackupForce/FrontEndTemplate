import { Tabs, Grid } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTabContext } from "@/app/providers/TabProvider";

const { useBreakpoint } = Grid;

export default function ResponsiveTabsLayout() {
  const screens = useBreakpoint();
  const location = useLocation();
  const navigate = useNavigate();
  const { tabs, activeKey, setActiveKey, closeTab } = useTabContext();

  // ✅ 只同步 activeKey，不自動新增 tab
  useEffect(() => {
    setActiveKey(location.pathname);
  }, [location.pathname, setActiveKey]);

  // 手機不顯示 tabs，直接顯示內容
  if (screens.xs) {
    return <Outlet />;
  }

  return (
    <Tabs
      type="editable-card"
      hideAdd
      activeKey={activeKey}
      onChange={(key) => {
        setActiveKey(key);
        navigate(key);
      }}
      onEdit={(key, action) => {
        if (action === "remove") {
          closeTab(key as string);
        }
      }}
      items={tabs.map((tab) => ({
        key: tab.key,
        label: tab.title,
        children: <Outlet />,
        closable: tab.key !== "/", // 或視需要改為 true
      }))}
    />
  );
}
