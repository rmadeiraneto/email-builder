/**
 * Visual Property Feedback System - Type Definitions
 *
 * Provides immediate visual feedback when users interact with property controls,
 * creating an intuitive connection between UI controls and their effects on the canvas.
 *
 * @module visual-feedback
 */

/**
 * Property types for categorizing different kinds of properties
 */
export type PropertyType =
  | 'spacing'      // padding, margin, gap
  | 'size'         // width, height, max-width, max-height
  | 'color'        // color, background-color, border-color
  | 'border'       // border-width, border-radius, border-style
  | 'typography'   // font-size, line-height, letter-spacing
  | 'effect'       // opacity, box-shadow, text-shadow
  | 'position'     // top, left, right, bottom
  | 'layout'       // display, flex, grid properties
  | 'content'      // text, alt text, URLs
  | 'structural'   // component type, layout type
  | 'default';     // fallback for unknown types

/**
 * Overlay types for different kinds of visual feedback
 */
export type OverlayType =
  | 'measurement'  // Measurement lines with pixel values
  | 'region'       // Highlighted regions (padding, margin)
  | 'outline'      // Element outlines
  | 'indicator';   // Property name indicators

/**
 * Visual feedback mode
 */
export type FeedbackMode =
  | 'hover'   // Hovering over property input
  | 'active'  // Actively editing property
  | 'off';    // No feedback

/**
 * Region types for spacing and layout properties
 */
export type RegionType =
  | 'padding'
  | 'margin'
  | 'content'
  | 'border'
  | 'all';

/**
 * Measurement direction for dimension indicators
 */
export type MeasurementType =
  | 'horizontal'
  | 'vertical'
  | 'both';

/**
 * Off-screen indicator direction
 */
export type OffScreenDirection =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right';

/**
 * Position for property name indicators
 */
export type IndicatorPosition =
  | 'near-component'  // Position near the affected component
  | 'fixed-top'       // Fixed at top of canvas
  | 'fixed-bottom';   // Fixed at bottom of canvas

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Animation configuration
 */
export interface AnimationConfig {
  /** Enable/disable all animations */
  enabled: boolean;

  /** Animation durations (in milliseconds) per property type */
  durations: {
    spacing: number;
    color: number;
    layout: number;
    typography: number;
    border: number;
    effect: number;
    default: number;
  };

  /** Easing functions per property type */
  easing: {
    spacing: string;
    color: string;
    layout: string;
    typography: string;
    border: string;
    effect: string;
    default: string;
  };
}

/**
 * Highlight overlay configuration
 */
export interface HighlightConfig {
  /** Enable/disable highlight overlays */
  enabled: boolean;

  /** Primary color for highlights (CSS color value) */
  color: string;

  /** Opacity for highlight overlays (0-1) */
  opacity: number;

  /** Show pixel values on measurement lines */
  showValues: boolean;
}

/**
 * Property indicator configuration (for non-visual properties)
 */
export interface PropertyIndicatorConfig {
  /** Enable/disable property indicators */
  enabled: boolean;

  /** Duration to show indicator (in milliseconds) */
  duration: number;

  /** Position of indicator */
  position: IndicatorPosition;
}

/**
 * Performance configuration
 */
export interface PerformanceConfig {
  /** Debounce delay for rapid changes (in milliseconds) */
  debounceDelay: number;

  /** Maximum number of simultaneous animations */
  maxSimultaneousAnimations: number;

  /** Enable performance monitoring */
  enableMonitoring: boolean;
}

/**
 * Main visual feedback configuration
 */
export interface VisualFeedbackConfig {
  /** Global enable/disable for entire visual feedback system */
  enabled: boolean;

  /** Animation configuration */
  animations: AnimationConfig;

  /** Highlight overlay configuration */
  highlights: HighlightConfig;

  /** Property indicator configuration */
  propertyIndicators: PropertyIndicatorConfig;

  /** Respect browser's prefers-reduced-motion setting */
  respectReducedMotion: boolean;

  /** Performance configuration */
  performance: PerformanceConfig;
}

// ============================================================================
// Property Mapping Types
// ============================================================================

/**
 * Visual target for a property mapping
 */
export interface VisualTarget {
  /** Type of visual feedback to show */
  type: PropertyType;

  /** Optional CSS selector for target elements */
  selector?: string;

  /** Region to highlight (for spacing properties) */
  region?: RegionType;

  /** Measurement direction (for size/spacing properties) */
  measurementType?: MeasurementType;

  /** Custom overlay renderer (for complex cases) */
  customRenderer?: string;
}

/**
 * Mapping from property path to visual feedback
 */
export interface PropertyVisualMapping {
  /** Property path (e.g., 'content.padding', 'styles.backgroundColor') */
  propertyPath: string;

  /** Component type this mapping applies to */
  componentType?: string;

  /** Visual target configuration */
  visualTarget: VisualTarget;

  /** Human-readable description */
  description?: string;
}

/**
 * Collection of mappings for a component type
 */
export interface ComponentPropertyMappings {
  /** Component type identifier */
  componentType: string;

  /** Property mappings for this component */
  mappings: Record<string, PropertyVisualMapping>;
}

// ============================================================================
// Overlay Types
// ============================================================================

/**
 * Base overlay data
 */
export interface OverlayData {
  /** Target HTML element */
  targetElement: HTMLElement;

  /** Property path being edited */
  propertyPath: string;

  /** Current value */
  value: any;

  /** Visual mapping configuration */
  visualMapping: PropertyVisualMapping;

  /** Feedback mode */
  mode: FeedbackMode;
}

/**
 * Measurement overlay data (extends base overlay)
 */
export interface MeasurementOverlayData extends OverlayData {
  /** Measurement direction */
  measurementType: MeasurementType;

  /** Region being measured */
  region: RegionType;

  /** Show pixel value */
  showValue: boolean;

  /** Measurement color */
  color: string;
}

/**
 * Region highlight overlay data (extends base overlay)
 */
export interface RegionHighlightData extends OverlayData {
  /** Region to highlight */
  region: RegionType;

  /** Highlight color */
  color: string;

  /** Opacity */
  opacity: number;
}

/**
 * Property indicator data (for non-visual properties)
 */
export interface PropertyIndicatorData extends OverlayData {
  /** Property display name */
  propertyName: string;

  /** New value to display */
  displayValue: string;

  /** Duration to show (in milliseconds) */
  duration: number;

  /** Position */
  position: IndicatorPosition;
}

/**
 * Overlay instance
 */
export interface Overlay {
  /** Unique overlay ID */
  id: string;

  /** Overlay type */
  type: OverlayType;

  /** Overlay data */
  data: OverlayData | MeasurementOverlayData | RegionHighlightData | PropertyIndicatorData;

  /** Container element (created by overlay manager) */
  containerElement?: HTMLElement;

  /** Created timestamp */
  createdAt: number;
}

// ============================================================================
// Animation Types
// ============================================================================

/**
 * Animation options
 */
export interface AnimationOptions {
  /** Duration in milliseconds */
  duration: number;

  /** Easing function (CSS easing or cubic-bezier) */
  easing: string;

  /** Delay before starting (in milliseconds) */
  delay?: number;

  /** Fill mode */
  fill?: FillMode;
}

/**
 * Animation state tracking
 */
export interface AnimationState {
  /** Target HTML element */
  element: HTMLElement;

  /** CSS property being animated */
  property: string;

  /** Web Animation instance */
  animation: Animation;

  /** Start value */
  startValue: any;

  /** Target value */
  targetValue: any;

  /** Animation options */
  options: AnimationOptions;

  /** Start timestamp */
  startedAt: number;
}

/**
 * Animation registry entry
 */
export interface AnimationRegistryEntry {
  /** Element ID or reference */
  elementKey: string;

  /** Property name */
  property: string;

  /** Animation state */
  state: AnimationState;
}

// ============================================================================
// Event Types
// ============================================================================

/**
 * Property hover event
 */
export interface PropertyHoverEvent {
  /** Property path */
  propertyPath: string;

  /** Component ID (if editing a specific component) */
  componentId?: string;

  /** Property visual mapping */
  mapping: PropertyVisualMapping;

  /** Feedback mode */
  mode: FeedbackMode;

  /** Current value */
  currentValue?: any;
}

/**
 * Property edit event
 */
export interface PropertyEditEvent {
  /** Property path */
  propertyPath: string;

  /** Component ID (if editing a specific component) */
  componentId?: string;

  /** Old value */
  oldValue: any;

  /** New value */
  newValue: any;

  /** Property visual mapping */
  mapping: PropertyVisualMapping;
}

/**
 * Property change event (for animations)
 */
export interface PropertyChangeEvent {
  /** Component ID */
  componentId: string;

  /** Property path */
  propertyPath: string;

  /** Old value */
  oldValue: any;

  /** New value */
  newValue: any;

  /** Property type */
  propertyType: PropertyType;
}

/**
 * Canvas viewport event
 */
export interface CanvasViewportEvent {
  /** Canvas element */
  canvasElement: HTMLElement;

  /** Viewport bounds */
  viewport: DOMRect;

  /** Event type */
  eventType: 'scroll' | 'resize' | 'zoom';
}

// ============================================================================
// Off-Screen Indicator Types
// ============================================================================

/**
 * Off-screen element info
 */
export interface OffScreenElement {
  /** Element reference */
  element: HTMLElement;

  /** Direction(s) where element is off-screen */
  directions: OffScreenDirection[];

  /** Element bounds */
  bounds: DOMRect;
}

/**
 * Off-screen indicator data
 */
export interface OffScreenIndicatorData {
  /** Direction of off-screen elements */
  direction: OffScreenDirection;

  /** Count of off-screen elements in this direction */
  count: number;

  /** Canvas element */
  canvasElement: HTMLElement;
}

// ============================================================================
// Performance Monitoring Types
// ============================================================================

/**
 * Performance statistics
 */
export interface PerformanceStats {
  /** Active overlay count */
  activeOverlays: number;

  /** Active animation count */
  activeAnimations: number;

  /** Dropped frames count */
  droppedFrames: number;

  /** Average frame time (in milliseconds) */
  averageFrameTime: number;

  /** Performance warnings */
  warnings: string[];
}

/**
 * Performance threshold configuration
 */
export interface PerformanceThresholds {
  /** Max overlays before warning */
  maxOverlays: number;

  /** Max animations before warning */
  maxAnimations: number;

  /** Max dropped frames before warning */
  maxDroppedFrames: number;

  /** Max frame time before warning (in milliseconds) */
  maxFrameTime: number;
}

// ============================================================================
// Manager Service Types
// ============================================================================

/**
 * Overlay manager configuration
 */
export interface OverlayManagerConfig {
  /** Canvas container element */
  canvasElement: HTMLElement;

  /** Highlight configuration */
  highlightConfig: HighlightConfig;

  /** Z-index for overlay container */
  zIndex?: number;
}

/**
 * Animation controller configuration
 */
export interface AnimationControllerConfig {
  /** Animation configuration */
  animationConfig: AnimationConfig;

  /** Performance configuration */
  performanceConfig: PerformanceConfig;

  /** Respect reduced motion preference */
  respectReducedMotion: boolean;
}

/**
 * Visual feedback manager configuration
 */
export interface VisualFeedbackManagerConfig {
  /** Complete visual feedback configuration */
  config: VisualFeedbackConfig;

  /** Canvas element */
  canvasElement: HTMLElement;
}

// ============================================================================
// Default Configurations
// ============================================================================

/**
 * Default animation configuration
 */
export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  enabled: true,
  durations: {
    spacing: 150,
    color: 200,
    layout: 180,
    typography: 150,
    border: 180,
    effect: 200,
    default: 200,
  },
  easing: {
    spacing: 'ease-out',
    color: 'ease-in-out',
    layout: 'ease-out',
    typography: 'ease-out',
    border: 'ease-out',
    effect: 'ease-in-out',
    default: 'ease-out',
  },
};

/**
 * Default highlight configuration
 */
export const DEFAULT_HIGHLIGHT_CONFIG: HighlightConfig = {
  enabled: true,
  color: '#FF0000', // Figma-style red
  opacity: 0.8,
  showValues: true,
};

/**
 * Default property indicator configuration
 */
export const DEFAULT_PROPERTY_INDICATOR_CONFIG: PropertyIndicatorConfig = {
  enabled: true,
  duration: 1000,
  position: 'near-component',
};

/**
 * Default performance configuration
 */
export const DEFAULT_PERFORMANCE_CONFIG: PerformanceConfig = {
  debounceDelay: 16, // ~1 frame at 60fps
  maxSimultaneousAnimations: 10,
  enableMonitoring: true,
};

/**
 * Default visual feedback configuration
 */
export const DEFAULT_VISUAL_FEEDBACK_CONFIG: VisualFeedbackConfig = {
  enabled: true,
  animations: DEFAULT_ANIMATION_CONFIG,
  highlights: DEFAULT_HIGHLIGHT_CONFIG,
  propertyIndicators: DEFAULT_PROPERTY_INDICATOR_CONFIG,
  respectReducedMotion: true,
  performance: DEFAULT_PERFORMANCE_CONFIG,
};

/**
 * Default performance thresholds
 */
export const DEFAULT_PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  maxOverlays: 20,
  maxAnimations: 10,
  maxDroppedFrames: 5,
  maxFrameTime: 16.67, // 60fps
};
