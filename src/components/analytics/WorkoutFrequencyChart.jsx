import React, { useMemo } from 'react';
import { Dumbbell } from 'lucide-react';

const WEEKS = 8;

const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Sunday as start of week
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatWeekLabel = (date) =>
  date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

/**
 * workouts: [{ date | createdAt }, ...]
 */
const WorkoutFrequencyChart = ({ workouts = [] }) => {
  const weeklyData = useMemo(() => {
    const buckets = [];
    const today = startOfWeek(new Date());

    for (let i = WEEKS - 1; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      buckets.push({ weekStart, weekEnd, count: 0 });
    }

    workouts.forEach((w) => {
      const d = new Date(w.date || w.createdAt);
      const bucket = buckets.find((b) => d >= b.weekStart && d < b.weekEnd);
      if (bucket) bucket.count += 1;
    });

    return buckets;
  }, [workouts]);

  const maxCount = Math.max(1, ...weeklyData.map((b) => b.count));
  const totalRecent = weeklyData.reduce((sum, b) => sum + b.count, 0);

  if (totalRecent === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-black dark:text-white mb-1">
          Workout frequency
        </h3>
        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
          <Dumbbell size={28} className="mx-auto mb-2" />
          <p className="text-sm">Log a workout to see your weekly frequency.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-black dark:text-white">
          Workout frequency
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">Last {WEEKS} weeks</span>
      </div>

      <div className="flex items-end justify-between gap-2 sm:gap-3 h-36">
        {weeklyData.map((bucket, index) => {
          const heightPct = Math.max(4, (bucket.count / maxCount) * 100);
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center justify-end h-full group"
            >
              <span className="text-xs font-semibold text-black dark:text-white mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {bucket.count}
              </span>
              <div className="w-full h-full flex items-end">
                <div
                  className="w-full rounded-t-md bg-lime-400 transition-all duration-300"
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 text-center">
                {formatWeekLabel(bucket.weekStart)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutFrequencyChart;