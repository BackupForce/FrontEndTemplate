// features/sales/invoice/components/InvoiceCreateModal.tsx
import React, { useMemo, useState } from "react";
import { Modal, Form, Input, DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { invoiceApi } from "@/features/sales/invoice/api/invoice.api";
import  type { CreateInvoiceRequest} from "@/features/sales/invoice/types/dto";
import RemotePartnerSelect  from "@/shared/ui/select/RemotePartnerSelect";
import RemoteCurrencySelect  from "@/shared/ui/select/RemoteCurrencySelect";
import { t } from "i18next";

type Props = {
  open: boolean;
  onCancel: () => void;
  /** 建立成功後回傳新發票 id，讓呼叫端能導頁或刷新列表 */
  onSuccess: (invoiceId: string) => void;
};

type FormValues = {
  customerId: string;
  currencyCode: string;
  issueDate: Dayjs;
  postingDate?: Dayjs;
  referenceNumber?: string;
  note?: string;
};

const DATE_FORMAT = "YYYY-MM-DD";

export const InvoiceCreateModal: React.FC<Props> = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const initialValues = useMemo<FormValues>(() => {
    return {
      customerId: "",
      currencyCode: "TWD",
      issueDate: dayjs(),
    };
  }, []);

  const handleCancel = (): void => {
    form.resetFields();
    onCancel();
  };

  const handleOk = async (): Promise<void> => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();

      const payload: CreateInvoiceRequest = {
        customerId: values.customerId,
        currencyCode: values.currencyCode,
        issueDate: values.issueDate.format(DATE_FORMAT),
        postingDate: values.postingDate ? values.postingDate.format(DATE_FORMAT) : undefined,
        referenceNumber: values.referenceNumber?.trim() || undefined,
        note: values.note?.trim() || undefined,
      };

      const res = await invoiceApi.create(payload);
      form.resetFields();
      onSuccess(res.id);
    } catch (err) {
        console.log(err);
      // antd 會顯示表單驗證錯誤；API 錯誤交給 axiosInstance 的攔截器統一處理
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={"Create Invoice"}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={"Create"}
      cancelText={"Cancel"}
      maskClosable={false}
      confirmLoading={submitting}
      destroyOnHidden
    >
      <Form<FormValues>
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <RemotePartnerSelect
        name="customerId"
        label="客戶"
        rules={[{ required: true, message: t("common.required") }]}
        />

        <RemoteCurrencySelect
        name="currencyCode"
        label="幣別"
        rules={[{ required: true, message: t("common.required") }]}
        />

        <Form.Item
          label={"Issue Date"}
          name="issueDate"
          rules={[{ required: true, message: "Issue date is required." }]}
        >
          <DatePicker style={{ width: "100%" }} format={DATE_FORMAT} />
        </Form.Item>

        <Form.Item label={"Due Date"} name="postingDate">
          <DatePicker style={{ width: "100%" }} format={DATE_FORMAT} />
        </Form.Item>

        <Form.Item label={"Reference No."} name="referenceNumber">
          <Input maxLength={64} placeholder={"Optional reference"} />
        </Form.Item>

        <Form.Item label={"Note"} name="note">
          <Input.TextArea rows={3} maxLength={500} placeholder={"Optional note"} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InvoiceCreateModal;
