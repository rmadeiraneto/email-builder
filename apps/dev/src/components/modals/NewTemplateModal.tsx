/**
 * New Template Modal
 *
 * Modal for creating a new email/web template
 */

import { type Component, createSignal, Show } from 'solid-js';
import styles from './NewTemplateModal.module.scss';
import { Button } from '@email-builder/ui-solid/atoms';
import { Input, Label } from '@email-builder/ui-solid/atoms';
import { RadioButtonGroup } from '@email-builder/ui-solid/molecules';

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
            <Button
              class={styles.modal__close}
              onClick={handleClose}
              aria-label="Close modal"
              variant="ghost"
              icon="close-line"
            />
          </div>

          <form onSubmit={handleSubmit} class={styles.modal__form}>
            <div class={styles.modal__field}>
              <Label for="template-name">
                Template Name
              </Label>
              <Input
                id="template-name"
                type="text"
                placeholder="My Email Template"
                value={templateName()}
                onInput={(e) => {
                  setTemplateName(e.currentTarget.value);
                  setError('');
                }}
                autofocus
                error={error()}
              />
            </div>

            <div class={styles.modal__field}>
              <Label>Template Type</Label>
              <RadioButtonGroup
                items={[
                  {
                    value: 'email',
                    label: 'Email Template',
                    description: 'Optimized for email clients with inline styles',
                    selected: templateType() === 'email',
                    icon: 'mail-line'
                  },
                  {
                    value: 'web',
                    label: 'Web Template',
                    description: 'For web pages with full CSS support',
                    selected: templateType() === 'web',
                    icon: 'global-line'
                  }
                ]}
                singleSelection
                onChange={(values) => setTemplateType(values[0] as 'email' | 'web')}
              />
            </div>

            <div class={styles.modal__actions}>
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                Create Template
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Show>
  );
};
