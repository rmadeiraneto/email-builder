/**
 * Load Template Command
 *
 * Loads a template from storage
 */

import type { UndoableCommand } from '../types/command.types';
import { CommandType } from '../types/command.types';
import type { Template } from '../types/template.types';
import type { TemplateManager } from '../template/TemplateManager';

/**
 * Load template payload
 */
export interface LoadTemplatePayload {
  /**
   * Template ID to load
   */
  templateId: string;
}

/**
 * Load Template Command
 *
 * Loads template from storage and sets as current
 */
export class LoadTemplateCommand implements UndoableCommand<LoadTemplatePayload> {
  public readonly type = CommandType.LOAD_TEMPLATE;
  public readonly timestamp: number;
  public readonly id: string;
  public readonly payload: LoadTemplatePayload;

  private previousTemplate?: Template | null;
  private loadedTemplate?: Template;

  constructor(
    payload: LoadTemplatePayload,
    private templateManager: TemplateManager
  ) {
    this.payload = payload;
    this.timestamp = Date.now();
    this.id = `load-template-${this.timestamp}`;
  }

  /**
   * Execute load operation
   */
  public async execute(): Promise<void> {
    try {
      // Store previous state
      this.previousTemplate = this.templateManager.getCurrentTemplate();

      // Load template
      this.loadedTemplate = await this.templateManager.load(
        this.payload.templateId
      );

      // Set as current template
      this.templateManager.setCurrentTemplate(this.loadedTemplate);
    } catch (error) {
      throw new Error(
        `Failed to load template: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Undo load operation
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
   * Get loaded template
   */
  public getLoadedTemplate(): Template | undefined {
    return this.loadedTemplate;
  }
}
