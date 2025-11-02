/**
 * Save Template Command
 *
 * Saves the current template to storage
 */

import type { UndoableCommand } from '../types/command.types';
import { CommandType } from '../types/command.types';
import type { Template } from '../types/template.types';
import type { TemplateManager } from '../template/TemplateManager';

/**
 * Save template payload
 */
export interface SaveTemplatePayload {
  /**
   * Template to save
   */
  template: Template;

  /**
   * Whether to create new version
   */
  createVersion?: boolean;
}

/**
 * Save Template Command
 *
 * Saves template to storage and maintains version history
 */
export class SaveTemplateCommand implements UndoableCommand<SaveTemplatePayload> {
  public readonly type = CommandType.SAVE_TEMPLATE;
  public readonly timestamp: number;
  public readonly id: string;
  public readonly payload: SaveTemplatePayload;

  private previousTemplate?: Template | null;
  private savedTemplate?: Template;

  constructor(
    payload: SaveTemplatePayload,
    private templateManager: TemplateManager
  ) {
    this.payload = payload;
    this.timestamp = Date.now();
    this.id = `save-template-${this.timestamp}`;
  }

  /**
   * Execute save operation
   */
  public async execute(): Promise<void> {
    try {
      // Store previous state
      this.previousTemplate = this.templateManager.getCurrentTemplate();

      const { template } = this.payload;

      // Check if template exists
      const metadata = await this.templateManager.getMetadata(template.metadata.id);

      if (metadata) {
        // Update existing template
        this.savedTemplate = await this.templateManager.update(
          template.metadata.id,
          {
            metadata: {
              name: template.metadata.name,
              ...(template.metadata.description !== undefined && { description: template.metadata.description }),
              ...(template.metadata.author !== undefined && { author: template.metadata.author }),
              ...(template.metadata.category !== undefined && { category: template.metadata.category }),
              ...(template.metadata.tags !== undefined && { tags: template.metadata.tags }),
              ...(template.metadata.thumbnail !== undefined && { thumbnail: template.metadata.thumbnail }),
              version: template.metadata.version,
              updatedAt: Date.now(),
            },
            settings: template.settings,
            generalStyles: template.generalStyles,
            components: template.components,
          }
        );
      } else {
        // Create new template (shouldn't normally happen, but handle it)
        this.savedTemplate = await this.templateManager.create({
          name: template.metadata.name,
          ...(template.metadata.description !== undefined && { description: template.metadata.description }),
          ...(template.metadata.author !== undefined && { author: template.metadata.author }),
          ...(template.metadata.category !== undefined && { category: template.metadata.category }),
          ...(template.metadata.tags !== undefined && { tags: template.metadata.tags }),
          settings: template.settings,
          generalStyles: template.generalStyles,
          components: template.components,
        });
      }

      // Update current template
      this.templateManager.setCurrentTemplate(this.savedTemplate);
    } catch (error) {
      throw new Error(
        `Failed to save template: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Undo save operation
   */
  public async undo(): Promise<void> {
    if (!this.canUndo()) {
      throw new Error('Cannot undo: no previous state');
    }

    // Restore previous template
    if (this.previousTemplate) {
      this.templateManager.setCurrentTemplate(this.previousTemplate);
    } else {
      this.templateManager.clearCurrentTemplate();
    }
  }

  /**
   * Check if command can be undone
   */
  public canUndo(): boolean {
    return this.previousTemplate !== undefined;
  }

  /**
   * Get saved template
   */
  public getSavedTemplate(): Template | undefined {
    return this.savedTemplate;
  }
}
