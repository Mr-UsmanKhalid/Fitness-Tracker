import React from 'react';

/**
 * Props
 * - trendGood: optional boolean. Forces the trend badge green (true) or red (false).
 *              If omitted, a leading "-" is treated as bad (red).
 * - progress:  optional 0-100. The progress bar is only rendered when provided,
 *              so cards without progress data don't show an empty bar.
 */
const StatCard = ({
  title,
  value,
  unit,
  icon,
  trend,
  trendGood,
  color = 'lime',
  progress,
}) => {
  const isGood = trendGood ?? !String(trend).startsWith('-');
  const bg = color === 'lime' ? 'bg-lime-50 dark:bg-lime-400/10' : 'bg-gray-100 dark:bg-gray-800';
  const border =
    color === 'lime'
      ? 'border-lime-400 dark:border-lime-500/60'
      : 'border-gray-300 dark:border-gray-700';
  const hasProgress = progress !== undefined && progress !== null;
  const safeProgress = Math.min(Math.max(Number(progress) || 0, 0), 100);

  return (
    <div
      className={`${bg} ${border} border-2 rounded-xl p-3 sm:p-4 lg:p-5 min-w-0 transition-shadow duration-200 hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xl sm:text-3xl leading-none" aria-hidden="true">
          {icon}
        </span>
        {trend != null && (
          <span
            className={`text-[11px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap ${
              isGood
                ? 'bg-lime-100 text-lime-700 dark:bg-lime-400/15 dark:text-lime-300'
                : 'bg-red-100 text-red-600 dark:bg-red-400/15 dark:text-red-300'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      <p className="mt-3 text-xl sm:text-2xl lg:text-3xl font-bold text-black dark:text-white leading-tight truncate">
        {value}
      </p>

      <p className="mt-1 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
        {title}
      </p>
      <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">{unit}</p>

      {hasProgress && (
        <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
          <div
            className="bg-gradient-to-r from-lime-400 to-lime-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${safeProgress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default StatCard;