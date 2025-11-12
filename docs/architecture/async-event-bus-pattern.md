# Async Event Bus Pattern

**Status:** ✅ Standard Pattern
**Last Updated:** 2025-11-12
**Applies To:** All reactive framework integrations (Solid.js, React, Vue, etc.)

## Overview

This document establishes the **Asynchronous Event Bus Pattern** as the standard for event-driven communication in reactive framework contexts. This pattern prevents infinite recursion, interference with framework reactivity, and enables proper decoupling of components.

## Pattern Definition

### Core Principle

**Event handlers must execute asynchronously, outside the originating call stack.**

When events are emitted from reactive contexts (event handlers, effects, signals), subscribers must not execute synchronously. Instead, execution should be deferred using microtasks, macrotasks, or promises.

### Implementation

```typescript
class EventBus {
  private handlers: Map<EventType, Set<Handler>> = new Map();

  emit(event: Event): void {
    const handlers = this.handlers.get(event.type);
    if (handlers) {
      // ✅ REQUIRED: Use queueMicrotask to defer execution
      queueMicrotask(() => {
        handlers.forEach(handler => {
          try {
            handler(event);
          } catch (error) {
            console.error(`Error in handler for ${event.type}:`, error);
          }
        });
      });
    }
  }

  on(eventType: EventType, handler: Handler): Unsubscribe {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);

    return () => {
      this.handlers.get(eventType)?.delete(handler);
    };
  }
}
```

## Why This Pattern Exists

### The Problem with Synchronous Event Buses

When event buses execute handlers synchronously, they can interfere with reactive frameworks:

```typescript
// ❌ PROBLEMATIC: Synchronous execution
class SyncEventBus {
  emit(event) {
    this.handlers.forEach(handler => {
      handler(event);  // Executes immediately
    });
  }
}

// In a Solid.js component
const Component = () => {
  const handleFocus = () => {
    // This runs in Solid.js reactive context
    eventBus.emit('focus');  // ❌ Handlers run synchronously

    // If subscribers update signals, Solid.js tracking is disrupted
    // Can cause: infinite loops, stack overflow, incorrect batching
  };

  return <input onFocus={handleFocus} />;
};
```

### Root Cause of Issues

1. **Reactive Context Pollution**: Synchronous handlers execute within the same reactive tracking context as the emitter
2. **Batching Interference**: Frameworks batch updates, but synchronous handlers can interrupt this
3. **Re-entry**: Handlers that trigger re-renders can cause the same event to fire again
4. **Stack Overflow**: Re-entrant calls build up the call stack until it overflows

### How Async Pattern Solves This

```typescript
// ✅ CORRECT: Asynchronous execution
class AsyncEventBus {
  emit(event) {
    queueMicrotask(() => {
      this.handlers.forEach(handler => {
        handler(event);  // Executes after current stack completes
      });
    });
  }
}

// Benefits:
// 1. Handlers run AFTER reactive tracking completes
// 2. Framework has time to batch and optimize updates
// 3. Original call stack completes before handlers execute
// 4. No risk of re-entrant infinite loops
```

## When to Use This Pattern

### ✅ Required For

1. **Event buses in reactive framework contexts**
   - Solid.js, React, Vue, Svelte applications
   - Any framework with reactive signals/state

2. **Events emitted from:**
   - DOM event handlers (`onClick`, `onFocus`, `onBlur`, `onInput`, etc.)
   - Framework effects (`createEffect`, `useEffect`, `watchEffect`)
   - Signal updates or computed values
   - Component lifecycle methods

3. **Cross-component communication**
   - When components are not in direct parent-child relationship
   - Global state updates
   - Pub/sub patterns

### ❌ Not Required For

1. **Direct function calls**
   - Callback props (parent → child)
   - Synchronous utility functions
   - Pure computation

2. **Framework-native patterns**
   - Context API (React, Solid.js)
   - Props drilling
   - Stores with framework integration

3. **Server-side code**
   - Node.js event emitters (unless used with SSR)
   - Backend services without reactive frameworks

## Deferral Methods

### Option 1: `queueMicrotask()` (Recommended)

```typescript
queueMicrotask(() => {
  handler(event);
});
```

**Pros:**
- Executes before next event loop tick
- Minimal delay (sub-millisecond)
- Standard API, well-supported
- Preserves event order

**Cons:**
- Not supported in very old browsers (IE11)

**Browser Support:** Chrome 71+, Firefox 69+, Safari 12.1+, Edge 79+

### Option 2: `Promise.resolve().then()`

```typescript
Promise.resolve().then(() => {
  handler(event);
});
```

**Pros:**
- Works in all modern environments
- Similar timing to microtasks
- Composable with async code

**Cons:**
- Slightly more overhead than `queueMicrotask`
- Creates unnecessary promise objects

### Option 3: `setTimeout(fn, 0)`

```typescript
setTimeout(() => {
  handler(event);
}, 0);
```

**Pros:**
- Universal support (works everywhere)
- Absolute guarantee of async execution

**Cons:**
- Slower (4ms minimum delay in browsers)
- Can cause visible UI lag
- Doesn't preserve event order as well

**Use Case:** Only when targeting very old environments or when you need delayed execution.

### Comparison Table

| Method | Timing | Support | Performance | Use Case |
|--------|--------|---------|-------------|----------|
| `queueMicrotask()` | ~0.1ms | Modern | ⭐⭐⭐ Best | Default choice |
| `Promise.resolve().then()` | ~0.1ms | Excellent | ⭐⭐ Good | When promises fit the pattern |
| `setTimeout(fn, 0)` | ~4ms | Universal | ⭐ Slower | Legacy support or intentional delay |

## Implementation Checklist

When implementing an event bus, ensure:

- [ ] `emit()` method uses `queueMicrotask()` or equivalent
- [ ] All handlers are wrapped in try-catch for error isolation
- [ ] Errors are logged with context (event type, handler info)
- [ ] `on()` returns an unsubscribe function
- [ ] Memory leaks are prevented (handlers removed on unmount)
- [ ] Event data is immutable or deeply cloned
- [ ] Type safety is enforced (TypeScript types for events)
- [ ] Unit tests verify asynchronous behavior
- [ ] Documentation warns about reactive framework usage

## Testing Requirements

Every event bus must have tests that verify:

```typescript
describe('EventBus Async Behavior', () => {
  it('should execute handlers asynchronously', async () => {
    const handler = vi.fn();
    let emitCompleted = false;

    eventBus.on('event', handler);
    eventBus.emit({ type: 'event' });

    // Handler should NOT have been called yet
    expect(handler).not.toHaveBeenCalled();
    emitCompleted = true;

    // Wait for microtask
    await Promise.resolve();

    // Now handler should have been called
    expect(handler).toHaveBeenCalledTimes(1);
    expect(emitCompleted).toBe(true);
  });

  it('should break synchronous call chain', async () => {
    const executionOrder: string[] = [];

    eventBus.on('event', () => {
      executionOrder.push('handler');
    });

    executionOrder.push('before-emit');
    eventBus.emit({ type: 'event' });
    executionOrder.push('after-emit');

    expect(executionOrder).toEqual(['before-emit', 'after-emit']);

    await Promise.resolve();

    expect(executionOrder).toEqual(['before-emit', 'after-emit', 'handler']);
  });

  it('should prevent re-entrant recursion', async () => {
    let callCount = 0;

    eventBus.on('event', () => {
      callCount++;
      if (callCount < 3) {
        eventBus.emit({ type: 'event' });
      }
    });

    eventBus.emit({ type: 'event' });
    await new Promise(resolve => setTimeout(resolve, 10));

    // Should stabilize, not overflow
    expect(callCount).toBe(3);
  });
});
```

## Code Review Checklist

When reviewing event bus implementations or usage:

### Implementation Review

- [ ] Does `emit()` defer handler execution?
- [ ] Are errors caught and logged?
- [ ] Is cleanup (unsubscribe) properly handled?
- [ ] Are there tests for async behavior?
- [ ] Is the API documented with reactive framework warnings?

### Usage Review

- [ ] Is event emission happening from reactive contexts?
- [ ] Are handlers updating signals/state?
- [ ] Could this cause re-entry or recursion?
- [ ] Is there proper cleanup on component unmount?
- [ ] Are events being emitted at appropriate times (not in render)?

## Anti-Patterns to Avoid

### ❌ Synchronous Emission

```typescript
// BAD
emit(event) {
  this.handlers.forEach(h => h(event));  // Synchronous!
}
```

### ❌ Emitting from Effects Without Guards

```typescript
// BAD
createEffect(() => {
  // This can cause infinite loops
  eventBus.emit({ value: signal() });
});
```

### ❌ Conditional Async Behavior

```typescript
// BAD
emit(event) {
  if (this.async) {
    queueMicrotask(() => this.notify(event));
  } else {
    this.notify(event);  // Sometimes synchronous!
  }
}
```

### ❌ Forgetting Error Handling

```typescript
// BAD
queueMicrotask(() => {
  handlers.forEach(h => h(event));  // Errors can kill all handlers
});
```

## Migration Guide

### From Synchronous to Asynchronous

1. **Update emit() method:**
   ```typescript
   // Before
   emit(event) {
     this.handlers.forEach(h => h(event));
   }

   // After
   emit(event) {
     queueMicrotask(() => {
       this.handlers.forEach(h => {
         try {
           h(event);
         } catch (error) {
           console.error('Handler error:', error);
         }
       });
     });
   }
   ```

2. **Update tests:**
   - Add `await Promise.resolve()` after `emit()` calls
   - Add async behavior verification tests
   - Test re-entry scenarios

3. **Update documentation:**
   - Note asynchronous behavior in API docs
   - Warn about reactive framework usage
   - Document error handling

4. **Update usage:**
   - Review all `emit()` call sites
   - Ensure callers don't expect synchronous execution
   - Add cleanup handlers where needed

### Breaking Changes

Making an event bus asynchronous is a **breaking change** if:

- Code depends on handlers executing before next line
- Synchronous return values are expected
- Order dependencies between emit and subsequent code

**Mitigation:**
- Version bump (major)
- Migration guide in release notes
- Deprecation warnings in previous version

## Real-World Examples

### VisualFeedbackEventBus

See `packages/core/visual-feedback/VisualFeedbackEventBus.ts` for reference implementation.

**Key Features:**
- Uses `queueMicrotask()` for deferral
- Error isolation per handler
- Type-safe events
- Comprehensive test coverage

**Usage:**
```typescript
// In PropertyPanel (Solid.js component)
const handleFocus = () => {
  visualFeedbackEventBus.emit({
    type: 'property:edit:start',
    propertyPath: 'styles.padding',
    componentId: props.component.id,
  });
};

// In BuilderContext (subscriber)
onMount(() => {
  const unsubscribe = visualFeedbackEventBus.on(
    'property:edit:start',
    (event) => {
      // This runs asynchronously, after Solid.js reactivity completes
      visualFeedbackManager.handlePropertyEdit(event);
    }
  );

  onCleanup(unsubscribe);
});
```

## Performance Considerations

### Microtask Overhead

- **Typical delay:** 0.1-0.5ms per event
- **User perception:** Imperceptible (<16ms is "instant")
- **Throughput:** Can handle thousands of events/second

### When Performance Matters

If emitting thousands of events per second:

1. **Batch events** before emitting
2. **Debounce** rapid emissions
3. **Consider alternatives** (direct function calls, shared state)

Example batching:

```typescript
class BatchedEventBus {
  private pendingEvents: Event[] = [];
  private flushScheduled = false;

  emit(event: Event): void {
    this.pendingEvents.push(event);

    if (!this.flushScheduled) {
      this.flushScheduled = true;
      queueMicrotask(() => {
        this.flush();
      });
    }
  }

  private flush(): void {
    const events = this.pendingEvents;
    this.pendingEvents = [];
    this.flushScheduled = false;

    this.handlers.forEach(handler => {
      try {
        handler(events);
      } catch (error) {
        console.error('Batch handler error:', error);
      }
    });
  }
}
```

## Alternatives to Event Buses

Consider these patterns as alternatives:

### 1. Framework Context + Signals

```typescript
// Solid.js example
const FeedbackContext = createContext();

export const FeedbackProvider = (props) => {
  const [activeProperty, setActiveProperty] = createSignal(null);

  return (
    <FeedbackContext.Provider value={{ activeProperty, setActiveProperty }}>
      {props.children}
    </FeedbackContext.Provider>
  );
};
```

**Pros:** Type-safe, framework-integrated, automatic cleanup
**Cons:** Requires provider hierarchy, more boilerplate

### 2. Callback Props

```typescript
<PropertyPanel
  onPropertyEdit={(path, value) => {
    visualFeedbackManager.handle(path, value);
  }}
/>
```

**Pros:** Simple, explicit, type-safe
**Cons:** Props drilling, tight coupling

### 3. Global Stores

```typescript
// Solid.js store
export const [feedbackStore, setFeedbackStore] = createStore({
  activeProperty: null,
  isEditing: false,
});
```

**Pros:** Centralized state, reactive, framework-native
**Cons:** Global state management complexity

### When to Choose Event Bus

Choose async event bus when:
- ✅ Components are far apart in tree
- ✅ Many-to-many communication needed
- ✅ Decoupling is priority
- ✅ Events are system-wide concerns

Choose alternatives when:
- ✅ Direct parent-child relationship
- ✅ Tight coupling is acceptable
- ✅ Framework patterns suffice
- ✅ Type safety is critical

## References

- [JavaScript Event Loop](https://javascript.info/event-loop)
- [Microtasks vs Macrotasks](https://javascript.info/microtask-queue)
- [Solid.js Reactivity](https://www.solidjs.com/guides/reactivity)
- [React Concurrent Rendering](https://react.dev/blog/2022/03/29/react-v18#what-is-concurrent-react)
- [Troubleshooting Guide](../troubleshooting/solid-event-bus-recursion.md)

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2025-11-12 | 1.0 | Initial documentation establishing async event bus as standard pattern |

---

**Questions or Issues?** See [Troubleshooting Guide](../troubleshooting/solid-event-bus-recursion.md) or open a GitHub issue.
