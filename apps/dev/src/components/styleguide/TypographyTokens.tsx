/**
 * Typography Tokens Section
 *
 * Displays all typography tokens from the design system
 */

import { type Component, For } from 'solid-js';
import styles from './TypographyTokens.module.scss';
import fonts from '../../../../../packages/tokens/src/typography/fonts.json';
import sizes from '../../../../../packages/tokens/src/typography/sizes.json';
import weights from '../../../../../packages/tokens/src/typography/weights.json';
import lineHeights from '../../../../../packages/tokens/src/typography/line-heights.json';

interface TypographyToken {
  name: string;
  value: string;
  description: string;
}

export const TypographyTokens: Component = () => {
  // Parse font families
  const fontFamilies: TypographyToken[] = Object.entries(fonts.typography['font-family'])
    .filter(([key]) => key !== '$type')
    .map(([name, token]: [string, any]) => ({
      name,
      value: Array.isArray(token.$value) ? token.$value.join(', ') : token.$value,
      description: token.$description || '',
    }));

  // Parse font sizes
  const fontSizes: TypographyToken[] = Object.entries(sizes.typography['font-size'])
    .filter(([key]) => key !== '$type')
    .map(([name, token]: [string, any]) => ({
      name,
      value: token.$value,
      description: token.$description || '',
    }));

  // Parse font weights
  const fontWeights: TypographyToken[] = Object.entries(weights.typography['font-weight'])
    .filter(([key]) => key !== '$type')
    .map(([name, token]: [string, any]) => ({
      name,
      value: String(token.$value),
      description: token.$description || '',
    }));

  // Parse line heights
  const lineHeightsList: TypographyToken[] = Object.entries(lineHeights.typography['line-height'])
    .filter(([key]) => key !== '$type')
    .map(([name, token]: [string, any]) => ({
      name,
      value: String(token.$value),
      description: token.$description || '',
    }));

  return (
    <div class={styles.section}>
      <h2 class={styles.sectionTitle}>Typography</h2>
      <p class={styles.sectionDescription}>
        Typography tokens including font families, sizes, weights, and line heights.
      </p>

      {/* Font Families */}
      <div class={styles.subsection}>
        <h3 class={styles.subsectionTitle}>Font Families</h3>
        <div class={styles.tokenList}>
          <For each={fontFamilies}>
            {(token) => (
              <div class={styles.tokenCard}>
                <div class={styles.tokenLabel}>
                  <span class={styles.tokenName}>{token.name}</span>
                  <span class={styles.tokenValue}>{token.value}</span>
                </div>
                <div class={styles.fontPreview} style={{ 'font-family': token.value }}>
                  The quick brown fox jumps over the lazy dog
                </div>
                {token.description && (
                  <div class={styles.tokenDescription}>{token.description}</div>
                )}
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Font Sizes */}
      <div class={styles.subsection}>
        <h3 class={styles.subsectionTitle}>Font Sizes</h3>
        <div class={styles.tokenList}>
          <For each={fontSizes}>
            {(token) => (
              <div class={styles.tokenCard}>
                <div class={styles.tokenLabel}>
                  <span class={styles.tokenName}>{token.name}</span>
                  <span class={styles.tokenValue}>{token.value}</span>
                </div>
                <div class={styles.sizePreview} style={{ 'font-size': token.value }}>
                  The quick brown fox
                </div>
                {token.description && (
                  <div class={styles.tokenDescription}>{token.description}</div>
                )}
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Font Weights */}
      <div class={styles.subsection}>
        <h3 class={styles.subsectionTitle}>Font Weights</h3>
        <div class={styles.tokenList}>
          <For each={fontWeights}>
            {(token) => (
              <div class={styles.tokenCard}>
                <div class={styles.tokenLabel}>
                  <span class={styles.tokenName}>{token.name}</span>
                  <span class={styles.tokenValue}>{token.value}</span>
                </div>
                <div class={styles.weightPreview} style={{ 'font-weight': token.value }}>
                  The quick brown fox jumps over the lazy dog
                </div>
                {token.description && (
                  <div class={styles.tokenDescription}>{token.description}</div>
                )}
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Line Heights */}
      <div class={styles.subsection}>
        <h3 class={styles.subsectionTitle}>Line Heights</h3>
        <div class={styles.tokenList}>
          <For each={lineHeightsList}>
            {(token) => (
              <div class={styles.tokenCard}>
                <div class={styles.tokenLabel}>
                  <span class={styles.tokenName}>{token.name}</span>
                  <span class={styles.tokenValue}>{token.value}</span>
                </div>
                <div class={styles.lineHeightPreview} style={{ 'line-height': token.value }}>
                  The quick brown fox jumps over the lazy dog.
                  <br />
                  The quick brown fox jumps over the lazy dog.
                </div>
                {token.description && (
                  <div class={styles.tokenDescription}>{token.description}</div>
                )}
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};
