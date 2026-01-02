import { ModalForm } from "@ant-design/pro-components";
import type { FC } from "react";
import { createPartner } from "@/features/crm/partner/api/partner.api";
import type { CreatePartnerDto } from "@/features/crm/partner/types/dto";
import { tPartner } from "@/shared/i18n/helpers";
import { message } from "antd";
import PartnerFormFields from "@/features/crm/partner/components/forms/PartnerFormFields";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreatePartnerModal: FC<Props> = ({ open, onClose, onSuccess }) => {
  return (
    <ModalForm<CreatePartnerDto>
      title={tPartner("create.title")}
      open={open}
      modalProps={{
        onCancel: onClose,
        destroyOnHidden: true,
        maskClosable: false,
      }}
      onFinish={async (values) => {
        try {
          await createPartner(values);
          message.success(tPartner("create.success"));
          onSuccess();
        } catch (error: unknown) {
          const err = error as Error;
          message.error(err.message || tPartner("create.error"));
        }
      }}
    >
      <PartnerFormFields />
    </ModalForm>
  );
};

export default CreatePartnerModal;
