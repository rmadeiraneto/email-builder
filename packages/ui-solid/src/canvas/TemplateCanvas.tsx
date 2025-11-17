/**
 * Template Canvas Component
 *
 * Renders the template and allows for component selection and interaction
 */

import { type Component, For, Show, createSignal, onMount, onCleanup, createMemo } from 'solid-js';
import type { Template, BaseComponent } from '@email-builder/core';
import { getTestId, getTestAction, getTestState, DeviceMode } from '@email-builder/core';
import { ComponentRenderer } from './ComponentRenderer';
import styles from './TemplateCanvas.module.scss';

export interface TemplateCanvasProps {
  template: Template | null;
  selectedComponentId: string | null;
  deviceMode?: DeviceMode;
  onComponentSelect?: (id: string | null) => void;
  onComponentAdd?: (component: BaseComponent, index?: number) => void;
  onDrop?: (event: DragEvent) => void;
  onComponentReorder?: (componentId: string, newIndex: number) => void;
  onCanvasRef?: (element: HTMLElement | null) => void;
}

export const TemplateCanvas: Component<TemplateCanvasProps> = (props) => {
  let canvasRef: HTMLDivElement | undefined;
  const [isDraggingOver, setIsDraggingOver] = createSignal(false);
  const [draggedComponentId, setDraggedComponentId] = createSignal<string | null>(null);
  const [dropIndicatorIndex, setDropIndicatorIndex] = createSignal<number | null>(null);

  // Check if component is visible in current mode
  const isComponentVisible = (component: BaseComponent): boolean => {
    if (!component.visibility) return true;

    if (props.deviceMode === DeviceMode.MOBILE) {
      return component.visibility.mobile ?? component.visibility.desktop;
    }

    return component.visibility.desktop;
  };

  // Check if component has mobile customizations
  const hasMobileCustomizations = (component: BaseComponent): boolean => {
    return !!(component.mobileStyles || (component.visibility && component.visibility.mobile !== undefined));
  };

  // Notify parent when canvas element is mounted
  onMount(() => {
    if (canvasRef) {
      props.onCanvasRef?.(canvasRef);
    }
  });

  // Cleanup on unmount
  onCleanup(() => {
    props.onCanvasRef?.(null);
  });

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
      {...getTestId('canvas-template')}
      {...getTestState({
        hasTemplate: !!props.template,
        componentCount: props.template?.components?.length || 0,
        isDraggingOver: isDraggingOver(),
        hasSelection: !!props.selectedComponentId
      })}
      ref={canvasRef}
      class={`${styles.canvas} ${isDraggingOver() ? styles.draggingOver : ''}`}
      onClick={handleCanvasClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="region"
      aria-label="Template canvas"
    >
      <Show when={props.template} fallback={<EmptyState />}>
        <div
          {...getTestId('container-template')}
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
                    isHidden={!isComponentVisible(component)}
                    hasMobileOverrides={hasMobileCustomizations(component)}
                    isMobileMode={props.deviceMode === DeviceMode.MOBILE}
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
  isHidden?: boolean;
  hasMobileOverrides?: boolean;
  isMobileMode?: boolean;
  onClick: (event: MouseEvent) => void;
  onDragStart: (event: DragEvent) => void;
  onDragOver: (event: DragEvent) => void;
  onDragEnd: () => void;
}

const ComponentItem: Component<ComponentItemProps> = (props) => {
  const componentClasses = () => {
    const classes = [styles.component];

    if (props.isSelected) classes.push(styles.selected);
    if (props.isDragging) classes.push(styles.dragging);
    if (props.isHidden) classes.push(styles.hidden);

    return classes.join(' ');
  };

  return (
    <div
      {...getTestId(`canvas-component-${props.component.type.toLowerCase()}-${props.component.id}`)}
      {...getTestAction('select-component')}
      {...getTestState({
        selected: props.isSelected,
        dragging: props.isDragging,
        hidden: props.isHidden || false,
        hasMobileOverrides: props.hasMobileOverrides || false,
        type: props.component.type
      })}
      class={componentClasses()}
      onClick={props.onClick}
      draggable={true}
      onDragStart={props.onDragStart}
      onDragOver={props.onDragOver}
      onDragEnd={props.onDragEnd}
      data-component-id={props.component.id}
      data-component-type={props.component.type}
      role="button"
      aria-label={`${props.component.type} component${props.isHidden ? ' (hidden on mobile)' : ''}`}
      aria-selected={props.isSelected}
      tabindex={0}
      title={props.isHidden ? `Hidden on ${props.isMobileMode ? 'mobile' : 'desktop'}` : undefined}
    >
      <div class={styles.componentOverlay}>
        <span class={styles.dragHandle} title="Drag to reorder">
          ⋮⋮
        </span>
        <span class={styles.componentLabel}>
          {props.component.type}
          <Show when={props.hasMobileOverrides && !props.isMobileMode}>
            <span class={styles.mobileBadge} title="Has mobile customizations">
              📱
            </span>
          </Show>
          <Show when={props.isHidden}>
            <span class={styles.hiddenBadge} title={`Hidden on ${props.isMobileMode ? 'mobile' : 'desktop'}`}>
              👁️‍🗨️
            </span>
          </Show>
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
  return (
    <div class={styles.preview}>
      <ComponentRenderer component={props.component} />
    </div>
  );
};
