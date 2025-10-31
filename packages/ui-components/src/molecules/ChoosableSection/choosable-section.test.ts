import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ChoosableSection } from './ChoosableSection';
import type { ChoosableSectionItem, ChoosableSectionProps } from './choosable-section.types';

describe('ChoosableSection', () => {
  describe('initialization and rendering', () => {
    it('should create a choosable section with default props', () => {
      const section = new ChoosableSection();
      const el = section.getEl();

      expect(el).toBeInstanceOf(HTMLElement);
      expect(el.tagName.toLowerCase()).toBe('div');
    });

    it('should create a choosable section with custom tag name', () => {
      const section = new ChoosableSection({ tagName: 'section' });
      const el = section.getEl();

      expect(el.tagName.toLowerCase()).toBe('section');
    });

    it('should apply extended classes to root element', () => {
      const section = new ChoosableSection({ extendedClasses: 'custom-class' });
      const el = section.getEl();

      expect(el.classList.contains('custom-class')).toBe(true);
    });

    it('should have correct element structure', () => {
      const section = new ChoosableSection({
        label: 'Test Label',
        items: [
          { label: 'Item 1', content: 'Content 1', active: true },
        ],
      });
      const el = section.getEl();

      // Should have label wrapper
      const labelWrapper = el.querySelector('[class*="label-wrapper"]');
      expect(labelWrapper).toBeTruthy();

      // Should have content area
      const content = section.getContent();
      expect(content).toBeInstanceOf(HTMLElement);
    });
  });

  describe('label rendering', () => {
    it('should render main label as string', () => {
      const section = new ChoosableSection({ label: 'Main Label' });
      const el = section.getEl();
      const label = el.querySelector('label.eb-label');

      expect(label).toBeTruthy();
      expect(label?.textContent).toBe('Main Label');
    });

    it('should render main label as HTMLElement', () => {
      const labelEl = document.createElement('span');
      labelEl.textContent = 'Custom Label';
      const section = new ChoosableSection({ label: labelEl });
      const el = section.getEl();
      const label = el.querySelector('label.eb-label');

      expect(label?.querySelector('span')).toBeTruthy();
      expect(label?.textContent).toBe('Custom Label');
    });

    it('should render dropdown label when provided', () => {
      const section = new ChoosableSection({
        label: 'Main Label',
        dropdownLabel: 'Select:',
        items: [{ label: 'Item 1', content: 'Content 1' }],
      });
      const el = section.getEl();
      const dropdownLabels = el.querySelectorAll('label.eb-label');

      // Should have 2 labels: main label and dropdown label
      expect(dropdownLabels.length).toBeGreaterThanOrEqual(2);
    });

    it('should not render dropdown label wrapper when not provided', () => {
      const section = new ChoosableSection({
        label: 'Main Label',
        items: [{ label: 'Item 1', content: 'Content 1' }],
      });
      const el = section.getEl();
      const dropdownLabelWrapper = el.querySelector('[class*="dropdown-label-wrapper"]');

      expect(dropdownLabelWrapper).toBeFalsy();
    });

    it('should apply label extended classes', () => {
      const section = new ChoosableSection({
        label: 'Test',
        labelExtendedClasses: 'custom-label-class',
      });
      const el = section.getEl();
      const label = el.querySelector('label.eb-label');

      expect(label?.classList.contains('custom-label-class')).toBe(true);
    });

    it('should apply dropdown label extended classes', () => {
      const section = new ChoosableSection({
        label: 'Main',
        dropdownLabel: 'Select:',
        dropdownLabelExtendedClasses: 'custom-dropdown-label-class',
        items: [{ label: 'Item 1', content: 'Content 1' }],
      });
      const el = section.getEl();
      const labels = Array.from(el.querySelectorAll('label.eb-label'));
      const hasCustomClass = labels.some((label) =>
        label.classList.contains('custom-dropdown-label-class')
      );

      expect(hasCustomClass).toBe(true);
    });
  });

  describe('dropdown and items', () => {
    it('should create dropdown with provided items', () => {
      const items: ChoosableSectionItem[] = [
        { label: 'Item 1', content: 'Content 1' },
        { label: 'Item 2', content: 'Content 2' },
        { label: 'Item 3', content: 'Content 3' },
      ];
      const section = new ChoosableSection({ items });
      const dropdown = section.getDropdown();

      expect(dropdown).toBeTruthy();
      expect(dropdown.items.length).toBe(3);
    });

    it('should set active item on initialization', () => {
      const items: ChoosableSectionItem[] = [
        { label: 'Item 1', content: 'Content 1' },
        { label: 'Item 2', content: 'Content 2', active: true },
        { label: 'Item 3', content: 'Content 3' },
      ];
      const section = new ChoosableSection({ items });
      const dropdown = section.getDropdown();

      expect(dropdown.activeItem).toBeTruthy();
    });

    it('should display content of active item on initialization', () => {
      const items: ChoosableSectionItem[] = [
        { label: 'Item 1', content: '<p>Content 1</p>', active: true },
        { label: 'Item 2', content: '<p>Content 2</p>' },
      ];
      const section = new ChoosableSection({ items });
      const content = section.getContent();

      expect(content.innerHTML).toContain('Content 1');
    });

    it('should handle function content', () => {
      const contentFn = vi.fn(() => '<div>Dynamic Content</div>');
      const items: ChoosableSectionItem[] = [
        { label: 'Item 1', content: contentFn, active: true },
      ];
      const section = new ChoosableSection({ items });

      expect(contentFn).toHaveBeenCalled();
      expect(section.getContent().innerHTML).toContain('Dynamic Content');
    });

    it('should handle HTMLElement content', () => {
      const contentEl = document.createElement('div');
      contentEl.textContent = 'Element Content';
      const items: ChoosableSectionItem[] = [
        { label: 'Item 1', content: contentEl, active: true },
      ];
      const section = new ChoosableSection({ items });
      const content = section.getContent();

      expect(content.querySelector('div')).toBeTruthy();
      expect(content.textContent).toBe('Element Content');
    });

    it('should change content when different item is selected', () => {
      const items: ChoosableSectionItem[] = [
        { label: 'Item 1', content: 'Content 1', active: true },
        { label: 'Item 2', content: 'Content 2' },
      ];
      const section = new ChoosableSection({ items });
      const dropdown = section.getDropdown();

      // Select second item
      const secondItem = dropdown.items[1];
      if (secondItem && typeof secondItem.onItemClick === 'function') {
        secondItem.onItemClick();
      }

      const content = section.getContent();
      expect(content.innerHTML).toContain('Content 2');
    });
  });

  describe('onChange callback', () => {
    it('should call onChange when item is selected', () => {
      const onChange = vi.fn();
      const items: ChoosableSectionItem[] = [
        { label: 'Item 1', content: 'Content 1', active: true },
        { label: 'Item 2', content: 'Content 2' },
      ];
      const section = new ChoosableSection({ items, onChange });
      const dropdown = section.getDropdown();

      // Initially called for active item
      expect(onChange).toHaveBeenCalled();

      // Select second item
      const secondItem = dropdown.items[1];
      if (secondItem && typeof secondItem.onItemClick === 'function') {
        secondItem.onItemClick();
      }

      expect(onChange).toHaveBeenCalledTimes(2);
    });

    it('should pass item data to onChange callback', () => {
      const onChange = vi.fn();
      const items: ChoosableSectionItem[] = [
        { label: 'Item 1', content: 'Content 1', active: true },
        { label: 'Item 2', content: 'Content 2' },
      ];
      const section = new ChoosableSection({ items, onChange });
      const dropdown = section.getDropdown();

      // Select second item
      const secondItem = dropdown.items[1];
      if (secondItem && typeof secondItem.onItemClick === 'function') {
        secondItem.onItemClick();
      }

      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
        label: 'Item 2',
        content: 'Content 2',
      }));
    });
  });

  describe('item callbacks', () => {
    it('should call item onSelect callback when selected', () => {
      const onSelect = vi.fn();
      const items: ChoosableSectionItem[] = [
        { label: 'Item 1', content: 'Content 1', active: true },
        { label: 'Item 2', content: 'Content 2', onSelect },
      ];
      const section = new ChoosableSection({ items });
      const dropdown = section.getDropdown();

      // Select second item by clicking
      const secondItem = dropdown.items[1];
      if (secondItem && secondItem.element) {
        secondItem.element.click();
      }

      expect(onSelect).toHaveBeenCalled();
    });

    it('should call item onDeselect callback when deselected', () => {
      const onDeselect = vi.fn();
      const items: ChoosableSectionItem[] = [
        { label: 'Item 1', content: 'Content 1', active: true, onDeselect },
        { label: 'Item 2', content: 'Content 2' },
      ];
      const section = new ChoosableSection({ items });
      const dropdown = section.getDropdown();

      // Select second item by clicking (deselects first)
      const secondItem = dropdown.items[1];
      if (secondItem && secondItem.element) {
        secondItem.element.click();
      }

      expect(onDeselect).toHaveBeenCalled();
    });
  });

  describe('content management', () => {
    it('should update content with setContent method', () => {
      const section = new ChoosableSection({
        items: [{ label: 'Item 1', content: 'Initial Content', active: true }],
      });

      section.setContent('Updated Content');
      const content = section.getContent();

      expect(content.innerHTML).toBe('Updated Content');
    });

    it('should update content with HTMLElement using setContent', () => {
      const section = new ChoosableSection({
        items: [{ label: 'Item 1', content: 'Initial Content', active: true }],
      });

      const newContent = document.createElement('div');
      newContent.textContent = 'Updated Element';
      section.setContent(newContent);
      const content = section.getContent();

      expect(content.querySelector('div')).toBeTruthy();
      expect(content.textContent).toBe('Updated Element');
    });

    it('should apply content extended classes', () => {
      const section = new ChoosableSection({
        contentExtendedClasses: 'custom-content-class',
        items: [{ label: 'Item 1', content: 'Content' }],
      });
      const content = section.getContent();

      expect(content.classList.contains('custom-content-class')).toBe(true);
    });
  });

  describe('event system', () => {
    it('should register event listener with on()', () => {
      const section = new ChoosableSection({
        items: [
          { label: 'Item 1', content: 'Content 1', active: true },
          { label: 'Item 2', content: 'Content 2' },
        ],
      });
      const listener = vi.fn();

      section.on('change', listener);

      // Trigger change by selecting item
      const dropdown = section.getDropdown();
      const secondItem = dropdown.items[1];
      if (secondItem && typeof secondItem.onItemClick === 'function') {
        secondItem.onItemClick();
      }

      expect(listener).toHaveBeenCalled();
    });

    it('should unregister event listener with off()', () => {
      const section = new ChoosableSection({
        items: [
          { label: 'Item 1', content: 'Content 1', active: true },
          { label: 'Item 2', content: 'Content 2' },
        ],
      });
      const listener = vi.fn();

      section.on('change', listener);
      section.off('change', listener);

      // Trigger change
      const dropdown = section.getDropdown();
      const secondItem = dropdown.items[1];
      if (secondItem && typeof secondItem.onItemClick === 'function') {
        secondItem.onItemClick();
      }

      expect(listener).not.toHaveBeenCalled();
    });

    it('should support multiple event listeners', () => {
      const section = new ChoosableSection({
        items: [
          { label: 'Item 1', content: 'Content 1', active: true },
          { label: 'Item 2', content: 'Content 2' },
        ],
      });
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      section.on('change', listener1);
      section.on('change', listener2);

      // Trigger change
      const dropdown = section.getDropdown();
      const secondItem = dropdown.items[1];
      if (secondItem && typeof secondItem.onItemClick === 'function') {
        secondItem.onItemClick();
      }

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });
  });

  describe('public API methods', () => {
    it('should return root element with getEl()', () => {
      const section = new ChoosableSection();
      const el = section.getEl();

      expect(el).toBeInstanceOf(HTMLElement);
    });

    it('should return dropdown with getDropdown()', () => {
      const section = new ChoosableSection({
        items: [{ label: 'Item 1', content: 'Content 1' }],
      });
      const dropdown = section.getDropdown();

      expect(dropdown).toBeTruthy();
      expect(typeof dropdown.getEl).toBe('function');
    });

    it('should return content element with getContent()', () => {
      const section = new ChoosableSection();
      const content = section.getContent();

      expect(content).toBeInstanceOf(HTMLElement);
    });
  });

  describe('destroy and cleanup', () => {
    it('should remove element from DOM when destroyed', () => {
      const section = new ChoosableSection();
      const el = section.getEl();
      document.body.appendChild(el);

      expect(document.body.contains(el)).toBe(true);

      section.destroy();

      expect(document.body.contains(el)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle empty items array', () => {
      const section = new ChoosableSection({ items: [] });
      const dropdown = section.getDropdown();

      expect(dropdown.items.length).toBe(0);
    });

    it('should handle null label', () => {
      const section = new ChoosableSection({ label: null });
      const el = section.getEl();
      const label = el.querySelector('label.eb-label');

      expect(label).toBeTruthy();
      expect(label?.textContent).toBe('');
    });

    it('should handle empty strings in labels', () => {
      const section = new ChoosableSection({
        label: '',
        dropdownLabel: '',
        items: [{ label: '', content: '' }],
      });

      expect(section.getEl()).toBeInstanceOf(HTMLElement);
    });

    it('should handle special characters in content', () => {
      const section = new ChoosableSection({
        items: [
          {
            label: 'Special',
            content: '<div>&lt;script&gt;alert("xss")&lt;/script&gt;</div>',
            active: true,
          },
        ],
      });
      const content = section.getContent();

      expect(content.innerHTML).toContain('&lt;script&gt;');
    });

    it('should handle rapid item selection changes', () => {
      const items: ChoosableSectionItem[] = [
        { label: 'Item 1', content: 'Content 1', active: true },
        { label: 'Item 2', content: 'Content 2' },
        { label: 'Item 3', content: 'Content 3' },
      ];
      const section = new ChoosableSection({ items });
      const dropdown = section.getDropdown();

      // Rapid selections
      dropdown.items.forEach((item, index) => {
        if (item && typeof item.onItemClick === 'function') {
          item.onItemClick();
        }
      });

      const content = section.getContent();
      expect(content.innerHTML).toContain('Content 3');
    });

    it('should handle content function that returns HTMLElement', () => {
      const contentFn = () => {
        const el = document.createElement('div');
        el.textContent = 'Dynamic Element';
        return el;
      };
      const items: ChoosableSectionItem[] = [
        { label: 'Item 1', content: contentFn, active: true },
      ];
      const section = new ChoosableSection({ items });
      const content = section.getContent();

      expect(content.querySelector('div')).toBeTruthy();
      expect(content.textContent).toBe('Dynamic Element');
    });

    it('should maintain reference integrity after operations', () => {
      const section = new ChoosableSection({
        items: [{ label: 'Item 1', content: 'Content 1', active: true }],
      });
      const el1 = section.getEl();
      const content1 = section.getContent();

      // Perform some operations
      section.setContent('New Content');

      const el2 = section.getEl();
      const content2 = section.getContent();

      expect(el1).toBe(el2);
      expect(content1).toBe(content2);
    });
  });

  describe('integration', () => {
    it('should work with complex dropdown configurations', () => {
      const items: ChoosableSectionItem[] = [
        {
          label: '<strong>Bold Label</strong>',
          content: '<h2>Heading Content</h2>',
          active: true,
        },
        {
          label: 'Regular Label',
          content: '<ul><li>List Item</li></ul>',
        },
      ];
      const section = new ChoosableSection({
        label: 'Complex Section',
        dropdownLabel: 'Choose:',
        items,
      });

      expect(section.getEl()).toBeInstanceOf(HTMLElement);
      expect(section.getContent().innerHTML).toContain('Heading Content');
    });

    it('should handle all extended classes together', () => {
      const section = new ChoosableSection({
        extendedClasses: 'root-class',
        labelExtendedClasses: 'label-class',
        contentExtendedClasses: 'content-class',
        dropdownLabelExtendedClasses: 'dropdown-label-class',
        label: 'Test',
        dropdownLabel: 'Select:',
        items: [{ label: 'Item 1', content: 'Content 1' }],
      });
      const el = section.getEl();

      expect(el.classList.contains('root-class')).toBe(true);
      expect(section.getContent().classList.contains('content-class')).toBe(true);
    });

    it('should emit change event for active item on initialization', () => {
      const onChange = vi.fn();
      const items: ChoosableSectionItem[] = [
        { label: 'Item 1', content: 'Content 1', active: true },
      ];

      new ChoosableSection({ items, onChange });

      expect(onChange).toHaveBeenCalled();
    });
  });
});
