/**
 * Re-export utilities from ui-components for use in SolidJS components
 * This ensures proper module resolution
 */

// Re-export all utilities from the ui-components package
export { classNames, getComponentClasses, bemToCamelCase, getStyleClass, createBEM } from '@email-builder/ui-components/utils';
export type { BEMHelper } from '@email-builder/ui-components/utils';
export { getValidationAriaProps, getAriaProps, setAriaAttribute } from '@email-builder/ui-components/utils';
export { mergeProps as mergePropsUtil, pickDefined, pickEventHandlers, omitEventHandlers } from '@email-builder/ui-components/utils';
