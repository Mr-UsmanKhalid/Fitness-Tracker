import React from 'react';
import { Scale } from 'lucide-react';
import { useUnits, convertWeight, round1 } from '../../utils/units';

const WIDTH = 700;
const HEIGHT = 220;
const PADDING = { top: 20, right: 16, bottom: 28, left: 40 };

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

/**
 * entries: [{ date, weight, weightUnit }, ...] - any order, will be sorted ascending
 */
const WeightChart = ({ entries = [] }) => {
  const { system, weightUnit } = useUnits();

  // Convert every entry to the preferred unit so mixed kg/lbs history plots on one scale
  const sorted = [...entries]
    .filter((e) => e.weight != null)
    .map((e) => ({
      ...e,
      weight: round1(convertWeight(e.weight, e.weightUnit, system)),
      weightUnit,
    }))
    .sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));

  if (sorted.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-black dark:text-white mb-1">Weight trend</h3>
        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
          <Scale size={28} className="mx-auto mb-2" />
          <p className="text-sm">Log a weight entry to see your trend.</p>
        </div>
      </div>
    );
  }

  const weights = sorted.map((e) => e.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const range = maxWeight - minWeight || 1;
  const unit = weightUnit;

  const chartW = WIDTH - PADDING.left - PADDING.right;
  const chartH = HEIGHT - PADDING.top - PADDING.bottom;

  const points = sorted.map((entry, index) => {
    const x =
      PADDING.left +
      (sorted.length === 1 ? chartW / 2 : (index / (sorted.length - 1)) * chartW);
    const y =
      PADDING.top +
      chartH -
      ((entry.weight - minWeight) / range) * chartH;
    return { x, y, entry };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const latest = sorted[sorted.length - 1];
  const first = sorted[0];
  const totalChange = latest.weight - first.weight;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-black dark:text-white">Weight trend</h3>
        <span
          className={`text-xs font-medium ${
            totalChange > 0
              ? 'text-orange-500'
              : totalChange < 0
              ? 'text-lime-600 dark:text-lime-400'
              : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          {totalChange > 0 ? '+' : ''}
          {totalChange.toFixed(1)} {unit} overall
        </span>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-48"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Gridlines */}
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

        {/* Y-axis labels */}
        <text x={4} y={PADDING.top + 4} fontSize="10" className="fill-gray-400 dark:fill-gray-500">
          {maxWeight.toFixed(1)}
        </text>
        <text x={4} y={HEIGHT - PADDING.bottom + 4} fontSize="10" className="fill-gray-400 dark:fill-gray-500">
          {minWeight.toFixed(1)}
        </text>

        {/* Line */}
        <path d={linePath} fill="none" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#000000" stroke="#a3e635" strokeWidth="2">
            <title>
              {formatDate(p.entry.date || p.entry.createdAt)}: {p.entry.weight} {unit}
            </title>
          </circle>
        ))}

        {/* X-axis labels (first, middle, last) */}
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

export default WeightChart;