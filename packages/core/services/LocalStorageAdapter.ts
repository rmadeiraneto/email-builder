/**
 * Local Storage Adapter
 *
 * Implementation of StorageAdapter for browser localStorage
 */

import type { StorageAdapter } from '../types/config.types';

/**
 * Local Storage Adapter
 *
 * Provides localStorage-based persistence
 */
export class LocalStorageAdapter implements StorageAdapter {
  /**
   * Get value from localStorage
   */
  async get<T = unknown>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Failed to get item from localStorage: ${key}`, error);
      return null;
    }
  }

  /**
   * Set value in localStorage
   */
  async set<T = unknown>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw new Error(
        `Failed to set item in localStorage: ${key} - ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Remove value from localStorage
   */
  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      throw new Error(
        `Failed to remove item from localStorage: ${key} - ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Clear all localStorage
   */
  async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      throw new Error(
        `Failed to clear localStorage - ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
