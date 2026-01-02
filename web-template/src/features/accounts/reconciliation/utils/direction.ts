// 明確的金流方向碼
export type DirectionCode = "In" | "Out";

// 方向計算後的彙總結構
export interface DirectionalDiffs {
  cashIn: number;
  cashOut: number;
  cashNet: number;   // cashIn - cashOut

  entryIn: number;
  entryOut: number;
  entryNet: number;  // entryIn - entryOut

  net: number;       // cashNet - entryNet
}

// 將外部各種「方向」表示法，正規化成 DirectionCode
// 支援：字串 In/Out、Income/Expense、Receive/Pay、Credit/Debit、數字 1/-1、"1"/"-1"
export function normalizeDirection(input: string | number | undefined | null): DirectionCode | undefined {
  if (input === undefined || input === null) {
    return undefined;
  }

  const s: string = String(input).trim().toLowerCase();

  // 數字碼對應（你的系統規則）
  if (s === "0") {
    return "In";
  }
  if (s === "1") {
    return "Out";
  }

  // 英文別名
  if (s === "in" || s === "income" || s === "receive" || s === "credit" || s === "1" || s === "+1") {
    return "In";
  }

  if (s === "out" || s === "expense" || s === "pay" || s === "debit" || s === "-1") {
    return "Out";
  }

  return undefined;
}

// 根據方向將金額轉為帶符號值：In => +abs(amount), Out => -abs(amount)
// 若方向未知，則直接回傳原數值（保留現有資料行為）
export function signedAmount(amount: number, dir?: DirectionCode): number {
  if (!Number.isFinite(amount)) {
    return 0;
  }
  if (dir === "Out") {
    return -Math.abs(amount);
  }
  if (dir === "In") {
    return Math.abs(amount);
  }
  return amount;
}

// 將浮點誤差在 2 位小數層級上去除
export function toFixed2Number(n: number): number {
  return Number(n.toFixed(2));
}
