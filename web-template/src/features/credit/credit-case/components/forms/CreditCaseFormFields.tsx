import { Form, Input, InputNumber } from "antd";
import type { FC } from "react";
import { tCommon } from "@/shared/i18n/helpers";
// 若你有 tCreditCase，建議改成下面：
import { tCreditCase } from "@/shared/i18n/helpers";
import RemotePartnerSelect from "@/shared/ui/select/RemotePartnerSelect";

interface CreditCaseFormFieldsProps {
  /** 鎖定整組欄位 */
  disabled?: boolean;
  /** 依情境顯示欄位（手動建立/審核共用此元件時可切換） */
  show?: {
    partnerId?: boolean;          // CreateManual 需要
    triggerSourceType?: boolean;  // CreateManual 需要
    triggerSourceId?: boolean;    // CreateManual 可為 null
    triggerAmount?: boolean;      // CreateManual 需要
    reason?: boolean;             // 審核時可顯示（可選）
  };
}

/**
 * 注意：
 * - triggerSourceType 沒有遠端選單時先用 Input；未來若有固定集合可換成 <Select />。
 * - triggerSourceId 是 Guid，可用 Input；若未來可挑來源單據可改 Remote 選單。
 * - triggerAmount >= 0，精度依你幣值取捨（此處示例 2 位）。
 */
const CreditCaseFormFields: FC<CreditCaseFormFieldsProps> = ({
  disabled = false,
  show = {
    partnerId: true,
    triggerSourceType: true,
    triggerSourceId: true,
    triggerAmount: true,
    reason: false,
  },
}) => {
 
  return (
    <>
      {show.partnerId && (
        <RemotePartnerSelect
          name="partnerId"
          label={tCreditCase("fields.partnerId.label")}
          rules={[{ required: true, message: tCommon("required") }]}
          // 依你的 RemotePartnerSelect 實作需要可再補充 props（如 valueField/labelField）
          placeholder={tCreditCase("fields.partnerId.placeholder")}
        />
      )}

      {show.triggerSourceType && (
        <Form.Item
          label={tCreditCase("fields.triggerSourceType.label")}
          name="triggerSourceType"
          rules={[{ required: true, message: tCommon("required") }]}
        >
          <Input
            disabled={disabled}
            placeholder={tCreditCase("fields.triggerSourceType.placeholder")}
            allowClear
          />
        </Form.Item>
      )}

      {show.triggerSourceId && (
        <Form.Item
          label={tCreditCase("fields.triggerSourceId.label")}
          name="triggerSourceId"
          // 手動建立允許為 null → 不加 required 驗證
        >
          <Input
            disabled={disabled}
            placeholder={tCreditCase("fields.triggerSourceId.placeholder")}
            allowClear
          />
        </Form.Item>
      )}

      {show.triggerAmount && (
        <Form.Item
          label={tCreditCase("fields.triggerAmount.label")}
          name="triggerAmount"
          rules={[{ required: true, message: tCommon("required") }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            precision={2}
            disabled={disabled}
            placeholder={tCreditCase("fields.triggerAmount.placeholder")}
          />
        </Form.Item>
      )}

      {show.reason && (
        <Form.Item
          label={tCreditCase("fields.reason.label")}
          name="reason"
          // 選填
        >
          <Input.TextArea
            rows={3}
            disabled={disabled}
            placeholder={tCreditCase("fields.reason.placeholder")}
            allowClear
          />
        </Form.Item>
      )}
    </>
  );
};

export default CreditCaseFormFields;
