export const PROCRUD_RELOAD_EVENT = "procrud:reload" as const;

export function triggerProCrudReload(): void {
  // 不帶 payload，純通知
  window.dispatchEvent(new Event(PROCRUD_RELOAD_EVENT));
}
