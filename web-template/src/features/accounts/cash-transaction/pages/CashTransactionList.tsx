// src/pages/cash-transactions/CashTransactionList.tsx
import { useRef, useState } from "react";
import { ProTable, PageContainer } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Grid  } from "antd";
import { getCashTransactions, deleteCashTransaction } from "@/features/accounts/cash-transaction/api/cash-transaction.api";
import type { CashTransactionItem } from "@/features/accounts/cash-transaction/types/dto";
import { searchColumns, tableColumns } from "../components/forms/cashTransactionColumns";
import { createActionColumn } from "@/shared/ui/columns/actionColumnFactory";
import { useApiErrorHandler } from "@/shared/ui/errors/useApiErrorHandler";
//import { useNavigate } from "react-router-dom";
import Can from "@/shared/auth/Can";
import { tCashTrans } from "@/shared/i18n/helpers";
import CashTransactionCreateModal from "@/features/accounts/cash-transaction/components/modals/CashTransactionCreateModal";
import { useTabContext } from "@/app/providers/TabProvider";
const { useBreakpoint } = Grid;

const CashTransactionList = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const handleError = useApiErrorHandler("cashTransaction");
  //const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { openTab } = useTabContext();

  const screens = useBreakpoint();

  const columns: ProColumns<CashTransactionItem>[] = [
    ...searchColumns,
    ...tableColumns,
    createActionColumn({
      onEdit: (item) => {
      openTab(`/cash-transactions/${item.id}`, "現金交易明細");
    },
      onDelete: async (item) => {
        await deleteCashTransaction(item.id);
        actionRef.current?.reload();
      },
      permissionPrefix: "cashTransaction",
      actionRef,
      handleError,
      screens
    }),
  ];

  return (
    <PageContainer>
      <ProTable<CashTransactionItem>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        scroll={{ x: 'max-content' }}   // ← 這行啟用水平捲軸，寬度依欄寬總和
        tableLayout="fixed"
        cardProps={{ bodyStyle: { overflowX: 'auto' } }}
        request={async (params) => {
          const { current = 1, pageSize = 10 } = params;

          const result = await getCashTransactions({
            page: current,
            pageSize,
          });

          return {
            data: result.items,
            total: result.totalCount,
            success: true,
          };
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        search={{
          defaultCollapsed: true,
        }}
        options={false}
        toolBarRender={() => [
          <Can permission="cashTransaction:create" key="create">
            <Button type="primary" onClick={() => setCreateModalOpen(true)}>
              {tCashTrans("create.title")}
            </Button>
          </Can>,
        ]}
      />

      <CashTransactionCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={() => {
          actionRef.current?.reload(); // 重新載入列表
          setCreateModalOpen(false); // 關閉 Modal
        }}
      />
    </PageContainer>
  );
};

export default CashTransactionList;
