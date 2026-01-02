// features/credit/accounts/components/PartnerCreditTab.tsx
import React, { useState } from "react";
import { Alert, Button, Card, Col, Form, InputNumber, Modal, Row, Skeleton, Space, Statistic, Tag, message } from "antd";
import { creditAccountApi } from "@/features/credit/accounts/api/creditAccount.api";
import { usePartnerCreditSummary } from "@/features/credit/accounts/hooks/usePartnerCreditSummary";
import { PartnerCreditAdjustmentsPanel } from "@/features/credit/accounts/components/PartnerCreditAdjustmentsPanel";

interface Props {
  partnerId: string;
}

export const PartnerCreditTab: React.FC<Props> = ({ partnerId }: Props) => {
  const { data, loading, error, reload } = usePartnerCreditSummary(partnerId);

  const [openSetBase, setOpenSetBase] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = Form.useForm<{ newBaseCreditLimit: number }>();

  if (loading) {
    return <Skeleton active paragraph={{ rows: 4 }} />;
  }

  if (error) {
    return <Alert type="error" message="載入授信資訊失敗" description={error.message} />;
  }

  if (!data) {
    return <Alert type="warning" message="查無授信帳戶" />;
  }

  const onOpenSetBase = (): void => {
    form.setFieldsValue({ newBaseCreditLimit: data.baseCreditLimit });
    setOpenSetBase(true);
  };

  const onSubmitSetBase = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await creditAccountApi.setBaseLimit(partnerId, values.newBaseCreditLimit);
      message.success("已更新基準額度");
      setOpenSetBase(false);
      reload();
    } catch (err) {
      if (err instanceof Error) {
        message.error(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Card>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Statistic title="基準額度" value={data.baseCreditLimit} precision={2} />
            </Col>
            <Col xs={24} md={6}>
              <Statistic title="有效調整總和" value={data.activeAdjustments} precision={2} />
            </Col>
            <Col xs={24} md={6}>
              <Statistic title="有效授信額度" value={data.effectiveCreditLimit} precision={2} />
            </Col>
            <Col xs={24} md={6}>
              <Statistic title="已占用（Exposure）" value={data.exposure} precision={2} />
            </Col>
            <Col xs={24} md={6}>
              <Statistic title="可用額度" value={data.availableCredit} precision={2} />
            </Col>
            <Col xs={24} md={6}>
              <Statistic title="臨時調整總和" value={data.activeTemporaryAdjustments} precision={2} />
            </Col>
            <Col xs={24} md={6}>
              <Statistic title="永久調整總和" value={data.activePermanentAdjustments} precision={2} />
            </Col>
            <Col xs={24} md={6}>
              <Space>
                {data.isCreditHold ? <Tag color="error">凍結</Tag> : <Tag color="success">正常</Tag>}
                {data.holdReason ? <Tag>{data.holdReason}</Tag> : null}
              </Space>
            </Col>
          </Row>
        </Card>

        <Space>
          <Button type="primary" onClick={onOpenSetBase}>
            調整基準額度
          </Button>
        </Space>

        {/* 授信調整（封裝元件） */}
        <PartnerCreditAdjustmentsPanel
          partnerId={partnerId}
          partnerCreditAccountId={data.partnerCreditAccountId}  // ✅ 改：傳 accountId
          onChanged={() => {
            // 新增/回收後刷新 summary
            reload();
          }}
        />
      </Space>

      <Modal
        title="設定基準額度"
        open={openSetBase}
        onOk={onSubmitSetBase}
        confirmLoading={submitting}
        onCancel={() => {
          setOpenSetBase(false);
        }}
        maskClosable={false}
        destroyOnClose={true}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="新基準額度"
            name="newBaseCreditLimit"
            rules={[
              { required: true, message: "請輸入金額" },
              { type: "number", min: 0, message: "不得小於 0" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} precision={2} controls={true} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
