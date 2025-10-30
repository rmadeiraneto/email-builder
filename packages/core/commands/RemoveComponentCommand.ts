/**
 * Remove Component Command
 *
 * Removes a component from the builder state
 */

import type { UndoableCommand } from '../types';
import { CommandType } from '../types';
import type { ComponentData } from './AddComponentCommand';

export interface RemoveComponentPayload {
  componentId: string;
}

export class RemoveComponentCommand implements UndoableCommand<RemoveComponentPayload> {
  public readonly type = CommandType.REMOVE_COMPONENT;
  public readonly timestamp: number;
  public readonly id: string;
  public readonly payload: RemoveComponentPayload;

  private previousState?: Map<string, ComponentData>;

  constructor(
    payload: RemoveComponentPayload,
    private getState: () => Map<string, ComponentData>,
    private setState: (state: Map<string, ComponentData>) => void
  ) {
    this.payload = payload;
    this.timestamp = Date.now();
    this.id = `remove-component-${this.timestamp}`;
  }

  public async execute(): Promise<void> {
    const state = new Map(this.getState());
    this.previousState = new Map(state);

    const componentToRemove = state.get(this.payload.componentId);
    if (!componentToRemove) {
      throw new Error(`Component ${this.payload.componentId} not found`);
    }

    state.delete(this.payload.componentId);

    state.forEach((component) => {
      const index = component.children.indexOf(this.payload.componentId);
      if (index !== -1) {
        component.children.splice(index, 1);
      }
    });

    this.setState(state);
  }

  public async undo(): Promise<void> {
    if (this.previousState) {
      this.setState(new Map(this.previousState));
    }
  }

  public canUndo(): boolean {
    return this.previousState !== undefined;
  }
}
