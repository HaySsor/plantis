export type ToastType = "info" | "success" | "error" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export function useToast() {
  const toasts = useState<Toast[]>("toasts", () => []);

  function add(message: string, type: ToastType = "info", duration = 3500) {
    const id = Math.random().toString(36).slice(2);
    toasts.value = [...toasts.value, { id, message, type }];
    setTimeout(() => remove(id), duration);
  }

  function remove(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  const info    = (msg: string, dur?: number) => add(msg, "info",    dur);
  const success = (msg: string, dur?: number) => add(msg, "success", dur);
  const error   = (msg: string, dur?: number) => add(msg, "error",   dur);
  const warning = (msg: string, dur?: number) => add(msg, "warning", dur);

  return { toasts, add, remove, info, success, error, warning };
}
