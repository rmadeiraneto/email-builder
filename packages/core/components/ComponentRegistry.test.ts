/**
 * ComponentRegistry tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentRegistry, RegistryEvent, RegistryError } from './ComponentRegistry';
import type {
  ComponentDefinition,
  ComponentType,
  ComponentCategory,
  BaseComponent,
  ComponentPreset,
} from '../types';

// Helper function to create a mock component definition
function createMockDefinition(
  type: string,
  category: ComponentCategory = 'base' as ComponentCategory,
  isCustom = false
): ComponentDefinition {
  return {
    type: type as ComponentType,
    metadata: {
      name: `${type} Component`,
      description: `A ${type} component`,
      icon: `ri-${type}-icon`,
      category,
      tags: [type, category],
      isCustom,
    },
    defaultContent: {
      text: `Default ${type}`,
    },
    defaultStyles: {
      backgroundColor: '#ffffff',
    },
    create: () => ({
      id: `${type}-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
      type: type as ComponentType,
      metadata: {
        name: `${type} Component`,
        category,
      },
      styles: {
        backgroundColor: '#ffffff',
      },
      content: {
        text: `Default ${type}`,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: '1.0.0',
    }),
  };
}

// Helper function to create a mock preset
function createMockPreset(id: string, name: string): ComponentPreset {
  return {
    id,
    name,
    description: `${name} preset`,
    styles: {
      backgroundColor: '#' + crypto.randomUUID().slice(0, 6),
    },
    createdAt: Date.now(),
  };
}

describe('ComponentRegistry', () => {
  let registry: ComponentRegistry;

  const waitForEmit = () => new Promise(resolve => setTimeout(resolve, 10));

  beforeEach(() => {
    registry = new ComponentRegistry();
  });

  describe('Registration', () => {
    it('should register a component definition', () => {
      const definition = createMockDefinition('button');

      registry.register(definition);

      expect(registry.has('button')).toBe(true);
      expect(registry.get('button')).toEqual(definition);
    });

    it('should register multiple component definitions', () => {
      const definitions = [
        createMockDefinition('button'),
        createMockDefinition('text'),
        createMockDefinition('image'),
      ];

      registry.registerMany(definitions);

      expect(registry.count()).toBe(3);
      expect(registry.has('button')).toBe(true);
      expect(registry.has('text')).toBe(true);
      expect(registry.has('image')).toBe(true);
    });

    it('should throw error when registering duplicate component type', () => {
      const definition = createMockDefinition('button');

      registry.register(definition);

      expect(() => registry.register(definition)).toThrow(RegistryError);
      expect(() => registry.register(definition)).toThrow(
        'Component type "button" is already registered'
      );
    });

    it('should emit event when component is registered', async () => {
      const definition = createMockDefinition('button');
      let eventData: unknown = null;

      registry.on(RegistryEvent.COMPONENT_REGISTERED, (data) => {
        eventData = data;
      });

      registry.register(definition);

      // Wait for setTimeout to complete
      await waitForEmit();

      expect(eventData).toEqual({
        type: 'button',
        definition,
      });
    });

    it('should register component with presets', () => {
      const presets = [createMockPreset('preset1', 'Primary'), createMockPreset('preset2', 'Secondary')];
      const definition = {
        ...createMockDefinition('button'),
        presets,
      };

      registry.register(definition);

      const registeredPresets = registry.getPresets('button');
      expect(registeredPresets).toHaveLength(2);
      expect(registeredPresets[0].id).toBe('preset1');
      expect(registeredPresets[1].id).toBe('preset2');
    });
  });

  describe('Unregistration', () => {
    it('should unregister a component definition', () => {
      const definition = createMockDefinition('button');
      registry.register(definition);

      const result = registry.unregister('button');

      expect(result).toBe(true);
      expect(registry.has('button')).toBe(false);
    });

    it('should return false when unregistering non-existent component', () => {
      const result = registry.unregister('nonexistent');

      expect(result).toBe(false);
    });

    it('should emit event when component is unregistered', async () => {
      const definition = createMockDefinition('button');
      let eventData: unknown = null;

      registry.register(definition);

      registry.on(RegistryEvent.COMPONENT_UNREGISTERED, (data) => {
        eventData = data;
      });

      registry.unregister('button');

      // Wait for setTimeout to complete
      await waitForEmit();

      expect(eventData).toEqual({ type: 'button' });
    });

    it('should remove presets when unregistering component', () => {
      const presets = [createMockPreset('preset1', 'Primary')];
      const definition = {
        ...createMockDefinition('button'),
        presets,
      };

      registry.register(definition);
      registry.unregister('button');

      expect(registry.getPresets('button')).toHaveLength(0);
    });
  });

  describe('Retrieval', () => {
    beforeEach(() => {
      registry.registerMany([
        createMockDefinition('button', 'base' as ComponentCategory),
        createMockDefinition('text', 'base' as ComponentCategory),
        createMockDefinition('header', 'navigation' as ComponentCategory),
        createMockDefinition('hero', 'content' as ComponentCategory),
      ]);
    });

    it('should get a component definition by type', () => {
      const definition = registry.get('button');

      expect(definition).toBeDefined();
      expect(definition?.type).toBe('button');
    });

    it('should return undefined for non-existent component', () => {
      const definition = registry.get('nonexistent');

      expect(definition).toBeUndefined();
    });

    it('should check if component exists', () => {
      expect(registry.has('button')).toBe(true);
      expect(registry.has('nonexistent')).toBe(false);
    });

    it('should get all component types', () => {
      const types = registry.getTypes();

      expect(types).toHaveLength(4);
      expect(types).toContain('button');
      expect(types).toContain('text');
      expect(types).toContain('header');
      expect(types).toContain('hero');
    });

    it('should get all component definitions', () => {
      const definitions = registry.getAll();

      expect(definitions).toHaveLength(4);
    });

    it('should get components by category', () => {
      const baseComponents = registry.getByCategory('base' as ComponentCategory);
      const navComponents = registry.getByCategory('navigation' as ComponentCategory);

      expect(baseComponents).toHaveLength(2);
      expect(navComponents).toHaveLength(1);
    });

    it('should count registered components', () => {
      expect(registry.count()).toBe(4);
    });
  });

  describe('Filtering', () => {
    beforeEach(() => {
      registry.registerMany([
        createMockDefinition('button', 'base' as ComponentCategory, false),
        createMockDefinition('text', 'base' as ComponentCategory, false),
        createMockDefinition('custom1', 'custom' as ComponentCategory, true),
        createMockDefinition('custom2', 'custom' as ComponentCategory, true),
      ]);
    });

    it('should filter by category', () => {
      const results = registry.filter({ category: 'base' as ComponentCategory });

      expect(results).toHaveLength(2);
      expect(results.every((r) => r.metadata.category === 'base')).toBe(true);
    });

    it('should filter by custom only', () => {
      const results = registry.filter({ customOnly: true });

      expect(results).toHaveLength(2);
      expect(results.every((r) => r.metadata.isCustom === true)).toBe(true);
    });

    it('should filter by tags', () => {
      const results = registry.filter({ tags: ['base'] });

      expect(results).toHaveLength(2);
    });

    it('should search by term (name)', () => {
      const results = registry.filter({ searchTerm: 'button' });

      expect(results).toHaveLength(1);
      expect(results[0].type).toBe('button');
    });

    it('should search by term (description)', () => {
      const results = registry.filter({ searchTerm: 'A button' });

      expect(results).toHaveLength(1);
      expect(results[0].type).toBe('button');
    });

    it('should combine multiple filters', () => {
      const results = registry.filter({
        category: 'custom' as ComponentCategory,
        customOnly: true,
      });

      expect(results).toHaveLength(2);
    });

    it('should return empty array when no matches', () => {
      const results = registry.filter({ searchTerm: 'nonexistent' });

      expect(results).toHaveLength(0);
    });
  });

  describe('Component Creation', () => {
    beforeEach(() => {
      registry.register(createMockDefinition('button'));
    });

    it('should create a component instance', () => {
      const component = registry.create('button');

      expect(component).toBeDefined();
      expect(component.type).toBe('button');
      expect(component.id).toBeDefined();
      expect(component.metadata).toBeDefined();
      expect(component.styles).toBeDefined();
      expect(component.content).toBeDefined();
    });

    it('should create unique instances', () => {
      const component1 = registry.create('button');
      const component2 = registry.create('button');

      expect(component1.id).not.toBe(component2.id);
    });

    it('should throw error when creating non-existent component', () => {
      expect(() => registry.create('nonexistent')).toThrow(RegistryError);
      expect(() => registry.create('nonexistent')).toThrow(
        'Component type "nonexistent" is not registered'
      );
    });
  });

  describe('Component Creation with Presets', () => {
    beforeEach(() => {
      const presets = [
        createMockPreset('primary', 'Primary'),
        createMockPreset('secondary', 'Secondary'),
      ];
      const definition = {
        ...createMockDefinition('button'),
        presets,
      };
      registry.register(definition);
    });

    it('should create component with preset applied', () => {
      const component = registry.createWithPreset('button', 'primary');
      const preset = registry.getPreset('button', 'primary')!;

      expect(component).toBeDefined();
      expect(component.styles.backgroundColor).toBe(preset.styles.backgroundColor);
    });

    it('should throw error for non-existent preset', () => {
      expect(() => registry.createWithPreset('button', 'nonexistent')).toThrow(RegistryError);
    });

    it('should update timestamp when applying preset', () => {
      const component = registry.createWithPreset('button', 'primary');
      const now = Date.now();

      expect(component.updatedAt).toBeLessThanOrEqual(now);
      expect(component.updatedAt).toBeGreaterThan(now - 1000); // Within last second
    });
  });

  describe('Validation', () => {
    beforeEach(() => {
      registry.register(createMockDefinition('button'));
    });

    it('should validate a valid component', () => {
      const component = registry.create('button');
      const result = registry.validate(component);

      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should fail validation for unregistered component type', () => {
      const component = registry.create('button');
      component.type = 'nonexistent' as ComponentType;

      const result = registry.validate(component);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Component type "nonexistent" is not registered');
    });

    it('should fail validation for missing required fields', () => {
      const component = registry.create('button');
      component.id = '';

      const result = registry.validate(component);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Component ID is required');
    });

    it('should use custom validation when provided', () => {
      const customDefinition = {
        ...createMockDefinition('custom'),
        validate: (component: BaseComponent) => ({
          valid: component.content.text !== 'invalid',
          errors: component.content.text === 'invalid' ? ['Content is invalid'] : undefined,
        }),
      };

      registry.register(customDefinition);

      const validComponent = registry.create('custom');
      const invalidComponent = registry.create('custom');
      invalidComponent.content.text = 'invalid';

      expect(registry.validate(validComponent).valid).toBe(true);
      expect(registry.validate(invalidComponent).valid).toBe(false);
      expect(registry.validate(invalidComponent).errors).toContain('Content is invalid');
    });
  });

  describe('Preset Management', () => {
    beforeEach(() => {
      registry.register(createMockDefinition('button'));
    });

    it('should add a preset to a component', () => {
      const preset = createMockPreset('new-preset', 'New Preset');

      registry.addPreset('button', preset);

      const presets = registry.getPresets('button');
      expect(presets).toHaveLength(1);
      expect(presets[0].id).toBe('new-preset');
    });

    it('should throw error when adding preset to non-existent component', () => {
      const preset = createMockPreset('preset1', 'Preset');

      expect(() => registry.addPreset('nonexistent', preset)).toThrow(RegistryError);
    });

    it('should throw error when adding duplicate preset', () => {
      const preset = createMockPreset('preset1', 'Preset');

      registry.addPreset('button', preset);

      expect(() => registry.addPreset('button', preset)).toThrow(RegistryError);
    });

    it('should emit event when preset is added', async () => {
      const preset = createMockPreset('preset1', 'Preset');
      let eventData: unknown = null;

      registry.on(RegistryEvent.PRESET_ADDED, (data) => {
        eventData = data;
      });

      registry.addPreset('button', preset);

      // Wait for setTimeout to complete
      await waitForEmit();

      expect(eventData).toEqual({
        type: 'button',
        preset,
      });
    });

    it('should get a specific preset', () => {
      const preset = createMockPreset('preset1', 'Preset');
      registry.addPreset('button', preset);

      const retrieved = registry.getPreset('button', 'preset1');

      expect(retrieved).toEqual(preset);
    });

    it('should return undefined for non-existent preset', () => {
      const preset = registry.getPreset('button', 'nonexistent');

      expect(preset).toBeUndefined();
    });

    it('should remove a preset', () => {
      const preset = createMockPreset('preset1', 'Preset');
      registry.addPreset('button', preset);

      const result = registry.removePreset('button', 'preset1');

      expect(result).toBe(true);
      expect(registry.getPresets('button')).toHaveLength(0);
    });

    it('should return false when removing non-existent preset', () => {
      const result = registry.removePreset('button', 'nonexistent');

      expect(result).toBe(false);
    });

    it('should emit event when preset is removed', async () => {
      const preset = createMockPreset('preset1', 'Preset');
      let eventData: unknown = null;

      registry.addPreset('button', preset);

      registry.on(RegistryEvent.PRESET_REMOVED, (data) => {
        eventData = data;
      });

      registry.removePreset('button', 'preset1');

      // Wait for setTimeout to complete
      await waitForEmit();

      expect(eventData).toEqual({
        type: 'button',
        presetId: 'preset1',
      });
    });

    it('should update a preset', () => {
      const preset = createMockPreset('preset1', 'Preset');
      registry.addPreset('button', preset);

      registry.updatePreset('button', 'preset1', {
        name: 'Updated Preset',
        description: 'Updated description',
      });

      const updated = registry.getPreset('button', 'preset1');

      expect(updated?.name).toBe('Updated Preset');
      expect(updated?.description).toBe('Updated description');
    });

    it('should throw error when updating non-existent preset', () => {
      expect(() => registry.updatePreset('button', 'nonexistent', { name: 'New' })).toThrow(
        RegistryError
      );
    });
  });

  describe('Utility Methods', () => {
    it('should clear all components and presets', () => {
      registry.registerMany([
        createMockDefinition('button'),
        createMockDefinition('text'),
      ]);

      registry.addPreset('button', createMockPreset('preset1', 'Preset'));

      registry.clear();

      expect(registry.count()).toBe(0);
      expect(registry.getPresets('button')).toHaveLength(0);
    });

    it('should handle event subscription and unsubscription', async () => {
      let callCount = 0;
      const listener = () => {
        callCount++;
      };

      const subscription = registry.on(RegistryEvent.COMPONENT_REGISTERED, listener);

      registry.register(createMockDefinition('button'));

      // Wait for setTimeout to complete
      await waitForEmit();

      expect(callCount).toBe(1);

      subscription.unsubscribe();

      registry.register(createMockDefinition('text'));

      // Wait for setTimeout to complete
      await waitForEmit();

      expect(callCount).toBe(1); // Should not increment
    });

    it('should unsubscribe from all events', () => {
      let callCount = 0;
      const listener = () => {
        callCount++;
      };

      registry.on(RegistryEvent.COMPONENT_REGISTERED, listener);
      registry.on(RegistryEvent.PRESET_ADDED, listener);

      registry.off();

      registry.register(createMockDefinition('button'));
      registry.addPreset('button', createMockPreset('preset1', 'Preset'));

      expect(callCount).toBe(0);
    });
  });
});
