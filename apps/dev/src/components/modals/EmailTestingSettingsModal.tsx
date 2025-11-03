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
            <button
              class={styles.modal__close}
              onClick={handleClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} class={styles.modal__form}>
            {/* Provider Selection */}
            <div class={styles.modal__field}>
              <label for="provider" class={styles.modal__label}>
                Service Provider
              </label>
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
              <label for="api-endpoint" class={styles.modal__label}>
                API Endpoint
              </label>
              <input
                id="api-endpoint"
                type="url"
                class={styles.modal__input}
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
              <label for="auth-method" class={styles.modal__label}>
                Authentication Method
              </label>
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
                <label for="api-key" class={styles.modal__label}>
                  API Key
                </label>
                <input
                  id="api-key"
                  type="password"
                  class={styles.modal__input}
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
                <label for="username" class={styles.modal__label}>
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  class={styles.modal__input}
                  placeholder="your-email@example.com"
                  value={username()}
                  onInput={(e) => {
                    setUsername(e.currentTarget.value);
                    setError('');
                  }}
                />
              </div>

              <div class={styles.modal__field}>
                <label for="password" class={styles.modal__label}>
                  Password / API Key
                </label>
                <input
                  id="password"
                  type="password"
                  class={styles.modal__input}
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
                <label for="oauth-token" class={styles.modal__label}>
                  OAuth Token
                </label>
                <input
                  id="oauth-token"
                  type="password"
                  class={styles.modal__input}
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
              <button
                type="button"
                class={styles.modal__testButton}
                onClick={handleTestConnection}
                disabled={testStatus() === 'testing'}
              >
                {testStatus() === 'testing' ? 'Testing...' : 'Test Connection'}
              </button>

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
                Save Configuration
              </button>
            </div>
          </form>
        </div>
      </div>
    </Show>
  );
};
