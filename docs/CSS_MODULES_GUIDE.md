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

## The Solution: `getStyleClass` Utility

We've created a standardized utility function that automatically handles the BEM-to-camelCase conversion:

```typescript
import { getStyleClass } from '../../utils';
import styles from './component.module.scss';

// Use BEM-style names - the utility handles the conversion
getStyleClass(styles, 'modal')          // → styles.modal
getStyleClass(styles, 'modal--open')    // → styles.modalOpen
getStyleClass(styles, 'modal__dialog')  // → styles.modalDialog
```

## Usage Examples

### Basic Usage

```tsx
import { classNames, getStyleClass } from '../../utils';
import styles from './Modal.module.scss';

const Modal = (props) => {
  return (
    <div class={classNames(
      getStyleClass(styles, 'modal'),
      props.isOpen && getStyleClass(styles, 'modal--open')
    )}>
      <div class={getStyleClass(styles, 'modal__dialog')}>
        {props.children}
      </div>
    </div>
  );
};
```

### With `getComponentClasses` Helper

For components with many variants, use the `getComponentClasses` helper (it already uses `bemToCamelCase` internally):

```tsx
import { getComponentClasses, getStyleClass } from '../../utils';
import styles from './Button.module.scss';

const Button = (props) => {
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
        <i class={getStyleClass(styles, 'button__icon')} />
      )}
      <span class={getStyleClass(styles, 'button__text')}>
        {props.children}
      </span>
    </button>
  );
};
```

## Best Practices

### ✓ DO

```tsx
// Use getStyleClass for all CSS module access
const className = getStyleClass(styles, 'modal--open');

// Use getComponentClasses for components with variants
const className = getComponentClasses(styles, 'button', { primary: true });

// Combine with classNames utility
const className = classNames(
  getStyleClass(styles, 'modal'),
  isOpen && getStyleClass(styles, 'modal--open')
);
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
  getStyleClass(styles, 'modal--open')
);
```

## Available Utilities

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

When updating existing code:

1. Import the utility:
   ```tsx
   import { getStyleClass } from '../../utils';
   ```

2. Replace direct style access:
   ```tsx
   // Before
   <div class={styles.modalOpen} />

   // After
   <div class={getStyleClass(styles, 'modal--open')} />
   ```

3. Replace bracket notation:
   ```tsx
   // Before
   <div class={styles['modal--open']} />

   // After
   <div class={getStyleClass(styles, 'modal--open')} />
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
