import type { ProColumns, ActionType } from "@ant-design/pro-components";
import { Button, Popconfirm, message } from "antd";
import type { Breakpoint } from "antd/es/_util/responsiveObserver";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { tPayable } from "@/shared/i18n/helpers";
import Can from "@/shared/auth/Can";

// 只傳進來 screens，子元件自己決定門檻（寫死 md 或 lg）
type ScreenMap = Partial<Record<Breakpoint, boolean>>;

function isAtLeast(screens: ScreenMap | undefined, bp: Breakpoint): boolean {
  if (!screens) {
    return true;
  }
  const order: Breakpoint[] = ["xs", "sm", "md", "lg", "xl", "xxl"];
  const idx: number = order.indexOf(bp);
  for (let i = idx; i < order.length; i++) {
    if (screens[order[i]] === true) {
      return true;
    }
  }
  return false;
}

// 估算每個按鈕所需寬度（含 icon/文字/內距）；視覺上抓一個保守值
function estimateButtonWidth(showText: boolean): number {
  // icon-only 大約 36~44px；帶文字抓 ~ 88~104px（取決於字體和語系）
  return showText ? 104 : 44;
}

export function createActionColumn<T extends { id: string }>(options: {
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => Promise<void>;
  permissionPrefix?: string;
  actionRef?: React.RefObject<ActionType | undefined>;
  handleError?: (err: unknown) => void;
  screens: ScreenMap; // ← 外部傳 useBreakpoint() 的結果
  minWidth?: number;  // ← 可選：強制最小寬
  maxWidth?: number;  // ← 可選：強制最大寬
}): ProColumns<T> {
  const {
    onEdit,
    onDelete,
    permissionPrefix = "payable",
    actionRef,
    handleError,
    screens,
    minWidth,
    maxWidth,
  } = options;

  // 子元件自己決定：小於 lg 僅顯示 icon；要改成 md 就把這裡改成 "md"
  const SHOW_TEXT_BREAKPOINT: Breakpoint = "lg";
  const showText: boolean = isAtLeast(screens, SHOW_TEXT_BREAKPOINT);

  // 依「可能出現的按鈕數」＋「是否顯示文字」估算欄寬（一次性，所有列共用）
  const candidates = [
    onEdit ? estimateButtonWidth(showText) : 0,
    onDelete ? estimateButtonWidth(showText) : 0,
  ].filter((w) => w > 0);

  const GAP = 12;           // 按鈕間隔
  const SIDE_PADDING = 16;  // 欄位左右 padding 總和
  let computedWidth = 0;

  if (candidates.length > 0) {
    computedWidth =
      candidates.reduce((a, b) => a + b, 0) +
      GAP * Math.max(0, candidates.length - 1) +
      SIDE_PADDING;
  }

  // 套用限制（若有）
  if (typeof minWidth === "number") {
    computedWidth = Math.max(computedWidth, minWidth);
  }
  if (typeof maxWidth === "number") {
    computedWidth = Math.min(computedWidth, maxWidth);
  }

  // 最後保底，避免 0 造成固定列布局異常
  if (computedWidth === 0) {
    computedWidth = 80;
  }

  return {
    title: t("actions"),
    key: "actions",
    valueType: "option",
    fixed: "right",
    width: computedWidth,   // ← 自動計算的欄寬
    align: "center",
    render: (_, record) => {
      const actions: React.ReactNode[] = [];

      if (onEdit) {
        actions.push(
          <Can permission={`${permissionPrefix}:update`} key="edit">
            <Button
              type="link"
              icon={<EditOutlined />}
              aria-label={t("buttons.edit")}
              title={t("buttons.edit")}
              onClick={() => onEdit(record)}
            >
              {showText && t("buttons.edit")}
            </Button>
          </Can>
        );
      }

      if (onDelete) {
        actions.push(
          <Can permission={`${permissionPrefix}:delete`} key="delete">
            <Popconfirm
              title={tPayable("delete.confirm")}
              onConfirm={async () => {
                try {
                  await onDelete(record);
                  message.success(tPayable("delete.success"));
                  actionRef?.current?.reload?.();
                } catch (err) {
                  handleError?.(err);
                }
              }}
              okText={t("buttons.confirm")}
              cancelText={t("buttons.cancel")}
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                aria-label={t("buttons.delete")}
                title={t("buttons.delete")}
              >
                {showText && t("buttons.delete")}
              </Button>
            </Popconfirm>
          </Can>
        );
      }

      return actions;
    },
  };
}
