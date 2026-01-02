import { Modal } from "antd";
import {
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import type { FC } from "react";
import { tEntry } from "@/shared/i18n/helpers"; // 假設你用 tEntry 命名帳務紀錄的 i18n

export interface AddReconcilableEntryModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: unknown) => Promise<void>; // 建議之後定義 ReconcilableEntryCreateDto
}

const AddReconcilableEntryModal: FC<AddReconcilableEntryModalProps> = ({
  open,
  onCancel,
  onSubmit,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title="新增帳務紀錄"
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
          name="accountingDate"
          label={tEntry("fields.accountingDate.label")}
          rules={[{ required: true, message: tEntry("fields.accountingDate.validation.required") }]}
        />

        <ProFormSelect
          name="entryType"
          label={tEntry("fields.entryType.label")}
          options={[
            { label: "收入", value: "Income" },
            { label: "支出", value: "Expense" },
          ]}
          rules={[{ required: true, message: tEntry("fields.entryType.validation.required") }]}
        />

        <ProFormText
          name="partnerName"
          label={tEntry("fields.partnerName.label")}
        />

        <ProFormDigit
          name="amount"
          label={tEntry("fields.amount.label")}
          fieldProps={{ precision: 2 }}
          rules={[{ required: true, message: tEntry("fields.amount.validation.required") }]}
        />
      </ProForm>
    </Modal>
  );
};

export default AddReconcilableEntryModal;
