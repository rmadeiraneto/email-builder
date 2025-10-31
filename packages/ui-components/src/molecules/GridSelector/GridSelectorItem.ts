import { merge } from 'lodash-es';
import type { GridSelectorItemOptions } from './grid-selector.types';
import type { GridSelector } from './GridSelector';

/**
 * Represents an individual item in the grid selector
 *
 * @example
 * ```ts
 * const item = new GridSelectorItem({
 *   content: 'Item 1',
 *   value: 'item-1',
 *   selected: false
 * }, parentSelector);
 * ```
 */
export class GridSelectorItem {
	private options: Required<GridSelectorItemOptions>;
	private parent: GridSelector;
	private className: string;
	private element: HTMLElement;
	private selected: boolean;
	private value: unknown;
	private userEnabled: boolean;

	/**
	 * Creates a new GridSelectorItem
	 * @param options - Item options
	 * @param parent - Parent GridSelector instance
	 */
	constructor(options: GridSelectorItemOptions = {}, parent: GridSelector) {
		const defaults: Required<GridSelectorItemOptions> = {
			content: '',
			selected: false,
			value: null,
			extendedClasses: '',
			userEnabled: true,
		};

		this.options = merge(defaults, options);
		this.parent = parent;
		this.className = `${parent['className']}__item`;
		this.element = document.createElement('div');
		this.selected = this.options.selected;
		this.value = this.options.value;
		this.userEnabled = this.options.userEnabled;

		this.init();
	}

	/**
	 * Initializes the item
	 */
	private init(): void {
		this.createElements();
		this.setupEventListeners();

		if (this.selected) {
			this.element.classList.add(`${this.className}--selected`);
		}

		if (this.userEnabled) {
			this.element.classList.add(`${this.className}--user-enabled`);
		}
	}

	/**
	 * Creates the item's DOM elements
	 */
	private createElements(): void {
		this.element.classList.add(this.className);
		this.element.setAttribute('data-testid', 'grid-selector-item');

		if (this.options.extendedClasses) {
			const classes = this.options.extendedClasses.split(' ').filter((c) => c.trim());
			classes.forEach((c) => this.element.classList.add(c));
		}

		// Add the content
		this.setContent(this.element, this.options.content);
	}

	/**
	 * Set content (string or HTMLElement) to an element
	 */
	private setContent(element: HTMLElement, content: string | HTMLElement): void {
		if (typeof content === 'string') {
			element.innerHTML = content;
		} else {
			element.appendChild(content);
		}
	}

	/**
	 * Sets up event listeners for the item
	 */
	private setupEventListeners(): void {
		this.element.addEventListener('click', () => {
			this.handleClick();
		});
	}

	/**
	 * Handles click events on the item
	 */
	private handleClick(): void {
		if (this.userEnabled) {
			if (this.selected) {
				this.parent['deselectItem'](this);
			} else {
				this.parent['selectItem'](this);
			}
		}
	}

	/**
	 * Selects the item
	 * @param triggerEvent - Whether to trigger selection events (not used in current implementation)
	 */
	public select(triggerEvent = true): void {
		this.selected = true;
		this.element.classList.add(`${this.className}--selected`);
	}

	/**
	 * Deselects the item
	 * @param triggerEvent - Whether to trigger deselection events (not used in current implementation)
	 */
	public deselect(triggerEvent = true): void {
		this.selected = false;
		this.element.classList.remove(`${this.className}--selected`);
	}

	/**
	 * Checks if the item is selected
	 * @returns True if the item is selected, false otherwise
	 */
	public isSelected(): boolean {
		return this.selected;
	}

	/**
	 * Gets the item's value
	 * @returns The item's value
	 */
	public getValue(): unknown {
		return this.value;
	}

	/**
	 * Returns the DOM element of the item
	 * @returns The item's DOM element
	 */
	public getEl(): HTMLElement {
		return this.element;
	}
}
