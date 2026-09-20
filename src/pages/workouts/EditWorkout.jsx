import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import {
  fetchWorkout,
  updateWorkout,
  clearWorkoutError,
  clearCurrentWorkout,
} from '../../redux/slices/workoutSlice';
import WorkoutForm from '../../components/workout/WorkoutForm';

const EditWorkout = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentWorkout, loading, updateLoading, error } = useSelector(
    (state) => state.workout
  );

  useEffect(() => {
    dispatch(fetchWorkout(id));
    return () => dispatch(clearCurrentWorkout());
  }, [dispatch, id]);

  const handleSubmit = async (workoutData) => {
    dispatch(clearWorkoutError());
    const result = await dispatch(updateWorkout({ id, workoutData }));

    if (updateWorkout.fulfilled.match(result)) {
      navigate(`/workouts/${id}`);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <Link
        to={`/workouts/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        Back to workout
      </Link>

      <h1 className="text-2xl font-bold text-black dark:text-white mb-1">Edit Workout</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Update your exercises, sets, reps, and weights.
      </p>

      {loading && !currentWorkout ? (
        <div className="flex items-center justify-center py-16 text-gray-400 dark:text-gray-500">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : currentWorkout ? (
        <WorkoutForm
          initialData={currentWorkout}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          loading={updateLoading}
          error={error}
        />
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">Workout not found.</p>
      )}
    </div>
  );
};

export default EditWorkout;