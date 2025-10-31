import styles from './tabs.module.scss';
import { TabsConfig, TabItem, TabItemConfig } from './tabs.types';

/**
 * Tabs component for organizing content into tabbed panels
 *
 * Provides a tabbed interface where only one tab is active at a time.
 * Clicking a tab activates it and displays its associated content pane.
 *
 * @example
 * Basic usage:
 * ```ts
 * const tabs = new Tabs({
 *   items: [
 *     { tabContent: 'Tab 1', paneContent: 'Content 1' },
 *     { tabContent: 'Tab 2', paneContent: 'Content 2', startActive: true }
 *   ]
 * });
 * document.body.appendChild(tabs.getEl());
 * ```
 *
 * @example
 * With callback:
 * ```ts
 * const tabs = new Tabs({
 *   items: [
 *     {
 *       tabContent: 'Settings',
 *       paneContent: '<div>Settings content</div>',
 *       onSelect: (item) => console.log('Settings selected')
 *     }
 *   ]
 * });
 * ```
 */
export class Tabs {
  private config: Required<Omit<TabsConfig, 'appendTo' | 'items'>> & { items: TabItem[] };
  private element: HTMLElement;
  private tabsContainer: HTMLElement;
  private panesContainer: HTMLElement;
  private items: TabItem[];

  constructor(config: TabsConfig) {
    if (!config.items || config.items.length === 0) {
      throw new Error(
        'You need to pass an array of items in order to create an instance of Tabs (through config.items)'
      );
    }

    this.config = {
      items: this.convertItems(config.items),
      extendedClasses: config.extendedClasses ?? '',
    };

    this.items = this.config.items;
    this.element = this.createElement();
    this.tabsContainer = this.createTabsContainer();
    this.panesContainer = this.createPanesContainer();

    this.createItems();
    this.setOnlyOneActive();

    this.element.append(this.tabsContainer, this.panesContainer);

    if (config.appendTo) {
      config.appendTo.appendChild(this.element);
    }
  }

  /**
   * Get the root element of the tabs component
   */
  getEl(): HTMLElement {
    return this.element;
  }

  /**
   * Get all tab items
   */
  getItems(): TabItem[] {
    return this.items;
  }

  /**
   * Get the currently active tab item
   */
  getActiveItem(): TabItem | null {
    return this.items.find((item) => item.isActive()) ?? null;
  }

  /**
   * Activate a specific tab by index
   */
  activateTabByIndex(index: number): void {
    if (index < 0 || index >= this.items.length) {
      throw new Error(`Tab index ${index} is out of range`);
    }
    this.activateItem(this.items[index]);
  }

  /**
   * Destroy the tabs component and clean up
   */
  destroy(): void {
    this.element.remove();
  }

  private createElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = `${styles.tabs}${
      this.config.extendedClasses ? ' ' + this.config.extendedClasses : ''
    }`;
    return element;
  }

  private createTabsContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = styles.tabs__tabs;
    return container;
  }

  private createPanesContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = styles.tabs__contentWrapper;
    return container;
  }

  private createItems(): void {
    this.items.forEach((item) => {
      this.addTab(item);
      this.addPane(item);
      this.addEventListeners(item);
    });
  }

  private addTab(tabItem: TabItem): void {
    const tab = document.createElement('div');
    tab.className = `${styles.tabs__tabItem}${
      tabItem.tabExtendedClasses ? ' ' + tabItem.tabExtendedClasses : ''
    }`;

    if (typeof tabItem.tabContent === 'string') {
      tab.innerHTML = tabItem.tabContent;
    } else {
      tab.appendChild(tabItem.tabContent);
    }

    this.tabsContainer.appendChild(tab);
    tabItem.setTabElement(tab);
  }

  private addPane(tabItem: TabItem): void {
    const pane = document.createElement('div');
    pane.className = `${styles.tabs__tabPane}${
      tabItem.paneExtendedClasses ? ' ' + tabItem.paneExtendedClasses : ''
    }`;

    if (typeof tabItem.paneContent === 'string') {
      pane.innerHTML = tabItem.paneContent;
    } else {
      pane.appendChild(tabItem.paneContent);
    }

    this.panesContainer.appendChild(pane);
    tabItem.setPaneElement(pane);
  }

  private addEventListeners(tabItem: TabItem): void {
    if (tabItem.showPaneOnTabClick) {
      tabItem.getTab().addEventListener('click', () => {
        this.onItemClick(tabItem);
      });
    }
  }

  private onItemClick(item: TabItem): void {
    this.activateItem(item);
    if (item.onSelect) {
      item.onSelect(item);
    }
  }

  private activateItem(item: TabItem): void {
    this.deselectAllItems();
    this.selectItem(item);
  }

  private selectItem(item: TabItem): void {
    item.setActive(true);
    item.getTab().classList.add(styles['tabs__tabItem--active']);
    item.getPane().classList.add(styles['tabs__tabPane--active']);
  }

  private deselectItem(item: TabItem): void {
    item.setActive(false);
    item.getTab().classList.remove(styles['tabs__tabItem--active']);
    item.getPane().classList.remove(styles['tabs__tabPane--active']);
  }

  private deselectAllItems(): void {
    this.items.forEach((item) => {
      this.deselectItem(item);
    });
  }

  private convertItems(items: (TabItemConfig | TabItem)[]): TabItem[] {
    return items.map((item) => {
      return item instanceof TabItem ? item : new TabItem(item);
    });
  }

  private setOnlyOneActive(): void {
    const activeItems = this.items.filter((item) => item.startActive);

    if (activeItems.length === 0) {
      // No active items, activate the first one
      this.selectItem(this.items[0]);
    } else if (activeItems.length === 1) {
      // One active item, select it
      this.selectItem(activeItems[0]);
    } else {
      // Multiple active items, select the first one and deactivate the rest
      this.selectItem(activeItems[0]);
      activeItems.slice(1).forEach((item) => {
        item.setActive(false);
      });
    }
  }
}
