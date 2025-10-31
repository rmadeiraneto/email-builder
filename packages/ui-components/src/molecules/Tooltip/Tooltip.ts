import tooltipFloater from './TooltipFloater';
import { TooltipContent } from './TooltipContent';
import type { TooltipOptions } from './tooltip.types';

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
 * Creates a default question icon element
 */
function createDefaultIcon(): HTMLElement {
	const icon = document.createElement('span');
	icon.innerHTML = '?';
	icon.style.cssText = `
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: #3b82f6;
		color: white;
		font-size: 14px;
		font-weight: bold;
		cursor: help;
	`;
	return icon;
}

/**
 * A customizable tooltip component that displays contextual information
 * when hovering over or focusing on a trigger element.
 *
 * @example
 * ```ts
 * const tooltip = new Tooltip({
 *   content: 'This is helpful information',
 *   floaterOptions: {
 *     placement: 'bottom',
 *     offset: 8,
 *     shiftPadding: 5
 *   }
 * });
 *
 * document.body.appendChild(tooltip.getEl());
 * ```
 */
export class Tooltip {
	private options: Required<TooltipOptions>;
	private trigger: HTMLElement | null = null;
	private tooltipContent: TooltipContent | null = null;
	private tooltipFloater = tooltipFloater;

	/**
	 * Creates a new Tooltip instance with the specified configuration.
	 *
	 * @param options - Configuration options for the tooltip
	 * @throws {Error} When content is not provided or invalid
	 */
	constructor(options: TooltipOptions) {
		const defaults: Required<TooltipOptions> = {
			classPrefix: 'eb-',
			cssClass: 'tooltip',
			triggerExtendedClasses: [],
			tooltipExtendedClasses: [],
			onShow: () => {},
			onHide: () => {},
			trigger: createDefaultIcon(),
			content: '',
			floaterOptions: {
				placement: 'top',
				offset: 8,
				shiftPadding: 5
			}
		};

		this.options = { ...defaults, ...options };

		if (!isElementOrString(this.options.content)) {
			throw new Error(
				'Tooltip requires a content to be provided as a string or HTMLElement'
			);
		}

		this.init();
	}

	/**
	 * Initializes the tooltip component by creating DOM elements and setting up event listeners.
	 */
	private init(): void {
		this.trigger = document.createElement('div');
		const classes = [
			`${this.options.classPrefix}${this.options.cssClass}__trigger`,
			...this.options.triggerExtendedClasses
		].join(' ');
		addClassesString(this.trigger, classes);

		// Add accessibility attributes
		this.trigger.setAttribute('role', 'button');
		this.trigger.setAttribute('tabindex', '-1');
		this.trigger.setAttribute('aria-label', 'Show tooltip');

		// Set trigger content
		setContent(this.trigger, this.options.trigger);

		this.tooltipContent = new TooltipContent({
			content: this.options.content,
			extendedClasses: [
				`${this.options.classPrefix}${this.options.cssClass}__content`,
				...this.options.tooltipExtendedClasses
			]
		});

		this.attachEventListeners();
	}

	/**
	 * Sets up event listeners for mouse and keyboard interactions on the trigger element.
	 */
	private attachEventListeners(): void {
		if (!this.trigger) return;

		this.trigger.addEventListener('mouseenter', this.showTooltip.bind(this));
		this.trigger.addEventListener('mouseleave', this.hideTooltip.bind(this));
		this.trigger.addEventListener('focus', this.showTooltip.bind(this));
		this.trigger.addEventListener('blur', this.hideTooltip.bind(this));
	}

	/**
	 * Displays the tooltip with the configured content and positioning.
	 */
	public showTooltip(): void {
		if (!this.trigger || !this.tooltipContent) return;

		this.tooltipFloater.show(
			this.trigger,
			this.tooltipContent.getEl(),
			this.options.floaterOptions
		);

		if (this.options.onShow && typeof this.options.onShow === 'function') {
			this.options.onShow();
		}
	}

	/**
	 * Hides the tooltip from view and executes the onHide callback.
	 */
	public hideTooltip(): void {
		this.tooltipFloater.hide();

		if (this.options.onHide && typeof this.options.onHide === 'function') {
			this.options.onHide();
		}
	}

	/**
	 * Retrieves the DOM element that serves as the tooltip trigger.
	 *
	 * @returns The trigger element
	 *
	 * @example
	 * ```ts
	 * const trigger = tooltip.getEl();
	 * container.appendChild(trigger);
	 * ```
	 */
	public getEl(): HTMLElement {
		if (!this.trigger) {
			throw new Error('Tooltip trigger element not initialized');
		}
		return this.trigger;
	}

	/**
	 * Completely removes the tooltip from the DOM and cleans up all event listeners and references.
	 *
	 * @example
	 * ```ts
	 * tooltip.destroy(); // Removes tooltip and cleans up memory
	 * ```
	 */
	public destroy(): void {
		// Hide tooltip if visible
		if (this.tooltipFloater) {
			this.hideTooltip();
		}

		// Remove trigger element from DOM
		if (this.trigger && this.trigger.parentNode) {
			this.trigger.parentNode.removeChild(this.trigger);
		}

		// Destroy tooltip content
		if (this.tooltipContent) {
			this.tooltipContent.destroy();
		}

		// Clean up references
		this.trigger = null;
		this.tooltipContent = null;
	}
}
