/**
 * Tabs component tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Tabs } from './Tabs';
import { TabItem } from './tabs.types';
import type { TabsConfig, TabItemConfig } from './tabs.types';
import styles from './tabs.module.scss';

describe('Tabs', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('initialization', () => {
    it('should create tabs element', () => {
      const tabs = new Tabs({
        items: [
          { tabContent: 'Tab 1', paneContent: 'Content 1' },
          { tabContent: 'Tab 2', paneContent: 'Content 2' },
        ],
      });

      expect(tabs.getEl()).toBeInstanceOf(HTMLDivElement);
    });

    it('should throw error when items array is empty', () => {
      expect(() => {
        new Tabs({ items: [] });
      }).toThrow('You need to pass an array of items');
    });

    it('should throw error when items are missing', () => {
      expect(() => {
        // @ts-expect-error Testing invalid input
        new Tabs({});
      }).toThrow('You need to pass an array of items');
    });

    it('should create tabs from TabItemConfig objects', () => {
      const items: TabItemConfig[] = [
        { tabContent: 'Tab 1', paneContent: 'Content 1' },
        { tabContent: 'Tab 2', paneContent: 'Content 2' },
      ];

      const tabs = new Tabs({ items });

      expect(tabs.getItems()).toHaveLength(2);
      expect(tabs.getItems()[0]).toBeInstanceOf(TabItem);
      expect(tabs.getItems()[1]).toBeInstanceOf(TabItem);
    });

    it('should create tabs from TabItem instances', () => {
      const items = [
        new TabItem({ tabContent: 'Tab 1', paneContent: 'Content 1' }),
        new TabItem({ tabContent: 'Tab 2', paneContent: 'Content 2' }),
      ];

      const tabs = new Tabs({ items });

      expect(tabs.getItems()).toHaveLength(2);
      expect(tabs.getItems()[0]).toBe(items[0]);
      expect(tabs.getItems()[1]).toBe(items[1]);
    });

    it('should append to target element if provided', () => {
      const tabs = new Tabs({
        items: [{ tabContent: 'Tab 1', paneContent: 'Content 1' }],
        appendTo: container,
      });

      expect(container.contains(tabs.getEl())).toBe(true);
    });

    it('should apply extended classes', () => {
      const tabs = new Tabs({
        items: [{ tabContent: 'Tab 1', paneContent: 'Content 1' }],
        extendedClasses: 'custom-class another-class',
      });

      expect(tabs.getEl().classList.contains('custom-class')).toBe(true);
      expect(tabs.getEl().classList.contains('another-class')).toBe(true);
    });
  });

  describe('rendering', () => {
    it('should render tab buttons', () => {
      const tabs = new Tabs({
        items: [
          { tabContent: 'First Tab', paneContent: 'Content 1' },
          { tabContent: 'Second Tab', paneContent: 'Content 2' },
        ],
        appendTo: container,
      });

      const tabButtons = container.querySelectorAll('[class*="tabItem"]');
      expect(tabButtons).toHaveLength(2);
      expect(tabButtons[0].innerHTML).toContain('First Tab');
      expect(tabButtons[1].innerHTML).toContain('Second Tab');
    });

    it('should render tab panes', () => {
      const tabs = new Tabs({
        items: [
          { tabContent: 'Tab 1', paneContent: 'First Content' },
          { tabContent: 'Tab 2', paneContent: 'Second Content' },
        ],
        appendTo: container,
      });

      const tabPanes = container.querySelectorAll('[class*="tabPane"]');
      expect(tabPanes).toHaveLength(2);
      expect(tabPanes[0].innerHTML).toContain('First Content');
      expect(tabPanes[1].innerHTML).toContain('Second Content');
    });

    it('should render HTML content in tabs', () => {
      const tabEl = document.createElement('span');
      tabEl.textContent = 'Custom Tab';
      tabEl.className = 'custom-tab';

      const paneEl = document.createElement('div');
      paneEl.textContent = 'Custom Content';
      paneEl.className = 'custom-content';

      const tabs = new Tabs({
        items: [{ tabContent: tabEl, paneContent: paneEl }],
        appendTo: container,
      });

      expect(container.querySelector('.custom-tab')).toBeTruthy();
      expect(container.querySelector('.custom-content')).toBeTruthy();
    });

    it('should apply tab extended classes', () => {
      const tabs = new Tabs({
        items: [
          {
            tabContent: 'Tab 1',
            paneContent: 'Content 1',
            tabExtendedClasses: 'custom-tab-class',
          },
        ],
        appendTo: container,
      });

      const tabButton = container.querySelector('[class*="tabItem"]');
      expect(tabButton?.classList.contains('custom-tab-class')).toBe(true);
    });

    it('should apply pane extended classes', () => {
      const tabs = new Tabs({
        items: [
          {
            tabContent: 'Tab 1',
            paneContent: 'Content 1',
            paneExtendedClasses: 'custom-pane-class',
          },
        ],
        appendTo: container,
      });

      const tabPane = container.querySelector('[class*="tabPane"]');
      expect(tabPane?.classList.contains('custom-pane-class')).toBe(true);
    });
  });

  describe('active state', () => {
    it('should activate first tab by default', () => {
      const tabs = new Tabs({
        items: [
          { tabContent: 'Tab 1', paneContent: 'Content 1' },
          { tabContent: 'Tab 2', paneContent: 'Content 2' },
        ],
        appendTo: container,
      });

      const activeItem = tabs.getActiveItem();
      expect(activeItem).toBe(tabs.getItems()[0]);
      expect(activeItem?.isActive()).toBe(true);
    });

    it('should activate tab with startActive true', () => {
      const tabs = new Tabs({
        items: [
          { tabContent: 'Tab 1', paneContent: 'Content 1' },
          { tabContent: 'Tab 2', paneContent: 'Content 2', startActive: true },
        ],
        appendTo: container,
      });

      const activeItem = tabs.getActiveItem();
      expect(activeItem).toBe(tabs.getItems()[1]);
      expect(activeItem?.isActive()).toBe(true);
    });

    it('should activate only first tab when multiple have startActive', () => {
      const tabs = new Tabs({
        items: [
          { tabContent: 'Tab 1', paneContent: 'Content 1', startActive: true },
          { tabContent: 'Tab 2', paneContent: 'Content 2', startActive: true },
          { tabContent: 'Tab 3', paneContent: 'Content 3', startActive: true },
        ],
        appendTo: container,
      });

      const activeItem = tabs.getActiveItem();
      expect(activeItem).toBe(tabs.getItems()[0]);
      expect(tabs.getItems()[1].isActive()).toBe(false);
      expect(tabs.getItems()[2].isActive()).toBe(false);
    });

    it('should apply active classes to tab and pane', () => {
      const tabs = new Tabs({
        items: [
          { tabContent: 'Tab 1', paneContent: 'Content 1', startActive: true },
        ],
        appendTo: container,
      });

      const tabButton = container.querySelector('[class*="tabItem"]');
      const tabPane = container.querySelector('[class*="tabPane"]');

      expect(tabButton?.classList.contains(styles['tabs__tabItem--active'])).toBe(true);
      expect(tabPane?.classList.contains(styles['tabs__tabPane--active'])).toBe(true);
    });

    it('should only show active pane content', () => {
      const tabs = new Tabs({
        items: [
          { tabContent: 'Tab 1', paneContent: 'Content 1' },
          { tabContent: 'Tab 2', paneContent: 'Content 2' },
        ],
        appendTo: container,
      });

      const panes = container.querySelectorAll('[class*="tabPane"]');
      const activePaneClass = styles['tabs__tabPane--active'];

      expect(panes[0].classList.contains(activePaneClass)).toBe(true);
      expect(panes[1].classList.contains(activePaneClass)).toBe(false);
    });
  });

  describe('interactions', () => {
    it('should activate tab when clicked', () => {
      const tabs = new Tabs({
        items: [
          { tabContent: 'Tab 1', paneContent: 'Content 1' },
          { tabContent: 'Tab 2', paneContent: 'Content 2' },
        ],
        appendTo: container,
      });

      const tabButtons = container.querySelectorAll('[class*="tabItem"]');
      (tabButtons[1] as HTMLElement).click();

      expect(tabs.getActiveItem()).toBe(tabs.getItems()[1]);
      expect(tabs.getItems()[1].isActive()).toBe(true);
      expect(tabs.getItems()[0].isActive()).toBe(false);
    });

    it('should call onSelect callback when tab is clicked', () => {
      const onSelectSpy = vi.fn();

      const tabs = new Tabs({
        items: [
          { tabContent: 'Tab 1', paneContent: 'Content 1' },
          {
            tabContent: 'Tab 2',
            paneContent: 'Content 2',
            onSelect: onSelectSpy,
          },
        ],
        appendTo: container,
      });

      const tabButtons = container.querySelectorAll('[class*="tabItem"]');
      (tabButtons[1] as HTMLElement).click();

      expect(onSelectSpy).toHaveBeenCalledTimes(1);
      expect(onSelectSpy).toHaveBeenCalledWith(tabs.getItems()[1]);
    });

    it('should not activate tab when showPaneOnTabClick is false', () => {
      const tabs = new Tabs({
        items: [
          { tabContent: 'Tab 1', paneContent: 'Content 1' },
          {
            tabContent: 'Tab 2',
            paneContent: 'Content 2',
            showPaneOnTabClick: false,
          },
        ],
        appendTo: container,
      });

      const tabButtons = container.querySelectorAll('[class*="tabItem"]');
      (tabButtons[1] as HTMLElement).click();

      expect(tabs.getActiveItem()).toBe(tabs.getItems()[0]);
      expect(tabs.getItems()[1].isActive()).toBe(false);
    });

    it('should deactivate previous tab when new tab is activated', () => {
      const tabs = new Tabs({
        items: [
          { tabContent: 'Tab 1', paneContent: 'Content 1' },
          { tabContent: 'Tab 2', paneContent: 'Content 2' },
        ],
        appendTo: container,
      });

      const tabButtons = container.querySelectorAll('[class*="tabItem"]');
      const firstTab = tabButtons[0];

      expect(firstTab.classList.contains(styles['tabs__tabItem--active'])).toBe(true);

      (tabButtons[1] as HTMLElement).click();

      expect(firstTab.classList.contains(styles['tabs__tabItem--active'])).toBe(false);
    });
  });

  describe('public API', () => {
    it('should activate tab by index', () => {
      const tabs = new Tabs({
        items: [
          { tabContent: 'Tab 1', paneContent: 'Content 1' },
          { tabContent: 'Tab 2', paneContent: 'Content 2' },
          { tabContent: 'Tab 3', paneContent: 'Content 3' },
        ],
        appendTo: container,
      });

      tabs.activateTabByIndex(2);

      expect(tabs.getActiveItem()).toBe(tabs.getItems()[2]);
      expect(tabs.getItems()[2].isActive()).toBe(true);
    });

    it('should throw error when activating invalid index', () => {
      const tabs = new Tabs({
        items: [
          { tabContent: 'Tab 1', paneContent: 'Content 1' },
          { tabContent: 'Tab 2', paneContent: 'Content 2' },
        ],
      });

      expect(() => tabs.activateTabByIndex(-1)).toThrow('Tab index -1 is out of range');
      expect(() => tabs.activateTabByIndex(5)).toThrow('Tab index 5 is out of range');
    });

    it('should return all tab items', () => {
      const tabs = new Tabs({
        items: [
          { tabContent: 'Tab 1', paneContent: 'Content 1' },
          { tabContent: 'Tab 2', paneContent: 'Content 2' },
        ],
      });

      const items = tabs.getItems();
      expect(items).toHaveLength(2);
      expect(items[0]).toBeInstanceOf(TabItem);
      expect(items[1]).toBeInstanceOf(TabItem);
    });

    it('should return active item', () => {
      const tabs = new Tabs({
        items: [
          { tabContent: 'Tab 1', paneContent: 'Content 1' },
          { tabContent: 'Tab 2', paneContent: 'Content 2', startActive: true },
        ],
      });

      const activeItem = tabs.getActiveItem();
      expect(activeItem).toBe(tabs.getItems()[1]);
    });

    it('should destroy tabs and remove from DOM', () => {
      const tabs = new Tabs({
        items: [{ tabContent: 'Tab 1', paneContent: 'Content 1' }],
        appendTo: container,
      });

      expect(container.contains(tabs.getEl())).toBe(true);

      tabs.destroy();

      expect(container.contains(tabs.getEl())).toBe(false);
    });
  });

  describe('TabItem', () => {
    it('should create TabItem with default values', () => {
      const item = new TabItem({
        tabContent: 'Tab',
        paneContent: 'Content',
      });

      expect(item.startActive).toBe(false);
      expect(item.showPaneOnTabClick).toBe(true);
      expect(item.tabExtendedClasses).toBe('');
      expect(item.paneExtendedClasses).toBe('');
    });

    it('should create TabItem with custom values', () => {
      const onSelect = vi.fn();
      const item = new TabItem({
        tabContent: 'Tab',
        paneContent: 'Content',
        startActive: true,
        showPaneOnTabClick: false,
        tabExtendedClasses: 'custom-tab',
        paneExtendedClasses: 'custom-pane',
        onSelect,
      });

      expect(item.startActive).toBe(true);
      expect(item.showPaneOnTabClick).toBe(false);
      expect(item.tabExtendedClasses).toBe('custom-tab');
      expect(item.paneExtendedClasses).toBe('custom-pane');
      expect(item.onSelect).toBe(onSelect);
    });

    it('should set and get tab element', () => {
      const item = new TabItem({
        tabContent: 'Tab',
        paneContent: 'Content',
      });

      const tabElement = document.createElement('div');
      item.setTabElement(tabElement);

      expect(item.getTab()).toBe(tabElement);
    });

    it('should set and get pane element', () => {
      const item = new TabItem({
        tabContent: 'Tab',
        paneContent: 'Content',
      });

      const paneElement = document.createElement('div');
      item.setPaneElement(paneElement);

      expect(item.getPane()).toBe(paneElement);
    });

    it('should throw error when getting tab before setting', () => {
      const item = new TabItem({
        tabContent: 'Tab',
        paneContent: 'Content',
      });

      expect(() => item.getTab()).toThrow('Tab element not set');
    });

    it('should throw error when getting pane before setting', () => {
      const item = new TabItem({
        tabContent: 'Tab',
        paneContent: 'Content',
      });

      expect(() => item.getPane()).toThrow('Pane element not set');
    });

    it('should set and get active state', () => {
      const item = new TabItem({
        tabContent: 'Tab',
        paneContent: 'Content',
      });

      expect(item.isActive()).toBe(false);

      item.setActive(true);
      expect(item.isActive()).toBe(true);

      item.setActive(false);
      expect(item.isActive()).toBe(false);
    });

    it('should initialize with startActive state', () => {
      const item = new TabItem({
        tabContent: 'Tab',
        paneContent: 'Content',
        startActive: true,
      });

      expect(item.isActive()).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle single tab', () => {
      const tabs = new Tabs({
        items: [{ tabContent: 'Only Tab', paneContent: 'Only Content' }],
        appendTo: container,
      });

      expect(tabs.getItems()).toHaveLength(1);
      expect(tabs.getActiveItem()).toBe(tabs.getItems()[0]);
    });

    it('should handle many tabs', () => {
      const items = Array.from({ length: 20 }, (_, i) => ({
        tabContent: `Tab ${i + 1}`,
        paneContent: `Content ${i + 1}`,
      }));

      const tabs = new Tabs({
        items,
        appendTo: container,
      });

      expect(tabs.getItems()).toHaveLength(20);
      expect(tabs.getActiveItem()).toBe(tabs.getItems()[0]);
    });

    it('should handle empty string content', () => {
      const tabs = new Tabs({
        items: [
          { tabContent: '', paneContent: '' },
          { tabContent: 'Tab 2', paneContent: 'Content 2' },
        ],
        appendTo: container,
      });

      const tabButtons = container.querySelectorAll('[class*="tabItem"]');
      expect(tabButtons[0].innerHTML).toBe('');
    });

    it('should handle complex HTML in tab content', () => {
      const complexHTML = '<div><span class="icon">🎨</span> <strong>Design</strong></div>';

      const tabs = new Tabs({
        items: [{ tabContent: complexHTML, paneContent: 'Content' }],
        appendTo: container,
      });

      const tabButton = container.querySelector('[class*="tabItem"]');
      expect(tabButton?.querySelector('.icon')).toBeTruthy();
      expect(tabButton?.querySelector('strong')).toBeTruthy();
    });
  });
});
