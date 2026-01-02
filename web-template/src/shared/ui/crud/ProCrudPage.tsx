import React, { useEffect, useMemo, useRef, useState } from "react";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Space, message } from "antd";
import { PROCRUD_RELOAD_EVENT } from "@/shared/ui/crud/proCrudReload";

type BaseRow = Record<string, unknown>;

type FetchParams = {
  current?: number;
  pageSize?: number;
  keyword?: string;
  [key: string]: unknown;
};

type FetchResult<TItem> = {
  data: TItem[];
  total: number;
};

export interface ProCrudPageProps<TItem, TId extends string | number> {
  /** 頁面標題 */
  title: string;

  /** 唯一鍵產生函式 */
  rowKey: (item: TItem) => TId;

  /** 表格欄位（不含操作欄）；呼叫端維持嚴格型別 */
  columns: ProColumns<TItem>[];

  /** 搜尋欄位（可選）；呼叫端維持嚴格型別 */
  searchColumns?: ProColumns<TItem>[];

  /** 清單取得函式：回傳 data/total 即可 */
  fetch: (params: FetchParams) => Promise<FetchResult<TItem>>;

  /** 刪除（可選） */
  onRemove?: (id: TId) => Promise<void>;

  /** 建立/編輯 Modal（沿用你既有的元件） */
  CreateModal?: React.ComponentType<{
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
  }>;
  EditModal?: React.ComponentType<{
    open: boolean;
    data: TItem | null;
    onCancel: () => void;
    onSuccess: () => void;
  }>;

  /** 權限控制（可選，預設允許） */
  canCreate?: () => boolean;
  canEdit?: (row: TItem) => boolean;
  canDelete?: (row: TItem) => boolean;

  /** 文案（可選） */
  texts?: {
    create?: string;
    edit?: string;
    remove?: string;
    removeConfirm?: string;
    removeSuccess?: string;
  };
}

export default function ProCrudPage<TItem, TId extends string | number>({
  title,
  rowKey,
  columns,
  searchColumns,
  fetch,
  onRemove,
  CreateModal,
  EditModal,
  canCreate,
  canEdit,
  canDelete,
  texts,
}: ProCrudPageProps<TItem, TId>) {
  const actionRef = useRef<ActionType | undefined>(undefined);

  // 🔽 新增：外部 reload 事件監聽
  useEffect(() => {
    const onReload = () => actionRef.current?.reload?.();
    window.addEventListener(PROCRUD_RELOAD_EVENT, onReload);
    return () => window.removeEventListener(PROCRUD_RELOAD_EVENT, onReload);
  }, []);

  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editingRow, setEditingRow] = useState<TItem | null>(null);

  const allowCreate: boolean = useMemo<boolean>(() => {
    if (typeof canCreate === "function") {
      return canCreate();
    } else {
      return true;
    }
  }, [canCreate]);

  // 操作欄只在內部用 TItem 型別，確保 render(record) 還是 TItem
  const finalColumnsT: ProColumns<TItem>[] = useMemo(() => {
    const base: ProColumns<TItem>[] = [...columns];

    const showAction: boolean =
      typeof EditModal === "function" || typeof onRemove === "function";

    if (showAction) {
      const actionCol: ProColumns<TItem> = {
        title: "操作",
        valueType: "option",
        fixed: "right",
        width: 160,
        render: (_: unknown, record: TItem) => {
          const id: TId = rowKey(record);
          const canEditRow: boolean =
            typeof canEdit === "function" ? canEdit(record) : true;
          const canDeleteRow: boolean =
            typeof canDelete === "function" ? canDelete(record) : true;

          return (
            <Space>
              {EditModal && canEditRow ? (
                <Button
                  type="link"
                  onClick={() => {
                    setEditingRow(record);
                    setEditOpen(true);
                  }}
                >
                  {texts?.edit ?? "編輯"}
                </Button>
              ) : null}

              {onRemove && canDeleteRow ? (
                <Popconfirm
                  title={texts?.removeConfirm ?? "確定要刪除這筆資料嗎？"}
                  okText="刪除"
                  cancelText="取消"
                  onConfirm={async () => {
                    try {
                      await onRemove(id);
                      message.success(texts?.removeSuccess ?? "刪除成功");
                      if (actionRef.current !== undefined) {
                        actionRef.current.reload();
                      }
                    } catch (err: unknown) {
                      if (err instanceof Error) {
                        message.error(err.message);
                      } else {
                        message.error("刪除失敗");
                      }
                    }
                  }}
                >
                  <Button type="link" danger>
                    {texts?.remove ?? "刪除"}
                  </Button>
                </Popconfirm>
              ) : null}
            </Space>
          );
        },
      };

      base.push(actionCol);
    }

    return base;
  }, [columns, EditModal, onRemove, canEdit, canDelete, rowKey, texts]);

  // 只有在要丟給 ProTable 時，才把欄位陣列轉成 BaseRow 版本
  const mergedColumnsForTable: ProColumns<BaseRow>[] = useMemo(() => {
    const cols = [...(searchColumns ?? []), ...finalColumnsT] as ProColumns<TItem>[];
    return cols as unknown as ProColumns<BaseRow>[];
  }, [searchColumns, finalColumnsT]);

  return (
    <PageContainer
      header={{
        title,
        extra:
          allowCreate && CreateModal
            ? [
                <Button
                  key="create"
                  type="primary"
                  onClick={() => {
                    setCreateOpen(true);
                  }}
                >
                  {texts?.create ?? "新增"}
                </Button>,
              ]
            : [],
      }}
    >
      <ProTable<BaseRow>
        actionRef={actionRef}
        columns={mergedColumnsForTable}
        rowKey={(record: BaseRow) => String(rowKey(record as unknown as TItem))}
        search={{ labelWidth: "auto" }}
        pagination={{ pageSize: 10 }}
        request={async (params) => {
          try {
            // 將 ProTable 的 params（外部型別）轉為我們的 FetchParams
            const res = await fetch(params as unknown as FetchParams);
            return {
              data: res.data as unknown as BaseRow[],
              total: res.total,
              success: true,
            };
          } catch (err: unknown) {
            if (err instanceof Error) {
              message.error(err.message);
            } else {
              message.error("載入清單失敗");
            }
            return { data: [], total: 0, success: false };
          }
        }}
        //toolBarRender={false}
        toolBarRender={() => []}
        scroll={{ x: true }}
      />

      {CreateModal ? (
        <CreateModal
          open={createOpen}
          onCancel={() => {
            setCreateOpen(false);
          }}
          onSuccess={() => {
            setCreateOpen(false);
            if (actionRef.current !== undefined) {
              actionRef.current.reload();
            }
          }}
        />
      ) : null}

      {EditModal ? (
        <EditModal
          open={editOpen}
          data={editingRow}
          onCancel={() => {
            setEditOpen(false);
            setEditingRow(null);
          }}
          onSuccess={() => {
            setEditOpen(false);
            setEditingRow(null);
            if (actionRef.current !== undefined) {
              actionRef.current.reload();
            }
          }}
        />
      ) : null}
    </PageContainer>
  );
}
