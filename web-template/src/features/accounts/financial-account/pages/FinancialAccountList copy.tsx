import { useRef, useState } from "react";
import { ProTable, PageContainer } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Grid } from "antd";
import {financialAccountApi} from "@/features/accounts/financial-account/api/financialAccount.api";
import type { FinancialAccountDto } from "@/features/accounts/financial-account/types/dto";
import FinancialAccountCreateModal from "../components/modals/FinancialAccountCreateModal";
import FinancialAccountEditModal from "../components/modals/FinancialAccountEditModal";
import Can from "@/shared/auth/Can";
import { searchColumns, tableColumns } from "../components/forms/financialAccountColumns";
import { createActionColumn } from "@/shared/ui/columns/actionColumnFactory";
import { useApiErrorHandler } from "@/shared/ui/errors/useApiErrorHandler";

const { useBreakpoint } = Grid;

const FinancialAccountList = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const handleError = useApiErrorHandler("financialAccount");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FinancialAccountDto | null>(null);

  const handleEdit = (record: FinancialAccountDto) => {
    setEditingItem(record);
    setEditModalOpen(true);
  };

  const screens = useBreakpoint();

  const columns: ProColumns<FinancialAccountDto>[] = [
    ...searchColumns,
    ...tableColumns,
    createActionColumn({
      onEdit: handleEdit,
      onDelete: async (item) => {
        await financialAccountApi.remove(item.id);
      },
      permissionPrefix: "financialAccount",
      actionRef,
      handleError,
      screens
    }),
  ];

  return (
    <PageContainer>
      <ProTable<FinancialAccountDto>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={async () => {
          const result = await financialAccountApi.list();

          return {
            data: result,
            total: result.length,
            success: true,
          };
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        options={false}
        search={{
          defaultCollapsed: true,
        }}
        toolBarRender={() => [
          <Can permission="financialAccount:create" key="create">
            <Button type="primary" onClick={() => setCreateModalOpen(true)}>
              建立金融帳戶
            </Button>
          </Can>,
        ]}
      />

      <FinancialAccountCreateModal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          actionRef.current?.reload();
        }}
      />

      <FinancialAccountEditModal
        open={editModalOpen}
        data={editingItem}
        onCancel={() => setEditModalOpen(false)}
        onSuccess={() => {
          setEditModalOpen(false);
          setEditingItem(null);
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
};

export default FinancialAccountList;
