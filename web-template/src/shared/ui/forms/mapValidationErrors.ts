import type { TFunction } from "i18next";
import type { AntdFieldError, BackendError } from "@/models/error";



export function mapValidationErrors(
  errors: BackendError[],
  t: TFunction,
  namespace: string
): AntdFieldError[] {
  return errors
    .filter((error) => error.field)
    .map((error) => {
      const fieldWithPrefix = error.field!;

      // 去除 "Request." 開頭，並將首字母小寫
      const rawFieldName = fieldWithPrefix.replace(/^Request\./, "");
      const normalizedFieldName =
        rawFieldName.charAt(0).toLowerCase() + rawFieldName.slice(1);

      const errorCode = error.code;
      const i18nKey = `fields.${normalizedFieldName}.validation.${errorCode}`;
      const message = t(`${namespace}.${i18nKey}`, {
        defaultValue: `${normalizedFieldName} ${errorCode}`,
      });

      return {
        name: [namespace, normalizedFieldName],
        errors: [message],
      };
    });
}
