import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Calendar, Tag, Edit2, Trash2, ChevronRight } from 'lucide-react';

const CATEGORY_STYLES = {
  strength: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  cardio: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  hypertrophy: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  powerlifting: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  calisthenics: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  mobility: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  flexibility: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const WorkoutCard = ({ workout, onDelete }) => {
  const navigate = useNavigate();

  const categoryClass =
    CATEGORY_STYLES[workout.category?.toLowerCase()] || CATEGORY_STYLES.other;

  const exerciseCount = workout.exercises?.length || 0;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${workout.name}"? This can't be undone.`)) {
      onDelete(workout._id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/workouts/${workout._id}/edit`);
  };

  return (
    <div
      onClick={() => navigate(`/workouts/${workout._id}`)}
      className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 hover:border-lime-400 dark:hover:border-lime-500 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-black dark:text-white truncate group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
            {workout.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
            <Calendar size={13} />
            <span>{formatDate(workout.date || workout.createdAt)}</span>
          </div>
        </div>

        <span
          className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${categoryClass}`}
        >
          {workout.category || 'other'}
        </span>
      </div>

      {/* Exercises summary */}
      <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
        <Dumbbell size={15} className="text-gray-400 dark:text-gray-500" />
        <span>
          {exerciseCount} exercise{exerciseCount === 1 ? '' : 's'}
        </span>
        {workout.caloriesBurned != null && (
          <>
            <span className="text-gray-300 dark:text-gray-700">·</span>
            <span>{workout.caloriesBurned} kcal</span>
          </>
        )}
      </div>

      {/* Tags */}
      {workout.tags?.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Tag size={13} className="text-gray-400 dark:text-gray-500" />
          {workout.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
          {workout.tags.length > 3 && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              +{workout.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 mt-1">
        <div className="flex items-center gap-1">
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white transition-colors"
            title="Edit workout"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete workout"
          >
            <Trash2 size={15} />
          </button>
        </div>
        <ChevronRight
          size={16}
          className="text-gray-300 dark:text-gray-600 group-hover:text-lime-500 dark:group-hover:text-lime-400 transition-colors"
        />
      </div>
    </div>
  );
};

export default WorkoutCard;