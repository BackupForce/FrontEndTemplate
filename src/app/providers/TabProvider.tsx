import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface TabItem {
  Key: string;
  Title: string;
  Path: string;
  Closable: boolean;
}

export interface TabContextValue {
  tabs: TabItem[];
  activeKey: string;
  openTab(path: string, title: string, key?: string, closable?: boolean): void;
  closeTab(key: string): void;
  setActiveKey(key: string): void;
}

const TAB_STORAGE_KEY = 'app.tabs';

const TabContext = createContext<TabContextValue | undefined>(undefined);

const readInitialTabs = (): { tabs: TabItem[]; activeKey: string } => {
  const stored = localStorage.getItem(TAB_STORAGE_KEY);

  if (stored) {
    try {
      return JSON.parse(stored) as { tabs: TabItem[]; activeKey: string };
    } catch (error) {
      console.error('Failed to parse stored tabs', error);
    }
  }

  const defaultTab: TabItem = {
    Key: '/',
    Title: 'Dashboard',
    Path: '/',
    Closable: false
  };

  return { tabs: [defaultTab], activeKey: defaultTab.Key };
};

export const TabProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [{ tabs, activeKey }, setTabState] = useState<{ tabs: TabItem[]; activeKey: string }>(readInitialTabs);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(TAB_STORAGE_KEY, JSON.stringify({ tabs, activeKey }));
  }, [activeKey, tabs]);

  const openTab = useCallback(
    (path: string, title: string, key?: string, closable = true): void => {
      setTabState((prev) => {
        const tabKey = key ?? path;
        const existing = prev.tabs.find((tab) => tab.Key === tabKey);

        if (existing) {
          return { ...prev, activeKey: tabKey };
        }

        const newTab: TabItem = {
          Key: tabKey,
          Title: title,
          Path: path,
          Closable: closable
        };

        return { tabs: [...prev.tabs, newTab], activeKey: tabKey };
      });
      navigate(path);
    },
    [navigate]
  );

  const closeTab = useCallback(
    (key: string): void => {
      setTabState((prev) => {
        const filtered = prev.tabs.filter((tab) => tab.Key !== key);
        const wasActive = prev.activeKey === key;
        let nextActiveKey = prev.activeKey;

        if (wasActive) {
          const fallbackTab = filtered[filtered.length - 1] ?? filtered[0];
          nextActiveKey = fallbackTab ? fallbackTab.Key : '/';
          if (fallbackTab) {
            navigate(fallbackTab.Path);
          }
        }

        return { tabs: filtered, activeKey: nextActiveKey };
      });
    },
    [navigate]
  );

  const setActiveKey = useCallback(
    (key: string): void => {
      const targetTab = tabs.find((tab) => tab.Key === key);

      if (targetTab) {
        navigate(targetTab.Path);
        setTabState((prev) => ({ ...prev, activeKey: key }));
      }
    },
    [navigate, tabs]
  );

  const value = useMemo<TabContextValue>(
    () => ({ tabs, activeKey, openTab, closeTab, setActiveKey }),
    [activeKey, closeTab, openTab, setActiveKey, tabs]
  );

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};

export const useTabContext = (): TabContextValue => {
  const context = useContext(TabContext);

  if (!context) {
    throw new Error('useTabContext must be used within TabProvider');
  }

  return context;
};
