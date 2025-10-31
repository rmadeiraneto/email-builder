import type { TooltipContentOptions } from './tooltip.types';

/**
 * Helper function to check if value is an HTMLElement or string
 */
function isElementOrString(value: unknown): value is HTMLElement | string {
	return typeof value === 'string' || value instanceof HTMLElement;
}

/**
 * Helper function to add multiple classes from a space-separated string
 */
function addClassesString(element: HTMLElement, classes: string): void {
	const classArray = classes.split(' ').filter(cls => cls.trim() !== '');
	classArray.forEach(cls => element.classList.add(cls));
}

/**
 * Helper function to set content (string or HTMLElement) to an element
 */
function setContent(element: HTMLElement, content: string | HTMLElement): void {
	if (typeof content === 'string') {
		element.innerHTML = content;
	} else if (content instanceof HTMLElement) {
		element.innerHTML = '';
		element.appendChild(content);
	}
}

/**
 * Class representing the content part of a tooltip
 *
 * @example
 * ```ts
 * const content = new TooltipContent({
 *   content: 'This is helpful information',
 *   extendedClasses: ['custom-tooltip']
 * });
 * document.body.appendChild(content.getEl());
 * ```
 */
export class TooltipContent {
	private options: Required<TooltipContentOptions>;
	private element: HTMLElement | null = null;

	/**
	 * Creates a new TooltipContent instance
	 *
	 * @param options - The configuration options
	 * @throws {Error} When content is not a string or HTMLElement
	 */
	constructor(options: TooltipContentOptions) {
		const defaults: Required<TooltipContentOptions> = {
			content: '',
			classPrefix: 'eb-',
			cssClass: 'tooltip-content',
			extendedClasses: []
		};

		this.options = { ...defaults, ...options };

		if (!isElementOrString(this.options.content)) {
			throw new Error(
				'TooltipContent requires a content to be provided as a string or HTMLElement'
			);
		}

		this.init();
	}

	/**
	 * Initializes the tooltip content by creating the element
	 * and setting initial content
	 */
	private init(): void {
		this.createElement();
		this.setContent();
	}

	/**
	 * Creates the DOM element for the tooltip content
	 * and sets up initial classes
	 */
	private createElement(): void {
		this.element = document.createElement('div');
		const classes = [
			`${this.options.classPrefix}${this.options.cssClass}`,
			...this.options.extendedClasses
		].join(' ');
		addClassesString(this.element, classes);
	}

	/**
	 * Sets the content of the tooltip
	 */
	private setContent(): void {
		if (this.element) {
			setContent(this.element, this.options.content);
		}
	}

	/**
	 * Gets the tooltip content's DOM element
	 *
	 * @returns The tooltip content element
	 */
	public getEl(): HTMLElement {
		if (!this.element) {
			throw new Error('TooltipContent element not initialized');
		}
		return this.element;
	}

	/**
	 * Destroys the tooltip content by removing the element from the DOM
	 */
	public destroy(): void {
		if (this.element && this.element.parentNode) {
			this.element.parentNode.removeChild(this.element);
		}
		this.element = null;
	}
}
