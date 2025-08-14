import { useState, useCallback } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

const toasts: Toast[] = [];
let toastId = 0;

export function useToast() {
  const [, forceUpdate] = useState({});

  const toast = useCallback((props: Omit<Toast, "id">) => {
    const id = (++toastId).toString();
    const newToast: Toast = { ...props, id };
    toasts.push(newToast);
    forceUpdate({});

    // Auto remove after 5 seconds
    setTimeout(() => {
      const index = toasts.findIndex(t => t.id === id);
      if (index > -1) {
        toasts.splice(index, 1);
        forceUpdate({});
      }
    }, 5000);

    return { id };
  }, []);

  const dismiss = useCallback((toastId: string) => {
    const index = toasts.findIndex(t => t.id === toastId);
    if (index > -1) {
      toasts.splice(index, 1);
      forceUpdate({});
    }
  }, []);

  return {
    toast,
    dismiss,
    toasts: [...toasts],
  };
}

// Export toast function from the hook above
export const toast = (props: Omit<Toast, "id">) => {
  const id = (++toastId).toString();
  const newToast: Toast = { ...props, id };
  toasts.push(newToast);
  return { id };
};