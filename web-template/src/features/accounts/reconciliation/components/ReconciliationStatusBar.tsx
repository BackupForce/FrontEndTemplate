import React from "react";
import { Button, Popconfirm, Tag, Tooltip, Space } from "antd";

export interface ReconciliationStatusBarProps {
  isReadOnly: boolean;
  diffString: string;
  isBalanced: boolean;
  getAmountColor: (amountString: string) => string;

  // 完成對沖
  completing: boolean;
  onComplete: () => Promise<void>;

  // 解除完成（Reverse Complete）
  reverseCompleting: boolean;
  onReverseComplete: () => Promise<void>;
}

const ReconciliationStatusBar: React.FC<ReconciliationStatusBarProps> = ({
  isReadOnly,
  diffString,
  isBalanced,
  getAmountColor,
  completing,
  onComplete,
  reverseCompleting,
  onReverseComplete,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {isReadOnly ? (
          <Tag color="default">已鎖定</Tag>
        ) : isBalanced ? (
          <Tag color="green">可完成（平帳）</Tag>
        ) : (
          <Tag color="red">未平帳</Tag>
        )}
        <span>
          差額：
          <span style={{ color: getAmountColor(diffString) }}>
            {diffString} 元（
            {parseFloat(diffString) > 0
              ? "多收"
              : parseFloat(diffString) < 0
              ? "少收"
              : "平帳"}
            ）
          </span>
        </span>
      </div>

      {/* 右側按鈕群：已完成→顯示解除完成；未完成→顯示完成對沖 */}
      <Space>
        {isReadOnly ? (
          <Popconfirm
            title="確定要解除完成？解除後將解鎖此沖帳單，恢復可編輯狀態。"
            okText="解除完成"
            cancelText="取消"
            onConfirm={async () => {
              await onReverseComplete();
            }}
          >
            <Button loading={reverseCompleting}>解除完成</Button>
          </Popconfirm>
        ) : (
          <Tooltip
            title={
              isBalanced
                ? "完成後將鎖定此沖帳單，無法再新增、編輯或刪除"
                : "差額未為 0，無法完成對沖"
            }
          >
            <Popconfirm
              title="完成對沖後將鎖定，無法再新增、編輯或刪除。是否繼續？"
              onConfirm={async () => {
                await onComplete();
              }}
              okText="完成對沖"
              cancelText="取消"
              disabled={!isBalanced}
            >
              <Button type="primary" danger loading={completing} disabled={!isBalanced}>
                完成對沖
              </Button>
            </Popconfirm>
          </Tooltip>
        )}
      </Space>
    </div>
  );
};

export default ReconciliationStatusBar;
