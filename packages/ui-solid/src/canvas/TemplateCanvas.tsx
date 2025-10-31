/**
 * Template Canvas Component
 *
 * Renders the template and allows for component selection and interaction
 */

import { type Component, For, Show, createEffect } from 'solid-js';
import type { Template, BaseComponent } from '@email-builder/core';
import styles from './TemplateCanvas.module.scss';

export interface TemplateCanvasProps {
  template: Template | null;
  selectedComponentId: string | null;
  onComponentSelect?: (id: string) => void;
  onComponentAdd?: (component: BaseComponent, index?: number) => void;
  onDrop?: (event: DragEvent) => void;
}

export const TemplateCanvas: Component<TemplateCanvasProps> = (props) => {
  let canvasRef: HTMLDivElement | undefined;

  const handleComponentClick = (component: BaseComponent, event: MouseEvent) => {
    event.stopPropagation();
    props.onComponentSelect?.(component.id);
  };

  const handleCanvasClick = () => {
    // Deselect when clicking on empty canvas
    props.onComponentSelect?.(null);
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'copy';
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    props.onDrop?.(event);
  };

  return (
    <div
      ref={canvasRef}
      class={styles.canvas}
      onClick={handleCanvasClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Show when={props.template} fallback={<EmptyState />}>
        <div
          class={styles.templateContainer}
          style={{
            width: props.template?.canvas?.width
              ? `${props.template.canvas.width}px`
              : '100%',
            'max-width': props.template?.canvas?.maxWidth
              ? `${props.template.canvas.maxWidth}px`
              : 'none',
            'background-color': props.template?.canvas?.backgroundColor || '#ffffff',
          }}
        >
          <Show
            when={props.template?.components && props.template.components.length > 0}
            fallback={<DropZone />}
          >
            <For each={props.template?.components}>
              {(component) => (
                <ComponentItem
                  component={component}
                  isSelected={props.selectedComponentId === component.id}
                  onClick={(event) => handleComponentClick(component, event)}
                />
              )}
            </For>
          </Show>
        </div>
      </Show>
    </div>
  );
};

const EmptyState: Component = () => {
  return (
    <div class={styles.emptyState}>
      <div class={styles.emptyStateContent}>
        <h3>No Template Loaded</h3>
        <p>Create a new template or load an existing one to get started.</p>
      </div>
    </div>
  );
};

const DropZone: Component = () => {
  return (
    <div class={styles.dropZone}>
      <p>Drag and drop components here to start building your template</p>
    </div>
  );
};

interface ComponentItemProps {
  component: BaseComponent;
  isSelected: boolean;
  onClick: (event: MouseEvent) => void;
}

const ComponentItem: Component<ComponentItemProps> = (props) => {
  return (
    <div
      class={`${styles.component} ${props.isSelected ? styles.selected : ''}`}
      onClick={props.onClick}
      data-component-id={props.component.id}
      data-component-type={props.component.type}
    >
      <div class={styles.componentOverlay}>
        <span class={styles.componentLabel}>
          {props.component.type}
        </span>
      </div>
      <div class={styles.componentContent}>
        {/* Component preview will be rendered here */}
        <ComponentPreview component={props.component} />
      </div>
    </div>
  );
};

interface ComponentPreviewProps {
  component: BaseComponent;
}

const ComponentPreview: Component<ComponentPreviewProps> = (props) => {
  // Simple preview for now - will be enhanced with actual rendering
  return (
    <div class={styles.preview}>
      <strong>{props.component.type}</strong>
      <Show when={props.component.content}>
        <div class={styles.previewContent}>
          {JSON.stringify(props.component.content, null, 2)}
        </div>
      </Show>
    </div>
  );
};
