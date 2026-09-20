import React from 'react';
import { PieChart } from 'lucide-react';

/* Same colors NutritionSummary uses for protein / carbs / fat */
const MACROS = [
  { key: 'protein', label: 'Protein', color: '#60a5fa', kcalPerGram: 4 },
  { key: 'carbs', label: 'Carbs', color: '#fb923c', kcalPerGram: 4 },
  { key: 'fat', label: 'Fat', color: '#c084fc', kcalPerGram: 9 },
];

/**
 * protein, carbs, fat: grams (numbers)
 * The donut shows each macro's share of macro calories (4 / 4 / 9 kcal per gram);
 * the legend shows grams next to it.
 */
const MacroChart = ({ protein = 0, carbs = 0, fat = 0, title = 'Macro breakdown' }) => {
  const grams = { protein: Number(protein) || 0, carbs: Number(carbs) || 0, fat: Number(fat) || 0 };

  const rows = MACROS.map((m) => ({
    ...m,
    grams: grams[m.key],
    kcal: grams[m.key] * m.kcalPerGram,
  }));

  const totalKcal = rows.reduce((sum, r) => sum + r.kcal, 0);
  const totalGrams = rows.reduce((sum, r) => sum + r.grams, 0);

  if (totalKcal === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-black dark:text-white mb-1">{title}</h3>
        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
          <PieChart size={28} className="mx-auto mb-2" />
          <p className="text-sm">Log some meals to see your macro split.</p>
        </div>
      </div>
    );
  }

  let cumulative = 0;
  const stops = rows.map((r) => {
    const pct = (r.kcal / totalKcal) * 100;
    const start = cumulative;
    cumulative += pct;
    return { ...r, pct, start, end: cumulative };
  });

  const gradient = `conic-gradient(${stops
    .map((s) => `${s.color} ${s.start}% ${s.end}%`)
    .join(', ')})`;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
      <h3 className="text-sm font-semibold text-black dark:text-white mb-4">{title}</h3>

      <div className="flex items-center gap-6 flex-wrap sm:flex-nowrap">
        {/* Donut: the inner circle matches the card background in both themes */}
        <div
          className="relative w-28 h-28 rounded-full shrink-0"
          style={{ background: gradient }}
          role="img"
          aria-label={stops
            .map((s) => `${s.label} ${Math.round(s.pct)} percent`)
            .join(', ')}
        >
          <div className="absolute inset-3 rounded-full bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-black dark:text-white leading-none">
              {Math.round(totalGrams)}g
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">macros</span>
          </div>
        </div>

        <div className="flex-1 min-w-[160px] space-y-2">
          {stops.map((s) => (
            <div key={s.key} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{s.label}</span>
              <span className="text-sm font-semibold text-black dark:text-white">
                {Math.round(s.grams)}g
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 w-9 text-right">
                {Math.round(s.pct)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MacroChart;