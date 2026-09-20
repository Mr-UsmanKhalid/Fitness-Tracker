import React from 'react';
import { Apple } from 'lucide-react';

const sumField = (foods, field) =>
  foods.reduce((total, food) => total + (Number(food[field]) || 0), 0);

const FoodList = ({ foods }) => {
  if (!foods || foods.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 dark:text-gray-500">
        <Apple size={28} className="mx-auto mb-2" />
        <p className="text-sm">No foods logged for this meal yet.</p>
      </div>
    );
  }

  const totals = {
    calories: sumField(foods, 'calories'),
    protein: sumField(foods, 'protein'),
    carbs: sumField(foods, 'carbs'),
    fat: sumField(foods, 'fat'),
  };

  return (
    <div className="space-y-3">
      {foods.map((food, index) => (
        <div
          key={food._id || index}
          className="flex items-start justify-between gap-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-lg p-4"
        >
          <div className="min-w-0">
            <p className="font-medium text-black dark:text-white truncate">{food.name}</p>
            {(food.quantity || food.unit) && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {food.quantity} {food.unit}
              </p>
            )}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-gray-600 dark:text-gray-400">
              <span>
                <span className="font-semibold text-black dark:text-white">
                  {food.protein || 0}g
                </span>{' '}
                protein
              </span>
              <span>
                <span className="font-semibold text-black dark:text-white">
                  {food.carbs || 0}g
                </span>{' '}
                carbs
              </span>
              <span>
                <span className="font-semibold text-black dark:text-white">
                  {food.fat || 0}g
                </span>{' '}
                fat
              </span>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-lg font-bold text-black dark:text-white">
              {food.calories || 0}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">kcal</p>
          </div>
        </div>
      ))}

      {/* Totals — kept solid black in both themes, matches the brand accent bars used elsewhere */}
      <div className="flex items-center justify-between bg-black rounded-lg px-4 py-3">
        <span className="text-sm font-medium text-lime-400">Total</span>
        <div className="flex items-center gap-4 text-sm text-white">
          <span>
            <span className="font-bold">{totals.calories}</span> kcal
          </span>
          <span className="hidden sm:inline text-gray-400">
            {totals.protein}g P · {totals.carbs}g C · {totals.fat}g F
          </span>
        </div>
      </div>
    </div>
  );
};

export default FoodList;