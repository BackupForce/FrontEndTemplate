// src/pages/Company/EditCompanyModal.tsx

import { Modal, Form, message } from 'antd';
import type { FC } from 'react';
import { useEffect } from 'react';
import type { CompanyItem } from '@/features/organization/company/types/dto';
import { updateCompany } from '@/features/organization/company/api/company.api';
import { tCompany, tCommon } from '@/shared/i18n/helpers';
import CompanyFormFields  from '../forms/CompanyFormFields';


interface EditCompanyModalProps {
  open: boolean;
  company: CompanyItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditCompanyModal: FC<EditCompanyModalProps> = ({
  open,
  company,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm<CompanyItem>();

  useEffect(() => {
    if (open && company) {
      form.setFieldsValue(company);
    }
  }, [open, company, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!company) return;
      await updateCompany({ ...company, ...values });
      message.success(tCompany('edit.success'));
      onSuccess();
    } catch (error: unknown) {
      const err = error as Error;
      message.error(err.message || tCompany('edit.error'));
    }
  };

  return (
    <Modal
      title={tCompany('edit.title')}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={tCommon('buttons.submit')}
      cancelText={tCommon('buttons.cancel')}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <CompanyFormFields 
            isEditMode
            selectedCompanyName={company?.parentcompanyname}
        />
      </Form>
    </Modal>
  );
};

export default EditCompanyModal;
