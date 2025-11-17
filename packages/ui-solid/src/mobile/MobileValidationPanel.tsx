/**
 * Mobile Validation Panel
 *
 * Displays validation warnings for mobile configurations
 */

import { type Component, Show, For, createSignal, createEffect, createMemo } from 'solid-js';
import { DEFAULT_VALIDATION_RULES, DeviceMode } from '@email-builder/core';
import type { Template } from '@email-builder/core';
import type { ValidationIssue } from '@email-builder/core/mobile/mobile.types';
import styles from './MobileValidationPanel.module.scss';

export interface MobileValidationPanelProps {
  template: Template | null;
  deviceMode?: DeviceMode;
  collapsed?: boolean;
  onToggle?: () => void;
}

interface SimpleValidationResult {
  critical: ValidationIssue[];
  warning: ValidationIssue[];
  info: ValidationIssue[];
}

export const MobileValidationPanel: Component<MobileValidationPanelProps> = (props) => {
  const [isCollapsed, setIsCollapsed] = createSignal(props.collapsed ?? false);

  // Run validation when template or device mode changes
  const validationResult = createMemo((): SimpleValidationResult | null => {
    if (!props.template) {
      return null;
    }

    // Only validate when in mobile mode or when template has mobile customizations
    const hasMobileCustomizations = props.template.components.some(
      (c) => c.mobileStyles || c.visibility
    );

    if (!hasMobileCustomizations && props.deviceMode !== DeviceMode.MOBILE) {
      return null;
    }

    // Run validation rules directly
    const critical: ValidationIssue[] = [];
    const warning: ValidationIssue[] = [];
    const info: ValidationIssue[] = [];

    for (const rule of DEFAULT_VALIDATION_RULES) {
      const issues = rule.validate(props.template, props.deviceMode || DeviceMode.DESKTOP);
      for (const issue of issues) {
        if (issue.severity === 'critical') {
          critical.push(issue);
        } else if (issue.severity === 'warning') {
          warning.push(issue);
        } else {
          info.push(issue);
        }
      }
    }

    return { critical, warning, info };
  });

  const getSeverityIcon = (severity: string): string => {
    switch (severity) {
      case 'error':
        return '🔴';
      case 'warning':
        return '🟡';
      case 'info':
        return '🔵';
      default:
        return '⚪';
    }
  };

  const getSeverityLabel = (severity: string): string => {
    switch (severity) {
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Info';
      default:
        return 'Unknown';
    }
  };

  const getRuleLabel = (ruleId: string): string => {
    // Convert ruleId like 'min-touch-target-size' to 'Touch Target'
    const labelMap: Record<string, string> = {
      'min-touch-target-size': 'Touch Target',
      'min-font-size': 'Typography',
      'overflow-hidden-content': 'Layout',
      'all-components-hidden': 'Visibility',
      'excessive-width': 'Layout',
    };
    return labelMap[ruleId] || 'General';
  };

  const totalIssues = () => {
    const result = validationResult();
    if (!result) return 0;
    return result.critical.length + result.warning.length + result.info.length;
  };

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed());
    props.onToggle?.();
  };

  return (
    <Show when={validationResult() && totalIssues() > 0}>
      <div class={styles.validationPanel}>
        <button
          class={styles.panelHeader}
          onClick={handleToggle}
          aria-expanded={!isCollapsed()}
          aria-controls="validation-content"
        >
          <div class={styles.headerLeft}>
            <span class={styles.warningIcon}>⚠️</span>
            <span class={styles.headerTitle}>Mobile Validation</span>
            <span class={styles.issueCount}>
              {totalIssues()} {totalIssues() === 1 ? 'issue' : 'issues'}
            </span>
          </div>
          <span class={styles.collapseIcon}>{isCollapsed() ? '▼' : '▲'}</span>
        </button>

        <Show when={!isCollapsed()}>
          <div id="validation-content" class={styles.panelContent}>
            <Show when={validationResult()}>
              {(result) => (
                <>
                  <Show when={result().critical.length > 0}>
                    <div class={styles.issueSection}>
                      <div class={styles.sectionHeader}>
                        <span class={styles.sectionIcon}>🔴</span>
                        <span class={styles.sectionTitle}>
                          Critical ({result().critical.length})
                        </span>
                      </div>
                      <For each={result().critical}>
                        {(issue) => (
                          <div class={`${styles.issueItem} ${styles.errorItem}`}>
                            <div class={styles.issueHeader}>
                              <span class={styles.categoryBadge}>
                                {getRuleLabel(issue.ruleId)}
                              </span>
                              <Show when={issue.componentId}>
                                <span class={styles.componentId}>
                                  {issue.componentId}
                                </span>
                              </Show>
                            </div>
                            <div class={styles.issueMessage}>{issue.message}</div>
                            <Show when={issue.suggestion}>
                              <div class={styles.issueSuggestion}>
                                💡 {issue.suggestion}
                              </div>
                            </Show>
                          </div>
                        )}
                      </For>
                    </div>
                  </Show>

                  <Show when={result().warning.length > 0}>
                    <div class={styles.issueSection}>
                      <div class={styles.sectionHeader}>
                        <span class={styles.sectionIcon}>🟡</span>
                        <span class={styles.sectionTitle}>
                          Warnings ({result().warning.length})
                        </span>
                      </div>
                      <For each={result().warning}>
                        {(issue) => (
                          <div class={`${styles.issueItem} ${styles.warningItem}`}>
                            <div class={styles.issueHeader}>
                              <span class={styles.categoryBadge}>
                                {getRuleLabel(issue.ruleId)}
                              </span>
                              <Show when={issue.componentId}>
                                <span class={styles.componentId}>
                                  {issue.componentId}
                                </span>
                              </Show>
                            </div>
                            <div class={styles.issueMessage}>{issue.message}</div>
                            <Show when={issue.suggestion}>
                              <div class={styles.issueSuggestion}>
                                💡 {issue.suggestion}
                              </div>
                            </Show>
                          </div>
                        )}
                      </For>
                    </div>
                  </Show>

                  <Show when={result().info.length > 0}>
                    <div class={styles.issueSection}>
                      <div class={styles.sectionHeader}>
                        <span class={styles.sectionIcon}>🔵</span>
                        <span class={styles.sectionTitle}>
                          Info ({result().info.length})
                        </span>
                      </div>
                      <For each={result().info}>
                        {(issue) => (
                          <div class={`${styles.issueItem} ${styles.infoItem}`}>
                            <div class={styles.issueHeader}>
                              <span class={styles.categoryBadge}>
                                {getRuleLabel(issue.ruleId)}
                              </span>
                              <Show when={issue.componentId}>
                                <span class={styles.componentId}>
                                  {issue.componentId}
                                </span>
                              </Show>
                            </div>
                            <div class={styles.issueMessage}>{issue.message}</div>
                            <Show when={issue.suggestion}>
                              <div class={styles.issueSuggestion}>
                                💡 {issue.suggestion}
                              </div>
                            </Show>
                          </div>
                        )}
                      </For>
                    </div>
                  </Show>
                </>
              )}
            </Show>
          </div>
        </Show>
      </div>
    </Show>
  );
};
