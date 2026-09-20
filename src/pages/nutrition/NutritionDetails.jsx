import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Loader2,
  Coffee,
  Utensils,
  Moon,
  Cookie,
  Calendar,
  StickyNote,
} from 'lucide-react';
import {
  fetchNutritionEntry,
  deleteNutrition,
  clearCurrentMeal,
} from '../../redux/slices/nutritionSlice';
import FoodList from '../../components/nutrition/FoodList';

const MEAL_ICONS = { breakfast: Coffee, lunch: Utensils, dinner: Moon, snack: Cookie };
const MEAL_STYLES = {
  breakfast: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  lunch: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  dinner: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  snack: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
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

const NutritionDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentMeal, loading, deleteLoading, error } = useSelector(
    (state) => state.nutrition
  );

  useEffect(() => {
    dispatch(fetchNutritionEntry(id));
    return () => dispatch(clearCurrentMeal());
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this meal entry? This can't be undone.")) {
      return;
    }
    const result = await dispatch(deleteNutrition(id));
    if (deleteNutrition.fulfilled.match(result)) {
      navigate('/nutrition');
    }
  };

  const type = currentMeal?.mealType?.toLowerCase() || 'snack';
  const Icon = MEAL_ICONS[type] || Cookie;
  const styleClass = MEAL_STYLES[type] || MEAL_STYLES.snack;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <Link
        to="/nutrition"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        Back to nutrition
      </Link>

      {loading && !currentMeal && (
        <div className="flex items-center justify-center py-16 text-gray-400 dark:text-gray-500">
          <Loader2 size={24} className="animate-spin" />
        </div>
      )}

      {error && !currentMeal && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {currentMeal && (
        <div className="space-y-6">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => navigate(`/nutrition/${id}/edit`)}
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
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${styleClass}`}>
                <Icon size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black dark:text-white capitalize">
                  {type}
                </h1>
                <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Calendar size={14} />
                  <span>{formatDate(currentMeal.date || currentMeal.createdAt)}</span>
                </div>
              </div>
            </div>

            {currentMeal.notes && (
              <div className="flex items-start gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
                <StickyNote size={15} className="text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" />
                <p>{currentMeal.notes}</p>
              </div>
            )}
          </div>

          {/* Foods */}
          <div>
            <h2 className="text-sm font-semibold text-black dark:text-white mb-3">
              Foods ({currentMeal.foods?.length || 0})
            </h2>
            <FoodList foods={currentMeal.foods} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionDetails;