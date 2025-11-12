/**
 * Preset Manager Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PresetManager, PresetManagerError } from './PresetManager';
import { PresetStorage } from './PresetStorage';
import type { ComponentRegistry } from '../components/ComponentRegistry';
import type { ComponentPreset } from '../types/component.types';

// Helper to wait for async event emissions
const waitForEmit = () => new Promise(resolve => setTimeout(resolve, 10));

describe('PresetManager', () => {
  let manager: PresetManager;
  let mockStorage: PresetStorage;
  let mockRegistry: ComponentRegistry;

  beforeEach(() => {
    // Mock storage
    mockStorage = {
      save: vi.fn(),
      load: vi.fn(),
      delete: vi.fn(),
      list: vi.fn(async () => []),
      search: vi.fn(async () => []),
      getMetadata: vi.fn(async () => null),
      exportAsJSON: vi.fn((_, preset) => JSON.stringify(preset)),
      importFromJSON: vi.fn((json) => ({
        componentType: 'button',
        preset: JSON.parse(json),
      })),
    } as unknown as PresetStorage;

    // Mock registry
    mockRegistry = {
      addPreset: vi.fn(),
      getPreset: vi.fn(),
      updatePreset: vi.fn(),
      removePreset: vi.fn(),
    } as unknown as ComponentRegistry;

    manager = new PresetManager(mockStorage, mockRegistry);
  });

  describe('create', () => {
    it('should create new preset', async () => {
      const preset = await manager.create({
        componentType: 'button',
        name: 'Test Preset',
        styles: { color: 'blue' },
      });

      expect(preset.id).toBeDefined();
      expect(preset.name).toBe('Test Preset');
      expect(preset.isCustom).toBe(true);
      expect(mockRegistry.addPreset).toHaveBeenCalled();
      expect(mockStorage.save).toHaveBeenCalled();
    });

    it('should throw PresetManagerError on failure', async () => {
      (mockRegistry.addPreset as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
        throw new Error('Registry error');
      });

      await expect(
        manager.create({
          componentType: 'button',
          name: 'Test',
          styles: {},
        })
      ).rejects.toThrow(PresetManagerError);
    });
  });

  describe('load', () => {
    it('should load preset from storage', async () => {
      const mockPreset: ComponentPreset = {
        id: 'preset-1',
        name: 'Test',
        styles: {},
        isCustom: true,
        createdAt: Date.now(),
      };

      (mockStorage.load as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockPreset);

      const preset = await manager.load('button', 'preset-1');

      expect(preset).toEqual(mockPreset);
      expect(mockStorage.load).toHaveBeenCalledWith('button', 'preset-1');
    });

    it('should throw PresetManagerError on failure', async () => {
      (mockStorage.load as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Not found')
      );

      await expect(manager.load('button', 'nonexistent')).rejects.toThrow(
        PresetManagerError
      );
    });
  });

  describe('update', () => {
    it('should update preset', async () => {
      const existingPreset: ComponentPreset = {
        id: 'preset-1',
        name: 'Original',
        styles: { color: 'red' },
        isCustom: true,
        createdAt: 100,
      };

      (mockStorage.load as ReturnType<typeof vi.fn>).mockResolvedValueOnce(existingPreset);

      const updated = await manager.update('button', 'preset-1', {
        name: 'Updated',
      });

      expect(updated.name).toBe('Updated');
      expect(updated.id).toBe('preset-1'); // ID should not change
      expect(updated.createdAt).toBe(100); // createdAt should not change
      expect(mockStorage.save).toHaveBeenCalled();
    });

    it('should merge styles', async () => {
      const existingPreset: ComponentPreset = {
        id: 'preset-1',
        name: 'Test',
        styles: { color: 'red', fontSize: '16px' },
        isCustom: true,
        createdAt: Date.now(),
      };

      (mockStorage.load as ReturnType<typeof vi.fn>).mockResolvedValueOnce(existingPreset);

      const updated = await manager.update('button', 'preset-1', {
        styles: { color: 'blue' },
      });

      expect(updated.styles).toEqual({ color: 'blue', fontSize: '16px' });
    });
  });

  describe('delete', () => {
    it('should delete preset', async () => {
      await manager.delete('button', 'preset-1');

      expect(mockRegistry.removePreset).toHaveBeenCalledWith('button', 'preset-1');
      expect(mockStorage.delete).toHaveBeenCalledWith('button', 'preset-1');
    });
  });

  describe('apply', () => {
    it('should apply preset to component', async () => {
      const component = {
        id: 'comp-1',
        type: 'button' as const,
        styles: { fontSize: '16px' },
        children: [],
      };

      const preset: ComponentPreset = {
        id: 'preset-1',
        name: 'Test',
        styles: { color: 'blue' },
        isCustom: true,
        createdAt: Date.now(),
      };

      (mockRegistry.getPreset as ReturnType<typeof vi.fn>).mockReturnValueOnce(preset);

      const result = await manager.apply(component, 'button', 'preset-1');

      expect(result.styles).toEqual({ fontSize: '16px', color: 'blue' });
    });

    it('should load preset if not in registry', async () => {
      const component = {
        id: 'comp-1',
        type: 'button' as const,
        styles: {},
        children: [],
      };

      const preset: ComponentPreset = {
        id: 'preset-1',
        name: 'Test',
        styles: { color: 'blue' },
        isCustom: true,
        createdAt: Date.now(),
      };

      (mockRegistry.getPreset as ReturnType<typeof vi.fn>).mockReturnValueOnce(null);
      (mockStorage.load as ReturnType<typeof vi.fn>).mockResolvedValueOnce(preset);

      const result = await manager.apply(component, 'button', 'preset-1');

      expect(mockStorage.load).toHaveBeenCalledWith('button', 'preset-1');
      expect(result.styles).toEqual({ color: 'blue' });
    });
  });

  describe('duplicate', () => {
    it('should duplicate preset', async () => {
      const original: ComponentPreset = {
        id: 'preset-1',
        name: 'Original',
        styles: { color: 'blue' },
        isCustom: false,
        createdAt: 100,
      };

      (mockStorage.load as ReturnType<typeof vi.fn>).mockResolvedValueOnce(original);

      const duplicated = await manager.duplicate('button', 'preset-1', 'Copy');

      expect(duplicated.id).not.toBe('preset-1');
      expect(duplicated.name).toBe('Copy');
      expect(duplicated.isCustom).toBe(true); // Always custom
      expect(duplicated.styles).toEqual(original.styles);
      expect(duplicated.createdAt).toBeGreaterThan(100);
    });

    it('should use default name if not provided', async () => {
      const original: ComponentPreset = {
        id: 'preset-1',
        name: 'Original',
        styles: {},
        isCustom: true,
        createdAt: Date.now(),
      };

      (mockStorage.load as ReturnType<typeof vi.fn>).mockResolvedValueOnce(original);

      const duplicated = await manager.duplicate('button', 'preset-1');

      expect(duplicated.name).toBe('Original (Copy)');
    });
  });

  describe('list and search', () => {
    it('should list presets', async () => {
      await manager.list('button');

      expect(mockStorage.list).toHaveBeenCalledWith('button');
    });

    it('should search presets', async () => {
      await manager.search({ searchTerm: 'blue' });

      expect(mockStorage.search).toHaveBeenCalledWith({ searchTerm: 'blue' });
    });
  });

  describe('event system', () => {
    it('should emit event on preset creation', async () => {
      const callback = vi.fn();
      manager.on('preset:created', callback);

      await manager.create({
        componentType: 'button',
        name: 'Test',
        styles: {},
      });

      // Wait for setTimeout to complete
      await waitForEmit();

      expect(callback).toHaveBeenCalled();
    });

    it('should allow unsubscribing from events', async () => {
      const callback = vi.fn();
      const subscription = manager.on('preset:created', callback);

      subscription.unsubscribe();

      await manager.create({
        componentType: 'button',
        name: 'Test',
        styles: {},
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('import/export', () => {
    it('should export preset as JSON', async () => {
      const preset: ComponentPreset = {
        id: 'preset-1',
        name: 'Test',
        styles: {},
        isCustom: true,
        createdAt: Date.now(),
      };

      (mockStorage.load as ReturnType<typeof vi.fn>).mockResolvedValueOnce(preset);

      const json = await manager.exportAsJSON('button', 'preset-1');

      expect(mockStorage.exportAsJSON).toHaveBeenCalled();
      expect(typeof json).toBe('string');
    });

    it('should import preset from JSON', async () => {
      const json = JSON.stringify({
        id: 'old-id',
        name: 'Imported',
        styles: {},
        isCustom: false,
      });

      const imported = await manager.importFromJSON(json);

      expect(imported.id).not.toBe('old-id'); // Should generate new ID
      expect(imported.name).toBe('Imported');
      expect(imported.isCustom).toBe(true); // Should be custom
      expect(mockStorage.save).toHaveBeenCalled();
    });
  });
});
