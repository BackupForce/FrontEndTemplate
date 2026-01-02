// features/accounts/invoice/pages/InvoiceDetailPage.tsx
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
  Popconfirm,
  message,
  Result,
  Modal,
  Typography,
  DatePicker,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { tInvoice } from "@/shared/i18n/helpers";
import type { InvoiceDetailDto, InvoiceLineDto } from "@/features/sales/invoice/types/dto";
import { invoiceApi } from "@/features/sales/invoice/api/invoice.api";
import SelectSalesRecordsModal from "@/features/sales/invoice/components/modals/SelectSalesRecordsModal";
import dayjs, { Dayjs } from "dayjs";

const { Paragraph, Text } = Typography;

// 依照後端 enum 映射：0 = Draft（如不同請替換）
const isDraft = (status: number): boolean => status === 0;

// 1 = Posted（如不同請替換）
const isPostedStatus = (status: number): boolean => status === 1;

// 共用的兩位小數格式化，避免 null/undefined 造成 toFixed crash
const fmt2 = (n?: number | null): string => Number(n ?? 0).toFixed(2);

const InvoiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [detail, setDetail] = useState<InvoiceDetailDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [creatingAr, setCreatingAr] = useState<boolean>(false);

  // 過帳 Modal
  const [postOpen, setPostOpen] = useState<boolean>(false);
  const [posting, setPosting] = useState<boolean>(false);
  const [postingDate, setPostingDate] = useState<Dayjs>(dayjs()); // 預設今天

  // 新：選取 SR 的 modal 與批次加入 loading
  const [selectOpen, setSelectOpen] = useState<boolean>(false);
  const [addingFromSr, setAddingFromSr] = useState<boolean>(false);

  const fetchDetail = async (): Promise<void> => {
    if (!id) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const d = await invoiceApi.getDetail(id);
      setDetail(d);
    } catch (e) {
      console.error(e);
      setDetail(null);
      setError("Failed to load invoice detail.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const readOnly = useMemo<boolean>(() => !detail || !isDraft(detail.status), [detail]);

  // 是否可過帳：草稿 + 有至少一條明細
  const canPost = useMemo<boolean>(() => {
    if (!detail) {
      return false;
    }
    const hasLines = Array.isArray(detail.lines) && detail.lines.length > 0;
    return isDraft(detail.status) && hasLines;
  }, [detail]);

  // 是否可拋轉（盡量用型別安全方式偵測 DTO 欄位，若沒有 dueDate/receivableId，就退化為只要 Posted）
  const canCreateReceivable = useMemo<boolean>(() => {
    if (!detail) {
      return false;
    }
    if (!isPostedStatus(detail.status)) {
      return false;
    }

    type MaybeCredit = InvoiceDetailDto & { dueDate?: string | null; receivableId?: string | null };

    const hasDueDateField: boolean = "dueDate" in detail;
    const hasReceivableField: boolean = "receivableId" in detail;

    const d = detail as MaybeCredit;
    const hasDueDate: boolean = hasDueDateField ? Boolean(d.dueDate) : true; // 若沒此欄位 → 視為可拋
    const linkedReceivable: boolean = hasReceivableField ? Boolean(d.receivableId) : false; // 若沒此欄位 → 視為未拋

    if (!hasDueDate) {
      return false;
    }
    if (linkedReceivable) {
      return false;
    }
    return true;
  }, [detail]);

  // 過帳 API 呼叫
  const handlePostInvoice = async (): Promise<void> => {
    if (!detail) {
      return;
    }
    setPosting(true);
    try {
      const dateStr = postingDate.format("YYYY-MM-DD");
      await invoiceApi.postInvoice(detail.id, dateStr);
      message.success("已成功過帳。");
      setPostOpen(false);
      await fetchDetail();
    } catch (e) {
      console.error(e);
      message.error("過帳失敗，請稍後再試。");
    } finally {
      setPosting(false);
    }
  };

  // 拋轉應收 API 呼叫
  const handleCreateReceivable = async (): Promise<void> => {
    if (!detail) {
      return;
    }
    setCreatingAr(true);
    try {
      const receivableId = await invoiceApi.createReceivableFromInvoice(detail.id);
      if (receivableId) {
        message.success("已拋轉為應收帳款。");
      } else {
        message.warning("伺服器未回傳識別碼，但可能已成功。");
      }
      await fetchDetail();
    } catch (e) {
      console.error(e);
      message.error("拋轉失敗，請稍後再試。");
    } finally {
      setCreatingAr(false);
    }
  };

  const columns: ColumnsType<InvoiceLineDto> = [
    { title: tInvoice("fields.line.description"), dataIndex: "description" },
    {
      title: tInvoice("fields.line.quantity"),
      dataIndex: "quantity",
      align: "right",
      render: (v?: number | null) => fmt2(v),
      width: 120,
    },
    {
      title: tInvoice("fields.line.unitPrice"),
      dataIndex: "unitPriceAmount",
      align: "right",
      render: (_: unknown, r: InvoiceLineDto) => fmt2(r.unitPriceAmount),
      width: 140,
    },
    {
      title: tInvoice("fields.line.amount"),
      dataIndex: "lineAmount",
      align: "right",
      render: (_: unknown, r: InvoiceLineDto) => fmt2(r.lineAmount),
      width: 140,
    },
    {
      title: tInvoice("fields.line.actions"),
      dataIndex: "id",
      width: 120,
      render: (lineId: string) =>
        readOnly ? null : (
          <Popconfirm
            title={tInvoice("actions.confirmDeleteLine")}
            onConfirm={async () => {
              if (!detail) {
                return;
              }
              try {
                await invoiceApi.removeInvoiceLine(detail.id, lineId);
                message.success(tInvoice("messages.deleteLineSuccess"));
                await fetchDetail();
              } catch (e) {
                console.error(e);
                message.error(tInvoice("messages.deleteLineFail"));
              }
            }}
          >
            <Button type="link" danger>
              {tInvoice("actions.delete")}
            </Button>
          </Popconfirm>
        ),
    },
  ];

  // === 三態呈現 ===
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 360 }}>
        <Spin />
      </div>
    );
  }

  if (error) {
    return (
      <PageContainer title={tInvoice("titles.detailPage")} content={false}>
        <Card>
          <Result
            status="error"
            title={tInvoice("titles.detailPage")}
            subTitle={error}
            extra={[
              <Button key="retry" type="primary" onClick={() => void fetchDetail()}>
                {tInvoice("actions.retry")}
              </Button>,
            ]}
          />
        </Card>
      </PageContainer>
    );
  }

  if (!detail) {
    return (
      <PageContainer title={tInvoice("titles.detailPage")} content={false}>
        <Card>
          <Result
            status="warning"
            title={tInvoice("titles.detailPage")}
            subTitle="No invoice found."
            extra={[
              <Button key="reload" onClick={() => void fetchDetail()}>
                {tInvoice("actions.reload")}
              </Button>,
            ]}
          />
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={tInvoice("titles.detailPage")} content={false}>
      <Card
        style={{ marginBottom: 16 }}
        extra={
          <div style={{ display: "flex", gap: 8 }}>
            {/* Draft + 有明細 才能過帳 */}
            <Button type="primary" onClick={() => setPostOpen(true)} disabled={!canPost}>
              過帳
            </Button>

            {/* 已 Posted 且尚未拋轉 才能拋轉應收 */}
            {canCreateReceivable ? (
              <Popconfirm
                title="確定要拋轉至應收帳款？"
                okText="拋轉"
                cancelText="取消"
                disabled={!canCreateReceivable}
                onConfirm={() => void handleCreateReceivable()}
              >
                <Button type="default" loading={creatingAr} disabled={!canCreateReceivable}>
                  拋轉至應收帳款
                </Button>
              </Popconfirm>
            ) : null}
          </div>
        }
      >
        <Descriptions column={2} title={tInvoice("titles.invoiceInfo")}>
          <Descriptions.Item label={tInvoice("fields.status.label")}>
            <Tag color={isDraft(detail.status) ? "blue" : "green"}>{detail.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={tInvoice("fields.invoiceNumber.label")}>
            {detail.invoiceNumber}
          </Descriptions.Item>
          <Descriptions.Item label={tInvoice("fields.currency.label")}>
            {detail.currencyCode}
          </Descriptions.Item>
          <Descriptions.Item label={tInvoice("fields.totalAmount.label")}>
            {fmt2(detail.totalAmount)} {detail.totalAmountCurrencyCode}
          </Descriptions.Item>
          <Descriptions.Item label={tInvoice("fields.createdAt.label")}>
            {detail.createdAt}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title={tInvoice("titles.lines")}>
        {!readOnly && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 16 }}>
            {/* 從 SalesRecords 多選加入（批次 API） */}
            <Button type="primary" onClick={() => setSelectOpen(true)} loading={addingFromSr}>
              {tInvoice("actions.addFromSalesRecords")}
            </Button>
          </div>
        )}
        <Table<InvoiceLineDto> rowKey="id" columns={columns} dataSource={detail.lines} pagination={false} />
      </Card>

      {/* 多選 SR 的 Modal（選完呼叫批次 API） */}
      <SelectSalesRecordsModal
        open={selectOpen}
        invoiceId={detail.id}
        onCancel={() => setSelectOpen(false)}
        onOk={async (selectedSrIds) => {
          if (selectedSrIds.length === 0) {
            setSelectOpen(false);
            return;
          }
          setAddingFromSr(true);
          try {
            const result = await invoiceApi.addLinesFromSalesRecords(detail.id, selectedSrIds);
            const okCount = result.succeeded.length;
            const failCount = result.failed.length;

            if (okCount > 0) {
              message.success(
                tInvoice("messages.batchAddLineSuccess", {
                  ok: okCount,
                  fail: failCount,
                })
              );
            }
            if (failCount > 0) {
              // 彈出錯誤明細
              Modal.warning({
                title: tInvoice("titles.batchAddLineResult"),
                maskClosable: false,
                okText: tInvoice("actions.ok"),
                content: (
                  <div>
                    <Paragraph>
                      <Text strong>{tInvoice("labels.succeeded")}:</Text> {okCount} &nbsp;&nbsp;
                      <Text strong>{tInvoice("labels.failed")}:</Text> {failCount}
                    </Paragraph>
                    {result.failed.length > 0 && (
                      <>
                        <Paragraph style={{ marginBottom: 8 }}>
                          <Text type="secondary">{tInvoice("labels.failedDetails")}:</Text>
                        </Paragraph>
                        <div
                          style={{
                            maxHeight: 240,
                            overflowY: "auto",
                            border: "1px solid var(--ant-color-border)",
                            padding: 8,
                            borderRadius: 6,
                          }}
                        >
                          {result.failed.map((f) => (
                            <Paragraph key={f.salesRecordId} style={{ marginBottom: 6 }}>
                              <Text code>{f.salesRecordId}</Text>&nbsp;–&nbsp;
                              <Text type="danger">{f.code}</Text>&nbsp;–&nbsp;
                              <Text>{f.message}</Text>
                            </Paragraph>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ),
              });
            }

            setSelectOpen(false);
            await fetchDetail();
          } catch (e) {
            console.error(e);
            message.error(tInvoice("messages.addLineFail"));
          } finally {
            setAddingFromSr(false);
          }
        }}
      />

      {/* 發票過帳 Modal（只選 postingDate） */}
      <Modal
        title="發票過帳"
        open={postOpen}
        onCancel={() => setPostOpen(false)}
        onOk={() => void handlePostInvoice()}
        okText="確定過帳"
        cancelText="取消"
        confirmLoading={posting}
        maskClosable={false}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <div style={{ marginBottom: 8 }}>過帳日期</div>
            <DatePicker
              value={postingDate}
              onChange={(d) => setPostingDate(d ?? dayjs())}
              allowClear={false}
              style={{ width: "100%" }}
            />
          </div>
          <Text type="secondary">提示：過帳後將無法再編輯發票明細。</Text>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default InvoiceDetailPage;
