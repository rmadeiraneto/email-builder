/**
 * Compatibility Report Modal
 *
 * Modal for displaying email compatibility issues found in the template.
 * Groups issues by severity and allows users to apply automatic fixes.
 */

import { type Component, createSignal, For, Show } from 'solid-js';
import type { CompatibilityReport, CompatibilityIssue } from '@email-builder/core';
import { IssueSeverity, IssueCategory } from '@email-builder/core';
import styles from './CompatibilityReportModal.module.scss';

export interface CompatibilityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: CompatibilityReport;
  onFixIssue?: (issueId: string) => Promise<void>;
  onFixAll?: () => Promise<void>;
  onExportAnyway?: () => void;
}

export const CompatibilityReportModal: Component<CompatibilityReportModalProps> = (props) => {
  const [fixingIssues, setFixingIssues] = createSignal<Set<string>>(new Set());
  const [fixingAll, setFixingAll] = createSignal(false);

  /**
   * Get color class for severity
   */
  const getSeverityClass = (severity: IssueSeverity): string => {
    switch (severity) {
      case IssueSeverity.CRITICAL:
        return styles.critical;
      case IssueSeverity.WARNING:
        return styles.warning;
      case IssueSeverity.SUGGESTION:
        return styles.suggestion;
      default:
        return '';
    }
  };

  /**
   * Get icon for severity
   */
  const getSeverityIcon = (severity: IssueSeverity): string => {
    switch (severity) {
      case IssueSeverity.CRITICAL:
        return '🔴';
      case IssueSeverity.WARNING:
        return '🟡';
      case IssueSeverity.SUGGESTION:
        return '🔵';
      default:
        return '⚪';
    }
  };

  /**
   * Get label for severity
   */
  const getSeverityLabel = (severity: IssueSeverity): string => {
    switch (severity) {
      case IssueSeverity.CRITICAL:
        return 'Critical Issues';
      case IssueSeverity.WARNING:
        return 'Warnings';
      case IssueSeverity.SUGGESTION:
        return 'Suggestions';
      default:
        return 'Issues';
    }
  };

  /**
   * Get icon for category
   */
  const getCategoryIcon = (category: IssueCategory): string => {
    switch (category) {
      case IssueCategory.CSS:
        return '🎨';
      case IssueCategory.HTML:
        return '📝';
      case IssueCategory.IMAGES:
        return '🖼️';
      case IssueCategory.ACCESSIBILITY:
        return '♿';
      case IssueCategory.STRUCTURE:
        return '🏗️';
      case IssueCategory.CONTENT:
        return '📄';
      default:
        return '⚠️';
    }
  };

  /**
   * Handle fixing a single issue
   */
  const handleFixIssue = async (issueId: string) => {
    if (!props.onFixIssue) return;

    setFixingIssues((prev) => new Set(prev).add(issueId));

    try {
      await props.onFixIssue(issueId);
    } catch (error) {
      console.error('Failed to fix issue:', error);
    } finally {
      setFixingIssues((prev) => {
        const next = new Set(prev);
        next.delete(issueId);
        return next;
      });
    }
  };

  /**
   * Handle fixing all issues
   */
  const handleFixAll = async () => {
    if (!props.onFixAll) return;

    setFixingAll(true);

    try {
      await props.onFixAll();
    } catch (error) {
      console.error('Failed to fix all issues:', error);
    } finally {
      setFixingAll(false);
    }
  };

  /**
   * Handle export anyway
   */
  const handleExportAnyway = () => {
    if (props.onExportAnyway) {
      props.onExportAnyway();
    }
    props.onClose();
  };

  /**
   * Count fixable issues
   */
  const fixableIssuesCount = (): number => {
    const allIssues = [
      ...props.report.issues.critical,
      ...props.report.issues.warnings,
      ...props.report.issues.suggestions,
    ];
    return allIssues.filter((issue) => issue.autoFixAvailable).length;
  };

  /**
   * Get overall score color class
   */
  const getScoreClass = (): string => {
    const score = props.report.overallScore;
    if (score >= 90) return styles.scoreExcellent;
    if (score >= 70) return styles.scoreGood;
    if (score >= 50) return styles.scoreFair;
    return styles.scorePoor;
  };

  if (!props.isOpen) return null;

  return (
    <div class={styles.overlay} onClick={props.onClose}>
      <div class={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div class={styles.header}>
          <h2 class={styles.title}>Compatibility Report</h2>
          <button class={styles.closeButton} onClick={props.onClose}>
            ×
          </button>
        </div>

        {/* Overall Score */}
        <div class={styles.scoreCard}>
          <div class={styles.scoreSection}>
            <div class={`${styles.scoreValue} ${getScoreClass()}`}>
              {props.report.overallScore}
            </div>
            <div class={styles.scoreLabel}>Compatibility Score</div>
          </div>
          <div class={styles.statsSection}>
            <div class={styles.stat}>
              <span class={styles.statValue}>{props.report.totalIssues}</span>
              <span class={styles.statLabel}>Total Issues</span>
            </div>
            <div class={styles.stat}>
              <span class={styles.statValue}>{props.report.componentsChecked}</span>
              <span class={styles.statLabel}>Components Checked</span>
            </div>
            <Show when={!props.report.safeToExport}>
              <div class={`${styles.stat} ${styles.statDanger}`}>
                <span class={styles.statValue}>⚠️</span>
                <span class={styles.statLabel}>Not Safe to Export</span>
              </div>
            </Show>
          </div>
        </div>

        {/* Issues List */}
        <div class={styles.content}>
          {/* Critical Issues */}
          <Show when={props.report.issues.critical.length > 0}>
            <div class={styles.issueGroup}>
              <h3 class={`${styles.groupTitle} ${getSeverityClass(IssueSeverity.CRITICAL)}`}>
                {getSeverityIcon(IssueSeverity.CRITICAL)} {getSeverityLabel(IssueSeverity.CRITICAL)} (
                {props.report.issues.critical.length})
              </h3>
              <div class={styles.issueList}>
                <For each={props.report.issues.critical}>
                  {(issue) => (
                    <IssueCard
                      issue={issue}
                      onFix={handleFixIssue}
                      isFixing={fixingIssues().has(issue.id)}
                      categoryIcon={getCategoryIcon(issue.category)}
                    />
                  )}
                </For>
              </div>
            </div>
          </Show>

          {/* Warnings */}
          <Show when={props.report.issues.warnings.length > 0}>
            <div class={styles.issueGroup}>
              <h3 class={`${styles.groupTitle} ${getSeverityClass(IssueSeverity.WARNING)}`}>
                {getSeverityIcon(IssueSeverity.WARNING)} {getSeverityLabel(IssueSeverity.WARNING)} (
                {props.report.issues.warnings.length})
              </h3>
              <div class={styles.issueList}>
                <For each={props.report.issues.warnings}>
                  {(issue) => (
                    <IssueCard
                      issue={issue}
                      onFix={handleFixIssue}
                      isFixing={fixingIssues().has(issue.id)}
                      categoryIcon={getCategoryIcon(issue.category)}
                    />
                  )}
                </For>
              </div>
            </div>
          </Show>

          {/* Suggestions */}
          <Show when={props.report.issues.suggestions.length > 0}>
            <div class={styles.issueGroup}>
              <h3 class={`${styles.groupTitle} ${getSeverityClass(IssueSeverity.SUGGESTION)}`}>
                {getSeverityIcon(IssueSeverity.SUGGESTION)} {getSeverityLabel(IssueSeverity.SUGGESTION)} (
                {props.report.issues.suggestions.length})
              </h3>
              <div class={styles.issueList}>
                <For each={props.report.issues.suggestions}>
                  {(issue) => (
                    <IssueCard
                      issue={issue}
                      onFix={handleFixIssue}
                      isFixing={fixingIssues().has(issue.id)}
                      categoryIcon={getCategoryIcon(issue.category)}
                    />
                  )}
                </For>
              </div>
            </div>
          </Show>

          {/* No Issues */}
          <Show when={props.report.totalIssues === 0}>
            <div class={styles.noIssues}>
              <div class={styles.noIssuesIcon}>✅</div>
              <h3 class={styles.noIssuesTitle}>No Issues Found!</h3>
              <p class={styles.noIssuesMessage}>
                Your template looks great! All components are compatible with email clients.
              </p>
            </div>
          </Show>
        </div>

        {/* Footer Actions */}
        <div class={styles.footer}>
          <Show when={fixableIssuesCount() > 0}>
            <button
              class={`${styles.button} ${styles.buttonPrimary}`}
              onClick={handleFixAll}
              disabled={fixingAll()}
            >
              {fixingAll() ? 'Fixing...' : `Fix All (${fixableIssuesCount()})`}
            </button>
          </Show>
          <button
            class={`${styles.button} ${styles.buttonSecondary}`}
            onClick={handleExportAnyway}
            disabled={fixingAll()}
          >
            {props.report.safeToExport ? 'Continue' : 'Export Anyway'}
          </button>
          <button
            class={`${styles.button} ${styles.buttonGhost}`}
            onClick={props.onClose}
            disabled={fixingAll()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Issue Card Component
 */
interface IssueCardProps {
  issue: CompatibilityIssue;
  onFix: (issueId: string) => void;
  isFixing: boolean;
  categoryIcon: string;
}

const IssueCard: Component<IssueCardProps> = (props) => {
  return (
    <div class={styles.issueCard}>
      <div class={styles.issueHeader}>
        <div class={styles.issueTitle}>
          <span class={styles.categoryIcon}>{props.categoryIcon}</span>
          <span class={styles.issueName}>{props.issue.message}</span>
        </div>
        <Show when={props.issue.autoFixAvailable}>
          <button
            class={`${styles.fixButton} ${props.isFixing ? styles.fixing : ''}`}
            onClick={() => props.onFix(props.issue.id)}
            disabled={props.isFixing}
          >
            {props.isFixing ? '⏳ Fixing...' : '🔧 Fix'}
          </button>
        </Show>
      </div>

      <div class={styles.issueBody}>
        <div class={styles.issueDetails}>
          <span class={styles.label}>Component:</span>
          <span class={styles.value}>
            {props.issue.componentType} (#{props.issue.componentId.slice(0, 8)})
          </span>
        </div>

        <Show when={props.issue.property}>
          <div class={styles.issueDetails}>
            <span class={styles.label}>Property:</span>
            <span class={styles.value}>{props.issue.property}</span>
          </div>
        </Show>

        <Show when={props.issue.value}>
          <div class={styles.issueDetails}>
            <span class={styles.label}>Value:</span>
            <span class={styles.code}>{props.issue.value}</span>
          </div>
        </Show>

        <Show when={props.issue.supportScore !== undefined}>
          <div class={styles.issueDetails}>
            <span class={styles.label}>Support:</span>
            <span class={styles.value}>
              {props.issue.supportScore}% ({19 - (props.issue.affectedClients || 0)}/19 clients)
            </span>
          </div>
        </Show>

        <Show when={props.issue.details}>
          <div class={styles.issueDescription}>{props.issue.details}</div>
        </Show>

        <Show when={props.issue.suggestedFix}>
          <div class={styles.suggestedFix}>
            <span class={styles.suggestedFixLabel}>💡 Suggested Fix:</span>
            <span class={styles.suggestedFixText}>{props.issue.suggestedFix}</span>
          </div>
        </Show>
      </div>
    </div>
  );
};
