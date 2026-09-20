import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  createProgress,
  clearProgressError,
} from '../../redux/slices/progressSlice';
import ProgressForm from '../../components/progress/ProgressForm';

const AddProgress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createLoading, error } = useSelector((state) => state.progress);

  const handleSubmit = async (progressData) => {
    dispatch(clearProgressError());
    const result = await dispatch(createProgress(progressData));

    if (createProgress.fulfilled.match(result)) {
      const newEntry = result.payload;
      navigate(newEntry ? `/progress/${newEntry._id}` : '/progress');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <Link
        to="/progress"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        Back to progress
      </Link>

      <h1 className="text-2xl font-bold text-black dark:text-white mb-1">Log Progress</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Record your weight, measurements, or a new personal record.
      </p>

      <ProgressForm
        onSubmit={handleSubmit}
        submitLabel="Log Progress"
        loading={createLoading}
        error={error}
      />
    </div>
  );
};

export default AddProgress;