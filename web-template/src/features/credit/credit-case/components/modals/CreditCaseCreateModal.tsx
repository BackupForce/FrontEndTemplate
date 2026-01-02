// features/credit/credit-case/components/modals/CreditCaseCreateModal.tsx
import { ModalForm } from "@ant-design/pro-components";
import { useTranslation } from "react-i18next";
import { message, Form } from "antd";
import { useApiErrorHandler } from "@/shared/ui/errors/useApiErrorHandler";
import CreditCaseFormFields from "@/features/credit/credit-case/components/forms/CreditCaseFormFields";
import { creditCaseApi } from "@/features/credit/credit-case/api/creditCase.api";
import type { CreateManualCreditCaseRequest } from "@/features/credit/credit-case/types/dto";

export interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  /** 後端要求必填；若你有全域公司範圍，可在外層傳入 */
}

// 表單值（camelCase）— 與 CreditCaseFormFields 欄位一致
type FormValues = {
  partnerId: string;
  triggerSourceType: string;
  triggerSourceId?: string | null;
  triggerAmount: number;
};

function toPayload( v: FormValues): CreateManualCreditCaseRequest {
  return {
    partnerId: v.partnerId,
    triggerSourceType: v.triggerSourceType,
    triggerSourceId: v.triggerSourceId ?? null, // 手動建立允許為 null
    triggerAmount: v.triggerAmount
  };
}

export default function CreditCaseCreateModal({ open, onCancel, onSuccess }: Props) {
  const { t } = useTranslation("creditCase");
  const [form] = Form.useForm();
  const handleError = useApiErrorHandler("creditCase");

  return (
    <ModalForm<FormValues>
      title={t("create.title", { defaultValue: "新增授信處理單" })}
      form={form}
      open={open}
      initialValues={{ triggerAmount: 0 }}
      modalProps={{ onCancel, maskClosable: false, destroyOnHidden: true }}
      onFinish={async (values) => {
        try {
          const payload = toPayload(values);
          await creditCaseApi.createManual(payload);
          message.success(t("create.success", { defaultValue: "建立成功" }));
          form.resetFields();
          onSuccess();
          return true;
        } catch (err) {
          handleError(err, form.setFields);
          return false;
        }
      }}
    >
      <CreditCaseFormFields
        show={{ partnerId: true, triggerSourceType: true, triggerSourceId: true, triggerAmount: true, reason: false }}
      />
    </ModalForm>
  );
}
