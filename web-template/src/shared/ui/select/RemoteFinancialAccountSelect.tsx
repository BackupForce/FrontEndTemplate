import { ProFormSelect } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import axios from '@/core/http/axiosInstance';

export interface RemoteFinancialAccountSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  rules?: { required: boolean; message: string }[];
  hideLabel?: boolean;
  fieldProps?: Record<string, unknown>;
}

interface FinancialAccountItem {
  value: string;
  label: string;
}

const RemoteFinancialAccountSelect = ({
  name,
  label = "帳戶",
  placeholder = "請選擇帳戶",
  rules,
  hideLabel = false,
  fieldProps = {},
}: RemoteFinancialAccountSelectProps) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [loadingState, setLoadingState] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      setLoadingState(true);
      try {
        const res = await axios.get<FinancialAccountItem[]>("/lookups/financial-accounts");
        const data = res.data;
        setOptions(data);
      } catch (err) {
        console.error("Failed to fetch financial accounts", err);
      } finally {
        setLoadingState(false);
      }
    };

    load();
  }, []);

  return (
    <ProFormSelect
      name={name}
      label={hideLabel ? undefined : label}
      placeholder={placeholder}
      options={options}
      rules={rules}
      showSearch
      fieldProps={{
        loading: loadingState,
        filterOption: (input: string, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
        ...fieldProps,
      }}
    />
  );
};

export default RemoteFinancialAccountSelect;
