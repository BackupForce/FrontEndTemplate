import React from "react";
import { Modal, Table, App, Typography, Space, Button } from "antd";
import type { ColumnsType } from "antd/es/table"; // 若你專案版本有型別衝突，可刪除這行，columns 讓 TS 自推斷即可
import { invoiceApi } from "@/features/sales/invoice/api/invoice.api";
import type { AvailableSalesRecordDto } from "@/features/sales/invoice/types/dto";

const { Text } = Typography;

type Props = {
  /** 是否開啟 */
  open: boolean;
  /** 目標發票 Id（用來查可用 SR） */
  invoiceId: string;
  /** 關閉（取消） */
  onCancel: () => void;
  /** 確認時回傳所選 SR Id 陣列 */
  onOk: (selectedSalesRecordIds: string[]) => void;
  /** 自訂標題（選用） */
  title?: string;
  /** 自訂寬度（選用） */
  width?: number | string;
};

const SelectSalesRecordsModal: React.FC<Props> = ({
  open,
  invoiceId,
  onCancel,
  onOk,
  title = "選擇銷售紀錄加入發票",
  width = 880,
}) => {
  const { message } = App.useApp();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [rows, setRows] = React.useState<AvailableSalesRecordDto[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

  const loadData = React.useCallback(async () => {
    if (!invoiceId) {
      setRows([]);
      return;
    }
    setLoading(true);
    try {
      const data = await invoiceApi.getAvailableSalesRecords(invoiceId);
      setRows(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // 你有統一錯誤攔截就會自動提示；這裡補一層保險
      void message.error("載入可選的銷售紀錄失敗");
    } finally {
      setLoading(false);
    }
  }, [invoiceId, message]);

  React.useEffect(() => {
    if (open) {
      void loadData();
      setSelectedRowKeys([]);
    }
  }, [open, loadData]);

  const handleOk = (): void => {
    const ids: string[] = selectedRowKeys.map((k) => String(k));
    onOk(ids);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]): void => {
      setSelectedRowKeys(keys);
    },
  };

  const columns: ColumnsType<AvailableSalesRecordDto> = [
    {
      title: "過帳日",
      dataIndex: "postingDate",
      key: "postingDate",
      width: 120,
      render: (value: string) => <Text>{value}</Text>, // 你有 dayjs 可再格式化
      sorter: (a, b) => a.postingDate.localeCompare(b.postingDate),
      defaultSortOrder: "descend",
    },
    {
      title: "金額",
      dataIndex: "amount",
      key: "amount",
      width: 140,
      align: "right" as const,
      render: (value: number, record) => (
        <Space size={4}>
          <Text strong>{value.toLocaleString()}</Text>
          <Text type="secondary">{record.currencyCode}</Text>
        </Space>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "備註",
      dataIndex: "note",
      key: "note",
      ellipsis: true,
    },
    {
      title: "SR Id",
      dataIndex: "id",
      key: "id",
      ellipsis: true,
    },
  ];

  return (
    <Modal
      open={open}
      title={title}
      onCancel={onCancel}
      onOk={handleOk}
      width={width}
      okText="加入"
      cancelText="取消"
      maskClosable={false} // 依你的偏好避免誤關
      destroyOnHidden
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="ok"
          type="primary"
          onClick={handleOk}
          disabled={selectedRowKeys.length === 0}
        >
          加入（{selectedRowKeys.length}）
        </Button>,
      ]}
    >
      <Table<AvailableSalesRecordDto>
        rowKey={(r) => r.id}
        dataSource={rows}
        columns={columns}
        loading={loading}
        size="middle"
        rowSelection={rowSelection}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 筆`,
        }}
      />
    </Modal>
  );
};

export default SelectSalesRecordsModal;