/**
 * Typography Tokens Section
 *
 * Displays all typography tokens from the design system
 */

import { type Component, For, createMemo } from 'solid-js';
import styles from './TypographyTokens.module.scss';
import defaultFonts from '@email-builder/tokens/typography/fonts';
import defaultSizes from '@email-builder/tokens/typography/sizes';
import defaultWeights from '@email-builder/tokens/typography/weights';
import defaultLineHeights from '@email-builder/tokens/typography/line-heights';

interface TypographyToken {
  name: string;
  value: string;
  description: string;
}

interface TypographyTokensProps {
  fonts?: any;
  sizes?: any;
  weights?: any;
  lineHeights?: any;
  onSectionClick?: () => void;
}

export const TypographyTokens: Component<TypographyTokensProps> = (props) => {
  const fonts = () => props.fonts || defaultFonts;
  const sizes = () => props.sizes || defaultSizes;
  const weights = () => props.weights || defaultWeights;
  const lineHeights = () => props.lineHeights || defaultLineHeights;

  // Parse font families
  const fontFamilies = createMemo(() => Object.entries(fonts().typography['font-family'])
    .filter(([key]) => key !== '$type')
    .map(([name, token]: [string, any]) => ({
      name,
      value: Array.isArray(token.$value) ? token.$value.join(', ') : token.$value,
      description: token.$description || '',
    })));

  // Parse font sizes
  const fontSizes = createMemo(() => Object.entries(sizes().typography['font-size'])
    .filter(([key]) => key !== '$type')
    .map(([name, token]: [string, any]) => ({
      name,
      value: token.$value,
      description: token.$description || '',
    })));

  // Parse font weights
  const fontWeights = createMemo(() => Object.entries(weights().typography['font-weight'])
    .filter(([key]) => key !== '$type')
    .map(([name, token]: [string, any]) => ({
      name,
      value: String(token.$value),
      description: token.$description || '',
    })));

  // Parse line heights
  const lineHeightsList = createMemo(() => Object.entries(lineHeights().typography['line-height'])
    .filter(([key]) => key !== '$type')
    .map(([name, token]: [string, any]) => ({
      name,
      value: String(token.$value),
      description: token.$description || '',
    })));

  return (
    <div
      class={styles.section}
      classList={{ [styles.clickableSection]: !!props.onSectionClick }}
      onClick={props.onSectionClick}
      title={props.onSectionClick ? 'Click to edit typography tokens' : undefined}
    >
      <h2 class={styles.sectionTitle}>Typography</h2>
      <p class={styles.sectionDescription}>
        Typography tokens including font families, sizes, weights, and line heights.
      </p>

      {/* Font Families */}
      <div class={styles.subsection}>
        <h3 class={styles.subsectionTitle}>Font Families</h3>
        <div class={styles.tokenList}>
          <For each={fontFamilies()}>
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
          <For each={fontSizes()}>
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
          <For each={fontWeights()}>
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
          <For each={lineHeightsList()}>
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
