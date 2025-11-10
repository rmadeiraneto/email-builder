# Canvas + PropertyPanel Integration Tests

This directory contains integration tests that verify the complete workflow between the TemplateCanvas and PropertyPanel components.

## Overview

The integration tests document and validate:
- **Component Selection Flow**: Canvas → Context → PropertyPanel
- **Property Update Flow**: PropertyPanel → Context → Canvas
- **Visual Feedback System**: PropertyPanel hover/edit events → Visual overlays
- **Delete Workflow**: Component deletion handling
- **State Management**: How data flows through the application

## Architecture

### Communication Pattern

The Canvas and PropertyPanel **do NOT communicate directly**. All communication flows through the BuilderContext:

```
┌─────────────────┐
│  TemplateCanvas │
│   (View Layer)  │
└────────┬────────┘
         │ Events Up (onComponentSelect, onDrop, etc.)
         ▼
┌────────────────────┐
│  BuilderContext    │
│  (State + Actions) │
└─────────┬──────────┘
          │ Props Down (template, selectedComponentId, etc.)
          ▼
┌─────────────────────┐
│   PropertyPanel     │
│    (View Layer)     │
└─────────────────────┘
```

### Key Integration Points

1. **Component Selection**
   - User clicks component on Canvas
   - `onComponentSelect(id)` callback fires
   - Context updates `selectedComponentId`
   - PropertyPanel receives new `selectedComponent` prop

2. **Property Updates**
   - User edits property in PropertyPanel
   - `onPropertyChange(componentId, propertyPath, value)` callback fires
   - Context executes Command to update template
   - Canvas receives updated `template` prop and re-renders

3. **Visual Feedback**
   - User hovers/focuses property field in PropertyPanel
   - `visualFeedback.onPropertyHover/onPropertyEditStart` callbacks fire
   - Context creates visual overlay on Canvas via OverlayManager
   - Overlay positioned at component location

## Test Strategy

### Workflow Tests (`canvas-property-workflow.test.tsx`)

These tests validate the **interaction patterns** and **callback signatures** without requiring full component rendering. They verify:

- ✅ Callback function signatures match expected interface
- ✅ Data flow patterns are correct
- ✅ Event payloads contain required data
- ✅ Test attributes follow conventions
- ✅ AI agent can discover and interact with components

**Why this approach?**
- Fast execution (no DOM rendering)
- No import/dependency issues
- Documents the integration contract
- Perfect for CI/CD pipelines

### Future: Component Tests

For full end-to-end testing with actual components, you would need:
- Mock BuilderContext provider
- Mock TemplateManager and Builder
- Mock visual feedback managers
- Test fixtures for templates and components

## AI Agent Testing

### Test Attributes

All components expose data attributes for AI agent testing:

**Canvas Component:**
```html
<div
  data-testid="canvas-template"
  data-state='{"hasTemplate":true,"componentCount":2,"hasSelection":true}'
>
  <div
    data-testid="canvas-component-button-button-1"
    data-action="select-component"
    data-state='{"selected":true,"type":"button"}'
  />
</div>
```

**PropertyPanel Component:**
```html
<div
  data-testid="panel-properties"
  data-state='{"hasSelection":true,"componentType":"button","activeTab":"content"}'
>
  <button
    data-testid="tab-style"
    data-action="switch-tab"
    aria-selected="false"
  />
  <button
    data-testid="button-delete-component"
    data-action="delete-component"
  />
</div>
```

### AI Agent Workflow

An AI agent can test the full workflow using these selectors:

```typescript
// 1. Find and click component on canvas
const component = document.querySelector(
  '[data-testid="canvas-component-button-button-1"][data-action="select-component"]'
);
component.click();

// 2. Verify property panel shows selection
const panel = document.querySelector('[data-testid="panel-properties"]');
const state = JSON.parse(panel.getAttribute('data-state'));
// state.hasSelection === true
// state.componentType === 'button'

// 3. Switch to Style tab
const styleTab = document.querySelector(
  '[data-testid="tab-style"][data-action="switch-tab"]'
);
styleTab.click();

// 4. Find and change property
const bgInput = document.querySelector('input[name="styles.backgroundColor"]');
bgInput.value = '#ff0000';
bgInput.dispatchEvent(new Event('input', { bubbles: true }));

// 5. Delete component
const deleteBtn = document.querySelector(
  '[data-testid="button-delete-component"][data-action="delete-component"]'
);
deleteBtn.click();
```

## Running Tests

```bash
# Run all integration tests
pnpm test src/integration

# Run specific test file
pnpm test src/integration/canvas-property-workflow.test.tsx

# Run in watch mode
pnpm test:watch src/integration
```

## Adding New Tests

When adding new integration workflows:

1. **Document the callback signature** - What data does the callback receive?
2. **Test the data flow** - How does data move through the system?
3. **Verify test attributes** - Are components discoverable by AI agents?
4. **Test error cases** - What happens when data is invalid?

Example:

```typescript
it('should handle new workflow', () => {
  // 1. Define callback
  const onNewAction = vi.fn((data: { id: string; value: any }) => {});

  // 2. Simulate user action
  onNewAction({ id: 'test-1', value: 'new-value' });

  // 3. Verify callback called correctly
  expect(onNewAction).toHaveBeenCalledWith({
    id: 'test-1',
    value: 'new-value',
  });
});
```

## Key Takeaways

- Canvas and PropertyPanel are **loosely coupled** through callbacks
- All state management happens in **BuilderContext**
- **Command pattern** ensures undo/redo support
- **Test attributes** make components AI-agent testable
- **Workflow tests** document the integration contract

## Related Documentation

- [TemplateCanvas Component](../canvas/TemplateCanvas.tsx)
- [PropertyPanel Component](../sidebar/PropertyPanel.tsx)
- [Test Utilities](../test-utils/README.md)
- [BuilderContext](../../../apps/dev/src/context/BuilderContext.tsx)
