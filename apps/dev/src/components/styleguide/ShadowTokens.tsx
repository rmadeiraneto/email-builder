/**
 * Shadow Tokens Component
 * Displays shadow elevation tokens
 */

import { For, type Component, createMemo } from 'solid-js';
import styles from './ShadowTokens.module.scss';
import defaultElevation from '@email-builder/tokens/shadow/elevation';

interface ShadowTokensProps {
  elevation?: any;
  onTokenClick?: (tokenPath: string[]) => void;
}

export const ShadowTokens: Component<ShadowTokensProps> = (props) => {
  const elevation = () => props.elevation || defaultElevation;

  const shadowTokens = createMemo(() => Object.entries(elevation().shadow)
    .filter(([key]) => !key.startsWith('$'))
    .map(([name, token]) => ({
      name,
      token,
      path: ['shadow', name],
    }))
  );

  return (
    <div class={styles.shadowTokens}>
      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>Elevation Shadows</h2>
        <p class={styles.sectionDescription}>
          Layered shadow system for creating depth and hierarchy
        </p>
        <div class={styles.tokenGrid}>
          <For each={shadowTokens()}>
            {(item) => (
              <div
                class={styles.tokenCard}
                classList={{ [styles.clickableCard]: !!props.onTokenClick }}
                onClick={() => props.onTokenClick?.(item.path)}
                title={props.onTokenClick ? 'Click to edit this token' : undefined}
              >
                <div class={styles.shadowPreview}>
                  <div class={styles.shadowBox} style={{ 'box-shadow': item.token.$value }} />
                </div>
                <div class={styles.tokenInfo}>
                  <code class={styles.tokenName}>shadow-elevation-{item.name}</code>
                  <span class={styles.tokenValue}>{item.token.$value}</span>
                  {item.token.$description && (
                    <span class={styles.tokenDescription}>{item.token.$description}</span>
                  )}
                </div>
              </div>
            )}
          </For>
        </div>
      </section>
    </div>
  );
}
