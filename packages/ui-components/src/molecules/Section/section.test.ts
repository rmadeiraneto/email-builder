import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Section } from './Section';

describe('Section', () => {
  let section: Section;

  afterEach(() => {
    if (section) {
      const el = section.getEl();
      el.remove();
    }
  });

  describe('Initialization', () => {
    it('should create a section element with default options', () => {
      section = new Section();
      const el = section.getEl();

      expect(el).toBeInstanceOf(HTMLElement);
      expect(el.tagName.toLowerCase()).toBe('div');
    });

    it('should create a section with custom tag name', () => {
      section = new Section({ tagName: 'section' });
      const el = section.getEl();

      expect(el.tagName.toLowerCase()).toBe('section');
    });

    it('should apply extended classes', () => {
      section = new Section({ extendedClasses: 'custom-class another-class' });
      const el = section.getEl();

      expect(el.classList.contains('custom-class')).toBe(true);
      expect(el.classList.contains('another-class')).toBe(true);
    });

    it('should create section without content container when no content or label', () => {
      section = new Section();
      const contentContainer = section.getContentContainer();

      expect(contentContainer).toBeNull();
    });
  });

  describe('Label', () => {
    it('should create section with string label', () => {
      section = new Section({ label: 'My Label' });
      const el = section.getEl();
      const label = el.querySelector('label');

      expect(label).not.toBeNull();
      expect(label?.textContent).toBe('My Label');
      expect(label?.classList.contains('eb-label')).toBe(true);
    });

    it('should create section with HTMLElement label', () => {
      const customLabel = document.createElement('span');
      customLabel.textContent = 'Custom Label';
      section = new Section({ label: customLabel });
      const el = section.getEl();
      const label = el.querySelector('label');

      expect(label).not.toBeNull();
      expect(label?.querySelector('span')).toBe(customLabel);
    });

    it('should position label before content', () => {
      section = new Section({ label: 'Label', content: 'Content' });
      const el = section.getEl();
      const children = Array.from(el.children);

      expect(children[0]?.tagName.toLowerCase()).toBe('label');
      expect(children[1]?.className).toContain('content');
    });
  });

  describe('Content', () => {
    it('should create section with string content', () => {
      section = new Section({ content: 'Hello World' });
      const el = section.getEl();
      const contentContainer = section.getContentContainer();

      expect(contentContainer).not.toBeNull();
      expect(contentContainer?.textContent).toBe('Hello World');
    });

    it('should create section with HTML string content', () => {
      section = new Section({ content: '<p>Paragraph</p>' });
      const contentContainer = section.getContentContainer();
      const paragraph = contentContainer?.querySelector('p');

      expect(paragraph).not.toBeNull();
      expect(paragraph?.textContent).toBe('Paragraph');
    });

    it('should create section with HTMLElement content', () => {
      const div = document.createElement('div');
      div.textContent = 'Element Content';
      section = new Section({ content: div });
      const contentContainer = section.getContentContainer();

      expect(contentContainer?.contains(div)).toBe(true);
    });

    it('should create section with array of HTMLElements', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      section = new Section({ content: [div1, div2] });
      const contentContainer = section.getContentContainer();

      expect(contentContainer?.contains(div1)).toBe(true);
      expect(contentContainer?.contains(div2)).toBe(true);
    });
  });

  describe('addContent method', () => {
    beforeEach(() => {
      section = new Section({ content: 'Initial' });
    });

    it('should add HTMLElement content', () => {
      const newDiv = document.createElement('div');
      newDiv.textContent = 'New Content';

      section.addContent(newDiv);
      const contentContainer = section.getContentContainer();

      expect(contentContainer?.contains(newDiv)).toBe(true);
    });

    it('should add string content', () => {
      section.addContent('<span>Added</span>');
      const contentContainer = section.getContentContainer();
      const span = contentContainer?.querySelector('span');

      expect(span).not.toBeNull();
      expect(span?.textContent).toBe('Added');
    });

    it('should append content without removing existing content', () => {
      const contentContainer = section.getContentContainer();
      const initialContent = contentContainer?.textContent;

      section.addContent('<div>More</div>');

      expect(contentContainer?.textContent).toContain(initialContent!);
      expect(contentContainer?.textContent).toContain('More');
    });

    it('should return the added element when using element.addContent', () => {
      const el = section.getEl();
      const newDiv = document.createElement('div');
      const result = el.addContent(newDiv);

      expect(result).toBeInstanceOf(HTMLElement);
    });
  });

  describe('removeContent method', () => {
    let testDiv: HTMLElement;

    beforeEach(() => {
      testDiv = document.createElement('div');
      testDiv.textContent = 'Test';
      section = new Section({ content: testDiv });
    });

    it('should remove HTMLElement content', () => {
      section.removeContent(testDiv);
      const contentContainer = section.getContentContainer();

      expect(contentContainer?.contains(testDiv)).toBe(false);
    });

    it('should return the removed element', () => {
      const removed = section.removeContent(testDiv);

      expect(removed).toBe(testDiv);
    });

    it('should throw error when removing content without content container', () => {
      const emptySection = new Section();
      const div = document.createElement('div');

      expect(() => emptySection.removeContent(div)).toThrow();
    });
  });

  describe('hasContent method', () => {
    let testDiv: HTMLElement;

    beforeEach(() => {
      testDiv = document.createElement('div');
      section = new Section({ content: testDiv });
    });

    it('should return true for contained element', () => {
      expect(section.hasContent(testDiv)).toBe(true);
    });

    it('should return false for non-contained element', () => {
      const otherDiv = document.createElement('div');
      expect(section.hasContent(otherDiv)).toBe(false);
    });

    it('should return false when no content container', () => {
      const emptySection = new Section();
      const div = document.createElement('div');

      expect(emptySection.hasContent(div)).toBe(false);
    });
  });

  describe('toggleContent method', () => {
    let testDiv: HTMLElement;

    beforeEach(() => {
      testDiv = document.createElement('div');
      testDiv.textContent = 'Toggle Me';
      section = new Section({ content: 'Initial' });
    });

    it('should add content when not present', () => {
      section.toggleContent(testDiv);

      expect(section.hasContent(testDiv)).toBe(true);
    });

    it('should remove content when present', () => {
      section.addContent(testDiv);
      expect(section.hasContent(testDiv)).toBe(true);

      section.toggleContent(testDiv);

      expect(section.hasContent(testDiv)).toBe(false);
    });

    it('should toggle content multiple times', () => {
      section.toggleContent(testDiv);
      expect(section.hasContent(testDiv)).toBe(true);

      section.toggleContent(testDiv);
      expect(section.hasContent(testDiv)).toBe(false);

      section.toggleContent(testDiv);
      expect(section.hasContent(testDiv)).toBe(true);
    });
  });

  describe('Public API', () => {
    it('should expose getEl method', () => {
      section = new Section();

      expect(typeof section.getEl).toBe('function');
      expect(section.getEl()).toBeInstanceOf(HTMLElement);
    });

    it('should expose getContentContainer method', () => {
      section = new Section({ content: 'Test' });

      expect(typeof section.getContentContainer).toBe('function');
      expect(section.getContentContainer()).toBeInstanceOf(HTMLElement);
    });

    it('should expose addContent method', () => {
      section = new Section({ content: 'Test' });

      expect(typeof section.addContent).toBe('function');
    });

    it('should expose removeContent method', () => {
      section = new Section({ content: 'Test' });

      expect(typeof section.removeContent).toBe('function');
    });

    it('should expose hasContent method', () => {
      section = new Section({ content: 'Test' });

      expect(typeof section.hasContent).toBe('function');
    });

    it('should expose toggleContent method', () => {
      section = new Section({ content: 'Test' });

      expect(typeof section.toggleContent).toBe('function');
    });
  });

  describe('Element extended methods', () => {
    it('should add methods to the element itself', () => {
      section = new Section({ content: 'Test' });
      const el = section.getEl();

      expect(typeof el.addContent).toBe('function');
      expect(typeof el.removeContent).toBe('function');
      expect(typeof el.hasContent).toBe('function');
      expect(typeof el.toggleContent).toBe('function');
    });

    it('should allow calling methods directly on element', () => {
      section = new Section({ content: 'Test' });
      const el = section.getEl();
      const newDiv = document.createElement('div');

      el.addContent(newDiv);

      expect(el.hasContent(newDiv)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string content', () => {
      section = new Section({ content: '' });
      const contentContainer = section.getContentContainer();

      expect(contentContainer).not.toBeNull();
      expect(contentContainer?.textContent).toBe('');
    });

    it('should handle empty string label', () => {
      section = new Section({ label: '' });
      const el = section.getEl();
      const label = el.querySelector('label');

      expect(label).not.toBeNull();
      expect(label?.textContent).toBe('');
    });

    it('should handle null content', () => {
      section = new Section({ content: null });
      const contentContainer = section.getContentContainer();

      expect(contentContainer).toBeNull();
    });

    it('should handle null label', () => {
      section = new Section({ label: null });
      const el = section.getEl();
      const label = el.querySelector('label');

      expect(label).toBeNull();
    });

    it('should handle empty array content', () => {
      section = new Section({ content: [] });
      const contentContainer = section.getContentContainer();

      expect(contentContainer).not.toBeNull();
      expect(contentContainer?.children.length).toBe(0);
    });

    it('should handle special characters in content', () => {
      const specialContent = '<>&"\'';
      section = new Section({ content: specialContent });
      const contentContainer = section.getContentContainer();

      expect(contentContainer?.textContent).toContain('<');
      expect(contentContainer?.textContent).toContain('>');
    });

    it('should handle multiple extended classes', () => {
      section = new Section({ extendedClasses: '  class1   class2  class3  ' });
      const el = section.getEl();

      expect(el.classList.contains('class1')).toBe(true);
      expect(el.classList.contains('class2')).toBe(true);
      expect(el.classList.contains('class3')).toBe(true);
    });

    it('should handle content and label together', () => {
      section = new Section({
        label: 'Label',
        content: 'Content'
      });
      const el = section.getEl();
      const label = el.querySelector('label');
      const contentContainer = section.getContentContainer();

      expect(label).not.toBeNull();
      expect(contentContainer).not.toBeNull();
      expect(label?.textContent).toBe('Label');
      expect(contentContainer?.textContent).toBe('Content');
    });
  });
});
