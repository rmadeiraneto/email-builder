import { merge, isEqual } from 'lodash-es';
import { GridSelectorItem } from './GridSelectorItem';
import type {
	GridSelectorOptions,
	GridSelectorEventName,
} from './grid-selector.types';

/**
 * Simple EventEmitter implementation
 */
class EventEmitter {
	private events: Map<string, Array<(...args: unknown[]) => void>> = new Map();

	on(event: string, callback: (...args: unknown[]) => void): void {
		if (!this.events.has(event)) {
			this.events.set(event, []);
		}
		this.events.get(event)!.push(callback);
	}

	off(event: string, callback?: (...args: unknown[]) => void): void {
		if (!this.events.has(event)) return;

		if (callback) {
			const callbacks = this.events.get(event)!;
			const index = callbacks.indexOf(callback);
			if (index > -1) {
				callbacks.splice(index, 1);
			}
		} else {
			this.events.delete(event);
		}
	}

	emit(event: string, ...args: unknown[]): void {
		if (!this.events.has(event)) return;
		this.events.get(event)!.forEach((callback) => callback(...args));
	}

	removeAllListeners(): void {
		this.events.clear();
	}
}

/**
 * A grid selector component that allows selecting one or multiple items from a grid layout
 *
 * @example
 * Basic usage:
 * ```ts
 * const selector = new GridSelector({
 *   items: [
 *     { content: 'Item 1', value: 1 },
 *     { content: 'Item 2', value: 2 },
 *     { content: 'Item 3', value: 3 }
 *   ],
 *   columnsCount: 3,
 *   onSelect: (selector, selectedItems) => {
 *     console.log('Selected:', selectedItems);
 *   }
 * });
 * document.body.appendChild(selector.getEl());
 * ```
 *
 * @example
 * Single selection mode:
 * ```ts
 * const selector = new GridSelector({
 *   items: [...],
 *   singleSelection: true,
 *   allowEmpty: false
 * });
 * ```
 *
 * @example
 * Responsive grid:
 * ```ts
 * const selector = new GridSelector({
 *   items: [...],
 *   columnsCount: 4, // Desktop
 *   responsiveConfig: {
 *     lg: 3, // Tablet
 *     md: 2, // Mobile
 *     sm: 1, // Small mobile
 *     breakpoints: {
 *       lg: 992,
 *       md: 768,
 *       sm: 480
 *     }
 *   }
 * });
 * ```
 */
export class GridSelector {
	private options: Required<GridSelectorOptions>;
	private className: string;
	private eventEmitter: EventEmitter;
	private element: HTMLElement;
	private items: GridSelectorItem[];
	private userEnabled: boolean;

	/**
	 * Creates a new GridSelector instance
	 * @param options - Configuration options
	 */
	constructor(options: GridSelectorOptions = {}) {
		const defaults: Required<GridSelectorOptions> = {
			classPrefix: 'eb-',
			cssClass: 'grid-selector',
			extendedClasses: '',
			items: [],
			singleSelection: false,
			columnsCount: 4,
			itemsConfig: {
				height: 'auto',
			},
			allowEmpty: true,
			onSelect: null,
			onDeselect: null,
			onSelectAll: null,
			onChange: null,
			userEnabled: true,
			responsiveConfig: {
				lg: 3,
				md: 2,
				sm: 1,
				breakpoints: {
					lg: 992,
					md: 768,
					sm: 480,
				},
			},
		};

		this.options = merge(defaults, options);
		this.className = `${this.options.classPrefix}${this.options.cssClass}`;
		this.eventEmitter = new EventEmitter();
		this.element = document.createElement('div');
		this.items = [];
		this.userEnabled = this.options.userEnabled;

		if (this.options.items.length) {
			this.init();
		} else {
			console.warn('GridSelector: No items provided.');
		}
	}

	/**
	 * Initializes the component
	 */
	private init(): void {
		this.createElements();
		this.convertItems();
		this.setupEventListeners();
		this.draw();

		// Set initial styles based on options
		this.element.style.setProperty(
			'--grid-columns',
			this.options.columnsCount.toString()
		);

		// Set item's style based on options
		// height
		this.element.style.setProperty(
			'--grid-selector-card-min-height',
			this.options.itemsConfig.height ?? null
		);

		// Apply responsive configuration if provided in options
		if (this.options.responsiveConfig) {
			const { lg, md, sm, breakpoints } =
				this.options.responsiveConfig;

			// Set column counts for different breakpoints
			if (lg !== undefined)
				this.element.style.setProperty('--grid-columns-lg', lg.toString());
			if (md !== undefined)
				this.element.style.setProperty('--grid-columns-md', md.toString());
			if (sm !== undefined)
				this.element.style.setProperty('--grid-columns-sm', sm.toString());

			// Set custom breakpoints if provided
			if (breakpoints) {
				if (breakpoints.lg !== undefined)
					this.element.style.setProperty(
						'--grid-breakpoint-lg',
						`${breakpoints.lg}px`
					);
				if (breakpoints.md !== undefined)
					this.element.style.setProperty(
						'--grid-breakpoint-md',
						`${breakpoints.md}px`
					);
				if (breakpoints.sm !== undefined)
					this.element.style.setProperty(
						'--grid-breakpoint-sm',
						`${breakpoints.sm}px`
					);
			}
		}
	}

	/**
	 * Creates the main DOM elements
	 */
	private createElements(): void {
		this.element.classList.add(this.className);
		this.element.setAttribute('data-testid', 'grid-selector');

		if (this.options.extendedClasses) {
			const classes = this.options.extendedClasses.split(' ').filter((c) => c.trim());
			classes.forEach((c) => this.element.classList.add(c));
		}
	}

	/**
	 * Converts item objects to GridSelectorItem instances
	 */
	private convertItems(): void {
		this.items = this.options.items.map((item) => {
			return new GridSelectorItem(
				{
					userEnabled: this.userEnabled,
					...item,
				},
				this
			);
		});
	}

	/**
	 * Sets up event listeners for the component
	 */
	private setupEventListeners(): void {
		if (typeof this.options.onSelect === 'function') {
			this.on('select', this.options.onSelect);
		}

		if (typeof this.options.onDeselect === 'function') {
			this.on('deselect', this.options.onDeselect);
		}

		if (typeof this.options.onSelectAll === 'function') {
			this.on('selectAll', this.options.onSelectAll);
		}

		if (typeof this.options.onChange === 'function') {
			this.on('change', this.options.onChange);
		}
	}

	/**
	 * Draws the component to the DOM
	 */
	private draw(): void {
		this.element.innerHTML = '';
		this.items.forEach((item) => {
			this.element.appendChild(item.getEl());
		});
	}

	/**
	 * Gets the selected items
	 * @returns Array of selected items
	 */
	public getSelectedItems(): GridSelectorItem[] {
		return this.items.filter((item) => item.isSelected());
	}

	/**
	 * Selects an item
	 * @param item - The item to select
	 */
	public selectItem(item: GridSelectorItem): void {
		if (!item.isSelected()) {
			if (this.options.singleSelection) {
				this.deselectAll();
			}

			item.select();
			if (this.options.singleSelection) {
				this.eventEmitter.emit('select', this, item);
				this.eventEmitter.emit('change', this, item);
			} else {
				this.eventEmitter.emit(
					'select',
					this,
					this.getSelectedItems(),
					item
				);
				this.eventEmitter.emit(
					'change',
					this,
					this.getSelectedItems(),
					item
				);
			}
		}
	}

	/**
	 * Deselects an item
	 * @param item - The item to deselect
	 */
	public deselectItem(item: GridSelectorItem): void {
		if (item.isSelected()) {
			// Check if we can deselect (if allowEmpty is false, we need at least one selected item)
			if (
				this.options.allowEmpty ||
				this.getSelectedItems().length > 1
			) {
				item.deselect();
				this.eventEmitter.emit(
					'deselect',
					this,
					this.getSelectedItems(),
					item
				);
				this.eventEmitter.emit(
					'change',
					this,
					this.getSelectedItems(),
					item
				);
			}
		}
	}

	/**
	 * Selects all items
	 */
	public selectAll(): void {
		if (this.options.singleSelection) {
			console.warn('Cannot select all items in single selection mode');
			return;
		}

		this.items.forEach((item) => {
			if (!item.isSelected()) {
				item.select(false); // Don't trigger individual events
			}
		});

		this.eventEmitter.emit('selectAll', this, this.getSelectedItems());
		this.eventEmitter.emit('change', this, this.getSelectedItems());
	}

	/**
	 * Deselects all items
	 */
	public deselectAll(): void {
		if (!this.options.allowEmpty && this.options.singleSelection) {
			console.warn('Cannot deselect all items when allowEmpty is false');
			return;
		}

		this.items.forEach((item) => {
			if (item.isSelected()) {
				item.deselect(false); // Don't trigger individual events
			}
		});

		this.eventEmitter.emit('deselectAll', this, this.getSelectedItems());
		this.eventEmitter.emit('change', this, this.getSelectedItems());
	}

	/**
	 * Gets an item by its value
	 * @param value - The value of the item to find
	 * @returns The item if found, undefined otherwise
	 */
	public getItemByValue(value: unknown): GridSelectorItem | undefined {
		return this.items.find((item) => {
			const itemValue =
				typeof item.getValue === 'function'
					? item.getValue()
					: (item as unknown as { value: unknown }).value;
			if (typeof itemValue === 'object' && itemValue !== null) {
				return isEqual(itemValue, value);
			} else {
				return itemValue === value;
			}
		});
	}

	/**
	 * Returns the DOM element of the component
	 * @returns The main DOM element
	 */
	public getEl(): HTMLElement {
		return this.element;
	}

	/**
	 * Registers an event listener
	 * @param event - Event name
	 * @param callback - Callback function
	 */
	public on(event: GridSelectorEventName, callback: (...args: unknown[]) => void): void {
		this.eventEmitter.on(event, callback);
	}

	/**
	 * Removes an event listener
	 * @param event - Event name
	 * @param callback - Callback function
	 */
	public off(event: GridSelectorEventName, callback: (...args: unknown[]) => void): void {
		this.eventEmitter.off(event, callback);
	}

	/**
	 * Destroys the component and cleans up resources
	 */
	public destroy(): void {
		this.element.remove();
		this.eventEmitter.removeAllListeners();
		this.items = [];
	}
}
