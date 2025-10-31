# UI Component Migration Plan

## Overview

This document outlines the strategy for migrating existing DataTalksUI components from `C:\Users\Work\Documents\GitHub\email-builder` to the new email-builder monorepo structure with base/adapter architecture.

## Source Components Location

**Components:** `C:\Users\Work\Documents\GitHub\email-builder\src\js\DataTalksUI`
**Styles:** `C:\Users\Work\Documents\GitHub\email-builder\src\sass\components`
**Utilities:** `C:\Users\Work\Documents\GitHub\email-builder\src\js\DataTalksUtils`

## Component Inventory

### Atoms (Basic Components)
- Button ✅
- Input ✅
- Label ✅
- InputLabel
- InputNumber
- ToggleButton

### Molecules (Composite Components)
- **Forms:**
  - Dropdown
  - RadioButtonGroup / RadioButtonGroupItem
  - LinkedInputs
  - EditableField

- **Editors:**
  - TextEditor (Lexical-based)
  - CodeEditor
  - ColorPicker / ColorPickerInput

- **Layout:**
  - Accordion
  - Tabs / TabItem
  - Modal
  - Popup
  - Alert
  - Floater
  - Tooltip / TooltipContent

### Organisms (Complex Components)
- GridSelector / GridSelectorItem
- InteractiveCard
- Section / SectionItem
- ToggleableSection
- ChoosableSection
- ExpandCollapse

## DataTalksUtils Dependencies

The components rely on DataTalksUtils which provides:

### Core Utilities
- `EventEmitter` - Simple event emitter class
- `merge` / `mergeWith` - Object merging (using lodash-es)
- `addClassesString` - Adds multiple CSS classes from string
- `setContent` - Sets innerHTML or appends elements
- `isElement` - Checks if value is HTMLElement
- `debounce` / `throttle` - Function rate limiting

### DOM Utilities
- `createElement` - Creates elements with options
- `htmlToElement` - Converts HTML strings to elements
- `getCaretElement` - Gets element at caret position
- `elementAddEvent` - Adds event listeners

### CSS Utilities
- `cssStyleObjectToString` - Converts style objects to strings
- `parseStyleString` - Parses CSS style strings
- `cssSidesToObject` / `cssCornersToObject` - CSS value parsers
- `getUnit` / `getValidUnit` / `isValidDimension` - Unit validation

### Constants
- `CssUnits`, `borderStyles`, `cssFontWeights`
- `genericFonts`, `webSafeFonts`, `windowsFonts`, `webFonts`
- `HTML_LANGUAGES` - Language codes

## Migration Strategy

### Phase 1: Setup Infrastructure ✅
- [x] Document UI Library Abstraction Strategy in CLAUDE.md
- [x] Create migration plan document
- [ ] Set up improved SASS prefix system
- [ ] Configure build system for component imports

### Phase 2: Copy & Adapt Utilities
Since we're keeping datatalks-utils, we'll:
- [ ] Set up proper import aliases in new monorepo
- [ ] Create minimal wrapper/re-exports if needed
- [ ] Ensure utilities work in new build system

### Phase 3: Migrate Priority Components

#### Round 1: Core Molecules (Week 1)
Priority components needed for email builder MVP:

1. **Modal** - For dialogs and overlays
   - Source: `_Modal.js`, `_modal.scss`
   - Dependencies: @floating-ui/dom, merge utility
   - Features: Auto-positioning, trigger-based, backdrop

2. **Dropdown** - For select menus
   - Source: `Dropdown/_dropdown.js`, `_dropdown.scss`
   - Dependencies: EventEmitter, Floater
   - Complex: Has DropdownItem, DropdownButton sub-components

3. **Tabs** - For tabbed interfaces
   - Source: `_Tabs.js`, `_TabItem.js`, `_tabs.scss`
   - Dependencies: EventEmitter
   - Features: Active state management, content switching

4. **Accordion** - For collapsible sections
   - Source: `_accordion.js`, `_accordion.scss`
   - Dependencies: EventEmitter
   - Features: Single/multiple expand, animation

#### Round 2: Form Components (Week 2)
5. **InputNumber** - Numeric input with controls
6. **LinkedInputs** - Linked/synchronized inputs
7. **RadioButtonGroup** - Radio button group
8. **EditableField** - Inline editable field

#### Round 3: Complex Components (Week 3)
9. **TextEditor** - Rich text editor (Lexical)
10. **ColorPicker** - Color selection (using Alwan)
11. **GridSelector** - Grid-based selection
12. **Tooltip** - Contextual tooltips

#### Round 4: Utility Components (Week 4)
13. **Alert** - Alert/notification messages
14. **Popup** - Popup notifications
15. **Floater** - Floating positioned elements
16. **ToggleableSection** - Collapsible sections
17. **ChoosableSection** - Selectable sections
18. **ExpandCollapse** - Expand/collapse control

### Phase 4: Refactor to Base/Adapter Pattern

For each migrated component:

1. **Extract Core Logic** (`base/ComponentName/`)
   ```typescript
   // base/Modal/ModalCore.ts
   export class ModalCore {
     // Pure TypeScript logic
     // No DOM manipulation
     // State management
     // Business logic
   }
   ```

2. **Create Vanilla Implementation** (`vanilla/Modal/`)
   ```typescript
   // vanilla/Modal/Modal.ts
   import { ModalCore } from '../../base/Modal/ModalCore';

   export class Modal {
     private core: ModalCore;
     private element: HTMLElement;
     // DOM-specific implementation
   }
   ```

3. **Create Framework Adapters** (Future)
   - `solid/Modal/Modal.tsx` - Solid JS wrapper
   - `react/Modal/Modal.tsx` - React wrapper
   - `next/Modal/Modal.tsx` - Next.js wrapper

## SASS Improvements

### Current Issues
- Verbose prefix usage: `$modalClass: '.' + $classPrefix + 'modal';`
- Repetitive class construction
- Difficult to maintain

### Improved System

#### Option 1: Mixin-Based Approach
```scss
// _config.scss
$prefix: 'eb-';

@mixin component($name) {
  .#{$prefix}#{$name} {
    @content;
  }
}

@mixin modifier($modifier) {
  &--#{$modifier} {
    @content;
  }
}

@mixin element($element) {
  &__#{$element} {
    @content;
  }
}

// Usage in _modal.scss
@use 'config' as *;

@include component('modal') {
  display: none;
  position: fixed;

  @include modifier('open') {
    display: flex;
  }

  @include element('dialog') {
    background: white;
    border-radius: 4px;
  }
}

// Outputs:
// .eb-modal { display: none; position: fixed; }
// .eb-modal--open { display: flex; }
// .eb-modal__dialog { background: white; border-radius: 4px; }
```

#### Option 2: Function-Based Approach
```scss
// _config.scss
$prefix: 'eb-';

@function cls($name) {
  @return '.#{$prefix}#{$name}';
}

// Usage in _modal.scss
@use 'config' as *;

#{cls('modal')} {
  display: none;
  position: fixed;

  &--open {
    display: flex;
  }

  &__dialog {
    background: white;
  }
}
```

#### Option 3: CSS Modules Approach (RECOMMENDED)
Since we're using CSS Modules in the new monorepo:

```scss
// modal.module.scss
@use '@email-builder/tokens/scss' as tokens;

.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: tokens.$z-index-modal;

  &--open {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__dialog {
    position: relative;
    background: tokens.$color-white;
    border-radius: tokens.$radius-md;
    box-shadow: tokens.$shadow-lg;
  }
}
```

Then in JavaScript:
```javascript
import styles from './modal.module.scss';

// Automatic prefixing via CSS Modules:
// styles.modal -> 'Modal_modal__abc123'
// styles['modal--open'] -> 'Modal_modal--open__def456'
```

**Benefits:**
- Automatic scoping (no prefix needed)
- Better tree-shaking
- Type-safe with TypeScript
- Consistent with new architecture

## Component Class Structure

To maintain consistency with DataTalksUI while preparing for abstraction:

```javascript
// Vanilla JS Component Pattern
import { EventEmitter, merge } from 'datatalks-utils';
import styles from './component.module.scss';

export class ComponentName {
  constructor(options = {}) {
    const defaults = {
      // Default options
    };

    this.options = merge(defaults, options);
    this.eventEmitter = new EventEmitter();
    this.init();
  }

  init() {
    // Create and configure element
    // Set up event listeners
    // Call lifecycle callbacks
  }

  // Public API methods
  getEl() {
    return this.element;
  }

  on(event, callback) {
    this.eventEmitter.on(event, callback);
  }

  off(event, callback) {
    this.eventEmitter.off(event, callback);
  }

  destroy() {
    // Cleanup
  }
}
```

## File Organization

### Current Structure (Keep for Reference)
```
C:\Users\Work\Documents\GitHub\email-builder\
├── src/
│   ├── js/
│   │   ├── DataTalksUI/
│   │   │   ├── _button.js
│   │   │   ├── _Modal.js
│   │   │   └── _index.js
│   │   └── DataTalksUtils/
│   │       ├── _utilFunctions.js
│   │       └── _index.js
│   └── sass/
│       └── components/
│           ├── _modal.scss
│           └── _components.scss
```

### New Monorepo Structure
```
email-builder/ (new monorepo)
├── packages/
│   ├── ui-components/
│   │   ├── src/
│   │   │   ├── atoms/           # Simple components
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   └── Label/
│   │   │   │
│   │   │   ├── molecules/       # Composite components
│   │   │   │   ├── Modal/
│   │   │   │   │   ├── Modal.ts
│   │   │   │   │   ├── modal.module.scss
│   │   │   │   │   ├── modal.types.ts
│   │   │   │   │   ├── modal.test.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── Dropdown/
│   │   │   │   ├── Tabs/
│   │   │   │   └── Accordion/
│   │   │   │
│   │   │   ├── organisms/       # Complex components
│   │   │   │   ├── TextEditor/
│   │   │   │   ├── ColorPicker/
│   │   │   │   └── GridSelector/
│   │   │   │
│   │   │   └── utils/           # Shared utilities
│   │   │       ├── dom.ts
│   │   │       ├── css.ts
│   │   │       └── events.ts
│   │   │
│   │   └── package.json
│   │
│   └── ui-solid/                # Framework adapters
│       └── src/
│           ├── Modal/
│           │   └── Modal.tsx
│           └── ...
```

## Testing Strategy

Each migrated component requires:

1. **Unit Tests** - Test component logic
2. **Integration Tests** - Test with utilities
3. **Visual Tests** (Future) - Screenshot/visual regression

```typescript
// modal.test.ts
import { describe, it, expect, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('should create modal element', () => {
    const modal = new Modal({ content: 'Test' });
    expect(modal.getEl()).toBeInstanceOf(HTMLElement);
  });

  it('should open and close', () => {
    const modal = new Modal({ content: 'Test' });
    modal.open();
    expect(modal.getEl().classList.contains('modal--open')).toBe(true);

    modal.close();
    expect(modal.getEl().classList.contains('modal--open')).toBe(false);
  });
});
```

## Migration Checklist (Per Component)

- [ ] Copy source files (JS + SCSS)
- [ ] Convert SCSS to CSS Modules format
- [ ] Update imports to use new paths
- [ ] Update class names to use CSS Modules
- [ ] Add TypeScript types
- [ ] Write comprehensive tests
- [ ] Update exports in index.ts
- [ ] Document component API
- [ ] Test in dev app
- [ ] Create usage examples

## Build System Updates

### Required Changes
1. **Add datatalks-utils alias** to Vite config
2. **Configure CSS Modules** with proper prefix
3. **Set up SASS imports** for shared variables
4. **Enable external dependencies** (lodash-es, @floating-ui/dom, etc.)

```typescript
// vite.config.ts additions
export default defineConfig({
  resolve: {
    alias: {
      'datatalks-utils': path.resolve(__dirname, '../../../src/js/DataTalksUtils/_index.js'),
      'datatalks-ui': path.resolve(__dirname, '../../../src/js/DataTalksUI/_index.js'),
    }
  },
  css: {
    modules: {
      generateScopedName: '[name]_[local]__[hash:base64:5]',
      // Use 'eb-' prefix via CSS Modules
    }
  }
});
```

## Timeline

| Phase | Duration | Components | Status |
|-------|----------|------------|--------|
| Phase 1: Infrastructure | 1 day | Setup, docs | ✅ In Progress |
| Phase 2: Utilities Setup | 1 day | Aliases, imports | ⏳ Pending |
| Phase 3: Round 1 | 1 week | Modal, Dropdown, Tabs, Accordion | ⏳ Pending |
| Phase 3: Round 2 | 1 week | Form components | ⏳ Pending |
| Phase 3: Round 3 | 1 week | Complex components | ⏳ Pending |
| Phase 3: Round 4 | 1 week | Utility components | ⏳ Pending |
| Phase 4: Refactoring | 2 weeks | Base/adapter pattern | ⏳ Pending |

## Success Criteria

- [ ] All priority components migrated and working
- [ ] 100% test coverage for migrated components
- [ ] Components work in dev app
- [ ] Build succeeds without errors
- [ ] CSS Modules properly scoped
- [ ] No breaking changes to component APIs
- [ ] Documentation complete

## Notes

- Keep original components as reference (don't delete source)
- Test each component individually before moving to next
- Maintain backward compatibility where possible
- Document any API changes
- Use design tokens for all styling values

---

**Last Updated:** 2024-10-30
**Status:** Phase 1 - Infrastructure Setup
