import "./App.css";
import { App as AntdApp } from "antd";

import { BrowserRouter, Routes, Route } from "react-router-dom";

// 上面 import 區塊中
import { lazy, Suspense, useEffect, useState } from "react";

import { AuthProvider } from "@/app/providers/AuthProvider";
import { TabProvider } from "./providers/TabProvider";
import ResponsiveTabsLayout from "@/shared/ui/layouts/ResponsiveTabsLayout"; // 加入分頁 layout
import { NavigatorHandler } from "@/app/router/NavigatorHandler";

import RequireAuth from "./router/guards/RequireAuth";

import { ConfigProvider } from "antd";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import type { Locale } from "antd/es/locale";

// 匯入 Ant Design 語系
import zhTW from "antd/es/locale/zh_TW";
import enUS from "antd/es/locale/en_US";

// 懶載頁面
const MainLayout = lazy(() => import("@/shared/ui/layouts/MainLayout"));
const LoginPage = lazy(() => import("@/features/identity/auth/pages/LoginPage"));
const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage"));
const UserList = lazy(() => import("@/features/identity/user/pages/UserList"));
const CompanyList = lazy(() => import("@/features/organization/company/pages/CompanyList"));
const FinancialAccountList = lazy(() => import("@/features/accounts/financial-account/pages/FinancialAccountList"));

const PartnerList = lazy(() => import("@/features/crm/partner/pages/PartnerList"));
const PartnerDetailPage = lazy(() => import("@/features/crm/partner/pages/PartnerDetailPage"));

const ReceivableList = lazy(() => import("../features/accounts/receivable/pages/ReceivableList"));
const PayableList = lazy(() => import("@/features/accounts/payable/pages/PayableList"));
const IncomeEntryList = lazy(
  () => import("@/features/accounts/income-entry/pages/IncomeEntryList")
);
const ExpenseEntryList = lazy(
  () => import("@/features/accounts/expense-entry/pages/ExpenseEntryList")
);

const CashTransactionList = lazy(
  () => import("@/features/accounts/cash-transaction/pages/CashTransactionList")
);
const CashTransactionDetailPage = lazy(
  () => import("@/features/accounts/cash-transaction/pages/CashTransactionDetailPage")
);
const ReconciliationList = lazy(
  () => import("@/features/accounts/reconciliation/pages/ReconciliationList")
);
const ReconciliationDetailPage = lazy(
  () => import("@/features/accounts/reconciliation/pages/ReconciliationDetailPage")
);
const SalesRecordList = lazy(
  () => import("@/features/sales/sales-record/pages/SalesRecordList")
);
const SalesRecordDetailPage = lazy(
  () => import("@/features/sales/sales-record/pages/SalesRecordDetailPage")
);


const CreditCaseList = lazy(
  () => import("@/features/credit/credit-case/pages/CreditCaseList")
);
const InvoiceList = lazy(
  () => import("@/features/sales/invoice/pages/InvoiceList")
);

const InvoiceDetailPage = lazy(
  () => import("@/features/sales/invoice/pages/InvoiceDetailPage")
);

const TestSearchCollapsePage = lazy(
  () => import("@/features/test/pages/TestSearchCollapsePage")
);

const antdLocales: Record<string, Locale> = {
  "zh-TW": zhTW,
  en: enUS,
};

function App() {
  const { i18n } = useTranslation();
  const [antdLocale, setAntdLocale] = useState<Locale>(
    antdLocales[i18n.language] ?? zhTW
  );

  useEffect(() => {
    setAntdLocale(antdLocales[i18n.language] ?? enUS);
  }, [i18n.language]);

  const handleLanguageChange = async ({ key }: { key: string }) => {
    await i18n.changeLanguage(key);
    setAntdLocale(antdLocales[key] ?? enUS);
  };

  const languageItems: MenuProps["items"] = [
    { key: "zh-TW", label: "繁體中文" },
    { key: "en", label: "English" },
  ];

  return (
    <ConfigProvider locale={antdLocale}>
      <AntdApp>
        <BrowserRouter>
          <Suspense fallback={<div>載入中...</div>}>
            <NavigatorHandler />
            <Routes>
              {/* LoginPage 放在 AuthProvider 外面 */}
              <Route path="/login" element={<LoginPage />} />

              {/* 其餘路由吃 AuthProvider + TabProvider */}
              <Route
                path="*"
                element={
                  <AuthProvider>
                    <TabProvider>
                      <Routes>
                        <Route element={<RequireAuth />}>
                          <Route
                            element={
                              <MainLayout
                                handleLanguageChange={handleLanguageChange}
                                languageItems={languageItems}
                              />
                            }
                          >
                            <Route element={<ResponsiveTabsLayout />}>
                              <Route path="/" element={<DashboardPage />} />
                              <Route path="/users" element={<UserList />} />
                              <Route
                                path="/companys"
                                element={<CompanyList />}
                              />
                              <Route
                                path="/financial-accounts"
                                element={<FinancialAccountList />}
                              />
                              <Route
                                path="/partners"
                                element={<PartnerList />}
                              />
                              <Route
                                path="/partners/:id"
                                element={<PartnerDetailPage />}
                              />
                              <Route
                                path="/receivables"
                                element={<ReceivableList />}
                              />
                              <Route
                                path="/payables"
                                element={<PayableList />}
                              />
                              <Route
                                path="/income-entries"
                                element={<IncomeEntryList />}
                              />
                              <Route
                                path="/expense-entries"
                                element={<ExpenseEntryList />}
                              />
                              
                              <Route
                                path="/cash-transactions"
                                element={<CashTransactionList />}
                              />
                              <Route
                                path="/cash-transactions/:id"
                                element={<CashTransactionDetailPage />}
                              />
                              <Route
                                path="/reconciliations"
                                element={<ReconciliationList />}
                              />
                              <Route
                                path="/reconciliations/:id"
                                element={<ReconciliationDetailPage />}
                              />
                              <Route
                                path="/sales-records"
                                element={<SalesRecordList />}
                              />
                               <Route
                                path="/sales-records/:id"
                                element={<SalesRecordDetailPage />}
                              />
                              <Route
                                path="/invoices"
                                element={<InvoiceList />}
                              />
                              <Route
                                path="/invoices/:id"
                                element={<InvoiceDetailPage />}
                              />
                              <Route
                                path="/credit-cases"
                                element={<CreditCaseList />}
                              />
                              
                              <Route
                                path="/testcrt"
                                element={<TestSearchCollapsePage />}
                              />
                            </Route>
                          </Route>
                        </Route>
                      </Routes>
                    </TabProvider>
                  </AuthProvider>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
