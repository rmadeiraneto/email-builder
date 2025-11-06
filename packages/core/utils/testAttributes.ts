import { TestMode } from '../config/TestModeManager';

/**
 * Get test ID attribute if test mode is enabled
 *
 * @param id - Unique test identifier (e.g., 'button-primary-save', 'panel-properties')
 * @returns Object with data-testid attribute or empty object
 *
 * @example
 * ```tsx
 * <button {...getTestId('button-save')}>Save</button>
 * // When test mode enabled: <button data-testid="button-save">Save</button>
 * // When test mode disabled: <button>Save</button>
 * ```
 */
export function getTestId(id: string): { 'data-testid'?: string } {
  if (!id) return {};
  return TestMode.isEnabled() ? { 'data-testid': id } : {};
}

/**
 * Get action attribute if test mode is enabled
 *
 * @param action - Action identifier (e.g., 'save-template', 'delete-component')
 * @returns Object with data-action attribute or empty object
 *
 * @example
 * ```tsx
 * <button {...getTestAction('save-template')}>Save</button>
 * // When test mode enabled: <button data-action="save-template">Save</button>
 * ```
 */
export function getTestAction(action: string): { 'data-action'?: string } {
  if (!action) return {};
  return TestMode.isEnabled() ? { 'data-action': action } : {};
}

/**
 * Get state attributes if test mode is enabled
 *
 * @param state - State object with boolean/string/number values
 * @returns Object with data-state-* attributes or empty object
 *
 * @example
 * ```tsx
 * <div {...getTestState({ loading: true, modified: false, count: 5 })}>
 *   Content
 * </div>
 * // When test mode enabled:
 * // <div data-state-loading="true" data-state-modified="false" data-state-count="5">
 * ```
 */
export function getTestState(state: Record<string, any>): Record<string, string> {
  if (!TestMode.isEnabled()) return {};

  return Object.entries(state).reduce((acc, [key, value]) => {
    acc[`data-state-${key}`] = String(value);
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Get all test attributes at once
 *
 * @param attrs - Object with testId, action, and/or state
 * @returns Combined test attributes or empty object
 *
 * @example
 * ```tsx
 * <button
 *   {...getTestAttributes({
 *     testId: 'button-save',
 *     action: 'save-template',
 *     state: { disabled: false, loading: true }
 *   })}
 * >
 *   Save
 * </button>
 * ```
 */
export function getTestAttributes(attrs: {
  testId?: string;
  action?: string;
  state?: Record<string, any>;
}): Record<string, string> {
  if (!TestMode.isEnabled()) return {};

  return {
    ...getTestId(attrs.testId || ''),
    ...getTestAction(attrs.action || ''),
    ...getTestState(attrs.state || {})
  };
}
