// src/pages/Company/CompanyFormFields.tsx

import { Form, Input } from 'antd';
import type { FC } from 'react';
import { tCompany } from '@/shared/i18n/helpers';
import { RemoteCompanySelect } from '@/shared/ui/select/RemoteCompanySelect';


interface CompanyFormFieldsProps {
  disabled?: boolean;
  isEditMode? :boolean;
  selectedCompanyName?: string;
  show?: {
    name?: boolean;
    description?: boolean;
    parentnodeid?: boolean;
  };
}

const CompanyFormFields: FC<CompanyFormFieldsProps> = ({
  disabled = false,
  isEditMode = false,
  selectedCompanyName = "",
  show = {
    name: true,
    description: true,
    parentnodeid: true,
  },
}) => {
  return (
    <>
      {show.name && (
        <Form.Item
          label={tCompany('fields.name.label')}
          name="name"
          rules={[{ required: true, message: tCompany('fields.name.required') }]}
        >
          <Input
            placeholder={tCompany('fields.name.placeholder')}
            disabled={disabled}
          />
        </Form.Item>
      )}

      

      {show.description && (
        <Form.Item
          label={tCompany('fields.description.label')}
          name="description"
        >
          <Input
            placeholder={tCompany('fields.description.placeholder')}
            disabled={disabled}
          />
        </Form.Item>
      )}

      

      {show.parentnodeid && (
        isEditMode ? (
            <Form.Item label={tCompany('fields.parentnodeid.label')} name="parentnodeid">
            <span>{selectedCompanyName}</span>
            </Form.Item>
        ) : (
            <RemoteCompanySelect name="parentnodeid" valueType="nodeId" />
        )
      )}

    </>
  );
};

export default CompanyFormFields;
