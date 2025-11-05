/**
 * Component Tokens Section
 *
 * Displays all component-level design tokens with visual examples
 */

import { type Component, For, createMemo } from 'solid-js';
import styles from './ComponentTokens.module.scss';
import defaultButtonTokens from '@email-builder/tokens/components/button';
import defaultModalTokens from '@email-builder/tokens/components/modal';
import defaultInputTokens from '@email-builder/tokens/components/input';
import defaultDropdownTokens from '@email-builder/tokens/components/dropdown';
import defaultCardTokens from '@email-builder/tokens/components/card';
import defaultTooltipTokens from '@email-builder/tokens/components/tooltip';
import defaultBadgeTokens from '@email-builder/tokens/components/badge';
import defaultDividerTokens from '@email-builder/tokens/components/divider';
import defaultPanelTokens from '@email-builder/tokens/components/panel';

interface ComponentToken {
  name: string;
  value: string;
  description: string;
  path: string[];
}

interface ComponentGroup {
  name: string;
  description: string;
  tokens: ComponentToken[];
}

interface ComponentTokensProps {
  buttonTokens?: any;
  modalTokens?: any;
  inputTokens?: any;
  dropdownTokens?: any;
  cardTokens?: any;
  tooltipTokens?: any;
  badgeTokens?: any;
  dividerTokens?: any;
  panelTokens?: any;
  onTokenClick?: (tokenPath: string[]) => void;
}

export const ComponentTokens: Component<ComponentTokensProps> = (props) => {
  const buttonTokens = () => props.buttonTokens || defaultButtonTokens;
  const modalTokens = () => props.modalTokens || defaultModalTokens;
  const inputTokens = () => props.inputTokens || defaultInputTokens;
  const dropdownTokens = () => props.dropdownTokens || defaultDropdownTokens;
  const cardTokens = () => props.cardTokens || defaultCardTokens;
  const tooltipTokens = () => props.tooltipTokens || defaultTooltipTokens;
  const badgeTokens = () => props.badgeTokens || defaultBadgeTokens;
  const dividerTokens = () => props.dividerTokens || defaultDividerTokens;
  const panelTokens = () => props.panelTokens || defaultPanelTokens;

  // Helper to flatten nested tokens
  const flattenTokens = (obj: any, basePath: string[] = [], result: ComponentToken[] = []): ComponentToken[] => {
    if (!obj || typeof obj !== 'object') return result;

    for (const [key, value] of Object.entries(obj)) {
      if (key === '$type' || key === '$description') continue;

      const currentPath = [...basePath, key];

      if (value && typeof value === 'object' && '$value' in value) {
        // This is a token
        let displayValue = value.$value;
        if (typeof displayValue === 'object') {
          displayValue = JSON.stringify(displayValue);
        } else if (typeof displayValue === 'string' && displayValue.startsWith('{') && displayValue.endsWith('}')) {
          // It's a reference
          displayValue = `→ ${displayValue.slice(1, -1)}`;
        }

        result.push({
          name: key,
          value: displayValue,
          description: value.$description || '',
          path: ['component', ...currentPath],
        });
      } else if (value && typeof value === 'object') {
        // Recurse
        flattenTokens(value, currentPath, result);
      }
    }

    return result;
  };

  const componentGroups = createMemo((): ComponentGroup[] => [
    {
      name: 'Button',
      description: 'Interactive button component tokens',
      tokens: flattenTokens(buttonTokens().component.button, ['button']),
    },
    {
      name: 'Modal',
      description: 'Modal dialog component tokens',
      tokens: flattenTokens(modalTokens().component.modal, ['modal']),
    },
    {
      name: 'Input',
      description: 'Form input component tokens',
      tokens: flattenTokens(inputTokens().component.input, ['input']),
    },
    {
      name: 'Dropdown',
      description: 'Dropdown menu component tokens',
      tokens: flattenTokens(dropdownTokens().component.dropdown, ['dropdown']),
    },
    {
      name: 'Card',
      description: 'Card container component tokens',
      tokens: flattenTokens(cardTokens().component.card, ['card']),
    },
    {
      name: 'Tooltip',
      description: 'Tooltip overlay component tokens',
      tokens: flattenTokens(tooltipTokens().component.tooltip, ['tooltip']),
    },
    {
      name: 'Badge',
      description: 'Badge label component tokens',
      tokens: flattenTokens(badgeTokens().component.badge, ['badge']),
    },
    {
      name: 'Divider',
      description: 'Divider separator component tokens',
      tokens: flattenTokens(dividerTokens().component.divider, ['divider']),
    },
    {
      name: 'Panel',
      description: 'Panel container component tokens',
      tokens: flattenTokens(panelTokens().component.panel, ['panel']),
    },
  ]);

  const handleTokenClick = (tokenPath: string[]) => {
    if (props.onTokenClick) {
      props.onTokenClick(tokenPath);
    }
  };

  return (
    <div class={styles.section}>
      <h2 class={styles.sectionTitle}>Component Tokens</h2>
      <p class={styles.sectionDescription}>
        Semantic tokens that define the visual properties of UI components. These tokens reference
        base design tokens for consistency and easy theming.
      </p>

      <div class={styles.componentGroups}>
        <For each={componentGroups()}>
          {(group) => (
            <div class={styles.componentGroup}>
              <div class={styles.groupHeader}>
                <h3 class={styles.groupTitle}>{group.name}</h3>
                <p class={styles.groupDescription}>{group.description}</p>
              </div>
              <div class={styles.tokenList}>
                <For each={group.tokens}>
                  {(token) => (
                    <div
                      class={styles.tokenItem}
                      onClick={() => handleTokenClick(token.path)}
                      title={token.description}
                    >
                      <div class={styles.tokenInfo}>
                        <div class={styles.tokenName}>{token.name}</div>
                        {token.description && (
                          <div class={styles.tokenDescription}>{token.description}</div>
                        )}
                      </div>
                      <div class={styles.tokenValue}>
                        <code>{token.value}</code>
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
