/**
 * Mobile Development Mode Types
 *
 * Defines types for the desktop-first responsive editing system with mobile overrides.
 * This system allows users to customize component layout, styling, and visibility
 * specifically for mobile devices while maintaining a clean separation from desktop design.
 *
 * @module mobile
 */

import type { BaseStyles, CSSValue } from '../types/component.types';

/**
 * Device mode enumeration
 *
 * Represents the current editing mode in the builder
 */
export enum DeviceMode {
  /**
   * Desktop mode - editing base/desktop styles
   */
  DESKTOP = 'desktop',

  /**
   * Mobile mode - editing mobile-specific overrides
   */
  MOBILE = 'mobile',

  // Future: TABLET = 'tablet'
}

/**
 * Responsive styles with desktop-first inheritance model
 *
 * Desktop styles are the base, mobile provides override layer.
 * Mobile properties inherit from desktop by default.
 */
export interface ResponsiveStyles {
  /**
   * Desktop/base styles (required)
   */
  desktop: BaseStyles;

  /**
   * Mobile style overrides (optional, inherits from desktop)
   * Only overridden properties are stored
   */
  mobile?: Partial<BaseStyles>;

  // Future: tablet?: Partial<BaseStyles>;
}

/**
 * Component order per device
 *
 * Allows different component ordering on mobile vs desktop
 */
export interface ComponentOrder {
  /**
   * Desktop component order (required)
   * Array of component IDs in display order
   */
  desktop: string[];

  /**
   * Mobile component order (optional, inherits desktop order if not specified)
   * Array of component IDs in display order
   */
  mobile?: string[];

  // Future: tablet?: string[];
}

/**
 * Component visibility per device
 *
 * Controls whether component is visible on specific devices
 */
export interface ComponentVisibility {
  /**
   * Visible on desktop (default: true)
   */
  desktop: boolean;

  /**
   * Visible on mobile (optional, defaults to desktop value)
   */
  mobile?: boolean;

  // Future: tablet?: boolean;
}

/**
 * Canvas settings with device-specific overrides
 *
 * Allows canvas settings (background, width, etc.) to differ per device
 */
export interface ResponsiveCanvasSettings {
  /**
   * Desktop canvas settings (required)
   */
  desktop: CanvasSettings;

  /**
   * Mobile canvas settings overrides (optional)
   */
  mobile?: Partial<CanvasSettings>;
}

/**
 * Canvas settings
 */
export interface CanvasSettings {
  /**
   * Canvas width
   */
  width?: CSSValue;

  /**
   * Canvas max-width
   */
  maxWidth?: CSSValue;

  /**
   * Canvas background color
   */
  backgroundColor?: string;

  /**
   * Canvas background image
   */
  backgroundImage?: string;

  /**
   * Canvas padding
   */
  padding?: CSSValue;

  /**
   * Default body font size
   */
  bodyFontSize?: CSSValue;

  /**
   * Default heading font sizes
   */
  headingFontSizes?: {
    h1?: CSSValue;
    h2?: CSSValue;
    h3?: CSSValue;
    h4?: CSSValue;
    h5?: CSSValue;
    h6?: CSSValue;
  };

  /**
   * Default component gap/spacing
   */
  componentGap?: CSSValue;
}

/**
 * Mobile override metadata
 *
 * Tracks which properties have been overridden for mobile
 */
export interface MobileOverride {
  /**
   * Component ID
   */
  componentId: string;

  /**
   * Overridden property paths
   * Example: ['styles.padding', 'styles.fontSize']
   */
  overriddenProperties: string[];

  /**
   * Override timestamp
   */
  overriddenAt: number;
}

/**
 * Mobile development mode configuration
 *
 * Complete configuration for mobile dev mode feature
 */
export interface MobileDevModeConfig {
  /**
   * Feature toggle - enable/disable Mobile Dev Mode entirely
   * @default true
   */
  enabled: boolean;

  /**
   * Breakpoint definitions
   */
  breakpoints: {
    /**
     * Mobile breakpoint width in pixels
     * @default 375
     */
    mobile: number;

    /**
     * Future: tablet breakpoint
     */
    tablet?: number;

    /**
     * Custom breakpoint definitions
     */
    custom?: Record<string, number>;
  };

  /**
   * Mode switcher configuration
   */
  modeSwitcher: {
    /**
     * Enable sticky positioning
     * @default true
     */
    sticky: boolean;

    /**
     * Show device labels
     * @default true
     */
    showLabels: boolean;

    /**
     * Custom label text
     */
    customLabels?: {
      desktop?: string;
      mobile?: string;
    };
  };

  /**
   * Canvas appearance in different modes
   */
  canvas: {
    /**
     * Mobile mode canvas background color
     */
    mobileBackgroundColor?: string;

    /**
     * Mobile mode canvas border color
     */
    mobileBorderColor?: string;

    /**
     * Mode switch animation duration in ms
     * @default 300
     */
    transitionDuration: number;
  };

  /**
   * Mobile-optimized defaults configuration
   */
  mobileDefaults: {
    /**
     * Enable defaults feature
     * @default true
     */
    enabled: boolean;

    /**
     * Show prompt on first switch to mobile mode
     * @default true
     */
    showPromptOnFirstSwitch: boolean;

    /**
     * Default transformation rules
     */
    transformations: {
      /**
       * Padding reduction factor (0.5 = reduce by 50%)
       * @default 0.5
       */
      paddingReduction: number;

      /**
       * Margin reduction factor
       * @default 0.5
       */
      marginReduction: number;

      /**
       * Font size reduction factor (0.9 = reduce by 10%)
       * @default 0.9
       */
      fontSizeReduction: number;

      /**
       * Auto-wrap horizontal lists
       * @default true
       */
      autoWrapHorizontalLists: boolean;

      /**
       * Stack headers vertically
       * @default true
       */
      stackHeadersVertically: boolean;

      /**
       * Make CTA buttons full-width
       * @default true
       */
      fullWidthButtons: boolean;

      /**
       * Minimum touch target size in pixels
       * @default 44
       */
      minTouchTargetSize: number;
    };

    /**
     * Component-type-specific default overrides
     */
    componentSpecific: Record<string, Partial<BaseStyles>>;
  };

  /**
   * Property override configuration
   */
  propertyOverrides: {
    /**
     * Properties that cannot be overridden (blacklist)
     * Content, structure, and technical properties
     */
    blacklist: string[];

    /**
     * Canvas settings that can be overridden
     */
    canvasSettingsOverridable: string[];
  };

  /**
   * Component-specific mobile controls
   */
  componentMobileControls: Record<
    string,
    {
      /**
       * Enable mobile controls for this component type
       */
      enabled: boolean;

      /**
       * Control definitions
       */
      controls: MobileControlDefinition[];
    }
  >;

  /**
   * Validation configuration
   */
  validation: {
    /**
     * Enable validation
     * @default true
     */
    enabled: boolean;

    /**
     * Validation rules
     */
    rules: ValidationRule[];

    /**
     * Show inline warnings
     * @default true
     */
    showInlineWarnings: boolean;

    /**
     * Show validation panel
     * @default false
     */
    showValidationPanel: boolean;
  };

  /**
   * Export configuration
   */
  export: {
    /**
     * Default export mode
     * - hybrid: Inline desktop + media queries for mobile
     * - web: Modern CSS with media queries
     * - email-only: Desktop only, no responsive
     * @default 'hybrid'
     */
    defaultMode: 'hybrid' | 'web' | 'email-only';

    /**
     * Mobile breakpoint for media queries
     * @default 768
     */
    mobileBreakpoint: number;

    /**
     * Inline desktop styles
     * @default true
     */
    inlineStyles: boolean;

    /**
     * Generate media queries
     * @default true
     */
    generateMediaQueries: boolean;
  };

  /**
   * Performance optimization settings
   */
  performance: {
    /**
     * Lazy load mobile data
     * @default true
     */
    lazyLoadMobileData: boolean;

    /**
     * Preload on mode switcher hover
     * @default true
     */
    preloadOnHover: boolean;

    /**
     * Enable virtual rendering
     * @default true
     */
    virtualRendering: boolean;

    /**
     * Component count threshold for virtual rendering
     * @default 50
     */
    virtualRenderingThreshold: number;

    /**
     * Property update debounce delay in ms
     * @default 16
     */
    debounceDelay: number;
  };

  /**
   * Target mode awareness
   * Hides JS-dependent controls in email mode
   */
  targetMode: 'web' | 'email' | 'hybrid';
}

/**
 * Mobile control definition
 *
 * Defines a mobile-specific control in the PropertyPanel
 */
export interface MobileControlDefinition {
  /**
   * Control ID
   */
  id: string;

  /**
   * Control label
   */
  label: string;

  /**
   * Control type
   */
  type: 'dropdown' | 'toggle' | 'slider' | 'input';

  /**
   * Property path this control affects
   */
  propertyPath: string;

  /**
   * Options (for dropdown)
   */
  options?: Array<{
    value: string;
    label: string;
  }>;

  /**
   * Default value
   */
  defaultValue?: any;

  /**
   * Help text
   */
  helpText?: string;

  /**
   * Only show in specific target modes
   */
  showInTargets?: Array<'web' | 'email' | 'hybrid'>;
}

/**
 * Validation rule for mobile customizations
 */
export interface ValidationRule {
  /**
   * Rule ID
   */
  id: string;

  /**
   * Rule name
   */
  name: string;

  /**
   * Rule description
   */
  description: string;

  /**
   * Severity level
   */
  severity: 'info' | 'warning' | 'critical';

  /**
   * Validation function
   */
  validate: (template: any, mode: DeviceMode) => ValidationIssue[];

  /**
   * Auto-fix function (optional)
   */
  fix?: (template: any) => any;
}

/**
 * Validation issue
 */
export interface ValidationIssue {
  /**
   * Rule ID that triggered this issue
   */
  ruleId: string;

  /**
   * Component ID (if specific to a component)
   */
  componentId?: string;

  /**
   * Issue message
   */
  message: string;

  /**
   * Severity level
   */
  severity: 'info' | 'warning' | 'critical';

  /**
   * Suggested fix
   */
  suggestion?: string;

  /**
   * Property path (if specific to a property)
   */
  propertyPath?: string;

  /**
   * Can be auto-fixed
   */
  fixable: boolean;
}

/**
 * Mode manager state
 *
 * Tracks the current mode and related state
 */
export interface ModeManagerState {
  /**
   * Current editing mode
   */
  currentMode: DeviceMode;

  /**
   * Is mode switching in progress
   */
  switching: boolean;

  /**
   * Mobile data loaded
   */
  mobileDataLoaded: boolean;

  /**
   * First time entering mobile mode for this template
   */
  isFirstMobileEntry: boolean;

  /**
   * Mobile defaults already applied
   */
  defaultsApplied: boolean;
}

/**
 * Property inheritance info
 *
 * Information about property inheritance from desktop to mobile
 */
export interface PropertyInheritanceInfo {
  /**
   * Property path
   */
  propertyPath: string;

  /**
   * Is property overridden for mobile
   */
  isOverridden: boolean;

  /**
   * Desktop value
   */
  desktopValue: any;

  /**
   * Mobile value (if overridden)
   */
  mobileValue?: any;

  /**
   * Effective value (resolved with inheritance)
   */
  effectiveValue: any;

  /**
   * Can this property be overridden
   */
  canOverride: boolean;

  /**
   * Reason if cannot override
   */
  cannotOverrideReason?: string;
}

/**
 * Diff calculation result
 *
 * Shows differences between desktop and mobile
 */
export interface DiffResult {
  /**
   * Component order changes
   */
  orderChanges: Array<{
    componentId: string;
    componentName: string;
    desktopPosition: number;
    mobilePosition: number;
  }>;

  /**
   * Hidden components
   */
  hiddenComponents: Array<{
    componentId: string;
    componentName: string;
    hiddenIn: 'desktop' | 'mobile';
  }>;

  /**
   * Property overrides by component
   */
  propertyOverrides: Array<{
    componentId: string;
    componentName: string;
    overrides: Array<{
      propertyPath: string;
      propertyLabel: string;
      desktopValue: any;
      mobileValue: any;
      category: 'layout' | 'spacing' | 'typography' | 'colors' | 'other';
    }>;
  }>;

  /**
   * Total override count
   */
  totalOverrides: number;

  /**
   * Canvas settings overrides
   */
  canvasOverrides: Array<{
    settingPath: string;
    settingLabel: string;
    desktopValue: any;
    mobileValue: any;
  }>;
}

/**
 * Mode switch event data
 */
export interface ModeSwitchEvent {
  /**
   * Previous mode
   */
  fromMode: DeviceMode;

  /**
   * New mode
   */
  toMode: DeviceMode;

  /**
   * Timestamp
   */
  timestamp: number;

  /**
   * Selected component ID (preserved across switch)
   */
  selectedComponentId?: string;

  /**
   * Canvas scroll position (preserved across switch)
   */
  scrollPosition: {
    x: number;
    y: number;
  };
}

/**
 * Mobile Layout Manager state
 */
export interface MobileLayoutManagerState {
  /**
   * Is visible
   */
  visible: boolean;

  /**
   * Component order (mobile)
   */
  componentOrder: string[];

  /**
   * Component visibility map
   */
  componentVisibility: Record<string, boolean>;

  /**
   * Is reordering in progress
   */
  reordering: boolean;

  /**
   * Dragging component ID
   */
  draggingComponentId?: string;
}

/**
 * Reset selection for selective reset
 */
export interface ResetSelection {
  /**
   * Reset all
   */
  all: boolean;

  /**
   * Reset by component
   */
  components: Record<
    string,
    {
      /**
       * Reset all for this component
       */
      all: boolean;

      /**
       * Reset visibility
       */
      visibility: boolean;

      /**
       * Reset order
       */
      order: boolean;

      /**
       * Reset styles by category
       */
      styles: {
        all: boolean;
        layout: boolean;
        spacing: boolean;
        typography: boolean;
        colors: boolean;
        other: boolean;
      };

      /**
       * Reset specific properties
       */
      properties: string[];
    }
  >;
}

/**
 * Default mobile development mode configuration
 */
export const DEFAULT_MOBILE_DEV_MODE_CONFIG: MobileDevModeConfig = {
  enabled: true,
  breakpoints: {
    mobile: 375,
  },
  modeSwitcher: {
    sticky: true,
    showLabels: true,
  },
  canvas: {
    mobileBackgroundColor: '#f5f5f5',
    mobileBorderColor: '#e0e0e0',
    transitionDuration: 300,
  },
  mobileDefaults: {
    enabled: true,
    showPromptOnFirstSwitch: true,
    transformations: {
      paddingReduction: 0.5,
      marginReduction: 0.5,
      fontSizeReduction: 0.9,
      autoWrapHorizontalLists: true,
      stackHeadersVertically: true,
      fullWidthButtons: true,
      minTouchTargetSize: 44,
    },
    componentSpecific: {},
  },
  propertyOverrides: {
    blacklist: [
      // Content properties
      'content.text',
      'content.html',
      'content.imageUrl',
      'content.linkUrl',
      'content.altText',
      // Structure properties
      'content.items',
      'content.children',
      'children',
      // Technical properties
      'id',
      'type',
      'metadata',
      'createdAt',
      'updatedAt',
      'version',
      'parentId',
      // Accessibility
      'content.ariaLabel',
      'content.ariaDescribedBy',
    ],
    canvasSettingsOverridable: [
      'width',
      'maxWidth',
      'backgroundColor',
      'padding',
      'bodyFontSize',
      'headingFontSizes',
      'componentGap',
    ],
  },
  componentMobileControls: {},
  validation: {
    enabled: true,
    rules: [],
    showInlineWarnings: true,
    showValidationPanel: false,
  },
  export: {
    defaultMode: 'hybrid',
    mobileBreakpoint: 768,
    inlineStyles: true,
    generateMediaQueries: true,
  },
  performance: {
    lazyLoadMobileData: true,
    preloadOnHover: true,
    virtualRendering: true,
    virtualRenderingThreshold: 50,
    debounceDelay: 16,
  },
  targetMode: 'hybrid',
};

/**
 * Helper to get default component visibility
 */
export function getDefaultComponentVisibility(): ComponentVisibility {
  return {
    desktop: true,
    mobile: true,
  };
}

/**
 * Helper to check if a property can be overridden
 */
export function canOverrideProperty(
  propertyPath: string,
  blacklist: string[]
): boolean {
  return !blacklist.some((pattern) => {
    // Support wildcard matching
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return regex.test(propertyPath);
  });
}

/**
 * Helper to resolve effective value with inheritance
 */
export function resolveEffectiveValue<T>(
  desktopValue: T,
  mobileValue: T | undefined
): T {
  return mobileValue !== undefined ? mobileValue : desktopValue;
}

/**
 * Helper to get component order for device
 */
export function getComponentOrderForDevice(
  componentOrder: ComponentOrder,
  device: DeviceMode
): string[] {
  if (device === DeviceMode.MOBILE && componentOrder.mobile) {
    return componentOrder.mobile;
  }
  return componentOrder.desktop;
}

/**
 * Helper to check if component is visible on device
 */
export function isComponentVisibleOnDevice(
  visibility: ComponentVisibility,
  device: DeviceMode
): boolean {
  if (device === DeviceMode.MOBILE && visibility.mobile !== undefined) {
    return visibility.mobile;
  }
  return visibility.desktop;
}
