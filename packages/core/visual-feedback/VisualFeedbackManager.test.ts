/**
 * VisualFeedbackManager Unit Tests
 *
 * Comprehensive test suite for the VisualFeedbackManager orchestrator
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VisualFeedbackManager, createVisualFeedbackManager } from './VisualFeedbackManager';
import { DEFAULT_VISUAL_FEEDBACK_CONFIG } from './visual-feedback.types';
import type {
  VisualFeedbackConfig,
  PropertyHoverEvent,
  PropertyEditEvent,
  PropertyChangeEvent,
  PropertyVisualMapping,
} from './visual-feedback.types';

describe('VisualFeedbackManager', () => {
  let canvasElement: HTMLElement;
  let manager: VisualFeedbackManager;
  let config: VisualFeedbackConfig;

  beforeEach(() => {
    // Create a mock canvas element
    canvasElement = document.createElement('div');
    canvasElement.id = 'test-canvas';
    document.body.appendChild(canvasElement);

    // Create component element for testing
    const componentElement = document.createElement('div');
    componentElement.setAttribute('data-component-id', 'test-component-1');
    componentElement.style.width = '200px';
    componentElement.style.height = '100px';
    componentElement.style.padding = '10px';
    canvasElement.appendChild(componentElement);

    // Use default config
    config = { ...DEFAULT_VISUAL_FEEDBACK_CONFIG };

    // Create manager instance
    manager = new VisualFeedbackManager({
      config,
      canvasElement,
    });
  });

  afterEach(() => {
    // Cleanup
    manager.destroy();
    document.body.removeChild(canvasElement);
  });

  describe('Constructor and Initialization', () => {
    it('should create manager instance with default config', () => {
      expect(manager).toBeDefined();
      expect(manager.isEnabled()).toBe(true);
    });

    it('should create manager via factory function', () => {
      const factoryManager = createVisualFeedbackManager(canvasElement);
      expect(factoryManager).toBeDefined();
      expect(factoryManager.isEnabled()).toBe(true);
      factoryManager.destroy();
    });
  });

  describe('Enable/Disable System', () => {
    it('should enable the visual feedback system', () => {
      manager.setEnabled(false);
      expect(manager.isEnabled()).toBe(false);

      manager.setEnabled(true);
      expect(manager.isEnabled()).toBe(true);
    });

    it('should clear overlays when disabled', () => {
      const hoverEvent: PropertyHoverEvent = {
        propertyPath: 'styles.padding',
        componentId: 'test-component-1',
        mapping: createMockMapping('padding', 'spacing'),
        mode: 'hover',
        currentValue: '10px',
      };

      manager.handlePropertyHover(hoverEvent);
      manager.setEnabled(false);
      expect(manager.isEnabled()).toBe(false);
    });
  });

  describe('Property Hover Events', () => {
    it('should handle property hover event with valid mapping', () => {
      const hoverEvent: PropertyHoverEvent = {
        propertyPath: 'styles.padding',
        componentId: 'test-component-1',
        mapping: createMockMapping('padding', 'spacing'),
        mode: 'hover',
        currentValue: '10px',
      };

      expect(() => manager.handlePropertyHover(hoverEvent)).not.toThrow();
    });

    it('should handle property hover with "off" mode', () => {
      const hoverEvent: PropertyHoverEvent = {
        propertyPath: 'styles.padding',
        componentId: 'test-component-1',
        mapping: createMockMapping('padding', 'spacing'),
        mode: 'hover',
        currentValue: '10px',
      };

      manager.handlePropertyHover(hoverEvent);

      const offEvent: PropertyHoverEvent = {
        ...hoverEvent,
        mode: 'off',
      };

      expect(() => manager.handlePropertyHover(offEvent)).not.toThrow();
    });
  });

  describe('Property Edit Events', () => {
    it('should handle property edit start event', () => {
      const editEvent: PropertyEditEvent = {
        propertyPath: 'styles.padding',
        componentId: 'test-component-1',
        oldValue: undefined,
        newValue: '20px',
        mapping: createMockMapping('padding', 'spacing'),
      };

      expect(() => manager.handlePropertyEdit(editEvent)).not.toThrow();
    });
  });

  describe('Property Change Events (Animations)', () => {
    it('should handle property change event', () => {
      const changeEvent: PropertyChangeEvent = {
        componentId: 'test-component-1',
        propertyPath: 'styles.padding',
        oldValue: '10px',
        newValue: '20px',
        propertyType: 'spacing',
      };

      expect(() => manager.handlePropertyChange(changeEvent)).not.toThrow();
    });
  });

  describe('Configuration Management', () => {
    it('should get current configuration', () => {
      const currentConfig = manager.getConfig();
      expect(currentConfig).toBeDefined();
      expect(currentConfig.enabled).toBe(true);
    });

    it('should update configuration', () => {
      manager.updateConfig({ enabled: false });
      const updatedConfig = manager.getConfig();
      expect(updatedConfig.enabled).toBe(false);
    });
  });

  describe('Performance Stats', () => {
    it('should return performance statistics', () => {
      const stats = manager.getPerformanceStats();
      expect(stats).toBeDefined();
      expect(stats.activeAnimations).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Cleanup and Destruction', () => {
    it('should clean up resources on destroy', () => {
      const testManager = new VisualFeedbackManager({
        config,
        canvasElement,
      });

      expect(() => testManager.destroy()).not.toThrow();
    });
  });
});

/**
 * Helper function to create mock property visual mapping
 */
function createMockMapping(
  propertyName: string,
  propertyType: string
): PropertyVisualMapping {
  return {
    propertyPath: `styles.${propertyName}`,
    componentType: 'button',
    visualTarget: {
      type: propertyType as any,
      selector: undefined,
      region: undefined,
      measurementType: undefined,
    },
    description: `Mock mapping for ${propertyName}`,
  };
}
