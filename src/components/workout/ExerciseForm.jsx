import React from 'react';
import { Trash2, GripVertical } from 'lucide-react';

const inputClass =
  'w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all';

const ExerciseForm = ({ exercise, index, onChange, onRemove, canRemove }) => {
  const handleField = (field) => (e) => {
    onChange(index, field, e.target.value);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
          <GripVertical size={16} />
          <span className="text-xs font-medium uppercase tracking-wide">
            Exercise {index + 1}
          </span>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Remove exercise"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Exercise name
        </label>
        <input
          type="text"
          value={exercise.name}
          onChange={handleField('name')}
          placeholder="e.g. Barbell Squat"
          className={inputClass}
          required
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Sets <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={exercise.sets}
            onChange={handleField('sets')}
            placeholder="3"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Reps <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={exercise.reps}
            onChange={handleField('reps')}
            placeholder="10"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Weight
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={exercise.weight}
            onChange={handleField('weight')}
            placeholder="40"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Unit
          </label>
          <select
            value={exercise.weightUnit}
            onChange={handleField('weightUnit')}
            className={inputClass}
          >
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Notes
        </label>
        <input
          type="text"
          value={exercise.notes}
          onChange={handleField('notes')}
          placeholder="Optional notes, form cues, tempo..."
          className={inputClass}
        />
      </div>
    </div>
  );
};

export default ExerciseForm;