import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useUnits } from '../../utils/units';

const MEASUREMENT_FIELDS = [
  { key: 'chest', label: 'Chest' },
  { key: 'waist', label: 'Waist' },
  { key: 'hips', label: 'Hips' },
  { key: 'arms', label: 'Arms' },
  { key: 'thighs', label: 'Thighs' },
  { key: 'neck', label: 'Neck' },
];

const PERFORMANCE_FIELDS = [
  { key: 'benchPress', label: 'Bench Press', unit: 'kg' },
  { key: 'squat', label: 'Squat', unit: 'kg' },
  { key: 'deadlift', label: 'Deadlift', unit: 'kg' },
  { key: 'runningDistance', label: 'Running Distance', unit: 'km' },
  { key: 'runningTime', label: 'Running Time', unit: 'min' },
];

const toLocalDateInput = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// `defaults` = the units from Settings; used only for new entries.
// An entry being edited keeps the unit it was logged in.
const buildInitialState = (initialData, defaults = {}) => ({
  date: initialData?.date
    ? toLocalDateInput(initialData.date)
    : toLocalDateInput(new Date()),
  weight: initialData?.weight ?? '',
  weightUnit: initialData?.weightUnit || defaults.weightUnit || 'kg',
  measurementUnit: initialData?.measurementUnit || defaults.lengthUnit || 'cm',
  measurements: MEASUREMENT_FIELDS.reduce((acc, field) => {
    acc[field.key] = initialData?.measurements?.[field.key] ?? '';
    return acc;
  }, {}),
  performance: PERFORMANCE_FIELDS.reduce((acc, field) => {
    acc[field.key] = initialData?.performance?.[field.key] ?? '';
    return acc;
  }, {}),
  notes: initialData?.notes || '',
});

const inputClass =
  'w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all';

const ProgressForm = ({
  initialData = null,
  onSubmit,
  submitLabel = 'Save Progress',
  loading = false,
  error = null,
}) => {
  const { weightUnit: defaultWeightUnit, lengthUnit: defaultLengthUnit } = useUnits();
  const [form, setForm] = useState(() =>
    buildInitialState(initialData, {
      weightUnit: defaultWeightUnit,
      lengthUnit: defaultLengthUnit,
    })
  );
  const [formError, setFormError] = useState(null);

  const handleField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleMeasurementField = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      measurements: { ...prev.measurements, [key]: e.target.value },
    }));
  };

  const handlePerformanceField = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      performance: { ...prev.performance, [key]: e.target.value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    const hasWeight = form.weight !== '';
    const hasMeasurement = Object.values(form.measurements).some(
      (v) => v !== ''
    );
    const hasPerformance = Object.values(form.performance).some(
      (v) => v !== ''
    );

    if (!hasWeight && !hasMeasurement && !hasPerformance) {
      setFormError(
        'Log at least a weight, one measurement, or one performance value.'
      );
      return;
    }

    const cleanedMeasurements = Object.fromEntries(
      Object.entries(form.measurements)
        .filter(([, v]) => v !== '')
        .map(([k, v]) => [k, Number(v)])
    );

    const cleanedPerformance = Object.fromEntries(
      Object.entries(form.performance)
        .filter(([, v]) => v !== '')
        .map(([k, v]) => [k, Number(v)])
    );

    onSubmit({
      date: form.date,
      weight: form.weight === '' ? undefined : Number(form.weight),
      weightUnit: form.weightUnit,
      measurementUnit: form.measurementUnit,
      measurements: cleanedMeasurements,
      performance: cleanedPerformance,
      notes: form.notes.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(formError || error) && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
          {formError || error}
        </div>
      )}

      {/* Date + Weight */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Weight
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={form.weight}
              onChange={handleField('weight')}
              placeholder="e.g. 78.5"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Unit
            </label>
            <select
              value={form.weightUnit}
              onChange={handleField('weightUnit')}
              className={inputClass}
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Measurements */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-black dark:text-white">
            Body measurements
          </h3>
          <select
            value={form.measurementUnit}
            onChange={handleField('measurementUnit')}
            className="text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-400"
          >
            <option value="cm">cm</option>
            <option value="in">in</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MEASUREMENT_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                {field.label}
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.measurements[field.key]}
                onChange={handleMeasurementField(field.key)}
                placeholder="0"
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Performance */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 space-y-4">
        <h3 className="text-sm font-semibold text-black dark:text-white">
          Performance
          <span className="text-xs font-normal text-gray-400 dark:text-gray-500 ml-2">
            optional
          </span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PERFORMANCE_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                {field.label}
                <span className="text-gray-400 dark:text-gray-500 font-normal"> ({field.unit})</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.performance[field.key]}
                onChange={handlePerformanceField(field.key)}
                placeholder="0"
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes
        </label>
        <textarea
          value={form.notes}
          onChange={handleField('notes')}
          placeholder="How are you feeling? Any context for this check-in..."
          rows={3}
          className={inputClass}
        />
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

export default ProgressForm;