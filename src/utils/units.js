import { getPreferences } from './preferences';

/**
 * Unit helpers driven by the Settings > "Units of Measurement" preference
 * (prefs.units === 'metric' | 'imperial').
 *
 * Stored data is never rewritten: every entry keeps the unit it was logged in
 * (weightUnit / measurementUnit). These helpers convert at display time, so
 * mixed kg/lbs history always lands on one scale.
 */

const KG_PER_LB = 0.45359237;
const CM_PER_IN = 2.54;

export const weightUnitFor = (system) => (system === 'imperial' ? 'lbs' : 'kg');
export const lengthUnitFor = (system) => (system === 'imperial' ? 'in' : 'cm');

// Accepts 'lb' / 'lbs' and 'in' / 'inch' / 'inches'; anything else falls back to metric
const normWeightUnit = (unit) => (unit === 'lb' || unit === 'lbs' ? 'lbs' : 'kg');
const normLengthUnit = (unit) =>
  unit === 'in' || unit === 'inch' || unit === 'inches' ? 'in' : 'cm';

const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
};

/** Null-safe rounding to 1 decimal place. */
export const round1 = (value) =>
  value === null || value === undefined ? null : Math.round(value * 10) / 10;

/**
 * Convert a weight from `fromUnit` into the unit of `system`. Not rounded, so
 * differences between two converted values stay accurate. Returns null when
 * there is no usable value.
 */
export const convertWeight = (value, fromUnit, system) => {
  const n = toNumber(value);
  if (n === null) return null;
  const from = normWeightUnit(fromUnit);
  const to = weightUnitFor(system);
  if (from === to) return n;
  return from === 'kg' ? n / KG_PER_LB : n * KG_PER_LB;
};

/** Same as convertWeight, for body measurements (cm <-> in). */
export const convertLength = (value, fromUnit, system) => {
  const n = toNumber(value);
  if (n === null) return null;
  const from = normLengthUnit(fromUnit);
  const to = lengthUnitFor(system);
  if (from === to) return n;
  return from === 'cm' ? n / CM_PER_IN : n * CM_PER_IN;
};

/** Convenience: converted + rounded to 1 decimal, ready to display. */
export const toDisplayWeight = (value, fromUnit, system) =>
  round1(convertWeight(value, fromUnit, system));

export const toDisplayLength = (value, fromUnit, system) =>
  round1(convertLength(value, fromUnit, system));

export const getUnitSystem = () =>
  getPreferences()?.units === 'imperial' ? 'imperial' : 'metric';

/**
 * Reads the saved preference. Components remount when you navigate, so a change
 * made in Settings is picked up the next time a page renders.
 * Returns { system: 'metric' | 'imperial', weightUnit: 'kg' | 'lbs', lengthUnit: 'cm' | 'in' }
 */
export const useUnits = () => {
  const system = getUnitSystem();
  return {
    system,
    weightUnit: weightUnitFor(system),
    lengthUnit: lengthUnitFor(system),
  };
};