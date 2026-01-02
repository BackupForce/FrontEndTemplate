import type { TFunction } from "i18next";
import { mapValidationErrors } from "@/shared/ui/forms/mapValidationErrors";
import type { AntdFieldError } from "@/shared/ui/forms/types/AntdFieldError";
import type { ApiError } from "@/core/http/types/ApiError";
import type { MessageInstance } from "antd/es/message/interface";

/**
 * 處理後端回傳的錯誤資訊，包含表單欄位錯誤與全域商業邏輯錯誤
 */
export function handleApiError(
  error: unknown,
  t: TFunction,
  namespace: string,
  message: MessageInstance,
  setFieldErrors?: (errors: AntdFieldError[]) => void
): void {
  const problem = (error as ApiError)?.response?.data;
  const statusCode = (error as ApiError)?.response?.status;

  console.log(statusCode);

  // 🔐 特殊處理 401 未授權
  // if (statusCode === 401) {
  //   message.error(t("errors.Unauthorized", { defaultValue: "尚未登入或登入已過期，請重新登入" }));
  //   navigate("/login");
  //   return;
  // }

  if (!problem) return;
  const backendErrors = problem.extensions?.errors;
  if (Array.isArray(backendErrors)) {
    const fieldErrors = backendErrors.filter(e => e.field);
    const globalErrors = backendErrors.filter(e => !e.field);

    if (fieldErrors.length > 0 && setFieldErrors) {
      const formErrors = mapValidationErrors(fieldErrors, t, namespace);
      setFieldErrors(formErrors);
    }

    globalErrors.forEach(e => {
      const msg = t(`errors.${e.code}`, { defaultValue: e.description });
      message.error(msg);
    });

    return;
  }

  if (problem.title) {
    const msg = t(`errors.${problem.title}`, {
      defaultValue: problem.detail ?? problem.title
    });
    message.error(msg);
    return;
  }

  message.error(t("errors.General.Unknown", { defaultValue: "發生未知錯誤，請稍後再試" }));
}