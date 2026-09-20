import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dumbbell, Apple, TrendingUp } from 'lucide-react';
import { fetchWorkouts } from '../redux/slices/workoutSlice';
import { fetchNutrition } from '../redux/slices/nutritionSlice';
import { fetchProgress } from '../redux/slices/progressSlice';
import WorkoutAnalytics from '../components/analytics/WorkoutAnalytics';
import NutritionAnalytics from '../components/analytics/NutritionAnalytics';
import ProgressAnalytics from '../components/analytics/ProgressAnalytics';

const TABS = [
  { key: 'workout', label: 'Workouts', icon: Dumbbell },
  { key: 'nutrition', label: 'Nutrition', icon: Apple },
  { key: 'progress', label: 'Progress', icon: TrendingUp },
];

const Analytics = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('workout');

  const { workouts } = useSelector((state) => state.workout);
  const { meals } = useSelector((state) => state.nutrition);
  const { progressEntries } = useSelector((state) => state.progress);

  useEffect(() => {
    dispatch(fetchWorkouts());
    dispatch(fetchNutrition());
    dispatch(fetchProgress());
  }, [dispatch]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Trends and insights across your workouts, nutrition, and progress.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 pb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full border transition-colors ${
                active
                  ? 'bg-black text-white border-black dark:bg-lime-400 dark:text-black dark:border-lime-400'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-black hover:text-black dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:border-lime-400 dark:hover:text-lime-400'
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active tab content */}
      {activeTab === 'workout' && <WorkoutAnalytics workouts={workouts || []} />}
      {activeTab === 'nutrition' && <NutritionAnalytics meals={meals || []} />}
      {activeTab === 'progress' && (
        <ProgressAnalytics entries={progressEntries || []} />
      )}
    </div>
  );
};

export default Analytics;