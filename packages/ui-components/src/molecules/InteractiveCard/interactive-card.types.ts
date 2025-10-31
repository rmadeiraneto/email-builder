/**
 * InteractiveCard types
 */

/**
 * Action callback function
 */
export type InteractiveCardActionCallback = () => void;

/**
 * Action definition for the InteractiveCard
 */
export interface InteractiveCardAction {
  /**
   * Icon for the action (HTML string or element)
   */
  icon: string | HTMLElement;

  /**
   * Label text for the action
   */
  label?: string;

  /**
   * Title attribute for the action button
   */
  title?: string;

  /**
   * Callback function when action is clicked
   */
  callback: InteractiveCardActionCallback;
}

/**
 * Interaction type options
 */
export type InteractiveCardInteractionType = 'hover' | 'click';

/**
 * InteractiveCard properties
 */
export interface InteractiveCardOptions {
  /**
   * CSS class prefix
   * @default ''
   */
  classPrefix?: string;

  /**
   * Base CSS class
   * @default 'interactive-card'
   */
  cssClass?: string;

  /**
   * Additional CSS classes for root element
   * @default ''
   */
  extendedClasses?: string;

  /**
   * Additional CSS classes for content element
   * @default ''
   */
  contentExtendedClasses?: string;

  /**
   * Main content of the card (HTML string or element)
   */
  content?: string | HTMLElement | (string | HTMLElement)[];

  /**
   * Array of actions to display in the overlay
   * @default []
   */
  actions?: InteractiveCardAction[];

  /**
   * Type of interaction to trigger the overlay
   * @default 'hover'
   */
  interactionType?: InteractiveCardInteractionType;
}
