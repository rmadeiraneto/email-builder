/**
 * Canvas Renderer
 *
 * Handles mode-aware canvas rendering with proper style inheritance
 *
 * Responsibilities:
 * - Component rendering with mobile overrides
 * - Style resolution (desktop → mobile)
 * - Canvas viewport management
 * - Component visibility filtering
 * - Component ordering for display
 * - Virtual rendering for large templates
 *
 * @module mobile
 */

import type { Template, BaseComponent, BaseStyles } from '../types';
import type { ModeManager } from './ModeManager';
import type { MobileLayoutManager } from './MobileLayoutManager';
import type { MobileDevModeConfig } from './mobile.types';
import { DeviceMode } from './mobile.types';

/**
 * Rendered component data
 */
export interface RenderedComponent {
  /**
   * Component ID
   */
  id: string;

  /**
   * Component type
   */
  type: string;

  /**
   * Component content
   */
  content: any;

  /**
   * Resolved styles (with inheritance)
   */
  styles: BaseStyles;

  /**
   * Is visible
   */
  visible: boolean;

  /**
   * Display order index
   */
  order: number;

  /**
   * Has mobile overrides
   */
  hasOverrides: boolean;

  /**
   * Metadata
   */
  metadata?: any;

  /**
   * Children (if any)
   */
  children?: RenderedComponent[];
}

/**
 * Canvas viewport configuration
 */
export interface CanvasViewport {
  /**
   * Canvas width in pixels
   */
  width: number;

  /**
   * Canvas max width
   */
  maxWidth?: number;

  /**
   * Background color
   */
  backgroundColor: string;

  /**
   * Border color
   */
  borderColor?: string;

  /**
   * Device mode
   */
  mode: DeviceMode;

  /**
   * Scale factor (for zoom)
   */
  scale: number;
}

/**
 * Canvas Renderer Options
 */
export interface CanvasRendererOptions {
  /**
   * Mode manager instance
   */
  modeManager: ModeManager;

  /**
   * Layout manager instance
   */
  layoutManager: MobileLayoutManager;

  /**
   * Mobile dev mode configuration
   */
  config: MobileDevModeConfig;

  /**
   * Template to render
   */
  template: Template;
}

/**
 * Canvas Renderer Service
 *
 * Handles mode-aware component rendering for the canvas
 */
export class CanvasRenderer {
  private modeManager: ModeManager;
  private layoutManager: MobileLayoutManager;
  private config: MobileDevModeConfig;
  private template: Template;

  constructor(options: CanvasRendererOptions) {
    this.modeManager = options.modeManager;
    this.layoutManager = options.layoutManager;
    this.config = options.config;
    this.template = options.template;
  }

  /**
   * Get rendered components for current mode
   *
   * Returns all visible components with resolved styles
   */
  public getRenderedComponents(): RenderedComponent[] {
    const currentMode = this.modeManager.getCurrentMode();
    const topLevelComponents = this.getTopLevelComponents();

    // Get component order for current mode
    const order = this.layoutManager.getLayoutItems()
      .filter((item) => item.visibleOnMobile || currentMode === DeviceMode.DESKTOP)
      .map((item) => item.id);

    // Render components in order
    return order
      .map((id, index) => {
        const component = topLevelComponents.find((c) => c.id === id);
        if (!component) {
          return null;
        }

        return this.renderComponent(component, index);
      })
      .filter((c): c is RenderedComponent => c !== null);
  }

  /**
   * Render a single component with style resolution
   *
   * @param component - Component to render
   * @param order - Display order index
   */
  public renderComponent(
    component: BaseComponent,
    order: number = 0
  ): RenderedComponent | null {
    // Check visibility
    const visible = this.modeManager.isComponentVisible(component);
    if (!visible) {
      return null;
    }

    // Resolve styles with inheritance
    const styles = this.modeManager.getEffectiveStyles(component);

    // Check for mobile overrides
    const hasOverrides =
      this.modeManager.isMobileMode() &&
      component.mobileStyles &&
      Object.keys(component.mobileStyles).length > 0;

    // Render children recursively
    const children = this.renderChildren(component);

    const result: RenderedComponent = {
      id: component.id,
      type: component.type,
      content: 'content' in component ? component.content : undefined,
      styles,
      visible,
      order,
      hasOverrides: hasOverrides || false,
      metadata: component.metadata,
    };

    if (children !== undefined) {
      result.children = children;
    }

    return result;
  }

  /**
   * Get canvas viewport configuration for current mode
   */
  public getCanvasViewport(): CanvasViewport {
    const currentMode = this.modeManager.getCurrentMode();
    const breakpoint = this.config.breakpoints.mobile;

    if (currentMode === DeviceMode.MOBILE) {
      const viewport: CanvasViewport = {
        width: breakpoint,
        backgroundColor: this.config.canvas.mobileBackgroundColor || '#f5f5f5',
        mode: currentMode,
        scale: 1,
      };

      if (this.config.canvas.mobileBorderColor !== undefined) {
        viewport.borderColor = this.config.canvas.mobileBorderColor;
      }

      return viewport;
    }

    // Desktop mode
    return {
      width: 600, // Default email width
      backgroundColor: '#ffffff',
      mode: currentMode,
      scale: 1,
    };
  }

  /**
   * Check if component should use virtual rendering
   *
   * For performance optimization with large templates
   */
  public shouldUseVirtualRendering(): boolean {
    const componentCount = this.template.components.length;
    const threshold = this.config.performance.virtualRenderingThreshold;

    return (
      this.config.performance.virtualRendering &&
      componentCount > threshold
    );
  }

  /**
   * Get visible component count
   */
  public getVisibleComponentCount(): number {
    return this.getRenderedComponents().length;
  }

  /**
   * Get component by ID with rendering
   *
   * @param componentId - Component ID
   */
  public getRenderedComponentById(componentId: string): RenderedComponent | null {
    const component = this.template.components.find((c) => c.id === componentId);
    if (!component) {
      return null;
    }

    return this.renderComponent(component);
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
   * Render component children
   */
  private renderChildren(component: BaseComponent): RenderedComponent[] | undefined {
    // Check if component has children
    if (!('children' in component) || !Array.isArray((component as any).children)) {
      return undefined;
    }

    const childIds = (component as any).children as string[];
    const children: RenderedComponent[] = [];

    for (let i = 0; i < childIds.length; i++) {
      const childComponent = this.template.components.find((c) => c.id === childIds[i]);
      if (childComponent) {
        const rendered = this.renderComponent(childComponent, i);
        if (rendered) {
          children.push(rendered);
        }
      }
    }

    return children.length > 0 ? children : undefined;
  }

  /**
   * Get top-level components
   */
  private getTopLevelComponents(): BaseComponent[] {
    return this.template.components.filter((c) => !c.parentId);
  }
}
