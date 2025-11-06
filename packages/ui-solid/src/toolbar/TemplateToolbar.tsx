/**
 * Template Toolbar Component
 *
 * Toolbar with actions for template management (new, save, load, undo, redo, export)
 */

import { type Component, Show, createSignal } from 'solid-js';
import styles from './TemplateToolbar.module.scss';
import type { TemplateToolbarProps } from './TemplateToolbar.types';
import { TestMode } from '@email-builder/core/config';
import { getTestId, getTestAction } from '@email-builder/core/utils';

export const TemplateToolbar: Component<TemplateToolbarProps> = (props) => {
  const [testModeEnabled, setTestModeEnabled] = createSignal(TestMode.isEnabled());

  const handleNewTemplate = () => {
    props.onNewTemplate?.();
  };

  const handleSaveTemplate = () => {
    props.onSaveTemplate?.();
  };

  const handleLoadTemplate = () => {
    props.onLoadTemplate?.();
  };

  const handleUndo = () => {
    props.onUndo?.();
  };

  const handleRedo = () => {
    props.onRedo?.();
  };

  const handleExport = () => {
    props.onExport?.();
  };

  const handlePreview = () => {
    props.onPreview?.();
  };

  const handleTestEmailClients = () => {
    props.onTestEmailClients?.();
  };

  const handleEmailTestingSettings = () => {
    props.onEmailTestingSettings?.();
  };

  const handleCheckCompatibility = () => {
    props.onCheckCompatibility?.();
  };

  const toggleTestMode = () => {
    TestMode.toggle();
    setTestModeEnabled(TestMode.isEnabled());

    // Persist preference
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('test-mode-enabled', String(TestMode.isEnabled()));
    }
  };

  return (
    <div {...getTestId('toolbar-template')} class={styles.toolbar}>
      <div class={styles.toolbar__group}>
        <button
          {...getTestId('button-new-template')}
          {...getTestAction('create-template')}
          class={styles.toolbar__button}
          onClick={handleNewTemplate}
          title="Create new template"
          aria-label="Create new template"
        >
          <span class={styles.toolbar__icon}>📄</span>
          <span class={styles.toolbar__label}>New</span>
        </button>

        <button
          {...getTestId('button-save-template')}
          {...getTestAction('save-template')}
          class={styles.toolbar__button}
          onClick={handleSaveTemplate}
          disabled={!props.hasTemplate}
          title="Save template"
          aria-label="Save template"
        >
          <span class={styles.toolbar__icon}>💾</span>
          <span class={styles.toolbar__label}>Save</span>
        </button>

        <button
          {...getTestId('button-load-template')}
          {...getTestAction('open-template-picker')}
          class={styles.toolbar__button}
          onClick={handleLoadTemplate}
          title="Load template"
          aria-label="Load template"
        >
          <span class={styles.toolbar__icon}>📂</span>
          <span class={styles.toolbar__label}>Load</span>
        </button>
      </div>

      <div class={styles.toolbar__separator} />

      <div class={styles.toolbar__group}>
        <button
          {...getTestId('button-undo')}
          {...getTestAction('undo')}
          class={styles.toolbar__button}
          onClick={handleUndo}
          disabled={!props.canUndo}
          title="Undo"
          aria-label="Undo"
        >
          <span class={styles.toolbar__icon}>↶</span>
          <span class={styles.toolbar__label}>Undo</span>
        </button>

        <button
          {...getTestId('button-redo')}
          {...getTestAction('redo')}
          class={styles.toolbar__button}
          onClick={handleRedo}
          disabled={!props.canRedo}
          title="Redo"
          aria-label="Redo"
        >
          <span class={styles.toolbar__icon}>↷</span>
          <span class={styles.toolbar__label}>Redo</span>
        </button>
      </div>

      <div class={styles.toolbar__separator} />

      <div class={styles.toolbar__group}>
        <button
          {...getTestId('button-export-template')}
          {...getTestAction('export-html')}
          class={styles.toolbar__button}
          onClick={handleExport}
          disabled={!props.hasTemplate}
          title="Export template"
          aria-label="Export template"
        >
          <span class={styles.toolbar__icon}>⬇️</span>
          <span class={styles.toolbar__label}>Export</span>
        </button>

        <button
          {...getTestId('button-preview-template')}
          {...getTestAction('preview-template')}
          class={styles.toolbar__button}
          onClick={handlePreview}
          disabled={!props.hasTemplate}
          title="Preview template"
          aria-label="Preview template"
        >
          <span class={styles.toolbar__icon}>👁️</span>
          <span class={styles.toolbar__label}>Preview</span>
        </button>
      </div>

      <div class={styles.toolbar__separator} />

      <div class={styles.toolbar__group}>
        <button
          {...getTestId('button-check-compatibility')}
          {...getTestAction('check-compatibility')}
          class={styles.toolbar__button}
          onClick={handleCheckCompatibility}
          disabled={!props.hasTemplate}
          title="Check Email Compatibility"
          aria-label="Check Email Compatibility"
        >
          <span class={styles.toolbar__icon}>✓</span>
          <span class={styles.toolbar__label}>Check</span>
        </button>

        <button
          {...getTestId('button-test-email-clients')}
          {...getTestAction('test-email-clients')}
          class={styles.toolbar__button}
          onClick={handleTestEmailClients}
          disabled={!props.hasTemplate}
          title="Test in Email Clients"
          aria-label="Test in Email Clients"
        >
          <span class={styles.toolbar__icon}>🧪</span>
          <span class={styles.toolbar__label}>Test</span>
        </button>

        <button
          {...getTestId('button-email-testing-settings')}
          {...getTestAction('open-email-testing-settings')}
          class={styles.toolbar__button}
          onClick={handleEmailTestingSettings}
          title="Email Testing Settings"
          aria-label="Email Testing Settings"
        >
          <span class={styles.toolbar__icon}>⚙️</span>
          <span class={styles.toolbar__label}>Settings</span>
        </button>
      </div>

      <div class={styles.toolbar__separator} />

      <div class={styles.toolbar__group}>
        <button
          {...getTestId('button-toggle-test-mode')}
          {...getTestAction('toggle-test-mode')}
          class={`${styles.toolbar__button} ${testModeEnabled() ? styles['toolbar__button--active'] : ''}`}
          onClick={toggleTestMode}
          title="Toggle Test Mode (adds test attributes for automation)"
          aria-label="Toggle Test Mode"
          aria-pressed={testModeEnabled()}
        >
          <span class={styles.toolbar__icon}>🧪</span>
          <span class={styles.toolbar__label}>Test Mode</span>
        </button>
      </div>

      <Show when={props.templateName}>
        <div class={styles.toolbar__info}>
          <span class={styles.toolbar__templateName}>{props.templateName}</span>
        </div>
      </Show>
    </div>
  );
};
