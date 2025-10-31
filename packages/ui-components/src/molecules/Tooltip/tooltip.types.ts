/**
 * Tooltip placement options
 * Based on @floating-ui/dom placement values
 */
export type TooltipPlacement =
	| 'top'
	| 'top-start'
	| 'top-end'
	| 'right'
	| 'right-start'
	| 'right-end'
	| 'bottom'
	| 'bottom-start'
	| 'bottom-end'
	| 'left'
	| 'left-start'
	| 'left-end';

/**
 * Configuration options for TooltipFloater positioning
 */
export interface TooltipFloaterOptions {
	/**
	 * Tooltip position relative to trigger element
	 * @default 'top'
	 */
	placement?: TooltipPlacement;

	/**
	 * Distance in pixels between tooltip and trigger element
	 * @default 8
	 */
	offset?: number;

	/**
	 * Padding to prevent tooltip from touching viewport edges
	 * @default 5
	 */
	shiftPadding?: number;
}

/**
 * Configuration options for TooltipContent
 */
export interface TooltipContentOptions {
	/**
	 * The content to display in the tooltip
	 * Can be a string or HTMLElement
	 */
	content: string | HTMLElement;

	/**
	 * CSS class prefix for all tooltip elements
	 * @default 'eb-'
	 */
	classPrefix?: string;

	/**
	 * Base CSS class for the tooltip content
	 * @default 'tooltip-content'
	 */
	cssClass?: string;

	/**
	 * Additional CSS classes to apply to the content element
	 * @default []
	 */
	extendedClasses?: string[];
}

/**
 * Configuration options for the Tooltip component
 */
export interface TooltipOptions {
	/**
	 * CSS class prefix for all tooltip elements
	 * @default 'eb-'
	 */
	classPrefix?: string;

	/**
	 * Base CSS class for the tooltip wrapper
	 * @default 'tooltip'
	 */
	cssClass?: string;

	/**
	 * Additional CSS classes to apply to the trigger element
	 * @default []
	 */
	triggerExtendedClasses?: string[];

	/**
	 * Additional CSS classes to apply to the tooltip content
	 * @default []
	 */
	tooltipExtendedClasses?: string[];

	/**
	 * Callback function executed when tooltip is shown
	 */
	onShow?: () => void;

	/**
	 * Callback function executed when tooltip is hidden
	 */
	onHide?: () => void;

	/**
	 * The element that triggers the tooltip
	 * Can be a string (HTML) or HTMLElement
	 * @default Question icon from datatalks-icons
	 */
	trigger?: string | HTMLElement;

	/**
	 * The content displayed in the tooltip
	 * Can be a string or HTMLElement
	 * Required
	 */
	content: string | HTMLElement;

	/**
	 * Options for the tooltip floater positioning
	 */
	floaterOptions?: TooltipFloaterOptions;
}

/**
 * Internal interface for TooltipFloater cleanup function
 */
export interface TooltipCleanupFunction {
	(): void;
}
