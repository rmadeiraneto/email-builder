/**
 * Template Manager Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TemplateManager, TemplateManagerEvent } from './TemplateManager';
import { TemplateStorage } from './TemplateStorage';
import { ComponentRegistry } from '../components/ComponentRegistry';
import { createDefaultRegistry } from '../components/definitions/registry-init';
import type { StorageAdapter } from '../types/config.types';
import type { Template } from '../types/template.types';

// Mock storage adapter for testing
class MockStorageAdapter implements StorageAdapter {
  private storage: Map<string, unknown> = new Map();

  async get<T = unknown>(key: string): Promise<T | null> {
    return (this.storage.get(key) as T) || null;
  }

  async set<T = unknown>(key: string, value: T): Promise<void> {
    this.storage.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }
}

describe('TemplateManager', () => {
  let templateManager: TemplateManager;
  let registry: ComponentRegistry;
  let storage: TemplateStorage;

  beforeEach(() => {
    registry = createDefaultRegistry();
    const adapter = new MockStorageAdapter();
    storage = new TemplateStorage(adapter, 'test');
    templateManager = new TemplateManager(storage, registry);
  });

  describe('create', () => {
    it('should create a new template', async () => {
      const template = await templateManager.create({
        name: 'Test Template',
        description: 'A test template',
        author: 'Test Author',
        category: 'test',
        tags: ['test'],
        settings: {
          target: 'email',
          canvasDimensions: {
            width: 600,
            maxWidth: 650,
          },
          breakpoints: {
            mobile: 480,
            tablet: 768,
            desktop: 1024,
          },
          responsive: true,
          locale: 'en-US',
        },
      });

      expect(template).toBeDefined();
      expect(template.metadata.name).toBe('Test Template');
      expect(template.metadata.description).toBe('A test template');
      expect(template.metadata.author).toBe('Test Author');
      expect(template.metadata.version).toBe('1.0.0');
      expect(template.settings.target).toBe('email');
    });

    it('should emit TEMPLATE_CREATED event', async () => {
      const callback = vi.fn();
      templateManager.on(TemplateManagerEvent.TEMPLATE_CREATED, callback);

      await templateManager.create({
        name: 'Test Template',
        settings: {
          target: 'web',
          canvasDimensions: { width: 800 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      expect(callback).toHaveBeenCalled();
    });

    it('should build component tree if components are provided', async () => {
      const buttonComponent = registry.create('button');

      const template = await templateManager.create({
        name: 'Test Template',
        settings: {
          target: 'email',
          canvasDimensions: { width: 600 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
        components: [buttonComponent],
      });

      expect(template.componentTree).toBeDefined();
      expect(template.componentTree?.length).toBe(1);
    });
  });

  describe('load', () => {
    it('should load an existing template', async () => {
      // Create a template
      const created = await templateManager.create({
        name: 'Test Template',
        settings: {
          target: 'email',
          canvasDimensions: { width: 600 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      // Load it
      const loaded = await templateManager.load(created.metadata.id);

      expect(loaded).toBeDefined();
      expect(loaded.metadata.id).toBe(created.metadata.id);
      expect(loaded.metadata.name).toBe('Test Template');
    });

    it('should emit TEMPLATE_LOADED event', async () => {
      const created = await templateManager.create({
        name: 'Test Template',
        settings: {
          target: 'email',
          canvasDimensions: { width: 600 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      const callback = vi.fn();
      templateManager.on(TemplateManagerEvent.TEMPLATE_LOADED, callback);

      await templateManager.load(created.metadata.id);

      expect(callback).toHaveBeenCalled();
    });

    it('should set loaded template as current', async () => {
      const created = await templateManager.create({
        name: 'Test Template',
        settings: {
          target: 'email',
          canvasDimensions: { width: 600 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      await templateManager.load(created.metadata.id);

      const current = templateManager.getCurrentTemplate();
      expect(current).toBeDefined();
      expect(current?.metadata.id).toBe(created.metadata.id);
    });
  });

  describe('update', () => {
    it('should update template metadata', async () => {
      const created = await templateManager.create({
        name: 'Original Name',
        settings: {
          target: 'email',
          canvasDimensions: { width: 600 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      const updated = await templateManager.update(created.metadata.id, {
        metadata: {
          name: 'Updated Name',
          description: 'New description',
        },
      });

      expect(updated.metadata.name).toBe('Updated Name');
      expect(updated.metadata.description).toBe('New description');
    });

    it('should increment version on update', async () => {
      const created = await templateManager.create({
        name: 'Test Template',
        settings: {
          target: 'email',
          canvasDimensions: { width: 600 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      expect(created.metadata.version).toBe('1.0.0');

      const updated = await templateManager.update(created.metadata.id, {
        metadata: { name: 'Updated' },
      });

      expect(updated.metadata.version).toBe('1.0.1');
    });

    it('should emit TEMPLATE_UPDATED event', async () => {
      const created = await templateManager.create({
        name: 'Test Template',
        settings: {
          target: 'email',
          canvasDimensions: { width: 600 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      const callback = vi.fn();
      templateManager.on(TemplateManagerEvent.TEMPLATE_UPDATED, callback);

      await templateManager.update(created.metadata.id, {
        metadata: { name: 'Updated' },
      });

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a template', async () => {
      const created = await templateManager.create({
        name: 'Test Template',
        settings: {
          target: 'email',
          canvasDimensions: { width: 600 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      await templateManager.delete(created.metadata.id);

      const list = await templateManager.list();
      expect(list.length).toBe(0);
    });

    it('should emit TEMPLATE_DELETED event', async () => {
      const created = await templateManager.create({
        name: 'Test Template',
        settings: {
          target: 'email',
          canvasDimensions: { width: 600 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      const callback = vi.fn();
      templateManager.on(TemplateManagerEvent.TEMPLATE_DELETED, callback);

      await templateManager.delete(created.metadata.id);

      expect(callback).toHaveBeenCalled();
    });

    it('should clear current template if deleted', async () => {
      const created = await templateManager.create({
        name: 'Test Template',
        settings: {
          target: 'email',
          canvasDimensions: { width: 600 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      templateManager.setCurrentTemplate(created);
      await templateManager.delete(created.metadata.id);

      expect(templateManager.getCurrentTemplate()).toBeNull();
    });
  });

  describe('list', () => {
    it('should list all templates', async () => {
      await templateManager.create({
        name: 'Template 1',
        settings: {
          target: 'email',
          canvasDimensions: { width: 600 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      await templateManager.create({
        name: 'Template 2',
        settings: {
          target: 'web',
          canvasDimensions: { width: 800 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      const list = await templateManager.list();
      expect(list.length).toBe(2);
    });
  });

  describe('search', () => {
    it('should filter templates by category', async () => {
      await templateManager.create({
        name: 'Email Template',
        category: 'email',
        settings: {
          target: 'email',
          canvasDimensions: { width: 600 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      await templateManager.create({
        name: 'Web Template',
        category: 'web',
        settings: {
          target: 'web',
          canvasDimensions: { width: 800 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      const results = await templateManager.search({ category: 'email' });
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Email Template');
    });

    it('should filter templates by tags', async () => {
      await templateManager.create({
        name: 'Newsletter Template',
        tags: ['newsletter', 'marketing'],
        settings: {
          target: 'email',
          canvasDimensions: { width: 600 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      await templateManager.create({
        name: 'Transactional Template',
        tags: ['transactional'],
        settings: {
          target: 'email',
          canvasDimensions: { width: 600 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      const results = await templateManager.search({ tags: ['newsletter'] });
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Newsletter Template');
    });
  });

  describe('duplicate', () => {
    it('should duplicate a template', async () => {
      const original = await templateManager.create({
        name: 'Original Template',
        description: 'Original description',
        settings: {
          target: 'email',
          canvasDimensions: { width: 600 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      const duplicated = await templateManager.duplicate(original.metadata.id);

      expect(duplicated.metadata.id).not.toBe(original.metadata.id);
      expect(duplicated.metadata.name).toBe('Original Template (Copy)');
      expect(duplicated.metadata.description).toBe('Original description');
      expect(duplicated.metadata.version).toBe('1.0.0');
    });

    it('should allow custom name for duplicated template', async () => {
      const original = await templateManager.create({
        name: 'Original Template',
        settings: {
          target: 'email',
          canvasDimensions: { width: 600 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      const duplicated = await templateManager.duplicate(
        original.metadata.id,
        'Custom Copy Name'
      );

      expect(duplicated.metadata.name).toBe('Custom Copy Name');
    });
  });

  describe('validate', () => {
    it('should validate a valid template', async () => {
      const template = await templateManager.create({
        name: 'Valid Template',
        settings: {
          target: 'email',
          canvasDimensions: { width: 600 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      const result = templateManager.validate(template);
      expect(result.valid).toBe(true);
      expect(result.errors.filter((e) => e.severity === 'error').length).toBe(0);
    });

    it('should emit TEMPLATE_VALIDATED event', async () => {
      const template = await templateManager.create({
        name: 'Test Template',
        settings: {
          target: 'email',
          canvasDimensions: { width: 600 },
          breakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
          responsive: true,
          locale: 'en-US',
        },
      });

      const callback = vi.fn();
      templateManager.on(TemplateManagerEvent.TEMPLATE_VALIDATED, callback);

      templateManager.validate(template);

      // Wait for microtask to complete
      await new Promise(resolve => queueMicrotask(resolve));

      expect(callback).toHaveBeenCalled();
    });
  });
});
