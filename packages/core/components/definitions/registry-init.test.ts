/**
 * Registry initialization tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentRegistry } from '../ComponentRegistry';
import { ComponentType } from '../../types';
import {
  createDefaultRegistry,
  registerDefaultComponents,
  getAllComponentDefinitions,
} from './registry-init';

describe('Registry Initialization', () => {
  describe('getAllComponentDefinitions', () => {
    it('should return all component definitions', () => {
      const definitions = getAllComponentDefinitions();

      expect(definitions).toBeDefined();
      expect(definitions.length).toBeGreaterThan(0);
      expect(definitions.length).toBe(10); // 5 base + 5 email components
    });

    it('should include all base components', () => {
      const definitions = getAllComponentDefinitions();
      const types = definitions.map(def => def.type);

      expect(types).toContain(ComponentType.BUTTON);
      expect(types).toContain(ComponentType.TEXT);
      expect(types).toContain(ComponentType.IMAGE);
      expect(types).toContain(ComponentType.SEPARATOR);
      expect(types).toContain(ComponentType.SPACER);
    });

    it('should include all email components', () => {
      const definitions = getAllComponentDefinitions();
      const types = definitions.map(def => def.type);

      expect(types).toContain(ComponentType.HEADER);
      expect(types).toContain(ComponentType.FOOTER);
      expect(types).toContain(ComponentType.HERO);
      expect(types).toContain(ComponentType.LIST);
      expect(types).toContain(ComponentType.CALL_TO_ACTION);
    });

    it('should have valid component definitions', () => {
      const definitions = getAllComponentDefinitions();

      definitions.forEach(def => {
        expect(def.type).toBeDefined();
        expect(def.metadata).toBeDefined();
        expect(def.metadata.name).toBeDefined();
        expect(def.metadata.category).toBeDefined();
        expect(def.defaultContent).toBeDefined();
        expect(def.defaultStyles).toBeDefined();
        expect(def.create).toBeTypeOf('function');
      });
    });
  });

  describe('registerDefaultComponents', () => {
    let registry: ComponentRegistry;

    beforeEach(() => {
      registry = new ComponentRegistry();
    });

    it('should register all components in the registry', () => {
      registerDefaultComponents(registry);

      expect(registry.count()).toBe(10);
    });

    it('should return the same registry instance', () => {
      const result = registerDefaultComponents(registry);

      expect(result).toBe(registry);
    });

    it('should make all components available via get()', () => {
      registerDefaultComponents(registry);

      const buttonDef = registry.get(ComponentType.BUTTON);
      expect(buttonDef).toBeDefined();
      expect(buttonDef?.type).toBe(ComponentType.BUTTON);

      const headerDef = registry.get(ComponentType.HEADER);
      expect(headerDef).toBeDefined();
      expect(headerDef?.type).toBe(ComponentType.HEADER);
    });

    it('should allow creating components from definitions', () => {
      registerDefaultComponents(registry);

      const button = registry.create(ComponentType.BUTTON);
      expect(button).toBeDefined();
      expect(button.type).toBe(ComponentType.BUTTON);
      expect(button.id).toBeDefined();

      const hero = registry.create(ComponentType.HERO);
      expect(hero).toBeDefined();
      expect(hero.type).toBe(ComponentType.HERO);
      expect(hero.id).toBeDefined();
    });
  });

  describe('createDefaultRegistry', () => {
    it('should create a new registry instance', () => {
      const registry = createDefaultRegistry();

      expect(registry).toBeInstanceOf(ComponentRegistry);
    });

    it('should have all components registered', () => {
      const registry = createDefaultRegistry();

      expect(registry.count()).toBe(10);
    });

    it('should allow immediate component creation', () => {
      const registry = createDefaultRegistry();

      const text = registry.create(ComponentType.TEXT);
      expect(text).toBeDefined();
      expect(text.type).toBe(ComponentType.TEXT);
    });

    it('should support validation for all components', () => {
      const registry = createDefaultRegistry();

      const button = registry.create(ComponentType.BUTTON);
      const validation = registry.validate(button);

      expect(validation).toBeDefined();
      expect(validation.valid).toBe(true);
    });

    it('should support filtering by category', () => {
      const registry = createDefaultRegistry();

      const baseComponents = registry.getByCategory('base' as any);
      expect(baseComponents.length).toBeGreaterThan(0);

      const navigationComponents = registry.getByCategory('navigation' as any);
      expect(navigationComponents.length).toBeGreaterThan(0);
    });
  });

  describe('Component Definition Validation', () => {
    let registry: ComponentRegistry;

    beforeEach(() => {
      registry = createDefaultRegistry();
    });

    it('should validate Button components', () => {
      const button = registry.create(ComponentType.BUTTON);
      const result = registry.validate(button);

      expect(result.valid).toBe(true);
    });

    it('should validate Text components', () => {
      const text = registry.create(ComponentType.TEXT);
      const result = registry.validate(text);

      expect(result.valid).toBe(true);
    });

    it('should validate Image components', () => {
      const image = registry.create(ComponentType.IMAGE);
      const result = registry.validate(image);

      expect(result.valid).toBe(true);
    });

    it('should validate Header components', () => {
      const header = registry.create(ComponentType.HEADER);
      const result = registry.validate(header);

      expect(result.valid).toBe(true);
    });

    it('should validate Hero components', () => {
      const hero = registry.create(ComponentType.HERO);
      const result = registry.validate(hero);

      expect(result.valid).toBe(true);
    });
  });

  describe('Component Creation', () => {
    let registry: ComponentRegistry;

    beforeEach(() => {
      registry = createDefaultRegistry();
    });

    it('should create Button with correct defaults', () => {
      const button = registry.create(ComponentType.BUTTON);

      expect(button.type).toBe(ComponentType.BUTTON);
      expect(button.metadata.name).toBe('Button');
      expect(button.content).toBeDefined();
      expect(button.styles).toBeDefined();
    });

    it('should create Text with correct defaults', () => {
      const text = registry.create(ComponentType.TEXT);

      expect(text.type).toBe(ComponentType.TEXT);
      expect(text.metadata.name).toBe('Text');
      expect(text.content).toBeDefined();
    });

    it('should create Image with correct defaults', () => {
      const image = registry.create(ComponentType.IMAGE);

      expect(image.type).toBe(ComponentType.IMAGE);
      expect(image.metadata.name).toBe('Image');
      expect(image.content).toBeDefined();
    });

    it('should create Header with correct defaults', () => {
      const header = registry.create(ComponentType.HEADER);

      expect(header.type).toBe(ComponentType.HEADER);
      expect(header.metadata.name).toBe('Header');
      expect(header.content).toBeDefined();
    });

    it('should create Footer with correct defaults', () => {
      const footer = registry.create(ComponentType.FOOTER);

      expect(footer.type).toBe(ComponentType.FOOTER);
      expect(footer.metadata.name).toBe('Footer');
      expect(footer.content).toBeDefined();
    });

    it('should create Hero with correct defaults', () => {
      const hero = registry.create(ComponentType.HERO);

      expect(hero.type).toBe(ComponentType.HERO);
      expect(hero.metadata.name).toBe('Hero');
      expect(hero.content).toBeDefined();
    });

    it('should create List with correct defaults', () => {
      const list = registry.create(ComponentType.LIST);

      expect(list.type).toBe(ComponentType.LIST);
      expect(list.metadata.name).toBe('List');
      expect(list.content).toBeDefined();
    });

    it('should create CTA with correct defaults', () => {
      const cta = registry.create(ComponentType.CALL_TO_ACTION);

      expect(cta.type).toBe(ComponentType.CALL_TO_ACTION);
      expect(cta.metadata.name).toBe('Call to Action');
      expect(cta.content).toBeDefined();
    });

    it('should create Separator with correct defaults', () => {
      const separator = registry.create(ComponentType.SEPARATOR);

      expect(separator.type).toBe(ComponentType.SEPARATOR);
      expect(separator.metadata.name).toBe('Separator');
      expect(separator.content).toBeDefined();
    });

    it('should create Spacer with correct defaults', () => {
      const spacer = registry.create(ComponentType.SPACER);

      expect(spacer.type).toBe(ComponentType.SPACER);
      expect(spacer.metadata.name).toBe('Spacer');
      expect(spacer.content).toBeDefined();
    });

    it('should create unique IDs for each component', () => {
      const button1 = registry.create(ComponentType.BUTTON);
      const button2 = registry.create(ComponentType.BUTTON);

      expect(button1.id).not.toBe(button2.id);
    });

    it('should create components with timestamps', () => {
      const button = registry.create(ComponentType.BUTTON);

      expect(button.createdAt).toBeDefined();
      expect(button.updatedAt).toBeDefined();
      expect(button.createdAt).toBe(button.updatedAt);
    });
  });
});
