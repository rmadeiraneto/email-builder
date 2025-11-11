/**
 * Builder Context
 *
 * Provides global state management for the email builder
 */

import {
  createContext,
  useContext,
  type ParentComponent,
  createSignal,
  createEffect,
  onCleanup,
  untrack,
} from 'solid-js';
import { createStore } from 'solid-js/store';
import {
  Builder,
  type Template,
  type BaseComponent,
  type ComponentDefinition,
  type TemplateListItem,
  type ComponentType,
  type ComponentPreset,
  getAllComponentDefinitions,
  TemplateAddComponentCommand,
  TemplateUpdateComponentCommand,
  TemplateRemoveComponentCommand,
  TemplateReorderComponentCommand,
  TemplateDuplicateComponentCommand,
  ApplyPresetCommand,
  CreatePresetCommand,
  UpdatePresetCommand,
  DeletePresetCommand,
  type EmailTestingConfig,
  type EmailTestRequest,
  createEmailTestingService,
  EmailExportService,
  TIPS_DATABASE,
  type Tip,
  type CompatibilityReport,
  // Visual feedback imports
  VisualFeedbackManager,
  createVisualFeedbackManager,
  DEFAULT_VISUAL_FEEDBACK_CONFIG,
  // Translation imports
  StaticTranslationProvider,
  enUS,
  esES,
  type TranslationManager,
} from '@email-builder/core';
import type { PropertyHoverEvent, PropertyEditEvent } from '@email-builder/ui-solid/sidebar/PropertyPanel.types';

export interface BuilderState {
  template: Template | null;
  selectedComponentId: string | null;
  draggedComponent: BaseComponent | null;
  canUndo: boolean;
  canRedo: boolean;
  isInitialized: boolean;
  emailTestingConfig: EmailTestingConfig | null;
  activeTips: Tip[];
  dismissedTips: string[];
}

export interface BuilderContextValue {
  builder: Builder;
  state: BuilderState;
  componentDefinitions: ComponentDefinition[];
  translationManager: TranslationManager | undefined;
  actions: {
    setTemplate: (template: Template | null) => void;
    selectComponent: (id: string | null) => void;
    setDraggedComponent: (component: BaseComponent | null) => void;
    addComponent: (component: BaseComponent) => Promise<void>;
    updateComponentProperty: (componentId: string, propertyPath: string, value: any) => Promise<void>;
    updateCanvasSetting: (settingPath: string, value: any) => void;
    deleteComponent: (componentId: string) => Promise<void>;
    duplicateComponent: (componentId: string) => Promise<void>;
    reorderComponent: (componentId: string, newIndex: number) => Promise<void>;
    undo: () => Promise<void>;
    redo: () => Promise<void>;
    updateUndoRedoState: () => void;
    createTemplate: (name: string, type?: 'email' | 'web') => Promise<void>;
    saveTemplate: () => Promise<void>;
    loadTemplate: (id: string) => Promise<void>;
    listTemplates: () => Promise<TemplateListItem[]>;
    deleteTemplate: (id: string) => Promise<void>;
    exportTemplate: (format: 'html' | 'json') => Promise<void>;
    checkCompatibility: () => CompatibilityReport | null;
    applyPreset: (componentId: string, presetId: string) => Promise<void>;
    createPreset: (componentId: string, name: string, description?: string) => Promise<ComponentPreset | undefined>;
    updatePreset: (componentType: ComponentType, presetId: string, updates: { name?: string; description?: string; styles?: any }) => Promise<void>;
    deletePreset: (componentType: ComponentType, presetId: string) => Promise<void>;
    duplicatePreset: (componentType: ComponentType, presetId: string, newName?: string) => Promise<ComponentPreset | undefined>;
    listPresets: (componentType?: ComponentType) => Promise<ComponentPreset[]>;
    exportPresets: () => Promise<void>;
    importPresets: (file: File) => Promise<void>;
    loadEmailTestingConfig: () => EmailTestingConfig | null;
    saveEmailTestingConfig: (config: EmailTestingConfig) => void;
    testTemplate: (testRequest: Omit<EmailTestRequest, 'htmlContent'>) => Promise<{ success: boolean; testId?: string; url?: string; error?: string }>;
    showTip: (tipId: string) => void;
    dismissTip: (tipId: string) => void;
    // Visual feedback actions
    setCanvasElement: (element: HTMLElement | null) => void;
    onPropertyHover: (event: PropertyHoverEvent) => void;
    onPropertyUnhover: (propertyPath: string) => void;
    onPropertyEditStart: (event: PropertyEditEvent) => void;
    onPropertyEditEnd: (propertyPath: string) => void;
  };
}

const BuilderContext = createContext<BuilderContextValue>();

// LocalStorage keys
const LAST_TEMPLATE_ID_KEY = 'email-builder:last-template-id';
const EMAIL_TESTING_CONFIG_KEY = 'email-builder:email-testing-config';
const DISMISSED_TIPS_KEY = 'email-builder:dismissed-tips';

export const BuilderProvider: ParentComponent = (props) => {
  // Initialize translation provider with default translations
  const translationProvider = new StaticTranslationProvider({
    'en-US': enUS,
    'es-ES': esES,
  });

  // Initialize builder instance with translation support
  const builder = new Builder({
    target: 'email',
    storage: {
      method: 'local',
    },
    callbacks: {
      onSaveTemplate: (template) => {
        // Template saved successfully
      },
      onLoadTemplate: (template) => {
        setState('template', template);
      },
      onExportTemplate: (format, content) => {
        // Template exported successfully
      },
    },
    debug: false,
    translation: {
      defaultLocale: 'en-US',
      locale: 'en-US',
      providers: [translationProvider],
      warnOnMissing: true,
      fallbackToKey: true,
    },
  });

  // Helper function to load email testing config from localStorage
  const loadEmailTestingConfigFromStorage = (): EmailTestingConfig | null => {
    try {
      const stored = localStorage.getItem(EMAIL_TESTING_CONFIG_KEY);
      if (stored) {
        return JSON.parse(stored) as EmailTestingConfig;
      }
    } catch (error) {
      console.warn('[BuilderContext] Failed to load email testing config:', error);
    }
    return null;
  };

  // Helper function to load dismissed tips from localStorage
  const loadDismissedTipsFromStorage = (): string[] => {
    try {
      const stored = localStorage.getItem(DISMISSED_TIPS_KEY);
      if (stored) {
        return JSON.parse(stored) as string[];
      }
    } catch (error) {
      console.warn('[BuilderContext] Failed to load dismissed tips:', error);
    }
    return [];
  };

  // Create reactive state
  const [state, setState] = createStore<BuilderState>({
    template: null,
    selectedComponentId: null,
    draggedComponent: null,
    canUndo: false,
    canRedo: false,
    isInitialized: false,
    emailTestingConfig: loadEmailTestingConfigFromStorage(),
    activeTips: [],
    dismissedTips: loadDismissedTipsFromStorage(),
  });

  // Visual feedback state
  const [canvasElement, setCanvasElement] = createSignal<HTMLElement | null>(null);
  const [visualFeedbackManager, setVisualFeedbackManager] = createSignal<VisualFeedbackManager | null>(null);

  // Initialize builder on mount
  createEffect(async () => {
    try {
      await builder.initialize();
      setState('isInitialized', true);

      // Try to load the last template if it exists
      const lastTemplateId = localStorage.getItem(LAST_TEMPLATE_ID_KEY);
      if (lastTemplateId) {
        try {
          const template = await builder.loadTemplate(lastTemplateId);
          setState('template', template);
          console.log('[BuilderContext] Loaded last template:', template.metadata.name);
        } catch (error) {
          console.warn('[BuilderContext] Failed to load last template:', error);
          // Clear invalid template ID
          localStorage.removeItem(LAST_TEMPLATE_ID_KEY);
        }
      }
    } catch (error) {
      console.error('[BuilderContext] Failed to initialize builder:', error);
    }
  });

  // Initialize visual feedback manager when canvas is available
  createEffect(() => {
    const canvas = canvasElement();
    // Use untrack to prevent visualFeedbackManager from being a reactive dependency
    // This prevents infinite recursion when cleanup sets it to null
    const currentManager = untrack(visualFeedbackManager);

    if (canvas && !currentManager) {
      // Initialize VisualFeedbackManager with default config
      const manager = createVisualFeedbackManager(canvas, DEFAULT_VISUAL_FEEDBACK_CONFIG);
      setVisualFeedbackManager(manager);

      console.log('[BuilderContext] VisualFeedbackManager initialized');

      // Cleanup on unmount
      onCleanup(() => {
        manager.destroy();
        setVisualFeedbackManager(null);
      });
    }
  });

  // Actions
  const actions = {
    setTemplate: (template: Template | null) => {
      setState('template', template);
    },

    selectComponent: (id: string | null) => {
      setState('selectedComponentId', id);
    },

    setDraggedComponent: (component: BaseComponent | null) => {
      setState('draggedComponent', component);
    },

    addComponent: async (component: BaseComponent) => {
      if (!state.template) {
        console.error('[BuilderContext] Cannot add component: no template loaded');
        return;
      }

      // Create and execute command
      const command = new TemplateAddComponentCommand(
        { component },
        () => state.template,
        (template) => setState('template', template)
      );

      const result = await builder.executeCommand(command);
      if (result.success) {
        actions.updateUndoRedoState();
      } else {
        console.error('[BuilderContext] Failed to add component:', result.error);
      }
    },

    updateComponentProperty: async (componentId: string, propertyPath: string, value: any) => {
      if (!state.template) {
        console.error('[BuilderContext] Cannot update component: no template loaded');
        return;
      }

      // Create and execute command
      const command = new TemplateUpdateComponentCommand(
        { componentId, propertyPath, value },
        () => state.template,
        (template) => setState('template', template)
      );

      const result = await builder.executeCommand(command);
      if (result.success) {
        actions.updateUndoRedoState();
      } else {
        console.error('[BuilderContext] Failed to update component:', result.error);
      }
    },

    updateCanvasSetting: (settingPath: string, value: any) => {
      if (!state.template) {
        console.error('[BuilderContext] Cannot update canvas setting: no template loaded');
        return;
      }

      // Create a deep copy of the template
      const updatedTemplate = JSON.parse(JSON.stringify(state.template));

      // Set nested value using dot notation
      const keys = settingPath.split('.');
      const lastKey = keys.pop()!;
      const target = keys.reduce((current, key) => {
        if (!current[key]) current[key] = {};
        return current[key];
      }, updatedTemplate as any);
      target[lastKey] = value;

      // Update the template in state
      setState('template', updatedTemplate);
    },

    deleteComponent: async (componentId: string) => {
      if (!state.template) {
        console.error('[BuilderContext] Cannot delete component: no template loaded');
        return;
      }

      // Create and execute command
      const command = new TemplateRemoveComponentCommand(
        { componentId },
        () => state.template,
        (template) => setState('template', template)
      );

      const result = await builder.executeCommand(command);
      if (result.success) {
        actions.updateUndoRedoState();

        // Clear selection if the deleted component was selected
        if (state.selectedComponentId === componentId) {
          setState('selectedComponentId', null);
        }
      } else {
        console.error('[BuilderContext] Failed to delete component:', result.error);
      }
    },

    duplicateComponent: async (componentId: string) => {
      if (!state.template) {
        console.error('[BuilderContext] Cannot duplicate component: no template loaded');
        return;
      }

      // Create and execute command
      const command = new TemplateDuplicateComponentCommand(
        { componentId },
        () => state.template,
        (template) => setState('template', template)
      );

      const result = await builder.executeCommand(command);
      if (result.success) {
        actions.updateUndoRedoState();

        // Select the newly duplicated component
        const newComponentId = command.getNewComponentId();
        if (newComponentId) {
          setState('selectedComponentId', newComponentId);
        }
      } else {
        console.error('[BuilderContext] Failed to duplicate component:', result.error);
      }
    },

    reorderComponent: async (componentId: string, newIndex: number) => {
      if (!state.template) {
        console.error('[BuilderContext] Cannot reorder component: no template loaded');
        return;
      }

      // Create and execute command
      const command = new TemplateReorderComponentCommand(
        { componentId, newIndex },
        () => state.template,
        (template) => setState('template', template)
      );

      const result = await builder.executeCommand(command);
      if (result.success) {
        actions.updateUndoRedoState();
      } else {
        console.error('[BuilderContext] Failed to reorder component:', result.error);
      }
    },

    undo: async () => {
      const success = await builder.undo();
      if (success) {
        actions.updateUndoRedoState();
      }
    },

    redo: async () => {
      const success = await builder.redo();
      if (success) {
        actions.updateUndoRedoState();
      }
    },

    updateUndoRedoState: () => {
      setState('canUndo', builder.canUndo());
      setState('canRedo', builder.canRedo());
    },

    createTemplate: async (name: string, type: 'email' | 'web' = 'email') => {
      try {
        const templateManager = builder.getTemplateManager();

        // Create template with proper settings
        const template = await templateManager.create({
          name,
          settings: {
            target: type,
            canvasDimensions: {
              width: type === 'email' ? 600 : 1200,
              maxWidth: type === 'email' ? 600 : undefined,
            },
            breakpoints: {
              mobile: 480,
              tablet: 768,
              desktop: 1024,
            },
            responsive: type === 'web',
            locale: 'en-US',
          },
        });

        setState('template', template);
        actions.updateUndoRedoState();

        // Save as last template
        localStorage.setItem(LAST_TEMPLATE_ID_KEY, template.metadata.id);
      } catch (error) {
        console.error('[BuilderContext] Failed to create template:', error);
        throw error;
      }
    },

    saveTemplate: async () => {
      try {
        if (!state.template) {
          throw new Error('No template to save');
        }
        await builder.saveTemplate(state.template);

        // Save as last template
        localStorage.setItem(LAST_TEMPLATE_ID_KEY, state.template.metadata.id);
      } catch (error) {
        console.error('[BuilderContext] Failed to save template:', error);
        throw error;
      }
    },

    loadTemplate: async (id: string) => {
      try {
        const template = await builder.loadTemplate(id);
        setState('template', template);
        actions.updateUndoRedoState();

        // Save as last template
        localStorage.setItem(LAST_TEMPLATE_ID_KEY, id);
      } catch (error) {
        console.error('[BuilderContext] Failed to load template:', error);
        throw error;
      }
    },

    listTemplates: async () => {
      try {
        const templateManager = builder.getTemplateManager();
        const templates = await templateManager.list();
        return templates;
      } catch (error) {
        console.error('[BuilderContext] Failed to list templates:', error);
        throw error;
      }
    },

    deleteTemplate: async (id: string) => {
      try {
        const templateManager = builder.getTemplateManager();
        await templateManager.delete(id);

        // If the deleted template is currently loaded, clear it
        if (state.template?.metadata?.id === id) {
          setState('template', null);
          setState('selectedComponentId', null);
        }

        // If the deleted template was the last template, clear it from localStorage
        const lastTemplateId = localStorage.getItem(LAST_TEMPLATE_ID_KEY);
        if (lastTemplateId === id) {
          localStorage.removeItem(LAST_TEMPLATE_ID_KEY);
        }
      } catch (error) {
        console.error('[BuilderContext] Failed to delete template:', error);
        throw error;
      }
    },

    exportTemplate: async (format: 'html' | 'json') => {
      try {
        if (!state.template) {
          throw new Error('No template to export');
        }
        const exporter = builder.getTemplateExporter();
        let content: string;
        let filename: string;
        let mimeType: string;

        if (format === 'html') {
          content = await exporter.toHTML(state.template);
          filename = `${state.template.name || 'template'}.html`;
          mimeType = 'text/html';
        } else {
          content = await exporter.toJSON(state.template);
          filename = `${state.template.name || 'template'}.json`;
          mimeType = 'application/json';
        }

        // Create download link
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('[BuilderContext] Failed to export template:', error);
        throw error;
      }
    },

    checkCompatibility: () => {
      try {
        return builder.checkCompatibility();
      } catch (error) {
        console.error('[BuilderContext] Failed to check compatibility:', error);
        return null;
      }
    },

    applyPreset: async (componentId: string, presetId: string) => {
      if (!state.template) {
        console.error('[BuilderContext] Cannot apply preset: no template loaded');
        return;
      }

      const component = state.template.components.find(c => c.id === componentId);
      if (!component) {
        console.error('[BuilderContext] Component not found:', componentId);
        return;
      }

      const presetManager = builder.getPresetManager();

      const command = new ApplyPresetCommand(
        { componentId, componentType: component.type, presetId },
        presetManager,
        (id) => state.template?.components.find(c => c.id === id),
        (updatedComponent) => {
          if (state.template) {
            const updatedComponents = state.template.components.map(c =>
              c.id === updatedComponent.id ? updatedComponent : c
            );
            setState('template', 'components', updatedComponents);
          }
        }
      );

      const result = await builder.executeCommand(command);
      if (result.success) {
        actions.updateUndoRedoState();
      } else {
        console.error('[BuilderContext] Failed to apply preset:', result.error);
      }
    },

    createPreset: async (componentId: string, name: string, description?: string) => {
      if (!state.template) {
        console.error('[BuilderContext] Cannot create preset: no template loaded');
        return undefined;
      }

      const component = state.template.components.find(c => c.id === componentId);
      if (!component) {
        console.error('[BuilderContext] Component not found:', componentId);
        return undefined;
      }

      const presetManager = builder.getPresetManager();

      const command = new CreatePresetCommand(
        {
          componentType: component.type,
          name,
          description,
          styles: component.styles,
          isCustom: true,
        },
        presetManager
      );

      const result = await builder.executeCommand(command);
      if (result.success) {
        actions.updateUndoRedoState();
        // Return the created preset from the command
        return (command as any).createdPreset;
      } else {
        console.error('[BuilderContext] Failed to create preset:', result.error);
        return undefined;
      }
    },

    updatePreset: async (componentType: ComponentType, presetId: string, updates: { name?: string; description?: string; styles?: any }) => {
      const presetManager = builder.getPresetManager();

      const command = new UpdatePresetCommand(
        { componentType, presetId, updates },
        presetManager
      );

      const result = await builder.executeCommand(command);
      if (result.success) {
        actions.updateUndoRedoState();
      } else {
        console.error('[BuilderContext] Failed to update preset:', result.error);
      }
    },

    deletePreset: async (componentType: ComponentType, presetId: string) => {
      const presetManager = builder.getPresetManager();

      const command = new DeletePresetCommand(
        { componentType, presetId },
        presetManager
      );

      const result = await builder.executeCommand(command);
      if (result.success) {
        actions.updateUndoRedoState();
      } else {
        console.error('[BuilderContext] Failed to delete preset:', result.error);
      }
    },

    duplicatePreset: async (componentType: ComponentType, presetId: string, newName?: string) => {
      try {
        const presetManager = builder.getPresetManager();
        const duplicated = await presetManager.duplicate(componentType, presetId, newName);
        return duplicated;
      } catch (error) {
        console.error('[BuilderContext] Failed to duplicate preset:', error);
        return undefined;
      }
    },

    listPresets: async (componentType?: ComponentType) => {
      try {
        const presetManager = builder.getPresetManager();
        const presetListItems = await presetManager.list(componentType);

        // Load full preset data for each preset
        const presets = await Promise.all(
          presetListItems.map(item =>
            presetManager.load(item.componentType, item.id)
          )
        );

        return presets;
      } catch (error) {
        console.error('[BuilderContext] Failed to list presets:', error);
        return [];
      }
    },

    exportPresets: async () => {
      try {
        const presetManager = builder.getPresetManager();

        // Get all custom presets (we only export custom presets, not defaults)
        const allPresets = await presetManager.search({ isCustom: true });

        // Group presets by component type and export all
        const exportData: Array<{
          componentType: ComponentType;
          preset: ComponentPreset;
          savedAt: number;
        }> = [];

        for (const presetItem of allPresets) {
          const preset = await presetManager.load(presetItem.componentType, presetItem.id);
          exportData.push({
            componentType: presetItem.componentType,
            preset,
            savedAt: Date.now(),
          });
        }

        // Create JSON string
        const jsonString = JSON.stringify(exportData, null, 2);

        // Create download link
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `presets-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('[BuilderContext] Failed to export presets:', error);
        throw error;
      }
    },

    importPresets: async (file: File) => {
      try {
        // Read file as text
        const text = await file.text();

        // Parse JSON
        const importData = JSON.parse(text);

        if (!Array.isArray(importData)) {
          throw new Error('Invalid preset file: expected array of presets');
        }

        const presetManager = builder.getPresetManager();

        // Import each preset
        for (const item of importData) {
          if (!item.preset || !item.componentType) {
            console.warn('[BuilderContext] Skipping invalid preset data:', item);
            continue;
          }

          // Create preset with new ID to avoid conflicts
          await presetManager.create({
            componentType: item.componentType,
            name: item.preset.name,
            description: item.preset.description,
            styles: item.preset.styles,
            isCustom: true,
          });
        }

        console.log(`[BuilderContext] Successfully imported ${importData.length} presets`);
      } catch (error) {
        console.error('[BuilderContext] Failed to import presets:', error);
        throw error;
      }
    },

    loadEmailTestingConfig: () => {
      return state.emailTestingConfig;
    },

    saveEmailTestingConfig: (config: EmailTestingConfig) => {
      try {
        localStorage.setItem(EMAIL_TESTING_CONFIG_KEY, JSON.stringify(config));
        setState('emailTestingConfig', config);
        console.log('[BuilderContext] Email testing config saved');
      } catch (error) {
        console.error('[BuilderContext] Failed to save email testing config:', error);
        throw error;
      }
    },

    testTemplate: async (testRequest: Omit<EmailTestRequest, 'htmlContent'>) => {
      try {
        // Validate template exists
        if (!state.template) {
          throw new Error('No template to test');
        }

        // Validate email testing config exists
        if (!state.emailTestingConfig) {
          throw new Error('Email testing service not configured. Please configure it in Settings.');
        }

        // Export template as HTML
        const exporter = builder.getTemplateExporter();
        const htmlContent = await exporter.toHTML(state.template);

        // Transform HTML for email compatibility
        const emailExportService = new EmailExportService({
          inlineCSS: true,
          useTableLayout: true,
          addOutlookFixes: true,
          removeIncompatibleCSS: true,
          optimizeForEmail: true,
        });

        const exportResult = emailExportService.export(htmlContent);

        // Create email testing service
        const testingService = createEmailTestingService(state.emailTestingConfig);

        // Test connection first
        const connectionResult = await testingService.testConnection();
        if (!connectionResult.success) {
          throw new Error(connectionResult.error || 'Failed to connect to email testing service');
        }

        // Submit test
        const fullTestRequest: EmailTestRequest = {
          ...testRequest,
          htmlContent: exportResult.html,
        };

        const testResult = await testingService.submitTest(fullTestRequest);

        if (testResult.success) {
          console.log('[BuilderContext] Test submitted successfully:', testResult.testId);
          return {
            success: true,
            testId: testResult.testId,
            url: testResult.url,
          };
        } else {
          throw new Error(testResult.error || 'Failed to submit test');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to test template';
        console.error('[BuilderContext] Failed to test template:', error);
        return {
          success: false,
          error: errorMessage,
        };
      }
    },

    showTip: (tipId: string) => {
      const tip = TIPS_DATABASE.find(t => t.id === tipId);
      if (tip && !state.dismissedTips.includes(tipId)) {
        // Check if tip is already active
        const isAlreadyActive = state.activeTips.some(t => t.id === tipId);
        if (!isAlreadyActive) {
          setState('activeTips', [...state.activeTips, tip]);
        }
      }
    },

    dismissTip: (tipId: string) => {
      // Remove from active tips
      setState('activeTips', state.activeTips.filter(t => t.id !== tipId));

      // Add to dismissed tips
      const newDismissedTips = [...state.dismissedTips, tipId];
      setState('dismissedTips', newDismissedTips);

      // Persist to localStorage
      try {
        localStorage.setItem(DISMISSED_TIPS_KEY, JSON.stringify(newDismissedTips));
      } catch (error) {
        console.error('[BuilderContext] Failed to save dismissed tips:', error);
      }
    },

    // Visual feedback action handlers
    setCanvasElement: (element: HTMLElement | null) => {
      setCanvasElement(element);
    },

    onPropertyHover: (event: PropertyHoverEvent) => {
      const manager = visualFeedbackManager();
      if (!manager) return;

      // PropertyHoverEvent doesn't include mapping, so we skip visual overlays
      // The manager will handle undefined mapping gracefully
      manager.handlePropertyHover({
        propertyPath: event.propertyPath,
        componentId: event.componentId,
        mapping: undefined as any, // PropertyPanel doesn't provide mapping
        mode: 'hover',
        currentValue: event.currentValue,
      });
    },

    onPropertyUnhover: (propertyPath: string) => {
      const manager = visualFeedbackManager();
      if (!manager) return;

      // Use VisualFeedbackManager's handlePropertyHover with 'off' mode
      manager.handlePropertyHover({
        propertyPath,
        componentId: undefined,
        mapping: {} as any, // Not needed for 'off' mode
        mode: 'off',
        currentValue: undefined,
      });
    },

    onPropertyEditStart: (event: PropertyEditEvent) => {
      const manager = visualFeedbackManager();
      if (!manager) return;

      // PropertyEditEvent doesn't include mapping, so we skip visual overlays
      // The manager will handle undefined mapping gracefully
      manager.handlePropertyEdit({
        propertyPath: event.propertyPath,
        componentId: event.componentId,
        oldValue: undefined, // Indicates edit is starting
        newValue: event.currentValue,
        mapping: undefined as any, // PropertyPanel doesn't provide mapping
      });
    },

    onPropertyEditEnd: (propertyPath: string) => {
      const manager = visualFeedbackManager();
      if (!manager) return;

      // Use VisualFeedbackManager's handlePropertyEdit method
      manager.handlePropertyEdit({
        propertyPath,
        componentId: undefined,
        oldValue: true, // Indicates edit is ending (non-undefined value)
        newValue: undefined,
        mapping: {} as any, // Not needed for edit end
      });
    },
  };

  const contextValue: BuilderContextValue = {
    builder,
    state,
    componentDefinitions: getAllComponentDefinitions(),
    translationManager: builder.getTranslationManager(),
    actions,
  };

  return (
    <BuilderContext.Provider value={contextValue}>
      {props.children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = (): BuilderContextValue => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
};
