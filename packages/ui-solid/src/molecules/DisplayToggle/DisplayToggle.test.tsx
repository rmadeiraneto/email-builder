/**
 * DisplayToggle component tests
 *
 * Tests for DisplayToggle component to ensure proper toggle state changes,
 * icon state rendering, and accessibility features.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../../test-utils';
import { DisplayToggle } from './DisplayToggle';

describe('DisplayToggle', () => {
  describe('rendering', () => {
    it('should render with default props', () => {
      const { container } = render(() => <DisplayToggle />);

      // Should render the toggle button
      const toggle = container.querySelector('[role="switch"]');
      expect(toggle).toBeInTheDocument();
    });

    it('should render with label', () => {
      const { container } = render(() => (
        <DisplayToggle label="Show Image" />
      ));

      const label = container.querySelector('label');
      expect(label).toBeInTheDocument();
      expect(label?.textContent).toBe('Show Image');
    });

    it('should render without label', () => {
      const { container } = render(() => <DisplayToggle />);

      const label = container.querySelector('label');
      expect(label).not.toBeInTheDocument();
    });

    it('should render with custom class', () => {
      const { container } = render(() => (
        <DisplayToggle class="custom-toggle" />
      ));

      const toggle = container.querySelector('.custom-toggle');
      expect(toggle).toBeInTheDocument();
    });

    it('should render visible by default', () => {
      const { container } = render(() => <DisplayToggle />);

      // Check for visible icon (eye-line)
      const icon = container.querySelector('i.ri-eye-line');
      expect(icon).toBeInTheDocument();
    });

    it('should render hidden when value is false', () => {
      const { container } = render(() => <DisplayToggle value={false} />);

      // Check for hidden icon (eye-off-line)
      const icon = container.querySelector('i.ri-eye-off-line');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('toggle state', () => {
    it('should toggle from visible to hidden', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <DisplayToggle value={true} onChange={handleChange} />
      ));

      const button = container.querySelector('[role="switch"]') as HTMLElement;
      expect(button).toBeInTheDocument();

      // Click to toggle
      button.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(false);
      });
    });

    it('should toggle from hidden to visible', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <DisplayToggle value={false} onChange={handleChange} />
      ));

      const button = container.querySelector('[role="switch"]') as HTMLElement;
      button.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(true);
      });
    });

    it('should call onChange with correct value', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <DisplayToggle value={true} onChange={handleChange} />
      ));

      const button = container.querySelector('[role="switch"]') as HTMLElement;
      button.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith(false);
      });
    });

    it('should handle multiple toggles', async () => {
      const handleChange = vi.fn();
      let currentValue = true;

      const { container, unmount } = render(() => (
        <DisplayToggle value={currentValue} onChange={handleChange} />
      ));

      const button = container.querySelector('[role="switch"]') as HTMLElement;

      // First toggle
      button.click();
      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(false);
      });

      unmount();

      // Re-render with new value
      currentValue = false;
      render(() => (
        <DisplayToggle value={currentValue} onChange={handleChange} />
      ));

      const button2 = document.querySelector('[role="switch"]') as HTMLElement;

      // Second toggle
      button2.click();
      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('icon rendering', () => {
    it('should show eye icon when visible', () => {
      const { container } = render(() => <DisplayToggle value={true} />);

      const eyeIcon = container.querySelector('i.ri-eye-line');
      const eyeOffIcon = container.querySelector('i.ri-eye-off-line');

      expect(eyeIcon).toBeInTheDocument();
      expect(eyeOffIcon).not.toBeInTheDocument();
    });

    it('should show eye-off icon when hidden', () => {
      const { container } = render(() => <DisplayToggle value={false} />);

      const eyeIcon = container.querySelector('i.ri-eye-line');
      const eyeOffIcon = container.querySelector('i.ri-eye-off-line');

      expect(eyeIcon).not.toBeInTheDocument();
      expect(eyeOffIcon).toBeInTheDocument();
    });

    it('should show icon by default', () => {
      const { container } = render(() => <DisplayToggle />);

      const icon = container.querySelector('i');
      expect(icon).toBeInTheDocument();
    });

    it('should hide icon when showIcon is false', () => {
      const { container } = render(() => <DisplayToggle showIcon={false} />);

      const icon = container.querySelector('i');
      expect(icon).not.toBeInTheDocument();
    });

    it('should show icon when showIcon is true', () => {
      const { container } = render(() => <DisplayToggle showIcon={true} />);

      const icon = container.querySelector('i');
      expect(icon).toBeInTheDocument();
    });

    it('should update icon when value changes', () => {
      let value = true;
      const { container, unmount } = render(() => <DisplayToggle value={value} />);

      let eyeIcon = container.querySelector('i.ri-eye-line');
      expect(eyeIcon).toBeInTheDocument();

      unmount();

      // Re-render with new value
      value = false;
      render(() => <DisplayToggle value={value} />);

      const eyeOffIcon = document.querySelector('i.ri-eye-off-line');
      expect(eyeOffIcon).toBeInTheDocument();
    });
  });

  describe('status text', () => {
    it('should show "Visible" status when value is true', () => {
      const { container } = render(() => <DisplayToggle value={true} />);

      const statusText = container.textContent;
      expect(statusText).toContain('Visible');
    });

    it('should show "Hidden" status when value is false', () => {
      const { container } = render(() => <DisplayToggle value={false} />);

      const statusText = container.textContent;
      expect(statusText).toContain('Hidden');
    });

    it('should update status text when value changes', () => {
      let value = true;
      const { container, unmount } = render(() => <DisplayToggle value={value} />);

      let statusText = container.textContent;
      expect(statusText).toContain('Visible');

      unmount();

      // Re-render with new value
      value = false;
      render(() => <DisplayToggle value={value} />);

      statusText = document.body.textContent;
      expect(statusText).toContain('Hidden');
    });
  });

  describe('disabled state', () => {
    it('should render as disabled', () => {
      const { container } = render(() => <DisplayToggle disabled />);

      const button = container.querySelector('[role="switch"]') as HTMLElement;
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should not call onChange when disabled', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <DisplayToggle disabled onChange={handleChange} />
      ));

      const button = container.querySelector('[role="switch"]') as HTMLElement;
      button.click();

      // Wait a bit to ensure it doesn't fire
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should be enabled by default', () => {
      const { container } = render(() => <DisplayToggle />);

      const button = container.querySelector('[role="switch"]') as HTMLElement;
      expect(button).toHaveAttribute('aria-disabled', 'false');
    });

    it('should allow toggling when not disabled', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <DisplayToggle value={true} onChange={handleChange} disabled={false} />
      ));

      const button = container.querySelector('[role="switch"]') as HTMLElement;
      expect(button).toHaveAttribute('aria-disabled', 'false');

      button.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('accessibility', () => {
    it('should have aria-label on toggle button', () => {
      const { container } = render(() => (
        <DisplayToggle label="Show Image" />
      ));

      const button = container.querySelector('[role="switch"]') as HTMLElement;
      expect(button).toHaveAttribute('aria-label', 'Toggle Show Image');
    });

    it('should have default aria-label when no label provided', () => {
      const { container } = render(() => <DisplayToggle />);

      const button = container.querySelector('[role="switch"]') as HTMLElement;
      expect(button).toHaveAttribute('aria-label', 'Toggle visibility');
    });

    it('should have title attribute on icon', () => {
      const { container } = render(() => <DisplayToggle value={true} />);

      const iconContainer = container.querySelector('[title]');
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveAttribute('title', 'Visible');
    });

    it('should update title attribute when state changes', () => {
      let value = true;
      const { container, unmount } = render(() => <DisplayToggle value={value} />);

      let iconContainer = container.querySelector('[title="Visible"]');
      expect(iconContainer).toBeInTheDocument();

      unmount();

      // Re-render with new value
      value = false;
      render(() => <DisplayToggle value={value} />);

      iconContainer = document.querySelector('[title="Hidden"]');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      const { container } = render(() => <DisplayToggle />);

      const button = container.querySelector('[role="switch"]') as HTMLElement;
      expect(button.tagName).toBe('DIV');
      expect(button).toHaveAttribute('role', 'switch');
    });
  });

  describe('label integration', () => {
    it('should associate label with toggle', () => {
      const { container } = render(() => (
        <DisplayToggle label="Display Header" />
      ));

      const label = container.querySelector('label');
      expect(label).toBeInTheDocument();
      expect(label?.textContent).toBe('Display Header');
    });

    it('should render label and controls together', () => {
      const { container } = render(() => (
        <DisplayToggle label="Show Footer" value={true} />
      ));

      const label = container.querySelector('label');
      const button = container.querySelector('[role="switch"]');

      expect(label).toBeInTheDocument();
      expect(button).toBeInTheDocument();
      expect(label?.textContent).toBe('Show Footer');
    });
  });

  describe('complex scenarios', () => {
    it('should handle all props together', async () => {
      const handleChange = vi.fn();

      const { container } = render(() => (
        <DisplayToggle
          label="Show Image"
          value={true}
          disabled={false}
          showIcon={true}
          class="custom-display-toggle"
          onChange={handleChange}
        />
      ));

      // Verify all props are applied
      const toggle = container.querySelector('.custom-display-toggle');
      expect(toggle).toBeInTheDocument();

      const label = container.querySelector('label');
      expect(label).toBeInTheDocument();
      expect(label?.textContent).toBe('Show Image');

      const icon = container.querySelector('i.ri-eye-line');
      expect(icon).toBeInTheDocument();

      const statusText = container.textContent;
      expect(statusText).toContain('Visible');

      const button = container.querySelector('[role="switch"]') as HTMLElement;
      expect(button).toHaveAttribute('aria-disabled', 'false');

      button.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(false);
      });
    });

    it('should work without onChange handler', () => {
      const { container } = render(() => (
        <DisplayToggle value={true} />
      ));

      const button = container.querySelector('[role="switch"]') as HTMLElement;
      expect(button).toBeInTheDocument();

      // Should not throw error when clicked without onChange
      expect(() => button.click()).not.toThrow();
    });

    it('should handle rapid toggles', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <DisplayToggle value={true} onChange={handleChange} />
      ));

      const button = container.querySelector('[role="switch"]') as HTMLElement;

      // Rapid clicks
      button.click();
      button.click();
      button.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });

      // Should handle all clicks
      expect(handleChange.mock.calls.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle undefined value', () => {
      const { container } = render(() => <DisplayToggle value={undefined} />);

      // Should default to true (visible)
      const icon = container.querySelector('i.ri-eye-line');
      expect(icon).toBeInTheDocument();
    });

    it('should handle null label', () => {
      const { container } = render(() => (
        <DisplayToggle label={undefined} />
      ));

      const label = container.querySelector('label');
      expect(label).not.toBeInTheDocument();
    });

    it('should handle empty string label', () => {
      const { container } = render(() => <DisplayToggle label="" />);

      // Should not render label if empty
      const label = container.querySelector('label');
      expect(label).not.toBeInTheDocument();
    });

    it('should handle long label text', () => {
      const longLabel = 'This is a very long label that contains many words and characters to test text wrapping behavior';
      const { container } = render(() => (
        <DisplayToggle label={longLabel} />
      ));

      const label = container.querySelector('label');
      expect(label).toBeInTheDocument();
      expect(label?.textContent).toBe(longLabel);
    });

    it('should handle special characters in label', () => {
      const specialLabel = 'Show <Image> & "Content"';
      const { container } = render(() => (
        <DisplayToggle label={specialLabel} />
      ));

      const label = container.querySelector('label');
      expect(label).toBeInTheDocument();
      expect(label?.textContent).toBe(specialLabel);
    });
  });

  describe('state consistency', () => {
    it('should maintain consistent state between icon and status text', () => {
      const { container } = render(() => <DisplayToggle value={true} />);

      const icon = container.querySelector('i.ri-eye-line');
      const statusText = container.textContent;

      expect(icon).toBeInTheDocument();
      expect(statusText).toContain('Visible');
    });

    it('should maintain consistent state when hidden', () => {
      const { container } = render(() => <DisplayToggle value={false} />);

      const icon = container.querySelector('i.ri-eye-off-line');
      const statusText = container.textContent;

      expect(icon).toBeInTheDocument();
      expect(statusText).toContain('Hidden');
    });

    it('should sync all visual indicators', () => {
      const { container } = render(() => (
        <DisplayToggle value={false} showIcon={true} />
      ));

      // Check icon
      const icon = container.querySelector('i.ri-eye-off-line');
      expect(icon).toBeInTheDocument();

      // Check status text
      const statusText = container.textContent;
      expect(statusText).toContain('Hidden');

      // Check title attribute
      const iconContainer = container.querySelector('[title="Hidden"]');
      expect(iconContainer).toBeInTheDocument();
    });
  });
});
