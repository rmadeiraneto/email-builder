/**
 * Property Override Manager
 *
 * Manages mobile property overrides for components. Handles setting, clearing,
 * and querying property overrides with support for bulk operations.
 *
 * Responsibilities:
 * - Set individual property overrides
 * - Clear property overrides (individual, by category, or all)
 * - Get override information
 * - Bulk operations across multiple components
 * - Track override metadata in template
 * - Property path validation
 *
 * @module mobile
 */

import { EventEmitter } from '../services/EventEmitter';
import type { Template, BaseComponent } from '../types';
import type {
  MobileDevModeConfig,
} from './mobile.types';
import { canOverrideProperty } from './mobile.types';
import { ModeManagerEvent } from './ModeManager';

/**
 * Property category for bulk operations
 */
export enum PropertyCategory {
  LAYOUT = 'layout',
  SPACING = 'spacing',
  TYPOGRAPHY = 'typography',
  COLORS = 'colors',
  OTHER = 'other',
}

/**
 * Property override result
 */
export interface PropertyOverrideResult {
  /**
   * Was the operation successful
   */
  success: boolean;

  /**
   * Error message if failed
   */
  error?: string;

  /**
   * Property path
   */
  propertyPath: string;

  /**
   * Component ID
   */
  componentId: string;

  /**
   * Previous value (if any)
   */
  previousValue?: any;

  /**
   * New value (if setting)
   */
  newValue?: any;
}

/**
 * Bulk override result
 */
export interface BulkOverrideResult {
  /**
   * Number of successful operations
   */
  successCount: number;

  /**
   * Number of failed operations
   */
  failureCount: number;

  /**
   * Individual results
   */
  results: PropertyOverrideResult[];

  /**
   * Total operations attempted
   */
  totalCount: number;
}

/**
 * Property Override Manager Configuration
 */
export interface PropertyOverrideManagerOptions {
  /**
   * Event emitter instance
   */
  eventEmitter: EventEmitter;

  /**
   * Mobile dev mode configuration
   */
  config: MobileDevModeConfig;

  /**
   * Current template (will be mutated)
   */
  template: Template;
}

/**
 * Property Override Manager Service
 *
 * Manages mobile property overrides for components
 */
export class PropertyOverrideManager {
  private eventEmitter: EventEmitter;
  private config: MobileDevModeConfig;
  private template: Template;

  /**
   * Property category mappings
   */
  private static readonly PROPERTY_CATEGORIES: Record<string, PropertyCategory> = {
    // Layout
    'styles.display': PropertyCategory.LAYOUT,
    'styles.flexDirection': PropertyCategory.LAYOUT,
    'styles.flexWrap': PropertyCategory.LAYOUT,
    'styles.alignItems': PropertyCategory.LAYOUT,
    'styles.justifyContent': PropertyCategory.LAYOUT,
    'styles.width': PropertyCategory.LAYOUT,
    'styles.maxWidth': PropertyCategory.LAYOUT,
    'styles.minWidth': PropertyCategory.LAYOUT,
    'styles.height': PropertyCategory.LAYOUT,
    'styles.maxHeight': PropertyCategory.LAYOUT,
    'styles.minHeight': PropertyCategory.LAYOUT,

    // Spacing
    'styles.padding': PropertyCategory.SPACING,
    'styles.paddingTop': PropertyCategory.SPACING,
    'styles.paddingRight': PropertyCategory.SPACING,
    'styles.paddingBottom': PropertyCategory.SPACING,
    'styles.paddingLeft': PropertyCategory.SPACING,
    'styles.margin': PropertyCategory.SPACING,
    'styles.marginTop': PropertyCategory.SPACING,
    'styles.marginRight': PropertyCategory.SPACING,
    'styles.marginBottom': PropertyCategory.SPACING,
    'styles.marginLeft': PropertyCategory.SPACING,
    'styles.gap': PropertyCategory.SPACING,
    'styles.rowGap': PropertyCategory.SPACING,
    'styles.columnGap': PropertyCategory.SPACING,

    // Typography
    'styles.fontSize': PropertyCategory.TYPOGRAPHY,
    'styles.fontWeight': PropertyCategory.TYPOGRAPHY,
    'styles.fontFamily': PropertyCategory.TYPOGRAPHY,
    'styles.lineHeight': PropertyCategory.TYPOGRAPHY,
    'styles.letterSpacing': PropertyCategory.TYPOGRAPHY,
    'styles.textAlign': PropertyCategory.TYPOGRAPHY,
    'styles.textTransform': PropertyCategory.TYPOGRAPHY,
    'styles.textDecoration': PropertyCategory.TYPOGRAPHY,

    // Colors
    'styles.color': PropertyCategory.COLORS,
    'styles.backgroundColor': PropertyCategory.COLORS,
    'styles.borderColor': PropertyCategory.COLORS,
  };

  constructor(options: PropertyOverrideManagerOptions) {
    this.eventEmitter = options.eventEmitter;
    this.config = options.config;
    this.template = options.template;

    // Ensure template has mobile dev mode metadata
    this.ensureMobileMetadata();
  }

  /**
   * Set a property override for mobile
   *
   * @param componentId - Component ID
   * @param propertyPath - Property path (e.g., 'styles.padding')
   * @param value - New value for mobile
   * @returns Override result
   */
  public setOverride(
    componentId: string,
    propertyPath: string,
    value: any
  ): PropertyOverrideResult {
    const component = this.findComponent(componentId);

    if (!component) {
      return {
        success: false,
        error: `Component not found: ${componentId}`,
        propertyPath,
        componentId,
      };
    }

    // Check if property can be overridden
    if (!canOverrideProperty(propertyPath, this.config.propertyOverrides.blacklist)) {
      return {
        success: false,
        error: `Property cannot be overridden: ${propertyPath}`,
        propertyPath,
        componentId,
      };
    }

    // Parse property path
    const parts = propertyPath.split('.');
    const isStyleProperty = parts[0] === 'styles';

    if (!isStyleProperty) {
      return {
        success: false,
        error: `Only style properties can be overridden: ${propertyPath}`,
        propertyPath,
        componentId,
      };
    }

    const stylePath = parts.slice(1).join('.');
    const previousValue = this.getNestedValue(component.mobileStyles, stylePath);

    // Initialize mobileStyles if not present
    if (!component.mobileStyles) {
      component.mobileStyles = {};
    }

    // Set the value
    this.setNestedValue(component.mobileStyles, stylePath, value);

    // Update template metadata
    this.updateOverrideMetadata(componentId, propertyPath);

    // Emit event
    this.eventEmitter.emit(ModeManagerEvent.PROPERTY_OVERRIDE_SET, {
      componentId,
      propertyPath,
      value,
      previousValue,
    });

    return {
      success: true,
      propertyPath,
      componentId,
      previousValue,
      newValue: value,
    };
  }

  /**
   * Clear a property override for mobile
   *
   * @param componentId - Component ID
   * @param propertyPath - Property path
   * @returns Override result
   */
  public clearOverride(componentId: string, propertyPath: string): PropertyOverrideResult {
    const component = this.findComponent(componentId);

    if (!component) {
      return {
        success: false,
        error: `Component not found: ${componentId}`,
        propertyPath,
        componentId,
      };
    }

    if (!component.mobileStyles) {
      return {
        success: true, // Already no override
        propertyPath,
        componentId,
      };
    }

    // Parse property path
    const parts = propertyPath.split('.');
    if (parts[0] !== 'styles') {
      return {
        success: false,
        error: `Invalid property path: ${propertyPath}`,
        propertyPath,
        componentId,
      };
    }

    const stylePath = parts.slice(1).join('.');
    const previousValue = this.getNestedValue(component.mobileStyles, stylePath);

    // Delete the override
    this.deleteNestedValue(component.mobileStyles, stylePath);

    // Update template metadata
    this.removeOverrideFromMetadata(componentId, propertyPath);

    // Emit event
    this.eventEmitter.emit(ModeManagerEvent.PROPERTY_OVERRIDE_CLEARED, {
      componentId,
      propertyPath,
      previousValue,
    });

    return {
      success: true,
      propertyPath,
      componentId,
      previousValue,
    };
  }

  /**
   * Get override value for a property
   *
   * @param componentId - Component ID
   * @param propertyPath - Property path
   * @returns Override value or undefined if not overridden
   */
  public getOverride(componentId: string, propertyPath: string): any {
    const component = this.findComponent(componentId);

    if (!component || !component.mobileStyles) {
      return undefined;
    }

    const parts = propertyPath.split('.');
    if (parts[0] !== 'styles') {
      return undefined;
    }

    const stylePath = parts.slice(1).join('.');
    return this.getNestedValue(component.mobileStyles, stylePath);
  }

  /**
   * Check if a property is overridden
   *
   * @param componentId - Component ID
   * @param propertyPath - Property path
   * @returns True if property is overridden
   */
  public hasOverride(componentId: string, propertyPath: string): boolean {
    return this.getOverride(componentId, propertyPath) !== undefined;
  }

  /**
   * Get all overrides for a component
   *
   * @param componentId - Component ID
   * @returns Map of property paths to values
   */
  public getComponentOverrides(componentId: string): Record<string, any> {
    const component = this.findComponent(componentId);

    if (!component || !component.mobileStyles) {
      return {};
    }

    return this.flattenObject(component.mobileStyles, 'styles');
  }

  /**
   * Clear all overrides for a component
   *
   * @param componentId - Component ID
   * @returns Bulk result
   */
  public clearComponentOverrides(componentId: string): BulkOverrideResult {
    const overrides = this.getComponentOverrides(componentId);
    const results: PropertyOverrideResult[] = [];

    for (const propertyPath of Object.keys(overrides)) {
      const result = this.clearOverride(componentId, propertyPath);
      results.push(result);
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    return {
      successCount,
      failureCount,
      results,
      totalCount: results.length,
    };
  }

  /**
   * Clear overrides by category for a component
   *
   * @param componentId - Component ID
   * @param category - Property category
   * @returns Bulk result
   */
  public clearComponentOverridesByCategory(
    componentId: string,
    category: PropertyCategory
  ): BulkOverrideResult {
    const overrides = this.getComponentOverrides(componentId);
    const results: PropertyOverrideResult[] = [];

    for (const propertyPath of Object.keys(overrides)) {
      const propCategory = this.getPropertyCategory(propertyPath);
      if (propCategory === category) {
        const result = this.clearOverride(componentId, propertyPath);
        results.push(result);
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    return {
      successCount,
      failureCount,
      results,
      totalCount: results.length,
    };
  }

  /**
   * Clear all overrides for all components
   *
   * @returns Bulk result
   */
  public clearAllOverrides(): BulkOverrideResult {
    const results: PropertyOverrideResult[] = [];

    for (const component of this.template.components) {
      const componentResults = this.clearComponentOverrides(component.id);
      results.push(...componentResults.results);
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    return {
      successCount,
      failureCount,
      results,
      totalCount: results.length,
    };
  }

  /**
   * Get property category
   *
   * @param propertyPath - Property path
   * @returns Property category
   */
  public getPropertyCategory(propertyPath: string): PropertyCategory {
    return PropertyOverrideManager.PROPERTY_CATEGORIES[propertyPath] || PropertyCategory.OTHER;
  }

  /**
   * Get override count for template
   *
   * @returns Total number of property overrides
   */
  public getOverrideCount(): number {
    let count = 0;

    for (const component of this.template.components) {
      if (component.mobileStyles) {
        const overrides = this.flattenObject(component.mobileStyles);
        count += Object.keys(overrides).length;
      }
    }

    return count;
  }

  /**
   * Get components with overrides
   *
   * @returns Array of component IDs that have mobile overrides
   */
  public getComponentsWithOverrides(): string[] {
    return this.template.components
      .filter((c) => c.mobileStyles && Object.keys(c.mobileStyles).length > 0)
      .map((c) => c.id);
  }

  /**
   * Update template reference
   *
   * @param template - New template instance
   */
  public setTemplate(template: Template): void {
    this.template = template;
    this.ensureMobileMetadata();
  }

  /**
   * Find component by ID
   */
  private findComponent(componentId: string): BaseComponent | undefined {
    return this.template.components.find((c) => c.id === componentId);
  }

  /**
   * Ensure template has mobile metadata
   */
  private ensureMobileMetadata(): void {
    if (!this.template.mobileDevMode) {
      this.template.mobileDevMode = {
        defaultsApplied: false,
        hasEnteredMobileMode: false,
        overrides: [],
      };
    }
  }

  /**
   * Update override metadata in template
   */
  private updateOverrideMetadata(componentId: string, propertyPath: string): void {
    if (!this.template.mobileDevMode) {
      this.ensureMobileMetadata();
    }

    const overrides = this.template.mobileDevMode!.overrides;
    let componentOverride = overrides.find((o) => o.componentId === componentId);

    if (!componentOverride) {
      componentOverride = {
        componentId,
        overriddenProperties: [],
        overriddenAt: Date.now(),
      };
      overrides.push(componentOverride);
    }

    if (!componentOverride.overriddenProperties.includes(propertyPath)) {
      componentOverride.overriddenProperties.push(propertyPath);
      componentOverride.overriddenAt = Date.now();
    }
  }

  /**
   * Remove override from metadata
   */
  private removeOverrideFromMetadata(componentId: string, propertyPath: string): void {
    if (!this.template.mobileDevMode) {
      return;
    }

    const overrides = this.template.mobileDevMode.overrides;
    const componentOverride = overrides.find((o) => o.componentId === componentId);

    if (componentOverride) {
      const index = componentOverride.overriddenProperties.indexOf(propertyPath);
      if (index !== -1) {
        componentOverride.overriddenProperties.splice(index, 1);
      }

      // Remove component override entry if no properties left
      if (componentOverride.overriddenProperties.length === 0) {
        const overrideIndex = overrides.indexOf(componentOverride);
        if (overrideIndex !== -1) {
          overrides.splice(overrideIndex, 1);
        }
      }
    }
  }

  /**
   * Get nested value from object
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, part) => {
      return current?.[part];
    }, obj);
  }

  /**
   * Set nested value in object
   */
  private setNestedValue(obj: any, path: string, value: any): void {
    const parts = path.split('.');
    const last = parts.pop()!;

    let current = obj;
    for (const part of parts) {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    current[last] = value;
  }

  /**
   * Delete nested value from object
   */
  private deleteNestedValue(obj: any, path: string): void {
    const parts = path.split('.');
    const last = parts.pop()!;

    let current = obj;
    for (const part of parts) {
      if (!current[part]) {
        return; // Path doesn't exist
      }
      current = current[part];
    }

    delete current[last];
  }

  /**
   * Flatten nested object to dot notation
   */
  private flattenObject(obj: any, prefix: string = ''): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(result, this.flattenObject(value, newKey));
        } else {
          result[newKey] = value;
        }
      }
    }

    return result;
  }
}
