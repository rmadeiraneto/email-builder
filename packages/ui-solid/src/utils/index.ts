/**
 * Re-export utilities from ui-components for use in SolidJS components
 * This ensures proper module resolution
 */

// Re-export all utilities from the base package source files (for Vite dev mode compatibility)
export { classNames, getComponentClasses } from '../../../ui-components/src/utils/classNames';
export { getValidationAriaProps, getAriaProps, setAriaAttribute } from '../../../ui-components/src/utils/aria';
export { mergeProps as mergePropsUtil, pickDefined, pickEventHandlers, omitEventHandlers } from '../../../ui-components/src/utils/props';
