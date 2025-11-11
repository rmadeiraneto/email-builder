/**
 * Clear Mobile Override Command
 *
 * Command to clear a mobile property override for a component
 */

import type { UndoableCommand } from '../types/command.types';
import { CommandType } from '../types/command.types';
import { DeviceMode } from '../mobile';
import type { PropertyOverrideManager } from '../mobile/PropertyOverrideManager';

/**
 * Clear mobile override payload
 */
export interface ClearMobileOverridePayload {
  /**
   * Component ID
   */
  componentId: string;

  /**
   * Property path (e.g., 'styles.padding')
   * If not specified, clears all overrides for the component
   */
  propertyPath?: string;

  /**
   * Clear all overrides for all components
   */
  clearAll?: boolean;
}

/**
 * Clear Mobile Override Command
 *
 * Clears property overrides for mobile mode
 */
export class ClearMobileOverrideCommand
  implements UndoableCommand<ClearMobileOverridePayload>
{
  public readonly type = CommandType.CLEAR_MOBILE_OVERRIDE;
  public readonly mode = DeviceMode.MOBILE;
  public readonly id: string;
  public readonly timestamp: number;
  public readonly payload: ClearMobileOverridePayload;

  private overrideManager: PropertyOverrideManager;
  private previousValues: Map<string, any> = new Map();

  constructor(
    payload: ClearMobileOverridePayload,
    overrideManager: PropertyOverrideManager
  ) {
    this.payload = payload;
    this.overrideManager = overrideManager;
    this.id = `clear-mobile-override-${Date.now()}-${Math.random()}`;
    this.timestamp = Date.now();
  }

  public async execute(): Promise<void> {
    const { componentId, propertyPath, clearAll } = this.payload;

    if (clearAll) {
      // Clear all overrides for all components
      const componentsWithOverrides = this.overrideManager.getComponentsWithOverrides();

      for (const compId of componentsWithOverrides) {
        const overrides = this.overrideManager.getComponentOverrides(compId);
        for (const path in overrides) {
          this.previousValues.set(`${compId}:${path}`, overrides[path]);
        }
      }

      this.overrideManager.clearAllOverrides();
    } else if (!propertyPath) {
      // Clear all overrides for specific component
      const overrides = this.overrideManager.getComponentOverrides(componentId);

      for (const path in overrides) {
        this.previousValues.set(`${componentId}:${path}`, overrides[path]);
      }

      this.overrideManager.clearComponentOverrides(componentId);
    } else {
      // Clear specific property override
      const previousValue = this.overrideManager.getOverride(componentId, propertyPath);
      if (previousValue !== undefined) {
        this.previousValues.set(`${componentId}:${propertyPath}`, previousValue);
      }

      const result = this.overrideManager.clearOverride(componentId, propertyPath);

      if (!result.success) {
        throw new Error(result.error || 'Failed to clear mobile override');
      }
    }
  }

  public async undo(): Promise<void> {
    // Restore all previous values
    for (const [key, value] of this.previousValues.entries()) {
      const [componentId, propertyPath] = key.split(':');
      if (componentId && propertyPath) {
        this.overrideManager.setOverride(componentId, propertyPath, value);
      }
    }
  }

  public canUndo(): boolean {
    return true;
  }
}
