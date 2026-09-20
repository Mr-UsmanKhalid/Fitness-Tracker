import React, { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import ExerciseForm from './ExerciseForm';

const CATEGORIES = [
  'strength',
  'cardio',
  'hypertrophy',
  'powerlifting',
  'calisthenics',
  'mobility',
  'flexibility',
  'other',
];

const emptyExercise = () => ({
  name: '',
  sets: '',
  reps: '',
  weight: '',
  weightUnit: 'kg',
  notes: '',
});

const buildInitialState = (initialData) => ({
  name: initialData?.name || '',
  category: initialData?.category || 'strength',
  tags: initialData?.tags || [],
  date: initialData?.date
    ? new Date(initialData.date).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10),
  notes: initialData?.notes || '',
  caloriesBurned: initialData?.caloriesBurned ?? '',
  exercises:
    initialData?.exercises?.length > 0
      ? initialData.exercises.map((ex) => ({
          name: ex.name || '',
          sets: ex.sets ?? '',
          reps: ex.reps ?? '',
          weight: ex.weight ?? '',
          weightUnit: ex.weightUnit || 'kg',
          notes: ex.notes || '',
        }))
      : [emptyExercise()],
});

const inputClass =
  'w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all';

const WorkoutForm = ({
  initialData = null,
  onSubmit,
  submitLabel = 'Save Workout',
  loading = false,
  error = null,
}) => {
  const [form, setForm] = useState(() => buildInitialState(initialData));
  const [tagInput, setTagInput] = useState('');
  const [formError, setFormError] = useState(null);

  const handleField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleExerciseChange = (index, field, value) => {
    setForm((prev) => {
      const exercises = [...prev.exercises];
      exercises[index] = { ...exercises[index], [field]: value };
      return { ...prev, exercises };
    });
  };

  const addExercise = () => {
    setForm((prev) => ({
      ...prev,
      exercises: [...prev.exercises, emptyExercise()],
    }));
  };

  const removeExercise = (index) => {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const addTag = (e) => {
    e.preventDefault();
    const value = tagInput.trim();
    if (value && !form.tags.includes(value)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, value] }));
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim()) {
      setFormError('Give your workout a name.');
      return;
    }

    const filledExercises = form.exercises.filter(
      (ex) => ex.name.trim() || ex.sets !== '' || ex.reps !== ''
    );

    if (filledExercises.length === 0) {
      setFormError('Add at least one exercise.');
      return;
    }

    for (let i = 0; i < filledExercises.length; i++) {
      const ex = filledExercises[i];
      if (!ex.name.trim()) {
        setFormError(`Exercise ${i + 1}: name is required.`);
        return;
      }
      if (ex.sets === '' || Number(ex.sets) < 1) {
        setFormError(`Exercise ${i + 1} (${ex.name}): sets must be at least 1.`);
        return;
      }
      if (ex.reps === '' || Number(ex.reps) < 1) {
        setFormError(`Exercise ${i + 1} (${ex.name}): reps must be at least 1.`);
        return;
      }
    }

    if (form.caloriesBurned !== '' && Number(form.caloriesBurned) < 0) {
      setFormError('Calories burned can\'t be negative.');
      return;
    }

    const cleanedExercises = filledExercises.map((ex) => ({
      name: ex.name.trim(),
      sets: Number(ex.sets),
      reps: Number(ex.reps),
      weight: ex.weight === '' ? 0 : Number(ex.weight),
      weightUnit: ex.weightUnit || 'kg',
      notes: ex.notes.trim(),
    }));

    onSubmit({
      name: form.name.trim(),
      category: form.category,
      tags: form.tags,
      date: form.date,
      notes: form.notes.trim(),
      caloriesBurned: form.caloriesBurned === '' ? undefined : Number(form.caloriesBurned),
      exercises: cleanedExercises,
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Workout name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={handleField('name')}
            placeholder="e.g. Push Day, Morning Run"
            className={inputClass}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={form.category}
              onChange={handleField('category')}
              className={`${inputClass} capitalize`}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Calories burned
              <span className="text-gray-400 dark:text-gray-500 font-normal"> (optional)</span>
            </label>
            <input
              type="number"
              min="0"
              value={form.caloriesBurned}
              onChange={handleField('caloriesBurned')}
              placeholder="e.g. 320"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addTag(e);
              }}
              placeholder="e.g. upper-body, 5k"
              className={inputClass}
            />
            <button
              type="button"
              onClick={addTag}
              className="shrink-0 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition-colors"
            >
              Add
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-lime-100 dark:bg-lime-500/20 text-lime-800 dark:text-lime-300 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-lime-950 dark:hover:text-lime-100"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            value={form.notes}
            onChange={handleField('notes')}
            placeholder="Optional notes about this workout..."
            rows={3}
            className={inputClass}
          />
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-black dark:text-white">Exercises</h3>
          <button
            type="button"
            onClick={addExercise}
            className="flex items-center gap-1.5 text-sm font-medium text-black dark:text-white hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
          >
            <Plus size={16} />
            Add exercise
          </button>
        </div>

        {form.exercises.map((exercise, index) => (
          <ExerciseForm
            key={index}
            exercise={exercise}
            index={index}
            onChange={handleExerciseChange}
            onRemove={removeExercise}
            canRemove={form.exercises.length > 1}
          />
        ))}
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

export default WorkoutForm;