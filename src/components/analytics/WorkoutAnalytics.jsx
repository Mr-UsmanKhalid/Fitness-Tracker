import React, { useMemo } from 'react';
import { Dumbbell, Flame, Trophy } from 'lucide-react';
import WorkoutFrequencyChart from './WorkoutFrequencyChart';

const CATEGORY_COLORS = [
  '#a3e635', // lime
  '#60a5fa', // blue
  '#fb923c', // orange
  '#c084fc', // purple
  '#f472b6', // pink
  '#34d399', // emerald
  '#9ca3af', // gray fallback
];

/**
 * workouts: [{ category, exercises: [{ name, sets, reps, weight }] }, ...]
 */
const WorkoutAnalytics = ({ workouts = [] }) => {
  const stats = useMemo(() => {
    const totalWorkouts = workouts.length;

    let totalVolume = 0;
    const exerciseCounts = {};
    const categoryCounts = {};

    workouts.forEach((w) => {
      const cat = w.category || 'other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

      (w.exercises || []).forEach((ex) => {
        const sets = Number(ex.sets) || 0;
        const reps = Number(ex.reps) || 0;
        const weight = Number(ex.weight) || 0;
        totalVolume += sets * reps * weight;

        if (ex.name) {
          exerciseCounts[ex.name] = (exerciseCounts[ex.name] || 0) + 1;
        }
      });
    });

    const topExercise = Object.entries(exerciseCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];

    const categoryBreakdown = Object.entries(categoryCounts)
      .map(([category, count]) => ({
        category,
        count,
        pct: totalWorkouts > 0 ? Math.round((count / totalWorkouts) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return { totalWorkouts, totalVolume, topExercise, categoryBreakdown };
  }, [workouts]);

  const gradientStops = useMemo(() => {
    let cumulative = 0;
    return stats.categoryBreakdown.map((entry, i) => {
      const start = cumulative;
      cumulative += entry.pct;
      return {
        ...entry,
        start,
        end: cumulative,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      };
    });
  }, [stats.categoryBreakdown]);

  const gradientCss = gradientStops.length
    ? `conic-gradient(${gradientStops
        .map((s) => `${s.color} ${s.start}% ${s.end}%`)
        .join(', ')})`
    : undefined;

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Dumbbell size={16} className="text-lime-500" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Total workouts
            </span>
          </div>
          <p className="text-2xl font-bold text-black dark:text-white mt-2">
            {stats.totalWorkouts}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Flame size={16} className="text-orange-400" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Total volume
            </span>
          </div>
          <p className="text-2xl font-bold text-black dark:text-white mt-2">
            {stats.totalVolume.toLocaleString()}
            <span className="text-sm font-normal text-gray-400 dark:text-gray-500 ml-1">kg</span>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Trophy size={16} className="text-purple-400" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Top exercise
            </span>
          </div>
          <p className="text-lg font-bold text-black dark:text-white mt-2 truncate">
            {stats.topExercise ? stats.topExercise[0] : '—'}
          </p>
          {stats.topExercise && (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              logged {stats.topExercise[1]} times
            </p>
          )}
        </div>
      </div>

      {/* Category breakdown + frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-black dark:text-white mb-4">
            Workouts by category
          </h3>
          {gradientStops.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
              No workouts logged yet.
            </p>
          ) : (
            <div className="flex items-center gap-6 flex-wrap sm:flex-nowrap">
              <div
                className="w-28 h-28 rounded-full shrink-0"
                style={{ background: gradientCss }}
              />
              <div className="flex-1 min-w-[160px] space-y-2">
                {gradientStops.map((entry) => (
                  <div key={entry.category} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize flex-1 truncate">
                      {entry.category}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{entry.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <WorkoutFrequencyChart workouts={workouts} />
      </div>
    </div>
  );
};

export default WorkoutAnalytics;