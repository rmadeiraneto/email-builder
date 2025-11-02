/**
 * Update Preset Command
 *
 * Updates an existing style preset
 */

import type { UndoableCommand } from '../types/command.types';
import { CommandType } from '../types/command.types';
import type { PresetManager, UpdatePresetOptions } from '../preset/PresetManager';
import type { ComponentPreset, ComponentType } from '../types/component.types';

export interface UpdatePresetPayload {
  componentType: ComponentType;
  presetId: string;
  updates: UpdatePresetOptions;
}

export class UpdatePresetCommand implements UndoableCommand<UpdatePresetPayload> {
  public readonly type = CommandType.UPDATE_PRESET;
  public readonly timestamp: number;
  public readonly id: string;
  public readonly payload: UpdatePresetPayload;

  private previousPreset?: ComponentPreset;

  constructor(
    payload: UpdatePresetPayload,
    private presetManager: PresetManager
  ) {
    this.payload = payload;
    this.timestamp = Date.now();
    this.id = `update-preset-${this.timestamp}`;
  }

  public async execute(): Promise<void> {
    // Load the current preset state before updating
    this.previousPreset = await this.presetManager.load(
      this.payload.componentType,
      this.payload.presetId
    );

    // Apply the update
    await this.presetManager.update(
      this.payload.componentType,
      this.payload.presetId,
      this.payload.updates
    );
  }

  public async undo(): Promise<void> {
    if (this.previousPreset) {
      // Restore the previous state
      await this.presetManager.update(
        this.payload.componentType,
        this.payload.presetId,
        {
          name: this.previousPreset.name,
          description: this.previousPreset.description ?? undefined,
          thumbnail: this.previousPreset.thumbnail ?? undefined,
          styles: this.previousPreset.styles,
        }
      );
    }
  }

  public canUndo(): boolean {
    return this.previousPreset !== undefined;
  }
}
