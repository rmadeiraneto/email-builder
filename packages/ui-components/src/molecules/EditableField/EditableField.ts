/**
 * EditableField Component
 *
 * An inline editable text field that switches between view and edit modes.
 * In view mode, displays a label (optionally clickable or with an edit button).
 * In edit mode, displays an input field with save and discard buttons.
 *
 * @example
 * ```ts
 * const field = new EditableField({
 *   value: 'Initial value',
 *   showEditButton: true,
 *   onSave: (value) => console.log('Saved:', value)
 * });
 * document.body.appendChild(field.getEl());
 * ```
 */

import styles from './editable-field.module.scss';
import type {
  EditableFieldOptions,
  EditableFieldEvent,
  EditableFieldEventCallback,
  EditableField as IEditableField
} from './editable-field.types';

/**
 * Event emitter for managing component events
 */
class EventEmitter {
  private events: Map<string, Set<EditableFieldEventCallback>> = new Map();

  on(event: string, callback: EditableFieldEventCallback): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
  }

  off(event: string, callback: EditableFieldEventCallback): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  emit(event: string, ...args: any[]): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(...args));
    }
  }

  clear(): void {
    this.events.clear();
  }
}

export class EditableField implements IEditableField {
  private options: Required<EditableFieldOptions>;
  private cssClass: string;
  private editMode: boolean;
  private value: string;
  private eventEmitter: EventEmitter;

  // DOM elements
  private element!: HTMLElement;
  private contentWrapper!: HTMLElement;
  private buttonsWrapper!: HTMLElement;
  private label!: HTMLElement;
  private input!: HTMLInputElement;
  private editButton!: HTMLButtonElement;
  private saveButton!: HTMLButtonElement;
  private discardButton!: HTMLButtonElement;
  private editModeContent: HTMLElement[] = [];
  private viewModeContent: HTMLElement[] = [];
  private editModeButtons: HTMLElement[] = [];
  private viewModeButtons: HTMLElement[] = [];

  constructor(options: EditableFieldOptions = {}) {
    const defaults: Required<EditableFieldOptions> = {
      value: '',
      classPrefix: 'eb-',
      className: 'editable-field',
      extendedClasses: '',
      icons: {
        edit: '✏️',
        save: '💾',
        discard: '🗑️'
      },
      iconsSize: 'md',
      onEdit: null,
      onSave: null,
      onDiscard: null,
      onInputChange: null,
      startEditing: false,
      showEditButton: false,
      labelClickOpensEditMode: !options.showEditButton
    };

    // Merge options with defaults
    this.options = { ...defaults, ...options };

    // Override labelClickOpensEditMode if not explicitly set
    if (options.labelClickOpensEditMode === undefined) {
      this.options.labelClickOpensEditMode = !this.options.showEditButton;
    }

    // Merge icons
    if (options.icons) {
      this.options.icons = { ...defaults.icons, ...options.icons };
    }

    this.cssClass = `${this.options.classPrefix}${this.options.className}`;
    this.editMode = this.options.startEditing;
    this.value = this.options.value;
    this.eventEmitter = new EventEmitter();

    this.init();
  }

  /**
   * Initialize the component
   */
  private init(): void {
    this.createEditModeContent();
    this.createViewModeContent();
    this.createEditModeButtons();
    if (this.options.showEditButton) {
      this.createViewModeButtons();
    }
    this.draw();
  }

  /**
   * Create and render the DOM structure
   */
  private draw(): void {
    this.element = document.createElement('div');
    this.element.className = `${this.cssClass} ${styles['editable-field']}`;

    if (this.options.extendedClasses) {
      const classes = this.options.extendedClasses.split(' ').filter(c => c.trim());
      classes.forEach(cls => this.element.classList.add(cls));
    }

    this.contentWrapper = document.createElement('div');
    this.contentWrapper.className = `${this.cssClass}__content ${styles['editable-field__content']}`;

    this.buttonsWrapper = document.createElement('div');
    this.buttonsWrapper.className = `${this.cssClass}__buttons ${styles['editable-field__buttons']}`;
    this.buttonsWrapper.setAttribute('data-testid', 'editable-field-buttons');

    this.element.appendChild(this.contentWrapper);
    this.element.appendChild(this.buttonsWrapper);

    if (this.editMode) {
      this.setEditMode();
    } else {
      this.setViewMode();
    }
  }

  /**
   * Create the input field for edit mode
   */
  private createInput(): void {
    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.value = this.options.value;
    this.input.className = `${this.cssClass}__input ${styles['editable-field__input']}`;
    this.input.setAttribute('data-testid', 'editable-field-input');

    this.input.addEventListener('input', () => {
      this.eventEmitter.emit('inputChange', this.input.value);
      if (this.options.onInputChange) {
        this.options.onInputChange(this.input.value);
      }
    });
  }

  /**
   * Create edit mode content (input field)
   */
  private createEditModeContent(): void {
    this.createInput();
    this.editModeContent = [this.input];
  }

  /**
   * Create the label for view mode
   */
  private createLabel(): void {
    this.label = document.createElement('label');
    this.label.className = `eb-label ${this.cssClass}__label ${styles['editable-field__label']}`;
    this.label.textContent = this.value;
    this.label.setAttribute('data-testid', 'editable-field-label');

    if (this.options.labelClickOpensEditMode) {
      this.label.classList.add(`${this.cssClass}__label--clickable`);
      const clickableClass = styles['editable-field__label--clickable'];
      if (clickableClass) {
        this.label.classList.add(clickableClass);
      }
      this.label.addEventListener('click', () => {
        this.onEdit();
      });
    }
  }

  /**
   * Create view mode content (label)
   */
  private createViewModeContent(): void {
    this.createLabel();
    this.viewModeContent = [this.label];
  }

  /**
   * Create a button element
   */
  private createButton(
    content: string | HTMLElement | null,
    className: string,
    onClick: () => void,
    testId: string
  ): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.setAttribute('data-testid', testId);
    button.addEventListener('click', onClick);

    if (typeof content === 'string') {
      button.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      button.appendChild(content);
    }

    return button;
  }

  /**
   * Create edit mode buttons (save and discard)
   */
  private createEditModeButtons(): void {
    this.saveButton = this.createButton(
      this.options.icons.save ?? null,
      `${this.cssClass}__save-button ${styles['editable-field__save-button'] ?? ''}`,
      () => this.onSave(),
      'editable-field-save-button'
    );

    this.discardButton = this.createButton(
      this.options.icons.discard ?? null,
      `${this.cssClass}__discard-button ${styles['editable-field__discard-button'] ?? ''}`,
      () => this.onDiscard(),
      'editable-field-discard-button'
    );

    this.editModeButtons = [this.saveButton, this.discardButton];
  }

  /**
   * Create view mode buttons (edit button)
   */
  private createViewModeButtons(): void {
    this.editButton = this.createButton(
      this.options.icons.edit ?? null,
      `${this.cssClass}__edit-button ${styles['editable-field__edit-button'] ?? ''}`,
      () => this.onEdit(),
      'editable-field-edit-button'
    );

    this.viewModeButtons = [this.editButton];
  }

  /**
   * Hide the buttons wrapper
   */
  private hideButtonsWrapper(): void {
    this.buttonsWrapper.classList.add(`${this.cssClass}__buttons--hidden`);
    const hiddenClass = styles['editable-field__buttons--hidden'];
    if (hiddenClass) {
      this.buttonsWrapper.classList.add(hiddenClass);
    }
  }

  /**
   * Show the buttons wrapper
   */
  private showButtonsWrapper(): void {
    this.buttonsWrapper.classList.remove(`${this.cssClass}__buttons--hidden`);
    const hiddenClass = styles['editable-field__buttons--hidden'];
    if (hiddenClass) {
      this.buttonsWrapper.classList.remove(hiddenClass);
    }
  }

  /**
   * Set the component to edit mode
   */
  private setEditMode(): void {
    // Clear and set content
    this.contentWrapper.innerHTML = '';
    this.editModeContent.forEach(el => this.contentWrapper.appendChild(el));

    // Clear and set buttons
    this.buttonsWrapper.innerHTML = '';
    this.editModeButtons.forEach(el => this.buttonsWrapper.appendChild(el));

    if (!this.options.showEditButton) {
      this.showButtonsWrapper();
    }

    this.element.classList.remove(`${this.cssClass}--view-mode`);
    const viewModeClass = styles['editable-field--view-mode'];
    if (viewModeClass) {
      this.element.classList.remove(viewModeClass);
    }
    this.element.classList.add(`${this.cssClass}--edit-mode`);
    const editModeClass = styles['editable-field--edit-mode'];
    if (editModeClass) {
      this.element.classList.add(editModeClass);
    }

    this.editMode = true;
  }

  /**
   * Set the component to view mode
   */
  private setViewMode(): void {
    // Clear and set content
    this.contentWrapper.innerHTML = '';
    this.viewModeContent.forEach(el => this.contentWrapper.appendChild(el));

    // Clear and set buttons
    this.buttonsWrapper.innerHTML = '';
    if (this.options.showEditButton) {
      this.viewModeButtons.forEach(el => this.buttonsWrapper.appendChild(el));
    } else {
      this.hideButtonsWrapper();
    }

    this.element.classList.add(`${this.cssClass}--view-mode`);
    const viewModeClass = styles['editable-field--view-mode'];
    if (viewModeClass) {
      this.element.classList.add(viewModeClass);
    }
    this.element.classList.remove(`${this.cssClass}--edit-mode`);
    const editModeClass = styles['editable-field--edit-mode'];
    if (editModeClass) {
      this.element.classList.remove(editModeClass);
    }

    this.editMode = false;
  }

  /**
   * Handle save action
   */
  private onSave(): void {
    this.setValue(this.input.value);

    if (this.options.onSave) {
      this.options.onSave(this.input.value, this);
    }

    this.eventEmitter.emit('save', this.input.value);
    this.setViewMode();
  }

  /**
   * Handle discard action
   */
  private onDiscard(): void {
    this.input.value = this.getValue();

    if (this.options.onDiscard) {
      this.options.onDiscard(this);
    }

    this.eventEmitter.emit('discard');
    this.setViewMode();
  }

  /**
   * Handle edit action
   */
  private onEdit(): void {
    this.setEditMode();

    if (this.options.onEdit) {
      this.options.onEdit(this);
    }

    this.eventEmitter.emit('edit');
  }

  /**
   * Get the root DOM element
   */
  public getEl(): HTMLElement {
    return this.element;
  }

  /**
   * Get the current value
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * Set the value and update the label
   */
  public setValue(value: string): void {
    this.value = value;
    this.label.textContent = value;
    this.input.value = value;
  }

  /**
   * Set the input type
   */
  public setType(type: string): void {
    this.input.type = type;
  }

  /**
   * Add an event listener
   */
  public on(event: EditableFieldEvent, callback: EditableFieldEventCallback): void {
    this.eventEmitter.on(event, callback);
  }

  /**
   * Remove an event listener
   */
  public off(event: EditableFieldEvent, callback: EditableFieldEventCallback): void {
    this.eventEmitter.off(event, callback);
  }

  /**
   * Clean up the component
   */
  public destroy(): void {
    this.eventEmitter.clear();
    this.element.remove();
  }
}
