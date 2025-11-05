/**
 * Border Tokens Component
 * Displays border radius and width tokens
 */

import { For, type Component, createMemo } from 'solid-js';
import styles from './BorderTokens.module.scss';
import defaultBorderRadius from '@email-builder/tokens/border/radius';
import defaultBorderWidth from '@email-builder/tokens/border/width';

interface BorderTokensProps {
  borderRadius?: any;
  borderWidth?: any;
  onTokenClick?: (tokenPath: string[]) => void;
}

export const BorderTokens: Component<BorderTokensProps> = (props) => {
  const borderRadius = () => props.borderRadius || defaultBorderRadius;
  const borderWidth = () => props.borderWidth || defaultBorderWidth;

  const radiusTokens = createMemo(() => Object.entries(borderRadius().border.radius)
    .filter(([key]) => !key.startsWith('$'))
    .map(([name, token]) => ({
      name,
      token,
      path: ['border', 'radius', name],
    }))
  );

  const widthTokens = createMemo(() => Object.entries(borderWidth().border.width)
    .filter(([key]) => !key.startsWith('$'))
    .map(([name, token]) => ({
      name,
      token,
      path: ['border', 'width', name],
    }))
  );

  return (
    <div class={styles.borderTokens}>
      {/* Border Radius */}
      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>Border Radius</h2>
        <p class={styles.sectionDescription}>
          Consistent border radius values for rounded corners
        </p>
        <div class={styles.tokenGrid}>
          <For each={radiusTokens()}>
            {(item) => (
              <div
                class={styles.tokenCard}
                classList={{ [styles.clickableCard]: !!props.onTokenClick }}
                onClick={() => props.onTokenClick?.(item.path)}
                title={props.onTokenClick ? 'Click to edit this token' : undefined}
              >
                <div class={styles.radiusPreview} style={{ 'border-radius': item.token.$value }}>
                  <div class={styles.radiusInner} />
                </div>
                <div class={styles.tokenInfo}>
                  <code class={styles.tokenName}>border-radius-{item.name}</code>
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

      {/* Border Width */}
      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>Border Width</h2>
        <p class={styles.sectionDescription}>
          Consistent border width values for strokes and outlines
        </p>
        <div class={styles.tokenGrid}>
          <For each={widthTokens()}>
            {(item) => (
              <div
                class={styles.tokenCard}
                classList={{ [styles.clickableCard]: !!props.onTokenClick }}
                onClick={() => props.onTokenClick?.(item.path)}
                title={props.onTokenClick ? 'Click to edit this token' : undefined}
              >
                <div class={styles.widthPreview}>
                  <div class={styles.widthLine} style={{ 'border-top-width': item.token.$value }} />
                </div>
                <div class={styles.tokenInfo}>
                  <code class={styles.tokenName}>border-width-{item.name}</code>
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
