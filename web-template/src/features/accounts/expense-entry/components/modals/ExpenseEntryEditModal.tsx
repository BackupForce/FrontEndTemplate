import { ModalForm } from "@ant-design/pro-components";
import { message, Form } from "antd";
import { useTranslation } from "react-i18next";
import ExpenseEntryFormFields from "@/features/accounts/expense-entry/components/forms/ExpenseEntryFormFields";
import { expenseEntryApi } from "@/features/accounts/expense-entry/api/expenseEntry.api";
import { useApiErrorHandler } from "@/shared/ui/errors/useApiErrorHandler";
import type {
  ExpenseEntryDetailDto,
  UpdateExpenseEntryRequest,
} from "@/features/accounts/expense-entry/types/dto";
import dayjs from "dayjs";

export interface Props {
  open: boolean;
  data: ExpenseEntryDetailDto | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function ExpenseEntryEditModal({
  open,
  onCancel,
  data,
  onSuccess,
}: Props) {
  const { t } = useTranslation("expenseEntry");
  const handleError = useApiErrorHandler("expenseEntry");
  const [form] = Form.useForm();

  return (
    <ModalForm<UpdateExpenseEntryRequest>
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
              entryDate: data.entryDate ? dayjs(data.entryDate) : undefined,
              dueDate: data.dueDate ? dayjs(data.dueDate) : undefined,
              originalAmountValue: data.originalAmountValue,
              originalAmountCurrency: data.originalAmountCurrency,
              status: data.status,
              description: data.description ?? undefined,
              categoryId: data.categoryId,
            }
          : undefined
      }
      onFinish={async (values) => {
        if (!data) {
          return false;
        }
        try {
          const payload: UpdateExpenseEntryRequest = {
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

          await expenseEntryApi.update(data.id, payload);
          message.success(t("edit.success"));
          onSuccess();
          return true;
        } catch (err) {
          message.error(t("edit.error"));
          handleError(err, form.setFields);
          return false;
        }
      }}
    >
      <ExpenseEntryFormFields />
    </ModalForm>
  );
}
