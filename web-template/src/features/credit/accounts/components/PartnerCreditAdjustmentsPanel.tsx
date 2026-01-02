// features/credit/accounts/components/PartnerCreditAdjustmentsPanel.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  message,
  DatePicker,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { creditAccountApi } from "@/features/credit/accounts/api/creditAccount.api";

export interface PartnerCreditAdjustmentDto {
  id: string;
  amount: number;
  isTemporary: boolean;
  effectiveFromUtc: string;
  effectiveToUtc?: string | null;
  isActive: boolean;
  reason?: string | null;
  createdBy: string;
  createdAtUtc: string;
  sourceType?: string | null;
  sourceId?: string | null;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface Props {
  /** 列表查詢用：Partner Id */
  partnerId: string;
  /** 變更操作用：PartnerCreditAccount Id（聚合根） */
  partnerCreditAccountId: string;
  /** 新增/回收後若要讓外層 summary 重載，可傳此 callback */
  onChanged?: () => void;
}

/** 新增調整的表單資料 */
interface CreateAdjustmentInput {
  amount: number;
  isTemporary: boolean; // 僅用於顯示同步（不作為 submit 判斷依據）
  effectiveTo?: Dayjs | null;
  reason: string;
}

export const PartnerCreditAdjustmentsPanel: React.FC<Props> = ({
  partnerId,
  partnerCreditAccountId,
  onChanged,
}: Props) => {
  const [rows, setRows] = useState<PartnerCreditAdjustmentDto[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isTemporaryMode, setIsTemporaryMode] = useState<boolean>(false); // ✅ 以 state 掌控模式
  const [form] = Form.useForm<CreateAdjustmentInput>();

  const loadPage = useCallback(
    async (p: number, ps: number): Promise<void> => {
      try {
        setError(null);
        setLoading(true);
        const res: PagedResult<PartnerCreditAdjustmentDto> =
          await creditAccountApi.listAdjustmentsPaged(partnerId, p, ps);
        setRows(res.items);
        setTotal(res.totalCount);
        setPage(res.page);
        setPageSize(res.pageSize);
      } catch (e) {
        setError(e instanceof Error ? e.message : "載入調整紀錄失敗");
      } finally {
        setLoading(false);
      }
    },
    [partnerId]
  );

  useEffect(() => {
    void loadPage(page, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerId]);

  const onTableChange = (pagination: TablePaginationConfig): void => {
    const nextPage: number = pagination.current ?? 1;
    const nextPageSize: number = pagination.pageSize ?? 10;
    void loadPage(nextPage, nextPageSize);
  };

  const openAddPermanent = (): void => {
    setIsTemporaryMode(false); // ✅ 決定模式
    form.setFieldsValue({
      isTemporary: false, // 僅同步顯示用
      amount: 0,
      reason: "",
      effectiveTo: null,
    });
    setOpenAdd(true);
  };

  const openAddTemporary = (): void => {
    setIsTemporaryMode(true); // ✅ 決定模式
    form.setFieldsValue({
      isTemporary: true, // 僅同步顯示用
      amount: 0,
      reason: "",
      effectiveTo: dayjs().add(7, "day"),
    });
    setOpenAdd(true);
  };

  const handleSubmitAdd = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (isTemporaryMode) {
        const toUtc: string | null = values.effectiveTo
          ? values.effectiveTo.toDate().toISOString()
          : null;
        await creditAccountApi.addTemporaryAdjustment({
          accountId: partnerCreditAccountId,
          amount: values.amount,
          effectiveToUtc: toUtc,
          reason: values.reason,
        });
      } else {
        await creditAccountApi.addPermanentAdjustment({
          accountId: partnerCreditAccountId,
          amount: values.amount,
          reason: values.reason,
        });
      }

      message.success("已新增授信調整");
      setOpenAdd(false);
      void loadPage(page, pageSize);
      if (onChanged) onChanged();
    } catch (e) {
      if (e instanceof Error) message.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = useCallback(
    async (adjustmentId: string): Promise<void> => {
      try {
        await creditAccountApi.deactivateAdjustment({
          accountId: partnerCreditAccountId,
          adjustmentId,
        });
        message.success("已回收調整");
        void loadPage(page, pageSize);
        if (onChanged) onChanged();
      } catch (e) {
        if (e instanceof Error) message.error(e.message);
      }
    },
    [partnerCreditAccountId, loadPage, page, pageSize, onChanged]
  );

  const columns: ColumnsType<PartnerCreditAdjustmentDto> = useMemo(
    () => [
      {
        title: "類型",
        dataIndex: "isTemporary",
        key: "type",
        width: 90,
        render: (isTemporary: boolean) =>
          isTemporary ? <Tag color="processing">臨時</Tag> : <Tag>永久</Tag>,
      },
      {
        title: "金額",
        dataIndex: "amount",
        key: "amount",
        align: "right",
        width: 140,
        render: (v: number) =>
          v.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
      },
      {
        title: "生效起",
        dataIndex: "effectiveFromUtc",
        key: "effectiveFromUtc",
        width: 180,
        render: (v: string) => new Date(v).toLocaleString(),
      },
      {
        title: "生效迄",
        dataIndex: "effectiveToUtc",
        key: "effectiveToUtc",
        width: 180,
        render: (v?: string | null) => (v ? new Date(v).toLocaleString() : "-"),
      },
      {
        title: "狀態",
        dataIndex: "isActive",
        key: "isActive",
        width: 90,
        render: (isActive: boolean) =>
          isActive ? <Tag color="success">有效</Tag> : <Tag>無效</Tag>,
      },
      {
        title: "原因",
        dataIndex: "reason",
        key: "reason",
        ellipsis: true,
      },
      {
        title: "來源",
        key: "source",
        width: 200,
        render: (_: unknown, r: PartnerCreditAdjustmentDto) =>
          r.sourceType ? (
            <Space size={4}>
              <Tag>{r.sourceType}</Tag>
              <span>{r.sourceId ?? ""}</span>
            </Space>
          ) : (
            "-"
          ),
      },
      {
        title: "建立者/時間",
        key: "created",
        width: 220,
        render: (_: unknown, r: PartnerCreditAdjustmentDto) => (
          <Space direction="vertical" size={0}>
            <span>{r.createdBy}</span>
            <span style={{ color: "rgba(0,0,0,.45)" }}>
              {new Date(r.createdAtUtc).toLocaleString()}
            </span>
          </Space>
        ),
      },
      {
        title: "操作",
        key: "actions",
        width: 120,
        render: (_: unknown, r: PartnerCreditAdjustmentDto) => (
          <Space>
            {r.isActive ? (
              <Popconfirm
                title="回收調整"
                description="確定要回收這筆調整嗎？"
                okText="回收"
                cancelText="取消"
                onConfirm={() => {
                  void handleDeactivate(r.id);
                }}
              >
                <Button danger type="link">
                  回收
                </Button>
              </Popconfirm>
            ) : null}
          </Space>
        ),
      },
    ],
    [handleDeactivate]
  );

  return (
    <Card
      title={
        <Space>
          <span>授信調整紀錄</span>
          <Button type="primary" onClick={openAddPermanent}>
            新增永久調整
          </Button>
          <Button onClick={openAddTemporary}>新增臨時調整</Button>
          <Button
            onClick={() => {
              void loadPage(page, pageSize);
            }}
          >
            重新整理
          </Button>
        </Space>
      }
    >
      {error ? (
        <Alert
          type="error"
          message="載入失敗"
          description={error}
          style={{ marginBottom: 16 }}
        />
      ) : null}
      <Table<PartnerCreditAdjustmentDto>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={rows}
        onChange={onTableChange}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
        }}
        size="middle"
      />

      {/* 新增調整 Modal */}
      <Modal
        title="新增授信調整"
        open={openAdd}
        onOk={handleSubmitAdd}
        onCancel={() => {
          setOpenAdd(false);
        }}
        confirmLoading={submitting}
        maskClosable={false}
        destroyOnClose={true}
      >
        <Form<CreateAdjustmentInput> form={form} layout="vertical" preserve={false}>
          <Form.Item
            label="調整金額（正數=調升，負數=調降）"
            name="amount"
            rules={[
              { required: true, message: "請輸入調整金額" },
              { type: "number", min: -999999999, max: 999999999, message: "金額超出範圍" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} precision={2} controls={true} />
          </Form.Item>

          {/* 類型顯示（以 state 為準） */}
          <Form.Item label="類型">
            <Space>
              <Tag color="default">永久</Tag>
              <Tag color="processing">臨時</Tag>
              <span style={{ color: "rgba(0,0,0,.45)" }}>
                目前：{isTemporaryMode ? "臨時" : "永久"}
              </span>
            </Space>
          </Form.Item>

          {/* 隱藏欄位（僅同步顯示用途，不參與分支判斷） */}
          <Form.Item name="isTemporary" hidden>
            <Input type="hidden" />
          </Form.Item>

          <Form.Item
            label="到期時間（僅臨時）"
            name="effectiveTo"
            extra="臨時調整可設定到期時間；永久調整可留空"
          >
            <DatePicker showTime style={{ width: "100%" }} disabled={!isTemporaryMode} />
          </Form.Item>

          <Form.Item
            label="原因"
            name="reason"
            rules={[{ required: true, message: "請輸入原因" }, { max: 200, message: "不可超過 200 字" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
