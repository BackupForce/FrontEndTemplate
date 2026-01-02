// features/sales/sales-record/components/modals/SalesRecordCreateModal.tsx
import { ModalForm } from "@ant-design/pro-components";
import { useTranslation } from "react-i18next";
import { message, Form } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useApiErrorHandler } from "@/shared/ui/errors/useApiErrorHandler";
import SalesRecordFormFields from "@/features/sales/sales-record/components/forms/SalesRecordFormFields";
import { salesRecordApi } from "@/features/sales/sales-record/api/salesRecord.api";
import type { CreateSalesRecordRequest } from "@/features/sales/sales-record/types/dto";

export interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

// 表單值（camelCase）— 與 SalesRecordFormFields 的欄位名稱一致
type FormValues = {
  partnerId: string;
  postingDate: Dayjs | string; // DatePicker 會回 Dayjs；也容許預設字串
  currencyCode: string;
  amount: number;
  note?: string;
};

function toPayload(v: FormValues): CreateSalesRecordRequest {
  // 型別安全轉換：camelCase -> PascalCase
  // const postingDate =
  //   typeof v.postingDate === "string"
  //     ? v.postingDate
  //     : v.postingDate.format("YYYY-MM-DD");

  return {
    partnerId: v.partnerId,
    postingDate: dayjs(v.postingDate).format("YYYY-MM-DD"),
    currencyCode: v.currencyCode,
    amount: v.amount,
    note: v.note,
  };
}

export default function SalesRecordCreateModal({ open, onCancel, onSuccess }: Props) {
  const { t } = useTranslation("salesRecord");
  const [form] = Form.useForm();
  const handleError = useApiErrorHandler("salesRecord");

  return (
    <ModalForm<FormValues>
      title={t("create.title")}
      form={form}
      open={open}
      initialValues={{ amount: 0 }}
      modalProps={{ onCancel, maskClosable: false, destroyOnHidden: true }}
      onFinish={async (values) => {
        try {
          const payload = toPayload(values);
          await salesRecordApi.create(payload);
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
      <SalesRecordFormFields />
    </ModalForm>
  );
}
