/**
 * ListEditor component (SolidJS)
 *
 * Dynamic list editor with add/remove/reorder functionality.
 *
 * Features:
 * - Add new items
 * - Remove items
 * - Drag and drop reordering
 * - Custom render function for items
 *
 * @example
 * ```tsx
 * <ListEditor
 *   items={['Item 1', 'Item 2']}
 *   onChange={(newItems) => console.log(newItems)}
 *   renderItem={(item, index) => <div>{item}</div>}
 *   addButtonLabel="Add Item"
 * />
 * ```
 */

import { Component, For, createSignal, mergeProps, Show } from 'solid-js';
import { classNames } from '../../utils';
import styles from './list-editor.module.scss';

/**
 * ListEditor props
 */
export interface ListEditorProps<T = any> {
  /**
   * Current list of items
   */
  items?: T[];

  /**
   * Label for the list
   */
  label?: string;

  /**
   * Label for the add button
   * @default "Add Item"
   */
  addButtonLabel?: string;

  /**
   * Show drag handles for reordering
   * @default true
   */
  showDragHandles?: boolean;

  /**
   * Allow adding new items
   * @default true
   */
  allowAdd?: boolean;

  /**
   * Allow removing items
   * @default true
   */
  allowRemove?: boolean;

  /**
   * Allow reordering items
   * @default true
   */
  allowReorder?: boolean;

  /**
   * Minimum number of items
   * @default 0
   */
  minItems?: number;

  /**
   * Maximum number of items
   * @default Infinity
   */
  maxItems?: number;

  /**
   * Disable the list editor
   */
  disabled?: boolean;

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Custom render function for each item
   * @param item - The item to render
   * @param index - The index of the item
   * @returns JSX element
   */
  renderItem?: (item: T, index: number) => JSX.Element;

  /**
   * Function to create a new item
   * @returns A new item
   */
  createNewItem?: () => T;

  /**
   * Callback fired when items change
   */
  onChange?: (items: T[]) => void;

  /**
   * Callback fired when an item is added
   */
  onAdd?: (item: T, index: number) => void;

  /**
   * Callback fired when an item is removed
   */
  onRemove?: (item: T, index: number) => void;

  /**
   * Callback fired when items are reordered
   */
  onReorder?: (items: T[], fromIndex: number, toIndex: number) => void;
}

/**
 * Default props
 */
const defaultProps: Partial<ListEditorProps> = {
  items: [],
  addButtonLabel: 'Add Item',
  showDragHandles: true,
  allowAdd: true,
  allowRemove: true,
  allowReorder: true,
  minItems: 0,
  maxItems: Infinity,
  disabled: false,
};

/**
 * ListEditor Component
 */
export const ListEditor: Component<ListEditorProps> = (props) => {
  const merged = mergeProps(defaultProps, props);

  const [draggedIndex, setDraggedIndex] = createSignal<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = createSignal<number | null>(null);

  /**
   * Get current items
   */
  const getItems = (): any[] => {
    return merged.items || [];
  };

  /**
   * Handle add item
   */
  const handleAdd = () => {
    if (merged.disabled) return;
    if (getItems().length >= merged.maxItems!) return;

    const newItem = merged.createNewItem ? merged.createNewItem() : null;
    const newItems = [...getItems(), newItem];

    merged.onChange?.(newItems);
    merged.onAdd?.(newItem, newItems.length - 1);
  };

  /**
   * Handle remove item
   */
  const handleRemove = (index: number) => {
    if (merged.disabled) return;
    if (getItems().length <= merged.minItems!) return;

    const items = getItems();
    const removedItem = items[index];
    const newItems = items.filter((_, i) => i !== index);

    merged.onChange?.(newItems);
    merged.onRemove?.(removedItem, index);
  };

  /**
   * Handle drag start
   */
  const handleDragStart = (e: DragEvent, index: number) => {
    if (merged.disabled || !merged.allowReorder) return;

    setDraggedIndex(index);
    e.dataTransfer!.effectAllowed = 'move';
    e.dataTransfer!.setData('text/html', (e.target as HTMLElement).innerHTML);
  };

  /**
   * Handle drag over
   */
  const handleDragOver = (e: DragEvent, index: number) => {
    if (merged.disabled || !merged.allowReorder) return;

    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';

    if (draggedIndex() !== null && draggedIndex() !== index) {
      setDragOverIndex(index);
    }
  };

  /**
   * Handle drag leave
   */
  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  /**
   * Handle drop
   */
  const handleDrop = (e: DragEvent, dropIndex: number) => {
    if (merged.disabled || !merged.allowReorder) return;

    e.preventDefault();
    e.stopPropagation();

    const fromIndex = draggedIndex();
    if (fromIndex === null || fromIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const items = getItems();
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(dropIndex, 0, movedItem);

    merged.onChange?.(newItems);
    merged.onReorder?.(newItems, fromIndex, dropIndex);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  /**
   * Handle drag end
   */
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  /**
   * Check if can add more items
   */
  const canAddMore = (): boolean => {
    return merged.allowAdd! && getItems().length < merged.maxItems! && !merged.disabled;
  };

  /**
   * Check if can remove item
   */
  const canRemove = (): boolean => {
    return merged.allowRemove! && getItems().length > merged.minItems! && !merged.disabled;
  };

  /**
   * Default render function
   */
  const defaultRenderItem = (item: any, index: number): JSX.Element => {
    return (
      <div class={styles['list-editor__item-content']}>
        {typeof item === 'string' ? item : JSON.stringify(item)}
      </div>
    );
  };

  return (
    <div class={classNames(styles['list-editor'], merged.class)}>
      {/* Label */}
      <Show when={merged.label}>
        <div class={styles['list-editor__label']}>{merged.label}</div>
      </Show>

      {/* Items */}
      <div class={styles['list-editor__items']}>
        <Show
          when={getItems().length > 0}
          fallback={
            <div class={styles['list-editor__empty']}>
              <i class="ri-inbox-line" />
              <span>No items yet</span>
            </div>
          }
        >
          <For each={getItems()}>
            {(item, index) => (
              <div
                class={classNames(
                  styles['list-editor__item'],
                  draggedIndex() === index() && styles['list-editor__item--dragging'],
                  dragOverIndex() === index() && styles['list-editor__item--drag-over'],
                  merged.disabled && styles['list-editor__item--disabled']
                )}
                draggable={merged.allowReorder && !merged.disabled}
                onDragStart={(e) => handleDragStart(e, index())}
                onDragOver={(e) => handleDragOver(e, index())}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index())}
                onDragEnd={handleDragEnd}
              >
                {/* Drag Handle */}
                <Show when={merged.showDragHandles && merged.allowReorder}>
                  <div
                    class={styles['list-editor__drag-handle']}
                    title="Drag to reorder"
                  >
                    <i class="ri-draggable" />
                  </div>
                </Show>

                {/* Item Content */}
                <div class={styles['list-editor__item-wrapper']}>
                  {merged.renderItem
                    ? merged.renderItem(item, index())
                    : defaultRenderItem(item, index())}
                </div>

                {/* Remove Button */}
                <Show when={canRemove()}>
                  <button
                    type="button"
                    class={styles['list-editor__remove-button']}
                    onClick={() => handleRemove(index())}
                    title="Remove item"
                    disabled={merged.disabled}
                  >
                    <i class="ri-close-line" />
                  </button>
                </Show>
              </div>
            )}
          </For>
        </Show>
      </div>

      {/* Add Button */}
      <Show when={canAddMore()}>
        <button
          type="button"
          class={styles['list-editor__add-button']}
          onClick={handleAdd}
          disabled={merged.disabled}
        >
          <i class="ri-add-line" />
          <span>{merged.addButtonLabel}</span>
        </button>
      </Show>
    </div>
  );
};
