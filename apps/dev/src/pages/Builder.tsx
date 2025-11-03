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
import { TemplatePickerModal } from '../components/modals/TemplatePickerModal';
import { PreviewModal } from '../components/modals/PreviewModal';
import type { ComponentDefinition } from '@email-builder/core';
import styles from './Builder.module.scss';

const BuilderContent: Component = () => {
  const { state, actions, componentDefinitions } = useBuilder();
  const [isNewTemplateModalOpen, setIsNewTemplateModalOpen] = createSignal(false);
  const [isTemplatePickerModalOpen, setIsTemplatePickerModalOpen] = createSignal(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = createSignal(false);

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

  const handleCanvasSettingChange = (path: string, value: any) => {
    actions.updateCanvasSetting(path, value);
  };

  const handleGeneralStyleChange = (path: string, value: any) => {
    actions.updateCanvasSetting(path, value);
  };

  // Keyboard shortcut handler
  const handleKeyDown = (event: KeyboardEvent) => {
    // Don't handle keyboard shortcuts if user is typing in an input field
    const target = event.target as HTMLElement;
    const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

    // Undo: Ctrl+Z or Cmd+Z
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey && !isInputField) {
      event.preventDefault();
      actions.undo();
      return;
    }

    // Redo: Ctrl+Y or Cmd+Y or Ctrl+Shift+Z or Cmd+Shift+Z
    if (
      ((event.ctrlKey || event.metaKey) && event.key === 'y') ||
      ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z')
    ) {
      if (!isInputField) {
        event.preventDefault();
        actions.redo();
      }
      return;
    }

    // Duplicate: Ctrl+D or Cmd+D
    if ((event.ctrlKey || event.metaKey) && event.key === 'd' && state.selectedComponentId) {
      if (!isInputField) {
        event.preventDefault();
        actions.duplicateComponent(state.selectedComponentId);
      }
      return;
    }

    // Delete or Backspace key - delete selected component
    if ((event.key === 'Delete' || event.key === 'Backspace') && state.selectedComponentId) {
      if (isInputField) {
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
    // Component drag started
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

      // Find the component definition
      const definition = componentDefinitions.find(def => def.type === type);
      if (!definition) {
        console.error('[Builder] Component definition not found for type:', type);
        return;
      }

      // Create a new component instance using the definition's create method
      const newComponent = definition.create();

      // Add the component to the template
      actions.addComponent(newComponent);

      // Select the newly added component
      actions.selectComponent(newComponent.id);
    } catch (error) {
      console.error('[Builder] Failed to handle drop:', error);
    }
  };

  const handleComponentReorder = (componentId: string, newIndex: number) => {
    actions.reorderComponent(componentId, newIndex);
  };

  // Toolbar handlers
  const handleNewTemplate = () => {
    setIsNewTemplateModalOpen(true);
  };

  const handleCreateTemplate = async (name: string, type: 'email' | 'web') => {
    try {
      await actions.createTemplate(name, type);
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
    setIsTemplatePickerModalOpen(true);
  };

  const handleTemplateLoad = async (id: string) => {
    try {
      await actions.loadTemplate(id);
    } catch (error) {
      console.error('[Builder] Failed to load template:', error);
      alert('Failed to load template. Please try again.');
    }
  };

  const handleTemplateDelete = async (id: string) => {
    try {
      await actions.deleteTemplate(id);
    } catch (error) {
      console.error('[Builder] Failed to delete template:', error);
      alert('Failed to delete template. Please try again.');
    }
  };

  const handleListTemplates = async () => {
    return await actions.listTemplates();
  };

  const handleExport = async () => {
    try {
      await actions.exportTemplate('html');
    } catch (error) {
      console.error('[Builder] Failed to export template:', error);
      alert('Failed to export template. Please try again.');
    }
  };

  const handlePreview = () => {
    setIsPreviewModalOpen(true);
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
              onPreview={handlePreview}
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
                onComponentReorder={handleComponentReorder}
              />
            </Show>
          </main>

          <aside class={styles.rightSidebar}>
            <PropertyPanel
              selectedComponent={selectedComponent()}
              template={state.template}
              onPropertyChange={handlePropertyChange}
              onGeneralStyleChange={handleGeneralStyleChange}
              onDelete={handleDelete}
              presetActions={{
                applyPreset: actions.applyPreset,
                createPreset: actions.createPreset,
                updatePreset: actions.updatePreset,
                deletePreset: actions.deletePreset,
                duplicatePreset: actions.duplicatePreset,
                listPresets: actions.listPresets,
                exportPresets: actions.exportPresets,
                importPresets: actions.importPresets,
              }}
            />
          </aside>
        </div>
      </div>

      <NewTemplateModal
        isOpen={isNewTemplateModalOpen()}
        onClose={() => setIsNewTemplateModalOpen(false)}
        onCreateTemplate={handleCreateTemplate}
      />

      <TemplatePickerModal
        isOpen={isTemplatePickerModalOpen()}
        onClose={() => setIsTemplatePickerModalOpen(false)}
        onLoadTemplate={handleTemplateLoad}
        onDeleteTemplate={handleTemplateDelete}
        onListTemplates={handleListTemplates}
      />

      <PreviewModal
        isOpen={isPreviewModalOpen()}
        template={state.template}
        onClose={() => setIsPreviewModalOpen(false)}
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
