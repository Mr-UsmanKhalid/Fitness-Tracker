/* Small pieces shared by Login, Register and the password pages. */

export function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a15.6 15.6 0 0 1-3.4 4.3M6.6 6.6C4 8.3 2 12 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8" strokeLinecap="round" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" strokeLinecap="round" />
    </svg>
  );
}

export const labelClass = 'block font-mono text-xs text-ink/40 mb-2';

/** Underline-style input; turns red when the field has an error. */
export const fieldClass = (invalid, extra = '') =>
  `w-full bg-transparent border-0 border-b outline-none py-2 text-base transition-colors ${extra} ${
    invalid ? 'border-red-500 focus:border-red-500' : 'border-ink/20 focus:border-accent'
  }`;

export function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-red-600">
      {message}
    </p>
  );
}

export function Spinner() {
  return (
    <div className="min-h-screen grid place-items-center bg-white">
      <div
        className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-gray-700"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}