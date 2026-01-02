import {
  ModalForm,
  ProFormDatePicker,
  ProFormDigit
} from "@ant-design/pro-components";
import { message } from "antd";
import { t } from "i18next";
import RemotePartnerSelect from "@/shared/ui/select/RemotePartnerSelect";
import RemoteCurrencySelect from "@/shared/ui/select/RemoteCurrencySelect";
import { createReceivable } from "@/features/accounts/receivable/api/receivables.api";
import { tReceivable } from "@/shared/i18n/helpers";

export interface CreateReceivableModalProps {
  open: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateReceivableModal = ({ open, onCancel, onSuccess }: CreateReceivableModalProps) => {
  return (
    <ModalForm
      title={tReceivable("create.title")}
      open={open}
      onFinish={async (values) => {
        try {
          // 組合成後端格式
          const payload = {
            customerId: values.customerId,
            issueDate: values.issueDate,
            dueDate: values.dueDate,
            accountingDate: values.accountingDate,
            amount: {
              amount: values.amount,
              currencyCode: values.currencyCode
            }
          };

          await createReceivable(payload);
          message.success(tReceivable("create.success"));
          onSuccess();
          return true;
        } catch {
          message.error(tReceivable("create.error"));
          return false;
        }
      }}
      modalProps={{
        onCancel,
        maskClosable: false,
      }}
    >
      <RemotePartnerSelect
        name="customerId"
        label="客戶"
        rules={[{ required: true, message: t("common.required") }]}
      />

      <ProFormDatePicker
        name="issueDate"
        label={tReceivable("fields.issueDate.label")}
        rules={[{ required: true, message: t("common.required") }]}
      />

      <ProFormDatePicker
        name="dueDate"
        label={tReceivable("fields.dueDate.label")}
        rules={[{ required: true, message: t("common.required") }]}
      />

      <ProFormDigit
        name="amount"
        label={tReceivable("fields.originalAmount.label")}
        rules={[{ required: true, message: t("common.required") }]}
      />

    <RemoteCurrencySelect
        name="currencyCode"
        label="幣別"
        rules={[{ required: true, message: t("common.required") }]}
      />
    </ModalForm>
  );
};

export default CreateReceivableModal;
