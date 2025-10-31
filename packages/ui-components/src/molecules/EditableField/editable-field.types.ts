/**
 * Type definitions for EditableField component
 */

/**
 * Event types emitted by EditableField
 */
export type EditableFieldEvent = 'edit' | 'save' | 'discard' | 'inputChange';

/**
 * Callback function for edit event
 * Called when the field enters edit mode
 */
export type OnEditCallback = (instance: EditableField) => void;

/**
 * Callback function for save event
 * Called when the save button is clicked
 */
export type OnSaveCallback = (value: string, instance: EditableField) => void;

/**
 * Callback function for discard event
 * Called when the discard button is clicked
 */
export type OnDiscardCallback = (instance: EditableField) => void;

/**
 * Callback function for input change event
 * Called when the input value changes
 */
export type OnInputChangeCallback = (value: string) => void;

/**
 * Event listener callback type
 */
export type EditableFieldEventCallback = (...args: any[]) => void;

/**
 * Icons configuration for EditableField
 * Each icon can be a string (HTML) or an HTMLElement
 */
export interface EditableFieldIcons {
  /**
   * Icon for edit button (view mode)
   */
  edit?: string | HTMLElement | null;

  /**
   * Icon for save button (edit mode)
   */
  save?: string | HTMLElement | null;

  /**
   * Icon for discard button (edit mode)
   */
  discard?: string | HTMLElement | null;
}

/**
 * Configuration options for EditableField component
 */
export interface EditableFieldOptions {
  /**
   * Initial value of the field
   * @default ''
   */
  value?: string;

  /**
   * CSS class prefix for BEM methodology
   * @default 'eb-'
   */
  classPrefix?: string;

  /**
   * Base CSS class name
   * @default 'editable-field'
   */
  className?: string;

  /**
   * Additional CSS classes to add to the root element
   * Space-separated string of class names
   * @default ''
   */
  extendedClasses?: string;

  /**
   * Icons configuration
   * If not provided, default icons will be used
   */
  icons?: EditableFieldIcons;

  /**
   * Size of the icons
   * @default 'md'
   */
  iconsSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Callback when field enters edit mode
   */
  onEdit?: OnEditCallback | null;

  /**
   * Callback when save button is clicked
   */
  onSave?: OnSaveCallback | null;

  /**
   * Callback when discard button is clicked
   */
  onDiscard?: OnDiscardCallback | null;

  /**
   * Callback when input value changes
   */
  onInputChange?: OnInputChangeCallback | null;

  /**
   * Whether to start in edit mode
   * @default false
   */
  startEditing?: boolean;

  /**
   * Whether to show an edit button in view mode
   * If false, clicking the label will enter edit mode
   * @default false
   */
  showEditButton?: boolean;

  /**
   * Whether clicking the label opens edit mode
   * Automatically set to !showEditButton if not provided
   */
  labelClickOpensEditMode?: boolean;
}

/**
 * Internal state of EditableField
 */
export interface EditableFieldState {
  /**
   * Current value of the field
   */
  value: string;

  /**
   * Whether the field is in edit mode
   */
  editMode: boolean;
}

/**
 * EditableField component interface
 * This interface is used to avoid circular type references
 */
export interface EditableField {
  /**
   * Get the root DOM element
   */
  getEl(): HTMLElement;

  /**
   * Get the current value
   */
  getValue(): string;

  /**
   * Set the value and update the label
   */
  setValue(value: string): void;

  /**
   * Set the input type
   */
  setType(type: string): void;

  /**
   * Add an event listener
   */
  on(event: EditableFieldEvent, callback: EditableFieldEventCallback): void;

  /**
   * Remove an event listener
   */
  off(event: EditableFieldEvent, callback: EditableFieldEventCallback): void;

  /**
   * Clean up the component
   */
  destroy(): void;
}
