/**
 * Template Remove Component Command
 *
 * Removes a component from a template's components array
 */

import type { UndoableCommand } from '../types';
import { CommandType } from '../types';
import type { Template } from '../types';

export interface TemplateRemoveComponentPayload {
  componentId: string;
}

export class TemplateRemoveComponentCommand implements UndoableCommand<TemplateRemoveComponentPayload> {
  public readonly type = CommandType.REMOVE_COMPONENT;
  public readonly timestamp: number;
  public readonly id: string;
  public readonly payload: TemplateRemoveComponentPayload;

  private previousTemplate?: Template;

  constructor(
    payload: TemplateRemoveComponentPayload,
    private getTemplate: () => Template | null,
    private setTemplate: (template: Template) => void
  ) {
    this.payload = payload;
    this.timestamp = Date.now();
    this.id = `template-remove-component-${this.timestamp}`;
  }

  public async execute(): Promise<void> {
    const currentTemplate = this.getTemplate();
    if (!currentTemplate) {
      throw new Error('No template loaded');
    }

    // Store previous state for undo
    this.previousTemplate = JSON.parse(JSON.stringify(currentTemplate));

    // Filter out the component with matching ID
    const updatedComponents = currentTemplate.components.filter(
      (comp) => comp.id !== this.payload.componentId
    );

    // Create updated template
    const updatedTemplate: Template = {
      ...currentTemplate,
      components: updatedComponents,
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
