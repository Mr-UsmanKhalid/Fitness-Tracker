import React, { useMemo } from 'react';
import { Flame, Utensils, TrendingUp } from 'lucide-react';
import MacroChart from '../nutrition/MacroChart';
import CaloriesTrendChart from './CaloriesTrendChart';

const toISODate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const NutritionAnalytics = ({ meals = [] }) => {
  const stats = useMemo(() => {
    const last7 = new Set();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7.add(toISODate(d));
    }

    const recentMeals = meals.filter((m) =>
      last7.has(toISODate(m.date || m.createdAt))
    );

    const totals = recentMeals.reduce(
      (acc, meal) => {
        (meal.foods || []).forEach((food) => {
          acc.calories += Number(food.calories) || 0;
          acc.protein += Number(food.protein) || 0;
          acc.carbs += Number(food.carbs) || 0;
          acc.fat += Number(food.fat) || 0;
        });
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const daysWithData = new Set(
      recentMeals.map((m) => toISODate(m.date || m.createdAt))
    ).size;
    const divisor = Math.max(daysWithData, 1);

    return {
      avgCalories: Math.round(totals.calories / divisor),
      avgProtein: Math.round(totals.protein / divisor),
      avgCarbs: Math.round(totals.carbs / divisor),
      avgFat: Math.round(totals.fat / divisor),
      totalMeals: meals.length,
      recentMealCount: recentMeals.length,
    };
  }, [meals]);

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Flame size={16} className="text-orange-400" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Avg calories/day
            </span>
          </div>
          <p className="text-2xl font-bold text-black dark:text-white mt-2">
            {stats.avgCalories}
            <span className="text-sm font-normal text-gray-400 dark:text-gray-500 ml-1">
              kcal
            </span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">last 7 days</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Utensils size={16} className="text-blue-400" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Meals this week
            </span>
          </div>
          <p className="text-2xl font-bold text-black dark:text-white mt-2">
            {stats.recentMealCount}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <TrendingUp size={16} className="text-lime-500" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Total logged
            </span>
          </div>
          <p className="text-2xl font-bold text-black dark:text-white mt-2">
            {stats.totalMeals}
            <span className="text-sm font-normal text-gray-400 dark:text-gray-500 ml-1">
              meals
            </span>
          </p>
        </div>
      </div>

      {/* Macro breakdown + calorie trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MacroChart
          protein={stats.avgProtein}
          carbs={stats.avgCarbs}
          fat={stats.avgFat}
        />
        <CaloriesTrendChart meals={meals} />
      </div>
    </div>
  );
};

export default NutritionAnalytics;