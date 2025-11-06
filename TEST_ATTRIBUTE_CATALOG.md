# Test Attribute Catalog

Complete reference of all test attributes (data-testid and data-action) available in the Email Builder for automated testing.

## 📋 Overview

Test attributes are conditionally added to the DOM when **Test Mode** is enabled. They provide stable, semantic identifiers for automated testing tools (AI agents, Playwright, Puppeteer, etc.) without polluting production HTML.

## 🎛️ Enabling Test Mode

### Option 1: UI Toggle
Click the **Test Mode** button in the toolbar (🧪 icon)

### Option 2: Browser Console
```javascript
// Enable test mode
TestMode.enable();

// Disable test mode
TestMode.disable();

// Toggle test mode
TestMode.toggle();

// Check if enabled
TestMode.isEnabled(); // returns boolean
```

### Option 3: Programmatic (in tests)
```javascript
// Access via Test API
const api = window.__TEST_API__;
```

---

## 🧭 Component Catalog

### Toolbar (TemplateToolbar)

| Test ID | Action | Description | Location |
|---------|--------|-------------|----------|
| `toolbar-template` | - | Main toolbar container | Root |
| `button-new-template` | `create-template` | Create new template button | File group |
| `button-save-template` | `save-template` | Save template button | File group |
| `button-load-template` | `open-template-picker` | Load template button | File group |
| `button-undo` | `undo` | Undo last action | Edit group |
| `button-redo` | `redo` | Redo last undone action | Edit group |
| `button-export-template` | `export-html` | Export template as HTML | Export group |
| `button-preview-template` | `preview-template` | Preview template | Export group |
| `button-check-compatibility` | `check-compatibility` | Check email client compatibility | Testing group |
| `button-test-email-clients` | `test-email-clients` | Test in email clients | Testing group |
| `button-email-testing-settings` | `open-email-testing-settings` | Open email testing settings | Testing group |
| `button-toggle-test-mode` | `toggle-test-mode` | Toggle test mode on/off | Testing group |

**State Attributes:**
- None (toolbar is always visible)

---

### Component Palette (ComponentPalette)

| Test ID | Action | Description | Location |
|---------|--------|-------------|----------|
| `panel-component-palette` | - | Main palette container | Sidebar |
| `input-component-search` | - | Search components input | Top |
| `category-filter` | - | Category filter container | Below search |
| `button-category-all` | `filter-category` | Show all categories | Category filter |
| `button-category-{name}` | `filter-category` | Filter by specific category | Category filter |
| `list-components` | - | Component list container | Main area |
| `component-{type}` | `drag-component` | Individual component item | Component list |

**State Attributes:**
- `data-state-componentCount`: Number of visible components
- `data-state-category`: Currently selected category
- `data-state-hasSearch`: Whether search query is active

**Dynamic Categories:**
- `button-category-layout`
- `button-category-content`
- `button-category-media`
- `button-category-form`

**Component Types:**
- `component-container`
- `component-text`
- `component-button`
- `component-image`
- `component-divider`
- `component-spacer`
- `component-columns`
- `component-heading`
- `component-link`

---

### Property Panel (PropertyPanel)

| Test ID | Action | Description | Location |
|---------|--------|-------------|----------|
| `panel-properties` | - | Main properties panel | Sidebar |
| `tabs-general` | - | General settings tabs container | When no component selected |
| `tab-components` | `switch-tab` | Components tab | General tabs |
| `tab-general-styles` | `switch-tab` | General styles tab | General tabs |
| `tabs-component` | - | Component tabs container | When component selected |
| `tab-content` | `switch-tab` | Content properties tab | Component tabs |
| `tab-style` | `switch-tab` | Style properties tab | Component tabs |
| `button-delete-component` | `delete-component` | Delete selected component | Header |
| `section-presets` | - | Presets section container | Style tab |
| `select-preset` | - | Preset selector dropdown | Presets section |
| `button-apply-preset` | `apply-preset` | Apply selected preset | Presets section |
| `button-preview-preset` | `preview-preset` | Preview selected preset | Presets section |
| `button-save-preset` | `open-save-preset-modal` | Save current styles as preset | Presets section |
| `button-manage-presets` | `open-preset-manager` | Open preset manager | Presets section |

**State Attributes:**
- `data-state-hasSelection`: Whether a component is selected
- `data-state-componentType`: Type of selected component (or 'none')
- `data-state-activeTab`: Currently active tab name

---

### Template Canvas (TemplateCanvas)

| Test ID | Action | Description | Location |
|---------|--------|-------------|----------|
| `canvas-template` | - | Main canvas container | Center area |
| `container-template` | - | Template content container | Inside canvas |
| `canvas-component-{type}-{id}` | `select-component` | Individual component on canvas | Canvas |

**State Attributes:**
- `data-state-hasTemplate`: Whether a template is loaded
- `data-state-componentCount`: Number of components in template
- `data-state-isDraggingOver`: Whether dragging over canvas
- `data-state-hasSelection`: Whether a component is selected

**Component State Attributes:**
- `data-state-selected`: Whether this component is selected
- `data-state-dragging`: Whether this component is being dragged
- `data-state-type`: Component type

**Example Component IDs:**
- `canvas-component-text-abc123`
- `canvas-component-button-def456`
- `canvas-component-image-ghi789`

---

## 🎯 Action Reference

Complete list of all `data-action` values:

| Action | Description | Triggered By |
|--------|-------------|--------------|
| `create-template` | Create a new template | New button |
| `save-template` | Save current template | Save button |
| `open-template-picker` | Open template picker modal | Load button |
| `undo` | Undo last action | Undo button |
| `redo` | Redo last undone action | Redo button |
| `export-html` | Export template as HTML | Export button |
| `preview-template` | Preview template in new window | Preview button |
| `check-compatibility` | Check email client compatibility | Check button |
| `test-email-clients` | Test in email clients | Test button |
| `open-email-testing-settings` | Open email testing settings modal | Settings button |
| `toggle-test-mode` | Enable/disable test mode | Test Mode button |
| `filter-category` | Filter components by category | Category buttons |
| `drag-component` | Drag component to canvas | Component palette item |
| `switch-tab` | Switch between tabs | Tab buttons |
| `delete-component` | Delete selected component | Delete button |
| `select-component` | Select component on canvas | Canvas component |
| `apply-preset` | Apply style preset to component | Apply button |
| `preview-preset` | Preview preset before applying | Preview button |
| `open-save-preset-modal` | Open modal to save preset | Save Preset button |
| `open-preset-manager` | Open preset management modal | Manage button |

---

## 🔍 Usage Examples

### Playwright

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000');
  // Enable test mode
  await page.click('[data-testid="button-toggle-test-mode"]');
});

test('should create and save template', async ({ page }) => {
  // Create new template
  await page.click('[data-action="create-template"]');

  // Verify canvas is ready
  const canvas = page.locator('[data-testid="canvas-template"]');
  await expect(canvas).toHaveAttribute('data-state-hasTemplate', 'true');

  // Drag text component to canvas
  await page.locator('[data-testid="component-text"]').dragTo(canvas);

  // Verify component was added
  await expect(canvas).toHaveAttribute('data-state-componentCount', '1');

  // Save template
  await page.click('[data-action="save-template"]');
});

test('should select and style component', async ({ page }) => {
  // Select a component
  await page.click('[data-testid^="canvas-component-text-"]');

  // Verify selection in property panel
  const panel = page.locator('[data-testid="panel-properties"]');
  await expect(panel).toHaveAttribute('data-state-hasSelection', 'true');

  // Switch to style tab
  await page.click('[data-testid="tab-style"]');

  // Apply preset
  await page.selectOption('[data-testid="select-preset"]', { index: 1 });
  await page.click('[data-action="apply-preset"]');
});

test('should filter components', async ({ page }) => {
  // Filter by category
  await page.click('[data-testid="button-category-content"]');

  // Verify filter state
  const palette = page.locator('[data-testid="panel-component-palette"]');
  await expect(palette).toHaveAttribute('data-state-category', 'Content');

  // Search for component
  await page.fill('[data-testid="input-component-search"]', 'button');
  await expect(palette).toHaveAttribute('data-state-hasSearch', 'true');
});
```

### Puppeteer

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  // Enable test mode
  await page.click('[data-testid="button-toggle-test-mode"]');

  // Wait for component palette to load
  await page.waitForSelector('[data-testid="panel-component-palette"]');

  // Get component count
  const count = await page.$eval(
    '[data-testid="panel-component-palette"]',
    el => el.getAttribute('data-state-componentCount')
  );
  console.log(`Found ${count} components`);

  // Click first component
  await page.click('[data-testid^="component-"]');

  await browser.close();
})();
```

### Claude with Computer Use

```
Enable test mode by clicking the button with data-testid="button-toggle-test-mode"

Then:
1. Click the button with data-action="create-template" to create a new template
2. Find the component with data-testid="component-text" and drag it to the canvas
3. Click the component on the canvas (it will have data-testid starting with "canvas-component-text-")
4. Verify the property panel shows data-state-hasSelection="true"
5. Click the button with data-action="save-template"
```

### Selenium

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
driver.get('http://localhost:3000')

# Enable test mode
toggle_btn = driver.find_element(By.CSS_SELECTOR, '[data-testid="button-toggle-test-mode"]')
toggle_btn.click()

# Create new template
create_btn = driver.find_element(By.CSS_SELECTOR, '[data-action="create-template"]')
create_btn.click()

# Wait for canvas to be ready
canvas = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="canvas-template"]'))
)

# Check canvas state
has_template = canvas.get_attribute('data-state-hasTemplate')
assert has_template == 'true', 'Template should be loaded'

driver.quit()
```

---

## 🧪 Test API Reference

When test mode is active, `window.__TEST_API__` provides programmatic access:

```typescript
interface TestAPI {
  // Get complete builder state
  getBuilderState(): {
    initialized: boolean;
    canUndo: boolean;
    canRedo: boolean;
    template: Template | null;
    state: Record<string, unknown>;
  };

  // Get current template
  getTemplate(): Template | null;

  // Check undo/redo availability
  canUndo(): boolean;
  canRedo(): boolean;

  // Check if builder is initialized
  isInitialized(): boolean;

  // Wait for pending operations
  waitForStable(): Promise<void>;

  // Query element by test ID
  getTestIdElement(testId: string): HTMLElement | null;

  // Get all test IDs in document
  getAllTestIds(): string[];

  // Get builder components
  getComponentRegistry(): ComponentRegistry;
  getTemplateManager(): TemplateManager;
  getPresetManager(): PresetManager;
}
```

### Usage Examples

```javascript
// Get current state
const state = window.__TEST_API__.getBuilderState();
console.log('Can undo:', state.canUndo);
console.log('Component count:', state.template?.components?.length);

// Find elements
const saveBtn = window.__TEST_API__.getTestIdElement('button-save-template');
if (saveBtn) {
  saveBtn.click();
}

// List all test IDs
const allIds = window.__TEST_API__.getAllTestIds();
console.log('Available test IDs:', allIds);

// Wait for operations to complete
await window.__TEST_API__.waitForStable();
```

---

## 📝 Naming Conventions

### Test IDs
- **Format:** `{category}-{component}-{descriptor}`
- **Examples:**
  - `button-save-template` (button to save template)
  - `panel-component-palette` (component palette panel)
  - `canvas-component-text-abc123` (text component on canvas)
- **Rules:**
  - Use kebab-case
  - Be descriptive but concise
  - Include component ID when unique instance

### Actions
- **Format:** `{verb}-{object}`
- **Examples:**
  - `create-template`
  - `apply-preset`
  - `toggle-test-mode`
- **Rules:**
  - Use kebab-case
  - Start with action verb
  - Describe what happens

### State Attributes
- **Format:** `data-state-{property}`
- **Examples:**
  - `data-state-hasSelection`
  - `data-state-componentCount`
  - `data-state-selected`
- **Rules:**
  - Use camelCase for property name
  - Boolean values: "true" or "false"
  - Numeric values: stringified numbers
  - String values: actual string

---

## 🚀 Best Practices

### For Test Writers

1. **Always enable test mode first**
   ```javascript
   await page.click('[data-testid="button-toggle-test-mode"]');
   ```

2. **Use data-action for user actions**
   ```javascript
   // Good: Describes what the action does
   await page.click('[data-action="save-template"]');

   // Avoid: Using class names or text content
   await page.click('.save-button');
   ```

3. **Use data-testid for elements**
   ```javascript
   // Good: Stable identifier
   const panel = page.locator('[data-testid="panel-properties"]');

   // Avoid: Position-dependent selectors
   const panel = page.locator('.sidebar > div:nth-child(2)');
   ```

4. **Check state attributes for assertions**
   ```javascript
   await expect(canvas).toHaveAttribute('data-state-componentCount', '3');
   ```

5. **Use Test API for complex queries**
   ```javascript
   const state = await page.evaluate(() => window.__TEST_API__.getBuilderState());
   expect(state.canUndo).toBe(true);
   ```

### For Developers

1. **Always use helper functions**
   ```tsx
   // Good
   <button {...getTestId('button-save')} {...getTestAction('save')}>

   // Avoid
   <button data-testid="button-save" data-action="save">
   ```

2. **Add state attributes to containers**
   ```tsx
   <div {...getTestState({ count: items.length, loading })}>
   ```

3. **Keep test IDs unique per instance**
   ```tsx
   {...getTestId(`component-${type}-${id}`)}
   ```

4. **Document new test attributes**
   - Add to this catalog
   - Update test examples
   - Add to type definitions

---

## 📊 Coverage Report

| Component | Test IDs | Actions | State Attrs | Status |
|-----------|----------|---------|-------------|--------|
| TemplateToolbar | 12 | 11 | 0 | ✅ Complete |
| ComponentPalette | 6 + dynamic | 2 | 3 | ✅ Complete |
| PropertyPanel | 14 | 7 | 3 | ✅ Complete |
| TemplateCanvas | 3 + dynamic | 1 | 7 | ✅ Complete |
| Modals | 0 | 0 | 0 | ⏳ Pending |
| **Total** | **35+** | **21** | **13** | **🚧 80% Complete** |

---

## 🔄 Updates

This catalog is automatically updated when new test attributes are added. Last updated: Phase 2 completion.

For questions or additions, see the [AI Testing Strategy](./AI_TESTING_STRATEGY.md) document.
