/**
 * Mobile Defaults Applicator
 *
 * Applies mobile-optimized defaults when first entering mobile mode
 *
 * Responsibilities:
 * - Apply transformation rules (padding, margin, fonts)
 * - Component-type-specific transformations
 * - Auto-wrap horizontal lists
 * - Stack headers vertically
 * - Full-width buttons
 * - Minimum touch target sizes
 * - Prompt user on first mobile entry
 *
 * @module mobile
 */

import { EventEmitter } from '../services/EventEmitter';
import type { Template, BaseComponent, BaseStyles } from '../types';
import type { PropertyOverrideManager } from './PropertyOverrideManager';
import type { ModeManager } from './ModeManager';
import type { MobileDevModeConfig } from './mobile.types';

/**
 * Mobile Defaults Applicator Events
 */
export enum MobileDefaultsEvent {
  /**
   * Fired before defaults are applied
   */
  BEFORE_APPLY = 'mobile-defaults:before-apply',

  /**
   * Fired after defaults are applied
   */
  AFTER_APPLY = 'mobile-defaults:after-apply',

  /**
   * Fired when prompt is shown
   */
  PROMPT_SHOWN = 'mobile-defaults:prompt-shown',

  /**
   * Fired when user accepts defaults
   */
  DEFAULTS_ACCEPTED = 'mobile-defaults:accepted',

  /**
   * Fired when user declines defaults
   */
  DEFAULTS_DECLINED = 'mobile-defaults:declined',
}

/**
 * Defaults application result
 */
export interface DefaultsApplicationResult {
  /**
   * Success
   */
  success: boolean;

  /**
   * Number of components affected
   */
  componentsAffected: number;

  /**
   * Number of properties changed
   */
  propertiesChanged: number;

  /**
   * Errors encountered
   */
  errors: string[];

  /**
   * Applied transformations
   */
  appliedTransformations: Array<{
    componentId: string;
    componentType: string;
    properties: string[];
  }>;
}

/**
 * Mobile Defaults Applicator Options
 */
export interface MobileDefaultsApplicatorOptions {
  /**
   * Event emitter instance
   */
  eventEmitter: EventEmitter;

  /**
   * Property override manager
   */
  overrideManager: PropertyOverrideManager;

  /**
   * Mode manager
   */
  modeManager: ModeManager;

  /**
   * Mobile dev mode configuration
   */
  config: MobileDevModeConfig;

  /**
   * Template to apply defaults to
   */
  template: Template;
}

/**
 * Mobile Defaults Applicator Service
 *
 * Applies opinionated mobile defaults on first mobile mode entry
 */
export class MobileDefaultsApplicator {
  private eventEmitter: EventEmitter;
  private overrideManager: PropertyOverrideManager;
  private modeManager: ModeManager;
  private config: MobileDevModeConfig;
  private template: Template;

  constructor(options: MobileDefaultsApplicatorOptions) {
    this.eventEmitter = options.eventEmitter;
    this.overrideManager = options.overrideManager;
    this.modeManager = options.modeManager;
    this.config = options.config;
    this.template = options.template;
  }

  /**
   * Check if defaults should be prompted
   *
   * Called when entering mobile mode for first time
   */
  public shouldPrompt(): boolean {
    if (!this.config.mobileDefaults.enabled) {
      return false;
    }

    if (!this.config.mobileDefaults.showPromptOnFirstSwitch) {
      return false;
    }

    // Check if already applied
    if (this.template.mobileDevMode?.defaultsApplied) {
      return false;
    }

    return true;
  }

  /**
   * Show defaults prompt
   *
   * Emits event for UI to show prompt dialog
   */
  public showPrompt(): void {
    this.eventEmitter.emit(MobileDefaultsEvent.PROMPT_SHOWN, {
      timestamp: Date.now(),
    });
  }

  /**
   * Apply mobile defaults to all components
   *
   * @param options - Application options
   */
  public async applyDefaults(options: {
    skipPrompt?: boolean;
  } = {}): Promise<DefaultsApplicationResult> {
    if (!this.config.mobileDefaults.enabled) {
      return {
        success: false,
        componentsAffected: 0,
        propertiesChanged: 0,
        errors: ['Mobile defaults feature is disabled'],
        appliedTransformations: [],
      };
    }

    // Emit before apply event
    this.eventEmitter.emit(MobileDefaultsEvent.BEFORE_APPLY, {
      timestamp: Date.now(),
    });

    const result: DefaultsApplicationResult = {
      success: true,
      componentsAffected: 0,
      propertiesChanged: 0,
      errors: [],
      appliedTransformations: [],
    };

    // Apply defaults to each component
    for (const component of this.template.components) {
      try {
        const componentResult = await this.applyDefaultsToComponent(component);

        if (componentResult.propertiesChanged > 0) {
          result.componentsAffected++;
          result.propertiesChanged += componentResult.propertiesChanged;
          result.appliedTransformations.push({
            componentId: component.id,
            componentType: component.type,
            properties: componentResult.properties,
          });
        }
      } catch (error) {
        result.errors.push(`Error applying defaults to ${component.id}: ${error}`);
      }
    }

    // Mark defaults as applied
    this.modeManager.markDefaultsApplied();

    // Emit after apply event
    this.eventEmitter.emit(MobileDefaultsEvent.AFTER_APPLY, {
      result,
      timestamp: Date.now(),
    });

    // Emit accepted event
    this.eventEmitter.emit(MobileDefaultsEvent.DEFAULTS_ACCEPTED, {
      timestamp: Date.now(),
    });

    return result;
  }

  /**
   * Decline defaults
   *
   * User chose not to apply defaults
   */
  public declineDefaults(): void {
    // Mark as applied so prompt doesn't show again
    this.modeManager.markDefaultsApplied();

    this.eventEmitter.emit(MobileDefaultsEvent.DEFAULTS_DECLINED, {
      timestamp: Date.now(),
    });
  }

  /**
   * Apply defaults to a single component
   */
  private async applyDefaultsToComponent(
    component: BaseComponent
  ): Promise<{ propertiesChanged: number; properties: string[] }> {
    const transformations = this.config.mobileDefaults.transformations;
    const properties: string[] = [];

    // Apply general transformations
    await this.applyPaddingReduction(component, transformations.paddingReduction, properties);
    await this.applyMarginReduction(component, transformations.marginReduction, properties);
    await this.applyFontSizeReduction(component, transformations.fontSizeReduction, properties);

    // Apply component-type-specific defaults
    await this.applyComponentSpecificDefaults(component, properties);

    // Apply feature-specific transformations
    if (transformations.fullWidthButtons) {
      await this.applyFullWidthButtons(component, properties);
    }

    if (transformations.minTouchTargetSize) {
      await this.applyMinTouchTargetSize(component, transformations.minTouchTargetSize, properties);
    }

    if (transformations.autoWrapHorizontalLists) {
      await this.applyAutoWrapLists(component, properties);
    }

    if (transformations.stackHeadersVertically) {
      await this.applyStackHeaders(component, properties);
    }

    return {
      propertiesChanged: properties.length,
      properties,
    };
  }

  /**
   * Apply padding reduction
   */
  private async applyPaddingReduction(
    component: BaseComponent,
    reductionFactor: number,
    properties: string[]
  ): Promise<void> {
    const paddingProperties = ['padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'];

    for (const prop of paddingProperties) {
      const fullPath = `styles.${prop}`;
      const currentValue = (component.styles as any)[prop];

      if (currentValue) {
        const newValue = this.reduceCSSValue(currentValue, reductionFactor);
        if (newValue && newValue !== currentValue) {
          this.overrideManager.setOverride(component.id, fullPath, newValue);
          properties.push(fullPath);
        }
      }
    }
  }

  /**
   * Apply margin reduction
   */
  private async applyMarginReduction(
    component: BaseComponent,
    reductionFactor: number,
    properties: string[]
  ): Promise<void> {
    const marginProperties = ['margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft'];

    for (const prop of marginProperties) {
      const fullPath = `styles.${prop}`;
      const currentValue = (component.styles as any)[prop];

      if (currentValue) {
        const newValue = this.reduceCSSValue(currentValue, reductionFactor);
        if (newValue && newValue !== currentValue) {
          this.overrideManager.setOverride(component.id, fullPath, newValue);
          properties.push(fullPath);
        }
      }
    }
  }

  /**
   * Apply font size reduction
   */
  private async applyFontSizeReduction(
    component: BaseComponent,
    reductionFactor: number,
    properties: string[]
  ): Promise<void> {
    const fullPath = 'styles.fontSize';
    const currentValue = (component.styles as any).fontSize;

    if (currentValue) {
      const newValue = this.reduceCSSValue(currentValue, reductionFactor);
      if (newValue && newValue !== currentValue) {
        this.overrideManager.setOverride(component.id, fullPath, newValue);
        properties.push(fullPath);
      }
    }
  }

  /**
   * Apply component-specific defaults
   */
  private async applyComponentSpecificDefaults(
    component: BaseComponent,
    properties: string[]
  ): Promise<void> {
    const componentDefaults = this.config.mobileDefaults.componentSpecific[component.type];

    if (!componentDefaults) {
      return;
    }

    // Apply each default property
    for (const [property, value] of Object.entries(componentDefaults)) {
      const fullPath = `styles.${property}`;
      this.overrideManager.setOverride(component.id, fullPath, value);
      properties.push(fullPath);
    }
  }

  /**
   * Apply full-width to buttons
   */
  private async applyFullWidthButtons(
    component: BaseComponent,
    properties: string[]
  ): Promise<void> {
    // Check if component is a button or CTA
    if (component.type === 'button' || component.type === 'cta') {
      const fullPath = 'styles.width';
      this.overrideManager.setOverride(component.id, fullPath, '100%');
      properties.push(fullPath);
    }
  }

  /**
   * Apply minimum touch target size
   */
  private async applyMinTouchTargetSize(
    component: BaseComponent,
    minSize: number,
    properties: string[]
  ): Promise<void> {
    // Check if component is interactive (button, link, etc.)
    const interactiveTypes = ['button', 'link', 'cta'];

    if (interactiveTypes.includes(component.type)) {
      const fullPath = 'styles.minHeight';
      this.overrideManager.setOverride(component.id, fullPath, `${minSize}px`);
      properties.push(fullPath);
    }
  }

  /**
   * Apply auto-wrap to horizontal lists
   */
  private async applyAutoWrapLists(
    component: BaseComponent,
    properties: string[]
  ): Promise<void> {
    // Check if component is a horizontal list
    const styles = component.styles as any;

    if (styles.display === 'flex' && styles.flexDirection === 'row') {
      const fullPath = 'styles.flexWrap';
      this.overrideManager.setOverride(component.id, fullPath, 'wrap');
      properties.push(fullPath);
    }
  }

  /**
   * Apply vertical stacking to headers
   */
  private async applyStackHeaders(
    component: BaseComponent,
    properties: string[]
  ): Promise<void> {
    // Check if component is a header
    if (component.type === 'header') {
      const fullPath = 'styles.flexDirection';
      this.overrideManager.setOverride(component.id, fullPath, 'column');
      properties.push(fullPath);
    }
  }

  /**
   * Reduce CSS value by factor
   *
   * @param value - CSS value (e.g., "16px", "2rem")
   * @param factor - Reduction factor (0.5 = reduce by 50%)
   */
  private reduceCSSValue(value: string | number, factor: number): string | number | null {
    if (typeof value === 'number') {
      return Math.round(value * factor);
    }

    if (typeof value === 'string') {
      const match = value.match(/^([\d.]+)(.*)$/);
      if (match) {
        const numValue = parseFloat(match[1]);
        const unit = match[2];
        const reduced = numValue * factor;
        return `${reduced}${unit}`;
      }
    }

    return null;
  }

  /**
   * Update template reference
   */
  public setTemplate(template: Template): void {
    this.template = template;
  }
}
