// features/sales/sales-record/pages/SalesRecordDetailPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { PageContainer } from "@ant-design/pro-components";
import {
  Card,
  Spin,
  Descriptions,
  Button,
  Tag,
  Table,
  Result,
  Typography,
  //type TableProps, // ✅ 用 TableProps 取代 ColumnsType
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { tSalesRecord } from "@/shared/i18n/helpers";
import type {
  SalesRecordDetailDto,
  SalesRecordLineDto,
} from "@/features/sales/sales-record/types/dto";
import { salesRecordApi } from "@/features/sales/sales-record/api/salesRecord.api";

import InvoiceFromSalesRecordsModal from "@/features/sales/invoice/components/modals/InvoiceFromSalesRecordsModal"; // ⬅ 新增

const { Paragraph, Text } = Typography;

// 兼容數字或字串的 Draft 判斷：0 或 "draft"
const isDraft = (status: number | string): boolean => {
  if (typeof status === "number") {
    return status === 0;
  }
  return status.toString().toLowerCase() === "draft";
};

// 共用的兩位小數格式化
const fmt2 = (n?: number | null): string => Number(n ?? 0).toFixed(2);

const SalesRecordDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [detail, setDetail] = useState<SalesRecordDetailDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


    // ⬇️ 新增：控制 Modal 開關
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const canCreateInvoice = useMemo<boolean>(() => {
    if (!detail) {
      return false;
    }
    // 題意：status=2 表示 Approved；若已拋轉 (有 invoiceId) 就不顯示
    return detail.status == 2 && !detail.invoiceId;
  }, [detail]);

  // ⬇️ 改為「打開 Modal」，不直接呼叫 API
  const openCreateInvoiceModal = (): void => {
    if (!detail) {
      return;
    }
    setCreateModalOpen(true);
  };

  const closeCreateInvoiceModal = (): void => {
    setCreateModalOpen(false);
  };

  const afterCreateSuccess = async (): Promise<void> => {
    setCreateModalOpen(false);
    // 與你原先流程一致：成功後刷新一次 detail（以反映 invoiceId 等）
    await fetchDetail();
  };


  const fetchDetail = async (): Promise<void> => {
    if (!id) {
      // ✅ 避免卡在不明狀態
      setLoading(false);
      setError("Invalid route: id is missing.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const d = await salesRecordApi.getDetail(id);
      setDetail(d);
    } catch (e) {
      console.error(e);
      setDetail(null);
      setError("Failed to load sales record detail.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const readOnly = useMemo<boolean>(() => !detail || !isDraft(detail.status), [detail]);

  // ✅ 用 TableProps<T>['columns'] 以避免 ColumnsType 匯出差異
  const columns: ColumnsType<SalesRecordLineDto> = [
    {
      title: tSalesRecord("fields.line.description"),
      dataIndex: "snapshotSkuName",
      render: (v?: string) => v ?? "",
    },
    {
      title: tSalesRecord("fields.line.quantity"),
      dataIndex: "quantity",
      align: "right",
      render: (v?: number | null) => fmt2(v),
      width: 120,
    },
    {
      title: tSalesRecord("fields.line.unitPrice"),
      dataIndex: "unitPriceAmount",
      align: "right",
      render: (_: unknown, r: SalesRecordLineDto) => fmt2(r.unitPriceAmount),
      width: 140,
    },
    {
      title: tSalesRecord("fields.line.subtotal"),
      dataIndex: "lineNetAmount",
      align: "right",
      render: (_: unknown, r: SalesRecordLineDto) => fmt2(r.lineNetAmount),
      width: 140,
    },
    {
      title: tSalesRecord("fields.line.tax"),
      dataIndex: "lineTaxAmount",
      align: "right",
      render: (_: unknown, r: SalesRecordLineDto) => fmt2(r.lineTaxAmount),
      width: 140,
    },
    {
      title: tSalesRecord("fields.line.amount"),
      dataIndex: "lineGrossAmount",
      align: "right",
      render: (_: unknown, r: SalesRecordLineDto) => fmt2(r.lineGrossAmount),
      width: 140,
    },
  ];

  // === 三態呈現（參考你的發票頁邏輯） ===
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 360 }}>
        <Spin />
      </div>
    );
  }

  if (error) {
    return (
      <PageContainer title={tSalesRecord("titles.detailPage")} content={false}>
        <Card>
          <Result
            status="error"
            title={tSalesRecord("titles.detailPage")}
            subTitle={error}
            extra={[
              <Button key="retry" type="primary" onClick={() => void fetchDetail()}>
                {tSalesRecord("actions.retry")}
              </Button>,
            ]}
          />
        </Card>
      </PageContainer>
    );
  }

  if (!detail) {
    return (
      <PageContainer title={tSalesRecord("titles.detailPage")} content={false}>
        <Card>
          <Result
            status="warning"
            title={tSalesRecord("titles.detailPage")}
            subTitle="No sales record found."
            extra={[
              <Button key="reload" onClick={() => void fetchDetail()}>
                {tSalesRecord("actions.reload")}
              </Button>,
            ]}
          />
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={tSalesRecord("titles.detailPage")} content={false}>
      <Card style={{ marginBottom: 16 }}
      // ⬇ 在標題列右側加 actions（若你想放在表格下方也可）
        extra={
          canCreateInvoice ? (
            <Button type="primary" onClick={openCreateInvoiceModal}>
              拋轉建立發票
            </Button>
          ) : null
        }
      >
        <Descriptions column={2} title={tSalesRecord("titles.invoiceInfo") /* TODO: 專屬 salesRecord 字串 */}>
          <Descriptions.Item label={tSalesRecord("fields.status.label")}>
            <Tag color={isDraft(detail.status) ? "blue" : "green"}>{String(detail.status)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={tSalesRecord("fields.currency.label")}>
            {detail.currencyCode}
          </Descriptions.Item>
          <Descriptions.Item label={tSalesRecord("fields.totalAmount.label")}>
            {fmt2(detail.grossAmount)} {detail.grossAmountCurrencyCode}
          </Descriptions.Item>
          <Descriptions.Item label={tSalesRecord("fields.createdAt.label")}>
            {/* 沒 createdAt 就顯示 PostingDate */}
            {detail.postingDate}
          </Descriptions.Item>
          <Descriptions.Item label="Kind">{detail.kind}</Descriptions.Item>
          <Descriptions.Item label="Note">{detail.note ?? ""}</Descriptions.Item>
          {detail.invoiceId && (
            <Descriptions.Item label="Invoice Id">
              <Text code>{detail.invoiceId}</Text>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card title={tSalesRecord("titles.lines")}>
        <Table<SalesRecordLineDto>
          rowKey="id"
          columns={columns}
          // ✅ 防呆：避免傳 undefined 給 Table
          dataSource={detail?.lines ?? []}
          pagination={false}
        />
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <Paragraph style={{ marginBottom: 4 }}>
            <Text strong>{tSalesRecord("fields.subtotal.label")}:</Text>&nbsp;
            {fmt2(detail.netAmount)} {detail.netAmountCurrencyCode}
          </Paragraph>
          <Paragraph style={{ marginBottom: 4 }}>
            <Text strong>{tSalesRecord("fields.tax.label")}:</Text>&nbsp;
            {fmt2(detail.taxAmount)} {detail.taxAmountCurrencyCode}
          </Paragraph>
          <Paragraph>
            <Text strong>{tSalesRecord("fields.totalAmount.label")}:</Text>&nbsp;
            {fmt2(detail.grossAmount)} {detail.grossAmountCurrencyCode}
          </Paragraph>
        </div>
      </Card>
      {/* ⬇️ 加上從 SR 拋轉的 Modal */}
      {detail && (
        <InvoiceFromSalesRecordsModal
          open={createModalOpen}
          onCancel={closeCreateInvoiceModal}
          detail={detail}
          onSuccess={afterCreateSuccess}
        />
      )}
    </PageContainer>
  );
};

export default SalesRecordDetailPage;
