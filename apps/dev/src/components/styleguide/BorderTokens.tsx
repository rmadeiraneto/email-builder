/**
 * Border Tokens Component
 * Displays border radius and width tokens
 */

import { For, Component } from 'solid-js';
import styles from './BorderTokens.module.scss';
import defaultBorderRadius from '@email-builder/tokens/border/radius';
import defaultBorderWidth from '@email-builder/tokens/border/width';

interface BorderTokensProps {
  borderRadius?: any;
  borderWidth?: any;
}

export const BorderTokens: Component<BorderTokensProps> = (props) => {
  const borderRadius = () => props.borderRadius || defaultBorderRadius;
  const borderWidth = () => props.borderWidth || defaultBorderWidth;

  const radiusTokens = Object.entries(borderRadius().border.radius).filter(
    ([key]) => !key.startsWith('$')
  );

  const widthTokens = Object.entries(borderWidth().border.width).filter(
    ([key]) => !key.startsWith('$')
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
          <For each={radiusTokens}>
            {([name, token]: [string, any]) => (
              <div class={styles.tokenCard}>
                <div class={styles.radiusPreview} style={{ 'border-radius': token.$value }}>
                  <div class={styles.radiusInner} />
                </div>
                <div class={styles.tokenInfo}>
                  <code class={styles.tokenName}>border-radius-{name}</code>
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

      {/* Border Width */}
      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>Border Width</h2>
        <p class={styles.sectionDescription}>
          Consistent border width values for strokes and outlines
        </p>
        <div class={styles.tokenGrid}>
          <For each={widthTokens}>
            {([name, token]: [string, any]) => (
              <div class={styles.tokenCard}>
                <div class={styles.widthPreview}>
                  <div class={styles.widthLine} style={{ 'border-top-width': token.$value }} />
                </div>
                <div class={styles.tokenInfo}>
                  <code class={styles.tokenName}>border-width-{name}</code>
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
