import type { Builder } from '../builder/Builder';

/**
 * Test API interface for programmatic state inspection
 *
 * Available as window.__TEST_API__ when test mode is active
 */
export interface TestAPI {
  /** Get complete builder state */
  getBuilderState: () => any;

  /** Get current template */
  getTemplate: () => any;

  /** Check if undo is available */
  canUndo: () => boolean;

  /** Check if redo is available */
  canRedo: () => boolean;

  /** Check if builder is initialized */
  isInitialized: () => boolean;

  /** Wait for pending operations to complete */
  waitForStable: () => Promise<void>;

  /** Query element by test ID */
  getTestIdElement: (testId: string) => HTMLElement | null;

  /** Get all test IDs in document */
  getAllTestIds: () => string[];

  /** Get component registry */
  getComponentRegistry: () => any;

  /** Get template manager */
  getTemplateManager: () => any;

  /** Get preset manager */
  getPresetManager: () => any;
}

/**
 * Initialize test API and expose on window
 * Only available when import.meta.env.MODE === 'test'
 *
 * @param builder - Builder instance to expose
 */
export function initializeTestAPI(builder: Builder): void {
  // Only expose in test mode
  if (typeof import.meta !== 'undefined' && import.meta.env?.MODE !== 'test') {
    return;
  }

  // Check if window is available
  if (typeof window === 'undefined') {
    return;
  }

  const testAPI: TestAPI = {
    getBuilderState: () => ({
      initialized: builder.isInitialized(),
      canUndo: builder.canUndo(),
      canRedo: builder.canRedo(),
      template: builder.getCurrentTemplate(),
      state: builder.getState()
    }),

    getTemplate: () => builder.getCurrentTemplate(),

    canUndo: () => builder.canUndo(),

    canRedo: () => builder.canRedo(),

    isInitialized: () => builder.isInitialized(),

    waitForStable: () => new Promise(resolve => {
      // Wait for pending operations to complete
      // This is a simple timeout, could be more sophisticated
      setTimeout(resolve, 100);
    }),

    getTestIdElement: (testId: string) => {
      return document.querySelector(`[data-testid="${testId}"]`);
    },

    getAllTestIds: () => {
      const elements = document.querySelectorAll('[data-testid]');
      return Array.from(elements)
        .map(el => el.getAttribute('data-testid'))
        .filter((id): id is string => id !== null);
    },

    getComponentRegistry: () => builder.getComponentRegistry(),

    getTemplateManager: () => builder.getTemplateManager(),

    getPresetManager: () => builder.getPresetManager()
  };

  // Expose on window
  (window as any).__TEST_API__ = testAPI;

  console.log('✅ Test API initialized - Available as window.__TEST_API__');
}

/**
 * Type declaration for global window object
 */
declare global {
  interface Window {
    __TEST_API__?: TestAPI;
  }
}
