import { App } from "antd";
import { useTranslation } from "react-i18next";
import { handleApiError } from "@/shared/ui/errors/handleApiError";
import type { AntdFieldError } from "@/shared/ui/forms/types/AntdFieldError";

export function useApiErrorHandler(namespace: string) {
  const { t } = useTranslation();
  const { message } = App.useApp();

  return (
    error: unknown,
    setFieldErrors?: (errors: AntdFieldError[]) => void
  ) => {
    handleApiError(error, t, namespace, message, setFieldErrors);
  };
}

