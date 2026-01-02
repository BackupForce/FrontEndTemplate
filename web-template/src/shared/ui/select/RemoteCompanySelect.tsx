import { ProFormSelect } from '@ant-design/pro-components';
import { message } from 'antd';
import { useCallback } from 'react';
import axiosInstance from '@/core/http/axiosInstance';
interface CompanyOption {
  id: string;
  nodeId: string;
  name: string;
}

interface RemoteCompanySelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  valueType?: 'companyId' | 'nodeId'; // 預設為 companyId
}

export const RemoteCompanySelect = ({
  name,
  label = '公司',
  placeholder = '請選擇公司',
  disabled = false,
  required = true,
  valueType = 'companyId',
}: RemoteCompanySelectProps) => {
  const fetchCompanies = useCallback(async () => {
    try {
      const response = await axiosInstance.get<CompanyOption[]>('/companies');
      return response.data.map((company) => ({
        label: company.name,
        value: valueType === 'companyId' ? company.id : company.nodeId,
      }));
    } catch {
      message.error('載入公司失敗');
      return [];
    }
  }, [valueType]);

  return (
    <ProFormSelect
      name={name}
      label={label}
      placeholder={placeholder}
      request={fetchCompanies}
      showSearch
      debounceTime={300}
      disabled={disabled}
      rules={required ? [{ required: true, message: `請選擇${label}` }] : []}
    />
  );
};

