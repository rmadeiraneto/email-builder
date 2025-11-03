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
} from '@email-builder/core';

export interface BuilderState {
  template: Template | null;
  selectedComponentId: string | null;
  draggedComponent: BaseComponent | null;
  canUndo: boolean;
  canRedo: boolean;
  isInitialized: boolean;
}

export interface BuilderContextValue {
  builder: Builder;
  state: BuilderState;
  componentDefinitions: ComponentDefinition[];
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
    applyPreset: (componentId: string, presetId: string) => Promise<void>;
    createPreset: (componentId: string, name: string, description?: string) => Promise<ComponentPreset | undefined>;
    updatePreset: (componentType: ComponentType, presetId: string, updates: { name?: string; description?: string; styles?: any }) => Promise<void>;
    deletePreset: (componentType: ComponentType, presetId: string) => Promise<void>;
    duplicatePreset: (componentType: ComponentType, presetId: string, newName?: string) => Promise<ComponentPreset | undefined>;
    listPresets: (componentType?: ComponentType) => Promise<ComponentPreset[]>;
    exportPresets: () => Promise<void>;
    importPresets: (file: File) => Promise<void>;
  };
}

const BuilderContext = createContext<BuilderContextValue>();

// LocalStorage key for last loaded template
const LAST_TEMPLATE_ID_KEY = 'email-builder:last-template-id';

export const BuilderProvider: ParentComponent = (props) => {
  // Initialize builder instance
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
  });

  // Create reactive state
  const [state, setState] = createStore<BuilderState>({
    template: null,
    selectedComponentId: null,
    draggedComponent: null,
    canUndo: false,
    canRedo: false,
    isInitialized: false,
  });

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
  };

  const contextValue: BuilderContextValue = {
    builder,
    state,
    componentDefinitions: getAllComponentDefinitions(),
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
