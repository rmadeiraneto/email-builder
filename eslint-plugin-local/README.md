# ESLint Plugin Local

Custom ESLint rules for the email-builder project.

## Installation

This is a local plugin, so it's already available in the project.

To use in your ESLint configuration:

```json
{
  "plugins": ["eslint-plugin-local"],
  "rules": {
    "local/no-sync-event-emit-in-handlers": "error"
  }
}
```

## Rules

### `no-sync-event-emit-in-handlers`

Disallows synchronous event emission in event handlers and reactive contexts.

**Rationale:** Synchronous event emission from within DOM event handlers or reactive effects can cause infinite recursion in reactive frameworks like Solid.js. This rule enforces wrapping event emissions in async wrappers like `queueMicrotask()`.

**❌ Incorrect:**

```typescript
// In event handler
<input
  onFocus={() => {
    eventBus.emit({ type: 'focus' }); // ❌ Error
  }}
/>

// In reactive effect
createEffect(() => {
  eventBus.emit({ value: signal() }); // ❌ Error
});
```

**✅ Correct:**

```typescript
// Wrapped in queueMicrotask
<input
  onFocus={() => {
    queueMicrotask(() => {
      eventBus.emit({ type: 'focus' }); // ✅ OK
    });
  }}
/>

// Wrapped in setTimeout
<input
  onFocus={() => {
    setTimeout(() => {
      eventBus.emit({ type: 'focus' }); // ✅ OK
    }, 0);
  }}
/>

// Wrapped in Promise.resolve().then()
<input
  onFocus={() => {
    Promise.resolve().then(() => {
      eventBus.emit({ type: 'focus' }); // ✅ OK
    });
  }}
/>
```

**Options:**

```json
{
  "local/no-sync-event-emit-in-handlers": [
    "error",
    {
      "eventEmitterMethods": ["emit", "dispatch", "trigger"],
      "allowAsyncWrappers": true
    }
  ]
}
```

- `eventEmitterMethods` (array): List of method names to check (default: `["emit", "dispatch", "trigger", "fire", "publish", "notify"]`)
- `allowAsyncWrappers` (boolean): Whether to allow calls wrapped in async functions (default: `true`)

### Detected Patterns

The rule detects:

1. **Event Handler Props:**
   - `onClick`, `onFocus`, `onBlur`, `onInput`, etc. in JSX
   - Both React and Solid.js event handlers

2. **Reactive Effects:**
   - `createEffect` (Solid.js)
   - `useEffect` (React)
   - `watchEffect` (Vue)
   - `watch`, `computed`

3. **Event Emitter Methods:**
   - `.emit()`
   - `.dispatch()`
   - `.trigger()`
   - `.fire()`
   - `.publish()`
   - `.notify()`

4. **Async Wrappers (allowed):**
   - `queueMicrotask(() => {})`
   - `setTimeout(() => {}, 0)`
   - `Promise.resolve().then(() => {})`

## Testing

See `__tests__/rules/no-sync-event-emit-in-handlers.test.js` for comprehensive test cases.

## See Also

- [Async Event Bus Pattern](../docs/architecture/async-event-bus-pattern.md)
- [Troubleshooting Guide](../docs/troubleshooting/solid-event-bus-recursion.md)
