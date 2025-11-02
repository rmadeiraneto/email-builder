/**
 * Template Add Component Command
 *
 * Adds a component to a template's components array
 */

import type { UndoableCommand } from '../types';
import { CommandType } from '../types';
import type { Template, BaseComponent } from '../types';

export interface TemplateAddComponentPayload {
  component: BaseComponent;
  position?: number;
}

export class TemplateAddComponentCommand implements UndoableCommand<TemplateAddComponentPayload> {
  public readonly type = CommandType.ADD_COMPONENT;
  public readonly timestamp: number;
  public readonly id: string;
  public readonly payload: TemplateAddComponentPayload;

  private previousTemplate?: Template;

  constructor(
    payload: TemplateAddComponentPayload,
    private getTemplate: () => Template | null,
    private setTemplate: (template: Template) => void
  ) {
    this.payload = payload;
    this.timestamp = Date.now();
    this.id = `template-add-component-${this.timestamp}`;
  }

  public async execute(): Promise<void> {
    const currentTemplate = this.getTemplate();
    if (!currentTemplate) {
      throw new Error('No template loaded');
    }

    // Store previous state for undo
    this.previousTemplate = JSON.parse(JSON.stringify(currentTemplate));

    // Create new template with added component
    const updatedTemplate: Template = {
      ...currentTemplate,
      components: this.payload.position !== undefined
        ? [
            ...currentTemplate.components.slice(0, this.payload.position),
            this.payload.component,
            ...currentTemplate.components.slice(this.payload.position),
          ]
        : [...currentTemplate.components, this.payload.component],
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
