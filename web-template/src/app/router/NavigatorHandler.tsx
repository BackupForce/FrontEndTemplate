import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setNavigator } from "./navigation";

/**
 * 這個元件負責初始化全域 navigate 實例
 * 必須放在 <BrowserRouter> 中使用
 */
export const NavigatorHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return null;
};
