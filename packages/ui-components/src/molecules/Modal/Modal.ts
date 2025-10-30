/**
 * Modal component
 *
 * A flexible modal dialog with backdrop overlay and optional positioning.
 * Supports both centered modals and positioned modals relative to trigger elements.
 *
 * @example
 * Basic centered modal:
 * ```ts
 * const modal = new Modal({
 *   content: document.createElement('div'),
 *   isStartOpen: true
 * });
 * ```
 *
 * @example
 * Positioned modal with trigger:
 * ```ts
 * const triggerBtn = document.getElementById('trigger');
 * const contentDiv = document.createElement('div');
 * contentDiv.textContent = 'Modal content';
 *
 * const modal = new Modal({
 *   triggerElement: triggerBtn,
 *   content: contentDiv,
 *   placement: 'bottom',
 *   onOpen: () => console.log('Modal opened'),
 *   onClose: () => console.log('Modal closed')
 * });
 * ```
 */

import {
  autoUpdate,
  computePosition,
  offset,
  shift,
  flip,
  type ComputePositionReturn,
} from '@floating-ui/dom';
import type { ModalProps } from './modal.types';
import styles from './modal.module.scss';

export class Modal {
  private props: Required<Omit<ModalProps, 'triggerElement' | 'targetElement' | 'placement' | 'onOpen' | 'onClose'>> & Pick<ModalProps, 'triggerElement' | 'targetElement' | 'placement' | 'onOpen' | 'onClose'>;
  private modal: HTMLDivElement;
  private modalDialog: HTMLDivElement;
  private targetElement: HTMLElement;
  private cleanupAutoUpdate?: () => void;

  constructor(props: ModalProps) {
    // Set defaults
    this.props = {
      isStartOpen: false,
      modalExtendedClasses: [],
      modalDialogExtendedClasses: [],
      className: '',
      ...props,
    };

    // Setup target element
    this.targetElement = this.props.targetElement || this.getOrCreateModalContainer();

    // Validate content
    if (!this.props.content) {
      console.warn('Modal content is missing');
      throw new Error('Modal content is required');
    }

    // Create modal elements
    this.modal = this.createModalElement();
    this.modalDialog = this.createModalDialogElement();

    this.init();
  }

  /**
   * Gets existing modal container or creates one
   */
  private getOrCreateModalContainer(): HTMLElement {
    let container = document.getElementById('modalContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'modalContainer';
      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * Initialize the modal
   */
  private init(): void {
    this.build();

    // Set up positioning if trigger element and placement are provided
    if (this.props.triggerElement && this.props.placement) {
      this.setupPositioning();
    }

    // Set up trigger click handler
    if (this.props.triggerElement) {
      this.props.triggerElement.addEventListener('click', () => {
        this.open();
      });
    }

    // Open on start if specified
    if (this.props.isStartOpen) {
      this.open();
    }
  }

  /**
   * Build modal DOM structure
   */
  private build(): void {
    // Parse content if it's a string
    const content = typeof this.props.content === 'string'
      ? this.parseContent(this.props.content)
      : this.props.content;

    // Append content to dialog
    this.modalDialog.appendChild(content);

    // Append dialog to modal
    this.modal.appendChild(this.modalDialog);
  }

  /**
   * Parse string content to HTML element
   */
  private parseContent(htmlString: string): HTMLElement {
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.firstChild as HTMLElement;
  }

  /**
   * Create the modal backdrop element
   */
  private createModalElement(): HTMLDivElement {
    const modal = document.createElement('div');
    modal.className = styles.modal ?? '';

    // Add extended classes
    if (this.props.modalExtendedClasses && this.props.modalExtendedClasses.length > 0) {
      modal.classList.add(...this.props.modalExtendedClasses);
    }

    // Add custom className
    if (this.props.className) {
      modal.classList.add(this.props.className);
    }

    // Close on backdrop click
    modal.addEventListener('click', () => {
      this.close();
    });

    return modal;
  }

  /**
   * Create the modal dialog element
   */
  private createModalDialogElement(): HTMLDivElement {
    const dialog = document.createElement('div');
    dialog.className = styles.modal__dialog ?? '';

    // Add extended classes
    if (this.props.modalDialogExtendedClasses && this.props.modalDialogExtendedClasses.length > 0) {
      dialog.classList.add(...this.props.modalDialogExtendedClasses);
    }

    // Prevent clicks inside dialog from closing modal
    dialog.addEventListener('click', (e: Event) => {
      e.stopPropagation();
    });

    return dialog;
  }

  /**
   * Setup auto-positioning relative to trigger element
   */
  private setupPositioning(): void {
    if (!this.props.triggerElement || !this.props.placement) {
      return;
    }

    this.cleanupAutoUpdate = autoUpdate(
      this.props.triggerElement,
      this.modal,
      () => {
        this.updatePosition();
      }
    );
  }

  /**
   * Update modal position relative to trigger
   */
  private async updatePosition(): Promise<void> {
    if (!this.props.triggerElement || !this.props.placement) {
      return;
    }

    const position: ComputePositionReturn = await computePosition(
      this.props.triggerElement,
      this.modal,
      {
        placement: this.props.placement,
        middleware: [
          offset(10),
          flip(),
          shift({ padding: 5 }),
        ],
      }
    );

    Object.assign(this.modal.style, {
      left: `${position.x}px`,
      top: `${position.y}px`,
    });
  }

  /**
   * Open the modal
   */
  public open(): void {
    // Clear target element
    if (this.targetElement.hasChildNodes()) {
      this.targetElement.innerHTML = '';
    }

    // Append modal to target
    this.targetElement.appendChild(this.modal);

    // Add open class
    const openClass = styles['modal--open'] ?? '';
    if (openClass) {
      this.modal.classList.add(openClass);
    }

    // Fire callback
    if (this.props.onOpen) {
      this.props.onOpen();
    }
  }

  /**
   * Close the modal
   */
  public close(): void {
    const openClass = styles['modal--open'] ?? '';
    if (openClass) {
      this.modal.classList.remove(openClass);
    }

    // Fire callback
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  /**
   * Toggle modal open/closed state
   */
  public toggle(): void {
    const openClass = styles['modal--open'] ?? '';
    if (openClass && this.modal.classList.contains(openClass)) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Check if modal is currently open
   */
  public isOpen(): boolean {
    const openClass = styles['modal--open'] ?? '';
    return openClass ? this.modal.classList.contains(openClass) : false;
  }

  /**
   * Get the modal element
   */
  public getElement(): HTMLDivElement {
    return this.modal;
  }

  /**
   * Get the modal dialog element
   */
  public getDialogElement(): HTMLDivElement {
    return this.modalDialog;
  }

  /**
   * Update modal content
   */
  public setContent(content: HTMLElement | string): void {
    // Clear existing content
    this.modalDialog.innerHTML = '';

    // Parse and append new content
    const contentElement = typeof content === 'string'
      ? this.parseContent(content)
      : content;

    this.modalDialog.appendChild(contentElement);
  }

  /**
   * Destroy the modal and cleanup
   */
  public destroy(): void {
    // Cleanup positioning
    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
    }

    // Remove from DOM
    this.modal.remove();

    // Fire close callback if was open
    if (this.isOpen() && this.props.onClose) {
      this.props.onClose();
    }
  }
}
