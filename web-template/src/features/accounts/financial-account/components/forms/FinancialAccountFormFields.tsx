import { Form, Input, InputNumber, Select } from "antd";
import type { FC } from "react";
import { tFinancialAccount, tCommon } from "@/shared/i18n/helpers";
import RemoteCurrencySelect from "@/shared/ui/select/RemoteCurrencySelect";

interface FinancialAccountFormFieldsProps {
  disabled?: boolean;
  show?: {
    name?: boolean;
    type?: boolean;
    bankName?: boolean;
    accountNumber?: boolean;
    balance?: boolean;
    currencyId?: boolean;
    note: boolean;
  };
}

/**
 * 參考 PayableFormFields 的結構（props.disabled、props.show、必填驗證與 Remote 選單）來實作。:contentReference[oaicite:2]{index=2}
 */
const FinancialAccountFormFields: FC<FinancialAccountFormFieldsProps> = ({
  disabled = false,
  show = {
    name: true,
    type: true,
    bankName: true,
    accountNumber: true,
    balance: true,
    currencyId: true,
    note: true,
  },
}) => {
  return (
    <>
      {show.name && (
        <Form.Item
          label={tFinancialAccount("fields.name.label")}
          name="name"
          rules={[{ required: true, message: tCommon("required") }]}
        >
          <Input
            placeholder={tFinancialAccount("fields.name.placeholder")}
            disabled={disabled}
          />
        </Form.Item>
      )}

      {show.type && (
        <Form.Item
          label={tFinancialAccount("fields.type.label")}
          name="type"
          rules={[{ required: true, message: tCommon("required") }]}
        >
          {/* 若你有固定的 AccountType 列舉，可把 options 改成 valueEnum 或動態載入 */}
          <Select
            placeholder={tFinancialAccount("fields.type.placeholder")}
            disabled={disabled}
            options={[
              { value: "bank", label: tFinancialAccount("types.bank") },
              { value: "cash", label: tFinancialAccount("types.cash") },
              { value: "digital", label: tFinancialAccount("types.digital") },
            ]}
          />
        </Form.Item>
      )}

      {show.bankName && (
        <Form.Item
          label={tFinancialAccount("fields.bankName.label")}
          name="bankName"
        >
          <Input
            placeholder={tFinancialAccount("fields.bankName.placeholder")}
            disabled={disabled}
          />
        </Form.Item>
      )}

      {show.accountNumber && (
        <Form.Item
          label={tFinancialAccount("fields.accountNumber.label")}
          name="accountNumber"
        >
          <Input
            placeholder={tFinancialAccount("fields.accountNumber.placeholder")}
            disabled={disabled}
          />
        </Form.Item>
      )}

      {show.balance && (
        <Form.Item
          label={tFinancialAccount("fields.balance.label")}
          name="balance"
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

      {show.currencyId && (
        <RemoteCurrencySelect
          name="currencyId"
          label={tFinancialAccount("fields.currencyId.label")}
          rules={[{ required: true, message: tCommon("required") }]}
        />
      )}

      {show.note && (
        <Form.Item label={tFinancialAccount("fields.note.label")} name="note">
          <Input
            placeholder={tFinancialAccount("fields.note.placeholder")}
            disabled={disabled}
            allowClear
          />
        </Form.Item>
      )}
    </>
  );
};

export default FinancialAccountFormFields;
