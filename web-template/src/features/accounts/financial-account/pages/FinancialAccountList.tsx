// features/accounts/financial-account/pages/FinancialAccountList.tsx
import ProCrudPage from "@/shared/ui/crud/ProCrudPage";
import { financialAccountApi } from "@/features/accounts/financial-account/api/financialAccount.api";
import { searchColumns, tableColumns } from "@/features/accounts/financial-account/components/forms/financialAccountColumns";
import FinancialAccountCreateModal from "@/features/accounts/financial-account/components/modals/FinancialAccountCreateModal";
import FinancialAccountEditModal from "@/features/accounts/financial-account/components/modals/FinancialAccountEditModal";
import type { FinancialAccountDto } from "@/features/accounts/financial-account/types/dto";
import { useAuth } from '@/shared/auth/useAuth';

export default function FinancialAccountList() {
  const { hasPermission } = useAuth();

  return (
    <ProCrudPage<FinancialAccountDto, string>
      title="金融帳戶"
      rowKey={(x) => x.id}
      columns={tableColumns}
      searchColumns={searchColumns}
      fetch={async (params) => {
        const page = typeof params.current === "number" ? params.current : 1;
        const pageSize = typeof params.pageSize === "number" ? params.pageSize : 10;

        // 這些就是搜尋列填的值：ProTable 自動放進 params
        const name = typeof params.name === "string" ? params.name : undefined;
        const type = typeof params.type === "string" ? params.type : undefined;
        const currencyId =
          typeof params.currencyId === "string" ? params.currencyId : undefined;

        const res = await financialAccountApi.list({ page, pageSize, name, type, currencyId });
        return { data: res.items, total: res.totalCount };
      }}
      onRemove={async (id) => {
        // 如果你有刪除 API，就放這；沒有就把 onRemove 整段刪掉
        await financialAccountApi.remove?.(id);
      }}
      CreateModal={FinancialAccountCreateModal}
      EditModal={FinancialAccountEditModal}
      // 可選權限鉤子（你原本用 <Can/> 也行，這裡提供最小責任版）
      canCreate={() => hasPermission("financial-account:create")}
      canEdit={() => hasPermission("financial-account:update")}
      canDelete={() => hasPermission("financial-account:delete")}
      texts={{
        create: "新增帳戶",
        edit: "編輯",
        remove: "刪除",
        removeConfirm: "確定要刪除這個帳戶嗎？",
        removeSuccess: "刪除成功",
      }}
    />
  );
}
