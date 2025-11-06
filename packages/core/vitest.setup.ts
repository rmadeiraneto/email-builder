import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

global.localStorage = localStorageMock as Storage;

// Mock document if needed
if (typeof document === 'undefined') {
  const attributes: Record<string, string> = {};

  const documentMock = {
    documentElement: {
      setAttribute: (key: string, value: string) => {
        attributes[key] = value;
      },
      removeAttribute: (key: string) => {
        delete attributes[key];
      },
      hasAttribute: (key: string) => key in attributes,
      getAttribute: (key: string) => attributes[key] || null,
    },
    querySelector: vi.fn(() => null),
    querySelectorAll: vi.fn(() => []),
  };

  global.document = documentMock as any;
}
