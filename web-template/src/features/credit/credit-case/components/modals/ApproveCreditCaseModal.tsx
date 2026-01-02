// features/credit/credit-case/components/modals/ApproveCreditCaseModal.tsx
import { ModalForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Form } from "antd";
import type { ReactNode } from "react";
import { useApiErrorHandler } from "@/shared/ui/errors/useApiErrorHandler";
import { creditCaseApi } from "@/features/credit/credit-case/api/creditCase.api";
import type { ApproveCreditCaseRequest } from "@/features/credit/credit-case/types/dto";
import RemoteFinancialAccountSelect from "@/shared/ui/select/RemoteFinancialAccountSelect";
import RemoteCurrencySelect from "@/shared/ui/select/RemoteCurrencySelect";
import { tCreditCase, tCommon } from "@/shared/i18n/helpers";

type FormValues = {
  financialAccountId: string;
  currencyCode: string;
  approver: string;
  reason?: string;
};

export default function ApproveCreditCaseModal(props: {
  trigger: ReactNode;
  creditCaseId: string;
  onApproved?: () => void;
}) {
  const { trigger, creditCaseId, onApproved } = props;
  const [form] = Form.useForm();
  const handleError = useApiErrorHandler("creditCase");

  return (
    <ModalForm<FormValues>
      title="審核通過"
      trigger={trigger}
      form={form}
      modalProps={{ maskClosable: false, destroyOnClose: true }}
      onFinish={async (v) => {
        try {
          const payload: ApproveCreditCaseRequest = {
            financialAccountId: v.financialAccountId,
            currencyCode: v.currencyCode,
            approver: v.approver,
            reason: v.reason,
          };
          await creditCaseApi.approve(creditCaseId, payload);
          onApproved?.();
          form.resetFields();
          return true;
        } catch (err) {
          handleError(err, form.setFields);
          return false;
        }
      }}
    >
      
      <RemoteFinancialAccountSelect
          name="financialAccountId"
          label={tCreditCase("fields.financialAccount.label")}
          rules={[
            {
              required: true,
              message: tCreditCase("fields.financialAccount.validation.required"),
            },
          ]}
        />

      <RemoteCurrencySelect
          name="currencyCode"
          label={tCreditCase("fields.currencyId.label")}
          rules={[{ required: true, message: tCommon("required") }]}
      />

      <ProFormText
        name="approver"
        label="審核人"
        rules={[{ required: true, message: "必填" }]}
      />
      <ProFormTextArea name="reason" label="原因（選填）" />
    </ModalForm>
  );
}
