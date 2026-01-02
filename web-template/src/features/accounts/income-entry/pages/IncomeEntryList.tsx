import { useRef, useState } from "react";
import { ProTable, PageContainer } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Grid } from "antd";
import { tIncome } from "@/shared/i18n/helpers";
import { getIncomeEntries, deleteIncomeEntry } from "@/features/accounts/income-entry/api/income-entry.api";
import type { IncomeEntryItem } from "@/features/accounts/income-entry/types/dto";
import IncomeEntryCreateModal from "../components/modals/IncomeEntryCreateModal";
import IncomeEntryEditModal from "../components/modals/IncomeEntryEditModal";
import Can from "@/shared/auth/Can";
import { searchColumns, tableColumns } from "../components/forms/incomeEntryColumns";
import { createActionColumn } from "@/shared/ui/columns/actionColumnFactory";
import { useApiErrorHandler } from "@/shared/ui/errors/useApiErrorHandler";
const { useBreakpoint } = Grid;

const IncomeEntryList = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const handleError = useApiErrorHandler("incomeEntry");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IncomeEntryItem | null>(null);

  const handleEdit = (record: IncomeEntryItem) => {
    setEditingItem(record);
    setEditModalOpen(true);
  };

  const screens = useBreakpoint();

  const columns: ProColumns<IncomeEntryItem>[] = [
    ...searchColumns,
    ...tableColumns,
    createActionColumn({
      onEdit: handleEdit,
      onDelete: async (item) => {
        await deleteIncomeEntry(item.id);
      },
      permissionPrefix: "incomeEntry",
      actionRef,
      handleError,
      screens
    }),
  ];

  return (
    <PageContainer>
      <ProTable<IncomeEntryItem>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const {
            current = 1,
            pageSize = 20,
            entryDateFrom,
            entryDateTo,
            categoryId,
            status,
          } = params;

          const result = await getIncomeEntries({
            page: current,
            pageSize,
            entryDateFrom,
            entryDateTo,
            categoryId,
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
          <Can permission="incomeEntry:create" key="create">
            <Button type="primary" onClick={() => setCreateModalOpen(true)}>
              {tIncome("create.title")}
            </Button>
          </Can>,
        ]}
      />

      <IncomeEntryCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={() => {
          setCreateModalOpen(false);
          actionRef.current?.reload();
        }}
      />

      <IncomeEntryEditModal
        open={editModalOpen}
        values={editingItem!}
        onOpenChange={(open) => {
          setEditModalOpen(open);
          if (!open) {
            setEditingItem(null);
          }
        }}
        onSuccess={() => {
          setEditModalOpen(false);
          setEditingItem(null);
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
};

export default IncomeEntryList;
