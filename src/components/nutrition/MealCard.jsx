import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Utensils, Moon, Cookie, Edit2, Trash2, ChevronRight, Flame } from 'lucide-react';

const MEAL_ICONS = {
  breakfast: Coffee,
  lunch: Utensils,
  dinner: Moon,
  snack: Cookie,
};

const MEAL_STYLES = {
  breakfast: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  lunch: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  dinner: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  snack: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
};

const sumField = (foods, field) =>
  (foods || []).reduce((total, food) => total + (Number(food[field]) || 0), 0);

const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

const MealCard = ({ meal, onDelete }) => {
  const navigate = useNavigate();

  const type = meal.mealType?.toLowerCase() || 'snack';
  const Icon = MEAL_ICONS[type] || Cookie;
  const styleClass = MEAL_STYLES[type] || MEAL_STYLES.snack;

  const calories = sumField(meal.foods, 'calories');
  const foodCount = meal.foods?.length || 0;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Delete this meal entry? This can\'t be undone.')) {
      onDelete(meal._id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/nutrition/${meal._id}/edit`);
  };

  return (
    <div
      onClick={() => navigate(`/nutrition/${meal._id}`)}
      className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 hover:border-lime-400 dark:hover:border-lime-500 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${styleClass}`}>
            <Icon size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-black dark:text-white capitalize truncate group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
              {type}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {formatTime(meal.date || meal.createdAt)}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1 text-black dark:text-white font-bold">
          <Flame size={14} className="text-orange-400" />
          {calories}
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        {foodCount} food item{foodCount === 1 ? '' : 's'}
      </p>

      {meal.foods?.length > 0 && (
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
          {meal.foods.map((f) => f.name).join(', ')}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 mt-1">
        <div className="flex items-center gap-1">
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white transition-colors"
            title="Edit meal"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete meal"
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

export default MealCard;