/**
 * Breakpoint Manager
 *
 * Manages responsive breakpoints, device detection, and media query generation
 */

import {
  DeviceType,
  DEFAULT_BREAKPOINTS,
  type BreakpointDefinition,
  type ResponsivePropertyValue,
  type MediaQuery,
  BreakpointStrategy,
} from '../types/responsive.types';
import type { CSSValue } from '../types/component.types';

/**
 * BreakpointManager class
 *
 * Provides utilities for working with responsive breakpoints:
 * - Device detection based on viewport width
 * - Media query generation
 * - Responsive value resolution
 * - Breakpoint configuration
 */
export class BreakpointManager {
  private breakpoints: Record<DeviceType, BreakpointDefinition>;

  /**
   * Create a new BreakpointManager
   *
   * @param customBreakpoints - Optional custom breakpoint definitions
   */
  constructor(customBreakpoints?: Partial<Record<DeviceType, BreakpointDefinition>>) {
    this.breakpoints = {
      ...DEFAULT_BREAKPOINTS,
      ...customBreakpoints,
    };
  }

  /**
   * Get breakpoint definition for a specific device
   *
   * @param device - Device type
   * @returns Breakpoint definition
   */
  getBreakpoint(device: DeviceType): BreakpointDefinition {
    return this.breakpoints[device];
  }

  /**
   * Get all breakpoint definitions
   *
   * @returns Record of all breakpoints
   */
  getAllBreakpoints(): Record<DeviceType, BreakpointDefinition> {
    return { ...this.breakpoints };
  }

  /**
   * Update a breakpoint definition
   *
   * @param device - Device type
   * @param breakpoint - New breakpoint definition
   */
  updateBreakpoint(device: DeviceType, breakpoint: BreakpointDefinition): void {
    this.breakpoints[device] = breakpoint;
  }

  /**
   * Detect device type based on viewport width
   *
   * @param width - Viewport width in pixels
   * @returns Device type
   */
  detectDevice(width: number): DeviceType {
    // Check in order: mobile, tablet, desktop
    const mobile = this.breakpoints[DeviceType.MOBILE];
    const tablet = this.breakpoints[DeviceType.TABLET];

    if (width <= (mobile.maxWidth ?? Infinity)) {
      return DeviceType.MOBILE;
    }

    if (width >= tablet.minWidth && width <= (tablet.maxWidth ?? Infinity)) {
      return DeviceType.TABLET;
    }

    return DeviceType.DESKTOP;
  }

  /**
   * Generate media query string for a specific device
   *
   * @param device - Device type
   * @param strategy - Breakpoint strategy (mobile-first or desktop-first)
   * @returns Media query string
   */
  generateMediaQuery(device: DeviceType, strategy: BreakpointStrategy): string {
    const breakpoint = this.breakpoints[device];

    if (strategy === BreakpointStrategy.MOBILE_FIRST) {
      // Mobile-first: use min-width
      if (device === DeviceType.MOBILE) {
        // Mobile is base, no media query needed
        return '';
      }

      if (device === DeviceType.TABLET) {
        return `@media (min-width: ${breakpoint.minWidth}px)`;
      }

      if (device === DeviceType.DESKTOP) {
        return `@media (min-width: ${breakpoint.minWidth}px)`;
      }
    } else {
      // Desktop-first: use max-width
      if (device === DeviceType.DESKTOP) {
        // Desktop is base, no media query needed
        return '';
      }

      if (device === DeviceType.TABLET && breakpoint.maxWidth !== undefined) {
        return `@media (max-width: ${breakpoint.maxWidth}px)`;
      }

      if (device === DeviceType.MOBILE && breakpoint.maxWidth !== undefined) {
        return `@media (max-width: ${breakpoint.maxWidth}px)`;
      }
    }

    return '';
  }

  /**
   * Resolve a responsive value for a specific device
   *
   * Uses fallback logic:
   * 1. Device-specific value
   * 2. Desktop value (base)
   * 3. Provided default value
   *
   * @param responsiveValue - Responsive property value
   * @param device - Device type
   * @param defaultValue - Default fallback value
   * @returns Resolved value for the device
   */
  resolveValue<T>(
    responsiveValue: ResponsivePropertyValue<T> | undefined,
    device: DeviceType,
    defaultValue: T
  ): T {
    if (!responsiveValue) {
      return defaultValue;
    }

    // Try device-specific value
    if (responsiveValue[device] !== undefined) {
      return responsiveValue[device] as T;
    }

    // Fallback to desktop (base) value
    if (responsiveValue.desktop !== undefined) {
      return responsiveValue.desktop as T;
    }

    // Fallback to default
    return defaultValue;
  }

  /**
   * Check if a responsive value has device-specific overrides
   *
   * @param responsiveValue - Responsive property value
   * @returns True if has device-specific values
   */
  hasResponsiveValues<T>(responsiveValue: ResponsivePropertyValue<T> | undefined): boolean {
    if (!responsiveValue) {
      return false;
    }

    return (
      responsiveValue.mobile !== undefined ||
      responsiveValue.tablet !== undefined ||
      responsiveValue.desktop !== undefined
    );
  }

  /**
   * Convert CSS value to string
   *
   * @param value - CSS value object
   * @returns CSS string (e.g., "16px", "2rem", "100%")
   */
  cssValueToString(value: CSSValue | string | number): string {
    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number') {
      return `${value}px`;
    }

    if (value.value === 'auto') {
      return 'auto';
    }

    return `${value.value}${value.unit}`;
  }

  /**
   * Generate media queries for all devices with styles
   *
   * @param componentId - Component ID
   * @param styles - Style declarations per device
   * @param strategy - Breakpoint strategy
   * @returns Array of media query objects
   */
  generateMediaQueries(
    componentId: string,
    styles: Record<DeviceType, string[]>,
    strategy: BreakpointStrategy
  ): MediaQuery[] {
    const queries: MediaQuery[] = [];

    // Sort devices based on strategy
    const devices =
      strategy === BreakpointStrategy.MOBILE_FIRST
        ? [DeviceType.MOBILE, DeviceType.TABLET, DeviceType.DESKTOP]
        : [DeviceType.DESKTOP, DeviceType.TABLET, DeviceType.MOBILE];

    for (const device of devices) {
      const deviceStyles = styles[device];

      if (!deviceStyles || deviceStyles.length === 0) {
        continue;
      }

      const query = this.generateMediaQuery(device, strategy);

      queries.push({
        device,
        query,
        rules: deviceStyles.map((style) => `#${componentId} { ${style} }`),
      });
    }

    return queries;
  }

  /**
   * Get viewport dimensions for a specific device
   *
   * @param device - Device type
   * @returns Viewport dimensions
   */
  getViewportDimensions(device: DeviceType): { width: number; height: number } {
    return { ...this.breakpoints[device].viewportDimensions };
  }

  /**
   * Get all devices in order (mobile to desktop)
   *
   * @returns Array of device types
   */
  getDevicesInOrder(): DeviceType[] {
    return [DeviceType.MOBILE, DeviceType.TABLET, DeviceType.DESKTOP];
  }

  /**
   * Export breakpoints configuration for storage
   *
   * @returns Breakpoints object
   */
  exportConfig(): Record<DeviceType, BreakpointDefinition> {
    return this.getAllBreakpoints();
  }

  /**
   * Import breakpoints configuration from storage
   *
   * @param config - Breakpoints configuration
   */
  importConfig(config: Partial<Record<DeviceType, BreakpointDefinition>>): void {
    Object.keys(config).forEach((key) => {
      const device = key as DeviceType;
      const breakpoint = config[device];
      if (breakpoint) {
        this.breakpoints[device] = breakpoint;
      }
    });
  }
}
