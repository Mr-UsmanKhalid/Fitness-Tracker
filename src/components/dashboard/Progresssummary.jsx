import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { TrendingDown, TrendingUp, ChevronRight, Plus } from 'lucide-react';
import { fetchProgress, fetchGoal } from '../../redux/slices/progressSlice';
import { useUnits, convertWeight, convertLength, round1 } from '../../utils/units';

const dayLabel = (isoDate) => {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
};

// Defined outside the component so it isn't re-created on every render
const MiniChart = ({ data }) => {
  if (data.length < 2) {
    return (
      <div className="w-full h-24 sm:h-28 flex items-center justify-center bg-lime-50 dark:bg-lime-400/10 rounded-lg">
        <p className="text-xs text-gray-400 dark:text-gray-500">Not enough data yet</p>
      </div>
    );
  }

  const W = 300;
  const H = 100;
  const PAD = 10; // keeps the line from being clipped at the edges

  const weights = data.map((d) => d.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const range = maxWeight - minWeight || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = PAD + ((maxWeight - d.weight) / range) * (H - PAD * 2);
    return [x, y];
  });

  const line = points.map(([x, y]) => `${x},${y}`).join(' ');
  const area = `0,${H} ${line} ${W},${H}`;

  return (
    <div className="w-full h-24 sm:h-28 bg-lime-50 dark:bg-lime-400/10 rounded-lg overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Weight trend for the last entries"
      >
        <defs>
          <linearGradient id="progressAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#84cc16" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#progressAreaGradient)" />
        <polyline
          points={line}
          fill="none"
          className="stroke-lime-600 dark:stroke-lime-400"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

// The weight goal is saved on the backend (set from the Progress page)
const ProgressSummary = () => {
  const dispatch = useDispatch();
  const { progressEntries, loading, error, goal: savedGoal, goalLoaded } = useSelector(
    (state) => state.progress
  );
  const { system, weightUnit, lengthUnit } = useUnits();

  useEffect(() => {
    dispatch(fetchProgress());
    dispatch(fetchGoal());
  }, [dispatch]);

  // progressEntries is kept sorted ascending by date (oldest -> newest) by the slice
  const sorted = progressEntries || [];
  const latest = sorted[sorted.length - 1] || null;
  const previous = sorted[sorted.length - 2] || null;

  // Weight tiles use check-ins that actually have a weight (some entries are measurements only)
  const weighIns = sorted.filter((e) => e.weight != null);
  const latestWeighIn = weighIns[weighIns.length - 1] || null;
  const previousWeighIn = weighIns[weighIns.length - 2] || null;
  const firstWeighIn = weighIns[0] || null;

  // Everything below is in the preferred unit (entries and the goal can be kg or lbs)
  const toPreferred = (entry) => convertWeight(entry?.weight, entry?.weightUnit, system);
  const currentWeight = toPreferred(latestWeighIn) ?? 0;
  const previousWeight = toPreferred(previousWeighIn) ?? currentWeight;
  const startWeight = toPreferred(firstWeighIn) ?? currentWeight;
  const weightLost = previousWeight - currentWeight;

  // null until the user sets a goal on the Progress page
  const goal = savedGoal
    ? convertWeight(savedGoal.goalWeight, savedGoal.weightUnit, system)
    : null;

  // Goal progress runs from the first weigh-in to the goal, for lose or gain goals
  let goalRemaining = 0;
  let goalPercent = 0;
  if (goal !== null && latestWeighIn) {
    const losing = startWeight >= goal;
    goalRemaining = losing
      ? Math.max(currentWeight - goal, 0)
      : Math.max(goal - currentWeight, 0);

    const distance = startWeight - goal;
    const percent =
      distance !== 0
        ? ((startWeight - currentWeight) / distance) * 100
        : goalRemaining < 0.05
        ? 100
        : 0;
    goalPercent = Math.min(Math.max(percent, 0), 100);
  }
  const goalReached = goal !== null && latestWeighIn !== null && goalRemaining < 0.05;

  const weeklyData = useMemo(() => {
    const last7 = (progressEntries || []).filter((e) => e.weight != null).slice(-7);
    return last7.map((entry) => ({
      day: dayLabel(entry.date),
      weight: round1(convertWeight(entry.weight, entry.weightUnit, system)),
    }));
  }, [progressEntries, system]);

  // Body measurement change vs the prior entry, per measurement key
  const measurementData = useMemo(() => {
    if (!latest?.measurements) return [];
    return Object.keys(latest.measurements).map((key) => {
      const currentRaw = latest.measurements[key];
      const prevRaw = previous?.measurements?.[key];
      // Each entry stores its own measurementUnit; convert both to the preferred unit
      const current = convertLength(
        currentRaw?.value ?? currentRaw,
        currentRaw?.unit ?? latest.measurementUnit,
        system
      );
      const prev = convertLength(
        prevRaw?.value ?? prevRaw,
        prevRaw?.unit ?? previous?.measurementUnit,
        system
      );
      return {
        id: key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: round1(current),
        unit: lengthUnit,
        change: current !== null && prev !== null ? round1(current - prev) : 0,
      };
    });
  }, [latest, previous, system, lengthUnit]);

  if (loading && sorted.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border-2 border-lime-400 dark:border-lime-500 rounded-xl shadow-md dark:shadow-none overflow-hidden flex items-center justify-center p-10">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading progress...</p>
      </div>
    );
  }

  const lost = weightLost >= 0;

  return (
    <div className="bg-white dark:bg-gray-900 border-2 border-lime-400 dark:border-lime-500 rounded-xl shadow-md dark:shadow-none overflow-hidden">
      {/* Header */}
      <div className="bg-black px-4 sm:px-5 py-3 sm:py-4 flex justify-between items-center">
        <h3 className="text-base sm:text-lg font-bold text-lime-400">📊 Progress tracking</h3>
        <Link
          to="/progress/add"
          className="text-lime-400 hover:text-lime-300 transition-colors p-1"
          title="Add progress"
          aria-label="Add progress entry"
        >
          <Plus size={20} />
        </Link>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {error && <p className="text-xs text-red-g500 mb-3">{error}</p>}

        {!latest ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">No progress logged yet</p>
            <Link
              to="/progress/add"
              className="inline-block px-4 py-2 bg-lime-400 text-black text-sm font-semibold rounded-lg hover:bg-lime-300 transition-colors"
            >
              Log your first entry
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Weight tiles: always 3 across, sized to fit small screens */}
            <div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="bg-lime-50 dark:bg-lime-400/10 border border-lime-300 dark:border-lime-500/40 rounded-lg p-2.5 sm:p-4 min-w-0">
                  <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 font-medium">Current</p>
                  <p className="mt-1 text-lg sm:text-2xl font-bold text-black dark:text-white leading-tight truncate">
                    {round1(currentWeight)}
                    <span className="ml-1 text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">{weightUnit}</span>
                  </p>
                </div>

                <div
                  className={`border rounded-lg p-2.5 sm:p-4 min-w-0 ${
                    lost
                      ? 'bg-green-50 border-green-300 dark:bg-green-400/10 dark:border-green-500/40'
                      : 'bg-red-50 border-red-300 dark:bg-red-400/10 dark:border-red-500/40'
                  }`}
                >
                  <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {lost ? 'Lost' : 'Gained'}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    {lost ? (
                      <TrendingDown size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : (
                      <TrendingUp size={16} className="text-red-600 dark:text-red-400 flex-shrink-0" />
                    )}
                    <p
                      className={`text-lg sm:text-2xl font-bold leading-tight truncate ${
                        lost
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {Math.abs(weightLost).toFixed(1)}
                      <span className="ml-1 text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">{weightUnit}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 sm:p-4 min-w-0">
                  <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 font-medium">Goal</p>
                  {goal !== null ? (
                    <>
                      <p className="mt-1 text-lg sm:text-2xl font-bold text-black dark:text-white leading-tight truncate">
                        {round1(goal)}
                        <span className="ml-1 text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">{weightUnit}</span>
                      </p>
                      <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                        {goalReached ? 'Goal reached' : `${goalRemaining.toFixed(1)} ${weightUnit} left`}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-1 text-sm sm:text-base font-semibold text-gray-500 dark:text-gray-400 leading-tight">
                        {goalLoaded ? 'Not set' : '…'}
                      </p>
                      {goalLoaded && (
                        <Link
                          to="/progress"
                          className="text-[11px] sm:text-xs font-semibold text-lime-700 dark:text-lime-400 hover:underline"
                        >
                          Set a goal
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Goal progress */}
              {goal !== null && latestWeighIn ? (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Overall goal progress</p>
                    <p className="text-xs sm:text-sm font-bold text-black dark:text-white">{Math.round(goalPercent)}%</p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-lime-400 to-lime-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${goalPercent}%` }}
                    />
                  </div>
                </div>
              ) : (
                goalLoaded &&
                goal === null && (
                  <p className="mt-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Set a weight goal on the{' '}
                    <Link
                      to="/progress"
                      className="font-semibold text-lime-700 dark:text-lime-400 hover:underline"
                    >
                      Progress page
                    </Link>{' '}
                    to see how close you are.
                  </p>
                )
              )}
            </div>

            {/* Weight trend */}
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Weight trend</p>
              <MiniChart data={weeklyData} />
              {weeklyData.length > 0 && (
                <div className="flex justify-between mt-2 gap-1">
                  {weeklyData.map((data, index) => (
                    <div key={index} className="flex-1 min-w-0 text-center">
                      <p className="text-[11px] sm:text-xs font-semibold text-gray-800 dark:text-gray-200">{data.weight}</p>
                      <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400">{data.day}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Measurements */}
            {measurementData.length > 0 && (
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Body measurements</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                  {measurementData.map((m) => (
                    <div
                      key={m.id}
                      className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg p-3 min-w-0"
                    >
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                          {m.name}
                        </p>
                        <span
                          className={`text-[11px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                            m.change < 0
                              ? 'bg-green-100 text-green-700 dark:bg-green-400/15 dark:text-green-300'
                              : m.change > 0
                              ? 'bg-red-100 text-red-700 dark:bg-red-400/15 dark:text-red-300'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {m.change < 0 ? '↓' : m.change > 0 ? '↑' : '–'} {Math.abs(m.change)}
                        </span>
                      </div>
                      <p className="text-lg sm:text-xl font-bold text-black dark:text-white">
                        {m.value}
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">{m.unit}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-950 px-4 sm:px-5 py-3 border-t border-gray-200 dark:border-gray-800">
        <Link
          to="/progress"
          className="text-lime-700 dark:text-lime-400 font-semibold text-xs sm:text-sm hover:text-lime-600 dark:hover:text-lime-300 transition-colors flex items-center justify-center gap-1"
        >
          View detailed progress <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default ProgressSummary;