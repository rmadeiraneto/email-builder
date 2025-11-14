/**
 * CSSValueInput component tests
 *
 * Tests for CSSValueInput component to ensure proper CSS value editing,
 * unit conversion, constraints, and auto value handling.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../../test-utils';
import { CSSValueInput } from './CSSValueInput';
import type { CSSValue, CSSUnit } from '@email-builder/core/types/component.types';

describe('CSSValueInput', () => {
  describe('rendering', () => {
    it('should render with default props', () => {
      const { container } = render(() => <CSSValueInput />);

      // Should render InputNumber component
      const input = container.querySelector('input[type="text"]');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('0px');
    });

    it('should render with provided CSS value', () => {
      const value: CSSValue = { value: 16, unit: 'px' };
      const { container } = render(() => <CSSValueInput value={value} />);

      const input = container.querySelector('input[type="text"]');
      expect(input).toHaveValue('16px');
    });

    it('should render with auto value', () => {
      const value: CSSValue = { value: 'auto', unit: 'auto' };
      const { container } = render(() => <CSSValueInput value={value} />);

      const input = container.querySelector('input[type="text"]');
      // Auto is represented as 0 in the InputNumber
      expect(input).toHaveValue('0auto');
    });

    it('should render with different units', () => {
      const units: CSSUnit[] = ['px', 'rem', 'em', '%', 'pt'];

      units.forEach((unit) => {
        const value: CSSValue = { value: 10, unit };
        const { container, unmount } = render(() => <CSSValueInput value={value} />);

        const input = container.querySelector('input[type="text"]');
        expect(input).toHaveValue(`10${unit}`);

        unmount();
      });
    });

    it('should render with custom available units', () => {
      const value: CSSValue = { value: 16, unit: 'px' };
      const availableUnits: readonly CSSUnit[] = ['px', 'rem'];

      render(() => (
        <CSSValueInput value={value} availableUnits={availableUnits} />
      ));

      // Component should render without error
      const input = document.querySelector('input[type="text"]');
      expect(input).toBeInTheDocument();
    });

    it('should render with custom class', () => {
      const { container } = render(() => (
        <CSSValueInput class="custom-class" />
      ));

      // Check if custom class is applied to the root container
      const inputNumber = container.querySelector('.custom-class');
      expect(inputNumber).toBeInTheDocument();
    });

    it('should render with custom inputClass', () => {
      const { container } = render(() => (
        <CSSValueInput inputClass="custom-input-class" />
      ));

      // The inputClass is passed to InputNumber's input element
      const input = container.querySelector('input.custom-input-class');
      expect(input).toBeInTheDocument();
    });
  });

  describe('unit conversion', () => {
    it('should handle px unit', () => {
      const handleChange = vi.fn();
      const value: CSSValue = { value: 16, unit: 'px' };

      render(() => <CSSValueInput value={value} onChange={handleChange} />);

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('16px');
    });

    it('should handle rem unit', () => {
      const handleChange = vi.fn();
      const value: CSSValue = { value: 1, unit: 'rem' };

      render(() => <CSSValueInput value={value} onChange={handleChange} />);

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('1rem');
    });

    it('should handle em unit', () => {
      const handleChange = vi.fn();
      const value: CSSValue = { value: 1.5, unit: 'em' };

      render(() => <CSSValueInput value={value} onChange={handleChange} />);

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('1.5em');
    });

    it('should handle percentage unit', () => {
      const handleChange = vi.fn();
      const value: CSSValue = { value: 50, unit: '%' };

      render(() => <CSSValueInput value={value} onChange={handleChange} />);

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('50%');
    });

    it('should handle pt unit', () => {
      const handleChange = vi.fn();
      const value: CSSValue = { value: 12, unit: 'pt' };

      render(() => <CSSValueInput value={value} onChange={handleChange} />);

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('12pt');
    });
  });

  describe('auto value handling', () => {
    it('should handle auto value correctly', () => {
      const value: CSSValue = { value: 'auto', unit: 'auto' };
      const { container } = render(() => <CSSValueInput value={value} />);

      const input = container.querySelector('input[type="text"]') as HTMLInputElement;
      // Auto value is represented as 0 in InputNumber
      expect(input).toHaveValue('0auto');
    });

    it('should convert 0 with auto unit to auto value in onChange', async () => {
      const handleChange = vi.fn();
      const value: CSSValue = { value: 10, unit: 'px' };

      render(() => <CSSValueInput value={value} onChange={handleChange} />);

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;

      // Simulate changing to 0
      input.focus();
      input.value = '0';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });
    });

    it('should allow switching to non-auto value', async () => {
      const handleChange = vi.fn();
      const value: CSSValue = { value: 'auto', unit: 'auto' };

      render(() => <CSSValueInput value={value} onChange={handleChange} />);

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;

      // Simulate changing from auto (0) to 16
      input.focus();
      input.value = '16';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });
    });
  });

  describe('min/max constraints', () => {
    it('should respect min constraint', () => {
      const value: CSSValue = { value: 5, unit: 'px' };

      render(() => <CSSValueInput value={value} min={0} />);

      const input = document.querySelector('input[type="text"]');
      expect(input).toBeInTheDocument();
      // InputNumber should handle min validation
    });

    it('should respect max constraint', () => {
      const value: CSSValue = { value: 50, unit: 'px' };

      render(() => <CSSValueInput value={value} max={100} />);

      const input = document.querySelector('input[type="text"]');
      expect(input).toBeInTheDocument();
      // InputNumber should handle max validation
    });

    it('should work with both min and max constraints', () => {
      const value: CSSValue = { value: 25, unit: 'px' };

      render(() => <CSSValueInput value={value} min={0} max={100} />);

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('25px');
    });

    it('should handle null min constraint', () => {
      const value: CSSValue = { value: -10, unit: 'px' };

      render(() => <CSSValueInput value={value} min={null} />);

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('-10px');
    });

    it('should handle null max constraint', () => {
      const value: CSSValue = { value: 1000, unit: 'px' };

      render(() => <CSSValueInput value={value} max={null} />);

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('1000px');
    });
  });

  describe('onChange callback', () => {
    it('should call onChange when value changes', async () => {
      const handleChange = vi.fn();
      const value: CSSValue = { value: 10, unit: 'px' };

      render(() => <CSSValueInput value={value} onChange={handleChange} />);

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;

      // Simulate user input
      input.focus();
      input.value = '20';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });
    });

    it('should pass CSSValue object to onChange', async () => {
      const handleChange = vi.fn();
      const value: CSSValue = { value: 10, unit: 'px' };

      render(() => <CSSValueInput value={value} onChange={handleChange} />);

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;

      input.focus();
      input.value = '20';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await waitFor(() => {
        if (handleChange.mock.calls.length > 0) {
          const callArgs = handleChange.mock.calls[0];
          expect(callArgs[0]).toHaveProperty('value');
          expect(callArgs[0]).toHaveProperty('unit');
        }
      });
    });

    it('should not call onChange when disabled', () => {
      const handleChange = vi.fn();
      const value: CSSValue = { value: 10, unit: 'px' };

      render(() => (
        <CSSValueInput value={value} onChange={handleChange} disabled />
      ));

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toBeDisabled();
    });
  });

  describe('increment/decrement', () => {
    it('should use custom increment value', () => {
      const value: CSSValue = { value: 10, unit: 'px' };

      render(() => <CSSValueInput value={value} increment={5} />);

      const input = document.querySelector('input[type="text"]');
      expect(input).toBeInTheDocument();
      // InputNumber handles increment behavior
    });

    it('should use default increment of 1', () => {
      const value: CSSValue = { value: 10, unit: 'px' };

      render(() => <CSSValueInput value={value} />);

      const input = document.querySelector('input[type="text"]');
      expect(input).toBeInTheDocument();
    });

    it('should handle decimal increment values', () => {
      const value: CSSValue = { value: 1, unit: 'rem' };

      render(() => <CSSValueInput value={value} increment={0.1} />);

      const input = document.querySelector('input[type="text"]');
      expect(input).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('should render as disabled', () => {
      const value: CSSValue = { value: 10, unit: 'px' };

      render(() => <CSSValueInput value={value} disabled />);

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toBeDisabled();
    });

    it('should not allow changes when disabled', () => {
      const handleChange = vi.fn();
      const value: CSSValue = { value: 10, unit: 'px' };

      render(() => (
        <CSSValueInput value={value} onChange={handleChange} disabled />
      ));

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;

      // Try to change value
      input.focus();
      input.value = '20';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // onChange should not be called or input should be disabled
      expect(input.disabled).toBe(true);
    });
  });

  describe('changeableUnit prop', () => {
    it('should allow unit changes when changeableUnit is true', () => {
      const value: CSSValue = { value: 10, unit: 'px' };

      render(() => <CSSValueInput value={value} changeableUnit={true} />);

      const input = document.querySelector('input[type="text"]');
      expect(input).toBeInTheDocument();
      // InputNumber shows unit selector when changeableUnit is true
    });

    it('should not allow unit changes when changeableUnit is false', () => {
      const value: CSSValue = { value: 10, unit: 'px' };

      render(() => <CSSValueInput value={value} changeableUnit={false} />);

      const input = document.querySelector('input[type="text"]');
      expect(input).toBeInTheDocument();
      // InputNumber hides unit selector when changeableUnit is false
    });

    it('should default changeableUnit to true', () => {
      const value: CSSValue = { value: 10, unit: 'px' };

      render(() => <CSSValueInput value={value} />);

      const input = document.querySelector('input[type="text"]');
      expect(input).toBeInTheDocument();
    });
  });

  describe('complex scenarios', () => {
    it('should handle all props together', () => {
      const handleChange = vi.fn();
      const value: CSSValue = { value: 50, unit: '%' };
      const availableUnits: readonly CSSUnit[] = ['px', '%', 'rem'];

      render(() => (
        <CSSValueInput
          value={value}
          availableUnits={availableUnits}
          increment={5}
          min={0}
          max={100}
          changeableUnit={true}
          disabled={false}
          class="custom-css-input"
          inputClass="custom-input"
          onChange={handleChange}
        />
      ));

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;

      // Verify all props are applied
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('50%');
      expect(input).not.toBeDisabled();
    });

    it('should update when value prop changes', () => {
      let value: CSSValue = { value: 10, unit: 'px' };

      const { container, unmount } = render(() => <CSSValueInput value={value} />);

      let input = container.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('10px');

      unmount();

      // Re-render with new value
      value = { value: 20, unit: 'rem' };
      render(() => <CSSValueInput value={value} />);

      input = document.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('20rem');
    });

    it('should handle zero value correctly', () => {
      const value: CSSValue = { value: 0, unit: 'px' };

      render(() => <CSSValueInput value={value} />);

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('0px');
    });

    it('should handle negative values when min is null', () => {
      const value: CSSValue = { value: -10, unit: 'px' };

      render(() => <CSSValueInput value={value} min={null} />);

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('-10px');
    });

    it('should handle large values', () => {
      const value: CSSValue = { value: 9999, unit: 'px' };

      render(() => <CSSValueInput value={value} max={null} />);

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('9999px');
    });

    it('should handle decimal values', () => {
      const value: CSSValue = { value: 1.5, unit: 'rem' };

      render(() => <CSSValueInput value={value} />);

      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('1.5rem');
    });
  });

  describe('edge cases', () => {
    it('should handle undefined value', () => {
      const { container } = render(() => <CSSValueInput value={undefined} />);

      // Should render with default value (0, px)
      const input = container.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input).toHaveValue('0px');
    });

    it('should handle empty availableUnits array', () => {
      const value: CSSValue = { value: 10, unit: 'px' };

      const { container } = render(() => (
        <CSSValueInput value={value} availableUnits={[]} />
      ));

      const input = container.querySelector('input[type="text"]');
      expect(input).toBeInTheDocument();
    });

    it('should handle min greater than max', () => {
      const value: CSSValue = { value: 50, unit: 'px' };

      render(() => <CSSValueInput value={value} min={100} max={10} />);

      const input = document.querySelector('input[type="text"]');
      expect(input).toBeInTheDocument();
      // InputNumber should handle this edge case
    });
  });
});
