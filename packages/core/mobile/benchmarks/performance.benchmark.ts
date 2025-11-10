/**
 * Performance Benchmarks for Mobile Development Mode
 *
 * Comprehensive benchmarks to measure performance of key operations
 */

import { ModeManager } from '../ModeManager';
import { PropertyOverrideManager } from '../PropertyOverrideManager';
import { MobileLayoutManager } from '../MobileLayoutManager';
import { ValidationService } from '../ValidationService';
import { MobileExportService } from '../MobileExportService';
import { PerformanceOptimizer, PerformanceMonitor } from '../PerformanceOptimizer';
import { DiffCalculator } from '../DiffCalculator';
import { EventEmitter } from '../../services/EventEmitter';
import { CommandManager } from '../../commands/CommandManager';
import { DeviceMode, DEFAULT_MOBILE_DEV_MODE_CONFIG } from '../mobile.types';
import type { Template } from '../../types';

// ============================================================================
// Benchmark Utilities
// ============================================================================

interface BenchmarkResult {
  name: string;
  operations: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  opsPerSecond: number;
}

class Benchmark {
  private monitor: PerformanceMonitor;

  constructor() {
    this.monitor = new PerformanceMonitor();
  }

  public async run(
    name: string,
    fn: () => void | Promise<void>,
    iterations: number = 1000
  ): Promise<BenchmarkResult> {
    const times: number[] = [];

    // Warm-up
    for (let i = 0; i < 10; i++) {
      await fn();
    }

    // Actual benchmark
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await fn();
      const end = performance.now();
      times.push(end - start);
    }

    const totalTime = times.reduce((a, b) => a + b, 0);
    const averageTime = totalTime / iterations;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const opsPerSecond = 1000 / averageTime;

    return {
      name,
      operations: iterations,
      totalTime,
      averageTime,
      minTime,
      maxTime,
      opsPerSecond,
    };
  }

  public printResult(result: BenchmarkResult): void {
    console.log(`\n📊 ${result.name}`);
    console.log(`   Operations: ${result.operations}`);
    console.log(`   Total time: ${result.totalTime.toFixed(2)}ms`);
    console.log(`   Average: ${result.averageTime.toFixed(4)}ms`);
    console.log(`   Min: ${result.minTime.toFixed(4)}ms`);
    console.log(`   Max: ${result.maxTime.toFixed(4)}ms`);
    console.log(`   Ops/sec: ${result.opsPerSecond.toFixed(2)}`);
  }
}

// ============================================================================
// Test Data Generators
// ============================================================================

function createMockTemplate(componentCount: number): Template {
  const components = [];

  for (let i = 0; i < componentCount; i++) {
    components.push({
      id: `comp-${i}`,
      type: i % 3 === 0 ? 'button' : i % 3 === 1 ? 'text' : 'image',
      styles: {
        padding: '16px',
        fontSize: '14px',
        width: '100%',
        backgroundColor: '#ffffff',
        color: '#000000',
      },
      mobileStyles:
        i % 2 === 0
          ? {
              padding: '8px',
              fontSize: '12px',
            }
          : undefined,
    });
  }

  return {
    id: 'template-1',
    name: 'Test Template',
    components,
    componentOrder: {
      desktop: components.map((c) => c.id),
    },
  } as Template;
}

// ============================================================================
// Benchmarks
// ============================================================================

export async function runAllBenchmarks() {
  console.log('\n🚀 Starting Mobile Development Mode Performance Benchmarks\n');
  console.log('='.repeat(70));

  const benchmark = new Benchmark();
  const results: BenchmarkResult[] = [];

  // Mode Switching
  results.push(await benchmarkModeSwitching(benchmark));

  // Property Overrides
  results.push(await benchmarkPropertyOverrides(benchmark));

  // Component Ordering
  results.push(await benchmarkComponentOrdering(benchmark));

  // Validation
  results.push(await benchmarkValidation(benchmark));

  // Export
  results.push(await benchmarkExport(benchmark));

  // Diff Calculation
  results.push(await benchmarkDiffCalculation(benchmark));

  // Large Templates
  results.push(await benchmarkLargeTemplates(benchmark));

  // Debouncing
  results.push(await benchmarkDebouncing(benchmark));

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📈 Summary');
  console.log('='.repeat(70));

  const totalOps = results.reduce((sum, r) => sum + r.operations, 0);
  const totalTime = results.reduce((sum, r) => sum + r.totalTime, 0);

  console.log(`\nTotal operations: ${totalOps.toLocaleString()}`);
  console.log(`Total time: ${totalTime.toFixed(2)}ms`);
  console.log(`\nFastest: ${results.sort((a, b) => a.averageTime - b.averageTime)[0].name}`);
  console.log(
    `Slowest: ${results.sort((a, b) => b.averageTime - a.averageTime)[0].name}`
  );

  return results;
}

async function benchmarkModeSwitching(benchmark: Benchmark): Promise<BenchmarkResult> {
  const template = createMockTemplate(20);
  const eventEmitter = new EventEmitter();

  const modeManager = new ModeManager({
    eventEmitter,
    config: DEFAULT_MOBILE_DEV_MODE_CONFIG,
    desktopCommandManager: new CommandManager(eventEmitter),
    mobileCommandManager: new CommandManager(eventEmitter),
  });
  modeManager.setTemplate(template);

  const result = await benchmark.run(
    'Mode Switching',
    async () => {
      await modeManager.switchMode(DeviceMode.MOBILE, { skipLazyLoad: true });
      await modeManager.switchMode(DeviceMode.DESKTOP);
    },
    500 // Fewer iterations for async operations
  );

  benchmark.printResult(result);
  return result;
}

async function benchmarkPropertyOverrides(benchmark: Benchmark): Promise<BenchmarkResult> {
  const template = createMockTemplate(50);
  const eventEmitter = new EventEmitter();

  const overrideManager = new PropertyOverrideManager({
    eventEmitter,
    config: DEFAULT_MOBILE_DEV_MODE_CONFIG,
    template,
  });

  const result = await benchmark.run(
    'Property Override Set/Get',
    () => {
      overrideManager.setOverride('comp-10', 'styles.padding', '8px');
      overrideManager.getOverride('comp-10', 'styles.padding');
      overrideManager.clearOverride('comp-10', 'styles.padding');
    },
    2000
  );

  benchmark.printResult(result);
  return result;
}

async function benchmarkComponentOrdering(benchmark: Benchmark): Promise<BenchmarkResult> {
  const template = createMockTemplate(100);
  const eventEmitter = new EventEmitter();

  const layoutManager = new MobileLayoutManager({
    eventEmitter,
    template,
  });

  const componentIds = template.components.map((c) => c.id);

  const result = await benchmark.run(
    'Component Reordering',
    () => {
      const shuffled = [...componentIds].sort(() => Math.random() - 0.5);
      layoutManager.reorderComponents(shuffled);
      layoutManager.getLayoutItems();
    },
    1000
  );

  benchmark.printResult(result);
  return result;
}

async function benchmarkValidation(benchmark: Benchmark): Promise<BenchmarkResult> {
  const template = createMockTemplate(50);
  const eventEmitter = new EventEmitter();

  const modeManager = {
    getCurrentMode: () => DeviceMode.MOBILE,
  } as any;

  const validationService = new ValidationService({
    eventEmitter,
    modeManager,
    config: DEFAULT_MOBILE_DEV_MODE_CONFIG,
  });

  const result = await benchmark.run(
    'Validation',
    () => {
      validationService.validate(template);
    },
    500
  );

  benchmark.printResult(result);
  return result;
}

async function benchmarkExport(benchmark: Benchmark): Promise<BenchmarkResult> {
  const template = createMockTemplate(50);
  const eventEmitter = new EventEmitter();

  const modeManager = new ModeManager({
    eventEmitter,
    config: DEFAULT_MOBILE_DEV_MODE_CONFIG,
    desktopCommandManager: new CommandManager(eventEmitter),
    mobileCommandManager: new CommandManager(eventEmitter),
  });
  modeManager.setTemplate(template);

  const layoutManager = new MobileLayoutManager({
    eventEmitter,
    template,
  });

  const exportService = new MobileExportService({
    modeManager,
    layoutManager,
    config: DEFAULT_MOBILE_DEV_MODE_CONFIG,
  });

  const result = await benchmark.run(
    'Template Export',
    () => {
      exportService.exportTemplate(template);
    },
    500
  );

  benchmark.printResult(result);
  return result;
}

async function benchmarkDiffCalculation(benchmark: Benchmark): Promise<BenchmarkResult> {
  const template = createMockTemplate(100);

  const result = await benchmark.run(
    'Diff Calculation',
    () => {
      DiffCalculator.calculateDiff(template);
      DiffCalculator.calculateSummary(template);
    },
    1000
  );

  benchmark.printResult(result);
  return result;
}

async function benchmarkLargeTemplates(benchmark: Benchmark): Promise<BenchmarkResult> {
  const template = createMockTemplate(500); // Large template
  const eventEmitter = new EventEmitter();

  const modeManager = new ModeManager({
    eventEmitter,
    config: DEFAULT_MOBILE_DEV_MODE_CONFIG,
    desktopCommandManager: new CommandManager(eventEmitter),
    mobileCommandManager: new CommandManager(eventEmitter),
  });
  modeManager.setTemplate(template);

  const layoutManager = new MobileLayoutManager({
    eventEmitter,
    template,
  });

  const result = await benchmark.run(
    'Large Template (500 components)',
    () => {
      layoutManager.getLayoutItems();
      DiffCalculator.calculateDiff(template);
    },
    100 // Fewer iterations for large data
  );

  benchmark.printResult(result);
  return result;
}

async function benchmarkDebouncing(benchmark: Benchmark): Promise<BenchmarkResult> {
  const optimizer = new PerformanceOptimizer({
    config: DEFAULT_MOBILE_DEV_MODE_CONFIG,
  });

  let callCount = 0;
  const fn = optimizer.debounce(() => {
    callCount++;
  }, 16);

  const result = await benchmark.run(
    'Debounced Function Calls',
    () => {
      fn();
    },
    5000
  );

  benchmark.printResult(result);
  console.log(`   Actual function calls: ${callCount} (debounced from ${result.operations})`);

  return result;
}

// ============================================================================
// Memory Usage Benchmark
// ============================================================================

export function benchmarkMemoryUsage() {
  console.log('\n💾 Memory Usage Benchmark');
  console.log('='.repeat(70));

  const sizes = [10, 50, 100, 500, 1000];

  for (const size of sizes) {
    const before = (performance as any).memory?.usedJSHeapSize || 0;

    const template = createMockTemplate(size);

    const after = (performance as any).memory?.usedJSHeapSize || 0;
    const diff = after - before;

    console.log(`\n${size} components:`);
    console.log(`  Memory: ${(diff / 1024).toFixed(2)} KB`);
    console.log(`  Per component: ${(diff / size / 1024).toFixed(4)} KB`);
  }
}

// ============================================================================
// Stress Test
// ============================================================================

export async function stressTest() {
  console.log('\n🔥 Stress Test');
  console.log('='.repeat(70));

  const template = createMockTemplate(1000);
  const eventEmitter = new EventEmitter();

  const overrideManager = new PropertyOverrideManager({
    eventEmitter,
    config: DEFAULT_MOBILE_DEV_MODE_CONFIG,
    template,
  });

  console.log('\nPerforming 10,000 property override operations...');

  const start = performance.now();

  for (let i = 0; i < 10000; i++) {
    const compId = `comp-${i % 1000}`;
    overrideManager.setOverride(compId, 'styles.padding', `${i % 64}px`);
  }

  const end = performance.now();
  const duration = end - start;

  console.log(`✓ Completed in ${duration.toFixed(2)}ms`);
  console.log(`  Average: ${(duration / 10000).toFixed(4)}ms per operation`);
  console.log(`  Throughput: ${(10000 / (duration / 1000)).toFixed(2)} ops/sec`);
}

// ============================================================================
// Run Script
// ============================================================================

if (require.main === module) {
  (async () => {
    await runAllBenchmarks();
    benchmarkMemoryUsage();
    await stressTest();
  })();
}
