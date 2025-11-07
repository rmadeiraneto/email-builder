/**
 * Data Source Configuration Modal
 *
 * Modal for configuring data sources for template variable injection.
 * Supports JSON, API, and custom data sources.
 */

import { type Component, createSignal, Show, For } from 'solid-js';
import type {
  DataSourceConfig,
  DataSourceType,
  ApiDataSourceConfig,
  JsonDataSourceConfig,
} from '@email-builder/core';
import { DataSourceType as DSType } from '@email-builder/core';
import styles from './DataSourceConfigModal.module.scss';
import { Button, Input, Label } from '@email-builder/ui-solid/atoms';

export interface DataSourceConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: DataSourceConfig) => void;
  onDelete?: (id: string) => void;
  initialConfig?: DataSourceConfig;
  dataSources?: DataSourceConfig[];
}

export const DataSourceConfigModal: Component<DataSourceConfigModalProps> = (props) => {
  // Determine if we're editing or creating
  const isEditing = () => !!props.initialConfig;

  // Form state
  const [id, setId] = createSignal(props.initialConfig?.id ?? `ds-${Date.now()}`);
  const [name, setName] = createSignal(props.initialConfig?.name ?? '');
  const [description, setDescription] = createSignal(props.initialConfig?.description ?? '');
  const [type, setType] = createSignal<DataSourceType>(props.initialConfig?.type ?? DSType.JSON);
  const [active, setActive] = createSignal(props.initialConfig?.active ?? false);

  // JSON data source fields
  const [jsonData, setJsonData] = createSignal(
    props.initialConfig?.type === DSType.JSON
      ? JSON.stringify((props.initialConfig.config as JsonDataSourceConfig).data, null, 2)
      : '{\n  "name": "John Doe",\n  "email": "john@example.com"\n}'
  );

  // API data source fields
  const [apiUrl, setApiUrl] = createSignal(
    props.initialConfig?.type === DSType.API
      ? (props.initialConfig.config as ApiDataSourceConfig).url
      : ''
  );
  const [apiMethod, setApiMethod] = createSignal<'GET' | 'POST'>(
    props.initialConfig?.type === DSType.API
      ? (props.initialConfig.config as ApiDataSourceConfig).method ?? 'GET'
      : 'GET'
  );
  const [apiDataPath, setApiDataPath] = createSignal(
    props.initialConfig?.type === DSType.API
      ? (props.initialConfig.config as ApiDataSourceConfig).dataPath ?? ''
      : ''
  );
  const [apiHeaders, setApiHeaders] = createSignal(
    props.initialConfig?.type === DSType.API
      ? JSON.stringify((props.initialConfig.config as ApiDataSourceConfig).headers ?? {}, null, 2)
      : '{}'
  );

  // Sample data
  const [sampleData, setSampleData] = createSignal(
    props.initialConfig?.sampleData
      ? JSON.stringify(props.initialConfig.sampleData, null, 2)
      : jsonData()
  );

  // UI state
  const [error, setError] = createSignal('');
  const [testStatus, setTestStatus] = createSignal<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = createSignal('');

  const handleSave = () => {
    setError('');

    // Validate
    if (!name().trim()) {
      setError('Name is required');
      return;
    }

    if (type() === DSType.JSON) {
      try {
        JSON.parse(jsonData());
      } catch (e) {
        setError('Invalid JSON data');
        return;
      }
    } else if (type() === DSType.API) {
      if (!apiUrl().trim()) {
        setError('API URL is required');
        return;
      }

      try {
        new URL(apiUrl());
      } catch (e) {
        setError('Invalid API URL');
        return;
      }

      // Validate headers JSON
      try {
        JSON.parse(apiHeaders());
      } catch (e) {
        setError('Invalid headers JSON');
        return;
      }
    }

    // Validate sample data
    try {
      JSON.parse(sampleData());
    } catch (e) {
      setError('Invalid sample data JSON');
      return;
    }

    let config: DataSourceConfig;

    if (type() === DSType.JSON) {
      config = {
        id: id(),
        name: name(),
        description: description(),
        type: DSType.JSON,
        config: {
          data: JSON.parse(jsonData()),
        } as JsonDataSourceConfig,
        active: active(),
        sampleData: JSON.parse(sampleData()),
        createdAt: props.initialConfig?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else if (type() === DSType.API) {
      config = {
        id: id(),
        name: name(),
        description: description(),
        type: DSType.API,
        config: {
          url: apiUrl(),
          method: apiMethod(),
          dataPath: apiDataPath() || undefined,
          headers: JSON.parse(apiHeaders()),
        } as ApiDataSourceConfig,
        active: active(),
        sampleData: JSON.parse(sampleData()),
        createdAt: props.initialConfig?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      setError('Custom data sources not yet supported');
      return;
    }

    props.onSave(config);
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Testing data source...');
    setError('');

    try {
      if (type() === DSType.JSON) {
        // For JSON, just validate the data
        const data = JSON.parse(jsonData());
        setTestStatus('success');
        setTestMessage(`JSON data is valid. Found ${Object.keys(data).length} top-level keys.`);
      } else if (type() === DSType.API) {
        // For API, try to fetch data
        const url = new URL(apiUrl());
        const headers = JSON.parse(apiHeaders());

        const response = await fetch(url.toString(), {
          method: apiMethod(),
          headers,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        let data = await response.json();

        // Navigate to data path if specified
        if (apiDataPath()) {
          const parts = apiDataPath().split('.');
          for (const part of parts) {
            if (data && typeof data === 'object') {
              data = data[part];
            } else {
              throw new Error(`Invalid data path: ${apiDataPath()}`);
            }
          }
        }

        setTestStatus('success');
        setTestMessage(
          `API connection successful. Received ${typeof data === 'object' ? Object.keys(data).length : 0} keys.`
        );

        // Auto-populate sample data
        setSampleData(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setTestStatus('error');
      setTestMessage(err instanceof Error ? err.message : 'Unknown error');
      setError(err instanceof Error ? err.message : 'Test failed');
    }
  };

  const handleDelete = () => {
    if (isEditing() && props.onDelete) {
      if (confirm(`Are you sure you want to delete "${name()}"?`)) {
        props.onDelete(id());
        props.onClose();
      }
    }
  };

  if (!props.isOpen) return null;

  return (
    <div class={styles.overlay} onClick={props.onClose}>
      <div class={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div class={styles.header}>
          <h2>{isEditing() ? 'Edit Data Source' : 'Add Data Source'}</h2>
          <button class={styles.closeButton} onClick={props.onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div class={styles.content}>
          {/* Basic Info */}
          <div class={styles.section}>
            <Label>
              Name <span class={styles.required}>*</span>
            </Label>
            <Input
              type="text"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              placeholder="My Data Source"
            />
          </div>

          <div class={styles.section}>
            <Label>Description</Label>
            <Input
              type="text"
              value={description()}
              onInput={(e) => setDescription(e.currentTarget.value)}
              placeholder="Optional description"
            />
          </div>

          <div class={styles.section}>
            <Label>
              Type <span class={styles.required}>*</span>
            </Label>
            <select
              class={styles.select}
              value={type()}
              onChange={(e) => setType(e.currentTarget.value as DataSourceType)}
            >
              <option value={DSType.JSON}>JSON (Static Data)</option>
              <option value={DSType.API}>API (REST Endpoint)</option>
              <option value={DSType.SAMPLE}>Sample (Preview Only)</option>
            </select>
          </div>

          <div class={styles.section}>
            <label class={styles.checkbox}>
              <input
                type="checkbox"
                checked={active()}
                onChange={(e) => setActive(e.currentTarget.checked)}
              />
              <span>Set as active data source</span>
            </label>
          </div>

          {/* Type-specific configuration */}
          <Show when={type() === DSType.JSON}>
            <div class={styles.section}>
              <Label>
                JSON Data <span class={styles.required}>*</span>
              </Label>
              <textarea
                class={styles.textarea}
                value={jsonData()}
                onInput={(e) => setJsonData(e.currentTarget.value)}
                placeholder='{"name": "John", "email": "john@example.com"}'
                rows={10}
              />
              <div class={styles.hint}>Enter valid JSON data</div>
            </div>
          </Show>

          <Show when={type() === DSType.API}>
            <div class={styles.section}>
              <Label>
                API URL <span class={styles.required}>*</span>
              </Label>
              <Input
                type="url"
                value={apiUrl()}
                onInput={(e) => setApiUrl(e.currentTarget.value)}
                placeholder="https://api.example.com/data"
              />
            </div>

            <div class={styles.section}>
              <Label>HTTP Method</Label>
              <select
                class={styles.select}
                value={apiMethod()}
                onChange={(e) => setApiMethod(e.currentTarget.value as 'GET' | 'POST')}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>

            <div class={styles.section}>
              <Label>Data Path (optional)</Label>
              <Input
                type="text"
                value={apiDataPath()}
                onInput={(e) => setApiDataPath(e.currentTarget.value)}
                placeholder="data.items"
              />
              <div class={styles.hint}>
                Path to data in response (e.g., "data.items" for nested data)
              </div>
            </div>

            <div class={styles.section}>
              <Label>Headers (JSON)</Label>
              <textarea
                class={styles.textarea}
                value={apiHeaders()}
                onInput={(e) => setApiHeaders(e.currentTarget.value)}
                placeholder='{"Authorization": "Bearer token"}'
                rows={4}
              />
            </div>
          </Show>

          {/* Sample Data */}
          <div class={styles.section}>
            <Label>
              Sample Data <span class={styles.required}>*</span>
            </Label>
            <textarea
              class={styles.textarea}
              value={sampleData()}
              onInput={(e) => setSampleData(e.currentTarget.value)}
              placeholder='{"name": "John", "email": "john@example.com"}'
              rows={8}
            />
            <div class={styles.hint}>
              Sample data used for previews and variable suggestions
            </div>
          </div>

          {/* Test Connection */}
          <div class={styles.section}>
            <Button onClick={handleTestConnection} disabled={testStatus() === 'testing'}>
              {testStatus() === 'testing' ? 'Testing...' : 'Test Connection'}
            </Button>
            <Show when={testStatus() !== 'idle'}>
              <div
                class={
                  testStatus() === 'success'
                    ? styles.testSuccess
                    : testStatus() === 'error'
                    ? styles.testError
                    : styles.testInfo
                }
              >
                {testMessage()}
              </div>
            </Show>
          </div>

          {/* Error Message */}
          <Show when={error()}>
            <div class={styles.error}>{error()}</div>
          </Show>
        </div>

        <div class={styles.footer}>
          <div class={styles.leftActions}>
            <Show when={isEditing() && props.onDelete}>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </Show>
          </div>
          <div class={styles.rightActions}>
            <Button variant="secondary" onClick={props.onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isEditing() ? 'Save Changes' : 'Add Data Source'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
