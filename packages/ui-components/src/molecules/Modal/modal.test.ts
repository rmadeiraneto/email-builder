/**
 * Modal component tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Modal } from './Modal';
import type { ModalProps } from './modal.types';

describe('Modal', () => {
  let modalContainer: HTMLElement;

  beforeEach(() => {
    // Create a fresh modal container for each test
    modalContainer = document.createElement('div');
    modalContainer.id = 'modalContainer';
    document.body.appendChild(modalContainer);
  });

  afterEach(() => {
    // Clean up modal container
    modalContainer.remove();
    // Clean up any modals that might have been created
    document.querySelectorAll('[id="modalContainer"]').forEach(el => el.remove());
  });

  describe('initialization', () => {
    it('should create modal element', () => {
      const content = document.createElement('div');
      content.textContent = 'Test content';

      const modal = new Modal({ content });

      expect(modal.getElement()).toBeInstanceOf(HTMLDivElement);
      expect(modal.getDialogElement()).toBeInstanceOf(HTMLDivElement);
    });

    it('should throw error when content is missing', () => {
      expect(() => {
        // @ts-expect-error Testing invalid input
        new Modal({});
      }).toThrow('Modal content is required');
    });

    it('should create modal container if it does not exist', () => {
      // Remove the container we created in beforeEach
      modalContainer.remove();

      const content = document.createElement('div');
      const modal = new Modal({ content });

      const container = document.getElementById('modalContainer');
      expect(container).toBeTruthy();
      expect(container).toBeInstanceOf(HTMLElement);
    });

    it('should use provided target element', () => {
      const customTarget = document.createElement('div');
      customTarget.id = 'customTarget';
      document.body.appendChild(customTarget);

      const content = document.createElement('div');
      const modal = new Modal({
        content,
        targetElement: customTarget,
        isStartOpen: true,
      });

      expect(customTarget.contains(modal.getElement())).toBe(true);

      customTarget.remove();
    });

    it('should accept string content', () => {
      const htmlString = '<div class="test">String content</div>';
      const modal = new Modal({ content: htmlString });

      expect(modal.getDialogElement().querySelector('.test')).toBeTruthy();
    });

    it('should open on start if isStartOpen is true', () => {
      const content = document.createElement('div');
      const modal = new Modal({
        content,
        isStartOpen: true,
      });

      expect(modal.isOpen()).toBe(true);
    });

    it('should not open on start by default', () => {
      const content = document.createElement('div');
      const modal = new Modal({ content });

      expect(modal.isOpen()).toBe(false);
    });
  });

  describe('open and close', () => {
    it('should open modal', () => {
      const content = document.createElement('div');
      const modal = new Modal({ content });

      modal.open();

      expect(modal.isOpen()).toBe(true);
      expect(modalContainer.contains(modal.getElement())).toBe(true);
    });

    it('should close modal', () => {
      const content = document.createElement('div');
      const modal = new Modal({ content });

      modal.open();
      expect(modal.isOpen()).toBe(true);

      modal.close();
      expect(modal.isOpen()).toBe(false);
    });

    it('should toggle modal state', () => {
      const content = document.createElement('div');
      const modal = new Modal({ content });

      expect(modal.isOpen()).toBe(false);

      modal.toggle();
      expect(modal.isOpen()).toBe(true);

      modal.toggle();
      expect(modal.isOpen()).toBe(false);
    });

    it('should call onOpen callback when opened', () => {
      const onOpen = vi.fn();
      const content = document.createElement('div');
      const modal = new Modal({ content, onOpen });

      modal.open();

      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it('should call onClose callback when closed', () => {
      const onClose = vi.fn();
      const content = document.createElement('div');
      const modal = new Modal({ content, onClose });

      modal.open();
      modal.close();

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should clear target element when opening', () => {
      modalContainer.innerHTML = '<div>Existing content</div>';

      const content = document.createElement('div');
      const modal = new Modal({ content });

      modal.open();

      expect(modalContainer.children.length).toBe(1);
      expect(modalContainer.children[0]).toBe(modal.getElement());
    });
  });

  describe('trigger element', () => {
    it('should open modal when trigger element is clicked', () => {
      const trigger = document.createElement('button');
      const content = document.createElement('div');
      const modal = new Modal({
        triggerElement: trigger,
        content,
      });

      expect(modal.isOpen()).toBe(false);

      trigger.click();

      expect(modal.isOpen()).toBe(true);
    });
  });

  describe('backdrop clicks', () => {
    it('should close modal when backdrop is clicked', () => {
      const content = document.createElement('div');
      const modal = new Modal({ content });

      modal.open();
      expect(modal.isOpen()).toBe(true);

      // Click on modal backdrop
      modal.getElement().click();

      expect(modal.isOpen()).toBe(false);
    });

    it('should not close modal when dialog is clicked', () => {
      const content = document.createElement('div');
      const modal = new Modal({ content });

      modal.open();
      expect(modal.isOpen()).toBe(true);

      // Click on dialog
      modal.getDialogElement().click();

      expect(modal.isOpen()).toBe(true);
    });
  });

  describe('content management', () => {
    it('should set new content', () => {
      const content = document.createElement('div');
      content.textContent = 'Original content';

      const modal = new Modal({ content });

      const newContent = document.createElement('div');
      newContent.textContent = 'New content';

      modal.setContent(newContent);

      expect(modal.getDialogElement().textContent).toBe('New content');
    });

    it('should set new string content', () => {
      const content = document.createElement('div');
      const modal = new Modal({ content });

      modal.setContent('<p class="new">New string content</p>');

      expect(modal.getDialogElement().querySelector('.new')).toBeTruthy();
      expect(modal.getDialogElement().textContent).toBe('New string content');
    });
  });

  describe('styling', () => {
    it('should apply extended modal classes', () => {
      const content = document.createElement('div');
      const modal = new Modal({
        content,
        modalExtendedClasses: ['custom-modal', 'dark-theme'],
      });

      expect(modal.getElement().classList.contains('custom-modal')).toBe(true);
      expect(modal.getElement().classList.contains('dark-theme')).toBe(true);
    });

    it('should apply extended dialog classes', () => {
      const content = document.createElement('div');
      const modal = new Modal({
        content,
        modalDialogExtendedClasses: ['custom-dialog', 'large'],
      });

      expect(modal.getDialogElement().classList.contains('custom-dialog')).toBe(true);
      expect(modal.getDialogElement().classList.contains('large')).toBe(true);
    });

    it('should apply custom className', () => {
      const content = document.createElement('div');
      const modal = new Modal({
        content,
        className: 'my-custom-class',
      });

      expect(modal.getElement().classList.contains('my-custom-class')).toBe(true);
    });
  });

  describe('destroy', () => {
    it('should remove modal from DOM', () => {
      const content = document.createElement('div');
      const modal = new Modal({ content });

      modal.open();
      expect(modalContainer.contains(modal.getElement())).toBe(true);

      modal.destroy();

      expect(document.contains(modal.getElement())).toBe(false);
    });

    it('should call onClose if modal was open', () => {
      const onClose = vi.fn();
      const content = document.createElement('div');
      const modal = new Modal({ content, onClose });

      modal.open();
      modal.destroy();

      expect(onClose).toHaveBeenCalled();
    });

    it('should not call onClose if modal was already closed', () => {
      const onClose = vi.fn();
      const content = document.createElement('div');
      const modal = new Modal({ content, onClose });

      modal.open();
      modal.close();
      onClose.mockClear();

      modal.destroy();

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle multiple opens gracefully', () => {
      const content = document.createElement('div');
      const modal = new Modal({ content });

      modal.open();
      modal.open();
      modal.open();

      expect(modal.isOpen()).toBe(true);
      expect(modalContainer.children.length).toBe(1);
    });

    it('should handle multiple closes gracefully', () => {
      const content = document.createElement('div');
      const modal = new Modal({ content });

      modal.open();
      modal.close();
      modal.close();
      modal.close();

      expect(modal.isOpen()).toBe(false);
    });

    it('should throw error for empty string content', () => {
      expect(() => {
        new Modal({ content: '' });
      }).toThrow('Modal content is required');
    });
  });
});
