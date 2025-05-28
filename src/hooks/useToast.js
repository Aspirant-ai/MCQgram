// src/hooks/useToast.js
import { ToastProvider, ToastViewport } from '@radix-ui/react-toast';

export const Toaster = ({ children }) => {
  return (
    <ToastProvider>{children}</ToastProvider>
  );
};