import { ModalForm } from "@ant-design/pro-components";
import { message, Form } from "antd";
import { useTranslation } from "react-i18next";
import FinancialAccountFormFields from "../forms/FinancialAccountFormFields";
import { financialAccountApi } from "@/features/accounts/financial-account/api/financialAccount.api";
import { useApiErrorHandler } from "@/shared/ui/errors/useApiErrorHandler";
import type {
  FinancialAccountDto,
  UpdateFinancialAccountRequest,
} from "@/features/accounts/financial-account/types/dto";

export interface Props {
  open: boolean;
  data: FinancialAccountDto | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function FinancialAccountEditModal({
  open,
  onCancel,
  data,
  onSuccess,
}: Props) {
  const { t } = useTranslation("financialAccount");
  const handleError = useApiErrorHandler("financialAccount");
  const [form] = Form.useForm();

  return (
    <ModalForm<UpdateFinancialAccountRequest>
      title={t("edit.title")}
      form={form}
      open={open}
      modalProps={{
        onCancel,
        maskClosable: false,
        destroyOnHidden: true,
      }}
      initialValues={
        data
          ? {
              // 編輯時不帶 companyId、balance（依照先前約定）
              name: data.name,
              type: data.type,
              bankName: data.bankName,
              accountNumber: data.accountNumber,
              currencyId: data.currencyId,
              note: data.note,
            }
          : undefined // 避免傳入 null
      }
      onFinish={async (values) => {
        if (!data) {
          return false; // 安全檢查
        }
        try {
          const payload: UpdateFinancialAccountRequest = {
            name: values.name,
            type: values.type,
            bankName: values.bankName,
            accountNumber: values.accountNumber,
            currencyId: values.currencyId,
            note: values.note,
            // 不直接修改 balance；若將來允許再放開
          };

          await financialAccountApi.update(data.id, payload);
          message.success(t("edit.success"));
          onSuccess();
          return true;
        } catch (err) {
          message.error(t("edit.error"));
          // 你若有 useApiErrorHandler 也可在此導入
          handleError(err, form.setFields);
          console.log(err);
          return false;
        }
      }}
    >
      <FinancialAccountFormFields
        show={{
          name: true,
          type: true,
          bankName: true,
          accountNumber: true,
          balance: false, // 編輯不直接調整餘額
          currencyId: true,
          note: true,
        }}
      />
    </ModalForm>
  );
}
