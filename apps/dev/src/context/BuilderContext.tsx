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
    undo: () => Promise<void>;
    redo: () => Promise<void>;
    updateUndoRedoState: () => void;
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
