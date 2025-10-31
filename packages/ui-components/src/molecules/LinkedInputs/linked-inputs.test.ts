import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LinkedInputs } from './LinkedInputs';
import type { LinkedInputsOptions } from './linked-inputs.types';
import { InputNumber } from '../InputNumber/InputNumber';

describe('LinkedInputs', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('Initialization', () => {
    it('should create a linked inputs component with default options', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10, defaultUnit: 'px' } },
          { label: 'Right', input: { defaultValue: 10, defaultUnit: 'px' } },
        ],
      });

      const element = linkedInputs.getEl();
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.className).toContain('linked-inputs');
    });

    it('should create inputs from configurations', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10, defaultUnit: 'px' } },
          { label: 'Right', input: { defaultValue: 20, defaultUnit: 'px' } },
        ],
      });

      const inputs = linkedInputs.getInputs();
      expect(inputs).toHaveLength(2);
      expect(inputs[0]).toBeInstanceOf(InputNumber);
      expect(inputs[1]).toBeInstanceOf(InputNumber);
    });

    it('should accept existing InputNumber instances', () => {
      const input1 = new InputNumber({ defaultValue: 10, defaultUnit: 'px' });
      const input2 = new InputNumber({ defaultValue: 20, defaultUnit: 'px' });

      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: input1 },
          { label: 'Right', input: input2 },
        ],
      });

      const inputs = linkedInputs.getInputs();
      expect(inputs[0]).toBe(input1);
      expect(inputs[1]).toBe(input2);
    });

    it('should apply extended classes to wrapper', () => {
      const linkedInputs = new LinkedInputs({
        items: [{ label: 'Top', input: { defaultValue: 10 } }],
        extendedClasses: 'custom-class another-class',
      });

      const element = linkedInputs.getEl();
      expect(element.className).toContain('custom-class');
      expect(element.className).toContain('another-class');
    });

    it('should create items container', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 } },
          { label: 'Right', input: { defaultValue: 20 } },
        ],
      });

      const element = linkedInputs.getEl();
      const itemsContainer = element.querySelector('[class*="linked-inputs__items"]');
      expect(itemsContainer).toBeInstanceOf(HTMLElement);
    });

    it('should create link button', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 } },
          { label: 'Right', input: { defaultValue: 20 } },
        ],
      });

      const element = linkedInputs.getEl();
      const linkButton = element.querySelector('[data-testid="link-button"]');
      expect(linkButton).toBeInstanceOf(HTMLElement);
    });
  });

  describe('Link/Unlink Functionality', () => {
    it('should start unlinked by default', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 } },
          { label: 'Right', input: { defaultValue: 20 } },
        ],
      });

      expect(linkedInputs.isLinkedState()).toBe(false);
    });

    it('should start linked when startLinked is true', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 } },
          { label: 'Right', input: { defaultValue: 20 } },
        ],
        startLinked: true,
      });

      expect(linkedInputs.isLinkedState()).toBe(true);
    });

    it('should toggle linked state when link button is clicked', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 } },
          { label: 'Right', input: { defaultValue: 20 } },
        ],
      });

      const element = linkedInputs.getEl();
      const linkButton = element.querySelector('[data-testid="link-button"]') as HTMLButtonElement;

      expect(linkedInputs.isLinkedState()).toBe(false);

      linkButton.click();
      expect(linkedInputs.isLinkedState()).toBe(true);

      linkButton.click();
      expect(linkedInputs.isLinkedState()).toBe(false);
    });

    it('should add active class to link button when linked', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 } },
          { label: 'Right', input: { defaultValue: 20 } },
        ],
      });

      const element = linkedInputs.getEl();
      const linkButton = element.querySelector('[data-testid="link-button"]') as HTMLButtonElement;

      expect(linkButton.className).not.toContain('linked-inputs__link--active');

      linkButton.click();
      expect(linkButton.className).toContain('linked-inputs__link--active');

      linkButton.click();
      expect(linkButton.className).not.toContain('linked-inputs__link--active');
    });

    it('should call onLink callback when link state changes', () => {
      const onLink = vi.fn();

      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10, defaultUnit: 'px' } },
          { label: 'Right', input: { defaultValue: 20, defaultUnit: 'px' } },
        ],
        onLink,
      });

      const element = linkedInputs.getEl();
      const linkButton = element.querySelector('[data-testid="link-button"]') as HTMLButtonElement;

      linkButton.click();
      expect(onLink).toHaveBeenCalledTimes(1);
      expect(onLink).toHaveBeenCalledWith(linkedInputs, '10px');

      linkButton.click();
      expect(onLink).toHaveBeenCalledTimes(2);
    });

    it('should sync inputs when link button is clicked', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10, defaultUnit: 'px' } },
          { label: 'Right', input: { defaultValue: 20, defaultUnit: 'px' } },
          { label: 'Bottom', input: { defaultValue: 30, defaultUnit: 'px' } },
        ],
      });

      const element = linkedInputs.getEl();
      const linkButton = element.querySelector('[data-testid="link-button"]') as HTMLButtonElement;
      const inputs = linkedInputs.getInputs();

      // Initially different values
      expect(inputs[0].getInputValue()).toBe('10px');
      expect(inputs[1].getInputValue()).toBe('20px');
      expect(inputs[2].getInputValue()).toBe('30px');

      // Click link button
      linkButton.click();

      // All should sync to alpha input (first one by default)
      expect(inputs[0].getInputValue()).toBe('10px');
      expect(inputs[1].getInputValue()).toBe('10px');
      expect(inputs[2].getInputValue()).toBe('10px');
    });
  });

  describe('Input Synchronization', () => {
    it('should sync all inputs to alpha input when linked', async () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10, defaultUnit: 'px' } },
          { label: 'Right', input: { defaultValue: 10, defaultUnit: 'px' } },
          { label: 'Bottom', input: { defaultValue: 10, defaultUnit: 'px' } },
        ],
        startLinked: true,
      });

      const inputs = linkedInputs.getInputs();
      const alphaInput = linkedInputs.getAlphaInput();

      // Change alpha input value
      alphaInput.update('25px');

      // Wait for sync
      await new Promise((resolve) => setTimeout(resolve, 10));

      // All inputs should have the new value
      expect(inputs[0].getInputValue()).toBe('25px');
      expect(inputs[1].getInputValue()).toBe('25px');
      expect(inputs[2].getInputValue()).toBe('25px');
    });

    it('should not sync when unlinked', async () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10, defaultUnit: 'px' } },
          { label: 'Right', input: { defaultValue: 20, defaultUnit: 'px' } },
        ],
        startLinked: false,
      });

      const inputs = linkedInputs.getInputs();
      const alphaInput = linkedInputs.getAlphaInput();

      // Change alpha input value
      alphaInput.update('50px');

      // Wait
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Inputs should keep their own values
      expect(inputs[0].getInputValue()).toBe('50px');
      expect(inputs[1].getInputValue()).toBe('20px');
    });

    it('should not sync alpha input to itself', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10, defaultUnit: 'px' } },
          { label: 'Right', input: { defaultValue: 20, defaultUnit: 'px' } },
        ],
        startLinked: true,
      });

      const inputs = linkedInputs.getInputs();
      const alphaInput = linkedInputs.getAlphaInput();

      // Alpha input should be first input
      expect(alphaInput).toBe(inputs[0]);

      // Change alpha input
      alphaInput.update('99px');

      // Alpha input should have its own value
      expect(alphaInput.getInputValue()).toBe('99px');
    });
  });

  describe('Alpha Input', () => {
    it('should use first input as alpha input by default', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 } },
          { label: 'Right', input: { defaultValue: 20 } },
          { label: 'Bottom', input: { defaultValue: 30 } },
        ],
      });

      const inputs = linkedInputs.getInputs();
      const alphaInput = linkedInputs.getAlphaInput();

      expect(alphaInput).toBe(inputs[0]);
    });

    it('should use explicitly set alpha input', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 }, alphaInput: false },
          { label: 'Right', input: { defaultValue: 20 }, alphaInput: true },
          { label: 'Bottom', input: { defaultValue: 30 }, alphaInput: false },
        ],
      });

      const inputs = linkedInputs.getInputs();
      const alphaInput = linkedInputs.getAlphaInput();

      expect(alphaInput).toBe(inputs[1]);
    });

    it('should allow setting alpha input via setAlphaInput', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 } },
          { label: 'Right', input: { defaultValue: 20 } },
        ],
      });

      const inputs = linkedInputs.getInputs();

      // Initially first input
      expect(linkedInputs.getAlphaInput()).toBe(inputs[0]);

      // Set to second input
      linkedInputs.setAlphaInput(inputs[1]);
      expect(linkedInputs.getAlphaInput()).toBe(inputs[1]);
    });

    it('should disable auto alpha input when explicitly set', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 }, alphaInput: true },
          { label: 'Right', input: { defaultValue: 20 } },
        ],
        autoAlphaInput: true,
      });

      const inputs = linkedInputs.getInputs();
      const element = linkedInputs.getEl();

      // Alpha should be first input (explicitly set)
      expect(linkedInputs.getAlphaInput()).toBe(inputs[0]);

      // Trigger change on second input
      const secondInputEl = inputs[1].getElement().querySelector('input') as HTMLInputElement;
      secondInputEl.value = '99';
      secondInputEl.dispatchEvent(new Event('input'));

      // Alpha should still be first input (auto disabled)
      expect(linkedInputs.getAlphaInput()).toBe(inputs[0]);
    });

    it('should sync to new alpha input when setAlphaInput is called and linked', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10, defaultUnit: 'px' } },
          { label: 'Right', input: { defaultValue: 20, defaultUnit: 'px' } },
        ],
        startLinked: true,
      });

      const inputs = linkedInputs.getInputs();

      // Change second input value
      inputs[1].update('50px');

      // Set second input as alpha
      linkedInputs.setAlphaInput(inputs[1]);

      // All should sync to new alpha
      expect(inputs[0].getInputValue()).toBe('50px');
      expect(inputs[1].getInputValue()).toBe('50px');
    });
  });

  describe('Auto Alpha Input', () => {
    it('should be enabled by default', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 } },
          { label: 'Right', input: { defaultValue: 20 } },
        ],
      });

      // This is tested through behavior, not a direct property
      // We'll test the behavior in the next test
      expect(linkedInputs.getAlphaInput()).toBeInstanceOf(InputNumber);
    });

    it('should update alpha input based on user interaction', async () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10, defaultUnit: 'px' } },
          { label: 'Right', input: { defaultValue: 20, defaultUnit: 'px' } },
        ],
        startLinked: true,
        autoAlphaInput: true,
      });

      const inputs = linkedInputs.getInputs();

      // Initially first input is alpha
      expect(linkedInputs.getAlphaInput()).toBe(inputs[0]);

      // Simulate user input on second input
      const secondInputEl = inputs[1].getElement().querySelector('input') as HTMLInputElement;
      secondInputEl.value = '50';
      secondInputEl.dispatchEvent(new Event('input'));

      // Wait for sync
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Alpha should now be second input
      expect(linkedInputs.getAlphaInput()).toBe(inputs[1]);
    });

    it('should be disabled when set to false', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 } },
          { label: 'Right', input: { defaultValue: 20 } },
        ],
        autoAlphaInput: false,
      });

      const inputs = linkedInputs.getInputs();

      // Alpha should be first input
      expect(linkedInputs.getAlphaInput()).toBe(inputs[0]);

      // Even after user interaction, should stay first input
      const secondInputEl = inputs[1].getElement().querySelector('input') as HTMLInputElement;
      secondInputEl.value = '99';
      secondInputEl.dispatchEvent(new Event('input'));

      expect(linkedInputs.getAlphaInput()).toBe(inputs[0]);
    });
  });

  describe('Labels', () => {
    it('should wrap inputs with labels by default', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 } },
          { label: 'Right', input: { defaultValue: 20 } },
        ],
      });

      const element = linkedInputs.getEl();
      const labels = element.querySelectorAll('[class*="linked-inputs__label"]');

      expect(labels.length).toBeGreaterThan(0);
    });

    it('should not wrap inputs when useLabels is false', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 } },
          { label: 'Right', input: { defaultValue: 20 } },
        ],
        useLabels: false,
      });

      const element = linkedInputs.getEl();

      // Should have input elements directly
      const inputNumberEls = element.querySelectorAll('[class*="input-number"]');
      expect(inputNumberEls.length).toBeGreaterThan(0);
    });

    it('should apply label classes', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 } },
        ],
        useLabels: true,
      });

      const element = linkedInputs.getEl();
      const label = element.querySelector('[class*="linked-inputs__label"]');

      expect(label).toBeInstanceOf(HTMLElement);
    });
  });

  describe('Public API', () => {
    it('should return element via getEl', () => {
      const linkedInputs = new LinkedInputs({
        items: [{ label: 'Top', input: { defaultValue: 10 } }],
      });

      const element = linkedInputs.getEl();
      expect(element).toBeInstanceOf(HTMLDivElement);
    });

    it('should return all inputs via getInputs', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 } },
          { label: 'Right', input: { defaultValue: 20 } },
          { label: 'Bottom', input: { defaultValue: 30 } },
        ],
      });

      const inputs = linkedInputs.getInputs();
      expect(inputs).toHaveLength(3);
      inputs.forEach((input) => {
        expect(input).toBeInstanceOf(InputNumber);
      });
    });

    it('should return link state via isLinkedState', () => {
      const linkedInputs = new LinkedInputs({
        items: [{ label: 'Top', input: { defaultValue: 10 } }],
        startLinked: false,
      });

      expect(linkedInputs.isLinkedState()).toBe(false);

      const element = linkedInputs.getEl();
      const linkButton = element.querySelector('[data-testid="link-button"]') as HTMLButtonElement;
      linkButton.click();

      expect(linkedInputs.isLinkedState()).toBe(true);
    });

    it('should set link state via setLinked', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10, defaultUnit: 'px' } },
          { label: 'Right', input: { defaultValue: 20, defaultUnit: 'px' } },
        ],
        startLinked: false,
      });

      expect(linkedInputs.isLinkedState()).toBe(false);

      linkedInputs.setLinked(true);
      expect(linkedInputs.isLinkedState()).toBe(true);

      // Should sync inputs
      const inputs = linkedInputs.getInputs();
      expect(inputs[0].getInputValue()).toBe('10px');
      expect(inputs[1].getInputValue()).toBe('10px');
    });

    it('should not toggle if already in desired state', () => {
      const linkedInputs = new LinkedInputs({
        items: [{ label: 'Top', input: { defaultValue: 10 } }],
        startLinked: true,
      });

      expect(linkedInputs.isLinkedState()).toBe(true);

      linkedInputs.setLinked(true);
      expect(linkedInputs.isLinkedState()).toBe(true);
    });

    it('should return alpha input via getAlphaInput', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 } },
          { label: 'Right', input: { defaultValue: 20 } },
        ],
      });

      const alphaInput = linkedInputs.getAlphaInput();
      expect(alphaInput).toBeInstanceOf(InputNumber);
    });

    it('should only set alpha input if it exists in items', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 } },
          { label: 'Right', input: { defaultValue: 20 } },
        ],
      });

      const inputs = linkedInputs.getInputs();
      const externalInput = new InputNumber({ defaultValue: 99 });

      // Set to valid input
      linkedInputs.setAlphaInput(inputs[1]);
      expect(linkedInputs.getAlphaInput()).toBe(inputs[1]);

      // Try to set to external input (should not change)
      linkedInputs.setAlphaInput(externalInput);
      expect(linkedInputs.getAlphaInput()).toBe(inputs[1]); // Still inputs[1]
    });
  });

  describe('Custom Icons', () => {
    it('should accept custom link icon as string', () => {
      const customIcon = '<svg>icon</svg>';

      const linkedInputs = new LinkedInputs({
        items: [{ label: 'Top', input: { defaultValue: 10 } }],
        linkIcon: customIcon,
      });

      const element = linkedInputs.getEl();
      const linkButton = element.querySelector('[data-testid="link-button"]') as HTMLButtonElement;

      expect(linkButton.innerHTML).toContain('svg');
    });

    it('should accept custom link icon as HTMLElement', () => {
      const customIcon = document.createElement('span');
      customIcon.textContent = '🔗';

      const linkedInputs = new LinkedInputs({
        items: [{ label: 'Top', input: { defaultValue: 10 } }],
        linkIcon: customIcon,
      });

      const element = linkedInputs.getEl();
      const linkButton = element.querySelector('[data-testid="link-button"]') as HTMLButtonElement;

      expect(linkButton.innerHTML).toContain('🔗');
    });
  });

  describe('Destroy', () => {
    it('should clean up and remove element', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 } },
          { label: 'Right', input: { defaultValue: 20 } },
        ],
      });

      const element = linkedInputs.getEl();
      container.appendChild(element);

      expect(container.contains(element)).toBe(true);

      linkedInputs.destroy();

      expect(container.contains(element)).toBe(false);
    });

    it('should destroy all child components', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'Top', input: { defaultValue: 10 } },
          { label: 'Right', input: { defaultValue: 20 } },
        ],
      });

      const inputs = linkedInputs.getInputs();
      const destroySpy1 = vi.spyOn(inputs[0], 'destroy');
      const destroySpy2 = vi.spyOn(inputs[1], 'destroy');

      linkedInputs.destroy();

      expect(destroySpy1).toHaveBeenCalled();
      expect(destroySpy2).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      const linkedInputs = new LinkedInputs({
        items: [],
      });

      const element = linkedInputs.getEl();
      expect(element).toBeInstanceOf(HTMLElement);

      const inputs = linkedInputs.getInputs();
      expect(inputs).toHaveLength(0);
    });

    it('should handle single item', () => {
      const linkedInputs = new LinkedInputs({
        items: [{ label: 'Single', input: { defaultValue: 42, defaultUnit: 'px' } }],
      });

      const inputs = linkedInputs.getInputs();
      expect(inputs).toHaveLength(1);

      const alphaInput = linkedInputs.getAlphaInput();
      expect(alphaInput).toBe(inputs[0]);
    });

    it('should handle multiple items with same value', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'A', input: { defaultValue: 10, defaultUnit: 'px' } },
          { label: 'B', input: { defaultValue: 10, defaultUnit: 'px' } },
          { label: 'C', input: { defaultValue: 10, defaultUnit: 'px' } },
        ],
        startLinked: true,
      });

      const inputs = linkedInputs.getInputs();
      inputs.forEach((input) => {
        expect(input.getInputValue()).toBe('10px');
      });
    });

    it('should handle items without labels', () => {
      const linkedInputs = new LinkedInputs({
        items: [
          { input: { defaultValue: 10 } },
          { input: { defaultValue: 20 } },
        ],
      });

      const element = linkedInputs.getEl();
      expect(element).toBeInstanceOf(HTMLElement);

      const inputs = linkedInputs.getInputs();
      expect(inputs).toHaveLength(2);
    });

    it('should handle mixed item configurations', () => {
      const existingInput = new InputNumber({ defaultValue: 99, defaultUnit: 'px' });

      const linkedInputs = new LinkedInputs({
        items: [
          { label: 'New', input: { defaultValue: 10, defaultUnit: 'px' } },
          { label: 'Existing', input: existingInput },
        ],
      });

      const inputs = linkedInputs.getInputs();
      expect(inputs).toHaveLength(2);
      expect(inputs[1]).toBe(existingInput);
    });
  });
});
