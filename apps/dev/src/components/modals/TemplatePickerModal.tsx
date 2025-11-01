/**
 * Template Picker Modal
 *
 * Modal for loading and managing saved templates
 */

import { type Component, createSignal, Show, For, onMount, createEffect } from 'solid-js';
import type { TemplateListItem } from '@email-builder/core';
import styles from './TemplatePickerModal.module.scss';

export interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTemplate: (id: string) => void;
  onDeleteTemplate: (id: string) => void;
  onListTemplates: () => Promise<TemplateListItem[]>;
}

export const TemplatePickerModal: Component<TemplatePickerModalProps> = (props) => {
  const [templates, setTemplates] = createSignal<TemplateListItem[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal('');
  const [error, setError] = createSignal('');

  const loadTemplates = async () => {
    setLoading(true);
    setError('');
    try {
      const templateList = await props.onListTemplates();
      setTemplates(templateList);
    } catch (err) {
      console.error('[TemplatePickerModal] Failed to load templates:', err);
      setError('Failed to load templates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load templates when modal opens
  createEffect(() => {
    if (props.isOpen) {
      loadTemplates();
    }
  });

  // Filter templates based on search query
  const filteredTemplates = () => {
    const query = searchQuery().toLowerCase().trim();
    if (!query) return templates();

    return templates().filter(
      (template) =>
        template.name.toLowerCase().includes(query) ||
        template.description?.toLowerCase().includes(query) ||
        template.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  };

  const handleLoad = (template: TemplateListItem) => {
    props.onLoadTemplate(template.id);
    handleClose();
  };

  const handleDelete = async (template: TemplateListItem, event: MouseEvent) => {
    event.stopPropagation();

    const confirmed = confirm(
      `Are you sure you want to delete "${template.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await props.onDeleteTemplate(template.id);
      // Reload templates after deletion
      await loadTemplates();
    } catch (err) {
      console.error('[TemplatePickerModal] Failed to delete template:', err);
      setError('Failed to delete template. Please try again.');
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setError('');
    props.onClose();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Show when={props.isOpen}>
      <div class={styles.modal}>
        <div class={styles.modal__overlay} onClick={handleClose} />
        <div class={styles.modal__content}>
          <div class={styles.modal__header}>
            <h2 class={styles.modal__title}>Load Template</h2>
            <button
              class={styles.modal__close}
              onClick={handleClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <div class={styles.modal__body}>
            {/* Search */}
            <div class={styles.modal__search}>
              <input
                type="text"
                class={styles.modal__searchInput}
                placeholder="Search templates..."
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
              />
            </div>

            {/* Error */}
            <Show when={error()}>
              <div class={styles.modal__error}>{error()}</div>
            </Show>

            {/* Loading */}
            <Show when={loading()}>
              <div class={styles.modal__loading}>Loading templates...</div>
            </Show>

            {/* Empty state */}
            <Show when={!loading() && filteredTemplates().length === 0}>
              <div class={styles.modal__empty}>
                <div class={styles.modal__emptyIcon}>📋</div>
                <h3 class={styles.modal__emptyTitle}>
                  {searchQuery() ? 'No templates found' : 'No saved templates'}
                </h3>
                <p class={styles.modal__emptyText}>
                  {searchQuery()
                    ? 'Try a different search term'
                    : 'Create a template and save it to see it here'}
                </p>
              </div>
            </Show>

            {/* Template list */}
            <Show when={!loading() && filteredTemplates().length > 0}>
              <div class={styles.modal__list}>
                <For each={filteredTemplates()}>
                  {(template) => (
                    <div
                      class={styles.templateCard}
                      onClick={() => handleLoad(template)}
                    >
                      <div class={styles.templateCard__content}>
                        <h3 class={styles.templateCard__name}>{template.name}</h3>
                        <Show when={template.description}>
                          <p class={styles.templateCard__description}>
                            {template.description}
                          </p>
                        </Show>
                        <div class={styles.templateCard__meta}>
                          <span class={styles.templateCard__type}>
                            {template.target === 'email' ? '📧' : '🌐'}{' '}
                            {template.target}
                          </span>
                          <span class={styles.templateCard__date}>
                            {formatDate(template.updatedAt)}
                          </span>
                        </div>
                        <Show when={template.tags && template.tags.length > 0}>
                          <div class={styles.templateCard__tags}>
                            <For each={template.tags}>
                              {(tag) => (
                                <span class={styles.templateCard__tag}>{tag}</span>
                              )}
                            </For>
                          </div>
                        </Show>
                      </div>
                      <div class={styles.templateCard__actions}>
                        <button
                          class={styles.templateCard__deleteButton}
                          onClick={(e) => handleDelete(template, e)}
                          title="Delete template"
                          aria-label={`Delete ${template.name}`}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </div>

          <div class={styles.modal__footer}>
            <button
              type="button"
              class={`${styles.modal__button} ${styles['modal__button--secondary']}`}
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};
