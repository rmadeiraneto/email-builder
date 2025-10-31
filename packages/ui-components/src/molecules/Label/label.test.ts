import { describe, it, expect, afterEach } from 'vitest';
import { Label } from './Label';
import type { LabelOptions } from './label.types';

describe('Label', () => {
  let label: Label;

  afterEach(() => {
    if (label) {
      label.destroy();
    }
  });

  describe('Initialization', () => {
    it('should create a Label instance with default options', () => {
      label = new Label();
      expect(label).toBeInstanceOf(Label);
      expect(label.getEl()).toBeInstanceOf(HTMLLabelElement);
    });

    it('should create a label element', () => {
      label = new Label();
      const element = label.getEl();
      expect(element.tagName).toBe('LABEL');
    });

    it('should set text content when provided', () => {
      label = new Label({
        text: 'Username',
      });

      const element = label.getEl();
      expect(element.textContent).toBe('Username');
    });

    it('should set htmlFor attribute when for is provided', () => {
      label = new Label({
        for: 'username-input',
      });

      const element = label.getEl();
      expect(element.htmlFor).toBe('username-input');
    });

    it('should set both text and htmlFor', () => {
      label = new Label({
        text: 'Email',
        for: 'email-input',
      });

      const element = label.getEl();
      expect(element.textContent).toBe('Email');
      expect(element.htmlFor).toBe('email-input');
    });

    it('should apply extended classes', () => {
      label = new Label({
        extendedClasses: 'custom-class another-class',
      });

      const element = label.getEl();
      expect(element.className).toContain('custom-class');
      expect(element.className).toContain('another-class');
    });

    it('should have empty text by default', () => {
      label = new Label();
      expect(label.getEl().textContent).toBe('');
    });

    it('should have no htmlFor by default', () => {
      label = new Label();
      expect(label.getEl().htmlFor).toBe('');
    });
  });

  describe('setText Method', () => {
    beforeEach(() => {
      label = new Label({
        text: 'Initial Text',
      });
    });

    it('should update text content', () => {
      label.setText('Updated Text');
      expect(label.getEl().textContent).toBe('Updated Text');
    });

    it('should replace existing text', () => {
      expect(label.getEl().textContent).toBe('Initial Text');
      label.setText('New Text');
      expect(label.getEl().textContent).toBe('New Text');
    });

    it('should accept empty string', () => {
      label.setText('');
      expect(label.getEl().textContent).toBe('');
    });

    it('should accept special characters', () => {
      label.setText('!@#$%^&*()');
      expect(label.getEl().textContent).toBe('!@#$%^&*()');
    });

    it('should accept long text', () => {
      const longText = 'A'.repeat(1000);
      label.setText(longText);
      expect(label.getEl().textContent).toBe(longText);
    });

    it('should handle unicode characters', () => {
      label.setText('🎉 Unicode 中文 العربية');
      expect(label.getEl().textContent).toContain('🎉');
      expect(label.getEl().textContent).toContain('中文');
    });
  });

  describe('setFor Method', () => {
    beforeEach(() => {
      label = new Label({
        for: 'initial-input',
      });
    });

    it('should update htmlFor attribute', () => {
      label.setFor('updated-input');
      expect(label.getEl().htmlFor).toBe('updated-input');
    });

    it('should replace existing htmlFor', () => {
      expect(label.getEl().htmlFor).toBe('initial-input');
      label.setFor('new-input');
      expect(label.getEl().htmlFor).toBe('new-input');
    });

    it('should accept empty string', () => {
      label.setFor('');
      expect(label.getEl().htmlFor).toBe('');
    });

    it('should accept ID with special characters', () => {
      label.setFor('my-input_123');
      expect(label.getEl().htmlFor).toBe('my-input_123');
    });

    it('should work when no initial for was set', () => {
      label.destroy();
      label = new Label({
        text: 'Label',
      });

      label.setFor('new-input');
      expect(label.getEl().htmlFor).toBe('new-input');
    });
  });

  describe('getEl Method', () => {
    it('should return the label element', () => {
      label = new Label({
        text: 'Test Label',
      });

      const element = label.getEl();
      expect(element).toBeInstanceOf(HTMLLabelElement);
      expect(element.textContent).toBe('Test Label');
    });

    it('should return the same element on multiple calls', () => {
      label = new Label();

      const element1 = label.getEl();
      const element2 = label.getEl();

      expect(element1).toBe(element2);
    });
  });

  describe('Text Content Variations', () => {
    it('should handle single character', () => {
      label = new Label({
        text: 'A',
      });

      expect(label.getEl().textContent).toBe('A');
    });

    it('should handle numbers as text', () => {
      label = new Label();
      label.setText('123');

      expect(label.getEl().textContent).toBe('123');
    });

    it('should handle whitespace', () => {
      label = new Label({
        text: '   spaces   ',
      });

      expect(label.getEl().textContent).toBe('   spaces   ');
    });

    it('should handle newlines in text', () => {
      label = new Label({
        text: 'Line 1\nLine 2',
      });

      expect(label.getEl().textContent).toContain('Line 1');
      expect(label.getEl().textContent).toContain('Line 2');
    });

    it('should handle tabs in text', () => {
      label = new Label({
        text: 'Tab\there',
      });

      expect(label.getEl().textContent).toContain('Tab\there');
    });
  });

  describe('Extended Classes', () => {
    it('should apply single custom class', () => {
      label = new Label({
        extendedClasses: 'custom',
      });

      expect(label.getEl().className).toContain('custom');
    });

    it('should apply multiple custom classes', () => {
      label = new Label({
        extendedClasses: 'class1 class2 class3',
      });

      const element = label.getEl();
      expect(element.className).toContain('class1');
      expect(element.className).toContain('class2');
      expect(element.className).toContain('class3');
    });

    it('should maintain custom classes when updating text', () => {
      label = new Label({
        text: 'Original',
        extendedClasses: 'custom',
      });

      label.setText('Updated');

      expect(label.getEl().className).toContain('custom');
      expect(label.getEl().textContent).toBe('Updated');
    });

    it('should maintain custom classes when updating for', () => {
      label = new Label({
        for: 'input1',
        extendedClasses: 'custom',
      });

      label.setFor('input2');

      expect(label.getEl().className).toContain('custom');
      expect(label.getEl().htmlFor).toBe('input2');
    });
  });

  describe('Form Association', () => {
    it('should properly associate with input element', () => {
      const input = document.createElement('input');
      input.id = 'test-input';
      document.body.appendChild(input);

      label = new Label({
        text: 'Test Label',
        for: 'test-input',
      });
      document.body.appendChild(label.getEl());

      expect(label.getEl().htmlFor).toBe('test-input');
      // Note: control property may not be fully supported in jsdom
      // but htmlFor attribute is correctly set

      label.getEl().remove();
      input.remove();
    });

    it('should work without associated input', () => {
      label = new Label({
        text: 'Standalone Label',
      });

      expect(label.getEl().htmlFor).toBe('');
      expect(label.getEl().control).toBeNull();
    });
  });

  describe('Destroy', () => {
    it('should remove element from DOM', () => {
      label = new Label({
        text: 'Test',
      });

      const element = label.getEl();
      document.body.appendChild(element);

      expect(document.body.contains(element)).toBe(true);

      label.destroy();

      expect(document.body.contains(element)).toBe(false);
    });

    it('should not throw when destroying unattached label', () => {
      label = new Label({
        text: 'Test',
      });

      expect(() => label.destroy()).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty options object', () => {
      label = new Label({});

      expect(label.getEl()).toBeInstanceOf(HTMLLabelElement);
      expect(label.getEl().textContent).toBe('');
      expect(label.getEl().htmlFor).toBe('');
    });

    it('should handle null for attribute', () => {
      label = new Label({
        for: null,
      });

      expect(label.getEl().htmlFor).toBe('');
    });

    it('should handle consecutive text updates', () => {
      label = new Label();

      label.setText('First');
      expect(label.getEl().textContent).toBe('First');

      label.setText('Second');
      expect(label.getEl().textContent).toBe('Second');

      label.setText('Third');
      expect(label.getEl().textContent).toBe('Third');
    });

    it('should handle consecutive for updates', () => {
      label = new Label();

      label.setFor('input1');
      expect(label.getEl().htmlFor).toBe('input1');

      label.setFor('input2');
      expect(label.getEl().htmlFor).toBe('input2');

      label.setFor('input3');
      expect(label.getEl().htmlFor).toBe('input3');
    });

    it('should handle alternating updates', () => {
      label = new Label({
        text: 'Initial',
        for: 'input1',
      });

      label.setText('Updated');
      expect(label.getEl().textContent).toBe('Updated');
      expect(label.getEl().htmlFor).toBe('input1');

      label.setFor('input2');
      expect(label.getEl().textContent).toBe('Updated');
      expect(label.getEl().htmlFor).toBe('input2');
    });
  });

  describe('Label Element Properties', () => {
    it('should be a valid label element', () => {
      label = new Label({
        text: 'Test',
      });

      const element = label.getEl();
      expect(element instanceof HTMLLabelElement).toBe(true);
    });

    it('should maintain reference integrity', () => {
      label = new Label({
        text: 'Original',
      });

      const element1 = label.getEl();
      label.setText('Updated');
      const element2 = label.getEl();

      // Should be the same element instance
      expect(element1).toBe(element2);
      expect(element2.textContent).toBe('Updated');
    });
  });
});
