import React from 'react';
import { Trash2, GripVertical } from 'lucide-react';

const inputClass =
  'w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all';

const FoodForm = ({ food, index, onChange, onRemove, canRemove }) => {
  const handleField = (field) => (e) => {
    onChange(index, field, e.target.value);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
          <GripVertical size={16} />
          <span className="text-xs font-medium uppercase tracking-wide">
            Food {index + 1}
          </span>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Remove food"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Food name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={food.name}
            onChange={handleField('name')}
            placeholder="e.g. Grilled chicken breast"
            className={inputClass}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Qty
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={food.quantity}
              onChange={handleField('quantity')}
              placeholder="1"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Unit
            </label>
            <select
              value={food.unit}
              onChange={handleField('unit')}
              className={inputClass}
            >
              <option value="g">g</option>
              <option value="ml">ml</option>
              <option value="oz">oz</option>
              <option value="cup">cup</option>
              <option value="piece">piece</option>
              <option value="serving">serving</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Calories
          </label>
          <input
            type="number"
            min="0"
            value={food.calories}
            onChange={handleField('calories')}
            placeholder="0"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Protein (g)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={food.protein}
            onChange={handleField('protein')}
            placeholder="0"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Carbs (g)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={food.carbs}
            onChange={handleField('carbs')}
            placeholder="0"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Fat (g)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={food.fat}
            onChange={handleField('fat')}
            placeholder="0"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
};

export default FoodForm;