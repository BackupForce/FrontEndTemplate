import { useRef, useState } from "react";
import { ProTable, PageContainer } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, message } from "antd";
import { tReconciliation } from "@/shared/i18n/helpers";
import { getReconciliations, deleteReconciliation } from "@/features/accounts/reconciliation/api/reconciliation.api";
import type { ReconciliationDto } from "../types/dto";
import Can from "@/shared/auth/Can";
import dayjs from "dayjs";
import ReconciliationCreateModal from "../components/modals/ReconciliationCreateModal";
import { useTabContext } from "@/app/providers/TabProvider";

const ReconciliationList = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const { openTab } = useTabContext();

  const handleDelete = async (id: string) => {
    try {
      await deleteReconciliation(id);
      message.success(tReconciliation("messages.deleteSuccess"));
      actionRef.current?.reload();
    } catch (error) {
      console.error(error);
      message.error(tReconciliation("messages.deleteFail"));
    }
  };

  const columns: ProColumns<ReconciliationDto>[] = [
    {
      title: tReconciliation("fields.referenceNumber.label"),
      dataIndex: "referenceNumber",
    },
    {
      title: tReconciliation("fields.partner.label"),
      dataIndex: "partnerName",
    },
    {
      title: tReconciliation("fields.reconciledAt.label"),
      dataIndex: "reconciledAt",
      valueType: "date",
      render: (_, record) => dayjs(record.reconciledAt).format("YYYY-MM-DD"),
    },
    {
      title: tReconciliation("fields.status.label"),
      dataIndex: "status",
    },
    {
      title: tReconciliation("fields.note.label"),
      dataIndex: "note",
      ellipsis: true,
    },
    {
      title: tReconciliation("actions.view"),
      valueType: "option",
      render: (_, record) => [
        <Button
          type="link"
          key="detail"
          onClick={() => 
            //navigate(`/reconciliations/${record.id}`)
            openTab(`/reconciliations/${record.id}`, "現金交易明細")
          }
        >
          {tReconciliation("actions.view")}
        </Button>,
        <Can permission="reconciliation:delete" key="delete">
          <Popconfirm
            title={tReconciliation("actions.confirmDelete")}
            onConfirm={() => handleDelete(record.id)}
            okText={tReconciliation("actions.confirm")}
            cancelText={tReconciliation("actions.cancel")}
          >
            <Button type="link" danger>
              {tReconciliation("actions.delete")}
            </Button>
          </Popconfirm>
        </Can>,
      ],
    }
  ];

  return (
    <PageContainer>
      <ProTable<ReconciliationDto>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const {
            current = 1,
            pageSize = 20,
            reconciledAtFrom,
            reconciledAtTo,
            status,
          } = params;

          const result = await getReconciliations({
            page: current,
            pageSize,
            reconciledAtFrom,
            reconciledAtTo,
            status,
          });

          return {
            data: result.items,
            total: result.totalCount,
            success: true,
          };
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        options={false}
        search={{
          defaultCollapsed: true,
        }}
        toolBarRender={() => [
          <Can permission="reconciliation:create" key="create">
            <Button type="primary" onClick={() => setCreateModalOpen(true)}>
              {tReconciliation("create.title")}
            </Button>
          </Can>,
        ]}
      />

      <ReconciliationCreateModal
        open={isCreateModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={() => {
          setCreateModalOpen(false);
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
};

export default ReconciliationList;
