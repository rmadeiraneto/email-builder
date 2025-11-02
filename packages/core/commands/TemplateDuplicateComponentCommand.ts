/**
 * Template Duplicate Component Command
 *
 * Command for duplicating a component in a template
 */

import type { UndoableCommand } from '../types';
import { CommandType } from '../types';
import type { Template, BaseComponent } from '../types';

export interface TemplateDuplicateComponentPayload {
  componentId: string;
}

export class TemplateDuplicateComponentCommand implements UndoableCommand<TemplateDuplicateComponentPayload> {
  public readonly type = CommandType.ADD_COMPONENT; // Using ADD_COMPONENT since we're adding a duplicate
  public readonly timestamp: number;
  public readonly id: string;
  public readonly payload: TemplateDuplicateComponentPayload;
  private previousState: Template | null = null;
  private newComponentId: string | null = null;

  constructor(
    payload: TemplateDuplicateComponentPayload,
    private getTemplate: () => Template | null,
    private setTemplate: (template: Template) => void
  ) {
    this.payload = payload;
    this.timestamp = Date.now();
    this.id = crypto.randomUUID();
  }

  async execute(): Promise<boolean> {
    try {
      const template = this.getTemplate();
      if (!template) {
        return false;
      }

      // Store previous state for undo
      this.previousState = JSON.parse(JSON.stringify(template));

      // Find the component to duplicate
      const componentIndex = template.components.findIndex(
        (c) => c.id === this.payload.componentId
      );

      if (componentIndex === -1) {
        return false;
      }

      const originalComponent = template.components[componentIndex];

      // Create a deep copy of the component
      const duplicatedComponent: BaseComponent = JSON.parse(
        JSON.stringify(originalComponent)
      );

      // Generate a new ID for the duplicated component
      this.newComponentId = crypto.randomUUID();
      duplicatedComponent.id = this.newComponentId;

      // Insert the duplicated component right after the original
      const updatedComponents = [...template.components];
      updatedComponents.splice(componentIndex + 1, 0, duplicatedComponent);

      // Update the template
      const updatedTemplate: Template = {
        ...template,
        components: updatedComponents,
        metadata: {
          ...template.metadata,
          updatedAt: Date.now(),
        },
      };

      this.setTemplate(updatedTemplate);
      return true;
    } catch (error) {
      return false;
    }
  }

  async undo(): Promise<boolean> {
    try {
      if (!this.previousState) {
        return false;
      }

      this.setTemplate(this.previousState);
      return true;
    } catch (error) {
      return false;
    }
  }

  getNewComponentId(): string | null {
    return this.newComponentId;
  }
}
