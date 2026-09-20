export const isRequired = (value) =>
  value !== undefined && value !== null && String(value).trim() !== '';

export const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ''));

export const isPositiveNumber = (value) => {
  const n = Number(value);
  return !Number.isNaN(n) && n > 0;
};

export const isValidDateRange = (start, end) => {
  if (!start || !end) return false;
  return new Date(start) <= new Date(end);
};

export const validateSearchQuery = (query) => {
  if (!query || query.trim().length === 0) {
    return { valid: false, message: 'Enter a search term' };
  }
  if (query.trim().length < 2) {
    return { valid: false, message: 'Type at least 2 characters' };
  }
  return { valid: true, message: '' };
};