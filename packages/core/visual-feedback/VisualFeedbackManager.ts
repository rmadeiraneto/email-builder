/**
 * Visual Feedback Manager
 *
 * Main orchestrator for the visual property feedback system.
 * Coordinates between PropertyMappingRegistry, OverlayManager, and AnimationController
 * to provide Figma-style visual feedback when editing component properties.
 */

import { AnimationController } from './AnimationController';
import { OverlayManager } from './OverlayManager';
import { DEFAULT_VISUAL_FEEDBACK_CONFIG } from './visual-feedback.types';
import type {
  VisualFeedbackConfig,
  PropertyHoverEvent,
  PropertyEditEvent,
  PropertyChangeEvent,
  PropertyVisualMapping,
  OverlayData,
  VisualFeedbackManagerConfig,
} from './visual-feedback.types';

/**
 * VisualFeedbackManager
 *
 * Central service that manages visual feedback for property editing.
 * Listens to property interaction events and shows appropriate visual overlays and animations.
 */
export class VisualFeedbackManager {
  private config: VisualFeedbackConfig;
  private canvasElement: HTMLElement;
  private animationController: AnimationController;
  private overlayManager: OverlayManager;
  private prefersReducedMotion: boolean = false;
  private mediaQueryList: MediaQueryList | null = null;

  // Track active overlays by property path
  private activeOverlays: Map<string, string[]> = new Map();

  // Track current hover state
  private currentHoverPropertyPath: string | null = null;

  // Track current edit state
  private currentEditPropertyPath: string | null = null;

  constructor(options: VisualFeedbackManagerConfig) {
    this.config = options.config;
    this.canvasElement = options.canvasElement;

    // Initialize subsystems
    this.animationController = new AnimationController(
      this.config.animations,
      this.config.performance,
      this.config.respectReducedMotion
    );

    this.overlayManager = new OverlayManager({
      canvasElement: this.canvasElement,
      highlightConfig: this.config.highlights,
      zIndex: 10000,
    });

    // Setup accessibility
    this.setupAccessibility();
  }

  /**
   * Setup accessibility features
   */
  private setupAccessibility(): void {
    if (!this.config.respectReducedMotion) {
      return;
    }

    // Check for prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReducedMotion = this.mediaQueryList.matches;

      // Listen for changes
      const handleChange = (e: MediaQueryListEvent) => {
        this.prefersReducedMotion = e.matches;
      };

      // Modern browsers
      if (this.mediaQueryList.addEventListener) {
        this.mediaQueryList.addEventListener('change', handleChange);
      } else {
        // Legacy browsers
        (this.mediaQueryList as any).addListener?.(handleChange);
      }
    }
  }

  /**
   * Handle property hover event
   */
  public handlePropertyHover(event: PropertyHoverEvent): void {
    if (!this.config.enabled || !this.config.highlights.enabled) {
      return;
    }

    const { propertyPath, componentId, mapping, mode, currentValue } = event;

    // Clear previous hover overlays if different property
    if (this.currentHoverPropertyPath && this.currentHoverPropertyPath !== propertyPath) {
      this.clearOverlaysForProperty(this.currentHoverPropertyPath);
    }

    if (mode === 'off') {
      // Mouse left the control - clear overlays
      this.clearOverlaysForProperty(propertyPath);
      this.currentHoverPropertyPath = null;
      return;
    }

    // Update current hover state
    this.currentHoverPropertyPath = propertyPath;

    // Show overlays for this property
    this.showOverlaysForProperty(propertyPath, componentId, mapping, currentValue, mode);
  }

  /**
   * Handle property edit start/end
   */
  public handlePropertyEdit(event: PropertyEditEvent): void {
    console.log('[VisualFeedbackManager] handlePropertyEdit called');
    console.log('[VisualFeedbackManager] Event:', event);
    console.log('[VisualFeedbackManager] config.enabled:', this.config.enabled);

    if (!this.config.enabled) {
      console.log('[VisualFeedbackManager] System disabled, returning');
      return;
    }

    const { propertyPath, componentId, oldValue, newValue, mapping } = event;

    // Determine if editing started or ended
    const isStarting = oldValue === undefined;
    console.log('[VisualFeedbackManager] isStarting:', isStarting);
    console.log('[VisualFeedbackManager] currentEditPropertyPath:', this.currentEditPropertyPath);
    console.log('[VisualFeedbackManager] currentHoverPropertyPath:', this.currentHoverPropertyPath);

    if (isStarting) {
      // Edit started
      console.log('[VisualFeedbackManager] Edit started for:', propertyPath);
      this.currentEditPropertyPath = propertyPath;

      // Show overlays if not already shown by hover
      if (this.currentHoverPropertyPath !== propertyPath) {
        console.log('[VisualFeedbackManager] Calling showOverlaysForProperty');
        try {
          this.showOverlaysForProperty(propertyPath, componentId, mapping, newValue, 'active');
          console.log('[VisualFeedbackManager] showOverlaysForProperty completed');
        } catch (error) {
          console.error('[VisualFeedbackManager] Error in showOverlaysForProperty:', error);
          throw error;
        }
      } else {
        console.log('[VisualFeedbackManager] Skipping showOverlaysForProperty (already shown by hover)');
      }
    } else {
      // Edit ended
      console.log('[VisualFeedbackManager] Edit ended for:', propertyPath);
      if (this.currentEditPropertyPath === propertyPath) {
        this.currentEditPropertyPath = null;

        // Clear overlays if not hovering
        if (this.currentHoverPropertyPath !== propertyPath) {
          console.log('[VisualFeedbackManager] Calling clearOverlaysForProperty');
          this.clearOverlaysForProperty(propertyPath);
          console.log('[VisualFeedbackManager] clearOverlaysForProperty completed');
        } else {
          console.log('[VisualFeedbackManager] Skipping clearOverlaysForProperty (still hovering)');
        }
      }
    }

    console.log('[VisualFeedbackManager] handlePropertyEdit completed');
  }

  /**
   * Handle property value change (for animations)
   */
  public handlePropertyChange(event: PropertyChangeEvent): void {
    if (!this.config.enabled || !this.config.animations.enabled) {
      return;
    }

    if (this.prefersReducedMotion) {
      return;
    }

    const { componentId, propertyPath, oldValue, newValue, propertyType } = event;

    // Find the target element(s) on the canvas
    const targetElement = this.findComponentElement(componentId);
    if (!targetElement) {
      return;
    }

    // Convert values to strings for CSS animation
    const oldValueStr = oldValue?.toString() || '';
    const newValueStr = newValue?.toString() || '';

    // Animate the change using animateProperty method
    this.animationController.animateProperty(
      targetElement,
      propertyPath,
      oldValueStr,
      newValueStr,
      propertyType
    );
  }

  /**
   * Show overlays for a property
   */
  private showOverlaysForProperty(
    propertyPath: string,
    componentId: string | undefined,
    mapping: PropertyVisualMapping,
    currentValue: any,
    mode: 'hover' | 'active'
  ): void {
    // Guard against undefined mapping
    if (!mapping || !mapping.visualTarget) {
      // No mapping available, skip visual feedback
      return;
    }

    // Find target element(s)
    const targetElement = componentId ? this.findComponentElement(componentId) : null;

    if (!targetElement) {
      // If no component element found, show a property indicator instead
      this.showPropertyIndicator(propertyPath, currentValue);
      return;
    }

    // Create overlay data
    const overlayData: OverlayData = {
      targetElement,
      propertyPath,
      value: currentValue,
      visualMapping: mapping,
      mode,
    };

    // Determine overlay type from visual target
    const overlayType = mapping.visualTarget.type === 'spacing' || mapping.visualTarget.type === 'size'
      ? 'measurement'
      : 'region';

    // Create appropriate overlay based on visual target type
    const overlayId = this.overlayManager.createOverlay(overlayType, overlayData);

    // Track this overlay
    if (!this.activeOverlays.has(propertyPath)) {
      this.activeOverlays.set(propertyPath, []);
    }
    this.activeOverlays.get(propertyPath)!.push(overlayId);
  }

  /**
   * Show property indicator for non-visual properties
   */
  private showPropertyIndicator(propertyPath: string, value: any): void {
    if (!this.config.propertyIndicators.enabled) {
      return;
    }

    // This would create a floating label showing the property name and value
    // For now, we'll implement this later as it requires more UI work
    console.log(`Property indicator for ${propertyPath}: ${value}`);
  }

  /**
   * Clear all overlays for a property
   */
  private clearOverlaysForProperty(propertyPath: string): void {
    const overlayIds = this.activeOverlays.get(propertyPath);
    if (!overlayIds) {
      return;
    }

    // Destroy each overlay
    for (const overlayId of overlayIds) {
      this.overlayManager.destroyOverlay(overlayId);
    }

    // Clear tracking
    this.activeOverlays.delete(propertyPath);
  }

  /**
   * Find component element on canvas by component ID
   */
  private findComponentElement(componentId: string): HTMLElement | null {
    // Look for element with data-component-id attribute
    return this.canvasElement.querySelector(`[data-component-id="${componentId}"]`) as HTMLElement | null;
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<VisualFeedbackConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Note: AnimationController and OverlayManager don't have updateConfig methods
    // They would need to be recreated with new config if needed
    // For now, we'll just update the config object
    // TODO: Add updateConfig methods to AnimationController and OverlayManager if needed
  }

  /**
   * Enable/disable the entire system
   */
  public setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;

    if (!enabled) {
      // Clear all overlays
      this.clearAllOverlays();
    }
  }

  /**
   * Check if system is enabled
   */
  public isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Clear all active overlays
   */
  public clearAllOverlays(): void {
    for (const propertyPath of this.activeOverlays.keys()) {
      this.clearOverlaysForProperty(propertyPath);
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): VisualFeedbackConfig {
    return { ...this.config };
  }

  /**
   * Get performance statistics
   */
  public getPerformanceStats() {
    return this.animationController.getPerformanceStats();
  }

  /**
   * Clean up and destroy the manager
   */
  public destroy(): void {
    // Clear all overlays
    this.clearAllOverlays();

    // Destroy subsystems
    this.animationController.destroy();
    this.overlayManager.destroy();

    // Remove media query listener
    if (this.mediaQueryList) {
      const handleChange = () => {};
      if (this.mediaQueryList.removeEventListener) {
        this.mediaQueryList.removeEventListener('change', handleChange);
      } else {
        (this.mediaQueryList as any).removeListener?.(handleChange);
      }
    }
  }
}

/**
 * Create a new VisualFeedbackManager instance
 */
export function createVisualFeedbackManager(
  canvasElement: HTMLElement,
  config?: Partial<VisualFeedbackConfig>
): VisualFeedbackManager {
  const fullConfig: VisualFeedbackConfig = {
    ...(DEFAULT_VISUAL_FEEDBACK_CONFIG as any),
    ...config,
  };

  return new VisualFeedbackManager({
    config: fullConfig,
    canvasElement,
  });
}
