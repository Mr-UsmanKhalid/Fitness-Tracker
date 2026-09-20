import React from 'react';

/* Light: pastel fill + colored border. Dark: faint tint of the same color on the dark surface */
const COLOR_CLASSES = {
  lime: {
    bg: 'bg-lime-50 dark:bg-lime-400/10',
    border: 'border-lime-300 dark:border-lime-500/40',
    text: 'text-lime-600 dark:text-lime-400',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-400/10',
    border: 'border-blue-300 dark:border-blue-500/40',
    text: 'text-blue-600 dark:text-blue-400',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-400/10',
    border: 'border-orange-300 dark:border-orange-500/40',
    text: 'text-orange-600 dark:text-orange-400',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-400/10',
    border: 'border-purple-300 dark:border-purple-500/40',
    text: 'text-purple-600 dark:text-purple-400',
  },
  gray: {
    bg: 'bg-gray-50 dark:bg-gray-800/60',
    border: 'border-gray-300 dark:border-gray-700',
    text: 'text-gray-600 dark:text-gray-400',
  },
};

const ReportCard = ({ label, value, unit, icon: Icon, color = 'lime' }) => {
  const palette = COLOR_CLASSES[color] || COLOR_CLASSES.lime;

  return (
    <div className={`${palette.bg} border-2 ${palette.border} rounded-lg p-4 sm:p-5`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </span>
        {Icon && <Icon size={18} className={palette.text} />}
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
        {value}
        {unit && (
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">{unit}</span>
        )}
      </p>
    </div>
  );
};

export default ReportCard;