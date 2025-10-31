import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  let input: Input;

  afterEach(() => {
    if (input) {
      input.destroy();
    }
  });

  describe('Initialization', () => {
    it('should create an input element with default options', () => {
      input = new Input();
      const el = input.getEl();

      expect(el).toBeInstanceOf(HTMLInputElement);
      expect(el.tagName.toLowerCase()).toBe('input');
    });

    it('should set default input type to text', () => {
      input = new Input();
      const el = input.getEl();

      expect(el.type).toBe('text');
    });

    it('should apply custom input type', () => {
      input = new Input({ type: 'email' });
      const el = input.getEl();

      expect(el.type).toBe('email');
    });

    it('should apply extended classes', () => {
      input = new Input({ extendedClasses: 'custom-class another-class' });
      const el = input.getEl();

      expect(el.classList.contains('custom-class')).toBe(true);
      expect(el.classList.contains('another-class')).toBe(true);
    });

    it('should set initial value', () => {
      input = new Input({ initialValue: 'Initial Value' });
      const el = input.getEl();

      expect(el.value).toBe('Initial Value');
    });

    it('should set placeholder', () => {
      input = new Input({ placeholder: 'Enter text...' });
      const el = input.getEl();

      expect(el.placeholder).toBe('Enter text...');
    });

    it('should set custom height via CSS custom property', () => {
      input = new Input({ height: '50px' });
      const el = input.getEl();

      expect(el.style.getPropertyValue('--input-height')).toBe('50px');
    });
  });

  describe('getValue method', () => {
    beforeEach(() => {
      input = new Input();
    });

    it('should return empty string for new input', () => {
      expect(input.getValue()).toBe('');
    });

    it('should return initial value', () => {
      input.destroy();
      input = new Input({ initialValue: 'Test Value' });

      expect(input.getValue()).toBe('Test Value');
    });

    it('should return current value after user input', () => {
      const el = input.getEl();
      el.value = 'User Input';

      expect(input.getValue()).toBe('User Input');
    });
  });

  describe('setValue method', () => {
    beforeEach(() => {
      input = new Input();
    });

    it('should set input value', () => {
      input.setValue('New Value');

      expect(input.getValue()).toBe('New Value');
    });

    it('should update value programmatically', () => {
      input.setValue('First');
      expect(input.getValue()).toBe('First');

      input.setValue('Second');
      expect(input.getValue()).toBe('Second');
    });

    it('should set empty string value', () => {
      input.setValue('Something');
      input.setValue('');

      expect(input.getValue()).toBe('');
    });
  });

  describe('setType method', () => {
    beforeEach(() => {
      input = new Input();
    });

    it('should change input type', () => {
      input.setType('password');
      const el = input.getEl();

      expect(el.type).toBe('password');
    });

    it('should change type multiple times', () => {
      const el = input.getEl();

      input.setType('email');
      expect(el.type).toBe('email');

      input.setType('number');
      expect(el.type).toBe('number');

      input.setType('text');
      expect(el.type).toBe('text');
    });
  });

  describe('Input event', () => {
    it('should fire onInput callback on keystroke', () => {
      const onInputMock = vi.fn();
      input = new Input({ onInput: onInputMock });
      const el = input.getEl();

      el.value = 'a';
      el.dispatchEvent(new Event('input', { bubbles: true }));

      expect(onInputMock).toHaveBeenCalledTimes(1);
      expect(onInputMock).toHaveBeenCalledWith(expect.any(Event), el);
    });

    it('should fire input event on every keystroke', () => {
      const callback = vi.fn();
      input = new Input();
      input.on('input', callback);
      const el = input.getEl();

      el.value = 'a';
      el.dispatchEvent(new Event('input'));

      el.value = 'ab';
      el.dispatchEvent(new Event('input'));

      el.value = 'abc';
      el.dispatchEvent(new Event('input'));

      expect(callback).toHaveBeenCalledTimes(3);
    });

    it('should pass event and input element to callback', () => {
      const callback = vi.fn();
      input = new Input();
      input.on('input', callback);
      const el = input.getEl();

      el.value = 'test';
      el.dispatchEvent(new Event('input'));

      expect(callback).toHaveBeenCalledWith(expect.any(Event), el);
    });
  });

  describe('Change event', () => {
    it('should fire onChange callback on blur with change', () => {
      const onChangeMock = vi.fn();
      input = new Input({ onChange: onChangeMock });
      const el = input.getEl();

      el.value = 'Changed';
      el.dispatchEvent(new Event('change', { bubbles: true }));

      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledWith(expect.any(Event), el);
    });

    it('should fire change event when value changes and input loses focus', () => {
      const callback = vi.fn();
      input = new Input();
      input.on('change', callback);
      const el = input.getEl();

      el.value = 'New Value';
      el.dispatchEvent(new Event('change'));

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should pass event and input element to callback', () => {
      const callback = vi.fn();
      input = new Input();
      input.on('change', callback);
      const el = input.getEl();

      el.value = 'test';
      el.dispatchEvent(new Event('change'));

      expect(callback).toHaveBeenCalledWith(expect.any(Event), el);
    });
  });

  describe('Event registration with on/off', () => {
    beforeEach(() => {
      input = new Input();
    });

    it('should register input event listener', () => {
      const callback = vi.fn();
      input.on('input', callback);
      const el = input.getEl();

      el.dispatchEvent(new Event('input'));

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should register change event listener', () => {
      const callback = vi.fn();
      input.on('change', callback);
      const el = input.getEl();

      el.dispatchEvent(new Event('change'));

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should register multiple listeners for same event', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      input.on('input', callback1);
      input.on('input', callback2);
      const el = input.getEl();

      el.dispatchEvent(new Event('input'));

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should unregister input event listener', () => {
      const callback = vi.fn();
      input.on('input', callback);
      input.off('input', callback);
      const el = input.getEl();

      el.dispatchEvent(new Event('input'));

      expect(callback).not.toHaveBeenCalled();
    });

    it('should unregister change event listener', () => {
      const callback = vi.fn();
      input.on('change', callback);
      input.off('change', callback);
      const el = input.getEl();

      el.dispatchEvent(new Event('change'));

      expect(callback).not.toHaveBeenCalled();
    });

    it('should only unregister specific callback', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      input.on('input', callback1);
      input.on('input', callback2);
      input.off('input', callback1);
      const el = input.getEl();

      el.dispatchEvent(new Event('input'));

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Public API', () => {
    beforeEach(() => {
      input = new Input();
    });

    it('should expose getEl method', () => {
      expect(typeof input.getEl).toBe('function');
      expect(input.getEl()).toBeInstanceOf(HTMLInputElement);
    });

    it('should expose getValue method', () => {
      expect(typeof input.getValue).toBe('function');
    });

    it('should expose setValue method', () => {
      expect(typeof input.setValue).toBe('function');
    });

    it('should expose setType method', () => {
      expect(typeof input.setType).toBe('function');
    });

    it('should expose on method', () => {
      expect(typeof input.on).toBe('function');
    });

    it('should expose off method', () => {
      expect(typeof input.off).toBe('function');
    });

    it('should expose destroy method', () => {
      expect(typeof input.destroy).toBe('function');
    });
  });

  describe('destroy method', () => {
    it('should remove input element from DOM', () => {
      input = new Input();
      const el = input.getEl();
      document.body.appendChild(el);

      expect(document.body.contains(el)).toBe(true);

      input.destroy();

      expect(document.body.contains(el)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null initial value', () => {
      input = new Input({ initialValue: null });
      const el = input.getEl();

      expect(el.value).toBe('');
    });

    it('should handle null placeholder', () => {
      input = new Input({ placeholder: null });
      const el = input.getEl();

      expect(el.placeholder).toBe('');
    });

    it('should handle empty string initial value', () => {
      input = new Input({ initialValue: '' });
      const el = input.getEl();

      expect(el.value).toBe('');
    });

    it('should handle empty string placeholder', () => {
      input = new Input({ placeholder: '' });
      const el = input.getEl();

      expect(el.placeholder).toBe('');
    });

    it('should handle special characters in initial value', () => {
      const specialValue = '<>&"\'';
      input = new Input({ initialValue: specialValue });

      expect(input.getValue()).toBe(specialValue);
    });

    it('should handle special characters in placeholder', () => {
      const specialPlaceholder = '<>&"\'';
      input = new Input({ placeholder: specialPlaceholder });
      const el = input.getEl();

      expect(el.placeholder).toBe(specialPlaceholder);
    });

    it('should handle multiple extended classes with extra spaces', () => {
      input = new Input({ extendedClasses: '  class1   class2  class3  ' });
      const el = input.getEl();

      expect(el.classList.contains('class1')).toBe(true);
      expect(el.classList.contains('class2')).toBe(true);
      expect(el.classList.contains('class3')).toBe(true);
    });

    it('should handle null height', () => {
      input = new Input({ height: null });
      const el = input.getEl();

      expect(el.style.getPropertyValue('--input-height')).toBe('');
    });

    it('should handle various input types', () => {
      const types = ['text', 'password', 'email', 'number', 'tel', 'url', 'search'];

      types.forEach(type => {
        input = new Input({ type });
        const el = input.getEl();

        expect(el.type).toBe(type);
        input.destroy();
      });
    });
  });
});
