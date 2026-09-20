import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  createNutrition,
  clearNutritionError,
} from '../../redux/slices/nutritionSlice';
import MealForm from '../../components/nutrition/MealForm';

const AddMeal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createLoading, error } = useSelector((state) => state.nutrition);

  const handleSubmit = async (nutritionData) => {
    dispatch(clearNutritionError());
    const result = await dispatch(createNutrition(nutritionData));

    if (createNutrition.fulfilled.match(result)) {
      const newMeal = result.payload?.nutrition;
      navigate(newMeal ? `/nutrition/${newMeal._id}` : '/nutrition');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <Link
        to="/nutrition"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        Back to nutrition
      </Link>

      <h1 className="text-2xl font-bold text-black dark:text-white mb-1">Add Meal</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Log the foods, calories, and macros for this meal.
      </p>

      <MealForm
        onSubmit={handleSubmit}
        submitLabel="Add Meal"
        loading={createLoading}
        error={error}
      />
    </div>
  );
};

export default AddMeal;