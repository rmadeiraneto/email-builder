# Email Builder Testing Guide

Practical guide for writing automated tests for the Email Builder using test attributes and the Test API.

## 🎯 Quick Start

### 1. Enable Test Mode

Before any test, enable test mode to make test attributes visible:

```javascript
// In browser console
TestMode.enable();

// In Playwright/Puppeteer
await page.click('[data-testid="button-toggle-test-mode"]');

// Or programmatically
await page.evaluate(() => window.TestMode.enable());
```

### 2. Verify Test Mode is Active

```javascript
// Check DOM for test mode marker
const hasTestMode = await page.evaluate(() => {
  return document.documentElement.getAttribute('data-test-mode') === 'true';
});

// Or use Test API
const isEnabled = await page.evaluate(() => window.TestMode.isEnabled());
```

---

## 📚 Common Test Scenarios

### Scenario 1: Create a New Template

```typescript
test('should create new template', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Enable test mode
  await page.click('[data-testid="button-toggle-test-mode"]');

  // Click new template button
  await page.click('[data-action="create-template"]');

  // Verify canvas shows template
  const canvas = page.locator('[data-testid="canvas-template"]');
  await expect(canvas).toHaveAttribute('data-state-hasTemplate', 'true');
  await expect(canvas).toHaveAttribute('data-state-componentCount', '0');
});
```

### Scenario 2: Add Components to Canvas

```typescript
test('should add components via drag and drop', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('[data-testid="button-toggle-test-mode"]');
  await page.click('[data-action="create-template"]');

  // Get components
  const canvas = page.locator('[data-testid="canvas-template"]');
  const textComponent = page.locator('[data-testid="component-text"]');

  // Drag text component to canvas
  await textComponent.dragTo(canvas);

  // Verify component was added
  await expect(canvas).toHaveAttribute('data-state-componentCount', '1');

  // Verify specific component exists
  const addedComponent = page.locator('[data-testid^="canvas-component-text-"]');
  await expect(addedComponent).toBeVisible();
});
```

### Scenario 3: Edit Component Properties

```typescript
test('should edit component content', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('[data-testid="button-toggle-test-mode"]');
  await page.click('[data-action="create-template"]');

  // Add and select a text component
  const canvas = page.locator('[data-testid="canvas-template"]');
  await page.locator('[data-testid="component-text"]').dragTo(canvas);

  const component = page.locator('[data-testid^="canvas-component-text-"]').first();
  await component.click();

  // Verify selection
  const propertyPanel = page.locator('[data-testid="panel-properties"]');
  await expect(propertyPanel).toHaveAttribute('data-state-hasSelection', 'true');

  // Should be on content tab by default
  await expect(propertyPanel).toHaveAttribute('data-state-activeTab', 'content');

  // Edit text content (this would depend on your input implementation)
  // await page.fill('[data-property="text"]', 'Hello World');
});
```

### Scenario 4: Apply Style Presets

```typescript
test('should apply style preset to component', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('[data-testid="button-toggle-test-mode"]');
  await page.click('[data-action="create-template"]');

  // Add and select a button component
  const canvas = page.locator('[data-testid="canvas-template"]');
  await page.locator('[data-testid="component-button"]').dragTo(canvas);

  const component = page.locator('[data-testid^="canvas-component-button-"]').first();
  await component.click();

  // Switch to style tab
  await page.click('[data-testid="tab-style"]');

  // Wait for presets to load
  await page.waitForSelector('[data-testid="section-presets"]');

  // Select a preset
  await page.selectOption('[data-testid="select-preset"]', { index: 1 });

  // Apply preset
  await page.click('[data-action="apply-preset"]');

  // Verify preset was applied (would check actual styles)
  await page.waitForTimeout(100); // Wait for application
});
```

### Scenario 5: Save and Load Template

```typescript
test('should save and reload template', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('[data-testid="button-toggle-test-mode"]');
  await page.click('[data-action="create-template"]');

  // Add components
  const canvas = page.locator('[data-testid="canvas-template"]');
  await page.locator('[data-testid="component-text"]').dragTo(canvas);
  await page.locator('[data-testid="component-button"]').dragTo(canvas);

  // Verify components added
  await expect(canvas).toHaveAttribute('data-state-componentCount', '2');

  // Save template
  await page.click('[data-action="save-template"]');

  // Wait for save operation (modal or notification)
  // await page.waitForSelector('[data-testid="save-modal"]');
  // await page.fill('[data-testid="input-template-name"]', 'My Template');
  // await page.click('[data-action="confirm-save"]');

  // Create new template to clear canvas
  await page.click('[data-action="create-template"]');
  await expect(canvas).toHaveAttribute('data-state-componentCount', '0');

  // Load saved template
  await page.click('[data-action="open-template-picker"]');
  // await page.click('[data-template-id="my-template"]');

  // Verify components were restored
  await expect(canvas).toHaveAttribute('data-state-componentCount', '2');
});
```

### Scenario 6: Search and Filter Components

```typescript
test('should filter components by category and search', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('[data-testid="button-toggle-test-mode"]');

  const palette = page.locator('[data-testid="panel-component-palette"]');

  // Get initial count
  const initialCount = await palette.getAttribute('data-state-componentCount');
  console.log(`Initial components: ${initialCount}`);

  // Filter by category
  await page.click('[data-testid="button-category-content"]');
  await expect(palette).toHaveAttribute('data-state-category', 'Content');

  const filteredCount = await palette.getAttribute('data-state-componentCount');
  console.log(`Filtered components: ${filteredCount}`);

  // Search for specific component
  await page.fill('[data-testid="input-component-search"]', 'button');
  await expect(palette).toHaveAttribute('data-state-hasSearch', 'true');

  // Verify button component is visible
  await expect(page.locator('[data-testid="component-button"]')).toBeVisible();

  // Clear search
  await page.fill('[data-testid="input-component-search"]', '');
  await expect(palette).toHaveAttribute('data-state-hasSearch', 'false');

  // Reset to all categories
  await page.click('[data-testid="button-category-all"]');
  await expect(palette).toHaveAttribute('data-state-category', 'all');
});
```

### Scenario 7: Undo/Redo Operations

```typescript
test('should undo and redo operations', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('[data-testid="button-toggle-test-mode"]');
  await page.click('[data-action="create-template"]');

  const canvas = page.locator('[data-testid="canvas-template"]');

  // Verify undo is initially disabled
  const undoBtn = page.locator('[data-testid="button-undo"]');
  await expect(undoBtn).toBeDisabled();

  // Add component
  await page.locator('[data-testid="component-text"]').dragTo(canvas);
  await expect(canvas).toHaveAttribute('data-state-componentCount', '1');

  // Undo should now be enabled
  await expect(undoBtn).toBeEnabled();

  // Undo the addition
  await page.click('[data-action="undo"]');
  await expect(canvas).toHaveAttribute('data-state-componentCount', '0');

  // Redo should now be enabled
  const redoBtn = page.locator('[data-testid="button-redo"]');
  await expect(redoBtn).toBeEnabled();

  // Redo the addition
  await page.click('[data-action="redo"]');
  await expect(canvas).toHaveAttribute('data-state-componentCount', '1');
});
```

### Scenario 8: Delete Component

```typescript
test('should delete selected component', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('[data-testid="button-toggle-test-mode"]');
  await page.click('[data-action="create-template"]');

  // Add two components
  const canvas = page.locator('[data-testid="canvas-template"]');
  await page.locator('[data-testid="component-text"]').dragTo(canvas);
  await page.locator('[data-testid="component-button"]').dragTo(canvas);

  await expect(canvas).toHaveAttribute('data-state-componentCount', '2');

  // Select first component
  const firstComponent = page.locator('[data-testid^="canvas-component-"]').first();
  await firstComponent.click();

  // Verify selection
  await expect(canvas).toHaveAttribute('data-state-hasSelection', 'true');
  await expect(firstComponent).toHaveAttribute('data-state-selected', 'true');

  // Delete component
  await page.click('[data-action="delete-component"]');

  // Verify deletion
  await expect(canvas).toHaveAttribute('data-state-componentCount', '1');
  await expect(canvas).toHaveAttribute('data-state-hasSelection', 'false');
});
```

---

## 🧪 Using the Test API

### Basic State Inspection

```typescript
test('should access builder state via Test API', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('[data-testid="button-toggle-test-mode"]');
  await page.click('[data-action="create-template"]');

  // Get builder state
  const state = await page.evaluate(() => {
    return window.__TEST_API__.getBuilderState();
  });

  expect(state.initialized).toBe(true);
  expect(state.template).not.toBeNull();
  expect(state.canUndo).toBe(false); // No actions yet

  // Add component
  const canvas = page.locator('[data-testid="canvas-template"]');
  await page.locator('[data-testid="component-text"]').dragTo(canvas);

  // Check state after action
  const newState = await page.evaluate(() => {
    return window.__TEST_API__.getBuilderState();
  });

  expect(newState.canUndo).toBe(true);
});
```

### Query Elements

```typescript
test('should query elements via Test API', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('[data-testid="button-toggle-test-mode"]');

  // Get all test IDs
  const testIds = await page.evaluate(() => {
    return window.__TEST_API__.getAllTestIds();
  });

  console.log('Available test IDs:', testIds);
  expect(testIds).toContain('button-save-template');
  expect(testIds).toContain('panel-component-palette');

  // Find specific element
  const hasElement = await page.evaluate(() => {
    const el = window.__TEST_API__.getTestIdElement('button-save-template');
    return el !== null;
  });

  expect(hasElement).toBe(true);
});
```

### Wait for Stable State

```typescript
test('should wait for operations to complete', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('[data-testid="button-toggle-test-mode"]');

  // Perform action
  await page.click('[data-action="create-template"]');

  // Wait for any pending operations
  await page.evaluate(() => {
    return window.__TEST_API__.waitForStable();
  });

  // Now safe to check state
  const state = await page.evaluate(() => {
    return window.__TEST_API__.getBuilderState();
  });

  expect(state.initialized).toBe(true);
});
```

---

## 🤖 AI Agent Testing (Claude with Computer Use)

### Example Prompts

**Creating a Template:**
```
1. Enable test mode by clicking the element with data-testid="button-toggle-test-mode"
2. Click the button with data-action="create-template"
3. Verify the canvas has data-state-hasTemplate="true"
```

**Adding Components:**
```
1. Find the element with data-testid="component-text"
2. Drag it to the element with data-testid="canvas-template"
3. Verify the canvas now has data-state-componentCount="1"
```

**Styling Components:**
```
1. Click on the component with data-testid starting with "canvas-component-"
2. Click the tab with data-testid="tab-style"
3. Select a preset from data-testid="select-preset"
4. Click the button with data-action="apply-preset"
```

---

## 🔍 Debugging Tests

### View All Test Attributes

```javascript
// In browser console
const elements = document.querySelectorAll('[data-testid]');
elements.forEach(el => {
  console.log(el.getAttribute('data-testid'), el);
});

// Get all actions
const actions = document.querySelectorAll('[data-action]');
actions.forEach(el => {
  console.log(el.getAttribute('data-action'), el);
});
```

### Check State Attributes

```javascript
// Find elements with specific state
const selected = document.querySelectorAll('[data-state-selected="true"]');
console.log('Selected elements:', selected);

// Check canvas state
const canvas = document.querySelector('[data-testid="canvas-template"]');
console.log('Canvas state:', {
  hasTemplate: canvas.getAttribute('data-state-hasTemplate'),
  componentCount: canvas.getAttribute('data-state-componentCount'),
  hasSelection: canvas.getAttribute('data-state-hasSelection')
});
```

### Test Mode Status

```javascript
// Check if test mode is active
console.log('Test mode active:', TestMode.isEnabled());

// Check DOM marker
console.log('DOM marker:', document.documentElement.getAttribute('data-test-mode'));

// List all test IDs
if (window.__TEST_API__) {
  console.log('Test IDs:', window.__TEST_API__.getAllTestIds());
}
```

---

## 📊 Test Coverage Checklist

Use this checklist to ensure comprehensive test coverage:

### ✅ Template Operations
- [ ] Create new template
- [ ] Save template
- [ ] Load existing template
- [ ] Export template as HTML
- [ ] Preview template

### ✅ Component Operations
- [ ] Add component to canvas
- [ ] Select component
- [ ] Edit component content
- [ ] Edit component styles
- [ ] Delete component
- [ ] Reorder components (drag to new position)

### ✅ Property Panel
- [ ] Switch between tabs (Content/Style)
- [ ] Edit text properties
- [ ] Edit color properties
- [ ] Edit spacing properties
- [ ] Apply style presets
- [ ] Save custom presets

### ✅ Component Palette
- [ ] Filter by category
- [ ] Search components
- [ ] Drag component to canvas
- [ ] View all categories

### ✅ Undo/Redo
- [ ] Undo action
- [ ] Redo action
- [ ] Multiple undo operations
- [ ] Multiple redo operations

### ✅ General Styles
- [ ] Edit canvas dimensions
- [ ] Edit canvas background
- [ ] Edit default typography
- [ ] Edit default link styles

---

## 🚀 Performance Testing

### Measuring Render Time

```typescript
test('should render template quickly', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('[data-testid="button-toggle-test-mode"]');

  const startTime = Date.now();
  await page.click('[data-action="create-template"]');

  // Wait for canvas to be ready
  await page.waitForSelector('[data-testid="canvas-template"][data-state-hasTemplate="true"]');

  const renderTime = Date.now() - startTime;
  console.log(`Template rendered in ${renderTime}ms`);
  expect(renderTime).toBeLessThan(1000); // Should render within 1 second
});
```

### Measuring Component Addition

```typescript
test('should add components efficiently', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('[data-testid="button-toggle-test-mode"]');
  await page.click('[data-action="create-template"]');

  const canvas = page.locator('[data-testid="canvas-template"]');

  // Add multiple components and measure time
  const startTime = Date.now();

  for (let i = 0; i < 10; i++) {
    await page.locator('[data-testid="component-text"]').dragTo(canvas);
  }

  await expect(canvas).toHaveAttribute('data-state-componentCount', '10');

  const totalTime = Date.now() - startTime;
  console.log(`Added 10 components in ${totalTime}ms`);
  expect(totalTime).toBeLessThan(5000); // Should complete within 5 seconds
});
```

---

## 🛠️ Troubleshooting

### Test Attributes Not Visible

**Problem:** Test attributes are not appearing in the DOM.

**Solution:**
1. Verify test mode is enabled: `TestMode.isEnabled()`
2. Check DOM for test mode marker: `document.documentElement.getAttribute('data-test-mode')`
3. Ensure you clicked the test mode toggle button
4. Clear browser cache and reload

### Test API Not Available

**Problem:** `window.__TEST_API__` is undefined.

**Solution:**
1. Test API only available in test environment (import.meta.env.MODE === 'test')
2. Or when test mode is explicitly enabled
3. Check if builder is initialized
4. Ensure proper import of TestMode and initializeTestAPI

### Element Not Found

**Problem:** Playwright/Puppeteer can't find element with test ID.

**Solution:**
1. Verify test mode is enabled
2. Check if element exists: `await page.locator('[data-testid="your-id"]').count()`
3. Wait for element to appear: `await page.waitForSelector('[data-testid="your-id"]')`
4. Check for typos in test ID
5. View all available test IDs: `window.__TEST_API__.getAllTestIds()`

---

## 📚 Additional Resources

- [Test Attribute Catalog](./TEST_ATTRIBUTE_CATALOG.md) - Complete reference of all test attributes
- [AI Testing Strategy](./AI_TESTING_STRATEGY.md) - Overall testing strategy and architecture
- [Playwright Documentation](https://playwright.dev/) - Official Playwright docs
- [Puppeteer Documentation](https://pptr.dev/) - Official Puppeteer docs

---

## 🤝 Contributing

When adding new features:

1. Add test attributes using helper functions
2. Update the Test Attribute Catalog
3. Add test examples to this guide
4. Ensure test mode can be toggled on/off
5. Verify zero production impact

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.
