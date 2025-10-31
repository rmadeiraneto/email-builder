/**
 * RadioButtonGroup tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { RadioButtonGroup } from './RadioButtonGroup';
import { RadioButtonGroupItem } from './RadioButtonGroupItem';

describe('RadioButtonGroupItem', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('initialization', () => {
    it('should create item with required props', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test Label',
      });

      expect(item.getValue()).toBe('test');
      expect(item.isSelected()).toBe(false);
      expect(item.getElement()).toBeInstanceOf(HTMLDivElement);
    });

    it('should throw error when value is missing', () => {
      expect(() => {
        new RadioButtonGroupItem({
          value: null as any,
          label: 'Test',
        });
      }).toThrow('RadioButtonGroupItem requires a value');
    });

    it('should throw error when both label and icon are missing', () => {
      expect(() => {
        new RadioButtonGroupItem({
          value: 'test',
        });
      }).toThrow('RadioButtonGroupItem requires at least a label or an icon');
    });

    it('should create item with initial selected state', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
        selected: true,
      });

      expect(item.isSelected()).toBe(true);
    });

    it('should set data-value attribute', () => {
      const item = new RadioButtonGroupItem({
        value: 'test-value',
        label: 'Test',
      });

      expect(item.getElement().getAttribute('data-value')).toBe('test-value');
    });

    it('should set data-testid attribute', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
      });

      expect(item.getElement().getAttribute('data-testid')).toBe('radio-button-group-item');
    });
  });

  describe('selection', () => {
    it('should select item', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
      });

      item.selectItem();

      expect(item.isSelected()).toBe(true);
    });

    it('should unselect item', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
        selected: true,
      });

      item.unselectItem();

      expect(item.isSelected()).toBe(false);
    });

    it('should toggle selection', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
      });

      const result1 = item.toggleSelection();
      expect(result1).toBe(true);
      expect(item.isSelected()).toBe(true);

      const result2 = item.toggleSelection();
      expect(result2).toBe(false);
      expect(item.isSelected()).toBe(false);
    });

    it('should add active class when selected', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
      });
      container.appendChild(item.getElement());

      item.selectItem();

      expect(item.getElement().className).toContain('radio-btn-group-item--active');
    });

    it('should remove active class when unselected', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
        selected: true,
      });
      container.appendChild(item.getElement());

      const hasActiveClass = Array.from(item.getElement().classList).some((cls) =>
        cls.includes('radio-btn-group-item--active') && !cls.includes('active-border')
      );
      expect(hasActiveClass).toBe(true);

      item.unselectItem();

      const stillHasActiveClass = Array.from(item.getElement().classList).some((cls) =>
        cls.includes('radio-btn-group-item--active') && !cls.includes('active-border')
      );
      expect(stillHasActiveClass).toBe(false);
    });
  });

  describe('onChange callback', () => {
    it('should call onChange when selection changes', () => {
      const onChange = vi.fn();
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
        onChange,
      });

      item.selectItem();

      expect(onChange).toHaveBeenCalledWith(true, item);
    });

    it('should not call onChange when selection does not change', () => {
      const onChange = vi.fn();
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
        selected: true,
        onChange,
      });

      item.selectItem(); // Already selected

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should call onChange on unselect', () => {
      const onChange = vi.fn();
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
        selected: true,
        onChange,
      });

      item.unselectItem();

      expect(onChange).toHaveBeenCalledWith(false, item);
    });
  });

  describe('onClick callback', () => {
    it('should call onClick when item is clicked', () => {
      const onClick = vi.fn();
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
        onClick,
      });
      container.appendChild(item.getElement());

      item.getElement().click();

      expect(onClick).toHaveBeenCalledWith(item);
    });

    it('should call onClick before changing selection', () => {
      const callOrder: string[] = [];
      const onClick = vi.fn(() => callOrder.push('click'));
      const onChange = vi.fn(() => callOrder.push('change'));

      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
        onClick,
        onChange,
      });
      container.appendChild(item.getElement());

      item.getElement().click();

      expect(callOrder).toEqual(['click', 'change']);
    });
  });

  describe('changeOnClick option', () => {
    it('should toggle selection on click when changeOnClick is true', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
        changeOnClick: true,
      });
      container.appendChild(item.getElement());

      item.getElement().click();

      expect(item.isSelected()).toBe(true);
    });

    it('should not toggle selection on click when changeOnClick is false', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
        changeOnClick: false,
      });
      container.appendChild(item.getElement());

      item.getElement().click();

      expect(item.isSelected()).toBe(false);
    });
  });

  describe('label and icon', () => {
    it('should render string label', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test Label',
      });

      expect(item.getElement().textContent).toContain('Test Label');
    });

    it('should render HTML string icon', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
        icon: '<i class="icon"></i>',
      });

      const iconEl = item.getElement().querySelector('.icon');
      expect(iconEl).toBeTruthy();
    });

    it('should render HTMLElement label', () => {
      const labelEl = document.createElement('span');
      labelEl.textContent = 'Custom Label';

      const item = new RadioButtonGroupItem({
        value: 'test',
        label: labelEl,
      });

      expect(item.getElement().textContent).toContain('Custom Label');
    });

    it('should render HTMLElement icon', () => {
      const iconEl = document.createElement('i');
      iconEl.className = 'custom-icon';

      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
        icon: iconEl,
      });

      expect(item.getElement().querySelector('.custom-icon')).toBeTruthy();
    });
  });

  describe('description tooltip', () => {
    it('should render tooltip trigger when description is provided', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
        description: 'This is a description',
      });

      const tooltipTrigger = item.getElement().querySelector(
        '[data-testid="radio-button-group-item-tooltip"]'
      );
      expect(tooltipTrigger).toBeTruthy();
      expect(tooltipTrigger?.getAttribute('title')).toBe('This is a description');
    });

    it('should not render tooltip trigger when description is not provided', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
      });

      const tooltipTrigger = item.getElement().querySelector(
        '[data-testid="radio-button-group-item-tooltip"]'
      );
      expect(tooltipTrigger).toBeNull();
    });
  });

  describe('useActiveBorder option', () => {
    it('should add active-border class when useActiveBorder is true', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
        useActiveBorder: true,
      });

      expect(item.getElement().className).toContain('radio-btn-group-item--active-border');
    });

    it('should not add active-border class when useActiveBorder is false', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
        useActiveBorder: false,
      });

      expect(item.getElement().className).not.toContain('radio-btn-group-item--active-border');
    });
  });

  describe('custom class', () => {
    it('should apply custom class', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
        class: 'custom-class',
      });

      expect(item.getElement().className).toContain('custom-class');
    });
  });

  describe('event listeners', () => {
    it('should register event listener with on()', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
      });
      const callback = vi.fn();

      item.on('change', callback);
      item.selectItem();

      expect(callback).toHaveBeenCalledWith(true, item);
    });

    it('should unregister event listener with off()', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
      });
      const callback = vi.fn();

      item.on('change', callback);
      item.off('change', callback);
      item.selectItem();

      expect(callback).not.toHaveBeenCalled();
    });

    it('should support multiple event listeners', () => {
      const item = new RadioButtonGroupItem({
        value: 'test',
        label: 'Test',
      });
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      item.on('change', callback1);
      item.on('change', callback2);
      item.selectItem();

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe('getValue()', () => {
    it('should return string value', () => {
      const item = new RadioButtonGroupItem({
        value: 'test-value',
        label: 'Test',
      });

      expect(item.getValue()).toBe('test-value');
    });

    it('should return number value', () => {
      const item = new RadioButtonGroupItem({
        value: 123,
        label: 'Test',
      });

      expect(item.getValue()).toBe(123);
    });
  });
});

describe('RadioButtonGroup', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('initialization', () => {
    it('should create group with items', () => {
      const group = new RadioButtonGroup({
        items: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ],
      });

      expect(group.getElement()).toBeInstanceOf(HTMLDivElement);
      expect(group.getItems()).toHaveLength(2);
    });

    it('should throw error when items are missing', () => {
      expect(() => {
        new RadioButtonGroup({
          items: [],
        });
      }).toThrow('RadioButtonGroup requires at least one item');
    });

    it('should accept RadioButtonGroupItem instances', () => {
      const item1 = new RadioButtonGroupItem({ value: '1', label: 'Option 1' });
      const item2 = new RadioButtonGroupItem({ value: '2', label: 'Option 2' });

      const group = new RadioButtonGroup({
        items: [item1, item2],
      });

      expect(group.getItems()).toContain(item1);
      expect(group.getItems()).toContain(item2);
    });

    it('should set data-testid attribute', () => {
      const group = new RadioButtonGroup({
        items: [{ value: '1', label: 'Option 1' }],
      });

      expect(group.getElement().getAttribute('data-testid')).toBe('radio-button-group');
    });

    it('should select first item when allowNoSelection is false and nothing is selected', () => {
      const group = new RadioButtonGroup({
        items: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ],
        allowNoSelection: false,
      });

      const selectedItems = group.getSelectedItems();
      expect(selectedItems).toHaveLength(1);
      expect(selectedItems[0]?.getValue()).toBe('1');
    });

    it('should not auto-select when allowNoSelection is true', () => {
      const group = new RadioButtonGroup({
        items: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ],
        allowNoSelection: true,
      });

      expect(group.getSelectedItems()).toHaveLength(0);
    });
  });

  describe('selection', () => {
    it('should get selected items', () => {
      const group = new RadioButtonGroup({
        items: [
          { value: '1', label: 'Option 1', selected: true },
          { value: '2', label: 'Option 2' },
          { value: '3', label: 'Option 3', selected: true },
        ],
      });

      const selected = group.getSelectedItems();
      expect(selected).toHaveLength(2);
      expect(selected[0]?.getValue()).toBe('1');
      expect(selected[1]?.getValue()).toBe('3');
    });

    it('should select item by value', () => {
      const group = new RadioButtonGroup({
        items: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ],
      });

      group.selectValue('2');

      const selected = group.getSelectedItems();
      expect(selected).toHaveLength(1);
      expect(selected[0]?.getValue()).toBe('2');
    });

    it('should unselect item by value', () => {
      const group = new RadioButtonGroup({
        items: [
          { value: '1', label: 'Option 1', selected: true },
          { value: '2', label: 'Option 2' },
        ],
      });

      group.unselectValue('1');

      expect(group.getSelectedItems()).toHaveLength(0);
    });

    it('should select item by instance', () => {
      const group = new RadioButtonGroup({
        items: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ],
      });

      const items = group.getItems();
      group.selectItem(items[1]!);

      expect(group.getSelectedItems()[0]?.getValue()).toBe('2');
    });

    it('should unselect item by instance', () => {
      const group = new RadioButtonGroup({
        items: [
          { value: '1', label: 'Option 1', selected: true },
          { value: '2', label: 'Option 2' },
        ],
      });

      const items = group.getItems();
      group.unselectItem(items[0]!);

      expect(group.getSelectedItems()).toHaveLength(0);
    });

    it('should select all items', () => {
      const group = new RadioButtonGroup({
        items: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
          { value: '3', label: 'Option 3' },
        ],
      });

      group.selectAll();

      expect(group.getSelectedItems()).toHaveLength(3);
    });

    it('should unselect all items', () => {
      const group = new RadioButtonGroup({
        items: [
          { value: '1', label: 'Option 1', selected: true },
          { value: '2', label: 'Option 2', selected: true },
          { value: '3', label: 'Option 3', selected: true },
        ],
      });

      group.unselectAll();

      expect(group.getSelectedItems()).toHaveLength(0);
    });

    it('should check if all items are selected', () => {
      const group = new RadioButtonGroup({
        items: [
          { value: '1', label: 'Option 1', selected: true },
          { value: '2', label: 'Option 2', selected: true },
        ],
      });

      expect(group.areAllItemsSelected()).toBe(true);

      group.unselectValue('1');

      expect(group.areAllItemsSelected()).toBe(false);
    });
  });

  describe('singleSelection mode', () => {
    it('should unselect other items when selecting in single selection mode', () => {
      const group = new RadioButtonGroup({
        items: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
          { value: '3', label: 'Option 3' },
        ],
        singleSelection: true,
      });
      container.appendChild(group.getElement());

      const items = group.getItems();

      // Click first item
      items[0]?.getElement().click();
      expect(group.getSelectedItems()).toHaveLength(1);
      expect(group.getSelectedItems()[0]?.getValue()).toBe('1');

      // Click second item
      items[1]?.getElement().click();
      expect(group.getSelectedItems()).toHaveLength(1);
      expect(group.getSelectedItems()[0]?.getValue()).toBe('2');
    });

    it('should allow multiple selections when singleSelection is false', () => {
      const group = new RadioButtonGroup({
        items: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ],
        singleSelection: false,
      });
      container.appendChild(group.getElement());

      const items = group.getItems();

      items[0]?.getElement().click();
      items[1]?.getElement().click();

      expect(group.getSelectedItems()).toHaveLength(2);
    });
  });

  describe('linkItemsWithSameValue option', () => {
    it('should link items with same value when enabled', () => {
      const group = new RadioButtonGroup({
        items: [
          { value: 'A', label: 'Option A1' },
          { value: 'A', label: 'Option A2' },
          { value: 'B', label: 'Option B' },
        ],
        linkItemsWithSameValue: true,
      });

      group.selectValue('A');

      const selected = group.getSelectedItems();
      expect(selected).toHaveLength(2);
      expect(selected.every((item) => item.getValue() === 'A')).toBe(true);
    });

    it('should unlink items with same value when disabled', () => {
      const group = new RadioButtonGroup({
        items: [
          { value: 'A', label: 'Option A1' },
          { value: 'A', label: 'Option A2' },
          { value: 'B', label: 'Option B' },
        ],
        linkItemsWithSameValue: false,
      });

      const items = group.getItems();
      group.selectItem(items[0]!);

      const selected = group.getSelectedItems();
      expect(selected).toHaveLength(1);
    });
  });

  describe('onChange callback', () => {
    it('should call onChange when selection changes', () => {
      const onChange = vi.fn();
      const group = new RadioButtonGroup({
        items: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ],
        onChange,
      });

      group.selectValue('1');

      expect(onChange).toHaveBeenCalled();
      const [allSelected, changedItem, selectedItems, noneSelected] = onChange.mock.calls[0] as any;
      expect(allSelected).toBe(false);
      expect(changedItem.getValue()).toBe('1');
      expect(selectedItems).toHaveLength(1);
      expect(noneSelected).toBe(false);
    });

    it('should indicate when all items are selected', () => {
      const onChange = vi.fn();
      const group = new RadioButtonGroup({
        items: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ],
        onChange,
      });

      group.selectAll();

      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1] as any;
      const [allSelected] = lastCall;
      expect(allSelected).toBe(true);
    });

    it('should indicate when no items are selected', () => {
      const onChange = vi.fn();
      const group = new RadioButtonGroup({
        items: [
          { value: '1', label: 'Option 1', selected: true },
          { value: '2', label: 'Option 2' },
        ],
        onChange,
      });

      group.unselectAll();

      const [, , , noneSelected] = onChange.mock.calls[0] as any;
      expect(noneSelected).toBe(true);
    });
  });

  describe('custom class', () => {
    it('should apply custom class', () => {
      const group = new RadioButtonGroup({
        items: [{ value: '1', label: 'Option 1' }],
        class: 'custom-group-class',
      });

      expect(group.getElement().className).toContain('custom-group-class');
    });
  });

  describe('event listeners', () => {
    it('should register event listener with on()', () => {
      const group = new RadioButtonGroup({
        items: [{ value: '1', label: 'Option 1' }],
      });
      const callback = vi.fn();

      group.on('change', callback);
      group.selectValue('1');

      expect(callback).toHaveBeenCalled();
    });

    it('should unregister event listener with off()', () => {
      const group = new RadioButtonGroup({
        items: [{ value: '1', label: 'Option 1' }],
      });
      const callback = vi.fn();

      group.on('change', callback);
      group.off('change', callback);
      group.selectValue('1');

      expect(callback).not.toHaveBeenCalled();
    });

    it('should support multiple event listeners', () => {
      const group = new RadioButtonGroup({
        items: [{ value: '1', label: 'Option 1' }],
      });
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      group.on('change', callback1);
      group.on('change', callback2);
      group.selectValue('1');

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe('destroy()', () => {
    it('should remove element from DOM', () => {
      const group = new RadioButtonGroup({
        items: [{ value: '1', label: 'Option 1' }],
      });
      container.appendChild(group.getElement());

      expect(container.children.length).toBe(1);

      group.destroy();

      expect(container.children.length).toBe(0);
    });

    it('should clear event listeners', () => {
      const group = new RadioButtonGroup({
        items: [{ value: '1', label: 'Option 1' }],
      });
      const callback = vi.fn();

      group.on('change', callback);
      group.destroy();

      // Try to trigger event after destroy
      try {
        group.selectValue('1');
      } catch (e) {
        // Element might be removed, ignore errors
      }

      // Callback should not be called because listeners were cleared
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
