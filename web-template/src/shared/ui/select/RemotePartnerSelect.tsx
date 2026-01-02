import { ProFormSelect } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import axios from '@/core/http/axiosInstance';

export interface RemotePartnerSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  rules?: { required: boolean; message: string }[];
  onlyCustomer?: boolean;
  onlySupplier?: boolean;
  hideLabel?: boolean; // ✅ 新增
  fieldProps?: Record<string, unknown>; // ✅ 可傳入額外設定
}

interface PartnerItem {
  id: string;
  name: string;
}

const RemotePartnerSelect = ({
  name,
  label = "對象",
  placeholder = "請選擇對象",
  rules,
  onlyCustomer = false,
  onlySupplier = false,
  hideLabel = false,
  fieldProps = {},
}: RemotePartnerSelectProps) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [loadingState, setLoadingState] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      setLoadingState(true);
      try {
        const res = await axios.get<PartnerItem[]>("/partners/filtered", {
          params: {
            isCustomer: onlyCustomer || undefined,
            isSupplier: onlySupplier || undefined,
          },
        });
        const data = res.data;

        setOptions(
          data.map((p) => ({
            label: p.name,
            value: p.id,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch partners", err);
      } finally {
        setLoadingState(false);
      }
    };

    load();
  }, [onlyCustomer, onlySupplier]);

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
        //style: { width: "100%" },
        filterOption: (input: string, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
        ...fieldProps,
      }}
    />
  );
};

export default RemotePartnerSelect;
