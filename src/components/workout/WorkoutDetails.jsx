import React from 'react';
import { Calendar, Tag, StickyNote } from 'lucide-react';
import ExerciseList from './ExerciseList';

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
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const WorkoutDetails = ({ workout }) => {
  if (!workout) return null;

  const categoryClass =
    CATEGORY_STYLES[workout.category?.toLowerCase()] || CATEGORY_STYLES.other;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">{workout.name}</h1>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-2">
              <Calendar size={15} />
              <span>{formatDate(workout.date || workout.createdAt)}</span>
              {workout.caloriesBurned != null && (
                <>
                  <span className="text-gray-300 dark:text-gray-700">·</span>
                  <span>{workout.caloriesBurned} kcal burned</span>
                </>
              )}
            </div>
          </div>
          <span
            className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize ${categoryClass}`}
          >
            {workout.category || 'other'}
          </span>
        </div>

        {workout.tags?.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Tag size={14} className="text-gray-400 dark:text-gray-500" />
            {workout.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {workout.notes && (
          <div className="flex items-start gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
            <StickyNote size={15} className="text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" />
            <p>{workout.notes}</p>
          </div>
        )}
      </div>

      {/* Exercises */}
      <div>
        <h2 className="text-sm font-semibold text-black dark:text-white mb-3">
          Exercises ({workout.exercises?.length || 0})
        </h2>
        <ExerciseList exercises={workout.exercises} />
      </div>
    </div>
  );
};

export default WorkoutDetails;