/**
 * Local Storage Adapter Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageAdapter } from './LocalStorageAdapter';

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter;
  let mockStorage: Storage;

  beforeEach(() => {
    const storage = new Map<string, string>();

    mockStorage = {
      getItem: vi.fn((key: string) => storage.get(key) || null),
      setItem: vi.fn((key: string, value: string) => {
        storage.set(key, value);
      }),
      removeItem: vi.fn((key: string) => {
        storage.delete(key);
      }),
      clear: vi.fn(() => {
        storage.clear();
      }),
      key: vi.fn((index: number) => Array.from(storage.keys())[index] || null),
      length: storage.size,
    };

    global.localStorage = mockStorage as Storage;
    adapter = new LocalStorageAdapter();
  });

  describe('get', () => {
    it('should get value from localStorage', async () => {
      mockStorage.setItem('test-key', JSON.stringify({ value: 'test' }));

      const result = await adapter.get<{ value: string }>('test-key');

      expect(result).toEqual({ value: 'test' });
      expect(mockStorage.getItem).toHaveBeenCalledWith('test-key');
    });

    it('should return null for non-existent key', async () => {
      const result = await adapter.get('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle JSON parse errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockStorage.setItem('bad-key', 'invalid json{');

      const result = await adapter.get('bad-key');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('set', () => {
    it('should set value in localStorage', async () => {
      await adapter.set('test-key', { value: 'test' });

      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify({ value: 'test' })
      );
    });

    it('should throw error on storage failure', async () => {
      (mockStorage.setItem as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
        throw new Error('Storage full');
      });

      await expect(adapter.set('test', 'value')).rejects.toThrow(
        'Failed to set item in localStorage'
      );
    });
  });

  describe('remove', () => {
    it('should remove value from localStorage', async () => {
      mockStorage.setItem('test-key', 'value');

      await adapter.remove('test-key');

      expect(mockStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('should throw error on removal failure', async () => {
      (mockStorage.removeItem as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
        throw new Error('Removal error');
      });

      await expect(adapter.remove('test')).rejects.toThrow(
        'Failed to remove item from localStorage'
      );
    });
  });

  describe('clear', () => {
    it('should clear all localStorage', async () => {
      mockStorage.setItem('key1', 'value1');
      mockStorage.setItem('key2', 'value2');

      await adapter.clear();

      expect(mockStorage.clear).toHaveBeenCalled();
    });

    it('should throw error on clear failure', async () => {
      (mockStorage.clear as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
        throw new Error('Clear error');
      });

      await expect(adapter.clear()).rejects.toThrow(
        'Failed to clear localStorage'
      );
    });
  });
});
