# AI Testing Guide for Email Builder

This guide explains how AI agents can effectively test the Email Builder application using the comprehensive test attributes and utilities provided.

## Table of Contents

- [Quick Start](#quick-start)
- [Test Infrastructure](#test-infrastructure)
- [Finding Elements](#finding-elements)
- [Common Workflows](#common-workflows)
- [Test Utilities](#test-utilities)
- [State Verification](#state-verification)
- [Best Practices](#best-practices)

## Quick Start

### Importing Test Utilities

```typescript
import {
  render,
  screen,
  waitFor,
  getByTestId,
  getByAction,
  getStateAttribute,
  fireEvent,
} from '../test-utils';
```

### Basic Test Structure

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render } from '../test-utils';
import { YourComponent } from './YourComponent';

describe('YourComponent', () => {
  it('should do something testable', () => {
    render(() => <YourComponent />);

    const element = document.querySelector('[data-testid="your-element"]');
    expect(element).toBeInTheDocument();
  });
});
```

## Test Infrastructure

### Test Attributes

All components in the builder support three types of test attributes:

1. **data-testid**: Unique identifier for elements
2. **data-action**: Semantic action identifier for interactive elements
3. **data-state-***: Dynamic state attributes for verification

### Enabling Test Mode

Test attributes are conditionally rendered based on test mode:

```typescript
// In tests, test mode is automatically enabled
// In production, users can enable it via:
TestMode.enable();

// Or by clicking the test mode button in the toolbar
const testModeButton = document.querySelector('[data-action="toggle-test-mode"]');
testModeButton.click();
```

## Finding Elements

### By Test ID

```typescript
// Using querySelector
const element = document.querySelector('[data-testid="button-save-template"]');

// Using helper function
import { getByTestId } from '../test-utils';
const element = getByTestId(document.body, 'button-save-template');

// Using screen from testing-library
import { screen } from '../test-utils';
const element = screen.getByTestId('button-save-template');
```

### By Action

```typescript
// Using querySelector
const saveButton = document.querySelector('[data-action="save-template"]');

// Using helper function
import { getByAction } from '../test-utils';
const saveButton = getByAction(document.body, 'save-template');
```

### By Role (Accessibility)

```typescript
import { screen } from '../test-utils';

// Find button by accessible name
const button = screen.getByRole('button', { name: /save/i });

// Find input by label
const input = screen.getByLabelText('Email Address');

// Find by placeholder
const searchInput = screen.getByPlaceholderText('Search components...');
```

## Common Workflows

### 1. Creating a New Template

```typescript
it('should create a new template', async () => {
  const handleNewTemplate = vi.fn();

  render(() => (
    <TemplateToolbar
      hasTemplate={false}
      canUndo={false}
      canRedo={false}
      onNewTemplate={handleNewTemplate}
    />
  ));

  // Find and click the new template button
  const newButton = document.querySelector('[data-action="create-template"]');
  newButton.click();

  // Verify the handler was called
  await waitFor(() => {
    expect(handleNewTemplate).toHaveBeenCalled();
  });
});
```

### 2. Adding Components to Canvas

```typescript
it('should add component from palette to canvas', () => {
  const components = [
    { id: '1', type: 'text', name: 'Text' },
    { id: '2', type: 'button', name: 'Button' },
  ];

  render(() => (
    <ComponentPalette
      components={components}
      selectedCategory="all"
      searchQuery=""
      onSelectCategory={vi.fn()}
      onSearchChange={vi.fn()}
      onDragStart={vi.fn()}
    />
  ));

  // Find the text component in the palette
  const textComponent = document.querySelector('[data-testid="component-text"]');
  expect(textComponent).toBeInTheDocument();

  // Verify drag action is available
  expect(textComponent).toHaveAttribute('data-action', 'drag-component');
});
```

### 3. Selecting and Editing Components

```typescript
it('should select and edit component', async () => {
  const handleSelectComponent = vi.fn();
  const template = {
    id: 'template-1',
    name: 'Test Template',
    components: [
      { id: 'text-1', type: 'text', content: 'Hello World' },
    ],
  };

  render(() => (
    <TemplateCanvas
      template={template}
      selectedComponentId={null}
      onSelectComponent={handleSelectComponent}
      onMoveComponent={vi.fn()}
      onDropComponent={vi.fn()}
    />
  ));

  // Find component on canvas
  const component = document.querySelector('[data-testid="canvas-component-text-text-1"]');
  expect(component).toBeInTheDocument();

  // Click to select
  component.click();

  await waitFor(() => {
    expect(handleSelectComponent).toHaveBeenCalledWith('text-1');
  });
});
```

### 4. Applying Style Presets

```typescript
it('should apply style preset to component', async () => {
  const handleApplyPreset = vi.fn();
  const selectedComponent = {
    id: 'button-1',
    type: 'button',
    text: 'Click me',
  };
  const presets = [
    { id: 'preset-1', name: 'Primary Button', componentType: 'button' },
  ];

  render(() => (
    <PropertyPanel
      selectedComponent={selectedComponent}
      activeTab="style"
      availablePresets={presets}
      selectedPreset="preset-1"
      onTabChange={vi.fn()}
      onDeleteComponent={vi.fn()}
      onApplyPreset={handleApplyPreset}
      onSavePreset={vi.fn()}
      onOpenPresetManager={vi.fn()}
    />
  ));

  // Find and click apply preset button
  const applyButton = document.querySelector('[data-action="apply-preset"]');
  applyButton.click();

  await waitFor(() => {
    expect(handleApplyPreset).toHaveBeenCalled();
  });
});
```

### 5. Saving and Exporting

```typescript
it('should save template', async () => {
  const handleSaveTemplate = vi.fn();

  render(() => (
    <TemplateToolbar
      hasTemplate={true}
      canUndo={false}
      canRedo={false}
      onSaveTemplate={handleSaveTemplate}
    />
  ));

  // Find save button
  const saveButton = document.querySelector('[data-action="save-template"]');
  expect(saveButton).not.toBeDisabled();

  // Click to save
  saveButton.click();

  await waitFor(() => {
    expect(handleSaveTemplate).toHaveBeenCalled();
  });
});
```

## Test Utilities

### State Attribute Helpers

```typescript
import { getStateAttribute, waitForStateAttribute } from '../test-utils';

// Get current state value
const componentCount = getStateAttribute(canvas, 'componentCount');
expect(componentCount).toBe('2');

// Wait for state to change
await waitForStateAttribute(canvas, 'componentCount', '3', 1000);
```

### Event Simulation

```typescript
import { fireEvent, waitFor } from '../test-utils';

// Click
fireEvent.click(button);

// Type into input
fireEvent.input(input, { target: { value: 'test value' } });

// Keyboard events
fireEvent.keyDown(element, { key: 'Enter' });

// Wait for async updates
await waitFor(() => {
  expect(element).toHaveTextContent('Updated');
});
```

### Debugging Helpers

```typescript
import { debugTestAttributes, getAllTestIds, getAllActions } from '../test-utils';

// List all test IDs in the DOM
const testIds = getAllTestIds();
console.log('Available test IDs:', testIds);

// List all actions in the DOM
const actions = getAllActions();
console.log('Available actions:', actions);

// Debug all test attributes
debugTestAttributes(); // Logs comprehensive information to console
```

## State Verification

### Toolbar States

```typescript
const toolbar = document.querySelector('[data-testid="toolbar-template"]');

// Check button states
const undoButton = document.querySelector('[data-action="undo"]');
expect(undoButton.disabled).toBe(!canUndo);

const saveButton = document.querySelector('[data-action="save-template"]');
expect(saveButton.disabled).toBe(!hasTemplate);
```

### Canvas States

```typescript
const canvas = document.querySelector('[data-testid="canvas-template"]');

// Verify template is loaded
expect(canvas).toHaveAttribute('data-state-hasTemplate', 'true');

// Verify component count
expect(canvas).toHaveAttribute('data-state-componentCount', '3');

// Verify selection state
expect(canvas).toHaveAttribute('data-state-hasSelection', 'true');

// Verify dragging state
expect(canvas).toHaveAttribute('data-state-isDraggingOver', 'false');
```

### Component States

```typescript
const component = document.querySelector('[data-testid="canvas-component-text-abc123"]');

// Verify component type
expect(component).toHaveAttribute('data-state-type', 'text');

// Verify selection state
expect(component).toHaveAttribute('data-state-selected', 'true');

// Verify dragging state
expect(component).toHaveAttribute('data-state-dragging', 'false');
```

### Property Panel States

```typescript
const panel = document.querySelector('[data-testid="panel-properties"]');

// Verify component is selected
expect(panel).toHaveAttribute('data-state-hasSelection', 'true');

// Verify component type
expect(panel).toHaveAttribute('data-state-componentType', 'button');

// Verify active tab
expect(panel).toHaveAttribute('data-state-activeTab', 'style');
```

### Component Palette States

```typescript
const palette = document.querySelector('[data-testid="panel-component-palette"]');

// Verify visible component count
expect(palette).toHaveAttribute('data-state-componentCount', '8');

// Verify active category
expect(palette).toHaveAttribute('data-state-category', 'content');

// Verify search state
expect(palette).toHaveAttribute('data-state-hasSearch', 'true');
```

## Best Practices

### 1. Use Semantic Selectors

```typescript
// Good: Use test IDs or actions
const button = document.querySelector('[data-action="save-template"]');

// Better: Use accessibility selectors when possible
const button = screen.getByRole('button', { name: /save/i });

// Avoid: CSS classes or element types
const button = document.querySelector('.toolbar__button'); // Fragile
```

### 2. Wait for Async Updates

```typescript
// Always wait for async operations
await waitFor(() => {
  expect(element).toHaveTextContent('Updated');
});

// Wait for state changes
await waitForStateAttribute(canvas, 'componentCount', '2');
```

### 3. Verify State, Not Implementation

```typescript
// Good: Check observable state
expect(canvas).toHaveAttribute('data-state-componentCount', '2');
expect(saveButton).not.toBeDisabled();

// Avoid: Checking internal implementation
// Don't rely on internal state or private methods
```

### 4. Test User-Facing Behavior

```typescript
// Good: Test what users (or AI agents) can see and do
const component = screen.getByRole('button', { name: /click me/i });
component.click();
expect(handleClick).toHaveBeenCalled();

// Avoid: Testing internal component details
// Don't test props directly, test observable behavior
```

### 5. Use Descriptive Test Names

```typescript
// Good
it('should enable save button after creating template', () => {
  // ...
});

// Avoid
it('should work', () => {
  // ...
});
```

### 6. Clean Up Between Tests

```typescript
// Tests are automatically cleaned up via vitest.setup.ts
// But for manual cleanup:
afterEach(() => {
  document.body.innerHTML = '';
});
```

## Complete Example Test Suite

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../test-utils';
import { TemplateToolbar } from './TemplateToolbar';

describe('TemplateToolbar - Complete AI Testing Example', () => {
  let props: any;

  beforeEach(() => {
    props = {
      hasTemplate: true,
      canUndo: true,
      canRedo: true,
      onNewTemplate: vi.fn(),
      onSaveTemplate: vi.fn(),
      onLoadTemplate: vi.fn(),
      onUndo: vi.fn(),
      onRedo: vi.fn(),
      onExport: vi.fn(),
      onPreview: vi.fn(),
      onCheckCompatibility: vi.fn(),
      onTestEmailClients: vi.fn(),
      onEmailTestingSettings: vi.fn(),
    };
  });

  describe('Discoverability', () => {
    it('should have all expected test attributes', () => {
      render(() => <TemplateToolbar {...props} />);

      // Verify toolbar is present
      expect(document.querySelector('[data-testid="toolbar-template"]')).toBeInTheDocument();

      // Verify all buttons are discoverable
      const expectedActions = [
        'create-template',
        'save-template',
        'open-template-picker',
        'undo',
        'redo',
        'export-html',
        'preview-template',
      ];

      expectedActions.forEach((action) => {
        expect(document.querySelector(`[data-action="${action}"]`)).toBeInTheDocument();
      });
    });
  });

  describe('Interactions', () => {
    it('should support all toolbar actions', async () => {
      render(() => <TemplateToolbar {...props} />);

      // Test new template
      document.querySelector('[data-action="create-template"]').click();
      await waitFor(() => expect(props.onNewTemplate).toHaveBeenCalled());

      // Test save
      document.querySelector('[data-action="save-template"]').click();
      await waitFor(() => expect(props.onSaveTemplate).toHaveBeenCalled());

      // Test undo
      document.querySelector('[data-action="undo"]').click();
      await waitFor(() => expect(props.onUndo).toHaveBeenCalled());

      // Test redo
      document.querySelector('[data-action="redo"]').click();
      await waitFor(() => expect(props.onRedo).toHaveBeenCalled());
    });
  });

  describe('State Management', () => {
    it('should disable buttons based on state', () => {
      const { unmount } = render(() => (
        <TemplateToolbar {...props} hasTemplate={false} canUndo={false} canRedo={false} />
      ));

      expect(document.querySelector('[data-action="save-template"]')).toBeDisabled();
      expect(document.querySelector('[data-action="undo"]')).toBeDisabled();
      expect(document.querySelector('[data-action="redo"]')).toBeDisabled();

      unmount();

      render(() => (
        <TemplateToolbar {...props} hasTemplate={true} canUndo={true} canRedo={true} />
      ));

      expect(document.querySelector('[data-action="save-template"]')).not.toBeDisabled();
      expect(document.querySelector('[data-action="undo"]')).not.toBeDisabled();
      expect(document.querySelector('[data-action="redo"]')).not.toBeDisabled();
    });
  });
});
```

## Reference: Complete Test Attribute List

See [TEST_ATTRIBUTE_CATALOG.md](../../../TEST_ATTRIBUTE_CATALOG.md) for a complete reference of all test attributes in the application.

## Additional Resources

- [TESTING_GUIDE.md](../../../TESTING_GUIDE.md) - General testing guide with Playwright/Puppeteer examples
- [AI_TESTING_STRATEGY.md](../../../AI_TESTING_STRATEGY.md) - Overall testing strategy
- [Test Utilities Source](./test-utils/index.ts) - Complete test utilities implementation
