/**
 * Mode Manager Service
 *
 * Manages device mode state, mode switching, lazy loading, and property inheritance
 * for the Mobile Development Mode feature.
 *
 * Responsibilities:
 * - Current mode state management (desktop/mobile)
 * - Mode switching with event emission
 * - Lazy loading trigger for mobile data
 * - Property inheritance resolution (desktop → mobile fallback)
 * - Separate undo/redo command history per mode
 * - Integration with Builder class
 *
 * @module mobile
 */

import { EventEmitter } from '../services/EventEmitter';
import type { Template, BaseComponent, BaseStyles } from '../types';
import type { CommandManager } from '../commands/CommandManager';
import {
  DeviceMode,
  type ModeManagerState,
  type ModeSwitchEvent,
  type PropertyInheritanceInfo,
  type MobileDevModeConfig,
  type ComponentVisibility,
  type ComponentOrder,
  canOverrideProperty,
  resolveEffectiveValue,
  getComponentOrderForDevice,
  isComponentVisibleOnDevice,
} from './mobile.types';

/**
 * Mode Manager Events
 */
export enum ModeManagerEvent {
  /**
   * Fired when mode switch starts
   */
  MODE_SWITCH_START = 'mobile:mode-switch-start',

  /**
   * Fired when mode switch completes
   */
  MODE_SWITCH_COMPLETE = 'mobile:mode-switch-complete',

  /**
   * Fired when mobile data is loaded
   */
  MOBILE_DATA_LOADED = 'mobile:data-loaded',

  /**
   * Fired when mobile data is preloaded (hover)
   */
  MOBILE_DATA_PRELOADED = 'mobile:data-preloaded',

  /**
   * Fired when entering mobile mode for the first time
   */
  FIRST_MOBILE_ENTRY = 'mobile:first-entry',

  /**
   * Fired when a property override is set
   */
  PROPERTY_OVERRIDE_SET = 'mobile:property-override-set',

  /**
   * Fired when a property override is cleared
   */
  PROPERTY_OVERRIDE_CLEARED = 'mobile:property-override-cleared',
}

/**
 * Mode Manager Configuration
 */
export interface ModeManagerOptions {
  /**
   * Event emitter instance
   */
  eventEmitter: EventEmitter;

  /**
   * Mobile dev mode configuration
   */
  config: MobileDevModeConfig;

  /**
   * Desktop command manager (for desktop mode undo/redo)
   */
  desktopCommandManager?: CommandManager;

  /**
   * Mobile command manager (for mobile mode undo/redo)
   */
  mobileCommandManager?: CommandManager;
}

/**
 * Mode Manager Service
 *
 * Central service for managing device mode state and mode-specific operations
 */
export class ModeManager {
  private eventEmitter: EventEmitter;
  private config: MobileDevModeConfig;
  private state: ModeManagerState;
  private desktopCommandManager?: CommandManager;
  private mobileCommandManager?: CommandManager;
  private currentTemplate?: Template;

  constructor(options: ModeManagerOptions) {
    this.eventEmitter = options.eventEmitter;
    this.config = options.config;
    this.desktopCommandManager = options.desktopCommandManager;
    this.mobileCommandManager = options.mobileCommandManager;

    // Initialize state
    this.state = {
      currentMode: DeviceMode.DESKTOP,
      switching: false,
      mobileDataLoaded: false,
      isFirstMobileEntry: true,
      defaultsApplied: false,
    };
  }

  /**
   * Get current device mode
   */
  public getCurrentMode(): DeviceMode {
    return this.state.currentMode;
  }

  /**
   * Check if currently in desktop mode
   */
  public isDesktopMode(): boolean {
    return this.state.currentMode === DeviceMode.DESKTOP;
  }

  /**
   * Check if currently in mobile mode
   */
  public isMobileMode(): boolean {
    return this.state.currentMode === DeviceMode.MOBILE;
  }

  /**
   * Get current state
   */
  public getState(): Readonly<ModeManagerState> {
    return { ...this.state };
  }

  /**
   * Set current template (for tracking mobile metadata)
   */
  public setTemplate(template: Template): void {
    this.currentTemplate = template;

    // Update state from template metadata
    if (template.mobileDevMode) {
      this.state.defaultsApplied = template.mobileDevMode.defaultsApplied || false;
      this.state.isFirstMobileEntry = !template.mobileDevMode.hasEnteredMobileMode;
    }
  }

  /**
   * Switch device mode
   *
   * @param toMode - Target mode to switch to
   * @param options - Switch options
   * @returns Promise that resolves when switch is complete
   */
  public async switchMode(
    toMode: DeviceMode,
    options: {
      selectedComponentId?: string;
      scrollPosition?: { x: number; y: number };
      skipLazyLoad?: boolean;
    } = {}
  ): Promise<void> {
    // Already in target mode
    if (this.state.currentMode === toMode) {
      return;
    }

    // Already switching
    if (this.state.switching) {
      console.warn('Mode switch already in progress');
      return;
    }

    const fromMode = this.state.currentMode;
    this.state.switching = true;

    const switchEvent: ModeSwitchEvent = {
      fromMode,
      toMode,
      timestamp: Date.now(),
      selectedComponentId: options.selectedComponentId,
      scrollPosition: options.scrollPosition || { x: 0, y: 0 },
    };

    try {
      // Emit switch start event
      this.eventEmitter.emit(ModeManagerEvent.MODE_SWITCH_START, switchEvent);

      // Load mobile data if switching to mobile and not yet loaded
      if (toMode === DeviceMode.MOBILE && !this.state.mobileDataLoaded && !options.skipLazyLoad) {
        await this.loadMobileData();
      }

      // Check if this is first mobile entry
      if (toMode === DeviceMode.MOBILE && this.state.isFirstMobileEntry) {
        this.state.isFirstMobileEntry = false;

        // Update template metadata
        if (this.currentTemplate) {
          if (!this.currentTemplate.mobileDevMode) {
            this.currentTemplate.mobileDevMode = {
              defaultsApplied: false,
              hasEnteredMobileMode: true,
              overrides: [],
            };
          } else {
            this.currentTemplate.mobileDevMode.hasEnteredMobileMode = true;
          }
        }

        // Emit first mobile entry event (triggers defaults prompt)
        this.eventEmitter.emit(ModeManagerEvent.FIRST_MOBILE_ENTRY, {
          template: this.currentTemplate,
        });
      }

      // Update current mode
      this.state.currentMode = toMode;

      // Emit switch complete event
      this.eventEmitter.emit(ModeManagerEvent.MODE_SWITCH_COMPLETE, switchEvent);
    } catch (error) {
      console.error('Error during mode switch:', error);
      throw error;
    } finally {
      this.state.switching = false;
    }
  }

  /**
   * Load mobile data (lazy loading)
   *
   * Initializes mobile-specific data structures if not already loaded
   */
  public async loadMobileData(): Promise<void> {
    if (this.state.mobileDataLoaded) {
      return;
    }

    // In a real implementation, this might:
    // - Initialize mobile styles for components
    // - Load mobile-specific assets
    // - Initialize mobile component order
    // For now, just mark as loaded

    this.state.mobileDataLoaded = true;
    this.eventEmitter.emit(ModeManagerEvent.MOBILE_DATA_LOADED, {
      timestamp: Date.now(),
    });
  }

  /**
   * Preload mobile data (anticipatory loading on hover)
   *
   * Triggers mobile data loading in the background
   */
  public async preloadMobileData(): Promise<void> {
    if (this.state.mobileDataLoaded || !this.config.performance.preloadOnHover) {
      return;
    }

    await this.loadMobileData();
    this.eventEmitter.emit(ModeManagerEvent.MOBILE_DATA_PRELOADED, {
      timestamp: Date.now(),
    });
  }

  /**
   * Get effective styles for a component in current mode
   *
   * Resolves inheritance: mobile styles override desktop styles
   *
   * @param component - Component to get styles for
   * @returns Effective styles for current mode
   */
  public getEffectiveStyles<T extends BaseStyles>(component: BaseComponent): T {
    if (this.state.currentMode === DeviceMode.DESKTOP) {
      return component.styles as T;
    }

    // Mobile mode: merge desktop styles with mobile overrides
    const desktopStyles = component.styles;
    const mobileOverrides = component.mobileStyles || {};

    return {
      ...desktopStyles,
      ...mobileOverrides,
    } as T;
  }

  /**
   * Get property inheritance info for a component property
   *
   * @param component - Component to check
   * @param propertyPath - Property path (e.g., 'styles.padding')
   * @returns Property inheritance information
   */
  public getPropertyInheritanceInfo(
    component: BaseComponent,
    propertyPath: string
  ): PropertyInheritanceInfo {
    // Parse property path
    const parts = propertyPath.split('.');
    const isStyleProperty = parts[0] === 'styles';
    const stylePath = isStyleProperty ? parts.slice(1).join('.') : null;

    // Check if property can be overridden
    const canOverride = canOverrideProperty(
      propertyPath,
      this.config.propertyOverrides.blacklist
    );

    // Get desktop value
    let desktopValue: any;
    if (isStyleProperty && stylePath) {
      desktopValue = this.getNestedValue(component.styles, stylePath);
    } else {
      desktopValue = this.getNestedValue(component, propertyPath);
    }

    // Get mobile value
    let mobileValue: any = undefined;
    let isOverridden = false;

    if (isStyleProperty && stylePath && component.mobileStyles) {
      mobileValue = this.getNestedValue(component.mobileStyles, stylePath);
      isOverridden = mobileValue !== undefined;
    }

    // Effective value
    const effectiveValue = resolveEffectiveValue(desktopValue, mobileValue);

    return {
      propertyPath,
      isOverridden,
      desktopValue,
      mobileValue,
      effectiveValue,
      canOverride,
      cannotOverrideReason: !canOverride
        ? 'This property cannot be overridden for mobile (blacklisted)'
        : undefined,
    };
  }

  /**
   * Get component visibility for current mode
   *
   * @param component - Component to check
   * @returns Whether component is visible in current mode
   */
  public isComponentVisible(component: BaseComponent): boolean {
    if (!component.visibility) {
      return true; // Default: visible
    }

    return isComponentVisibleOnDevice(component.visibility, this.state.currentMode);
  }

  /**
   * Get component order for current mode
   *
   * @param componentOrder - Component order configuration
   * @returns Component IDs in order for current mode
   */
  public getComponentOrder(componentOrder: ComponentOrder): string[] {
    return getComponentOrderForDevice(componentOrder, this.state.currentMode);
  }

  /**
   * Get active command manager for current mode
   *
   * Returns the appropriate command manager based on current mode
   */
  public getActiveCommandManager(): CommandManager | undefined {
    if (this.state.currentMode === DeviceMode.MOBILE) {
      return this.mobileCommandManager;
    }
    return this.desktopCommandManager;
  }

  /**
   * Check if undo is available in current mode
   */
  public canUndo(): boolean {
    const manager = this.getActiveCommandManager();
    return manager ? manager.canUndo() : false;
  }

  /**
   * Check if redo is available in current mode
   */
  public canRedo(): boolean {
    const manager = this.getActiveCommandManager();
    return manager ? manager.canRedo() : false;
  }

  /**
   * Undo last command in current mode
   */
  public async undo(): Promise<boolean> {
    const manager = this.getActiveCommandManager();
    return manager ? manager.undo() : false;
  }

  /**
   * Redo next command in current mode
   */
  public async redo(): Promise<boolean> {
    const manager = this.getActiveCommandManager();
    return manager ? manager.redo() : false;
  }

  /**
   * Get command history for current mode
   */
  public getCommandHistory() {
    const manager = this.getActiveCommandManager();
    return manager ? manager.getHistory() : [];
  }

  /**
   * Clear command history for current mode
   */
  public clearCommandHistory(): void {
    const manager = this.getActiveCommandManager();
    if (manager) {
      manager.clearHistory();
    }
  }

  /**
   * Mark mobile defaults as applied
   */
  public markDefaultsApplied(): void {
    this.state.defaultsApplied = true;

    if (this.currentTemplate) {
      if (!this.currentTemplate.mobileDevMode) {
        this.currentTemplate.mobileDevMode = {
          defaultsApplied: true,
          defaultsAppliedAt: Date.now(),
          hasEnteredMobileMode: true,
          overrides: [],
        };
      } else {
        this.currentTemplate.mobileDevMode.defaultsApplied = true;
        this.currentTemplate.mobileDevMode.defaultsAppliedAt = Date.now();
      }
    }
  }

  /**
   * Get nested value from object using dot notation path
   *
   * @param obj - Object to get value from
   * @param path - Dot notation path (e.g., 'padding.top')
   * @returns Value at path or undefined
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, part) => {
      return current?.[part];
    }, obj);
  }

  /**
   * Dispose and cleanup
   */
  public dispose(): void {
    // Clear references
    this.currentTemplate = undefined;
    this.desktopCommandManager = undefined;
    this.mobileCommandManager = undefined;
  }
}
