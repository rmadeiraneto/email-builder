import {
	computePosition,
	offset,
	flip,
	shift,
	autoUpdate
} from '@floating-ui/dom';
import type { TooltipFloaterOptions, TooltipCleanupFunction } from './tooltip.types';

/**
 * Helper function to add multiple classes from a space-separated string
 */
function addClassesString(element: HTMLElement, classes: string): void {
	const classArray = classes.split(' ').filter(cls => cls.trim() !== '');
	classArray.forEach(cls => element.classList.add(cls));
}

/**
 * Singleton provider class that manages tooltip instances and handles positioning.
 * Uses @floating-ui/dom for advanced positioning capabilities.
 *
 * @example
 * ```ts
 * import tooltipFloater from './TooltipFloater';
 *
 * tooltipFloater.show(
 *   triggerElement,
 *   contentElement,
 *   {
 *     placement: 'top',
 *     offset: 8,
 *     shiftPadding: 5
 *   }
 * );
 * ```
 */
class TooltipFloater {
	private static instance: TooltipFloater;
	private floater: HTMLElement | null = null;
	private cleanup: TooltipCleanupFunction | null = null;
	private readonly classPrefix: string = 'eb-';
	private readonly cssClass: string = 'tooltip-floater';
	private readonly hiddenClass: string;

	/**
	 * Creates the TooltipFloater instance.
	 * Private constructor enforces singleton pattern.
	 *
	 * @throws {Error} When attempting to create multiple instances
	 */
	private constructor() {
		if (TooltipFloater.instance) {
			throw new Error('You can only create one instance!');
		}
		TooltipFloater.instance = this;

		this.hiddenClass = `${this.classPrefix}${this.cssClass}--hidden`;
		this.init();
	}

	/**
	 * Initializes the tooltip floater by creating the element
	 * and appending it to the document body.
	 */
	private init(): void {
		this.floater = document.createElement('div');
		addClassesString(this.floater, `${this.classPrefix}${this.cssClass}`);

		this.hideFloater();
		this.draw();
	}

	/**
	 * Shows a tooltip with the specified content and positioning.
	 *
	 * @param trigger - The element that triggers the tooltip
	 * @param content - The content element to display in the tooltip
	 * @param options - Configuration options for the tooltip
	 */
	public show(
		trigger: HTMLElement,
		content: HTMLElement,
		options: TooltipFloaterOptions = {}
	): void {
		if (!trigger || !content || !this.floater) return;

		const defaults: Required<TooltipFloaterOptions> = {
			placement: 'top',
			offset: 8,
			shiftPadding: 5
		};

		const mergedOptions = { ...defaults, ...options };

		this.floater.appendChild(content);
		this.showFloater();

		// Automatically updates the tooltip position when the reference element or viewport changes
		this.cleanup = autoUpdate(trigger, this.floater, () => {
			if (!this.floater) return;

			computePosition(trigger, this.floater, {
				placement: mergedOptions.placement,
				middleware: [
					offset(mergedOptions.offset),
					flip(),
					shift({ padding: mergedOptions.shiftPadding })
				]
			}).then(({ x, y, strategy }) => {
				if (!this.floater) return;

				this.floater.style.setProperty('--tooltip-left', `${x}px`);
				this.floater.style.setProperty('--tooltip-top', `${y}px`);
				this.floater.style.setProperty('--tooltip-position', strategy);
			});
		});
	}

	/**
	 * Hides the current tooltip and cleans up position tracking.
	 */
	public hide(): void {
		this.hideFloater();
		this.clear();
		if (this.cleanup) {
			this.cleanup();
			this.cleanup = null;
		}
	}

	/**
	 * Clears the content of the tooltip floater element.
	 */
	private clear(): void {
		if (this.floater) {
			this.floater.innerHTML = '';
		}
	}

	/**
	 * Appends the tooltip floater element to the document body.
	 */
	private draw(): void {
		if (this.floater) {
			document.body.append(this.floater);
		}
	}

	/**
	 * Removes the hidden class from the tooltip floater if present.
	 */
	private showFloater(): void {
		if (this.floater && this.floater.classList.contains(this.hiddenClass)) {
			this.floater.classList.remove(this.hiddenClass);
		}
	}

	/**
	 * Adds the hidden class to the tooltip floater if not already present.
	 */
	private hideFloater(): void {
		if (this.floater && !this.floater.classList.contains(this.hiddenClass)) {
			this.floater.classList.add(this.hiddenClass);
		}
	}

	/**
	 * Returns the singleton instance of TooltipFloater, creating it if necessary.
	 *
	 * @returns The singleton TooltipFloater instance
	 */
	public getInstance(): TooltipFloater {
		return this;
	}

	/**
	 * Gets the floater element for testing purposes
	 *
	 * @returns The floater element
	 */
	public getFloater(): HTMLElement | null {
		return this.floater;
	}
}

/**
 * Export singleton instance
 */
export default new TooltipFloater();
