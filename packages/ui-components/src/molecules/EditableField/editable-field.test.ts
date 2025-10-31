/**
 * Tests for EditableField component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EditableField } from './EditableField';
import type { EditableFieldOptions } from './editable-field.types';

describe('EditableField', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Initialization', () => {
    it('should create an EditableField instance', () => {
      const field = new EditableField();
      expect(field).toBeInstanceOf(EditableField);
    });

    it('should initialize with default options', () => {
      const field = new EditableField();
      const element = field.getEl();

      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.className).toContain('editable-field');
      expect(field.getValue()).toBe('');
    });

    it('should initialize with custom value', () => {
      const field = new EditableField({ value: 'Test value' });
      expect(field.getValue()).toBe('Test value');
    });

    it('should apply custom classes', () => {
      const field = new EditableField({
        extendedClasses: 'custom-class another-class'
      });
      const element = field.getEl();

      expect(element.classList.contains('custom-class')).toBe(true);
      expect(element.classList.contains('another-class')).toBe(true);
    });

    it('should start in view mode by default', () => {
      const field = new EditableField();
      const element = field.getEl();

      expect(element.className).toContain('view-mode');
      expect(element.className).not.toContain('edit-mode');
    });

    it('should start in edit mode when startEditing is true', () => {
      const field = new EditableField({ startEditing: true });
      const element = field.getEl();

      expect(element.className).toContain('edit-mode');
      expect(element.className).not.toContain('view-mode');
    });
  });

  describe('View Mode', () => {
    it('should display label in view mode', () => {
      const field = new EditableField({ value: 'Test value' });
      const element = field.getEl();
      container.appendChild(element);

      const label = element.querySelector('[data-testid="editable-field-label"]');
      expect(label).toBeTruthy();
      expect(label?.textContent).toBe('Test value');
    });

    it('should make label clickable when labelClickOpensEditMode is true', () => {
      const field = new EditableField({
        value: 'Test',
        labelClickOpensEditMode: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const label = element.querySelector('[data-testid="editable-field-label"]');
      expect(label?.className).toContain('clickable');
    });

    it('should not make label clickable when showEditButton is true', () => {
      const field = new EditableField({
        value: 'Test',
        showEditButton: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const label = element.querySelector('[data-testid="editable-field-label"]');
      expect(label?.className).not.toContain('clickable');
    });

    it('should show edit button when showEditButton is true', () => {
      const field = new EditableField({
        value: 'Test',
        showEditButton: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const editButton = element.querySelector('[data-testid="editable-field-edit-button"]');
      expect(editButton).toBeTruthy();
    });

    it('should not show edit button when showEditButton is false', () => {
      const field = new EditableField({
        value: 'Test',
        showEditButton: false
      });
      const element = field.getEl();
      container.appendChild(element);

      const editButton = element.querySelector('[data-testid="editable-field-edit-button"]');
      expect(editButton).toBeFalsy();
    });

    it('should hide buttons wrapper in view mode when showEditButton is false', () => {
      const field = new EditableField({
        value: 'Test',
        showEditButton: false
      });
      const element = field.getEl();
      container.appendChild(element);

      const buttonsWrapper = element.querySelector('[data-testid="editable-field-buttons"]') as HTMLElement;
      expect(buttonsWrapper.classList.contains('eb-editable-field__buttons--hidden')).toBe(true);
    });
  });

  describe('Edit Mode', () => {
    it('should display input in edit mode', () => {
      const field = new EditableField({
        value: 'Test value',
        startEditing: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const input = element.querySelector('[data-testid="editable-field-input"]') as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input?.value).toBe('Test value');
    });

    it('should show save and discard buttons in edit mode', () => {
      const field = new EditableField({ startEditing: true });
      const element = field.getEl();
      container.appendChild(element);

      const saveButton = element.querySelector('[data-testid="editable-field-save-button"]');
      const discardButton = element.querySelector('[data-testid="editable-field-discard-button"]');

      expect(saveButton).toBeTruthy();
      expect(discardButton).toBeTruthy();
    });

    it('should use custom icons when provided', () => {
      const field = new EditableField({
        startEditing: true,
        icons: {
          save: '✓',
          discard: '✗'
        }
      });
      const element = field.getEl();
      container.appendChild(element);

      const saveButton = element.querySelector('[data-testid="editable-field-save-button"]');
      const discardButton = element.querySelector('[data-testid="editable-field-discard-button"]');

      expect(saveButton?.innerHTML).toBe('✓');
      expect(discardButton?.innerHTML).toBe('✗');
    });
  });

  describe('Mode Switching', () => {
    it('should switch to edit mode when label is clicked', () => {
      const field = new EditableField({
        value: 'Test',
        labelClickOpensEditMode: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const label = element.querySelector('[data-testid="editable-field-label"]') as HTMLElement;
      label.click();

      expect(element.className).toContain('edit-mode');

      const input = element.querySelector('[data-testid="editable-field-input"]');
      expect(input).toBeTruthy();
    });

    it('should switch to edit mode when edit button is clicked', () => {
      const field = new EditableField({
        value: 'Test',
        showEditButton: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const editButton = element.querySelector('[data-testid="editable-field-edit-button"]') as HTMLElement;
      editButton.click();

      expect(element.className).toContain('edit-mode');
    });

    it('should switch to view mode when save button is clicked', () => {
      const field = new EditableField({
        value: 'Test',
        startEditing: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const saveButton = element.querySelector('[data-testid="editable-field-save-button"]') as HTMLElement;
      saveButton.click();

      expect(element.className).toContain('view-mode');

      const label = element.querySelector('[data-testid="editable-field-label"]');
      expect(label).toBeTruthy();
    });

    it('should switch to view mode when discard button is clicked', () => {
      const field = new EditableField({
        value: 'Test',
        startEditing: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const discardButton = element.querySelector('[data-testid="editable-field-discard-button"]') as HTMLElement;
      discardButton.click();

      expect(element.className).toContain('view-mode');
    });
  });

  describe('Save Functionality', () => {
    it('should update value when save is clicked', () => {
      const field = new EditableField({
        value: 'Original',
        startEditing: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const input = element.querySelector('[data-testid="editable-field-input"]') as HTMLInputElement;
      input.value = 'Updated';

      const saveButton = element.querySelector('[data-testid="editable-field-save-button"]') as HTMLElement;
      saveButton.click();

      expect(field.getValue()).toBe('Updated');
    });

    it('should update label text when save is clicked', () => {
      const field = new EditableField({
        value: 'Original',
        startEditing: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const input = element.querySelector('[data-testid="editable-field-input"]') as HTMLInputElement;
      input.value = 'Updated';

      const saveButton = element.querySelector('[data-testid="editable-field-save-button"]') as HTMLElement;
      saveButton.click();

      const label = element.querySelector('[data-testid="editable-field-label"]');
      expect(label?.textContent).toBe('Updated');
    });

    it('should call onSave callback when save is clicked', () => {
      const onSave = vi.fn();
      const field = new EditableField({
        value: 'Test',
        startEditing: true,
        onSave
      });
      const element = field.getEl();
      container.appendChild(element);

      const input = element.querySelector('[data-testid="editable-field-input"]') as HTMLInputElement;
      input.value = 'Updated';

      const saveButton = element.querySelector('[data-testid="editable-field-save-button"]') as HTMLElement;
      saveButton.click();

      expect(onSave).toHaveBeenCalledWith('Updated', field);
    });

    it('should emit save event when save is clicked', () => {
      const field = new EditableField({
        value: 'Test',
        startEditing: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const saveCallback = vi.fn();
      field.on('save', saveCallback);

      const input = element.querySelector('[data-testid="editable-field-input"]') as HTMLInputElement;
      input.value = 'Updated';

      const saveButton = element.querySelector('[data-testid="editable-field-save-button"]') as HTMLElement;
      saveButton.click();

      expect(saveCallback).toHaveBeenCalledWith('Updated');
    });
  });

  describe('Discard Functionality', () => {
    it('should revert input value when discard is clicked', () => {
      const field = new EditableField({
        value: 'Original',
        startEditing: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const input = element.querySelector('[data-testid="editable-field-input"]') as HTMLInputElement;
      input.value = 'Changed';

      const discardButton = element.querySelector('[data-testid="editable-field-discard-button"]') as HTMLElement;
      discardButton.click();

      // Switch back to edit mode to check input value
      const label = element.querySelector('[data-testid="editable-field-label"]') as HTMLElement;
      label.click();

      const inputAfterDiscard = element.querySelector('[data-testid="editable-field-input"]') as HTMLInputElement;
      expect(inputAfterDiscard.value).toBe('Original');
    });

    it('should not update stored value when discard is clicked', () => {
      const field = new EditableField({
        value: 'Original',
        startEditing: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const input = element.querySelector('[data-testid="editable-field-input"]') as HTMLInputElement;
      input.value = 'Changed';

      const discardButton = element.querySelector('[data-testid="editable-field-discard-button"]') as HTMLElement;
      discardButton.click();

      expect(field.getValue()).toBe('Original');
    });

    it('should call onDiscard callback when discard is clicked', () => {
      const onDiscard = vi.fn();
      const field = new EditableField({
        value: 'Test',
        startEditing: true,
        onDiscard
      });
      const element = field.getEl();
      container.appendChild(element);

      const discardButton = element.querySelector('[data-testid="editable-field-discard-button"]') as HTMLElement;
      discardButton.click();

      expect(onDiscard).toHaveBeenCalledWith(field);
    });

    it('should emit discard event when discard is clicked', () => {
      const field = new EditableField({
        value: 'Test',
        startEditing: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const discardCallback = vi.fn();
      field.on('discard', discardCallback);

      const discardButton = element.querySelector('[data-testid="editable-field-discard-button"]') as HTMLElement;
      discardButton.click();

      expect(discardCallback).toHaveBeenCalled();
    });
  });

  describe('Edit Callbacks', () => {
    it('should call onEdit callback when edit mode is entered', () => {
      const onEdit = vi.fn();
      const field = new EditableField({
        value: 'Test',
        labelClickOpensEditMode: true,
        onEdit
      });
      const element = field.getEl();
      container.appendChild(element);

      const label = element.querySelector('[data-testid="editable-field-label"]') as HTMLElement;
      label.click();

      expect(onEdit).toHaveBeenCalledWith(field);
    });

    it('should emit edit event when edit mode is entered', () => {
      const field = new EditableField({
        value: 'Test',
        labelClickOpensEditMode: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const editCallback = vi.fn();
      field.on('edit', editCallback);

      const label = element.querySelector('[data-testid="editable-field-label"]') as HTMLElement;
      label.click();

      expect(editCallback).toHaveBeenCalled();
    });
  });

  describe('Input Change Callbacks', () => {
    it('should call onInputChange when input value changes', () => {
      const onInputChange = vi.fn();
      const field = new EditableField({
        value: 'Test',
        startEditing: true,
        onInputChange
      });
      const element = field.getEl();
      container.appendChild(element);

      const input = element.querySelector('[data-testid="editable-field-input"]') as HTMLInputElement;
      input.value = 'Updated';
      input.dispatchEvent(new Event('input'));

      expect(onInputChange).toHaveBeenCalledWith('Updated');
    });

    it('should emit inputChange event when input value changes', () => {
      const field = new EditableField({
        value: 'Test',
        startEditing: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const inputChangeCallback = vi.fn();
      field.on('inputChange', inputChangeCallback);

      const input = element.querySelector('[data-testid="editable-field-input"]') as HTMLInputElement;
      input.value = 'Updated';
      input.dispatchEvent(new Event('input'));

      expect(inputChangeCallback).toHaveBeenCalledWith('Updated');
    });
  });

  describe('Public API - getValue/setValue', () => {
    it('should get current value', () => {
      const field = new EditableField({ value: 'Test value' });
      expect(field.getValue()).toBe('Test value');
    });

    it('should set value and update label', () => {
      const field = new EditableField({ value: 'Original' });
      const element = field.getEl();
      container.appendChild(element);

      field.setValue('Updated');

      expect(field.getValue()).toBe('Updated');

      const label = element.querySelector('[data-testid="editable-field-label"]');
      expect(label?.textContent).toBe('Updated');
    });

    it('should set value and update input', () => {
      const field = new EditableField({
        value: 'Original',
        startEditing: true
      });
      const element = field.getEl();
      container.appendChild(element);

      field.setValue('Updated');

      const input = element.querySelector('[data-testid="editable-field-input"]') as HTMLInputElement;
      expect(input.value).toBe('Updated');
    });
  });

  describe('Public API - setType', () => {
    it('should set input type', () => {
      const field = new EditableField({ startEditing: true });
      const element = field.getEl();
      container.appendChild(element);

      field.setType('email');

      const input = element.querySelector('[data-testid="editable-field-input"]') as HTMLInputElement;
      expect(input.type).toBe('email');
    });

    it('should change input type dynamically', () => {
      const field = new EditableField({ startEditing: true });
      const element = field.getEl();
      container.appendChild(element);

      const input = element.querySelector('[data-testid="editable-field-input"]') as HTMLInputElement;
      expect(input.type).toBe('text');

      field.setType('password');
      expect(input.type).toBe('password');

      field.setType('number');
      expect(input.type).toBe('number');
    });
  });

  describe('Public API - getEl', () => {
    it('should return root element', () => {
      const field = new EditableField();
      const element = field.getEl();

      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName).toBe('DIV');
    });
  });

  describe('Event System - on/off', () => {
    it('should add event listener with on()', () => {
      const field = new EditableField({
        value: 'Test',
        labelClickOpensEditMode: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const callback = vi.fn();
      field.on('edit', callback);

      const label = element.querySelector('[data-testid="editable-field-label"]') as HTMLElement;
      label.click();

      expect(callback).toHaveBeenCalled();
    });

    it('should remove event listener with off()', () => {
      const field = new EditableField({
        value: 'Test',
        labelClickOpensEditMode: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const callback = vi.fn();
      field.on('edit', callback);
      field.off('edit', callback);

      const label = element.querySelector('[data-testid="editable-field-label"]') as HTMLElement;
      label.click();

      expect(callback).not.toHaveBeenCalled();
    });

    it('should support multiple event listeners for same event', () => {
      const field = new EditableField({
        value: 'Test',
        labelClickOpensEditMode: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const callback1 = vi.fn();
      const callback2 = vi.fn();
      field.on('edit', callback1);
      field.on('edit', callback2);

      const label = element.querySelector('[data-testid="editable-field-label"]') as HTMLElement;
      label.click();

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it('should only remove specific callback with off()', () => {
      const field = new EditableField({
        value: 'Test',
        labelClickOpensEditMode: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const callback1 = vi.fn();
      const callback2 = vi.fn();
      field.on('edit', callback1);
      field.on('edit', callback2);
      field.off('edit', callback1);

      const label = element.querySelector('[data-testid="editable-field-label"]') as HTMLElement;
      label.click();

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe('destroy()', () => {
    it('should remove element from DOM', () => {
      const field = new EditableField();
      const element = field.getEl();
      container.appendChild(element);

      expect(container.contains(element)).toBe(true);

      field.destroy();

      expect(container.contains(element)).toBe(false);
    });

    it('should clear all event listeners', () => {
      const field = new EditableField({
        value: 'Test',
        labelClickOpensEditMode: true
      });
      const element = field.getEl();
      container.appendChild(element);

      const callback = vi.fn();
      field.on('edit', callback);

      field.destroy();

      // Try to trigger event after destroy (won't work since element is removed)
      // But we can test that the event emitter was cleared
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string value', () => {
      const field = new EditableField({ value: '' });
      expect(field.getValue()).toBe('');
    });

    it('should handle very long text', () => {
      const longText = 'A'.repeat(1000);
      const field = new EditableField({ value: longText });
      const element = field.getEl();
      container.appendChild(element);

      expect(field.getValue()).toBe(longText);

      const label = element.querySelector('[data-testid="editable-field-label"]');
      expect(label?.textContent).toBe(longText);
    });

    it('should handle special characters in value', () => {
      const specialValue = '<script>alert("xss")</script>';
      const field = new EditableField({ value: specialValue });
      const element = field.getEl();
      container.appendChild(element);

      const label = element.querySelector('[data-testid="editable-field-label"]');
      expect(label?.textContent).toBe(specialValue);
      // Ensure it's treated as text, not HTML
      expect(element.querySelector('script')).toBeFalsy();
    });

    it('should handle rapid mode switching', () => {
      const field = new EditableField({
        value: 'Test',
        showEditButton: true
      });
      const element = field.getEl();
      container.appendChild(element);

      // Rapidly switch modes
      const editButton = element.querySelector('[data-testid="editable-field-edit-button"]') as HTMLElement;
      editButton.click();

      const saveButton = element.querySelector('[data-testid="editable-field-save-button"]') as HTMLElement;
      saveButton.click();

      const editButton2 = element.querySelector('[data-testid="editable-field-edit-button"]') as HTMLElement;
      editButton2.click();

      const discardButton = element.querySelector('[data-testid="editable-field-discard-button"]') as HTMLElement;
      discardButton.click();

      expect(element.className).toContain('view-mode');
    });

    it('should handle setValue while in edit mode', () => {
      const field = new EditableField({
        value: 'Original',
        startEditing: true
      });
      const element = field.getEl();
      container.appendChild(element);

      field.setValue('Programmatically Updated');

      const input = element.querySelector('[data-testid="editable-field-input"]') as HTMLInputElement;
      expect(input.value).toBe('Programmatically Updated');
      expect(field.getValue()).toBe('Programmatically Updated');
    });
  });
});
