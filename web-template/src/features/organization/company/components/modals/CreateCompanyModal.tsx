import { Modal, Form, message } from 'antd';
import type { FC } from 'react';
import { useEffect } from 'react';
import { createCompany } from '@/features/organization/company/api/company.api';
import type { CompanyItem } from '@/features/organization/company/types/dto';
import { tCompany, tCommon } from '@/shared/i18n/helpers';
import CompanyFormFields  from '../forms/CompanyFormFields';

interface CreateCompanyModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCompanyModal: FC<CreateCompanyModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm<CompanyItem>();

  useEffect(() => {
    if (!open) {
      //form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createCompany(values);
      message.success(tCompany('create.success'));
      onSuccess();
    } catch (error: unknown) {
      const err = error as Error;
      message.error(err.message || tCompany('create.error'));
    }
  };

  return (
    <Modal
      title={tCompany('create.title')}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={tCommon('buttons.submit')}
      cancelText={tCommon('buttons.cancel')}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <CompanyFormFields />
      </Form>
    </Modal>
  );
};

export default CreateCompanyModal;
