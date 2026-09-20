import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WelcomeCard from '../components/dashboard/WelcomeCard';
import StatCard from '../components/dashboard/StatCard';
import RecentWorkouts from '../components/dashboard/RecentWorkouts';
import NutritionSummary from '../components/dashboard/NutritionSummary';
import ProgressSummary from '../components/dashboard/Progresssummary.jsx';
import { fetchWorkouts } from '../redux/slices/workoutSlice';
import { fetchProgress } from '../redux/slices/progressSlice';
import { fetchNutrition } from '../redux/slices/nutritionSlice';
import { useUnits, convertWeight, round1 } from '../utils/units';

// Local-time YYYY-MM-DD (toISOString() is UTC and can shift the day)
const toLocalISODate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const getCurrentStreak = (activityDates) => {
  const activeDays = new Set(activityDates.map(toLocalISODate).filter(Boolean));
  if (activeDays.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();

  if (!activeDays.has(toLocalISODate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (activeDays.has(toLocalISODate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

const isSameMonth = (date, ref) => {
  if (!date) return false;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return false;
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
};

// Workouts now support a real, user-entered caloriesBurned field. For
// workouts logged before that field existed (or left blank), fall back to
// a rough volume-based estimate so old history doesn't just show 0:
//   calories ≈ total volume lifted (kg) × VOLUME_TO_KCAL
// where volume = sets × reps × weight, summed across all exercises.
// The constant is a rule-of-thumb, not a medical/scientific figure.
const VOLUME_TO_KCAL = 0.1;
const LBS_TO_KG = 0.453592;

const estimateCaloriesForWorkout = (workout) => {
  let volumeKg = 0;

  (workout.exercises || []).forEach((ex) => {
    const sets = Number(ex.sets) || 0;
    const reps = Number(ex.reps) || 0;
    let weight = Number(ex.weight) || 0;

    if (ex.weightUnit === 'lbs') {
      weight = weight * LBS_TO_KG;
    }

    volumeKg += sets * reps * weight;
  });

  return Math.round(volumeKg * VOLUME_TO_KCAL);
};

const caloriesForWorkout = (workout) =>
  workout.caloriesBurned != null && workout.caloriesBurned !== ''
    ? Number(workout.caloriesBurned)
    : estimateCaloriesForWorkout(workout);

const sumCaloriesForWorkouts = (workoutList) =>
  workoutList.reduce((sum, w) => sum + caloriesForWorkout(w), 0);

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { workouts } = useSelector((state) => state.workout);
  const { progressEntries } = useSelector((state) => state.progress);
  const { meals } = useSelector((state) => state.nutrition);
  const dispatch = useDispatch();
  const { system, weightUnit: preferredWeightUnit } = useUnits();

  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      dispatch(fetchWorkouts()),
      dispatch(fetchProgress()),
      dispatch(fetchNutrition()),
    ]).finally(() => setInitialLoad(false));
  }, [dispatch]);

  const now = new Date();
  const lastMonthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // ---- Total workouts this month, with trend vs last month ----
  const { workoutsThisMonth, workoutsTrend } = useMemo(() => {
    const list = workouts || [];
    const thisMonthCount = list.filter((w) => isSameMonth(w.date || w.createdAt, now)).length;
    const lastMonthCount = list.filter((w) => isSameMonth(w.date || w.createdAt, lastMonthRef)).length;
    const delta = thisMonthCount - lastMonthCount;

    return {
      workoutsThisMonth: thisMonthCount,
      workoutsTrend:
        thisMonthCount === 0 && lastMonthCount === 0 ? null : `${delta >= 0 ? '+' : ''}${delta}`,
    };
  }, [workouts]);

  // ---- Calories burned this month (estimated from volume), with trend vs last month ----
  const { caloriesThisMonth, caloriesTrend } = useMemo(() => {
    const list = workouts || [];
    const thisMonthWorkouts = list.filter((w) => isSameMonth(w.date || w.createdAt, now));
    const lastMonthWorkouts = list.filter((w) => isSameMonth(w.date || w.createdAt, lastMonthRef));

    const thisMonthCalories = sumCaloriesForWorkouts(thisMonthWorkouts);
    const lastMonthCalories = sumCaloriesForWorkouts(lastMonthWorkouts);
    const delta = thisMonthCalories - lastMonthCalories;

    return {
      caloriesThisMonth: thisMonthCalories,
      caloriesTrend:
        thisMonthCalories === 0 && lastMonthCalories === 0
          ? null
          : `${delta >= 0 ? '+' : ''}${delta}`,
    };
  }, [workouts]);

  // ---- Active streak: consecutive days with a workout, meal, or progress entry ----
  const dayStreak = useMemo(() => {
    const allDates = [
      ...(workouts || []).map((w) => w.date || w.createdAt),
      ...(progressEntries || []).map((p) => p.date || p.createdAt),
      ...(meals || []).map((m) => m.date || m.createdAt),
    ];
    return getCurrentStreak(allDates);
  }, [workouts, progressEntries, meals]);

  // ---- Weight progress: change between the two most recent check-ins that have a weight logged ----
  const { weightChange, weightUnit, weighInsLogged } = useMemo(() => {
    const sorted = [...(progressEntries || [])]
      .filter((e) => e.weight != null)
      .sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));

    if (sorted.length < 2) {
      return { weightChange: null, weightUnit: preferredWeightUnit, weighInsLogged: sorted.length };
    }

    const latest = sorted[sorted.length - 1];
    const previous = sorted[sorted.length - 2];

    // Convert both check-ins to the preferred unit first, so kg/lbs entries can be compared
    const change =
      convertWeight(latest.weight, latest.weightUnit, system) -
      convertWeight(previous.weight, previous.weightUnit, system);

    return {
      weightChange: round1(change),
      weightUnit: preferredWeightUnit,
      weighInsLogged: sorted.length,
    };
  }, [progressEntries, system, preferredWeightUnit]);

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-10 w-10 border-4 border-lime-400 border-t-black dark:border-t-white rounded-full" />
      </div>
    );
  }

  return (
    // max-w keeps everything readable on big monitors; padding scales with screen
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6">
      {/* Welcome */}
      <WelcomeCard userName={user?.name || 'User'} />

      {/* Quick stats: 2 columns on phones, 4 from tablet up */}
      <section aria-labelledby="quick-stats-title">
        <h2
          id="quick-stats-title"
          className="text-lg sm:text-xl font-bold text-black dark:text-white mb-3"
        >
          Quick stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total workouts"
            value={workoutsThisMonth}
            unit="this month"
            icon="💪"
            trend={workoutsTrend}
          />
          <StatCard
            title="Calories burned"
            value={caloriesThisMonth.toLocaleString()}
            unit="kcal"
            icon="🔥"
            trend={caloriesTrend}
          />
          <StatCard
            title="Active streak"
            value={dayStreak}
            unit="days"
            icon="🎯"
          />
          {/* Losing weight is a good thing, so a negative trend is shown in green */}
          <StatCard
            title="Weight progress"
            value={weightChange === null ? (weighInsLogged === 0 ? 'No weigh-ins' : 'Need 1 more') : weightChange}
            unit={weightChange === null ? 'with a weight logged' : weightUnit}
            icon="⚖️"
            trend={weightChange === null ? null : `${weightChange >= 0 ? '+' : ''}${weightChange}`}
            trendGood={weightChange !== null && weightChange < 0}
          />
        </div>
      </section>

      {/*
        Content grid
        - below xl: one column  →  Workouts, Nutrition, Progress
        - xl and up: Workouts + Progress on the left (2/3), Nutrition pinned on the right (1/3)
        (xl instead of lg because the desktop sidebar already takes 256px)
      */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
        <div className="min-w-0 xl:col-span-2 xl:col-start-1 xl:row-start-1">
          <RecentWorkouts />
        </div>

        <div className="min-w-0 xl:col-start-3 xl:row-start-1 xl:row-span-2 xl:self-start xl:sticky xl:top-20">
          <NutritionSummary />
        </div>

        <div className="min-w-0 xl:col-span-2 xl:col-start-1 xl:row-start-2">
          <ProgressSummary />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;