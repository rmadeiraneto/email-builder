/**
 * Template Canvas Component
 *
 * Renders the template and allows for component selection and interaction
 */

import { type Component, For, Show, createSignal } from 'solid-js';
import type { Template, BaseComponent } from '@email-builder/core';
import styles from './TemplateCanvas.module.scss';

export interface TemplateCanvasProps {
  template: Template | null;
  selectedComponentId: string | null;
  onComponentSelect?: (id: string | null) => void;
  onComponentAdd?: (component: BaseComponent, index?: number) => void;
  onDrop?: (event: DragEvent) => void;
  onComponentReorder?: (componentId: string, newIndex: number) => void;
}

export const TemplateCanvas: Component<TemplateCanvasProps> = (props) => {
  let canvasRef: HTMLDivElement | undefined;
  const [isDraggingOver, setIsDraggingOver] = createSignal(false);
  const [draggedComponentId, setDraggedComponentId] = createSignal<string | null>(null);
  const [dropIndicatorIndex, setDropIndicatorIndex] = createSignal<number | null>(null);

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
    const dataType = event.dataTransfer?.types[0];

    // Check if we're dragging an existing component for reordering
    if (dataType === 'component/reorder') {
      event.dataTransfer!.dropEffect = 'move';
    } else {
      event.dataTransfer!.dropEffect = 'copy';
    }

    setIsDraggingOver(true);
  };

  const handleDragLeave = (event: DragEvent) => {
    // Only set to false if we're leaving the canvas itself, not a child element
    if (event.currentTarget === event.target) {
      setIsDraggingOver(false);
      setDropIndicatorIndex(null);
    }
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(false);
    setDropIndicatorIndex(null);

    const dataType = event.dataTransfer?.types[0];

    // Handle reordering
    if (dataType === 'component/reorder') {
      const componentId = event.dataTransfer?.getData('component/reorder');
      const dropIndex = dropIndicatorIndex();

      if (componentId && dropIndex !== null) {
        props.onComponentReorder?.(componentId, dropIndex);
      }

      setDraggedComponentId(null);
    } else {
      // Handle adding new component from palette
      props.onDrop?.(event);
    }
  };

  const handleComponentDragStart = (component: BaseComponent, event: DragEvent) => {
    event.stopPropagation();
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('component/reorder', component.id);
    setDraggedComponentId(component.id);
  };

  const handleComponentDragOver = (index: number, event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const dataType = event.dataTransfer?.types[0];
    if (dataType === 'component/reorder') {
      setDropIndicatorIndex(index);
    }
  };

  const handleComponentDragEnd = () => {
    setDraggedComponentId(null);
    setDropIndicatorIndex(null);
  };

  return (
    <div
      ref={canvasRef}
      class={`${styles.canvas} ${isDraggingOver() ? styles.draggingOver : ''}`}
      onClick={handleCanvasClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Show when={props.template} fallback={<EmptyState />}>
        <div
          class={styles.templateContainer}
          style={{
            width: props.template?.settings.canvasDimensions.width
              ? `${props.template.settings.canvasDimensions.width}px`
              : '100%',
            'max-width': props.template?.settings.canvasDimensions.maxWidth
              ? `${props.template.settings.canvasDimensions.maxWidth}px`
              : 'none',
            'background-color': props.template?.generalStyles.canvasBackgroundColor || '#ffffff',
          }}
        >
          <Show
            when={props.template?.components && props.template.components.length > 0}
            fallback={<DropZone />}
          >
            <For each={props.template?.components}>
              {(component, index) => (
                <>
                  <Show when={dropIndicatorIndex() === index()}>
                    <div class={styles.dropIndicator}>Drop here</div>
                  </Show>
                  <ComponentItem
                    component={component}
                    isSelected={props.selectedComponentId === component.id}
                    isDragging={draggedComponentId() === component.id}
                    onClick={(event) => handleComponentClick(component, event)}
                    onDragStart={(event) => handleComponentDragStart(component, event)}
                    onDragOver={(event) => handleComponentDragOver(index(), event)}
                    onDragEnd={handleComponentDragEnd}
                  />
                  <Show when={dropIndicatorIndex() === props.template!.components.length && index() === props.template!.components.length - 1}>
                    <div class={styles.dropIndicator}>Drop here</div>
                  </Show>
                </>
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
  isDragging: boolean;
  onClick: (event: MouseEvent) => void;
  onDragStart: (event: DragEvent) => void;
  onDragOver: (event: DragEvent) => void;
  onDragEnd: () => void;
}

const ComponentItem: Component<ComponentItemProps> = (props) => {
  return (
    <div
      class={`${styles.component} ${props.isSelected ? styles.selected : ''} ${props.isDragging ? styles.dragging : ''}`}
      onClick={props.onClick}
      draggable={true}
      onDragStart={props.onDragStart}
      onDragOver={props.onDragOver}
      onDragEnd={props.onDragEnd}
      data-component-id={props.component.id}
      data-component-type={props.component.type}
    >
      <div class={styles.componentOverlay}>
        <span class={styles.dragHandle} title="Drag to reorder">
          ⋮⋮
        </span>
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
