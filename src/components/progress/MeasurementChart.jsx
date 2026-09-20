import React, { useMemo, useState } from 'react';
import { Ruler } from 'lucide-react';
import { useUnits, convertLength, round1 } from '../../utils/units';

const WIDTH = 700;
const HEIGHT = 220;
const PADDING = { top: 20, right: 16, bottom: 28, left: 40 };

const MEASUREMENT_FIELDS = [
  { key: 'chest', label: 'Chest' },
  { key: 'waist', label: 'Waist' },
  { key: 'hips', label: 'Hips' },
  { key: 'arms', label: 'Arms' },
  { key: 'thighs', label: 'Thighs' },
  { key: 'neck', label: 'Neck' },
];

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

/**
 * entries: [{ date, measurements: { chest, waist, ... }, measurementUnit }, ...]
 */
const MeasurementChart = ({ entries = [] }) => {
  const { system, lengthUnit } = useUnits();

  const availableFields = useMemo(() => {
    return MEASUREMENT_FIELDS.filter((field) =>
      entries.some(
        (e) =>
          e.measurements &&
          e.measurements[field.key] !== undefined &&
          e.measurements[field.key] !== null
      )
    );
  }, [entries]);

  const [selectedKey, setSelectedKey] = useState(
    availableFields[0]?.key || 'waist'
  );

  const activeKey = availableFields.some((f) => f.key === selectedKey)
    ? selectedKey
    : availableFields[0]?.key;

  const sorted = useMemo(() => {
    return [...entries]
      .filter(
        (e) =>
          activeKey &&
          e.measurements &&
          e.measurements[activeKey] !== undefined &&
          e.measurements[activeKey] !== null
      )
      // Convert to the preferred unit so cm/in entries plot on one scale
      .map((e) => ({
        ...e,
        measurements: {
          ...e.measurements,
          [activeKey]: round1(
            convertLength(e.measurements[activeKey], e.measurementUnit, system)
          ),
        },
      }))
      .sort(
        (a, b) =>
          new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt)
      );
  }, [entries, activeKey, system]);

  if (availableFields.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-black dark:text-white mb-1">
          Measurement trend
        </h3>
        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
          <Ruler size={28} className="mx-auto mb-2" />
          <p className="text-sm">Log a body measurement to see your trend.</p>
        </div>
      </div>
    );
  }

  const values = sorted.map((e) => e.measurements[activeKey]);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;
  const unit = lengthUnit;

  const chartW = WIDTH - PADDING.left - PADDING.right;
  const chartH = HEIGHT - PADDING.top - PADDING.bottom;

  const points = sorted.map((entry, index) => {
    const x =
      PADDING.left +
      (sorted.length === 1 ? chartW / 2 : (index / (sorted.length - 1)) * chartW);
    const y =
      PADDING.top +
      chartH -
      ((entry.measurements[activeKey] - minVal) / range) * chartH;
    return { x, y, entry };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-black dark:text-white">
          Measurement trend
        </h3>
        <select
          value={activeKey}
          onChange={(e) => setSelectedKey(e.target.value)}
          className="text-xs font-medium bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-400"
        >
          {availableFields.map((field) => (
            <option key={field.key} value={field.key}>
              {field.label}
            </option>
          ))}
        </select>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-48"
        preserveAspectRatio="xMidYMid meet"
      >
        {[0, 0.5, 1].map((f) => (
          <line
            key={f}
            x1={PADDING.left}
            x2={WIDTH - PADDING.right}
            y1={PADDING.top + chartH * f}
            y2={PADDING.top + chartH * f}
            className="stroke-gray-100 dark:stroke-gray-800"
            strokeWidth="1"
          />
        ))}

        <text x={4} y={PADDING.top + 4} fontSize="10" className="fill-gray-400 dark:fill-gray-500">
          {maxVal.toFixed(1)}
        </text>
        <text x={4} y={HEIGHT - PADDING.bottom + 4} fontSize="10" className="fill-gray-400 dark:fill-gray-500">
          {minVal.toFixed(1)}
        </text>

        <path
          d={linePath}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#000000" stroke="#60a5fa" strokeWidth="2">
            <title>
              {formatDate(p.entry.date || p.entry.createdAt)}:{' '}
              {p.entry.measurements[activeKey]} {unit}
            </title>
          </circle>
        ))}

        {[0, Math.floor((points.length - 1) / 2), points.length - 1]
          .filter((v, i, arr) => arr.indexOf(v) === i)
          .map((idx) => (
            <text
              key={idx}
              x={points[idx].x}
              y={HEIGHT - 8}
              fontSize="10"
              className="fill-gray-400 dark:fill-gray-500"
              textAnchor="middle"
            >
              {formatDate(points[idx].entry.date || points[idx].entry.createdAt)}
            </text>
          ))}
      </svg>
    </div>
  );
};

export default MeasurementChart;