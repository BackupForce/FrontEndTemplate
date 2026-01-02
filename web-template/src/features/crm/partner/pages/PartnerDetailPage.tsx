// src/features/crm/partner/pages/PartnerDetailPage.tsx
import { Card, Descriptions, Tabs, Alert, Skeleton } from "antd";
import { useParams } from "react-router-dom";
import type { TabsProps } from "antd";
import { PartnerCreditTab } from "@/features/credit/accounts/components/PartnerCreditTab";
import { usePartnerDetail } from "@/features/crm/partner/hooks/usePartnerDetail";

const PartnerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const partnerId = id ?? "";

  const { data: partner, loading, error } = usePartnerDetail(partnerId);

  const items: TabsProps["items"] = [
    {
      key: "basic",
      label: "基本資訊",
      children: (
        <Card>
          {loading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : error ? (
            <Alert type="error" message="載入 Partner 詳細失敗" description={error.message} />
          ) : (
            <Descriptions
              title="Partner 基本資料"
              bordered
              column={{ xs: 1, md: 2, lg: 3 }}
              size="middle"
            >
              <Descriptions.Item label="名稱">{partner?.name}</Descriptions.Item>
              <Descriptions.Item label="代碼">{partner?.code ?? "-"}</Descriptions.Item>
              <Descriptions.Item label="Email">{partner?.email ?? "-"}</Descriptions.Item>
              <Descriptions.Item label="電話">{partner?.phone ?? "-"}</Descriptions.Item>
              <Descriptions.Item label="PartnerId">{partner?.id}</Descriptions.Item>
            </Descriptions>
          )}
        </Card>
      ),
    },
    {
      key: "credit",
      label: "授信（Credit）",
      // Credit 分頁只需要 partnerId
      children: <PartnerCreditTab partnerId={partnerId} />,
    },
  ];

  return (
    <>
      <Card loading={loading} style={{ marginBottom: 16 }}>
        {error ? (
          <Alert type="error" message="載入 Partner 失敗" description={error.message} />
        ) : (
          <Descriptions column={1} size="small" title="Partner">
            <Descriptions.Item label="名稱">{partner?.name ?? "-"}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      <Tabs defaultActiveKey="basic" items={items} />
    </>
  );
};

export default PartnerDetailPage;
