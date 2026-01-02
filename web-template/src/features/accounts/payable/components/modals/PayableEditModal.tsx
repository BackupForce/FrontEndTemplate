import { ModalForm } from "@ant-design/pro-components";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import PayableFormFields from "../forms/PayableFormFields";
import { updatePayable } from "@/features/accounts/payable/api/payable.api";
import type {
  PayableItem,
  UpdatePayableRequest,
} from "@/features/accounts/payable/types/dto";

export interface Props {
  open: boolean;
  data: PayableItem | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function PayableEditModal({
  open,
  onCancel,
  data,
  onSuccess,
}: Props) {
  const { t } = useTranslation("payable");

  return (
    <ModalForm
      title={t("edit.title")}
      open={open}
      modalProps={{
        onCancel: onCancel,
        maskClosable: false,
        destroyOnHidden: true,
      }}
      initialValues={
        data
          ? {
              ...data,
              issueDate: dayjs(data.issueDate),
              dueDate: dayjs(data.dueDate),
            }
          : undefined // ← 這裡是關鍵，避免傳入 null
      }
      onFinish={async (values) => {
        if (!data) return false; // 安全檢查
        try {
          console.log(values);
          const payload: UpdatePayableRequest = {
            ...values,
            billNumber: values.billNumber,
            issueDate: values.issueDate,
            dueDate: values.dueDate,
            originalAmountValue: values.originalAmountValue,
            originalAmountCurrency: values.originalAmountCurrency,
            status: values.status,
            supplierName: values.supplierName,
          };

          await updatePayable(data.id, payload);
          message.success(t("edit.success"));
          onSuccess();
          return true;
        } catch (err) {
          message.error(t("edit.error"));
          console.log(err);
          return false;
        }
      }}
    >
      <PayableFormFields />
    </ModalForm>
  );
}
