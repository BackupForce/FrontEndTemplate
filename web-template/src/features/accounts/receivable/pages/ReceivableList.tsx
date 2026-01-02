import { useRef, useState } from "react";
import { ProTable, PageContainer } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, message } from "antd";
import { t } from "i18next";
import { tReceivable } from "@/shared/i18n/helpers";
import { getReceivables } from "@/features/accounts/receivable/api/receivables.api";
import type { ReceivableItem } from "@/features/accounts/receivable/types/dto";
import CreateReceivableModal from "@/features/accounts/receivable/components/modals/CreateReceivableModal";
import Can from "@/shared/auth/Can";
import { deleteReceivable } from "@/features/accounts/receivable/api/receivables.api";
import { DeleteOutlined } from "@ant-design/icons";

const ReceivableList = () => {
  const actionRef = useRef<ActionType>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const columns: ProColumns<ReceivableItem>[] = [
    {
      title: tReceivable("fields.invoiceNumber.label"),
      dataIndex: "invoiceNumber",
    },
    {
      title: tReceivable("fields.invoiceDate.label"),
      dataIndex: "invoiceDate",
      valueType: "date",
    },
    {
      title: tReceivable("fields.issueDate.label"),
      dataIndex: "issueDate",
      valueType: "date",
    },
    {
      title: tReceivable("fields.dueDate.label"),
      dataIndex: "dueDate",
      valueType: "date",
    },
    {
      title: tReceivable("fields.originalAmount.label"),
      dataIndex: "originalAmount",
      valueType: "money",
    },
    {
      title: tReceivable("fields.baseAmount.label"),
      dataIndex: "baseAmount",
      valueType: "money",
    },
    {
      title: tReceivable("fields.status.label"),
      dataIndex: "status",
      valueEnum: {
        0: { text: tReceivable("status.unpaid") },
        1: { text: tReceivable("status.paid") },
        2: { text: tReceivable("status.cancelled") },
      },
    },
    {
      title: tReceivable("fields.customerName.label"),
      dataIndex: "customerName",
    },
    {
  title: t("actions"),
  key: "actions",
  valueType: "option",
  render: (_, record) => [
    <Can permission="receivable:delete" key="delete">
      <Popconfirm
        title={tReceivable("delete.confirm")}
        onConfirm={async () => {
          await deleteReceivable(record.id);
          message.success(tReceivable("delete.success"));
          actionRef.current?.reload();
        }}
        okText={t("buttons.confirm")}
        cancelText={t("buttons.cancel")}
      >
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
        >
          {t("buttons.delete")}
        </Button>
      </Popconfirm>
    </Can>,
  ],
},

  ];

  return (
    <PageContainer>
      <ProTable<ReceivableItem>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const { current = 1, pageSize = 20 } = params;
          const result = await getReceivables({ page: current, pageSize });
          return {
            data: result.items,
            total: result.totalCount,
            success: true,
          };
        }}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
        }}
        search={false}
        options={false}
        toolBarRender={() => [
          <Can permission="receivable:create">
            <Button type="primary" onClick={() => setCreateModalOpen(true)}>
              {tReceivable("create.title")}
            </Button>
          </Can>,
        ]}
      />
      <CreateReceivableModal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
};

export default ReceivableList;
