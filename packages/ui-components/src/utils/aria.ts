/**
 * ARIA attribute helper utilities
 */

/**
 * Sets or removes an ARIA attribute on an element
 *
 * @param element - HTML element to modify
 * @param attribute - ARIA attribute name (without 'aria-' prefix)
 * @param value - Value to set, or null/undefined to remove
 *
 * @example
 * setAriaAttribute(button, 'disabled', true)
 * setAriaAttribute(input, 'invalid', null) // removes attribute
 */
export function setAriaAttribute(
  element: HTMLElement,
  attribute: string,
  value: string | boolean | null | undefined
): void {
  const ariaAttr = `aria-${attribute}`;

  if (value === null || value === undefined || value === false) {
    element.removeAttribute(ariaAttr);
  } else if (value === true) {
    element.setAttribute(ariaAttr, 'true');
  } else {
    element.setAttribute(ariaAttr, String(value));
  }
}

/**
 * Gets ARIA props object for SolidJS components
 * Filters out undefined/null values
 *
 * @param props - Object with ARIA-related props
 * @returns Object with aria-* attributes
 *
 * @example
 * const ariaProps = getAriaProps({
 *   ariaLabel: 'Close',
 *   ariaDisabled: true,
 *   ariaInvalid: undefined
 * })
 * // Returns: { 'aria-label': 'Close', 'aria-disabled': 'true' }
 */
export function getAriaProps(props: Record<string, any>): Record<string, string> {
  const ariaProps: Record<string, string> = {};

  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('aria') && value !== null && value !== undefined) {
      // Convert camelCase to kebab-case
      const ariaKey = key
        .replace('aria', 'aria-')
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace('aria--', 'aria-');

      ariaProps[ariaKey] = String(value);
    }
  });

  return ariaProps;
}

/**
 * Creates an ARIA attributes object for validation states
 *
 * @param validationState - Validation state
 * @param required - Whether field is required
 * @param describedBy - ID of element describing the field
 * @returns Object with appropriate ARIA attributes
 */
export function getValidationAriaProps(
  validationState?: 'default' | 'error' | 'success' | 'warning',
  required?: boolean,
  describedBy?: string
): Record<string, string> {
  const props: Record<string, string> = {};

  if (validationState === 'error') {
    props['aria-invalid'] = 'true';
  }

  if (required) {
    props['aria-required'] = 'true';
  }

  if (describedBy) {
    props['aria-describedby'] = describedBy;
  }

  return props;
}
