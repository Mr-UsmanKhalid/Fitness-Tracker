import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import { fetchDailySummary, fetchNutrition } from '../../redux/slices/nutritionSlice';
// ^ adjust the import path to match where your nutritionSlice.js actually lives

// Local-time YYYY-MM-DD (toISOString() is UTC and can be off by a day)
const toLocalISODate = (date) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Defined outside the component so it isn't re-created on every render
const MacroBar = ({ label, consumed, goal }) => {
  const percentage = goal ? Math.min((consumed / goal) * 100, 100) : 0;
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</p>
        <p className="text-xs sm:text-sm font-bold text-black dark:text-white">
          {consumed}g <span className="font-normal text-gray-500 dark:text-gray-400">/ {goal}g</span>
        </p>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-lime-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const NutritionSummary = ({
  calorieGoal = 2500,
  proteinGoal = 150,
  carbsGoal = 250,
  fatGoal = 80,
}) => {
  const dispatch = useDispatch();
  const { summary, summaryLoading, meals, loading, error } = useSelector(
    (state) => state.nutrition
  );

  const todayISO = toLocalISODate(new Date());

  useEffect(() => {
    dispatch(fetchDailySummary());
    dispatch(fetchNutrition({ date: new Date().toISOString().split('T')[0] }));
  }, [dispatch]);

  const caloriesConsumed = summary?.calories || 0;
  const caloriePercentage = calorieGoal ? (caloriesConsumed / calorieGoal) * 100 : 0;
  const caloriesLeft = Math.max(calorieGoal - caloriesConsumed, 0);

  const todaysMeals = (meals || []).filter(
    (m) => toLocalISODate(m.date || m.createdAt) === todayISO
  );

  const mealTypeTotals = todaysMeals.reduce((acc, meal) => {
    const type = meal.mealType || 'Other';
    const mealCalories = (meal.foods || []).reduce(
      (sum, f) => sum + (Number(f.calories) || 0),
      0
    );
    acc[type] = (acc[type] || 0) + mealCalories;
    return acc;
  }, {});

  if (summaryLoading && loading) {
    return (
      <div className="bg-white dark:bg-gray-900 border-2 border-lime-400 dark:border-lime-500 rounded-xl shadow-md dark:shadow-none overflow-hidden flex items-center justify-center p-10">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading nutrition data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border-2 border-lime-400 dark:border-lime-500 rounded-xl shadow-md dark:shadow-none overflow-hidden">
      {/* Header */}
      <div className="bg-black px-4 sm:px-5 py-3 sm:py-4 flex justify-between items-center">
        <h3 className="text-base sm:text-lg font-bold text-lime-400">🍽️ Nutrition</h3>
        <Link
          to="/nutrition/add"
          className="text-lime-400 hover:text-lime-300 transition-colors p-1"
          title="Add meal"
          aria-label="Add meal"
        >
          <Plus size={20} />
        </Link>
      </div>

      <div className="p-4 sm:p-5">
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

        {/* Tablet: ring and macros side by side. Phone and wide sidebar: stacked. */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-5 md:gap-8 xl:gap-5">
          {/* Calories ring */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90" aria-hidden="true">
                <circle cx="50" cy="50" r="42" fill="none" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="9" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  strokeWidth="9"
                  strokeLinecap="round"
                  pathLength="100"
                  strokeDasharray={`${Math.min(caloriePercentage, 100)} 100`}
                  className="stroke-lime-500 dark:stroke-lime-400 transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl sm:text-2xl font-bold text-black dark:text-white leading-none">
                  {Math.round(caloriePercentage)}%
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">of goal</p>
              </div>
            </div>

            <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-3">
              <span className="font-bold text-black dark:text-white">{caloriesConsumed}</span> / {calorieGoal} kcal
            </p>

            <div className="mt-3 w-full max-w-xs rounded-lg bg-lime-50 dark:bg-lime-400/10 border border-lime-200 dark:border-lime-500/30 px-4 py-2.5 flex items-baseline justify-between">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Remaining today</p>
              <p className="text-lg sm:text-xl font-bold text-lime-700 dark:text-lime-400">
                {caloriesLeft} <span className="text-xs font-medium text-gray-500 dark:text-gray-400">kcal</span>
              </p>
            </div>
          </div>

          {/* Macros */}
          <div className="self-center">
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Macros</p>
            <div className="space-y-4">
              <MacroBar label="Protein" consumed={summary?.protein || 0} goal={proteinGoal} />
              <MacroBar label="Carbs" consumed={summary?.carbs || 0} goal={carbsGoal} />
              <MacroBar label="Fats" consumed={summary?.fat || 0} goal={fatGoal} />
            </div>
          </div>

          {/* Today's meals */}
          <div className="md:col-span-2 xl:col-span-1">
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Today's meals</p>
            {todaysMeals.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500">No meals logged yet today.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
                {Object.entries(mealTypeTotals).map(([type, kcal]) => (
                  <div
                    key={type}
                    className="flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-800/60 rounded-lg text-xs sm:text-sm"
                  >
                    <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{type}</span>
                    <span className="font-bold text-black dark:text-white">{Math.round(kcal)} kcal</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-950 px-4 sm:px-5 py-3 border-t border-gray-200 dark:border-gray-800">
        <Link
          to="/nutrition"
          className="text-lime-700 dark:text-lime-400 font-semibold text-xs sm:text-sm hover:text-lime-600 dark:hover:text-lime-300 transition-colors flex items-center justify-center gap-1"
        >
          View detailed nutrition <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default NutritionSummary;