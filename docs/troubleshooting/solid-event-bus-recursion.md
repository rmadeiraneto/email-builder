# Solid.js Event Bus Recursion Issue

**Date:** 2025-11-12
**Status:** ✅ Resolved
**Severity:** Critical (Stack Overflow)

## Summary

Synchronous event emission from within Solid.js event handlers (like `onFocus`, `onBlur`) can cause infinite recursion when the event bus subscribers trigger reactive updates that cause component re-renders.

## The Problem

### What Happened

When users focused on input fields in the PropertyPanel, a "Maximum call stack size exceeded" error occurred, causing the application to crash.

### Root Cause

The visual feedback system used a **synchronous event bus** pattern:

1. PropertyPanel input gets focused → `onFocus` handler fires
2. Handler emits event to bus → `visualFeedbackEventBus.emit()`
3. **Synchronous** subscribers execute immediately (BuilderContext, AccessibilityAnnouncer)
4. Subscribers update signals → Solid.js reactive system triggers
5. Component re-renders or state changes occur
6. This somehow triggers focus events again → Back to step 1
7. **Infinite loop** → Stack overflow

### Technical Explanation

```typescript
// ❌ PROBLEMATIC PATTERN
class EventBus {
  emit(event) {
    // Handlers execute SYNCHRONOUSLY within the same call stack
    this.handlers.forEach(handler => {
      handler(event);  // Executes immediately
    });
  }
}

// In PropertyPanel.tsx
const handleFocus = () => {
  // This runs in Solid.js reactive context
  eventBus.emit({ type: 'focus' });  // Synchronous!

  // Subscribers run immediately here ↑
  // If they trigger state updates, Solid.js batching can be disrupted
  // This can cause re-renders that trigger more focus events
};
```

### Why It Caused Recursion

The synchronous nature meant:

1. **Same Reactive Context**: Event handlers ran within the same Solid.js reactive tracking context as the originating event
2. **Tracking Interference**: Solid.js couldn't properly batch or track dependencies
3. **Re-render Cascades**: State updates in subscribers caused immediate component re-renders
4. **Event Re-triggering**: Re-renders or DOM manipulations triggered the same events again
5. **Stack Overflow**: The cycle repeated until the call stack was exhausted

### The Debugging Journey

We tried multiple approaches that didn't work:

1. ❌ **Added `untrack()`** - Prevented some tracking but didn't break the synchronous chain
2. ❌ **Recursion guards with signals** - The signals themselves caused reactive updates
3. ❌ **Plain JavaScript guard flags** - Didn't prevent the core issue
4. ❌ **Moved state to child components** - Still passed props that caused re-renders
5. ❌ **Temporarily disabled features** - Confirmed isolation but wasn't a solution

The breakthrough came when we realized the event bus itself was the problem, not the wiring.

## The Solution

### Make Event Bus Asynchronous

Use `queueMicrotask()` to defer event handler execution:

```typescript
// ✅ CORRECT PATTERN
class EventBus {
  emit(event: Event): void {
    const handlers = this.handlers.get(event.type);
    if (handlers) {
      // Defer execution to break synchronous chain
      queueMicrotask(() => {
        handlers.forEach(handler => {
          try {
            handler(event);
          } catch (error) {
            console.error('Handler error:', error);
          }
        });
      });
    }
  }
}
```

### Why This Works

1. **Breaks the Call Stack**: Handlers execute in a separate microtask, not in the same stack frame
2. **Allows Solid.js Batching**: Reactive updates are properly batched by the time handlers run
3. **Prevents Re-entry**: Original event handler completes before subscribers run
4. **Minimal Delay**: Microtasks run before the next event loop tick (sub-millisecond delay)

### Implementation

**File**: `packages/core/visual-feedback/VisualFeedbackEventBus.ts`

```typescript
emit(event: VisualFeedbackEvent): void {
  const handlers = this.handlers.get(event.type);
  if (handlers) {
    // Use queueMicrotask to defer execution and break the synchronous call chain
    // This prevents infinite recursion when emitting from within Solid.js event handlers
    queueMicrotask(() => {
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`[VisualFeedbackEventBus] Error in handler for ${event.type}:`, error);
        }
      });
    });
  }
}
```

## How to Identify Similar Issues

### Red Flags

🚩 **Watch for these patterns:**

1. **Event bus or pub/sub inside Solid.js event handlers**
   ```typescript
   <input onFocus={() => eventBus.emit('focus')} />
   ```

2. **Synchronous observer/subscriber patterns with reactive updates**
   ```typescript
   bus.on('event', () => {
     setSignal(value);  // Triggers reactive update
   });
   ```

3. **Stack traces showing `runUpdates` → `completeUpdates` loops**
   ```
   at runUpdates (solid.js)
   at completeUpdates (solid.js)
   at updateComputation (solid.js)
   at runUpdates (solid.js)  ← Loop!
   ```

4. **Maximum call stack errors when focusing inputs or interacting with UI**

### Diagnostic Steps

1. **Check Event Bus Implementation**
   - Is `emit()` synchronous?
   - Do handlers execute immediately in the same call stack?

2. **Trace Event Flow**
   - Where is `emit()` called from? (Event handler? Effect?)
   - What do subscribers do? (Update signals? Modify DOM?)

3. **Test Isolation**
   - Temporarily disable event emissions
   - If error disappears, the event system is the culprit

4. **Use Browser DevTools**
   - Set breakpoints in event emitter
   - Watch call stack depth
   - Look for repeated function calls

## Best Practices

### ✅ Do This

1. **Use Asynchronous Event Emission**
   ```typescript
   queueMicrotask(() => handler(event));
   // or
   setTimeout(() => handler(event), 0);
   // or
   Promise.resolve().then(() => handler(event));
   ```

2. **Wrap Signal Updates in `batch()`**
   ```typescript
   import { batch } from 'solid-js';

   eventBus.on('update', (data) => {
     batch(() => {
       setSignal1(data.a);
       setSignal2(data.b);
       setSignal3(data.c);
     });
   });
   ```

3. **Use `untrack()` When Reading Signals in Event Handlers**
   ```typescript
   const handleEvent = () => {
     const value = untrack(() => someSignal());
     eventBus.emit({ value });
   };
   ```

4. **Consider Built-in Solid.js Patterns**
   ```typescript
   // Instead of event bus, use context + signals
   const [events, setEvents] = createSignal([]);

   // Or use stores for shared state
   const [store, setStore] = createStore({});
   ```

### ❌ Don't Do This

1. **Synchronous Event Bus with Reactive Subscribers**
   ```typescript
   // Bad: Immediate execution in reactive context
   emit(event) {
     this.handlers.forEach(h => h(event));
   }
   ```

2. **Emitting Events from `createEffect`**
   ```typescript
   // Bad: Can cause infinite loops
   createEffect(() => {
     eventBus.emit({ value: signal() });
   });
   ```

3. **Creating New Objects in Props on Every Render**
   ```typescript
   // Bad: Causes re-renders
   <Component
     callbacks={{
       onEvent: () => {}  // New object every render
     }}
   />

   // Good: Memoize or use stable references
   const callbacks = createMemo(() => ({
     onEvent: handleEvent
   }));
   ```

## When to Use Different Approaches

### Event Bus (Asynchronous)
✅ **Use when:**
- Decoupling components across the tree
- Multiple independent subscribers
- Events don't need immediate handling
- Working with non-Solid.js code

### Solid.js Context + Signals
✅ **Use when:**
- Sharing state within component tree
- Need reactive updates
- Want type safety with getters/setters
- State is tightly coupled to components

### Props Callbacks
✅ **Use when:**
- Direct parent-child communication
- Need immediate execution
- Simple event handling
- Type safety is important

### Stores
✅ **Use when:**
- Complex nested state
- Need fine-grained reactivity
- Multiple components read/write same data
- Want automatic dependency tracking

## Related Files

- `packages/core/visual-feedback/VisualFeedbackEventBus.ts` - Event bus implementation
- `packages/ui-solid/src/sidebar/PropertyPanel.tsx` - Event emitter (inputs)
- `apps/dev/src/context/BuilderContext.tsx` - Event subscriber
- `packages/ui-solid/src/visual-feedback/AccessibilityAnnouncer.tsx` - Event subscriber

## Additional Resources

- [Solid.js Reactivity Documentation](https://www.solidjs.com/guides/reactivity)
- [JavaScript Event Loop and Microtasks](https://javascript.info/event-loop)
- [Solid.js `untrack()` API](https://www.solidjs.com/docs/latest/api#untrack)
- [Solid.js `batch()` API](https://www.solidjs.com/docs/latest/api#batch)

## Commit Reference

**Fix Commit**: `81308f9` - "fix: resolve infinite recursion by making event bus asynchronous"

## Key Takeaways

1. 🎯 **Synchronous event buses don't mix well with reactive frameworks**
2. 🎯 **Always defer event handler execution with `queueMicrotask()` or similar**
3. 🎯 **Test event flows from UI event handlers (focus, click, input) thoroughly**
4. 🎯 **Watch for `runUpdates` loops in stack traces - they indicate reactivity issues**
5. 🎯 **When debugging, isolate by disabling features to identify the source**
6. 🎯 **Document patterns that cause issues for future reference**

---

**Remember**: In reactive frameworks, timing matters. Synchronous code can interfere with the framework's update batching and dependency tracking. When in doubt, go async!
