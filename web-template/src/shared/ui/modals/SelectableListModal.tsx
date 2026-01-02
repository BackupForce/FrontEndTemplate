// src/components/SelectableListModal.tsx
import { Modal, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

export interface SelectableListModalProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;

  columns: ColumnsType<T>;
  dataSource: T[];
  rowKey: (record: T) => string;

  // ✅ 分頁（受控）
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number, pageSize: number) => void;

  // 選取控制
  defaultSelectedIds?: string[];
  onSubmit: (selectedItems: T[]) => void;

  loading?: boolean;
}

const SelectableListModal = <T extends object>({
  open,
  onOpenChange,
  title = "選擇項目",

  columns,
  dataSource,
  rowKey,

  page,
  pageSize,
  total,
  onPageChange,

  defaultSelectedIds,
  onSubmit,

  loading = false,
}: SelectableListModalProps<T>) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      if (defaultSelectedIds && defaultSelectedIds.length > 0) {
        setSelectedRowKeys(defaultSelectedIds);
      } else {
        // 若不想預設全選，拿掉這行即可
        setSelectedRowKeys(dataSource.map(rowKey));
      }
    }
  }, [open, defaultSelectedIds, dataSource, rowKey]);

  const handleOk = () => {
    const selectedItems = dataSource.filter((item) => {
      return selectedRowKeys.includes(rowKey(item));
    });
    onSubmit(selectedItems);
  };

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      onOk={handleOk}
      title={title}
      width={900}
      maskClosable={false}
      confirmLoading={loading}
    >
      <Table<T>
        rowKey={rowKey}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        size="small"
        // ✅ 分頁（受控）
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (t) => `共 ${t} 筆`,
          onChange: (p, ps) => {
            onPageChange(p, ps);
          },
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => {
            setSelectedRowKeys(keys as string[]);
          },
          // ✅ 讓選取跨頁保留（依賴穩定 rowKey）
          preserveSelectedRowKeys: true,
        }}
      />
    </Modal>
  );
};

export default SelectableListModal;
