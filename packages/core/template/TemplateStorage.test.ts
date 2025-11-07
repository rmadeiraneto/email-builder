/**
 * Template Storage Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TemplateStorage } from './TemplateStorage';
import type { StorageAdapter } from '../types/config.types';
import type { Template } from '../types/template.types';

describe('TemplateStorage', () => {
  let storage: TemplateStorage;
  let mockAdapter: StorageAdapter;
  let storageData: Map<string, unknown>;

  beforeEach(() => {
    storageData = new Map();

    mockAdapter = {
      get: vi.fn(async (key: string) => storageData.get(key) || null),
      set: vi.fn(async (key: string, value: unknown) => {
        storageData.set(key, value);
      }),
      remove: vi.fn(async (key: string) => {
        storageData.delete(key);
      }),
      clear: vi.fn(async () => {
        storageData.clear();
      }),
      keys: vi.fn(async () => Array.from(storageData.keys())),
    };

    storage = new TemplateStorage(mockAdapter);
  });

  const createTestTemplate = (): Template => ({
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
    components: [],
  });

  describe('save', () => {
    it('should save template to storage', async () => {
      const template = createTestTemplate();

      await storage.save(template);

      expect(mockAdapter.set).toHaveBeenCalled();
      const key = (mockAdapter.set as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(key).toContain('template-1');
    });

    it('should update savedAt timestamp', async () => {
      const template = createTestTemplate();
      const beforeTime = Date.now();

      await storage.save(template);

      const savedData = storageData.get('email-builder:template:template-1');
      expect((savedData as any).savedAt).toBeGreaterThanOrEqual(beforeTime);
    });
  });

  describe('load', () => {
    it('should load template from storage', async () => {
      const template = createTestTemplate();
      await storage.save(template);

      const loaded = await storage.load('template-1');

      expect(loaded.metadata.id).toBe('template-1');
      expect(loaded.metadata.name).toBe('Test Template');
    });

    it('should throw error if template not found', async () => {
      await expect(storage.load('nonexistent')).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete template from storage', async () => {
      const template = createTestTemplate();
      await storage.save(template);

      await storage.delete('template-1');

      expect(mockAdapter.remove).toHaveBeenCalled();
    });
  });

  describe('exists', () => {
    it('should return true for existing template', async () => {
      const template = createTestTemplate();
      await storage.save(template);

      const exists = await storage.exists('template-1');

      expect(exists).toBe(true);
    });

    it('should return false for nonexistent template', async () => {
      const exists = await storage.exists('nonexistent');

      expect(exists).toBe(false);
    });
  });

  describe('list', () => {
    it('should list all templates', async () => {
      await storage.save(createTestTemplate());

      const template2 = createTestTemplate();
      template2.metadata.id = 'template-2';
      await storage.save(template2);

      const list = await storage.list();

      expect(list.length).toBeGreaterThanOrEqual(2);
    });
  });
});
