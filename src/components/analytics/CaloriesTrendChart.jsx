import React, { useMemo } from 'react';
import { Flame } from 'lucide-react';

const DAYS = 30;
const WIDTH = 700;
const HEIGHT = 220;
const PADDING = { top: 20, right: 16, bottom: 28, left: 40 };

const toISODate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

/**
 * meals: [{ date | createdAt, foods: [{ calories }] }, ...]
 */
const CaloriesTrendChart = ({ meals = [] }) => {
  const days = useMemo(() => {
    const list = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      list.push(toISODate(d));
    }
    return list;
  }, []);

  const dailyTotals = useMemo(() => {
    const totals = {};
    days.forEach((d) => (totals[d] = 0));

    meals.forEach((meal) => {
      const mealDate = toISODate(meal.date || meal.createdAt);
      if (totals[mealDate] === undefined) return;
      const cals = (meal.foods || []).reduce(
        (sum, food) => sum + (Number(food.calories) || 0),
        0
      );
      totals[mealDate] += cals;
    });

    return days.map((d) => ({ date: d, calories: totals[d] }));
  }, [meals, days]);

  const hasData = dailyTotals.some((d) => d.calories > 0);

  if (!hasData) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-black dark:text-white mb-1">
          Calorie trend
        </h3>
        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
          <Flame size={28} className="mx-auto mb-2" />
          <p className="text-sm">Log some meals to see your calorie trend.</p>
        </div>
      </div>
    );
  }

  const values = dailyTotals.map((d) => d.calories);
  const maxVal = Math.max(...values, 1);
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  const chartW = WIDTH - PADDING.left - PADDING.right;
  const chartH = HEIGHT - PADDING.top - PADDING.bottom;

  const points = dailyTotals.map((d, index) => {
    const x = PADDING.left + (index / (dailyTotals.length - 1)) * chartW;
    const y = PADDING.top + chartH - (d.calories / maxVal) * chartH;
    return { x, y, d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const avgY = PADDING.top + chartH - (avg / maxVal) * chartH;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-black dark:text-white">Calorie trend</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Avg:{' '}
          <span className="font-semibold text-black dark:text-white">{avg}</span> kcal/day
        </span>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-48"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
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

        {/* Average reference line */}
        <line
          x1={PADDING.left}
          x2={WIDTH - PADDING.right}
          y1={avgY}
          y2={avgY}
          className="stroke-orange-400"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        <text
          x={4}
          y={PADDING.top + 4}
          fontSize="10"
          className="fill-gray-400 dark:fill-gray-500"
        >
          {maxVal}
        </text>
        <text
          x={4}
          y={HEIGHT - PADDING.bottom + 4}
          fontSize="10"
          className="fill-gray-400 dark:fill-gray-500"
        >
          0
        </text>

        <path
          d={linePath}
          fill="none"
          className="stroke-lime-500 dark:stroke-lime-400"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {[0, Math.floor((points.length - 1) / 2), points.length - 1].map(
          (idx) => (
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
          )
        )}
      </svg>

      <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mt-2">
        <span className="inline-block w-4 border-t-2 border-dashed border-orange-400" />
        30-day average
      </div>
    </div>
  );
};

export default CaloriesTrendChart;