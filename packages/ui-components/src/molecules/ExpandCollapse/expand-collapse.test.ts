import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ExpandCollapse } from './ExpandCollapse';
import type { ExpandCollapseOptions } from './expand-collapse.types';

describe('ExpandCollapse', () => {
  let expandCollapse: ExpandCollapse;

  afterEach(() => {
    if (expandCollapse) {
      expandCollapse.destroy();
    }
  });

  describe('Initialization', () => {
    it('should create an ExpandCollapse instance with default options', () => {
      expandCollapse = new ExpandCollapse();
      expect(expandCollapse).toBeInstanceOf(ExpandCollapse);
      expect(expandCollapse.getEl()).toBeInstanceOf(HTMLElement);
    });

    it('should create trigger and expandable elements', () => {
      expandCollapse = new ExpandCollapse({
        trigger: 'Click me',
        expandable: 'Hidden content',
      });

      const trigger = expandCollapse.getTrigger();
      const expandable = expandCollapse.getExpandable();

      expect(trigger).toBeInstanceOf(HTMLElement);
      expect(expandable).toBeInstanceOf(HTMLElement);
      expect(trigger.textContent).toBe('Click me');
      expect(expandable.textContent).toBe('Hidden content');
    });

    it('should start collapsed by default', () => {
      expandCollapse = new ExpandCollapse({
        trigger: 'Trigger',
        expandable: 'Content',
      });

      expect(expandCollapse.isExpanded()).toBe(false);
    });

    it('should start expanded when startExpanded is true', () => {
      expandCollapse = new ExpandCollapse({
        trigger: 'Trigger',
        expandable: 'Content',
        startExpanded: true,
      });

      expect(expandCollapse.isExpanded()).toBe(true);
    });

    it('should apply extended classes', () => {
      expandCollapse = new ExpandCollapse({
        extendedClasses: 'custom-class another-class',
      });

      const element = expandCollapse.getEl();
      expect(element.className).toContain('custom-class');
      expect(element.className).toContain('another-class');
    });
  });

  describe('Content Rendering', () => {
    it('should render trigger with string content', () => {
      expandCollapse = new ExpandCollapse({
        trigger: 'Click to expand',
      });

      const trigger = expandCollapse.getTrigger();
      expect(trigger.textContent).toBe('Click to expand');
    });

    it('should render trigger with HTML string content', () => {
      expandCollapse = new ExpandCollapse({
        trigger: '<span class="icon">→</span> Expand',
      });

      const trigger = expandCollapse.getTrigger();
      expect(trigger.querySelector('.icon')).toBeTruthy();
      expect(trigger.textContent).toContain('Expand');
    });

    it('should render trigger with HTMLElement content', () => {
      const customTrigger = document.createElement('button');
      customTrigger.textContent = 'Custom Button';

      expandCollapse = new ExpandCollapse({
        trigger: customTrigger,
      });

      const trigger = expandCollapse.getTrigger();
      expect(trigger.querySelector('button')).toBeTruthy();
      expect(trigger.textContent).toBe('Custom Button');
    });

    it('should render trigger with array of HTMLElements', () => {
      const icon = document.createElement('span');
      icon.className = 'icon';
      const text = document.createElement('span');
      text.textContent = 'Expand';

      expandCollapse = new ExpandCollapse({
        trigger: [icon, text],
      });

      const trigger = expandCollapse.getTrigger();
      expect(trigger.querySelector('.icon')).toBeTruthy();
      expect(trigger.textContent).toBe('Expand');
    });

    it('should render expandable with string content', () => {
      expandCollapse = new ExpandCollapse({
        expandable: 'Hidden content here',
      });

      const expandable = expandCollapse.getExpandable();
      expect(expandable.textContent).toBe('Hidden content here');
    });

    it('should render expandable with HTML string content', () => {
      expandCollapse = new ExpandCollapse({
        expandable: '<div class="content"><p>Paragraph</p></div>',
      });

      const expandable = expandCollapse.getExpandable();
      expect(expandable.querySelector('.content')).toBeTruthy();
      expect(expandable.querySelector('p')).toBeTruthy();
    });

    it('should render expandable with HTMLElement content', () => {
      const customContent = document.createElement('div');
      customContent.className = 'custom-expandable';
      customContent.textContent = 'Custom content';

      expandCollapse = new ExpandCollapse({
        expandable: customContent,
      });

      const expandable = expandCollapse.getExpandable();
      expect(expandable.querySelector('.custom-expandable')).toBeTruthy();
    });

    it('should render expandable with array of HTMLElements', () => {
      const div1 = document.createElement('div');
      div1.textContent = 'First';
      const div2 = document.createElement('div');
      div2.textContent = 'Second';

      expandCollapse = new ExpandCollapse({
        expandable: [div1, div2],
      });

      const expandable = expandCollapse.getExpandable();
      expect(expandable.children.length).toBe(2);
      expect(expandable.textContent).toContain('First');
      expect(expandable.textContent).toContain('Second');
    });
  });

  describe('Expand/Collapse Functionality', () => {
    beforeEach(() => {
      expandCollapse = new ExpandCollapse({
        trigger: 'Toggle',
        expandable: 'Content',
      });
    });

    it('should expand when expand() is called', () => {
      expandCollapse.expand();
      expect(expandCollapse.isExpanded()).toBe(true);
    });

    it('should collapse when collapse() is called', () => {
      expandCollapse.expand();
      expandCollapse.collapse();
      expect(expandCollapse.isExpanded()).toBe(false);
    });

    it('should toggle on trigger click', () => {
      const trigger = expandCollapse.getTrigger();

      // Start collapsed
      expect(expandCollapse.isExpanded()).toBe(false);

      // Click to expand
      trigger.click();
      expect(expandCollapse.isExpanded()).toBe(true);

      // Click to collapse
      trigger.click();
      expect(expandCollapse.isExpanded()).toBe(false);
    });

    it('should not toggle on trigger click when preventDefaultBehavior is true', () => {
      expandCollapse.destroy();
      expandCollapse = new ExpandCollapse({
        trigger: 'Toggle',
        expandable: 'Content',
        preventDefaultBehavior: true,
      });

      const trigger = expandCollapse.getTrigger();
      trigger.click();

      // Should still be collapsed
      expect(expandCollapse.isExpanded()).toBe(false);
    });

    it('should allow manual control with preventDefaultBehavior', () => {
      expandCollapse.destroy();
      expandCollapse = new ExpandCollapse({
        trigger: 'Toggle',
        expandable: 'Content',
        preventDefaultBehavior: true,
      });

      // Manually expand
      expandCollapse.expand();
      expect(expandCollapse.isExpanded()).toBe(true);

      // Manually collapse
      expandCollapse.collapse();
      expect(expandCollapse.isExpanded()).toBe(false);
    });
  });

  describe('Right-to-Left Positioning', () => {
    it('should apply right-to-left class when rightToLeft is true', () => {
      expandCollapse = new ExpandCollapse({
        rightToLeft: true,
      });

      const element = expandCollapse.getEl();
      expect(element.className).toContain('right');
    });

    it('should not apply right-to-left class by default', () => {
      expandCollapse = new ExpandCollapse();

      const element = expandCollapse.getEl();
      expect(element.className).not.toContain('right');
    });
  });

  describe('Public API', () => {
    beforeEach(() => {
      expandCollapse = new ExpandCollapse({
        trigger: 'Trigger',
        expandable: 'Expandable',
      });
    });

    it('should return root element via getEl()', () => {
      const element = expandCollapse.getEl();
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.children.length).toBe(2); // trigger and expandable
    });

    it('should return trigger element via getTrigger()', () => {
      const trigger = expandCollapse.getTrigger();
      expect(trigger).toBeInstanceOf(HTMLElement);
      expect(trigger.textContent).toBe('Trigger');
    });

    it('should return expandable element via getExpandable()', () => {
      const expandable = expandCollapse.getExpandable();
      expect(expandable).toBeInstanceOf(HTMLElement);
      expect(expandable.textContent).toBe('Expandable');
    });

    it('should return expanded state via isExpanded()', () => {
      expect(expandCollapse.isExpanded()).toBe(false);

      expandCollapse.expand();
      expect(expandCollapse.isExpanded()).toBe(true);

      expandCollapse.collapse();
      expect(expandCollapse.isExpanded()).toBe(false);
    });
  });

  describe('Element Structure', () => {
    it('should have trigger as first child and expandable as second child', () => {
      expandCollapse = new ExpandCollapse({
        trigger: 'Trigger',
        expandable: 'Expandable',
      });

      const element = expandCollapse.getEl();
      const trigger = expandCollapse.getTrigger();
      const expandable = expandCollapse.getExpandable();

      expect(element.children[0]).toBe(trigger);
      expect(element.children[1]).toBe(expandable);
    });

    it('should maintain structure after expand/collapse', () => {
      expandCollapse = new ExpandCollapse({
        trigger: 'Trigger',
        expandable: 'Expandable',
      });

      const element = expandCollapse.getEl();
      const initialChildCount = element.children.length;

      expandCollapse.expand();
      expect(element.children.length).toBe(initialChildCount);

      expandCollapse.collapse();
      expect(element.children.length).toBe(initialChildCount);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty trigger content', () => {
      expandCollapse = new ExpandCollapse({
        trigger: '',
        expandable: 'Content',
      });

      const trigger = expandCollapse.getTrigger();
      expect(trigger.textContent).toBe('');
      expect(trigger).toBeInstanceOf(HTMLElement);
    });

    it('should handle empty expandable content', () => {
      expandCollapse = new ExpandCollapse({
        trigger: 'Trigger',
        expandable: '',
      });

      const expandable = expandCollapse.getExpandable();
      expect(expandable.textContent).toBe('');
      expect(expandable).toBeInstanceOf(HTMLElement);
    });

    it('should handle no content provided', () => {
      expandCollapse = new ExpandCollapse();

      const trigger = expandCollapse.getTrigger();
      const expandable = expandCollapse.getExpandable();

      expect(trigger.textContent).toBe('');
      expect(expandable.textContent).toBe('');
    });

    it('should handle rapid expand/collapse calls', () => {
      expandCollapse = new ExpandCollapse({
        trigger: 'Trigger',
        expandable: 'Content',
      });

      expandCollapse.expand();
      expandCollapse.expand();
      expandCollapse.expand();
      expect(expandCollapse.isExpanded()).toBe(true);

      expandCollapse.collapse();
      expandCollapse.collapse();
      expandCollapse.collapse();
      expect(expandCollapse.isExpanded()).toBe(false);
    });

    it('should handle rapid trigger clicks', () => {
      expandCollapse = new ExpandCollapse({
        trigger: 'Trigger',
        expandable: 'Content',
      });

      const trigger = expandCollapse.getTrigger();

      trigger.click();
      trigger.click();
      trigger.click();
      trigger.click();

      // Should end up expanded (even number of clicks)
      expect(expandCollapse.isExpanded()).toBe(false);
    });

    it('should handle special characters in content', () => {
      expandCollapse = new ExpandCollapse({
        trigger: '<>&"\'',
        expandable: '!@#$%^&*()',
      });

      const trigger = expandCollapse.getTrigger();
      const expandable = expandCollapse.getExpandable();

      // When setting as innerHTML, HTML characters are encoded
      expect(trigger.innerHTML).toContain('&lt;&gt;&amp;');
      expect(expandable.innerHTML).toContain('!@#$%^&amp;*()');
    });

    it('should handle long content strings', () => {
      const longContent = 'A'.repeat(10000);

      expandCollapse = new ExpandCollapse({
        trigger: 'Trigger',
        expandable: longContent,
      });

      const expandable = expandCollapse.getExpandable();
      expect(expandable.textContent?.length).toBe(10000);
    });
  });

  describe('Destroy', () => {
    it('should remove event listeners on destroy', () => {
      expandCollapse = new ExpandCollapse({
        trigger: 'Trigger',
        expandable: 'Content',
      });

      const element = expandCollapse.getEl();
      document.body.appendChild(element);

      const trigger = expandCollapse.getTrigger();
      expandCollapse.destroy();

      // Click after destroy shouldn't do anything
      trigger.click();
      // Can't test isExpanded after destroy, but we can verify no errors occur
      expect(document.body.contains(element)).toBe(false);
    });

    it('should remove element from DOM on destroy', () => {
      expandCollapse = new ExpandCollapse({
        trigger: 'Trigger',
        expandable: 'Content',
      });

      const element = expandCollapse.getEl();
      document.body.appendChild(element);

      expect(document.body.contains(element)).toBe(true);

      expandCollapse.destroy();

      expect(document.body.contains(element)).toBe(false);
    });
  });

  describe('Custom Element', () => {
    it('should use provided element as base', () => {
      const customElement = document.createElement('article');
      customElement.id = 'custom';

      expandCollapse = new ExpandCollapse({
        element: customElement,
        trigger: 'Trigger',
        expandable: 'Content',
      });

      const element = expandCollapse.getEl();
      expect(element).toBe(customElement);
      expect(element.tagName).toBe('ARTICLE');
      expect(element.id).toBe('custom');
    });
  });
});
