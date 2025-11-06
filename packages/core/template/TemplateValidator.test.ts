/**
 * Template Validator Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TemplateValidator } from './TemplateValidator';
import type { ComponentRegistry } from '../components/ComponentRegistry';
import type { Template } from '../types/template.types';

describe('TemplateValidator', () => {
  let validator: TemplateValidator;
  let mockRegistry: ComponentRegistry;

  beforeEach(() => {
    mockRegistry = {
      hasComponent: vi.fn((type) => ['text', 'button', 'container'].includes(type)),
      getComponentDefinition: vi.fn(),
    } as unknown as ComponentRegistry;

    validator = new TemplateValidator(mockRegistry);
  });

  const createValidTemplate = (): Template => ({
    metadata: {
      id: 'template-1',
      name: 'Test Template',
      version: '1.0.0',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    settings: {
      target: 'email',
      width: 600,
      backgroundColor: '#ffffff',
    },
    generalStyles: {
      canvasBackgroundColor: '#ffffff',
    },
    components: [],
  });

  describe('validate', () => {
    it('should validate a correct template', () => {
      const template = createValidTemplate();

      const result = validator.validate(template);

      expect(result.valid).toBe(true);
      expect(result.errors.filter((e) => e.severity === 'error')).toHaveLength(0);
    });

    it('should detect missing template ID', () => {
      const template = createValidTemplate();
      template.metadata.id = '';

      const result = validator.validate(template);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'metadata.id',
          severity: 'error',
        })
      );
    });

    it('should detect missing template name', () => {
      const template = createValidTemplate();
      template.metadata.name = '';

      const result = validator.validate(template);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'metadata.name',
          severity: 'error',
        })
      );
    });

    it('should validate template with components', () => {
      const template = createValidTemplate();
      template.components = [
        {
          id: 'comp-1',
          type: 'text',
          content: { text: 'Hello' },
          styles: {},
          children: [],
        },
      ];

      const result = validator.validate(template);

      expect(result.valid).toBe(true);
    });

    it('should detect invalid component type', () => {
      const template = createValidTemplate();
      template.components = [
        {
          id: 'comp-1',
          type: 'invalid-type' as any,
          styles: {},
          children: [],
        },
      ];

      const result = validator.validate(template);

      expect(result.valid).toBe(false);
    });

    it('should validate email target settings', () => {
      const template = createValidTemplate();
      template.settings.target = 'email';

      const result = validator.validate(template);

      // Should check email compatibility
      expect(result.compatibilityWarnings).toBeDefined();
    });

    it('should return validation errors array', () => {
      const template = createValidTemplate();
      template.metadata.id = '';
      template.metadata.name = '';

      const result = validator.validate(template);

      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
