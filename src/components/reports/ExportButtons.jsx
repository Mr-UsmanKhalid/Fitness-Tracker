import React from 'react';
import { Download, Printer } from 'lucide-react';
import { useUnits, convertWeight, convertLength, round1 } from '../../utils/units';

const formatDate = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const num = (value, fallback = '—') =>
  value === null || value === undefined || value === '' ? fallback : value;

const withSign = (value, unit = '') =>
  value === null || value === undefined
    ? '—'
    : `${value > 0 ? '+' : ''}${value}${unit ? ` ${unit}` : ''}`;

// Convert a stored value (in `from` unit) to the user's preferred unit, rounded for display.
// `units` is the object returned by useUnits().
const wt = (value, from, units) => round1(convertWeight(value, from, units.system));
const len = (value, from, units) => round1(convertLength(value, from, units.system));
const weightText = (value, from, units) => {
  const v = wt(value, from, units);
  return v === null ? '—' : `${v} ${units.weightUnit}`;
};

// ==========================================
// Section builders — one per report type.
// Each section is either:
//   { title, type: 'kv', items: [[label, value], ...] }
//   { title, type: 'table', headers: [...], rows: [[...], ...] }
// This is what actually gets rendered, so no Mongo _id/__v/nested
// JSON ever reaches the export.
// ==========================================

const buildWorkoutSections = (report) => {
  const s = report.summary || {};
  const sections = [
    {
      title: 'Summary',
      type: 'kv',
      items: [
        ['Total workouts', num(s.totalWorkouts)],
        ['Total sets', num(s.totalSets)],
        ['Total reps', num(s.totalReps)],
        ['Total volume', s.totalVolume != null ? `${s.totalVolume} kg` : '—'],
        ['Total calories burned', s.totalCaloriesBurned != null ? `${s.totalCaloriesBurned} kcal` : '—'],
      ],
    },
  ];

  if (report.categories && Object.keys(report.categories).length) {
    sections.push({
      title: 'Workouts by category',
      type: 'table',
      headers: ['Category', 'Count'],
      rows: Object.entries(report.categories).map(([cat, count]) => [cat, count]),
    });
  }

  if (report.exerciseHistory?.length) {
    sections.push({
      title: 'Exercise history',
      type: 'table',
      headers: ['Exercise', 'Times logged', 'Total sets', 'Total reps', 'Max weight'],
      rows: report.exerciseHistory.map((e) => [
        e.name,
        e.workouts,
        e.totalSets,
        e.totalReps,
        e.maxWeight ? `${e.maxWeight} kg` : '—',
      ]),
    });
  }

  if (report.workouts?.length) {
    sections.push({
      title: 'Workout log',
      type: 'table',
      headers: ['Date', 'Name', 'Category', 'Exercises', 'Notes'],
      rows: report.workouts.map((w) => [
        formatDate(w.date || w.createdAt),
        w.name,
        w.category || '—',
        (w.exercises || []).length,
        w.notes || '—',
      ]),
    });
  }

  return sections;
};

const buildNutritionSections = (report) => {
  const s = report.summary || {};
  const sections = [
    {
      title: 'Summary',
      type: 'kv',
      items: [
        ['Total meals', num(s.totalMeals)],
        ['Total calories', s.totalCalories != null ? `${s.totalCalories} kcal` : '—'],
        ['Total protein', s.totalProtein != null ? `${s.totalProtein} g` : '—'],
        ['Total carbs', s.totalCarbs != null ? `${s.totalCarbs} g` : '—'],
        ['Total fat', s.totalFat != null ? `${s.totalFat} g` : '—'],
      ],
    },
  ];

  if (report.dailyData?.length) {
    sections.push({
      title: 'Daily breakdown',
      type: 'table',
      headers: ['Date', 'Calories', 'Protein (g)', 'Carbs (g)', 'Fat (g)'],
      rows: report.dailyData.map((d) => [
        formatDate(d.date),
        d.calories,
        d.protein,
        d.carbs,
        d.fat,
      ]),
    });
  }

  if (report.meals?.length) {
    sections.push({
      title: 'Meal log',
      type: 'table',
      headers: ['Date', 'Meal', 'Foods', 'Calories', 'Notes'],
      rows: report.meals.map((m) => [
        formatDate(m.date || m.createdAt),
        m.mealType || '—',
        (m.foods || []).map((f) => f.name).join(', ') || '—',
        (m.foods || []).reduce((sum, f) => sum + (Number(f.calories) || 0), 0),
        m.notes || '—',
      ]),
    });
  }

  return sections;
};

const buildProgressSections = (report, units) => {
  const s = report.summary || {};
  const from = s.weightUnit || 'kg'; // unit the report's weight numbers are in
  const sections = [
    {
      title: 'Summary',
      type: 'kv',
      items: [
        ['Check-ins', num(s.totalCheckIns)],
        ['Starting weight', weightText(s.startingWeight, from, units)],
        ['Current weight', weightText(s.currentWeight, from, units)],
        ['Weight change', withSign(wt(s.weightChange, from, units), units.weightUnit)],
      ],
    },
  ];

  if (s.measurementChange && Object.keys(s.measurementChange).length) {
    sections.push({
      title: 'Measurement change',
      type: 'table',
      headers: ['Measurement', 'Change'],
      rows: Object.entries(s.measurementChange).map(([key, value]) => [
        key.charAt(0).toUpperCase() + key.slice(1),
        withSign(len(value, s.measurementUnit || 'cm', units), units.lengthUnit),
      ]),
    });
  }

  if (s.personalRecords && Object.keys(s.personalRecords).length) {
    sections.push({
      title: 'Personal records (in range)',
      type: 'table',
      headers: ['Metric', 'Best'],
      rows: Object.entries(s.personalRecords).map(([key, value]) => [key, value]),
    });
  }

  if (report.entries?.length) {
    sections.push({
      title: 'Check-in log',
      type: 'table',
      headers: ['Date', 'Weight', 'Notes'],
      rows: report.entries.map((e) => [
        formatDate(e.date || e.createdAt),
        weightText(e.weight, e.weightUnit || 'kg', units),
        e.notes || '—',
      ]),
    });
  }

  return sections;
};

const buildCompleteSections = (report, units) => {
  const w = report.workouts || {};
  const n = report.nutrition || {};
  const p = report.progress || {};

  const sections = [
    {
      title: 'Overview',
      type: 'kv',
      items: [
        ['Workouts logged', num(w.total)],
        ['Calories burned', w.caloriesBurned != null ? `${w.caloriesBurned} kcal` : '—'],
        ['Meals logged', num(n.totalMeals)],
        ['Total calories', n.calories != null ? `${n.calories} kcal` : '—'],
        ['Check-ins logged', num(p.totalCheckIns)],
        ['Weight change', withSign(wt(p.weightChange, p.weightUnit || 'kg', units), units.weightUnit)],
      ],
    },
  ];

  if (w.data?.length) {
    sections.push({
      title: 'Workouts',
      type: 'table',
      headers: ['Date', 'Name', 'Category', 'Exercises'],
      rows: w.data.map((x) => [
        formatDate(x.date || x.createdAt),
        x.name,
        x.category || '—',
        (x.exercises || []).length,
      ]),
    });
  }

  if (n.data?.length) {
    sections.push({
      title: 'Meals',
      type: 'table',
      headers: ['Date', 'Meal', 'Foods', 'Calories'],
      rows: n.data.map((m) => [
        formatDate(m.date || m.createdAt),
        m.mealType || '—',
        (m.foods || []).map((f) => f.name).join(', ') || '—',
        (m.foods || []).reduce((sum, f) => sum + (Number(f.calories) || 0), 0),
      ]),
    });
  }

  if (p.data?.length) {
    sections.push({
      title: 'Progress check-ins',
      type: 'table',
      headers: ['Date', 'Weight', 'Notes'],
      rows: p.data.map((e) => [
        formatDate(e.date || e.createdAt),
        weightText(e.weight, e.weightUnit || 'kg', units),
        e.notes || '—',
      ]),
    });
  }

  return sections;
};

const buildSections = (report, units) => {
  if (!report) return [];
  switch (report.type) {
    case 'workout':
      return buildWorkoutSections(report);
    case 'nutrition':
      return buildNutritionSections(report);
    case 'progress':
      return buildProgressSections(report, units);
    case 'complete':
      return buildCompleteSections(report, units);
    default:
      return [];
  }
};

// ==========================================
// CSV export
// ==========================================

const csvEscape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const downloadCSV = (report, filename, units) => {
  const sections = buildSections(report, units);
  const lines = [];

  if (report?.period) {
    lines.push([`Period: ${formatDate(report.period.startDate)} - ${formatDate(report.period.endDate)}`]);
    lines.push([]);
  }

  sections.forEach((section) => {
    lines.push([section.title]);
    if (section.type === 'kv') {
      section.items.forEach(([label, value]) => lines.push([label, value]));
    } else {
      lines.push(section.headers);
      section.rows.forEach((row) => lines.push(row));
    }
    lines.push([]);
  });

  const csvContent = lines.map((row) => row.map(csvEscape).join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ==========================================
// Print / PDF export
// ==========================================

const printAsPDF = (report, title, units) => {
  const sections = buildSections(report, units);
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) return;

  const sectionHtml = sections
    .map((section) => {
      if (section.type === 'kv') {
        const rows = section.items
          .map(
            ([label, value]) =>
              `<tr><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;">${label}</td><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;font-weight:600;">${value}</td></tr>`
          )
          .join('');
        return `<h2 style="font-size:15px;margin:24px 0 8px;">${section.title}</h2><table style="width:100%;border-collapse:collapse;">${rows}</table>`;
      }

      const head = section.headers
        .map(
          (h) =>
            `<th style="text-align:left;padding:6px 12px;border-bottom:2px solid #111;font-size:12px;color:#6b7280;text-transform:uppercase;">${h}</th>`
        )
        .join('');
      const body = section.rows
        .map(
          (row) =>
            `<tr>${row
              .map((cell) => `<td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${cell}</td>`)
              .join('')}</tr>`
        )
        .join('');

      return `<h2 style="font-size:15px;margin:24px 0 8px;">${section.title}</h2><table style="width:100%;border-collapse:collapse;"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
    })
    .join('');

  const periodHtml = report?.period
    ? `<p style="color:#9ca3af;font-size:12px;margin:0 0 24px;">${formatDate(report.period.startDate)} – ${formatDate(report.period.endDate)}</p>`
    : '';

  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: -apple-system, Arial, sans-serif; padding: 32px; color: #111; }
          h1 { font-size: 20px; margin-bottom: 4px; }
          p.date { color: #9ca3af; font-size: 12px; margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p class="date">Generated ${new Date().toLocaleString()}</p>
        ${periodHtml}
        ${sectionHtml}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
};

/**
 * report: the plain object returned by the current report thunk (workoutReport,
 * nutritionReport, progressReport, or completeReport).
 */
const ExportButtons = ({ report, title = 'Report' }) => {
  const disabled = !report;
  const units = useUnits();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => downloadCSV(report, `${title.toLowerCase().replace(/\s+/g, '-')}.csv`, units)}
        disabled={disabled}
        className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white text-sm font-medium rounded-lg hover:border-lime-400 dark:hover:border-lime-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Download size={15} />
        Export CSV
      </button>
      <button
        onClick={() => printAsPDF(report, title, units)}
        disabled={disabled}
        className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white text-sm font-medium rounded-lg hover:border-lime-400 dark:hover:border-lime-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Printer size={15} />
        Export PDF
      </button>
    </div>
  );
};

export default ExportButtons;