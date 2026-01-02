import { useRef, useState } from "react";
import { ProTable, PageContainer } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Grid } from "antd";
import { tPayable } from "@/shared/i18n/helpers";
import { getPayables, deletePayable } from "@/features/accounts/payable/api/payable.api";
import type { PayableItem } from "@/features/accounts/payable/types/dto";
import PayableCreateModal from "../components/modals/PayableCreateModal";
import PayableEditModal from "../components/modals/PayableEditModal";
import Can from "@/shared/auth/Can";
import { searchColumns, tableColumns } from "../components/forms/payableColumns";
import { createActionColumn } from "@/shared/ui/columns/actionColumnFactory";
import { useApiErrorHandler } from "@/shared/ui/errors/useApiErrorHandler";
const { useBreakpoint } = Grid;

const PayableList = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const handleError = useApiErrorHandler("payable");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PayableItem | null>(null);

  const handleEdit = (record: PayableItem) => {
    setEditingItem(record);
    setEditModalOpen(true);
  };
  const screens = useBreakpoint();

  const columns: ProColumns<PayableItem>[] = [
    ...searchColumns,
    ...tableColumns,
    createActionColumn({
      onEdit: handleEdit,
      onDelete: async (item) => {
        await deletePayable(item.id);
      },
      permissionPrefix: "payable",
      actionRef,
      handleError,
      screens
    }),
  ];

  return (
    <PageContainer>
      <ProTable<PayableItem>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const {
            current = 1,
            pageSize = 20,
            issueDateFrom,
            issueDateTo,
            supplierId,
            status,
          } = params;

          const result = await getPayables({
            page: current,
            pageSize,
            issueDateFrom,
            issueDateTo,
            supplierId,
            status,
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
        options={false}
        search={{
          defaultCollapsed: true,
        }}
        toolBarRender={() => [
          <Can permission="payable:create" key="create">
            <Button type="primary" onClick={() => setCreateModalOpen(true)}>
              {tPayable("create.title")}
            </Button>
          </Can>,
        ]}
      />

      <PayableCreateModal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          actionRef.current?.reload();
        }}
      />

      <PayableEditModal
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

export default PayableList;
