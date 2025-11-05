/**
 * Generic token editor component
 * Provides a UI for editing token values based on their type
 */

import { createSignal, For, Show } from 'solid-js';
import styles from './TokenEditor.module.scss';

export interface TokenEditorProps {
  category: string;
  tokens: any;
  onTokenChange: (path: string[], value: any) => void;
}

export function TokenEditor(props: TokenEditorProps) {
  return (
    <div class={styles.tokenEditor}>
      <h3 class={styles.categoryTitle}>{props.category}</h3>
      <div class={styles.tokenList}>
        <TokenGroup
          data={props.tokens}
          path={[]}
          onTokenChange={props.onTokenChange}
        />
      </div>
    </div>
  );
}

interface TokenGroupProps {
  data: any;
  path: string[];
  onTokenChange: (path: string[], value: any) => void;
}

function TokenGroup(props: TokenGroupProps) {
  const [isExpanded, setIsExpanded] = createSignal(true);

  const entries = () => {
    if (!props.data || typeof props.data !== 'object') {
      return [];
    }
    return Object.entries(props.data).filter(([key]) => key !== '$type' && key !== '$description');
  };

  const isTokenValue = () => {
    return props.data && typeof props.data === 'object' && '$value' in props.data;
  };

  const tokenType = () => {
    // Determine type from parent's $type or infer from value
    if (props.data.$type) {
      return props.data.$type;
    }

    const value = props.data.$value;
    if (typeof value === 'string') {
      if (value.startsWith('#') || value.startsWith('rgb')) {
        return 'color';
      }
      if (value.match(/^\d+(\.\d+)?(px|rem|em|%)$/)) {
        return 'dimension';
      }
    }
    if (Array.isArray(value)) {
      return 'fontFamily';
    }

    return 'string';
  };

  return (
    <Show
      when={isTokenValue()}
      fallback={
        <div class={styles.tokenGroup}>
          <Show when={props.path.length > 0}>
            <button
              class={styles.groupHeader}
              onClick={() => setIsExpanded(!isExpanded())}
            >
              <span class={styles.expandIcon}>{isExpanded() ? '▼' : '▶'}</span>
              <span class={styles.groupName}>{props.path[props.path.length - 1]}</span>
            </button>
          </Show>
          <Show when={isExpanded()}>
            <div class={styles.groupContent}>
              <For each={entries()}>
                {([key, value]) => (
                  <TokenGroup
                    data={value}
                    path={[...props.path, key]}
                    onTokenChange={props.onTokenChange}
                  />
                )}
              </For>
            </div>
          </Show>
        </div>
      }
    >
      <TokenValueEditor
        path={props.path}
        value={props.data.$value}
        description={props.data.$description}
        type={tokenType()}
        onTokenChange={props.onTokenChange}
      />
    </Show>
  );
}

interface TokenValueEditorProps {
  path: string[];
  value: any;
  description?: string;
  type: string;
  onTokenChange: (path: string[], value: any) => void;
}

function TokenValueEditor(props: TokenValueEditorProps) {
  const tokenName = () => props.path.join('-');

  const handleChange = (newValue: any) => {
    props.onTokenChange(props.path, newValue);
  };

  return (
    <div class={styles.tokenValue}>
      <div class={styles.tokenInfo}>
        <label class={styles.tokenLabel} for={tokenName()}>
          {props.path[props.path.length - 1]}
        </label>
        <Show when={props.description}>
          <span class={styles.tokenDescription}>{props.description}</span>
        </Show>
      </div>
      <div class={styles.tokenInput}>
        <Show
          when={props.type === 'color'}
          fallback={
            <Show
              when={props.type === 'fontFamily'}
              fallback={
                <input
                  type="text"
                  id={tokenName()}
                  value={props.value}
                  onInput={(e) => handleChange(e.currentTarget.value)}
                  class={styles.textInput}
                />
              }
            >
              <input
                type="text"
                id={tokenName()}
                value={Array.isArray(props.value) ? props.value.join(', ') : props.value}
                onInput={(e) => {
                  const value = e.currentTarget.value;
                  const array = value.split(',').map(s => s.trim());
                  handleChange(array);
                }}
                class={styles.textInput}
                placeholder="Font families separated by commas"
              />
            </Show>
          }
        >
          <div class={styles.colorInput}>
            <input
              type="color"
              id={tokenName()}
              value={props.value}
              onInput={(e) => handleChange(e.currentTarget.value)}
              class={styles.colorPicker}
            />
            <input
              type="text"
              value={props.value}
              onInput={(e) => handleChange(e.currentTarget.value)}
              class={styles.colorText}
              placeholder="#000000"
            />
          </div>
        </Show>
      </div>
    </div>
  );
}
