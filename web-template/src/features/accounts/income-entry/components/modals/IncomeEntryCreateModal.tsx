import { ModalForm } from "@ant-design/pro-components";
import IncomeEntryFormFields from "../forms/IncomeEntryFormFields";
import { createIncomeEntry } from "@/features/accounts/income-entry/api/income-entry.api";
import { message } from "antd";
import type { CreateIncomeEntryRequest } from "@/features/accounts/income-entry/types/dto";

interface IncomeEntryCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const IncomeEntryCreateModal = ({
  open,
  onOpenChange,
  onSuccess,
}: IncomeEntryCreateModalProps) => {

  return (
    <ModalForm<CreateIncomeEntryRequest>
      title="新增收入項目"
      open={open}
      modalProps={{ maskClosable: false }}
      onOpenChange={onOpenChange}
      onFinish={async (values) => {
        try {
          await createIncomeEntry(values);
          message.success("新增成功");
          onSuccess?.();
          return true;
        } catch (error) {
          console.error("Create failed:", error);
          message.error("新增失敗");
          return false;
        }
      }}
    >
      <IncomeEntryFormFields />
    </ModalForm>
  );
};

export default IncomeEntryCreateModal;
