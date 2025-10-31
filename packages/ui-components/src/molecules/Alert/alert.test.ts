import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Alert } from './Alert';
import type { AlertType } from './alert.types';

describe('Alert', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Component initialization and rendering', () => {
    it('should create an alert with default options', () => {
      const alert = new Alert();
      const element = alert.getEl();

      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.getAttribute('role')).toBe('alert');
      expect(element.getAttribute('data-testid')).toBe('alert');
    });

    it('should create an alert with custom type', () => {
      const types: AlertType[] = ['info', 'success', 'warning', 'error'];

      types.forEach((type) => {
        const alert = new Alert({ type });
        const element = alert.getEl();

        expect(alert.type).toBe(type);
        expect(element.className).toContain(`alert--${type}`);
      });
    });

    it('should create an alert with title', () => {
      const alert = new Alert({ title: 'Test Title' });
      const element = alert.getEl();
      const titleEl = element.querySelector('[data-testid="alert-title"]');

      expect(titleEl).toBeTruthy();
      expect(titleEl?.textContent).toBe('Test Title');
    });

    it('should create an alert with description', () => {
      const alert = new Alert({ description: 'Test Description' });
      const element = alert.getEl();
      const descriptionEl = element.querySelector('[data-testid="alert-description"]');

      expect(descriptionEl).toBeTruthy();
      expect(descriptionEl?.textContent).toBe('Test Description');
    });

    it('should create an alert with icon', () => {
      const icon = document.createElement('i');
      icon.className = 'ri-info-line';

      const alert = new Alert({ icon });
      const element = alert.getEl();
      const iconEl = element.querySelector('[data-testid="alert-icon"]');

      expect(iconEl).toBeTruthy();
      expect(iconEl?.querySelector('i')?.classList.contains('ri-info-line')).toBe(true);
    });

    it('should create an alert with all content', () => {
      const icon = document.createElement('i');
      const alert = new Alert({
        type: 'success',
        title: 'Success!',
        description: 'Operation completed successfully.',
        icon,
      });

      const element = alert.getEl();

      expect(element.querySelector('[data-testid="alert-icon"]')).toBeTruthy();
      expect(element.querySelector('[data-testid="alert-title"]')).toBeTruthy();
      expect(element.querySelector('[data-testid="alert-description"]')).toBeTruthy();
    });

    it('should have correct structure with left and right sections', () => {
      const icon = document.createElement('i');
      const alert = new Alert({
        title: 'Title',
        description: 'Description',
        icon,
      });

      const element = alert.getEl();
      const leftSection = element.querySelector('[data-testid="alert-left"]');
      const rightSection = element.querySelector('[data-testid="alert-right"]');

      expect(leftSection).toBeTruthy();
      expect(rightSection).toBeTruthy();
    });
  });

  describe('Show and hide functionality', () => {
    it('should be hidden by default', () => {
      const alert = new Alert({ title: 'Test' });
      const element = alert.getEl();

      expect(alert.isHidden).toBe(true);
      expect(element.className).toContain('alert--hidden');
    });

    it('should be visible when isHidden is false', () => {
      const alert = new Alert({ title: 'Test', isHidden: false });
      const element = alert.getEl();

      expect(alert.isHidden).toBe(false);
      expect(element.className).not.toContain('alert--hidden');
    });

    it('should show the alert when show() is called', () => {
      const alert = new Alert({ title: 'Test' });
      const element = alert.getEl();

      expect(element.className).toContain('alert--hidden');

      alert.show();

      expect(alert.isHidden).toBe(false);
      expect(element.className).not.toContain('alert--hidden');
    });

    it('should hide the alert when hide() is called', () => {
      const alert = new Alert({ title: 'Test', isHidden: false });
      const element = alert.getEl();

      expect(element.className).not.toContain('alert--hidden');

      alert.hide();

      expect(alert.isHidden).toBe(true);
      expect(element.className).toContain('alert--hidden');
    });

    it('should toggle visibility correctly', () => {
      const alert = new Alert({ title: 'Test' });
      const element = alert.getEl();

      // Initially hidden
      expect(alert.isHidden).toBe(true);

      // Show
      alert.show();
      expect(alert.isHidden).toBe(false);
      expect(element.className).not.toContain('alert--hidden');

      // Hide
      alert.hide();
      expect(alert.isHidden).toBe(true);
      expect(element.className).toContain('alert--hidden');

      // Show again
      alert.show();
      expect(alert.isHidden).toBe(false);
    });
  });

  describe('Content updates', () => {
    describe('setTitle', () => {
      it('should update title with string', () => {
        const alert = new Alert({ title: 'Original Title' });
        const element = alert.getEl();
        const titleEl = element.querySelector('[data-testid="alert-title"]');

        alert.setTitle('Updated Title');

        expect(alert.title).toBe('Updated Title');
        expect(titleEl?.textContent).toBe('Updated Title');
      });

      it('should update title with HTMLElement', () => {
        const alert = new Alert({ title: 'Original Title' });
        const element = alert.getEl();
        const titleEl = element.querySelector('[data-testid="alert-title"]');

        const newTitle = document.createElement('strong');
        newTitle.textContent = 'Bold Title';

        alert.setTitle(newTitle);

        expect(alert.title).toBe(newTitle);
        expect(titleEl?.querySelector('strong')).toBeTruthy();
        expect(titleEl?.textContent).toBe('Bold Title');
      });

      it('should create title element if it does not exist', () => {
        const alert = new Alert();
        const element = alert.getEl();

        expect(element.querySelector('[data-testid="alert-title"]')).toBe(null);

        alert.setTitle('New Title');

        const titleEl = element.querySelector('[data-testid="alert-title"]');
        expect(titleEl).toBeTruthy();
        expect(titleEl?.textContent).toBe('New Title');
      });
    });

    describe('setDescription', () => {
      it('should update description with string', () => {
        const alert = new Alert({ description: 'Original Description' });
        const element = alert.getEl();
        const descriptionEl = element.querySelector('[data-testid="alert-description"]');

        alert.setDescription('Updated Description');

        expect(alert.description).toBe('Updated Description');
        expect(descriptionEl?.textContent).toBe('Updated Description');
      });

      it('should update description with HTMLElement', () => {
        const alert = new Alert({ description: 'Original Description' });
        const element = alert.getEl();
        const descriptionEl = element.querySelector('[data-testid="alert-description"]');

        const newDescription = document.createElement('em');
        newDescription.textContent = 'Italic Description';

        alert.setDescription(newDescription);

        expect(alert.description).toBe(newDescription);
        expect(descriptionEl?.querySelector('em')).toBeTruthy();
        expect(descriptionEl?.textContent).toBe('Italic Description');
      });

      it('should create description element if it does not exist', () => {
        const alert = new Alert();
        const element = alert.getEl();

        expect(element.querySelector('[data-testid="alert-description"]')).toBe(null);

        alert.setDescription('New Description');

        const descriptionEl = element.querySelector('[data-testid="alert-description"]');
        expect(descriptionEl).toBeTruthy();
        expect(descriptionEl?.textContent).toBe('New Description');
      });
    });

    describe('setIcon', () => {
      it('should update icon with new HTMLElement', () => {
        const originalIcon = document.createElement('i');
        originalIcon.className = 'ri-info-line';

        const alert = new Alert({ icon: originalIcon });
        const element = alert.getEl();
        const iconEl = element.querySelector('[data-testid="alert-icon"]');

        const newIcon = document.createElement('i');
        newIcon.className = 'ri-check-line';

        alert.setIcon(newIcon);

        expect(alert.icon).toBe(newIcon);
        expect(iconEl?.querySelector('.ri-check-line')).toBeTruthy();
        expect(iconEl?.querySelector('.ri-info-line')).toBe(null);
      });

      it('should create icon element if it does not exist', () => {
        const alert = new Alert();
        const element = alert.getEl();

        expect(element.querySelector('[data-testid="alert-icon"]')).toBe(null);

        const newIcon = document.createElement('i');
        newIcon.className = 'ri-star-line';

        alert.setIcon(newIcon);

        const iconEl = element.querySelector('[data-testid="alert-icon"]');
        expect(iconEl).toBeTruthy();
        expect(iconEl?.querySelector('.ri-star-line')).toBeTruthy();
      });

      it('should replace icon content when updating', () => {
        const icon1 = document.createElement('i');
        icon1.className = 'icon-1';

        const alert = new Alert({ icon: icon1 });
        const element = alert.getEl();
        const iconEl = element.querySelector('[data-testid="alert-icon"]');

        const icon2 = document.createElement('span');
        icon2.textContent = 'Icon 2';

        alert.setIcon(icon2);

        expect(iconEl?.querySelector('.icon-1')).toBe(null);
        expect(iconEl?.querySelector('span')).toBeTruthy();
        expect(iconEl?.textContent).toBe('Icon 2');
      });
    });
  });

  describe('Alert types', () => {
    it('should apply correct class for info type', () => {
      const alert = new Alert({ type: 'info', title: 'Info' });
      const element = alert.getEl();

      expect(element.className).toContain('alert--info');
    });

    it('should apply correct class for success type', () => {
      const alert = new Alert({ type: 'success', title: 'Success' });
      const element = alert.getEl();

      expect(element.className).toContain('alert--success');
    });

    it('should apply correct class for warning type', () => {
      const alert = new Alert({ type: 'warning', title: 'Warning' });
      const element = alert.getEl();

      expect(element.className).toContain('alert--warning');
    });

    it('should apply correct class for error type', () => {
      const alert = new Alert({ type: 'error', title: 'Error' });
      const element = alert.getEl();

      expect(element.className).toContain('alert--error');
    });
  });

  describe('Public API', () => {
    it('should return the alert element via getEl()', () => {
      const alert = new Alert({ title: 'Test' });
      const element = alert.getEl();

      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.getAttribute('data-testid')).toBe('alert');
    });

    it('should expose public properties', () => {
      const icon = document.createElement('i');
      const alert = new Alert({
        type: 'success',
        title: 'Title',
        description: 'Description',
        icon,
        isHidden: false,
      });

      expect(alert.type).toBe('success');
      expect(alert.title).toBe('Title');
      expect(alert.description).toBe('Description');
      expect(alert.icon).toBe(icon);
      expect(alert.isHidden).toBe(false);
    });

    it('should update public properties when setters are called', () => {
      const alert = new Alert();

      const newIcon = document.createElement('i');
      alert.setIcon(newIcon);
      expect(alert.icon).toBe(newIcon);

      alert.setTitle('New Title');
      expect(alert.title).toBe('New Title');

      alert.setDescription('New Description');
      expect(alert.description).toBe('New Description');

      alert.show();
      expect(alert.isHidden).toBe(false);

      alert.hide();
      expect(alert.isHidden).toBe(true);
    });
  });

  describe('Destroy and cleanup', () => {
    it('should remove the alert from the DOM when destroy() is called', () => {
      const alert = new Alert({ title: 'Test' });
      const element = alert.getEl();

      container.appendChild(element);
      expect(container.contains(element)).toBe(true);

      alert.destroy();

      expect(container.contains(element)).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty title and description', () => {
      const alert = new Alert({ title: '', description: '' });
      const element = alert.getEl();

      expect(element.querySelector('[data-testid="alert-title"]')).toBe(null);
      expect(element.querySelector('[data-testid="alert-description"]')).toBe(null);
    });

    it('should handle alert without any content', () => {
      const alert = new Alert();
      const element = alert.getEl();

      expect(element).toBeTruthy();
      expect(element.querySelector('[data-testid="alert-icon"]')).toBe(null);
      expect(element.querySelector('[data-testid="alert-title"]')).toBe(null);
      expect(element.querySelector('[data-testid="alert-description"]')).toBe(null);
    });

    it('should handle very long title text', () => {
      const longTitle = 'A'.repeat(500);
      const alert = new Alert({ title: longTitle });
      const element = alert.getEl();
      const titleEl = element.querySelector('[data-testid="alert-title"]');

      expect(titleEl?.textContent).toBe(longTitle);
    });

    it('should handle very long description text', () => {
      const longDescription = 'B'.repeat(1000);
      const alert = new Alert({ description: longDescription });
      const element = alert.getEl();
      const descriptionEl = element.querySelector('[data-testid="alert-description"]');

      expect(descriptionEl?.textContent).toBe(longDescription);
    });

    it('should handle special characters in title', () => {
      const specialTitle = '<script>alert("xss")</script>';
      const alert = new Alert({ title: specialTitle });
      const element = alert.getEl();
      const titleEl = element.querySelector('[data-testid="alert-title"]');

      // textContent should escape HTML
      expect(titleEl?.textContent).toBe(specialTitle);
      expect(titleEl?.querySelector('script')).toBe(null);
    });

    it('should handle special characters in description', () => {
      const specialDescription = '<img src="x" onerror="alert(1)">';
      const alert = new Alert({ description: specialDescription });
      const element = alert.getEl();
      const descriptionEl = element.querySelector('[data-testid="alert-description"]');

      // textContent should escape HTML
      expect(descriptionEl?.textContent).toBe(specialDescription);
      expect(descriptionEl?.querySelector('img')).toBe(null);
    });

    it('should handle rapid show/hide calls', () => {
      const alert = new Alert({ title: 'Test' });
      const element = alert.getEl();

      for (let i = 0; i < 100; i++) {
        if (i % 2 === 0) {
          alert.show();
          expect(alert.isHidden).toBe(false);
        } else {
          alert.hide();
          expect(alert.isHidden).toBe(true);
        }
      }

      // Final state should be hidden (99th iteration was hide)
      expect(alert.isHidden).toBe(true);
      expect(element.className).toContain('alert--hidden');
    });

    it('should handle updating content multiple times', () => {
      const alert = new Alert({ title: 'Original' });
      const element = alert.getEl();
      const titleEl = element.querySelector('[data-testid="alert-title"]');

      alert.setTitle('Update 1');
      expect(titleEl?.textContent).toBe('Update 1');

      alert.setTitle('Update 2');
      expect(titleEl?.textContent).toBe('Update 2');

      alert.setTitle('Update 3');
      expect(titleEl?.textContent).toBe('Update 3');
    });

    it('should maintain correct order when adding title after description', () => {
      const alert = new Alert({ description: 'Description' });
      const element = alert.getEl();

      alert.setTitle('Title');

      const rightSection = element.querySelector('[data-testid="alert-right"]');
      const children = Array.from(rightSection?.children || []);

      const titleIndex = children.findIndex((el) =>
        el.getAttribute('data-testid') === 'alert-title'
      );
      const descriptionIndex = children.findIndex((el) =>
        el.getAttribute('data-testid') === 'alert-description'
      );

      expect(titleIndex).toBeLessThan(descriptionIndex);
    });
  });

  describe('Accessibility', () => {
    it('should have role="alert" attribute', () => {
      const alert = new Alert({ title: 'Test' });
      const element = alert.getEl();

      expect(element.getAttribute('role')).toBe('alert');
    });

    it('should be accessible when shown', () => {
      const alert = new Alert({ title: 'Important message', isHidden: false });
      const element = alert.getEl();

      expect(element.getAttribute('role')).toBe('alert');
      expect(element.className).not.toContain('alert--hidden');
    });
  });
});
