/**
 * PropertyOverrideManager Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PropertyOverrideManager, PropertyCategory } from './PropertyOverrideManager';
import { ModeManagerEvent } from './ModeManager';
import { EventEmitter } from '../services/EventEmitter';
import type { Template } from '../../types';
import type { MobileDevModeConfig } from '../mobile.types';

describe('PropertyOverrideManager', () => {
  let eventEmitter: EventEmitter;
  let overrideManager: PropertyOverrideManager;
  let mockTemplate: Template;
  let mockConfig: MobileDevModeConfig;

  const waitForEmit = () => new Promise(resolve => setTimeout(resolve, 10));

  beforeEach(() => {
    eventEmitter = new EventEmitter();

    mockTemplate = {
      id: 'template-1',
      name: 'Test Template',
      components: [
        {
          id: 'comp-1',
          type: 'text',
          styles: {
            padding: '32px',
            fontSize: '16px',
            color: '#000000',
          },
        },
        {
          id: 'comp-2',
          type: 'button',
          styles: {
            padding: '16px',
            fontSize: '14px',
          },
        },
      ],
    } as Template;

    mockConfig = {
      propertyOverrides: {
        blacklist: ['id', 'type', 'content.text', 'metadata'],
        canvasSettingsOverridable: ['width', 'backgroundColor'],
      },
    } as MobileDevModeConfig;

    overrideManager = new PropertyOverrideManager({
      eventEmitter,
      config: mockConfig,
      template: mockTemplate,
    });
  });

  describe('setOverride', () => {
    it('should set a style override', () => {
      const result = overrideManager.setOverride('comp-1', 'styles.padding', '16px');

      expect(result.success).toBe(true);
      expect(result.componentId).toBe('comp-1');
      expect(result.propertyPath).toBe('styles.padding');
      expect(result.newValue).toBe('16px');
      expect(result.previousValue).toBeUndefined();

      // Check component was updated
      const component = mockTemplate.components[0];
      expect(component.mobileStyles?.padding).toBe('16px');
    });

    it('should emit property override set event', async () => {
      const listener = vi.fn();
      eventEmitter.on(ModeManagerEvent.PROPERTY_OVERRIDE_SET, listener);

      overrideManager.setOverride('comp-1', 'styles.padding', '16px');

      // Wait for setTimeout to complete
      await waitForEmit();

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          componentId: 'comp-1',
          propertyPath: 'styles.padding',
          value: '16px',
        })
      );
    });

    it('should fail for non-existent component', () => {
      const result = overrideManager.setOverride('comp-999', 'styles.padding', '16px');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Component not found');
    });

    it('should fail for blacklisted properties', () => {
      const result = overrideManager.setOverride('comp-1', 'id', 'new-id');

      expect(result.success).toBe(false);
      expect(result.error).toContain('cannot be overridden');
    });

    it('should fail for non-style properties', () => {
      const result = overrideManager.setOverride('comp-1', 'type', 'button');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Only style properties');
    });

    it('should update template metadata', () => {
      overrideManager.setOverride('comp-1', 'styles.padding', '16px');

      expect(mockTemplate.mobileDevMode?.overrides).toBeDefined();
      const componentOverride = mockTemplate.mobileDevMode?.overrides.find(
        (o) => o.componentId === 'comp-1'
      );

      expect(componentOverride).toBeDefined();
      expect(componentOverride?.overriddenProperties).toContain('styles.padding');
    });
  });

  describe('clearOverride', () => {
    beforeEach(() => {
      // Set up some overrides
      overrideManager.setOverride('comp-1', 'styles.padding', '16px');
      overrideManager.setOverride('comp-1', 'styles.fontSize', '14px');
    });

    it('should clear a specific override', () => {
      const result = overrideManager.clearOverride('comp-1', 'styles.padding');

      expect(result.success).toBe(true);
      expect(result.previousValue).toBe('16px');

      const component = mockTemplate.components[0];
      expect(component.mobileStyles?.padding).toBeUndefined();
      expect(component.mobileStyles?.fontSize).toBe('14px'); // Other override remains
    });

    it('should emit property override cleared event', async () => {
      const listener = vi.fn();
      eventEmitter.on(ModeManagerEvent.PROPERTY_OVERRIDE_CLEARED, listener);

      overrideManager.clearOverride('comp-1', 'styles.padding');

      // Wait for setTimeout to complete
      await waitForEmit();

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          componentId: 'comp-1',
          propertyPath: 'styles.padding',
          previousValue: '16px',
        })
      );
    });

    it('should succeed even if override does not exist', () => {
      const result = overrideManager.clearOverride('comp-1', 'styles.color');

      expect(result.success).toBe(true);
    });

    it('should update template metadata', () => {
      overrideManager.clearOverride('comp-1', 'styles.padding');

      const componentOverride = mockTemplate.mobileDevMode?.overrides.find(
        (o) => o.componentId === 'comp-1'
      );

      expect(componentOverride?.overriddenProperties).not.toContain('styles.padding');
      expect(componentOverride?.overriddenProperties).toContain('styles.fontSize');
    });
  });

  describe('getOverride', () => {
    it('should return override value if set', () => {
      overrideManager.setOverride('comp-1', 'styles.padding', '16px');

      const value = overrideManager.getOverride('comp-1', 'styles.padding');

      expect(value).toBe('16px');
    });

    it('should return undefined if not set', () => {
      const value = overrideManager.getOverride('comp-1', 'styles.padding');

      expect(value).toBeUndefined();
    });
  });

  describe('hasOverride', () => {
    it('should return true if override exists', () => {
      overrideManager.setOverride('comp-1', 'styles.padding', '16px');

      expect(overrideManager.hasOverride('comp-1', 'styles.padding')).toBe(true);
    });

    it('should return false if override does not exist', () => {
      expect(overrideManager.hasOverride('comp-1', 'styles.padding')).toBe(false);
    });
  });

  describe('getComponentOverrides', () => {
    it('should return all overrides for a component', () => {
      overrideManager.setOverride('comp-1', 'styles.padding', '16px');
      overrideManager.setOverride('comp-1', 'styles.fontSize', '14px');

      const overrides = overrideManager.getComponentOverrides('comp-1');

      expect(overrides).toEqual({
        'styles.padding': '16px',
        'styles.fontSize': '14px',
      });
    });

    it('should return empty object if no overrides', () => {
      const overrides = overrideManager.getComponentOverrides('comp-1');

      expect(overrides).toEqual({});
    });
  });

  describe('clearComponentOverrides', () => {
    beforeEach(() => {
      overrideManager.setOverride('comp-1', 'styles.padding', '16px');
      overrideManager.setOverride('comp-1', 'styles.fontSize', '14px');
      overrideManager.setOverride('comp-1', 'styles.color', '#ff0000');
    });

    it('should clear all overrides for a component', () => {
      const result = overrideManager.clearComponentOverrides('comp-1');

      expect(result.successCount).toBe(3);
      expect(result.failureCount).toBe(0);
      expect(result.totalCount).toBe(3);

      const component = mockTemplate.components[0];
      expect(component.mobileStyles).toEqual({});
    });
  });

  describe('clearComponentOverridesByCategory', () => {
    beforeEach(() => {
      overrideManager.setOverride('comp-1', 'styles.padding', '16px');
      overrideManager.setOverride('comp-1', 'styles.fontSize', '14px');
      overrideManager.setOverride('comp-1', 'styles.color', '#ff0000');
    });

    it('should clear overrides by category', () => {
      const result = overrideManager.clearComponentOverridesByCategory(
        'comp-1',
        PropertyCategory.SPACING
      );

      expect(result.successCount).toBe(1);

      const component = mockTemplate.components[0];
      expect(component.mobileStyles?.padding).toBeUndefined();
      expect(component.mobileStyles?.fontSize).toBe('14px'); // Typography remains
      expect(component.mobileStyles?.color).toBe('#ff0000'); // Colors remain
    });
  });

  describe('clearAllOverrides', () => {
    beforeEach(() => {
      overrideManager.setOverride('comp-1', 'styles.padding', '16px');
      overrideManager.setOverride('comp-2', 'styles.fontSize', '14px');
    });

    it('should clear all overrides for all components', () => {
      const result = overrideManager.clearAllOverrides();

      expect(result.successCount).toBe(2);
      expect(result.totalCount).toBe(2);

      const comp1 = mockTemplate.components[0];
      const comp2 = mockTemplate.components[1];

      expect(comp1.mobileStyles).toEqual({});
      expect(comp2.mobileStyles).toEqual({});
    });
  });

  describe('getPropertyCategory', () => {
    it('should categorize layout properties', () => {
      expect(overrideManager.getPropertyCategory('styles.width')).toBe(PropertyCategory.LAYOUT);
      expect(overrideManager.getPropertyCategory('styles.display')).toBe(PropertyCategory.LAYOUT);
    });

    it('should categorize spacing properties', () => {
      expect(overrideManager.getPropertyCategory('styles.padding')).toBe(PropertyCategory.SPACING);
      expect(overrideManager.getPropertyCategory('styles.margin')).toBe(PropertyCategory.SPACING);
    });

    it('should categorize typography properties', () => {
      expect(overrideManager.getPropertyCategory('styles.fontSize')).toBe(PropertyCategory.TYPOGRAPHY);
      expect(overrideManager.getPropertyCategory('styles.fontWeight')).toBe(PropertyCategory.TYPOGRAPHY);
    });

    it('should categorize color properties', () => {
      expect(overrideManager.getPropertyCategory('styles.color')).toBe(PropertyCategory.COLORS);
      expect(overrideManager.getPropertyCategory('styles.backgroundColor')).toBe(PropertyCategory.COLORS);
    });

    it('should default to OTHER for unknown properties', () => {
      expect(overrideManager.getPropertyCategory('styles.unknown')).toBe(PropertyCategory.OTHER);
    });
  });

  describe('getOverrideCount', () => {
    it('should return total override count', () => {
      expect(overrideManager.getOverrideCount()).toBe(0);

      overrideManager.setOverride('comp-1', 'styles.padding', '16px');
      expect(overrideManager.getOverrideCount()).toBe(1);

      overrideManager.setOverride('comp-2', 'styles.fontSize', '14px');
      expect(overrideManager.getOverrideCount()).toBe(2);
    });
  });

  describe('getComponentsWithOverrides', () => {
    it('should return component IDs with overrides', () => {
      expect(overrideManager.getComponentsWithOverrides()).toEqual([]);

      overrideManager.setOverride('comp-1', 'styles.padding', '16px');
      expect(overrideManager.getComponentsWithOverrides()).toEqual(['comp-1']);

      overrideManager.setOverride('comp-2', 'styles.fontSize', '14px');
      expect(overrideManager.getComponentsWithOverrides()).toEqual(['comp-1', 'comp-2']);
    });
  });

  describe('nested property paths', () => {
    it('should handle nested property overrides', () => {
      const result = overrideManager.setOverride('comp-1', 'styles.padding', '16px');

      expect(result.success).toBe(true);

      const component = mockTemplate.components[0];
      expect(component.mobileStyles?.padding).toBe('16px');
    });
  });
});
