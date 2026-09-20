import React from 'react';
import { Dumbbell } from 'lucide-react';

const ExerciseList = ({ exercises }) => {
  if (!exercises || exercises.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 dark:text-gray-500">
        <Dumbbell size={28} className="mx-auto mb-2" />
        <p className="text-sm">No exercises added to this workout yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {exercises.map((exercise, index) => (
        <div
          key={exercise._id || index}
          className="flex items-start gap-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-lg p-4"
        >
          <div className="w-8 h-8 rounded-full bg-lime-400 text-black font-bold text-sm flex items-center justify-center shrink-0">
            {index + 1}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-black dark:text-white truncate">{exercise.name}</p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-600 dark:text-gray-400">
              {exercise.sets !== '' && exercise.sets != null && (
                <span>
                  <span className="font-semibold text-black dark:text-white">
                    {exercise.sets}
                  </span>{' '}
                  sets
                </span>
              )}
              {exercise.reps !== '' && exercise.reps != null && (
                <span>
                  <span className="font-semibold text-black dark:text-white">
                    {exercise.reps}
                  </span>{' '}
                  reps
                </span>
              )}
              {exercise.weight !== '' && exercise.weight != null && (
                <span>
                  <span className="font-semibold text-black dark:text-white">
                    {exercise.weight}
                  </span>{' '}
                  kg
                </span>
              )}
            </div>

            {exercise.notes && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                {exercise.notes}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExerciseList;