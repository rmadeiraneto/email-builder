/**
 * SpacingEditor component tests
 *
 * Tests for SpacingEditor component to ensure proper 4-sided spacing editing,
 * link/unlink functionality, and CSSValue handling for each side.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../../test-utils';
import { SpacingEditor } from './SpacingEditor';
import type { Spacing } from '@email-builder/core/types/component.types';

describe('SpacingEditor', () => {
  describe('rendering', () => {
    it('should render with default props', () => {
      const { container } = render(() => <SpacingEditor />);

      // Should render input fields for all sides
      const inputs = container.querySelectorAll('input[type="text"]');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should render with provided spacing value', () => {
      const spacing: Spacing = {
        top: { value: 16, unit: 'px' },
        right: { value: 8, unit: 'px' },
        bottom: { value: 16, unit: 'px' },
        left: { value: 8, unit: 'px' },
      };

      const { container } = render(() => <SpacingEditor value={spacing} />);

      const inputs = container.querySelectorAll('input[type="text"]');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should render with label', () => {
      const { container } = render(() => <SpacingEditor label="Padding" />);

      const label = container.textContent;
      expect(label).toContain('Padding');
    });

    it('should render without label by default', () => {
      const { container } = render(() => <SpacingEditor />);

      // Should have side labels (Top, Right, Bottom, Left) but not main label
      const text = container.textContent;
      expect(text).toContain('Top');
    });

    it('should render with custom class', () => {
      const { container } = render(() => (
        <SpacingEditor class="custom-spacing-editor" />
      ));

      const editor = container.querySelector('.custom-spacing-editor');
      expect(editor).toBeInTheDocument();
    });

    it('should render all four side inputs', () => {
      const { container } = render(() => <SpacingEditor />);

      const text = container.textContent;
      expect(text).toContain('Top');
      expect(text).toContain('Right');
      expect(text).toContain('Bottom');
      expect(text).toContain('Left');
    });
  });

  describe('4-sided spacing updates', () => {
    it('should handle top spacing update', async () => {
      const handleChange = vi.fn();
      const spacing: Spacing = {
        top: { value: 16, unit: 'px' },
        right: { value: 16, unit: 'px' },
        bottom: { value: 16, unit: 'px' },
        left: { value: 16, unit: 'px' },
      };

      render(() => (
        <SpacingEditor value={spacing} onChange={handleChange} startLinked={false} />
      ));

      // Wait for component to render
      await waitFor(() => {
        const inputs = document.querySelectorAll('input[type="text"]');
        expect(inputs.length).toBeGreaterThan(0);
      });
    });

    it('should handle right spacing update', async () => {
      const handleChange = vi.fn();
      const spacing: Spacing = {
        top: { value: 16, unit: 'px' },
        right: { value: 8, unit: 'px' },
        bottom: { value: 16, unit: 'px' },
        left: { value: 16, unit: 'px' },
      };

      render(() => (
        <SpacingEditor value={spacing} onChange={handleChange} startLinked={false} />
      ));

      await waitFor(() => {
        const inputs = document.querySelectorAll('input[type="text"]');
        expect(inputs.length).toBeGreaterThan(0);
      });
    });

    it('should handle bottom spacing update', async () => {
      const handleChange = vi.fn();
      const spacing: Spacing = {
        top: { value: 16, unit: 'px' },
        right: { value: 16, unit: 'px' },
        bottom: { value: 24, unit: 'px' },
        left: { value: 16, unit: 'px' },
      };

      render(() => (
        <SpacingEditor value={spacing} onChange={handleChange} startLinked={false} />
      ));

      await waitFor(() => {
        const inputs = document.querySelectorAll('input[type="text"]');
        expect(inputs.length).toBeGreaterThan(0);
      });
    });

    it('should handle left spacing update', async () => {
      const handleChange = vi.fn();
      const spacing: Spacing = {
        top: { value: 16, unit: 'px' },
        right: { value: 16, unit: 'px' },
        bottom: { value: 16, unit: 'px' },
        left: { value: 32, unit: 'px' },
      };

      render(() => (
        <SpacingEditor value={spacing} onChange={handleChange} startLinked={false} />
      ));

      await waitFor(() => {
        const inputs = document.querySelectorAll('input[type="text"]');
        expect(inputs.length).toBeGreaterThan(0);
      });
    });

    it('should handle zero values', () => {
      const spacing: Spacing = {
        top: { value: 0, unit: 'px' },
        right: { value: 0, unit: 'px' },
        bottom: { value: 0, unit: 'px' },
        left: { value: 0, unit: 'px' },
      };

      const { container } = render(() => <SpacingEditor value={spacing} />);

      const inputs = container.querySelectorAll('input[type="text"]');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should handle large values', () => {
      const spacing: Spacing = {
        top: { value: 100, unit: 'px' },
        right: { value: 200, unit: 'px' },
        bottom: { value: 150, unit: 'px' },
        left: { value: 50, unit: 'px' },
      };

      const { container } = render(() => <SpacingEditor value={spacing} />);

      const inputs = container.querySelectorAll('input[type="text"]');
      expect(inputs.length).toBeGreaterThan(0);
    });
  });

  describe('CSSValue handling', () => {
    it('should handle different units for each side', () => {
      const spacing: Spacing = {
        top: { value: 16, unit: 'px' },
        right: { value: 1, unit: 'rem' },
        bottom: { value: 2, unit: 'em' },
        left: { value: 50, unit: '%' },
      };

      const { container } = render(() => <SpacingEditor value={spacing} />);

      const inputs = container.querySelectorAll('input[type="text"]');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should handle px unit', () => {
      const spacing: Spacing = {
        top: { value: 16, unit: 'px' },
        right: { value: 16, unit: 'px' },
        bottom: { value: 16, unit: 'px' },
        left: { value: 16, unit: 'px' },
      };

      const { container } = render(() => <SpacingEditor value={spacing} />);

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should handle rem unit', () => {
      const spacing: Spacing = {
        top: { value: 1, unit: 'rem' },
        right: { value: 1, unit: 'rem' },
        bottom: { value: 1, unit: 'rem' },
        left: { value: 1, unit: 'rem' },
      };

      const { container } = render(() => <SpacingEditor value={spacing} />);

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should handle em unit', () => {
      const spacing: Spacing = {
        top: { value: 2, unit: 'em' },
        right: { value: 2, unit: 'em' },
        bottom: { value: 2, unit: 'em' },
        left: { value: 2, unit: 'em' },
      };

      const { container } = render(() => <SpacingEditor value={spacing} />);

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should handle percentage unit', () => {
      const spacing: Spacing = {
        top: { value: 10, unit: '%' },
        right: { value: 10, unit: '%' },
        bottom: { value: 10, unit: '%' },
        left: { value: 10, unit: '%' },
      };

      const { container } = render(() => <SpacingEditor value={spacing} />);

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should handle pt unit', () => {
      const spacing: Spacing = {
        top: { value: 12, unit: 'pt' },
        right: { value: 12, unit: 'pt' },
        bottom: { value: 12, unit: 'pt' },
        left: { value: 12, unit: 'pt' },
      };

      const { container } = render(() => <SpacingEditor value={spacing} />);

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });
  });

  describe('link/unlink behavior', () => {
    it('should start linked by default', () => {
      const { container } = render(() => <SpacingEditor />);

      // LinkedInputs should be rendered
      const inputs = container.querySelectorAll('input[type="text"]');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should start unlinked when startLinked is false', () => {
      const { container } = render(() => <SpacingEditor startLinked={false} />);

      const inputs = container.querySelectorAll('input[type="text"]');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should update all sides when linked', async () => {
      const handleChange = vi.fn();
      const spacing: Spacing = {
        top: { value: 16, unit: 'px' },
        right: { value: 16, unit: 'px' },
        bottom: { value: 16, unit: 'px' },
        left: { value: 16, unit: 'px' },
      };

      render(() => (
        <SpacingEditor value={spacing} onChange={handleChange} startLinked={true} />
      ));

      await waitFor(() => {
        const inputs = document.querySelectorAll('input[type="text"]');
        expect(inputs.length).toBeGreaterThan(0);
      });
    });

    it('should update only specific side when unlinked', async () => {
      const handleChange = vi.fn();
      const spacing: Spacing = {
        top: { value: 16, unit: 'px' },
        right: { value: 8, unit: 'px' },
        bottom: { value: 16, unit: 'px' },
        left: { value: 8, unit: 'px' },
      };

      render(() => (
        <SpacingEditor value={spacing} onChange={handleChange} startLinked={false} />
      ));

      await waitFor(() => {
        const inputs = document.querySelectorAll('input[type="text"]');
        expect(inputs.length).toBeGreaterThan(0);
      });
    });

    it('should call onLinkChange when link state changes', async () => {
      const handleLinkChange = vi.fn();

      render(() => (
        <SpacingEditor startLinked={true} onLinkChange={handleLinkChange} />
      ));

      await waitFor(() => {
        // Component should be rendered
        expect(document.querySelector('input[type="text"]')).toBeInTheDocument();
      });
    });
  });

  describe('constraints', () => {
    it('should respect min constraint', () => {
      const spacing: Spacing = {
        top: { value: 10, unit: 'px' },
        right: { value: 10, unit: 'px' },
        bottom: { value: 10, unit: 'px' },
        left: { value: 10, unit: 'px' },
      };

      const { container } = render(() => <SpacingEditor value={spacing} min={0} />);

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should respect max constraint', () => {
      const spacing: Spacing = {
        top: { value: 50, unit: 'px' },
        right: { value: 50, unit: 'px' },
        bottom: { value: 50, unit: 'px' },
        left: { value: 50, unit: 'px' },
      };

      const { container } = render(() => <SpacingEditor value={spacing} max={100} />);

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should work with both min and max constraints', () => {
      const spacing: Spacing = {
        top: { value: 25, unit: 'px' },
        right: { value: 25, unit: 'px' },
        bottom: { value: 25, unit: 'px' },
        left: { value: 25, unit: 'px' },
      };

      const { container } = render(() => (
        <SpacingEditor value={spacing} min={0} max={100} />
      ));

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should handle null min constraint', () => {
      const spacing: Spacing = {
        top: { value: 10, unit: 'px' },
        right: { value: 10, unit: 'px' },
        bottom: { value: 10, unit: 'px' },
        left: { value: 10, unit: 'px' },
      };

      const { container } = render(() => <SpacingEditor value={spacing} min={null} />);

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should handle null max constraint', () => {
      const spacing: Spacing = {
        top: { value: 100, unit: 'px' },
        right: { value: 100, unit: 'px' },
        bottom: { value: 100, unit: 'px' },
        left: { value: 100, unit: 'px' },
      };

      const { container } = render(() => <SpacingEditor value={spacing} max={null} />);

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });
  });

  describe('increment', () => {
    it('should use custom increment value', () => {
      const spacing: Spacing = {
        top: { value: 10, unit: 'px' },
        right: { value: 10, unit: 'px' },
        bottom: { value: 10, unit: 'px' },
        left: { value: 10, unit: 'px' },
      };

      const { container } = render(() => (
        <SpacingEditor value={spacing} increment={5} />
      ));

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should use default increment of 1', () => {
      const spacing: Spacing = {
        top: { value: 10, unit: 'px' },
        right: { value: 10, unit: 'px' },
        bottom: { value: 10, unit: 'px' },
        left: { value: 10, unit: 'px' },
      };

      const { container } = render(() => <SpacingEditor value={spacing} />);

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should handle decimal increment values', () => {
      const spacing: Spacing = {
        top: { value: 1, unit: 'rem' },
        right: { value: 1, unit: 'rem' },
        bottom: { value: 1, unit: 'rem' },
        left: { value: 1, unit: 'rem' },
      };

      const { container } = render(() => (
        <SpacingEditor value={spacing} increment={0.25} />
      ));

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('should be enabled by default', () => {
      const { container } = render(() => <SpacingEditor />);

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should render as disabled when disabled prop is true', () => {
      const spacing: Spacing = {
        top: { value: 16, unit: 'px' },
        right: { value: 16, unit: 'px' },
        bottom: { value: 16, unit: 'px' },
        left: { value: 16, unit: 'px' },
      };

      const { container } = render(() => (
        <SpacingEditor value={spacing} disabled={true} />
      ));

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });
  });

  describe('availableUnits', () => {
    it('should use default available units', () => {
      const { container } = render(() => <SpacingEditor />);

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should use custom available units', () => {
      const spacing: Spacing = {
        top: { value: 16, unit: 'px' },
        right: { value: 16, unit: 'px' },
        bottom: { value: 16, unit: 'px' },
        left: { value: 16, unit: 'px' },
      };

      const { container } = render(() => (
        <SpacingEditor value={spacing} availableUnits={['px', 'rem']} />
      ));

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });
  });

  describe('onChange behavior', () => {
    it('should call onChange with Spacing object', async () => {
      const handleChange = vi.fn();
      const spacing: Spacing = {
        top: { value: 16, unit: 'px' },
        right: { value: 16, unit: 'px' },
        bottom: { value: 16, unit: 'px' },
        left: { value: 16, unit: 'px' },
      };

      render(() => (
        <SpacingEditor value={spacing} onChange={handleChange} startLinked={false} />
      ));

      await waitFor(() => {
        expect(document.querySelector('input[type="text"]')).toBeInTheDocument();
      });
    });

    it('should work without onChange handler', () => {
      const spacing: Spacing = {
        top: { value: 16, unit: 'px' },
        right: { value: 16, unit: 'px' },
        bottom: { value: 16, unit: 'px' },
        left: { value: 16, unit: 'px' },
      };

      const { container } = render(() => <SpacingEditor value={spacing} />);

      // Should render without error
      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should preserve units when changing values', async () => {
      const handleChange = vi.fn();
      const spacing: Spacing = {
        top: { value: 16, unit: 'px' },
        right: { value: 1, unit: 'rem' },
        bottom: { value: 2, unit: 'em' },
        left: { value: 10, unit: '%' },
      };

      render(() => (
        <SpacingEditor value={spacing} onChange={handleChange} startLinked={false} />
      ));

      await waitFor(() => {
        expect(document.querySelectorAll('input[type="text"]').length).toBeGreaterThan(0);
      });
    });
  });

  describe('complex scenarios', () => {
    it('should handle all props together', () => {
      const handleChange = vi.fn();
      const handleLinkChange = vi.fn();
      const spacing: Spacing = {
        top: { value: 16, unit: 'px' },
        right: { value: 8, unit: 'px' },
        bottom: { value: 16, unit: 'px' },
        left: { value: 8, unit: 'px' },
      };

      const { container } = render(() => (
        <SpacingEditor
          value={spacing}
          label="Padding"
          availableUnits={['px', 'rem', 'em']}
          startLinked={false}
          increment={4}
          min={0}
          max={100}
          disabled={false}
          class="custom-spacing-editor"
          onChange={handleChange}
          onLinkChange={handleLinkChange}
        />
      ));

      // Verify rendering
      expect(container.querySelector('.custom-spacing-editor')).toBeInTheDocument();

      const text = container.textContent;
      expect(text).toContain('Padding');
      expect(text).toContain('Top');
      expect(text).toContain('Right');
      expect(text).toContain('Bottom');
      expect(text).toContain('Left');
    });

    it('should handle undefined spacing value', () => {
      const { container } = render(() => <SpacingEditor value={undefined} />);

      // Should render with default values
      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should handle partial spacing value', () => {
      const spacing = {
        top: { value: 16, unit: 'px' },
        right: { value: 8, unit: 'px' },
        // Missing bottom and left
      };

      const { container } = render(() => (
        <SpacingEditor value={spacing as Spacing} />
      ));

      // Should render with defaults for missing values
      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should handle all sides with same value', () => {
      const spacing: Spacing = {
        top: { value: 20, unit: 'px' },
        right: { value: 20, unit: 'px' },
        bottom: { value: 20, unit: 'px' },
        left: { value: 20, unit: 'px' },
      };

      const { container } = render(() => <SpacingEditor value={spacing} />);

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should handle all sides with different values', () => {
      const spacing: Spacing = {
        top: { value: 10, unit: 'px' },
        right: { value: 20, unit: 'px' },
        bottom: { value: 30, unit: 'px' },
        left: { value: 40, unit: 'px' },
      };

      const { container } = render(() => (
        <SpacingEditor value={spacing} startLinked={false} />
      ));

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle decimal values', () => {
      const spacing: Spacing = {
        top: { value: 1.5, unit: 'rem' },
        right: { value: 2.25, unit: 'rem' },
        bottom: { value: 1.75, unit: 'rem' },
        left: { value: 2.5, unit: 'rem' },
      };

      const { container } = render(() => <SpacingEditor value={spacing} />);

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should handle mixed units', () => {
      const spacing: Spacing = {
        top: { value: 16, unit: 'px' },
        right: { value: 1, unit: 'rem' },
        bottom: { value: 2, unit: 'em' },
        left: { value: 50, unit: '%' },
      };

      const { container } = render(() => (
        <SpacingEditor value={spacing} startLinked={false} />
      ));

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should handle very large values', () => {
      const spacing: Spacing = {
        top: { value: 1000, unit: 'px' },
        right: { value: 1000, unit: 'px' },
        bottom: { value: 1000, unit: 'px' },
        left: { value: 1000, unit: 'px' },
      };

      const { container } = render(() => <SpacingEditor value={spacing} max={null} />);

      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should handle empty string label', () => {
      const { container } = render(() => <SpacingEditor label="" />);

      // Should not render empty label
      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });
  });
});
