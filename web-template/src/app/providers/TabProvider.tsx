import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface TabItem {
  key: string;
  title: string;
  path: string;
}

interface TabContextValue {
  tabs: TabItem[];
  activeKey: string;
  openTab: (path: string, title: string) => void;
  closeTab: (key: string) => void;
  setActiveKey: (key: string) => void;
  updateTabTitle: (key: string, newTitle: string) => void;
}

const TabContext = createContext<TabContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTabContext 必須在 TabProvider 裡面使用");
  }
  return context;
};

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [tabs, setTabs] = useState<TabItem[]>(() => {
    const stored = localStorage.getItem("tabs");
    try {
      return stored
        ? JSON.parse(stored)
        : [{ key: "/", title: "首頁", path: "/" }];
    } catch {
      return [{ key: "/", title: "首頁", path: "/" }];
    }
  });

  const [activeKey, setActiveKeyState] = useState<string>(() => {
    return localStorage.getItem("activeTab") || "/";
  });

  const setActiveKey = (key: string) => {
    setActiveKeyState(key);
    localStorage.setItem("activeTab", key);
  };

  const openTab = useCallback(
    (path: string, title: string) => {
      setTabs((prevTabs) => {
        if (!prevTabs.find((tab) => tab.key === path)) {
          const newTabs = [...prevTabs, { key: path, title, path }];
          localStorage.setItem("tabs", JSON.stringify(newTabs));
          return newTabs;
        }
        return prevTabs;
      });
      setActiveKey(path);
      navigate(path);
    },
    [navigate]
  );

  const closeTab = useCallback(
    (key: string) => {
      setTabs((prevTabs) => {
        const newTabs = prevTabs.filter((tab) => tab.key !== key);
        localStorage.setItem("tabs", JSON.stringify(newTabs));
        if (activeKey === key && newTabs.length > 0) {
          const fallback = newTabs[newTabs.length - 1].key;
          setActiveKey(fallback);
          navigate(fallback);
        }
        return newTabs;
      });
    },
    [activeKey, navigate]
  );

  const updateTabTitle = useCallback(
    (key: string, newTitle: string) => {
      setTabs((prevTabs) => {
        const updatedTabs = prevTabs.map((tab) =>
          tab.key === key ? { ...tab, title: newTitle } : tab
        );
        localStorage.setItem("tabs", JSON.stringify(updatedTabs));
        return updatedTabs;
      });
    },
    []
  );

  return (
    <TabContext.Provider
      value={{
        tabs,
        activeKey,
        openTab,
        closeTab,
        setActiveKey,
        updateTabTitle,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};
