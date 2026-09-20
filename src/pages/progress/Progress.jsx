import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
  fetchProgress,
  deleteProgress,
} from '../../redux/slices/progressSlice';
import WeightChart from '../../components/progress/WeightChart';
import MeasurementChart from '../../components/progress/MeasurementChart';
import PerformanceChart from '../../components/progress/PerformanceChart';
import MeasurementCard from '../../components/progress/MeasurementCard';
import GoalWeightCard from '../../components/progress/GoalWeightCard';

const Progress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { progressEntries, loading, error } = useSelector(
    (state) => state.progress
  );

  useEffect(() => {
    dispatch(fetchProgress());
  }, [dispatch]);

  const entries = progressEntries || [];

  const sortedDesc = [...entries].sort(
    (a, b) =>
      new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
  );

  const handleDelete = (id) => {
    dispatch(deleteProgress(id));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">Progress</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your weight, measurements, and strength over time.
          </p>
        </div>
        <button
          onClick={() => navigate('/progress/add')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-300 transition-colors"
        >
          <Plus size={18} />
          Log Progress
        </button>
      </div>

      {/* Weight goal */}
      <GoalWeightCard />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WeightChart entries={entries} />
        <MeasurementChart entries={entries} />
      </div>
      <PerformanceChart entries={entries} />

      {/* Entries list */}
      <div>
        <h2 className="text-sm font-semibold text-black dark:text-white mb-3">
          Check-ins ({entries.length})
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
        ) : sortedDesc.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 border-dashed rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 font-medium">No check-ins yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
              Log your first weigh-in or measurement to start tracking.
            </p>
            <button
              onClick={() => navigate('/progress/add')}
              className="flex items-center gap-2 px-4 py-2 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-300 transition-colors"
            >
              <Plus size={16} />
              Log Progress
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedDesc.map((entry, index) => (
              <MeasurementCard
                key={entry._id}
                entry={entry}
                previousEntry={sortedDesc[index + 1]}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;