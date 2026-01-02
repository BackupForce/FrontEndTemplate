// features/credit/credit-case/pages/CreditCaseList.tsx
import ProCrudPage from "@/shared/ui/crud/ProCrudPage";
import { Button, message } from "antd";
import type { ProColumns } from "@ant-design/pro-components";

import { useAuth } from "@/shared/auth/useAuth";
import { triggerProCrudReload } from "@/shared/ui/crud/proCrudReload";

import { creditCaseApi } from "@/features/credit/credit-case/api/creditCase.api";
import type { CreditCaseDto, CCListQuery } from "@/features/credit/credit-case/types/dto";
import {
  searchColumns as ccSearchColumns,
  tableColumns as ccTableColumns,
} from "@/features/credit/credit-case/components/forms/creditCaseColumns";

import CreditCaseCreateModal from "@/features/credit/credit-case/components/modals/CreditCaseCreateModal";
import ApproveCreditCaseModal from "@/features/credit/credit-case/components/modals/ApproveCreditCaseModal";

// 允許的狀態值（erasableSyntaxOnly 友善）
const isCCStatus = (v: unknown): v is 0 | 1 | 2 | 3 =>
  v === 0 || v === 1 || v === 2 || v === 3;

/** 專屬 Approve 動作欄位（僅 Open 可按：status = 0） */
const approveColumn: ProColumns<CreditCaseDto> = {
  title: "審核",
  valueType: "option",
  width: 120,
  render: (_, record) => {
    const isOpen = record.status === 0; // 0 = Open
    return (
      <ApproveCreditCaseModal
        trigger={
          <Button type="link" disabled={!isOpen}>
            Approve
          </Button>
        }
        creditCaseId={record.id}
        onApproved={() => {
          message.success("審核成功");
          triggerProCrudReload();
        }}
      />
    );
  },
};

export default function CreditCaseList() {
  const { hasPermission } = useAuth();
  const columns: ProColumns<CreditCaseDto>[] = [...ccTableColumns, approveColumn];

  return (
    <ProCrudPage<CreditCaseDto, string>
      title="授信處理單"
      rowKey={(x) => x.id}
      columns={columns}
      searchColumns={ccSearchColumns}
      /** 分頁查詢：把 ProTable 的 params 轉為 API 參數 */
      fetch={async (params) => {
        const page = typeof params.current === "number" ? params.current : 1;
        const pageSize = typeof params.pageSize === "number" ? params.pageSize : 10;

        const partnerId =
          typeof params.partnerId === "string" && params.partnerId.trim()
            ? params.partnerId.trim()
            : undefined;

        const financialAccountId =
          typeof params.financialAccountId === "string" && params.financialAccountId.trim()
            ? params.financialAccountId.trim()
            : undefined;

        const status = isCCStatus(params.status) ? params.status : undefined;

        const res = await creditCaseApi.list({
          page,
          pageSize,
          partnerId,
          financialAccountId,
          status,
        } as CCListQuery);

        return { data: res.items, total: res.totalCount };
      }}
      /** 授信處理單通常不開放刪除與編輯；保留建立 */
      CreateModal={CreditCaseCreateModal}
      canCreate={() => hasPermission("credit-case:create")}
      canEdit={() => false}
      canDelete={() => false}
      texts={{
        create: "新增",
      }}
    />
  );
}
