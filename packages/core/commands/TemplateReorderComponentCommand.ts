/**
 * Template Reorder Component Command
 *
 * Reorders a component in a template's components array
 */

import type { UndoableCommand } from '../types';
import { CommandType } from '../types';
import type { Template } from '../types';

export interface TemplateReorderComponentPayload {
  componentId: string;
  newIndex: number;
}

export class TemplateReorderComponentCommand implements UndoableCommand<TemplateReorderComponentPayload> {
  public readonly type = CommandType.REORDER_COMPONENTS;
  public readonly timestamp: number;
  public readonly id: string;
  public readonly payload: TemplateReorderComponentPayload;

  private previousTemplate?: Template;

  constructor(
    payload: TemplateReorderComponentPayload,
    private getTemplate: () => Template | null,
    private setTemplate: (template: Template) => void
  ) {
    this.payload = payload;
    this.timestamp = Date.now();
    this.id = `template-reorder-component-${this.timestamp}`;
  }

  public async execute(): Promise<void> {
    const currentTemplate = this.getTemplate();
    if (!currentTemplate) {
      throw new Error('No template loaded');
    }

    // Store previous state for undo
    this.previousTemplate = JSON.parse(JSON.stringify(currentTemplate));

    const components = [...currentTemplate.components];
    const currentIndex = components.findIndex((comp) => comp.id === this.payload.componentId);

    if (currentIndex === -1) {
      throw new Error(`Component ${this.payload.componentId} not found`);
    }

    // Remove component from current position
    const removed = components.splice(currentIndex, 1);
    const component = removed[0];

    if (!component) {
      throw new Error(`Failed to remove component ${this.payload.componentId}`);
    }

    // Insert component at new position
    components.splice(this.payload.newIndex, 0, component);

    // Create updated template
    const updatedTemplate: Template = {
      ...currentTemplate,
      components,
    };

    this.setTemplate(updatedTemplate);
  }

  public async undo(): Promise<void> {
    if (this.previousTemplate) {
      this.setTemplate(this.previousTemplate);
    }
  }

  public canUndo(): boolean {
    return this.previousTemplate !== undefined;
  }
}
