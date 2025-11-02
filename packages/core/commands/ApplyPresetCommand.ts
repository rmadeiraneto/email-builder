/**
 * Apply Preset Command
 *
 * Applies a style preset to a component
 */

import type { UndoableCommand } from '../types/command.types';
import { CommandType } from '../types/command.types';
import type { PresetManager } from '../preset/PresetManager';
import type { BaseComponent, ComponentType, BaseStyles } from '../types/component.types';

export interface ApplyPresetPayload {
  componentId: string;
  componentType: ComponentType;
  presetId: string;
}

export class ApplyPresetCommand implements UndoableCommand<ApplyPresetPayload> {
  public readonly type = CommandType.APPLY_PRESET;
  public readonly timestamp: number;
  public readonly id: string;
  public readonly payload: ApplyPresetPayload;

  private previousStyles?: BaseStyles;
  private component?: BaseComponent;

  constructor(
    payload: ApplyPresetPayload,
    private presetManager: PresetManager,
    private getComponent: (componentId: string) => BaseComponent | undefined,
    private updateComponent: (component: BaseComponent) => void
  ) {
    this.payload = payload;
    this.timestamp = Date.now();
    this.id = `apply-preset-${this.timestamp}`;
  }

  public async execute(): Promise<void> {
    // Get the component
    const component = this.getComponent(this.payload.componentId);
    if (!component) {
      throw new Error(`Component ${this.payload.componentId} not found`);
    }

    // Save current styles for undo
    this.previousStyles = { ...component.styles };
    this.component = component;

    // Apply the preset
    const updatedComponent = await this.presetManager.apply(
      component,
      this.payload.componentType,
      this.payload.presetId
    );

    // Update the component in the state
    this.updateComponent(updatedComponent);
  }

  public async undo(): Promise<void> {
    if (this.component && this.previousStyles) {
      // Restore previous styles
      const restoredComponent: BaseComponent = {
        ...this.component,
        styles: this.previousStyles,
      };

      this.updateComponent(restoredComponent);
    }
  }

  public canUndo(): boolean {
    return this.previousStyles !== undefined && this.component !== undefined;
  }
}
