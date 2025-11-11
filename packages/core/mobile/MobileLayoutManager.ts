/**
 * Mobile Layout Manager
 *
 * Manages mobile-specific component layout: ordering and visibility
 *
 * Responsibilities:
 * - Component order management for mobile mode
 * - Component visibility toggling
 * - Drag-and-drop reordering support
 * - Order diff calculation (desktop vs mobile)
 * - Reset to desktop order
 * - Only affects top-level components
 *
 * @module mobile
 */

import { EventEmitter } from '../services/EventEmitter';
import type { Template, BaseComponent } from '../types';

/**
 * Mobile Layout Manager Events
 */
export enum MobileLayoutManagerEvent {
  /**
   * Fired when mobile component order changes
   */
  ORDER_CHANGED = 'mobile-layout:order-changed',

  /**
   * Fired when component visibility changes
   */
  VISIBILITY_CHANGED = 'mobile-layout:visibility-changed',

  /**
   * Fired when order is reset to desktop
   */
  ORDER_RESET = 'mobile-layout:order-reset',

  /**
   * Fired when reordering starts
   */
  REORDER_START = 'mobile-layout:reorder-start',

  /**
   * Fired when reordering ends
   */
  REORDER_END = 'mobile-layout:reorder-end',
}

/**
 * Component item for layout manager
 */
export interface LayoutComponentItem {
  /**
   * Component ID
   */
  id: string;

  /**
   * Component type
   */
  type: string;

  /**
   * Component name/label
   */
  name: string;

  /**
   * Visible on mobile
   */
  visibleOnMobile: boolean;

  /**
   * Visible on desktop
   */
  visibleOnDesktop: boolean;

  /**
   * Desktop position (0-based index)
   */
  desktopPosition: number;

  /**
   * Mobile position (0-based index)
   */
  mobilePosition: number;

  /**
   * Position changed from desktop
   */
  positionChanged: boolean;

  /**
   * Is being dragged
   */
  isDragging?: boolean;
}

/**
 * Mobile Layout Manager Options
 */
export interface MobileLayoutManagerOptions {
  /**
   * Event emitter instance
   */
  eventEmitter: EventEmitter;

  /**
   * Template (will be mutated)
   */
  template: Template;
}

/**
 * Mobile Layout Manager Service
 *
 * Handles mobile component ordering and visibility
 */
export class MobileLayoutManager {
  private eventEmitter: EventEmitter;
  private template: Template;
  private draggingComponentId?: string;

  constructor(options: MobileLayoutManagerOptions) {
    this.eventEmitter = options.eventEmitter;
    this.template = options.template;
  }

  /**
   * Get layout items for display
   *
   * Returns all top-level components with their layout information
   */
  public getLayoutItems(): LayoutComponentItem[] {
    const topLevelComponents = this.getTopLevelComponents();
    const desktopOrder = this.getDesktopOrder();
    const mobileOrder = this.getMobileOrder();

    return mobileOrder.map((id, mobileIndex) => {
      const component = topLevelComponents.find((c) => c.id === id);
      if (!component) {
        throw new Error(`Component not found in template: ${id}`);
      }

      const desktopIndex = desktopOrder.indexOf(id);
      const visibleOnDesktop = component.visibility?.desktop ?? true;
      const visibleOnMobile = component.visibility?.mobile ?? visibleOnDesktop;

      return {
        id: component.id,
        type: component.type,
        name: this.getComponentName(component),
        visibleOnMobile,
        visibleOnDesktop,
        desktopPosition: desktopIndex,
        mobilePosition: mobileIndex,
        positionChanged: desktopIndex !== mobileIndex,
        isDragging: this.draggingComponentId === component.id,
      };
    });
  }

  /**
   * Reorder components for mobile
   *
   * @param newOrder - New order (array of component IDs)
   */
  public reorderComponents(newOrder: string[]): void {
    // Validate all IDs are valid top-level components
    const topLevelIds = this.getTopLevelComponents().map((c) => c.id);
    const allValid = newOrder.every((id) => topLevelIds.includes(id));

    if (!allValid) {
      throw new Error('Invalid component IDs in new order');
    }

    if (newOrder.length !== topLevelIds.length) {
      throw new Error('New order must include all top-level components');
    }

    // Ensure componentOrder exists
    if (!this.template.componentOrder) {
      this.template.componentOrder = {
        desktop: topLevelIds,
        mobile: newOrder,
      };
    } else {
      this.template.componentOrder.mobile = newOrder;
    }

    // Emit event
    this.eventEmitter.emit(MobileLayoutManagerEvent.ORDER_CHANGED, {
      newOrder,
      timestamp: Date.now(),
    });
  }

  /**
   * Move component from one position to another
   *
   * @param fromIndex - Source index
   * @param toIndex - Destination index
   */
  public moveComponent(fromIndex: number, toIndex: number): void {
    const mobileOrder = [...this.getMobileOrder()];

    if (fromIndex < 0 || fromIndex >= mobileOrder.length) {
      throw new Error(`Invalid fromIndex: ${fromIndex}`);
    }

    if (toIndex < 0 || toIndex >= mobileOrder.length) {
      throw new Error(`Invalid toIndex: ${toIndex}`);
    }

    // Remove from source position
    const [movedId] = mobileOrder.splice(fromIndex, 1);

    if (!movedId) {
      throw new Error(`Failed to move component at index ${fromIndex}`);
    }

    // Insert at destination position
    mobileOrder.splice(toIndex, 0, movedId);

    this.reorderComponents(mobileOrder);
  }

  /**
   * Set component visibility for mobile
   *
   * @param componentId - Component ID
   * @param visible - Visible on mobile
   */
  public setComponentVisibility(componentId: string, visible: boolean): void {
    const component = this.template.components.find((c) => c.id === componentId);

    if (!component) {
      throw new Error(`Component not found: ${componentId}`);
    }

    // Initialize visibility if not present
    if (!component.visibility) {
      component.visibility = {
        desktop: true,
        mobile: visible,
      };
    } else {
      component.visibility.mobile = visible;
    }

    // Emit event
    this.eventEmitter.emit(MobileLayoutManagerEvent.VISIBILITY_CHANGED, {
      componentId,
      visible,
      timestamp: Date.now(),
    });
  }

  /**
   * Toggle component visibility for mobile
   *
   * @param componentId - Component ID
   */
  public toggleComponentVisibility(componentId: string): void {
    const component = this.template.components.find((c) => c.id === componentId);

    if (!component) {
      throw new Error(`Component not found: ${componentId}`);
    }

    const currentVisibility = component.visibility?.mobile ?? component.visibility?.desktop ?? true;
    this.setComponentVisibility(componentId, !currentVisibility);
  }

  /**
   * Reset mobile order to match desktop order
   */
  public resetToDesktopOrder(): void {
    if (!this.template.componentOrder) {
      return; // Nothing to reset
    }

    const desktopOrder = this.template.componentOrder.desktop;

    // Clear mobile order (will inherit desktop)
    delete this.template.componentOrder.mobile;

    // Emit event
    this.eventEmitter.emit(MobileLayoutManagerEvent.ORDER_RESET, {
      desktopOrder,
      timestamp: Date.now(),
    });
  }

  /**
   * Check if mobile order differs from desktop
   */
  public hasOrderChanges(): boolean {
    if (!this.template.componentOrder?.mobile) {
      return false;
    }

    const desktopOrder = this.getDesktopOrder();
    const mobileOrder = this.getMobileOrder();

    if (desktopOrder.length !== mobileOrder.length) {
      return true;
    }

    return desktopOrder.some((id, index) => id !== mobileOrder[index]);
  }

  /**
   * Get order diff between desktop and mobile
   */
  public getOrderDiff(): Array<{
    componentId: string;
    componentName: string;
    desktopPosition: number;
    mobilePosition: number;
  }> {
    const items = this.getLayoutItems();

    return items
      .filter((item) => item.positionChanged)
      .map((item) => ({
        componentId: item.id,
        componentName: item.name,
        desktopPosition: item.desktopPosition,
        mobilePosition: item.mobilePosition,
      }));
  }

  /**
   * Get components with visibility changes
   */
  public getVisibilityChanges(): Array<{
    componentId: string;
    componentName: string;
    visibleOnDesktop: boolean;
    visibleOnMobile: boolean;
  }> {
    const items = this.getLayoutItems();

    return items
      .filter((item) => item.visibleOnDesktop !== item.visibleOnMobile)
      .map((item) => ({
        componentId: item.id,
        componentName: item.name,
        visibleOnDesktop: item.visibleOnDesktop,
        visibleOnMobile: item.visibleOnMobile,
      }));
  }

  /**
   * Start dragging a component
   *
   * @param componentId - Component ID being dragged
   */
  public startDragging(componentId: string): void {
    this.draggingComponentId = componentId;

    this.eventEmitter.emit(MobileLayoutManagerEvent.REORDER_START, {
      componentId,
      timestamp: Date.now(),
    });
  }

  /**
   * End dragging
   */
  public endDragging(): void {
    const componentId = this.draggingComponentId;
    delete this.draggingComponentId;

    this.eventEmitter.emit(MobileLayoutManagerEvent.REORDER_END, {
      componentId,
      timestamp: Date.now(),
    });
  }

  /**
   * Get currently dragging component ID
   */
  public getDraggingComponentId(): string | undefined {
    return this.draggingComponentId;
  }

  /**
   * Update template reference
   *
   * @param template - New template instance
   */
  public setTemplate(template: Template): void {
    this.template = template;
  }

  /**
   * Get top-level components (components without parent)
   */
  private getTopLevelComponents(): BaseComponent[] {
    return this.template.components.filter((c) => !c.parentId);
  }

  /**
   * Get desktop component order
   */
  private getDesktopOrder(): string[] {
    if (this.template.componentOrder) {
      return this.template.componentOrder.desktop;
    }

    // Fallback: use current component array order
    return this.getTopLevelComponents().map((c) => c.id);
  }

  /**
   * Get mobile component order
   *
   * Falls back to desktop order if not specified
   */
  private getMobileOrder(): string[] {
    if (this.template.componentOrder?.mobile) {
      return this.template.componentOrder.mobile;
    }

    return this.getDesktopOrder();
  }

  /**
   * Get component name for display
   */
  private getComponentName(component: BaseComponent): string {
    // Try to get name from metadata
    if (component.metadata?.name) {
      return component.metadata.name;
    }

    // Try to get from content
    if ('content' in component && component.content) {
      const content = component.content as any;
      if (content.text) {
        return content.text.substring(0, 30);
      }
      if (content.heading) {
        return content.heading.substring(0, 30);
      }
    }

    // Fallback to type
    return component.type;
  }
}
