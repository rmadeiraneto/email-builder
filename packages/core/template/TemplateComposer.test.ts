/**
 * Tests for TemplateComposer
 */

import { describe, it, expect } from 'vitest';
import {
  TemplateComposer,
  createTemplate,
  createEmptyEmailTemplate,
  createEmptyWebTemplate,
  cloneTemplate,
  mergeTemplates,
} from './TemplateComposer';
import type { Template } from '../types/template.types';
import { createButton } from '../components/factories/base-components.factories';

describe('TemplateComposer', () => {
  describe('constructor and basic setup', () => {
    it('should create a template with default settings', () => {
      const composer = new TemplateComposer({
        target: 'email',
        name: 'Test Template',
      });

      const template = composer.build();

      expect(template.metadata.name).toBe('Test Template');
      expect(template.settings.target).toBe('email');
      expect(template.settings.canvasDimensions.width).toBe(600);
      expect(template.settings.locale).toBe('en-US');
      expect(template.settings.responsive).toBe(true);
    });

    it('should use custom width when provided', () => {
      const composer = new TemplateComposer({
        target: 'email',
        name: 'Test',
        width: 700,
      });

      const template = composer.build();
      expect(template.settings.canvasDimensions.width).toBe(700);
    });

    it('should set metadata fields', () => {
      const composer = new TemplateComposer({
        target: 'email',
        name: 'Test',
        description: 'A test template',
        author: 'Test Author',
        category: 'test',
        tags: ['tag1', 'tag2'],
      });

      const template = composer.build();

      expect(template.metadata.description).toBe('A test template');
      expect(template.metadata.author).toBe('Test Author');
      expect(template.metadata.category).toBe('test');
      expect(template.metadata.tags).toEqual(['tag1', 'tag2']);
    });
  });

  describe('fluent API methods', () => {
    it('should set canvas width', () => {
      const template = new TemplateComposer({
        target: 'email',
        name: 'Test',
      })
        .setCanvasWidth(650)
        .build();

      expect(template.settings.canvasDimensions.width).toBe(650);
    });

    it('should set canvas max width', () => {
      const template = new TemplateComposer({
        target: 'email',
        name: 'Test',
      })
        .setCanvasMaxWidth(700)
        .build();

      expect(template.settings.canvasDimensions.maxWidth).toBe(700);
    });

    it('should set background color', () => {
      const template = new TemplateComposer({
        target: 'email',
        name: 'Test',
      })
        .setBackgroundColor('#f5f5f5')
        .build();

      expect(template.generalStyles.canvasBackgroundColor).toBe('#f5f5f5');
    });

    it('should set background image', () => {
      const template = new TemplateComposer({
        target: 'email',
        name: 'Test',
      })
        .setBackgroundImage('https://example.com/bg.jpg')
        .build();

      expect(template.generalStyles.canvasBackgroundImage).toBe(
        'https://example.com/bg.jpg'
      );
    });

    it('should set canvas border', () => {
      const template = new TemplateComposer({
        target: 'email',
        name: 'Test',
      })
        .setCanvasBorder('1px solid #000')
        .build();

      expect(template.generalStyles.canvasBorder).toBe('1px solid #000');
    });

    it('should set default component background', () => {
      const template = new TemplateComposer({
        target: 'email',
        name: 'Test',
      })
        .setDefaultComponentBackground('#ffffff')
        .build();

      expect(template.generalStyles.defaultComponentBackgroundColor).toBe(
        '#ffffff'
      );
    });

    it('should set typography preset', () => {
      const template = new TemplateComposer({
        target: 'email',
        name: 'Test',
      })
        .setTypography('heading1', {
          name: 'Heading 1',
          styles: {
            fontFamily: 'Arial',
            fontSize: { value: 24, unit: 'px' },
            fontWeight: 700,
            color: '#000000',
          },
        })
        .build();

      expect(template.generalStyles.typography?.heading1).toBeDefined();
      expect(template.generalStyles.typography?.heading1?.name).toBe('Heading 1');
    });

    it('should set locale', () => {
      const template = new TemplateComposer({
        target: 'email',
        name: 'Test',
      })
        .setLocale('pt-BR')
        .build();

      expect(template.settings.locale).toBe('pt-BR');
    });

    it('should enable RTL', () => {
      const template = new TemplateComposer({
        target: 'email',
        name: 'Test',
      })
        .enableRTL(true)
        .build();

      expect(template.settings.rtl).toBe(true);
    });

    it('should disable responsive', () => {
      const template = new TemplateComposer({
        target: 'email',
        name: 'Test',
      })
        .enableResponsive(false)
        .build();

      expect(template.settings.responsive).toBe(false);
    });

    it('should set custom data', () => {
      const template = new TemplateComposer({
        target: 'email',
        name: 'Test',
      })
        .setCustomData('customKey', 'customValue')
        .build();

      expect(template.customData?.customKey).toBe('customValue');
    });

    it('should enable data injection', () => {
      const template = new TemplateComposer({
        target: 'email',
        name: 'Test',
      })
        .enableDataInjection(true)
        .build();

      expect(template.dataInjection?.enabled).toBe(true);
    });

    it('should add placeholders', () => {
      const template = new TemplateComposer({
        target: 'email',
        name: 'Test',
      })
        .addPlaceholders({ name: 'John', email: 'john@example.com' })
        .build();

      expect(template.dataInjection?.placeholders).toEqual({
        name: 'John',
        email: 'john@example.com',
      });
    });
  });

  describe('component management', () => {
    it('should add single component', () => {
      const button = createButton({
        text: 'Click me',
        link: { href: 'https://example.com' },
      });

      const template = new TemplateComposer({
        target: 'email',
        name: 'Test',
      })
        .addComponent(button)
        .build();

      expect(template.components).toHaveLength(1);
      expect(template.components[0].type).toBe('button');
    });

    it('should add multiple components', () => {
      const button1 = createButton({
        text: 'Button 1',
        link: { href: 'https://example.com' },
      });
      const button2 = createButton({
        text: 'Button 2',
        link: { href: 'https://example.com' },
      });

      const template = new TemplateComposer({
        target: 'email',
        name: 'Test',
      })
        .addComponents([button1, button2])
        .build();

      expect(template.components).toHaveLength(2);
    });
  });

  describe('method chaining', () => {
    it('should support fluent API chaining', () => {
      const button = createButton({
        text: 'Click me',
        link: { href: 'https://example.com' },
      });

      const template = new TemplateComposer({
        target: 'email',
        name: 'Test',
      })
        .setCanvasWidth(600)
        .setBackgroundColor('#f5f5f5')
        .setLocale('en-US')
        .enableResponsive(true)
        .addComponent(button)
        .build();

      expect(template.settings.canvasDimensions.width).toBe(600);
      expect(template.generalStyles.canvasBackgroundColor).toBe('#f5f5f5');
      expect(template.settings.locale).toBe('en-US');
      expect(template.settings.responsive).toBe(true);
      expect(template.components).toHaveLength(1);
    });
  });
});

describe('Factory Functions', () => {
  describe('createTemplate', () => {
    it('should create template with components', () => {
      const button = createButton({
        text: 'Click me',
        link: { href: 'https://example.com' },
      });

      const template = createTemplate({
        target: 'email',
        name: 'Test',
        components: [button],
      });

      expect(template.metadata.name).toBe('Test');
      expect(template.components).toHaveLength(1);
    });

    it('should create template without components', () => {
      const template = createTemplate({
        target: 'email',
        name: 'Empty Test',
      });

      expect(template.metadata.name).toBe('Empty Test');
      expect(template.components).toHaveLength(0);
    });
  });

  describe('createEmptyEmailTemplate', () => {
    it('should create empty email template with defaults', () => {
      const template = createEmptyEmailTemplate('My Email');

      expect(template.metadata.name).toBe('My Email');
      expect(template.settings.target).toBe('email');
      expect(template.settings.canvasDimensions.width).toBe(600);
      expect(template.generalStyles.canvasBackgroundColor).toBe('#ffffff');
      expect(template.components).toHaveLength(0);
    });
  });

  describe('createEmptyWebTemplate', () => {
    it('should create empty web template with defaults', () => {
      const template = createEmptyWebTemplate('My Website');

      expect(template.metadata.name).toBe('My Website');
      expect(template.settings.target).toBe('web');
      expect(template.settings.canvasDimensions.width).toBe(1200);
      expect(template.generalStyles.canvasBackgroundColor).toBe('#ffffff');
      expect(template.components).toHaveLength(0);
    });
  });

  describe('cloneTemplate', () => {
    it('should clone template with new ID', () => {
      const original = createEmptyEmailTemplate('Original');
      const clone = cloneTemplate(original);

      expect(clone.metadata.id).not.toBe(original.metadata.id);
      expect(clone.metadata.name).toBe('Original (Copy)');
      expect(clone.settings).toEqual(original.settings);
    });

    it('should clone with custom name', () => {
      const original = createEmptyEmailTemplate('Original');
      const clone = cloneTemplate(original, 'Custom Clone');

      expect(clone.metadata.name).toBe('Custom Clone');
    });

    it('should reset version to 1.0.0', () => {
      const original = createEmptyEmailTemplate('Original');
      original.metadata.version = '2.5.3';

      const clone = cloneTemplate(original);

      expect(clone.metadata.version).toBe('1.0.0');
    });
  });

  describe('mergeTemplates', () => {
    it('should merge multiple templates', () => {
      const button1 = createButton({
        text: 'Button 1',
        link: { href: 'https://example.com' },
      });
      const button2 = createButton({
        text: 'Button 2',
        link: { href: 'https://example.com' },
      });

      const template1 = createTemplate({
        target: 'email',
        name: 'Template 1',
        components: [button1],
      });

      const template2 = createTemplate({
        target: 'email',
        name: 'Template 2',
        components: [button2],
      });

      const merged = mergeTemplates('Merged', [template1, template2]);

      expect(merged.metadata.name).toBe('Merged');
      expect(merged.components).toHaveLength(2);
    });

    it('should use first template as base', () => {
      const template1 = new TemplateComposer({
        target: 'email',
        name: 'Template 1',
        width: 600,
      })
        .setBackgroundColor('#f5f5f5')
        .build();

      const template2 = createEmptyEmailTemplate('Template 2');

      const merged = mergeTemplates('Merged', [template1, template2]);

      expect(merged.settings.canvasDimensions.width).toBe(600);
      expect(merged.generalStyles.canvasBackgroundColor).toBe('#f5f5f5');
    });

    it('should use preferred template for general styles', () => {
      const template1 = new TemplateComposer({
        target: 'email',
        name: 'Template 1',
      })
        .setBackgroundColor('#ff0000')
        .build();

      const template2 = new TemplateComposer({
        target: 'email',
        name: 'Template 2',
      })
        .setBackgroundColor('#00ff00')
        .build();

      const merged = mergeTemplates('Merged', [template1, template2], {
        preferGeneralStyles: 1,
      });

      expect(merged.generalStyles.canvasBackgroundColor).toBe('#00ff00');
    });

    it('should throw error if no templates provided', () => {
      expect(() => mergeTemplates('Merged', [])).toThrow();
    });
  });
});
