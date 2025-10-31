import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SectionItem } from './SectionItem';
import type { SectionItemOptions } from './section-item.types';

describe('SectionItem', () => {
  let sectionItem: SectionItem;

  afterEach(() => {
    if (sectionItem) {
      sectionItem.destroy();
    }
  });

  describe('Initialization', () => {
    it('should create a SectionItem instance with default options', () => {
      sectionItem = new SectionItem();
      expect(sectionItem).toBeInstanceOf(SectionItem);
      expect(sectionItem.getEl()).toBeInstanceOf(HTMLElement);
    });

    it('should create a div element by default', () => {
      sectionItem = new SectionItem();
      expect(sectionItem.getEl().tagName).toBe('DIV');
    });

    it('should create element with custom tag name', () => {
      sectionItem = new SectionItem({
        tagName: 'section',
      });
      expect(sectionItem.getEl().tagName).toBe('SECTION');
    });

    it('should apply extended classes', () => {
      sectionItem = new SectionItem({
        extendedClasses: 'custom-class another-class',
      });

      const element = sectionItem.getEl();
      expect(element.className).toContain('custom-class');
      expect(element.className).toContain('another-class');
    });

    it('should start visible by default', () => {
      sectionItem = new SectionItem({
        label: 'Test',
      });

      const element = sectionItem.getEl();
      expect(element.style.display).toBe('');
    });

    it('should start hidden when isHidden is true', () => {
      sectionItem = new SectionItem({
        label: 'Test',
        isHidden: true,
      });

      const element = sectionItem.getEl();
      expect(element.style.display).toBe('none');
    });
  });

  describe('Label Rendering', () => {
    it('should create label element when label is provided', () => {
      sectionItem = new SectionItem({
        label: 'Test Label',
      });

      const label = sectionItem.getLabel();
      expect(label).toBeInstanceOf(HTMLElement);
      expect(label?.textContent).toBe('Test Label');
    });

    it('should not create label element when label is not provided', () => {
      sectionItem = new SectionItem({
        content: 'Content only',
      });

      const label = sectionItem.getLabel();
      expect(label).toBeUndefined();
    });

    it('should render label with HTML string', () => {
      sectionItem = new SectionItem({
        label: '<span class="custom">Formatted</span>',
      });

      const label = sectionItem.getLabel();
      expect(label?.querySelector('.custom')).toBeTruthy();
      expect(label?.textContent).toBe('Formatted');
    });

    it('should render label with HTMLElement', () => {
      const customLabel = document.createElement('strong');
      customLabel.textContent = 'Bold Label';

      sectionItem = new SectionItem({
        label: customLabel,
      });

      const label = sectionItem.getLabel();
      expect(label?.querySelector('strong')).toBeTruthy();
      expect(label?.textContent).toBe('Bold Label');
    });

    it('should render label with array of HTMLElements', () => {
      const span1 = document.createElement('span');
      span1.textContent = 'Part 1';
      const span2 = document.createElement('span');
      span2.textContent = ' Part 2';

      sectionItem = new SectionItem({
        label: [span1, span2],
      });

      const label = sectionItem.getLabel();
      expect(label?.textContent).toBe('Part 1 Part 2');
    });

    it('should apply label extended classes', () => {
      sectionItem = new SectionItem({
        label: 'Label',
        labelExtendedClasses: 'custom-label-class',
      });

      const label = sectionItem.getLabel();
      expect(label?.className).toContain('custom-label-class');
    });

    it('should have eb-label class for consistency', () => {
      sectionItem = new SectionItem({
        label: 'Label',
      });

      const label = sectionItem.getLabel();
      expect(label?.className).toContain('eb-label');
    });
  });

  describe('Content Rendering', () => {
    it('should create content element when content is provided', () => {
      sectionItem = new SectionItem({
        content: 'Test Content',
      });

      const content = sectionItem.getContent();
      expect(content).toBeInstanceOf(HTMLElement);
      expect(content?.textContent).toBe('Test Content');
    });

    it('should not create content element when content is not provided', () => {
      sectionItem = new SectionItem({
        label: 'Label only',
      });

      const content = sectionItem.getContent();
      expect(content).toBeUndefined();
    });

    it('should render content with HTML string', () => {
      sectionItem = new SectionItem({
        content: '<div class="custom-content"><p>Paragraph</p></div>',
      });

      const content = sectionItem.getContent();
      expect(content?.querySelector('.custom-content')).toBeTruthy();
      expect(content?.querySelector('p')).toBeTruthy();
    });

    it('should render content with HTMLElement', () => {
      const customContent = document.createElement('div');
      customContent.className = 'custom';
      customContent.textContent = 'Custom Content';

      sectionItem = new SectionItem({
        content: customContent,
      });

      const content = sectionItem.getContent();
      expect(content?.querySelector('.custom')).toBeTruthy();
    });

    it('should render content with array of HTMLElements', () => {
      const div1 = document.createElement('div');
      div1.textContent = 'First';
      const div2 = document.createElement('div');
      div2.textContent = 'Second';

      sectionItem = new SectionItem({
        content: [div1, div2],
      });

      const content = sectionItem.getContent();
      expect(content?.children.length).toBe(2);
      expect(content?.textContent).toContain('First');
      expect(content?.textContent).toContain('Second');
    });

    it('should apply content extended classes', () => {
      sectionItem = new SectionItem({
        content: 'Content',
        contentExtendedClasses: 'custom-content-class',
      });

      const content = sectionItem.getContent();
      expect(content?.className).toContain('custom-content-class');
    });
  });

  describe('Description Tooltip', () => {
    it('should add tooltip when description is provided', () => {
      sectionItem = new SectionItem({
        label: 'Label',
        description: 'This is a description',
      });

      const label = sectionItem.getLabel();
      // Tooltip is appended to the label
      expect(label?.children.length).toBeGreaterThan(0);
    });

    it('should not add tooltip when description is not provided', () => {
      sectionItem = new SectionItem({
        label: 'Label',
      });

      const label = sectionItem.getLabel();
      // Only the text content, no tooltip
      expect(label?.children.length).toBe(0);
    });
  });

  describe('Show/Hide Functionality', () => {
    beforeEach(() => {
      sectionItem = new SectionItem({
        label: 'Label',
        content: 'Content',
      });
    });

    it('should hide the section item when hide() is called', () => {
      sectionItem.hide();
      expect(sectionItem.getEl().style.display).toBe('none');
    });

    it('should show the section item when show() is called', () => {
      sectionItem.hide();
      sectionItem.show();
      expect(sectionItem.getEl().style.display).toBe('');
    });

    it('should toggle visibility', () => {
      // Start visible
      expect(sectionItem.getEl().style.display).toBe('');

      // Hide
      sectionItem.hide();
      expect(sectionItem.getEl().style.display).toBe('none');

      // Show
      sectionItem.show();
      expect(sectionItem.getEl().style.display).toBe('');
    });
  });

  describe('Element Structure', () => {
    it('should have label as first child when both label and content exist', () => {
      sectionItem = new SectionItem({
        label: 'Label',
        content: 'Content',
      });

      const element = sectionItem.getEl();
      const label = sectionItem.getLabel();
      const content = sectionItem.getContent();

      expect(element.children[0]).toBe(label);
      expect(element.children[1]).toBe(content);
    });

    it('should have only label when content is not provided', () => {
      sectionItem = new SectionItem({
        label: 'Label',
      });

      const element = sectionItem.getEl();
      expect(element.children.length).toBe(1);
      expect(element.children[0]).toBe(sectionItem.getLabel());
    });

    it('should have only content when label is not provided', () => {
      sectionItem = new SectionItem({
        content: 'Content',
      });

      const element = sectionItem.getEl();
      expect(element.children.length).toBe(1);
      expect(element.children[0]).toBe(sectionItem.getContent());
    });

    it('should have no children when neither label nor content is provided', () => {
      sectionItem = new SectionItem();

      const element = sectionItem.getEl();
      expect(element.children.length).toBe(0);
    });
  });

  describe('Public API', () => {
    it('should return root element via getEl()', () => {
      sectionItem = new SectionItem({
        label: 'Label',
        content: 'Content',
      });

      const element = sectionItem.getEl();
      expect(element).toBeInstanceOf(HTMLElement);
    });

    it('should return label element via getLabel()', () => {
      sectionItem = new SectionItem({
        label: 'Label',
      });

      const label = sectionItem.getLabel();
      expect(label).toBeInstanceOf(HTMLElement);
    });

    it('should return undefined from getLabel() when no label', () => {
      sectionItem = new SectionItem({
        content: 'Content',
      });

      const label = sectionItem.getLabel();
      expect(label).toBeUndefined();
    });

    it('should return content element via getContent()', () => {
      sectionItem = new SectionItem({
        content: 'Content',
      });

      const content = sectionItem.getContent();
      expect(content).toBeInstanceOf(HTMLElement);
    });

    it('should return undefined from getContent() when no content', () => {
      sectionItem = new SectionItem({
        label: 'Label',
      });

      const content = sectionItem.getContent();
      expect(content).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty label string', () => {
      sectionItem = new SectionItem({
        label: '',
      });

      // Empty strings are falsy, so no label element is created
      const label = sectionItem.getLabel();
      expect(label).toBeUndefined();
    });

    it('should handle empty content string', () => {
      sectionItem = new SectionItem({
        content: '',
      });

      // Empty strings are falsy, so no content element is created
      const content = sectionItem.getContent();
      expect(content).toBeUndefined();
    });

    it('should handle special characters in label', () => {
      sectionItem = new SectionItem({
        label: '<>&"\'',
      });

      const label = sectionItem.getLabel();
      expect(label?.innerHTML).toContain('&lt;&gt;&amp;');
    });

    it('should handle special characters in content', () => {
      sectionItem = new SectionItem({
        content: '!@#$%^&amp;*()',
      });

      const content = sectionItem.getContent();
      expect(content?.textContent).toBeTruthy();
    });

    it('should handle long content strings', () => {
      const longContent = 'A'.repeat(10000);

      sectionItem = new SectionItem({
        content: longContent,
      });

      const content = sectionItem.getContent();
      expect(content?.textContent?.length).toBe(10000);
    });

    it('should handle multiple extended classes', () => {
      sectionItem = new SectionItem({
        extendedClasses: 'class1 class2 class3',
        labelExtendedClasses: 'label1 label2',
        contentExtendedClasses: 'content1 content2',
        label: 'Label',
        content: 'Content',
      });

      const element = sectionItem.getEl();
      const label = sectionItem.getLabel();
      const content = sectionItem.getContent();

      expect(element.className).toContain('class1');
      expect(element.className).toContain('class2');
      expect(element.className).toContain('class3');
      expect(label?.className).toContain('label1');
      expect(label?.className).toContain('label2');
      expect(content?.className).toContain('content1');
      expect(content?.className).toContain('content2');
    });
  });

  describe('Destroy', () => {
    it('should remove element from DOM on destroy', () => {
      sectionItem = new SectionItem({
        label: 'Label',
        content: 'Content',
      });

      const element = sectionItem.getEl();
      document.body.appendChild(element);

      expect(document.body.contains(element)).toBe(true);

      sectionItem.destroy();

      expect(document.body.contains(element)).toBe(false);
    });

    it('should clean up tooltip on destroy', () => {
      sectionItem = new SectionItem({
        label: 'Label',
        description: 'Description',
      });

      const element = sectionItem.getEl();
      document.body.appendChild(element);

      // Should not throw error
      expect(() => sectionItem.destroy()).not.toThrow();
      expect(document.body.contains(element)).toBe(false);
    });
  });

  describe('Custom Tag Names', () => {
    it('should create article element', () => {
      sectionItem = new SectionItem({
        tagName: 'article',
        label: 'Article Label',
      });

      expect(sectionItem.getEl().tagName).toBe('ARTICLE');
    });

    it('should create section element', () => {
      sectionItem = new SectionItem({
        tagName: 'section',
        label: 'Section Label',
      });

      expect(sectionItem.getEl().tagName).toBe('SECTION');
    });

    it('should create aside element', () => {
      sectionItem = new SectionItem({
        tagName: 'aside',
        label: 'Aside Label',
      });

      expect(sectionItem.getEl().tagName).toBe('ASIDE');
    });
  });
});
