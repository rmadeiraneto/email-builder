/**
 * Color Tokens Section
 *
 * Displays all color tokens from the design system
 */

import { type Component, For } from 'solid-js';
import styles from './ColorTokens.module.scss';
import brandColors from '../../../../../packages/tokens/src/colors/brand.json';
import semanticColors from '../../../../../packages/tokens/src/colors/semantic.json';
import uiColors from '../../../../../packages/tokens/src/colors/ui.json';

interface ColorToken {
  name: string;
  value: string;
  description: string;
}

interface ColorScale {
  name: string;
  colors: ColorToken[];
}

export const ColorTokens: Component = () => {
  // Parse brand colors (primary, secondary, accent with 50-900 shades)
  const brandScales: ColorScale[] = Object.entries(brandColors.color.brand)
    .filter(([key]) => key !== '$type')
    .map(([scaleName, scale]) => {
      const colors: ColorToken[] = Object.entries(scale as Record<string, any>)
        .map(([shade, token]) => ({
          name: `${scaleName}-${shade}`,
          value: token.$value,
          description: token.$description || '',
        }));
      return {
        name: scaleName.charAt(0).toUpperCase() + scaleName.slice(1),
        colors,
      };
    });

  // Parse semantic colors (success, error, warning, info with light/base/dark)
  const semanticScales: ColorScale[] = Object.entries(semanticColors.color.semantic)
    .filter(([key]) => key !== '$type')
    .map(([scaleName, scale]) => {
      const colors: ColorToken[] = Object.entries(scale as Record<string, any>)
        .map(([shade, token]) => ({
          name: `${scaleName}-${shade}`,
          value: token.$value,
          description: token.$description || '',
        }));
      return {
        name: scaleName.charAt(0).toUpperCase() + scaleName.slice(1),
        colors,
      };
    });

  // Parse UI colors (background, surface, border, text, icon, interactive)
  const uiScales: ColorScale[] = [
    ...Object.entries(uiColors.color.ui)
      .filter(([key]) => key !== '$type')
      .map(([category, tokens]) => {
        const colors: ColorToken[] = Object.entries(tokens as Record<string, any>)
          .map(([name, token]) => ({
            name: `${category}-${name}`,
            value: token.$value,
            description: token.$description || '',
          }));
        return {
          name: category.charAt(0).toUpperCase() + category.slice(1),
          colors,
        };
      }),
    // Add neutral colors
    {
      name: 'Neutral',
      colors: Object.entries(uiColors.color.neutral)
        .filter(([key]) => key !== '$type')
        .map(([shade, token]) => ({
          name: `neutral-${shade}`,
          value: (token as any).$value,
          description: (token as any).$description || '',
        })),
    },
  ];

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div class={styles.section}>
      <h2 class={styles.sectionTitle}>Colors</h2>
      <p class={styles.sectionDescription}>
        Our color palette includes brand colors, semantic colors for UI states, and general UI colors.
      </p>

      {/* Brand Colors */}
      <div class={styles.subsection}>
        <h3 class={styles.subsectionTitle}>Brand Colors</h3>
        <For each={brandScales}>
          {(scale) => (
            <div class={styles.colorScale}>
              <h4 class={styles.scaleTitle}>{scale.name}</h4>
              <div class={styles.colorGrid}>
                <For each={scale.colors}>
                  {(color) => (
                    <div
                      class={styles.colorCard}
                      onClick={() => copyToClipboard(color.value)}
                      title="Click to copy"
                    >
                      <div
                        class={styles.colorSwatch}
                        style={{ 'background-color': color.value }}
                      />
                      <div class={styles.colorInfo}>
                        <div class={styles.colorName}>{color.name}</div>
                        <div class={styles.colorValue}>{color.value}</div>
                        {color.description && (
                          <div class={styles.colorDescription}>{color.description}</div>
                        )}
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Semantic Colors */}
      <div class={styles.subsection}>
        <h3 class={styles.subsectionTitle}>Semantic Colors</h3>
        <p class={styles.subsectionDescription}>
          Colors that convey meaning and UI states
        </p>
        <For each={semanticScales}>
          {(scale) => (
            <div class={styles.colorScale}>
              <h4 class={styles.scaleTitle}>{scale.name}</h4>
              <div class={styles.colorGrid}>
                <For each={scale.colors}>
                  {(color) => (
                    <div
                      class={styles.colorCard}
                      onClick={() => copyToClipboard(color.value)}
                      title="Click to copy"
                    >
                      <div
                        class={styles.colorSwatch}
                        style={{ 'background-color': color.value }}
                      />
                      <div class={styles.colorInfo}>
                        <div class={styles.colorName}>{color.name}</div>
                        <div class={styles.colorValue}>{color.value}</div>
                        {color.description && (
                          <div class={styles.colorDescription}>{color.description}</div>
                        )}
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>

      {/* UI Colors */}
      <div class={styles.subsection}>
        <h3 class={styles.subsectionTitle}>UI Colors</h3>
        <p class={styles.subsectionDescription}>
          General interface colors for backgrounds, borders, text, and icons
        </p>
        <For each={uiScales}>
          {(scale) => (
            <div class={styles.colorScale}>
              <h4 class={styles.scaleTitle}>{scale.name}</h4>
              <div class={styles.colorGrid}>
                <For each={scale.colors}>
                  {(color) => (
                    <div
                      class={styles.colorCard}
                      onClick={() => copyToClipboard(color.value)}
                      title="Click to copy"
                    >
                      <div
                        class={styles.colorSwatch}
                        style={{ 'background-color': color.value }}
                      />
                      <div class={styles.colorInfo}>
                        <div class={styles.colorName}>{color.name}</div>
                        <div class={styles.colorValue}>{color.value}</div>
                        {color.description && (
                          <div class={styles.colorDescription}>{color.description}</div>
                        )}
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
