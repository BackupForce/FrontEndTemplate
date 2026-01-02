import { ProFormSelect } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import axios from '@/core/http/axiosInstance';

export interface RemoteCurrencySelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  rules?: { required: boolean; message: string }[];
}

interface CurrencyItem {
  id: string;
  name: string;
}

const RemoteCurrencySelect = ({
  name,
  label = "幣別",
  placeholder = "請選擇幣別",
  rules,
}: RemoteCurrencySelectProps) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get<CurrencyItem[]>("/currencies");

        const data = res.data ?? [];

        setOptions(
          data.map((c) => ({
            label: `${c.id} - ${c.name}`,
            value: c.id,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch currencies", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <ProFormSelect
      name={name}
      label={label}
      placeholder={placeholder}
      options={options}
      rules={rules}
      showSearch
      fieldProps={{
        loading,
        filterOption: (input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
      }}
    />
  );
};

export default RemoteCurrencySelect;
