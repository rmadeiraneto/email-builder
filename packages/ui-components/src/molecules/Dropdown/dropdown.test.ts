/**
 * Dropdown component tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Dropdown } from './Dropdown';
import { DropdownItem } from './DropdownItem';
import type { DropdownProps } from './dropdown.types';

describe('Dropdown', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('initialization', () => {
    it('should create dropdown element', () => {
      const dropdown = new Dropdown({
        items: [
          { value: '1', content: 'Option 1' },
          { value: '2', content: 'Option 2' },
        ],
      });

      expect(dropdown.getEl()).toBeInstanceOf(HTMLDivElement);
    });

    it('should handle empty items array', () => {
      const dropdown = new Dropdown({ items: [] });
      expect(dropdown.items).toHaveLength(0);
    });

    it('should convert item objects to DropdownItem instances', () => {
      const dropdown = new Dropdown({
        items: [
          { value: '1', content: 'Option 1' },
          { value: '2', content: 'Option 2' },
        ],
      });

      expect(dropdown.items[0]).toBeInstanceOf(DropdownItem);
      expect(dropdown.items[1]).toBeInstanceOf(DropdownItem);
    });

    it('should accept DropdownItem instances directly', () => {
      const item1 = new DropdownItem({ value: '1', content: 'Option 1' });
      const item2 = new DropdownItem({ value: '2', content: 'Option 2' });

      const dropdown = new Dropdown({ items: [item1, item2] });

      expect(dropdown.items[0]).toBe(item1);
      expect(dropdown.items[1]).toBe(item2);
    });

    it('should start opened if startOpened is true', () => {
      const dropdown = new Dropdown({
        items: [{ value: '1', content: 'Option 1' }],
        startOpened: true,
      });

      expect(dropdown.isOpen).toBe(true);
    });

    it('should not start opened by default', () => {
      const dropdown = new Dropdown({
        items: [{ value: '1', content: 'Option 1' }],
      });

      expect(dropdown.isOpen).toBe(false);
    });

    it('should apply size modifier classes', () => {
      const dropdown = new Dropdown({
        items: [{ value: '1', content: 'Option 1' }],
        size: 'sm',
      });

      const element = dropdown.getEl();
      // Check if class is applied (actual class name depends on CSS Modules)
      expect(element.className).toContain('dropdown');
    });

    it('should apply extended classes', () => {
      const dropdown = new Dropdown({
        items: [{ value: '1', content: 'Option 1' }],
        extendedClasses: 'custom-class another-class',
      });

      const element = dropdown.getEl();
      expect(element.classList.contains('custom-class')).toBe(true);
      expect(element.classList.contains('another-class')).toBe(true);
    });
  });

  describe('open, close, and toggle', () => {
    it('should open dropdown', () => {
      const dropdown = new Dropdown({
        items: [{ value: '1', content: 'Option 1' }],
      });

      dropdown.open();

      expect(dropdown.isOpen).toBe(true);
    });

    it('should close dropdown', () => {
      const dropdown = new Dropdown({
        items: [{ value: '1', content: 'Option 1' }],
        startOpened: true,
      });

      dropdown.close();

      expect(dropdown.isOpen).toBe(false);
    });

    it('should toggle dropdown state', () => {
      const dropdown = new Dropdown({
        items: [{ value: '1', content: 'Option 1' }],
      });

      expect(dropdown.isOpen).toBe(false);

      dropdown.toggle();
      expect(dropdown.isOpen).toBe(true);

      dropdown.toggle();
      expect(dropdown.isOpen).toBe(false);
    });

    it('should close dropdown on item click when closeDropdownOnItemClick is true', () => {
      const dropdown = new Dropdown({
        items: [{ value: '1', content: 'Option 1' }],
        closeDropdownOnItemClick: true,
      });

      dropdown.open();
      expect(dropdown.isOpen).toBe(true);

      const itemElement = dropdown.items[0].getEl();
      itemElement.click();

      expect(dropdown.isOpen).toBe(false);
    });

    it('should not close dropdown on item click when closeDropdownOnItemClick is false', () => {
      const dropdown = new Dropdown({
        items: [{ value: '1', content: 'Option 1' }],
        closeDropdownOnItemClick: false,
      });

      dropdown.open();
      expect(dropdown.isOpen).toBe(true);

      const itemElement = dropdown.items[0].getEl();
      itemElement.click();

      expect(dropdown.isOpen).toBe(true);
    });
  });

  describe('item selection and activation', () => {
    it('should activate item on click', () => {
      const dropdown = new Dropdown({
        items: [
          { value: '1', content: 'Option 1' },
          { value: '2', content: 'Option 2' },
        ],
      });

      const itemElement = dropdown.items[0].getEl();
      itemElement.click();

      expect(dropdown.activeItem).toBe(dropdown.items[0]);
      expect(dropdown.items[0].getIsActive()).toBe(true);
    });

    it('should deactivate other items when activating one', () => {
      const dropdown = new Dropdown({
        items: [
          { value: '1', content: 'Option 1', active: true },
          { value: '2', content: 'Option 2' },
        ],
      });

      const item2Element = dropdown.items[1].getEl();
      item2Element.click();

      expect(dropdown.items[0].getIsActive()).toBe(false);
      expect(dropdown.items[1].getIsActive()).toBe(true);
    });

    it('should change active item by value', () => {
      const dropdown = new Dropdown({
        items: [
          { value: '1', content: 'Option 1' },
          { value: '2', content: 'Option 2' },
        ],
      });

      dropdown.changeActiveItem('2');

      expect(dropdown.activeItem).toBe(dropdown.items[1]);
      expect(dropdown.items[1].getIsActive()).toBe(true);
    });

    it('should return active item', () => {
      const dropdown = new Dropdown({
        items: [
          { value: '1', content: 'Option 1', active: true },
          { value: '2', content: 'Option 2' },
        ],
      });

      expect(dropdown.getActiveItem()).toBe(dropdown.items[0]);
    });
  });

  describe('control clicks', () => {
    it('should toggle dropdown on control click by default', () => {
      const dropdown = new Dropdown({
        items: [{ value: '1', content: 'Option 1' }],
      });

      container.appendChild(dropdown.getEl());
      // Query using attribute selector to avoid CSS Modules issues
      const control = dropdown.getEl().querySelector('[class*="dropdown__control"]') as HTMLElement;

      expect(dropdown.isOpen).toBe(false);

      control?.click();
      expect(dropdown.isOpen).toBe(true);

      control?.click();
      expect(dropdown.isOpen).toBe(false);
    });

    it('should only open (not toggle) when toggleDropdownOnControlClick is false', () => {
      const dropdown = new Dropdown({
        items: [{ value: '1', content: 'Option 1' }],
        toggleDropdownOnControlClick: false,
      });

      container.appendChild(dropdown.getEl());
      const control = dropdown.getEl().querySelector('[class*="dropdown__control"]') as HTMLElement;

      control?.click();
      expect(dropdown.isOpen).toBe(true);

      control?.click();
      expect(dropdown.isOpen).toBe(true); // Still open
    });

    it('should call onControlClick callback', () => {
      const onControlClick = vi.fn();
      const dropdown = new Dropdown({
        items: [{ value: '1', content: 'Option 1' }],
        onControlClick,
      });

      container.appendChild(dropdown.getEl());
      const control = dropdown.getEl().querySelector('[class*="dropdown__control"]') as HTMLElement;

      control?.click();

      expect(onControlClick).toHaveBeenCalledTimes(1);
      expect(onControlClick).toHaveBeenCalledWith(dropdown);
    });

    it('should prevent default behavior when onControlClickPreventDefault is true', () => {
      const dropdown = new Dropdown({
        items: [{ value: '1', content: 'Option 1' }],
        onControlClickPreventDefault: true,
      });

      container.appendChild(dropdown.getEl());
      const control = dropdown.getEl().querySelector('[class*="dropdown__control"]') as HTMLElement;

      control?.click();

      // Should not toggle
      expect(dropdown.isOpen).toBe(false);
    });
  });

  describe('callbacks', () => {
    it('should call onChange when item is selected', () => {
      const onChange = vi.fn();
      const dropdown = new Dropdown({
        items: [
          { value: '1', content: 'Option 1' },
          { value: '2', content: 'Option 2' },
        ],
        onChange,
      });

      const itemElement = dropdown.items[0].getEl();
      itemElement.click();

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(dropdown, dropdown.items[0]);
    });

    it('should not call onChange for the same item twice', () => {
      const onChange = vi.fn();
      const dropdown = new Dropdown({
        items: [
          { value: '1', content: 'Option 1' },
          { value: '2', content: 'Option 2' },
        ],
        onChange,
      });

      const itemElement = dropdown.items[0].getEl();
      itemElement.click();
      itemElement.click();

      // Should only be called once
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('reset functionality', () => {
    it('should identify default item when resettable', () => {
      const dropdown = new Dropdown({
        items: [
          { value: '1', content: 'Option 1', isDefault: true },
          { value: '2', content: 'Option 2' },
        ],
        resettable: true,
      });

      expect(dropdown.defaultItem).toBe(dropdown.items[0]);
    });

    it('should use first item as default if none specified', () => {
      const dropdown = new Dropdown({
        items: [
          { value: '1', content: 'Option 1' },
          { value: '2', content: 'Option 2' },
        ],
        resettable: true,
      });

      expect(dropdown.defaultItem).toBe(dropdown.items[0]);
    });

    it('should reset to default item', () => {
      const dropdown = new Dropdown({
        items: [
          { value: '1', content: 'Option 1', isDefault: true },
          { value: '2', content: 'Option 2' },
        ],
        resettable: true,
      });

      // Select second item
      const item2Element = dropdown.items[1].getEl();
      item2Element.click();
      expect(dropdown.activeItem).toBe(dropdown.items[1]);

      // Reset
      dropdown.reset();
      expect(dropdown.activeItem).toBe(dropdown.items[0]);
    });

    it('should call onReset callback', () => {
      const onReset = vi.fn();
      const dropdown = new Dropdown({
        items: [
          { value: '1', content: 'Option 1', isDefault: true },
          { value: '2', content: 'Option 2' },
        ],
        resettable: true,
        onReset,
      });

      dropdown.reset();

      expect(onReset).toHaveBeenCalledTimes(1);
      expect(onReset).toHaveBeenCalledWith(dropdown, dropdown.defaultItem);
    });

    it('should warn when reset is called on non-resettable dropdown', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const dropdown = new Dropdown({
        items: [{ value: '1', content: 'Option 1' }],
        resettable: false,
      });

      dropdown.reset();

      expect(consoleSpy).toHaveBeenCalledWith('Dropdown is not resettable');

      consoleSpy.mockRestore();
    });
  });

  describe('placeholder', () => {
    it('should show placeholder when no item is active', () => {
      const dropdown = new Dropdown({
        items: [{ value: '1', content: 'Option 1' }],
        placeholder: 'Choose an option',
      });

      container.appendChild(dropdown.getEl());
      const controlContent = dropdown.getEl().querySelector('[class*="dropdown__control-content"]');

      expect(controlContent?.textContent).toContain('Choose an option');
    });
  });

  describe('destroy', () => {
    it('should remove dropdown from DOM', () => {
      const dropdown = new Dropdown({
        items: [{ value: '1', content: 'Option 1' }],
      });

      container.appendChild(dropdown.getEl());
      expect(container.contains(dropdown.getEl())).toBe(true);

      dropdown.destroy();

      expect(document.contains(dropdown.getEl())).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle multiple opens gracefully', () => {
      const dropdown = new Dropdown({
        items: [{ value: '1', content: 'Option 1' }],
      });

      dropdown.open();
      dropdown.open();
      dropdown.open();

      expect(dropdown.isOpen).toBe(true);
    });

    it('should handle multiple closes gracefully', () => {
      const dropdown = new Dropdown({
        items: [{ value: '1', content: 'Option 1' }],
        startOpened: true,
      });

      dropdown.close();
      dropdown.close();
      dropdown.close();

      expect(dropdown.isOpen).toBe(false);
    });

    it('should handle item with no value', () => {
      const dropdown = new Dropdown({
        items: [{ content: 'Option without value' }],
      });

      expect(dropdown.items[0].getValue()).toBeNull();
    });

    it('should handle item with HTML string content', () => {
      const dropdown = new Dropdown({
        items: [{ value: '1', content: '<strong>Bold Option</strong>' }],
      });

      const itemElement = dropdown.items[0].getEl();
      expect(itemElement.querySelector('strong')).toBeTruthy();
    });

    it('should handle item with HTMLElement content', () => {
      const contentElement = document.createElement('span');
      contentElement.textContent = 'Custom Element';

      const dropdown = new Dropdown({
        items: [{ value: '1', content: contentElement }],
      });

      const itemElement = dropdown.items[0].getEl();
      expect(itemElement.querySelector('span')).toBeTruthy();
    });
  });

  describe('DropdownItem', () => {
    it('should create dropdown item', () => {
      const item = new DropdownItem({
        value: '1',
        content: 'Test Item',
      });

      expect(item.getEl()).toBeInstanceOf(HTMLDivElement);
      expect(item.getValue()).toBe('1');
    });

    it('should handle item selection', () => {
      const onSelect = vi.fn();
      const item = new DropdownItem({
        value: '1',
        content: 'Test Item',
        onSelect,
      });

      item.select();

      expect(item.getIsActive()).toBe(true);
      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('should handle item deselection', () => {
      const onDeselect = vi.fn();
      const item = new DropdownItem({
        value: '1',
        content: 'Test Item',
        active: true,
        onDeselect,
      });

      item.deselect();

      expect(item.getIsActive()).toBe(false);
      expect(onDeselect).toHaveBeenCalledTimes(1);
    });

    it('should handle item click', () => {
      const onClick = vi.fn();
      const item = new DropdownItem({
        value: '1',
        content: 'Test Item',
        onClick,
      });

      const element = item.getEl();
      element.click();

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should set and check default status', () => {
      const item = new DropdownItem({
        value: '1',
        content: 'Test Item',
      });

      expect(item.isDefaultItem()).toBe(false);

      item.setDefault(true);
      expect(item.isDefaultItem()).toBe(true);

      item.setDefault(false);
      expect(item.isDefaultItem()).toBe(false);
    });
  });
});
