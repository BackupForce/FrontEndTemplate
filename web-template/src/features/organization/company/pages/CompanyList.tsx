// src/pages/Company/CompanyList.tsx

import { PageContainer, ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, message } from "antd";
import type { FC } from "react";
import { useRef, useState } from "react";
import type { CompanyItem } from "@/features/organization/company/types/dto";
import { fetchCompanies } from "@/features/organization/company/api/company.api";
import CreateCompanyModal from "../components/modals/CreateCompanyModal";
import EditCompanyModal from "../components/modals/EditCompanyModal";
import { deleteCompany } from "@/features/organization/company/api/company.api";
import { tCommon, tCompany } from "@/shared/i18n/helpers";

const CompanyList: FC = () => {
  const actionRef = useRef<ActionType | null>(null);

  // ⬇️ 增加 state：控制編輯 Modal 與當前項目
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyItem | null>(null);

  const columns: ProColumns<CompanyItem>[] = [
    {
      title: tCompany("fields.name.label"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: tCompany("fields.description.label"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: tCompany("fields.parentnodeid.label"),
      dataIndex: "parentCompanyName",
      key: "parentCompanyName",
    },
    {
      title: "操作",
      valueType: "option",
      render: (_, record) => [
        <a key="edit" onClick={() => setEditingCompany(record)}>
          {tCommon("buttons.edit")}
        </a>,
        <Popconfirm
          key="delete"
          title={tCompany("delete.confirm")}
          onConfirm={async () => {
            await deleteCompany(record.id);
            message.success(tCompany("delete.success"));
            actionRef.current?.reload();
          }}
        >
            <Button type="link">{tCommon("buttons.delete")}</Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<CompanyItem>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async () => {
          const result: CompanyItem[] = await fetchCompanies();
          return {
            data: result,
            total: result.length,
            success: true,
          };
        }}
        pagination={{ pageSize: 10 }}
        search={false}
        dateFormatter="string"
        headerTitle={tCompany("list.title")}
        toolBarRender={() => [
          <Button type="primary" onClick={() => setCreateModalOpen(true)}>
            {tCompany("create.title")}
          </Button>,
        ]}
      />
      <CreateCompanyModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          actionRef.current?.reload();
        }}
      />
      <EditCompanyModal
        open={!!editingCompany}
        company={editingCompany}
        onClose={() => setEditingCompany(null)}
        onSuccess={() => {
          setEditingCompany(null);
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
};

export default CompanyList;
