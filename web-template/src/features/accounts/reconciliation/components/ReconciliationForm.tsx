import React from "react";
import { ProForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { tReconciliation } from "@/shared/i18n/helpers";

export interface ReconciliationFormValues {
  referenceNumber?: string;
  note?: string;
}

export interface ReconciliationFormProps {
  readonly: boolean;
  defaultValues: ReconciliationFormValues;
  onSubmit: (values: ReconciliationFormValues) => Promise<void>;
}

const ReconciliationForm: React.FC<ReconciliationFormProps> = ({ readonly, defaultValues, onSubmit }) => {
  return (
      <ProForm<ReconciliationFormValues>
        initialValues={defaultValues}
        readonly={readonly}
        onFinish={async (values) => {
          await onSubmit(values);
        }}
        submitter={
          readonly
            ? false
            : {
                searchConfig: { submitText: "儲存" },
                resetButtonProps: false,
              }
        }
      >
        <ProFormText
          name="referenceNumber"
          label={tReconciliation("fields.referenceNumber.label")}
          width={300}
        />
        <ProFormTextArea
          name="note"
          label={tReconciliation("fields.note.label")}
          fieldProps={{ autoSize: true }}
        />
      </ProForm>
  );
};

export default ReconciliationForm;
