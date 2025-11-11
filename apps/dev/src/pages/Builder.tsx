/**
 * Template Builder Page
 *
 * Main page for the email/template builder application
 */

import { type Component, Show, For, createSignal, createMemo, onMount, onCleanup, batch } from 'solid-js';
import { BuilderProvider, useBuilder } from '../context/BuilderContext';
import { TranslationProvider } from '@email-builder/ui-solid/i18n';
import { TemplateCanvas } from '@email-builder/ui-solid/canvas';
import { ComponentPalette, PropertyPanel } from '@email-builder/ui-solid/sidebar';
import { TemplateToolbar } from '@email-builder/ui-solid/toolbar';
import { TipBanner } from '@email-builder/ui-solid/tips';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { NewTemplateModal } from '../components/modals/NewTemplateModal';
import { TemplatePickerModal } from '../components/modals/TemplatePickerModal';
import { PreviewModal } from '../components/modals/PreviewModal';
import { EmailTestingSettingsModal } from '../components/modals/EmailTestingSettingsModal';
import { TestConfigModal } from '../components/modals/TestConfigModal';
import { CompatibilityReportModal } from '../components/modals/CompatibilityReportModal';
import { AccessibilityAnnouncer } from '@email-builder/ui-solid/visual-feedback';
import type { ComponentDefinition, EmailTestingConfig, EmailTestRequest, CompatibilityReport } from '@email-builder/core';
import styles from './Builder.module.scss';

const BuilderContent: Component = () => {
  const { state, actions, componentDefinitions, translationManager } = useBuilder();
  const [isNewTemplateModalOpen, setIsNewTemplateModalOpen] = createSignal(false);
  const [isTemplatePickerModalOpen, setIsTemplatePickerModalOpen] = createSignal(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = createSignal(false);
  const [isEmailTestingSettingsModalOpen, setIsEmailTestingSettingsModalOpen] = createSignal(false);
  const [isTestConfigModalOpen, setIsTestConfigModalOpen] = createSignal(false);
  const [isCompatibilityReportModalOpen, setIsCompatibilityReportModalOpen] = createSignal(false);
  const [compatibilityReport, setCompatibilityReport] = createSignal<CompatibilityReport | null>(null);
  const [pendingAction, setPendingAction] = createSignal<'export' | 'test' | null>(null);

  // Accessibility: track current property being edited
  const [currentEditingProperty, setCurrentEditingProperty] = createSignal<string | undefined>(undefined);
  const [currentEditingValue, setCurrentEditingValue] = createSignal<any>(undefined);
  const [isEditingProperty, setIsEditingProperty] = createSignal(false);

  // Handle canvas element ref for visual feedback
  const handleCanvasRef = (element: HTMLElement | null) => {
    actions.setCanvasElement(element);
  };

  // Wrap visual feedback handlers to update accessibility state
  // Use batch to group state updates and prevent multiple re-renders
  const handlePropertyEditStartWithA11y = (event: any) => {
    batch(() => {
      setCurrentEditingProperty(event.propertyPath);
      setCurrentEditingValue(event.currentValue);
      setIsEditingProperty(true);
    });
    actions.onPropertyEditStart(event);
  };

  const handlePropertyEditEndWithA11y = (propertyPath: string) => {
    batch(() => {
      setIsEditingProperty(false);
      setCurrentEditingProperty(undefined);
      setCurrentEditingValue(undefined);
    });
    actions.onPropertyEditEnd(propertyPath);
  };

  // Get the selected component from the template
  const selectedComponent = createMemo(() => {
    if (!state.template || !state.selectedComponentId) return null;
    return state.template.components.find(c => c.id === state.selectedComponentId) || null;
  });

  // Memoize visual feedback handlers to prevent unnecessary re-renders
  const visualFeedbackHandlers = createMemo(() => ({
    onPropertyHover: actions.onPropertyHover,
    onPropertyUnhover: actions.onPropertyUnhover,
    onPropertyEditStart: handlePropertyEditStartWithA11y,
    onPropertyEditEnd: handlePropertyEditEndWithA11y,
  }));

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
      // Check compatibility first
      const report = actions.checkCompatibility();
      if (report && report.issues.length > 0) {
        setCompatibilityReport(report);
        setPendingAction('export');
        setIsCompatibilityReportModalOpen(true);
        return;
      }

      // No issues, proceed with export
      await actions.exportTemplate('html');
    } catch (error) {
      console.error('[Builder] Failed to export template:', error);
      alert('Failed to export template. Please try again.');
    }
  };

  const handlePreview = () => {
    setIsPreviewModalOpen(true);
  };

  const handleEmailTestingSettings = () => {
    setIsEmailTestingSettingsModalOpen(true);
  };

  const handleSaveEmailTestingConfig = (config: EmailTestingConfig) => {
    actions.saveEmailTestingConfig(config);
    setIsEmailTestingSettingsModalOpen(false);
    alert('Email testing configuration saved successfully!');
  };

  const handleTestEmailClients = () => {
    // Check if email testing is configured
    const config = actions.loadEmailTestingConfig();
    if (!config) {
      alert('Please configure email testing service first. Click the Settings button.');
      setIsEmailTestingSettingsModalOpen(true);
      return;
    }

    // Check compatibility first
    const report = actions.checkCompatibility();
    if (report && report.issues.length > 0) {
      setCompatibilityReport(report);
      setPendingAction('test');
      setIsCompatibilityReportModalOpen(true);
      return;
    }

    // No issues, proceed with test
    setIsTestConfigModalOpen(true);
  };

  const handleSubmitTest = async (testRequest: Omit<EmailTestRequest, 'htmlContent'>) => {
    const result = await actions.testTemplate(testRequest);

    if (result.success) {
      setIsTestConfigModalOpen(false);
      if (result.url) {
        const openInNewTab = confirm(
          `Test submitted successfully!\n\nTest ID: ${result.testId}\n\nWould you like to view the results in a new tab?`
        );
        if (openInNewTab && result.url) {
          window.open(result.url, '_blank');
        }
      } else {
        alert(`Test submitted successfully!\n\nTest ID: ${result.testId}\n\nCheck your testing service dashboard for results.`);
      }
    } else {
      throw new Error(result.error || 'Failed to submit test');
    }
  };

  const handleCheckCompatibility = () => {
    const report = actions.checkCompatibility();
    if (report) {
      setCompatibilityReport(report);
      setPendingAction(null);
      setIsCompatibilityReportModalOpen(true);
    } else {
      alert('No compatibility issues found! Your template looks good.');
    }
  };

  const handleCompatibilityReportClose = () => {
    setIsCompatibilityReportModalOpen(false);
    setPendingAction(null);
    setCompatibilityReport(null);
  };

  const handleExportAnyway = async () => {
    setIsCompatibilityReportModalOpen(false);
    const action = pendingAction();
    setPendingAction(null);
    setCompatibilityReport(null);

    try {
      if (action === 'export') {
        await actions.exportTemplate('html');
      } else if (action === 'test') {
        setIsTestConfigModalOpen(true);
      }
    } catch (error) {
      console.error('[Builder] Failed to proceed with action:', error);
      alert('Failed to proceed. Please try again.');
    }
  };

  return (
    <>
      <div class={styles.builder}>
        <header class={styles.header}>
          <div class={styles.headerLeft}>
            <h1>Email Builder</h1>
          </div>
          <div class={styles.headerRight}>
            <Show when={translationManager}>
              <LanguageSwitcher />
            </Show>
          </div>
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
              onCheckCompatibility={handleCheckCompatibility}
              onTestEmailClients={handleTestEmailClients}
              onEmailTestingSettings={handleEmailTestingSettings}
            />
          </Show>
        </header>

        {/* Tips Display Area */}
        <Show when={state.activeTips.length > 0}>
          <div class={styles.tipsContainer}>
            <For each={state.activeTips}>
              {(tip) => (
                <TipBanner
                  tip={tip}
                  onDismiss={() => actions.dismissTip(tip.id)}
                />
              )}
            </For>
          </div>
        </Show>

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
                onCanvasRef={handleCanvasRef}
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
              visualFeedback={visualFeedbackHandlers()}
            />
          </aside>
        </div>
      </div>

      {/* Accessibility announcer for screen readers */}
      <AccessibilityAnnouncer
        currentProperty={currentEditingProperty()}
        currentValue={currentEditingValue()}
        isEditing={isEditingProperty()}
        politeness="polite"
      />

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

      <EmailTestingSettingsModal
        isOpen={isEmailTestingSettingsModalOpen()}
        onClose={() => setIsEmailTestingSettingsModalOpen(false)}
        onSave={handleSaveEmailTestingConfig}
        initialConfig={state.emailTestingConfig ?? undefined}
      />

      <TestConfigModal
        isOpen={isTestConfigModalOpen()}
        onClose={() => setIsTestConfigModalOpen(false)}
        onSubmit={handleSubmitTest}
      />

      <Show when={compatibilityReport()}>
        <CompatibilityReportModal
          isOpen={isCompatibilityReportModalOpen()}
          onClose={handleCompatibilityReportClose}
          report={compatibilityReport()!}
          onExportAnyway={handleExportAnyway}
        />
      </Show>
    </>
  );
};

const Builder: Component = () => {
  return (
    <BuilderProvider>
      {/* Get translation manager from context and wrap with TranslationProvider */}
      <BuilderWithTranslation />
    </BuilderProvider>
  );
};

// Separate component to access builder context
const BuilderWithTranslation: Component = () => {
  const { translationManager } = useBuilder();

  return (
    <Show
      when={translationManager}
      fallback={<BuilderContent />}
    >
      <TranslationProvider manager={translationManager!}>
        <BuilderContent />
      </TranslationProvider>
    </Show>
  );
};

export default Builder;
