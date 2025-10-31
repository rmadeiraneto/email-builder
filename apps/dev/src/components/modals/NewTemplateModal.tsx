/**
 * New Template Modal
 *
 * Modal for creating a new email/web template
 */

import { type Component, createSignal, Show } from 'solid-js';
import styles from './NewTemplateModal.module.scss';

export interface NewTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTemplate: (name: string, type: 'email' | 'web') => void;
}

export const NewTemplateModal: Component<NewTemplateModalProps> = (props) => {
  const [templateName, setTemplateName] = createSignal('');
  const [templateType, setTemplateType] = createSignal<'email' | 'web'>('email');
  const [error, setError] = createSignal('');

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    const name = templateName().trim();
    if (!name) {
      setError('Please enter a template name');
      return;
    }

    props.onCreateTemplate(name, templateType());
    handleClose();
  };

  const handleClose = () => {
    setTemplateName('');
    setTemplateType('email');
    setError('');
    props.onClose();
  };

  return (
    <Show when={props.isOpen}>
      <div class={styles.modal}>
        <div class={styles.modal__overlay} onClick={handleClose} />
        <div class={styles.modal__content}>
          <div class={styles.modal__header}>
            <h2 class={styles.modal__title}>Create New Template</h2>
            <button
              class={styles.modal__close}
              onClick={handleClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} class={styles.modal__form}>
            <div class={styles.modal__field}>
              <label for="template-name" class={styles.modal__label}>
                Template Name
              </label>
              <input
                id="template-name"
                type="text"
                class={styles.modal__input}
                placeholder="My Email Template"
                value={templateName()}
                onInput={(e) => {
                  setTemplateName(e.currentTarget.value);
                  setError('');
                }}
                autofocus
              />
              <Show when={error()}>
                <p class={styles.modal__error}>{error()}</p>
              </Show>
            </div>

            <div class={styles.modal__field}>
              <label class={styles.modal__label}>Template Type</label>
              <div class={styles.modal__radioGroup}>
                <label class={styles.modal__radio}>
                  <input
                    type="radio"
                    name="template-type"
                    value="email"
                    checked={templateType() === 'email'}
                    onChange={() => setTemplateType('email')}
                  />
                  <span class={styles.modal__radioLabel}>Email Template</span>
                  <p class={styles.modal__radioDescription}>
                    Optimized for email clients with inline styles
                  </p>
                </label>

                <label class={styles.modal__radio}>
                  <input
                    type="radio"
                    name="template-type"
                    value="web"
                    checked={templateType() === 'web'}
                    onChange={() => setTemplateType('web')}
                  />
                  <span class={styles.modal__radioLabel}>Web Template</span>
                  <p class={styles.modal__radioDescription}>
                    For web pages with full CSS support
                  </p>
                </label>
              </div>
            </div>

            <div class={styles.modal__actions}>
              <button
                type="button"
                class={styles.modal__button}
                classList={{ [styles['modal__button--secondary']]: true }}
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                class={styles.modal__button}
                classList={{ [styles['modal__button--primary']]: true }}
              >
                Create Template
              </button>
            </div>
          </form>
        </div>
      </div>
    </Show>
  );
};
