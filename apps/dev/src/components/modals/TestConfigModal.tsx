/**
 * Test Config Modal
 *
 * Modal for configuring and submitting email client tests.
 * Allows users to select email clients, set test name/subject, and submit tests.
 */

import { type Component, createSignal, For, Show } from 'solid-js';
import { COMMON_EMAIL_CLIENTS } from '@email-builder/core';
import type { EmailTestRequest } from '@email-builder/core';
import styles from './TestConfigModal.module.scss';
import { Button, Input, Label } from '@email-builder/ui-solid/atoms';

export interface TestConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (testRequest: EmailTestRequest) => Promise<void>;
}

export const TestConfigModal: Component<TestConfigModalProps> = (props) => {
  // Form state
  const [testName, setTestName] = createSignal('');
  const [subject, setSubject] = createSignal('');
  const [description, setDescription] = createSignal('');
  const [selectedClients, setSelectedClients] = createSignal<string[]>([]);
  const [spamTest, setSpamTest] = createSignal(false);

  // UI state
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [error, setError] = createSignal('');

  // Group clients by platform
  const clientsByPlatform = () => {
    const grouped: Record<string, typeof COMMON_EMAIL_CLIENTS> = {
      desktop: [],
      webmail: [],
      'mobile-ios': [],
      'mobile-android': [],
    };

    COMMON_EMAIL_CLIENTS.forEach((client) => {
      if (client.available) {
        grouped[client.platform].push(client);
      }
    });

    return grouped;
  };

  const platformLabels: Record<string, string> = {
    desktop: 'Desktop Clients',
    webmail: 'Webmail',
    'mobile-ios': 'iOS Mobile',
    'mobile-android': 'Android Mobile',
  };

  const handleClientToggle = (clientId: string) => {
    setSelectedClients((prev) =>
      prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]
    );
  };

  const handleSelectAll = () => {
    const allClientIds = COMMON_EMAIL_CLIENTS.filter((c) => c.available).map((c) => c.id);
    setSelectedClients(allClientIds);
  };

  const handleSelectNone = () => {
    setSelectedClients([]);
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!testName().trim()) {
      setError('Test name is required');
      return;
    }

    if (!subject().trim()) {
      setError('Email subject is required');
      return;
    }

    if (selectedClients().length === 0) {
      setError('Please select at least one email client');
      return;
    }

    setIsSubmitting(true);

    try {
      const testRequest: Omit<EmailTestRequest, 'htmlContent'> = {
        name: testName().trim(),
        subject: subject().trim(),
        clients: selectedClients(),
        description: description().trim() || undefined,
        spamTest: spamTest(),
      };

      await props.onSubmit(testRequest as EmailTestRequest);

      // Reset form on success
      setTestName('');
      setSubject('');
      setDescription('');
      setSelectedClients([]);
      setSpamTest(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit test');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting()) {
      props.onClose();
    }
  };

  if (!props.isOpen) return null;

  return (
    <div class={styles.modalOverlay} onClick={handleClose}>
      <div class={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div class={styles.modal__header}>
          <h2 class={styles.modal__title}>Test in Email Clients</h2>
          <Button
            class={styles.modal__closeButton}
            onClick={handleClose}
            disabled={isSubmitting()}
            aria-label="Close modal"
            variant="ghost"
            icon="close-line"
          />
        </div>

        <form class={styles.modal__content} onSubmit={handleSubmit}>
          {/* Test Details */}
          <div class={styles.formSection}>
            <h3 class={styles.formSection__title}>Test Details</h3>

            <div class={styles.formGroup}>
              <Label for="testName">
                Test Name *
              </Label>
              <Input
                id="testName"
                type="text"
                value={testName()}
                onInput={(e) => setTestName(e.currentTarget.value)}
                placeholder="e.g., Newsletter Template Test"
                disabled={isSubmitting()}
              />
            </div>

            <div class={styles.formGroup}>
              <Label for="subject">
                Email Subject *
              </Label>
              <Input
                id="subject"
                type="text"
                value={subject()}
                onInput={(e) => setSubject(e.currentTarget.value)}
                placeholder="e.g., Weekly Newsletter"
                disabled={isSubmitting()}
              />
            </div>

            <div class={styles.formGroup}>
              <Label for="description">
                Description (optional)
              </Label>
              <textarea
                id="description"
                class={styles.formGroup__textarea}
                value={description()}
                onInput={(e) => setDescription(e.currentTarget.value)}
                placeholder="Add any notes about this test..."
                rows={3}
                disabled={isSubmitting()}
              />
            </div>

            <div class={styles.formGroup}>
              <label class={styles.formGroup__checkbox}>
                <input
                  type="checkbox"
                  checked={spamTest()}
                  onChange={(e) => setSpamTest(e.currentTarget.checked)}
                  disabled={isSubmitting()}
                />
                <span>Enable spam testing</span>
              </label>
            </div>
          </div>

          {/* Client Selection */}
          <div class={styles.formSection}>
            <div class={styles.formSection__header}>
              <h3 class={styles.formSection__title}>
                Email Clients * ({selectedClients().length} selected)
              </h3>
              <div class={styles.formSection__actions}>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSelectAll}
                  disabled={isSubmitting()}
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSelectNone}
                  disabled={isSubmitting()}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div class={styles.clientGrid}>
              <For each={Object.entries(clientsByPlatform())}>
                {([platform, clients]) => (
                  <Show when={clients.length > 0}>
                    <div class={styles.clientGroup}>
                      <h4 class={styles.clientGroup__title}>{platformLabels[platform]}</h4>
                      <div class={styles.clientGroup__items}>
                        <For each={clients}>
                          {(client) => (
                            <label class={styles.clientItem}>
                              <input
                                type="checkbox"
                                checked={selectedClients().includes(client.id)}
                                onChange={() => handleClientToggle(client.id)}
                                disabled={isSubmitting()}
                              />
                              <span class={styles.clientItem__name}>
                                {client.name}
                                {client.version && (
                                  <span class={styles.clientItem__version}>{client.version}</span>
                                )}
                              </span>
                            </label>
                          )}
                        </For>
                      </div>
                    </div>
                  </Show>
                )}
              </For>
            </div>
          </div>

          {/* Error Message */}
          <Show when={error()}>
            <div class={styles.errorMessage}>{error()}</div>
          </Show>

          {/* Footer Actions */}
          <div class={styles.modal__footer}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting()}
            >
              <Show when={isSubmitting()} fallback="Submit Test">
                <span class={styles.spinner} />
                Submitting...
              </Show>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
