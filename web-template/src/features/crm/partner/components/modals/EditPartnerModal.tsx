import { ModalForm } from "@ant-design/pro-components";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import type { PartnerItem } from "@/features/crm/partner/types/dto";
import PartnerFormFields from "../forms/PartnerFormFields";
import { updatePartner } from "@/features/crm/partner/api/partner.api";

interface EditPartnerModalProps {
  open: boolean;
  onCancel: () => void;
  partner: PartnerItem;
  onSuccess: () => void;
}

const EditPartnerModal: React.FC<EditPartnerModalProps> = ({
  open,
  onCancel,
  partner,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation("partner");

  useEffect(() => {
    if (partner) {
      form.setFieldsValue(partner);
    }
  }, [partner, form]);

  return (
    <ModalForm
      title={t("edit.title")}
      form={form}
      open={open}
      modalProps={{
        destroyOnHidden: true,
        maskClosable: false,
        onCancel,
      }}
      onFinish={async (values) => {
        await updatePartner(partner.id, values);
        onSuccess();
        return true;
      }}
    >
      <PartnerFormFields />
    </ModalForm>
  );
};

export default EditPartnerModal;
