import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TestMode } from './TestModeManager';

describe('TestModeManager', () => {
  beforeEach(() => {
    // Reset test mode before each test
    TestMode.disable();
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after tests
    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('data-test-mode');
    }
  });

  describe('enable/disable', () => {
    it('should enable test mode', () => {
      TestMode.enable();
      expect(TestMode.isEnabled()).toBe(true);
    });

    it('should disable test mode', () => {
      TestMode.enable();
      TestMode.disable();
      expect(TestMode.isEnabled()).toBe(false);
    });

    it('should add data-test-mode attribute when enabled', () => {
      TestMode.enable();
      expect(document.documentElement.getAttribute('data-test-mode')).toBe('true');
    });

    it('should remove data-test-mode attribute when disabled', () => {
      TestMode.enable();
      TestMode.disable();
      expect(document.documentElement.hasAttribute('data-test-mode')).toBe(false);
    });

    it('should persist preference to localStorage', () => {
      TestMode.enable();
      expect(localStorage.getItem('test-mode-enabled')).toBe('true');

      TestMode.disable();
      expect(localStorage.getItem('test-mode-enabled')).toBe('false');
    });
  });

  describe('toggle', () => {
    it('should toggle test mode on', () => {
      TestMode.toggle();
      expect(TestMode.isEnabled()).toBe(true);
    });

    it('should toggle test mode off', () => {
      TestMode.enable();
      TestMode.toggle();
      expect(TestMode.isEnabled()).toBe(false);
    });
  });

  describe('onChange', () => {
    it('should notify callbacks when test mode changes', () => {
      const callback = vi.fn();
      TestMode.onChange(callback);

      TestMode.enable();
      expect(callback).toHaveBeenCalledWith(true);

      TestMode.disable();
      expect(callback).toHaveBeenCalledWith(false);
    });

    it('should allow unsubscribing', () => {
      const callback = vi.fn();
      const unsubscribe = TestMode.onChange(callback);

      unsubscribe();
      TestMode.enable();

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('loadPreference', () => {
    it('should load enabled preference from localStorage', () => {
      localStorage.setItem('test-mode-enabled', 'true');
      TestMode.loadPreference();
      expect(TestMode.isEnabled()).toBe(true);
    });

    it('should not enable if localStorage has false', () => {
      localStorage.setItem('test-mode-enabled', 'false');
      TestMode.loadPreference();
      expect(TestMode.isEnabled()).toBe(false);
    });
  });
});
