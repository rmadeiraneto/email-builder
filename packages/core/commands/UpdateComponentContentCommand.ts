/**
 * Update Component Content Command
 *
 * Updates the content/props of a component
 */

import type { UndoableCommand } from '../types';
import { CommandType } from '../types';
import type { ComponentData } from './AddComponentCommand';

export interface UpdateComponentContentPayload {
  componentId: string;
  props: Record<string, unknown>;
}

export class UpdateComponentContentCommand
  implements UndoableCommand<UpdateComponentContentPayload>
{
  public readonly type = CommandType.UPDATE_COMPONENT_CONTENT;
  public readonly timestamp: number;
  public readonly id: string;
  public readonly payload: UpdateComponentContentPayload;

  private previousProps?: Record<string, unknown>;

  constructor(
    payload: UpdateComponentContentPayload,
    private getState: () => Map<string, ComponentData>,
    private setState: (state: Map<string, ComponentData>) => void
  ) {
    this.payload = payload;
    this.timestamp = Date.now();
    this.id = `update-content-${this.timestamp}`;
  }

  public async execute(): Promise<void> {
    const state = new Map(this.getState());

    const component = state.get(this.payload.componentId);
    if (!component) {
      throw new Error(`Component ${this.payload.componentId} not found`);
    }

    this.previousProps = { ...component.props };
    component.props = { ...component.props, ...this.payload.props };

    this.setState(state);
  }

  public async undo(): Promise<void> {
    if (this.previousProps) {
      const state = new Map(this.getState());
      const component = state.get(this.payload.componentId);
      if (component) {
        component.props = this.previousProps;
        this.setState(state);
      }
    }
  }

  public canUndo(): boolean {
    return this.previousProps !== undefined;
  }
}
