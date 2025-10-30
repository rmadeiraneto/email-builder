/**
 * Update Component Style Command
 *
 * Updates the styling of a component
 */

import type { UndoableCommand } from '../types';
import { CommandType } from '../types';
import type { ComponentData } from './AddComponentCommand';

export interface UpdateComponentStylePayload {
  componentId: string;
  styles: Record<string, unknown>;
}

export class UpdateComponentStyleCommand
  implements UndoableCommand<UpdateComponentStylePayload>
{
  public readonly type = CommandType.UPDATE_COMPONENT_STYLE;
  public readonly timestamp: number;
  public readonly id: string;
  public readonly payload: UpdateComponentStylePayload;

  private previousStyles?: Record<string, unknown>;

  constructor(
    payload: UpdateComponentStylePayload,
    private getState: () => Map<string, ComponentData>,
    private setState: (state: Map<string, ComponentData>) => void
  ) {
    this.payload = payload;
    this.timestamp = Date.now();
    this.id = `update-style-${this.timestamp}`;
  }

  public async execute(): Promise<void> {
    const state = new Map(this.getState());

    const component = state.get(this.payload.componentId);
    if (!component) {
      throw new Error(`Component ${this.payload.componentId} not found`);
    }

    const currentStyles = (component.props.styles as Record<string, unknown>) ?? {};
    this.previousStyles = { ...currentStyles };

    component.props.styles = { ...currentStyles, ...this.payload.styles };

    this.setState(state);
  }

  public async undo(): Promise<void> {
    if (this.previousStyles !== undefined) {
      const state = new Map(this.getState());
      const component = state.get(this.payload.componentId);
      if (component) {
        component.props.styles = this.previousStyles;
        this.setState(state);
      }
    }
  }

  public canUndo(): boolean {
    return this.previousStyles !== undefined;
  }
}
