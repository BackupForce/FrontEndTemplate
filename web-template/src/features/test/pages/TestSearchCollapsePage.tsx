import { PageContainer, ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";

type DummyItem = {
  id: string;
  name: string;
  status: number;
};

const TestSearchCollapsePage = () => {
  const columns: ProColumns<DummyItem>[] = [
    {
      title: "日期區間",
      dataIndex: "dateRange",
      valueType: "dateRange",
      colSize: 3,
      hideInTable: true,
      search: {
        transform: (value) => ({
          dateFrom: value?.[0],
          dateTo: value?.[1],
        }),
      },
    },
    {
      title: "狀態",
      dataIndex: "status",
      valueType: "select",
      colSize: 1,
      valueEnum: {
        0: { text: "未完成" },
        1: { text: "已完成" },
      },
      hideInTable: true,
    },
    {
      title: "測試選單",
      dataIndex: "type",
      valueType: "select",
      colSize: 1,
      hideInTable: true,
      fieldProps: {
        style: { width: "100%" },
        options: [
          { label: "A", value: "A" },
          { label: "B", value: "B" },
        ],
      },
    },
    {
      title: "名稱",
      dataIndex: "name",
    },
  ];

  return (
    <PageContainer>
      <ProTable<DummyItem>
        rowKey="id"
        columns={columns}
        form={{
          layout: "vertical",
        }}
        search={{
        //   labelWidth: 80,
        //   span: 8,
        //   collapsed: true,
        //   defaultCollapsed: true,
        //   optionRender: (searchConfig, formProps, dom) => [
        //     ...dom,
        //   ],
        }}
        request={async () => {
          return {
            data: [],
            success: true,
            total: 0,
          };
        }}
        pagination={false}
      />
    </PageContainer>
  );
};

export default TestSearchCollapsePage;
