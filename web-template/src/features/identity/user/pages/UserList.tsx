// src/pages/User/UserList.tsx

import { PageContainer, ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Popconfirm, Button, message } from "antd";
import type { FC } from "react";
import { useRef, useState } from "react";
//import type { PagedResult } from '@/models/paged-result';
import type { UserItem } from "@/features/identity/user/types/dto";
import { fetchUsers, deleteUser } from "@/features/identity/user/api/user.api";
import CreateUserModal from "../components/modals/CreateUserModal";
import { DeleteOutlined } from "@ant-design/icons";
import { tUser } from "@/shared/i18n/helpers";

import Can from "@/shared/auth/Can";

const UserList: FC = () => {
  const actionRef = useRef<ActionType | null>(null); // ✅ 提供給 ProTable reload 使用
  const [createModalOpen, setCreateModalOpen] = useState(false); // ✅ 控制 Modal 開關
  const columns: ProColumns<UserItem>[] = [
    {
      title: tUser("fields.name.label"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: tUser("fields.email.label"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: "操作",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title={tUser("delete.confirm")}
          onConfirm={() => handleDelete(record.id)}
          okText="是"
          cancelText="否"
        >
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            //disabled={record.id === currentUserId} // 禁止刪除自己
          >
            刪除
          </Button>
        </Popconfirm>
      ),
    },
  ];
  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId); // API 呼叫
      message.success(tUser("delete.success"));
      actionRef.current?.reload(); // 重新載入 table 資料
    } catch (error: unknown) {
      const err = error as Error;
      message.error(err.message || tUser("delete.error"));
      return false;
    }
  };

  return (
    <PageContainer>
      <ProTable<UserItem>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async () => {
          // const page = params.current ?? 1;
          // const pageSize = params.pageSize ?? 10;

          const result: UserItem[] = await fetchUsers();

          return {
            data: result,
            total: result.length,
            success: true,
          };
        }}
        pagination={{ pageSize: 10 }}
        search={false}
        dateFormatter="string"
        headerTitle={tUser("list.title")}
        toolBarRender={() => [
          <Can permission="users.create">
            <Button type="primary" onClick={() => setCreateModalOpen(true)}>
              {tUser("create.title")}
            </Button>
          </Can>,
        ]}
      />
      <CreateUserModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          actionRef.current?.reload(); // ✅ 重新載入 ProTable 資料
        }}
      />
    </PageContainer>
  );
};

export default UserList;
