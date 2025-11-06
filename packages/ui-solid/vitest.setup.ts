/**
 * Vitest setup file for ui-solid
 *
 * This file runs before all tests and sets up the testing environment.
 */

import '@testing-library/jest-dom';

// Configure testing environment
// Solid JS testing library is configured via vitest.config.ts

// Add custom matchers and global test setup
beforeEach(() => {
  // Clear any previous DOM state
  document.body.innerHTML = '';
  document.documentElement.removeAttribute('data-test-mode');
});

afterEach(() => {
  // Cleanup after each test
  document.body.innerHTML = '';
  document.documentElement.removeAttribute('data-test-mode');
});
