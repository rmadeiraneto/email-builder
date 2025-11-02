/**
 * Delete Preset Command
 *
 * Deletes a style preset
 */

import type { UndoableCommand } from '../types/command.types';
import { CommandType } from '../types/command.types';
import type { PresetManager } from '../preset/PresetManager';
import type { ComponentPreset, ComponentType } from '../types/component.types';

export interface DeletePresetPayload {
  componentType: ComponentType;
  presetId: string;
}

export class DeletePresetCommand implements UndoableCommand<DeletePresetPayload> {
  public readonly type = CommandType.DELETE_PRESET;
  public readonly timestamp: number;
  public readonly id: string;
  public readonly payload: DeletePresetPayload;

  private deletedPreset?: ComponentPreset;

  constructor(
    payload: DeletePresetPayload,
    private presetManager: PresetManager
  ) {
    this.payload = payload;
    this.timestamp = Date.now();
    this.id = `delete-preset-${this.timestamp}`;
  }

  public async execute(): Promise<void> {
    // Load the preset before deleting (for undo)
    this.deletedPreset = await this.presetManager.load(
      this.payload.componentType,
      this.payload.presetId
    );

    // Delete the preset
    await this.presetManager.delete(
      this.payload.componentType,
      this.payload.presetId
    );
  }

  public async undo(): Promise<void> {
    if (this.deletedPreset) {
      // Recreate the preset with the same ID and data
      await this.presetManager.create({
        componentType: this.payload.componentType,
        name: this.deletedPreset.name,
        description: this.deletedPreset.description ?? undefined,
        thumbnail: this.deletedPreset.thumbnail ?? undefined,
        styles: this.deletedPreset.styles,
        isCustom: this.deletedPreset.isCustom ?? undefined,
      });
    }
  }

  public canUndo(): boolean {
    return this.deletedPreset !== undefined;
  }
}
