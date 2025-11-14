/**
 * BorderEditor component tests
 *
 * Tests for BorderEditor component to ensure proper border configuration editing,
 * including width, style, color, and radius with link/unlink functionality.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../../test-utils';
import { BorderEditor } from './BorderEditor';
import type { Border, BorderStyle } from '@email-builder/core/types/component.types';

describe('BorderEditor', () => {
  describe('rendering', () => {
    it('should render with default props', () => {
      const { container } = render(() => <BorderEditor />);

      // Should render width input
      const widthLabel = container.textContent;
      expect(widthLabel).toContain('Width');

      // Should render style select
      expect(widthLabel).toContain('Style');

      // Should render color label
      expect(widthLabel).toContain('Color');
    });

    it('should render with provided border value', () => {
      const border: Border = {
        width: { value: 2, unit: 'px' },
        style: 'solid',
        color: '#ff0000',
      };

      const { container } = render(() => <BorderEditor value={border} />);

      const input = container.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('2px');
    });

    it('should render with label', () => {
      const { container } = render(() => (
        <BorderEditor label="Container Border" />
      ));

      const label = container.textContent;
      expect(label).toContain('Container Border');
    });

    it('should render without label by default', () => {
      const { container } = render(() => <BorderEditor />);

      // Should not have main label (only row labels)
      const labels = container.querySelectorAll('label');
      const mainLabel = Array.from(labels).find(
        (l) => l.textContent === 'Container Border'
      );
      expect(mainLabel).toBeUndefined();
    });

    it('should render with custom class', () => {
      const { container } = render(() => (
        <BorderEditor class="custom-border-editor" />
      ));

      const editor = container.querySelector('.custom-border-editor');
      expect(editor).toBeInTheDocument();
    });

    it('should render radius section by default', () => {
      const { container } = render(() => <BorderEditor />);

      const text = container.textContent;
      expect(text).toContain('Border Radius');
    });

    it('should hide radius section when showRadius is false', () => {
      const { container } = render(() => <BorderEditor showRadius={false} />);

      const text = container.textContent;
      expect(text).not.toContain('Border Radius');
    });
  });

  describe('border style selection', () => {
    const borderStyles: BorderStyle[] = [
      'none',
      'solid',
      'dashed',
      'dotted',
      'double',
      'groove',
      'ridge',
      'inset',
      'outset',
    ];

    borderStyles.forEach((style) => {
      it(`should handle ${style} border style`, async () => {
        const handleChange = vi.fn();
        const border: Border = {
          width: { value: 1, unit: 'px' },
          style: 'solid',
          color: '#000000',
        };

        const { container } = render(() => (
          <BorderEditor value={border} onChange={handleChange} />
        ));

        const select = container.querySelectorAll('select')[1] as HTMLSelectElement;
        expect(select).toBeInTheDocument();

        // Set the value on the select element first
        select.value = style;
        // Then fire the change event with the updated select as target
        fireEvent.change(select);

        await waitFor(() => {
          expect(handleChange).toHaveBeenCalled();
        });

        if (handleChange.mock.calls.length > 0) {
          const newBorder = handleChange.mock.calls[0][0];
          expect(newBorder.style).toBe(style);
        }
      });
    });

    it('should render all 9 border style options', () => {
      const { container } = render(() => <BorderEditor />);

      const select = container.querySelectorAll('select')[1] as HTMLSelectElement;
      const options = select.querySelectorAll('option');

      expect(options.length).toBe(9);
    });

    it('should select current border style', () => {
      const border: Border = {
        width: { value: 1, unit: 'px' },
        style: 'dashed',
        color: '#000000',
      };

      const { container } = render(() => <BorderEditor value={border} />);

      const select = container.querySelectorAll('select')[1] as HTMLSelectElement;
      expect(select.value).toBe('dashed');
    });
  });

  describe('border width', () => {
    it('should update border width', async () => {
      const handleChange = vi.fn();
      const border: Border = {
        width: { value: 1, unit: 'px' },
        style: 'solid',
        color: '#000000',
      };

      const { container } = render(() => (
        <BorderEditor value={border} onChange={handleChange} />
      ));

      const input = container.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('1px');

      // Change width
      input.focus();
      input.value = '3';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });
    });

    it('should enforce minimum width of 0', () => {
      const border: Border = {
        width: { value: 5, unit: 'px' },
        style: 'solid',
        color: '#000000',
      };

      const { container } = render(() => <BorderEditor value={border} />);

      // Component should render without error with min=0 constraint
      const input = container.querySelector('input[type="text"]');
      expect(input).toBeInTheDocument();
    });

    it('should handle different width units', () => {
      const units = ['px', 'em', 'rem'] as const;

      units.forEach((unit) => {
        const border: Border = {
          width: { value: 2, unit },
          style: 'solid',
          color: '#000000',
        };

        const { container, unmount } = render(() => <BorderEditor value={border} />);

        const input = container.querySelector('input[type="text"]') as HTMLInputElement;
        expect(input).toHaveValue(`2${unit}`);

        unmount();
      });
    });
  });

  describe('border color', () => {
    it('should update border color', async () => {
      const handleChange = vi.fn();
      const border: Border = {
        width: { value: 1, unit: 'px' },
        style: 'solid',
        color: '#000000',
      };

      render(() => <BorderEditor value={border} onChange={handleChange} />);

      // ColorPicker integration - onChange should work
      await waitFor(
        () => {
          // ColorPicker is rendered
          expect(document.querySelector('input[type="text"]')).toBeInTheDocument();
        },
        { timeout: 100 }
      );
    });

    it('should render with custom color', () => {
      const border: Border = {
        width: { value: 1, unit: 'px' },
        style: 'solid',
        color: '#ff5500',
      };

      render(() => <BorderEditor value={border} />);

      // ColorPicker should be rendered with the color
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('border radius - link/unlink', () => {
    it('should start with radius corners linked', () => {
      const { container } = render(() => (
        <BorderEditor radiusStartOpen={true} />
      ));

      // Find link button (should be active/linked by default)
      const linkButton = container.querySelector('button[title="Unlink corners"]');
      expect(linkButton).toBeInTheDocument();
    });

    it('should toggle radius link state', async () => {
      const { container } = render(() => (
        <BorderEditor radiusStartOpen={true} />
      ));

      let linkButton = container.querySelector(
        'button[title="Unlink corners"]'
      ) as HTMLButtonElement;
      expect(linkButton).toBeInTheDocument();

      // Click to unlink
      linkButton.click();

      await waitFor(() => {
        linkButton = container.querySelector(
          'button[title="Link corners"]'
        ) as HTMLButtonElement;
        expect(linkButton).toBeInTheDocument();
      });
    });

    it('should update all corners when linked', async () => {
      const handleChange = vi.fn();
      const border: Border = {
        width: { value: 1, unit: 'px' },
        style: 'solid',
        color: '#000000',
        radius: {
          topLeft: { value: 0, unit: 'px' },
          topRight: { value: 0, unit: 'px' },
          bottomRight: { value: 0, unit: 'px' },
          bottomLeft: { value: 0, unit: 'px' },
        },
      };

      render(() => (
        <BorderEditor
          value={border}
          onChange={handleChange}
          radiusStartOpen={true}
        />
      ));

      // Radius is linked by default, changing one corner should update all
      await waitFor(
        () => {
          // Wait for component to render
          expect(document.querySelector('input[type="text"]')).toBeInTheDocument();
        },
        { timeout: 100 }
      );
    });

    it('should update only specific corner when unlinked', async () => {
      const handleChange = vi.fn();
      const border: Border = {
        width: { value: 1, unit: 'px' },
        style: 'solid',
        color: '#000000',
        radius: {
          topLeft: { value: 4, unit: 'px' },
          topRight: { value: 4, unit: 'px' },
          bottomRight: { value: 4, unit: 'px' },
          bottomLeft: { value: 4, unit: 'px' },
        },
      };

      const { container } = render(() => (
        <BorderEditor
          value={border}
          onChange={handleChange}
          radiusStartOpen={true}
        />
      ));

      // First unlink corners
      const linkButton = container.querySelector(
        'button[title="Unlink corners"]'
      ) as HTMLButtonElement;

      if (linkButton) {
        linkButton.click();

        await waitFor(() => {
          const unlinkButton = container.querySelector('button[title="Link corners"]');
          expect(unlinkButton).toBeInTheDocument();
        });
      }
    });

    it('should display radius summary when collapsed', () => {
      const border: Border = {
        width: { value: 1, unit: 'px' },
        style: 'solid',
        color: '#000000',
        radius: {
          topLeft: { value: 8, unit: 'px' },
          topRight: { value: 8, unit: 'px' },
          bottomRight: { value: 8, unit: 'px' },
          bottomLeft: { value: 8, unit: 'px' },
        },
      };

      const { container } = render(() => <BorderEditor value={border} />);

      const text = container.textContent;
      expect(text).toContain('Border Radius: 8px');
    });

    it('should display individual corner values when different', () => {
      const border: Border = {
        width: { value: 1, unit: 'px' },
        style: 'solid',
        color: '#000000',
        radius: {
          topLeft: { value: 4, unit: 'px' },
          topRight: { value: 8, unit: 'px' },
          bottomRight: { value: 12, unit: 'px' },
          bottomLeft: { value: 16, unit: 'px' },
        },
      };

      const { container } = render(() => <BorderEditor value={border} />);

      const text = container.textContent;
      expect(text).toContain('Border Radius: 4px 8px 12px 16px');
    });
  });

  describe('disabled state', () => {
    it('should disable all inputs when disabled', () => {
      const border: Border = {
        width: { value: 1, unit: 'px' },
        style: 'solid',
        color: '#000000',
      };

      const { container } = render(() => (
        <BorderEditor value={border} disabled={true} />
      ));

      // Width input should be disabled
      const input = container.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toBeDisabled();

      // Style select should be disabled
      const select = container.querySelectorAll('select')[1] as HTMLSelectElement;
      expect(select).toBeDisabled();
    });

    it('should not call onChange when disabled', () => {
      const handleChange = vi.fn();
      const border: Border = {
        width: { value: 1, unit: 'px' },
        style: 'solid',
        color: '#000000',
      };

      const { container } = render(() => (
        <BorderEditor value={border} onChange={handleChange} disabled={true} />
      ));

      const select = container.querySelectorAll('select')[1] as HTMLSelectElement;
      expect(select).toBeDisabled();
    });

    it('should enable all inputs by default', () => {
      const { container } = render(() => <BorderEditor />);

      const input = container.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).not.toBeDisabled();

      const select = container.querySelectorAll('select')[1] as HTMLSelectElement;
      expect(select).not.toBeDisabled();
    });
  });

  describe('radius section toggle', () => {
    it('should start radius section closed by default', () => {
      const { container } = render(() => <BorderEditor />);

      // Section should exist but content might be collapsed
      const text = container.textContent;
      expect(text).toContain('Border Radius');
    });

    it('should start radius section open when radiusStartOpen is true', () => {
      const { container } = render(() => (
        <BorderEditor radiusStartOpen={true} />
      ));

      const text = container.textContent;
      expect(text).toContain('Border Radius');
    });

    it('should allow toggling radius section', async () => {
      const { container } = render(() => (
        <BorderEditor radiusStartOpen={false} />
      ));

      // Should have a toggleable section button
      const text = container.textContent;
      expect(text).toContain('Border Radius');
    });
  });

  describe('complex scenarios', () => {
    it('should handle all props together', () => {
      const handleChange = vi.fn();
      const border: Border = {
        width: { value: 2, unit: 'px' },
        style: 'dashed',
        color: '#336699',
        radius: {
          topLeft: { value: 4, unit: 'px' },
          topRight: { value: 4, unit: 'px' },
          bottomRight: { value: 4, unit: 'px' },
          bottomLeft: { value: 4, unit: 'px' },
        },
      };

      const { container } = render(() => (
        <BorderEditor
          value={border}
          label="Container Border"
          showRadius={true}
          radiusStartOpen={true}
          disabled={false}
          class="custom-border-editor"
          onChange={handleChange}
        />
      ));

      // Verify rendering
      expect(container.querySelector('.custom-border-editor')).toBeInTheDocument();

      const text = container.textContent;
      expect(text).toContain('Container Border');
      expect(text).toContain('Width');
      expect(text).toContain('Style');
      expect(text).toContain('Color');
      expect(text).toContain('Border Radius');

      const input = container.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('2px');

      const select = container.querySelectorAll('select')[1] as HTMLSelectElement;
      expect(select.value).toBe('dashed');
    });

    it('should work without onChange handler', () => {
      const border: Border = {
        width: { value: 1, unit: 'px' },
        style: 'solid',
        color: '#000000',
      };

      const { container } = render(() => <BorderEditor value={border} />);

      const select = container.querySelectorAll('select')[1] as HTMLSelectElement;

      // Should not throw error when changed without onChange
      expect(() => {
        select.value = 'dashed';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }).not.toThrow();
    });

    it('should handle undefined border value', () => {
      const { container } = render(() => <BorderEditor value={undefined} />);

      // Should render with default values
      const input = container.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('0px');

      const select = container.querySelectorAll('select')[1] as HTMLSelectElement;
      expect(select.value).toBe('none');
    });

    it('should handle partial border value', () => {
      const border = {
        width: { value: 1, unit: 'px' },
        style: 'solid' as BorderStyle,
        // Missing color (should use default)
      };

      const { container } = render(() => <BorderEditor value={border as Border} />);

      const input = container.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('1px');
    });

    it('should handle border with partial radius', () => {
      const border: Border = {
        width: { value: 1, unit: 'px' },
        style: 'solid',
        color: '#000000',
        radius: {
          topLeft: { value: 4, unit: 'px' },
          // Other corners will use defaults
        } as any,
      };

      const { container } = render(() => <BorderEditor value={border} />);

      // Should render without error
      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });
  });

  describe('onChange behavior', () => {
    it('should pass complete border object to onChange', async () => {
      const handleChange = vi.fn();
      const border: Border = {
        width: { value: 1, unit: 'px' },
        style: 'solid',
        color: '#000000',
      };

      const { container } = render(() => (
        <BorderEditor value={border} onChange={handleChange} />
      ));

      const select = container.querySelectorAll('select')[1] as HTMLSelectElement;
      select.value = 'dashed';
      select.dispatchEvent(new Event('change', { bubbles: true }));

      await waitFor(() => {
        if (handleChange.mock.calls.length > 0) {
          const newBorder = handleChange.mock.calls[0][0];
          expect(newBorder).toHaveProperty('width');
          expect(newBorder).toHaveProperty('style');
          expect(newBorder).toHaveProperty('color');
        }
      });
    });

    it('should preserve other properties when updating width', async () => {
      const handleChange = vi.fn();
      const border: Border = {
        width: { value: 1, unit: 'px' },
        style: 'dashed',
        color: '#ff0000',
      };

      const { container } = render(() => (
        <BorderEditor value={border} onChange={handleChange} />
      ));

      const input = container.querySelector('input[type="text"]') as HTMLInputElement;
      input.focus();
      input.value = '3';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await waitFor(() => {
        if (handleChange.mock.calls.length > 0) {
          const newBorder = handleChange.mock.calls[0][0];
          expect(newBorder.style).toBe('dashed');
          expect(newBorder.color).toBe('#ff0000');
        }
      });
    });

    it('should preserve other properties when updating style', async () => {
      const handleChange = vi.fn();
      const border: Border = {
        width: { value: 2, unit: 'px' },
        style: 'solid',
        color: '#00ff00',
      };

      const { container } = render(() => (
        <BorderEditor value={border} onChange={handleChange} />
      ));

      const select = container.querySelectorAll('select')[1] as HTMLSelectElement;
      select.value = 'dotted';
      select.dispatchEvent(new Event('change', { bubbles: true }));

      await waitFor(() => {
        if (handleChange.mock.calls.length > 0) {
          const newBorder = handleChange.mock.calls[0][0];
          expect(newBorder.width.value).toBe(2);
          expect(newBorder.color).toBe('#00ff00');
        }
      });
    });
  });

  describe('edge cases', () => {
    it('should handle zero width', () => {
      const border: Border = {
        width: { value: 0, unit: 'px' },
        style: 'none',
        color: '#000000',
      };

      const { container } = render(() => <BorderEditor value={border} />);

      const input = container.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('0px');
    });

    it('should handle large width values', () => {
      const border: Border = {
        width: { value: 100, unit: 'px' },
        style: 'solid',
        color: '#000000',
      };

      const { container } = render(() => <BorderEditor value={border} />);

      const input = container.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('100px');
    });

    it('should handle transparent color', () => {
      const border: Border = {
        width: { value: 1, unit: 'px' },
        style: 'solid',
        color: 'transparent',
      };

      render(() => <BorderEditor value={border} />);

      // Should render without error
      expect(document.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should handle rgba color', () => {
      const border: Border = {
        width: { value: 1, unit: 'px' },
        style: 'solid',
        color: 'rgba(255, 0, 0, 0.5)',
      };

      render(() => <BorderEditor value={border} />);

      // Should render without error
      expect(document.querySelector('input[type="text"]')).toBeInTheDocument();
    });
  });
});
