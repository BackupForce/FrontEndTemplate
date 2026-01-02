import { PageContainer, ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, message } from 'antd';
import { useEffect, useMemo, useRef } from 'react';
import { tCommon } from '@/shared/i18n/helpers';

export interface ProCrudPageProps<TItem extends { Id: string }> {
  title: string;
  columns: ProColumns<TItem>[];
  fetch: (params: Record<string, unknown>) => Promise<{ data: TItem[]; total: number }>;
  onRemove?: (id: string) => Promise<void>;
  onReady?: (reload: () => void) => void;
}

const ProCrudPage = <TItem extends { Id: string }>({
  title,
  columns,
  fetch,
  onRemove,
  onReady
}: ProCrudPageProps<TItem>): JSX.Element => {
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    if (onReady && actionRef.current) {
      onReady(() => {
        actionRef.current?.reload();
      });
    }
  }, [onReady]);

  const mergedColumns: ProColumns<TItem>[] = useMemo(() => {
    if (!onRemove) {
      return columns;
    }

    const actionColumn: ProColumns<TItem> = {
      title: tCommon('table.actions'),
      dataIndex: 'actions',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title={tCommon('actions.remove')}
            onConfirm={async () => {
              await onRemove(record.Id);
              message.success(tCommon('actions.remove'));
              actionRef.current?.reload();
            }}
          >
            <Button type="link">{tCommon('actions.remove')}</Button>
          </Popconfirm>
        </Space>
      )
    };

    return [...columns, actionColumn];
  }, [columns, onRemove]);

  return (
    <PageContainer header={{ title }}>
      <ProTable<TItem>
        rowKey="Id"
        actionRef={actionRef}
        columns={mergedColumns}
        search={{ labelWidth: 'auto' }}
        request={async (params) => {
          const result = await fetch(params);
          return {
            data: result.data,
            success: true,
            total: result.total
          };
        }}
      />
    </PageContainer>
  );
};

export default ProCrudPage;
