/**
 * authDialog — tiny imperative dialog store.
 *
 * Call it from anywhere (components, thunks, handlers) and await the result:
 *
 *   const ok = await authDialog.confirm({ title: 'Log out?', message: '...' });
 *   await authDialog.success({ title: 'Logged in', message: 'sara successfully logged in.' });
 *
 * The dialog itself is rendered by <AuthDialogHost /> — mount that ONCE in App.jsx.
 * Because the host lives above the router, a dialog survives navigation
 * (e.g. "Logged out" still shows after you land on /login).
 */

let queue = [];
let current = null;
let nextId = 1;
const listeners = new Set();

const emit = () => {
  current = queue[0] || null;
  listeners.forEach((listener) => listener());
};

const open = (config) =>
  new Promise((resolve) => {
    queue = [...queue, { id: nextId++, ...config, resolve }];
    emit();
  });

/** Close a dialog by id and resolve its promise with `result`. */
export const closeDialog = (id, result) => {
  const item = queue.find((d) => d.id === id);
  if (!item) return;
  queue = queue.filter((d) => d.id !== id);
  emit();
  item.resolve(result);
};

export const subscribeDialog = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getDialogSnapshot = () => current;

export const authDialog = {
  /**
   * Two-button confirmation. Resolves `true` (confirmed) or `false`
   * (cancelled, Esc, or backdrop click).
   */
  confirm: (options) =>
    open({
      kind: 'confirm',
      variant: 'danger',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      ...options,
    }),

  /**
   * Success alert. Auto-closes after `autoClose` ms (set 0 to disable).
   * Resolves when the dialog closes, so you can `await` it before navigating.
   */
  success: (options) =>
    open({
      kind: 'alert',
      variant: 'success',
      confirmText: 'OK',
      autoClose: 2500,
      ...options,
    }),

  /** Error alert. Stays until dismissed. */
  error: (options) =>
    open({
      kind: 'alert',
      variant: 'error',
      confirmText: 'OK',
      autoClose: 0,
      ...options,
    }),
};