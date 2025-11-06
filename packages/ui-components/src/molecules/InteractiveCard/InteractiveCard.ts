/**
 * InteractiveCard - A card with interactive overlay and actions
 */

import { merge } from 'lodash-es';
import styles from './interactive-card.module.scss';
import type {
  InteractiveCardOptions,
  InteractiveCardAction,
} from './interactive-card.types';

function setContent(
  element: HTMLElement,
  content: string | HTMLElement | (string | HTMLElement)[]
): HTMLElement {
  element.innerHTML = '';

  if (Array.isArray(content)) {
    content.forEach((item) => {
      if (item && typeof item === 'string') {
        element.insertAdjacentHTML('beforeend', item);
      } else if (item instanceof HTMLElement) {
        element.appendChild(item);
      }
    });
  } else if (typeof content === 'string') {
    element.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    element.appendChild(content);
  }

  return element;
}

function addClassesString(element: HTMLElement, classes: string): HTMLElement {
  const classList = classes.split(' ').filter((cls) => cls.trim() !== '');
  classList.forEach((cls) => element.classList.add(cls));
  return element;
}

export class InteractiveCard {
  private options: Required<InteractiveCardOptions>;
  private element: HTMLElement;

  constructor(options: InteractiveCardOptions = {}) {
    const defaults: Required<InteractiveCardOptions> = {
      classPrefix: '',
      cssClass: 'interactive-card',
      extendedClasses: '',
      contentExtendedClasses: '',
      content: '',
      actions: [],
      interactionType: 'hover',
    };

    this.options = merge({}, defaults, options);

    this.element = this.createElements();
    this.setupEventListeners();
  }

  private createElements(): HTMLElement {
    const element = document.createElement('div');
    const cardClass = styles['interactive-card'];
    if (cardClass) {
      element.classList.add(cardClass);
    }

    if (this.options.extendedClasses) {
      addClassesString(element, this.options.extendedClasses);
    }

    // Content element
    const contentElement = document.createElement('div');
    const contentClass = styles['interactive-card__content'];
    if (contentClass) {
      contentElement.classList.add(contentClass);
    }
    if (this.options.contentExtendedClasses) {
      addClassesString(contentElement, this.options.contentExtendedClasses);
    }
    setContent(contentElement, this.options.content);
    element.appendChild(contentElement);

    // Overlay element
    const overlay = document.createElement('div');
    const overlayClass = styles['interactive-card__overlay'];
    if (overlayClass) {
      overlay.classList.add(overlayClass);
    }
    element.appendChild(overlay);

    // Add actions
    if (this.options.actions.length) {
      const actionsContainer = document.createElement('div');
      const actionsClass = styles['interactive-card__actions'];
      if (actionsClass) {
        actionsContainer.classList.add(actionsClass);
      }

      this.options.actions.forEach((action) => {
        const button = this.createActionButton(action);
        actionsContainer.appendChild(button);
      });

      overlay.appendChild(actionsContainer);
    }

    return element;
  }

  private createActionButton(action: InteractiveCardAction): HTMLElement {
    const button = document.createElement('button');
    const actionClass = styles['interactive-card__action'];
    if (actionClass) {
      button.classList.add(actionClass);
    }
    button.type = 'button';

    if (action.title) {
      button.title = action.title;
    }

    // Add icon
    if (action.icon) {
      const iconSpan = document.createElement('span');
      setContent(iconSpan, action.icon);
      button.appendChild(iconSpan);
    }

    // Add label
    if (action.label) {
      const label = document.createElement('span');
      const labelClass = styles['interactive-card__action-label'];
      if (labelClass) {
        label.classList.add(labelClass);
      }
      label.textContent = action.label;
      button.appendChild(label);
    }

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      action.callback();
    });

    return button;
  }

  private setupEventListeners(): void {
    if (this.options.interactionType === 'hover') {
      this.element.addEventListener('mouseenter', () => this.showOverlay());
      this.element.addEventListener('mouseleave', () => this.hideOverlay());
    } else if (this.options.interactionType === 'click') {
      this.element.addEventListener('click', () => this.toggleOverlay());
    }
  }

  showOverlay(): void {
    const activeClass = styles['interactive-card--active'];
    if (activeClass) {
      this.element.classList.add(activeClass);
    }
  }

  hideOverlay(): void {
    const activeClass = styles['interactive-card--active'];
    if (activeClass) {
      this.element.classList.remove(activeClass);
    }
  }

  toggleOverlay(): void {
    const activeClass = styles['interactive-card--active'];
    if (activeClass) {
      this.element.classList.toggle(activeClass);
    }
  }

  getEl(): HTMLElement {
    return this.element;
  }

  destroy(): void {
    this.element.remove();
  }
}
