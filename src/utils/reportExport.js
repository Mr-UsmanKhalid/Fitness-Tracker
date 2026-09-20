/*
  Turns the raw report object from the backend into something a person can read.

  buildReportDocument(report, title)  ->  { title, generated, period, sections }
  reportToCSV(doc)                    ->  string (open it in Excel / Sheets)
  reportToHTML(doc)                   ->  string (print window -> "Save as PDF")

  A section looks like:
  { title, stats: [[label, value], ...], columns?: [...], rows?: [[...], ...], emptyText? }

  Mongo internals (_id, __v, user, createdAt, updatedAt) and raw JSON are never shown.
*/

/* ------------------------------ helpers ------------------------------ */

const HIDDEN_KEYS = new Set([
  '_id', '__v', 'user', 'type', 'data', 'period', 'createdAt', 'updatedAt',
]);

const round1 = (n) => Math.round(n * 10) / 10;

const capitalize = (s) => (s ? String(s).charAt(0).toUpperCase() + String(s).slice(1) : '');

/* "totalMeals" -> "Total meals" */
const humanize = (key) =>
  capitalize(
    String(key)
      .replace(/([A-Z])/g, ' $1')
      .replace(/[_-]+/g, ' ')
      .trim()
      .toLowerCase()
  );

/* Dates stored as midnight UTC are calendar dates, so show them in UTC
   (otherwise users west of UTC would see the day before). */
const isDateOnly = (v) => typeof v === 'string' && /T00:00:00(\.000)?Z$/.test(v);

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: isDateOnly(value) ? 'UTC' : undefined,
  });
};

const formatValue = (v) => {
  if (v === null || v === undefined || v === '') return '—';
  if (typeof v === 'number') return round1(v).toLocaleString();
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)) return formatDate(v);
  return String(v);
};

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/* Top-level numbers/strings of an object as [label, value] pairs */
const scalarStats = (obj, labels = {}) =>
  Object.entries(obj || {})
    .filter(([key, value]) => !HIDDEN_KEYS.has(key) && (value === null || typeof value !== 'object'))
    .map(([key, value]) => [labels[key] || humanize(key), formatValue(value)]);

const normalize = (value) =>
  Array.isArray(value) ? { total: value.length, data: value } : value || {};

const sumField = (foods, field) =>
  round1((foods || []).reduce((total, food) => total + (Number(food[field]) || 0), 0));

/* ------------------------------ sections ------------------------------ */

const exercisesText = (exercises) =>
  (exercises || [])
    .map((e) => {
      const load = Number(e.weight) > 0 ? ` @ ${e.weight} ${e.weightUnit || 'kg'}` : '';
      return `${e.name || 'Exercise'} – ${e.sets || 0}×${e.reps || 0}${load}`;
    })
    .join('; ');

const workoutsSection = (obj) => {
  const data = Array.isArray(obj.data) ? obj.data : [];
  const stats = scalarStats(obj, { total: 'Workouts logged', totalWorkouts: 'Workouts logged' });

  const volume = data.reduce(
    (sum, w) =>
      sum +
      (w.exercises || []).reduce(
        (s, e) => s + (Number(e.sets) || 0) * (Number(e.reps) || 0) * (Number(e.weight) || 0),
        0
      ),
    0
  );
  if (volume > 0) {
    const unit = data[0]?.exercises?.[0]?.weightUnit || 'kg';
    stats.push(['Total volume', `${round1(volume).toLocaleString()} ${unit}`]);
  }

  return {
    title: 'Workouts',
    stats,
    columns: ['Date', 'Workout', 'Category', 'Exercises', 'Notes'],
    rows: data.map((w) => [
      formatDate(w.date || w.createdAt),
      w.name || '—',
      capitalize(w.category) || '—',
      exercisesText(w.exercises) || '—',
      w.notes || '',
    ]),
    emptyText: 'No workouts in this period.',
  };
};

const foodsText = (foods) =>
  (foods || [])
    .map((f) => {
      const qty = Number(f.quantity) > 0 ? ` (${f.quantity} ${f.unit || 'g'})` : '';
      return `${f.name || 'Food'}${qty}`;
    })
    .join('; ');

const nutritionSection = (obj) => {
  const data = Array.isArray(obj.data) ? obj.data : [];
  const stats = scalarStats(obj, {
    total: 'Meals logged',
    totalMeals: 'Meals logged',
    calories: 'Total calories (kcal)',
    protein: 'Total protein (g)',
    carbs: 'Total carbs (g)',
    fat: 'Total fat (g)',
  });

  return {
    title: 'Nutrition',
    stats,
    columns: ['Date', 'Meal', 'Foods', 'Calories (kcal)', 'Protein (g)', 'Carbs (g)', 'Fat (g)', 'Notes'],
    rows: data.map((m) => [
      formatDate(m.date || m.createdAt),
      capitalize(m.mealType) || '—',
      foodsText(m.foods) || '—',
      sumField(m.foods, 'calories'),
      sumField(m.foods, 'protein'),
      sumField(m.foods, 'carbs'),
      sumField(m.foods, 'fat'),
      m.notes || '',
    ]),
    emptyText: 'No meals in this period.',
  };
};

const LIFT_KEYS = new Set(['benchPress', 'squat', 'deadlift']);

const measurementsText = (measurements, unit) =>
  Object.entries(measurements || {})
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => `${humanize(k)} ${v} ${unit || 'cm'}`)
    .join(', ');

const performanceText = (performance, weightUnit) =>
  Object.entries(performance || {})
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => `${humanize(k)} ${v}${LIFT_KEYS.has(k) ? ` ${weightUnit || 'kg'}` : ''}`)
    .join(', ');

const progressSection = (obj) => {
  const data = Array.isArray(obj.data) ? obj.data : [];
  const stats = scalarStats(obj, {
    total: 'Check-ins logged',
    totalCheckIns: 'Check-ins logged',
    startingWeight: 'Starting weight',
    currentWeight: 'Current weight',
    weightChange: 'Weight change',
  });

  return {
    title: 'Progress',
    stats,
    columns: ['Date', 'Weight', 'Measurements', 'Performance', 'Notes'],
    rows: data.map((e) => [
      formatDate(e.date || e.createdAt),
      e.weight !== null && e.weight !== undefined ? `${e.weight} ${e.weightUnit || 'kg'}` : '—',
      measurementsText(e.measurements, e.measurementUnit) || '—',
      performanceText(e.performance, e.weightUnit) || '—',
      e.notes || '',
    ]),
    emptyText: 'No check-ins in this period.',
  };
};

const genericSection = (title, obj) => ({
  title,
  stats: scalarStats(obj),
});

/* ------------------------------ document ------------------------------ */

const TYPE_BUILDERS = {
  workout: workoutsSection,
  nutrition: nutritionSection,
  progress: progressSection,
};

export const buildReportDocument = (report, title = 'Report') => {
  const source = report || {};
  const sections = [];

  const isOverview = ['workouts', 'nutrition', 'progress'].some(
    (key) => source[key] && typeof source[key] === 'object'
  );

  if (isOverview) {
    if (source.workouts) sections.push(workoutsSection(normalize(source.workouts)));
    if (source.nutrition) sections.push(nutritionSection(normalize(source.nutrition)));
    if (source.progress) sections.push(progressSection(normalize(source.progress)));

    Object.entries(source).forEach(([key, value]) => {
      if (HIDDEN_KEYS.has(key) || ['workouts', 'nutrition', 'progress'].includes(key)) return;
      if (isPlainObject(value)) sections.push(genericSection(humanize(key), value));
    });
  } else if (TYPE_BUILDERS[source.type]) {
    sections.push(TYPE_BUILDERS[source.type](source));
  } else {
    // Unknown shape (e.g. a goals report): show its numbers, then any nested groups
    const topStats = scalarStats(source);
    if (topStats.length) sections.push({ title: 'Summary', stats: topStats });
    Object.entries(source).forEach(([key, value]) => {
      if (HIDDEN_KEYS.has(key)) return;
      if (isPlainObject(value)) sections.push(genericSection(humanize(key), value));
    });
  }

  const period = source.period?.startDate
    ? `${formatDate(source.period.startDate)} – ${formatDate(source.period.endDate)}`
    : null;

  return {
    title,
    generated: new Date().toLocaleString(),
    period,
    sections,
  };
};

/* -------------------------------- CSV --------------------------------- */

/* Stops Excel treating text such as "=SUM(...)" as a formula */
const safeCell = (cell) => {
  const text = String(cell ?? '');
  return /^[=+\-@]/.test(text) && !/^-?\d/.test(text) ? `'${text}` : text;
};

const csvLine = (cells) =>
  cells.map((cell) => `"${safeCell(cell).replace(/"/g, '""')}"`).join(',');

export const reportToCSV = (doc) => {
  const lines = [csvLine([doc.title]), csvLine(['Generated', doc.generated])];
  if (doc.period) lines.push(csvLine(['Period', doc.period]));

  doc.sections.forEach((section) => {
    lines.push('', csvLine([section.title]));
    section.stats.forEach(([label, value]) => lines.push(csvLine([label, value])));

    if (section.columns) {
      lines.push('');
      if (section.rows.length === 0) {
        lines.push(csvLine([section.emptyText]));
      } else {
        lines.push(csvLine(section.columns));
        section.rows.forEach((row) => lines.push(csvLine(row)));
      }
    }
  });

  // BOM so Excel reads the file as UTF-8 (keeps ×, – and non-English names intact)
  return `\uFEFF${lines.join('\r\n')}`;
};

/* -------------------------------- HTML -------------------------------- */

const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const NUMERIC_COLUMN = /\((kcal|g)\)$/;

export const reportToHTML = (doc) => {
  const sectionsHtml = doc.sections
    .map((section) => {
      const stats = section.stats.length
        ? `<div class="stats">${section.stats
            .map(
              ([label, value]) =>
                `<div class="stat"><div class="stat-label">${esc(label)}</div><div class="stat-value">${esc(value)}</div></div>`
            )
            .join('')}</div>`
        : '';

      let table = '';
      if (section.columns) {
        if (section.rows.length === 0) {
          table = `<p class="empty">${esc(section.emptyText)}</p>`;
        } else {
          const head = section.columns
            .map((c) => `<th class="${NUMERIC_COLUMN.test(c) ? 'num' : ''}">${esc(c)}</th>`)
            .join('');
          const body = section.rows
            .map(
              (row) =>
                `<tr>${row
                  .map(
                    (cell, i) =>
                      `<td class="${NUMERIC_COLUMN.test(section.columns[i]) ? 'num' : ''}">${esc(cell)}</td>`
                  )
                  .join('')}</tr>`
            )
            .join('');
          table = `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
        }
      }

      return `<section><h2>${esc(section.title)}</h2>${stats}${table}</section>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${esc(doc.title)}</title>
    <style>
      @page { margin: 16mm; }
      * { box-sizing: border-box; }
      body { font-family: -apple-system, "Segoe UI", Arial, sans-serif; color: #111; font-size: 12px; margin: 0; padding: 24px; }
      h1 { font-size: 22px; margin: 0 0 4px; }
      .meta { color: #6b7280; font-size: 12px; margin: 0 0 2px; }
      h2 { font-size: 15px; margin: 28px 0 10px; padding-bottom: 6px; border-bottom: 2px solid #a3e635; }
      .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 14px; }
      .stat { border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 10px; }
      .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: .04em; color: #6b7280; }
      .stat-value { font-size: 16px; font-weight: 700; margin-top: 2px; }
      table { width: 100%; border-collapse: collapse; }
      th { text-align: left; background: #f3f4f6; font-size: 11px; padding: 7px 8px; border-bottom: 1px solid #d1d5db; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      td { padding: 7px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
      th.num, td.num { text-align: right; white-space: nowrap; }
      tr { page-break-inside: avoid; }
      section { page-break-inside: auto; }
      .empty { color: #9ca3af; font-style: italic; }
    </style>
  </head>
  <body>
    <h1>${esc(doc.title)}</h1>
    ${doc.period ? `<p class="meta">Period: ${esc(doc.period)}</p>` : ''}
    <p class="meta">Generated ${esc(doc.generated)}</p>
    ${sectionsHtml}
  </body>
</html>`;
};