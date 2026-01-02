import { ProFormSelect } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import axios from "@/core/http/axiosInstance";

export interface RemoteAccountingCategorySelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  rules?: { required: boolean; message: string }[];
  hideLabel?: boolean;
  fieldProps?: Record<string, unknown>;
}

interface AccountingCategoryItem {
  id: string;
  name: string;
}

const RemoteAccountingCategorySelect = ({
  name,
  label = "科目",
  placeholder = "請選擇科目",
  rules,
  hideLabel = false,
  fieldProps = {},
}: RemoteAccountingCategorySelectProps) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [loadingState, setLoadingState] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      setLoadingState(true);
      try {
        const res = await axios.get<AccountingCategoryItem[]>("/accounting-categories");
        const data = res.data;

        setOptions(
          data.map((item) => ({
            label: item.name,
            value: item.id,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch accounting categories", err);
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

export default RemoteAccountingCategorySelect;
