/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InputLabel } from './InputLabel';
import type { InputLabelConfig } from './input-label.types';

describe('InputLabel', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  describe('Rendering', () => {
    it('should render with minimal props', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test Label',
      });

      container.appendChild(inputLabel.getElement());

      const element = inputLabel.getElement();
      expect(element).toBeInstanceOf(HTMLDivElement);
      expect(element.querySelector('label')).toBeTruthy();
      expect(element.querySelector('input')).toBeTruthy();
    });

    it('should render with string input', () => {
      const inputLabel = new InputLabel({
        input: 'initial value',
        label: 'Test Label',
      });

      const input = inputLabel.getInput();
      expect(input.value).toBe('initial value');
      expect(input.type).toBe('text');
    });

    it('should render with HTMLInputElement', () => {
      const input = document.createElement('input');
      input.type = 'email';
      input.value = 'test@example.com';

      const inputLabel = new InputLabel({
        input,
        label: 'Email',
      });

      const renderedInput = inputLabel.getInput();
      expect(renderedInput.type).toBe('email');
      expect(renderedInput.value).toBe('test@example.com');
    });

    it('should render label text correctly', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Username',
      });

      const label = inputLabel.getLabel();
      expect(label.textContent).toContain('Username');
    });

    it('should render label with HTMLElement', () => {
      const input = document.createElement('input');
      const labelElement = document.createElement('span');
      labelElement.textContent = 'Custom Label';

      const inputLabel = new InputLabel({
        input,
        label: labelElement,
      });

      const label = inputLabel.getLabel();
      expect(label.querySelector('span')).toBeTruthy();
      expect(label.textContent).toContain('Custom Label');
    });

    it('should apply custom classes to root element', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test',
        class: 'custom-class another-class',
      });

      const element = inputLabel.getElement();
      expect(element.className).toContain('custom-class');
      expect(element.className).toContain('another-class');
    });

    it('should apply custom classes to label', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test',
        labelClass: 'custom-label-class',
      });

      const label = inputLabel.getLabel();
      expect(label.className).toContain('custom-label-class');
    });

    it('should apply custom classes to input wrapper', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test',
        inputWrapperClass: 'custom-wrapper-class',
      });

      const element = inputLabel.getElement();
      const wrapper = element.querySelector('div') as HTMLElement;
      expect(wrapper?.className).toContain('custom-wrapper-class');
    });
  });

  describe('Layout', () => {
    it('should render in stacked layout by default', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test',
      });

      const element = inputLabel.getElement();
      expect(element.className).not.toContain('input-label--inline');
    });

    it('should render in side-by-side layout when sideBySide is true', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test',
        sideBySide: true,
      });

      const element = inputLabel.getElement();
      expect(element.className).toContain('input-label--inline');
    });
  });

  describe('Required Indicator', () => {
    it('should not show required indicator by default', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test',
      });

      const label = inputLabel.getLabel();
      const requiredIndicator = label.querySelector('[aria-label="required"]');
      expect(requiredIndicator).toBeFalsy();
    });

    it('should show required indicator when required is true', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test',
        required: true,
      });

      const label = inputLabel.getLabel();
      const requiredIndicator = label.querySelector('[aria-label="required"]');
      expect(requiredIndicator).toBeTruthy();
      expect(requiredIndicator?.textContent).toBe('*');
    });

    it('should have aria-label on required indicator', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test',
        required: true,
      });

      const label = inputLabel.getLabel();
      const requiredIndicator = label.querySelector('[aria-label="required"]');
      expect(requiredIndicator?.getAttribute('aria-label')).toBe('required');
    });
  });

  describe('Description Tooltip', () => {
    it('should not show tooltip when description is not provided', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test',
      });

      const label = inputLabel.getLabel();
      const tooltip = label.querySelector('[role="tooltip"]');
      expect(tooltip).toBeFalsy();
    });

    it('should show tooltip when description is provided', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test',
        description: 'This is a helpful description',
      });

      const label = inputLabel.getLabel();
      const tooltip = label.querySelector('[role="tooltip"]');
      expect(tooltip).toBeTruthy();
    });

    it('should set tooltip title attribute', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test',
        description: 'This is a helpful description',
      });

      const label = inputLabel.getLabel();
      const tooltip = label.querySelector('[role="tooltip"]');
      expect(tooltip?.getAttribute('title')).toBe('This is a helpful description');
    });

    it('should set tooltip aria-label', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test',
        description: 'This is a helpful description',
      });

      const label = inputLabel.getLabel();
      const tooltip = label.querySelector('[role="tooltip"]');
      expect(tooltip?.getAttribute('aria-label')).toBe('This is a helpful description');
    });

    it('should set tooltip role', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test',
        description: 'This is a helpful description',
      });

      const label = inputLabel.getLabel();
      const tooltip = label.querySelector('[role="tooltip"]');
      expect(tooltip?.getAttribute('role')).toBe('tooltip');
    });
  });

  describe('Input ID and Label Association', () => {
    it('should generate unique ID for input when not provided', () => {
      const input1 = document.createElement('input');
      const input2 = document.createElement('input');

      const inputLabel1 = new InputLabel({ input: input1, label: 'Test 1' });
      const inputLabel2 = new InputLabel({ input: input2, label: 'Test 2' });

      const id1 = inputLabel1.getInput().id;
      const id2 = inputLabel2.getInput().id;

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    it('should use provided inputId', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test',
        inputId: 'custom-id',
      });

      expect(inputLabel.getInput().id).toBe('custom-id');
    });

    it('should associate label with input using htmlFor', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test',
        inputId: 'test-input',
      });

      const label = inputLabel.getLabel();
      expect(label.htmlFor).toBe('test-input');
      expect(inputLabel.getInput().id).toBe('test-input');
    });
  });

  describe('onChange Callback', () => {
    it('should call onChange when input value changes', () => {
      const input = document.createElement('input');
      const onChange = vi.fn();

      const inputLabel = new InputLabel({
        input,
        label: 'Test',
        onChange,
      });

      container.appendChild(inputLabel.getElement());

      const inputElement = inputLabel.getInput();
      inputElement.value = 'new value';
      inputElement.dispatchEvent(new Event('change'));

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith('new value');
    });

    it('should not throw error if onChange is not provided', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test',
      });

      container.appendChild(inputLabel.getElement());

      const inputElement = inputLabel.getInput();
      expect(() => {
        inputElement.value = 'new value';
        inputElement.dispatchEvent(new Event('change'));
      }).not.toThrow();
    });
  });

  describe('Public Methods', () => {
    describe('getElement()', () => {
      it('should return the root element', () => {
        const input = document.createElement('input');
        const inputLabel = new InputLabel({ input, label: 'Test' });
        const element = inputLabel.getElement();

        expect(element).toBeInstanceOf(HTMLDivElement);
        expect(element.className).toContain('input-label');
      });
    });

    describe('getInput()', () => {
      it('should return the input element', () => {
        const input = document.createElement('input');
        const inputLabel = new InputLabel({ input, label: 'Test' });
        const returnedInput = inputLabel.getInput();

        expect(returnedInput).toBeInstanceOf(HTMLInputElement);
        expect(returnedInput).toBe(input);
      });
    });

    describe('getLabel()', () => {
      it('should return the label element', () => {
        const input = document.createElement('input');
        const inputLabel = new InputLabel({ input, label: 'Test' });
        const label = inputLabel.getLabel();

        expect(label).toBeInstanceOf(HTMLLabelElement);
        expect(label.textContent).toContain('Test');
      });
    });

    describe('setValue()', () => {
      it('should set input value', () => {
        const input = document.createElement('input');
        const inputLabel = new InputLabel({ input, label: 'Test' });

        inputLabel.setValue('new value');
        expect(inputLabel.getInput().value).toBe('new value');
      });
    });

    describe('getValue()', () => {
      it('should get input value', () => {
        const input = document.createElement('input');
        input.value = 'initial value';
        const inputLabel = new InputLabel({ input, label: 'Test' });

        expect(inputLabel.getValue()).toBe('initial value');
      });

      it('should get updated value after setValue', () => {
        const input = document.createElement('input');
        const inputLabel = new InputLabel({ input, label: 'Test' });

        inputLabel.setValue('updated value');
        expect(inputLabel.getValue()).toBe('updated value');
      });
    });

    describe('setLabel()', () => {
      it('should update label text', () => {
        const input = document.createElement('input');
        const inputLabel = new InputLabel({ input, label: 'Original' });

        inputLabel.setLabel('Updated Label');
        expect(inputLabel.getLabel().textContent).toContain('Updated Label');
      });
    });

    describe('enable()', () => {
      it('should enable disabled input', () => {
        const input = document.createElement('input');
        input.setAttribute('disabled', '');
        const inputLabel = new InputLabel({ input, label: 'Test' });

        inputLabel.enable();
        expect(inputLabel.getInput().hasAttribute('disabled')).toBe(false);
      });

      it('should remove disabled class from root element', () => {
        const input = document.createElement('input');
        const inputLabel = new InputLabel({ input, label: 'Test' });

        inputLabel.disable();
        inputLabel.enable();

        expect(inputLabel.getElement().className).not.toContain('input-label--disabled');
      });
    });

    describe('disable()', () => {
      it('should disable input', () => {
        const input = document.createElement('input');
        const inputLabel = new InputLabel({ input, label: 'Test' });

        inputLabel.disable();
        expect(inputLabel.getInput().hasAttribute('disabled')).toBe(true);
      });

      it('should add disabled class to root element', () => {
        const input = document.createElement('input');
        const inputLabel = new InputLabel({ input, label: 'Test' });

        inputLabel.disable();
        expect(inputLabel.getElement().className).toContain('input-label--disabled');
      });
    });

    describe('isDisabled()', () => {
      it('should return false for enabled input', () => {
        const input = document.createElement('input');
        const inputLabel = new InputLabel({ input, label: 'Test' });

        expect(inputLabel.isDisabled()).toBe(false);
      });

      it('should return true for disabled input', () => {
        const input = document.createElement('input');
        const inputLabel = new InputLabel({ input, label: 'Test' });

        inputLabel.disable();
        expect(inputLabel.isDisabled()).toBe(true);
      });
    });

    describe('destroy()', () => {
      it('should remove element from DOM', () => {
        const input = document.createElement('input');
        const inputLabel = new InputLabel({ input, label: 'Test' });

        container.appendChild(inputLabel.getElement());
        expect(container.children.length).toBe(1);

        inputLabel.destroy();
        expect(container.children.length).toBe(0);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper label-input association', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test Label',
        inputId: 'test-input',
      });

      const label = inputLabel.getLabel();
      const inputElement = inputLabel.getInput();

      expect(label.htmlFor).toBe(inputElement.id);
    });

    it('should maintain accessibility with required indicator', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test',
        required: true,
      });

      const label = inputLabel.getLabel();
      const requiredIndicator = label.querySelector('[aria-label="required"]');
      expect(requiredIndicator).toBeTruthy();
    });

    it('should maintain accessibility with description tooltip', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: 'Test',
        description: 'Help text',
      });

      const label = inputLabel.getLabel();
      const tooltip = label.querySelector('[role="tooltip"]');
      expect(tooltip).toBeTruthy();
      expect(tooltip?.getAttribute('aria-label')).toBe('Help text');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty label', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: '',
      });

      const label = inputLabel.getLabel();
      expect(label).toBeTruthy();
      expect(label.textContent).toBe('');
    });

    it('should handle very long label text', () => {
      const input = document.createElement('input');
      const longLabel = 'A'.repeat(1000);
      const inputLabel = new InputLabel({
        input,
        label: longLabel,
      });

      const label = inputLabel.getLabel();
      expect(label.textContent).toContain(longLabel);
    });

    it('should handle special characters in label', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({
        input,
        label: '<script>alert("XSS")</script>',
      });

      const label = inputLabel.getLabel();
      expect(label.querySelector('script')).toBeFalsy();
      expect(label.textContent).toContain('<script>');
    });

    it('should handle multiple enable/disable calls', () => {
      const input = document.createElement('input');
      const inputLabel = new InputLabel({ input, label: 'Test' });

      inputLabel.disable();
      inputLabel.disable();
      expect(inputLabel.isDisabled()).toBe(true);

      inputLabel.enable();
      inputLabel.enable();
      expect(inputLabel.isDisabled()).toBe(false);
    });
  });
});
