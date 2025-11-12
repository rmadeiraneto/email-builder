# Solid.js Reactivity Guide for Email Builder

## ⚠️ CRITICAL: Preventing Stack Overflow in Event Handlers

This guide explains how to safely work with Solid.js reactive signals in event handlers to prevent infinite reactive loops and stack overflow errors.

## The Problem

When event handlers update Solid.js signals without proper isolation, they can trigger infinite reactive loops:

```
Event → Signal Update → createEffect runs → More signal updates → createEffect runs again → ...
```

This causes: `RangeError: Maximum call stack size exceeded`

## The Solution: Always Use `untrack()`

### ✅ REQUIRED PATTERN

When subscribing to events (especially visual feedback events) and updating Solid.js signals, **ALWAYS** wrap signal updates with `untrack()`:

```typescript
import { untrack } from 'solid-js';
import { visualFeedbackEventBus } from '@email-builder/core';

// ✅ CORRECT - Prevents reactive loops
visualFeedbackEventBus.on('property:edit:start', (event) => {
  untrack(() => {
    setCurrentProperty(event.propertyPath);
    setCurrentValue(event.currentValue);
    setIsEditing(true);
  });
});
```

### ❌ DANGEROUS PATTERN - DO NOT USE

```typescript
// ❌ WRONG - Will cause stack overflow!
visualFeedbackEventBus.on('property:edit:start', (event) => {
  setCurrentProperty(event.propertyPath);  // Not wrapped in untrack()
  setCurrentValue(event.currentValue);
  setIsEditing(true);
});
```

## When to Use `untrack()`

Use `untrack()` in these scenarios:

### 1. Event Bus Handlers
```typescript
visualFeedbackEventBus.on('property:hover', (event) => {
  untrack(() => {
    setHoveredProperty(event.propertyPath);
  });
});
```

### 2. Non-DOM Event Handlers That Update Signals
```typescript
someService.on('data-changed', (data) => {
  untrack(() => {
    setData(data);
  });
});
```

### 3. When Signals Update Inside Reactive Context
If your component has `createEffect` that depends on signals you're updating in handlers:

```typescript
const [isEditing, setIsEditing] = createSignal(false);
const [value, setValue] = createSignal('');

// This effect will run every time isEditing or value changes
createEffect(() => {
  if (isEditing()) {
    console.log('Editing:', value());
  }
});

// Handler MUST use untrack() to avoid triggering the effect recursively
onFocus(() => {
  untrack(() => {
    setIsEditing(true);
    setValue(getCurrentValue());
  });
});
```

## When You DON'T Need `untrack()`

### 1. Direct DOM Event Handlers
Standard DOM event handlers (onClick, onInput, etc.) in JSX are usually safe:

```typescript
// Usually OK - Solid handles this properly
<input
  onInput={(e) => setInputValue(e.currentTarget.value)}
  onFocus={() => setIsFocused(true)}
/>
```

### 2. One-time Operations
If you're setting a signal once without recursive dependencies:

```typescript
// OK - No reactive loop possible
const handleSave = () => {
  setSaved(true);
};
```

## Real-World Examples from This Codebase

### ✅ Fixed: AccessibilityAnnouncer.tsx
```typescript
// Location: packages/ui-solid/src/visual-feedback/AccessibilityAnnouncer.tsx
onMount(() => {
  const unsubscribeEditStart = visualFeedbackEventBus.on('property:edit:start', (event) => {
    // ✅ Using untrack to prevent infinite loops
    untrack(() => {
      setCurrentProperty(event.propertyPath);
      setCurrentValue(event.currentValue);
      setIsEditing(true);
    });
  });
});
```

### ✅ Fixed: BuilderContext.tsx
```typescript
// Location: apps/dev/src/context/BuilderContext.tsx
const unsubscribeEditStart = visualFeedbackEventBus.on('property:edit:start', (event) => {
  // ✅ Using untrack to prevent reactive loops
  untrack(() => {
    managerRef?.handlePropertyEdit({
      propertyPath: event.propertyPath,
      componentId: event.componentId,
      oldValue: undefined,
      newValue: event.currentValue,
      mapping: undefined as any,
    });
  });
});
```

### ✅ Safe: PropertyPanel.tsx
```typescript
// Location: packages/ui-solid/src/sidebar/PropertyPanel.tsx
// DOM event handlers are safe without untrack
<input
  type="number"
  value={currentValue || 0}
  onInput={(e) => {
    const numValue = Number(e.currentTarget.value);
    handlePropertyChange(property, numValue);
  }}
  onFocus={() => handlePropertyEditStart(property)}
  onBlur={() => handlePropertyEditEnd(property)}
/>
```

## How to Debug Reactive Loops

If you encounter stack overflow errors:

### 1. Check the Stack Trace
Look for repeated patterns like:
```
at runUpdates
at completeUpdates
at runUpdates
at completeUpdates
...
```

This indicates a Solid.js reactive loop.

### 2. Find the Event Handler
The error often occurs in event bus handlers. Look for:
- `visualFeedbackEventBus.on(...)`
- Custom event emitters
- Service event subscriptions

### 3. Check for Missing `untrack()`
If the handler updates signals, wrap them with `untrack()`.

### 4. Verify `createEffect` Dependencies
Check if any `createEffect` in your component depends on the signals being updated.

## Testing Your Changes

### Unit Tests
When writing tests for components with event handlers:

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@solidjs/testing-library';

describe('MyComponent', () => {
  it('should handle events without stack overflow', async () => {
    const { container } = render(() => <MyComponent />);

    // Trigger the event multiple times
    for (let i = 0; i < 100; i++) {
      visualFeedbackEventBus.emit({
        type: 'property:edit:start',
        propertyPath: 'test',
      });
    }

    // Should not throw stack overflow
    expect(container).toBeTruthy();
  });
});
```

### Integration Tests
Test the full event flow:

```typescript
it('should handle rapid property changes', async () => {
  const { getByTestId } = render(() => <PropertyPanel {...props} />);

  const input = getByTestId('property-input');

  // Rapidly focus/blur multiple times
  for (let i = 0; i < 50; i++) {
    input.focus();
    input.blur();
  }

  // Should not stack overflow
  expect(input).toBeTruthy();
});
```

## Checklist for New Event Handlers

When adding new event handlers that update signals:

- [ ] Import `untrack` from 'solid-js'
- [ ] Wrap all signal updates inside the handler with `untrack(() => { ... })`
- [ ] Check if the component has `createEffect` that depends on these signals
- [ ] Test with rapid event triggering (100+ events)
- [ ] Verify no stack overflow errors in console
- [ ] Add test coverage for the event handler

## Common Mistakes to Avoid

### ❌ Mistake 1: Partial untrack()
```typescript
// ❌ WRONG - Only wrapping some signal updates
visualFeedbackEventBus.on('event', (event) => {
  untrack(() => {
    setSignalA(event.a);
  });
  setSignalB(event.b);  // ← This can still cause loops!
});
```

### ❌ Mistake 2: Forgetting to import untrack
```typescript
// ❌ WRONG - untrack not imported
import { createSignal } from 'solid-js';
// Missing: import { untrack } from 'solid-js';

visualFeedbackEventBus.on('event', (event) => {
  untrack(() => {  // ← Will error: untrack is not defined
    setSignal(event.data);
  });
});
```

### ❌ Mistake 3: Using async/await incorrectly
```typescript
// ❌ WRONG - untrack doesn't work well with async
visualFeedbackEventBus.on('event', async (event) => {
  untrack(async () => {
    await fetchData();
    setSignal(data);  // ← This runs outside untrack context
  });
});

// ✅ CORRECT - Keep untrack synchronous
visualFeedbackEventBus.on('event', (event) => {
  untrack(() => {
    setSignal(event.data);
  });

  // Async operations outside untrack are fine
  fetchData().then(data => {
    untrack(() => setSignal(data));
  });
});
```

## Questions?

If you're unsure whether to use `untrack()`, ask:

1. **Am I updating a Solid.js signal?** → Probably need `untrack()`
2. **Is this inside an event handler?** → Probably need `untrack()`
3. **Does my component have createEffect?** → Definitely need `untrack()`
4. **Is this a DOM event in JSX?** → Usually don't need `untrack()`

**When in doubt, use `untrack()` around signal updates in event handlers. It's safer to over-use it than to risk stack overflow.**

## References

- [Solid.js untrack() documentation](https://www.solidjs.com/docs/latest/api#untrack)
- [Solid.js Reactivity documentation](https://www.solidjs.com/docs/latest/api#reactivity)
- This codebase: `packages/ui-solid/src/visual-feedback/AccessibilityAnnouncer.tsx` (fixed example)
- This codebase: `apps/dev/src/context/BuilderContext.tsx` (fixed example)

---

**Last Updated**: 2025-11-12
**Related PR**: Stack Overflow Fix in Visual Feedback Event Handlers
**Incident**: Maximum call stack size exceeded in `runUpdates` / `completeUpdates`
