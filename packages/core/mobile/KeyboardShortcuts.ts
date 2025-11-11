/**
 * Keyboard Shortcuts Manager for Mobile Dev Mode
 *
 * Manages keyboard shortcuts for mobile development mode features
 *
 * @module mobile
 */

import { EventEmitter } from '../services/EventEmitter';

/**
 * Keyboard shortcut event
 */
export enum KeyboardShortcutEvent {
  /**
   * Fired when any shortcut is triggered
   */
  SHORTCUT_TRIGGERED = 'keyboard-shortcuts:triggered',
}

/**
 * Shortcut action types
 */
export enum ShortcutAction {
  /**
   * Toggle device mode (desktop/mobile)
   */
  TOGGLE_MODE = 'toggle-mode',

  /**
   * Open mobile layout manager
   */
  OPEN_LAYOUT_MANAGER = 'open-layout-manager',

  /**
   * Toggle mobile defaults prompt
   */
  TOGGLE_DEFAULTS_PROMPT = 'toggle-defaults-prompt',

  /**
   * Reset all mobile overrides
   */
  RESET_MOBILE_OVERRIDES = 'reset-mobile-overrides',

  /**
   * Open diff view
   */
  OPEN_DIFF_VIEW = 'open-diff-view',

  /**
   * Undo (mode-specific)
   */
  UNDO = 'undo',

  /**
   * Redo (mode-specific)
   */
  REDO = 'redo',
}

/**
 * Keyboard shortcut definition
 */
export interface KeyboardShortcut {
  /**
   * Shortcut ID
   */
  id: string;

  /**
   * Action to trigger
   */
  action: ShortcutAction;

  /**
   * Key combination (e.g., 'Mod+D', 'Shift+M')
   * Mod = Cmd on Mac, Ctrl on Windows/Linux
   */
  keys: string;

  /**
   * Description
   */
  description: string;

  /**
   * Only active in specific modes
   */
  modes?: Array<'desktop' | 'mobile'>;

  /**
   * Enabled
   */
  enabled: boolean;
}

/**
 * Default keyboard shortcuts
 */
export const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  {
    id: 'toggle-mode',
    action: ShortcutAction.TOGGLE_MODE,
    keys: 'Mod+D',
    description: 'Toggle between Desktop and Mobile modes',
    enabled: true,
  },
  {
    id: 'open-layout-manager',
    action: ShortcutAction.OPEN_LAYOUT_MANAGER,
    keys: 'Mod+Shift+L',
    description: 'Open Mobile Layout Manager',
    modes: ['mobile'],
    enabled: true,
  },
  {
    id: 'open-diff-view',
    action: ShortcutAction.OPEN_DIFF_VIEW,
    keys: 'Mod+Shift+D',
    description: 'Open Desktop/Mobile Diff View',
    modes: ['mobile'],
    enabled: true,
  },
  {
    id: 'reset-overrides',
    action: ShortcutAction.RESET_MOBILE_OVERRIDES,
    keys: 'Mod+Shift+R',
    description: 'Reset all mobile overrides',
    modes: ['mobile'],
    enabled: true,
  },
  {
    id: 'undo',
    action: ShortcutAction.UNDO,
    keys: 'Mod+Z',
    description: 'Undo (mode-specific history)',
    enabled: true,
  },
  {
    id: 'redo',
    action: ShortcutAction.REDO,
    keys: 'Mod+Shift+Z',
    description: 'Redo (mode-specific history)',
    enabled: true,
  },
];

/**
 * Keyboard Shortcuts Manager Options
 */
export interface KeyboardShortcutsManagerOptions {
  /**
   * Event emitter instance
   */
  eventEmitter: EventEmitter;

  /**
   * Custom shortcuts (overrides defaults)
   */
  shortcuts?: KeyboardShortcut[];

  /**
   * Current mode getter
   */
  getCurrentMode: () => 'desktop' | 'mobile';
}

/**
 * Keyboard Shortcuts Manager
 *
 * Manages keyboard shortcuts for mobile dev mode
 */
export class KeyboardShortcutsManager {
  private eventEmitter: EventEmitter;
  private shortcuts: Map<string, KeyboardShortcut>;
  private getCurrentMode: () => 'desktop' | 'mobile';
  private listenerAttached = false;

  constructor(options: KeyboardShortcutsManagerOptions) {
    this.eventEmitter = options.eventEmitter;
    this.getCurrentMode = options.getCurrentMode;

    // Initialize shortcuts
    this.shortcuts = new Map();
    const initialShortcuts = options.shortcuts || DEFAULT_SHORTCUTS;
    for (const shortcut of initialShortcuts) {
      this.shortcuts.set(shortcut.id, shortcut);
    }
  }

  /**
   * Enable keyboard shortcuts
   *
   * Attaches keyboard event listener
   */
  public enable(): void {
    if (this.listenerAttached) {
      return;
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown, true);
      this.listenerAttached = true;
    }
  }

  /**
   * Disable keyboard shortcuts
   *
   * Removes keyboard event listener
   */
  public disable(): void {
    if (!this.listenerAttached) {
      return;
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown, true);
      this.listenerAttached = false;
    }
  }

  /**
   * Register a custom shortcut
   *
   * @param shortcut - Shortcut definition
   */
  public register(shortcut: KeyboardShortcut): void {
    this.shortcuts.set(shortcut.id, shortcut);
  }

  /**
   * Unregister a shortcut
   *
   * @param shortcutId - Shortcut ID
   */
  public unregister(shortcutId: string): void {
    this.shortcuts.delete(shortcutId);
  }

  /**
   * Enable a shortcut
   *
   * @param shortcutId - Shortcut ID
   */
  public enableShortcut(shortcutId: string): void {
    const shortcut = this.shortcuts.get(shortcutId);
    if (shortcut) {
      shortcut.enabled = true;
    }
  }

  /**
   * Disable a shortcut
   *
   * @param shortcutId - Shortcut ID
   */
  public disableShortcut(shortcutId: string): void {
    const shortcut = this.shortcuts.get(shortcutId);
    if (shortcut) {
      shortcut.enabled = false;
    }
  }

  /**
   * Get all shortcuts
   */
  public getShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  /**
   * Get shortcuts for current mode
   */
  public getShortcutsForCurrentMode(): KeyboardShortcut[] {
    const currentMode = this.getCurrentMode();
    return this.getShortcuts().filter(
      (s) => s.enabled && (!s.modes || s.modes.includes(currentMode))
    );
  }

  /**
   * Handle keyboard event
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    // Don't handle shortcuts in input fields
    if (this.isInputElement(event.target)) {
      return;
    }

    const currentMode = this.getCurrentMode();

    // Find matching shortcut
    for (const shortcut of this.shortcuts.values()) {
      if (!shortcut.enabled) {
        continue;
      }

      // Check if shortcut is valid for current mode
      if (shortcut.modes && !shortcut.modes.includes(currentMode)) {
        continue;
      }

      // Check if keys match
      if (this.matchesShortcut(event, shortcut.keys)) {
        event.preventDefault();
        event.stopPropagation();

        // Emit event
        this.eventEmitter.emit(KeyboardShortcutEvent.SHORTCUT_TRIGGERED, {
          shortcutId: shortcut.id,
          action: shortcut.action,
          keys: shortcut.keys,
          timestamp: Date.now(),
        });

        break;
      }
    }
  };

  /**
   * Check if event matches shortcut keys
   */
  private matchesShortcut(event: KeyboardEvent, keys: string): boolean {
    const parts = keys.split('+').map((k) => k.trim());
    const key = parts[parts.length - 1]?.toLowerCase() ?? '';

    // Check modifiers
    const needsMod = parts.includes('Mod');
    const needsShift = parts.includes('Shift');
    const needsAlt = parts.includes('Alt');
    const needsCtrl = parts.includes('Ctrl');

    const modKey = needsMod
      ? this.isMac()
        ? event.metaKey
        : event.ctrlKey
      : true;

    const shiftKey = needsShift ? event.shiftKey : !event.shiftKey;
    const altKey = needsAlt ? event.altKey : !event.altKey;
    const ctrlKey = needsCtrl ? event.ctrlKey : !event.ctrlKey;

    // Check main key
    const eventKey = event.key.toLowerCase();
    const keyMatch = eventKey === key || event.code.toLowerCase() === `key${key}`;

    return modKey && shiftKey && altKey && ctrlKey && keyMatch;
  }

  /**
   * Check if target is an input element
   */
  private isInputElement(target: EventTarget | null): boolean {
    if (!target) {
      return false;
    }

    const element = target as HTMLElement;
    const tagName = element.tagName.toLowerCase();

    return (
      tagName === 'input' ||
      tagName === 'textarea' ||
      tagName === 'select' ||
      element.isContentEditable
    );
  }

  /**
   * Check if running on Mac
   */
  private isMac(): boolean {
    if (typeof navigator === 'undefined') {
      return false;
    }
    return navigator.platform.includes('Mac');
  }

  /**
   * Dispose and cleanup
   */
  public dispose(): void {
    this.disable();
    this.shortcuts.clear();
  }
}
