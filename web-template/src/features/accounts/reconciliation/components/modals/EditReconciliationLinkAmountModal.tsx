import { type FC, useEffect } from "react";
import { Form, Input, InputNumber, Modal } from "antd";

type EditValues = {
  /** 連結上的沖帳金額 */
  amount: number;
  /** 備註（僅在 showNote=true 時會用到） */
  note?: string | null;
};

interface Props {
  /** 是否開啟 Modal */
  open: boolean;
  /** 取消關閉事件 */
  onCancel: () => void;
  /** 確認送出事件 */
  onSubmit: (values: EditValues) => Promise<void> | void;
  /** 初始金額（小數兩位） */
  initialAmount: number;
  /** 初始備註（僅在 showNote=true 時會顯示） */
  initialNote?: string | null;
  /** 幣別代碼（顯示在金額輸入框的 addonAfter） */
  currencyCode?: string;
  /** 參考單號（顯示於標題下方的小字區塊） */
  referenceNumber?: string | null;
  /** 送出中 Loading 狀態 */
  confirmLoading?: boolean;
  /** 覆寫標題 */
  title?: string;
  /** 是否顯示備註欄位（預設顯示；帳務編輯可傳 false） */
  showNote?: boolean;
}

const EditReconciliationLinkAmountModal: FC<Props> = ({
  open,
  onCancel,
  onSubmit,
  initialAmount,
  initialNote,
  currencyCode,
  referenceNumber,
  confirmLoading,
  title = "編輯沖帳金額",
  showNote = true,
}) => {
  const [form] = Form.useForm<EditValues>();

  // 每次開啟時寫入初始值
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        amount: initialAmount,
        note: initialNote ?? "",
      });
    }
  }, [open, initialAmount, initialNote, form]);

  const handleOk = async (): Promise<void> => {
    const values: EditValues = await form.validateFields();
    await onSubmit({
      amount: values.amount,
      note: showNote ? (values.note ?? null) : undefined,
    });
  };

  return (
    <Modal
      open={open}
      title={title}
      okText="儲存"
      cancelText="取消"
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      maskClosable={false} // 避免誤觸關閉
    >
      <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>
        {referenceNumber != null && referenceNumber !== "" ? (
          <span>單號：{referenceNumber}</span>
        ) : (
          <span>單號：—</span>
        )}
      </div>

      <Form<EditValues> form={form} layout="vertical" requiredMark={false}>
        <Form.Item<EditValues>
          label="金額"
          name="amount"
          rules={[{ required: true, message: "請輸入金額" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            precision={2}
            addonAfter={currencyCode ?? ""}
            // 若需限制 >= 0，可加上 min={0}
          />
        </Form.Item>

        {showNote && (
          <Form.Item<EditValues> label="備註" name="note">
            <Input.TextArea
              autoSize={{ minRows: 2, maxRows: 4 }}
              maxLength={500}
              showCount
              placeholder="可選填"
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default EditReconciliationLinkAmountModal;
