// utils/navigation.ts

let _navigate: ((path: string) => void) | null = null;

/**
 * 在元件中呼叫 useNavigate() 後，透過這個函式把 navigate 函式注入全域
 */
export function setNavigator(navigateFn: (path: string) => void): void {
  _navigate = navigateFn;
}

/**
 * 全域可用的導頁函式
 */
export function navigate(path: string): void {
  if (_navigate) {
    _navigate(path);
  } else {
    console.warn("Navigator 尚未初始化，請確認在 App 中執行過 setNavigator()");
  }
}
