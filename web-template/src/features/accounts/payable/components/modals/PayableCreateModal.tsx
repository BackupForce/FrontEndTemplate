import { ModalForm } from "@ant-design/pro-components";
import { useTranslation } from "react-i18next";
import { createPayable } from "@/features/accounts/payable/api/payable.api";
import type { CreatePayableRequest } from "@/features/accounts/payable/types/dto";
import PayableFormFields from "@/features/accounts/payable/components/forms/PayableFormFields";
import { message, Form } from "antd";
import { useApiErrorHandler } from "@/shared/ui/errors/useApiErrorHandler";
import dayjs from "dayjs";

export interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function PayableCreateModal({ open, onCancel, onSuccess }: Props) {
  const { t } = useTranslation("payable");
const [form] = Form.useForm();
const handleError = useApiErrorHandler("payable");

  return (
    <ModalForm<CreatePayableRequest>
      title={t("create.title")}
      form={form}
      open={open}
      initialValues={{
        issueDate: dayjs(), // ← 今天
      }}
      modalProps={{
        onCancel: onCancel,
        maskClosable: false,
        destroyOnHidden: true,
      }}
      onFinish={async (values) => {
        try {
          await createPayable(values);
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
      <PayableFormFields />
    </ModalForm>
  );
}
