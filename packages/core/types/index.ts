/**
 * Core type exports
 */

// Configuration and commands
export * from './config.types';
export * from './command.types';
export * from './event.types';

// Component types
export * from './component.types';
export * from './base-components.types';
export * from './email-components.types';

// Template types
export * from './template.types';

// Responsive types (exclude ResponsiveVisibility to avoid conflict with component.types)
export {
  DeviceType,
  type BreakpointDefinition,
  type ResponsivePropertyValue,
  type ResponsiveSpacing,
  type ResponsiveStyles,
  type ComponentResponsiveConfig,
  BreakpointStrategy,
  type ResponsiveExportOptions,
  type ResponsivePreviewState,
  type MediaQuery,
  DEFAULT_BREAKPOINTS,
  getDefaultResponsiveVisibility,
  getDefaultResponsiveConfig,
  isVisibleOnDevice,
  getResponsiveValue,
} from './responsive.types';
