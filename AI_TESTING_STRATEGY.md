# AI Agent Testing Strategy

**Document Version**: 1.0  
**Date**: November 6, 2025  
**Status**: Planning & Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Why AI Agent Testing?](#why-ai-agent-testing)
3. [Core Strategies](#core-strategies)
4. [Implementation Approach](#implementation-approach)
5. [Test Scenarios](#test-scenarios)
6. [Best Practices](#best-practices)
7. [Example Tests](#example-tests)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This document outlines the comprehensive strategy for making the Email Builder UI testable by AI agents (like Claude with computer use) and automated testing frameworks (Playwright, Puppeteer, Selenium).

### Goals

1. **Enable AI-driven testing** - Allow AI agents to interact with the UI programmatically
2. **Quality assurance** - Catch bugs early through automated testing
3. **Regression prevention** - Ensure changes don't break existing functionality
4. **Documentation** - Tests serve as living documentation of UI behavior
5. **Zero production impact** - Test attributes only present when needed

### Key Principles

- **Semantic HTML** - Use meaningful attributes and ARIA labels
- **Predictable naming** - Consistent, pattern-based test IDs
- **State transparency** - Expose component state for validation
- **Conditional attributes** - Test mode toggle system
- **Programmatic access** - Test API for state inspection

---

## Why AI Agent Testing?

### Traditional Challenges

**Manual Testing Issues:**
- Time-consuming and error-prone
- Inconsistent across testers
- Hard to scale for large applications
- Regression testing is tedious

**Automated Testing Issues:**
- Brittle selectors (CSS classes change frequently)
- Hard to maintain test suites
- Flaky tests due to timing issues
- Difficult to test complex user flows

### AI Agent Solutions

**Benefits:**
- Natural language test descriptions
- Self-healing selectors (uses semantic attributes)
- Complex scenario testing
- Parallel test execution
- Consistent results
- Easy to update tests

**Example:**
```
Traditional: await page.click('.css-module-123__button--primary')
AI Agent: await click('[data-testid="button-primary-save"]')
```

The AI agent test is more resilient to CSS changes and easier to understand.

---

## Core Strategies

### 1. Semantic HTML & ARIA Attributes

**Always use meaningful HTML elements and ARIA attributes:**

```tsx
// ❌ Bad - Generic div with no semantic meaning
<div onClick={handleSave}>Save</div>

// ✅ Good - Semantic button with ARIA
<button
  onClick={handleSave}
  aria-label="Save template"
  type="button"
>
  Save
</button>
```

**Why it matters:**
- Screen readers can understand the UI
- AI agents can identify element purpose
- Tests are more reliable
- Accessibility improves

### 2. Standardized Test Attributes

**Use data-testid for stable element identification:**

```tsx
// Pattern: component-type-identifier
<button
  data-testid="button-primary-save"
  aria-label="Save template"
>
  Save
</button>
```

**Naming Convention:**
- Use kebab-case
- Start with component type
- Include variant/state if relevant
- Be specific and descriptive

### 3. Action Attributes

**Use data-action to describe what elements do:**

```tsx
<button
  data-testid="button-save"
  data-action="save-template"
  onClick={handleSave}
>
  Save
</button>
```

**Why it matters:**
- AI agents understand the action's purpose
- Tests are self-documenting
- Easy to find all "save" actions across the app

### 4. State Exposure

**Expose component state via data-state-* attributes:**

```tsx
<div
  data-testid="panel-properties"
  data-state-loading={loading.toString()}
  data-state-modified={modified.toString()}
  data-state-error={error ? 'true' : 'false'}
>
  {/* Panel content */}
</div>
```

**Why it matters:**
- Tests can validate component state
- AI agents can make decisions based on state
- Debugging is easier

### 5. Test Mode System

**Only add test attributes when test mode is enabled:**

```typescript
// Helper function
function getTestId(id: string) {
  return TestMode.isEnabled() ? { 'data-testid': id } : {};
}

// Usage
<button {...getTestId('button-save')}>Save</button>
```

**Why it matters:**
- Zero production overhead
- Clean HTML in production
- No performance impact
- Easy to toggle for testing

### 6. Test API for State Inspection

**Expose programmatic API for complex state inspection:**

```typescript
// Available as window.__TEST_API__ in test mode
window.__TEST_API__.getBuilderState();
window.__TEST_API__.canUndo();
window.__TEST_API__.getComponents();
```

**Why it matters:**
- Validate internal state
- Check complex conditions
- Verify data integrity
- Debug test failures

### 7. Operation Result Indicators

**Show clear success/failure feedback:**

```tsx
<div
  data-testid="operation-result"
  data-result-status="success"
  data-result-message="Template saved successfully"
  role="status"
  aria-live="polite"
>
  Template saved successfully
</div>
```

**Why it matters:**
- AI agents can verify operations succeeded
- Tests can assert on results
- User gets immediate feedback

---

## Implementation Approach

### Phase 1: Test Mode Infrastructure ⚙️

**What to build:**
1. TestModeManager - Singleton to manage test mode state
2. Test attribute helpers - Conditional attribute injection
3. Test API - Programmatic state inspection

**Time**: 3-4 hours

**See**: [NEXT_TASK.md](./NEXT_TASK.md) for detailed implementation steps

### Phase 2: Component Integration 🧩

**What to do:**
1. Add test attributes to all interactive elements
2. Use helper functions consistently
3. Expose state via data-state-* attributes
4. Add ARIA labels everywhere

**Time**: 4-6 hours

**Priority components:**
- Buttons (all variants)
- Inputs (text, number, color, etc.)
- Modals
- Panels (PropertyPanel, ComponentPalette)
- Canvas elements

### Phase 3: UI Toggle & Integration 🎛️

**What to build:**
1. Test mode toggle button in toolbar
2. BuilderContext integration
3. Operation result indicators
4. Visual feedback when test mode is active

**Time**: 2-3 hours

### Phase 4: Documentation & Testing 📚

**What to create:**
1. Test attribute catalog
2. Example test scenarios
3. Testing guide for developers
4. AI agent testing guide

**Time**: 3-4 hours

### Phase 5: Build Optimization (Optional) 🚀

**What to add:**
1. Vite plugin to strip test attributes in production
2. Bundle size verification
3. Performance benchmarks

**Time**: 1-2 hours

---

## Test Scenarios

### Scenario 1: Create and Save Template

**Description**: User creates a new template, adds a component, edits properties, and saves.

**Steps:**
1. Enable test mode
2. Click "New Template" button
3. Drag button component to canvas
4. Verify component was added (check state)
5. Edit button text property
6. Enter template name
7. Click "Save Template"
8. Verify success message appears

**Expected Result**: Template is saved successfully, success message is shown.

**AI Agent Test:**
```typescript
async function testCreateAndSaveTemplate() {
  // Enable test mode
  await click('[data-action="toggle-test-mode"]');
  await waitForStable();
  
  // Create new template
  await click('[data-action="create-template"]');
  await waitForStable();
  
  // Verify canvas is empty
  const state = window.__TEST_API__.getBuilderState();
  assert(state.componentCount === 0, "Canvas should be empty");
  
  // Add button component
  await dragAndDrop(
    '[data-testid="component-button"]',
    '[data-testid="canvas-drop-zone"]'
  );
  await waitForStable();
  
  // Verify component added
  const updatedState = window.__TEST_API__.getBuilderState();
  assert(updatedState.componentCount === 1, "Should have 1 component");
  
  // Edit button text
  await fill('[data-testid="input-text"]', 'Click Me');
  await waitForStable();
  
  // Save template
  await fill('[data-testid="input-templateName"]', 'Test Template');
  await click('[data-action="save-template"]');
  await waitForStable();
  
  // Verify success
  const result = await getAttribute(
    '[data-testid="operation-result"]',
    'data-result-status'
  );
  assert(result === 'success', "Save should succeed");
}
```

### Scenario 2: Load and Modify Template

**Description**: User loads existing template, modifies a component, and saves changes.

**Steps:**
1. Click "Load Template"
2. Select template from list
3. Verify template loaded (component count)
4. Select component
5. Change background color
6. Save changes
7. Verify success

**AI Agent Test:**
```typescript
async function testLoadAndModifyTemplate() {
  // Load template
  await click('[data-action="open-template-picker"]');
  await click('[data-testid="item-template-existing-123"]');
  await waitForStable();
  
  // Verify template loaded
  const state = window.__TEST_API__.getBuilderState();
  assert(state.componentCount > 0, "Template should have components");
  
  // Select first component
  const components = window.__TEST_API__.getComponents();
  await click(`[data-testid="canvas-component-${components[0].id}"]`);
  await waitForStable();
  
  // Change background color
  await click('[data-testid="input-backgroundColor"]');
  await fill('[data-testid="input-color-hex"]', '#FF0000');
  await waitForStable();
  
  // Save
  await click('[data-action="save-template"]');
  await waitForStable();
  
  // Verify success
  const result = await getAttribute(
    '[data-testid="operation-result"]',
    'data-result-status'
  );
  assert(result === 'success', "Save should succeed");
}
```

### Scenario 3: Undo/Redo Operations

**Description**: Perform actions, undo them, and redo them.

**Steps:**
1. Add component
2. Verify undo is available
3. Undo action
4. Verify component removed
5. Verify redo is available
6. Redo action
7. Verify component restored

**AI Agent Test:**
```typescript
async function testUndoRedo() {
  // Add component
  await dragAndDrop(
    '[data-testid="component-button"]',
    '[data-testid="canvas-drop-zone"]'
  );
  await waitForStable();
  
  // Verify undo available
  const undoButton = await getElement('[data-action="undo"]');
  const undoDisabled = await getAttribute(undoButton, 'disabled');
  assert(undoDisabled === null, "Undo should be available");
  
  // Undo
  await click('[data-action="undo"]');
  await waitForStable();
  
  // Verify component removed
  const state1 = window.__TEST_API__.getBuilderState();
  assert(state1.componentCount === 0, "Component should be removed");
  
  // Verify redo available
  const redoButton = await getElement('[data-action="redo"]');
  const redoDisabled = await getAttribute(redoButton, 'disabled');
  assert(redoDisabled === null, "Redo should be available");
  
  // Redo
  await click('[data-action="redo"]');
  await waitForStable();
  
  // Verify component restored
  const state2 = window.__TEST_API__.getBuilderState();
  assert(state2.componentCount === 1, "Component should be restored");
}
```

### Scenario 4: Apply Style Preset

**Description**: Select component and apply a style preset.

**Steps:**
1. Add component
2. Select component
3. Open preset picker
4. Select preset
5. Verify preset applied
6. Verify component styles updated

**AI Agent Test:**
```typescript
async function testApplyPreset() {
  // Add and select button
  await dragAndDrop(
    '[data-testid="component-button"]',
    '[data-testid="canvas-drop-zone"]'
  );
  await waitForStable();
  
  const components = window.__TEST_API__.getComponents();
  const buttonId = components[0].id;
  
  await click(`[data-testid="canvas-component-${buttonId}"]`);
  await waitForStable();
  
  // Open preset picker
  await click('[data-action="open-preset-picker"]');
  await waitForStable();
  
  // Apply preset
  await click('[data-testid="preset-primary-button"]');
  await click('[data-action="apply-preset"]');
  await waitForStable();
  
  // Verify preset applied
  const component = window.__TEST_API__.getComponentById(buttonId);
  assert(
    component.styles.backgroundColor === '#3b82f6',
    "Preset styles should be applied"
  );
}
```

### Scenario 5: Export Template

**Description**: Export template to HTML and verify output.

**Steps:**
1. Create template with components
2. Click "Export HTML"
3. Verify export modal opens
4. Confirm export
5. Verify HTML generated
6. Check HTML contains components

**AI Agent Test:**
```typescript
async function testExportTemplate() {
  // Create template with components
  await dragAndDrop(
    '[data-testid="component-button"]',
    '[data-testid="canvas-drop-zone"]'
  );
  await waitForStable();
  
  // Export
  await click('[data-action="export-html"]');
  await waitForStable();
  
  // Verify modal opens
  const modal = await getElement('[data-testid="modal-export"]');
  assert(modal !== null, "Export modal should open");
  
  // Confirm export
  await click('[data-action="confirm-export"]');
  await waitForStable();
  
  // Verify success (HTML copied to clipboard or downloaded)
  const result = await getAttribute(
    '[data-testid="operation-result"]',
    'data-result-status'
  );
  assert(result === 'success', "Export should succeed");
}
```

---

## Best Practices

### DO ✅

1. **Use semantic HTML elements**
   - `<button>` for buttons, not `<div onClick>`
   - `<input>` for inputs, not custom divs
   - Proper heading hierarchy (`<h1>`, `<h2>`, etc.)

2. **Add ARIA labels to ALL interactive elements**
   - `aria-label` for icon buttons
   - `aria-labelledby` for complex labels
   - `role` for custom widgets

3. **Follow naming conventions consistently**
   - Test IDs: `component-type-identifier`
   - Actions: `verb-noun`
   - States: `data-state-property`

4. **Expose component state**
   - Loading states
   - Error states
   - Modified/dirty states
   - Counts (e.g., item count)

5. **Use test mode helpers**
   - Always use `getTestId()`, `getTestAction()`, etc.
   - Never hardcode test attributes

6. **Provide operation feedback**
   - Show success/error messages
   - Use `data-result-status` attribute
   - Include meaningful error messages

7. **Wait for operations to complete**
   - Use `waitForStable()` after actions
   - Check loading states before asserting

### DON'T ❌

1. **Don't use CSS classes as selectors**
   - Classes change frequently
   - CSS Modules make classes unpredictable
   - Use `data-testid` instead

2. **Don't use XPath with deep nesting**
   - Brittle and hard to maintain
   - Breaks when HTML structure changes

3. **Don't use text content as selectors**
   - Text changes with localization
   - Not unique across the app

4. **Don't skip ARIA attributes**
   - Hurts accessibility
   - Makes AI agent testing harder

5. **Don't hardcode test attributes**
   - Always use helper functions
   - Respect test mode state

6. **Don't forget to wait for async operations**
   - Race conditions cause flaky tests
   - Always wait for stability

7. **Don't test implementation details**
   - Test user-visible behavior
   - Don't rely on internal state structure

---

## Example Tests

### Playwright Example

```typescript
import { test, expect } from '@playwright/test';

test.describe('Email Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Enable test mode
    await page.click('[data-action="toggle-test-mode"]');
    await page.waitForSelector('[data-test-mode="true"]');
  });

  test('should create and save template', async ({ page }) => {
    // Click new template
    await page.click('[data-action="create-template"]');
    
    // Verify canvas is empty
    const componentCount = await page.evaluate(() => {
      return window.__TEST_API__.getBuilderState().componentCount;
    });
    expect(componentCount).toBe(0);
    
    // Add button component
    await page.dragAndDrop(
      '[data-testid="component-button"]',
      '[data-testid="canvas-drop-zone"]'
    );
    
    // Verify component added
    const updatedCount = await page.evaluate(() => {
      return window.__TEST_API__.getBuilderState().componentCount;
    });
    expect(updatedCount).toBe(1);
    
    // Save template
    await page.fill('[data-testid="input-templateName"]', 'Test Template');
    await page.click('[data-action="save-template"]');
    
    // Verify success
    await page.waitForSelector('[data-testid="operation-result"][data-result-status="success"]');
  });

  test('should undo and redo operations', async ({ page }) => {
    // Add component
    await page.dragAndDrop(
      '[data-testid="component-button"]',
      '[data-testid="canvas-drop-zone"]'
    );
    
    // Undo
    await page.click('[data-action="undo"]');
    
    // Verify component removed
    const undoCount = await page.evaluate(() => {
      return window.__TEST_API__.getBuilderState().componentCount;
    });
    expect(undoCount).toBe(0);
    
    // Redo
    await page.click('[data-action="redo"]');
    
    // Verify component restored
    const redoCount = await page.evaluate(() => {
      return window.__TEST_API__.getBuilderState().componentCount;
    });
    expect(redoCount).toBe(1);
  });
});
```

### Puppeteer Example

```typescript
import puppeteer from 'puppeteer';

describe('Email Builder', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
    
    // Enable test mode
    await page.click('[data-action="toggle-test-mode"]');
    await page.waitForSelector('[data-test-mode="true"]');
  });

  afterAll(async () => {
    await browser.close();
  });

  test('should apply style preset', async () => {
    // Add button
    await page.evaluate(() => {
      const button = document.querySelector('[data-testid="component-button"]');
      const canvas = document.querySelector('[data-testid="canvas-drop-zone"]');
      
      // Simulate drag and drop
      const dragEvent = new DragEvent('dragstart', { bubbles: true });
      button.dispatchEvent(dragEvent);
      
      const dropEvent = new DragEvent('drop', { bubbles: true });
      canvas.dispatchEvent(dropEvent);
    });
    
    // Wait for component to be added
    await page.waitForFunction(() => {
      return window.__TEST_API__.getBuilderState().componentCount === 1;
    });
    
    // Select component
    const components = await page.evaluate(() => {
      return window.__TEST_API__.getComponents();
    });
    
    await page.click(`[data-testid="canvas-component-${components[0].id}"]`);
    
    // Apply preset
    await page.click('[data-action="open-preset-picker"]');
    await page.click('[data-testid="preset-primary-button"]');
    await page.click('[data-action="apply-preset"]');
    
    // Verify preset applied
    const styles = await page.evaluate((id) => {
      return window.__TEST_API__.getComponentById(id).styles;
    }, components[0].id);
    
    expect(styles.backgroundColor).toBe('#3b82f6');
  });
});
```

---

## Troubleshooting

### Issue: Test attributes not appearing

**Symptoms**: Elements don't have `data-testid` or `data-action` attributes.

**Solution**:
1. Check if test mode is enabled: `TestMode.isEnabled()`
2. Verify `data-test-mode="true"` attribute on `<html>` element
3. Ensure components are using helper functions
4. Check browser console for errors

### Issue: `window.__TEST_API__` is undefined

**Symptoms**: Cannot access Test API in browser console.

**Solution**:
1. Verify `import.meta.env.MODE === 'test'`
2. Check if `initializeTestAPI()` was called in Builder constructor
3. Look for "✅ Test API initialized" message in console
4. Try refreshing the page

### Issue: Flaky tests (pass sometimes, fail sometimes)

**Symptoms**: Tests fail intermittently, usually with "element not found" errors.

**Solution**:
1. Add `waitForStable()` after actions
2. Use `waitForSelector()` before clicking elements
3. Check for loading states before asserting
4. Increase timeout durations
5. Use `data-state-loading` to wait for operations to complete

### Issue: Tests break when CSS changes

**Symptoms**: Tests fail after updating styles or component classes.

**Solution**:
1. Never use CSS classes as selectors
2. Always use `data-testid` attributes
3. Use semantic selectors (`button[aria-label="Save"]`)
4. Update test attribute catalog when refactoring

### Issue: Can't find element by test ID

**Symptoms**: `getTestIdElement()` returns null.

**Solution**:
1. Verify test mode is enabled
2. Check element actually exists in DOM
3. Verify test ID spelling (check catalog)
4. Look for typos in test ID string
5. Use `getAllTestIds()` to see all available test IDs

### Issue: State assertions fail

**Symptoms**: Component state doesn't match expected value.

**Solution**:
1. Wait for operations to complete before asserting
2. Check `data-state-*` attributes on elements
3. Use Test API to inspect state
4. Add console.log to see actual state
5. Verify state update happens synchronously

---

## Conclusion

This AI Agent Testing Strategy provides a comprehensive approach to making the Email Builder UI testable by both AI agents and traditional automation tools. By following these strategies, we can:

- ✅ Enable reliable automated testing
- ✅ Catch bugs early in development
- ✅ Prevent regressions
- ✅ Improve code quality
- ✅ Maintain accessibility standards
- ✅ Keep production bundles clean

**Next Steps:**

1. Implement Phase 1 (Test Mode Infrastructure) - See [NEXT_TASK.md](./NEXT_TASK.md)
2. Integrate test attributes into all components
3. Write example tests for each major workflow
4. Document all test IDs in catalog
5. Set up CI/CD pipeline for automated testing

**Questions or Issues?**

- See [REQUIREMENTS.md §15](./REQUIREMENTS.md#15-ai-agent-testing--automation) for requirements
- See [CLAUDE.md](./. claude/CLAUDE.md) for development guidelines
- See [TODO.md](./TODO.md) for implementation tasks

Let's make Email Builder the most testable drag-and-drop builder out there! 🚀
