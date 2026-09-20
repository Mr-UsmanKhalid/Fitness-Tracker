import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Loader2 } from 'lucide-react';
import {
  fetchWorkout,
  deleteWorkout,
  clearCurrentWorkout,
} from '../../redux/slices/workoutSlice';
import WorkoutDetailsView from '../../components/workout/WorkoutDetails';

const WorkoutDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentWorkout, loading, deleteLoading, error } = useSelector(
    (state) => state.workout
  );

  useEffect(() => {
    dispatch(fetchWorkout(id));
    return () => dispatch(clearCurrentWorkout());
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${currentWorkout?.name}"? This can't be undone.`)) {
      return;
    }
    const result = await dispatch(deleteWorkout(id));
    if (deleteWorkout.fulfilled.match(result)) {
      navigate('/workouts');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <Link
        to="/workouts"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        Back to workouts
      </Link>

      {loading && !currentWorkout && (
        <div className="flex items-center justify-center py-16 text-gray-400 dark:text-gray-500">
          <Loader2 size={24} className="animate-spin" />
        </div>
      )}

      {error && !currentWorkout && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {currentWorkout && (
        <>
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={() => navigate(`/workouts/${id}/edit`)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-black dark:text-white text-sm font-medium rounded-lg hover:border-lime-400 dark:hover:border-lime-500 transition-colors"
            >
              <Edit2 size={15} />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:border-red-400 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-60 transition-colors"
            >
              {deleteLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Trash2 size={15} />
              )}
              Delete
            </button>
          </div>

          <WorkoutDetailsView workout={currentWorkout} />
        </>
      )}
    </div>
  );
};

export default WorkoutDetailsPage;