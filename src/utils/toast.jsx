import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

// ==========================================
// Lightweight pub/sub - call toast.success('...') from
// anywhere (components, thunks, event handlers) without
// needing React context or prop drilling.
// ==========================================
let listeners = [];
let idCounter = 0;

const emit = (type, message, options = {}) => {
  const toastItem = {
    id: ++idCounter,
    type,
    message,
    duration: options.duration ?? 4000,
  };
  listeners.forEach((listener) => listener(toastItem));
  return toastItem.id;
};

export const toast = {
  success: (message, options) => emit('success', message, options),
  error: (message, options) => emit('error', message, options),
  info: (message, options) => emit('info', message, options),
};

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const STYLES = {
  success: 'bg-black border-lime-400 text-white',
  error: 'bg-white border-red-400 text-black',
  info: 'bg-white border-gray-300 text-black',
};

const ICON_COLORS = {
  success: 'text-lime-400',
  error: 'text-red-500',
  info: 'text-blue-500',
};

/**
 * Mount this ONCE near the root of the app (e.g. in App.jsx, alongside
 * <Layout> or just above <Routes>) so popups can render from anywhere.
 */
export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (toastItem) => {
      setToasts((prev) => [...prev, toastItem]);

      if (toastItem.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toastItem.id));
        }, toastItem.duration);
      }
    };

    listeners.push(handleToast);
    return () => {
      listeners = listeners.filter((l) => l !== handleToast);
    };
  }, []);

  const dismiss = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || Info;
        return (
          <div
            key={t.id}
            className={`flex items-start gap-3 border-2 rounded-lg shadow-lg px-4 py-3 transition-all duration-200 ${STYLES[t.type]}`}
          >
            <Icon size={18} className={`shrink-0 mt-0.5 ${ICON_COLORS[t.type]}`} />
            <p className="text-sm font-medium flex-1">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};