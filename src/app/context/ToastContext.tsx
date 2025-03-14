"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";

interface ToastMessage {
  id: number;
  type: "success" | "error";
  title: string;
  onClose?: () => void;
}

type ToastType = {
  title: string;
  timeout?: number;
  onClose?: () => void;
};

type ToastContextType = {
  successToast: ({ title, timeout, onClose }: ToastType) => void;
  errorToast: ({ title, timeout, onClose }: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

type ToastProviderProps = {
  defaulttimeout?: number;
} & PropsWithChildren;

export const ToastProvider = ({
  defaulttimeout = 3000,
  children,
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    type: "success" | "error",
    title: string,
    timeout: number = defaulttimeout,
    onClose?: () => void
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, onClose }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      if (onClose) onClose();
    }, timeout);
  };

  const successToast = ({ title, timeout, onClose }: ToastType) =>
    addToast("success", title, timeout, onClose);

  const errorToast = ({ title, timeout, onClose }: ToastType) =>
    addToast("error", title, timeout, onClose);

  return (
    <ToastContext.Provider value={{ successToast, errorToast }}>
      {children}
      {/* Overlay to disable clicks when toast is active */}
      {toasts.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}
      {/* Toast container */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-3 rounded-md shadow-md ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.title}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
