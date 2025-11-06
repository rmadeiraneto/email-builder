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
import { Button } from '../atoms/Button/Button';

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
        <Button
          {...getTestId('button-new-template')}
          {...getTestAction('create-template')}
          class={styles.toolbar__button}
          onClick={handleNewTemplate}
          title="Create new template"
          aria-label="Create new template"
          variant="secondary"
          icon="file-add-line"
          iconPosition="left"
        >
          New
        </Button>

        <Button
          {...getTestId('button-save-template')}
          {...getTestAction('save-template')}
          class={styles.toolbar__button}
          onClick={handleSaveTemplate}
          disabled={!props.hasTemplate}
          title="Save template"
          aria-label="Save template"
          variant="secondary"
          icon="save-line"
          iconPosition="left"
        >
          Save
        </Button>

        <Button
          {...getTestId('button-load-template')}
          {...getTestAction('open-template-picker')}
          class={styles.toolbar__button}
          onClick={handleLoadTemplate}
          title="Load template"
          aria-label="Load template"
          variant="secondary"
          icon="folder-open-line"
          iconPosition="left"
        >
          Load
        </Button>
      </div>

      <div class={styles.toolbar__separator} />

      <div class={styles.toolbar__group}>
        <Button
          {...getTestId('button-undo')}
          {...getTestAction('undo')}
          class={styles.toolbar__button}
          onClick={handleUndo}
          disabled={!props.canUndo}
          title="Undo"
          aria-label="Undo"
          variant="secondary"
          icon="arrow-go-back-line"
          iconPosition="left"
        >
          Undo
        </Button>

        <Button
          {...getTestId('button-redo')}
          {...getTestAction('redo')}
          class={styles.toolbar__button}
          onClick={handleRedo}
          disabled={!props.canRedo}
          title="Redo"
          aria-label="Redo"
          variant="secondary"
          icon="arrow-go-forward-line"
          iconPosition="left"
        >
          Redo
        </Button>
      </div>

      <div class={styles.toolbar__separator} />

      <div class={styles.toolbar__group}>
        <Button
          {...getTestId('button-export-template')}
          {...getTestAction('export-html')}
          class={styles.toolbar__button}
          onClick={handleExport}
          disabled={!props.hasTemplate}
          title="Export template"
          aria-label="Export template"
          variant="secondary"
          icon="download-line"
          iconPosition="left"
        >
          Export
        </Button>

        <Button
          {...getTestId('button-preview-template')}
          {...getTestAction('preview-template')}
          class={styles.toolbar__button}
          onClick={handlePreview}
          disabled={!props.hasTemplate}
          title="Preview template"
          aria-label="Preview template"
          variant="secondary"
          icon="eye-line"
          iconPosition="left"
        >
          Preview
        </Button>
      </div>

      <div class={styles.toolbar__separator} />

      <div class={styles.toolbar__group}>
        <Button
          {...getTestId('button-check-compatibility')}
          {...getTestAction('check-compatibility')}
          class={styles.toolbar__button}
          onClick={handleCheckCompatibility}
          disabled={!props.hasTemplate}
          title="Check Email Compatibility"
          aria-label="Check Email Compatibility"
          variant="secondary"
          icon="checkbox-circle-line"
          iconPosition="left"
        >
          Check
        </Button>

        <Button
          {...getTestId('button-test-email-clients')}
          {...getTestAction('test-email-clients')}
          class={styles.toolbar__button}
          onClick={handleTestEmailClients}
          disabled={!props.hasTemplate}
          title="Test in Email Clients"
          aria-label="Test in Email Clients"
          variant="secondary"
          icon="flask-line"
          iconPosition="left"
        >
          Test
        </Button>

        <Button
          {...getTestId('button-email-testing-settings')}
          {...getTestAction('open-email-testing-settings')}
          class={styles.toolbar__button}
          onClick={handleEmailTestingSettings}
          title="Email Testing Settings"
          aria-label="Email Testing Settings"
          variant="secondary"
          icon="settings-line"
          iconPosition="left"
        >
          Settings
        </Button>
      </div>

      <div class={styles.toolbar__separator} />

      <div class={styles.toolbar__group}>
        <Button
          {...getTestId('button-toggle-test-mode')}
          {...getTestAction('toggle-test-mode')}
          class={`${styles.toolbar__button} ${testModeEnabled() ? styles['toolbar__button--active'] : ''}`}
          onClick={toggleTestMode}
          title="Toggle Test Mode (adds test attributes for automation)"
          aria-label="Toggle Test Mode"
          aria-pressed={testModeEnabled()}
          variant="secondary"
          icon="flask-line"
          iconPosition="left"
        >
          Test Mode
        </Button>
      </div>

      <Show when={props.templateName}>
        <div class={styles.toolbar__info}>
          <span class={styles.toolbar__templateName}>{props.templateName}</span>
        </div>
      </Show>
    </div>
  );
};
