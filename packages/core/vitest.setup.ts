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

// Mock Web Animations API (for happy-dom)
if (typeof HTMLElement !== 'undefined' && !HTMLElement.prototype.animate) {
  HTMLElement.prototype.animate = vi.fn().mockReturnValue({
    cancel: vi.fn(),
    finish: vi.fn(),
    pause: vi.fn(),
    play: vi.fn(),
    reverse: vi.fn(),
    updatePlaybackRate: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    oncancel: null,
    onfinish: null,
    onremove: null,
    ready: Promise.resolve(),
    finished: Promise.resolve(),
    id: '',
    pending: false,
    playState: 'finished',
    playbackRate: 1,
    startTime: 0,
    currentTime: 0,
    timeline: null,
    effect: null,
  } as any);
}
