// features/accounts/invoice/pages/InvoiceList.tsx
import { useRef, useState } from "react";
import { ProTable, PageContainer } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, message } from "antd";
import dayjs from "dayjs";
import { useTabContext } from "@/app/providers/TabProvider";
import Can from "@/shared/auth/Can";
import { tInvoice } from "@/shared/i18n/helpers";
import type { InvoiceDto } from "@/features/sales/invoice/types/dto";
import { invoiceApi } from "@/features/sales/invoice/api/invoice.api";
import { InvoiceCreateModal } from "@/features/sales/invoice/components/modals/InvoiceCreateModal";

const InvoiceList = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const { openTab } = useTabContext();

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await invoiceApi.delete(id);
      message.success(tInvoice("messages.deleteSuccess"));
      actionRef.current?.reload();
    } catch (error) {
      console.error(error);
      message.error(tInvoice("messages.deleteFail"));
    }
  };

  const columns: ProColumns<InvoiceDto>[] = [
    {
      title: tInvoice("fields.invoiceNumber.label"),
      dataIndex: "invoiceNumber",
    },
    {
      title: tInvoice("fields.status.label"),
      dataIndex: "status",
    },
    {
      title: tInvoice("fields.currency.label"),
      dataIndex: "currencyCode",
      width: 100,
    },
    {
      title: tInvoice("fields.totalAmount.label"),
      dataIndex: "totalAmount",
      align: "right",
      //render: (_, r) => (r.totalAmount?.amount ?? 0).toFixed(2),
    },
    {
      title: tInvoice("fields.createdAt.label"),
      dataIndex: "createdAt",
      valueType: "dateTime",
      render: (_, r) => dayjs(r.createdAt).format("YYYY-MM-DD HH:mm"),
      width: 180,
    },
    {
      title: tInvoice("actions.view"),
      valueType: "option",
      render: (_, record) => [
        <Button
          type="link"
          key="detail"
          onClick={() => openTab(`/invoices/${record.id}`, tInvoice("titles.detailTab"))}
        >
          {tInvoice("actions.view")}
        </Button>,
        <Can permission="invoice:delete" key="delete">
          <Popconfirm
            title={tInvoice("actions.confirmDelete")}
            onConfirm={() => handleDelete(record.id)}
            okText={tInvoice("actions.confirm")}
            cancelText={tInvoice("actions.cancel")}
          >
            <Button type="link" danger>
              {tInvoice("actions.delete")}
            </Button>
          </Popconfirm>
        </Can>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<InvoiceDto>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const {
            current = 1,
            pageSize = 20,
            status,
            currencyCode,
            fromDate,
            toDate,
          } = params;

          const result = await invoiceApi.getList({
            page: current,
            pageSize,
            status,
            currencyCode,
            fromDate,
            toDate,
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
        search={{ defaultCollapsed: true }}
        toolBarRender={() => [
          <Can permission="invoice:create" key="create">
            <Button type="primary" onClick={() => setCreateModalOpen(true)}>
              {tInvoice("create.title")}
            </Button>
          </Can>,
        ]}
      />

      <InvoiceCreateModal
        open={isCreateModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onSuccess={() => {
            setCreateModalOpen(false);
            actionRef.current?.reload();
        }}
        />

    </PageContainer>
  );
};

export default InvoiceList;
