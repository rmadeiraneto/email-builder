/**
 * Manages test mode state for conditional test attribute injection
 *
 * Test mode allows automated testing tools (AI agents, Playwright, etc.)
 * to identify and interact with UI elements without polluting production HTML.
 */
class TestModeManager {
  private static instance: TestModeManager;
  private _enabled: boolean = false;
  private callbacks: Array<(enabled: boolean) => void> = [];

  /**
   * Get singleton instance
   */
  static getInstance(): TestModeManager {
    if (!TestModeManager.instance) {
      TestModeManager.instance = new TestModeManager();
    }
    return TestModeManager.instance;
  }

  /**
   * Enable test mode
   * - Adds data-test-mode="true" to document root
   * - Persists preference to localStorage
   * - Notifies all listeners
   */
  enable(): void {
    this._enabled = true;

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-test-mode', 'true');
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('test-mode-enabled', 'true');
    }

    this.notifyCallbacks();
  }

  /**
   * Disable test mode
   * - Removes data-test-mode attribute
   * - Persists preference to localStorage
   * - Notifies all listeners
   */
  disable(): void {
    this._enabled = false;

    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('data-test-mode');
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('test-mode-enabled', 'false');
    }

    this.notifyCallbacks();
  }

  /**
   * Toggle test mode on/off
   */
  toggle(): void {
    if (this._enabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  /**
   * Check if test mode is currently enabled
   */
  isEnabled(): boolean {
    return this._enabled;
  }

  /**
   * Subscribe to test mode changes
   * @param callback - Function called when test mode changes
   * @returns Unsubscribe function
   */
  onChange(callback: (enabled: boolean) => void): () => void {
    this.callbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Load test mode preference from localStorage
   */
  loadPreference(): void {
    if (typeof localStorage === 'undefined') return;

    const stored = localStorage.getItem('test-mode-enabled');
    if (stored === 'true') {
      this.enable();
    }
  }

  /**
   * Initialize test mode based on environment
   * - Checks import.meta.env.MODE
   * - Checks localStorage preference
   */
  initialize(): void {
    // Auto-enable in test environment
    if (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test') {
      this.enable();
      return;
    }

    // Load saved preference
    this.loadPreference();
  }

  private notifyCallbacks(): void {
    this.callbacks.forEach(callback => callback(this._enabled));
  }
}

// Export singleton instance
export const TestMode = TestModeManager.getInstance();
