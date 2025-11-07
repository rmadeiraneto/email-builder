/**
 * Responsive Design System Types
 *
 * Defines types for responsive breakpoints, device-specific properties,
 * and responsive behavior management
 */

import type { CSSValue } from './component.types';

/**
 * Device type enumeration
 */
export enum DeviceType {
  MOBILE = 'mobile',
  TABLET = 'tablet',
  DESKTOP = 'desktop',
}

/**
 * Breakpoint definition for a specific device
 */
export interface BreakpointDefinition {
  /**
   * Device type
   */
  device: DeviceType;

  /**
   * Minimum width in pixels (inclusive)
   */
  minWidth: number;

  /**
   * Maximum width in pixels (inclusive)
   * undefined means no maximum
   */
  maxWidth?: number;

  /**
   * Breakpoint label for display
   */
  label: string;

  /**
   * Icon name (Remix Icon)
   */
  icon: string;

  /**
   * Typical viewport dimensions for preview
   */
  viewportDimensions: {
    width: number;
    height: number;
  };
}

/**
 * Responsive property value for a specific device
 */
export interface ResponsivePropertyValue<T = any> {
  /**
   * Value for mobile devices
   */
  mobile?: T;

  /**
   * Value for tablet devices
   */
  tablet?: T;

  /**
   * Value for desktop devices
   */
  desktop?: T;
}

/**
 * Responsive spacing values (padding, margin)
 */
export interface ResponsiveSpacing {
  top?: ResponsivePropertyValue<CSSValue>;
  right?: ResponsivePropertyValue<CSSValue>;
  bottom?: ResponsivePropertyValue<CSSValue>;
  left?: ResponsivePropertyValue<CSSValue>;
}

/**
 * Component visibility settings per device
 */
export interface ResponsiveVisibility {
  /**
   * Show on desktop
   */
  desktop: boolean;

  /**
   * Show on tablet
   */
  tablet: boolean;

  /**
   * Show on mobile
   */
  mobile: boolean;
}

/**
 * Device-specific style overrides
 *
 * Each property can have different values for different devices.
 * Properties not specified will inherit from the base/default value.
 */
export interface ResponsiveStyles {
  /**
   * Padding overrides per device
   */
  padding?: ResponsiveSpacing;

  /**
   * Margin overrides per device
   */
  margin?: ResponsiveSpacing;

  /**
   * Font size per device
   */
  fontSize?: ResponsivePropertyValue<CSSValue>;

  /**
   * Width per device
   */
  width?: ResponsivePropertyValue<CSSValue>;

  /**
   * Height per device
   */
  height?: ResponsivePropertyValue<CSSValue>;

  /**
   * Text alignment per device
   */
  textAlign?: ResponsivePropertyValue<'left' | 'center' | 'right' | 'justify'>;

  /**
   * Display mode per device
   */
  display?: ResponsivePropertyValue<'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none'>;
}

/**
 * Responsive configuration for a component
 */
export interface ComponentResponsiveConfig {
  /**
   * Whether responsive mode is enabled for this component
   */
  enabled: boolean;

  /**
   * Component visibility per device
   */
  visibility: ResponsiveVisibility;

  /**
   * Device-specific style overrides
   */
  styles: ResponsiveStyles;
}

/**
 * Breakpoint strategy
 */
export enum BreakpointStrategy {
  /**
   * Mobile-first: Start with mobile styles, add overrides for larger screens
   */
  MOBILE_FIRST = 'mobile-first',

  /**
   * Desktop-first: Start with desktop styles, add overrides for smaller screens
   */
  DESKTOP_FIRST = 'desktop-first',
}

/**
 * Responsive export options
 */
export interface ResponsiveExportOptions {
  /**
   * Whether to include media queries in export
   */
  includeMediaQueries: boolean;

  /**
   * Breakpoint strategy for CSS generation
   */
  strategy: BreakpointStrategy;

  /**
   * Whether to inline critical mobile styles (for email)
   */
  inlineMobileStyles?: boolean;

  /**
   * Whether to use email-safe responsive techniques
   */
  emailSafe?: boolean;
}

/**
 * Responsive preview state
 */
export interface ResponsivePreviewState {
  /**
   * Currently active device
   */
  activeDevice: DeviceType;

  /**
   * Whether responsive preview mode is enabled
   */
  enabled: boolean;

  /**
   * Custom viewport dimensions (if overriding defaults)
   */
  customViewport?: {
    width: number;
    height: number;
  };
}

/**
 * Media query definition generated for export
 */
export interface MediaQuery {
  /**
   * Device type this media query targets
   */
  device: DeviceType;

  /**
   * Media query string (e.g., "@media (max-width: 767px)")
   */
  query: string;

  /**
   * CSS rules to apply for this media query
   */
  rules: string[];
}

/**
 * Default breakpoint definitions
 */
export const DEFAULT_BREAKPOINTS: Record<DeviceType, BreakpointDefinition> = {
  [DeviceType.MOBILE]: {
    device: DeviceType.MOBILE,
    minWidth: 0,
    maxWidth: 767,
    label: 'Mobile',
    icon: 'ri-smartphone-line',
    viewportDimensions: {
      width: 375,
      height: 667,
    },
  },
  [DeviceType.TABLET]: {
    device: DeviceType.TABLET,
    minWidth: 768,
    maxWidth: 1023,
    label: 'Tablet',
    icon: 'ri-tablet-line',
    viewportDimensions: {
      width: 768,
      height: 1024,
    },
  },
  [DeviceType.DESKTOP]: {
    device: DeviceType.DESKTOP,
    minWidth: 1024,
    label: 'Desktop',
    icon: 'ri-computer-line',
    viewportDimensions: {
      width: 1200,
      height: 800,
    },
  },
};

/**
 * Helper to get default responsive visibility (all devices visible)
 */
export function getDefaultResponsiveVisibility(): ResponsiveVisibility {
  return {
    desktop: true,
    tablet: true,
    mobile: true,
  };
}

/**
 * Helper to get default responsive config for a component
 */
export function getDefaultResponsiveConfig(): ComponentResponsiveConfig {
  return {
    enabled: false,
    visibility: getDefaultResponsiveVisibility(),
    styles: {},
  };
}

/**
 * Helper to check if a component is visible on a specific device
 */
export function isVisibleOnDevice(
  visibility: ResponsiveVisibility | undefined,
  device: DeviceType
): boolean {
  if (!visibility) return true;
  return visibility[device] ?? true;
}

/**
 * Helper to get the responsive value for a specific device
 * Falls back to default value if device-specific value is not set
 */
export function getResponsiveValue<T>(
  responsiveValue: ResponsivePropertyValue<T> | undefined,
  device: DeviceType,
  defaultValue: T
): T {
  if (!responsiveValue) return defaultValue;
  return responsiveValue[device] ?? defaultValue;
}
