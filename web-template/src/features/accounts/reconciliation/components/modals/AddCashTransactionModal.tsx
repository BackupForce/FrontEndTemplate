import { Modal } from "antd";
import {
  ProForm,
  ProFormText,
  ProFormDigit,
  ProFormDatePicker,
} from "@ant-design/pro-components";
import type { FC } from "react";
import { tCashTrans } from "@/shared/i18n/helpers";

export interface AddCashTransactionModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: unknown) => Promise<void>; // 後續可定義 CashTransactionCreateDto
}

const AddCashTransactionModal: FC<AddCashTransactionModalProps> = ({
  open,
  onCancel,
  onSubmit,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title="新增金流紀錄"
      maskClosable={false}
      destroyOnHidden
    >
      <ProForm
        onFinish={onSubmit}
        submitter={{
          searchConfig: { submitText: "新增" },
        }}
      >
        <ProFormDatePicker
          name="transactionDate"
          label={tCashTrans("fields.transactionDate.label")}
          rules={[{ required: true, message: tCashTrans("fields.transactionDate.validation.required") }]}
        />

        <ProFormText
          name="referenceNumber"
          label={tCashTrans("fields.referenceNumber.label")}
        />

        <ProFormDigit
          name="amount"
          label={tCashTrans("fields.amount.label")}
          fieldProps={{ precision: 2 }}
          rules={[{ required: true, message: tCashTrans("fields.amount.validation.required") }]}
        />
      </ProForm>
    </Modal>
  );
};

export default AddCashTransactionModal;
