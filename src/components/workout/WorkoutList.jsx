import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Plus, AlertCircle } from 'lucide-react';
import WorkoutCard from './WorkoutCard';

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 space-y-3 animate-pulse">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
  </div>
);

const WorkoutList = ({ workouts, loading, error, onDelete, hasFilters }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
        <AlertCircle size={32} className="text-red-400 mb-3" />
        <p className="text-gray-700 dark:text-gray-300 font-medium">Couldn't load workouts</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{error}</p>
      </div>
    );
  }

  if (!workouts || workouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 border-dashed rounded-lg">
        <Dumbbell size={32} className="text-gray-300 dark:text-gray-700 mb-3" />
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          {hasFilters ? 'No workouts match your filters' : 'No workouts yet'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
          {hasFilters
            ? 'Try adjusting your search or filters.'
            : 'Create your first workout routine to get started.'}
        </p>
        {!hasFilters && (
          <button
            onClick={() => navigate('/workouts/create')}
            className="flex items-center gap-2 px-4 py-2 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-300 transition-colors"
          >
            <Plus size={16} />
            New Workout
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {workouts.map((workout) => (
        <WorkoutCard key={workout._id} workout={workout} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default WorkoutList;