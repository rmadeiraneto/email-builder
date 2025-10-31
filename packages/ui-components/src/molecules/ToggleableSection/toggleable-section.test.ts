import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ToggleableSection } from './ToggleableSection';
import type { IToggleableSection } from './toggleable-section.types';

describe('ToggleableSection', () => {
  let section: IToggleableSection;

  afterEach(() => {
    if (section) {
      section.destroy();
    }
  });

  describe('Initialization and Rendering', () => {
    it('should create a toggleable section element', () => {
      section = new ToggleableSection({
        label: 'Test Label',
        content: 'Test Content',
      });

      expect(section).toBeDefined();
      expect(section.getEl()).toBeInstanceOf(HTMLElement);
    });

    it('should use default tag name "div"', () => {
      section = new ToggleableSection({
        label: 'Test',
        content: 'Content',
      });

      expect(section.getEl().tagName).toBe('DIV');
    });

    it('should use custom tag name when provided', () => {
      section = new ToggleableSection({
        tagName: 'section',
        label: 'Test',
        content: 'Content',
      });

      expect(section.getEl().tagName).toBe('SECTION');
    });

    it('should apply extended classes to root element', () => {
      section = new ToggleableSection({
        label: 'Test',
        content: 'Content',
        extendedClasses: 'custom-class another-class',
      });

      const element = section.getEl();
      expect(element.classList.contains('custom-class')).toBe(true);
      expect(element.classList.contains('another-class')).toBe(true);
    });

    it('should not apply type modifier class for default "section" type', () => {
      section = new ToggleableSection({
        label: 'Test',
        content: 'Content',
        type: 'section',
      });

      const element = section.getEl();
      const classString = element.className;
      expect(classString).not.toMatch(/--section/);
    });

    it('should apply type modifier class for non-default types', () => {
      section = new ToggleableSection({
        label: 'Test',
        content: 'Content',
        type: 'custom',
      });

      const element = section.getEl();
      const classString = element.className;
      expect(classString).toMatch(/toggleableSection--custom/);
    });
  });

  describe('Label Rendering', () => {
    it('should render label with text content', () => {
      section = new ToggleableSection({
        label: 'My Label',
        content: 'Content',
      });

      const element = section.getEl();
      const label = element.querySelector('label');
      expect(label).toBeDefined();
      expect(label?.textContent).toContain('My Label');
    });

    it('should render label with HTML content', () => {
      section = new ToggleableSection({
        label: '<span class="test-label">HTML Label</span>',
        content: 'Content',
      });

      const element = section.getEl();
      const label = element.querySelector('label');
      const span = label?.querySelector('.test-label');
      expect(span).toBeDefined();
      expect(span?.textContent).toBe('HTML Label');
    });

    it('should render label with HTMLElement content', () => {
      const labelElement = document.createElement('strong');
      labelElement.textContent = 'Strong Label';

      section = new ToggleableSection({
        label: labelElement,
        content: 'Content',
      });

      const element = section.getEl();
      const label = element.querySelector('label');
      const strong = label?.querySelector('strong');
      expect(strong).toBeDefined();
      expect(strong?.textContent).toBe('Strong Label');
    });

    it('should apply extended classes to label', () => {
      section = new ToggleableSection({
        label: 'Test',
        content: 'Content',
        labelExtendedClasses: 'custom-label-class',
      });

      const element = section.getEl();
      const label = element.querySelector('label');
      expect(label?.classList.contains('custom-label-class')).toBe(true);
    });

    it('should apply eb-label class to label', () => {
      section = new ToggleableSection({
        label: 'Test',
        content: 'Content',
      });

      const element = section.getEl();
      const label = element.querySelector('label');
      expect(label?.classList.contains('eb-label')).toBe(true);
    });
  });

  describe('Content Rendering', () => {
    it('should render content with text', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'My Content',
      });

      const element = section.getEl();
      const content = element.querySelector('[class*="__content"]');
      expect(content).toBeDefined();
      expect(content?.textContent).toContain('My Content');
    });

    it('should render content with HTML', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: '<div class="test-content">HTML Content</div>',
      });

      const element = section.getEl();
      const contentDiv = element.querySelector('.test-content');
      expect(contentDiv).toBeDefined();
      expect(contentDiv?.textContent).toBe('HTML Content');
    });

    it('should render content with HTMLElement', () => {
      const contentElement = document.createElement('p');
      contentElement.textContent = 'Element Content';

      section = new ToggleableSection({
        label: 'Label',
        content: contentElement,
      });

      const element = section.getEl();
      const p = element.querySelector('p');
      expect(p).toBeDefined();
      expect(p?.textContent).toBe('Element Content');
    });

    it('should apply extended classes to content', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        contentExtendedClasses: 'custom-content-class',
      });

      const element = section.getEl();
      const content = element.querySelector('[class*="__content"]');
      expect(content?.classList.contains('custom-content-class')).toBe(true);
    });
  });

  describe('Non-Toggleable Section (toggleableContent: false)', () => {
    it('should not create toggle button when toggleableContent is false', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: false,
      });

      const element = section.getEl();
      const toggleButton = element.querySelector('[class*="toggle-button"]');
      expect(toggleButton).toBeNull();
    });

    it('should not create label wrapper when toggleableContent is false', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: false,
      });

      const element = section.getEl();
      const labelWrapper = element.querySelector('[class*="__labelWrapper"]');
      expect(labelWrapper).toBeNull();
    });

    it('should show content by default when not toggleable', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: false,
      });

      expect(section.isOpenState()).toBe(true);
    });
  });

  describe('Toggleable Section (toggleableContent: true)', () => {
    it('should create toggle button when toggleableContent is true', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
      });

      const element = section.getEl();
      const toggleButton = element.querySelector('[class*="toggle-button"]');
      expect(toggleButton).toBeDefined();
    });

    it('should create label wrapper when toggleableContent is true', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
      });

      const element = section.getEl();
      const labelWrapper = element.querySelector('[class*="__labelWrapper"]');
      expect(labelWrapper).toBeDefined();
    });

    it('should start closed by default when toggleable', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
      });

      expect(section.isOpenState()).toBe(false);
    });

    it('should start open when startOpen is true', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
        startOpen: true,
      });

      expect(section.isOpenState()).toBe(true);
    });

    it('should toggle content visibility when toggle button is clicked', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
        startOpen: false,
      });

      const element = section.getEl();
      const toggleButton = element.querySelector('[class*="toggle-button"]') as HTMLElement;

      expect(section.isOpenState()).toBe(false);

      // Click to open
      toggleButton.click();
      expect(section.isOpenState()).toBe(true);

      // Click to close
      toggleButton.click();
      expect(section.isOpenState()).toBe(false);
    });
  });

  describe('Toggle Label', () => {
    it('should render toggle label when provided', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
        toggleLabel: 'Enable Feature',
      });

      const element = section.getEl();
      const toggleLabel = element.querySelector('[class*="__toggleLabel"]');
      expect(toggleLabel).toBeDefined();
      expect(toggleLabel?.textContent).toContain('Enable Feature');
    });

    it('should render toggle label with HTML content', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
        toggleLabel: '<span class="toggle-text">Toggle Text</span>',
      });

      const element = section.getEl();
      const span = element.querySelector('.toggle-text');
      expect(span).toBeDefined();
      expect(span?.textContent).toBe('Toggle Text');
    });

    it('should create toggle label wrapper when toggle label is provided', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
        toggleLabel: 'Enable',
      });

      const element = section.getEl();
      const toggleLabelWrapper = element.querySelector('[class*="__toggleLabelWrapper"]');
      expect(toggleLabelWrapper).toBeDefined();
    });

    it('should apply extended classes to toggle label', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
        toggleLabel: 'Enable',
        toggleLabelExtendedClasses: 'custom-toggle-label',
      });

      const element = section.getEl();
      const toggleLabelWrapper = element.querySelector('[class*="__toggleLabelWrapper"]');
      const toggleLabel = toggleLabelWrapper?.querySelector('.eb-label');
      expect(toggleLabel?.classList.contains('custom-toggle-label')).toBe(true);
    });

    it('should not create toggle label wrapper when toggle label is not provided', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
      });

      const element = section.getEl();
      const toggleLabelWrapper = element.querySelector('[class*="__toggleLabelWrapper"]');
      expect(toggleLabelWrapper).toBeNull();
    });
  });

  describe('Description Tooltip', () => {
    it('should create tooltip when description is provided', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        description: 'This is a helpful description',
      });

      const element = section.getEl();
      const label = element.querySelector('label');
      const tooltip = label?.querySelector('[class*="tooltip"]');
      expect(tooltip).toBeDefined();
    });

    it('should not create tooltip when description is not provided', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
      });

      const element = section.getEl();
      const label = element.querySelector('label');
      const tooltip = label?.querySelector('[class*="tooltip"]');
      expect(tooltip).toBeNull();
    });
  });

  describe('Open and Close Methods', () => {
    beforeEach(() => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
        startOpen: false,
      });
    });

    it('should open the section when open() is called', () => {
      section.open();
      expect(section.isOpenState()).toBe(true);
      expect(section.getEl().classList.toString()).toMatch(/--open/);
    });

    it('should close the section when close() is called', () => {
      section.open();
      expect(section.isOpenState()).toBe(true);

      section.close();
      expect(section.isOpenState()).toBe(false);
      expect(section.getEl().classList.toString()).not.toMatch(/--open/);
    });

    it('should add open modifier class when opened', () => {
      section.open();
      expect(section.getEl().className).toMatch(/--open/);
    });

    it('should remove open modifier class when closed', () => {
      section.open();
      section.close();
      expect(section.getEl().className).not.toMatch(/--open/);
    });
  });

  describe('toggleOnShowsContent Option', () => {
    it('should show content when toggle is ON and toggleOnShowsContent is true', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
        toggleOnShowsContent: true,
        startOpen: true, // Toggle starts ON
      });

      expect(section.isOpenState()).toBe(true);
    });

    it('should hide content when toggle is OFF and toggleOnShowsContent is true', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
        toggleOnShowsContent: true,
        startOpen: false, // Toggle starts OFF
      });

      expect(section.isOpenState()).toBe(false);
    });

    it('should hide content when toggle is ON and toggleOnShowsContent is false', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
        toggleOnShowsContent: false,
        startOpen: true, // Toggle starts ON, but should hide content
      });

      expect(section.isOpenState()).toBe(false);
    });

    it('should show content when toggle is OFF and toggleOnShowsContent is false', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
        toggleOnShowsContent: false,
        startOpen: false, // Toggle starts OFF, but should show content
      });

      expect(section.isOpenState()).toBe(true);
    });
  });

  describe('Event System', () => {
    it('should emit "open" event when section opens', () => {
      const onOpen = vi.fn();
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
        startOpen: false,
      });

      section.on('open', onOpen);
      section.open();

      expect(onOpen).toHaveBeenCalledTimes(1);
      expect(onOpen).toHaveBeenCalledWith(section);
    });

    it('should emit "close" event when section closes', () => {
      const onClose = vi.fn();
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
        startOpen: true,
      });

      section.on('close', onClose);
      section.close();

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledWith(section);
    });

    it('should emit "toggle" event when toggle button is clicked', () => {
      const onToggle = vi.fn();
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
        startOpen: false,
      });

      section.on('toggle', onToggle);

      const element = section.getEl();
      const toggleButton = element.querySelector('[class*="toggle-button"]') as HTMLElement;
      toggleButton.click();

      expect(onToggle).toHaveBeenCalledTimes(1);
      expect(onToggle).toHaveBeenCalledWith(true, section);
    });

    it('should call onToggle callback from options', () => {
      const onToggle = vi.fn();
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
        onToggle,
      });

      const element = section.getEl();
      const toggleButton = element.querySelector('[class*="toggle-button"]') as HTMLElement;
      toggleButton.click();

      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('should call onOpen callback from options', () => {
      const onOpen = vi.fn();
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
        startOpen: false,
        onOpen,
      });

      section.open();

      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it('should call onClose callback from options', () => {
      const onClose = vi.fn();
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
        startOpen: true,
        onClose,
      });

      section.close();

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should support multiple event listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
      });

      section.on('open', listener1);
      section.on('open', listener2);

      section.open();

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it('should remove event listener with off()', () => {
      const listener = vi.fn();

      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
      });

      section.on('open', listener);
      section.off('open', listener);

      section.open();

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('Public API', () => {
    beforeEach(() => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
      });
    });

    it('should return element with getEl()', () => {
      const element = section.getEl();
      expect(element).toBeInstanceOf(HTMLElement);
    });

    it('should return correct open state with isOpenState()', () => {
      expect(section.isOpenState()).toBe(false);
      section.open();
      expect(section.isOpenState()).toBe(true);
      section.close();
      expect(section.isOpenState()).toBe(false);
    });
  });

  describe('Destroy', () => {
    it('should remove element from DOM when destroyed', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
      });

      const element = section.getEl();
      document.body.appendChild(element);
      expect(document.body.contains(element)).toBe(true);

      section.destroy();
      expect(document.body.contains(element)).toBe(false);
    });

    it('should clean up toggle button when destroyed', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
      });

      const element = section.getEl();
      document.body.appendChild(element);

      section.destroy();
      expect(document.body.contains(element)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty label', () => {
      section = new ToggleableSection({
        label: '',
        content: 'Content',
      });

      const element = section.getEl();
      const label = element.querySelector('label');
      expect(label).toBeDefined();
    });

    it('should handle empty content', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: '',
      });

      const element = section.getEl();
      const content = element.querySelector('[class*="__content"]');
      expect(content).toBeDefined();
    });

    it('should handle special characters in label', () => {
      section = new ToggleableSection({
        label: 'Test <>&"\'',
        content: 'Content',
      });

      const element = section.getEl();
      const label = element.querySelector('label');
      expect(label?.innerHTML).toContain('Test &lt;&gt;&amp;"\'');
    });

    it('should handle long content', () => {
      const longContent = 'A'.repeat(10000);
      section = new ToggleableSection({
        label: 'Label',
        content: longContent,
      });

      const element = section.getEl();
      const content = element.querySelector('[class*="__content"]');
      expect(content?.textContent).toBe(longContent);
    });

    it('should handle array of HTMLElements as content', () => {
      const div1 = document.createElement('div');
      div1.textContent = 'First';
      const div2 = document.createElement('div');
      div2.textContent = 'Second';

      section = new ToggleableSection({
        label: 'Label',
        content: [div1, div2],
      });

      const element = section.getEl();
      const content = element.querySelector('[class*="__content"]');
      expect(content?.children.length).toBe(2);
      expect(content?.children[0].textContent).toBe('First');
      expect(content?.children[1].textContent).toBe('Second');
    });

    it('should handle rapid toggle clicks', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        toggleableContent: true,
      });

      const element = section.getEl();
      const toggleButton = element.querySelector('[class*="toggle-button"]') as HTMLElement;

      for (let i = 0; i < 10; i++) {
        toggleButton.click();
      }

      // Should end up in closed state (even number of clicks)
      expect(section.isOpenState()).toBe(false);
    });

    it('should handle custom type with special characters', () => {
      section = new ToggleableSection({
        label: 'Label',
        content: 'Content',
        type: 'custom-type-123',
      });

      const element = section.getEl();
      expect(element.className).toMatch(/toggleableSection--custom-type-123/);
    });
  });
});
