import React from 'react';
import { Dumbbell, Apple, TrendingUp, LayoutGrid } from 'lucide-react';

const REPORT_TYPES = [
  { key: 'complete', label: 'Overview', icon: LayoutGrid },
  { key: 'workout', label: 'Workouts', icon: Dumbbell },
  { key: 'nutrition', label: 'Nutrition', icon: Apple },
  { key: 'progress', label: 'Progress', icon: TrendingUp },
];

const inputClass =
  'px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all';

/**
 * reportType: 'complete' | 'workout' | 'nutrition' | 'progress'
 * dateRange: { startDate, endDate } - applies to all report types
 */
const ReportFilter = ({ reportType, onReportTypeChange, dateRange, onDateRangeChange }) => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 sm:p-5 space-y-4">
      {/* Report type tabs */}
      <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1">
        {REPORT_TYPES.map((type) => {
          const Icon = type.icon;
          const active = reportType === type.key;
          return (
            <button
              key={type.key}
              onClick={() => onReportTypeChange(type.key)}
              className={`shrink-0 flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full border transition-colors ${
                active
                  ? 'bg-black text-white border-black dark:bg-lime-400 dark:text-black dark:border-lime-400'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-black hover:text-black dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:border-lime-400 dark:hover:text-lime-400'
              }`}
            >
              <Icon size={15} />
              {type.label}
            </button>
          );
        })}
      </div>

      {/* Date range - applies to every report type */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            From
          </label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              onDateRangeChange({ ...dateRange, startDate: e.target.value })
            }
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            To
          </label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) =>
              onDateRangeChange({ ...dateRange, endDate: e.target.value })
            }
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportFilter;