import React, { useMemo, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import FoodForm from './FoodForm';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

// Local-timezone-safe YYYY-MM-DD (avoids UTC midnight rollover from toISOString)
const toLocalDateInput = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const emptyFood = () => ({
  name: '',
  quantity: '',
  unit: 'g',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
});

const buildInitialState = (initialData) => ({
  mealType: initialData?.mealType || 'breakfast',
  date: initialData?.date
    ? toLocalDateInput(initialData.date)
    : toLocalDateInput(new Date()),
  notes: initialData?.notes || '',
  foods:
    initialData?.foods?.length > 0
      ? initialData.foods.map((food) => ({
          name: food.name || '',
          quantity: food.quantity ?? '',
          unit: food.unit || 'g',
          calories: food.calories ?? '',
          protein: food.protein ?? '',
          carbs: food.carbs ?? '',
          fat: food.fat ?? '',
        }))
      : [emptyFood()],
});

const inputClass =
  'w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all';

const MealForm = ({
  initialData = null,
  onSubmit,
  submitLabel = 'Save Meal',
  loading = false,
  error = null,
}) => {
  const [form, setForm] = useState(() => buildInitialState(initialData));
  const [formError, setFormError] = useState(null);

  const handleField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFoodChange = (index, field, value) => {
    setForm((prev) => {
      const foods = [...prev.foods];
      foods[index] = { ...foods[index], [field]: value };
      return { ...prev, foods };
    });
  };

  const addFood = () => {
    setForm((prev) => ({ ...prev, foods: [...prev.foods, emptyFood()] }));
  };

  const removeFood = (index) => {
    setForm((prev) => ({
      ...prev,
      foods: prev.foods.filter((_, i) => i !== index),
    }));
  };

  const liveTotals = useMemo(() => {
    return form.foods.reduce(
      (totals, food) => ({
        calories: totals.calories + (Number(food.calories) || 0),
        protein: totals.protein + (Number(food.protein) || 0),
        carbs: totals.carbs + (Number(food.carbs) || 0),
        fat: totals.fat + (Number(food.fat) || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [form.foods]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    const filledFoods = form.foods.filter((food) => food.name.trim());

    if (filledFoods.length === 0) {
      setFormError('Add at least one food item.');
      return;
    }

    const cleanedFoods = filledFoods.map((food) => ({
      name: food.name.trim(),
      quantity: food.quantity === '' ? 0 : Number(food.quantity),
      unit: food.unit || 'g',
      calories: food.calories === '' ? 0 : Number(food.calories),
      protein: food.protein === '' ? 0 : Number(food.protein),
      carbs: food.carbs === '' ? 0 : Number(food.carbs),
      fat: food.fat === '' ? 0 : Number(food.fat),
    }));

    onSubmit({
      mealType: form.mealType,
      date: form.date,
      notes: form.notes.trim(),
      foods: cleanedFoods,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(formError || error) && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
          {formError || error}
        </div>
      )}

      {/* Basic details */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Meal type
            </label>
            <select
              value={form.mealType}
              onChange={handleField('mealType')}
              className={`${inputClass} capitalize`}
            >
              {MEAL_TYPES.map((type) => (
                <option key={type} value={type} className="capitalize">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={handleField('date')}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            value={form.notes}
            onChange={handleField('notes')}
            placeholder="Optional notes about this meal..."
            rows={2}
            className={inputClass}
          />
        </div>
      </div>

      {/* Foods */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-black dark:text-white">Foods</h3>
          <button
            type="button"
            onClick={addFood}
            className="flex items-center gap-1.5 text-sm font-medium text-black dark:text-white hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
          >
            <Plus size={16} />
            Add food
          </button>
        </div>

        {form.foods.map((food, index) => (
          <FoodForm
            key={index}
            food={food}
            index={index}
            onChange={handleFoodChange}
            onRemove={removeFood}
            canRemove={form.foods.length > 1}
          />
        ))}
      </div>

      {/* Live totals — kept solid black in both themes */}
      <div className="flex items-center justify-between bg-black rounded-lg px-4 py-3">
        <span className="text-sm font-medium text-lime-400">Meal total</span>
        <div className="flex items-center gap-4 text-sm text-white">
          <span>
            <span className="font-bold">{liveTotals.calories}</span> kcal
          </span>
          <span className="hidden sm:inline text-gray-400">
            {liveTotals.protein}g P · {liveTotals.carbs}g C ·{' '}
            {liveTotals.fat}g F
          </span>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default MealForm;