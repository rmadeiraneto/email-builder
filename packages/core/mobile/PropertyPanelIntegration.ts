/**
 * Property Panel Integration
 *
 * Provides utilities for integrating mobile dev mode into property panels
 *
 * Responsibilities:
 * - Property override indicators
 * - Reset to desktop functionality
 * - Mobile-specific control definitions
 * - Property diff calculation
 * - Override badge data
 * - Control visibility rules
 *
 * @module mobile
 */

import type { BaseComponent } from '../types';
import type {
  MobileDevModeConfig,
  MobileControlDefinition,
  PropertyInheritanceInfo,
} from './mobile.types';
import type { PropertyOverrideManager } from './PropertyOverrideManager';
import type { ModeManager } from './ModeManager';

/**
 * Property control state
 */
export interface PropertyControlState {
  /**
   * Property path
   */
  propertyPath: string;

  /**
   * Property label for display
   */
  label: string;

  /**
   * Current value
   */
  value: any;

  /**
   * Desktop value
   */
  desktopValue: any;

  /**
   * Is overridden for mobile
   */
  isOverridden: boolean;

  /**
   * Can be overridden
   */
  canOverride: boolean;

  /**
   * Override indicator (for UI badge)
   */
  overrideIndicator?: {
    show: boolean;
    tooltip: string;
  };

  /**
   * Show reset button
   */
  showResetButton: boolean;

  /**
   * Is in mobile mode
   */
  isMobileMode: boolean;

  /**
   * Property category
   */
  category: 'layout' | 'spacing' | 'typography' | 'colors' | 'other';
}

/**
 * Property section definition
 */
export interface PropertySection {
  /**
   * Section ID
   */
  id: string;

  /**
   * Section label
   */
  label: string;

  /**
   * Section description
   */
  description?: string;

  /**
   * Mobile-specific section
   */
  mobileOnly: boolean;

  /**
   * Controls in this section
   */
  controls: MobileControlDefinition[];

  /**
   * Section order/priority
   */
  order: number;

  /**
   * Collapsed by default
   */
  collapsed: boolean;
}

/**
 * Property Panel Integration Options
 */
export interface PropertyPanelIntegrationOptions {
  /**
   * Mode manager instance
   */
  modeManager: ModeManager;

  /**
   * Property override manager instance
   */
  overrideManager: PropertyOverrideManager;

  /**
   * Mobile dev mode configuration
   */
  config: MobileDevModeConfig;
}

/**
 * Property Panel Integration Service
 *
 * Provides utilities for property panel mobile integration
 */
export class PropertyPanelIntegration {
  private modeManager: ModeManager;
  private overrideManager: PropertyOverrideManager;
  private config: MobileDevModeConfig;

  constructor(options: PropertyPanelIntegrationOptions) {
    this.modeManager = options.modeManager;
    this.overrideManager = options.overrideManager;
    this.config = options.config;
  }

  /**
   * Get property control state
   *
   * Returns all information needed to render a property control with mobile awareness
   *
   * @param component - Component being edited
   * @param propertyPath - Property path (e.g., 'styles.padding')
   * @param label - Property label
   */
  public getPropertyControlState(
    component: BaseComponent,
    propertyPath: string,
    label: string
  ): PropertyControlState {
    const isMobileMode = this.modeManager.isMobileMode();
    const inheritanceInfo = this.modeManager.getPropertyInheritanceInfo(
      component,
      propertyPath
    );

    const category = this.getPropertyCategory(propertyPath);
    const showResetButton = isMobileMode && inheritanceInfo.isOverridden;
    const overrideIndicator = this.getOverrideIndicator(inheritanceInfo, isMobileMode);

    const result: PropertyControlState = {
      propertyPath,
      label,
      value: inheritanceInfo.effectiveValue,
      desktopValue: inheritanceInfo.desktopValue,
      isOverridden: inheritanceInfo.isOverridden,
      canOverride: inheritanceInfo.canOverride,
      showResetButton,
      isMobileMode,
      category,
    };

    if (overrideIndicator !== undefined) {
      result.overrideIndicator = overrideIndicator;
    }

    return result;
  }

  /**
   * Reset property to desktop value
   *
   * @param componentId - Component ID
   * @param propertyPath - Property path
   */
  public resetPropertyToDesktop(componentId: string, propertyPath: string): void {
    this.overrideManager.clearOverride(componentId, propertyPath);
  }

  /**
   * Reset all properties for component
   *
   * @param componentId - Component ID
   */
  public resetAllPropertiesToDesktop(componentId: string): void {
    this.overrideManager.clearComponentOverrides(componentId);
  }

  /**
   * Reset properties by category
   *
   * @param componentId - Component ID
   * @param category - Property category
   */
  public resetCategoryToDesktop(
    componentId: string,
    category: 'layout' | 'spacing' | 'typography' | 'colors' | 'other'
  ): void {
    this.overrideManager.clearComponentOverridesByCategory(componentId, category as any);
  }

  /**
   * Get mobile-specific sections for component type
   *
   * @param componentType - Component type
   */
  public getMobileSections(componentType: string): PropertySection[] {
    const sections: PropertySection[] = [];

    // Mobile Layout section (always show in mobile mode)
    sections.push({
      id: 'mobile-layout',
      label: 'Mobile Layout',
      description: 'Control how this component appears on mobile devices',
      mobileOnly: true,
      controls: this.getMobileLayoutControls(componentType),
      order: 0,
      collapsed: false,
    });

    // Component-specific mobile controls
    const componentControls = this.config.componentMobileControls[componentType];
    if (componentControls?.enabled) {
      sections.push({
        id: `mobile-${componentType}`,
        label: `Mobile ${componentType}`,
        mobileOnly: true,
        controls: componentControls.controls,
        order: 1,
        collapsed: false,
      });
    }

    return sections;
  }

  /**
   * Get override badge data
   *
   * For displaying override count in property panel header
   *
   * @param componentId - Component ID
   */
  public getOverrideBadge(componentId: string): {
    show: boolean;
    count: number;
    tooltip: string;
  } {
    if (!this.modeManager.isMobileMode()) {
      return {
        show: false,
        count: 0,
        tooltip: '',
      };
    }

    const overrides = this.overrideManager.getComponentOverrides(componentId);
    const count = Object.keys(overrides).length;

    return {
      show: count > 0,
      count,
      tooltip: `${count} mobile override${count === 1 ? '' : 's'}`,
    };
  }

  /**
   * Get property diff for display
   *
   * Shows desktop vs mobile values side by side
   *
   * @param component - Component
   * @param propertyPath - Property path
   */
  public getPropertyDiff(
    component: BaseComponent,
    propertyPath: string
  ): {
    desktopValue: any;
    mobileValue: any;
    isDifferent: boolean;
    formattedDesktop: string;
    formattedMobile: string;
  } {
    const inheritanceInfo = this.modeManager.getPropertyInheritanceInfo(
      component,
      propertyPath
    );

    return {
      desktopValue: inheritanceInfo.desktopValue,
      mobileValue: inheritanceInfo.mobileValue,
      isDifferent: inheritanceInfo.isOverridden,
      formattedDesktop: this.formatValue(inheritanceInfo.desktopValue),
      formattedMobile: this.formatValue(inheritanceInfo.mobileValue ?? inheritanceInfo.desktopValue),
    };
  }

  /**
   * Check if control should be visible
   *
   * @param control - Control definition
   */
  public shouldShowControl(control: MobileControlDefinition): boolean {
    // Check target mode
    if (control.showInTargets) {
      const targetMode = this.config.targetMode;
      if (!control.showInTargets.includes(targetMode)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get all overridden properties for component
   *
   * @param componentId - Component ID
   */
  public getOverriddenProperties(componentId: string): Array<{
    propertyPath: string;
    label: string;
    desktopValue: any;
    mobileValue: any;
    category: string;
  }> {
    const overrides = this.overrideManager.getComponentOverrides(componentId);

    return Object.entries(overrides).map(([path, value]) => ({
      propertyPath: path,
      label: this.getPropertyLabel(path),
      desktopValue: undefined, // Would need component reference to get
      mobileValue: value,
      category: this.getPropertyCategory(path),
    }));
  }

  /**
   * Get override indicator data
   */
  private getOverrideIndicator(
    inheritanceInfo: PropertyInheritanceInfo,
    isMobileMode: boolean
  ): { show: boolean; tooltip: string } | undefined {
    if (!isMobileMode) {
      return undefined;
    }

    if (inheritanceInfo.isOverridden) {
      return {
        show: true,
        tooltip: `Overridden for mobile (Desktop: ${this.formatValue(inheritanceInfo.desktopValue)})`,
      };
    }

    return {
      show: false,
      tooltip: 'Inherited from desktop',
    };
  }

  /**
   * Get mobile layout controls
   */
  private getMobileLayoutControls(_componentType: string): MobileControlDefinition[] {
    return [
      {
        id: 'mobile-visible',
        label: 'Visible on Mobile',
        type: 'toggle',
        propertyPath: 'visibility.mobile',
        defaultValue: true,
        helpText: 'Show or hide this component on mobile devices',
      },
      {
        id: 'mobile-width',
        label: 'Mobile Width',
        type: 'dropdown',
        propertyPath: 'styles.width',
        options: [
          { value: '100%', label: 'Full Width' },
          { value: 'auto', label: 'Auto' },
          { value: '50%', label: '50%' },
          { value: 'inherit', label: 'Inherit from Desktop' },
        ],
        helpText: 'Control component width on mobile',
      },
      {
        id: 'mobile-padding',
        label: 'Mobile Padding',
        type: 'input',
        propertyPath: 'styles.padding',
        helpText: 'Adjust padding for mobile (e.g., "8px", "1rem")',
      },
      {
        id: 'mobile-margin',
        label: 'Mobile Margin',
        type: 'input',
        propertyPath: 'styles.margin',
        helpText: 'Adjust margin for mobile',
      },
    ];
  }

  /**
   * Get property category
   */
  private getPropertyCategory(propertyPath: string): 'layout' | 'spacing' | 'typography' | 'colors' | 'other' {
    if (propertyPath.includes('width') || propertyPath.includes('height') || propertyPath.includes('display')) {
      return 'layout';
    }
    if (propertyPath.includes('padding') || propertyPath.includes('margin') || propertyPath.includes('gap')) {
      return 'spacing';
    }
    if (propertyPath.includes('font') || propertyPath.includes('text') || propertyPath.includes('line')) {
      return 'typography';
    }
    if (propertyPath.includes('color') || propertyPath.includes('background')) {
      return 'colors';
    }
    return 'other';
  }

  /**
   * Get property label from path
   */
  private getPropertyLabel(propertyPath: string): string {
    const parts = propertyPath.split('.');
    const property = parts[parts.length - 1] || propertyPath;

    // Convert camelCase to Title Case
    return property
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  /**
   * Format value for display
   */
  private formatValue(value: any): string {
    if (value === undefined || value === null) {
      return 'none';
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  }
}
