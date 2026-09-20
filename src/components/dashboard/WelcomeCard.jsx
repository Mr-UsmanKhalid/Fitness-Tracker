import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkouts } from '../../redux/slices/workoutSlice';
import { fetchProgress } from '../../redux/slices/progressSlice';
import { fetchNutrition } from '../../redux/slices/nutritionSlice';

// Local-time YYYY-MM-DD. (toISOString() uses UTC, which shifts the day for
// users ahead of UTC and breaks the streak calculation around midnight.)
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

const WelcomeCard = ({ userName }) => {
  const dispatch = useDispatch();
  const { workouts } = useSelector((state) => state.workout);
  const { progressEntries } = useSelector((state) => state.progress);
  const { meals } = useSelector((state) => state.nutrition);

  useEffect(() => {
    dispatch(fetchWorkouts());
    dispatch(fetchProgress());
    dispatch(fetchNutrition());
  }, [dispatch]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good morning';
    if (hour < 18) return '🌤️ Good afternoon';
    return '🌙 Good evening';
  };

  // First name only: shorter, friendlier, and never wraps awkwardly on phones
  const displayName = userName?.trim().split(' ')[0] || 'there';

  const workoutsThisWeek = useMemo(() => {
    const last7 = new Set();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7.add(toLocalISODate(d));
    }
    return (workouts || []).filter((w) => {
      const iso = toLocalISODate(w.date);
      return iso && last7.has(iso);
    }).length;
  }, [workouts]);

  const dayStreak = useMemo(() => {
    const allDates = [
      ...(workouts || []).map((w) => w.date),
      ...(progressEntries || []).map((p) => p.date || p.createdAt),
      ...(meals || []).map((m) => m.date || m.createdAt),
    ];
    return getCurrentStreak(allDates);
  }, [workouts, progressEntries, meals]);

  return (
    <section className="relative overflow-hidden rounded-xl bg-black text-white shadow-md">
      {/* Lime accent kept to the right edge so text and buttons always sit on black (good contrast) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-2/3 sm:w-1/2 bg-gradient-to-l from-lime-400/30 via-lime-400/10 to-transparent"
      />

      <div className="relative px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          {/* Greeting + actions */}
          <div className="min-w-0">
            <p className="text-lime-400 text-xs sm:text-sm font-medium">{getGreeting()}</p>
            <h1 className="mt-1 text-xl sm:text-2xl lg:text-3xl font-bold leading-tight break-words">
              Welcome back, <span className="text-lime-400">{displayName}!</span>
            </h1>
            <p className="mt-1 text-sm text-gray-300">
              Let's keep crushing your fitness goals today! 💪
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:flex">
              <Link
                to="/workouts/create"
                className="rounded-lg bg-lime-400 px-4 py-2.5 text-center text-sm font-semibold text-black transition-colors hover:bg-lime-300"
              >
                + New Workout
              </Link>
              <Link
                to="/nutrition/add"
                className="rounded-lg bg-white px-4 py-2.5 text-center text-sm font-semibold text-black transition-colors hover:bg-gray-100"
              >
                + Log Meal
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 lg:w-80 lg:flex-shrink-0">
            <div className="rounded-lg bg-white/10 border border-white/10 px-3 py-3 text-center">
              <p className="text-2xl font-bold text-lime-400 leading-none">{workoutsThisWeek}</p>
              <p className="mt-1.5 text-xs text-gray-300">Workouts this week</p>
            </div>
            <div className="rounded-lg bg-white/10 border border-white/10 px-3 py-3 text-center">
              <p className="text-2xl font-bold text-lime-400 leading-none">{dayStreak}</p>
              <p className="mt-1.5 text-xs text-gray-300">Day streak 🔥</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeCard;