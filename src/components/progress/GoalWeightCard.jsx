import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Target, Loader2 } from 'lucide-react';
import { fetchGoal, saveGoal, removeGoal } from '../../redux/slices/progressSlice';
import { useUnits, convertWeight, round1 } from '../../utils/units';
import { toast } from '../../utils/toast';

const inputClass =
  'w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all';

/**
 * Lets the user set a target weight. Saved on the backend (/progress/goal) and
 * used by the Progress tracking card on the dashboard.
 */
const GoalWeightCard = () => {
  const dispatch = useDispatch();
  const { goal, goalSaving } = useSelector((state) => state.progress);
  const { system, weightUnit } = useUnits();

  const [value, setValue] = useState('');
  const [unit, setUnit] = useState(weightUnit);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchGoal());
  }, [dispatch]);

  // Show the saved goal in the preferred unit whenever it loads or changes
  useEffect(() => {
    setValue(goal ? String(round1(convertWeight(goal.goalWeight, goal.weightUnit, system))) : '');
    setUnit(weightUnit);
  }, [goal, system, weightUnit]);

  const savedDisplay = goal ? round1(convertWeight(goal.goalWeight, goal.weightUnit, system)) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const amount = Number(value);
    if (value === '' || !Number.isFinite(amount) || amount <= 0) {
      setError('Enter a goal weight greater than 0.');
      return;
    }

    try {
      await dispatch(saveGoal({ goalWeight: amount, weightUnit: unit })).unwrap();
      toast.success('Weight goal saved.');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to save your goal.');
    }
  };

  const handleRemove = async () => {
    if (!window.confirm('Remove your weight goal?')) return;
    setError(null);

    try {
      await dispatch(removeGoal()).unwrap();
      toast.info('Weight goal removed.');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to remove your goal.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-1">
        <Target size={16} className="text-gray-400 dark:text-gray-500" />
        <h3 className="text-sm font-semibold text-black dark:text-white">Weight goal</h3>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        {goal
          ? `Your target is ${savedDisplay} ${weightUnit}. The dashboard tracks how close you are.`
          : 'Set a target weight and the dashboard will track how close you are.'}
      </p>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[8rem]">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Target weight
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 75"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Unit
          </label>
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className={inputClass}>
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={goalSaving}
          className="flex items-center gap-2 px-5 py-2 bg-lime-400 text-black text-sm font-semibold rounded-lg hover:bg-lime-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {goalSaving && <Loader2 size={15} className="animate-spin" />}
          {goal ? 'Update goal' : 'Save goal'}
        </button>

        {goal && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={goalSaving}
            className="px-2 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-60 transition-colors"
          >
            Remove goal
          </button>
        )}
      </form>
    </div>
  );
};

export default GoalWeightCard;