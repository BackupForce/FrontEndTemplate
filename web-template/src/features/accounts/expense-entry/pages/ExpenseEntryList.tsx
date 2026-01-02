// features/accounts/expense-entry/pages/ExpenseEntryList.tsx
import ProCrudPage from "@/shared/ui/crud/ProCrudPage";
import { expenseEntryApi } from "@/features/accounts/expense-entry/api/expenseEntry.api";
import { searchColumns, tableColumns } from "@/features/accounts/expense-entry/components/forms/expenseEntryColumns";
import ExpenseEntryCreateModal from "@/features/accounts/expense-entry/components/modals/ExpenseEntryCreateModal";
import ExpenseEntryEditModal from "@/features/accounts/expense-entry/components/modals/ExpenseEntryEditModal";
import type { ExpenseEntryDto } from "@/features/accounts/expense-entry/types/dto";
import { useAuth } from "@/shared/auth/useAuth";

export default function ExpenseEntryList() {
  const { hasPermission } = useAuth();

  return (
    <ProCrudPage<ExpenseEntryDto, string>
      title="費用單"
      rowKey={(x) => x.id}
      columns={tableColumns}
      searchColumns={searchColumns}
      fetch={async (params) => {
        const page = typeof params.current === "number" ? params.current : 1;
        const pageSize = typeof params.pageSize === "number" ? params.pageSize : 10;

        // 這些就是搜尋列填的值：ProTable 自動放進 params
        const keyword = typeof params.keyword === "string" ? params.keyword : undefined;
        const categoryId = typeof params.categoryId === "string" ? params.categoryId : undefined;
        const status = typeof params.status === "number" ? params.status : undefined;
        const fromDate = typeof params.fromDate === "string" ? params.fromDate : undefined;
        const toDate = typeof params.toDate === "string" ? params.toDate : undefined;

        const res = await expenseEntryApi.list({
          page,
          pageSize,
          keyword,
          categoryId,
          status,
          fromDate,
          toDate,
        });

        return { data: res.items, total: res.totalCount };
      }}
      onRemove={async (id) => {
        await expenseEntryApi.remove?.(id);
      }}
      CreateModal={ExpenseEntryCreateModal}
      EditModal={ExpenseEntryEditModal}
      // 可選權限鉤子（比照 FinancialAccountList）
      canCreate={() => hasPermission("expense-entry:create")}
      canEdit={() => hasPermission("expense-entry:update")}
      canDelete={() => hasPermission("expense-entry:delete")}
      texts={{
        create: "新增費用單",
        edit: "編輯",
        remove: "刪除",
        removeConfirm: "確定要刪除這筆費用單嗎？",
        removeSuccess: "刪除成功",
      }}
    />
  );
}
