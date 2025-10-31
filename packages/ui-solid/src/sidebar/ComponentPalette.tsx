/**
 * Component Palette
 *
 * Displays available components that can be dragged onto the canvas
 */

import { type Component, For, createSignal, Show } from 'solid-js';
import type { ComponentDefinition, ComponentCategory } from '@email-builder/core';
import styles from './ComponentPalette.module.scss';

export interface ComponentPaletteProps {
  components: ComponentDefinition[];
  onComponentDragStart?: (definition: ComponentDefinition, event: DragEvent) => void;
}

export const ComponentPalette: Component<ComponentPaletteProps> = (props) => {
  const [searchQuery, setSearchQuery] = createSignal('');
  const [selectedCategory, setSelectedCategory] = createSignal<ComponentCategory | 'all'>('all');

  const filteredComponents = () => {
    let filtered = props.components;

    // Filter by category
    if (selectedCategory() !== 'all') {
      filtered = filtered.filter(
        (comp) => comp.metadata.category === selectedCategory()
      );
    }

    // Filter by search query
    const query = searchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(
        (comp) =>
          comp.metadata.name.toLowerCase().includes(query) ||
          comp.metadata.description?.toLowerCase().includes(query) ||
          comp.metadata.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  const categories = () => {
    const cats = new Set<ComponentCategory>();
    props.components.forEach((comp) => cats.add(comp.metadata.category));
    return Array.from(cats);
  };

  return (
    <div class={styles.palette}>
      <div class={styles.searchContainer}>
        <input
          type="text"
          class={styles.searchInput}
          placeholder="Search components..."
          value={searchQuery()}
          onInput={(e) => setSearchQuery(e.currentTarget.value)}
        />
      </div>

      <div class={styles.categoryFilter}>
        <button
          class={selectedCategory() === 'all' ? styles.active : ''}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        <For each={categories()}>
          {(category) => (
            <button
              class={selectedCategory() === category ? styles.active : ''}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          )}
        </For>
      </div>

      <div class={styles.componentList}>
        <Show
          when={filteredComponents().length > 0}
          fallback={<EmptyState query={searchQuery()} />}
        >
          <For each={filteredComponents()}>
            {(definition) => (
              <ComponentItem
                definition={definition}
                onDragStart={(event) => props.onComponentDragStart?.(definition, event)}
              />
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};

interface ComponentItemProps {
  definition: ComponentDefinition;
  onDragStart?: (event: DragEvent) => void;
}

const ComponentItem: Component<ComponentItemProps> = (props) => {
  const handleDragStart = (event: DragEvent) => {
    event.dataTransfer!.effectAllowed = 'copy';
    event.dataTransfer!.setData('application/json', JSON.stringify({
      type: props.definition.type,
      category: props.definition.metadata.category,
    }));
    props.onDragStart?.(event);
  };

  return (
    <div
      class={styles.componentItem}
      draggable={true}
      onDragStart={handleDragStart}
      data-component-type={props.definition.type}
    >
      <div class={styles.componentIcon}>
        <Show when={props.definition.metadata.icon} fallback={<span>📦</span>}>
          <i class={props.definition.metadata.icon} />
        </Show>
      </div>
      <div class={styles.componentInfo}>
        <div class={styles.componentName}>{props.definition.metadata.name}</div>
        <Show when={props.definition.metadata.description}>
          <div class={styles.componentDescription}>
            {props.definition.metadata.description}
          </div>
        </Show>
      </div>
      <div class={styles.dragHandle}>⋮⋮</div>
    </div>
  );
};

interface EmptyStateProps {
  query: string;
}

const EmptyState: Component<EmptyStateProps> = (props) => {
  return (
    <div class={styles.emptyState}>
      <Show
        when={props.query}
        fallback={<p>No components available</p>}
      >
        <p>No components found for "{props.query}"</p>
      </Show>
    </div>
  );
};
