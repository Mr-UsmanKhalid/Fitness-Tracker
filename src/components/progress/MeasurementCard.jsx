import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Ruler, Calendar, Edit2, Trash2, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import { useUnits, convertWeight, convertLength, round1 } from '../../utils/units';

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const MeasurementCard = ({ entry, previousEntry, onDelete }) => {
  const navigate = useNavigate();
  const { system, weightUnit, lengthUnit } = useUnits();

  // Show everything in the preferred unit, whatever unit each entry was logged in
  const weight = convertWeight(entry.weight, entry.weightUnit, system);
  const previousWeight = convertWeight(previousEntry?.weight, previousEntry?.weightUnit, system);
  const weightDelta =
    weight !== null && previousWeight !== null ? round1(weight - previousWeight) : null;

  const measurementEntries = Object.entries(entry.measurements || {}).filter(
    ([, value]) => value !== null && value !== undefined && value !== ''
  );

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Delete this progress entry? This can't be undone.")) {
      onDelete(entry._id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/progress/${entry._id}`, { state: { edit: true } });
  };

  return (
    <div
      onClick={() => navigate(`/progress/${entry._id}`)}
      className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 hover:border-lime-400 dark:hover:border-lime-500 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Calendar size={13} />
          <span>{formatDate(entry.date || entry.createdAt)}</span>
        </div>
      </div>

      {/* Weight */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-lime-100 dark:bg-lime-500/20 text-lime-700 dark:text-lime-300 flex items-center justify-center shrink-0">
          <Scale size={16} />
        </div>
        <div>
          <p className="text-xl font-bold text-black dark:text-white leading-tight">
            {weight !== null ? round1(weight) : '—'}
            <span className="text-sm font-normal text-gray-400 dark:text-gray-500 ml-1">
              {weightUnit}
            </span>
          </p>
          {weightDelta !== null && weightDelta !== 0 && (
            <p
              className={`text-xs flex items-center gap-0.5 ${
                weightDelta > 0 ? 'text-orange-500' : 'text-lime-600 dark:text-lime-400'
              }`}
            >
              {weightDelta > 0 ? (
                <ArrowUp size={11} />
              ) : (
                <ArrowDown size={11} />
              )}
              {Math.abs(weightDelta).toFixed(1)} {weightUnit}
            </p>
          )}
        </div>
      </div>

      {/* Measurements preview */}
      {measurementEntries.length > 0 && (
        <div className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Ruler size={13} className="mt-0.5 shrink-0" />
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {measurementEntries.slice(0, 4).map(([key, value]) => (
              <span key={key} className="capitalize">
                {key}:{' '}
                <span className="font-medium normal-case text-gray-700 dark:text-gray-300">
                  {round1(convertLength(value, entry.measurementUnit, system))} {lengthUnit}
                </span>
              </span>
            ))}
            {measurementEntries.length > 4 && (
              <span className="text-gray-400 dark:text-gray-500">
                +{measurementEntries.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 mt-1">
        <div className="flex items-center gap-1">
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white transition-colors"
            title="Edit entry"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete entry"
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

export default MeasurementCard;