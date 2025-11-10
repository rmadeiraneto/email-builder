/**
 * Example React Integration for Mobile Development Mode
 *
 * This example shows how to integrate Mobile Dev Mode services
 * into a React application.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { EventEmitter } from '../../services/EventEmitter';
import { CommandManager } from '../../commands/CommandManager';
import {
  ModeManager,
  PropertyOverrideManager,
  MobileLayoutManager,
  ModeSwitcher,
  KeyboardShortcutsManager,
  ValidationService,
  MobileDefaultsApplicator,
  MobileExportService,
  PerformanceOptimizer,
  DeviceMode,
  DEFAULT_MOBILE_DEV_MODE_CONFIG,
  ModeManagerEvent,
  ModeSwitcherEvent,
  ValidationEvent,
} from '../index';
import type { Template, MobileDevModeConfig } from '../../types';

// ============================================================================
// Context Setup
// ============================================================================

interface MobileDevModeContextValue {
  // Services
  modeManager: ModeManager;
  overrideManager: PropertyOverrideManager;
  layoutManager: MobileLayoutManager;
  modeSwitcher: ModeSwitcher;
  validationService: ValidationService;
  defaultsApplicator: MobileDefaultsApplicator;
  exportService: MobileExportService;
  optimizer: PerformanceOptimizer;

  // State
  currentMode: DeviceMode;
  isSwitching: boolean;
  validationResult: any;

  // Actions
  switchMode: (mode: DeviceMode) => Promise<void>;
  toggleMode: () => Promise<void>;
  setPropertyOverride: (componentId: string, property: string, value: any) => void;
  clearPropertyOverride: (componentId: string, property: string) => void;
  reorderComponents: (newOrder: string[]) => void;
  toggleComponentVisibility: (componentId: string) => void;
  validate: () => void;
  exportTemplate: () => any;
}

const MobileDevModeContext = createContext<MobileDevModeContextValue | null>(null);

// ============================================================================
// Provider Component
// ============================================================================

interface MobileDevModeProviderProps {
  template: Template;
  config?: Partial<MobileDevModeConfig>;
  children: React.ReactNode;
}

export const MobileDevModeProvider: React.FC<MobileDevModeProviderProps> = ({
  template,
  config: userConfig,
  children,
}) => {
  const [currentMode, setCurrentMode] = useState<DeviceMode>(DeviceMode.DESKTOP);
  const [isSwitching, setIsSwitching] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  // Initialize services (only once)
  const [services] = useState(() => {
    const eventEmitter = new EventEmitter();
    const config = { ...DEFAULT_MOBILE_DEV_MODE_CONFIG, ...userConfig };

    const desktopCommandManager = new CommandManager(eventEmitter);
    const mobileCommandManager = new CommandManager(eventEmitter);

    const modeManager = new ModeManager({
      eventEmitter,
      config,
      desktopCommandManager,
      mobileCommandManager,
    });
    modeManager.setTemplate(template);

    const overrideManager = new PropertyOverrideManager({
      eventEmitter,
      config,
      template,
    });

    const layoutManager = new MobileLayoutManager({
      eventEmitter,
      template,
    });

    const modeSwitcher = new ModeSwitcher({
      eventEmitter,
      modeManager,
      config,
    });

    const shortcutsManager = new KeyboardShortcutsManager({
      eventEmitter,
      getCurrentMode: () => modeManager.getCurrentMode(),
    });

    const validationService = new ValidationService({
      eventEmitter,
      modeManager,
      config,
    });

    const defaultsApplicator = new MobileDefaultsApplicator({
      eventEmitter,
      overrideManager,
      modeManager,
      config,
      template,
    });

    const exportService = new MobileExportService({
      modeManager,
      layoutManager,
      config,
    });

    const optimizer = new PerformanceOptimizer({ config });

    // Enable keyboard shortcuts
    shortcutsManager.enable();

    return {
      eventEmitter,
      modeManager,
      overrideManager,
      layoutManager,
      modeSwitcher,
      shortcutsManager,
      validationService,
      defaultsApplicator,
      exportService,
      optimizer,
    };
  });

  // Set up event listeners
  useEffect(() => {
    const { eventEmitter, modeSwitcher } = services;

    // Mode switch events
    const unsubStart = eventEmitter.on(ModeSwitcherEvent.ANIMATION_START, () => {
      setIsSwitching(true);
    });

    const unsubComplete = eventEmitter.on(ModeManagerEvent.MODE_SWITCH_COMPLETE, (event: any) => {
      setCurrentMode(event.toMode);
      setIsSwitching(false);
    });

    // Validation events
    const unsubValidation = eventEmitter.on(ValidationEvent.VALIDATION_COMPLETE, (event: any) => {
      setValidationResult(event.result);
    });

    // Listen for keyboard shortcuts
    const unsubShortcut = eventEmitter.on('keyboard-shortcuts:triggered', async (event: any) => {
      switch (event.action) {
        case 'toggle-mode':
          await modeSwitcher.toggle();
          break;
        case 'undo':
          await services.modeManager.undo();
          break;
        case 'redo':
          await services.modeManager.redo();
          break;
      }
    });

    return () => {
      unsubStart.unsubscribe();
      unsubComplete.unsubscribe();
      unsubValidation.unsubscribe();
      unsubShortcut.unsubscribe();
    };
  }, [services]);

  // Actions
  const switchMode = useCallback(async (mode: DeviceMode) => {
    await services.modeSwitcher.switchToMode(mode);
  }, [services]);

  const toggleMode = useCallback(async () => {
    await services.modeSwitcher.toggle();
  }, [services]);

  const setPropertyOverride = useCallback((componentId: string, property: string, value: any) => {
    // Debounce property updates
    const debouncedSet = services.optimizer.debounce((id: string, prop: string, val: any) => {
      services.overrideManager.setOverride(id, prop, val);
    });

    debouncedSet(componentId, property, value);
  }, [services]);

  const clearPropertyOverride = useCallback((componentId: string, property: string) => {
    services.overrideManager.clearOverride(componentId, property);
  }, [services]);

  const reorderComponents = useCallback((newOrder: string[]) => {
    services.layoutManager.reorderComponents(newOrder);
  }, [services]);

  const toggleComponentVisibility = useCallback((componentId: string) => {
    services.layoutManager.toggleComponentVisibility(componentId);
  }, [services]);

  const validate = useCallback(() => {
    services.validationService.validate(template);
  }, [services, template]);

  const exportTemplate = useCallback(() => {
    return services.exportService.exportTemplate(template);
  }, [services, template]);

  const value: MobileDevModeContextValue = {
    // Services
    modeManager: services.modeManager,
    overrideManager: services.overrideManager,
    layoutManager: services.layoutManager,
    modeSwitcher: services.modeSwitcher,
    validationService: services.validationService,
    defaultsApplicator: services.defaultsApplicator,
    exportService: services.exportService,
    optimizer: services.optimizer,

    // State
    currentMode,
    isSwitching,
    validationResult,

    // Actions
    switchMode,
    toggleMode,
    setPropertyOverride,
    clearPropertyOverride,
    reorderComponents,
    toggleComponentVisibility,
    validate,
    exportTemplate,
  };

  return (
    <MobileDevModeContext.Provider value={value}>
      {children}
    </MobileDevModeContext.Provider>
  );
};

// ============================================================================
// Custom Hook
// ============================================================================

export function useMobileDevMode() {
  const context = useContext(MobileDevModeContext);

  if (!context) {
    throw new Error('useMobileDevMode must be used within MobileDevModeProvider');
  }

  return context;
}

// ============================================================================
// Example Components
// ============================================================================

/**
 * Mode Switcher Button Component
 */
export const ModeSwitcherButton: React.FC = () => {
  const { currentMode, isSwitching, toggleMode } = useMobileDevMode();

  return (
    <button
      onClick={toggleMode}
      disabled={isSwitching}
      className="mode-switcher-button"
    >
      {isSwitching ? (
        <span>Switching...</span>
      ) : (
        <>
          <span className={currentMode === DeviceMode.DESKTOP ? 'active' : ''}>
            Desktop
          </span>
          <span className={currentMode === DeviceMode.MOBILE ? 'active' : ''}>
            Mobile
          </span>
        </>
      )}
    </button>
  );
};

/**
 * Property Override Control Component
 */
interface PropertyOverrideControlProps {
  componentId: string;
  property: string;
  label: string;
  currentValue: any;
}

export const PropertyOverrideControl: React.FC<PropertyOverrideControlProps> = ({
  componentId,
  property,
  label,
  currentValue,
}) => {
  const { currentMode, modeManager, setPropertyOverride, clearPropertyOverride } = useMobileDevMode();
  const [value, setValue] = useState(currentValue);

  const component = modeManager.getCurrentMode(); // Would get actual component
  const inheritanceInfo = modeManager.getPropertyInheritanceInfo(
    {} as any, // Would pass actual component
    property
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setPropertyOverride(componentId, property, newValue);
  };

  const handleReset = () => {
    clearPropertyOverride(componentId, property);
    setValue(inheritanceInfo.desktopValue);
  };

  return (
    <div className="property-control">
      <label>
        {label}
        {currentMode === DeviceMode.MOBILE && inheritanceInfo.isOverridden && (
          <span className="override-badge" title="Overridden for mobile">
            M
          </span>
        )}
      </label>

      <div className="control-group">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          disabled={!inheritanceInfo.canOverride}
        />

        {currentMode === DeviceMode.MOBILE && inheritanceInfo.isOverridden && (
          <button onClick={handleReset} className="reset-button" title="Reset to desktop">
            Reset
          </button>
        )}
      </div>

      {!inheritanceInfo.canOverride && (
        <span className="help-text">{inheritanceInfo.cannotOverrideReason}</span>
      )}
    </div>
  );
};

/**
 * Validation Panel Component
 */
export const ValidationPanel: React.FC = () => {
  const { validationResult, validate } = useMobileDevMode();

  useEffect(() => {
    validate();
  }, [validate]);

  if (!validationResult) {
    return <div>Loading validation...</div>;
  }

  return (
    <div className="validation-panel">
      <h3>Validation Results</h3>

      <div className="validation-summary">
        <span className={validationResult.isValid ? 'valid' : 'invalid'}>
          {validationResult.isValid ? '✓ Valid' : '✗ Issues Found'}
        </span>
        <span>{validationResult.totalIssues} total issues</span>
      </div>

      {validationResult.issuesBySeverity.critical.length > 0 && (
        <div className="issues-section critical">
          <h4>Critical Issues ({validationResult.issuesBySeverity.critical.length})</h4>
          {validationResult.issuesBySeverity.critical.map((issue: any, i: number) => (
            <div key={i} className="issue-item">
              <strong>{issue.message}</strong>
              {issue.suggestion && <p>{issue.suggestion}</p>}
            </div>
          ))}
        </div>
      )}

      {validationResult.issuesBySeverity.warning.length > 0 && (
        <div className="issues-section warning">
          <h4>Warnings ({validationResult.issuesBySeverity.warning.length})</h4>
          {validationResult.issuesBySeverity.warning.map((issue: any, i: number) => (
            <div key={i} className="issue-item">
              <strong>{issue.message}</strong>
              {issue.suggestion && <p>{issue.suggestion}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Mobile Defaults Prompt Component
 */
export const MobileDefaultsPrompt: React.FC = () => {
  const { defaultsApplicator } = useMobileDevMode();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const { eventEmitter } = (defaultsApplicator as any);

    const unsub = eventEmitter.on('mobile:first-entry', () => {
      if (defaultsApplicator.shouldPrompt()) {
        setShow(true);
      }
    });

    return () => unsub.unsubscribe();
  }, [defaultsApplicator]);

  const handleApply = async () => {
    await defaultsApplicator.applyDefaults();
    setShow(false);
  };

  const handleDecline = () => {
    defaultsApplicator.declineDefaults();
    setShow(false);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="defaults-prompt">
      <h3>Apply Mobile-Optimized Defaults?</h3>
      <p>
        We can automatically optimize your template for mobile devices by:
      </p>
      <ul>
        <li>Reducing padding and margins by 50%</li>
        <li>Slightly reducing font sizes</li>
        <li>Making buttons full-width</li>
        <li>Ensuring touch targets are at least 44px</li>
      </ul>
      <p>You can customize these changes afterwards.</p>
      <div className="button-group">
        <button onClick={handleApply} className="primary">
          Apply Defaults
        </button>
        <button onClick={handleDecline} className="secondary">
          Skip
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// Usage Example
// ============================================================================

/*
import { MobileDevModeProvider, useMobileDevMode, ModeSwitcherButton } from './react-integration';

function App() {
  const [template, setTemplate] = useState(initialTemplate);

  return (
    <MobileDevModeProvider template={template}>
      <div className="email-builder">
        <header>
          <ModeSwitcherButton />
        </header>

        <main>
          <Canvas />
          <PropertyPanel />
        </main>

        <MobileDefaultsPrompt />
        <ValidationPanel />
      </div>
    </MobileDevModeProvider>
  );
}

function PropertyPanel() {
  const { currentMode } = useMobileDevMode();

  return (
    <div className="property-panel">
      <h2>Properties</h2>
      <p>Current mode: {currentMode}</p>

      <PropertyOverrideControl
        componentId="button-1"
        property="styles.padding"
        label="Padding"
        currentValue="32px"
      />
    </div>
  );
}
*/
