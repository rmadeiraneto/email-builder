/**
 * VisualFeedbackManager Performance Benchmarks
 *
 * Measures and reports performance metrics for the visual feedback system
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VisualFeedbackManager, createVisualFeedbackManager } from './VisualFeedbackManager';
import { getPropertyMappingRegistry } from './PropertyMappingRegistry';
import type { PropertyChangeEvent } from './visual-feedback.types';

interface BenchmarkResult {
  name: string;
  operations: number;
  duration: number;
  opsPerSecond: number;
  averageTime: number;
}

class PerformanceBenchmark {
  private results: BenchmarkResult[] = [];

  async run(name: string, operations: number, fn: () => void): Promise<BenchmarkResult> {
    // Warm up
    for (let i = 0; i < 10; i++) {
      fn();
    }

    // Actual benchmark
    const startTime = performance.now();

    for (let i = 0; i < operations; i++) {
      fn();
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    const opsPerSecond = (operations / duration) * 1000;
    const averageTime = duration / operations;

    const result: BenchmarkResult = {
      name,
      operations,
      duration,
      opsPerSecond,
      averageTime,
    };

    this.results.push(result);
    return result;
  }

  getResults(): BenchmarkResult[] {
    return this.results;
  }

  printResults(): void {
    console.log('\n=== Performance Benchmark Results ===\n');

    this.results.forEach((result) => {
      console.log(`${result.name}:`);
      console.log(`  Operations: ${result.operations}`);
      console.log(`  Total Time: ${result.duration.toFixed(2)}ms`);
      console.log(`  Ops/Second: ${result.opsPerSecond.toFixed(2)}`);
      console.log(`  Average Time: ${result.averageTime.toFixed(4)}ms`);
      console.log('');
    });
  }

  getSummary(): string {
    let summary = '# Performance Benchmark Summary\n\n';
    summary += '| Benchmark | Operations | Duration | Ops/Sec | Avg Time |\n';
    summary += '|-----------|------------|----------|---------|----------|\n';

    this.results.forEach((result) => {
      summary += `| ${result.name} | ${result.operations} | ${result.duration.toFixed(2)}ms | ${result.opsPerSecond.toFixed(2)} | ${result.averageTime.toFixed(4)}ms |\n`;
    });

    return summary;
  }
}

describe('VisualFeedbackManager - Performance Benchmarks', () => {
  let canvasElement: HTMLElement;
  let manager: VisualFeedbackManager;
  let registry: ReturnType<typeof getPropertyMappingRegistry>;
  let benchmark: PerformanceBenchmark;

  beforeEach(() => {
    canvasElement = document.createElement('div');
    canvasElement.id = 'canvas';
    canvasElement.style.width = '800px';
    canvasElement.style.height = '600px';
    document.body.appendChild(canvasElement);

    const button = document.createElement('button');
    button.setAttribute('data-component-id', 'button-1');
    button.style.padding = '16px';
    canvasElement.appendChild(button);

    manager = createVisualFeedbackManager(canvasElement);
    registry = getPropertyMappingRegistry();
    benchmark = new PerformanceBenchmark();
  });

  afterEach(() => {
    manager.destroy();
    document.body.removeChild(canvasElement);
  });

  describe('Property Change Performance', () => {
    it('should benchmark handlePropertyChange - 1000 operations', async () => {
      const result = await benchmark.run('Property Change (1000x)', 1000, () => {
        manager.handlePropertyChange({
          componentId: 'button-1',
          propertyPath: 'styles.padding',
          oldValue: '16px',
          newValue: '17px',
          propertyType: 'spacing',
        });
      });

      console.log(`\nProperty Change: ${result.opsPerSecond.toFixed(2)} ops/sec`);

      // Should handle at least 1000 ops/sec
      expect(result.opsPerSecond).toBeGreaterThan(1000);

      // Average time should be under 1ms
      expect(result.averageTime).toBeLessThan(1);
    });

    it('should benchmark handlePropertyChange - different property types', async () => {
      const propertyTypes: Array<PropertyChangeEvent['propertyType']> = [
        'spacing',
        'color',
        'typography',
        'border',
        'size',
      ];

      for (const propertyType of propertyTypes) {
        const result = await benchmark.run(
          `Property Change - ${propertyType} (500x)`,
          500,
          () => {
            manager.handlePropertyChange({
              componentId: 'button-1',
              propertyPath: `styles.${propertyType}`,
              oldValue: '16px',
              newValue: '17px',
              propertyType,
            });
          }
        );

        console.log(`${propertyType}: ${result.opsPerSecond.toFixed(2)} ops/sec`);
        expect(result.opsPerSecond).toBeGreaterThan(500);
      }
    });
  });

  describe('Property Hover Performance', () => {
    it('should benchmark handlePropertyHover - 1000 operations', async () => {
      const mapping = registry.getMapping('button', 'styles.padding');
      if (!mapping) return;

      const result = await benchmark.run('Property Hover (1000x)', 1000, () => {
        manager.handlePropertyHover({
          propertyPath: 'styles.padding',
          componentId: 'button-1',
          mapping,
          mode: 'hover',
          currentValue: '16px',
        });
      });

      console.log(`\nProperty Hover: ${result.opsPerSecond.toFixed(2)} ops/sec`);

      // Should handle at least 500 ops/sec
      expect(result.opsPerSecond).toBeGreaterThan(500);
    });

    it('should benchmark hover/unhover cycles', async () => {
      const mapping = registry.getMapping('button', 'styles.padding');
      if (!mapping) return;

      const result = await benchmark.run('Hover/Unhover Cycles (500x)', 500, () => {
        manager.handlePropertyHover({
          propertyPath: 'styles.padding',
          componentId: 'button-1',
          mapping,
          mode: 'hover',
          currentValue: '16px',
        });

        manager.handlePropertyHover({
          propertyPath: 'styles.padding',
          componentId: 'button-1',
          mapping,
          mode: 'off',
          currentValue: undefined,
        });
      });

      console.log(`\nHover/Unhover: ${result.opsPerSecond.toFixed(2)} ops/sec`);
      expect(result.opsPerSecond).toBeGreaterThan(250);
    });
  });

  describe('System Operations Performance', () => {
    it('should benchmark getConfig - 10000 operations', async () => {
      const result = await benchmark.run('Get Config (10000x)', 10000, () => {
        manager.getConfig();
      });

      console.log(`\nGet Config: ${result.opsPerSecond.toFixed(2)} ops/sec`);

      // Config access should be very fast
      expect(result.opsPerSecond).toBeGreaterThan(50000);
    });

    it('should benchmark isEnabled - 10000 operations', async () => {
      const result = await benchmark.run('Is Enabled (10000x)', 10000, () => {
        manager.isEnabled();
      });

      console.log(`\nIs Enabled: ${result.opsPerSecond.toFixed(2)} ops/sec`);

      // Simple check should be extremely fast
      expect(result.opsPerSecond).toBeGreaterThan(100000);
    });

    it('should benchmark clearAllOverlays - 1000 operations', async () => {
      // Create some overlays first
      const mapping = registry.getMapping('button', 'styles.padding');
      if (!mapping) return;

      manager.handlePropertyHover({
        propertyPath: 'styles.padding',
        componentId: 'button-1',
        mapping,
        mode: 'hover',
        currentValue: '16px',
      });

      const result = await benchmark.run('Clear All Overlays (1000x)', 1000, () => {
        manager.clearAllOverlays();
      });

      console.log(`\nClear Overlays: ${result.opsPerSecond.toFixed(2)} ops/sec`);
      expect(result.opsPerSecond).toBeGreaterThan(1000);
    });
  });

  describe('Memory Performance', () => {
    it('should benchmark memory usage with many property changes', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Perform 1000 property changes
      for (let i = 0; i < 1000; i++) {
        manager.handlePropertyChange({
          componentId: 'button-1',
          propertyPath: 'styles.padding',
          oldValue: `${i}px`,
          newValue: `${i + 1}px`,
          propertyType: 'spacing',
        });
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      if (memoryIncrease > 0) {
        console.log(`\nMemory Increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB`);

        // Memory increase should be reasonable (< 10MB for 1000 ops)
        expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
      }
    });
  });

  describe('Stress Tests', () => {
    it('should handle sustained high load', async () => {
      const duration = 1000; // 1 second
      const startTime = performance.now();
      let operations = 0;

      while (performance.now() - startTime < duration) {
        manager.handlePropertyChange({
          componentId: 'button-1',
          propertyPath: 'styles.padding',
          oldValue: '16px',
          newValue: '17px',
          propertyType: 'spacing',
        });
        operations++;
      }

      const actualDuration = performance.now() - startTime;
      const opsPerSecond = (operations / actualDuration) * 1000;

      console.log(`\nSustained Load: ${operations} ops in ${actualDuration.toFixed(0)}ms (${opsPerSecond.toFixed(2)} ops/sec)`);

      // Should maintain at least 500 ops/sec under sustained load
      expect(opsPerSecond).toBeGreaterThan(500);
    });

    it('should not degrade with repeated operations', async () => {
      const iterations = 5;
      const opsPerIteration = 200;
      const results: number[] = [];

      for (let iteration = 0; iteration < iterations; iteration++) {
        const startTime = performance.now();

        for (let i = 0; i < opsPerIteration; i++) {
          manager.handlePropertyChange({
            componentId: 'button-1',
            propertyPath: 'styles.padding',
            oldValue: `${i}px`,
            newValue: `${i + 1}px`,
            propertyType: 'spacing',
          });
        }

        const duration = performance.now() - startTime;
        const opsPerSec = (opsPerIteration / duration) * 1000;
        results.push(opsPerSec);

        console.log(`Iteration ${iteration + 1}: ${opsPerSec.toFixed(2)} ops/sec`);
      }

      // Last iteration should not be significantly slower than first
      // Allow up to 20% degradation
      const firstOps = results[0];
      const lastOps = results[results.length - 1];
      const degradation = ((firstOps - lastOps) / firstOps) * 100;

      console.log(`\nPerformance Degradation: ${degradation.toFixed(2)}%`);
      expect(degradation).toBeLessThan(20);
    });
  });

  // Print summary after all tests
  afterEach(() => {
    if (benchmark.getResults().length > 0) {
      benchmark.printResults();
    }
  });
});

/**
 * Export benchmark utilities for use in other tests
 */
export { PerformanceBenchmark, type BenchmarkResult };
