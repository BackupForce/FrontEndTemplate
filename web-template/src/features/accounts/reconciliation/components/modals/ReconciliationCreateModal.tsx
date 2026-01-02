import { ModalForm, ProFormDatePicker, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { tReconciliation } from "@/shared/i18n/helpers";
import type { FC } from "react";
import type { FormInstance } from "antd";
import { useRef } from "react";
import dayjs from "dayjs";
import { createReconciliation } from "@/features/accounts/reconciliation/api/reconciliation.api";
import  RemotePartnerSelect from "@/shared/ui/select/RemotePartnerSelect";
import  RemoteCurrencySelect from "@/shared/ui/select/RemoteCurrencySelect";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ReconciliationCreateModal: FC<Props> = ({ open, onOpenChange, onSuccess }) => {
  const formRef = useRef<FormInstance | undefined>(undefined);

  return (
    <ModalForm
      title={tReconciliation("create.title")}
      open={open}
      onOpenChange={onOpenChange}
      formRef={formRef}
      width={520}
      autoFocusFirstInput
      modalProps={{
        destroyOnHidden: true,
        maskClosable: false,
      }}
      onFinish={async (values) => {
        await createReconciliation({
            referenceNumber: values.referenceNumber,
            partnerId: values.partnerId,
            currencyCode: values.currencyCode,
            reconciledAt: dayjs(values.reconciledAt).format("YYYY-MM-DD"),
            note: values.note,
        });
        onSuccess();
        return true;
      }}
    >
      <ProFormText
        name="referenceNumber"
        label={tReconciliation("fields.referenceNumber.label")}
        rules={[{ required: true, message: tReconciliation("fields.referenceNumber.validation.required") }]}
      />

      <RemotePartnerSelect
        name="partnerId"
        label={tReconciliation("fields.partner.label")}
        rules={[{ required: true, message: tReconciliation("fields.partner.validation.required") }]}
      />

      <RemoteCurrencySelect
        name="currencyCode"
        label={tReconciliation("fields.currencyCode.label")}
        rules={[{ required: true, message: tReconciliation("fields.currencyCode.validation.required") }]}
      />

      <ProFormDatePicker
        name="reconciledAt"
        label={tReconciliation("fields.reconciledAt.label")}
        rules={[{ required: true, message: tReconciliation("fields.reconciledAt.validation.required") }]}
      />

      <ProFormTextArea
        name="note"
        label={tReconciliation("fields.note.label")}
        fieldProps={{ rows: 3 }}
      />
    </ModalForm>
  );
};

export default ReconciliationCreateModal;
