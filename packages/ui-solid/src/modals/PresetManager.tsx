/**
 * Preset Manager Modal
 *
 * Full CRUD interface for managing presets
 */

import { type Component, createSignal, createMemo, For, Show } from 'solid-js';
import type { ComponentPreset } from '@email-builder/core';
import { getTestId, getTestAction, getTestState } from '@email-builder/core/utils';
import styles from './PresetManager.module.scss';

export interface PresetManagerProps {
  isOpen: boolean;
  onClose: () => void;
  presets: ComponentPreset[];
  componentTypes: string[];
  onCreatePreset: (name: string, description: string, componentType: string) => Promise<ComponentPreset | void>;
  onUpdatePreset: (componentType: string, presetId: string, updates: { name?: string; description?: string }) => Promise<void>;
  onDeletePreset: (componentType: string, presetId: string) => Promise<void>;
  onDuplicatePreset?: (preset: ComponentPreset) => Promise<ComponentPreset | void>;
  onExportPresets?: () => void;
  onImportPresets?: (file: File) => void;
}

export const PresetManager: Component<PresetManagerProps> = (props) => {
  const [filterComponentType, setFilterComponentType] = createSignal<string>('all');
  const [searchQuery, setSearchQuery] = createSignal('');
  const [editingPresetId, setEditingPresetId] = createSignal<string | null>(null);
  const [editName, setEditName] = createSignal('');
  const [editDescription, setEditDescription] = createSignal('');
  const [deletingPresetId, setDeletingPresetId] = createSignal<string | null>(null);
  const [showCreateModal, setShowCreateModal] = createSignal(false);
  const [newPresetName, setNewPresetName] = createSignal('');
  const [newPresetDescription, setNewPresetDescription] = createSignal('');
  const [newPresetComponentType, setNewPresetComponentType] = createSignal('');

  // Filter and search presets
  const filteredPresets = createMemo(() => {
    let filtered = [...props.presets];

    // Filter by component type
    const typeFilter = filterComponentType();
    if (typeFilter !== 'all') {
      // Note: We'd need component type info in the preset to filter properly
      // For now, we'll need to pass this info or derive it from preset IDs
      filtered = filtered.filter(p => p.id.startsWith(typeFilter));
    }

    // Filter by search query
    const query = searchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    return filtered;
  });

  // Group presets by component type (derived from preset ID pattern)
  const groupedPresets = createMemo(() => {
    const groups: Record<string, ComponentPreset[]> = {};

    filteredPresets().forEach(preset => {
      // Extract component type from preset ID (e.g., "button-primary" -> "button")
      const componentType = preset.id.split('-')[0];
      if (!componentType) return; // Skip if no component type found
      if (!groups[componentType]) {
        groups[componentType] = [];
      }
      groups[componentType].push(preset);
    });

    return groups;
  });

  const handleEdit = (preset: ComponentPreset) => {
    setEditingPresetId(preset.id);
    setEditName(preset.name);
    setEditDescription(preset.description || '');
  };

  const handleSaveEdit = async (componentType: string) => {
    const presetId = editingPresetId();
    if (!presetId) return;

    await props.onUpdatePreset(componentType, presetId, {
      name: editName(),
      description: editDescription(),
    });

    setEditingPresetId(null);
    setEditName('');
    setEditDescription('');
  };

  const handleCancelEdit = () => {
    setEditingPresetId(null);
    setEditName('');
    setEditDescription('');
  };

  const handleDeleteConfirm = async (componentType: string, presetId: string) => {
    await props.onDeletePreset(componentType, presetId);
    setDeletingPresetId(null);
  };

  const handleDuplicate = async (preset: ComponentPreset) => {
    if (props.onDuplicatePreset) {
      await props.onDuplicatePreset(preset);
    }
  };

  const handleCreatePreset = async () => {
    if (!newPresetName().trim() || !newPresetComponentType()) return;

    await props.onCreatePreset(
      newPresetName().trim(),
      newPresetDescription().trim(),
      newPresetComponentType()
    );

    // Reset form
    setShowCreateModal(false);
    setNewPresetName('');
    setNewPresetDescription('');
    setNewPresetComponentType('');
  };

  const handleExport = () => {
    if (props.onExportPresets) {
      props.onExportPresets();
    }
  };

  const handleImport = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && props.onImportPresets) {
      props.onImportPresets(file);
    }
    input.value = '';
  };

  return (
    <Show when={props.isOpen}>
      <div
        {...getTestId('modal-preset-manager')}
        {...getTestState({
          presetCount: filteredPresets().length,
          category: filterComponentType(),
          hasSearch: searchQuery().length > 0,
          isEditing: editingPresetId() !== null,
          showCreate: showCreateModal()
        })}
        class={styles.modal}
      >
        <div class={styles.modal__overlay} onClick={props.onClose} />
        <div class={styles.modal__content}>
          <div class={styles.modal__header}>
            <h2 class={styles.modal__title}>Preset Manager</h2>
            <button
              {...getTestId('button-close-preset-manager')}
              {...getTestAction('close-modal')}
              class={styles.modal__close}
              onClick={props.onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <div class={styles.modal__toolbar}>
            <div class={styles.modal__filters}>
              <select
                {...getTestId('select-preset-filter-type')}
                {...getTestAction('filter-presets')}
                class={styles.modal__select}
                value={filterComponentType()}
                onChange={(e) => setFilterComponentType(e.currentTarget.value)}
              >
                <option value="all">All Components</option>
                <For each={props.componentTypes}>
                  {(type) => <option value={type}>{type}</option>}
                </For>
              </select>

              <input
                {...getTestId('input-preset-search')}
                type="text"
                class={styles.modal__search}
                placeholder="Search presets..."
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
              />
            </div>

            <div class={styles.modal__actions}>
              <button
                {...getTestId('button-new-preset')}
                {...getTestAction('open-create-preset-modal')}
                class={styles.modal__button}
                classList={{ [styles['modal__button--primary'] ?? '']: true }}
                onClick={() => setShowCreateModal(true)}
              >
                + New Preset
              </button>
            </div>
          </div>

          <div class={styles.modal__body}>
            <Show
              when={Object.keys(groupedPresets()).length > 0}
              fallback={
                <div class={styles.modal__empty}>
                  <p>No presets found</p>
                </div>
              }
            >
              <For each={Object.entries(groupedPresets())}>
                {([componentType, presets]) => (
                  <div class={styles.modal__group}>
                    <h3 class={styles.modal__groupTitle}>
                      {componentType.charAt(0).toUpperCase() + componentType.slice(1)} Presets ({presets.length})
                    </h3>

                    <div
                      {...getTestId(`preset-list-${componentType}`)}
                      class={styles.modal__presetList}
                    >
                      <For each={presets}>
                        {(preset) => (
                          <div
                            {...getTestId(`preset-item-${preset.id}`)}
                            {...getTestState({
                              isEditing: editingPresetId() === preset.id,
                              isCustom: preset.isCustom,
                              isDeleting: deletingPresetId() === preset.id
                            })}
                            class={styles.modal__preset}
                          >
                            <Show
                              when={editingPresetId() === preset.id}
                              fallback={
                                <div class={styles.modal__presetContent}>
                                  <div class={styles.modal__presetInfo}>
                                    <h4 class={styles.modal__presetName}>
                                      {preset.name}
                                      <Show when={!preset.isCustom}>
                                        <span class={styles.modal__badge}>Default</span>
                                      </Show>
                                    </h4>
                                    <Show when={preset.description}>
                                      <p class={styles.modal__presetDescription}>
                                        {preset.description}
                                      </p>
                                    </Show>
                                  </div>

                                  <div class={styles.modal__presetActions}>
                                    <Show when={preset.isCustom}>
                                      <button
                                        {...getTestId(`button-edit-preset-${preset.id}`)}
                                        {...getTestAction('edit-preset')}
                                        class={styles.modal__iconButton}
                                        onClick={() => handleEdit(preset)}
                                        title="Edit preset"
                                      >
                                        ✏️
                                      </button>
                                    </Show>

                                    <Show when={props.onDuplicatePreset}>
                                      <button
                                        {...getTestId(`button-duplicate-preset-${preset.id}`)}
                                        {...getTestAction('duplicate-preset')}
                                        class={styles.modal__iconButton}
                                        onClick={() => handleDuplicate(preset)}
                                        title="Duplicate preset"
                                      >
                                        📋
                                      </button>
                                    </Show>

                                    <Show when={preset.isCustom}>
                                      <button
                                        {...getTestId(`button-delete-preset-${preset.id}`)}
                                        {...getTestAction('delete-preset')}
                                        class={styles.modal__iconButton}
                                        classList={{ [styles['modal__iconButton--danger'] ?? '']: true }}
                                        onClick={() => setDeletingPresetId(preset.id)}
                                        title="Delete preset"
                                      >
                                        🗑️
                                      </button>
                                    </Show>
                                  </div>
                                </div>
                              }
                            >
                              <div class={styles.modal__editForm}>
                                <input
                                  type="text"
                                  class={styles.modal__input}
                                  value={editName()}
                                  onInput={(e) => setEditName(e.currentTarget.value)}
                                  placeholder="Preset name"
                                />
                                <textarea
                                  class={styles.modal__textarea}
                                  value={editDescription()}
                                  onInput={(e) => setEditDescription(e.currentTarget.value)}
                                  placeholder="Description (optional)"
                                  rows={2}
                                />
                                <div class={styles.modal__editActions}>
                                  <button
                                    {...getTestId('button-cancel-edit-preset')}
                                    {...getTestAction('cancel-edit')}
                                    class={styles.modal__button}
                                    classList={{ [styles['modal__button--secondary'] ?? '']: true }}
                                    onClick={handleCancelEdit}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    {...getTestId('button-save-edit-preset')}
                                    {...getTestAction('save-preset-edits')}
                                    class={styles.modal__button}
                                    classList={{ [styles['modal__button--primary'] ?? '']: true }}
                                    onClick={() => handleSaveEdit(componentType)}
                                    disabled={!editName().trim()}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </Show>

                            {/* Delete Confirmation */}
                            <Show when={deletingPresetId() === preset.id}>
                              <div class={styles.modal__confirmOverlay}>
                                <div
                                  {...getTestId(`confirm-delete-${preset.id}`)}
                                  class={styles.modal__confirm}
                                >
                                  <p>Delete "{preset.name}"?</p>
                                  <div class={styles.modal__confirmActions}>
                                    <button
                                      {...getTestId('button-cancel-delete-preset')}
                                      {...getTestAction('cancel-delete')}
                                      class={styles.modal__button}
                                      classList={{ [styles['modal__button--secondary'] ?? '']: true }}
                                      onClick={() => setDeletingPresetId(null)}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      {...getTestId('button-confirm-delete-preset')}
                                      {...getTestAction('confirm-delete-preset')}
                                      class={styles.modal__button}
                                      classList={{ [styles['modal__button--danger'] ?? '']: true }}
                                      onClick={() => handleDeleteConfirm(componentType, preset.id)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </Show>
                          </div>
                        )}
                      </For>
                    </div>
                  </div>
                )}
              </For>
            </Show>
          </div>

          <div class={styles.modal__footer}>
            <div class={styles.modal__footerActions}>
              <Show when={props.onImportPresets}>
                <label
                  {...getTestId('button-import-presets')}
                  {...getTestAction('import-presets')}
                  class={styles.modal__button}
                  classList={{ [styles['modal__button--secondary'] ?? '']: true }}
                >
                  Import
                  <input
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={handleImport}
                  />
                </label>
              </Show>

              <Show when={props.onExportPresets}>
                <button
                  {...getTestId('button-export-presets')}
                  {...getTestAction('export-presets')}
                  class={styles.modal__button}
                  classList={{ [styles['modal__button--secondary'] ?? '']: true }}
                  onClick={handleExport}
                >
                  Export
                </button>
              </Show>
            </div>

            <button
              {...getTestId('button-close-preset-manager-footer')}
              {...getTestAction('close-modal')}
              class={styles.modal__button}
              classList={{ [styles['modal__button--primary'] ?? '']: true }}
              onClick={props.onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Create Preset Modal */}
      <Show when={showCreateModal()}>
        <div
          {...getTestId('modal-create-preset')}
          class={styles.modal}
          style={{ "z-index": 1100 }}
        >
          <div class={styles.modal__overlay} onClick={() => setShowCreateModal(false)} />
          <div class={styles.modal__content} style={{ "max-width": "500px" }}>
            <div class={styles.modal__header}>
              <h2 class={styles.modal__title}>Create New Preset</h2>
              <button
                {...getTestId('button-close-create-preset-modal')}
                {...getTestAction('close-modal')}
                class={styles.modal__close}
                onClick={() => setShowCreateModal(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div class={styles.modal__body}>
              <div class={styles.modal__field}>
                <label class={styles.modal__label}>Component Type *</label>
                <select
                  {...getTestId('select-new-preset-component-type')}
                  class={styles.modal__select}
                  value={newPresetComponentType()}
                  onChange={(e) => setNewPresetComponentType(e.currentTarget.value)}
                >
                  <option value="">Select component type...</option>
                  <For each={props.componentTypes}>
                    {(type) => <option value={type}>{type}</option>}
                  </For>
                </select>
              </div>

              <div class={styles.modal__field}>
                <label class={styles.modal__label}>Preset Name *</label>
                <input
                  {...getTestId('input-new-preset-name')}
                  type="text"
                  class={styles.modal__input}
                  value={newPresetName()}
                  onInput={(e) => setNewPresetName(e.currentTarget.value)}
                  placeholder="e.g., Professional Blue"
                />
              </div>

              <div class={styles.modal__field}>
                <label class={styles.modal__label}>Description (Optional)</label>
                <textarea
                  {...getTestId('textarea-new-preset-description')}
                  class={styles.modal__textarea}
                  value={newPresetDescription()}
                  onInput={(e) => setNewPresetDescription(e.currentTarget.value)}
                  placeholder="Describe this preset..."
                  rows={3}
                />
              </div>
            </div>

            <div class={styles.modal__footer}>
              <button
                {...getTestId('button-cancel-create-preset')}
                {...getTestAction('cancel-create-preset')}
                class={styles.modal__button}
                classList={{ [styles['modal__button--secondary'] ?? '']: true }}
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                {...getTestId('button-create-preset-confirm')}
                {...getTestAction('create-preset')}
                class={styles.modal__button}
                classList={{ [styles['modal__button--primary'] ?? '']: true }}
                onClick={handleCreatePreset}
                disabled={!newPresetName().trim() || !newPresetComponentType()}
              >
                Create Preset
              </button>
            </div>
          </div>
        </div>
      </Show>
    </Show>
  );
};
