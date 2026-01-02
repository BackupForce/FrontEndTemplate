// features/sales/invoice/components/InvoiceFromSalesRecordsModal.tsx
import React, { useMemo, useState } from "react";
import { Modal, Form, Input, DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { invoiceApi } from "@/features/sales/invoice/api/invoice.api";
import type { SalesRecordDetailDto } from "@/features/sales/sales-record/types/dto";

type Props = {
  open: boolean;
  onCancel: () => void;
  detail: SalesRecordDetailDto;
  /** 拋轉成功後回呼：可用來刷新頁面或導頁 */
  onSuccess: () => void;
};

type FormValues = {
  postingDate: Dayjs;
  referenceNumber?: string;
  note?: string;
};

const DATE_FORMAT = "YYYY-MM-DD";

const InvoiceFromSalesRecordsModal: React.FC<Props> = ({ open, onCancel, detail, onSuccess }) => {
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  // 預設 postingDate：若 SR 已有 postingDate 就帶入，否則今天
  const initialValues = useMemo<FormValues>(() => {
    return {
      postingDate: detail.postingDate ? dayjs(detail.postingDate) : dayjs(),
    };
  }, [detail.postingDate]);

  const handleCancel = (): void => {
    form.resetFields();
    onCancel();
  };

  const handleOk = async (): Promise<void> => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();

      // 依你現有 DetailPage 的 create payload 風格延伸
      const payload = {
        documentKind: Number(detail.kind),
        issueDate: dayjs().format(DATE_FORMAT), // 依現況：直接用今天
        postingDate: values.postingDate.format(DATE_FORMAT),
        invoiceType: 0, // TODO: 之後若要讓使用者選，可擴充
        salesRecordIds: [detail.id],
        invoiceNumber: undefined,
        referenceNumber: values.referenceNumber?.trim() || undefined,
        note: values.note?.trim() || undefined,
      };

      await invoiceApi.createFromSalesRecords(payload);
      form.resetFields();
      onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title="從銷售單建立發票"
      onOk={handleOk}
      onCancel={handleCancel}
      okText="建立發票"
      cancelText="取消"
      maskClosable={false}
      confirmLoading={submitting}
      destroyOnClose
    >
      <Form<FormValues> form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          label="Posting Date"
          name="postingDate"
          rules={[{ required: true, message: "Posting date 是必填。" }]}
        >
          <DatePicker style={{ width: "100%" }} format={DATE_FORMAT} />
        </Form.Item>

        <Form.Item label="Reference No." name="invoiceNumber">
          <Input maxLength={64} placeholder="可不填" />
        </Form.Item>

        <Form.Item label="Note" name="note">
          <Input.TextArea rows={3} maxLength={500} placeholder="可不填" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InvoiceFromSalesRecordsModal;
