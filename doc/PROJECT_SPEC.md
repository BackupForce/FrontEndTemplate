# 可重複使用的專案規格書（Project Blueprint）

## 1. 專案總覽
- **專案型態**：前端 SPA，React + TypeScript + Vite，無後端子專案；以模板形式提供可快速擴充的管理後台界面。 【F:package.json†L1-L44】【F:src/main.tsx†L1-L15】
- **定位**：Template 專案，強調可快速複製的分頁式後台介面、權限保護、國際化與可重用的 CRUD 組件。 【F:src/app/App.tsx†L1-L222】【F:src/shared/ui/crud/ProCrudPage.tsx†L1-L260】
- **核心設計目標**：模組化（feature-based）、可配置的路由與分頁（tabs）導航、集中式 API 客戶端與錯誤處理、國際化預先佈建。 【C:find src -maxdepth 2 -type d†L1-L28】【F:src/shared/i18n/index.ts†L1-L58】【F:src/core/http/axiosInstance.ts†L1-L65】

## 2. 技術堆疊
- **語言與工具**：TypeScript 5.x、React 18、Vite 7、ESM 模組。 【F:package.json†L1-L44】
- **前端框架 / UI**：Ant Design 5、@ant-design/pro-components（ProTable、PageContainer 等），Tailwind 4（僅全域引入，可按需擴充）。 【F:package.json†L12-L44】【F:src/index.css†L1-L1】
- **路由**：react-router-dom v7，BrowserRouter + 巢狀 Routes + Route Guard。 【F:src/app/App.tsx†L4-L221】【F:src/app/router/guards/RequireAuth.tsx†L1-L12】
- **資料請求**：axios，集中配置 baseURL/timeout/credential 與 token/refresh 攔截器。 【F:src/core/http/axiosInstance.ts†L1-L65】
- **國際化**：i18next + react-i18next，命名空間化的 JSON 語系檔。 【F:src/shared/i18n/index.ts†L1-L58】
- **開發工具**：ESLint（typescript-eslint、react-hooks、react-refresh），Tailwind/PostCSS，TypeScript project refs。 【F:package.json†L25-L44】【F:tsconfig.app.json†L3-L30】
- **前後端分離**：純前端；透過環境變數設定 API Gateway（`VITE_API_BASE_URL` + 版本）。 【F:src/core/http/axiosInstance.ts†L4-L8】

## 3. 專案目錄結構與職責
- **根目錄**：Vite 設定、TS 設定、ESLint、Tailwind 配置。 【F:vite.config.ts†L1-L12】【F:tsconfig.app.json†L3-L30】
- **`src/app`**：組合應用的外層構件（`App.tsx` 路由與語系設定、`providers/` Context 提供者、`router/` 全域導航工具與守衛）。 【F:src/app/App.tsx†L1-L222】【F:src/app/providers/TabProvider.tsx†L1-L112】
- **`src/core`**：不可動核心（HTTP client、Auth token、基礎型別、工具函式、Context 定義）。 【F:src/core/http/axiosInstance.ts†L1-L65】【F:src/core/auth/authToken.ts†L1-L19】
- **`src/shared`**：跨模組共享（auth hooks、i18n helpers、UI 組件：布局、CRUD、錯誤處理、遠端 Select）。 【F:src/shared/ui/crud/ProCrudPage.tsx†L1-L260】【F:src/shared/ui/errors/handleApiError.ts†L1-L56】
- **`src/features`**：功能模組化目錄，依領域分子資料夾；每模組慣例包含 `api/`、`types/`、`pages/`、`components/`、`hooks/` 等，透過路由懶載入。 【C:find src -maxdepth 2 -type d†L5-L13】【F:src/app/App.tsx†L25-L207】
- **`src/locales`**：語言別（`en/`, `zh-TW/`）命名空間 JSON。 【C:find src -maxdepth 2 -type d†L2-L4】【F:src/shared/i18n/index.ts†L5-L44】
- **`public/`**：靜態資源，Vite 預設行為。

## 4. 架構與分層規則
- **依賴方向**：`features` → `shared`/`core`；`shared` 可依賴 `core`；`core` 不依賴上層。路由與 Context 由 `app` 統一組合。 【C:find src -maxdepth 2 -type d†L1-L28】【F:src/app/App.tsx†L105-L221】
- **路由層**：BrowserRouter 包裹 `AuthProvider` → `TabProvider` → `RequireAuth` → `MainLayout` → `ResponsiveTabsLayout` → 各 feature page。 【F:src/app/App.tsx†L105-L221】【F:src/shared/ui/layouts/ResponsiveTabsLayout.tsx†L8-L45】
- **守衛**：`RequireAuth` 以 token 存在與否判斷，未通過導向 `/login`。 【F:src/app/router/guards/RequireAuth.tsx†L1-L12】
- **Context**：`AuthContext`（用戶/權限狀態），`TabContext`（多分頁導航）。 Provider 於 `App` 嵌套。 【F:src/app/providers/AuthProvider.tsx†L7-L50】【F:src/app/providers/TabProvider.tsx†L19-L112】
- **資料存取**：所有 API 透過封裝的 axios instance，request 攔截附加 Bearer token，response 攔截處理 401 並自動 refresh + 重送。 【F:src/core/http/axiosInstance.ts†L4-L59】
- **UI 分層**：`shared/ui/layouts` 提供頂層框架（Header/Sidebar/Content/Responsive Tabs），`shared/ui/crud` 提供通用列表 + Modal 插槽；`features` 只組合欄位、表單與 API。 【F:src/shared/ui/layouts/MainLayout.tsx†L20-L165】【F:src/shared/ui/crud/ProCrudPage.tsx†L21-L260】
- **國際化**：初始化於 `main.tsx` 最先載入；語系資源與 Ant Design locale 由 `App` 切換。 【F:src/main.tsx†L1-L15】【F:src/app/App.tsx†L21-L104】【F:src/shared/i18n/index.ts†L1-L58】
- **瀏覽導向**：`NavigatorHandler` 將 `useNavigate` 暴露為全域 `navigate()`，供非路由組件使用。 【F:src/app/router/NavigatorHandler.tsx†L1-L15】【F:src/app/router/navigation.ts†L1-L20】

## 5. 命名與程式碼慣例
- **檔案/資料夾**：以功能/領域命名（`sales-record`, `financial-account` 等）；模組內子資料夾固定為 `api`, `types`, `pages`, `components`, `hooks`。 【C:find src -maxdepth 2 -type d†L5-L13】
- **TypeScript**：全域 `strict`，禁止未使用參數/變數；`@/*` 別名對應 `src/`。 【F:tsconfig.app.json†L3-L30】【F:vite.config.ts†L6-L12】
- **React**：Functional Components + hooks；懶載入路由；Context hook (`useTabContext`, `useAuth`) 包裝 `useContext` 並丟出錯誤提示。 【F:src/app/App.tsx†L25-L207】【F:src/app/providers/TabProvider.tsx†L21-L28】
- **DTO / 型別**：每模組 `types/dto.ts` 定義 API 介面；共用型別放 `src/core/types/`。 【F:src/core/types/common.ts†L1-L12】【C:find src -maxdepth 2 -type d†L20-L23】
- **表單/表格**：使用 Ant Design Pro 的 `ProTable`，欄位定義型別化；操作欄由工廠/共用欄位模組生成；表單錯誤透過 `AntdFieldError` 陣列設定。 【F:src/shared/ui/crud/ProCrudPage.tsx†L21-L227】【F:src/shared/ui/forms/types/AntdFieldError.ts†L1-L3】
- **權限判斷**：使用 `Can` 元件檢查 permission 字串，或 `hasPermission` helper；Sidebar/操作欄均以此控制顯示。 【F:src/shared/auth/Can.tsx†L1-L17】【F:src/app/providers/AuthProvider.tsx†L39-L46】
- **語系 key**：命名空間型式（`common`, `user`, ...），helper 函式以 `tXxx` 命名包裝。 【F:src/shared/i18n/index.ts†L20-L58】【F:src/shared/i18n/helpers.ts†L1-L36】

## 6. 模組化與擴充方式
- **新增 Feature 模組**：
  - 建立 `src/features/<module>/`，內含 `api/`, `types/`, `pages/`, `components/`, `hooks/`。
  - API 使用共用 axios instance；DTO 置於 `types/`；頁面以懶載方式在 `App.tsx` 註冊路由。 【F:src/app/App.tsx†L25-L207】【F:src/core/http/axiosInstance.ts†L1-L65】
- **CRUD 頁面模式**：
  - 使用 `ProCrudPage` 包裝列表，傳入 `fetch`、`columns`、`CreateModal`、`EditModal`、`onRemove` 等，並透過 `proCrudReload` 事件可外部觸發 reload。 【F:src/shared/ui/crud/ProCrudPage.tsx†L21-L260】
  - 欄位組件可共用於搜尋與表格欄位（`columns/`、`forms/` 子目錄）。
- **導航整合**：
  - 在 Sidebar route map 登記 path 與標題，點擊時使用 `openTab` 同步 Tabs 與路由。 【F:src/shared/ui/layouts/Sidebar.tsx†L1-L114】【F:src/app/providers/TabProvider.tsx†L53-L112】
  - 在 `App.tsx` 新增 `<Route>` 對應 page component；若需權限保護，放置於 `RequireAuth` 內。 【F:src/app/App.tsx†L105-L207】
  - 若為 CRUD 列表，優先使用 `ProCrudPage` 以保持互動一致性。
- **國際化擴充**：於 `src/locales/<lang>/` 新增 namespace JSON，並在 `i18n` 初始化中註冊 namespace；為 UI 文案新增對應 key。 【F:src/shared/i18n/index.ts†L5-L58】

## 7. 基礎設施與橫切關注
- **身份驗證**：`authToken` localStorage 管理；`AuthProvider` 在初始化時 refresh token（若無 token）並拉取用戶資訊；`RequireAuth` 檢查後導向。 【F:src/core/auth/authToken.ts†L1-L19】【F:src/app/providers/AuthProvider.tsx†L15-L44】【F:src/app/router/guards/RequireAuth.tsx†L1-L12】
- **HTTP 攔截**：全域 axios instance 注入 Authorization header；401 時序列化 refresh，成功後重送原請求，失敗清除 token 並導向登入。 【F:src/core/http/axiosInstance.ts†L4-L59】
- **錯誤處理**：`handleApiError` 解析 ProblemDetails/後端錯誤陣列，分離欄位與全域錯誤，並透過 i18n key 映射；支援表單欄位錯誤回填。 【F:src/shared/ui/errors/handleApiError.ts†L1-L56】
- **多分頁導航**：`TabProvider` 以 localStorage 持久化 tabs/activeKey；`ResponsiveTabsLayout` 在桌面顯示可關閉卡片式分頁，手機改為直接內容。 【F:src/app/providers/TabProvider.tsx†L33-L112】【F:src/shared/ui/layouts/ResponsiveTabsLayout.tsx†L8-L45】
- **布局與主題**：`MainLayout` 包含 Header/Sidebar/Content/Footer，支援亮暗主題切換與行動版 Drawer；Ant Design `ConfigProvider` 管理。 【F:src/shared/ui/layouts/MainLayout.tsx†L25-L165】
- **共用 UI**：欄位預設（日期欄位格式化等）、操作欄工廠、遠端下拉（透過 axios 拉取 options）。 【F:src/shared/ui/columns/columnPresets.ts†L1-L34】【F:src/shared/ui/columns/actionColumnFactory.tsx†L1-L120】【F:src/shared/ui/select/RemoteFinancialAccountSelect.tsx†L1-L55】

## 8. 建立新專案步驟（依此規格）
1. **初始化專案**：使用 Vite + React + TypeScript 模板；設置 package 相依與 scripts 與此專案一致。 【F:package.json†L6-L44】
2. **配置工具鏈**：複製 `tsconfig*.json`（含 `@/*` alias 與 strict 規則）、`eslint.config.js`、`tailwind.config.js`、`postcss.config.js`，並在 `index.css` 引入 Tailwind。 【F:tsconfig.app.json†L3-L30】【F:vite.config.ts†L6-L12】【F:src/index.css†L1-L1】
3. **建立核心層 (`src/core`)**：包含 `http/axiosInstance.ts`（baseURL/env + token/refresh 攔截）、`auth/authToken.ts`、`types/`（共用 DTO）、`utils/`（時間轉換等）、`context/`（AuthContext 介面）。 【F:src/core/http/axiosInstance.ts†L1-L65】【F:src/core/auth/authToken.ts†L1-L19】
4. **建立共享層 (`src/shared`)**：  
   - `i18n/` 初始化與 helpers，並建立 `locales/<lang>/` 命名空間 JSON。 【F:src/shared/i18n/index.ts†L1-L58】  
   - `auth/`（`useAuth`, `Can`）與 `ui/`（Layouts、CRUD、錯誤處理、共用欄位/表單/選單）。 【F:src/shared/auth/Can.tsx†L1-L17】【F:src/shared/ui/crud/ProCrudPage.tsx†L21-L260】
5. **建立應用層 (`src/app`)**：  
   - `App.tsx` 設定 ConfigProvider + BrowserRouter + Suspense，注入 `AuthProvider`、`TabProvider`、`RequireAuth`、`MainLayout`、`ResponsiveTabsLayout`。 【F:src/app/App.tsx†L105-L221】  
   - `router/` 放置全域 navigator 工具與守衛。 【F:src/app/router/navigation.ts†L1-L20】【F:src/app/router/guards/RequireAuth.tsx†L1-L12】  
   - `providers/` 實作 Auth/Tab Context。
6. **建立特性模組 (`src/features/<module>`)**：  
   - 子資料夾 `api/`（axios 呼叫）、`types/`（DTO）、`components/`（表單/Modal/列表欄位）、`pages/`（頁面組裝），依需要 `hooks/`。  
   - 在 `App.tsx` 以 `lazy` 匯入並加入 `<Route>`；於 Sidebar 登記導覽並透過 `openTab` 連動。 【F:src/app/App.tsx†L25-L207】【F:src/shared/ui/layouts/Sidebar.tsx†L83-L114】
   - 若為 CRUD 列表，優先使用 `ProCrudPage` 以保持互動一致性。
7. **身份驗證流程**：  
   - 於 `AuthProvider` 初始化時檢查/refresh token，設定 `AuthContext`；在 axios 攔截器處理 401。 【F:src/app/providers/AuthProvider.tsx†L15-L44】【F:src/core/http/axiosInstance.ts†L19-L59】
8. **國際化與主題**：  
   - 於 `main.tsx` 首行載入 i18n；在 `App` 對應 Ant Design locale 切換；在 `MainLayout` 提供語言/主題控制 UI。 【F:src/main.tsx†L1-L15】【F:src/app/App.tsx†L21-L104】【F:src/shared/ui/layouts/MainLayout.tsx†L36-L88】
9. **錯誤與驗證**：  
   - API 失敗時以 `handleApiError` 統一處理，並將欄位錯誤映射成 AntD form 格式；全域提示用 `message`。 【F:src/shared/ui/errors/handleApiError.ts†L10-L56】
10. **分頁導航體驗**：  
    - 確保所有頁面在點擊 Sidebar 時使用 `openTab(path, title)`，並在 `ResponsiveTabsLayout` 下呈現；手機版自動切換為無 Tab 顯示。 【F:src/app/providers/TabProvider.tsx†L53-L112】【F:src/shared/ui/layouts/ResponsiveTabsLayout.tsx†L14-L45】

> 依上述規格，在未見原始專案時即可建立風格與結構一致的新專案。
