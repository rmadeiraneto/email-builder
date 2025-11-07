/**
 * Data Source Manager
 *
 * Manages data sources for template processing, including JSON,
 * API endpoints, and custom data providers.
 */

import {
  DataSourceType,
  DataSourceConfig,
  ApiDataSourceConfig,
  JsonDataSourceConfig,
  CustomDataSourceConfig,
  DataValidationResult,
  DataValidationError,
  DataSchema,
  VariableMetadata,
} from './data-injection.types';

/**
 * Manager for data sources
 */
export class DataSourceManager {
  private dataSources: Map<string, DataSourceConfig> = new Map();
  private activeDataSourceId: string | null = null;
  private dataCache: Map<string, { data: Record<string, unknown>; timestamp: number }> = new Map();

  /**
   * Add a data source
   */
  public addDataSource(config: DataSourceConfig): void {
    this.dataSources.set(config.id, config);

    // If this is the first data source or marked as active, set it as active
    if (this.dataSources.size === 1 || config.active) {
      this.activeDataSourceId = config.id;
    }
  }

  /**
   * Remove a data source
   */
  public removeDataSource(id: string): boolean {
    const result = this.dataSources.delete(id);

    // Clear from cache
    this.dataCache.delete(id);

    // If we removed the active data source, set another as active
    if (this.activeDataSourceId === id) {
      const firstSource = Array.from(this.dataSources.values())[0];
      this.activeDataSourceId = firstSource?.id || null;
    }

    return result;
  }

  /**
   * Update a data source
   */
  public updateDataSource(id: string, updates: Partial<DataSourceConfig>): boolean {
    const existing = this.dataSources.get(id);

    if (!existing) {
      return false;
    }

    const updated: DataSourceConfig = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.dataSources.set(id, updated);

    // Clear cache for this source since config changed
    this.dataCache.delete(id);

    return true;
  }

  /**
   * Get a data source by ID
   */
  public getDataSource(id: string): DataSourceConfig | undefined {
    return this.dataSources.get(id);
  }

  /**
   * Get all data sources
   */
  public getAllDataSources(): DataSourceConfig[] {
    return Array.from(this.dataSources.values());
  }

  /**
   * Set the active data source
   */
  public setActiveDataSource(id: string): boolean {
    if (!this.dataSources.has(id)) {
      return false;
    }

    this.activeDataSourceId = id;
    return true;
  }

  /**
   * Get the active data source
   */
  public getActiveDataSource(): DataSourceConfig | null {
    if (!this.activeDataSourceId) {
      return null;
    }

    return this.dataSources.get(this.activeDataSourceId) || null;
  }

  /**
   * Fetch data from the active data source
   */
  public async fetchActiveData(): Promise<Record<string, unknown>> {
    if (!this.activeDataSourceId) {
      throw new Error('No active data source');
    }

    return this.fetchData(this.activeDataSourceId);
  }

  /**
   * Fetch data from a specific data source
   */
  public async fetchData(id: string): Promise<Record<string, unknown>> {
    const source = this.dataSources.get(id);

    if (!source) {
      throw new Error(`Data source not found: ${id}`);
    }

    // Check cache first
    const cached = this.dataCache.get(id);
    const apiConfig = source.config as ApiDataSourceConfig;

    if (cached && apiConfig.cache) {
      const age = Date.now() - cached.timestamp;
      const maxAge = apiConfig.cacheDuration || 60000; // Default 1 minute

      if (age < maxAge) {
        return cached.data;
      }
    }

    // Fetch fresh data
    let data: Record<string, unknown>;

    switch (source.type) {
      case DataSourceType.JSON:
        data = await this.fetchJsonData(source.config as JsonDataSourceConfig);
        break;

      case DataSourceType.API:
        data = await this.fetchApiData(source.config as ApiDataSourceConfig);
        break;

      case DataSourceType.CUSTOM:
        data = await this.fetchCustomData(source.config as CustomDataSourceConfig);
        break;

      case DataSourceType.SAMPLE:
        data = source.sampleData || {};
        break;

      default:
        throw new Error(`Unknown data source type: ${source.type}`);
    }

    // Cache the data
    this.dataCache.set(id, {
      data,
      timestamp: Date.now(),
    });

    return data;
  }

  /**
   * Fetch data from a JSON data source
   */
  private async fetchJsonData(config: JsonDataSourceConfig): Promise<Record<string, unknown>> {
    // JSON data is already in memory
    return config.data;
  }

  /**
   * Fetch data from an API data source
   */
  private async fetchApiData(config: ApiDataSourceConfig): Promise<Record<string, unknown>> {
    const url = new URL(config.url);

    // Add query parameters
    if (config.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const options: RequestInit = {
      method: config.method || 'GET',
      headers: config.headers || {},
    };

    // Add body for non-GET requests
    if (config.body && config.method !== 'GET') {
      options.body = JSON.stringify(config.body);
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
      };
    }

    // Set timeout
    const controller = new AbortController();
    const timeout = config.timeout || 30000; // Default 30 seconds

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url.toString(), {
        ...options,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let data = await response.json();

      // Navigate to data path if specified
      if (config.dataPath) {
        const parts = config.dataPath.split('.');
        for (const part of parts) {
          if (data && typeof data === 'object') {
            data = data[part];
          } else {
            throw new Error(`Invalid data path: ${config.dataPath}`);
          }
        }
      }

      return data as Record<string, unknown>;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Fetch data from a custom data source
   */
  private async fetchCustomData(config: CustomDataSourceConfig): Promise<Record<string, unknown>> {
    const data = await config.fetch();

    // Validate if validation function provided
    if (config.validate && !config.validate(data)) {
      throw new Error('Custom data source validation failed');
    }

    return data;
  }

  /**
   * Validate data against a schema
   */
  public validateData(
    data: Record<string, unknown>,
    schema: DataSchema
  ): DataValidationResult {
    const errors: DataValidationError[] = [];
    const warnings: string[] = [];

    // Validate each variable in the schema
    for (const variable of schema.variables) {
      this.validateVariable(data, variable, errors, warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate a single variable
   */
  private validateVariable(
    data: Record<string, unknown>,
    variable: VariableMetadata,
    errors: DataValidationError[],
    warnings: string[]
  ): void {
    const parts = variable.path.split('.');
    let current: any = data;

    // Navigate to the variable
    for (const part of parts) {
      if (current === undefined || current === null) {
        if (variable.required) {
          errors.push({
            field: variable.path,
            message: `Required field missing: ${variable.path}`,
          });
        } else {
          warnings.push(`Optional field missing: ${variable.path}`);
        }
        return;
      }

      current = current[part];
    }

    // Check if exists
    if (current === undefined || current === null) {
      if (variable.required) {
        errors.push({
          field: variable.path,
          message: `Required field missing: ${variable.path}`,
        });
      } else {
        warnings.push(`Optional field missing: ${variable.path}`);
      }
      return;
    }

    // Check type
    const actualType = Array.isArray(current) ? 'array' : typeof current;
    const expectedType = variable.isArray ? 'array' : variable.type;

    if (actualType !== expectedType) {
      errors.push({
        field: variable.path,
        message: `Type mismatch for ${variable.path}`,
        expectedType,
        actualType,
      });
    }

    // Validate children for objects
    if (variable.children && typeof current === 'object' && !Array.isArray(current)) {
      for (const child of variable.children) {
        this.validateVariable(current, child, errors, warnings);
      }
    }
  }

  /**
   * Generate a schema from sample data
   */
  public generateSchema(data: Record<string, unknown>, description?: string): DataSchema {
    const variables = this.extractVariables(data, '');

    return {
      variables,
      version: '1.0',
      description,
    };
  }

  /**
   * Extract variables from data recursively
   */
  private extractVariables(
    data: Record<string, unknown>,
    prefix: string
  ): VariableMetadata[] {
    const variables: VariableMetadata[] = [];

    for (const [key, value] of Object.entries(data)) {
      const path = prefix ? `${prefix}.${key}` : key;
      const type = Array.isArray(value) ? 'array' : typeof value;

      const metadata: VariableMetadata = {
        path,
        type: type === 'array' ? typeof value[0] : type,
        example: value,
        isArray: Array.isArray(value),
      };

      // Recursively extract children for objects
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        metadata.children = this.extractVariables(value as Record<string, unknown>, path);
      }

      variables.push(metadata);
    }

    return variables;
  }

  /**
   * Test connection to a data source
   */
  public async testConnection(id: string): Promise<{
    success: boolean;
    message: string;
    data?: Record<string, unknown>;
  }> {
    try {
      const data = await this.fetchData(id);

      return {
        success: true,
        message: 'Connection successful',
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Clear all cached data
   */
  public clearCache(): void {
    this.dataCache.clear();
  }

  /**
   * Clear cache for a specific data source
   */
  public clearCacheForSource(id: string): void {
    this.dataCache.delete(id);
  }

  /**
   * Get sample data for preview
   */
  public getSampleData(id?: string): Record<string, unknown> {
    let source: DataSourceConfig | null = null;

    if (id) {
      source = this.dataSources.get(id) || null;
    } else {
      source = this.getActiveDataSource();
    }

    return source?.sampleData || {};
  }

  /**
   * Export data sources configuration
   */
  public exportConfig(): DataSourceConfig[] {
    return Array.from(this.dataSources.values());
  }

  /**
   * Import data sources configuration
   */
  public importConfig(configs: DataSourceConfig[]): void {
    for (const config of configs) {
      this.addDataSource(config);
    }
  }
}
