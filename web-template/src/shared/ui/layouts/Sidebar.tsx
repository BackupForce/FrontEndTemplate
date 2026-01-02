import { Menu } from "antd";
//import { useNavigate } from "react-router-dom";
import { useTabContext } from "@/app/providers/TabProvider";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/shared/auth/useAuth";

const Sidebar = () => {
  const { hasPermission } = useAuth();
  //const navigate = useNavigate();
  const { t } = useTranslation();

  const items: MenuProps["items"] = [
    {
      key: "sub1",
      label: "Navigation One",
      icon: <MailOutlined />,
      children: [
        {
          key: "g1",
          label: t("menu.systemmangerment"),
          type: "group",
          children: [
            hasPermission("users:view") && {
              key: "1",
              label: t("menu.users"),
            },
            hasPermission("company:view") && {
              key: "2",
              label: t("menu.companys"),
            },
            hasPermission("partner:view") && {
              key: "3",
              label: t("menu.partners"),
            },
            hasPermission("financial-account:view") && {
              key: "11",
              label: t("menu.financial-accounts"),
            },
          ].filter(Boolean) as MenuProps["items"],
        },
      ],
    },
    {
      type: "divider",
    },
    {
      key: "sub2",
      label: "帳務",
      icon: <AppstoreOutlined />,
      children: [
        hasPermission("receivable:view") && {
          key: "4",
          label: t("menu.receivables"),
        },
        hasPermission("payable:view") && {
          key: "5",
          label: t("menu.payables"),
        },
        hasPermission("income-entry:view") && {
          key: "6",
          label: t("menu.incomeentries"),
        },
        hasPermission("expense-entry:view") && {
          key: "7",
          label: t("menu.expenseentries"),
        },
        hasPermission("cash-transaction:view") && {
          key: "8",
          label: t("menu.cash-transactions"),
        },
         hasPermission("reconciliation:view") && {
          key: "10",
          label: t("menu.reconciliation"),
        },
      ].filter(Boolean) as MenuProps["items"],
    },
    {
      key: "sub4",
      label: "銷貨管理",
      icon: <SettingOutlined />,
      children: [
        hasPermission("sales-record:view") && {
          key: "12",
          label: t("menu.sales-records"),
        },
         hasPermission("invoices:view") && {
          key: "15",
          label: t("menu.invoices"),
        },
      ].filter(Boolean) as MenuProps["items"],
    },
    {
      key: "sub5",
      label: "信用額度管理",
      icon: <SettingOutlined />,
      children: [
        hasPermission("credit-case:view") && {
          key: "13",
          label: t("menu.credit-cases"),
        },
      ].filter(Boolean) as MenuProps["items"],
    },
    {
      key: "grp",
      label: "Group",
      type: "group",
      children: [
        { key: "14", label: "TestCurrent" },
      ],
    },
  ];

  const routeMap: Record<string, string> = {
    "1": "/users",
    "2": "/companys",
    "3": "/partners",
    "4": "/receivables",
    "5": "/payables",
    "6": "/income-entries",
    "7": "/expense-entries",
    "8": "/cash-transactions",
    "10": "/reconciliations",
    "11": "/financial-accounts",
    "12": "/sales-records",
    "13": "/credit-cases",
    "15": "/invoices",

    
    "14": "/testcrt"
  };
  const findLabelByKey = (
    items: MenuProps["items"],
    key: string
  ): string | undefined => {
    for (const item of items ?? []) {
      if (!item || typeof item !== "object") continue;

      // 排除 divider（沒有 label）
      if ("type" in item && item.type === "divider") continue;

      // 避免 TS 推斷失敗：確保有 key 跟 label
      if ("key" in item && item.key === key && "label" in item) {
        return typeof item.label === "string" ? item.label : undefined;
      }

      if ("children" in item && Array.isArray(item.children)) {
        const found = findLabelByKey(item.children, key);
        if (found) return found;
      }
    }
    return undefined;
  };

  const { openTab } = useTabContext();

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    const path = routeMap[e.key];
    const label = findLabelByKey(items, e.key);
    if (path && label !== undefined) {
      openTab(path, label);
    }
  };

  return (
    <Menu
      onClick={onClick}
      style={{ height: "100%" }}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1","sub2"]}
      mode="inline"
      items={items}
    />
  );
};

export default Sidebar;
