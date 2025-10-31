/**
 * LinkedInputs - Synchronized input controls
 *
 * Manages multiple InputNumber components that can be linked together.
 * When linked, changing one input updates all others.
 */

export { LinkedInputs } from './LinkedInputs';
export type {
  LinkedInputsOptions,
  LinkedInputItemConfig,
  LinkedInputItem,
  LinkedInputItemWithLabel,
  InputNumberConfig,
  LinkedInputItemChangeCallback,
} from './linked-inputs.types';
