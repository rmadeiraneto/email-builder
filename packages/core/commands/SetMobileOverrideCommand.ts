/**
 * Set Mobile Override Command
 *
 * Command to set a mobile property override for a component
 */

import type { UndoableCommand } from '../types/command.types';
import { CommandType } from '../types/command.types';
import { DeviceMode } from '../mobile';
import type { PropertyOverrideManager } from '../mobile/PropertyOverrideManager';

/**
 * Set mobile override payload
 */
export interface SetMobileOverridePayload {
  /**
   * Component ID
   */
  componentId: string;

  /**
   * Property path (e.g., 'styles.padding')
   */
  propertyPath: string;

  /**
   * New value for mobile
   */
  value: any;
}

/**
 * Set Mobile Override Command
 *
 * Sets a property override for mobile mode
 */
export class SetMobileOverrideCommand
  implements UndoableCommand<SetMobileOverridePayload>
{
  public readonly type = CommandType.SET_MOBILE_OVERRIDE;
  public readonly mode = DeviceMode.MOBILE;
  public readonly id: string;
  public readonly timestamp: number;
  public readonly payload: SetMobileOverridePayload;

  private overrideManager: PropertyOverrideManager;
  private previousValue: any;

  constructor(
    payload: SetMobileOverridePayload,
    overrideManager: PropertyOverrideManager
  ) {
    this.payload = payload;
    this.overrideManager = overrideManager;
    this.id = `set-mobile-override-${Date.now()}-${Math.random()}`;
    this.timestamp = Date.now();
  }

  public async execute(): Promise<void> {
    const { componentId, propertyPath, value } = this.payload;

    // Store previous value for undo
    this.previousValue = this.overrideManager.getOverride(componentId, propertyPath);

    // Set the override
    const result = this.overrideManager.setOverride(componentId, propertyPath, value);

    if (!result.success) {
      throw new Error(result.error || 'Failed to set mobile override');
    }
  }

  public async undo(): Promise<void> {
    const { componentId, propertyPath } = this.payload;

    if (this.previousValue === undefined) {
      // Was not overridden before, clear it
      this.overrideManager.clearOverride(componentId, propertyPath);
    } else {
      // Restore previous value
      this.overrideManager.setOverride(componentId, propertyPath, this.previousValue);
    }
  }

  public canUndo(): boolean {
    return true;
  }
}
