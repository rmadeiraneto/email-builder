/**
 * Component Property Editor
 *
 * Interactive editor for component properties with token selection
 */

import { type Component, For, Show, createMemo } from 'solid-js';
import styles from './ComponentPropertyEditor.module.scss';
import {
  type ComponentPropertyMap,
  type PropertyMapping,
  getAvailableTokensForType,
} from '../../utils/componentPropertyMappings';

interface ComponentPropertyEditorProps {
  component: ComponentPropertyMap | null;
  allTokens: any;
  currentValues: any;
  onPropertyChange: (tokenPath: string[], value: string) => void;
}

export const ComponentPropertyEditor: Component<ComponentPropertyEditorProps> = (props) => {
  const getCurrentValue = (tokenPath: string[]) => {
    let current = props.currentValues;
    for (const key of tokenPath) {
      if (!current || typeof current !== 'object') return undefined;
      current = current[key];
    }
    if (current && typeof current === 'object' && '$value' in current) {
      return current.$value;
    }
    return undefined;
  };

  return (
    <Show
      when={props.component}
      fallback={
        <div class={styles.emptyState}>
          <div class={styles.emptyIcon}>🎨</div>
          <h3 class={styles.emptyTitle}>Select a Component</h3>
          <p class={styles.emptyDescription}>
            Click on a component in the preview to edit its properties
          </p>
        </div>
      }
    >
      <div class={styles.propertyEditor}>
        <div class={styles.header}>
          <h3 class={styles.componentName}>{props.component!.name}</h3>
          <p class={styles.componentDescription}>{props.component!.description}</p>
        </div>

        <div class={styles.propertyList}>
          <For each={props.component!.properties}>
            {(property) => (
              <PropertyField
                property={property}
                currentValue={getCurrentValue(property.tokenPath)}
                allTokens={props.allTokens}
                onPropertyChange={props.onPropertyChange}
              />
            )}
          </For>
        </div>
      </div>
    </Show>
  );
};

interface PropertyFieldProps {
  property: PropertyMapping;
  currentValue: any;
  allTokens: any;
  onPropertyChange: (tokenPath: string[], value: string) => void;
}

const PropertyField: Component<PropertyFieldProps> = (props) => {
  const availableTokens = createMemo(() => {
    return getAvailableTokensForType(props.property.tokenType, props.allTokens);
  });

  const displayValue = () => {
    const val = props.currentValue;
    if (typeof val === 'string') {
      // Check if it's a token reference
      if (val.startsWith('{') && val.endsWith('}')) {
        return `→ ${val.slice(1, -1)}`;
      }
      return val;
    }
    if (typeof val === 'object') {
      return JSON.stringify(val);
    }
    return String(val);
  };

  const handleChange = (e: Event) => {
    const target = e.currentTarget as HTMLSelectElement;
    const selectedOption = availableTokens().find((t) => t.path.join('.') === target.value);
    if (selectedOption) {
      props.onPropertyChange(props.property.tokenPath, selectedOption.value);
    }
  };

  const currentTokenPath = () => {
    // Try to find which token is currently selected
    const val = props.currentValue;
    if (typeof val === 'string' && val.startsWith('{') && val.endsWith('}')) {
      return val.slice(1, -1).split('.');
    }
    // Try to match by value
    const matching = availableTokens().find((t) => t.value === val);
    return matching?.path.join('.') || '';
  };

  return (
    <div class={styles.propertyField}>
      <div class={styles.fieldHeader}>
        <label class={styles.fieldLabel}>{props.property.label}</label>
        <Show when={props.property.description}>
          <p class={styles.fieldDescription}>{props.property.description}</p>
        </Show>
      </div>

      <div class={styles.fieldControl}>
        <Show
          when={props.property.tokenType === 'color'}
          fallback={
            <div class={styles.selectWrapper}>
              <select
                class={styles.select}
                value={currentTokenPath()}
                onChange={handleChange}
              >
                <option value="">Custom value</option>
                <For each={availableTokens()}>
                  {(token) => (
                    <option value={token.path.join('.')}>
                      {token.label} ({token.value})
                    </option>
                  )}
                </For>
              </select>
            </div>
          }
        >
          <div class={styles.colorControl}>
            <div
              class={styles.colorSwatch}
              style={{ 'background-color': props.currentValue }}
              title={displayValue()}
            />
            <select
              class={styles.select}
              value={currentTokenPath()}
              onChange={handleChange}
            >
              <option value="">Custom value</option>
              <For each={availableTokens()}>
                {(token) => (
                  <option value={token.path.join('.')}>
                    {token.label}
                  </option>
                )}
              </For>
            </select>
          </div>
        </Show>

        <div class={styles.currentValue}>
          <code>{displayValue()}</code>
        </div>
      </div>
    </div>
  );
};
