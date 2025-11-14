/**
 * Mobile Development Mode
 *
 * Exports mobile development mode types and utilities
 */

// Export mobile types (excluding conflicts with other modules)
export {
  DeviceMode,
  type ResponsiveCanvasSettings,
  type ModeManagerState,
  type MobileDevModeConfig,
  type ComponentOrder,
  type ComponentVisibility,
  type MobileOverride,
  DEFAULT_MOBILE_DEV_MODE_CONFIG,
} from './mobile.types';

// Re-export with different names to avoid conflicts
export type { ResponsiveStyles as MobileResponsiveStyles } from './mobile.types';

// Export mobile managers and services
export * from './ModeManager';

// PropertyOverrideManager: exclude PropertyCategory to avoid conflict with compatibility module
export {
  type PropertyOverrideManagerOptions,
  PropertyOverrideManager,
  type PropertyOverrideResult,
  type BulkOverrideResult,
} from './PropertyOverrideManager';

export * from './MobileLayoutManager';
export * from './ModeSwitcher';
export * from './KeyboardShortcuts';
export * from './PropertyPanelIntegration';
export * from './DiffCalculator';
export * from './CanvasRenderer';
export * from './CanvasManager';
export * from './MobileDefaultsApplicator';
export * from './MobileExportService';

// ValidationService: export ValidationResult as MobileValidationResult to avoid conflict
export {
  ValidationEvent,
  type ValidationResult as MobileValidationResult,
  type ValidationServiceOptions,
  DEFAULT_VALIDATION_RULES,
  ValidationService,
} from './ValidationService';

export * from './PerformanceOptimizer';
