/**
 * Mobile Layout Manager Component
 *
 * UI for managing component order and visibility in mobile mode
 */

import { Component, For, createSignal, Show } from 'solid-js';
import type { LayoutComponentItem } from '@email-builder/core';
import { Button } from '../atoms/Button';
import styles from './MobileLayoutManager.module.scss';

export interface MobileLayoutManagerProps {
  /**
   * Layout items (components)
   */
  items: LayoutComponentItem[];

  /**
   * Callback when component order changes
   */
  onReorder: (componentIds: string[]) => void;

  /**
   * Callback when component visibility changes
   */
  onVisibilityToggle: (componentId: string, visible: boolean) => void;

  /**
   * Callback when reset to desktop order is requested
   */
  onResetOrder?: () => void;

  /**
   * Callback when apply mobile defaults is requested
   */
  onApplyDefaults?: () => void;

  /**
   * Show first-time prompt
   */
  showFirstTimePrompt?: boolean;

  /**
   * Callback when first-time prompt is dismissed
   */
  onDismissPrompt?: () => void;
}

/**
 * Mobile Layout Manager Component
 *
 * Displays a list of components with drag-and-drop reordering and visibility toggles
 */
export const MobileLayoutManager: Component<MobileLayoutManagerProps> = (props) => {
  const [draggingId, setDraggingId] = createSignal<string | null>(null);
  const [dragOverId, setDragOverId] = createSignal<string | null>(null);

  const handleDragStart = (e: DragEvent, item: LayoutComponentItem) => {
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', item.id);
    }
    setDraggingId(item.id);
  };

  const handleDragOver = (e: DragEvent, item: LayoutComponentItem) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    setDragOverId(item.id);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: DragEvent, targetItem: LayoutComponentItem) => {
    e.preventDefault();
    const draggedId = draggingId();

    if (draggedId && draggedId !== targetItem.id) {
      const items = [...props.items];
      const draggedIndex = items.findIndex(i => i.id === draggedId);
      const targetIndex = items.findIndex(i => i.id === targetItem.id);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [draggedItem] = items.splice(draggedIndex, 1);
        items.splice(targetIndex, 0, draggedItem);

        props.onReorder(items.map(i => i.id));
      }
    }

    setDraggingId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  const hasOrderChanges = () => props.items.some(item => item.positionChanged);
  const hasHiddenComponents = () => props.items.some(item => !item.visibleOnMobile);

  return (
    <div class={styles.container}>
      <Show when={props.showFirstTimePrompt}>
        <div class={styles.prompt}>
          <div class={styles.promptContent}>
            <h3>Mobile Layout Customization</h3>
            <p>
              Customize how your components appear on mobile devices. You can reorder components
              and control their visibility.
            </p>
            <div class={styles.promptActions}>
              <Button
                variant="primary"
                size="small"
                onClick={props.onApplyDefaults}
              >
                Apply Mobile-Optimized Defaults
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={props.onDismissPrompt}
              >
                Skip
              </Button>
            </div>
          </div>
        </div>
      </Show>

      <div class={styles.header}>
        <h3>Mobile Layout</h3>
        <div class={styles.headerActions}>
          <Show when={hasOrderChanges()}>
            <Button
              variant="ghost"
              size="small"
              onClick={props.onResetOrder}
              icon="refresh-line"
            >
              Reset Order
            </Button>
          </Show>
        </div>
      </div>

      <Show when={props.items.length === 0}>
        <div class={styles.empty}>
          <i class="ri-inbox-line" />
          <p>No components in template</p>
        </div>
      </Show>

      <div class={styles.list}>
        <For each={props.items}>
          {(item) => (
            <div
              class={`${styles.item} ${draggingId() === item.id ? styles.dragging : ''} ${dragOverId() === item.id ? styles.dragOver : ''} ${!item.visibleOnMobile ? styles.hidden : ''}`}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, item)}
              onDragOver={(e) => handleDragOver(e, item)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item)}
              onDragEnd={handleDragEnd}
            >
              <div class={styles.dragHandle}>
                <i class="ri-draggable" />
              </div>

              <div class={styles.itemContent}>
                <div class={styles.itemInfo}>
                  <span class={styles.itemName}>{item.name}</span>
                  <span class={styles.itemType}>{item.type}</span>
                </div>

                <Show when={item.positionChanged}>
                  <span class={styles.badge}>Reordered</span>
                </Show>
              </div>

              <button
                type="button"
                class={`${styles.visibilityToggle} ${item.visibleOnMobile ? styles.visible : styles.hiddenToggle}`}
                onClick={() => props.onVisibilityToggle(item.id, !item.visibleOnMobile)}
                aria-label={item.visibleOnMobile ? 'Hide on mobile' : 'Show on mobile'}
                title={item.visibleOnMobile ? 'Hide on mobile' : 'Show on mobile'}
              >
                <i class={item.visibleOnMobile ? 'ri-eye-line' : 'ri-eye-off-line'} />
              </button>
            </div>
          )}
        </For>
      </div>

      <Show when={hasHiddenComponents()}>
        <div class={styles.footer}>
          <i class="ri-information-line" />
          <span>Hidden components are grayed out and won't appear on mobile</span>
        </div>
      </Show>
    </div>
  );
};
