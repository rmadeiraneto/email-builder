/**
 * Preset Manager Modal
 *
 * Full CRUD interface for managing presets
 */

import { type Component, createSignal, createMemo, For, Show } from 'solid-js';
import type { ComponentPreset } from '@email-builder/core';
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
      <div class={styles.modal}>
        <div class={styles.modal__overlay} onClick={props.onClose} />
        <div class={styles.modal__content}>
          <div class={styles.modal__header}>
            <h2 class={styles.modal__title}>Preset Manager</h2>
            <button
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
                type="text"
                class={styles.modal__search}
                placeholder="Search presets..."
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
              />
            </div>

            <div class={styles.modal__actions}>
              <button
                class={styles.modal__button}
                classList={{ [styles['modal__button--primary']]: true }}
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

                    <div class={styles.modal__presetList}>
                      <For each={presets}>
                        {(preset) => (
                          <div class={styles.modal__preset}>
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
                                        class={styles.modal__iconButton}
                                        onClick={() => handleEdit(preset)}
                                        title="Edit preset"
                                      >
                                        ✏️
                                      </button>
                                    </Show>

                                    <Show when={props.onDuplicatePreset}>
                                      <button
                                        class={styles.modal__iconButton}
                                        onClick={() => handleDuplicate(preset)}
                                        title="Duplicate preset"
                                      >
                                        📋
                                      </button>
                                    </Show>

                                    <Show when={preset.isCustom}>
                                      <button
                                        class={styles.modal__iconButton}
                                        classList={{ [styles['modal__iconButton--danger']]: true }}
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
                                    class={styles.modal__button}
                                    classList={{ [styles['modal__button--secondary']]: true }}
                                    onClick={handleCancelEdit}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    class={styles.modal__button}
                                    classList={{ [styles['modal__button--primary']]: true }}
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
                                <div class={styles.modal__confirm}>
                                  <p>Delete "{preset.name}"?</p>
                                  <div class={styles.modal__confirmActions}>
                                    <button
                                      class={styles.modal__button}
                                      classList={{ [styles['modal__button--secondary']]: true }}
                                      onClick={() => setDeletingPresetId(null)}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      class={styles.modal__button}
                                      classList={{ [styles['modal__button--danger']]: true }}
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
                <label class={styles.modal__button} classList={{ [styles['modal__button--secondary']]: true }}>
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
                  class={styles.modal__button}
                  classList={{ [styles['modal__button--secondary']]: true }}
                  onClick={handleExport}
                >
                  Export
                </button>
              </Show>
            </div>

            <button
              class={styles.modal__button}
              classList={{ [styles['modal__button--primary']]: true }}
              onClick={props.onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Create Preset Modal */}
      <Show when={showCreateModal()}>
        <div class={styles.modal} style={{ "z-index": "1100" }}>
          <div class={styles.modal__overlay} onClick={() => setShowCreateModal(false)} />
          <div class={styles.modal__content} style={{ "max-width": "500px" }}>
            <div class={styles.modal__header}>
              <h2 class={styles.modal__title}>Create New Preset</h2>
              <button
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
                class={styles.modal__button}
                classList={{ [styles['modal__button--secondary']]: true }}
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                class={styles.modal__button}
                classList={{ [styles['modal__button--primary']]: true }}
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
