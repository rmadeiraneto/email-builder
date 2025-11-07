/**
 * Variable Picker Component
 *
 * Provides a UI for browsing and inserting template variables into text fields.
 */

import { type Component, createSignal, For, Show } from 'solid-js';
import type { VariableMetadata, DataSchema } from '@email-builder/core';
import styles from './VariablePicker.module.scss';

export interface VariablePickerProps {
  /**
   * Available variables schema
   */
  schema?: DataSchema;

  /**
   * Callback when a variable is selected
   */
  onSelect: (variable: string) => void;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Show search/filter box
   */
  showSearch?: boolean;
}

export const VariablePicker: Component<VariablePickerProps> = (props) => {
  const [searchTerm, setSearchTerm] = createSignal('');
  const [expandedPaths, setExpandedPaths] = createSignal<Set<string>>(new Set());

  const toggleExpanded = (path: string) => {
    const current = expandedPaths();
    const newSet = new Set(current);

    if (newSet.has(path)) {
      newSet.delete(path);
    } else {
      newSet.add(path);
    }

    setExpandedPaths(newSet);
  };

  const isExpanded = (path: string): boolean => {
    return expandedPaths().has(path);
  };

  const handleSelect = (path: string) => {
    props.onSelect(`{{${path}}}`);
  };

  const filterVariables = (variables: VariableMetadata[]): VariableMetadata[] => {
    const term = searchTerm().toLowerCase();

    if (!term) return variables;

    return variables.filter(
      (v) =>
        v.path.toLowerCase().includes(term) ||
        v.description?.toLowerCase().includes(term) ||
        v.type.toLowerCase().includes(term)
    );
  };

  const renderVariable = (variable: VariableMetadata, level = 0) => {
    const hasChildren = variable.children && variable.children.length > 0;
    const expanded = isExpanded(variable.path);

    return (
      <div class={styles.variable} style={{ 'padding-left': `${level * 16}px` }}>
        <div class={styles.variableHeader}>
          <Show when={hasChildren}>
            <button
              class={styles.expandButton}
              onClick={() => toggleExpanded(variable.path)}
              aria-label={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? '▼' : '▶'}
            </button>
          </Show>

          <button
            class={styles.variableName}
            onClick={() => handleSelect(variable.path)}
            title={variable.description || variable.path}
          >
            <span class={styles.name}>{variable.path.split('.').pop()}</span>
            <span class={styles.type}>{variable.isArray ? `${variable.type}[]` : variable.type}</span>
            <Show when={variable.required}>
              <span class={styles.required}>*</span>
            </Show>
          </button>
        </div>

        <Show when={variable.description}>
          <div class={styles.description} style={{ 'padding-left': `${hasChildren ? 24 : 0}px` }}>
            {variable.description}
          </div>
        </Show>

        <Show when={hasChildren && expanded}>
          <div class={styles.children}>
            <For each={variable.children}>{(child) => renderVariable(child, level + 1)}</For>
          </div>
        </Show>
      </div>
    );
  };

  const variables = () => props.schema?.variables || [];
  const filteredVariables = () => filterVariables(variables());

  return (
    <div class={styles.container}>
      <Show when={props.showSearch !== false}>
        <div class={styles.search}>
          <input
            type="text"
            class={styles.searchInput}
            placeholder={props.placeholder || 'Search variables...'}
            value={searchTerm()}
            onInput={(e) => setSearchTerm(e.currentTarget.value)}
          />
        </div>
      </Show>

      <div class={styles.variables}>
        <Show
          when={filteredVariables().length > 0}
          fallback={
            <div class={styles.empty}>
              {searchTerm() ? 'No variables found' : 'No variables available'}
            </div>
          }
        >
          <For each={filteredVariables()}>{(variable) => renderVariable(variable)}</For>
        </Show>
      </div>

      <div class={styles.help}>
        <p>
          <strong>Click a variable</strong> to insert it.
        </p>
        <p class={styles.hint}>Use the syntax <code>{'{{variable}}'}</code> in text fields.</p>
      </div>
    </div>
  );
};
