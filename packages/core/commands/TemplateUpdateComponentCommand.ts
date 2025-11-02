/**
 * Template Update Component Command
 *
 * Updates a component property in a template
 */

import type { UndoableCommand } from '../types';
import { CommandType } from '../types';
import type { Template } from '../types';

export interface TemplateUpdateComponentPayload {
  componentId: string;
  propertyPath: string;
  value: any;
}

export class TemplateUpdateComponentCommand implements UndoableCommand<TemplateUpdateComponentPayload> {
  public readonly type = CommandType.UPDATE_COMPONENT_CONTENT;
  public readonly timestamp: number;
  public readonly id: string;
  public readonly payload: TemplateUpdateComponentPayload;

  private previousTemplate?: Template;

  constructor(
    payload: TemplateUpdateComponentPayload,
    private getTemplate: () => Template | null,
    private setTemplate: (template: Template) => void
  ) {
    this.payload = payload;
    this.timestamp = Date.now();
    this.id = `template-update-component-${this.timestamp}`;
  }

  public async execute(): Promise<void> {
    const currentTemplate = this.getTemplate();
    if (!currentTemplate) {
      throw new Error('No template loaded');
    }

    // Store previous state for undo
    this.previousTemplate = JSON.parse(JSON.stringify(currentTemplate));

    // Helper to set nested property value
    const setNestedValue = (obj: any, path: string, value: any): void => {
      const keys = path.split('.');
      const lastKey = keys.pop()!;
      const target = keys.reduce((current, key) => {
        if (!current[key]) current[key] = {};
        return current[key];
      }, obj);
      target[lastKey] = value;
    };

    // Find and update the component
    const updatedComponents = currentTemplate.components.map((comp) => {
      if (comp.id === this.payload.componentId) {
        const updatedComp = JSON.parse(JSON.stringify(comp)); // Deep clone
        setNestedValue(updatedComp, this.payload.propertyPath, this.payload.value);
        return updatedComp;
      }
      return comp;
    });

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
