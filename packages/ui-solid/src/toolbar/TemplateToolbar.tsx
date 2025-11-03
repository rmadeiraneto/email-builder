/**
 * Template Toolbar Component
 *
 * Toolbar with actions for template management (new, save, load, undo, redo, export)
 */

import { type Component, Show } from 'solid-js';
import styles from './TemplateToolbar.module.scss';
import type { TemplateToolbarProps } from './TemplateToolbar.types';

export const TemplateToolbar: Component<TemplateToolbarProps> = (props) => {
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

  return (
    <div class={styles.toolbar}>
      <div class={styles.toolbar__group}>
        <button
          class={styles.toolbar__button}
          onClick={handleNewTemplate}
          title="Create new template"
          aria-label="Create new template"
        >
          <span class={styles.toolbar__icon}>📄</span>
          <span class={styles.toolbar__label}>New</span>
        </button>

        <button
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
          class={styles.toolbar__button}
          onClick={handleEmailTestingSettings}
          title="Email Testing Settings"
          aria-label="Email Testing Settings"
        >
          <span class={styles.toolbar__icon}>⚙️</span>
          <span class={styles.toolbar__label}>Settings</span>
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
