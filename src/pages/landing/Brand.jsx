export function BrandMark({ className = '' }) {
  return (
    <span
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-lp-fg text-lp-bg ${className}`}
      aria-hidden="true"
    >
      <svg className="h-[20px] w-[20px]" viewBox="0 0 26 26" fill="none">
        <path
          d="M13 1V5M10 5H16M8 7H18M13 7V19M8 19H18M10 21H16M13 21V25"
          stroke="#c8ff4d"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export const BRAND_NAME = 'Fitness Tracker';