/**
 * Input Component
 *
 * A basic input component with event handling and customization options.
 * Supports input and change events, custom styling, and placeholder text.
 *
 * @example
 * ```ts
 * const input = new Input({
 *   type: 'text',
 *   placeholder: 'Enter text...',
 *   onChange: (e, input) => console.log('Value:', input.value)
 * });
 * document.body.appendChild(input.getEl());
 * ```
 */

import styles from './input.module.scss';
import type { InputOptions, InputEventCallback, InputEvent } from './input.types';

// Simple EventEmitter implementation
class EventEmitter {
  private events: Map<string, Set<Function>> = new Map();

  on(event: string, callback: Function): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
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
}

export class Input {
  private options: Required<InputOptions>;
  private eventEmitter: EventEmitter;
  private input: HTMLInputElement;
  private placeholder: string | null;

  constructor(options: InputOptions = {}) {
    const defaults: Required<InputOptions> = {
      height: null,
      classPrefix: 'eb-',
      className: 'input',
      extendedClasses: '',
      type: 'text',
      onChange: null as any,
      onInput: null as any,
      initialValue: null,
      placeholder: null
    };

    this.options = { ...defaults, ...options };
    this.eventEmitter = new EventEmitter();
    this.placeholder = this.options.placeholder;
    this.input = this.init();
  }

  /**
   * Initialize the input element
   */
  private init(): HTMLInputElement {
    const input = document.createElement('input');

    // Add base class from CSS modules
    input.className = styles.input ?? '';

    // Add extended classes if provided
    if (this.options.extendedClasses) {
      this.addClassesString(input, this.options.extendedClasses);
    }

    // Set placeholder
    if (this.placeholder) {
      input.placeholder = this.placeholder;
    }

    // Add input event listener
    input.addEventListener('input', (e) => {
      this.eventEmitter.emit('input', e, this.input);
    });

    // Add change event listener
    input.addEventListener('change', (e) => {
      this.eventEmitter.emit('change', e, this.input);
    });

    // Register callbacks if provided
    if (typeof this.options.onChange === 'function') {
      this.on('change', this.options.onChange);
    }

    if (typeof this.options.onInput === 'function') {
      this.on('input', this.options.onInput);
    }

    // Set initial value
    if (this.options.initialValue) {
      input.value = this.options.initialValue;
    }

    // Set input type
    if (this.options.type) {
      input.type = this.options.type;
    }

    // Set height if provided
    if (this.options.height) {
      input.style.setProperty('--input-height', this.options.height);
    }

    return input;
  }

  /**
   * Add CSS classes from a space-separated string
   */
  private addClassesString(element: HTMLElement, classString: string): void {
    const classes = classString.split(' ').filter(cls => cls.trim() !== '');
    classes.forEach(cls => element.classList.add(cls));
  }

  /**
   * Get the input element
   */
  public getEl(): HTMLInputElement {
    return this.input;
  }

  /**
   * Get the current input value
   */
  public getValue(): string {
    return this.input.value;
  }

  /**
   * Set the input value
   */
  public setValue(value: string): void {
    this.input.value = value;
  }

  /**
   * Set the input type
   */
  public setType(type: string): void {
    this.input.type = type;
  }

  /**
   * Register an event listener
   */
  public on(event: InputEvent, callback: InputEventCallback): void {
    this.eventEmitter.on(event, callback);
  }

  /**
   * Unregister an event listener
   */
  public off(event: InputEvent, callback: InputEventCallback): void {
    this.eventEmitter.off(event, callback);
  }

  /**
   * Destroy the input and cleanup
   */
  public destroy(): void {
    this.input.remove();
  }
}
