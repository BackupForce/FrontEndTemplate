import { ModalForm } from "@ant-design/pro-components";
import IncomeEntryFormFields from "../forms/IncomeEntryFormFields";
import { updateIncomeEntry } from "@/features/accounts/income-entry/api/income-entry.api";
import { message } from "antd";
import type { UpdateIncomeEntryRequest } from "@/features/accounts/income-entry/types/dto";

interface IncomeEntryEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: {
    id: string;
    entryDate: string;
    dueDate: string;
    originalAmountValue: number;
    originalAmountCurrency: string;
    description?: string;
    categoryId: string;
  };
  onSuccess?: () => void;
}

const IncomeEntryEditModal = ({
  open,
  onOpenChange,
  values,
  onSuccess,
}: IncomeEntryEditModalProps) => {
  return (
    <ModalForm<UpdateIncomeEntryRequest>
      title="編輯收入項目"
      open={open}
      modalProps={{ maskClosable: false }}
      onOpenChange={onOpenChange}
      initialValues={values}
      onFinish={async (formValues) => {
        try {
          await updateIncomeEntry(values.id, formValues);
          message.success("編輯成功");
          onSuccess?.();
          return true;
        } catch (error) {
          console.error("Edit failed:", error);
          message.error("編輯失敗");
          return false;
        }
      }}
    >
      <IncomeEntryFormFields 
        show={{ 
          companyId: false,
        }} 
      />
    </ModalForm>
  );
};

export default IncomeEntryEditModal;
