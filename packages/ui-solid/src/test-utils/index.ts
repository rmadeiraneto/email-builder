/**
 * Test utilities for Solid JS components
 *
 * This file provides helper functions and utilities for testing Solid JS components
 * in a way that's friendly to AI-driven testing.
 */

import { render as solidRender } from '@solidjs/testing-library';
import { Component, JSX } from 'solid-js';
import '@testing-library/jest-dom';

/**
 * Re-export testing-library utilities for convenience
 */
export { screen, waitFor, within, fireEvent } from '@solidjs/testing-library';

/**
 * Enhanced render function with common setup
 */
export function render(
  component: () => JSX.Element,
  options?: Parameters<typeof solidRender>[1]
): ReturnType<typeof solidRender> {
  return solidRender(component, options);
}

/**
 * Helper to get element by test ID
 */
export function getByTestId(container: HTMLElement, testId: string): HTMLElement {
  const element = container.querySelector(`[data-testid="${testId}"]`);
  if (!element) {
    throw new Error(`Element with data-testid="${testId}" not found`);
  }
  return element as HTMLElement;
}

/**
 * Helper to query element by test ID (returns null if not found)
 */
export function queryByTestId(container: HTMLElement, testId: string): HTMLElement | null {
  return container.querySelector(`[data-testid="${testId}"]`) as HTMLElement | null;
}

/**
 * Helper to get all elements by test ID
 */
export function getAllByTestId(container: HTMLElement, testId: string): HTMLElement[] {
  return Array.from(container.querySelectorAll(`[data-testid="${testId}"]`)) as HTMLElement[];
}

/**
 * Helper to get element by action attribute
 */
export function getByAction(container: HTMLElement, action: string): HTMLElement {
  const element = container.querySelector(`[data-action="${action}"]`);
  if (!element) {
    throw new Error(`Element with data-action="${action}" not found`);
  }
  return element as HTMLElement;
}

/**
 * Helper to query element by action attribute (returns null if not found)
 */
export function queryByAction(container: HTMLElement, action: string): HTMLElement | null {
  return container.querySelector(`[data-action="${action}"]`) as HTMLElement | null;
}

/**
 * Helper to check state attributes
 */
export function getStateAttribute(element: HTMLElement, stateName: string): string | null {
  return element.getAttribute(`data-state-${stateName}`);
}

/**
 * Helper to verify state attribute value
 */
export function expectStateAttribute(
  element: HTMLElement,
  stateName: string,
  expectedValue: string
): void {
  const actualValue = getStateAttribute(element, stateName);
  if (actualValue !== expectedValue) {
    throw new Error(
      `Expected data-state-${stateName}="${expectedValue}" but got "${actualValue}"`
    );
  }
}

/**
 * Helper to wait for state attribute to have a specific value
 */
export async function waitForStateAttribute(
  element: HTMLElement,
  stateName: string,
  expectedValue: string,
  timeout: number = 1000
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const actualValue = getStateAttribute(element, stateName);
    if (actualValue === expectedValue) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  const actualValue = getStateAttribute(element, stateName);
  throw new Error(
    `Timeout waiting for data-state-${stateName}="${expectedValue}". Current value: "${actualValue}"`
  );
}

/**
 * Helper to get all elements with a specific state
 */
export function getAllByState(
  container: HTMLElement,
  stateName: string,
  stateValue: string
): HTMLElement[] {
  return Array.from(
    container.querySelectorAll(`[data-state-${stateName}="${stateValue}"]`)
  ) as HTMLElement[];
}

/**
 * Helper to check if element has test mode enabled
 */
export function isTestModeEnabled(container: HTMLElement = document.documentElement): boolean {
  return container.getAttribute('data-test-mode') === 'true';
}

/**
 * Helper to simulate clicking an element
 */
export async function click(element: HTMLElement): Promise<void> {
  if (element instanceof HTMLButtonElement && element.disabled) {
    throw new Error('Cannot click disabled button');
  }
  element.click();
  // Wait a tick for Solid to update
  await new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * Helper to simulate typing into an input
 */
export async function type(element: HTMLInputElement, text: string): Promise<void> {
  element.focus();
  element.value = text;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  // Wait a tick for Solid to update
  await new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * Helper to simulate clearing an input
 */
export async function clear(element: HTMLInputElement): Promise<void> {
  await type(element, '');
}

/**
 * Helper to check if element is visible
 */
export function isVisible(element: HTMLElement): boolean {
  return (
    element.offsetWidth > 0 &&
    element.offsetHeight > 0 &&
    window.getComputedStyle(element).visibility !== 'hidden' &&
    window.getComputedStyle(element).display !== 'none'
  );
}

/**
 * Helper to wait for element to be visible
 */
export async function waitForVisible(
  element: HTMLElement,
  timeout: number = 1000
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (isVisible(element)) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  throw new Error('Timeout waiting for element to be visible');
}

/**
 * Helper to wait for element to be hidden
 */
export async function waitForHidden(
  element: HTMLElement,
  timeout: number = 1000
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (!isVisible(element)) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  throw new Error('Timeout waiting for element to be hidden');
}

/**
 * Helper to simulate a key press
 */
export async function pressKey(
  element: HTMLElement,
  key: string,
  options?: Partial<KeyboardEventInit>
): Promise<void> {
  element.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, ...options })
  );
  element.dispatchEvent(
    new KeyboardEvent('keyup', { key, bubbles: true, ...options })
  );
  // Wait a tick for Solid to update
  await new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * Helper to check if element has a CSS class
 */
export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

/**
 * Helper to get computed styles
 */
export function getComputedStyles(element: HTMLElement): CSSStyleDeclaration {
  return window.getComputedStyle(element);
}

/**
 * Helper to check ARIA attributes
 */
export function getAriaAttribute(element: HTMLElement, ariaName: string): string | null {
  return element.getAttribute(`aria-${ariaName}`);
}

/**
 * Mock function helper (re-export from vitest)
 */
export { vi } from 'vitest';

/**
 * Helper to create a mock callback that can be tracked
 */
export function createMockCallback<T extends (...args: any[]) => any>(): T & {
  mock: {
    calls: any[][];
    results: any[];
  };
} {
  const calls: any[][] = [];
  const results: any[] = [];

  const fn = ((...args: any[]) => {
    calls.push(args);
    const result = undefined;
    results.push(result);
    return result;
  }) as any;

  fn.mock = { calls, results };

  return fn;
}

/**
 * Helper to wait for async updates
 */
export async function waitForUpdate(ms: number = 0): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Helper to get all test IDs in the container
 */
export function getAllTestIds(container: HTMLElement = document.body): string[] {
  const elements = container.querySelectorAll('[data-testid]');
  return Array.from(elements).map(el => el.getAttribute('data-testid')!).filter(Boolean);
}

/**
 * Helper to get all actions in the container
 */
export function getAllActions(container: HTMLElement = document.body): string[] {
  const elements = container.querySelectorAll('[data-action]');
  return Array.from(elements).map(el => el.getAttribute('data-action')!).filter(Boolean);
}

/**
 * Helper to log all test attributes for debugging
 */
export function debugTestAttributes(container: HTMLElement = document.body): void {
  console.log('=== Test IDs ===');
  console.log(getAllTestIds(container));
  console.log('=== Actions ===');
  console.log(getAllActions(container));
  console.log('=== State Attributes ===');
  const stateElements = container.querySelectorAll('[data-state-selected], [data-state-hasTemplate], [data-state-componentCount]');
  stateElements.forEach(el => {
    console.log(el, Array.from(el.attributes).filter(attr => attr.name.startsWith('data-state-')));
  });
}
