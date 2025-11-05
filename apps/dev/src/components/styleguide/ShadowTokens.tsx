/**
 * Shadow Tokens Component
 * Displays shadow elevation tokens
 */

import { For, Component, createMemo } from 'solid-js';
import styles from './ShadowTokens.module.scss';
import defaultElevation from '@email-builder/tokens/shadow/elevation';

interface ShadowTokensProps {
  elevation?: any;
}

export const ShadowTokens: Component<ShadowTokensProps> = (props) => {
  const elevation = () => props.elevation || defaultElevation;

  const shadowTokens = createMemo(() => Object.entries(elevation().shadow).filter(
    ([key]) => !key.startsWith('$')
  ));

  return (
    <div class={styles.shadowTokens}>
      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>Elevation Shadows</h2>
        <p class={styles.sectionDescription}>
          Layered shadow system for creating depth and hierarchy
        </p>
        <div class={styles.tokenGrid}>
          <For each={shadowTokens()}>
            {([name, token]: [string, any]) => (
              <div class={styles.tokenCard}>
                <div class={styles.shadowPreview}>
                  <div class={styles.shadowBox} style={{ 'box-shadow': token.$value }} />
                </div>
                <div class={styles.tokenInfo}>
                  <code class={styles.tokenName}>shadow-elevation-{name}</code>
                  <span class={styles.tokenValue}>{token.$value}</span>
                  {token.$description && (
                    <span class={styles.tokenDescription}>{token.$description}</span>
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
