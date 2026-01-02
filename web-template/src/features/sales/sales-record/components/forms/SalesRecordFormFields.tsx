import { Form, Input, InputNumber, DatePicker } from "antd";
import type { FC } from "react";
import { tCommon, tSalesRecord } from "@/shared/i18n/helpers";
import RemoteCurrencySelect from "@/shared/ui/select/RemoteCurrencySelect";
import RemotePartnerSelect from "@/shared/ui/select/RemotePartnerSelect";

interface SalesRecordFormFieldsProps {
  disabled?: boolean;
  show?: {
    partnerId?: boolean;
    postingDate?: boolean;
    currencyCode?: boolean;
    amount?: boolean;
    note?: boolean;
  };
}

/**
 * 參考 FinancialAccountFormFields 的結構（disabled、show、Remote 選單、必填驗證）。
 * 注意：DatePicker 回傳 dayjs，送 API 前請轉成 "YYYY-MM-DD"。
 */
const SalesRecordFormFields: FC<SalesRecordFormFieldsProps> = ({
  disabled = false,
  show = {
    partnerId: true,
    postingDate: true,
    currencyCode: true,
    amount: true,
    note: true,
  },
}) => {
  return (
    <>
      {show.partnerId && (
        <RemotePartnerSelect
          name="partnerId"
          label={tSalesRecord("fields.partnerId.label")}
          rules={[{ required: true, message: tCommon("required") }]}
          // 依你元件實作，如需指定取值/顯示欄位可再加 props
        />
      )}

      {show.postingDate && (
        <Form.Item
          label={tSalesRecord("fields.postingDate.label")}
          name="postingDate"
          rules={[{ required: true, message: tCommon("required") }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder={tSalesRecord("fields.postingDate.placeholder")}
            disabled={disabled}
          />
        </Form.Item>
      )}

      {show.currencyCode && (
        <RemoteCurrencySelect
          name="currencyCode"
          label={tSalesRecord("fields.currencyCode.label")}
          rules={[{ required: true, message: tCommon("required") }]}
          // 若你的 RemoteCurrencySelect 預設回傳 currencyId，
          // 可在元件內支援以 "code" 為 value；或將本欄位改為 name="currencyId" 並在提交時轉成 code。
        />
      )}

      {show.amount && (
        <Form.Item
          label={tSalesRecord("fields.amount.label")}
          name="amount"
          rules={[{ required: true, message: tCommon("required") }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            precision={2}
            disabled={disabled}
            placeholder={tSalesRecord("fields.amount.placeholder")}
          />
        </Form.Item>
      )}

      {show.note && (
        <Form.Item label={tSalesRecord("fields.note.label")} name="note">
          <Input
            placeholder={tSalesRecord("fields.note.placeholder")}
            disabled={disabled}
            allowClear
          />
        </Form.Item>
      )}
    </>
  );
};

export default SalesRecordFormFields;
