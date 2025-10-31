/**
 * ColorPicker Type Definitions
 *
 * Types for the ColorPicker component which integrates with Alwan color picker library.
 * Provides a complete color selection UI with input field, swatch, and transparency support.
 */

/**
 * Color value type options
 */
export type ColorValueType = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';

/**
 * Color object structure from Alwan
 */
export interface ColorObject {
	/** Red channel (0-255) */
	r: number;
	/** Green channel (0-255) */
	g: number;
	/** Blue channel (0-255) */
	b: number;
	/** Alpha channel (0-1) */
	a: number;
	/** Hexadecimal representation */
	hex: string;
	/** RGB string representation */
	rgb: string;
	/** RGBA string representation */
	rgba: string;
	/** HSL string representation */
	hsl: string;
	/** HSLA string representation */
	hsla: string;
}

/**
 * Alwan color picker options
 * @see https://github.com/SofianChouaib/alwan#options
 */
export interface AlwanOptions {
	/** Initial color */
	color?: string;
	/** Show preset colors */
	preset?: boolean;
	/** Position of the popover */
	position?:
		| 'top-start' | 'top-middle' | 'top-end'
		| 'bottom-start' | 'bottom-middle' | 'bottom-end'
		| 'right-start' | 'right-middle' | 'right-end'
		| 'left-start' | 'left-middle' | 'left-end';
	/** Array of color swatches */
	swatches?: string[];
	/** Show color copy button */
	copy?: boolean;
	/** Show opacity slider */
	opacity?: boolean;
	/** Enable keyboard input */
	inputs?: boolean;
	/** Theme ('light' or 'dark') */
	theme?: 'light' | 'dark';
	/** Toggle button selector */
	toggle?: boolean;
	/** Close on click outside */
	closeOnScroll?: boolean;
	/** Format of input value */
	format?: 'rgb' | 'hsl' | 'hex';
}

/**
 * Alwan color picker instance methods
 */
export interface AlwanInstance {
	/** Get current color */
	getColor(): ColorObject;
	/** Set color */
	setColor(color: string | ColorObject): AlwanInstance;
	/** Open the popover */
	open(): void;
	/** Close the popover */
	close(): void;
	/** Toggle the popover */
	toggle(): void;
	/** Trigger an event */
	trigger(event: string): void;
	/** Register event listener */
	on(event: string, callback: (ev: any) => void): void;
	/** Remove event listener */
	off(event: string, callback?: (ev: any) => void): void;
	/** Destroy the instance */
	destroy(): void;
	/** Check if popover is open */
	isOpen(): boolean;
	/** Disable the picker */
	disable(): void;
	/** Enable the picker */
	enable(): void;
	/** Check if picker is disabled */
	isDisabled(): boolean;
}

/**
 * ColorPicker change event handler
 */
export type ColorPickerChangeHandler = (
	colorPicker: ColorPicker,
	event: any
) => void;

/**
 * ColorPicker reset event handler
 */
export type ColorPickerResetHandler = (
	colorPicker: ColorPicker,
	emptyColor: string
) => void;

/**
 * ColorPicker options
 */
export interface ColorPickerOptions {
	/**
	 * CSS class prefix
	 * @default 'eb-'
	 */
	classPrefix?: string;

	/**
	 * Base CSS class name
	 * @default 'color-picker-input'
	 */
	cssClass?: string;

	/**
	 * Additional CSS classes
	 * @default ''
	 */
	extendedClasses?: string;

	/**
	 * Format of the returned color value
	 * @default 'hex'
	 */
	valueColorType?: ColorValueType;

	/**
	 * Initial color value
	 * @default null
	 */
	color?: string | null;

	/**
	 * Color to use when empty/reset
	 * Can be a string or a function that returns a string
	 * @default '#00000000'
	 */
	emptyColor?: string | (() => string);

	/**
	 * Label to display for empty color
	 * @default 'none'
	 */
	emptyColorLabel?: string;

	/**
	 * Label to display for transparent color
	 * @default 'none'
	 */
	transparentColorLabel?: string;

	/**
	 * Allow null/transparent as empty color if label is provided
	 * @default true
	 */
	allowNullEmptyColorIfLabel?: boolean;

	/**
	 * Icon element for reset button
	 * @default Close icon
	 */
	resetIcon?: HTMLElement | string;

	/**
	 * Prevent automatic opacity change from 0 to 1 when selecting a color
	 * @default false
	 */
	preventDefaultOpacityChange?: boolean;

	/**
	 * Options to pass to Alwan color picker
	 * @default { preset: false, position: 'bottom-end', swatches: [...] }
	 */
	colorPickerOptions?: AlwanOptions;

	/**
	 * Hide the input field (swatch only mode)
	 * @default false
	 */
	noInput?: boolean;

	/**
	 * Callback when color changes
	 */
	onChange?: ColorPickerChangeHandler;

	/**
	 * Callback when color is reset
	 */
	onReset?: ColorPickerResetHandler;
}

/**
 * ColorPicker event types
 */
export type ColorPickerEvent = 'change' | 'resetColor';

/**
 * ColorPicker event listener
 */
export type ColorPickerEventListener = (
	colorPicker: ColorPicker,
	...args: any[]
) => void;

/**
 * Import ColorPicker class type for type definitions
 * This is a forward declaration - actual implementation is in ColorPicker.ts
 */
export interface ColorPicker {
	/** Get the root element */
	getEl(): HTMLElement;
	/** Get the current color value */
	getColor(): string;
	/** Change the color */
	changeColor(color: string): void;
	/** Change the swatch color */
	changeSwatchColor(color: string): void;
	/** Reset to empty color */
	resetColor(redraw?: boolean): void;
	/** Get the Alwan instance */
	getColorPicker(): AlwanInstance;
	/** Check if empty color is currently set */
	emptyColorIsSet(): boolean;
	/** Register event listener */
	on(event: ColorPickerEvent, callback: ColorPickerEventListener): void;
	/** Unregister event listener */
	off(event: ColorPickerEvent, callback?: ColorPickerEventListener): void;
	/** Destroy the component */
	destroy(): void;
}
