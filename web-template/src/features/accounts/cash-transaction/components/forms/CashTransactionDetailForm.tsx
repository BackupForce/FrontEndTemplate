// src/pages/cash-transactions/CashTransactionDetailForm.tsx
import { ProDescriptions } from "@ant-design/pro-components";
import { tCashTrans } from "@/shared/i18n/helpers";
import type { CashTransactionDetail } from "@/features/accounts/cash-transaction/types/dto";
import type { FC } from "react";

interface Props {
  data: CashTransactionDetail;
}

const CashTransactionDetailForm: FC<Props> = ({ data }) => {
  return (
    
    <ProDescriptions
      column={2}
      size="middle"
      dataSource={data}
    >
      <ProDescriptions.Item label={tCashTrans("fields.companyId.label")}>
        {data.companyName}
      </ProDescriptions.Item>
      <ProDescriptions.Item label={tCashTrans("fields.transactionDate.label")}>
        {data.transactionDate}
      </ProDescriptions.Item>
      <ProDescriptions.Item label={tCashTrans("fields.amount.label")}>
        {data.amount}
      </ProDescriptions.Item>
      <ProDescriptions.Item label={tCashTrans("fields.currency.label")}>
        {data.currency}
      </ProDescriptions.Item>
      <ProDescriptions.Item label={tCashTrans("fields.direction.label")}>
        {tCashTrans(`enums.direction.${data.direction === 0 ? "in" : "out"}`)}
      </ProDescriptions.Item>
      <ProDescriptions.Item label={tCashTrans("fields.financialAccount.label")}>
        {data.financialAccountName}
      </ProDescriptions.Item>
    </ProDescriptions>
  );
};

export default CashTransactionDetailForm;
