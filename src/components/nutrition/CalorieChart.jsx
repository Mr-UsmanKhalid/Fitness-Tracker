import React from 'react';
import { Flame } from 'lucide-react';

const formatDay = (date) =>
  new Date(date).toLocaleDateString(undefined, { weekday: 'short' });

/**
 * data: [{ date: '2026-09-08', calories: 2100 }, ...]
 * goal: optional daily calorie goal, drawn as a reference line
 */
const CalorieChart = ({ data = [], goal }) => {
  if (!data.length) {
    return (
      <div className="text-center py-8 text-gray-400 dark:text-gray-500">
        <Flame size={28} className="mx-auto mb-2" />
        <p className="text-sm">Not enough data yet to show a trend.</p>
      </div>
    );
  }

  const maxValue = Math.max(goal || 0, ...data.map((d) => d.calories || 0), 1);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-black dark:text-white">Calories this week</h3>
        {goal ? (
          <span className="text-xs text-gray-500 dark:text-gray-400">Goal: {goal} kcal</span>
        ) : null}
      </div>

      <div className="flex items-end justify-between gap-2 sm:gap-3 h-40">
        {data.map((entry, index) => {
          const heightPct = Math.max(
            4,
            Math.round(((entry.calories || 0) / maxValue) * 100)
          );
          const overGoal = goal && entry.calories > goal;

          return (
            <div
              key={entry.date || index}
              className="flex-1 flex flex-col items-center justify-end h-full group"
            >
              <span className="text-xs font-semibold text-black dark:text-white mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {entry.calories}
              </span>
              <div className="w-full h-full flex items-end">
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    overGoal ? 'bg-orange-400' : 'bg-lime-400'
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {formatDay(entry.date)}
              </span>
            </div>
          );
        })}
      </div>

      {goal ? (
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 dark:text-gray-500">
          <span className="w-2.5 h-2.5 rounded-sm bg-lime-400 inline-block" />
          Under goal
          <span className="w-2.5 h-2.5 rounded-sm bg-orange-400 inline-block ml-3" />
          Over goal
        </div>
      ) : null}
    </div>
  );
};

export default CalorieChart;