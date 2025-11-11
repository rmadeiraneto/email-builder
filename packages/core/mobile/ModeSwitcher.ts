/**
 * Mode Switcher Service
 *
 * Manages the device mode switcher UI logic and interactions
 *
 * Responsibilities:
 * - Mode switching coordination with animation
 * - Preload trigger on hover
 * - Keyboard shortcut handling
 * - Sticky positioning state
 * - Mode switch confirmation dialogs
 * - Integration with ModeManager
 *
 * @module mobile
 */

import { EventEmitter } from '../services/EventEmitter';
import type { ModeManager } from './ModeManager';
import { DeviceMode, type MobileDevModeConfig } from './mobile.types';

/**
 * Mode Switcher Events
 */
export enum ModeSwitcherEvent {
  /**
   * Fired when mode switch is requested
   */
  SWITCH_REQUESTED = 'mode-switcher:switch-requested',

  /**
   * Fired when mode switch animation starts
   */
  ANIMATION_START = 'mode-switcher:animation-start',

  /**
   * Fired when mode switch animation completes
   */
  ANIMATION_COMPLETE = 'mode-switcher:animation-complete',

  /**
   * Fired when hover triggers preload
   */
  HOVER_PRELOAD = 'mode-switcher:hover-preload',

  /**
   * Fired when keyboard shortcut is triggered
   */
  KEYBOARD_SHORTCUT = 'mode-switcher:keyboard-shortcut',
}

/**
 * Mode Switcher State
 */
export interface ModeSwitcherState {
  /**
   * Current mode
   */
  currentMode: DeviceMode;

  /**
   * Is switching in progress
   */
  switching: boolean;

  /**
   * Is hovering over switcher
   */
  hovering: boolean;

  /**
   * Has preloaded mobile data
   */
  preloaded: boolean;

  /**
   * Sticky positioning enabled
   */
  sticky: boolean;

  /**
   * Show device labels
   */
  showLabels: boolean;

  /**
   * Custom labels
   */
  labels: {
    desktop: string;
    mobile: string;
  };

  /**
   * Animation duration in ms
   */
  animationDuration: number;
}

/**
 * Mode Switcher Options
 */
export interface ModeSwitcherOptions {
  /**
   * Event emitter instance
   */
  eventEmitter: EventEmitter;

  /**
   * Mode manager instance
   */
  modeManager: ModeManager;

  /**
   * Mobile dev mode configuration
   */
  config: MobileDevModeConfig;

  /**
   * Keyboard shortcut (e.g., 'Cmd+D' or 'Ctrl+D')
   * @default 'Mod+D' (Cmd on Mac, Ctrl on Windows/Linux)
   */
  keyboardShortcut?: string;
}

/**
 * Mode Switcher Service
 *
 * Framework-agnostic mode switcher logic
 */
export class ModeSwitcher {
  private eventEmitter: EventEmitter;
  private modeManager: ModeManager;
  private config: MobileDevModeConfig;
  private keyboardShortcut: string;
  private state: ModeSwitcherState;
  private hoverTimeoutId?: ReturnType<typeof setTimeout>;
  private keyboardListenerAttached = false;

  constructor(options: ModeSwitcherOptions) {
    this.eventEmitter = options.eventEmitter;
    this.modeManager = options.modeManager;
    this.config = options.config;
    this.keyboardShortcut = options.keyboardShortcut || 'Mod+D';

    // Initialize state
    this.state = {
      currentMode: this.modeManager.getCurrentMode(),
      switching: false,
      hovering: false,
      preloaded: false,
      sticky: this.config.modeSwitcher.sticky,
      showLabels: this.config.modeSwitcher.showLabels,
      labels: {
        desktop: this.config.modeSwitcher.customLabels?.desktop || 'Desktop',
        mobile: this.config.modeSwitcher.customLabels?.mobile || 'Mobile',
      },
      animationDuration: this.config.canvas.transitionDuration,
    };

    // Listen to mode manager events
    this.setupModeManagerListeners();
  }

  /**
   * Get current state
   */
  public getState(): Readonly<ModeSwitcherState> {
    return { ...this.state };
  }

  /**
   * Switch to a specific mode
   *
   * @param mode - Target mode
   * @param options - Switch options
   */
  public async switchToMode(
    mode: DeviceMode,
    options: {
      skipAnimation?: boolean;
      selectedComponentId?: string;
      scrollPosition?: { x: number; y: number };
    } = {}
  ): Promise<void> {
    // Already in target mode
    if (this.state.currentMode === mode) {
      return;
    }

    // Already switching
    if (this.state.switching) {
      console.warn('Mode switch already in progress');
      return;
    }

    this.state.switching = true;

    try {
      // Emit switch requested
      this.eventEmitter.emit(ModeSwitcherEvent.SWITCH_REQUESTED, {
        fromMode: this.state.currentMode,
        toMode: mode,
        timestamp: Date.now(),
      });

      // Start animation
      if (!options.skipAnimation) {
        this.eventEmitter.emit(ModeSwitcherEvent.ANIMATION_START, {
          mode,
          duration: this.state.animationDuration,
          timestamp: Date.now(),
        });

        // Wait for animation duration
        await this.delay(this.state.animationDuration);
      }

      // Switch mode via ModeManager
      await this.modeManager.switchMode(mode, {
        selectedComponentId: options.selectedComponentId,
        scrollPosition: options.scrollPosition,
      });

      // Update state
      this.state.currentMode = mode;

      // Complete animation
      if (!options.skipAnimation) {
        this.eventEmitter.emit(ModeSwitcherEvent.ANIMATION_COMPLETE, {
          mode,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error('Error switching mode:', error);
      throw error;
    } finally {
      this.state.switching = false;
    }
  }

  /**
   * Toggle between desktop and mobile modes
   */
  public async toggle(
    options: {
      skipAnimation?: boolean;
      selectedComponentId?: string;
      scrollPosition?: { x: number; y: number };
    } = {}
  ): Promise<void> {
    const targetMode =
      this.state.currentMode === DeviceMode.DESKTOP
        ? DeviceMode.MOBILE
        : DeviceMode.DESKTOP;

    await this.switchToMode(targetMode, options);
  }

  /**
   * Handle hover start (triggers preload)
   *
   * @param targetMode - Mode being hovered over
   */
  public onHoverStart(targetMode: DeviceMode): void {
    this.state.hovering = true;

    // Only preload if hovering over mobile and not already preloaded
    if (
      targetMode === DeviceMode.MOBILE &&
      !this.state.preloaded &&
      this.config.performance.preloadOnHover
    ) {
      // Debounce preload (wait 300ms before triggering)
      this.hoverTimeoutId = setTimeout(() => {
        this.triggerPreload();
      }, 300);
    }
  }

  /**
   * Handle hover end
   */
  public onHoverEnd(): void {
    this.state.hovering = false;

    // Cancel pending preload
    if (this.hoverTimeoutId) {
      clearTimeout(this.hoverTimeoutId);
      this.hoverTimeoutId = undefined;
    }
  }

  /**
   * Trigger mobile data preload
   */
  private async triggerPreload(): Promise<void> {
    if (this.state.preloaded) {
      return;
    }

    try {
      await this.modeManager.preloadMobileData();
      this.state.preloaded = true;

      this.eventEmitter.emit(ModeSwitcherEvent.HOVER_PRELOAD, {
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error preloading mobile data:', error);
    }
  }

  /**
   * Enable keyboard shortcuts
   *
   * Attaches keyboard event listener
   */
  public enableKeyboardShortcuts(): void {
    if (this.keyboardListenerAttached) {
      return;
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown);
      this.keyboardListenerAttached = true;
    }
  }

  /**
   * Disable keyboard shortcuts
   *
   * Removes keyboard event listener
   */
  public disableKeyboardShortcuts(): void {
    if (!this.keyboardListenerAttached) {
      return;
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown);
      this.keyboardListenerAttached = false;
    }
  }

  /**
   * Handle keyboard event
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    // Parse shortcut (e.g., 'Mod+D')
    const isMod = this.keyboardShortcut.includes('Mod');
    const modKey = isMod
      ? navigator.platform.includes('Mac')
        ? event.metaKey
        : event.ctrlKey
      : false;

    const key = this.keyboardShortcut.split('+').pop()?.toLowerCase();

    // Check if shortcut matches
    if (modKey && event.key.toLowerCase() === key) {
      event.preventDefault();

      this.eventEmitter.emit(ModeSwitcherEvent.KEYBOARD_SHORTCUT, {
        shortcut: this.keyboardShortcut,
        timestamp: Date.now(),
      });

      // Toggle mode
      this.toggle();
    }
  };

  /**
   * Update configuration
   *
   * @param config - New configuration
   */
  public updateConfig(config: Partial<MobileDevModeConfig>): void {
    if (config.modeSwitcher) {
      if (config.modeSwitcher.sticky !== undefined) {
        this.state.sticky = config.modeSwitcher.sticky;
      }
      if (config.modeSwitcher.showLabels !== undefined) {
        this.state.showLabels = config.modeSwitcher.showLabels;
      }
      if (config.modeSwitcher.customLabels) {
        this.state.labels = {
          desktop: config.modeSwitcher.customLabels.desktop || 'Desktop',
          mobile: config.modeSwitcher.customLabels.mobile || 'Mobile',
        };
      }
    }

    if (config.canvas?.transitionDuration !== undefined) {
      this.state.animationDuration = config.canvas.transitionDuration;
    }
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
   * Check if switching is in progress
   */
  public isSwitching(): boolean {
    return this.state.switching;
  }

  /**
   * Setup mode manager event listeners
   */
  private setupModeManagerListeners(): void {
    // Listen for mode switch events from ModeManager
    this.eventEmitter.on('mobile:mode-switch-complete', (event: any) => {
      this.state.currentMode = event.toMode;
    });
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Dispose and cleanup
   */
  public dispose(): void {
    this.disableKeyboardShortcuts();

    if (this.hoverTimeoutId) {
      clearTimeout(this.hoverTimeoutId);
    }
  }
}
