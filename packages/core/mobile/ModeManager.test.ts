/**
 * ModeManager Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ModeManager, ModeManagerEvent } from './ModeManager';
import { DeviceMode } from './mobile.types';
import { EventEmitter } from '../services/EventEmitter';
import { CommandManager } from '../commands/CommandManager';
import type { Template } from '../../types';

describe('ModeManager', () => {
  let eventEmitter: EventEmitter;
  let modeManager: ModeManager;
  let desktopCommandManager: CommandManager;
  let mobileCommandManager: CommandManager;
  let mockTemplate: Template;

  beforeEach(() => {
    eventEmitter = new EventEmitter();
    desktopCommandManager = new CommandManager(eventEmitter);
    mobileCommandManager = new CommandManager(eventEmitter);

    mockTemplate = {
      id: 'template-1',
      name: 'Test Template',
      components: [
        {
          id: 'comp-1',
          type: 'text',
          styles: {
            padding: '32px',
            fontSize: '16px',
          },
          mobileStyles: {
            padding: '16px',
          },
        },
      ],
    } as Template;

    modeManager = new ModeManager({
      eventEmitter,
      config: {
        enabled: true,
        breakpoints: { mobile: 375 },
        modeSwitcher: { sticky: true, showLabels: true },
        canvas: { transitionDuration: 300 },
        mobileDefaults: {
          enabled: true,
          showPromptOnFirstSwitch: true,
          transformations: {
            paddingReduction: 0.5,
            marginReduction: 0.5,
            fontSizeReduction: 0.9,
            autoWrapHorizontalLists: true,
            stackHeadersVertically: true,
            fullWidthButtons: true,
            minTouchTargetSize: 44,
          },
          componentSpecific: {},
        },
        propertyOverrides: {
          blacklist: ['id', 'type', 'content.text'],
          canvasSettingsOverridable: ['width', 'backgroundColor'],
        },
        componentMobileControls: {},
        validation: { enabled: true, rules: [], showInlineWarnings: true, showValidationPanel: false },
        export: {
          defaultMode: 'hybrid',
          mobileBreakpoint: 768,
          inlineStyles: true,
          generateMediaQueries: true,
        },
        performance: {
          lazyLoadMobileData: true,
          preloadOnHover: true,
          virtualRendering: true,
          virtualRenderingThreshold: 50,
          debounceDelay: 16,
        },
        targetMode: 'hybrid',
      },
      desktopCommandManager,
      mobileCommandManager,
    });

    modeManager.setTemplate(mockTemplate);
  });

  describe('getCurrentMode', () => {
    it('should start in desktop mode', () => {
      expect(modeManager.getCurrentMode()).toBe(DeviceMode.DESKTOP);
    });
  });

  describe('isDesktopMode', () => {
    it('should return true in desktop mode', () => {
      expect(modeManager.isDesktopMode()).toBe(true);
    });

    it('should return false in mobile mode', async () => {
      await modeManager.switchMode(DeviceMode.MOBILE);
      expect(modeManager.isDesktopMode()).toBe(false);
    });
  });

  describe('isMobileMode', () => {
    it('should return false in desktop mode', () => {
      expect(modeManager.isMobileMode()).toBe(false);
    });

    it('should return true in mobile mode', async () => {
      await modeManager.switchMode(DeviceMode.MOBILE);
      expect(modeManager.isMobileMode()).toBe(true);
    });
  });

  describe('switchMode', () => {
    it('should switch from desktop to mobile', async () => {
      expect(modeManager.getCurrentMode()).toBe(DeviceMode.DESKTOP);

      await modeManager.switchMode(DeviceMode.MOBILE);

      expect(modeManager.getCurrentMode()).toBe(DeviceMode.MOBILE);
    });

    it('should emit mode switch events', async () => {
      const startListener = vi.fn();
      const completeListener = vi.fn();

      eventEmitter.on(ModeManagerEvent.MODE_SWITCH_START, startListener);
      eventEmitter.on(ModeManagerEvent.MODE_SWITCH_COMPLETE, completeListener);

      await modeManager.switchMode(DeviceMode.MOBILE);

      // Wait for microtask to complete
      await new Promise(resolve => queueMicrotask(resolve));

      expect(startListener).toHaveBeenCalledWith(
        expect.objectContaining({
          fromMode: DeviceMode.DESKTOP,
          toMode: DeviceMode.MOBILE,
        })
      );

      expect(completeListener).toHaveBeenCalledWith(
        expect.objectContaining({
          fromMode: DeviceMode.DESKTOP,
          toMode: DeviceMode.MOBILE,
        })
      );
    });

    it('should not switch if already in target mode', async () => {
      const listener = vi.fn();
      eventEmitter.on(ModeManagerEvent.MODE_SWITCH_START, listener);

      await modeManager.switchMode(DeviceMode.DESKTOP);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should preserve selected component and scroll position', async () => {
      const options = {
        selectedComponentId: 'comp-1',
        scrollPosition: { x: 0, y: 100 },
      };

      await modeManager.switchMode(DeviceMode.MOBILE, options);

      // Verify via event data
      const completeListener = vi.fn();
      eventEmitter.on(ModeManagerEvent.MODE_SWITCH_COMPLETE, completeListener);

      await modeManager.switchMode(DeviceMode.DESKTOP, options);

      // Wait for microtask to complete
      await new Promise(resolve => queueMicrotask(resolve));

      expect(completeListener).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedComponentId: 'comp-1',
          scrollPosition: { x: 0, y: 100 },
        })
      );
    });

    it('should emit first mobile entry event', async () => {
      const listener = vi.fn();
      eventEmitter.on(ModeManagerEvent.FIRST_MOBILE_ENTRY, listener);

      await modeManager.switchMode(DeviceMode.MOBILE);

      // Wait for microtask to complete
      await new Promise(resolve => queueMicrotask(resolve));

      expect(listener).toHaveBeenCalled();
    });
  });

  describe('getEffectiveStyles', () => {
    it('should return desktop styles in desktop mode', () => {
      const component = mockTemplate.components[0];
      const styles = modeManager.getEffectiveStyles(component);

      expect(styles).toEqual({
        padding: '32px',
        fontSize: '16px',
      });
    });

    it('should return merged styles in mobile mode', async () => {
      await modeManager.switchMode(DeviceMode.MOBILE);

      const component = mockTemplate.components[0];
      const styles = modeManager.getEffectiveStyles(component);

      expect(styles).toEqual({
        padding: '16px',  // Mobile override
        fontSize: '16px',  // Inherited from desktop
      });
    });
  });

  describe('getPropertyInheritanceInfo', () => {
    it('should indicate when property is overridden', async () => {
      await modeManager.switchMode(DeviceMode.MOBILE);

      const component = mockTemplate.components[0];
      const info = modeManager.getPropertyInheritanceInfo(component, 'styles.padding');

      expect(info.isOverridden).toBe(true);
      expect(info.desktopValue).toBe('32px');
      expect(info.mobileValue).toBe('16px');
      expect(info.effectiveValue).toBe('16px');
    });

    it('should indicate when property inherits from desktop', async () => {
      await modeManager.switchMode(DeviceMode.MOBILE);

      const component = mockTemplate.components[0];
      const info = modeManager.getPropertyInheritanceInfo(component, 'styles.fontSize');

      expect(info.isOverridden).toBe(false);
      expect(info.desktopValue).toBe('16px');
      expect(info.mobileValue).toBeUndefined();
      expect(info.effectiveValue).toBe('16px');
    });

    it('should check if property can be overridden', () => {
      const component = mockTemplate.components[0];

      const canOverride = modeManager.getPropertyInheritanceInfo(component, 'styles.padding');
      expect(canOverride.canOverride).toBe(true);

      const cannotOverride = modeManager.getPropertyInheritanceInfo(component, 'id');
      expect(cannotOverride.canOverride).toBe(false);
      expect(cannotOverride.cannotOverrideReason).toBeDefined();
    });
  });

  describe('getActiveCommandManager', () => {
    it('should return desktop command manager in desktop mode', () => {
      const manager = modeManager.getActiveCommandManager();
      expect(manager).toBe(desktopCommandManager);
    });

    it('should return mobile command manager in mobile mode', async () => {
      await modeManager.switchMode(DeviceMode.MOBILE);
      const manager = modeManager.getActiveCommandManager();
      expect(manager).toBe(mobileCommandManager);
    });
  });

  describe('canUndo/canRedo', () => {
    it('should check undo availability in current mode', () => {
      expect(modeManager.canUndo()).toBe(false);
    });

    it('should check redo availability in current mode', () => {
      expect(modeManager.canRedo()).toBe(false);
    });
  });

  describe('markDefaultsApplied', () => {
    it('should mark defaults as applied', () => {
      modeManager.markDefaultsApplied();

      expect(mockTemplate.mobileDevMode?.defaultsApplied).toBe(true);
      expect(mockTemplate.mobileDevMode?.defaultsAppliedAt).toBeDefined();
    });
  });

  describe('loadMobileData', () => {
    it('should load mobile data once', async () => {
      const listener = vi.fn();
      eventEmitter.on(ModeManagerEvent.MOBILE_DATA_LOADED, listener);

      await modeManager.loadMobileData();

      // Wait for microtask to complete
      await new Promise(resolve => queueMicrotask(resolve));

      expect(listener).toHaveBeenCalledTimes(1);

      // Second call should not trigger event
      await modeManager.loadMobileData();

      // Wait for microtask to complete
      await new Promise(resolve => queueMicrotask(resolve));

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('preloadMobileData', () => {
    it('should preload mobile data', async () => {
      const listener = vi.fn();
      eventEmitter.on(ModeManagerEvent.MOBILE_DATA_PRELOADED, listener);

      await modeManager.preloadMobileData();

      // Wait for microtask to complete
      await new Promise(resolve => queueMicrotask(resolve));

      expect(listener).toHaveBeenCalled();
    });
  });

  describe('isComponentVisible', () => {
    it('should return true if no visibility config', () => {
      const component = mockTemplate.components[0];
      expect(modeManager.isComponentVisible(component)).toBe(true);
    });

    it('should check desktop visibility in desktop mode', () => {
      const component = {
        ...mockTemplate.components[0],
        visibility: { desktop: false, mobile: true },
      };

      expect(modeManager.isComponentVisible(component)).toBe(false);
    });

    it('should check mobile visibility in mobile mode', async () => {
      await modeManager.switchMode(DeviceMode.MOBILE);

      const component = {
        ...mockTemplate.components[0],
        visibility: { desktop: true, mobile: false },
      };

      expect(modeManager.isComponentVisible(component)).toBe(false);
    });
  });
});
