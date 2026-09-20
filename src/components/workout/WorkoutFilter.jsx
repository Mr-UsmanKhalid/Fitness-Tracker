import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  'all',
  'strength',
  'cardio',
  'hypertrophy',
  'powerlifting',
  'calisthenics',
  'mobility',
  'flexibility',
  'other',
];

const WorkoutFilter = ({
  category,
  onCategoryChange,
  tags = [],
  selectedTag,
  onTagChange,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Category pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <SlidersHorizontal size={15} className="text-gray-400 dark:text-gray-500 shrink-0" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`shrink-0 text-sm font-medium capitalize px-3.5 py-1.5 rounded-full border transition-colors ${
              category === cat
                ? 'bg-lime-400 text-black border-lime-400'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:border-lime-400 dark:hover:border-lime-500 hover:text-black dark:hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tag select */}
      {tags.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500 dark:text-gray-400 shrink-0">Tag:</label>
          <select
            value={selectedTag}
            onChange={(e) => onTagChange(e.target.value)}
            className="text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
          >
            <option value="">All tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default WorkoutFilter;