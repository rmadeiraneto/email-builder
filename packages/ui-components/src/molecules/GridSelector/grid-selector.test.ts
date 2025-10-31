import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GridSelector } from './GridSelector';
import { GridSelectorItem } from './GridSelectorItem';
import type { GridSelectorOptions } from './grid-selector.types';

describe('GridSelector', () => {
	let container: HTMLElement;

	beforeEach(() => {
		container = document.createElement('div');
		document.body.appendChild(container);
	});

	afterEach(() => {
		document.body.removeChild(container);
	});

	describe('initialization', () => {
		it('should create a GridSelector with default options', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1 },
					{ content: 'Item 2', value: 2 },
				],
			});

			expect(selector.getEl()).toBeInstanceOf(HTMLElement);
			expect(selector.getEl().classList.contains('eb-grid-selector')).toBe(true);
		});

		it('should create a GridSelector with custom class prefix', () => {
			const selector = new GridSelector({
				classPrefix: 'custom-',
				items: [{ content: 'Item 1', value: 1 }],
			});

			expect(selector.getEl().classList.contains('custom-grid-selector')).toBe(
				true
			);
		});

		it('should create a GridSelector with extended classes', () => {
			const selector = new GridSelector({
				items: [{ content: 'Item 1', value: 1 }],
				extendedClasses: 'extra-class another-class',
			});

			const el = selector.getEl();
			expect(el.classList.contains('extra-class')).toBe(true);
			expect(el.classList.contains('another-class')).toBe(true);
		});

		it('should warn if no items are provided', () => {
			const warnSpy = vi.spyOn(console, 'warn');
			new GridSelector({ items: [] });

			expect(warnSpy).toHaveBeenCalledWith('GridSelector: No items provided.');
			warnSpy.mockRestore();
		});

		it('should create items from options', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1 },
					{ content: 'Item 2', value: 2 },
					{ content: 'Item 3', value: 3 },
				],
			});

			const el = selector.getEl();
			const items = el.querySelectorAll('.eb-grid-selector__item');
			expect(items.length).toBe(3);
		});

		it('should create items with initially selected state', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1, selected: true },
					{ content: 'Item 2', value: 2 },
				],
			});

			const selectedItems = selector.getSelectedItems();
			expect(selectedItems.length).toBe(1);
			expect(selectedItems[0]?.getValue()).toBe(1);
		});

		it('should set data-testid attribute', () => {
			const selector = new GridSelector({
				items: [{ content: 'Item 1', value: 1 }],
			});

			expect(selector.getEl().getAttribute('data-testid')).toBe('grid-selector');
		});
	});

	describe('responsive configuration', () => {
		it('should set CSS custom properties for columns', () => {
			const selector = new GridSelector({
				items: [{ content: 'Item 1', value: 1 }],
				columnsCount: 5,
			});

			const el = selector.getEl();
			expect(el.style.getPropertyValue('--grid-columns')).toBe('5');
		});

		it('should set responsive column counts', () => {
			const selector = new GridSelector({
				items: [{ content: 'Item 1', value: 1 }],
				responsiveConfig: {
					lg: 4,
					md: 3,
					sm: 2,
				},
			});

			const el = selector.getEl();
			expect(el.style.getPropertyValue('--grid-columns-lg')).toBe('4');
			expect(el.style.getPropertyValue('--grid-columns-md')).toBe('3');
			expect(el.style.getPropertyValue('--grid-columns-sm')).toBe('2');
		});

		it('should set custom breakpoints', () => {
			const selector = new GridSelector({
				items: [{ content: 'Item 1', value: 1 }],
				responsiveConfig: {
					breakpoints: {
						lg: 1200,
						md: 800,
						sm: 500,
					},
				},
			});

			const el = selector.getEl();
			expect(el.style.getPropertyValue('--grid-breakpoint-lg')).toBe('1200px');
			expect(el.style.getPropertyValue('--grid-breakpoint-md')).toBe('800px');
			expect(el.style.getPropertyValue('--grid-breakpoint-sm')).toBe('500px');
		});

		it('should set item height from itemsConfig', () => {
			const selector = new GridSelector({
				items: [{ content: 'Item 1', value: 1 }],
				itemsConfig: {
					height: '200px',
				},
			});

			const el = selector.getEl();
			expect(el.style.getPropertyValue('--grid-selector-card-min-height')).toBe(
				'200px'
			);
		});
	});

	describe('selection - multi-selection mode', () => {
		it('should allow multiple items to be selected', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1 },
					{ content: 'Item 2', value: 2 },
					{ content: 'Item 3', value: 3 },
				],
			});

			const items = selector.getEl().querySelectorAll('.eb-grid-selector__item');
			items[0]?.dispatchEvent(new Event('click'));
			items[1]?.dispatchEvent(new Event('click'));

			expect(selector.getSelectedItems().length).toBe(2);
		});

		it('should select all items', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1 },
					{ content: 'Item 2', value: 2 },
					{ content: 'Item 3', value: 3 },
				],
			});

			selector.selectAll();
			expect(selector.getSelectedItems().length).toBe(3);
		});

		it('should deselect all items when allowEmpty is true', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1, selected: true },
					{ content: 'Item 2', value: 2, selected: true },
				],
				allowEmpty: true,
			});

			selector.deselectAll();
			expect(selector.getSelectedItems().length).toBe(0);
		});
	});

	describe('selection - single-selection mode', () => {
		it('should only allow one item to be selected at a time', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1 },
					{ content: 'Item 2', value: 2 },
				],
				singleSelection: true,
			});

			const items = selector.getEl().querySelectorAll('.eb-grid-selector__item');
			items[0]?.dispatchEvent(new Event('click'));
			items[1]?.dispatchEvent(new Event('click'));

			expect(selector.getSelectedItems().length).toBe(1);
			expect(selector.getSelectedItems()[0]?.getValue()).toBe(2);
		});

		it('should warn when trying to select all in single selection mode', () => {
			const warnSpy = vi.spyOn(console, 'warn');
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1 },
					{ content: 'Item 2', value: 2 },
				],
				singleSelection: true,
			});

			selector.selectAll();
			expect(warnSpy).toHaveBeenCalledWith(
				'Cannot select all items in single selection mode'
			);
			warnSpy.mockRestore();
		});

		it('should allow deselection when allowEmpty is true', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1, selected: true },
				],
				singleSelection: true,
				allowEmpty: true,
			});

			const items = selector.getEl().querySelectorAll('.eb-grid-selector__item');
			items[0]?.dispatchEvent(new Event('click'));

			expect(selector.getSelectedItems().length).toBe(0);
		});

		it('should prevent deselection when allowEmpty is false and item is last selected', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1, selected: true },
					{ content: 'Item 2', value: 2 },
				],
				singleSelection: true,
				allowEmpty: false,
			});

			const items = selector.getEl().querySelectorAll('.eb-grid-selector__item');
			items[0]?.dispatchEvent(new Event('click'));

			expect(selector.getSelectedItems().length).toBe(1);
		});
	});

	describe('allowEmpty option', () => {
		it('should prevent deselecting the last selected item when allowEmpty is false', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1, selected: true },
					{ content: 'Item 2', value: 2 },
				],
				allowEmpty: false,
			});

			const items = selector.getEl().querySelectorAll('.eb-grid-selector__item');
			items[0]?.dispatchEvent(new Event('click'));

			expect(selector.getSelectedItems().length).toBe(1);
		});

		it('should allow deselecting when multiple items are selected', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1, selected: true },
					{ content: 'Item 2', value: 2, selected: true },
				],
				allowEmpty: false,
			});

			const items = selector.getEl().querySelectorAll('.eb-grid-selector__item');
			items[0]?.dispatchEvent(new Event('click'));

			expect(selector.getSelectedItems().length).toBe(1);
		});
	});

	describe('event system', () => {
		it('should call onSelect callback when item is selected', () => {
			const onSelect = vi.fn();
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1 },
					{ content: 'Item 2', value: 2 },
				],
				onSelect,
			});

			const items = selector.getEl().querySelectorAll('.eb-grid-selector__item');
			items[0]?.dispatchEvent(new Event('click'));

			expect(onSelect).toHaveBeenCalledTimes(1);
			expect(onSelect).toHaveBeenCalledWith(
				selector,
				expect.any(Array),
				expect.any(GridSelectorItem)
			);
		});

		it('should call onDeselect callback when item is deselected', () => {
			const onDeselect = vi.fn();
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1, selected: true },
					{ content: 'Item 2', value: 2 },
				],
				onDeselect,
			});

			const items = selector.getEl().querySelectorAll('.eb-grid-selector__item');
			items[0]?.dispatchEvent(new Event('click'));

			expect(onDeselect).toHaveBeenCalledTimes(1);
		});

		it('should call onSelectAll callback when all items are selected', () => {
			const onSelectAll = vi.fn();
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1 },
					{ content: 'Item 2', value: 2 },
				],
				onSelectAll,
			});

			selector.selectAll();
			expect(onSelectAll).toHaveBeenCalledTimes(1);
		});

		it('should call onChange callback on any selection change', () => {
			const onChange = vi.fn();
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1 },
					{ content: 'Item 2', value: 2 },
				],
				onChange,
			});

			const items = selector.getEl().querySelectorAll('.eb-grid-selector__item');
			items[0]?.dispatchEvent(new Event('click'));

			expect(onChange).toHaveBeenCalledTimes(1);
		});

		it('should support on/off event listeners', () => {
			const callback = vi.fn();
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1 },
					{ content: 'Item 2', value: 2 },
				],
			});

			selector.on('select', callback);
			const items = selector.getEl().querySelectorAll('.eb-grid-selector__item');
			items[0]?.dispatchEvent(new Event('click'));

			expect(callback).toHaveBeenCalledTimes(1);

			selector.off('select', callback);
			items[1]?.dispatchEvent(new Event('click'));

			expect(callback).toHaveBeenCalledTimes(1); // Still 1, not called again
		});

		it('should pass correct arguments to callbacks in single selection mode', () => {
			const onSelect = vi.fn();
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1 },
				],
				singleSelection: true,
				onSelect,
			});

			const items = selector.getEl().querySelectorAll('.eb-grid-selector__item');
			items[0]?.dispatchEvent(new Event('click'));

			expect(onSelect).toHaveBeenCalledWith(
				selector,
				expect.any(GridSelectorItem)
			);
		});
	});

	describe('getItemByValue', () => {
		it('should find item by primitive value', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1 },
					{ content: 'Item 2', value: 2 },
					{ content: 'Item 3', value: 3 },
				],
			});

			const item = selector.getItemByValue(2);
			expect(item).toBeDefined();
			expect(item?.getValue()).toBe(2);
		});

		it('should find item by object value using deep equality', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: { id: 1, name: 'First' } },
					{ content: 'Item 2', value: { id: 2, name: 'Second' } },
				],
			});

			const item = selector.getItemByValue({ id: 2, name: 'Second' });
			expect(item).toBeDefined();
			expect(item?.getValue()).toEqual({ id: 2, name: 'Second' });
		});

		it('should return undefined if value is not found', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1 },
					{ content: 'Item 2', value: 2 },
				],
			});

			const item = selector.getItemByValue(999);
			expect(item).toBeUndefined();
		});
	});

	describe('public API', () => {
		it('should return selected items', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1, selected: true },
					{ content: 'Item 2', value: 2 },
					{ content: 'Item 3', value: 3, selected: true },
				],
			});

			const selectedItems = selector.getSelectedItems();
			expect(selectedItems.length).toBe(2);
			expect(selectedItems[0]?.getValue()).toBe(1);
			expect(selectedItems[1]?.getValue()).toBe(3);
		});

		it('should select item programmatically', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1 },
					{ content: 'Item 2', value: 2 },
				],
			});

			const item = selector.getItemByValue(2);
			if (item) {
				selector.selectItem(item);
			}

			expect(selector.getSelectedItems().length).toBe(1);
			expect(selector.getSelectedItems()[0]?.getValue()).toBe(2);
		});

		it('should deselect item programmatically', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1, selected: true },
					{ content: 'Item 2', value: 2, selected: true },
				],
			});

			const item = selector.getItemByValue(1);
			if (item) {
				selector.deselectItem(item);
			}

			expect(selector.getSelectedItems().length).toBe(1);
			expect(selector.getSelectedItems()[0]?.getValue()).toBe(2);
		});

		it('should return the DOM element', () => {
			const selector = new GridSelector({
				items: [{ content: 'Item 1', value: 1 }],
			});

			const el = selector.getEl();
			expect(el).toBeInstanceOf(HTMLElement);
			expect(el.classList.contains('eb-grid-selector')).toBe(true);
		});

		it('should destroy the component', () => {
			const selector = new GridSelector({
				items: [{ content: 'Item 1', value: 1 }],
			});

			container.appendChild(selector.getEl());
			expect(container.children.length).toBe(1);

			selector.destroy();
			expect(container.children.length).toBe(0);
		});
	});

	describe('GridSelectorItem', () => {
		it('should create item with content', () => {
			const selector = new GridSelector({
				items: [{ content: 'Test Content', value: 1 }],
			});

			const item = selector.getEl().querySelector('.eb-grid-selector__item');
			expect(item?.textContent).toBe('Test Content');
		});

		it('should create item with HTML element content', () => {
			const customElement = document.createElement('span');
			customElement.textContent = 'Custom Element';

			const selector = new GridSelector({
				items: [{ content: customElement, value: 1 }],
			});

			const item = selector.getEl().querySelector('.eb-grid-selector__item span');
			expect(item?.textContent).toBe('Custom Element');
		});

		it('should add selected class when item is selected', () => {
			const selector = new GridSelector({
				items: [{ content: 'Item 1', value: 1 }],
			});

			const item = selector.getEl().querySelector('.eb-grid-selector__item');
			expect(
				item?.classList.contains('eb-grid-selector__item--selected')
			).toBe(false);

			item?.dispatchEvent(new Event('click'));
			expect(
				item?.classList.contains('eb-grid-selector__item--selected')
			).toBe(true);
		});

		it('should add user-enabled class when userEnabled is true', () => {
			const selector = new GridSelector({
				items: [{ content: 'Item 1', value: 1 }],
			});

			const item = selector.getEl().querySelector('.eb-grid-selector__item');
			expect(
				item?.classList.contains('eb-grid-selector__item--user-enabled')
			).toBe(true);
		});

		it('should not respond to clicks when userEnabled is false', () => {
			const selector = new GridSelector({
				items: [{ content: 'Item 1', value: 1 }],
				userEnabled: false,
			});

			const item = selector.getEl().querySelector('.eb-grid-selector__item');
			item?.dispatchEvent(new Event('click'));

			expect(selector.getSelectedItems().length).toBe(0);
		});

		it('should add extended classes to item', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1, extendedClasses: 'custom-item' },
				],
			});

			const item = selector.getEl().querySelector('.eb-grid-selector__item');
			expect(item?.classList.contains('custom-item')).toBe(true);
		});

		it('should set data-testid attribute on items', () => {
			const selector = new GridSelector({
				items: [{ content: 'Item 1', value: 1 }],
			});

			const item = selector.getEl().querySelector('.eb-grid-selector__item');
			expect(item?.getAttribute('data-testid')).toBe('grid-selector-item');
		});
	});

	describe('edge cases', () => {
		it('should handle selecting already selected item', () => {
			const selector = new GridSelector({
				items: [{ content: 'Item 1', value: 1, selected: true }],
			});

			const item = selector.getItemByValue(1);
			if (item) {
				selector.selectItem(item);
			}

			expect(selector.getSelectedItems().length).toBe(1);
		});

		it('should handle deselecting already deselected item', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 1 },
					{ content: 'Item 2', value: 2, selected: true },
				],
			});

			const item = selector.getItemByValue(1);
			if (item) {
				selector.deselectItem(item);
			}

			expect(selector.getSelectedItems().length).toBe(1);
		});

		it('should handle null values', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: null },
					{ content: 'Item 2', value: 2 },
				],
			});

			const item = selector.getItemByValue(null);
			expect(item).toBeDefined();
		});

		it('should handle string values', () => {
			const selector = new GridSelector({
				items: [
					{ content: 'Item 1', value: 'first' },
					{ content: 'Item 2', value: 'second' },
				],
			});

			const item = selector.getItemByValue('second');
			expect(item).toBeDefined();
			expect(item?.getValue()).toBe('second');
		});
	});
});
