/**
 * Tab item configuration
 */
export interface TabItemConfig {
  /**
   * Content to display in the tab button
   * Can be text, HTML string, or HTMLElement
   */
  tabContent: string | HTMLElement;

  /**
   * Content to display in the tab pane
   * Can be text, HTML string, or HTMLElement
   */
  paneContent: string | HTMLElement;

  /**
   * Whether this tab should be active by default
   * @default false
   */
  startActive?: boolean;

  /**
   * Whether clicking the tab should show its pane
   * @default true
   */
  showPaneOnTabClick?: boolean;

  /**
   * Callback fired when tab is selected
   */
  onSelect?: (item: TabItem) => void;

  /**
   * Additional CSS classes for the tab element
   */
  tabExtendedClasses?: string;

  /**
   * Additional CSS classes for the pane element
   */
  paneExtendedClasses?: string;
}

/**
 * Tab item instance
 */
export class TabItem {
  tabContent: string | HTMLElement;
  paneContent: string | HTMLElement;
  startActive: boolean;
  showPaneOnTabClick: boolean;
  onSelect?: (item: TabItem) => void;
  tabExtendedClasses: string;
  paneExtendedClasses: string;

  private _active: boolean = false;
  private _tab: HTMLElement | null = null;
  private _pane: HTMLElement | null = null;

  constructor(config: TabItemConfig) {
    this.tabContent = config.tabContent;
    this.paneContent = config.paneContent;
    this.startActive = config.startActive ?? false;
    this.showPaneOnTabClick = config.showPaneOnTabClick ?? true;
    if (config.onSelect !== undefined) {
      this.onSelect = config.onSelect;
    }
    this.tabExtendedClasses = config.tabExtendedClasses ?? '';
    this.paneExtendedClasses = config.paneExtendedClasses ?? '';
    this._active = this.startActive;
  }

  setPaneElement(element: HTMLElement): void {
    this._pane = element;
  }

  setTabElement(element: HTMLElement): void {
    this._tab = element;
  }

  getPane(): HTMLElement {
    if (!this._pane) {
      throw new Error('Pane element not set');
    }
    return this._pane;
  }

  getTab(): HTMLElement {
    if (!this._tab) {
      throw new Error('Tab element not set');
    }
    return this._tab;
  }

  setActive(isActive: boolean): void {
    this._active = isActive;
  }

  isActive(): boolean {
    return this._active;
  }
}

/**
 * Tabs component configuration
 */
export interface TabsConfig {
  /**
   * Array of tab items to display
   */
  items: (TabItemConfig | TabItem)[];

  /**
   * Additional CSS classes to apply to the tabs container
   */
  extendedClasses?: string;

  /**
   * Element to append the tabs component to
   * If not provided, use getEl() to get the element and append it manually
   */
  appendTo?: HTMLElement;
}

/**
 * Tabs component props (for external use)
 */
export interface TabsProps extends TabsConfig {}
