/**
 * VisualFeedbackManager Integration Tests
 *
 * End-to-end tests for the complete visual feedback system integration
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VisualFeedbackManager, createVisualFeedbackManager } from './VisualFeedbackManager';
import { getPropertyMappingRegistry } from './PropertyMappingRegistry';
import type {
  PropertyHoverEvent,
  PropertyEditEvent,
  PropertyChangeEvent,
} from './visual-feedback.types';

describe('VisualFeedbackManager - Integration Tests', () => {
  let canvasElement: HTMLElement;
  let manager: VisualFeedbackManager;
  let registry: ReturnType<typeof getPropertyMappingRegistry>;

  beforeEach(() => {
    // Setup canvas with multiple components
    canvasElement = document.createElement('div');
    canvasElement.id = 'canvas';
    canvasElement.style.width = '800px';
    canvasElement.style.height = '600px';
    document.body.appendChild(canvasElement);

    // Create button component
    const button = document.createElement('button');
    button.setAttribute('data-component-id', 'button-1');
    button.textContent = 'Click Me';
    button.style.padding = '16px 32px';
    button.style.backgroundColor = '#3b82f6';
    button.style.color = '#ffffff';
    canvasElement.appendChild(button);

    // Create text component
    const text = document.createElement('div');
    text.setAttribute('data-component-id', 'text-1');
    text.textContent = 'Sample Text';
    text.style.fontSize = '16px';
    text.style.margin = '20px';
    canvasElement.appendChild(text);

    // Initialize manager and registry
    manager = createVisualFeedbackManager(canvasElement);
    registry = getPropertyMappingRegistry();
  });

  afterEach(() => {
    manager.destroy();
    document.body.removeChild(canvasElement);
  });

  describe('Complete User Workflow', () => {
    it('should handle complete hover -> edit -> change workflow', () => {
      const buttonElement = canvasElement.querySelector('[data-component-id="button-1"]') as HTMLElement;
      expect(buttonElement).toBeTruthy();

      const mapping = registry.getMapping('button', 'styles.padding');
      if (!mapping) return;

      // Step 1: Hover over padding property
      const hoverEvent: PropertyHoverEvent = {
        propertyPath: 'styles.padding',
        componentId: 'button-1',
        mapping,
        mode: 'hover',
        currentValue: '16px 32px',
      };

      expect(() => manager.handlePropertyHover(hoverEvent)).not.toThrow();

      // Step 2: Start editing
      const editStartEvent: PropertyEditEvent = {
        propertyPath: 'styles.padding',
        componentId: 'button-1',
        oldValue: undefined,
        newValue: '16px 32px',
        mapping,
      };

      expect(() => manager.handlePropertyEdit(editStartEvent)).not.toThrow();

      // Step 3: Change value (animation)
      const changeEvent: PropertyChangeEvent = {
        componentId: 'button-1',
        propertyPath: 'styles.padding',
        oldValue: '16px 32px',
        newValue: '24px 48px',
        propertyType: 'spacing',
      };

      expect(() => manager.handlePropertyChange(changeEvent)).not.toThrow();

      // Step 4: Unhover
      const unhoverEvent: PropertyHoverEvent = {
        ...hoverEvent,
        mode: 'off',
      };

      expect(() => manager.handlePropertyHover(unhoverEvent)).not.toThrow();
    });

    it('should handle rapid property changes', () => {
      const properties = ['padding', 'margin'];
      const componentId = 'button-1';

      properties.forEach((prop) => {
        const mapping = registry.getMapping('button', `styles.${prop}`);
        if (mapping) {
          const hoverEvent: PropertyHoverEvent = {
            propertyPath: `styles.${prop}`,
            componentId,
            mapping,
            mode: 'hover',
            currentValue: '20px',
          };

          expect(() => manager.handlePropertyHover(hoverEvent)).not.toThrow();
        }
      });

      expect(() => manager.clearAllOverlays()).not.toThrow();
    });
  });

  describe('Property Type Coverage', () => {
    it('should handle spacing properties', () => {
      const spacingProps = ['padding', 'margin'];

      spacingProps.forEach((prop) => {
        const changeEvent: PropertyChangeEvent = {
          componentId: 'button-1',
          propertyPath: `styles.${prop}`,
          oldValue: '16px',
          newValue: '24px',
          propertyType: 'spacing',
        };

        expect(() => manager.handlePropertyChange(changeEvent)).not.toThrow();
      });
    });

    it('should handle color properties', () => {
      const colorProps = ['color', 'background-color'];

      colorProps.forEach((prop) => {
        const changeEvent: PropertyChangeEvent = {
          componentId: 'button-1',
          propertyPath: `styles.${prop}`,
          oldValue: '#FF0000',
          newValue: '#00FF00',
          propertyType: 'color',
        };

        expect(() => manager.handlePropertyChange(changeEvent)).not.toThrow();
      });
    });

    it('should handle typography properties', () => {
      const typographyProps = ['font-size', 'font-weight'];

      typographyProps.forEach((prop) => {
        const changeEvent: PropertyChangeEvent = {
          componentId: 'text-1',
          propertyPath: `styles.${prop}`,
          oldValue: '16px',
          newValue: '18px',
          propertyType: 'typography',
        };

        expect(() => manager.handlePropertyChange(changeEvent)).not.toThrow();
      });
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle building a button from scratch', () => {
      const componentId = 'button-1';
      const steps = [
        { property: 'padding', value: '16px 32px', type: 'spacing' },
        { property: 'background-color', value: '#3b82f6', type: 'color' },
        { property: 'color', value: '#ffffff', type: 'color' },
        { property: 'font-size', value: '16px', type: 'typography' },
      ];

      steps.forEach(({ property, type }) => {
        manager.handlePropertyChange({
          componentId,
          propertyPath: `styles.${property}`,
          oldValue: null,
          newValue: '16px',
          propertyType: type as any,
        });
      });

      expect(manager.isEnabled()).toBe(true);
    });

    it('should handle theme switching', () => {
      const componentId = 'button-1';
      const lightTheme = { 'background-color': '#ffffff', 'color': '#000000' };
      const darkTheme = { 'background-color': '#1f2937', 'color': '#ffffff' };

      // Apply light theme
      Object.entries(lightTheme).forEach(([property, value]) => {
        manager.handlePropertyChange({
          componentId,
          propertyPath: `styles.${property}`,
          oldValue: null,
          newValue: value,
          propertyType: 'color',
        });
      });

      // Switch to dark theme
      Object.entries(darkTheme).forEach(([property, value]) => {
        manager.handlePropertyChange({
          componentId,
          propertyPath: `styles.${property}`,
          oldValue: lightTheme[property as keyof typeof lightTheme],
          newValue: value,
          propertyType: 'color',
        });
      });

      expect(manager.isEnabled()).toBe(true);
    });
  });

  describe('Error Recovery', () => {
    it('should recover from missing component gracefully', () => {
      const changeEvent: PropertyChangeEvent = {
        componentId: 'non-existent-component',
        propertyPath: 'styles.padding',
        oldValue: '16px',
        newValue: '24px',
        propertyType: 'spacing',
      };

      expect(() => manager.handlePropertyChange(changeEvent)).not.toThrow();
      expect(manager.isEnabled()).toBe(true);
    });

    it('should handle invalid property values', () => {
      const invalidValues = [null, undefined, ''];

      invalidValues.forEach((value) => {
        const changeEvent: PropertyChangeEvent = {
          componentId: 'button-1',
          propertyPath: 'styles.padding',
          oldValue: '16px',
          newValue: value,
          propertyType: 'spacing',
        };

        expect(() => manager.handlePropertyChange(changeEvent)).not.toThrow();
      });
    });

    it('should continue working after system disable/enable', () => {
      manager.setEnabled(false);
      expect(manager.isEnabled()).toBe(false);

      manager.handlePropertyChange({
        componentId: 'button-1',
        propertyPath: 'styles.padding',
        oldValue: '16px',
        newValue: '24px',
        propertyType: 'spacing',
      });

      manager.setEnabled(true);
      expect(manager.isEnabled()).toBe(true);

      expect(() => {
        manager.handlePropertyChange({
          componentId: 'button-1',
          propertyPath: 'styles.padding',
          oldValue: '24px',
          newValue: '32px',
          propertyType: 'spacing',
        });
      }).not.toThrow();
    });
  });

  describe('Performance Under Load', () => {
    it('should handle multiple rapid property changes', () => {
      const iterations = 50;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        manager.handlePropertyChange({
          componentId: 'button-1',
          propertyPath: 'styles.padding',
          oldValue: `${i}px`,
          newValue: `${i + 1}px`,
          propertyType: 'spacing',
        });
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000);
    });
  });

  describe('State Consistency', () => {
    it('should maintain consistent state across operations', () => {
      const initialEnabled = manager.isEnabled();
      expect(initialEnabled).toBe(true);

      const mapping = registry.getMapping('button', 'styles.padding');
      if (!mapping) return;

      manager.handlePropertyHover({
        propertyPath: 'styles.padding',
        componentId: 'button-1',
        mapping,
        mode: 'hover',
        currentValue: '16px',
      });

      expect(manager.isEnabled()).toBe(initialEnabled);

      manager.handlePropertyChange({
        componentId: 'button-1',
        propertyPath: 'styles.padding',
        oldValue: '16px',
        newValue: '24px',
        propertyType: 'spacing',
      });

      expect(manager.isEnabled()).toBe(initialEnabled);
    });

    it('should preserve config after operations', () => {
      const initialConfig = manager.getConfig();

      manager.handlePropertyChange({
        componentId: 'button-1',
        propertyPath: 'styles.padding',
        oldValue: '16px',
        newValue: '24px',
        propertyType: 'spacing',
      });

      const afterConfig = manager.getConfig();

      expect(afterConfig.enabled).toBe(initialConfig.enabled);
      expect(afterConfig.animations.enabled).toBe(initialConfig.animations.enabled);
      expect(afterConfig.highlights.enabled).toBe(initialConfig.highlights.enabled);
    });
  });
});
