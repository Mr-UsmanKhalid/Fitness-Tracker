export const average = (numbers = []) => {
  const valid = numbers.filter((n) => typeof n === 'number' && !Number.isNaN(n));
  if (valid.length === 0) return 0;
  return valid.reduce((sum, n) => sum + n, 0) / valid.length;
};

export const sum = (numbers = []) =>
  numbers.reduce((total, n) => total + (Number(n) || 0), 0);

export const percentChange = (from, to) => {
  if (!from) return 0;
  return ((to - from) / from) * 100;
};

export const mealCalories = (meal) =>
  sum((meal.foods || []).map((f) => Number(f.calories) || 0));

export const workoutCaloriesInRange = (workouts, startDate, endDate) =>
  sum(
    workouts
      .filter((w) => {
        const d = new Date(w.date);
        return d >= startDate && d <= endDate;
      })
      .map((w) => w.calories)
  );