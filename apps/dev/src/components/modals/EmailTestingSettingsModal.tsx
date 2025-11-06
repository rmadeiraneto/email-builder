/**
 * Email Testing Settings Modal
 *
 * Modal for configuring external email testing service integration.
 * Supports Litmus, Email on Acid, Testi@, and custom services.
 */

import { type Component, createSignal, Show, createEffect } from 'solid-js';
import type {
  EmailTestingProvider,
  AuthenticationMethod,
  EmailTestingConfig,
} from '@email-builder/core';
import {
  getDefaultApiEndpoint,
  getRecommendedAuthMethod,
  createEmailTestingService,
} from '@email-builder/core';
import styles from './EmailTestingSettingsModal.module.scss';
import { Button, Input, Label } from '@email-builder/ui-solid/atoms';

export interface EmailTestingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: EmailTestingConfig) => void;
  initialConfig?: EmailTestingConfig;
}

export const EmailTestingSettingsModal: Component<EmailTestingSettingsModalProps> = (props) => {
  // Form state
  const [provider, setProvider] = createSignal<EmailTestingProvider>(
    props.initialConfig?.provider ?? 'litmus'
  );
  const [apiEndpoint, setApiEndpoint] = createSignal(
    props.initialConfig?.apiEndpoint ?? getDefaultApiEndpoint('litmus')
  );
  const [authMethod, setAuthMethod] = createSignal<AuthenticationMethod>(
    props.initialConfig?.authMethod ?? getRecommendedAuthMethod('litmus')
  );
  const [apiKey, setApiKey] = createSignal(props.initialConfig?.apiKey ?? '');
  const [username, setUsername] = createSignal(props.initialConfig?.username ?? '');
  const [password, setPassword] = createSignal(props.initialConfig?.password ?? '');
  const [oauthToken, setOauthToken] = createSignal(props.initialConfig?.oauthToken ?? '');

  // UI state
  const [error, setError] = createSignal('');
  const [testStatus, setTestStatus] = createSignal<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = createSignal('');

  // Update defaults when provider changes
  createEffect(() => {
    const selectedProvider = provider();
    setApiEndpoint(getDefaultApiEndpoint(selectedProvider));
    setAuthMethod(getRecommendedAuthMethod(selectedProvider));
    setError('');
    setTestStatus('idle');
    setTestMessage('');
  });

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Testing connection...');
    setError('');

    const config: EmailTestingConfig = {
      provider: provider(),
      apiEndpoint: apiEndpoint(),
      authMethod: authMethod(),
      apiKey: apiKey(),
      username: username(),
      password: password(),
      oauthToken: oauthToken(),
    };

    try {
      const service = createEmailTestingService(config);
      const result = await service.testConnection();

      if (result.success) {
        setTestStatus('success');
        setTestMessage(
          `Connected successfully to ${result.serviceInfo?.name ?? 'service'}!`
        );
      } else {
        setTestStatus('error');
        setTestMessage(result.error ?? 'Connection failed');
      }
    } catch (err) {
      setTestStatus('error');
      setTestMessage(err instanceof Error ? err.message : 'Connection failed');
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    // Validate required fields
    if (!apiEndpoint().trim()) {
      setError('API endpoint is required');
      return;
    }

    // Validate credentials based on auth method
    const method = authMethod();
    if (method === 'api-key' && !apiKey().trim()) {
      setError('API key is required');
      return;
    }

    if (method === 'basic' && (!username().trim() || !password().trim())) {
      setError('Username and password are required');
      return;
    }

    if (method === 'oauth' && !oauthToken().trim()) {
      setError('OAuth token is required');
      return;
    }

    const config: EmailTestingConfig = {
      provider: provider(),
      apiEndpoint: apiEndpoint().trim(),
      authMethod: authMethod(),
      apiKey: apiKey().trim() || undefined,
      username: username().trim() || undefined,
      password: password().trim() || undefined,
      oauthToken: oauthToken().trim() || undefined,
    };

    props.onSave(config);
    handleClose();
  };

  const handleClose = () => {
    setError('');
    setTestStatus('idle');
    setTestMessage('');
    props.onClose();
  };

  return (
    <Show when={props.isOpen}>
      <div class={styles.modal}>
        <div class={styles.modal__overlay} onClick={handleClose} />
        <div class={styles.modal__content}>
          <div class={styles.modal__header}>
            <h2 class={styles.modal__title}>Email Testing Service Settings</h2>
            <Button
              class={styles.modal__close}
              onClick={handleClose}
              aria-label="Close modal"
              variant="ghost"
              icon="close-line"
            />
          </div>

          <form onSubmit={handleSubmit} class={styles.modal__form}>
            {/* Provider Selection */}
            <div class={styles.modal__field}>
              <Label for="provider">
                Service Provider
              </Label>
              <select
                id="provider"
                class={styles.modal__select}
                value={provider()}
                onChange={(e) => setProvider(e.currentTarget.value as EmailTestingProvider)}
              >
                <option value="litmus">Litmus</option>
                <option value="email-on-acid">Email on Acid</option>
                <option value="testi">Testi@</option>
                <option value="custom">Custom Service</option>
              </select>
            </div>

            {/* API Endpoint */}
            <div class={styles.modal__field}>
              <Label for="api-endpoint">
                API Endpoint
              </Label>
              <Input
                id="api-endpoint"
                type="url"
                placeholder="https://api.litmus.com/v1"
                value={apiEndpoint()}
                onInput={(e) => {
                  setApiEndpoint(e.currentTarget.value);
                  setError('');
                }}
              />
            </div>

            {/* Authentication Method */}
            <div class={styles.modal__field}>
              <Label for="auth-method">
                Authentication Method
              </Label>
              <select
                id="auth-method"
                class={styles.modal__select}
                value={authMethod()}
                onChange={(e) => setAuthMethod(e.currentTarget.value as AuthenticationMethod)}
              >
                <option value="api-key">API Key</option>
                <option value="bearer">Bearer Token</option>
                <option value="basic">Basic Auth</option>
                <option value="oauth">OAuth</option>
              </select>
            </div>

            {/* Conditional Credential Fields */}
            <Show when={authMethod() === 'api-key' || authMethod() === 'bearer'}>
              <div class={styles.modal__field}>
                <Label for="api-key">
                  API Key
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey()}
                  onInput={(e) => {
                    setApiKey(e.currentTarget.value);
                    setError('');
                  }}
                />
              </div>
            </Show>

            <Show when={authMethod() === 'basic'}>
              <div class={styles.modal__field}>
                <Label for="username">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="your-email@example.com"
                  value={username()}
                  onInput={(e) => {
                    setUsername(e.currentTarget.value);
                    setError('');
                  }}
                />
              </div>

              <div class={styles.modal__field}>
                <Label for="password">
                  Password / API Key
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password or API key"
                  value={password()}
                  onInput={(e) => {
                    setPassword(e.currentTarget.value);
                    setError('');
                  }}
                />
              </div>
            </Show>

            <Show when={authMethod() === 'oauth'}>
              <div class={styles.modal__field}>
                <Label for="oauth-token">
                  OAuth Token
                </Label>
                <Input
                  id="oauth-token"
                  type="password"
                  placeholder="Enter your OAuth token"
                  value={oauthToken()}
                  onInput={(e) => {
                    setOauthToken(e.currentTarget.value);
                    setError('');
                  }}
                />
              </div>
            </Show>

            {/* Test Connection Section */}
            <div class={styles.modal__testSection}>
              <Button
                type="button"
                variant="secondary"
                onClick={handleTestConnection}
                disabled={testStatus() === 'testing'}
              >
                {testStatus() === 'testing' ? 'Testing...' : 'Test Connection'}
              </Button>

              <Show when={testStatus() !== 'idle'}>
                <div
                  class={styles.modal__testResult}
                  classList={{
                    [styles['modal__testResult--success']]: testStatus() === 'success',
                    [styles['modal__testResult--error']]: testStatus() === 'error',
                  }}
                >
                  {testMessage()}
                </div>
              </Show>
            </div>

            {/* Error Message */}
            <Show when={error()}>
              <p class={styles.modal__error}>{error()}</p>
            </Show>

            {/* Actions */}
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
                Save Configuration
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Show>
  );
};
