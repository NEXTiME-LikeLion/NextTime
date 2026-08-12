import { createContext, useCallback, useContext, useState } from "react";
import Toast from "../components/Toast/Toast";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast({ message });

    setTimeout(() => {
      setToast(null);
    }, 2000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
      {toast && <Toast message={toast.message} />}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast는 ToastProvider 안에서만 사용할 수 있어요.");
  }
  return context;
};
