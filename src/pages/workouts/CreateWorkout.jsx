import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createWorkout, clearWorkoutError } from '../../redux/slices/workoutSlice';
import WorkoutForm from '../../components/workout/WorkoutForm';

const CreateWorkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createLoading, error } = useSelector((state) => state.workout);

  const handleSubmit = async (workoutData) => {
    dispatch(clearWorkoutError());
    const result = await dispatch(createWorkout(workoutData));

    if (createWorkout.fulfilled.match(result)) {
      const newWorkout = result.payload?.workout;
      navigate(newWorkout ? `/workouts/${newWorkout._id}` : '/workouts');
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

      <h1 className="text-2xl font-bold text-black dark:text-white mb-1">New Workout</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Log your exercises, sets, reps, and weights.
      </p>

      <WorkoutForm
        onSubmit={handleSubmit}
        submitLabel="Create Workout"
        loading={createLoading}
        error={error}
      />
    </div>
  );
};

export default CreateWorkout;