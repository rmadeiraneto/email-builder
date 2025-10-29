/**
 * Button component tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Button } from './Button';
import type { ButtonProps } from './button.types';

describe('Button', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('rendering', () => {
    it('should render with default props', () => {
      const button = new Button({ children: 'Click me' });
      const element = button.render();

      expect(element).toBeInstanceOf(HTMLButtonElement);
      expect(element.textContent).toContain('Click me');
      expect(element.type).toBe('button');
      expect(element.disabled).toBe(false);
    });

    it('should render with primary variant', () => {
      const button = new Button({
        variant: 'primary',
        children: 'Click me',
      });
      const element = button.render();

      expect(element.className).toContain('button--primary');
    });

    it('should render with secondary variant', () => {
      const button = new Button({
        variant: 'secondary',
        children: 'Click me',
      });
      const element = button.render();

      expect(element.className).toContain('button--secondary');
    });

    it('should render with ghost variant', () => {
      const button = new Button({
        variant: 'ghost',
        children: 'Click me',
      });
      const element = button.render();

      expect(element.className).toContain('button--ghost');
    });

    it('should render with different sizes', () => {
      const small = new Button({ size: 'small', children: 'Small' });
      const medium = new Button({ size: 'medium', children: 'Medium' });
      const large = new Button({ size: 'large', children: 'Large' });

      expect(small.render().className).toContain('button--small');
      expect(medium.render().className).toContain('button--medium');
      expect(large.render().className).toContain('button--large');
    });

    it('should render as full width', () => {
      const button = new Button({
        fullWidth: true,
        children: 'Full width',
      });
      const element = button.render();

      expect(element.className).toContain('button--full-width');
    });

    it('should render with custom class name', () => {
      const button = new Button({
        className: 'custom-class',
        children: 'Custom',
      });
      const element = button.render();

      expect(element.className).toContain('custom-class');
    });

    it('should render with icon on left', () => {
      const button = new Button({
        icon: 'star',
        iconPosition: 'left',
        children: 'Star',
      });
      container.appendChild(button.render());

      const icon = container.querySelector('i');
      expect(icon).toBeTruthy();
      expect(icon?.className).toContain('ri-star');
    });

    it('should render with icon on right', () => {
      const button = new Button({
        icon: 'arrow-right',
        iconPosition: 'right',
        children: 'Next',
      });
      container.appendChild(button.render());

      const icon = container.querySelector('i');
      expect(icon).toBeTruthy();
      expect(icon?.className).toContain('ri-arrow-right');
      expect(icon?.className).toContain('button__icon--right');
    });
  });

  describe('disabled state', () => {
    it('should render as disabled', () => {
      const button = new Button({
        disabled: true,
        children: 'Disabled',
      });
      const element = button.render();

      expect(element.disabled).toBe(true);
      expect(element.getAttribute('aria-disabled')).toBe('true');
      expect(element.className).toContain('button--disabled');
    });

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn();
      const button = new Button({
        disabled: true,
        onClick: handleClick,
        children: 'Click me',
      });
      const element = button.render();

      // Disabled buttons don't trigger click in modern browsers
      element.click();
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('interactions', () => {
    it('should call onClick handler when clicked', () => {
      const handleClick = vi.fn();
      const button = new Button({
        onClick: handleClick,
        children: 'Click me',
      });
      const element = button.render();

      element.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onFocus handler when focused', () => {
      const handleFocus = vi.fn();
      const button = new Button({
        onFocus: handleFocus,
        children: 'Focus me',
      });
      const element = button.render();
      container.appendChild(element);

      element.focus();
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur handler when blurred', () => {
      const handleBlur = vi.fn();
      const button = new Button({
        onBlur: handleBlur,
        children: 'Blur me',
      });
      const element = button.render();
      container.appendChild(element);

      element.focus();
      element.blur();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('update method', () => {
    it('should update button text', () => {
      const button = new Button({ children: 'Initial' });
      const element = button.render();

      expect(element.textContent).toContain('Initial');

      button.update({ children: 'Updated' });
      expect(element.textContent).toContain('Updated');
    });

    it('should update button variant', () => {
      const button = new Button({
        variant: 'primary',
        children: 'Button',
      });
      const element = button.render();

      expect(element.className).toContain('button--primary');

      button.update({ variant: 'secondary' });
      expect(element.className).toContain('button--secondary');
      expect(element.className).not.toContain('button--primary');
    });

    it('should update disabled state', () => {
      const button = new Button({ children: 'Button' });
      const element = button.render();

      expect(element.disabled).toBe(false);

      button.update({ disabled: true });
      expect(element.disabled).toBe(true);
      expect(element.getAttribute('aria-disabled')).toBe('true');
    });

    it('should update icon', () => {
      const button = new Button({
        icon: 'star',
        children: 'Button',
      });
      container.appendChild(button.render());

      let icon = container.querySelector('i');
      expect(icon?.className).toContain('ri-star');

      button.update({ icon: 'heart' });
      icon = container.querySelector('i');
      expect(icon?.className).toContain('ri-heart');
    });
  });

  describe('public methods', () => {
    it('should get disabled state', () => {
      const button = new Button({
        disabled: true,
        children: 'Button',
      });

      expect(button.isDisabled()).toBe(true);
    });

    it('should set disabled state', () => {
      const button = new Button({ children: 'Button' });
      const element = button.render();

      expect(element.disabled).toBe(false);

      button.setDisabled(true);
      expect(element.disabled).toBe(true);
      expect(button.isDisabled()).toBe(true);
    });

    it('should programmatically click', () => {
      const handleClick = vi.fn();
      const button = new Button({
        onClick: handleClick,
        children: 'Button',
      });

      button.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should programmatically focus', () => {
      const button = new Button({ children: 'Button' });
      const element = button.render();
      container.appendChild(element);

      button.focus();
      expect(document.activeElement).toBe(element);
    });

    it('should destroy and clean up', () => {
      const handleClick = vi.fn();
      const button = new Button({
        onClick: handleClick,
        children: 'Button',
      });
      const element = button.render();
      container.appendChild(element);

      expect(container.contains(element)).toBe(true);

      button.destroy();
      expect(container.contains(element)).toBe(false);

      // Event listeners should be removed
      element.click();
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have correct button type', () => {
      const button = new Button({
        type: 'submit',
        children: 'Submit',
      });
      const element = button.render();

      expect(element.type).toBe('submit');
    });

    it('should have aria-disabled when disabled', () => {
      const button = new Button({
        disabled: true,
        children: 'Disabled',
      });
      const element = button.render();

      expect(element.getAttribute('aria-disabled')).toBe('true');
    });

    it('should hide icon from screen readers', () => {
      const button = new Button({
        icon: 'star',
        children: 'Favorite',
      });
      container.appendChild(button.render());

      const icon = container.querySelector('i');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
