/**
 * Built-in Helper Functions
 *
 * These helpers can be used in templates for common operations
 * like formatting, string manipulation, and logic.
 */

import { HelperFunction } from './data-injection.types';

/**
 * Format a date using a simple format string
 */
export const formatDate: HelperFunction = (date: unknown, format?: string): string => {
  if (!date) return '';

  const dateObj = date instanceof Date ? date : new Date(String(date));

  if (isNaN(dateObj.getTime())) {
    return String(date);
  }

  const formatStr = String(format || 'YYYY-MM-DD');

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');

  return formatStr
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * Format a number as currency
 */
export const formatCurrency: HelperFunction = (
  amount: unknown,
  currency = 'USD'
): string => {
  const num = Number(amount);

  if (isNaN(num)) {
    return String(amount);
  }

  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
  };

  const symbol = currencySymbols[String(currency)] || String(currency);
  const formatted = num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return `${symbol}${formatted}`;
};

/**
 * Convert string to uppercase
 */
export const upper: HelperFunction = (text: unknown): string => {
  return String(text).toUpperCase();
};

/**
 * Convert string to lowercase
 */
export const lower: HelperFunction = (text: unknown): string => {
  return String(text).toLowerCase();
};

/**
 * Capitalize first letter
 */
export const capitalize: HelperFunction = (text: unknown): string => {
  const str = String(text);
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate text to specified length
 */
export const truncate: HelperFunction = (text: unknown, length = 100): string => {
  const str = String(text);
  const maxLength = Number(length);

  if (str.length <= maxLength) {
    return str;
  }

  return str.substring(0, maxLength) + '...';
};

/**
 * Return default value if first value is falsy
 */
export const defaultValue: HelperFunction = (value: unknown, fallback: unknown): string | number | boolean => {
  if (value === null || value === undefined || value === '') {
    return String(fallback);
  }
  return value as string | number | boolean;
};

/**
 * Join array with separator
 */
export const join: HelperFunction = (items: unknown, separator = ', '): string => {
  if (Array.isArray(items)) {
    return items.join(String(separator));
  }
  return String(items);
};

/**
 * Get length of array or string
 */
export const length: HelperFunction = (value: unknown): number => {
  if (Array.isArray(value) || typeof value === 'string') {
    return value.length;
  }
  return 0;
};

/**
 * Add two numbers
 */
export const add: HelperFunction = (a: unknown, b: unknown): number => {
  return Number(a) + Number(b);
};

/**
 * Subtract two numbers
 */
export const subtract: HelperFunction = (a: unknown, b: unknown): number => {
  return Number(a) - Number(b);
};

/**
 * Multiply two numbers
 */
export const multiply: HelperFunction = (a: unknown, b: unknown): number => {
  return Number(a) * Number(b);
};

/**
 * Divide two numbers
 */
export const divide: HelperFunction = (a: unknown, b: unknown): number => {
  const divisor = Number(b);
  if (divisor === 0) return 0;
  return Number(a) / divisor;
};

/**
 * Check equality
 */
export const eq: HelperFunction = (a: unknown, b: unknown): boolean => {
  return a === b;
};

/**
 * Check inequality
 */
export const ne: HelperFunction = (a: unknown, b: unknown): boolean => {
  return a !== b;
};

/**
 * Greater than comparison
 */
export const gt: HelperFunction = (a: unknown, b: unknown): boolean => {
  return Number(a) > Number(b);
};

/**
 * Less than comparison
 */
export const lt: HelperFunction = (a: unknown, b: unknown): boolean => {
  return Number(a) < Number(b);
};

/**
 * Greater than or equal comparison
 */
export const gte: HelperFunction = (a: unknown, b: unknown): boolean => {
  return Number(a) >= Number(b);
};

/**
 * Less than or equal comparison
 */
export const lte: HelperFunction = (a: unknown, b: unknown): boolean => {
  return Number(a) <= Number(b);
};

/**
 * Logical AND
 */
export const and: HelperFunction = (...args: unknown[]): boolean => {
  return args.every(arg => Boolean(arg));
};

/**
 * Logical OR
 */
export const or: HelperFunction = (...args: unknown[]): boolean => {
  return args.some(arg => Boolean(arg));
};

/**
 * Logical NOT
 */
export const not: HelperFunction = (value: unknown): boolean => {
  return !value;
};

/**
 * All built-in helpers
 */
export const builtInHelpers: Record<string, HelperFunction> = {
  formatDate,
  formatCurrency,
  upper,
  lower,
  capitalize,
  truncate,
  default: defaultValue,
  join,
  length,
  add,
  subtract,
  multiply,
  divide,
  eq,
  ne,
  gt,
  lt,
  gte,
  lte,
  and,
  or,
  not,
};
