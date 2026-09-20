import React, { useMemo } from 'react';
import { Scale, Trophy, Ruler } from 'lucide-react';
import WeightChart from '../progress/WeightChart';
import PerformanceChart from '../progress/PerformanceChart';

const PERFORMANCE_FIELDS = [
  { key: 'benchPress', label: 'Bench Press', unit: 'kg' },
  { key: 'squat', label: 'Squat', unit: 'kg' },
  { key: 'deadlift', label: 'Deadlift', unit: 'kg' },
];

/**
 * entries: [{ date, weight, weightUnit, measurements, performance }, ...]
 */
const ProgressAnalytics = ({ entries = [] }) => {
  const stats = useMemo(() => {
    const sorted = [...entries].sort(
      (a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt)
    );

    const weighted = sorted.filter((e) => e.weight != null);
    const weightChange =
      weighted.length >= 2
        ? weighted[weighted.length - 1].weight - weighted[0].weight
        : null;
    const weightUnit = weighted[weighted.length - 1]?.weightUnit || 'kg';

    const bestLifts = PERFORMANCE_FIELDS.map((field) => {
      const values = entries
        .map((e) => e.performance?.[field.key])
        .filter((v) => v !== null && v !== undefined);
      return {
        ...field,
        best: values.length > 0 ? Math.max(...values) : null,
      };
    }).filter((f) => f.best !== null);

    const measurementKeys = ['waist', 'chest', 'arms', 'hips', 'thighs', 'neck'];
    let measurementChange = null;
    for (const key of measurementKeys) {
      const withKey = sorted.filter(
        (e) => e.measurements?.[key] !== null && e.measurements?.[key] !== undefined
      );
      if (withKey.length >= 2) {
        measurementChange = {
          key,
          change:
            withKey[withKey.length - 1].measurements[key] -
            withKey[0].measurements[key],
          unit: withKey[withKey.length - 1].measurementUnit || 'cm',
        };
        break;
      }
    }

    return { weightChange, weightUnit, bestLifts, measurementChange, checkIns: entries.length };
  }, [entries]);

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Scale size={16} className="text-blue-400" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Weight change
            </span>
          </div>
          <p
            className={`text-2xl font-bold mt-2 ${
              stats.weightChange == null
                ? 'text-black dark:text-white'
                : stats.weightChange > 0
                ? 'text-orange-500 dark:text-orange-400'
                : 'text-lime-600 dark:text-lime-400'
            }`}
          >
            {stats.weightChange == null
              ? '—'
              : `${stats.weightChange > 0 ? '+' : ''}${stats.weightChange.toFixed(1)}`}
            {stats.weightChange != null && (
              <span className="text-sm font-normal text-gray-400 dark:text-gray-500 ml-1">
                {stats.weightUnit}
              </span>
            )}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Ruler size={16} className="text-purple-400" />
            <span className="text-xs font-medium uppercase tracking-wide capitalize">
              {stats.measurementChange?.key || 'Measurement'} change
            </span>
          </div>
          <p className="text-2xl font-bold text-black dark:text-white mt-2">
            {stats.measurementChange
              ? `${stats.measurementChange.change > 0 ? '+' : ''}${stats.measurementChange.change.toFixed(1)}`
              : '—'}
            {stats.measurementChange && (
              <span className="text-sm font-normal text-gray-400 dark:text-gray-500 ml-1">
                {stats.measurementChange.unit}
              </span>
            )}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Trophy size={16} className="text-lime-500" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Check-ins logged
            </span>
          </div>
          <p className="text-2xl font-bold text-black dark:text-white mt-2">{stats.checkIns}</p>
        </div>
      </div>

      {/* Best lifts */}
      {stats.bestLifts.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-black dark:text-white mb-3">
            Personal bests
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {stats.bestLifts.map((lift) => (
              <div
                key={lift.key}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">{lift.label}</p>
                <p className="text-lg font-bold text-black dark:text-white mt-1">
                  {lift.best}
                  <span className="text-xs font-normal text-gray-400 dark:text-gray-500 ml-0.5">
                    {lift.unit}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WeightChart entries={entries} />
        <PerformanceChart entries={entries} />
      </div>
    </div>
  );
};

export default ProgressAnalytics;