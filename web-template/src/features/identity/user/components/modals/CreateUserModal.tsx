// src/pages/User/CreateUserModal.tsx
import { ModalForm, ProFormText, ProFormSwitch } from '@ant-design/pro-components';
import { message } from 'antd';
import type { FC } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';
import { useRef } from 'react';
import { createUser } from '@/features/identity/user/api/user.api'; // 你等下要實作這個 API function
import type { CreateUserInput } from '@/features/identity/user/types/dto';
import { tUser } from '@/shared/i18n/helpers';
import { RemoteCompanySelect } from '@/shared/ui/select/RemoteCompanySelect';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // 建議：新增成功後呼叫父層 reload ProTable
}

const CreateUserModal: FC<CreateUserModalProps> = ({ open, onClose, onSuccess }) => {
  const formRef = useRef<ProFormInstance | null>(null);

  return (
    <ModalForm
      formRef={formRef}
      title={tUser('create.title')} 
      open={open}
      onOpenChange={(visible) => {
        if (!visible) onClose();
      }}
      onFinish={async (values) => {
        try {
          await createUser(values as CreateUserInput);
          message.success(tUser('create.success'));
          onSuccess();
          return true;
        } catch (error: unknown) {
            const err = error as Error;
          message.error(err.message || tUser('create.error'));
          return false;
        }
      }}
    >
      <ProFormText
        name="name"
        label={tUser('fields.name.label')}
        rules={[{ required: true, message: tUser('fields.name.required') }]}
      />
      <ProFormText
        name="email"
        label={tUser('fields.email.label')}
        rules={[
          { required: true, message: tUser('fields.name.required') },
          { type: 'email', message: tUser('fields.name.invalid') },
        ]}
      />
      <ProFormText.Password
        name="password"
        label={tUser('fields.password.label')}
        rules={[{ required: true, message: tUser('fields.password.required') }]}
      />
      <ProFormSwitch name="isActive" label={tUser('fields.isActive.label')} initialValue={true} />

      <RemoteCompanySelect name="nodeId" valueType="nodeId" />
    </ModalForm>
  );
};

export default CreateUserModal;
