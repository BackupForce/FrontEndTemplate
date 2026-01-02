// src/pages/cash-transactions/CashTransactionCreateModal.tsx
import { ModalForm } from "@ant-design/pro-components";
import { message } from "antd";
import { createCashTransaction } from "@/features/accounts/cash-transaction/api/cash-transaction.api";
import type { CreateCashTransactionRequest } from "@/features/accounts/cash-transaction/types/dto";
import CashTransactionFormFields from "../forms/CashTransactionFormFields";

interface CashTransactionCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CashTransactionCreateModal = ({
  open,
  onOpenChange,
  onSuccess,
}: CashTransactionCreateModalProps) => {
  return (
    <ModalForm<CreateCashTransactionRequest>
      title="新增現金交易"
      open={open}
      modalProps={{ maskClosable: false }}
      onOpenChange={onOpenChange}
      onFinish={async (values) => {
        try {
          await createCashTransaction(values);
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
      <CashTransactionFormFields />
    </ModalForm>
  );
};

export default CashTransactionCreateModal;
