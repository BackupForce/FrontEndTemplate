import {
  ProFormDatePicker,
  ProFormDigit,
  ProFormTextArea,
} from "@ant-design/pro-components";
import RemoteCurrencySelect from "@/shared/ui/select/RemoteCurrencySelect";
import { RemoteCompanySelect } from "@/shared/ui/select/RemoteCompanySelect";
import RemoteAccountingCategorySelect from "@/shared/ui/select/RemoteAccountingCategorySelect";
import { tIncome } from "@/shared/i18n/helpers";
import type { FC } from "react";

interface IncomeEntryFormFieldsProps {
  disabled?: boolean;
  show?: {
    entryDate?: boolean;
    dueDate?: boolean;
    originalAmountValue?: boolean;
    originalAmountCurrency?: boolean;
    categoryId?: boolean;
    companyId?: boolean;
    description?: boolean;
  };
}

const IncomeEntryFormFields: FC<IncomeEntryFormFieldsProps> = ({
  disabled = false,
  show = {},
}) => {
  const defaultShow = {
    entryDate: true,
    dueDate: true,
    originalAmountValue: true,
    originalAmountCurrency: true,
    categoryId: true,
    companyId: true,
    description: true,
  };

  const mergedShow = { ...defaultShow, ...show };

  return (
    <>
      {mergedShow.entryDate && (
        <ProFormDatePicker
          name="entryDate"
          label={tIncome("fields.entryDate.label")}
          readonly={disabled}
          rules={[{ required: true, message: tIncome("fields.entryDate.required") }]}
        />
      )}

      {mergedShow.dueDate && (
        <ProFormDatePicker
          name="dueDate"
          label={tIncome("fields.dueDate.label")}
          readonly={disabled}
          rules={[{ required: true, message: tIncome("fields.dueDate.required") }]}
        />
      )}

      {mergedShow.originalAmountValue && (
        <ProFormDigit
          name="originalAmountValue"
          label={tIncome("fields.originalAmountValue.label")}
          readonly={disabled}
          fieldProps={{ precision: 0 }}
          rules={[{ required: true, message: tIncome("fields.originalAmountValue.required") }]}
        />
      )}

      {mergedShow.originalAmountCurrency && (
        <RemoteCurrencySelect
          name="originalAmountCurrency"
          rules={[{ required: true, message: tIncome("fields.originalAmountCurrency.required") }]}
        />
      )}

      {mergedShow.categoryId && (
        <RemoteAccountingCategorySelect
          name="categoryId"
          label={tIncome("fields.categoryId.label")}
          placeholder={tIncome("fields.categoryId.placeholder")}
          rules={[{ required: true, message: tIncome("fields.categoryId.required") }]}
        />
      )}

      {mergedShow.companyId && (
        <RemoteCompanySelect
          name="companyId"
          label={tIncome("fields.companyId.label")}
          placeholder={tIncome("fields.companyId.placeholder")}
          disabled={disabled}
        />
      )}

      {mergedShow.description && (
        <ProFormTextArea
          name="description"
          label={tIncome("fields.description.label")}
          readonly={disabled}
          fieldProps={{ autoSize: true }}
        />
      )}
    </>
  );
};

export default IncomeEntryFormFields;
