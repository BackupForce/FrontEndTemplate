// src/shared/ui/table/columnPresets.ts
import type { ColumnType } from "antd/es/table";
import dayjs from "dayjs";

export const COL_WIDTH = {
  date: 140,
  datetime: 180,
  money: 120,
} as const;

type Align = "left" | "right" | "center";

export function dateColumn<T extends object>(
  dataIndex: keyof T & string,
  title: React.ReactNode,
  opts?: { format?: string; width?: number; align?: Align; ellipsis?: boolean }
): ColumnType<T> {
  const { format = "YYYY-MM-DD", width = COL_WIDTH.date, align, ellipsis } = opts ?? {};
  return {
    title,
    dataIndex, // string OK
    width,
    align,
    ellipsis,
    render(value: unknown) {
      if (value == null) { return ""; }
      const d = (typeof value === "string" || value instanceof Date)
        ? dayjs(value)
        : dayjs(String(value));
      return d.isValid() ? d.format(format) : "";
    },
  };
}
