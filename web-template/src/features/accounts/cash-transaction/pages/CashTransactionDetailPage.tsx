import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { PageContainer, ProForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Card, Spin, message } from "antd";
import { getCashTransactionById, updateCashTransaction } from "@/features/accounts/cash-transaction/api/cash-transaction.api";
import type { CashTransactionDetail } from "@/features/accounts/cash-transaction/types/dto";
import CashTransactionDetailForm from "../components/forms/CashTransactionDetailForm";
import { useTabContext } from "@/app/providers/TabProvider";
import { tCashTrans } from "@/shared/i18n/helpers";

const CashTransactionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<CashTransactionDetail>();
  const [loading, setLoading] = useState(true);
  const { updateTabTitle } = useTabContext();

  const fetchDetail = useCallback(async (): Promise<void> => {
  if (!id) {
    return;
  }

  setLoading(true);
  try {
    const data = await getCashTransactionById(id);
    setDetail(data);

    const displayText: string = data.note ?? data.referenceNumber ?? data.id ?? "";
    updateTabTitle(`/cash-transactions/${id}`, `現金交易：${displayText}`);
  } catch (error: unknown) {
    message.error("資料載入失敗");
    console.error(error);
  } finally {
    setLoading(false);
  }
  // 把用到的外部變數/函式放進依賴
}, [id, updateTabTitle]);

useEffect((): void => {
  void fetchDetail();
}, [fetchDetail]);

  if (loading || !detail) return <Spin />;

  return (
    <PageContainer title="現金交易明細" content={false}>
      <Card style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 24 }}>
          <CashTransactionDetailForm data={detail} />
        </div>
        <ProForm
          initialValues={{
            referenceNumber: detail.referenceNumber,
            note: detail.note,
          }}
          onFinish={async (values) => {
            try {
              await updateCashTransaction(id!, {
                ...detail,
                referenceNumber: values.referenceNumber,
                note: values.note,
              });
              message.success("更新成功");
            } catch (error) {
              console.error(error);
              message.error("更新失敗");
            }
          }}
          submitter={{
            searchConfig: { submitText: "儲存" },
            resetButtonProps: false,
          }}
        >
          <ProFormText
            name="referenceNumber"
            label={tCashTrans("fields.referenceNumber.label")}
            width={300}
          />
          <ProFormTextArea
            name="note"
            label={tCashTrans("fields.note.label")}
            fieldProps={{ autoSize: true }}
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default CashTransactionDetailPage;
