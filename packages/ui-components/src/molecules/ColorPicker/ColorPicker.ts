/**
 * ColorPicker Component
 *
 * A color input component with integration to Alwan color picker library.
 * Features include:
 * - Color swatch preview
 * - Text input for color values
 * - Transparency support
 * - Reset to empty/default color
 * - Multiple color format outputs (hex, rgb, rgba, hsl, hsla)
 *
 * @example
 * ```ts
 * const colorPicker = new ColorPicker({
 *   color: '#3b82f6',
 *   onChange: (picker, event) => {
 *     console.log('Color changed:', picker.getColor());
 *   }
 * });
 * document.body.appendChild(colorPicker.getEl());
 * ```
 */

import Alwan from 'alwan';
import { toHex } from 'color2k';
import { mergeWith } from 'lodash-es';
import styles from './color-picker.module.scss';
import type {
	ColorPickerOptions,
	ColorObject,
	AlwanInstance,
	ColorPickerEvent,
	ColorPickerEventListener
} from './color-picker.types';

/**
 * Event emitter for managing component events
 */
class EventEmitter {
	private events: Map<string, Array<(...args: any[]) => void>> = new Map();

	on(event: string, callback: (...args: any[]) => void): void {
		if (!this.events.has(event)) {
			this.events.set(event, []);
		}
		this.events.get(event)!.push(callback);
	}

	off(event: string, callback?: (...args: any[]) => void): void {
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

	emit(event: string, ...args: any[]): void {
		if (!this.events.has(event)) return;

		const callbacks = this.events.get(event)!;
		callbacks.forEach(callback => callback(...args));
	}

	removeAllListeners(): void {
		this.events.clear();
	}
}

/**
 * Default color swatches
 */
const DEFAULT_SWATCHES = [
	'#1F1451',
	'#9B51E0',
	'#A5A6F6',
	'#2F80ED',
	'#56CCF2',
	'#7ED286',
	'#219653',
	'#F95540',
	'#F35625',
	'#FFCD70',
	'#FDDDD3'
];

export class ColorPicker {
	private options: Required<ColorPickerOptions>;
	private className: string;
	private element: HTMLDivElement;
	private input?: HTMLInputElement;
	private resetBtn?: HTMLDivElement;
	private swatch: HTMLDivElement;
	private transparentCnt: HTMLDivElement;
	private colorPicker: AlwanInstance;
	private colorObj: ColorObject;
	private color: string;
	private isTransparent: boolean = false;
	private hasEmptyColor: boolean;
	private emptyColorIsFunc: boolean = false;
	private emptyColor: string;
	private eventEmitter: EventEmitter;

	constructor(options: ColorPickerOptions = {}) {
		const defaults: Required<ColorPickerOptions> = {
			classPrefix: 'eb-',
			cssClass: 'color-picker-input',
			extendedClasses: '',
			valueColorType: 'hex',
			color: null,
			emptyColor: '#00000000',
			emptyColorLabel: 'none',
			transparentColorLabel: 'none',
			allowNullEmptyColorIfLabel: true,
			resetIcon: this.createDefaultResetIcon(),
			preventDefaultOpacityChange: false,
			colorPickerOptions: {
				preset: false,
				position: 'bottom-end',
				swatches: DEFAULT_SWATCHES
			},
			noInput: false,
			onChange: null,
			onReset: null
		};

		// Merge options with custom array handling
		this.options = mergeWith(defaults, options, (objValue, srcValue) => {
			if (Array.isArray(objValue)) {
				return srcValue?.length ? srcValue : objValue;
			}
		}) as Required<ColorPickerOptions>;

		this.className = `${this.options.classPrefix}${this.options.cssClass}`;

		// Determine if empty color is available
		this.hasEmptyColor =
			(typeof this.options.emptyColor !== 'function' &&
				!!this.options.emptyColor) ||
			(typeof this.options.emptyColor === 'function' &&
				!!this.options.emptyColor()) ||
			(this.options.allowNullEmptyColorIfLabel &&
				!!this.options.emptyColorLabel);

		// Set up empty color
		if (this.hasEmptyColor) {
			this.emptyColorIsFunc =
				typeof this.options.emptyColor === 'function';
			this.emptyColor = this.emptyColorIsFunc
				? (this.options.emptyColor as () => string)()
				: (this.options.emptyColor as string);
			this.emptyColor = this.emptyColor || 'transparent';
			this.color = this.options.color || this.emptyColor;
		} else {
			this.emptyColor = 'transparent';
			this.color = this.options.color || 'transparent';
		}

		this.eventEmitter = new EventEmitter();

		this.init();
	}

	/**
	 * Initialize the component
	 */
	private init(): void {
		this.createElement();
		if (!this.options.noInput) this.createInput();
		if (!this.options.noInput) this.createResetBtn();
		this.createSwatch();
		this.createTransparentCnt();
		this.initColorPicker();
		this.setupPickerEvents();
		this.draw();
	}

	/**
	 * Create the root element
	 */
	private createElement(): void {
		this.element = document.createElement('div');
		this.element.className = styles['color-picker-input'];

		if (this.options.noInput) {
			this.element.classList.add(styles['color-picker-input--no-input']);
		}

		if (this.options.extendedClasses) {
			this.addClassesString(this.element, this.options.extendedClasses);
		}
	}

	/**
	 * Create the input element
	 */
	private createInput(): void {
		this.input = document.createElement('input');
		this.input.className = `eb-input ${styles['color-picker-input__input']}`;
		this.input.type = 'text';
		this.input.readOnly = true;

		if (this.hasEmptyColor) {
			this.input.value = this.getColor() || this.emptyColor;
		} else {
			this.input.value = this.getColor();
		}
	}

	/**
	 * Create the reset button
	 */
	private createResetBtn(): void {
		this.resetBtn = document.createElement('div');
		this.resetBtn.className = styles['color-picker-input__reset-btn'];

		// Set reset icon content
		if (typeof this.options.resetIcon === 'string') {
			this.resetBtn.innerHTML = this.options.resetIcon;
		} else {
			this.resetBtn.appendChild(this.options.resetIcon as HTMLElement);
		}

		this.resetBtn.addEventListener('click', () => {
			this.resetColor(true);
		});
	}

	/**
	 * Create the color swatch element
	 */
	private createSwatch(): void {
		this.swatch = document.createElement('div');
		this.swatch.className = styles['color-picker-input__swatch'];
		this.swatch.setAttribute('data-testid', 'color-picker-swatch');
	}

	/**
	 * Create the transparent indicator container
	 */
	private createTransparentCnt(): void {
		this.transparentCnt = document.createElement('div');
		this.transparentCnt.className =
			styles['color-picker-input__transparent-sign'];
		this.transparentCnt.setAttribute('data-testid', 'color-picker-transparent');
	}

	/**
	 * Initialize the Alwan color picker
	 */
	private initColorPicker(): void {
		this.colorPicker = new Alwan(this.element, {
			...this.options.colorPickerOptions,
			color: this.getColor()
		}) as unknown as AlwanInstance;

		this.colorObj = this.colorPicker.getColor();
		this.setTransparent(this.colorObj.a === 0);

		if (!this.options.noInput) {
			this.updateInputValue();
		}
	}

	/**
	 * Set up event listeners for the color picker
	 */
	private setupPickerEvents(): void {
		this.colorPicker.on('change', (event: any) => {
			this.onChange(event);
		});

		// Handle window messages for closing the picker
		const messageListener = (ev: MessageEvent) => {
			if (
				ev.data === 'click' &&
				typeof this.colorPicker?.close === 'function'
			) {
				this.colorPicker.close();
			}
		};

		this.colorPicker.on('open', () => {
			window.addEventListener('message', messageListener);
		});

		this.colorPicker.on('close', () => {
			window.removeEventListener('message', messageListener);
		});
	}

	/**
	 * Handle color change events
	 */
	private onChange(event: any): void {
		// Auto-set opacity to 1 when selecting a color from full transparent
		if (
			!this.options.preventDefaultOpacityChange &&
			this.isFullTransparent() &&
			this.hasColorValue(event) &&
			this.colorIsTransparent(event)
		) {
			this.colorPicker.setColor({
				...this.colorPicker.getColor(),
				a: 1
			});
		}

		this.colorObj = this.colorPicker.getColor();
		this.setTransparent(this.colorObj.a === 0);
		this.setColor(this.colorObj);

		if (!this.options.noInput) {
			this.updateInputValue();
		}

		// Trigger callbacks
		if (typeof this.options.onChange === 'function') {
			this.options.onChange(this, event);
		}

		this.eventEmitter.emit('change', this, event);

		// Redraw if empty color state changed
		if (this.hasEmptyColor && !this.emptyColorIsSet()) {
			this.draw();
		}
	}

	/**
	 * Check if current color is fully transparent (no color and no alpha)
	 */
	private isFullTransparent(): boolean {
		return this.colorIsFullTransparent(this.colorObj);
	}

	/**
	 * Check if a color object is fully transparent
	 */
	private colorIsFullTransparent(colorObj: ColorObject): boolean {
		return !colorObj.r && !colorObj.g && !colorObj.b && !colorObj.a;
	}

	/**
	 * Check if a color object has zero alpha
	 */
	private colorIsTransparent(colorObj: ColorObject): boolean {
		return !colorObj.a;
	}

	/**
	 * Check if a color object has any RGB values
	 */
	private hasColorValue(colorObj: ColorObject): boolean {
		return !(!colorObj.r && !colorObj.g && !colorObj.b);
	}

	/**
	 * Set the internal color value from a color object
	 */
	private setColor(colorObj: ColorObject): void {
		this.color =
			colorObj[this.options.valueColorType] || colorObj.hex;
	}

	/**
	 * Update the input field value
	 */
	private updateInputValue(): void {
		if (!this.input) return;

		if (this.shouldDisplayEmpty()) {
			this.input.value = this.options.emptyColorLabel;
		} else if (this.isTransparent) {
			this.input.value = this.options.transparentColorLabel;
		} else {
			this.input.value = this.getColor();
		}
	}

	/**
	 * Check if we should display the empty label
	 */
	private shouldDisplayEmpty(): boolean {
		return (
			(this.isTransparent &&
				this.options.allowNullEmptyColorIfLabel &&
				!!this.options.emptyColorLabel) ||
			(this.hasEmptyColor &&
				toHex(this.getColor()) === toHex(this.emptyColor))
		);
	}

	/**
	 * Set transparent state and update UI
	 */
	private setTransparent(isTransparent: boolean): void {
		if (this.isTransparent !== isTransparent) {
			this.isTransparent = isTransparent;
			this.handleTransparencyChange();
		}
	}

	/**
	 * Handle transparency state change
	 */
	private handleTransparencyChange(): void {
		if (this.isTransparent) {
			this.element.classList.add(
				styles['color-picker-input--transparent']
			);
		} else {
			this.element.classList.remove(
				styles['color-picker-input--transparent']
			);
		}
	}

	/**
	 * Remove the reset button from the DOM
	 */
	private removeResetBtn(): void {
		if (this.resetBtn && this.element.contains(this.resetBtn)) {
			this.element.removeChild(this.resetBtn);
		}
	}

	/**
	 * Render the component
	 */
	private draw(): void {
		// Clear existing content
		this.element.innerHTML = '';

		// Add elements in order
		if (!this.options.noInput && this.input) {
			this.element.appendChild(this.input);
		}

		if (
			!this.options.noInput &&
			this.resetBtn &&
			this.hasEmptyColor &&
			!this.emptyColorIsSet()
		) {
			this.element.appendChild(this.resetBtn);
		}

		this.element.appendChild(this.swatch);
		this.element.appendChild(this.transparentCnt);
	}

	/**
	 * Add multiple CSS classes from a space-separated string
	 */
	private addClassesString(element: HTMLElement, classes: string): void {
		const classList = classes.split(' ').filter(c => c.trim());
		element.classList.add(...classList);
	}

	/**
	 * Create default reset icon (close icon)
	 */
	private createDefaultResetIcon(): HTMLElement {
		const icon = document.createElement('i');
		icon.className = 'ri-close-line';
		return icon;
	}

	// Public API

	/**
	 * Get the root element
	 */
	public getEl(): HTMLElement {
		return this.element;
	}

	/**
	 * Get the current color value
	 */
	public getColor(): string {
		return typeof this.color === 'function' ? this.color() : this.color;
	}

	/**
	 * Change the color programmatically
	 */
	public changeColor(color: string): void {
		this.colorPicker.setColor(color);
	}

	/**
	 * Change the swatch color
	 * Alias for changeColor()
	 */
	public changeSwatchColor(color: string): void {
		this.colorPicker.setColor(color);
	}

	/**
	 * Reset color to empty/default value
	 */
	public resetColor(redraw: boolean = true): void {
		if (this.emptyColorIsFunc) {
			const emptyColorValue =
				(this.options.emptyColor as () => string)() || 'transparent';
			this.colorPicker.setColor(emptyColorValue).trigger('change');

			if (emptyColorValue !== this.emptyColor) {
				this.emptyColor = emptyColorValue;
			}
		} else {
			this.colorPicker.setColor(this.emptyColor).trigger('change');
		}

		this.colorObj = this.colorPicker.getColor();
		this.setTransparent(this.colorObj.a === 0);
		this.setColor(this.colorObj);

		if (redraw) {
			this.draw();
		}

		if (!this.options.noInput) {
			this.updateInputValue();
		}

		this.eventEmitter.emit('resetColor', this, this.emptyColor);

		if (typeof this.options.onReset === 'function') {
			this.options.onReset(this, this.emptyColor);
		}
	}

	/**
	 * Check if the empty color is currently set
	 */
	public emptyColorIsSet(): boolean {
		return this.getColor() === this.emptyColor;
	}

	/**
	 * Get the Alwan color picker instance
	 */
	public getColorPicker(): AlwanInstance {
		return this.colorPicker;
	}

	/**
	 * Register an event listener
	 */
	public on(
		event: ColorPickerEvent,
		callback: ColorPickerEventListener
	): void {
		this.eventEmitter.on(event, callback);
	}

	/**
	 * Unregister an event listener
	 */
	public off(
		event: ColorPickerEvent,
		callback?: ColorPickerEventListener
	): void {
		this.eventEmitter.off(event, callback);
	}

	/**
	 * Destroy the component and clean up
	 */
	public destroy(): void {
		if (typeof this.colorPicker.destroy === 'function') {
			this.colorPicker.destroy();
		}

		this.eventEmitter.removeAllListeners();
		this.element.remove();
	}
}
