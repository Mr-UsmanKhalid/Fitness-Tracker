import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import {
  fetchNutritionEntry,
  updateNutrition,
  clearNutritionError,
  clearCurrentMeal,
} from '../../redux/slices/nutritionSlice';
import MealForm from '../../components/nutrition/MealForm';

const EditMeal = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentMeal, loading, updateLoading, error } = useSelector(
    (state) => state.nutrition
  );

  useEffect(() => {
    dispatch(fetchNutritionEntry(id));
    return () => dispatch(clearCurrentMeal());
  }, [dispatch, id]);

  const handleSubmit = async (nutritionData) => {
    dispatch(clearNutritionError());
    const result = await dispatch(updateNutrition({ id, nutritionData }));

    if (updateNutrition.fulfilled.match(result)) {
      navigate(`/nutrition/${id}`);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <Link
        to={`/nutrition/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        Back to meal
      </Link>

      <h1 className="text-2xl font-bold text-black dark:text-white mb-1">Edit Meal</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Update the foods, calories, and macros for this meal.
      </p>

      {loading && !currentMeal ? (
        <div className="flex items-center justify-center py-16 text-gray-400 dark:text-gray-500">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : currentMeal ? (
        <MealForm
          initialData={currentMeal}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          loading={updateLoading}
          error={error}
        />
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">Meal not found.</p>
      )}
    </div>
  );
};

export default EditMeal;