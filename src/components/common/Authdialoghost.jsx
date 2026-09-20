import { useEffect, useRef, useSyncExternalStore } from 'react';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

import {
  closeDialog,
  getDialogSnapshot,
  subscribeDialog,
} from '../../utils/authDialog';

/* ------------------------------------------------------------
   Variant styling — matches the app's black + lime look.
   `icon` on a dialog can override the default icon.
   ------------------------------------------------------------ */

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    border: 'border-lime-400',
    badge: 'bg-lime-400 text-black',
    confirmBtn: 'bg-lime-400 text-black hover:bg-lime-300',
    bar: 'bg-lime-400',
  },
  error: {
    icon: XCircle,
    border: 'border-red-500',
    badge: 'bg-red-500 text-white',
    confirmBtn: 'bg-red-600 text-white hover:bg-red-500',
    bar: 'bg-red-500',
  },
  danger: {
    icon: AlertTriangle,
    border: 'border-red-500',
    badge: 'bg-red-500 text-white',
    confirmBtn: 'bg-red-600 text-white hover:bg-red-500',
    bar: 'bg-red-500',
  },
};

const FOCUSABLE = 'button, [href], input, [tabindex]:not([tabindex="-1"])';

export default function AuthDialogHost() {
  const dialog = useSyncExternalStore(
    subscribeDialog,
    getDialogSnapshot,
    getDialogSnapshot
  );

  const cardRef = useRef(null);
  const primaryRef = useRef(null);

  const isConfirm = dialog?.kind === 'confirm';
  const id = dialog?.id;

  /* Result when dismissed without pressing the main button. */
  const dismiss = () => {
    if (!dialog) return;
    closeDialog(dialog.id, isConfirm ? false : true);
  };

  /* Auto-close (success alerts). */
  useEffect(() => {
    if (!dialog?.autoClose) return undefined;
    const timer = setTimeout(() => closeDialog(dialog.id, true), dialog.autoClose);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* Esc to dismiss, Tab stays inside the dialog. */
  useEffect(() => {
    if (!dialog) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDialog(dialog.id, isConfirm ? false : true);
        return;
      }

      if (e.key === 'Tab' && cardRef.current) {
        const items = cardRef.current.querySelectorAll(FOCUSABLE);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* Lock page scroll and restore focus afterwards. */
  useEffect(() => {
    if (!dialog) return undefined;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    primaryRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!dialog) return null;

  const variant = VARIANTS[dialog.variant] || VARIANTS.success;
  const Icon = dialog.icon || variant.icon;

  return (
    <div
      key={dialog.id}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="authdialog-fade absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        ref={cardRef}
        role={isConfirm ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        aria-labelledby={`authdialog-title-${dialog.id}`}
        aria-describedby={`authdialog-msg-${dialog.id}`}
        className={`
          authdialog-pop
          relative
          w-full
          max-w-sm
          overflow-hidden
          rounded-xl
          border-2
          ${variant.border}
          bg-white
          text-black
          dark:bg-gray-900
          dark:text-white
          shadow-2xl
          px-6
          pt-8
          pb-6
          text-center
        `}
      >
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${variant.badge}`}
        >
          <Icon size={24} strokeWidth={2.25} />
        </div>

        <h2
          id={`authdialog-title-${dialog.id}`}
          className="text-xl font-semibold"
        >
          {dialog.title}
        </h2>

        {dialog.message && (
          <p
            id={`authdialog-msg-${dialog.id}`}
            className="mt-2 text-sm text-gray-600 dark:text-gray-400 break-words"
          >
            {dialog.message}
          </p>
        )}

        <div className={`mt-6 flex gap-3 ${isConfirm ? '' : 'justify-center'}`}>
          {isConfirm && (
            <button
              type="button"
              onClick={() => closeDialog(dialog.id, false)}
              className="
                flex-1
                rounded-lg
                border
                border-gray-300
                dark:border-gray-700
                py-2.5
                text-sm
                font-semibold
                hover:bg-gray-100
                dark:hover:bg-gray-800
                transition-colors
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-lime-400
              "
            >
              {dialog.cancelText}
            </button>
          )}

          <button
            ref={primaryRef}
            type="button"
            onClick={() => closeDialog(dialog.id, true)}
            className={`
              ${isConfirm ? 'flex-1' : 'min-w-28 px-6'}
              rounded-lg
              py-2.5
              text-sm
              font-semibold
              transition-colors
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-offset-2
              focus-visible:ring-lime-400
              dark:focus-visible:ring-offset-gray-900
              ${variant.confirmBtn}
            `}
          >
            {dialog.confirmText}
          </button>
        </div>

        {/* Auto-close countdown */}
        {dialog.autoClose > 0 && (
          <span
            aria-hidden="true"
            className={`authdialog-bar absolute bottom-0 left-0 h-1 w-full origin-left ${variant.bar}`}
            style={{ animationDuration: `${dialog.autoClose}ms` }}
          />
        )}
      </div>

      <style>{`
        @keyframes authdialog-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes authdialog-pop {
          from { opacity: 0; transform: translateY(8px) scale(.97) }
          to   { opacity: 1; transform: none }
        }
        @keyframes authdialog-bar { from { transform: scaleX(1) } to { transform: scaleX(0) } }

        .authdialog-fade { animation: authdialog-fade 150ms ease-out both }
        .authdialog-pop  { animation: authdialog-pop 200ms cubic-bezier(0.22,1,0.36,1) both }
        .authdialog-bar  { animation-name: authdialog-bar; animation-timing-function: linear; animation-fill-mode: forwards }

        @media (prefers-reduced-motion: reduce) {
          .authdialog-fade, .authdialog-pop { animation: none }
          .authdialog-bar { animation: none; display: none }
        }
      `}</style>
    </div>
  );
}