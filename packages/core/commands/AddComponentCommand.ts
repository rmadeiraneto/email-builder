/**
 * Add Component Command
 *
 * Adds a new component to the builder state
 */

import type { UndoableCommand } from '../types';
import { CommandType } from '../types';

export interface AddComponentPayload {
  componentType: string;
  parentId?: string;
  position?: number;
  props?: Record<string, unknown>;
}

export interface ComponentData {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children: string[];
}

export class AddComponentCommand implements UndoableCommand<AddComponentPayload> {
  public readonly type = CommandType.ADD_COMPONENT;
  public readonly timestamp: number;
  public readonly id: string;
  public readonly payload: AddComponentPayload;

  private componentId?: string;
  private previousState?: Map<string, ComponentData>;

  constructor(
    payload: AddComponentPayload,
    private getState: () => Map<string, ComponentData>,
    private setState: (state: Map<string, ComponentData>) => void
  ) {
    this.payload = payload;
    this.timestamp = Date.now();
    this.id = `add-component-${this.timestamp}`;
  }

  public async execute(): Promise<void> {
    const state = new Map(this.getState());
    this.previousState = new Map(state);

    // Use crypto.randomUUID for cryptographically secure random IDs
    this.componentId = `component-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`;

    const newComponent: ComponentData = {
      id: this.componentId,
      type: this.payload.componentType,
      props: this.payload.props ?? {},
      children: [],
    };

    state.set(this.componentId, newComponent);

    if (this.payload.parentId) {
      const parent = state.get(this.payload.parentId);
      if (parent) {
        if (this.payload.position !== undefined) {
          parent.children.splice(this.payload.position, 0, this.componentId);
        } else {
          parent.children.push(this.componentId);
        }
      }
    }

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
