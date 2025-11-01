/**
 * Template Builder Page
 *
 * Main page for the email/template builder application
 */

import { type Component, Show, createSignal, createMemo, onMount, onCleanup } from 'solid-js';
import { BuilderProvider, useBuilder } from '../context/BuilderContext';
import { TemplateCanvas } from '@email-builder/ui-solid/canvas';
import { ComponentPalette, PropertyPanel } from '@email-builder/ui-solid/sidebar';
import { TemplateToolbar } from '@email-builder/ui-solid/toolbar';
import { NewTemplateModal } from '../components/modals/NewTemplateModal';
import type { ComponentDefinition } from '@email-builder/core';
import styles from './Builder.module.scss';

const BuilderContent: Component = () => {
  const { state, actions, componentDefinitions } = useBuilder();
  const [isNewTemplateModalOpen, setIsNewTemplateModalOpen] = createSignal(false);

  // Get the selected component from the template
  const selectedComponent = createMemo(() => {
    if (!state.template || !state.selectedComponentId) return null;
    return state.template.components.find(c => c.id === state.selectedComponentId) || null;
  });

  const handleComponentSelect = (id: string | null) => {
    actions.selectComponent(id);
  };

  const handlePropertyChange = (componentId: string, propertyPath: string, value: any) => {
    actions.updateComponentProperty(componentId, propertyPath, value);
  };

  const handleDelete = (componentId: string) => {
    actions.deleteComponent(componentId);
  };

  // Keyboard shortcut handler
  const handleKeyDown = (event: KeyboardEvent) => {
    // Delete or Backspace key - delete selected component
    if ((event.key === 'Delete' || event.key === 'Backspace') && state.selectedComponentId) {
      // Don't delete if user is typing in an input field
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      event.preventDefault();
      handleDelete(state.selectedComponentId);
    }
  };

  // Set up keyboard event listener
  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  onCleanup(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });

  const handleComponentDragStart = (definition: ComponentDefinition, event: DragEvent) => {
    console.log('[Builder] Component drag started:', definition.type);
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();

    try {
      // Extract component data from drag event
      const data = event.dataTransfer?.getData('application/json');
      if (!data) {
        console.error('[Builder] No drag data found');
        return;
      }

      const { type } = JSON.parse(data);
      console.log('[Builder] Component dropped:', type);

      // Find the component definition
      const definition = componentDefinitions.find(def => def.type === type);
      if (!definition) {
        console.error('[Builder] Component definition not found for type:', type);
        return;
      }

      // Create a new component instance using the definition's create method
      const newComponent = definition.create();
      console.log('[Builder] Created component:', newComponent);

      // Add the component to the template
      actions.addComponent(newComponent);

      // Select the newly added component
      actions.selectComponent(newComponent.id);
    } catch (error) {
      console.error('[Builder] Failed to handle drop:', error);
    }
  };

  // Toolbar handlers
  const handleNewTemplate = () => {
    setIsNewTemplateModalOpen(true);
  };

  const handleCreateTemplate = async (name: string, type: 'email' | 'web') => {
    try {
      await actions.createTemplate(name, type);
      console.log('[Builder] Template created successfully');
    } catch (error) {
      console.error('[Builder] Failed to create template:', error);
      alert('Failed to create template. Please try again.');
    }
  };

  const handleSaveTemplate = async () => {
    try {
      await actions.saveTemplate();
      alert('Template saved successfully!');
    } catch (error) {
      console.error('[Builder] Failed to save template:', error);
      alert('Failed to save template. Please try again.');
    }
  };

  const handleLoadTemplate = () => {
    // TODO: Show template picker modal
    alert('Load template functionality coming soon!');
  };

  const handleExport = async () => {
    try {
      await actions.exportTemplate('html');
      console.log('[Builder] Template exported successfully');
    } catch (error) {
      console.error('[Builder] Failed to export template:', error);
      alert('Failed to export template. Please try again.');
    }
  };

  return (
    <>
      <div class={styles.builder}>
        <header class={styles.header}>
          <h1>Email Builder</h1>
          <Show when={state.isInitialized} fallback={<span>Initializing...</span>}>
            <TemplateToolbar
              hasTemplate={state.template !== null}
              canUndo={state.canUndo}
              canRedo={state.canRedo}
              templateName={state.template?.name}
              onNewTemplate={handleNewTemplate}
              onSaveTemplate={handleSaveTemplate}
              onLoadTemplate={handleLoadTemplate}
              onUndo={actions.undo}
              onRedo={actions.redo}
              onExport={handleExport}
            />
          </Show>
        </header>

        <div class={styles.container}>
          <aside class={styles.leftSidebar}>
            <h2>Components</h2>
            <ComponentPalette
              components={componentDefinitions}
              onComponentDragStart={handleComponentDragStart}
            />
          </aside>

          <main class={styles.canvas}>
            <Show when={state.isInitialized} fallback={<p>Loading builder...</p>}>
              <TemplateCanvas
                template={state.template}
                selectedComponentId={state.selectedComponentId}
                onComponentSelect={handleComponentSelect}
                onDrop={handleDrop}
              />
            </Show>
          </main>

          <aside class={styles.rightSidebar}>
            <PropertyPanel
              selectedComponent={selectedComponent()}
              onPropertyChange={handlePropertyChange}
              onDelete={handleDelete}
            />
          </aside>
        </div>
      </div>

      <NewTemplateModal
        isOpen={isNewTemplateModalOpen()}
        onClose={() => setIsNewTemplateModalOpen(false)}
        onCreateTemplate={handleCreateTemplate}
      />
    </>
  );
};

const Builder: Component = () => {
  return (
    <BuilderProvider>
      <BuilderContent />
    </BuilderProvider>
  );
};

export default Builder;
