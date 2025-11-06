/**
 * Icon component tests
 *
 * Tests for SolidJS Icon component to ensure it's testable by AI agents
 */

import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '../../test-utils';
import { Icon } from './Icon';

describe('Icon', () => {
  describe('rendering', () => {
    it('should render with icon name', () => {
      render(() => <Icon name="star" />);

      const icon = document.querySelector('i.ri-star');
      expect(icon).toBeInTheDocument();
    });

    it('should render different icon names', () => {
      const { unmount } = render(() => <Icon name="heart" />);
      let icon = document.querySelector('i.ri-heart');
      expect(icon).toBeInTheDocument();
      unmount();

      render(() => <Icon name="settings" />);
      icon = document.querySelector('i.ri-settings');
      expect(icon).toBeInTheDocument();
      unmount();

      render(() => <Icon name="user" />);
      icon = document.querySelector('i.ri-user');
      expect(icon).toBeInTheDocument();
    });

    it('should render with default medium size', () => {
      render(() => <Icon name="star" />);

      const icon = document.querySelector('i.ri-star') as HTMLElement;
      expect(icon).toBeInTheDocument();

      const styles = window.getComputedStyle(icon);
      expect(styles.fontSize).toBe('24px');
    });

    it('should render with small size', () => {
      render(() => <Icon name="star" size="small" />);

      const icon = document.querySelector('i.ri-star') as HTMLElement;
      const styles = window.getComputedStyle(icon);
      expect(styles.fontSize).toBe('16px');
    });

    it('should render with medium size', () => {
      render(() => <Icon name="star" size="medium" />);

      const icon = document.querySelector('i.ri-star') as HTMLElement;
      const styles = window.getComputedStyle(icon);
      expect(styles.fontSize).toBe('24px');
    });

    it('should render with large size', () => {
      render(() => <Icon name="star" size="large" />);

      const icon = document.querySelector('i.ri-star') as HTMLElement;
      const styles = window.getComputedStyle(icon);
      expect(styles.fontSize).toBe('32px');
    });

    it('should render with custom numeric size', () => {
      render(() => <Icon name="star" size={48} />);

      const icon = document.querySelector('i.ri-star') as HTMLElement;
      const styles = window.getComputedStyle(icon);
      expect(styles.fontSize).toBe('48px');
    });

    it('should render with custom color', () => {
      render(() => <Icon name="star" color="#ff0000" />);

      const icon = document.querySelector('i.ri-star') as HTMLElement;
      const styles = window.getComputedStyle(icon);
      expect(styles.color).toBe('rgb(255, 0, 0)'); // Browser converts hex to rgb
    });

    it('should render with custom className', () => {
      render(() => <Icon name="star" className="custom-icon" />);

      const icon = document.querySelector('i.ri-star');
      expect(icon?.className).toContain('custom-icon');
    });
  });

  describe('accessibility', () => {
    it('should be aria-hidden by default', () => {
      render(() => <Icon name="star" />);

      const icon = document.querySelector('i.ri-star');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have aria-label and role when ariaLabel is provided', () => {
      render(() => <Icon name="star" ariaLabel="Favorite" />);

      const icon = document.querySelector('i.ri-star');
      expect(icon).toHaveAttribute('aria-label', 'Favorite');
      expect(icon).toHaveAttribute('role', 'img');
      expect(icon).not.toHaveAttribute('aria-hidden');
    });

    it('should not have aria-hidden when ariaLabel is provided', () => {
      render(() => <Icon name="heart" ariaLabel="Like" />);

      const icon = document.querySelector('i.ri-heart');
      expect(icon).not.toHaveAttribute('aria-hidden');
      expect(icon).toHaveAttribute('aria-label', 'Like');
    });
  });

  describe('clickable icons', () => {
    it('should add clickable class when onClick is provided', () => {
      const handleClick = vi.fn();
      render(() => <Icon name="star" onClick={handleClick} />);

      const icon = document.querySelector('i.ri-star');
      expect(icon?.className).toContain('clickable');
    });

    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn();
      render(() => <Icon name="star" onClick={handleClick} />);

      const icon = document.querySelector('i.ri-star') as HTMLElement;
      icon.click();

      await waitFor(() => {
        expect(handleClick).toHaveBeenCalledTimes(1);
      });
    });

    it('should not have clickable class when onClick is not provided', () => {
      render(() => <Icon name="star" />);

      const icon = document.querySelector('i.ri-star');
      expect(icon?.className).not.toContain('clickable');
    });
  });

  describe('test attributes', () => {
    it('should render with testId attribute', () => {
      render(() => <Icon name="star" testId="test-icon" />);

      const icon = document.querySelector('i.ri-star');
      expect(icon).toHaveAttribute('data-testid', 'test-icon');
    });

    it('should be queryable by testId', () => {
      render(() => <Icon name="heart" testId="query-icon" />);

      const icon = document.querySelector('[data-testid="query-icon"]');
      expect(icon).toBeInTheDocument();
      expect(icon?.className).toContain('ri-heart');
    });
  });

  describe('AI testing compatibility', () => {
    it('should be identifiable via test attributes for AI agents', () => {
      render(() => (
        <Icon
          name="save"
          testId="ai-test-icon"
          size="large"
          color="#0000ff"
          ariaLabel="Save icon"
        />
      ));

      // AI can find by testId
      const icon = document.querySelector('[data-testid="ai-test-icon"]') as HTMLElement;
      expect(icon).toBeInTheDocument();

      // AI can verify properties
      expect(icon.className).toContain('ri-save');
      expect(icon).toHaveAttribute('aria-label', 'Save icon');
      expect(icon).toHaveAttribute('role', 'img');

      const styles = window.getComputedStyle(icon);
      expect(styles.fontSize).toBe('32px');
      expect(styles.color).toBe('rgb(0, 0, 255)');
    });

    it('should provide clear state for AI agents to verify', () => {
      const { unmount } = render(() => <Icon name="star" />);

      let icon = document.querySelector('i.ri-star');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      unmount();

      render(() => <Icon name="heart" ariaLabel="Like" />);
      icon = document.querySelector('i.ri-heart');
      expect(icon).toHaveAttribute('aria-label', 'Like');
      expect(icon).not.toHaveAttribute('aria-hidden');
    });

    it('should support interaction by AI agents', async () => {
      const handleClick = vi.fn();
      render(() => <Icon name="delete" testId="ai-icon" onClick={handleClick} />);

      const icon = document.querySelector('[data-testid="ai-icon"]') as HTMLElement;
      expect(icon).toBeInTheDocument();
      expect(icon.className).toContain('clickable');

      // Simulate AI clicking
      icon.click();

      await waitFor(() => {
        expect(handleClick).toHaveBeenCalled();
      });
    });
  });

  describe('complex scenarios', () => {
    it('should handle all props together', async () => {
      const handleClick = vi.fn();

      render(() => (
        <Icon
          name="settings"
          size={40}
          color="#ff9900"
          ariaLabel="Settings icon"
          className="extra-class"
          testId="complex-icon"
          onClick={handleClick}
        />
      ));

      const icon = document.querySelector('[data-testid="complex-icon"]') as HTMLElement;

      // Verify all props are applied
      expect(icon).toBeInTheDocument();
      expect(icon.className).toContain('ri-settings');
      expect(icon.className).toContain('extra-class');
      expect(icon.className).toContain('clickable');
      expect(icon).toHaveAttribute('aria-label', 'Settings icon');
      expect(icon).toHaveAttribute('role', 'img');

      const styles = window.getComputedStyle(icon);
      expect(styles.fontSize).toBe('40px');
      expect(styles.color).toBe('rgb(255, 153, 0)');

      // Test click
      icon.click();

      await waitFor(() => {
        expect(handleClick).toHaveBeenCalled();
      });
    });

    it('should work as part of a button', async () => {
      const handleClick = vi.fn();

      render(() => (
        <button onClick={handleClick} data-testid="icon-button">
          <Icon name="plus" testId="plus-icon" />
          Add Item
        </button>
      ));

      const button = document.querySelector('[data-testid="icon-button"]') as HTMLElement;
      const icon = document.querySelector('[data-testid="plus-icon"]');

      expect(button).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(icon?.className).toContain('ri-plus');

      button.click();

      await waitFor(() => {
        expect(handleClick).toHaveBeenCalled();
      });
    });
  });

  describe('icon families and variations', () => {
    it('should support line icons', () => {
      render(() => <Icon name="star-line" />);

      const icon = document.querySelector('i.ri-star-line');
      expect(icon).toBeInTheDocument();
    });

    it('should support fill icons', () => {
      render(() => <Icon name="star-fill" />);

      const icon = document.querySelector('i.ri-star-fill');
      expect(icon).toBeInTheDocument();
    });

    it('should support various icon categories', () => {
      const icons = [
        'home',
        'user',
        'settings',
        'search',
        'close',
        'check',
        'arrow-right',
        'arrow-left',
        'menu',
        'more',
      ];

      icons.forEach((iconName) => {
        const { unmount } = render(() => <Icon name={iconName} />);
        const icon = document.querySelector(`i.ri-${iconName}`);
        expect(icon).toBeInTheDocument();
        unmount();
      });
    });
  });
});
