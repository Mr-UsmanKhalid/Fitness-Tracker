import React, { useMemo, useState } from 'react';
import { TrendingUp } from 'lucide-react';

const WIDTH = 700;
const HEIGHT = 220;
const PADDING = { top: 20, right: 16, bottom: 28, left: 40 };

const PERFORMANCE_FIELDS = [
  { key: 'benchPress', label: 'Bench Press', unit: 'kg' },
  { key: 'squat', label: 'Squat', unit: 'kg' },
  { key: 'deadlift', label: 'Deadlift', unit: 'kg' },
  { key: 'runningDistance', label: 'Running Distance', unit: 'km' },
  { key: 'runningTime', label: 'Running Time', unit: 'min' },
];

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

/**
 * entries: [{ date, performance: { benchPress, squat, deadlift, runningDistance, runningTime } }, ...]
 */
const PerformanceChart = ({ entries = [] }) => {
  const availableFields = useMemo(() => {
    return PERFORMANCE_FIELDS.filter((field) =>
      entries.some(
        (e) =>
          e.performance &&
          e.performance[field.key] !== undefined &&
          e.performance[field.key] !== null
      )
    );
  }, [entries]);

  const [selectedKey, setSelectedKey] = useState(availableFields[0]?.key || '');
  const activeField =
    availableFields.find((f) => f.key === selectedKey) || availableFields[0];

  const dataPoints = useMemo(() => {
    if (!activeField) return [];

    return entries
      .filter(
        (e) =>
          e.performance &&
          e.performance[activeField.key] !== undefined &&
          e.performance[activeField.key] !== null
      )
      .map((e) => ({
        date: e.date || e.createdAt,
        value: e.performance[activeField.key],
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [entries, activeField]);

  if (availableFields.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-black dark:text-white mb-1">
          Performance trend
        </h3>
        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
          <TrendingUp size={28} className="mx-auto mb-2" />
          <p className="text-sm">
            Log a bench, squat, deadlift, or running metric to see your trend.
          </p>
        </div>
      </div>
    );
  }

  const values = dataPoints.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const chartW = WIDTH - PADDING.left - PADDING.right;
  const chartH = HEIGHT - PADDING.top - PADDING.bottom;

  const points = dataPoints.map((d, index) => {
    const x =
      PADDING.left +
      (dataPoints.length === 1
        ? chartW / 2
        : (index / (dataPoints.length - 1)) * chartW);
    const y = PADDING.top + chartH - ((d.value - minVal) / range) * chartH;
    return { x, y, d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const best = Math.max(...values);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
      <div className="flex items-center justify-between mb-1 gap-2">
        <h3 className="text-sm font-semibold text-black dark:text-white">
          Performance trend
        </h3>
        <select
          value={activeField.key}
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

      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
        Best: <span className="font-semibold text-black dark:text-white">{best} {activeField.unit}</span>
      </p>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-44"
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
          {maxVal}
        </text>
        <text x={4} y={HEIGHT - PADDING.bottom + 4} fontSize="10" className="fill-gray-400 dark:fill-gray-500">
          {minVal}
        </text>

        <path
          d={linePath}
          fill="none"
          stroke="#c084fc"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#000000" stroke="#c084fc" strokeWidth="2">
            <title>
              {formatDate(p.d.date)}: {p.d.value} {activeField.unit}
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
              {formatDate(points[idx].d.date)}
            </text>
          ))}
      </svg>
    </div>
  );
};

export default PerformanceChart;