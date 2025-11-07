/**
 * Animation Controller
 *
 * Manages all property change animations using the Web Animations API.
 * Handles animation queuing, interruptions, and performance monitoring.
 *
 * @module visual-feedback
 */

import type {
  AnimationConfig,
  PerformanceConfig,
  AnimationOptions,
  AnimationState,
  PropertyType,
  PerformanceStats,
  PerformanceThresholds,
} from './visual-feedback.types';
import { DEFAULT_PERFORMANCE_THRESHOLDS } from './visual-feedback.types';

/**
 * Animation Controller
 *
 * Manages property change animations using Web Animations API.
 * Provides smooth transitions, interruption handling, and performance monitoring.
 */
export class AnimationController {
  private animationConfig: AnimationConfig;
  private performanceConfig: PerformanceConfig;
  private respectReducedMotion: boolean;
  private activeAnimations: Map<string, AnimationState>;
  private performanceThresholds: PerformanceThresholds;
  private frameTimeSamples: number[];
  private maxFrameSamples: number = 60;
  private reducedMotionMediaQuery: MediaQueryList | null = null;

  constructor(
    animationConfig: AnimationConfig,
    performanceConfig: PerformanceConfig,
    respectReducedMotion: boolean = true
  ) {
    this.animationConfig = animationConfig;
    this.performanceConfig = performanceConfig;
    this.respectReducedMotion = respectReducedMotion;
    this.activeAnimations = new Map();
    this.performanceThresholds = DEFAULT_PERFORMANCE_THRESHOLDS;
    this.frameTimeSamples = [];

    // Detect reduced motion preference
    if (typeof window !== 'undefined') {
      this.reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    }
  }

  /**
   * Animate a CSS property change
   *
   * If an animation is already running for this element/property combination,
   * it will be smoothly transitioned to the new target value.
   */
  animateProperty(
    element: HTMLElement,
    property: string,
    fromValue: string,
    toValue: string,
    propertyType: PropertyType = 'default'
  ): Animation | null {
    // Check if animations are disabled
    if (!this.animationConfig.enabled) {
      this.applyValueImmediately(element, property, toValue);
      return null;
    }

    // Check reduced motion preference
    if (this.shouldRespectReducedMotion()) {
      this.applyValueImmediately(element, property, toValue);
      return null;
    }

    // Check if we've hit performance limits
    if (this.hasReachedAnimationLimit()) {
      this.applyValueImmediately(element, property, toValue);
      return null;
    }

    // Get animation options for this property type
    const options = this.getAnimationOptions(propertyType);

    // Check if there's an existing animation for this element/property
    const animationKey = this.getAnimationKey(element, property);
    const existingAnimation = this.activeAnimations.get(animationKey);

    if (existingAnimation) {
      // Animation is running - transition smoothly from current position
      return this.interruptAnimation(existingAnimation, toValue, options);
    }

    // Create new animation
    return this.createAnimation(element, property, fromValue, toValue, options);
  }

  /**
   * Cancel animation for a specific element/property
   */
  cancelAnimation(element: HTMLElement, property: string): void {
    const animationKey = this.getAnimationKey(element, property);
    const animationState = this.activeAnimations.get(animationKey);

    if (animationState) {
      animationState.animation.cancel();
      this.activeAnimations.delete(animationKey);
    }
  }

  /**
   * Cancel all active animations
   */
  cancelAllAnimations(): void {
    this.activeAnimations.forEach((state) => {
      state.animation.cancel();
    });
    this.activeAnimations.clear();
  }

  /**
   * Get count of active animations
   */
  getActiveAnimationCount(): number {
    return this.activeAnimations.size;
  }

  /**
   * Check if reduced motion is preferred
   */
  isReducedMotionPreferred(): boolean {
    return this.reducedMotionMediaQuery?.matches || false;
  }

  /**
   * Update animation configuration at runtime
   */
  updateConfig(config: Partial<AnimationConfig>): void {
    this.animationConfig = {
      ...this.animationConfig,
      ...config,
    };
  }

  /**
   * Update performance configuration at runtime
   */
  updatePerformanceConfig(config: Partial<PerformanceConfig>): void {
    this.performanceConfig = {
      ...this.performanceConfig,
      ...config,
    };
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(): PerformanceStats {
    const warnings: string[] = [];

    // Check animation count
    const activeCount = this.activeAnimations.size;
    if (activeCount > this.performanceThresholds.maxAnimations) {
      warnings.push(`High animation count: ${activeCount} (threshold: ${this.performanceThresholds.maxAnimations})`);
    }

    // Calculate average frame time
    const avgFrameTime =
      this.frameTimeSamples.length > 0
        ? this.frameTimeSamples.reduce((a, b) => a + b, 0) / this.frameTimeSamples.length
        : 0;

    if (avgFrameTime > this.performanceThresholds.maxFrameTime) {
      warnings.push(`Slow frame time: ${avgFrameTime.toFixed(2)}ms (threshold: ${this.performanceThresholds.maxFrameTime.toFixed(2)}ms)`);
    }

    return {
      activeOverlays: 0, // Overlays tracked by OverlayManager
      activeAnimations: activeCount,
      droppedFrames: 0, // Could be calculated from frame times if needed
      averageFrameTime: avgFrameTime,
      warnings,
    };
  }

  /**
   * Create a new animation
   */
  private createAnimation(
    element: HTMLElement,
    property: string,
    fromValue: string,
    toValue: string,
    options: AnimationOptions
  ): Animation {
    // Create keyframes
    const keyframes = [{ [property]: fromValue }, { [property]: toValue }];

    // Create animation using Web Animations API
    const animation = element.animate(keyframes, {
      duration: options.duration,
      easing: options.easing,
      delay: options.delay || 0,
      fill: options.fill || 'forwards',
    });

    // Store animation state
    const animationKey = this.getAnimationKey(element, property);
    const animationState: AnimationState = {
      element,
      property,
      animation,
      startValue: fromValue,
      targetValue: toValue,
      options,
      startedAt: Date.now(),
    };

    this.activeAnimations.set(animationKey, animationState);

    // Clean up when animation finishes
    animation.addEventListener('finish', () => {
      this.activeAnimations.delete(animationKey);
      // Apply final value to ensure it's set correctly
      element.style[property as any] = toValue;
    });

    animation.addEventListener('cancel', () => {
      this.activeAnimations.delete(animationKey);
    });

    // Track frame time if monitoring is enabled
    if (this.performanceConfig.enableMonitoring) {
      this.trackFrameTime(animation);
    }

    return animation;
  }

  /**
   * Interrupt an existing animation and transition to new target
   */
  private interruptAnimation(existingState: AnimationState, newTarget: string, options: AnimationOptions): Animation {
    const { element, property, animation } = existingState;

    // Get current computed value
    const currentValue = getComputedStyle(element)[property as any] as string;

    // Cancel existing animation
    animation.cancel();

    // Create new animation from current position to new target
    return this.createAnimation(element, property, currentValue, newTarget, options);
  }

  /**
   * Apply value immediately without animation
   */
  private applyValueImmediately(element: HTMLElement, property: string, value: string): void {
    element.style[property as any] = value;
  }

  /**
   * Get animation options for a property type
   */
  private getAnimationOptions(propertyType: PropertyType): AnimationOptions {
    const durations = this.animationConfig.durations as Record<string, number>;
    const easings = this.animationConfig.easing as Record<string, string>;

    const duration = durations[propertyType] || this.animationConfig.durations.default;
    const easing = easings[propertyType] || this.animationConfig.easing.default;

    return {
      duration,
      easing,
      fill: 'forwards',
    };
  }

  /**
   * Get unique key for element/property combination
   */
  private getAnimationKey(element: HTMLElement, property: string): string {
    // Use element's unique ID or create one
    const elementId = element.dataset['animationId'] || this.assignAnimationId(element);
    return `${elementId}:${property}`;
  }

  /**
   * Assign unique animation ID to element
   */
  private assignAnimationId(element: HTMLElement): string {
    const id = `anim-${Math.random().toString(36).substr(2, 9)}`;
    element.dataset['animationId'] = id;
    return id;
  }

  /**
   * Check if reduced motion should be respected
   */
  private shouldRespectReducedMotion(): boolean {
    return this.respectReducedMotion && this.isReducedMotionPreferred();
  }

  /**
   * Check if animation limit has been reached
   */
  private hasReachedAnimationLimit(): boolean {
    return this.activeAnimations.size >= this.performanceConfig.maxSimultaneousAnimations;
  }

  /**
   * Track frame time for performance monitoring
   */
  private trackFrameTime(animation: Animation): void {
    let lastTime = performance.now();

    const trackFrame = () => {
      const currentTime = performance.now();
      const frameTime = currentTime - lastTime;
      lastTime = currentTime;

      // Add to samples
      this.frameTimeSamples.push(frameTime);

      // Keep only recent samples
      if (this.frameTimeSamples.length > this.maxFrameSamples) {
        this.frameTimeSamples.shift();
      }

      // Continue tracking if animation is still running
      if (animation.playState === 'running') {
        requestAnimationFrame(trackFrame);
      }
    };

    requestAnimationFrame(trackFrame);
  }

  /**
   * Update performance thresholds
   */
  updatePerformanceThresholds(thresholds: Partial<PerformanceThresholds>): void {
    this.performanceThresholds = {
      ...this.performanceThresholds,
      ...thresholds,
    };
  }

  /**
   * Destroy controller and clean up
   */
  destroy(): void {
    this.cancelAllAnimations();
    this.frameTimeSamples = [];
    this.reducedMotionMediaQuery = null;
  }
}
