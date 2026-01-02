import './shared/i18n/index.ts'; // 請放在最上面，初始化語系
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app/App.tsx';
import 'antd/dist/reset.css';
import { App as AntdApp } from 'antd'; // ✅ 引入 Ant Design 的 App 元件

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AntdApp>
      <App />
    </AntdApp>
  </StrictMode>,
);
