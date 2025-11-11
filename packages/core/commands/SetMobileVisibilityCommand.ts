/**
 * Set Mobile Visibility Command
 *
 * Command to set component visibility for mobile mode
 */

import type { UndoableCommand } from '../types/command.types';
import { CommandType } from '../types/command.types';
import { DeviceMode } from '../mobile';
import type { Template } from '../types';

/**
 * Set mobile visibility payload
 */
export interface SetMobileVisibilityPayload {
  /**
   * Component ID
   */
  componentId: string;

  /**
   * Visible on mobile
   */
  visible: boolean;
}

/**
 * Set Mobile Visibility Command
 *
 * Controls whether a component is visible on mobile
 */
export class SetMobileVisibilityCommand
  implements UndoableCommand<SetMobileVisibilityPayload>
{
  public readonly type = CommandType.SET_MOBILE_VISIBILITY;
  public readonly mode = DeviceMode.MOBILE;
  public readonly id: string;
  public readonly timestamp: number;
  public readonly payload: SetMobileVisibilityPayload;

  private template: Template;
  private previousValue: boolean | undefined;

  constructor(payload: SetMobileVisibilityPayload, template: Template) {
    this.payload = payload;
    this.template = template;
    this.id = `set-mobile-visibility-${Date.now()}-${Math.random()}`;
    this.timestamp = Date.now();
  }

  public async execute(): Promise<void> {
    const { componentId, visible } = this.payload;

    const component = this.template.components.find((c) => c.id === componentId);

    if (!component) {
      throw new Error(`Component not found: ${componentId}`);
    }

    // Store previous value
    this.previousValue = component.visibility?.mobile;

    // Initialize visibility if not present
    if (!component.visibility) {
      component.visibility = {
        desktop: true,
        mobile: visible,
      };
    } else {
      component.visibility.mobile = visible;
    }
  }

  public async undo(): Promise<void> {
    const { componentId } = this.payload;

    const component = this.template.components.find((c) => c.id === componentId);

    if (!component || !component.visibility) {
      return;
    }

    // Restore previous value
    if (this.previousValue === undefined) {
      delete component.visibility.mobile;
    } else {
      component.visibility.mobile = this.previousValue;
    }
  }

  public canUndo(): boolean {
    return true;
  }
}
