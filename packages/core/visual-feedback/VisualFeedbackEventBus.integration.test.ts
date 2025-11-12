/**
 * Integration test for VisualFeedbackEventBus
 *
 * Tests the actual stack overflow scenario that was occurring:
 * 1. PropertyPanel emits property:edit:start on focus
 * 2. Handler updates state, triggering re-renders
 * 3. Re-render somehow re-triggers focus, emitting again
 * 4. Without debouncing: infinite loop → stack overflow
 * 5. With debouncing: loop is broken
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { visualFeedbackEventBus } from './VisualFeedbackEventBus';
import type { VisualFeedbackEvent } from './VisualFeedbackEventBus';

describe('VisualFeedbackEventBus - Stack Overflow Prevention', () => {
  beforeEach(() => {
    visualFeedbackEventBus.clear();
  });

  afterEach(() => {
    visualFeedbackEventBus.clear();
  });

  it('should prevent stack overflow from recursive event emissions', async () => {
    let emitCount = 0;
    let handlerCallCount = 0;
    const maxExpectedCalls = 1; // With debouncing, should only fire once

    // Simulate PropertyPanel behavior: focus event emits property:edit:start
    const simulatePropertyFocus = (propertyPath: string) => {
      emitCount++;
      visualFeedbackEventBus.emit({
        type: 'property:edit:start',
        propertyPath,
        componentId: 'test-component',
        currentValue: 'test-value',
        isEditing: true,
      });
    };

    // Simulate VisualFeedbackManager handler that updates state
    // In the real app, this update somehow triggers focus again
    visualFeedbackEventBus.on('property:edit:start', (event) => {
      handlerCallCount++;

      // Simulate the problematic behavior: handler causes focus to re-trigger
      // This would create infinite recursion without debouncing
      if (handlerCallCount < 100) { // Safety limit to prevent infinite loop in test
        simulatePropertyFocus(event.propertyPath);
      }
    });

    // Trigger the initial focus event
    simulatePropertyFocus('styles.padding');

    // Wait for async emissions to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // With debouncing:
    // - First emit triggers handler (handlerCallCount = 1)
    // - Handler tries to emit again, but it's debounced (skipped)
    // - Total handler calls = 1

    // Without debouncing (the bug):
    // - Would emit 100 times (limited by our safety check)
    // - In production, would cause stack overflow

    console.log(`Emit attempts: ${emitCount}, Handler calls: ${handlerCallCount}`);

    expect(handlerCallCount).toBe(maxExpectedCalls);
    expect(handlerCallCount).toBeLessThan(emitCount); // Proof that debouncing is working
  });

  it('should allow different properties to emit without debouncing', async () => {
    const calls: string[] = [];

    visualFeedbackEventBus.on('property:edit:start', (event) => {
      calls.push(event.propertyPath);
    });

    // Emit events for different properties in rapid succession
    visualFeedbackEventBus.emit({
      type: 'property:edit:start',
      propertyPath: 'styles.padding',
      componentId: 'test',
      currentValue: '10px',
    });

    visualFeedbackEventBus.emit({
      type: 'property:edit:start',
      propertyPath: 'styles.margin',
      componentId: 'test',
      currentValue: '20px',
    });

    visualFeedbackEventBus.emit({
      type: 'property:edit:start',
      propertyPath: 'styles.color',
      componentId: 'test',
      currentValue: 'red',
    });

    await new Promise(resolve => setTimeout(resolve, 20));

    // All three should fire because they're different properties
    expect(calls).toEqual(['styles.padding', 'styles.margin', 'styles.color']);
  });

  it('should measure performance and detect potential stack overflow', async () => {
    let callCount = 0;
    const startTime = Date.now();

    // This simulates the worst-case scenario
    visualFeedbackEventBus.on('property:edit:start', () => {
      callCount++;

      // Try to emit recursively (simulating the bug)
      if (Date.now() - startTime < 50) { // Try for 50ms
        visualFeedbackEventBus.emit({
          type: 'property:edit:start',
          propertyPath: 'test',
          componentId: 'test',
          currentValue: 'value',
        });
      }
    });

    // Start the emission
    visualFeedbackEventBus.emit({
      type: 'property:edit:start',
      propertyPath: 'test',
      componentId: 'test',
      currentValue: 'value',
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`Duration: ${duration}ms, Calls: ${callCount}`);

    // With debouncing: should complete quickly with minimal calls
    expect(duration).toBeLessThan(200); // Should finish quickly
    expect(callCount).toBeLessThan(5); // Should only call handler a few times max

    // Without debouncing: would either take forever or crash with stack overflow
  });

  it('should reset debounce after timeout period', async () => {
    const calls: number[] = [];

    visualFeedbackEventBus.on('property:edit:start', () => {
      calls.push(Date.now());
    });

    // First emit
    visualFeedbackEventBus.emit({
      type: 'property:edit:start',
      propertyPath: 'test',
      componentId: 'test',
      currentValue: 'value',
    });

    await new Promise(resolve => setTimeout(resolve, 20));

    // Second emit immediately after - should be debounced
    visualFeedbackEventBus.emit({
      type: 'property:edit:start',
      propertyPath: 'test',
      componentId: 'test',
      currentValue: 'value',
    });

    await new Promise(resolve => setTimeout(resolve, 20));

    // Wait for debounce timeout (50ms)
    await new Promise(resolve => setTimeout(resolve, 60));

    // Third emit after timeout - should NOT be debounced
    visualFeedbackEventBus.emit({
      type: 'property:edit:start',
      propertyPath: 'test',
      componentId: 'test',
      currentValue: 'value',
    });

    await new Promise(resolve => setTimeout(resolve, 20));

    // Should have 2 calls: first one and third one (second was debounced)
    expect(calls.length).toBe(2);
  });
});
