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
import { Builder, type Template, type BaseComponent, type ComponentDefinition, getAllComponentDefinitions } from '@email-builder/core';

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
    addComponent: (component: BaseComponent) => void;
    updateComponentProperty: (componentId: string, propertyPath: string, value: any) => void;
    deleteComponent: (componentId: string) => void;
    undo: () => Promise<void>;
    redo: () => Promise<void>;
    updateUndoRedoState: () => void;
    createTemplate: (name: string, type?: 'email' | 'web') => Promise<void>;
    saveTemplate: () => Promise<void>;
    loadTemplate: (id: string) => Promise<void>;
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
        console.log('[Builder] Template saved:', template);
      },
      onLoadTemplate: (template) => {
        console.log('[Builder] Template loaded:', template);
        setState('template', template);
      },
      onExportTemplate: (format, content) => {
        console.log('[Builder] Template exported:', format, content);
      },
    },
    debug: true,
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
      console.log('[BuilderContext] Builder initialized');
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

    addComponent: (component: BaseComponent) => {
      if (!state.template) {
        console.error('[BuilderContext] Cannot add component: no template loaded');
        return;
      }

      // Create a new template with the added component
      const updatedTemplate = {
        ...state.template,
        components: [...state.template.components, component],
      };

      setState('template', updatedTemplate);
      console.log('[BuilderContext] Component added:', component.type);
    },

    updateComponentProperty: (componentId: string, propertyPath: string, value: any) => {
      if (!state.template) {
        console.error('[BuilderContext] Cannot update component: no template loaded');
        return;
      }

      // Helper to set nested property value
      const setNestedValue = (obj: any, path: string, value: any): void => {
        const keys = path.split('.');
        const lastKey = keys.pop()!;
        const target = keys.reduce((current, key) => {
          if (!current[key]) current[key] = {};
          return current[key];
        }, obj);
        target[lastKey] = value;
      };

      // Find the component and update it
      const updatedComponents = state.template.components.map((comp) => {
        if (comp.id === componentId) {
          const updatedComp = JSON.parse(JSON.stringify(comp)); // Deep clone
          setNestedValue(updatedComp, propertyPath, value);
          return updatedComp;
        }
        return comp;
      });

      // Update template with new components array
      const updatedTemplate = {
        ...state.template,
        components: updatedComponents,
      };

      setState('template', updatedTemplate);
      console.log('[BuilderContext] Component property updated:', componentId, propertyPath, value);
    },

    deleteComponent: (componentId: string) => {
      if (!state.template) {
        console.error('[BuilderContext] Cannot delete component: no template loaded');
        return;
      }

      // Filter out the component with matching ID
      const updatedComponents = state.template.components.filter(
        (comp) => comp.id !== componentId
      );

      // Update template with filtered components array
      const updatedTemplate = {
        ...state.template,
        components: updatedComponents,
      };

      setState('template', updatedTemplate);

      // Clear selection if the deleted component was selected
      if (state.selectedComponentId === componentId) {
        setState('selectedComponentId', null);
      }

      console.log('[BuilderContext] Component deleted:', componentId);
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
        console.log('[BuilderContext] Template created:', template);
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
        console.log('[BuilderContext] Template saved:', state.template);
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
        console.log('[BuilderContext] Template loaded:', template);
      } catch (error) {
        console.error('[BuilderContext] Failed to load template:', error);
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

        console.log('[BuilderContext] Template exported:', format, filename);
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
