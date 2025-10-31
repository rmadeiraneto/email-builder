/**
 * Type definitions for GridSelector component
 * A grid selector component that allows selecting one or multiple items from a grid layout.
 */

/**
 * Breakpoint values for responsive behavior
 */
export interface ResponsiveBreakpoints {
	/**
	 * Large breakpoint in pixels
	 * @default 992
	 */
	lg?: number;

	/**
	 * Medium breakpoint in pixels
	 * @default 768
	 */
	md?: number;

	/**
	 * Small breakpoint in pixels
	 * @default 480
	 */
	sm?: number;
}

/**
 * Responsive configuration for the GridSelector
 */
export interface ResponsiveConfig {
	/**
	 * Number of columns for large devices/tablets
	 * @default 3
	 */
	lg?: number;

	/**
	 * Number of columns for medium devices/mobile
	 * @default 2
	 */
	md?: number;

	/**
	 * Number of columns for small devices/small mobile
	 * @default 1
	 */
	sm?: number;

	/**
	 * Custom breakpoint values
	 */
	breakpoints?: ResponsiveBreakpoints;
}

/**
 * Configuration for grid items
 */
export interface GridSelectorItemsConfig {
	/**
	 * Height of grid items
	 * @default 'auto'
	 */
	height?: string;
}

/**
 * Options to configure a GridSelector Item
 */
export interface GridSelectorItemOptions {
	/**
	 * The content of the item (HTML string or element)
	 */
	content?: string | HTMLElement;

	/**
	 * Whether the item is initially selected
	 * @default false
	 */
	selected?: boolean;

	/**
	 * The value associated with this item
	 */
	value?: unknown;

	/**
	 * Additional CSS classes for the item
	 */
	extendedClasses?: string;

	/**
	 * Whether user interaction is enabled
	 * @default true
	 */
	userEnabled?: boolean;
}

/**
 * Callback function for selection events
 * @param selector - The grid selector instance
 * @param selectedItems - Array of currently selected items (single item in single selection mode)
 * @param changedItem - The item that triggered the event (optional)
 */
export type GridSelectorCallback = (
	selector: unknown, // Will be GridSelector in implementation
	selectedItems: unknown[] | unknown, // GridSelectorItem[] or GridSelectorItem
	changedItem?: unknown // GridSelectorItem
) => void;

/**
 * Options to configure the GridSelector
 */
export interface GridSelectorOptions {
	/**
	 * A prefix to add to all the class names
	 * @default 'eb-'
	 */
	classPrefix?: string;

	/**
	 * The base CSS class of the grid selector
	 * @default 'grid-selector'
	 */
	cssClass?: string;

	/**
	 * Additional CSS classes to add to the grid wrapper
	 */
	extendedClasses?: string;

	/**
	 * An array of items to display in the grid
	 */
	items?: GridSelectorItemOptions[];

	/**
	 * If true, only one item can be selected at a time
	 * @default false
	 */
	singleSelection?: boolean;

	/**
	 * Number of columns in the grid
	 * @default 4
	 */
	columnsCount?: number;

	/**
	 * Configuration for grid items
	 */
	itemsConfig?: GridSelectorItemsConfig;

	/**
	 * If true, all items can be deselected. If false, at least one item must be selected
	 * @default true
	 */
	allowEmpty?: boolean;

	/**
	 * Callback function when an item is selected
	 */
	onSelect?: GridSelectorCallback | null;

	/**
	 * Callback function when an item is deselected
	 */
	onDeselect?: GridSelectorCallback | null;

	/**
	 * Callback function when all items are selected
	 */
	onSelectAll?: GridSelectorCallback | null;

	/**
	 * Callback function when any selection change occurs
	 */
	onChange?: GridSelectorCallback | null;

	/**
	 * Whether user interaction is enabled
	 * @default true
	 */
	userEnabled?: boolean;

	/**
	 * Configuration for responsive behavior
	 *
	 * The grid supports responsive behavior through CSS variables:
	 * - --grid-columns: Default number of columns (desktop)
	 * - --grid-columns-lg: Columns at large breakpoint (tablet)
	 * - --grid-columns-md: Columns at medium breakpoint (mobile)
	 * - --grid-columns-sm: Columns at small breakpoint (small mobile)
	 *
	 * You can also customize the breakpoints:
	 * - --grid-breakpoint-lg: Large breakpoint (default: 992px)
	 * - --grid-breakpoint-md: Medium breakpoint (default: 768px)
	 * - --grid-breakpoint-sm: Small breakpoint (default: 480px)
	 */
	responsiveConfig?: ResponsiveConfig;
}

/**
 * Event names for the GridSelector
 */
export type GridSelectorEventName =
	| 'select'
	| 'deselect'
	| 'selectAll'
	| 'deselectAll'
	| 'change';
