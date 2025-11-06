/**
 * Button component tests
 *
 * Tests for SolidJS Button component to ensure it's testable by AI agents
 * Focus on test attributes and behavior, not CSS class names
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../../test-utils';
import { Button } from './Button';

describe('Button', () => {
  describe('rendering', () => {
    it('should render with default props', () => {
      render(() => <Button>Click me</Button>);

      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
      expect(button).not.toBeDisabled();
    });

    it('should render with all variants', () => {
      const { unmount } = render(() => <Button variant="primary">Primary</Button>);
      let button = screen.getByRole('button', { name: /primary/i });
      expect(button).toBeInTheDocument();
      unmount();

      render(() => <Button variant="secondary">Secondary</Button>);
      button = screen.getByRole('button', { name: /secondary/i });
      expect(button).toBeInTheDocument();
      unmount();

      render(() => <Button variant="ghost">Ghost</Button>);
      button = screen.getByRole('button', { name: /ghost/i });
      expect(button).toBeInTheDocument();
    });

    it('should render with different sizes', () => {
      const { unmount } = render(() => <Button size="small">Small</Button>);
      let button = screen.getByRole('button', { name: /small/i });
      expect(button).toBeInTheDocument();
      unmount();

      render(() => <Button size="medium">Medium</Button>);
      button = screen.getByRole('button', { name: /medium/i });
      expect(button).toBeInTheDocument();
      unmount();

      render(() => <Button size="large">Large</Button>);
      button = screen.getByRole('button', { name: /large/i });
      expect(button).toBeInTheDocument();
    });

    it('should render as full width', () => {
      render(() => <Button fullWidth>Full Width</Button>);

      const button = screen.getByRole('button', { name: /full width/i });
      expect(button).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(() => <Button className="custom-class">Custom</Button>);

      const button = screen.getByRole('button', { name: /custom/i });
      expect(button.className).toContain('custom-class');
    });

    it('should render with icon on left', () => {
      render(() => <Button icon="star">Star</Button>);

      const button = screen.getByRole('button', { name: /star/i });
      const icon = button.querySelector('i.ri-star');
      expect(icon).toBeInTheDocument();
    });

    it('should render with icon on right', () => {
      render(() => <Button icon="arrow-right" iconPosition="right">Next</Button>);

      const button = screen.getByRole('button', { name: /next/i });
      const icon = button.querySelector('i.ri-arrow-right');
      expect(icon).toBeInTheDocument();
    });

    it('should render as submit type', () => {
      render(() => <Button type="submit">Submit</Button>);

      const button = screen.getByRole('button', { name: /submit/i });
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should render as reset type', () => {
      render(() => <Button type="reset">Reset</Button>);

      const button = screen.getByRole('button', { name: /reset/i });
      expect(button).toHaveAttribute('type', 'reset');
    });
  });

  describe('disabled state', () => {
    it('should render as disabled', () => {
      render(() => <Button disabled>Disabled</Button>);

      const button = screen.getByRole('button', { name: /disabled/i });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('event handlers', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn();
      render(() => <Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button', { name: /click me/i });
      button.click();

      await waitFor(() => {
        expect(handleClick).toHaveBeenCalledTimes(1);
      });
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      render(() => <Button onClick={handleClick} disabled>Click me</Button>);

      const button = screen.getByRole('button', { name: /click me/i });
      button.click();

      // Wait a bit to ensure it doesn't fire
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should call onFocus when focused', async () => {
      const handleFocus = vi.fn();
      render(() => <Button onFocus={handleFocus}>Focus me</Button>);

      const button = screen.getByRole('button', { name: /focus me/i });
      button.focus();

      await waitFor(() => {
        expect(handleFocus).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onBlur when blurred', async () => {
      const handleBlur = vi.fn();
      render(() => <Button onBlur={handleBlur}>Blur me</Button>);

      const button = screen.getByRole('button', { name: /blur me/i });
      button.focus();
      button.blur();

      await waitFor(() => {
        expect(handleBlur).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('accessibility', () => {
    it('should have correct ARIA attributes when disabled', () => {
      render(() => <Button disabled>Disabled</Button>);

      const button = screen.getByRole('button', { name: /disabled/i });
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have aria-hidden on icons', () => {
      render(() => <Button icon="star">Star</Button>);

      const icon = document.querySelector('i.ri-star');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should be keyboard accessible', () => {
      render(() => <Button>Accessible</Button>);

      const button = screen.getByRole('button', { name: /accessible/i });
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('test attributes', () => {
    it('should render with testId attribute', () => {
      render(() => <Button testId="test-button">Test</Button>);

      const button = document.querySelector('[data-testid="test-button"]');
      expect(button).toBeInTheDocument();
      expect(button?.textContent).toContain('Test');
    });

    it('should render with action attribute', () => {
      render(() => <Button action="save-template">Save</Button>);

      const button = document.querySelector('[data-action="save-template"]');
      expect(button).toBeInTheDocument();
      expect(button?.textContent).toContain('Save');
    });

    it('should render with both testId and action attributes', () => {
      render(() => (
        <Button testId="save-btn" action="save-template">
          Save
        </Button>
      ));

      const byTestId = document.querySelector('[data-testid="save-btn"]');
      const byAction = document.querySelector('[data-action="save-template"]');

      expect(byTestId).toBeInTheDocument();
      expect(byAction).toBeInTheDocument();
      expect(byTestId).toBe(byAction);
    });
  });

  describe('AI testing compatibility', () => {
    it('should be identifiable via test attributes for AI agents', () => {
      render(() => (
        <Button testId="ai-test-button" action="perform-action" variant="primary">
          AI Test Button
        </Button>
      ));

      // AI can find by testId
      const byTestId = document.querySelector('[data-testid="ai-test-button"]');
      expect(byTestId).toBeInTheDocument();

      // AI can find by action
      const byAction = document.querySelector('[data-action="perform-action"]');
      expect(byAction).toBeInTheDocument();

      // Both should be the same element
      expect(byTestId).toBe(byAction);

      // AI can verify content
      expect(byTestId?.textContent).toContain('AI Test Button');
    });

    it('should provide clear state for AI agents to verify', () => {
      const { unmount } = render(() => <Button disabled>Disabled</Button>);

      let button = screen.getByRole('button', { name: /disabled/i });
      expect(button.disabled).toBe(true);
      expect(button).toHaveAttribute('aria-disabled', 'true');
      unmount();

      render(() => <Button>Enabled</Button>);
      button = screen.getByRole('button', { name: /enabled/i });
      expect(button.disabled).toBe(false);
      expect(button).not.toHaveAttribute('aria-disabled');
    });
  });

  describe('complex scenarios', () => {
    it('should handle all props together', () => {
      const handleClick = vi.fn();

      render(() => (
        <Button
          variant="primary"
          size="large"
          icon="save"
          iconPosition="left"
          fullWidth
          type="submit"
          testId="complex-button"
          action="save-all"
          onClick={handleClick}
          className="extra-class"
        >
          Save All
        </Button>
      ));

      const button = document.querySelector('[data-testid="complex-button"]');

      // Verify all props are applied
      expect(button).toBeInTheDocument();
      expect(button?.textContent).toContain('Save All');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('data-testid', 'complex-button');
      expect(button).toHaveAttribute('data-action', 'save-all');
      expect(button?.className).toContain('extra-class');

      const icon = button?.querySelector('i.ri-save');
      expect(icon).toBeInTheDocument();

      (button as HTMLElement).click();
      expect(handleClick).toHaveBeenCalled();
    });
  });
});
