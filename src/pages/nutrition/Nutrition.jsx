import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight, Calendar, Filter } from 'lucide-react';
import {
  fetchNutrition,
  fetchDailySummary,
  deleteNutrition,
} from '../../redux/slices/nutritionSlice';
import NutritionSummary from '../../components/nutrition/NutritionSummary';
import MacroChart from '../../components/nutrition/MacroChart';
import CalorieChart from '../../components/nutrition/CalorieChart';
import MealCard from '../../components/nutrition/MealCard';

const toISODate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Nutrition = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { meals, summary, loading, summaryLoading, error } = useSelector(
    (state) => state.nutrition
  );

  const [selectedDate, setSelectedDate] = useState(() => toISODate(new Date()));

  useEffect(() => {
    dispatch(fetchNutrition());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchDailySummary(selectedDate));
  }, [dispatch, selectedDate]);

  const mealsForDay = useMemo(() => {
    return meals.filter((meal) => {
      const mealDate = meal.date || meal.createdAt;
      return mealDate && toISODate(new Date(mealDate)) === selectedDate;
    });
  }, [meals, selectedDate]);

  const weeklyCalories = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(toISODate(d));
    }

    return days.map((day) => {
      const dayMeals = meals.filter((meal) => {
        const mealDate = meal.date || meal.createdAt;
        return mealDate && toISODate(new Date(mealDate)) === day;
      });
      const calories = dayMeals.reduce(
        (total, meal) =>
          total +
          (meal.foods || []).reduce(
            (sum, food) => sum + (Number(food.calories) || 0),
            0
          ),
        0
      );
      return { date: day, calories };
    });
  }, [meals]);

  const shiftDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(toISODate(d));
  };

  const handleDelete = (id) => {
    dispatch(deleteNutrition(id));
  };

  const isToday = selectedDate === toISODate(new Date());

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">Nutrition</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your meals, calories, and macros.
          </p>
        </div>
        <button
          onClick={() => navigate('/nutrition/add')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-300 transition-colors"
        >
          <Plus size={18} />
          Add Meal
        </button>
      </div>

      {/* Date navigator */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => shiftDate(-1)}
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white transition-colors"
            title="Previous day"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2 text-sm font-medium text-black dark:text-white px-2">
            <Calendar size={16} className="text-gray-400 dark:text-gray-500" />
            {new Date(selectedDate).toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </div>

          <button
            onClick={() => shiftDate(1)}
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white transition-colors"
            title="Next day"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {isToday ? (
          <span className="text-xs bg-lime-100 dark:bg-lime-500/20 text-lime-700 dark:text-lime-300 px-2 py-0.5 rounded-full">
            Today
          </span>
        ) : (
          <button
            onClick={() => setSelectedDate(toISODate(new Date()))}
            className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            Jump to today
          </button>
        )}
      </div>

      {/* Separate calendar filter - jump straight to any date */}
      <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3">
        <label
          htmlFor="nutrition-date-filter"
          className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0"
        >
          <Filter size={15} className="text-gray-400 dark:text-gray-500" />
          Filter by date
        </label>
        <input
          id="nutrition-date-filter"
          type="date"
          value={selectedDate}
          onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
          className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
        />
        {!isToday && (
          <button
            onClick={() => setSelectedDate(toISODate(new Date()))}
            className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Summary */}
      <NutritionSummary summary={summary} loading={summaryLoading} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CalorieChart data={weeklyCalories} />
        <MacroChart
          protein={summary?.protein || 0}
          carbs={summary?.carbs || 0}
          fat={summary?.fat || 0}
        />
      </div>

      {/* Meals for the day */}
      <div>
        <h2 className="text-sm font-semibold text-black dark:text-white mb-3">
          Meals ({mealsForDay.length})
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 h-40 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        ) : mealsForDay.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 border-dashed rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 font-medium">No meals logged</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
              Add a meal to start tracking this day.
            </p>
            <button
              onClick={() => navigate('/nutrition/add')}
              className="flex items-center gap-2 px-4 py-2 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-300 transition-colors"
            >
              <Plus size={16} />
              Add Meal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mealsForDay.map((meal) => (
              <MealCard key={meal._id} meal={meal} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Nutrition;