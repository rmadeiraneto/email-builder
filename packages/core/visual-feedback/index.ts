/**
 * Visual Property Feedback System
 *
 * Provides immediate visual feedback when users interact with property controls,
 * creating an intuitive connection between UI controls and their effects on the canvas.
 *
 * @packageDocumentation
 */

// Export all types
export type {
  // Property and overlay types
  PropertyType,
  OverlayType,
  FeedbackMode,
  RegionType,
  MeasurementType,
  OffScreenDirection,
  IndicatorPosition,

  // Configuration types
  AnimationConfig,
  HighlightConfig,
  PropertyIndicatorConfig,
  PerformanceConfig,
  VisualFeedbackConfig,

  // Property mapping types
  VisualTarget,
  PropertyVisualMapping,
  ComponentPropertyMappings,

  // Overlay types
  OverlayData,
  MeasurementOverlayData,
  RegionHighlightData,
  PropertyIndicatorData,
  Overlay,

  // Animation types
  AnimationOptions,
  AnimationState,
  AnimationRegistryEntry,

  // Event types
  PropertyHoverEvent,
  PropertyEditEvent,
  PropertyChangeEvent,
  CanvasViewportEvent,

  // Off-screen indicator types
  OffScreenElement,
  OffScreenIndicatorData,

  // Performance monitoring types
  PerformanceStats,
  PerformanceThresholds,

  // Manager configuration types
  OverlayManagerConfig,
  AnimationControllerConfig,
  VisualFeedbackManagerConfig,
} from './visual-feedback.types';

// Export default configurations
export {
  DEFAULT_ANIMATION_CONFIG,
  DEFAULT_HIGHLIGHT_CONFIG,
  DEFAULT_PROPERTY_INDICATOR_CONFIG,
  DEFAULT_PERFORMANCE_CONFIG,
  DEFAULT_VISUAL_FEEDBACK_CONFIG,
  DEFAULT_PERFORMANCE_THRESHOLDS,
} from './visual-feedback.types';

// Export PropertyMappingRegistry
export {
  PropertyMappingRegistry,
  getPropertyMappingRegistry,
  resetPropertyMappingRegistry,
} from './PropertyMappingRegistry';

// Export AnimationController
export { AnimationController } from './AnimationController';
