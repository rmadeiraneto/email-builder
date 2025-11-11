/**
 * Canvas Manager
 *
 * Manages canvas state and interactions for mobile dev mode
 *
 * Responsibilities:
 * - Canvas state management
 * - Mode transition animations
 * - Viewport width changes
 * - Drag interactions (disabled in mobile mode)
 * - Selection state preservation across modes
 * - Scroll position preservation
 *
 * @module mobile
 */

import { EventEmitter } from '../services/EventEmitter';
import type { ModeManager } from './ModeManager';
import type { MobileDevModeConfig } from './mobile.types';
import { DeviceMode } from './mobile.types';

/**
 * Canvas Manager Events
 */
export enum CanvasManagerEvent {
  /**
   * Fired when canvas width changes
   */
  WIDTH_CHANGED = 'canvas:width-changed',

  /**
   * Fired when canvas background changes
   */
  BACKGROUND_CHANGED = 'canvas:background-changed',

  /**
   * Fired when transition starts
   */
  TRANSITION_START = 'canvas:transition-start',

  /**
   * Fired when transition completes
   */
  TRANSITION_COMPLETE = 'canvas:transition-complete',

  /**
   * Fired when drag state changes
   */
  DRAG_STATE_CHANGED = 'canvas:drag-state-changed',
}

/**
 * Canvas state
 */
export interface CanvasState {
  /**
   * Canvas width in pixels
   */
  width: number;

  /**
   * Canvas background color
   */
  backgroundColor: string;

  /**
   * Canvas border color
   */
  borderColor?: string;

  /**
   * Is transitioning between modes
   */
  transitioning: boolean;

  /**
   * Drag enabled
   */
  dragEnabled: boolean;

  /**
   * Current device mode
   */
  mode: DeviceMode;

  /**
   * Selected component ID
   */
  selectedComponentId?: string;

  /**
   * Scroll position
   */
  scrollPosition: {
    x: number;
    y: number;
  };

  /**
   * Scale/zoom level
   */
  scale: number;
}

/**
 * Canvas Manager Options
 */
export interface CanvasManagerOptions {
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
}

/**
 * Canvas Manager Service
 *
 * Manages canvas state for mobile dev mode
 */
export class CanvasManager {
  private eventEmitter: EventEmitter;
  private modeManager: ModeManager;
  private config: MobileDevModeConfig;
  private state: CanvasState;

  constructor(options: CanvasManagerOptions) {
    this.eventEmitter = options.eventEmitter;
    this.modeManager = options.modeManager;
    this.config = options.config;

    // Initialize state
    this.state = {
      width: 600, // Default email width
      backgroundColor: '#ffffff',
      transitioning: false,
      dragEnabled: true,
      mode: DeviceMode.DESKTOP,
      scrollPosition: { x: 0, y: 0 },
      scale: 1,
    };

    // Listen to mode change events
    this.setupModeListeners();
  }

  /**
   * Get current canvas state
   */
  public getState(): Readonly<CanvasState> {
    return { ...this.state };
  }

  /**
   * Handle mode switch
   *
   * Updates canvas state for new mode
   */
  public async handleModeSwitch(
    toMode: DeviceMode,
    options: {
      selectedComponentId?: string;
      scrollPosition?: { x: number; y: number };
      skipAnimation?: boolean;
    } = {}
  ): Promise<void> {
    const fromMode = this.state.mode;

    // Store current state
    if (options.selectedComponentId) {
      this.state.selectedComponentId = options.selectedComponentId;
    }
    if (options.scrollPosition) {
      this.state.scrollPosition = options.scrollPosition;
    }

    // Start transition
    if (!options.skipAnimation) {
      this.state.transitioning = true;
      this.eventEmitter.emit(CanvasManagerEvent.TRANSITION_START, {
        fromMode,
        toMode,
        duration: this.config.canvas.transitionDuration,
        timestamp: Date.now(),
      });

      // Wait for animation duration
      await this.delay(this.config.canvas.transitionDuration);
    }

    // Update canvas for new mode
    if (toMode === DeviceMode.MOBILE) {
      this.updateForMobileMode();
    } else {
      this.updateForDesktopMode();
    }

    this.state.mode = toMode;

    // Complete transition
    if (!options.skipAnimation) {
      this.state.transitioning = false;
      this.eventEmitter.emit(CanvasManagerEvent.TRANSITION_COMPLETE, {
        fromMode,
        toMode,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Set canvas width
   *
   * @param width - Width in pixels
   */
  public setWidth(width: number): void {
    if (this.state.width === width) {
      return;
    }

    const previousWidth = this.state.width;
    this.state.width = width;

    this.eventEmitter.emit(CanvasManagerEvent.WIDTH_CHANGED, {
      previousWidth,
      newWidth: width,
      timestamp: Date.now(),
    });
  }

  /**
   * Set canvas background color
   *
   * @param color - Background color
   */
  public setBackgroundColor(color: string): void {
    if (this.state.backgroundColor === color) {
      return;
    }

    const previousColor = this.state.backgroundColor;
    this.state.backgroundColor = color;

    this.eventEmitter.emit(CanvasManagerEvent.BACKGROUND_CHANGED, {
      previousColor,
      newColor: color,
      timestamp: Date.now(),
    });
  }

  /**
   * Set canvas border color
   *
   * @param color - Border color
   */
  public setBorderColor(color?: string): void {
    this.state.borderColor = color;
  }

  /**
   * Set drag enabled
   *
   * @param enabled - Drag enabled
   */
  public setDragEnabled(enabled: boolean): void {
    if (this.state.dragEnabled === enabled) {
      return;
    }

    this.state.dragEnabled = enabled;

    this.eventEmitter.emit(CanvasManagerEvent.DRAG_STATE_CHANGED, {
      enabled,
      timestamp: Date.now(),
    });
  }

  /**
   * Set selected component
   *
   * @param componentId - Component ID
   */
  public setSelectedComponent(componentId?: string): void {
    this.state.selectedComponentId = componentId;
  }

  /**
   * Get selected component ID
   */
  public getSelectedComponentId(): string | undefined {
    return this.state.selectedComponentId;
  }

  /**
   * Set scroll position
   *
   * @param position - Scroll position
   */
  public setScrollPosition(position: { x: number; y: number }): void {
    this.state.scrollPosition = position;
  }

  /**
   * Get scroll position
   */
  public getScrollPosition(): { x: number; y: number } {
    return { ...this.state.scrollPosition };
  }

  /**
   * Set zoom scale
   *
   * @param scale - Scale factor (0.5 = 50%, 1 = 100%, 2 = 200%)
   */
  public setScale(scale: number): void {
    this.state.scale = Math.max(0.25, Math.min(scale, 3)); // Clamp between 25% and 300%
  }

  /**
   * Get zoom scale
   */
  public getScale(): number {
    return this.state.scale;
  }

  /**
   * Check if drag is enabled
   */
  public isDragEnabled(): boolean {
    return this.state.dragEnabled;
  }

  /**
   * Check if transitioning
   */
  public isTransitioning(): boolean {
    return this.state.transitioning;
  }

  /**
   * Update canvas for mobile mode
   */
  private updateForMobileMode(): void {
    const mobileWidth = this.config.breakpoints.mobile;
    const mobileBackground = this.config.canvas.mobileBackgroundColor || '#f5f5f5';
    const mobileBorder = this.config.canvas.mobileBorderColor;

    this.setWidth(mobileWidth);
    this.setBackgroundColor(mobileBackground);
    this.setBorderColor(mobileBorder);

    // Disable drag in mobile mode (structure is locked)
    this.setDragEnabled(false);
  }

  /**
   * Update canvas for desktop mode
   */
  private updateForDesktopMode(): void {
    const desktopWidth = 600; // Default email width
    const desktopBackground = '#ffffff';

    this.setWidth(desktopWidth);
    this.setBackgroundColor(desktopBackground);
    this.setBorderColor(undefined);

    // Enable drag in desktop mode
    this.setDragEnabled(true);
  }

  /**
   * Setup mode change listeners
   */
  private setupModeListeners(): void {
    // Listen for mode switch events
    this.eventEmitter.on('mobile:mode-switch-start', (event: any) => {
      this.handleModeSwitch(event.toMode, {
        selectedComponentId: event.selectedComponentId,
        scrollPosition: event.scrollPosition,
      });
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
    // Clear state
    this.state.selectedComponentId = undefined;
  }
}
