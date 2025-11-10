/**
 * Reorder Mobile Components Command
 *
 * Command to reorder top-level components for mobile mode
 */

import type { UndoableCommand } from '../types/command.types';
import { CommandType } from '../types/command.types';
import { DeviceMode } from '../mobile';
import type { Template } from '../types';

/**
 * Reorder mobile components payload
 */
export interface ReorderMobileComponentsPayload {
  /**
   * New component order (array of component IDs)
   */
  newOrder: string[];
}

/**
 * Reorder Mobile Components Command
 *
 * Changes the display order of top-level components on mobile
 */
export class ReorderMobileComponentsCommand
  implements UndoableCommand<ReorderMobileComponentsPayload>
{
  public readonly type = CommandType.REORDER_MOBILE_COMPONENTS;
  public readonly mode = DeviceMode.MOBILE;
  public readonly id: string;
  public readonly timestamp: number;
  public readonly payload: ReorderMobileComponentsPayload;

  private template: Template;
  private previousOrder: string[] | undefined;

  constructor(payload: ReorderMobileComponentsPayload, template: Template) {
    this.payload = payload;
    this.template = template;
    this.id = `reorder-mobile-components-${Date.now()}-${Math.random()}`;
    this.timestamp = Date.now();
  }

  public async execute(): Promise<void> {
    const { newOrder } = this.payload;

    // Initialize componentOrder if not present
    if (!this.template.componentOrder) {
      // Use current component order as desktop order
      const desktopOrder = this.template.components.map((c) => c.id);
      this.template.componentOrder = {
        desktop: desktopOrder,
        mobile: newOrder,
      };
      this.previousOrder = undefined;
    } else {
      // Store previous mobile order
      this.previousOrder = this.template.componentOrder.mobile;
      this.template.componentOrder.mobile = newOrder;
    }
  }

  public async undo(): Promise<void> {
    if (!this.template.componentOrder) {
      return;
    }

    // Restore previous order
    if (this.previousOrder === undefined) {
      delete this.template.componentOrder.mobile;
    } else {
      this.template.componentOrder.mobile = this.previousOrder;
    }
  }

  public canUndo(): boolean {
    return true;
  }
}
