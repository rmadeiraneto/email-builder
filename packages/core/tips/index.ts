/**
 * Best practices tips module
 *
 * Provides helpful tips and best practices for email design
 *
 * @module tips
 */

// Types
export type { Tip, DismissedTips, TipsQuery } from './tips.types';
export { TipCategory, TipSeverity, TipTrigger } from './tips.types';

// Data
export {
  TIPS_DATABASE,
  getTipById,
  getTipsByCategory,
  getTipsByTrigger,
  getTipsBySeverity,
  getRandomTip,
  searchTips,
} from './tips-data';
