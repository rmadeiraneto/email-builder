/**
 * Overlay Manager
 *
 * Centralized service for managing all visual feedback overlays.
 * Handles overlay lifecycle, positioning, viewport detection, and canvas integration.
 *
 * @module visual-feedback
 */

import type {
  Overlay,
  OverlayData,
  OverlayType,
  HighlightConfig,
  OffScreenElement,
  OffScreenDirection,
} from './visual-feedback.types';

/**
 * Overlay Manager Configuration
 */
export interface OverlayManagerConfig {
  /** Canvas container element */
  canvasElement: HTMLElement;

  /** Highlight configuration */
  highlightConfig: HighlightConfig;

  /** Z-index for overlay container */
  zIndex?: number;

  /** Overlay container CSS class */
  containerClass?: string;
}

/**
 * Overlay Manager
 *
 * Manages the lifecycle and positioning of visual feedback overlays.
 * Provides viewport detection, canvas integration, and layer management.
 */
export class OverlayManager {
  private config: OverlayManagerConfig;
  private overlays: Map<string, Overlay>;
  private overlayContainer: HTMLElement | null;
  private canvasElement: HTMLElement;
  private resizeObserver: ResizeObserver | null;
  private mutationObserver: MutationObserver | null;
  private overlayIdCounter: number;

  constructor(config: OverlayManagerConfig) {
    this.config = config;
    this.overlays = new Map();
    this.overlayContainer = null;
    this.canvasElement = config.canvasElement;
    this.resizeObserver = null;
    this.mutationObserver = null;
    this.overlayIdCounter = 0;

    this.initialize();
  }

  /**
   * Create a new overlay
   */
  createOverlay(type: OverlayType, data: OverlayData): string {
    const id = this.generateOverlayId();

    const overlay: Overlay = {
      id,
      type,
      data,
      createdAt: Date.now(),
    };

    this.overlays.set(id, overlay);

    // Notify that overlay was created (event can be listened to by UI components)
    this.emitOverlayEvent('create', overlay);

    return id;
  }

  /**
   * Update an existing overlay
   */
  updateOverlay(id: string, data: Partial<OverlayData>): boolean {
    const overlay = this.overlays.get(id);
    if (!overlay) {
      return false;
    }

    overlay.data = {
      ...overlay.data,
      ...data,
    };

    this.emitOverlayEvent('update', overlay);
    return true;
  }

  /**
   * Destroy an overlay
   */
  destroyOverlay(id: string): boolean {
    const overlay = this.overlays.get(id);
    if (!overlay) {
      return false;
    }

    this.overlays.delete(id);
    this.emitOverlayEvent('destroy', overlay);
    return true;
  }

  /**
   * Destroy all overlays
   */
  destroyAllOverlays(): void {
    const overlayIds = Array.from(this.overlays.keys());
    overlayIds.forEach((id) => this.destroyOverlay(id));
  }

  /**
   * Get overlay by ID
   */
  getOverlay(id: string): Overlay | null {
    return this.overlays.get(id) || null;
  }

  /**
   * Get all overlays
   */
  getAllOverlays(): Overlay[] {
    return Array.from(this.overlays.values());
  }

  /**
   * Get overlays by type
   */
  getOverlaysByType(type: OverlayType): Overlay[] {
    return Array.from(this.overlays.values()).filter((overlay) => overlay.type === type);
  }

  /**
   * Get overlay count
   */
  getOverlayCount(): number {
    return this.overlays.size;
  }

  /**
   * Check if element is in viewport
   */
  isElementInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const canvasRect = this.canvasElement.getBoundingClientRect();

    return (
      rect.bottom >= canvasRect.top &&
      rect.top <= canvasRect.bottom &&
      rect.right >= canvasRect.left &&
      rect.left <= canvasRect.right
    );
  }

  /**
   * Get visible elements from a list
   */
  getVisibleElements(elements: HTMLElement[]): HTMLElement[] {
    return elements.filter((element) => this.isElementInViewport(element));
  }

  /**
   * Get off-screen elements with their directions
   */
  getOffScreenElements(elements: HTMLElement[]): OffScreenElement[] {
    const canvasRect = this.canvasElement.getBoundingClientRect();
    const offScreenElements: OffScreenElement[] = [];

    elements.forEach((element) => {
      if (this.isElementInViewport(element)) {
        return; // Skip visible elements
      }

      const rect = element.getBoundingClientRect();
      const directions = this.getOffScreenDirections(rect, canvasRect);

      if (directions.length > 0) {
        offScreenElements.push({
          element,
          directions,
          bounds: rect,
        });
      }
    });

    return offScreenElements;
  }

  /**
   * Calculate element position relative to canvas
   */
  getElementPositionInCanvas(element: HTMLElement): DOMRect {
    const elementRect = element.getBoundingClientRect();
    const canvasRect = this.canvasElement.getBoundingClientRect();

    // Create a new DOMRect relative to canvas
    return new DOMRect(
      elementRect.left - canvasRect.left,
      elementRect.top - canvasRect.top,
      elementRect.width,
      elementRect.height
    );
  }

  /**
   * Get canvas viewport bounds
   */
  getCanvasViewport(): DOMRect {
    return this.canvasElement.getBoundingClientRect();
  }

  /**
   * Calculate measurement line positions for spacing properties
   */
  calculateMeasurementPositions(
    element: HTMLElement,
    region: 'padding' | 'margin' | 'content' | 'border',
    measurementType: 'horizontal' | 'vertical' | 'both'
  ): {
    horizontal?: { x1: number; y1: number; x2: number; y2: number; value: number };
    vertical?: { x1: number; y1: number; x2: number; y2: number; value: number };
  } {
    const computedStyle = getComputedStyle(element);
    const rect = this.getElementPositionInCanvas(element);
    const positions: any = {};

    if (region === 'padding') {
      const paddingTop = parseFloat(computedStyle.paddingTop);
      const paddingLeft = parseFloat(computedStyle.paddingLeft);
      const paddingRight = parseFloat(computedStyle.paddingRight);
      const paddingBottom = parseFloat(computedStyle.paddingBottom);

      if (measurementType === 'horizontal' || measurementType === 'both') {
        positions.horizontal = {
          x1: rect.left + paddingLeft,
          y1: rect.top + paddingTop / 2,
          x2: rect.right - paddingRight,
          y2: rect.top + paddingTop / 2,
          value: rect.width - paddingLeft - paddingRight,
        };
      }

      if (measurementType === 'vertical' || measurementType === 'both') {
        positions.vertical = {
          x1: rect.left + paddingLeft / 2,
          y1: rect.top + paddingTop,
          x2: rect.left + paddingLeft / 2,
          y2: rect.bottom - paddingBottom,
          value: rect.height - paddingTop - paddingBottom,
        };
      }
    } else if (region === 'margin') {
      const marginTop = parseFloat(computedStyle.marginTop);
      const marginLeft = parseFloat(computedStyle.marginLeft);
      const marginRight = parseFloat(computedStyle.marginRight);
      const marginBottom = parseFloat(computedStyle.marginBottom);

      if (measurementType === 'horizontal' || measurementType === 'both') {
        positions.horizontal = {
          x1: rect.left - marginLeft,
          y1: rect.top - marginTop / 2,
          x2: rect.right + marginRight,
          y2: rect.top - marginTop / 2,
          value: rect.width + marginLeft + marginRight,
        };
      }

      if (measurementType === 'vertical' || measurementType === 'both') {
        positions.vertical = {
          x1: rect.left - marginLeft / 2,
          y1: rect.top - marginTop,
          x2: rect.left - marginLeft / 2,
          y2: rect.bottom + marginBottom,
          value: rect.height + marginTop + marginBottom,
        };
      }
    } else if (region === 'content') {
      if (measurementType === 'horizontal' || measurementType === 'both') {
        positions.horizontal = {
          x1: rect.left,
          y1: rect.top + rect.height / 2,
          x2: rect.right,
          y2: rect.top + rect.height / 2,
          value: rect.width,
        };
      }

      if (measurementType === 'vertical' || measurementType === 'both') {
        positions.vertical = {
          x1: rect.left + rect.width / 2,
          y1: rect.top,
          x2: rect.left + rect.width / 2,
          y2: rect.bottom,
          value: rect.height,
        };
      }
    }

    return positions;
  }

  /**
   * Get overlay container element
   */
  getOverlayContainer(): HTMLElement | null {
    return this.overlayContainer;
  }

  /**
   * Update configuration at runtime
   */
  updateConfig(config: Partial<OverlayManagerConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  /**
   * Destroy manager and clean up
   */
  destroy(): void {
    // Destroy all overlays
    this.destroyAllOverlays();

    // Disconnect observers
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }

    // Remove overlay container
    if (this.overlayContainer && this.overlayContainer.parentNode) {
      this.overlayContainer.parentNode.removeChild(this.overlayContainer);
      this.overlayContainer = null;
    }
  }

  /**
   * Initialize overlay manager
   */
  private initialize(): void {
    this.createOverlayContainer();
    this.setupObservers();
  }

  /**
   * Create overlay container element
   */
  private createOverlayContainer(): void {
    this.overlayContainer = document.createElement('div');
    this.overlayContainer.className = this.config.containerClass || 'visual-feedback-overlay-container';
    this.overlayContainer.style.position = 'absolute';
    this.overlayContainer.style.top = '0';
    this.overlayContainer.style.left = '0';
    this.overlayContainer.style.width = '100%';
    this.overlayContainer.style.height = '100%';
    this.overlayContainer.style.pointerEvents = 'none'; // Don't block interactions
    this.overlayContainer.style.zIndex = String(this.config.zIndex || 9999);
    this.overlayContainer.style.overflow = 'visible';

    // Append to canvas element
    if (this.canvasElement.style.position === '' || this.canvasElement.style.position === 'static') {
      this.canvasElement.style.position = 'relative';
    }

    this.canvasElement.appendChild(this.overlayContainer);
  }

  /**
   * Setup observers for canvas changes
   */
  private setupObservers(): void {
    // Resize observer to detect canvas size changes
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleCanvasChange('resize');
      });
      this.resizeObserver.observe(this.canvasElement);
    }

    // Mutation observer to detect canvas DOM changes
    if (typeof MutationObserver !== 'undefined') {
      this.mutationObserver = new MutationObserver(() => {
        this.handleCanvasChange('mutation');
      });
      this.mutationObserver.observe(this.canvasElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
    }

    // Scroll event listener
    this.canvasElement.addEventListener('scroll', this.handleScroll.bind(this));
  }

  /**
   * Handle canvas scroll
   */
  private handleScroll(): void {
    this.handleCanvasChange('scroll');
  }

  /**
   * Handle canvas changes
   */
  private handleCanvasChange(eventType: 'scroll' | 'resize' | 'mutation'): void {
    // Emit canvas change event so UI components can reposition overlays
    this.emitCanvasChangeEvent(eventType);
  }

  /**
   * Generate unique overlay ID
   */
  private generateOverlayId(): string {
    this.overlayIdCounter += 1;
    return `overlay-${this.overlayIdCounter}-${Date.now()}`;
  }

  /**
   * Get off-screen directions for an element
   */
  private getOffScreenDirections(elementRect: DOMRect, canvasRect: DOMRect): OffScreenDirection[] {
    const directions: OffScreenDirection[] = [];

    if (elementRect.bottom < canvasRect.top) {
      directions.push('top');
    }
    if (elementRect.top > canvasRect.bottom) {
      directions.push('bottom');
    }
    if (elementRect.right < canvasRect.left) {
      directions.push('left');
    }
    if (elementRect.left > canvasRect.right) {
      directions.push('right');
    }

    return directions;
  }

  /**
   * Emit overlay event
   */
  private emitOverlayEvent(action: 'create' | 'update' | 'destroy', overlay: Overlay): void {
    // Create custom event for overlay changes
    const event = new CustomEvent('overlay-change', {
      detail: {
        action,
        overlay,
      },
    });

    if (this.overlayContainer) {
      this.overlayContainer.dispatchEvent(event);
    }
  }

  /**
   * Emit canvas change event
   */
  private emitCanvasChangeEvent(eventType: 'scroll' | 'resize' | 'mutation'): void {
    const event = new CustomEvent('canvas-change', {
      detail: {
        eventType,
        viewport: this.getCanvasViewport(),
        canvasElement: this.canvasElement,
      },
    });

    if (this.overlayContainer) {
      this.overlayContainer.dispatchEvent(event);
    }
  }
}
