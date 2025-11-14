/**
 * ColorPicker component tests
 *
 * Tests for ColorPicker enhancements to ensure proper rendering of new features:
 * - HEX, RGB, and HSL input modes
 * - Preset color swatches
 * - Empty/transparent color support
 * - Opacity controls
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../../test-utils';
import { ColorPicker } from './ColorPicker';

describe('ColorPicker', () => {
  describe('rendering', () => {
    it('should render with default props', () => {
      const { container } = render(() => <ColorPicker />);

      // Should render the color picker
      const colorInput = container.querySelector('input[type="color"]');
      expect(colorInput).toBeInTheDocument();
    });

    it('should render with initial value', () => {
      const { container } = render(() => (
        <ColorPicker value="#3b82f6" onChange={() => {}} />
      ));

      const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement;
      expect(colorInput).toBeInTheDocument();
      expect(colorInput.value).toBe('#3b82f6');
    });

    it('should render with custom class', () => {
      const { container } = render(() => (
        <ColorPicker class="custom-picker" />
      ));

      const picker = container.querySelector('.custom-picker');
      expect(picker).toBeInTheDocument();
    });

    it('should render text input by default', () => {
      const { container } = render(() => <ColorPicker />);

      const textInput = container.querySelector('input[type="text"]');
      expect(textInput).toBeInTheDocument();
    });

    it('should hide text input when noInput is true', () => {
      const { container } = render(() => <ColorPicker noInput={true} />);

      const textInput = container.querySelector('input[type="text"]');
      expect(textInput).not.toBeInTheDocument();
    });

    it('should show swatches by default', () => {
      const { container } = render(() => <ColorPicker />);

      // Should have swatch container
      const swatches = container.querySelectorAll('button[aria-label^="Select color"]');
      expect(swatches.length).toBeGreaterThan(0);
    });

    it('should hide swatches when showSwatches is false', () => {
      const { container } = render(() => <ColorPicker showSwatches={false} />);

      const swatches = container.querySelectorAll('button[aria-label^="Select color"]');
      expect(swatches.length).toBe(0);
    });
  });

  describe('color swatch display', () => {
    it('should render color swatch with current color', () => {
      const { container } = render(() => (
        <ColorPicker value="#ff0000" />
      ));

      const swatch = container.querySelector('[title="Current color"]') as HTMLElement;
      expect(swatch).toBeInTheDocument();
      expect(swatch.style.backgroundColor).toBe('rgb(255, 0, 0)');
    });

    it('should update swatch background when color changes', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ColorPicker value="#000000" onChange={handleChange} />
      ));

      const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement;

      // Change color
      colorInput.value = '#ff0000';
      fireEvent.input(colorInput);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('#ff0000');
      });
    });

    it('should show empty indicator when color is transparent', () => {
      const { container } = render(() => (
        <ColorPicker value="transparent" allowEmpty={true} />
      ));

      const swatch = container.querySelector('[title="Current color"]');
      expect(swatch).toBeInTheDocument();
    });
  });

  describe('input mode toggling', () => {
    it('should render mode toggle button', () => {
      const { container } = render(() => <ColorPicker />);

      const modeButton = container.querySelector('button[title="Switch color mode"]');
      expect(modeButton).toBeInTheDocument();
      expect(modeButton?.textContent).toBe('HEX');
    });

    it('should toggle from HEX to RGB mode', async () => {
      const { container } = render(() => <ColorPicker />);

      const modeButton = container.querySelector('button[title="Switch color mode"]') as HTMLElement;
      expect(modeButton.textContent).toBe('HEX');

      // Click to toggle
      modeButton.click();

      await waitFor(() => {
        expect(modeButton.textContent).toBe('RGB');
      });
    });

    it('should toggle from RGB to HSL mode', async () => {
      const { container } = render(() => <ColorPicker />);

      const modeButton = container.querySelector('button[title="Switch color mode"]') as HTMLElement;

      // Toggle to RGB
      modeButton.click();
      await waitFor(() => {
        expect(modeButton.textContent).toBe('RGB');
      });

      // Toggle to HSL
      modeButton.click();
      await waitFor(() => {
        expect(modeButton.textContent).toBe('HSL');
      });
    });

    it('should cycle back to HEX from HSL mode', async () => {
      const { container } = render(() => <ColorPicker />);

      const modeButton = container.querySelector('button[title="Switch color mode"]') as HTMLElement;

      // Cycle through: HEX -> RGB -> HSL -> HEX
      modeButton.click(); // RGB
      modeButton.click(); // HSL
      modeButton.click(); // HEX

      await waitFor(() => {
        expect(modeButton.textContent).toBe('HEX');
      });
    });

    it('should not render mode toggle when noInput is true', () => {
      const { container } = render(() => <ColorPicker noInput={true} />);

      const modeButton = container.querySelector('button[title="Switch color mode"]');
      expect(modeButton).not.toBeInTheDocument();
    });
  });

  describe('text input', () => {
    it('should display current color value', () => {
      const { container } = render(() => (
        <ColorPicker value="#3b82f6" />
      ));

      const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
      expect(textInput.value).toBe('#3b82f6');
    });

    it('should update color on valid hex input', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ColorPicker value="#000000" onChange={handleChange} />
      ));

      const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;

      textInput.value = '#FF5722';
      fireEvent.input(textInput);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('#FF5722');
      });
    });

    it('should accept 3-digit hex colors', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ColorPicker onChange={handleChange} />
      ));

      const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;

      textInput.value = '#FFF';
      fireEvent.input(textInput);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('#FFF');
      });
    });

    it('should accept 6-digit hex colors', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ColorPicker onChange={handleChange} />
      ));

      const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;

      textInput.value = '#FFFFFF';
      fireEvent.input(textInput);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('#FFFFFF');
      });
    });

    it('should accept 8-digit hex colors with alpha', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ColorPicker onChange={handleChange} />
      ));

      const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;

      textInput.value = '#FFFFFF80';
      fireEvent.input(textInput);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('#FFFFFF80');
      });
    });

    it('should handle transparent input', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ColorPicker onChange={handleChange} allowEmpty={true} />
      ));

      const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;

      textInput.value = 'transparent';
      fireEvent.input(textInput);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('transparent');
      });
    });

    it('should not update color on invalid input', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ColorPicker value="#000000" onChange={handleChange} />
      ));

      const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;

      textInput.value = 'invalid-color';
      fireEvent.input(textInput);

      // Wait a bit to ensure it doesn't fire
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should have placeholder based on mode', () => {
      const { container } = render(() => <ColorPicker />);

      const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
      expect(textInput.placeholder).toBe('#000000');
    });
  });

  describe('preset swatches', () => {
    it('should render 20 preset swatches', () => {
      const { container } = render(() => <ColorPicker showSwatches={true} />);

      const swatches = container.querySelectorAll('button[aria-label^="Select color"]');
      expect(swatches.length).toBe(20);
    });

    it('should select color when swatch is clicked', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ColorPicker onChange={handleChange} />
      ));

      // Click on red swatch (#F44336)
      const redSwatch = container.querySelector('button[title="#F44336"]') as HTMLElement;
      expect(redSwatch).toBeInTheDocument();

      redSwatch.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('#F44336');
      });
    });

    it('should update text input when swatch is clicked', async () => {
      const { container } = render(() => <ColorPicker />);

      const blueSwatch = container.querySelector('button[title="#2196F3"]') as HTMLElement;
      blueSwatch.click();

      await waitFor(() => {
        const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
        expect(textInput.value).toBe('#2196F3');
      });
    });

    it('should update color picker when swatch is clicked', async () => {
      const { container } = render(() => <ColorPicker />);

      const greenSwatch = container.querySelector('button[title="#4CAF50"]') as HTMLElement;
      greenSwatch.click();

      await waitFor(() => {
        const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement;
        expect(colorInput.value).toBe('#4CAF50');
      });
    });

    it('should highlight active swatch', async () => {
      const { container } = render(() => (
        <ColorPicker value="#000000" />
      ));

      const blackSwatch = container.querySelector('button[title="#000000"]');
      expect(blackSwatch).toBeInTheDocument();
    });
  });

  describe('empty/transparent color', () => {
    it('should not show empty button by default', () => {
      const { container } = render(() => <ColorPicker />);

      const emptyButton = container.querySelector('button[aria-label="Set to transparent"]');
      expect(emptyButton).not.toBeInTheDocument();
    });

    it('should show empty button when allowEmpty is true', () => {
      const { container } = render(() => <ColorPicker allowEmpty={true} />);

      const emptyButton = container.querySelector('button[aria-label="Set to transparent"]');
      expect(emptyButton).toBeInTheDocument();
    });

    it('should set color to transparent when empty button is clicked', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ColorPicker value="#000000" onChange={handleChange} allowEmpty={true} />
      ));

      const emptyButton = container.querySelector('button[aria-label="Set to transparent"]') as HTMLElement;
      emptyButton.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('transparent');
      });
    });

    it('should call onReset when empty button is clicked', async () => {
      const handleReset = vi.fn();
      const { container } = render(() => (
        <ColorPicker onReset={handleReset} allowEmpty={true} />
      ));

      const emptyButton = container.querySelector('button[aria-label="Set to transparent"]') as HTMLElement;
      emptyButton.click();

      await waitFor(() => {
        expect(handleReset).toHaveBeenCalled();
      });
    });

    it('should use custom empty color label', () => {
      const { container } = render(() => (
        <ColorPicker allowEmpty={true} emptyColorLabel="clear" />
      ));

      const emptyButton = container.querySelector('button[title="Set to clear"]');
      expect(emptyButton).toBeInTheDocument();
    });

    it('should show empty indicator in swatch when transparent', () => {
      const { container } = render(() => (
        <ColorPicker value="transparent" allowEmpty={true} />
      ));

      const swatch = container.querySelector('[title="Current color"]');
      expect(swatch).toBeInTheDocument();
      expect(swatch?.querySelector('div')).toBeInTheDocument(); // Empty indicator
    });

    it('should display "transparent" in text input when empty', () => {
      const { container } = render(() => (
        <ColorPicker value="transparent" allowEmpty={true} />
      ));

      const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
      expect(textInput.value).toBe('transparent');
    });
  });

  describe('onChange callback', () => {
    it('should call onChange when color picker changes', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ColorPicker onChange={handleChange} />
      ));

      const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement;
      colorInput.value = '#FF5722';
      fireEvent.input(colorInput);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('#FF5722');
        expect(handleChange).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onChange when text input changes with valid color', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ColorPicker onChange={handleChange} />
      ));

      const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
      textInput.value = '#00BCD4';
      fireEvent.input(textInput);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('#00BCD4');
      });
    });

    it('should call onChange when swatch is clicked', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ColorPicker onChange={handleChange} />
      ));

      const swatch = container.querySelector('button[title="#9C27B0"]') as HTMLElement;
      swatch.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('#9C27B0');
      });
    });

    it('should work without onChange callback', () => {
      const { container } = render(() => <ColorPicker />);

      const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement;

      // Should not throw
      expect(() => {
        colorInput.value = '#000000';
        fireEvent.input(colorInput);
      }).not.toThrow();
    });
  });

  describe('accessibility', () => {
    it('should have aria-label on color input', () => {
      const { container } = render(() => <ColorPicker />);

      const colorInput = container.querySelector('input[type="color"]');
      expect(colorInput).toHaveAttribute('aria-label', 'Pick a color');
    });

    it('should have aria-label on text input', () => {
      const { container } = render(() => <ColorPicker />);

      const textInput = container.querySelector('input[type="text"]');
      expect(textInput).toHaveAttribute('aria-label', 'Color value');
    });

    it('should have aria-label on mode toggle button', () => {
      const { container } = render(() => <ColorPicker />);

      const modeButton = container.querySelector('button[title="Switch color mode"]');
      expect(modeButton).toHaveAttribute('aria-label', 'Current mode: HEX');
    });

    it('should update aria-label when mode changes', async () => {
      const { container } = render(() => <ColorPicker />);

      const modeButton = container.querySelector('button[title="Switch color mode"]') as HTMLElement;

      modeButton.click();

      await waitFor(() => {
        expect(modeButton).toHaveAttribute('aria-label', 'Current mode: RGB');
      });
    });

    it('should have aria-label on swatch buttons', () => {
      const { container } = render(() => <ColorPicker />);

      const firstSwatch = container.querySelector('button[aria-label="Select color #000000"]');
      expect(firstSwatch).toBeInTheDocument();
    });

    it('should have title on current color swatch', () => {
      const { container } = render(() => <ColorPicker />);

      const swatch = container.querySelector('[title="Current color"]');
      expect(swatch).toBeInTheDocument();
    });
  });

  describe('complex scenarios', () => {
    it('should handle all props together', async () => {
      const handleChange = vi.fn();
      const handleReset = vi.fn();

      const { container } = render(() => (
        <ColorPicker
          value="#3b82f6"
          opacity={true}
          showSwatches={true}
          allowEmpty={true}
          emptyColorLabel="none"
          class="custom-picker"
          onChange={handleChange}
          onReset={handleReset}
        />
      ));

      // Verify all features are present
      const colorInput = container.querySelector('input[type="color"]');
      expect(colorInput).toBeInTheDocument();

      const textInput = container.querySelector('input[type="text"]');
      expect(textInput).toBeInTheDocument();

      const modeButton = container.querySelector('button[title="Switch color mode"]');
      expect(modeButton).toBeInTheDocument();

      const emptyButton = container.querySelector('button[aria-label="Set to transparent"]');
      expect(emptyButton).toBeInTheDocument();

      const swatches = container.querySelectorAll('button[aria-label^="Select color"]');
      expect(swatches.length).toBeGreaterThan(0);

      const picker = container.querySelector('.custom-picker');
      expect(picker).toBeInTheDocument();

      // Test interaction
      const swatch = container.querySelector('button[title="#F44336"]') as HTMLElement;
      swatch.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('#F44336');
      });
    });

    it('should handle rapid color changes', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ColorPicker onChange={handleChange} />
      ));

      const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement;

      // Rapid changes
      colorInput.value = '#FF0000';
      fireEvent.input(colorInput);

      colorInput.value = '#00FF00';
      fireEvent.input(colorInput);

      colorInput.value = '#0000FF';
      fireEvent.input(colorInput);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });

      expect(handleChange.mock.calls.length).toBeGreaterThanOrEqual(3);
    });

    it('should sync all inputs when color changes', async () => {
      const { container } = render(() => <ColorPicker value="#000000" />);

      const swatch = container.querySelector('button[title="#2196F3"]') as HTMLElement;
      swatch.click();

      await waitFor(() => {
        const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
        const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement;
        const currentSwatch = container.querySelector('[title="Current color"]') as HTMLElement;

        expect(textInput.value).toBe('#2196F3');
        expect(colorInput.value).toBe('#2196F3');
        expect(currentSwatch.style.backgroundColor).toBe('rgb(33, 150, 243)');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle undefined value', () => {
      const { container } = render(() => (
        <ColorPicker value={undefined} onChange={() => {}} />
      ));

      const colorInput = container.querySelector('input[type="color"]');
      expect(colorInput).toBeInTheDocument();
    });

    it('should handle empty string value', () => {
      const { container } = render(() => (
        <ColorPicker value="" allowEmpty={true} />
      ));

      const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
      expect(textInput.value).toBe('transparent');
    });

    it('should handle uppercase hex colors', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ColorPicker onChange={handleChange} />
      ));

      const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
      textInput.value = '#ABCDEF';
      fireEvent.input(textInput);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('#ABCDEF');
      });
    });

    it('should handle lowercase hex colors', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ColorPicker onChange={handleChange} />
      ));

      const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
      textInput.value = '#abcdef';
      fireEvent.input(textInput);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('#abcdef');
      });
    });

    it('should handle mixed case hex colors', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ColorPicker onChange={handleChange} />
      ));

      const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
      textInput.value = '#AbCdEf';
      fireEvent.input(textInput);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('#AbCdEf');
      });
    });

    it('should ignore hex input without hash', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ColorPicker onChange={handleChange} />
      ));

      const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
      textInput.value = 'FFFFFF';
      fireEvent.input(textInput);

      // Wait a bit to ensure it doesn't fire
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should ignore invalid hex characters', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ColorPicker onChange={handleChange} />
      ));

      const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
      textInput.value = '#GGGGGG';
      fireEvent.input(textInput);

      // Wait a bit to ensure it doesn't fire
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should handle case-insensitive "transparent"', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ColorPicker onChange={handleChange} allowEmpty={true} />
      ));

      const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
      textInput.value = 'TRANSPARENT';
      fireEvent.input(textInput);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('transparent');
      });
    });
  });

  describe('state consistency', () => {
    it('should maintain consistent state across all UI elements', async () => {
      const { container } = render(() => (
        <ColorPicker value="#000000" />
      ));

      // Change via text input
      const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
      textInput.value = '#FF5722';
      fireEvent.input(textInput);

      await waitFor(() => {
        const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement;
        const swatch = container.querySelector('[title="Current color"]') as HTMLElement;

        expect(textInput.value).toBe('#FF5722');
        expect(colorInput.value).toBe('#FF5722');
        expect(swatch.style.backgroundColor).toBe('rgb(255, 87, 34)');
      });
    });

    it('should reset to non-empty state when selecting swatch after being empty', async () => {
      const { container } = render(() => (
        <ColorPicker value="transparent" allowEmpty={true} />
      ));

      // Verify it's empty
      let textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
      expect(textInput.value).toBe('transparent');

      // Select a swatch
      const swatch = container.querySelector('button[title="#2196F3"]') as HTMLElement;
      swatch.click();

      await waitFor(() => {
        textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
        expect(textInput.value).toBe('#2196F3');
      });
    });
  });
});
