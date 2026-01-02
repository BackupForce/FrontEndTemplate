import { Form, Input, InputNumber, Select } from "antd";
import type { FC } from "react";
import { tPayable, tCommon } from "@/shared/i18n/helpers";
import RemotePartnerSelect from "@/shared/ui/select/RemotePartnerSelect";
import RemoteCurrencySelect from "@/shared/ui/select/RemoteCurrencySelect";
import { ProFormDatePicker } from "@ant-design/pro-components";

interface PayableFormFieldsProps {
  disabled?: boolean;
  show?: {
    billNumber?: boolean;
    issueDate?: boolean;
    dueDate?: boolean;
    originalAmountValue?: boolean;
    originalAmountCurrency?: boolean;
    status?: boolean;
    supplierName?: boolean;
    note: boolean;
  };
}

const PayableFormFields: FC<PayableFormFieldsProps> = ({
  disabled = false,
  show = {
    billNumber: true,
    issueDate: true,
    dueDate: true,
    originalAmountValue: true,
    originalAmountCurrency: true,
    status: true,
    supplierName: true,
    note: true,
  },
}) => {
  return (
    <>
      {show.supplierName && (
        <RemotePartnerSelect
          name="supplierId"
          label={tPayable("fields.supplierName.label")}
          rules={[{ required: true, message: tCommon("required") }]}
          onlySupplier
        />
      )}
      {show.billNumber && (
        <Form.Item
          label={tPayable("fields.billNumber.label")}
          name="billNumber"
          rules={[
            { required: true, message: tPayable("fields.billNumber.required") },
          ]}
        >
          <Input
            placeholder={tPayable("fields.billNumber.placeholder")}
            disabled={disabled}
          />
        </Form.Item>
      )}
      {show.issueDate && (
        <ProFormDatePicker
          name="issueDate"
          label={tPayable("fields.issueDate.label")}
          rules={[{ required: true, message: tCommon("common.required") }]}
        />
      )}
      {show.dueDate && (
        <ProFormDatePicker
          name="dueDate"
          label={tPayable("fields.dueDate.label")}
          rules={[{ required: true, message: tCommon("common.required") }]}
        />
      )}

      {show.originalAmountValue && (
        <Form.Item
          label={tPayable("fields.originalAmountValue.label")}
          name="originalAmountValue"
          rules={[
            {
              required: true,
              message: tPayable("fields.originalAmountValue.required"),
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            precision={2}
            disabled={disabled}
          />
        </Form.Item>
      )}

      {show.originalAmountCurrency && (
        <RemoteCurrencySelect
          name="originalAmountCurrency"
          label="幣別"
          rules={[{ required: true, message: tCommon("required") }]}
        />
      )}

      {show.status && (
        <Form.Item
          label={tPayable("fields.status.label")}
          name="status"
          rules={[
            { required: true, message: tPayable("fields.status.required") },
          ]}
        >
          <Select
            placeholder={tPayable("fields.status.placeholder")}
            disabled={disabled}
            options={[
              { value: 0, label: tPayable("status.unreconciled") },
              { value: 1, label: tPayable("status.partially_reconciled") },
              { value: 2, label: tPayable("status.reconciled") },
            ]}
          />
        </Form.Item>
      )}
      {show.note && (
        <Form.Item label={tPayable("fields.note.label")} name="note">
          <Input
            placeholder={tPayable("fields.note.placeholder")}
            disabled={disabled}
            allowClear 
          />
        </Form.Item>
      )}
    </>
  );
};

export default PayableFormFields;
