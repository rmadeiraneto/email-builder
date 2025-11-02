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
  getAllComponentDefinitions,
  TemplateAddComponentCommand,
  TemplateUpdateComponentCommand,
  TemplateRemoveComponentCommand,
  TemplateReorderComponentCommand,
  TemplateDuplicateComponentCommand,
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
  };
}

const BuilderContext = createContext<BuilderContextValue>();

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
        const templateManager = builder.getTemplateManager();
        await templateManager.saveTemplate(state.template);
      } catch (error) {
        console.error('[BuilderContext] Failed to save template:', error);
        throw error;
      }
    },

    loadTemplate: async (id: string) => {
      try {
        const templateManager = builder.getTemplateManager();
        const template = await templateManager.loadTemplate(id);
        setState('template', template);
        actions.updateUndoRedoState();
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
        await templateManager.deleteTemplate(id);

        // If the deleted template is currently loaded, clear it
        if (state.template?.metadata?.id === id) {
          setState('template', null);
          setState('selectedComponentId', null);
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
