import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import type { FC } from "react";
import { tExpenseEntry, tCommon } from "@/shared/i18n/helpers";
import RemoteCurrencySelect from "@/shared/ui/select/RemoteCurrencySelect";
// 同理：如果你有費用類別選單，替換為實際元件
// import RemoteExpenseCategorySelect from "@/shared/ui/select/RemoteExpenseCategorySelect";

interface ExpenseEntryFormFieldsProps {
  disabled?: boolean;
  show?: {
    entryDate?: boolean;
    dueDate?: boolean;
    originalAmountValue?: boolean;
    originalAmountCurrency?: boolean;
    status?: boolean;
    description?: boolean;
    categoryId?: boolean;
  };
}

/**
 * 參考你的 FinancialAccountFormFields 結構（disabled、show 控制、Remote 選單、必填驗證）
 */
const ExpenseEntryFormFields: FC<ExpenseEntryFormFieldsProps> = ({
  disabled = false,
  show = {
    entryDate: true,
    dueDate: true,
    originalAmountValue: true,
    originalAmountCurrency: true,
    status: true,
    description: true,
    categoryId: true,
  },
}) => {
  return (
    <>
      {show.entryDate && (
        <Form.Item
          label={tExpenseEntry("fields.entryDate.label")}
          name="entryDate"
          rules={[{ required: true, message: tCommon("required") }]}
        >
          <DatePicker style={{ width: "100%" }} disabled={disabled} />
        </Form.Item>
      )}

      {show.dueDate && (
        <Form.Item
          label={tExpenseEntry("fields.dueDate.label")}
          name="dueDate"
          rules={[{ required: true, message: tCommon("required") }]}
        >
          <DatePicker style={{ width: "100%" }} disabled={disabled} />
        </Form.Item>
      )}

      {show.originalAmountValue && (
        <Form.Item
          label={tExpenseEntry("fields.originalAmountValue.label")}
          name="originalAmountValue"
          rules={[{ required: true, message: tCommon("required") }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            precision={2}
            disabled={disabled}
          />
        </Form.Item>
      )}

      {show.originalAmountCurrency && (
        <RemoteCurrencySelect
          name="originalAmountCurrency"
          label={tExpenseEntry("fields.originalAmountCurrency.label")}
          rules={[{ required: true, message: tCommon("required") }]}
        />
      )}

      {show.status && (
        <Form.Item
          label={tExpenseEntry("fields.status.label")}
          name="status"
          rules={[{ required: true, message: tCommon("required") }]}
        >
          {/* 若有固定狀態 enum，改成對應 options/valueEnum */}
          <Select
            placeholder={tExpenseEntry("fields.status.placeholder")}
            disabled={disabled}
            options={[
              { value: 0, label: tExpenseEntry("statuses.pending") },
              { value: 1, label: tExpenseEntry("statuses.paid") },
              { value: 2, label: tExpenseEntry("statuses.canceled") },
            ]}
          />
        </Form.Item>
      )}

      {show.categoryId && (
        <Form.Item
          label={tExpenseEntry("fields.categoryId.label")}
          name="categoryId"
          rules={[{ required: true, message: tCommon("required") }]}
        >
          {/* 有 RemoteExpenseCategorySelect 的話改成它；否則先用輸入框或 Select 代替 */}
          <Input
            placeholder={tExpenseEntry("fields.categoryId.placeholder")}
            disabled={disabled}
          />
          {/* <RemoteExpenseCategorySelect
            name="categoryId"
            placeholder={tExpenseEntry("fields.categoryId.placeholder")}
            disabled={disabled}
          /> */}
        </Form.Item>
      )}

      {show.description && (
        <Form.Item
          label={tExpenseEntry("fields.description.label")}
          name="description"
        >
          <Input
            placeholder={tExpenseEntry("fields.description.placeholder")}
            disabled={disabled}
            allowClear
          />
        </Form.Item>
      )}
    </>
  );
};

export default ExpenseEntryFormFields;
