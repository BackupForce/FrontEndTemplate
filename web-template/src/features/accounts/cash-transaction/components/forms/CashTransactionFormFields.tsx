// src/pages/cash-transactions/CashTransactionFormFields.tsx
import {
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { tCashTrans } from "@/shared/i18n/helpers";
import RemoteCurrencySelect from "@/shared/ui/select/RemoteCurrencySelect";
import { RemoteCompanySelect } from "@/shared/ui/select/RemoteCompanySelect";
import RemoteFinancialAccountSelect from "@/shared/ui/select/RemoteFinancialAccountSelect";
import type { FC } from "react";

interface CashTransactionFormFieldsProps {
  disabled?: boolean;
  show?: {
    companyId?: boolean;
    transactionDate?: boolean;
    amount?: boolean;
    currency?: boolean;
    direction?: boolean;
    financialAccountId?: boolean;
    referenceNumber?: boolean;
    note?: boolean;
  };
}

const CashTransactionFormFields: FC<CashTransactionFormFieldsProps> = ({
  disabled = false,
  show = {},
}) => {
  const defaultShow = {
    companyId: true,
    transactionDate: true,
    amount: true,
    currency: true,
    direction: true,
    financialAccountId: true,
    referenceNumber: true,
    note: true,
  };

  const mergedShow = { ...defaultShow, ...show };

  return (
    <>
      {mergedShow.companyId && (
        <RemoteCompanySelect
          name="companyId"
          label={tCashTrans("fields.companyId.label")}
          placeholder={tCashTrans("fields.companyId.placeholder")}
          disabled={disabled}
        />
      )}

      {mergedShow.transactionDate && (
        <ProFormDatePicker
          name="transactionDate"
          label={tCashTrans("fields.transactionDate.label")}
          rules={[
            {
              required: true,
              message: tCashTrans("fields.transactionDate.validation.required"),
            },
          ]}
          readonly={disabled}
        />
      )}

      {mergedShow.amount && (
        <ProFormDigit
          name="amount"
          label={tCashTrans("fields.amount.label")}
          rules={[
            {
              required: true,
              message: tCashTrans("fields.amount.validation.required"),
            },
          ]}
          readonly={disabled}
        />
      )}

      {mergedShow.currency && (
        <RemoteCurrencySelect
          name="currency"
          rules={[
            {
              required: true,
              message: tCashTrans("fields.currency.required"),
            },
          ]}
        />
      )}

      {mergedShow.direction && (
        <ProFormSelect
          name="direction"
          label={tCashTrans("fields.direction.label")}
          options={[
            { label: tCashTrans("enums.direction.in"), value: 0 },
            { label: tCashTrans("enums.direction.out"), value: 1 },
          ]}
          rules={[
            {
              required: true,
              message: tCashTrans("fields.direction.validation.required"),
            },
          ]}
          disabled={disabled}
        />
      )}

      {mergedShow.financialAccountId && (
        <RemoteFinancialAccountSelect
          name="financialAccountId"
          label={tCashTrans("fields.financialAccount.label")}
          rules={[
            {
              required: true,
              message: tCashTrans("fields.financialAccount.validation.required"),
            },
          ]}
          fieldProps={{ disabled }}
        />
      )}

      {mergedShow.referenceNumber && (
        <ProFormText
          name="referenceNumber"
          label={tCashTrans("fields.referenceNumber.label")}
          readonly={disabled}
        />
      )}

      {mergedShow.note && (
        <ProFormTextArea
          name="note"
          label={tCashTrans("fields.note.label")}
          readonly={disabled}
          fieldProps={{ autoSize: true }}
        />
      )}
    </>
  );
};

export default CashTransactionFormFields;
