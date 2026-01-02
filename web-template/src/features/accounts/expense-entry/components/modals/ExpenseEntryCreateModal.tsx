import { ModalForm } from "@ant-design/pro-components";
import { useTranslation } from "react-i18next";
import { message, Form } from "antd";
import { useApiErrorHandler } from "@/shared/ui/errors/useApiErrorHandler";
import ExpenseEntryFormFields from "@/features/accounts/expense-entry/components/forms/ExpenseEntryFormFields";
import { expenseEntryApi } from "@/features/accounts/expense-entry/api/expenseEntry.api";
import type { CreateExpenseEntryRequest } from "@/features/accounts/expense-entry/types/dto";
import dayjs from "dayjs";

export interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function ExpenseEntryCreateModal({
  open,
  onCancel,
  onSuccess,
}: Props) {
  const { t } = useTranslation("expenseEntry");
  const [form] = Form.useForm();
  const handleError = useApiErrorHandler("expenseEntry");

  return (
    <ModalForm<CreateExpenseEntryRequest>
      title={t("create.title")}
      form={form}
      open={open}
      initialValues={{}}
      modalProps={{
        onCancel,
        maskClosable: false,
        destroyOnHidden: true,
      }}
      onFinish={async (values) => {
        try {
          const payload: CreateExpenseEntryRequest = {
            entryDate: values.entryDate
              ? dayjs(values.entryDate).format("YYYY-MM-DD")
              : undefined as unknown as string,
            dueDate: values.dueDate
              ? dayjs(values.dueDate).format("YYYY-MM-DD")
              : undefined as unknown as string,
            originalAmountValue: values.originalAmountValue,
            originalAmountCurrency: values.originalAmountCurrency,
            status: values.status,
            description: values.description ?? null,
            categoryId: values.categoryId,
          };

          await expenseEntryApi.create(payload);
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
      <ExpenseEntryFormFields />
    </ModalForm>
  );
}
