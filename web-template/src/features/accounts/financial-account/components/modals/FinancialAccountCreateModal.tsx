import { ModalForm } from "@ant-design/pro-components";
import { useTranslation } from "react-i18next";
import { message, Form } from "antd";
import { useApiErrorHandler } from "@/shared/ui/errors/useApiErrorHandler";
import FinancialAccountFormFields from "@/features/accounts/financial-account/components/forms/FinancialAccountFormFields";
import { financialAccountApi } from "@/features/accounts/financial-account/api/financialAccount.api"
import type { CreateFinancialAccountRequest } from "@/features/accounts/financial-account/types/dto";

/**
 * 結構對齊 PayableCreateModal（ModalForm、maskClosable: false、error handler、成功提示與 resetFields）:contentReference[oaicite:3]{index=3}
 */
export interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function FinancialAccountCreateModal({
  open,
  onCancel,
  onSuccess,
}: Props) {
  const { t } = useTranslation("financialAccount");
  const [form] = Form.useForm();
  const handleError = useApiErrorHandler("financialAccount");

  return (
    <ModalForm<CreateFinancialAccountRequest>
      title={t("create.title")}
      form={form}
      open={open}
      initialValues={{
        balance: 0,
      }}
      modalProps={{
        onCancel: onCancel,
        maskClosable: false, // 與 PayableCreateModal 一致的防誤觸設定 :contentReference[oaicite:4]{index=4}
        destroyOnHidden: true,
      }}
      onFinish={async (values) => {
        try {
          await financialAccountApi.create(values);
          message.success(t("create.success"));
          form.resetFields();
          onSuccess();
          return true;
        } catch (err) {
          handleError(err, form.setFields);
          return false;
        }
      }}
    >
      <FinancialAccountFormFields />
    </ModalForm>
  );
}
