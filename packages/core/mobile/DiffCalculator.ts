/**
 * Diff Calculator
 *
 * Calculates differences between desktop and mobile configurations
 *
 * @module mobile
 */

import type { Template, BaseComponent } from '../types';
import type { DiffResult, ComponentOrder, ComponentVisibility } from './mobile.types';
import { DeviceMode, getComponentOrderForDevice, isComponentVisibleOnDevice } from './mobile.types';

/**
 * Property diff entry
 */
export interface PropertyDiff {
  propertyPath: string;
  propertyLabel: string;
  desktopValue: any;
  mobileValue: any;
  category: 'layout' | 'spacing' | 'typography' | 'colors' | 'other';
  formattedDesktop: string;
  formattedMobile: string;
}

/**
 * Component diff entry
 */
export interface ComponentDiff {
  componentId: string;
  componentName: string;
  componentType: string;
  hasOrderChange: boolean;
  hasVisibilityChange: boolean;
  hasPropertyOverrides: boolean;
  desktopPosition: number;
  mobilePosition: number;
  visibleOnDesktop: boolean;
  visibleOnMobile: boolean;
  propertyOverrides: PropertyDiff[];
}

/**
 * Complete diff summary
 */
export interface DiffSummary {
  /**
   * Total number of changes
   */
  totalChanges: number;

  /**
   * Number of components with order changes
   */
  orderChanges: number;

  /**
   * Number of components with visibility changes
   */
  visibilityChanges: number;

  /**
   * Number of components with property overrides
   */
  propertyOverrides: number;

  /**
   * Total property override count
   */
  totalPropertyOverrides: number;

  /**
   * Has any mobile customizations
   */
  hasMobileCustomizations: boolean;
}

/**
 * Diff Calculator
 *
 * Calculates comprehensive diffs between desktop and mobile
 */
export class DiffCalculator {
  /**
   * Calculate full diff for template
   *
   * @param template - Template to analyze
   */
  public static calculateDiff(template: Template): DiffResult {
    const componentDiffs = this.calculateComponentDiffs(template);
    const orderChanges = componentDiffs
      .filter((d) => d.hasOrderChange)
      .map((d) => ({
        componentId: d.componentId,
        componentName: d.componentName,
        desktopPosition: d.desktopPosition,
        mobilePosition: d.mobilePosition,
      }));

    const hiddenComponents = componentDiffs
      .filter((d) => d.hasVisibilityChange)
      .map((d) => ({
        componentId: d.componentId,
        componentName: d.componentName,
        hiddenIn: (d.visibleOnMobile ? 'desktop' : 'mobile') as 'desktop' | 'mobile',
      }));

    const propertyOverrides = componentDiffs
      .filter((d) => d.hasPropertyOverrides)
      .map((d) => ({
        componentId: d.componentId,
        componentName: d.componentName,
        overrides: d.propertyOverrides,
      }));

    const totalOverrides = componentDiffs.reduce(
      (sum, d) => sum + d.propertyOverrides.length,
      0
    );

    const canvasOverrides = this.calculateCanvasOverrides(template);

    return {
      orderChanges,
      hiddenComponents,
      propertyOverrides,
      totalOverrides,
      canvasOverrides,
    };
  }

  /**
   * Calculate component-level diffs
   *
   * @param template - Template to analyze
   */
  public static calculateComponentDiffs(template: Template): ComponentDiff[] {
    const topLevelComponents = template.components.filter((c) => !c.parentId);
    const desktopOrder = this.getDesktopOrder(template);
    const mobileOrder = this.getMobileOrder(template);

    return topLevelComponents.map((component) => {
      const desktopPosition = desktopOrder.indexOf(component.id);
      const mobilePosition = mobileOrder.indexOf(component.id);
      const hasOrderChange = desktopPosition !== mobilePosition;

      const visibleOnDesktop = component.visibility?.desktop ?? true;
      const visibleOnMobile = component.visibility?.mobile ?? visibleOnDesktop;
      const hasVisibilityChange = visibleOnDesktop !== visibleOnMobile;

      const propertyOverrides = this.calculatePropertyOverrides(component);
      const hasPropertyOverrides = propertyOverrides.length > 0;

      return {
        componentId: component.id,
        componentName: this.getComponentName(component),
        componentType: component.type,
        hasOrderChange,
        hasVisibilityChange,
        hasPropertyOverrides,
        desktopPosition,
        mobilePosition,
        visibleOnDesktop,
        visibleOnMobile,
        propertyOverrides,
      };
    });
  }

  /**
   * Calculate property overrides for a component
   *
   * @param component - Component to analyze
   */
  public static calculatePropertyOverrides(component: BaseComponent): PropertyDiff[] {
    if (!component.mobileStyles) {
      return [];
    }

    const overrides: PropertyDiff[] = [];
    const flatMobileStyles = this.flattenObject(component.mobileStyles, 'styles');

    for (const [propertyPath, mobileValue] of Object.entries(flatMobileStyles)) {
      const desktopValue = this.getNestedValue(component.styles, propertyPath.replace('styles.', ''));

      overrides.push({
        propertyPath,
        propertyLabel: this.getPropertyLabel(propertyPath),
        desktopValue,
        mobileValue,
        category: this.getPropertyCategory(propertyPath),
        formattedDesktop: this.formatValue(desktopValue),
        formattedMobile: this.formatValue(mobileValue),
      });
    }

    return overrides;
  }

  /**
   * Calculate canvas setting overrides
   *
   * @param template - Template to analyze
   */
  private static calculateCanvasOverrides(template: Template): Array<{
    settingPath: string;
    settingLabel: string;
    desktopValue: any;
    mobileValue: any;
  }> {
    // Canvas overrides would be stored in template settings
    // This is a placeholder - actual implementation depends on where canvas settings are stored
    return [];
  }

  /**
   * Calculate diff summary
   *
   * @param template - Template to analyze
   */
  public static calculateSummary(template: Template): DiffSummary {
    const componentDiffs = this.calculateComponentDiffs(template);

    const orderChanges = componentDiffs.filter((d) => d.hasOrderChange).length;
    const visibilityChanges = componentDiffs.filter((d) => d.hasVisibilityChange).length;
    const propertyOverrides = componentDiffs.filter((d) => d.hasPropertyOverrides).length;
    const totalPropertyOverrides = componentDiffs.reduce(
      (sum, d) => sum + d.propertyOverrides.length,
      0
    );

    const totalChanges = orderChanges + visibilityChanges + propertyOverrides;
    const hasMobileCustomizations = totalChanges > 0;

    return {
      totalChanges,
      orderChanges,
      visibilityChanges,
      propertyOverrides,
      totalPropertyOverrides,
      hasMobileCustomizations,
    };
  }

  /**
   * Get desktop component order
   */
  private static getDesktopOrder(template: Template): string[] {
    if (template.componentOrder) {
      return template.componentOrder.desktop;
    }
    return template.components.filter((c) => !c.parentId).map((c) => c.id);
  }

  /**
   * Get mobile component order
   */
  private static getMobileOrder(template: Template): string[] {
    if (template.componentOrder?.mobile) {
      return template.componentOrder.mobile;
    }
    return this.getDesktopOrder(template);
  }

  /**
   * Get component name for display
   */
  private static getComponentName(component: BaseComponent): string {
    if (component.metadata?.name) {
      return component.metadata.name;
    }

    if ('content' in component && component.content) {
      const content = component.content as any;
      if (content.text) {
        return content.text.substring(0, 30);
      }
      if (content.heading) {
        return content.heading.substring(0, 30);
      }
    }

    return component.type;
  }

  /**
   * Get property label from path
   */
  private static getPropertyLabel(propertyPath: string): string {
    const parts = propertyPath.split('.');
    const property = parts[parts.length - 1];

    return property
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  /**
   * Get property category
   */
  private static getPropertyCategory(
    propertyPath: string
  ): 'layout' | 'spacing' | 'typography' | 'colors' | 'other' {
    if (
      propertyPath.includes('width') ||
      propertyPath.includes('height') ||
      propertyPath.includes('display') ||
      propertyPath.includes('flex')
    ) {
      return 'layout';
    }
    if (
      propertyPath.includes('padding') ||
      propertyPath.includes('margin') ||
      propertyPath.includes('gap')
    ) {
      return 'spacing';
    }
    if (
      propertyPath.includes('font') ||
      propertyPath.includes('text') ||
      propertyPath.includes('line')
    ) {
      return 'typography';
    }
    if (propertyPath.includes('color') || propertyPath.includes('background')) {
      return 'colors';
    }
    return 'other';
  }

  /**
   * Format value for display
   */
  private static formatValue(value: any): string {
    if (value === undefined || value === null) {
      return 'none';
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  }

  /**
   * Get nested value from object
   */
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, part) => {
      return current?.[part];
    }, obj);
  }

  /**
   * Flatten nested object to dot notation
   */
  private static flattenObject(obj: any, prefix: string = ''): Record<string, any> {
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
