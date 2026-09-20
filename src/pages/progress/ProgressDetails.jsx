import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Loader2,
  Scale,
  Calendar,
  StickyNote,
  TrendingUp,
} from 'lucide-react';
import {
  fetchProgressEntry,
  updateProgress,
  deleteProgress,
  clearProgressError,
  clearCurrentProgress,
} from '../../redux/slices/progressSlice';
import ProgressForm from '../../components/progress/ProgressForm';

const PERFORMANCE_FIELDS = [
  { key: 'benchPress', label: 'Bench Press', unit: 'kg' },
  { key: 'squat', label: 'Squat', unit: 'kg' },
  { key: 'deadlift', label: 'Deadlift', unit: 'kg' },
  { key: 'runningDistance', label: 'Running Distance', unit: 'km' },
  { key: 'runningTime', label: 'Running Time', unit: 'min' },
];

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const ProgressDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProgress, loading, updateLoading, deleteLoading, error } =
    useSelector((state) => state.progress);

  const [isEditing, setIsEditing] = useState(Boolean(location.state?.edit));

  useEffect(() => {
    dispatch(fetchProgressEntry(id));
    return () => dispatch(clearCurrentProgress());
  }, [dispatch, id]);

  const handleUpdate = async (progressData) => {
    dispatch(clearProgressError());
    const result = await dispatch(updateProgress({ id, progressData }));
    if (updateProgress.fulfilled.match(result)) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this progress entry? This can't be undone.")) {
      return;
    }
    const result = await dispatch(deleteProgress(id));
    if (deleteProgress.fulfilled.match(result)) {
      navigate('/progress');
    }
  };

  const measurementEntries = Object.entries(currentProgress?.measurements || {}).filter(
    ([, value]) => value !== null && value !== undefined && value !== ''
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <Link
        to="/progress"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        Back to progress
      </Link>

      {loading && !currentProgress && (
        <div className="flex items-center justify-center py-16 text-gray-400 dark:text-gray-500">
          <Loader2 size={24} className="animate-spin" />
        </div>
      )}

      {error && !currentProgress && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {currentProgress && isEditing && (
        <>
          <h1 className="text-2xl font-bold text-black dark:text-white mb-1">Edit Entry</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Update this check-in's weight, measurements, or PRs.
          </p>
          <ProgressForm
            initialData={currentProgress}
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
            loading={updateLoading}
            error={error}
          />
          <button
            onClick={() => setIsEditing(false)}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white mt-3 transition-colors"
          >
            Cancel editing
          </button>
        </>
      )}

      {currentProgress && !isEditing && (
        <div className="space-y-6">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(true)}
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

          {/* Header */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <Calendar size={14} />
              <span>{formatDate(currentProgress.date || currentProgress.createdAt)}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-lime-100 dark:bg-lime-500/20 text-lime-700 dark:text-lime-300 flex items-center justify-center shrink-0">
                <Scale size={20} />
              </div>
              <div>
                <p className="text-3xl font-bold text-black dark:text-white">
                  {currentProgress.weight ?? '—'}
                  <span className="text-base font-normal text-gray-400 dark:text-gray-500 ml-1">
                    {currentProgress.weightUnit || 'kg'}
                  </span>
                </p>
              </div>
            </div>

            {currentProgress.notes && (
              <div className="flex items-start gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
                <StickyNote size={15} className="text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" />
                <p>{currentProgress.notes}</p>
              </div>
            )}
          </div>

          {/* Measurements */}
          {measurementEntries.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-black dark:text-white mb-3">
                Measurements
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {measurementEntries.map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 text-center"
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key}</p>
                    <p className="text-lg font-bold text-black dark:text-white mt-1">
                      {value}
                      <span className="text-xs font-normal text-gray-400 dark:text-gray-500 ml-0.5">
                        {currentProgress.measurementUnit || 'cm'}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance */}
          {currentProgress.performance &&
            Object.values(currentProgress.performance).some(
              (v) => v !== null && v !== undefined
            ) && (
              <div>
                <h2 className="text-sm font-semibold text-black dark:text-white mb-3 flex items-center gap-1.5">
                  <TrendingUp size={15} className="text-gray-400 dark:text-gray-500" />
                  Performance
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PERFORMANCE_FIELDS.filter(
                    (field) =>
                      currentProgress.performance[field.key] !== null &&
                      currentProgress.performance[field.key] !== undefined
                  ).map((field) => (
                    <div
                      key={field.key}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 text-center"
                    >
                      <p className="text-xs text-gray-500 dark:text-gray-400">{field.label}</p>
                      <p className="text-lg font-bold text-black dark:text-white mt-1">
                        {currentProgress.performance[field.key]}
                        <span className="text-xs font-normal text-gray-400 dark:text-gray-500 ml-0.5">
                          {field.unit}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default ProgressDetails;