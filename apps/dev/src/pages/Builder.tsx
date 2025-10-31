/**
 * Template Builder Page
 *
 * Main page for the email/template builder application
 */

import { type Component, Show } from 'solid-js';
import { BuilderProvider, useBuilder } from '../context/BuilderContext';
import { TemplateCanvas } from '@email-builder/ui-solid/canvas';
import { ComponentPalette } from '@email-builder/ui-solid/sidebar';
import type { ComponentDefinition } from '@email-builder/core';
import styles from './Builder.module.scss';

const BuilderContent: Component = () => {
  const { state, actions, componentDefinitions } = useBuilder();

  const handleComponentSelect = (id: string | null) => {
    actions.selectComponent(id);
  };

  const handleComponentDragStart = (definition: ComponentDefinition, event: DragEvent) => {
    console.log('[Builder] Component drag started:', definition.type);
  };

  const handleDrop = (event: DragEvent) => {
    console.log('[Builder] Component dropped:', event);
    // TODO: Handle component drop - create component instance and add to template
  };

  return (
    <div class={styles.builder}>
      <header class={styles.header}>
        <h1>Email Builder</h1>
        <div class={styles.toolbar}>
          {/* Toolbar will go here */}
          <Show when={!state.isInitialized}>
            <span>Initializing...</span>
          </Show>
        </div>
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
          <h2>Properties</h2>
          {/* Property Panel will go here */}
          <Show when={state.selectedComponentId}>
            <p>Component selected: {state.selectedComponentId}</p>
          </Show>
          <Show when={!state.selectedComponentId}>
            <p>No component selected</p>
          </Show>
        </aside>
      </div>
    </div>
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
