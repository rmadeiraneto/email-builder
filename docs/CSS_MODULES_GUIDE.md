# CSS Modules Guide

## Overview

This project uses CSS Modules for styling components. CSS Modules automatically convert BEM-style class names (like `modal--open`, `button__icon`) to camelCase (like `modalOpen`, `buttonIcon`). This can lead to confusion when accessing these classes in TypeScript/JSX.

## The Problem

When you write BEM-style SCSS:

```scss
.modal {
  display: none;

  &--open {
    display: flex;
  }

  &__dialog {
    background: white;
  }
}
```

CSS Modules converts these to camelCase properties in the imported styles object:

```typescript
styles.modal       // ✓ Works
styles.modalOpen   // ✓ Works (converted from modal--open)
styles.modalDialog // ✓ Works (converted from modal__dialog)

styles['modal--open']  // ✗ undefined!
styles['modal__dialog'] // ✗ undefined!
```

## The Solution: BEM Utilities

We provide two approaches for working with BEM classes:

### Recommended: `createBEM` Factory Function (New! ⭐)

The most intuitive way to work with BEM classes is using the `createBEM` factory function:

```typescript
import { createBEM } from '../../utils';
import styles from './Modal.module.scss';

// Create a BEM helper scoped to your component
const bem = createBEM(styles, 'modal');

// Now use it throughout your component
bem()                    // → styles.modal
bem('open')              // → styles.modalOpen (modal--open)
bem.elem('dialog')       // → styles.modalDialog (modal__dialog)
bem.elem('header', 'sticky') // → styles.modalHeaderSticky (modal__header--sticky)
```

**Why use `createBEM`?**
- **Less repetition**: Define styles and block name once
- **More readable**: `bem('open')` vs `getStyleClass(styles, 'modal--open')`
- **Explicit API**: Use `bem.elem()` for elements when you want to be clear
- **Flexible**: Supports all BEM patterns with a simple, intuitive syntax

### Alternative: `getStyleClass` Utility

For one-off class access or when you prefer a functional approach:

```typescript
import { getStyleClass } from '../../utils';
import styles from './component.module.scss';

// Use BEM-style names - the utility handles the conversion
getStyleClass(styles, 'modal')          // → styles.modal
getStyleClass(styles, 'modal--open')    // → styles.modalOpen
getStyleClass(styles, 'modal__dialog')  // → styles.modalDialog
```

## Usage Examples

### Recommended: Using `createBEM`

```tsx
import { classNames, createBEM } from '../../utils';
import styles from './Modal.module.scss';

const Modal = (props) => {
  const bem = createBEM(styles, 'modal');

  return (
    <div class={classNames(
      bem(),
      props.isOpen && bem('open')
    )}>
      <div class={bem.elem('dialog')}>
        <div class={bem.elem('header')}>
          <h2 class={bem.elem('title')}>{props.title}</h2>
          <button class={bem.elem('close')}>×</button>
        </div>
        <div class={bem.elem('content')}>
          {props.children}
        </div>
      </div>
    </div>
  );
};
```

### Button Component with Variants

```tsx
import { classNames, createBEM } from '../../utils';
import styles from './Button.module.scss';

const Button = (props) => {
  const bem = createBEM(styles, 'button');

  return (
    <button class={classNames(
      bem(),
      props.variant && bem(props.variant),      // bem('primary'), bem('secondary')
      props.size && bem(props.size),            // bem('large'), bem('small')
      props.disabled && bem('disabled'),
      props.fullWidth && bem('full-width')
    )}>
      {props.icon && (
        <i class={bem.elem('icon')} />
      )}
      <span class={bem.elem('text')}>
        {props.children}
      </span>
    </button>
  );
};
```

### Alternative: With `getComponentClasses` Helper

For components with many variants, you can also use the `getComponentClasses` helper:

```tsx
import { getComponentClasses, createBEM } from '../../utils';
import styles from './Button.module.scss';

const Button = (props) => {
  const bem = createBEM(styles, 'button');

  const buttonClass = getComponentClasses(
    styles,
    'button',
    {
      [props.variant]: true,    // Automatically converts button--primary, etc.
      [props.size]: true,        // Automatically converts button--large, etc.
      disabled: props.disabled,  // Automatically converts button--disabled
    }
  );

  return (
    <button class={buttonClass}>
      {props.icon && (
        <i class={bem.elem('icon')} />
      )}
      <span class={bem.elem('text')}>
        {props.children}
      </span>
    </button>
  );
};
```

## Best Practices

### ✓ DO

```tsx
// RECOMMENDED: Use createBEM for component-scoped access
const bem = createBEM(styles, 'modal');
const className = classNames(
  bem(),
  isOpen && bem('open')
);

// Use bem.elem() for elements
const dialogClass = bem.elem('dialog');
const headerClass = bem.elem('header', 'sticky'); // with modifier

// Alternative: Use getStyleClass for one-off access
const className = getStyleClass(styles, 'modal--open');

// Use getComponentClasses for components with many variants
const className = getComponentClasses(styles, 'button', { primary: true });
```

### ✗ DON'T

```tsx
// Don't access with bracket notation and BEM names
const className = styles['modal--open']; // ✗ Will be undefined!

// Don't manually access camelCase properties
const className = styles.modalOpen; // ✗ Not maintainable

// Don't mix access patterns
const className = classNames(
  styles.modal,              // ✗ Inconsistent
  bem('open')
);

// Don't repeat styles and block name throughout component
// ✗ Bad:
getStyleClass(styles, 'modal')
getStyleClass(styles, 'modal--open')
getStyleClass(styles, 'modal__dialog')

// ✓ Good:
const bem = createBEM(styles, 'modal');
bem()
bem('open')
bem.elem('dialog')
```

## Available Utilities

### `createBEM(styles, block)` ⭐ Recommended

Creates a BEM helper function scoped to a specific block and styles object.

```typescript
const bem = createBEM(styles, 'modal');

// Base block
bem()                           // → styles.modal

// Modifiers (single argument)
bem('open')                     // → styles.modalOpen (modal--open)
bem('large')                    // → styles.modalLarge (modal--large)

// Elements (explicit with bem.elem)
bem.elem('dialog')              // → styles.modalDialog (modal__dialog)
bem.elem('header')              // → styles.modalHeader (modal__header)

// Elements with modifiers
bem.elem('dialog', 'large')     // → styles.modalDialogLarge (modal__dialog--large)
bem('dialog', 'sticky')         // → styles.modalDialogSticky (modal__dialog--sticky)

// Explicit modifier access (same as single argument)
bem.mod('open')                 // → styles.modalOpen (modal--open)
```

**API Methods:**
- `bem()` - Returns the base block class
- `bem(modifier)` - Returns block with modifier (e.g., `modal--open`)
- `bem(element, modifier)` - Returns element with modifier (e.g., `modal__dialog--large`)
- `bem.elem(element, modifier?)` - Explicitly get an element, optionally with modifier
- `bem.mod(modifier)` - Explicitly get a modifier (same as `bem(modifier)`)

### `getStyleClass(styles, className)`

Converts a BEM-style class name and retrieves it from the styles object.

```typescript
getStyleClass(styles, 'modal')          // → styles.modal
getStyleClass(styles, 'modal--open')    // → styles.modalOpen
getStyleClass(styles, 'modal__dialog')  // → styles.modalDialog
```

### `bemToCamelCase(str)`

Converts a BEM-style string to camelCase (used internally by `getStyleClass`).

```typescript
bemToCamelCase('modal--open')      // → 'modalOpen'
bemToCamelCase('button__icon--right') // → 'buttonIconRight'
```

### `getComponentClasses(styles, baseClass, modifiers, customClasses)`

Generates class names for components with variants (already uses `bemToCamelCase` internally).

```typescript
getComponentClasses(
  styles,
  'button',
  { primary: true, disabled: false },
  'custom-class'
)
// → 'button buttonPrimary custom-class'
```

## Migration Guide

When updating existing code, we recommend migrating to `createBEM`:

### Step 1: Import the utilities

```tsx
// Old
import styles from './Modal.module.scss';

// New
import { createBEM, classNames } from '../../utils';
import styles from './Modal.module.scss';
```

### Step 2: Create the BEM helper at the component level

```tsx
const Modal = (props) => {
  const bem = createBEM(styles, 'modal');
  // ... rest of component
};
```

### Step 3: Replace class name access patterns

```tsx
// Before: Direct camelCase access
<div class={styles.modalOpen} />

// After: Using bem helper
<div class={bem('open')} />

// Before: Bracket notation
<div class={styles['modal--open']} />

// After: Using bem helper
<div class={bem('open')} />

// Before: Using getStyleClass
<div class={getStyleClass(styles, 'modal__dialog')} />

// After: Using bem helper
<div class={bem.elem('dialog')} />
```

### Step 4: Combine classes with classNames utility

```tsx
// Before
<div class={classNames(
  getStyleClass(styles, 'modal'),
  isOpen && getStyleClass(styles, 'modal--open')
)}>

// After
<div class={classNames(
  bem(),
  isOpen && bem('open')
)}>
```

## Why This Approach?

1. **Consistency**: All developers use the same pattern for accessing CSS module classes
2. **Maintainability**: BEM names in JSX match the SCSS source, making it easier to find and update styles
3. **Type Safety**: The utility provides a single source of truth for class name conversion
4. **Readability**: Code is more self-documenting when you see `'modal--open'` instead of `modalOpen`
5. **Flexibility**: If Vite's CSS module configuration changes, we only need to update one utility function

## Additional Resources

- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
- [BEM Methodology](http://getbem.com/)
- [`classNames` utility documentation](../packages/ui-components/src/utils/classNames.ts)
