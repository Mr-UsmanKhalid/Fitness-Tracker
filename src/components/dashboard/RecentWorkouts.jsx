import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ChevronRight, Trash2, Edit2, Dumbbell } from 'lucide-react';
import { fetchWorkouts, deleteWorkout } from '../../redux/slices/workoutSlice';

const formatDateTime = (isoDate) => {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return '';
  const date = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return `${date} at ${time}`;
};

const getCategoryColor = (category) => {
  switch (String(category || '').toLowerCase()) {
    case 'strength':
      return 'bg-lime-100 text-lime-800 border border-lime-400 dark:bg-lime-400/15 dark:text-lime-300 dark:border-lime-500/50';
    case 'cardio':
      return 'bg-blue-100 text-blue-800 border border-blue-400 dark:bg-blue-400/15 dark:text-blue-300 dark:border-blue-500/50';
    case 'flexibility':
      return 'bg-purple-100 text-purple-800 border border-purple-400 dark:bg-purple-400/15 dark:text-purple-300 dark:border-purple-500/50';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
  }
};

const getIntensityColor = (intensity) => {
  switch (String(intensity || '').toLowerCase()) {
    case 'high':
      return 'text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-400/15';
    case 'medium':
      return 'text-yellow-700 bg-yellow-50 dark:text-yellow-300 dark:bg-yellow-400/15';
    case 'low':
      return 'text-green-600 bg-green-50 dark:text-green-300 dark:bg-green-400/15';
    default:
      return 'text-gray-600 bg-gray-50 dark:text-gray-300 dark:bg-gray-800';
  }
};

const RecentWorkouts = () => {
  const dispatch = useDispatch();
  const { workouts, loading, error, deleteLoading } = useSelector((state) => state.workout);

  useEffect(() => {
    dispatch(fetchWorkouts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this workout? This cannot be undone.')) {
      dispatch(deleteWorkout(id));
    }
  };

  // Latest 3 workouts, newest first
  const recentWorkouts = [...(workouts || [])]
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
    .slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-900 border-2 border-lime-400 dark:border-lime-500 rounded-xl shadow-md dark:shadow-none overflow-hidden">
      {/* Header */}
      <div className="bg-black px-4 sm:px-5 py-3 sm:py-4 flex justify-between items-center gap-3">
        <h3 className="text-base sm:text-lg font-bold text-lime-400 truncate">📋 Recent workouts</h3>
        <Link
          to="/workouts"
          className="text-lime-400 text-xs sm:text-sm font-semibold hover:text-lime-300 transition-colors flex items-center gap-1 flex-shrink-0"
        >
          View all <ChevronRight size={16} />
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="px-4 py-10 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading workouts...</p>
        </div>
      ) : error ? (
        <div className="px-4 py-10 text-center">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      ) : recentWorkouts.length > 0 ? (
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {recentWorkouts.map((workout) => {
            const when = formatDateTime(workout.date || workout.createdAt);
            const exerciseCount = Array.isArray(workout.exercises)
              ? workout.exercises.length
              : Number(workout.exercises) || 0;

            return (
              <li
                key={workout._id}
                className="px-4 sm:px-5 py-4 border-l-4 border-transparent hover:border-lime-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors duration-200"
              >
                {/* Title + actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-bold text-black dark:text-white text-sm sm:text-base truncate">
                      {workout.name}
                    </h4>
                    {when && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{when}</p>}
                  </div>

                  <div className="flex gap-1 flex-shrink-0 -mr-1.5">
                    <Link
                      to={`/workouts/${workout._id}/edit`}
                      aria-label={`Edit ${workout.name}`}
                      className="p-2 hover:bg-lime-100 dark:hover:bg-lime-400/15 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} className="text-lime-600 dark:text-lime-400" />
                    </Link>
                    <button
                      onClick={() => handleDelete(workout._id)}
                      disabled={deleteLoading}
                      aria-label={`Delete ${workout.name}`}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-400/15 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Badges + exercise count */}
                <div className="flex items-center gap-2 flex-wrap mt-2.5">
                  {workout.category && (
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${getCategoryColor(workout.category)}`}>
                      {workout.category}
                    </span>
                  )}
                  {workout.intensity && (
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${getIntensityColor(workout.intensity)}`}>
                      {workout.intensity}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full px-2.5 py-0.5">
                    <Dumbbell size={12} className="text-gray-500 dark:text-gray-400" />
                    {exerciseCount} {exerciseCount === 1 ? 'exercise' : 'exercises'}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="px-4 py-10 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">No workouts yet</p>
          <Link
            to="/workouts/create"
            className="inline-block px-4 py-2 bg-lime-400 text-black text-sm font-semibold rounded-lg hover:bg-lime-300 transition-colors"
          >
            Start your first workout
          </Link>
        </div>
      )}

      {/* Footer */}
      {recentWorkouts.length > 0 && !loading && (
        <div className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 px-4 sm:px-5 py-3 flex justify-between items-center gap-3">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Showing latest {recentWorkouts.length} workout{recentWorkouts.length !== 1 ? 's' : ''}
          </p>
          <Link
            to="/workouts"
            className="text-lime-700 dark:text-lime-400 font-semibold text-xs sm:text-sm hover:text-lime-600 dark:hover:text-lime-300 transition-colors whitespace-nowrap"
          >
            View all workouts
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentWorkouts;