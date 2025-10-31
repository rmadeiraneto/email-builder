import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ToggleButton } from './ToggleButton';

describe('ToggleButton', () => {
  let toggleButton: ToggleButton;

  afterEach(() => {
    if (toggleButton) {
      toggleButton.destroy();
    }
  });

  describe('Initialization', () => {
    it('should create a toggle button element with default options', () => {
      toggleButton = new ToggleButton();
      const el = toggleButton.getEl();

      expect(el).toBeInstanceOf(HTMLElement);
      expect(el.tagName.toLowerCase()).toBe('div');
    });

    it('should start inactive by default', () => {
      toggleButton = new ToggleButton();

      expect(toggleButton.getActive()).toBe(false);
    });

    it('should start active when startActive is true', () => {
      toggleButton = new ToggleButton({ startActive: true });

      expect(toggleButton.getActive()).toBe(true);
    });

    it('should apply extended classes', () => {
      toggleButton = new ToggleButton({ extendedClasses: 'custom-class another-class' });
      const el = toggleButton.getEl();

      expect(el.classList.contains('custom-class')).toBe(true);
      expect(el.classList.contains('another-class')).toBe(true);
    });

    it('should set disabled state from options', () => {
      toggleButton = new ToggleButton({ disabled: true });

      expect(toggleButton.getDisable()).toBe(true);
    });

    it('should set data-toggled attribute on initialization', () => {
      toggleButton = new ToggleButton({ startActive: false });
      const el = toggleButton.getEl();

      expect(el.getAttribute('data-toggled')).toBe('false');
    });
  });

  describe('Active state', () => {
    beforeEach(() => {
      toggleButton = new ToggleButton();
    });

    it('should set active state', () => {
      toggleButton.setActive(true);

      expect(toggleButton.getActive()).toBe(true);
    });

    it('should set data-toggled attribute when active', () => {
      toggleButton.setActive(true);
      const el = toggleButton.getEl();

      expect(el.getAttribute('data-toggled')).toBe('true');
    });

    it('should set data-toggled attribute when inactive', () => {
      toggleButton.setActive(false);
      const el = toggleButton.getEl();

      expect(el.getAttribute('data-toggled')).toBe('false');
    });

    it('should default to true when called without argument', () => {
      toggleButton.setActive();

      expect(toggleButton.getActive()).toBe(true);
    });

    it('should update state multiple times', () => {
      toggleButton.setActive(true);
      expect(toggleButton.getActive()).toBe(true);

      toggleButton.setActive(false);
      expect(toggleButton.getActive()).toBe(false);

      toggleButton.setActive(true);
      expect(toggleButton.getActive()).toBe(true);
    });
  });

  describe('Disabled state', () => {
    beforeEach(() => {
      toggleButton = new ToggleButton();
    });

    it('should set disabled state', () => {
      toggleButton.setDisable(true);

      expect(toggleButton.getDisable()).toBe(true);
    });

    it('should set data-toggle-disabled attribute when disabled', () => {
      toggleButton.setDisable(true);
      const el = toggleButton.getEl();

      expect(el.getAttribute('data-toggle-disabled')).toBe('true');
    });

    it('should set data-toggle-disabled attribute when enabled', () => {
      toggleButton.setDisable(false);
      const el = toggleButton.getEl();

      expect(el.getAttribute('data-toggle-disabled')).toBe('false');
    });

    it('should default to true when called without argument', () => {
      toggleButton.setDisable();

      expect(toggleButton.getDisable()).toBe(true);
    });

    it('should update disabled state multiple times', () => {
      toggleButton.setDisable(true);
      expect(toggleButton.getDisable()).toBe(true);

      toggleButton.setDisable(false);
      expect(toggleButton.getDisable()).toBe(false);

      toggleButton.setDisable(true);
      expect(toggleButton.getDisable()).toBe(true);
    });
  });

  describe('Toggle functionality', () => {
    beforeEach(() => {
      toggleButton = new ToggleButton();
    });

    it('should toggle from inactive to active', () => {
      expect(toggleButton.getActive()).toBe(false);

      toggleButton.toggle();

      expect(toggleButton.getActive()).toBe(true);
    });

    it('should toggle from active to inactive', () => {
      toggleButton.setActive(true);
      expect(toggleButton.getActive()).toBe(true);

      toggleButton.toggle();

      expect(toggleButton.getActive()).toBe(false);
    });

    it('should toggle multiple times', () => {
      toggleButton.toggle();
      expect(toggleButton.getActive()).toBe(true);

      toggleButton.toggle();
      expect(toggleButton.getActive()).toBe(false);

      toggleButton.toggle();
      expect(toggleButton.getActive()).toBe(true);
    });

    it('should update data-toggled attribute when toggling', () => {
      const el = toggleButton.getEl();

      toggleButton.toggle();
      expect(el.getAttribute('data-toggled')).toBe('true');

      toggleButton.toggle();
      expect(el.getAttribute('data-toggled')).toBe('false');
    });
  });

  describe('Click interaction', () => {
    it('should toggle on click', () => {
      toggleButton = new ToggleButton();
      const el = toggleButton.getEl();

      expect(toggleButton.getActive()).toBe(false);

      el.click();

      expect(toggleButton.getActive()).toBe(true);
    });

    it('should call onChange callback on click', () => {
      const onChangeMock = vi.fn();
      toggleButton = new ToggleButton({ onChange: onChangeMock });
      const el = toggleButton.getEl();

      el.click();

      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledWith(true);
    });

    it('should pass correct active state to onChange callback', () => {
      const onChangeMock = vi.fn();
      toggleButton = new ToggleButton({ onChange: onChangeMock, startActive: false });
      const el = toggleButton.getEl();

      el.click();
      expect(onChangeMock).toHaveBeenLastCalledWith(true);

      el.click();
      expect(onChangeMock).toHaveBeenLastCalledWith(false);

      el.click();
      expect(onChangeMock).toHaveBeenLastCalledWith(true);
    });

    it('should not toggle when disabled', () => {
      toggleButton = new ToggleButton({ disabled: true });
      const el = toggleButton.getEl();

      expect(toggleButton.getActive()).toBe(false);

      el.click();

      expect(toggleButton.getActive()).toBe(false);
    });

    it('should not call onChange when disabled', () => {
      const onChangeMock = vi.fn();
      toggleButton = new ToggleButton({ disabled: true, onChange: onChangeMock });
      const el = toggleButton.getEl();

      el.click();

      expect(onChangeMock).not.toHaveBeenCalled();
    });

    it('should stop event propagation when clickStopPropagation is true', () => {
      toggleButton = new ToggleButton({ clickStopPropagation: true });
      const el = toggleButton.getEl();

      const event = new MouseEvent('click', { bubbles: true });
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');

      el.dispatchEvent(event);

      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
    });

    it('should not stop event propagation by default', () => {
      toggleButton = new ToggleButton();
      const el = toggleButton.getEl();

      const event = new MouseEvent('click', { bubbles: true });
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');

      el.dispatchEvent(event);

      expect(stopPropagationSpy).not.toHaveBeenCalled();
    });
  });

  describe('onChange callback', () => {
    it('should use correct context (this)', () => {
      let contextThis: any;
      toggleButton = new ToggleButton({
        onChange: function (this: any) {
          contextThis = this;
        }
      });
      const el = toggleButton.getEl();

      el.click();

      expect(contextThis).toBe(toggleButton);
    });

    it('should be called multiple times on multiple clicks', () => {
      const onChangeMock = vi.fn();
      toggleButton = new ToggleButton({ onChange: onChangeMock });
      const el = toggleButton.getEl();

      el.click();
      el.click();
      el.click();

      expect(onChangeMock).toHaveBeenCalledTimes(3);
    });
  });

  describe('Public API', () => {
    beforeEach(() => {
      toggleButton = new ToggleButton();
    });

    it('should expose getEl method', () => {
      expect(typeof toggleButton.getEl).toBe('function');
      expect(toggleButton.getEl()).toBeInstanceOf(HTMLElement);
    });

    it('should expose toggle method', () => {
      expect(typeof toggleButton.toggle).toBe('function');
    });

    it('should expose setActive method', () => {
      expect(typeof toggleButton.setActive).toBe('function');
    });

    it('should expose getActive method', () => {
      expect(typeof toggleButton.getActive).toBe('function');
    });

    it('should expose setDisable method', () => {
      expect(typeof toggleButton.setDisable).toBe('function');
    });

    it('should expose getDisable method', () => {
      expect(typeof toggleButton.getDisable).toBe('function');
    });

    it('should expose destroy method', () => {
      expect(typeof toggleButton.destroy).toBe('function');
    });
  });

  describe('destroy method', () => {
    it('should remove toggle button element from DOM', () => {
      toggleButton = new ToggleButton();
      const el = toggleButton.getEl();
      document.body.appendChild(el);

      expect(document.body.contains(el)).toBe(true);

      toggleButton.destroy();

      expect(document.body.contains(el)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty extended classes', () => {
      toggleButton = new ToggleButton({ extendedClasses: '' });
      const el = toggleButton.getEl();

      expect(el.className).not.toContain('undefined');
    });

    it('should handle multiple extended classes with extra spaces', () => {
      toggleButton = new ToggleButton({ extendedClasses: '  class1   class2  class3  ' });
      const el = toggleButton.getEl();

      expect(el.classList.contains('class1')).toBe(true);
      expect(el.classList.contains('class2')).toBe(true);
      expect(el.classList.contains('class3')).toBe(true);
    });

    it('should handle rapid toggle calls', () => {
      toggleButton = new ToggleButton();

      for (let i = 0; i < 100; i++) {
        toggleButton.toggle();
      }

      expect(toggleButton.getActive()).toBe(false); // Even number of toggles
    });

    it('should handle rapid click events', () => {
      const onChangeMock = vi.fn();
      toggleButton = new ToggleButton({ onChange: onChangeMock });
      const el = toggleButton.getEl();

      for (let i = 0; i < 10; i++) {
        el.click();
      }

      expect(onChangeMock).toHaveBeenCalledTimes(10);
    });

    it('should handle disabled state change during interaction', () => {
      const onChangeMock = vi.fn();
      toggleButton = new ToggleButton({ onChange: onChangeMock });
      const el = toggleButton.getEl();

      el.click();
      expect(onChangeMock).toHaveBeenCalledTimes(1);

      toggleButton.setDisable(true);
      el.click();

      expect(onChangeMock).toHaveBeenCalledTimes(1); // Should not increase
    });

    it('should maintain state when toggling disabled', () => {
      toggleButton = new ToggleButton({ startActive: true });

      expect(toggleButton.getActive()).toBe(true);

      toggleButton.setDisable(true);

      expect(toggleButton.getActive()).toBe(true); // State should not change
    });

    it('should allow programmatic state change when disabled', () => {
      toggleButton = new ToggleButton({ disabled: true });

      toggleButton.setActive(true);

      expect(toggleButton.getActive()).toBe(true);
    });
  });
});
