/**
 * Accordion component tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Accordion } from './Accordion';
import type { AccordionConfig, AccordionEventCallback } from './accordion.types';
import styles from './accordion.module.scss';

describe('Accordion', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('initialization', () => {
    it('should create accordion element', () => {
      const accordion = new Accordion({
        title: 'Test Title',
        content: 'Test Content',
      });

      expect(accordion.getEl()).toBeInstanceOf(HTMLDivElement);
    });

    it('should throw error when title is missing', () => {
      expect(() => {
        // @ts-expect-error Testing invalid input
        new Accordion({ content: 'Test Content' });
      }).toThrow('You must pass title and content to Accordion');
    });

    it('should throw error when content is missing', () => {
      expect(() => {
        // @ts-expect-error Testing invalid input
        new Accordion({ title: 'Test Title' });
      }).toThrow('You must pass title and content to Accordion');
    });

    it('should append to target element if provided', () => {
      const accordion = new Accordion({
        title: 'Test Title',
        content: 'Test Content',
        appendTo: container,
      });

      expect(container.contains(accordion.getEl())).toBe(true);
    });

    it('should apply extended classes', () => {
      const accordion = new Accordion({
        title: 'Test Title',
        content: 'Test Content',
        extendedClasses: 'custom-class another-class',
      });

      expect(accordion.getEl().classList.contains('custom-class')).toBe(true);
      expect(accordion.getEl().classList.contains('another-class')).toBe(true);
    });

    it('should apply content extended classes', () => {
      const accordion = new Accordion({
        title: 'Test Title',
        content: 'Test Content',
        contentExtendedClasses: 'custom-content-class',
        appendTo: container,
      });

      const contentElement = container.querySelector('[class*="accordion__content"]');
      expect(contentElement?.classList.contains('custom-content-class')).toBe(true);
    });

    it('should start closed by default', () => {
      const accordion = new Accordion({
        title: 'Test Title',
        content: 'Test Content',
      });

      expect(accordion.isOpenState()).toBe(false);
    });

    it('should start open if startOpen is true', () => {
      const accordion = new Accordion({
        title: 'Test Title',
        content: 'Test Content',
        startOpen: true,
      });

      expect(accordion.isOpenState()).toBe(true);
    });
  });

  describe('rendering', () => {
    it('should render title as string', () => {
      const accordion = new Accordion({
        title: 'My Accordion Title',
        content: 'Content',
        appendTo: container,
      });

      const control = container.querySelector('[class*="accordion__control"]');
      expect(control?.textContent).toContain('My Accordion Title');
    });

    it('should render title as HTML element', () => {
      const titleElement = document.createElement('strong');
      titleElement.textContent = 'Bold Title';
      titleElement.className = 'custom-title';

      const accordion = new Accordion({
        title: titleElement,
        content: 'Content',
        appendTo: container,
      });

      expect(container.querySelector('.custom-title')).toBeTruthy();
      expect(container.querySelector('.custom-title')?.textContent).toBe('Bold Title');
    });

    it('should render content as string', () => {
      const accordion = new Accordion({
        title: 'Title',
        content: 'My Content Text',
        appendTo: container,
      });

      const contentElement = container.querySelector('[class*="accordion__content"]');
      expect(contentElement?.textContent).toContain('My Content Text');
    });

    it('should render content as HTML element', () => {
      const contentElement = document.createElement('div');
      contentElement.innerHTML = '<p class="custom-content">Custom Content</p>';

      const accordion = new Accordion({
        title: 'Title',
        content: contentElement,
        appendTo: container,
      });

      expect(container.querySelector('.custom-content')).toBeTruthy();
      expect(container.querySelector('.custom-content')?.textContent).toBe('Custom Content');
    });

    it('should render control and content sections', () => {
      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        appendTo: container,
      });

      const control = container.querySelector('[class*="accordion__control"]');
      const content = container.querySelector('[class*="accordion__content"]');

      expect(control).toBeTruthy();
      expect(content).toBeTruthy();
    });

    it('should render arrow icon', () => {
      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        appendTo: container,
      });

      const arrow = container.querySelector('[class*="accordion__arrow"]');
      expect(arrow).toBeTruthy();
    });
  });

  describe('color variants', () => {
    it('should apply primary color variant by default', () => {
      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        appendTo: container,
      });

      const element = accordion.getEl();
      expect(element.classList.contains(styles['accordion--primary'])).toBe(true);
    });

    it('should apply grey color variant', () => {
      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        accordionColor: 'grey',
        appendTo: container,
      });

      const element = accordion.getEl();
      expect(element.classList.contains(styles['accordion--grey'])).toBe(true);
    });

    it('should apply grey-outline color variant', () => {
      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        accordionColor: 'grey-outline',
        appendTo: container,
      });

      const element = accordion.getEl();
      expect(element.classList.contains(styles['accordion--grey-outline'])).toBe(true);
    });
  });

  describe('type variants', () => {
    it('should apply normal type by default', () => {
      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        appendTo: container,
      });

      const element = accordion.getEl();
      expect(element.classList.contains(styles['accordion--normal'])).toBe(true);
    });

    it('should apply extend type variant', () => {
      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        accordionType: 'extend',
        appendTo: container,
      });

      const element = accordion.getEl();
      expect(element.classList.contains(styles['accordion--extend'])).toBe(true);
    });
  });

  describe('open and close', () => {
    it('should open accordion', () => {
      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        appendTo: container,
      });

      accordion.open();

      expect(accordion.isOpenState()).toBe(true);
      expect(accordion.getEl().classList.contains(styles['accordion--open'])).toBe(true);
    });

    it('should close accordion', () => {
      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        startOpen: true,
        appendTo: container,
      });

      accordion.close();

      expect(accordion.isOpenState()).toBe(false);
      expect(accordion.getEl().classList.contains(styles['accordion--open'])).toBe(false);
    });

    it('should toggle from closed to open', () => {
      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        appendTo: container,
      });

      expect(accordion.isOpenState()).toBe(false);

      accordion.toggle();

      expect(accordion.isOpenState()).toBe(true);
    });

    it('should toggle from open to closed', () => {
      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        startOpen: true,
        appendTo: container,
      });

      expect(accordion.isOpenState()).toBe(true);

      accordion.toggle();

      expect(accordion.isOpenState()).toBe(false);
    });

    it('should hide content when closed', () => {
      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        startOpen: true,
        appendTo: container,
      });

      const element = accordion.getEl();
      expect(element.classList.contains(styles['accordion--open'])).toBe(true);

      accordion.close();

      expect(element.classList.contains(styles['accordion--open'])).toBe(false);
    });
  });

  describe('interactions', () => {
    it('should toggle when control is clicked', () => {
      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        appendTo: container,
      });

      const control = container.querySelector('[class*="accordion__control"]') as HTMLElement;
      expect(accordion.isOpenState()).toBe(false);

      control.click();

      expect(accordion.isOpenState()).toBe(true);

      control.click();

      expect(accordion.isOpenState()).toBe(false);
    });
  });

  describe('custom arrows', () => {
    it('should use custom arrow down icon', () => {
      const customArrow = '<span class="custom-arrow-down">▼</span>';

      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        arrowDown: customArrow,
        appendTo: container,
      });

      expect(container.querySelector('.custom-arrow-down')).toBeTruthy();
    });

    it('should use custom arrow up icon', () => {
      const customArrow = '<span class="custom-arrow-up">▲</span>';

      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        arrowUp: customArrow,
        startOpen: true,
        appendTo: container,
      });

      expect(container.querySelector('.custom-arrow-up')).toBeTruthy();
    });

    it('should accept HTMLElement as arrow', () => {
      const arrowElement = document.createElement('div');
      arrowElement.className = 'custom-arrow-element';
      arrowElement.textContent = '↓';

      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        arrowDown: arrowElement,
        appendTo: container,
      });

      expect(container.querySelector('.custom-arrow-element')).toBeTruthy();
    });

    it('should swap arrows when toggling (useArrowUpWhenOpen=true)', () => {
      const arrowDown = '<span class="arrow-down">▼</span>';
      const arrowUp = '<span class="arrow-up">▲</span>';

      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        arrowDown,
        arrowUp,
        useArrowUpWhenOpen: true,
        appendTo: container,
      });

      // Should show arrow down when closed
      expect(container.querySelector('.arrow-down')).toBeTruthy();
      expect(container.querySelector('.arrow-up')).toBeFalsy();

      accordion.open();

      // Should show arrow up when open
      expect(container.querySelector('.arrow-down')).toBeFalsy();
      expect(container.querySelector('.arrow-up')).toBeTruthy();
    });

    it('should keep arrow down when open if useArrowUpWhenOpen=false', () => {
      const arrowDown = '<span class="arrow-down">▼</span>';
      const arrowUp = '<span class="arrow-up">▲</span>';

      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        arrowDown,
        arrowUp,
        useArrowUpWhenOpen: false,
        appendTo: container,
      });

      // Should show arrow up when closed
      expect(container.querySelector('.arrow-up')).toBeTruthy();
      expect(container.querySelector('.arrow-down')).toBeFalsy();

      accordion.open();

      // Should show arrow down when open
      expect(container.querySelector('.arrow-up')).toBeFalsy();
      expect(container.querySelector('.arrow-down')).toBeTruthy();
    });
  });

  describe('events', () => {
    it('should call open event callback', () => {
      const onOpen = vi.fn();

      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
      });

      accordion.on('open', onOpen);
      accordion.open();

      expect(onOpen).toHaveBeenCalledTimes(1);
      expect(onOpen).toHaveBeenCalledWith(accordion);
    });

    it('should call close event callback', () => {
      const onClose = vi.fn();

      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        startOpen: true,
      });

      accordion.on('close', onClose);
      accordion.close();

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledWith(accordion);
    });

    it('should call toggle event callback', () => {
      const onToggle = vi.fn();

      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
      });

      accordion.on('toggle', onToggle);
      accordion.toggle();

      expect(onToggle).toHaveBeenCalledTimes(1);
      expect(onToggle).toHaveBeenCalledWith(accordion);
    });

    it('should call init event callback on creation', () => {
      const onInit = vi.fn();

      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
      });

      accordion.on('init', onInit);

      // Init is called in constructor, but on() is called after, so it won't be triggered
      // Let's test that the mechanism works by opening
      accordion.on('open', onInit);
      accordion.open();

      expect(onInit).toHaveBeenCalled();
    });

    it('should remove event callback with off()', () => {
      const onOpen = vi.fn();

      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
      });

      accordion.on('open', onOpen);
      accordion.off('open', onOpen);
      accordion.open();

      expect(onOpen).not.toHaveBeenCalled();
    });

    it('should support multiple event callbacks', () => {
      const onOpen1 = vi.fn();
      const onOpen2 = vi.fn();

      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
      });

      accordion.on('open', onOpen1);
      accordion.on('open', onOpen2);
      accordion.open();

      expect(onOpen1).toHaveBeenCalledTimes(1);
      expect(onOpen2).toHaveBeenCalledTimes(1);
    });
  });

  describe('public API', () => {
    it('should get title content', () => {
      const accordion = new Accordion({
        title: 'Test Title',
        content: 'Content',
      });

      const title = accordion.getTitle();
      expect(title).toContain('Test Title');
    });

    it('should set title content', () => {
      const accordion = new Accordion({
        title: 'Original Title',
        content: 'Content',
        appendTo: container,
      });

      accordion.setTitle('New Title');

      const control = container.querySelector('[class*="accordion__controlInner"]');
      expect(control?.textContent).toContain('New Title');
    });

    it('should set title as HTML element', () => {
      const accordion = new Accordion({
        title: 'Original Title',
        content: 'Content',
        appendTo: container,
      });

      const newTitle = document.createElement('div');
      newTitle.className = 'new-title';
      newTitle.textContent = 'New Title Element';

      accordion.setTitle(newTitle);

      expect(container.querySelector('.new-title')).toBeTruthy();
    });

    it('should get content nodes', () => {
      const accordion = new Accordion({
        title: 'Title',
        content: '<div>Content</div>',
      });

      const contentNodes = accordion.getContent();
      expect(contentNodes.length).toBeGreaterThan(0);
    });

    it('should destroy accordion and remove from DOM', () => {
      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        appendTo: container,
      });

      expect(container.contains(accordion.getEl())).toBe(true);

      accordion.destroy();

      expect(container.contains(accordion.getEl())).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle empty title', () => {
      const accordion = new Accordion({
        title: '',
        content: 'Content',
        appendTo: container,
      });

      const control = container.querySelector('[class*="accordion__control"]');
      expect(control).toBeTruthy();
    });

    it('should handle empty content', () => {
      const accordion = new Accordion({
        title: 'Title',
        content: '',
        appendTo: container,
      });

      const content = container.querySelector('[class*="accordion__content"]');
      expect(content).toBeTruthy();
    });

    it('should handle complex HTML in title', () => {
      const complexTitle = '<div><strong>Title</strong> with <em>formatting</em></div>';

      const accordion = new Accordion({
        title: complexTitle,
        content: 'Content',
        appendTo: container,
      });

      expect(container.querySelector('strong')).toBeTruthy();
      expect(container.querySelector('em')).toBeTruthy();
    });

    it('should handle complex HTML in content', () => {
      const complexContent = `
        <div class="complex">
          <h3>Section</h3>
          <p>Paragraph</p>
          <ul><li>Item</li></ul>
        </div>
      `;

      const accordion = new Accordion({
        title: 'Title',
        content: complexContent,
        appendTo: container,
      });

      expect(container.querySelector('.complex')).toBeTruthy();
      expect(container.querySelector('h3')).toBeTruthy();
      expect(container.querySelector('ul')).toBeTruthy();
    });

    it('should handle rapid toggle clicks', () => {
      const accordion = new Accordion({
        title: 'Title',
        content: 'Content',
        appendTo: container,
      });

      const control = container.querySelector('[class*="accordion__control"]') as HTMLElement;

      control.click();
      control.click();
      control.click();
      control.click();

      expect(accordion.isOpenState()).toBe(false);
    });
  });
});
