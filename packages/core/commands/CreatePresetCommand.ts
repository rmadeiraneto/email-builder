/**
 * Create Preset Command
 *
 * Creates a new style preset for a component type
 */

import type { UndoableCommand } from '../types/command.types';
import { CommandType } from '../types/command.types';
import type { PresetManager, CreatePresetOptions } from '../preset/PresetManager';
import type { ComponentPreset } from '../types/component.types';

export interface CreatePresetPayload extends CreatePresetOptions {}

export class CreatePresetCommand implements UndoableCommand<CreatePresetPayload> {
  public readonly type = CommandType.CREATE_PRESET;
  public readonly timestamp: number;
  public readonly id: string;
  public readonly payload: CreatePresetPayload;

  private createdPreset?: ComponentPreset;

  constructor(
    payload: CreatePresetPayload,
    private presetManager: PresetManager
  ) {
    this.payload = payload;
    this.timestamp = Date.now();
    this.id = `create-preset-${this.timestamp}`;
  }

  public async execute(): Promise<void> {
    this.createdPreset = await this.presetManager.create(this.payload);
  }

  public async undo(): Promise<void> {
    if (this.createdPreset) {
      await this.presetManager.delete(
        this.payload.componentType,
        this.createdPreset.id
      );
    }
  }

  public canUndo(): boolean {
    return this.createdPreset !== undefined;
  }
}
