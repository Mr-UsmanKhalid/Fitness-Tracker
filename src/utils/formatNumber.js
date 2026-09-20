export const formatNumber = (value, decimals = 0) => {
  const n = Number(value);
  if (Number.isNaN(n)) return '0';
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatCalories = (value) => `${formatNumber(value)} kcal`;
export const formatWeight = (value, unit = 'kg') => `${formatNumber(value, 1)} ${unit}`;
export const formatPercent = (value) => `${Math.round(Number(value) || 0)}%`;

export const clampPercent = (value) => Math.min(Math.max(Number(value) || 0, 0), 100);