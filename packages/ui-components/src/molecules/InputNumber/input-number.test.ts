/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InputNumber } from './InputNumber';
import type { InputNumberConfig } from './input-number.types';

describe('InputNumber', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      const inputNumber = new InputNumber();
      container.appendChild(inputNumber.getElement());

      const element = inputNumber.getElement();
      expect(element).toBeInstanceOf(HTMLDivElement);
      expect(element.querySelector('input')).toBeTruthy();
    });

    it('should render with default value', () => {
      const inputNumber = new InputNumber({ defaultValue: 10 });
      expect(inputNumber.getValue()).toBe(10);
      expect(inputNumber.getInputValue()).toBe('10px');
    });

    it('should render with custom unit', () => {
      const inputNumber = new InputNumber({
        defaultValue: 50,
        unit: '%',
      });

      expect(inputNumber.getValue()).toBe(50);
      expect(inputNumber.getUnit()).toBe('%');
      expect(inputNumber.getInputValue()).toBe('50%');
    });

    it('should apply custom classes to root element', () => {
      const inputNumber = new InputNumber({
        class: 'custom-class another-class',
      });

      const element = inputNumber.getElement();
      expect(element.className).toContain('custom-class');
      expect(element.className).toContain('another-class');
    });

    it('should apply custom classes to input', () => {
      const inputNumber = new InputNumber({
        inputClass: 'custom-input-class',
      });

      const input = inputNumber.getInput();
      expect(input.className).toContain('custom-input-class');
    });

    it('should render up and down arrows', () => {
      const inputNumber = new InputNumber();
      container.appendChild(inputNumber.getElement());

      const element = inputNumber.getElement();
      const divs = element.querySelectorAll('div');

      expect(divs.length).toBeGreaterThanOrEqual(2);
    });

    it('should render with custom arrow content', () => {
      const upElement = document.createElement('span');
      upElement.textContent = '↑';
      const downElement = document.createElement('span');
      downElement.textContent = '↓';

      const inputNumber = new InputNumber({
        arrowUp: upElement,
        arrowDown: downElement,
      });

      container.appendChild(inputNumber.getElement());
      const element = inputNumber.getElement();

      expect(element.textContent).toContain('↑');
      expect(element.textContent).toContain('↓');
    });
  });

  describe('Value Handling', () => {
    it('should get numeric value', () => {
      const inputNumber = new InputNumber({ defaultValue: 25 });
      expect(inputNumber.getValue()).toBe(25);
    });

    it('should get unit', () => {
      const inputNumber = new InputNumber({ defaultValue: 16, unit: 'rem' });
      expect(inputNumber.getUnit()).toBe('rem');
    });

    it('should get full input value', () => {
      const inputNumber = new InputNumber({ defaultValue: 100, unit: '%' });
      expect(inputNumber.getInputValue()).toBe('100%');
    });

    it('should update value programmatically', () => {
      const inputNumber = new InputNumber({ defaultValue: 10 });

      inputNumber.update(20);
      expect(inputNumber.getValue()).toBe(20);
      expect(inputNumber.getInputValue()).toBe('20px');
    });

    it('should handle string value in update', () => {
      const inputNumber = new InputNumber({ defaultValue: 10 });

      inputNumber.update('30px');
      expect(inputNumber.getValue()).toBe(30);
    });

    it('should handle decimal values', () => {
      const inputNumber = new InputNumber({ defaultValue: 1.5 });
      expect(inputNumber.getValue()).toBe(1.5);
      expect(inputNumber.getInputValue()).toBe('1.5px');
    });

    it('should handle negative values', () => {
      const inputNumber = new InputNumber({ defaultValue: -10 });
      expect(inputNumber.getValue()).toBe(-10);
    });
  });

  describe('Unit Handling', () => {
    it('should use default unit (px)', () => {
      const inputNumber = new InputNumber({ defaultValue: 10 });
      expect(inputNumber.getUnit()).toBe('px');
    });

    it('should support changeableUnit', () => {
      const inputNumber = new InputNumber({
        defaultValue: 10,
        changeableUnit: true,
      });

      const input = inputNumber.getInput();
      input.value = '50rem';
      input.dispatchEvent(new Event('change'));

      expect(inputNumber.getValue()).toBe(50);
      expect(inputNumber.getUnit()).toBe('rem');
    });

    it('should validate units when changeableUnit is enabled', () => {
      const inputNumber = new InputNumber({
        defaultValue: 10,
        unit: 'px',
        changeableUnit: true,
        availableUnits: ['px', 'rem', '%'],
      });

      const input = inputNumber.getInput();
      input.value = '50rem';
      input.dispatchEvent(new Event('change'));

      expect(inputNumber.getUnit()).toBe('rem');

      input.value = '30invalid';
      input.dispatchEvent(new Event('change'));

      // Should keep previous valid unit
      expect(inputNumber.getUnit()).toBe('rem');
    });

    it('should not change unit when changeableUnit is false', () => {
      const inputNumber = new InputNumber({
        defaultValue: 10,
        unit: 'px',
        changeableUnit: false,
      });

      const input = inputNumber.getInput();
      input.value = '50rem';
      input.dispatchEvent(new Event('change'));

      expect(inputNumber.getValue()).toBe(50);
      expect(inputNumber.getUnit()).toBe('px'); // Should remain px
    });
  });

  describe('Increment/Decrement', () => {
    it('should increment by default step (1)', () => {
      const inputNumber = new InputNumber({ defaultValue: 10 });
      container.appendChild(inputNumber.getElement());

      const upArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-up-arrow"]') as HTMLElement;
      upArrow.click();

      expect(inputNumber.getValue()).toBe(11);
    });

    it('should decrement by default step (1)', () => {
      const inputNumber = new InputNumber({ defaultValue: 10 });
      container.appendChild(inputNumber.getElement());

      const downArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-down-arrow"]') as HTMLElement;
      downArrow.click();

      expect(inputNumber.getValue()).toBe(9);
    });

    it('should increment by custom step', () => {
      const inputNumber = new InputNumber({
        defaultValue: 10,
        increment: 5,
      });
      container.appendChild(inputNumber.getElement());

      const upArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-up-arrow"]') as HTMLElement;
      upArrow.click();

      expect(inputNumber.getValue()).toBe(15);
    });

    it('should decrement by custom step', () => {
      const inputNumber = new InputNumber({
        defaultValue: 10,
        increment: 5,
      });
      container.appendChild(inputNumber.getElement());

      const downArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-down-arrow"]') as HTMLElement;
      downArrow.click();

      expect(inputNumber.getValue()).toBe(5);
    });

    it('should increment with decimal step', () => {
      const inputNumber = new InputNumber({
        defaultValue: 1.0,
        increment: 0.1,
      });
      container.appendChild(inputNumber.getElement());

      const upArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-up-arrow"]') as HTMLElement;
      upArrow.click();

      expect(inputNumber.getValue()).toBeCloseTo(1.1);
    });
  });

  describe('Min/Max Constraints', () => {
    it('should respect minimum value', () => {
      const inputNumber = new InputNumber({
        defaultValue: 5,
        min: 0,
      });
      container.appendChild(inputNumber.getElement());

      const downArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-down-arrow"]') as HTMLElement;

      // Click multiple times to go below min
      for (let i = 0; i < 10; i++) {
        downArrow.click();
      }

      expect(inputNumber.getValue()).toBe(0);
    });

    it('should respect maximum value', () => {
      const inputNumber = new InputNumber({
        defaultValue: 95,
        max: 100,
      });
      container.appendChild(inputNumber.getElement());

      const upArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-up-arrow"]') as HTMLElement;

      // Click multiple times to go above max
      for (let i = 0; i < 10; i++) {
        upArrow.click();
      }

      expect(inputNumber.getValue()).toBe(100);
    });

    it('should disable down arrow when at minimum', () => {
      const inputNumber = new InputNumber({
        defaultValue: 0,
        min: 0,
      });
      container.appendChild(inputNumber.getElement());

      const downArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-down-arrow"]') as HTMLElement;

      expect(downArrow.hasAttribute('data-disabled')).toBe(true);
    });

    it('should disable up arrow when at maximum', () => {
      const inputNumber = new InputNumber({
        defaultValue: 100,
        max: 100,
      });
      container.appendChild(inputNumber.getElement());

      const upArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-up-arrow"]') as HTMLElement;

      expect(upArrow.hasAttribute('data-disabled')).toBe(true);
    });

    it('should enable down arrow when moving above minimum', () => {
      const inputNumber = new InputNumber({
        defaultValue: 0,
        min: 0,
      });
      container.appendChild(inputNumber.getElement());

      const downArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-down-arrow"]') as HTMLElement;
      const upArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-up-arrow"]') as HTMLElement;

      expect(downArrow.hasAttribute('data-disabled')).toBe(true);

      upArrow.click();

      expect(downArrow.hasAttribute('data-disabled')).toBe(false);
    });

    it('should enable up arrow when moving below maximum', () => {
      const inputNumber = new InputNumber({
        defaultValue: 100,
        max: 100,
      });
      container.appendChild(inputNumber.getElement());

      const upArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-up-arrow"]') as HTMLElement;
      const downArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-down-arrow"]') as HTMLElement;

      expect(upArrow.hasAttribute('data-disabled')).toBe(true);

      downArrow.click();

      expect(upArrow.hasAttribute('data-disabled')).toBe(false);
    });
  });

  describe('onChange Callback', () => {
    it('should call onChange when value changes', () => {
      const onChange = vi.fn();
      const inputNumber = new InputNumber({
        defaultValue: 10,
        onChange,
      });
      container.appendChild(inputNumber.getElement());

      const input = inputNumber.getInput();
      input.value = '20px';
      input.dispatchEvent(new Event('change'));

      expect(onChange).toHaveBeenCalledWith(20, 'px', '20px', true);
    });

    it('should call onChange on increment', () => {
      const onChange = vi.fn();
      const inputNumber = new InputNumber({
        defaultValue: 10,
        onChange,
      });
      container.appendChild(inputNumber.getElement());

      const upArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-up-arrow"]') as HTMLElement;
      upArrow.click();

      expect(onChange).toHaveBeenCalledWith(11, 'px', '11px', true);
    });

    it('should call onChange on decrement', () => {
      const onChange = vi.fn();
      const inputNumber = new InputNumber({
        defaultValue: 10,
        onChange,
      });
      container.appendChild(inputNumber.getElement());

      const downArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-down-arrow"]') as HTMLElement;
      downArrow.click();

      expect(onChange).toHaveBeenCalledWith(9, 'px', '9px', true);
    });

    it('should pass userInput=false for programmatic updates', () => {
      const onChange = vi.fn();
      const inputNumber = new InputNumber({
        defaultValue: 10,
        onChange,
      });

      inputNumber.update(20);

      expect(onChange).toHaveBeenCalledWith(20, 'px', '20px', false);
    });

    it('should not call onChange when disabled', () => {
      const onChange = vi.fn();
      const inputNumber = new InputNumber({
        defaultValue: 10,
        disabled: true,
        onChange,
      });
      container.appendChild(inputNumber.getElement());

      const upArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-up-arrow"]') as HTMLElement;
      upArrow.click();

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should call onChange when disabled if emitEventsWhenDisabled is true', () => {
      const onChange = vi.fn();
      const inputNumber = new InputNumber({
        defaultValue: 10,
        disabled: true,
        emitEventsWhenDisabled: true,
        onChange,
      });

      inputNumber.update(20);

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Arrow Click Callbacks', () => {
    it('should call onUpArrowClick', () => {
      const onUpArrowClick = vi.fn();
      const inputNumber = new InputNumber({
        defaultValue: 10,
        onUpArrowClick,
      });
      container.appendChild(inputNumber.getElement());

      const upArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-up-arrow"]') as HTMLElement;
      upArrow.click();

      expect(onUpArrowClick).toHaveBeenCalled();
    });

    it('should call onDownArrowClick', () => {
      const onDownArrowClick = vi.fn();
      const inputNumber = new InputNumber({
        defaultValue: 10,
        onDownArrowClick,
      });
      container.appendChild(inputNumber.getElement());

      const downArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-down-arrow"]') as HTMLElement;
      downArrow.click();

      expect(onDownArrowClick).toHaveBeenCalled();
    });

    it('should prevent default increment when arrowUpClickPreventDefault is true', () => {
      const inputNumber = new InputNumber({
        defaultValue: 10,
        arrowUpClickPreventDefault: true,
      });
      container.appendChild(inputNumber.getElement());

      const upArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-up-arrow"]') as HTMLElement;
      upArrow.click();

      expect(inputNumber.getValue()).toBe(10); // Should not change
    });

    it('should prevent default decrement when arrowDownClickPreventDefault is true', () => {
      const inputNumber = new InputNumber({
        defaultValue: 10,
        arrowDownClickPreventDefault: true,
      });
      container.appendChild(inputNumber.getElement());

      const downArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-down-arrow"]') as HTMLElement;
      downArrow.click();

      expect(inputNumber.getValue()).toBe(10); // Should not change
    });
  });

  describe('Enable/Disable', () => {
    it('should start disabled when disabled prop is true', () => {
      const inputNumber = new InputNumber({ disabled: true });
      expect(inputNumber.isDisabled()).toBe(true);
    });

    it('should disable input element', () => {
      const inputNumber = new InputNumber({ disabled: true });
      const input = inputNumber.getInput();
      expect(input.hasAttribute('disabled')).toBe(true);
    });

    it('should add disabled class to root element', () => {
      const inputNumber = new InputNumber({ disabled: true });
      const element = inputNumber.getElement();
      expect(element.className).toContain('input-number--disabled');
    });

    it('should enable input', () => {
      const inputNumber = new InputNumber({ disabled: true });
      inputNumber.enable();

      expect(inputNumber.isDisabled()).toBe(false);
      expect(inputNumber.getInput().hasAttribute('disabled')).toBe(false);
      expect(inputNumber.getElement().className).not.toContain('input-number--disabled');
    });

    it('should disable input', () => {
      const inputNumber = new InputNumber();
      inputNumber.disable();

      expect(inputNumber.isDisabled()).toBe(true);
      expect(inputNumber.getInput().hasAttribute('disabled')).toBe(true);
      expect(inputNumber.getElement().className).toContain('input-number--disabled');
    });

    it('should disable arrows when input is disabled', () => {
      const inputNumber = new InputNumber();
      container.appendChild(inputNumber.getElement());

      inputNumber.disable();

      const upArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-up-arrow"]') as HTMLElement;
      const downArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-down-arrow"]') as HTMLElement;

      expect(upArrow.hasAttribute('data-disabled')).toBe(true);
      expect(downArrow.hasAttribute('data-disabled')).toBe(true);
    });
  });

  describe('Event Listeners', () => {
    it('should register event listener with on()', () => {
      const inputNumber = new InputNumber({ defaultValue: 10 });
      const callback = vi.fn();

      inputNumber.on('change', callback);
      inputNumber.update(20);

      expect(callback).toHaveBeenCalledWith(20, 'px', '20px', false);
    });

    it('should unregister event listener with off()', () => {
      const inputNumber = new InputNumber({ defaultValue: 10 });
      const callback = vi.fn();

      inputNumber.on('change', callback);
      inputNumber.off('change', callback);
      inputNumber.update(20);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should support multiple event listeners', () => {
      const inputNumber = new InputNumber({ defaultValue: 10 });
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      inputNumber.on('change', callback1);
      inputNumber.on('change', callback2);
      inputNumber.update(20);

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe('Public Methods', () => {
    describe('getElement()', () => {
      it('should return root element', () => {
        const inputNumber = new InputNumber();
        const element = inputNumber.getElement();

        expect(element).toBeInstanceOf(HTMLDivElement);
        expect(element.className).toContain('input-number');
      });
    });

    describe('getInput()', () => {
      it('should return input element', () => {
        const inputNumber = new InputNumber();
        const input = inputNumber.getInput();

        expect(input).toBeInstanceOf(HTMLInputElement);
      });
    });

    describe('destroy()', () => {
      it('should remove element from DOM', () => {
        const inputNumber = new InputNumber();
        container.appendChild(inputNumber.getElement());

        expect(container.children.length).toBe(1);

        inputNumber.destroy();

        expect(container.children.length).toBe(0);
      });

      it('should clear event listeners', () => {
        const inputNumber = new InputNumber();
        const callback = vi.fn();

        inputNumber.on('change', callback);
        inputNumber.destroy();
        inputNumber.update(20);

        expect(callback).not.toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle NaN input', () => {
      const inputNumber = new InputNumber({ defaultValue: 10 });
      container.appendChild(inputNumber.getElement());

      const input = inputNumber.getInput();
      input.value = 'abc';
      input.dispatchEvent(new Event('change'));

      // Should keep previous value
      expect(inputNumber.getValue()).toBe(10);
    });

    it('should handle empty input', () => {
      const inputNumber = new InputNumber({ defaultValue: 10 });
      container.appendChild(inputNumber.getElement());

      const input = inputNumber.getInput();
      input.value = '';
      input.dispatchEvent(new Event('change'));

      // Should default to 0
      expect(inputNumber.getValue()).toBe(0);
    });

    it('should handle very large numbers', () => {
      const inputNumber = new InputNumber({ defaultValue: 1000000 });
      expect(inputNumber.getValue()).toBe(1000000);
    });

    it('should handle very small increments', () => {
      const inputNumber = new InputNumber({
        defaultValue: 0,
        increment: 0.001,
      });
      container.appendChild(inputNumber.getElement());

      const upArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-up-arrow"]') as HTMLElement;
      upArrow.click();

      expect(inputNumber.getValue()).toBeCloseTo(0.001);
    });

    it('should handle no min or max constraints', () => {
      const inputNumber = new InputNumber({
        defaultValue: 0,
        min: null,
        max: null,
      });
      container.appendChild(inputNumber.getElement());

      const upArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-up-arrow"]') as HTMLElement;
      const downArrow = inputNumber
        .getElement()
        .querySelector('[data-testid="input-number-down-arrow"]') as HTMLElement;

      for (let i = 0; i < 1000; i++) {
        upArrow.click();
      }
      expect(inputNumber.getValue()).toBe(1000);

      for (let i = 0; i < 2000; i++) {
        downArrow.click();
      }
      expect(inputNumber.getValue()).toBe(-1000);
    });
  });
});
