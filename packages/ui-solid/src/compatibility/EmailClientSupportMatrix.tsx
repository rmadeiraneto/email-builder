/**
 * Email Client Support Matrix Component
 *
 * Displays comprehensive information about email client support,
 * organized by tier (1/2/3) with feature support matrix.
 *
 * @module compatibility
 */

import { Component, For, createSignal, Show } from 'solid-js';
import { CompatibilityService } from '@email-builder/core/compatibility';
import type { EmailClient } from '@email-builder/core/compatibility';
import { SupportLevel } from '@email-builder/core/compatibility';
import styles from './EmailClientSupportMatrix.module.scss';

/**
 * Email client information with tier and testing availability
 */
export interface EmailClientInfo {
  id: EmailClient;
  name: string;
  tier: 1 | 2 | 3;
  platform: 'desktop' | 'webmail' | 'mobile';
  marketShare?: string;
  description: string;
  testable: boolean;
}

/**
 * Email client database with tier classification
 */
const EMAIL_CLIENTS: EmailClientInfo[] = [
  // Tier 1: Must Support - Highest priority, largest market share
  {
    id: 'outlook-2016-win',
    name: 'Outlook 2016',
    tier: 1,
    platform: 'desktop',
    marketShare: '~15%',
    description: 'Legacy Windows Outlook with Word rendering engine',
    testable: true,
  },
  {
    id: 'outlook-2019-win',
    name: 'Outlook 2019',
    tier: 1,
    platform: 'desktop',
    marketShare: '~12%',
    description: 'Modern Windows Outlook, still uses Word engine',
    testable: true,
  },
  {
    id: 'outlook-365-win',
    name: 'Outlook 365',
    tier: 1,
    platform: 'desktop',
    marketShare: '~18%',
    description: 'Latest Windows Outlook with best CSS support',
    testable: true,
  },
  {
    id: 'gmail-webmail',
    name: 'Gmail',
    tier: 1,
    platform: 'webmail',
    marketShare: '~30%',
    description: 'Most popular webmail client worldwide',
    testable: true,
  },
  {
    id: 'apple-mail-ios',
    name: 'Apple Mail (iOS)',
    tier: 1,
    platform: 'mobile',
    marketShare: '~25%',
    description: 'iOS Mail app with excellent CSS support',
    testable: true,
  },
  {
    id: 'gmail-ios',
    name: 'Gmail (iOS)',
    tier: 1,
    platform: 'mobile',
    marketShare: '~15%',
    description: 'Gmail app on iOS devices',
    testable: true,
  },
  {
    id: 'gmail-android',
    name: 'Gmail (Android)',
    tier: 1,
    platform: 'mobile',
    marketShare: '~20%',
    description: 'Gmail app on Android devices',
    testable: true,
  },

  // Tier 2: Should Support - Important secondary clients
  {
    id: 'outlook-web',
    name: 'Outlook.com',
    tier: 2,
    platform: 'webmail',
    marketShare: '~8%',
    description: 'Microsoft webmail service',
    testable: true,
  },
  {
    id: 'yahoo-webmail',
    name: 'Yahoo Mail',
    tier: 2,
    platform: 'webmail',
    marketShare: '~5%',
    description: 'Yahoo webmail client',
    testable: true,
  },
  {
    id: 'apple-mail-macos',
    name: 'Apple Mail (macOS)',
    tier: 2,
    platform: 'desktop',
    marketShare: '~8%',
    description: 'macOS Mail app with WebKit rendering',
    testable: true,
  },
  {
    id: 'outlook-2019-mac',
    name: 'Outlook (Mac)',
    tier: 2,
    platform: 'desktop',
    marketShare: '~5%',
    description: 'Mac version of Outlook with better CSS support',
    testable: true,
  },
  {
    id: 'outlook-ios',
    name: 'Outlook (iOS)',
    tier: 2,
    platform: 'mobile',
    marketShare: '~4%',
    description: 'Outlook mobile app for iOS',
    testable: true,
  },
  {
    id: 'outlook-android',
    name: 'Outlook (Android)',
    tier: 2,
    platform: 'mobile',
    marketShare: '~4%',
    description: 'Outlook mobile app for Android',
    testable: true,
  },

  // Tier 3: Nice to Have - Lower priority clients
  {
    id: 'aol-webmail',
    name: 'AOL Mail',
    tier: 3,
    platform: 'webmail',
    marketShare: '~1%',
    description: 'AOL webmail service',
    testable: true,
  },
  {
    id: 'samsung-email',
    name: 'Samsung Email',
    tier: 3,
    platform: 'mobile',
    marketShare: '~3%',
    description: 'Default email app on Samsung devices',
    testable: true,
  },
  {
    id: 'apple-mail-ipados',
    name: 'Apple Mail (iPadOS)',
    tier: 3,
    platform: 'mobile',
    marketShare: '~2%',
    description: 'Mail app on iPad devices',
    testable: true,
  },
];

/**
 * Major CSS properties to display in the matrix
 */
const MATRIX_PROPERTIES = [
  'padding',
  'margin',
  'border-radius',
  'background-color',
  'box-shadow',
  'display',
  'font-family',
  'text-align',
];

export interface EmailClientSupportMatrixProps {
  /**
   * Optional callback when "View Details" is clicked
   */
  onViewDetails?: (clientId: EmailClient) => void;

  /**
   * Optional callback when a matrix cell is clicked
   */
  onPropertyClick?: (property: string, clientId?: EmailClient) => void;

  /**
   * Show feature support matrix
   * @default true
   */
  showMatrix?: boolean;
}

/**
 * Email Client Support Matrix Component
 *
 * @example
 * ```tsx
 * <EmailClientSupportMatrix
 *   onViewDetails={(client) => openModal(client)}
 *   onPropertyClick={(prop) => showCompatibility(prop)}
 * />
 * ```
 */
export const EmailClientSupportMatrix: Component<EmailClientSupportMatrixProps> = (props) => {
  const service = new CompatibilityService();
  const [expandedTier, setExpandedTier] = createSignal<number | null>(1);
  const showMatrix = props.showMatrix ?? true;

  // Group clients by tier
  const tier1Clients = EMAIL_CLIENTS.filter((c) => c.tier === 1);
  const tier2Clients = EMAIL_CLIENTS.filter((c) => c.tier === 2);
  const tier3Clients = EMAIL_CLIENTS.filter((c) => c.tier === 3);

  // Get support level for a property/client combination
  const getSupportLevel = (property: string, clientId: EmailClient): SupportLevel => {
    const support = service.getPropertySupportForClient(property, clientId);
    return support?.level ?? SupportLevel.UNKNOWN;
  };

  // Get CSS class for support level
  const getSupportClass = (level: SupportLevel): string => {
    switch (level) {
      case SupportLevel.FULL:
        return styles['support-full'];
      case SupportLevel.PARTIAL:
        return styles['support-partial'];
      case SupportLevel.NONE:
        return styles['support-none'];
      default:
        return styles['support-unknown'];
    }
  };

  // Toggle tier expansion
  const toggleTier = (tier: number) => {
    setExpandedTier(expandedTier() === tier ? null : tier);
  };

  // Render client card
  const ClientCard = (client: EmailClientInfo) => {
    return (
      <div class={styles.clientCard}>
        <div class={styles.clientCard__header}>
          <div class={styles.clientCard__title}>
            <h4 class={styles.clientCard__name}>{client.name}</h4>
            <span class={`${styles.clientCard__tier} ${styles[`tier-${client.tier}`]}`}>
              Tier {client.tier}
            </span>
          </div>
          <span class={styles.clientCard__platform}>{client.platform}</span>
        </div>

        <Show when={client.marketShare}>
          <div class={styles.clientCard__marketShare}>
            <span class={styles.clientCard__label}>Market Share:</span>
            <span class={styles.clientCard__value}>{client.marketShare}</span>
          </div>
        </Show>

        <p class={styles.clientCard__description}>{client.description}</p>

        <div class={styles.clientCard__footer}>
          <Show when={client.testable}>
            <span class={styles.clientCard__testable}>✓ Testable via Litmus/Email on Acid</span>
          </Show>
          <Show when={props.onViewDetails}>
            <button
              class={styles.clientCard__detailsBtn}
              onClick={() => props.onViewDetails?.(client.id)}
            >
              View Details
            </button>
          </Show>
        </div>
      </div>
    );
  };

  // Render tier section
  const TierSection = (tier: number, clients: EmailClientInfo[], title: string, description: string) => {
    const isExpanded = () => expandedTier() === tier;

    return (
      <div class={styles.tierSection}>
        <button
          class={`${styles.tierSection__header} ${isExpanded() ? styles['tierSection__header--expanded'] : ''}`}
          onClick={() => toggleTier(tier)}
        >
          <div class={styles.tierSection__headerContent}>
            <span class={`${styles.tierSection__badge} ${styles[`tier-${tier}`]}`}>
              Tier {tier}
            </span>
            <div class={styles.tierSection__title}>
              <h3>{title}</h3>
              <p class={styles.tierSection__description}>{description}</p>
            </div>
          </div>
          <span class={styles.tierSection__toggle}>
            {isExpanded() ? '▼' : '▶'}
          </span>
        </button>

        <Show when={isExpanded()}>
          <div class={styles.tierSection__content}>
            <div class={styles.clientGrid}>
              <For each={clients}>{(client) => <ClientCard {...client} />}</For>
            </div>
          </div>
        </Show>
      </div>
    );
  };

  return (
    <div class={styles.supportMatrix}>
      {/* Header */}
      <div class={styles.supportMatrix__header}>
        <h2 class={styles.supportMatrix__title}>Email Client Support</h2>
        <p class={styles.supportMatrix__subtitle}>
          Comprehensive overview of email clients and their CSS feature support
        </p>
      </div>

      {/* Summary Stats */}
      <div class={styles.supportMatrix__stats}>
        <div class={styles.stat}>
          <span class={styles.stat__value}>{EMAIL_CLIENTS.length}</span>
          <span class={styles.stat__label}>Email Clients Tracked</span>
        </div>
        <div class={styles.stat}>
          <span class={styles.stat__value}>{tier1Clients.length}</span>
          <span class={styles.stat__label}>Tier 1 Clients</span>
        </div>
        <div class={styles.stat}>
          <span class={styles.stat__value}>{EMAIL_CLIENTS.filter((c) => c.testable).length}</span>
          <span class={styles.stat__label}>Testable Clients</span>
        </div>
        <div class={styles.stat}>
          <span class={styles.stat__value}>~90%</span>
          <span class={styles.stat__label}>Market Coverage</span>
        </div>
      </div>

      {/* Tier Sections */}
      <div class={styles.tierSections}>
        {TierSection(
          1,
          tier1Clients,
          'Must Support',
          'Highest priority clients with largest market share (70%+ coverage)'
        )}
        {TierSection(
          2,
          tier2Clients,
          'Should Support',
          'Important secondary clients for comprehensive coverage'
        )}
        {TierSection(
          3,
          tier3Clients,
          'Nice to Have',
          'Lower priority clients for maximum coverage'
        )}
      </div>

      {/* Feature Support Matrix */}
      <Show when={showMatrix}>
        <div class={styles.featureMatrix}>
          <div class={styles.featureMatrix__header}>
            <h3>Feature Support Matrix</h3>
            <p>Click any cell to see detailed compatibility information</p>
          </div>

          <div class={styles.matrixTable}>
            <div class={styles.matrixTable__scroll}>
              <table>
                <thead>
                  <tr>
                    <th class={styles.matrixTable__propertyHeader}>CSS Property</th>
                    <For each={EMAIL_CLIENTS}>
                      {(client) => (
                        <th class={styles.matrixTable__clientHeader} title={client.name}>
                          <div class={styles.matrixTable__clientName}>
                            <span>{client.name}</span>
                            <span class={`${styles.matrixTable__tierBadge} ${styles[`tier-${client.tier}`]}`}>
                              T{client.tier}
                            </span>
                          </div>
                        </th>
                      )}
                    </For>
                  </tr>
                </thead>
                <tbody>
                  <For each={MATRIX_PROPERTIES}>
                    {(property) => {
                      const stats = service.getPropertyStatistics(property);
                      return (
                        <tr>
                          <td class={styles.matrixTable__propertyCell}>
                            <button
                              class={styles.matrixTable__propertyBtn}
                              onClick={() => props.onPropertyClick?.(property)}
                            >
                              {property}
                            </button>
                            <Show when={stats}>
                              <span class={styles.matrixTable__propertyScore}>
                                {stats!.supportScore}%
                              </span>
                            </Show>
                          </td>
                          <For each={EMAIL_CLIENTS}>
                            {(client) => {
                              const level = getSupportLevel(property, client.id);
                              const supportClass = getSupportClass(level);
                              return (
                                <td
                                  class={`${styles.matrixTable__supportCell} ${supportClass}`}
                                  onClick={() => props.onPropertyClick?.(property, client.id)}
                                  title={`${property} in ${client.name}: ${level}`}
                                >
                                  <span class={styles.matrixTable__supportIndicator} />
                                </td>
                              );
                            }}
                          </For>
                        </tr>
                      );
                    }}
                  </For>
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div class={styles.matrixLegend}>
            <span class={styles.matrixLegend__title}>Legend:</span>
            <div class={styles.matrixLegend__items}>
              <div class={styles.matrixLegend__item}>
                <span class={`${styles.matrixLegend__indicator} ${styles['support-full']}`} />
                <span>Full Support</span>
              </div>
              <div class={styles.matrixLegend__item}>
                <span class={`${styles.matrixLegend__indicator} ${styles['support-partial']}`} />
                <span>Partial Support</span>
              </div>
              <div class={styles.matrixLegend__item}>
                <span class={`${styles.matrixLegend__indicator} ${styles['support-none']}`} />
                <span>Not Supported</span>
              </div>
              <div class={styles.matrixLegend__item}>
                <span class={`${styles.matrixLegend__indicator} ${styles['support-unknown']}`} />
                <span>Unknown</span>
              </div>
            </div>
          </div>
        </div>
      </Show>

      {/* Footer */}
      <div class={styles.supportMatrix__footer}>
        <p>
          Want to test your email in these clients?{' '}
          <a href="https://litmus.com" target="_blank" rel="noopener noreferrer">
            Try Litmus
          </a>{' '}
          or{' '}
          <a href="https://www.emailonacid.com" target="_blank" rel="noopener noreferrer">
            Email on Acid
          </a>
        </p>
        <p>
          Learn more about CSS support at{' '}
          <a href="https://www.caniemail.com" target="_blank" rel="noopener noreferrer">
            Can I email...
          </a>
        </p>
      </div>
    </div>
  );
};
