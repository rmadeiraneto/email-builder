/**
 * Spacing Tokens Section
 *
 * Displays all spacing tokens from the design system
 */

import { type Component, For, createMemo } from 'solid-js';
import styles from './SpacingTokens.module.scss';
import defaultSpacingData from '@email-builder/tokens/spacing/scale';

// interface SpacingToken {
//   name: string;
//   value: string;
//   description: string;
//   path: string[];
// }

interface SpacingTokensProps {
  spacingData?: any;
  onTokenClick?: (tokenPath: string[]) => void;
}

export const SpacingTokens: Component<SpacingTokensProps> = (props) => {
  const spacingData = () => props.spacingData || defaultSpacingData;

  // Parse spacing tokens
  const spacingTokens = createMemo(() => Object.entries(spacingData().spacing)
    .filter(([key]) => key !== '$type')
    .map(([name, token]) => ({
      name,
      value: token.$value,
      description: token.$description || '',
      path: ['spacing', name],
    })));

  return (
    <div class={styles.section}>
      <h2 class={styles.sectionTitle}>Spacing</h2>
      <p class={styles.sectionDescription}>
        Consistent spacing scale used throughout the design system for margins, padding, and gaps.
      </p>

      <div class={styles.spacingList}>
        <For each={spacingTokens()}>
          {(token) => (
            <div
              class={styles.spacingCard}
              classList={{ [styles.clickableCard]: !!props.onTokenClick }}
              onClick={() => props.onTokenClick?.(token.path)}
              title={props.onTokenClick ? 'Click to edit this token' : undefined}
            >
              <div class={styles.spacingInfo}>
                <div class={styles.spacingLabel}>
                  <span class={styles.spacingName}>{token.name}</span>
                  <span class={styles.spacingValue}>{token.value}</span>
                  {token.description && (
                    <span class={styles.spacingDescription}>({token.description})</span>
                  )}
                </div>
              </div>
              <div class={styles.spacingVisual}>
                <div
                  class={styles.spacingBox}
                  style={{
                    width: token.value,
                    height: token.value,
                  }}
                />
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
