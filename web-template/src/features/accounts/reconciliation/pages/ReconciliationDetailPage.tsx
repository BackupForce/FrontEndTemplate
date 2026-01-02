import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { PageContainer } from "@ant-design/pro-components";
import { Card, Spin, Tabs, Divider, Descriptions, Button, Tag } from "antd";
import ReconciliationCashTransactionList from "../components/tables/ReconciliationCashTransactionList";
import ReconciliationReconcilableEntryList from "../components/tables/ReconciliationReconcilableEntryList";
import SelectableListModal from "@/shared/ui/modals/SelectableListModal";
import {
  useReconciliationDetail,
  type ActiveTab,
  type SelectableReconciliationItem,
} from "@/features/accounts/reconciliation/hooks/useReconciliationDetail";
import ReconciliationForm from "@/features/accounts/reconciliation/components/ReconciliationForm";
import ReconciliationStatusBar from "@/features/accounts/reconciliation/components/ReconciliationStatusBar";

const ReconciliationDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    detail,
    loading,
    activeTab,
    setActiveTab,
    isReadOnly,
    diffString,
    isBalanced,
    getAmountColor,
    handleFormSubmit,
    completing,
    handleComplete,
    reversecompleting,
    handleReverseComplete,
    fetchDetail,

    // Modal
    modalOpen,
    setModalOpen,
    modalLoading,
    modalItems,
    modalPage,
    modalPageSize,
    modalTotal,
    handleAdd,
    handleModalPageChange,
    handleSubmit,
    diffs,
  } = useReconciliationDetail(id);

  

  const modalColumns = useMemo(() => {
    return [
      {
        title: "日期",
        dataIndex: (activeTab === "cash" ? "transactionDate" : "entryDate") as
          | "transactionDate"
          | "entryDate",
      },
      { title: "單號", dataIndex: "referenceNumber" as const },
      { title: "金額", dataIndex: "entryAmount" as const, align: "right" as const },
      { title: "剩餘金額", dataIndex: "remainingAmount" as const, align: "right" as const },
      { title: "備註", dataIndex: "note" as const },
    ];
  }, [activeTab]);

  if (loading || !detail) {
    return <Spin />;
  }

  const hasAnyLinks =
    (detail.cashTransactionLinks?.length ?? 0) > 0 ||
    (detail.reconcilableEntryLinks?.length ?? 0) > 0;

  return (
    <PageContainer title="沖帳單明細" content={false}>
      {/* 新增描述區塊 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <Descriptions column={2} title="沖帳單資訊">
            <Descriptions.Item label="狀態">
              <Tag color={detail.status === "COMPLETED" ? "green" : "blue"}>
                {detail.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="沖帳日期">
              {detail.reconciledAt}
            </Descriptions.Item>
            <Descriptions.Item label="對象名稱">
              {detail.partnerName}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <ReconciliationForm
          readonly={isReadOnly}
          defaultValues={{
            referenceNumber: detail.referenceNumber,
            note: detail.note,
          }}
          onSubmit={handleFormSubmit}
        />
      </Card>

      <Card>
        {hasAnyLinks && (
          <ReconciliationStatusBar
            isReadOnly={isReadOnly}
            diffString={diffString}
            isBalanced={isBalanced}
            getAmountColor={getAmountColor}
            completing={completing}
            onComplete={handleComplete}
            reverseCompleting={reversecompleting}
            onReverseComplete={handleReverseComplete}
          />
        )}

        {/* 鎖定遮罩：完成後禁止任何操作（新增/編輯/刪除） */}
        <div style={{ position: "relative" }}>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key as ActiveTab);
            }}
            items={[
              {
                key: "cash",
                label: "已連結的金流紀錄",
                children: (
                  <ReconciliationCashTransactionList
                    reconciliationId={detail.id}
                    transactions={detail.cashTransactionLinks}
                    onChanged={fetchDetail}
                    readOnly={isReadOnly}
                  />
                ),
              },
              {
                key: "entries",
                label: "已連結的帳務紀錄",
                children: (
                  <ReconciliationReconcilableEntryList
                    reconciliationId={detail.id}
                    entries={detail.reconcilableEntryLinks}
                    onChanged={fetchDetail}
                    readOnly={isReadOnly}
                  />
                ),
              },
            ]}
          />

          {/* 3) 「新增」按鈕唯讀時直接不顯示（避免只是 disabled） */}
          {!isReadOnly && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 16,
                marginTop: 16,
              }}
            >
              <Button
                type="primary"
                onClick={async () => {
                  await handleAdd();
                }}
              >
                {activeTab === "cash" ? "新增金流紀錄" : "新增帳務紀錄"}
              </Button>
            </div>
          )}

          <Divider />
          {hasAnyLinks ? (
            <Descriptions title="目前沖帳差額" column={1}>
              <Descriptions.Item label="差額 (方向後)">
                <span style={{ color: getAmountColor(diffString) }}>
                  {diffString} 元（
                  {parseFloat(diffString) > 0
                    ? "多收"
                    : parseFloat(diffString) < 0
                    ? "少收"
                    : "平帳"}
                  ）
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="金流淨額">
                {diffs.cashNet.toFixed(2)} 元（In: {diffs.cashIn.toFixed(2)} /
                Out: {diffs.cashOut.toFixed(2)}）
              </Descriptions.Item>
              <Descriptions.Item label="帳務淨額">
                {diffs.entryNet.toFixed(2)} 元（In: {diffs.entryIn.toFixed(2)} /
                Out: {diffs.entryOut.toFixed(2)}）
              </Descriptions.Item>
              <Descriptions.Item label="計算公式">
                淨額 = 金流淨額 − 帳務淨額（= 0 表示平帳）
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <div style={{ opacity: 0.8 }}>
              尚未加入任何連結項目，請先新增金流或帳務紀錄。
            </div>
          )}
        </div>
      </Card>

      <SelectableListModal<SelectableReconciliationItem>
        open={modalOpen}
        onOpenChange={setModalOpen}
        loading={modalLoading}
        dataSource={modalItems}
        rowKey={(x) => x.id}
        columns={modalColumns}
        title={activeTab === "cash" ? "選擇未沖金流" : "選擇未沖帳務"}
        page={modalPage}
        pageSize={modalPageSize}
        total={modalTotal}
        onPageChange={async (p, ps) => {
          await handleModalPageChange(p, ps);
        }}
        onSubmit={async (items) => {
          await handleSubmit(items);
        }}
      />
    </PageContainer>
  );
};

export default ReconciliationDetailPage;
