/**
 * Template Storage Service
 *
 * Handles template persistence using configured storage adapters
 */

import type {
  Template,
  TemplateSaveData,
  TemplateListItem,
} from '../types/template.types';
import type { StorageAdapter } from '../types/config.types';

/**
 * Storage error types
 */
export class TemplateStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TemplateStorageError';
  }
}

/**
 * Template Storage Service
 *
 * Provides persistence layer for templates using configured storage adapters
 */
export class TemplateStorage {
  private adapter: StorageAdapter;
  private keyPrefix: string;

  constructor(adapter: StorageAdapter, keyPrefix = 'email-builder') {
    this.adapter = adapter;
    this.keyPrefix = keyPrefix;
  }

  /**
   * Save template to storage
   *
   * @param template - Template to save
   * @returns Promise resolving when save is complete
   * @throws {TemplateStorageError} If save fails
   */
  async save(template: Template): Promise<void> {
    try {
      const saveData: TemplateSaveData = {
        template,
        savedAt: Date.now(),
        checksum: this.generateChecksum(template),
        compressed: false,
      };

      const key = this.getTemplateKey(template.metadata.id);
      await this.adapter.set(key, saveData);

      // Update template list metadata
      await this.updateTemplateList(template);
    } catch (error) {
      throw new TemplateStorageError(
        `Failed to save template ${template.metadata.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Load template from storage
   *
   * @param templateId - Template ID to load
   * @returns Promise resolving to template data
   * @throws {TemplateStorageError} If template not found or load fails
   */
  async load(templateId: string): Promise<Template> {
    try {
      const key = this.getTemplateKey(templateId);
      const saveData = await this.adapter.get<TemplateSaveData>(key);

      if (!saveData) {
        throw new TemplateStorageError(`Template not found: ${templateId}`);
      }

      // Validate checksum if present
      if (saveData.checksum) {
        const currentChecksum = this.generateChecksum(saveData.template);
        if (currentChecksum !== saveData.checksum) {
          console.warn(
            `Template ${templateId} checksum mismatch. Data may be corrupted.`
          );
        }
      }

      return saveData.template;
    } catch (error) {
      if (error instanceof TemplateStorageError) {
        throw error;
      }
      throw new TemplateStorageError(
        `Failed to load template ${templateId}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Delete template from storage
   *
   * @param templateId - Template ID to delete
   * @returns Promise resolving when delete is complete
   * @throws {TemplateStorageError} If delete fails
   */
  async delete(templateId: string): Promise<void> {
    try {
      const key = this.getTemplateKey(templateId);
      await this.adapter.remove(key);

      // Remove from template list
      await this.removeFromTemplateList(templateId);
    } catch (error) {
      throw new TemplateStorageError(
        `Failed to delete template ${templateId}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Check if template exists in storage
   *
   * @param templateId - Template ID to check
   * @returns Promise resolving to true if template exists
   */
  async exists(templateId: string): Promise<boolean> {
    try {
      const key = this.getTemplateKey(templateId);
      const data = await this.adapter.get(key);
      return data !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * List all templates
   *
   * @returns Promise resolving to array of template list items
   */
  async list(): Promise<TemplateListItem[]> {
    try {
      const key = this.getListKey();
      const list = await this.adapter.get<TemplateListItem[]>(key);
      return list || [];
    } catch (error) {
      console.warn('Failed to load template list:', error);
      return [];
    }
  }

  /**
   * Search templates by criteria
   *
   * @param criteria - Search criteria
   * @returns Promise resolving to filtered template list items
   */
  async search(criteria: {
    tags?: string[];
    category?: string;
    target?: string;
    searchTerm?: string;
  }): Promise<TemplateListItem[]> {
    const list = await this.list();

    return list.filter((item) => {
      // Filter by tags
      if (criteria.tags && criteria.tags.length > 0) {
        if (!item.tags || !criteria.tags.some((tag) => item.tags?.includes(tag))) {
          return false;
        }
      }

      // Filter by category
      if (criteria.category && item.category !== criteria.category) {
        return false;
      }

      // Filter by target
      if (criteria.target && item.target !== criteria.target) {
        return false;
      }

      // Filter by search term
      if (criteria.searchTerm) {
        const term = criteria.searchTerm.toLowerCase();
        const nameMatch = item.name.toLowerCase().includes(term);
        const descMatch = item.description?.toLowerCase().includes(term);
        const tagMatch = item.tags?.some((tag) =>
          tag.toLowerCase().includes(term)
        );

        if (!nameMatch && !descMatch && !tagMatch) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Get template metadata without loading full template
   *
   * @param templateId - Template ID
   * @returns Promise resolving to template list item or null
   */
  async getMetadata(templateId: string): Promise<TemplateListItem | null> {
    const list = await this.list();
    return list.find((item) => item.id === templateId) || null;
  }

  /**
   * Clear all templates from storage
   *
   * @returns Promise resolving when clear is complete
   * @throws {TemplateStorageError} If clear fails
   */
  async clear(): Promise<void> {
    try {
      // Get all templates
      const list = await this.list();

      // Delete each template
      await Promise.all(list.map((item) => this.delete(item.id)));

      // Clear the list
      const listKey = this.getListKey();
      await this.adapter.remove(listKey);
    } catch (error) {
      throw new TemplateStorageError(
        `Failed to clear templates: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Export template as JSON string
   *
   * @param template - Template to export
   * @param prettyPrint - Whether to format JSON with indentation
   * @returns JSON string
   */
  exportAsJSON(template: Template, prettyPrint = true): string {
    const saveData: TemplateSaveData = {
      template,
      savedAt: Date.now(),
      checksum: this.generateChecksum(template),
      compressed: false,
    };

    return JSON.stringify(saveData, null, prettyPrint ? 2 : 0);
  }

  /**
   * Import template from JSON string
   *
   * @param jsonString - JSON string to import
   * @returns Imported template
   * @throws {TemplateStorageError} If import fails
   */
  importFromJSON(jsonString: string): Template {
    try {
      const saveData = JSON.parse(jsonString) as TemplateSaveData;

      if (!saveData.template) {
        throw new Error('Invalid template data: missing template property');
      }

      // Validate checksum if present
      if (saveData.checksum) {
        const currentChecksum = this.generateChecksum(saveData.template);
        if (currentChecksum !== saveData.checksum) {
          console.warn('Template checksum mismatch. Data may be corrupted.');
        }
      }

      return saveData.template;
    } catch (error) {
      throw new TemplateStorageError(
        `Failed to import template from JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Update template list metadata
   */
  private async updateTemplateList(template: Template): Promise<void> {
    const list = await this.list();

    // Remove existing entry if present
    const filteredList = list.filter((item) => item.id !== template.metadata.id);

    // Create list item from template
    const listItem: TemplateListItem = {
      id: template.metadata.id,
      name: template.metadata.name,
      ...(template.metadata.description !== undefined && { description: template.metadata.description }),
      ...(template.metadata.thumbnail !== undefined && { thumbnail: template.metadata.thumbnail }),
      ...(template.metadata.tags !== undefined && { tags: template.metadata.tags }),
      ...(template.metadata.category !== undefined && { category: template.metadata.category }),
      updatedAt: template.metadata.updatedAt,
      target: template.settings.target,
      ...(template.customData?.['isCustom'] !== undefined && { isCustom: template.customData['isCustom'] }),
    };

    // Add to list
    filteredList.push(listItem);

    // Sort by updatedAt (most recent first)
    filteredList.sort((a, b) => b.updatedAt - a.updatedAt);

    // Save updated list
    const key = this.getListKey();
    await this.adapter.set(key, filteredList);
  }

  /**
   * Remove template from list
   */
  private async removeFromTemplateList(templateId: string): Promise<void> {
    const list = await this.list();
    const filteredList = list.filter((item) => item.id !== templateId);

    const key = this.getListKey();
    await this.adapter.set(key, filteredList);
  }

  /**
   * Generate storage key for template
   */
  private getTemplateKey(templateId: string): string {
    return `${this.keyPrefix}:template:${templateId}`;
  }

  /**
   * Generate storage key for template list
   */
  private getListKey(): string {
    return `${this.keyPrefix}:templates:list`;
  }

  /**
   * Generate checksum for template data integrity
   *
   * Simple implementation using JSON string length and hash
   */
  private generateChecksum(template: Template): string {
    const str = JSON.stringify(template);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `${str.length}-${hash}`;
  }
}
