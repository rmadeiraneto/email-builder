/**
 * Preset Storage Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PresetStorage, PresetStorageError } from './PresetStorage';
import type { StorageAdapter } from '../types/config.types';
import type { ComponentPreset } from '../types/component.types';

describe('PresetStorage', () => {
  let storage: PresetStorage;
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

    storage = new PresetStorage(mockAdapter, 'test');
  });

  describe('save', () => {
    it('should save preset to storage', async () => {
      const preset: ComponentPreset = {
        id: 'preset-1',
        name: 'Test Preset',
        styles: { color: 'blue' },
        isCustom: true,
        createdAt: Date.now(),
      };

      await storage.save('button', preset);

      expect(mockAdapter.set).toHaveBeenCalled();
      const savedKey = (mockAdapter.set as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(savedKey).toContain('button');
      expect(savedKey).toContain('preset-1');
    });

    it('should include checksum in saved data', async () => {
      const preset: ComponentPreset = {
        id: 'preset-1',
        name: 'Test Preset',
        styles: { color: 'blue' },
        isCustom: true,
        createdAt: Date.now(),
      };

      await storage.save('button', preset);

      const savedData = storageData.get('test:preset:button:preset-1');
      expect(savedData).toHaveProperty('checksum');
    });

    it('should update preset list metadata when saving', async () => {
      const preset: ComponentPreset = {
        id: 'preset-1',
        name: 'Test Preset',
        styles: { color: 'blue' },
        isCustom: true,
        createdAt: Date.now(),
      };

      await storage.save('button', preset);

      const list = await storage.list();
      expect(list).toHaveLength(1);
      expect(list[0].id).toBe('preset-1');
      expect(list[0].name).toBe('Test Preset');
    });

    it('should throw PresetStorageError on save failure', async () => {
      (mockAdapter.set as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Storage error')
      );

      const preset: ComponentPreset = {
        id: 'preset-1',
        name: 'Test Preset',
        styles: { color: 'blue' },
        isCustom: true,
        createdAt: Date.now(),
      };

      await expect(storage.save('button', preset)).rejects.toThrow(
        PresetStorageError
      );
    });
  });

  describe('load', () => {
    it('should load preset from storage', async () => {
      const preset: ComponentPreset = {
        id: 'preset-1',
        name: 'Test Preset',
        styles: { color: 'blue' },
        isCustom: true,
        createdAt: Date.now(),
      };

      await storage.save('button', preset);

      const loaded = await storage.load('button', 'preset-1');

      expect(loaded.id).toBe('preset-1');
      expect(loaded.name).toBe('Test Preset');
      expect(loaded.styles).toEqual({ color: 'blue' });
    });

    it('should throw error if preset not found', async () => {
      await expect(storage.load('button', 'nonexistent')).rejects.toThrow(
        'Preset not found'
      );
    });

    it('should warn on checksum mismatch', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const preset: ComponentPreset = {
        id: 'preset-1',
        name: 'Test Preset',
        styles: { color: 'blue' },
        isCustom: true,
        createdAt: Date.now(),
      };

      await storage.save('button', preset);

      // Corrupt the data
      const key = 'test:preset:button:preset-1';
      const data = storageData.get(key) as any;
      data.checksum = 'invalid';
      storageData.set(key, data);

      await storage.load('button', 'preset-1');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('checksum mismatch')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('delete', () => {
    it('should delete preset from storage', async () => {
      const preset: ComponentPreset = {
        id: 'preset-1',
        name: 'Test Preset',
        styles: { color: 'blue' },
        isCustom: true,
        createdAt: Date.now(),
      };

      await storage.save('button', preset);

      await storage.delete('button', 'preset-1');

      expect(mockAdapter.remove).toHaveBeenCalledWith('test:preset:button:preset-1');
    });

    it('should remove preset from list', async () => {
      const preset: ComponentPreset = {
        id: 'preset-1',
        name: 'Test Preset',
        styles: { color: 'blue' },
        isCustom: true,
        createdAt: Date.now(),
      };

      await storage.save('button', preset);

      await storage.delete('button', 'preset-1');

      const list = await storage.list();
      expect(list).toHaveLength(0);
    });
  });

  describe('exists', () => {
    it('should return true for existing preset', async () => {
      const preset: ComponentPreset = {
        id: 'preset-1',
        name: 'Test Preset',
        styles: { color: 'blue' },
        isCustom: true,
        createdAt: Date.now(),
      };

      await storage.save('button', preset);

      const exists = await storage.exists('button', 'preset-1');
      expect(exists).toBe(true);
    });

    it('should return false for nonexistent preset', async () => {
      const exists = await storage.exists('button', 'nonexistent');
      expect(exists).toBe(false);
    });
  });

  describe('list', () => {
    it('should return all presets when no filter specified', async () => {
      const preset1: ComponentPreset = {
        id: 'preset-1',
        name: 'Preset 1',
        styles: {},
        isCustom: true,
        createdAt: Date.now(),
      };

      const preset2: ComponentPreset = {
        id: 'preset-2',
        name: 'Preset 2',
        styles: {},
        isCustom: true,
        createdAt: Date.now(),
      };

      await storage.save('button', preset1);
      await storage.save('text', preset2);

      const list = await storage.list();

      expect(list).toHaveLength(2);
    });

    it('should filter presets by component type', async () => {
      const preset1: ComponentPreset = {
        id: 'preset-1',
        name: 'Preset 1',
        styles: {},
        isCustom: true,
        createdAt: Date.now(),
      };

      const preset2: ComponentPreset = {
        id: 'preset-2',
        name: 'Preset 2',
        styles: {},
        isCustom: true,
        createdAt: Date.now(),
      };

      await storage.save('button', preset1);
      await storage.save('text', preset2);

      const list = await storage.list('button');

      expect(list).toHaveLength(1);
      expect(list[0].componentType).toBe('button');
    });

    it('should return empty array if list not found', async () => {
      const list = await storage.list();

      expect(list).toEqual([]);
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      const preset1: ComponentPreset = {
        id: 'preset-1',
        name: 'Blue Button',
        description: 'A blue button preset',
        styles: {},
        isCustom: true,
        createdAt: Date.now(),
      };

      const preset2: ComponentPreset = {
        id: 'preset-2',
        name: 'Red Button',
        description: 'A red button preset',
        styles: {},
        isCustom: false,
        createdAt: Date.now(),
      };

      await storage.save('button', preset1);
      await storage.save('button', preset2);
    });

    it('should search by name', async () => {
      const results = await storage.search({ searchTerm: 'Blue' });

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Blue Button');
    });

    it('should search by description', async () => {
      const results = await storage.search({ searchTerm: 'red' });

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Red Button');
    });

    it('should filter by isCustom flag', async () => {
      const results = await storage.search({ isCustom: true });

      expect(results).toHaveLength(1);
      expect(results[0].isCustom).toBe(true);
    });

    it('should combine multiple criteria', async () => {
      const results = await storage.search({
        componentType: 'button',
        searchTerm: 'button',
        isCustom: true,
      });

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('preset-1');
    });
  });

  describe('getMetadata', () => {
    it('should return metadata for existing preset', async () => {
      const preset: ComponentPreset = {
        id: 'preset-1',
        name: 'Test Preset',
        description: 'Test description',
        styles: {},
        isCustom: true,
        createdAt: Date.now(),
      };

      await storage.save('button', preset);

      const metadata = await storage.getMetadata('button', 'preset-1');

      expect(metadata).toBeDefined();
      expect(metadata?.name).toBe('Test Preset');
      expect(metadata?.description).toBe('Test description');
    });

    it('should return null for nonexistent preset', async () => {
      const metadata = await storage.getMetadata('button', 'nonexistent');

      expect(metadata).toBeNull();
    });
  });

  describe('clear', () => {
    beforeEach(async () => {
      await storage.save('button', {
        id: '1',
        name: 'Preset 1',
        styles: {},
        isCustom: true,
        createdAt: Date.now(),
      });
      await storage.save('text', {
        id: '2',
        name: 'Preset 2',
        styles: {},
        isCustom: true,
        createdAt: Date.now(),
      });
    });

    it('should clear presets for specific component type', async () => {
      await storage.clear('button');

      const buttonPresets = await storage.list('button');
      const textPresets = await storage.list('text');

      expect(buttonPresets).toHaveLength(0);
      expect(textPresets).toHaveLength(1);
    });

    it('should clear all presets when no type specified', async () => {
      await storage.clear();

      const list = await storage.list();

      expect(list).toHaveLength(0);
    });
  });

  describe('exportAsJSON', () => {
    it('should export preset as JSON string', () => {
      const preset: ComponentPreset = {
        id: 'preset-1',
        name: 'Test Preset',
        styles: { color: 'blue' },
        isCustom: true,
        createdAt: Date.now(),
      };

      const json = storage.exportAsJSON('button', preset);

      expect(typeof json).toBe('string');

      const parsed = JSON.parse(json);
      expect(parsed.componentType).toBe('button');
      expect(parsed.preset.id).toBe('preset-1');
      expect(parsed.checksum).toBeDefined();
    });

    it('should support pretty print option', () => {
      const preset: ComponentPreset = {
        id: 'preset-1',
        name: 'Test Preset',
        styles: {},
        isCustom: true,
        createdAt: Date.now(),
      };

      const prettyJson = storage.exportAsJSON('button', preset, true);
      const compactJson = storage.exportAsJSON('button', preset, false);

      expect(prettyJson.length).toBeGreaterThan(compactJson.length);
      expect(prettyJson).toContain('\n');
      expect(compactJson).not.toContain('\n');
    });
  });

  describe('importFromJSON', () => {
    it('should import preset from JSON string', () => {
      const preset: ComponentPreset = {
        id: 'preset-1',
        name: 'Test Preset',
        styles: { color: 'blue' },
        isCustom: true,
        createdAt: Date.now(),
      };

      const json = storage.exportAsJSON('button', preset);
      const imported = storage.importFromJSON(json);

      expect(imported.componentType).toBe('button');
      expect(imported.preset.id).toBe('preset-1');
      expect(imported.preset.name).toBe('Test Preset');
    });

    it('should throw error for invalid JSON', () => {
      expect(() => storage.importFromJSON('invalid json')).toThrow(
        PresetStorageError
      );
    });

    it('should throw error for missing preset property', () => {
      expect(() => storage.importFromJSON('{}')).toThrow(
        PresetStorageError
      );
    });

    it('should warn on checksum mismatch', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const json = JSON.stringify({
        componentType: 'button',
        preset: { id: '1', name: 'Test', styles: {}, isCustom: true },
        checksum: 'invalid',
      });

      storage.importFromJSON(json);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('checksum mismatch')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('exportAllAsJSON', () => {
    it('should export all presets for component type', async () => {
      await storage.save('button', {
        id: '1',
        name: 'Preset 1',
        styles: {},
        isCustom: true,
        createdAt: Date.now(),
      });
      await storage.save('button', {
        id: '2',
        name: 'Preset 2',
        styles: {},
        isCustom: true,
        createdAt: Date.now(),
      });

      const json = await storage.exportAllAsJSON('button');
      const parsed = JSON.parse(json);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(2);
      expect(parsed[0].componentType).toBe('button');
    });
  });

  describe('importManyFromJSON', () => {
    it('should import multiple presets from JSON', async () => {
      const json = await storage.exportAllAsJSON('button');

      // First create some presets
      await storage.save('button', {
        id: '1',
        name: 'Preset 1',
        styles: {},
        isCustom: true,
        createdAt: Date.now(),
      });
      await storage.save('button', {
        id: '2',
        name: 'Preset 2',
        styles: {},
        isCustom: true,
        createdAt: Date.now(),
      });

      const exportedJson = await storage.exportAllAsJSON('button');
      const imported = storage.importManyFromJSON(exportedJson);

      expect(Array.isArray(imported)).toBe(true);
      expect(imported).toHaveLength(2);
    });

    it('should throw error for non-array JSON', () => {
      expect(() => storage.importManyFromJSON('{}')).toThrow(
        PresetStorageError
      );
    });
  });
});
