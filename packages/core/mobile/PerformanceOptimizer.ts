/**
 * Performance Optimizer
 *
 * Provides performance optimization utilities for mobile dev mode
 *
 * Responsibilities:
 * - Debounce/throttle property updates
 * - Virtual rendering for large templates
 * - Memoization utilities
 * - Lazy loading optimizations
 * - Batch update processing
 *
 * @module mobile
 */

import type { MobileDevModeConfig } from './mobile.types';

/**
 * Debounce function
 *
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Throttle function
 *
 * @param func - Function to throttle
 * @param limit - Minimum time between calls in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Memoization cache
 */
const memoCache = new Map<string, { value: any; timestamp: number }>();

/**
 * Memoize function with TTL (time-to-live)
 *
 * @param func - Function to memoize
 * @param keyFn - Function to generate cache key from arguments
 * @param ttl - Time-to-live in milliseconds (default: 5000)
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  keyFn: (...args: Parameters<T>) => string,
  ttl: number = 5000
): (...args: Parameters<T>) => ReturnType<T> {
  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = keyFn(...args);
    const cached = memoCache.get(key);
    const now = Date.now();

    // Check if cached value is still valid
    if (cached && now - cached.timestamp < ttl) {
      return cached.value;
    }

    // Compute new value
    const value = func.apply(this, args);

    // Store in cache
    memoCache.set(key, { value, timestamp: now });

    // Clean up old entries
    if (memoCache.size > 100) {
      const entries = Array.from(memoCache.entries());
      const expired = entries.filter(([_, v]) => now - v.timestamp >= ttl);
      expired.forEach(([k]) => memoCache.delete(k));
    }

    return value;
  };
}

/**
 * Clear memoization cache
 */
export function clearMemoCache(): void {
  memoCache.clear();
}

/**
 * Batch processor for multiple updates
 */
export class BatchProcessor {
  private queue: Array<() => void> = [];
  private processing: boolean = false;
  private batchSize: number;
  private delay: number;

  constructor(batchSize: number = 10, delay: number = 16) {
    this.batchSize = batchSize;
    this.delay = delay;
  }

  /**
   * Add task to batch queue
   *
   * @param task - Task to execute
   */
  public add(task: () => void): void {
    this.queue.push(task);

    if (!this.processing) {
      this.process();
    }
  }

  /**
   * Process batch queue
   */
  private async process(): Promise<void> {
    this.processing = true;

    while (this.queue.length > 0) {
      // Process batch
      const batch = this.queue.splice(0, this.batchSize);

      for (const task of batch) {
        try {
          task();
        } catch (error) {
          console.error('Error processing batch task:', error);
        }
      }

      // Yield to main thread
      if (this.queue.length > 0) {
        await this.delay_(this.delay);
      }
    }

    this.processing = false;
  }

  /**
   * Delay helper
   */
  private delay_(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Clear queue
   */
  public clear(): void {
    this.queue = [];
  }

  /**
   * Get queue size
   */
  public size(): number {
    return this.queue.length;
  }
}

/**
 * Virtual rendering helper
 */
export class VirtualRenderingHelper {
  private threshold: number;
  private windowSize: number;

  constructor(threshold: number = 50, windowSize: number = 20) {
    this.threshold = threshold;
    this.windowSize = windowSize;
  }

  /**
   * Check if should use virtual rendering
   *
   * @param totalItems - Total number of items
   * @returns Whether to use virtual rendering
   */
  public shouldUseVirtualRendering(totalItems: number): boolean {
    return totalItems > this.threshold;
  }

  /**
   * Get visible range for virtual rendering
   *
   * @param scrollTop - Scroll position (top)
   * @param itemHeight - Average item height
   * @param containerHeight - Container height
   * @param totalItems - Total number of items
   * @returns Visible range { start, end }
   */
  public getVisibleRange(
    scrollTop: number,
    itemHeight: number,
    containerHeight: number,
    totalItems: number
  ): { start: number; end: number } {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight);

    // Add buffer (windowSize items before and after)
    const start = Math.max(0, startIndex - this.windowSize);
    const end = Math.min(totalItems, endIndex + this.windowSize);

    return { start, end };
  }

  /**
   * Calculate total height for virtual list
   *
   * @param totalItems - Total number of items
   * @param itemHeight - Average item height
   * @returns Total height in pixels
   */
  public calculateTotalHeight(totalItems: number, itemHeight: number): number {
    return totalItems * itemHeight;
  }

  /**
   * Calculate offset for virtual list
   *
   * @param startIndex - Start index
   * @param itemHeight - Average item height
   * @returns Offset in pixels
   */
  public calculateOffset(startIndex: number, itemHeight: number): number {
    return startIndex * itemHeight;
  }
}

/**
 * Performance monitor
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  private measurements: Map<string, number[]> = new Map();

  /**
   * Mark start of operation
   *
   * @param name - Operation name
   */
  public mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * Measure operation duration
   *
   * @param name - Operation name
   * @returns Duration in milliseconds
   */
  public measure(name: string): number {
    const startTime = this.marks.get(name);

    if (startTime === undefined) {
      console.warn(`No mark found for "${name}"`);
      return 0;
    }

    const duration = performance.now() - startTime;

    // Store measurement
    if (!this.measurements.has(name)) {
      this.measurements.set(name, []);
    }
    this.measurements.get(name)!.push(duration);

    // Remove mark
    this.marks.delete(name);

    return duration;
  }

  /**
   * Get average duration for operation
   *
   * @param name - Operation name
   * @returns Average duration in milliseconds
   */
  public getAverage(name: string): number {
    const durations = this.measurements.get(name);

    if (!durations || durations.length === 0) {
      return 0;
    }

    const sum = durations.reduce((a, b) => a + b, 0);
    return sum / durations.length;
  }

  /**
   * Get all measurements for operation
   *
   * @param name - Operation name
   * @returns Array of durations in milliseconds
   */
  public getMeasurements(name: string): number[] {
    return this.measurements.get(name) || [];
  }

  /**
   * Clear all measurements
   */
  public clear(): void {
    this.marks.clear();
    this.measurements.clear();
  }

  /**
   * Get performance report
   *
   * @returns Performance report
   */
  public getReport(): Record<string, { count: number; average: number; min: number; max: number }> {
    const report: Record<string, { count: number; average: number; min: number; max: number }> = {};

    for (const [name, durations] of this.measurements.entries()) {
      if (durations.length === 0) {
        continue;
      }

      const sum = durations.reduce((a, b) => a + b, 0);
      const average = sum / durations.length;
      const min = Math.min(...durations);
      const max = Math.max(...durations);

      report[name] = {
        count: durations.length,
        average,
        min,
        max,
      };
    }

    return report;
  }
}

/**
 * Performance Optimizer Options
 */
export interface PerformanceOptimizerOptions {
  /**
   * Mobile dev mode configuration
   */
  config: MobileDevModeConfig;
}

/**
 * Performance Optimizer
 *
 * Main performance optimization coordinator
 */
export class PerformanceOptimizer {
  private config: MobileDevModeConfig;
  private batchProcessor: BatchProcessor;
  private virtualHelper: VirtualRenderingHelper;
  private monitor: PerformanceMonitor;

  constructor(options: PerformanceOptimizerOptions) {
    this.config = options.config;

    // Initialize helpers
    this.batchProcessor = new BatchProcessor(10, this.config.performance.debounceDelay);
    this.virtualHelper = new VirtualRenderingHelper(
      this.config.performance.virtualRenderingThreshold,
      20
    );
    this.monitor = new PerformanceMonitor();
  }

  /**
   * Get debounced function
   *
   * @param func - Function to debounce
   * @param delay - Delay (optional, uses config default)
   * @returns Debounced function
   */
  public debounce<T extends (...args: any[]) => any>(
    func: T,
    delay?: number
  ): (...args: Parameters<T>) => void {
    return debounce(func, delay || this.config.performance.debounceDelay);
  }

  /**
   * Get throttled function
   *
   * @param func - Function to throttle
   * @param limit - Limit (optional, uses config default)
   * @returns Throttled function
   */
  public throttle<T extends (...args: any[]) => any>(
    func: T,
    limit?: number
  ): (...args: Parameters<T>) => void {
    return throttle(func, limit || this.config.performance.debounceDelay);
  }

  /**
   * Get batch processor
   */
  public getBatchProcessor(): BatchProcessor {
    return this.batchProcessor;
  }

  /**
   * Get virtual rendering helper
   */
  public getVirtualHelper(): VirtualRenderingHelper {
    return this.virtualHelper;
  }

  /**
   * Get performance monitor
   */
  public getMonitor(): PerformanceMonitor {
    return this.monitor;
  }

  /**
   * Check if should use virtual rendering
   *
   * @param totalItems - Total number of items
   * @returns Whether to use virtual rendering
   */
  public shouldUseVirtualRendering(totalItems: number): boolean {
    return (
      this.config.performance.virtualRendering &&
      this.virtualHelper.shouldUseVirtualRendering(totalItems)
    );
  }
}
