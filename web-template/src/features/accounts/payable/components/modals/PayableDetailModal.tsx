import { Modal } from "antd";
import { ProDescriptions } from "@ant-design/pro-components";
import type { PayableItem } from "@/features/accounts/payable/types/dto";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  onClose: () => void;
  data?: PayableItem;
};

export default function PayableDetailModal({ open, onClose, data }: Props) {
  const { t } = useTranslation("payable");

  return (
    <Modal
      title={t("detail.title")}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      maskClosable={false}
    >
      <ProDescriptions column={1} bordered size="small">
        <ProDescriptions.Item label={t("fields.billNumber.label")}>
          {data?.billNumber}
        </ProDescriptions.Item>
        <ProDescriptions.Item label={t("fields.issueDate.label")}>
          {data?.issueDate}
        </ProDescriptions.Item>
        <ProDescriptions.Item label={t("fields.dueDate.label")}>
          {data?.dueDate}
        </ProDescriptions.Item>
        <ProDescriptions.Item label={t("fields.originalAmount.label")}>
          {data
            ? `${data.originalAmountValue} ${data.originalAmountCurrency}`
            : ""}
        </ProDescriptions.Item>
        <ProDescriptions.Item label={t("fields.status.label")}>
          {t(`fields.status.${data?.status}`)}
        </ProDescriptions.Item>
        <ProDescriptions.Item label={t("fields.supplierName.label")}>
          {data?.supplierName}
        </ProDescriptions.Item>
      </ProDescriptions>
    </Modal>
  );
}
