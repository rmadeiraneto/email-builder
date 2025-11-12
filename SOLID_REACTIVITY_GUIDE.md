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

### 3. createEffect Self-Triggering (CRITICAL!)

**⚠️ This is the most common and dangerous pattern!**

When a `createEffect` reads and writes the same signal, it creates an infinite loop:

```typescript
// ❌ WRONG - Effect triggers itself infinitely!
const [timer, setTimer] = createSignal<NodeJS.Timeout | null>(null);

createEffect(() => {
  const currentTimer = timer();  // ← READS signal (creates dependency)
  if (currentTimer) {
    clearTimeout(currentTimer);
  }

  const newTimer = setTimeout(() => { /* ... */ }, 500);
  setTimer(newTimer);  // ← WRITES signal (triggers effect again!)
});

// Result: createEffect runs → reads timer → sets timer → effect runs → ... → STACK OVERFLOW
```

**✅ CORRECT - Use untrack() when reading:**

```typescript
const [timer, setTimer] = createSignal<NodeJS.Timeout | null>(null);

createEffect(() => {
  // Use untrack to read without creating a reactive dependency
  const currentTimer = untrack(timer);  // ← No dependency created
  if (currentTimer) {
    clearTimeout(currentTimer);
  }

  const newTimer = setTimeout(() => { /* ... */ }, 500);
  setTimer(newTimer);  // ← Won't trigger THIS effect
});

// Result: Effect only runs when other tracked signals change
```

**Key principle**: If an effect needs to read a signal's current value but shouldn't re-run when that signal changes, use `untrack()`.

### 4. When Signals Update Inside Reactive Context
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

### ✅ Fixed: AccessibilityAnnouncer.tsx (Issue #1 - Event Handlers)
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

### ✅ Fixed: AccessibilityAnnouncer.tsx (Issue #2 - createEffect Self-Triggering)
```typescript
// Location: packages/ui-solid/src/visual-feedback/AccessibilityAnnouncer.tsx
const [debounceTimer, setDebounceTimer] = createSignal<NodeJS.Timeout | null>(null);
const [isEditing, setIsEditing] = createSignal(false);
const [currentProperty, setCurrentProperty] = createSignal<string | undefined>(undefined);

// Debounce announcements to avoid overwhelming screen readers
createEffect(() => {
  if (!isEditing() || !currentProperty()) {
    setAnnouncement('');
    return;
  }

  // ✅ Use untrack to read timer without creating a reactive dependency
  // This prevents infinite loops where the effect triggers itself
  const timer = untrack(debounceTimer);  // ← Key fix!
  if (timer) {
    clearTimeout(timer);
  }

  // Set new debounced announcement
  const newTimer = setTimeout(() => {
    const formattedProperty = formatPropertyName(currentProperty()!);
    const formattedValue = formatValue(currentValue());
    setAnnouncement(`Editing ${formattedProperty}: ${formattedValue}`);
  }, 500);

  setDebounceTimer(newTimer);  // ← Won't trigger this effect
});

// This effect only re-runs when isEditing or currentProperty changes,
// NOT when debounceTimer changes
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

## Checklist for New createEffect

When adding new effects that use signals:

- [ ] Identify which signals the effect should react to
- [ ] Use `untrack()` when reading signals that the effect also writes
- [ ] Use `untrack()` when reading "utility" signals (like timers, refs) that shouldn't trigger re-runs
- [ ] Test that the effect only runs when intended signals change
- [ ] Verify no infinite loops or stack overflow errors

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

### ❌ Mistake 4: createEffect reading and writing same signal (MOST COMMON!)

```typescript
// ❌ WRONG - Effect triggers itself infinitely
const [counter, setCounter] = createSignal(0);

createEffect(() => {
  const current = counter();  // ← Creates dependency on counter
  setCounter(current + 1);    // ← Triggers effect again!
});

// Result: Infinite loop → Stack overflow
```

```typescript
// ❌ WRONG - Common with timers
const [debounceTimer, setDebounceTimer] = createSignal<NodeJS.Timeout | null>(null);

createEffect(() => {
  const timer = debounceTimer();  // ← Tracks debounceTimer
  if (timer) clearTimeout(timer);

  setDebounceTimer(setTimeout(...));  // ← Triggers effect again!
});

// Result: Effect runs forever
```

```typescript
// ✅ CORRECT - Use untrack when reading
const [debounceTimer, setDebounceTimer] = createSignal<NodeJS.Timeout | null>(null);

createEffect(() => {
  const timer = untrack(debounceTimer);  // ← No dependency
  if (timer) clearTimeout(timer);

  setDebounceTimer(setTimeout(...));  // ← Won't trigger this effect
});

// Result: Effect only runs when other signals change
```

**Rule of thumb**: If you're reading a signal's current value in an effect just to clean it up or compare it (not to react to changes), use `untrack()`.

## Questions?

If you're unsure whether to use `untrack()`, ask:

1. **Am I updating a Solid.js signal?** → Probably need `untrack()`
2. **Is this inside an event handler?** → Probably need `untrack()`
3. **Does my component have createEffect?** → Definitely need `untrack()`
4. **Is my createEffect reading and writing the same signal?** → Definitely need `untrack()` when reading
5. **Is this a DOM event in JSX?** → Usually don't need `untrack()`

**When in doubt:**
- Use `untrack()` around signal updates in event handlers
- Use `untrack()` when reading signals that an effect also writes
- **It's safer to over-use `untrack()` than to risk stack overflow**

## References

- [Solid.js untrack() documentation](https://www.solidjs.com/docs/latest/api#untrack)
- [Solid.js Reactivity documentation](https://www.solidjs.com/docs/latest/api#reactivity)
- This codebase: `packages/ui-solid/src/visual-feedback/AccessibilityAnnouncer.tsx` (fixed example)
- This codebase: `apps/dev/src/context/BuilderContext.tsx` (fixed example)

---

**Last Updated**: 2025-11-12
**Related PR**: Stack Overflow Fix in Visual Feedback Event Handlers
**Incident**: Maximum call stack size exceeded in `runUpdates` / `completeUpdates`
