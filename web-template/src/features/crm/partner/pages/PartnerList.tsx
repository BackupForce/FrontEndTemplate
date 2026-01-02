// src/features/crm/partner/pages/PartnerList.tsx
import { PageContainer, ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Popconfirm, Button, message, Tag, Space } from "antd";
import type { FC } from "react";
import { useRef, useState } from "react";
//import { useNavigate } from "react-router-dom"; // 👈 新增
import type { PartnerItem } from "../types/dto";
import { fetchPartners, deletePartner } from "@/features/crm/partner/api/partner.api";
import CreatePartnerModal from "../components/modals/CreatePartnerModal";
import EditPartnerModal from "../components/modals/EditPartnerModal";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons"; // 👈 新增 Eye
import { tPartner } from "@/shared/i18n/helpers";
import Can from "@/shared/auth/Can";
import { useTabContext } from "@/app/providers/TabProvider";

const PartnerList: FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  //const navigate = useNavigate(); // 👈 新增
  const { openTab } = useTabContext();
  
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const goDetail = (record: PartnerItem): void => { // 👈 新增
    //navigate(`/partners/${record.id}`);
    openTab(`/partners/${record.id}`, "PartnerDetail")
  };

  const columns: ProColumns<PartnerItem>[] = [
    {
      title: tPartner("fields.name.label"),
      dataIndex: "name",
      key: "name",
      render: (_: unknown, record: PartnerItem) => ( // 👈 讓名稱可點擊
        <Button type="link" onClick={() => goDetail(record)}>
          {record.name}
        </Button>
      ),
    },
    {
      title: tPartner("fields.email.label"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: tPartner("fields.phone.label"),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: tPartner("fields.address.label"),
      dataIndex: "address",
      key: "address",
    },
    {
      title: tPartner("fields.roles.label"),
      key: "roles",
      render: (_: unknown, record: PartnerItem) => {
        const tags: string[] = [];
        if (record.isCustomer) { tags.push(tPartner("fields.isCustomer.label")); }
        if (record.isSupplier) { tags.push(tPartner("fields.isSupplier.label")); }
        return (
          <Space size={4} wrap>
            {tags.map((tag) => (
              <Tag color="blue" key={`${record.id}-${tag}`}>{tag}</Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: tPartner("fields.type.label"),
      dataIndex: "type",
      key: "type",
      render: (_: unknown, record: PartnerItem) => tPartner(`fields.type.${record.type.toLowerCase()}`),
    },
    {
      title: "操作",
      key: "actions",
      render: (_: unknown, record: PartnerItem) => (
        <>
          <Button
            type="link"
            icon={<EyeOutlined />} // 👈 新增「檢視」
            onClick={() => goDetail(record)}
          >
            檢視
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            編輯
          </Button>
          <Popconfirm
            title={tPartner("delete.confirm")}
            onConfirm={() => handleDelete(record.id)}
            okText="是"
            cancelText="否"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              刪除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const handleEdit = (partner: PartnerItem): void => {
    setEditingPartner(partner);
    setEditModalOpen(true);
  };

  const handleDelete = async (partnerId: string): Promise<void> => {
    try {
      await deletePartner(partnerId);
      message.success(tPartner("delete.success"));
      actionRef.current?.reload();
    } catch (error: unknown) {
      const err = error as Error;
      message.error(err.message || tPartner("delete.error"));
    }
  };

  return (
    <PageContainer>
      <ProTable<PartnerItem>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async () => {
          const result: PartnerItem[] = await fetchPartners();
          return { data: result, total: result.length, success: true };
        }}
        pagination={{ pageSize: 10 }}
        search={false}
        dateFormatter="string"
        headerTitle={tPartner("list.title")}
        toolBarRender={() => [
          <Can permission="partner:create" key="create">
            <Button type="primary" onClick={() => setCreateModalOpen(true)}>
              {tPartner("create.title")}
            </Button>
          </Can>,
        ]}
      />
      <CreatePartnerModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          actionRef.current?.reload();
        }}
      />
      {editingPartner && (
        <EditPartnerModal
          open={editModalOpen}
          onCancel={() => setEditModalOpen(false)}
          partner={editingPartner}
          onSuccess={() => {
            setEditModalOpen(false);
            actionRef.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
};

export default PartnerList;
