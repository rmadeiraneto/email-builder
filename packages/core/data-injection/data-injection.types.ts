/**
 * Data Injection System Type Definitions
 *
 * This module provides types for the data injection system,
 * including variable syntax, data sources, and processing options.
 */

/**
 * Variable types supported in templates
 */
export enum VariableType {
  /** Simple field placeholder: {{name}} */
  FIELD = 'field',
  /** Conditional block: {{#if condition}}...{{/if}} */
  CONDITIONAL = 'conditional',
  /** Loop/iteration: {{#each items}}...{{/each}} */
  LOOP = 'loop',
  /** Negated conditional: {{#unless condition}}...{{/unless}} */
  UNLESS = 'unless',
  /** Helper function: {{formatDate date}} */
  HELPER = 'helper',
}

/**
 * Represents a parsed variable token in a template
 */
export interface VariableToken {
  /** Type of variable */
  type: VariableType;
  /** Original raw text including delimiters */
  raw: string;
  /** Variable path (e.g., "user.name") */
  path: string;
  /** Starting position in source text */
  start: number;
  /** Ending position in source text */
  end: number;
  /** Arguments for helpers or conditionals */
  args?: string[];
  /** For block statements, the content inside */
  content?: string;
  /** For conditionals, the else block content */
  elseContent?: string;
  /** Nested tokens (for loops and conditionals) */
  children?: VariableToken[];
}

/**
 * Data source types
 */
export enum DataSourceType {
  /** Static JSON data */
  JSON = 'json',
  /** REST API endpoint */
  API = 'api',
  /** Custom data provider */
  CUSTOM = 'custom',
  /** Sample/mock data for preview */
  SAMPLE = 'sample',
}

/**
 * Configuration for an API data source
 */
export interface ApiDataSourceConfig {
  /** API endpoint URL */
  url: string;
  /** HTTP method (GET, POST, etc.) */
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Request headers */
  headers?: Record<string, string>;
  /** Request body (for POST, PUT, etc.) */
  body?: unknown;
  /** Path to data in response (e.g., "data.items") */
  dataPath?: string;
  /** Query parameters */
  params?: Record<string, string>;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Enable caching */
  cache?: boolean;
  /** Cache duration in milliseconds */
  cacheDuration?: number;
}

/**
 * Configuration for a JSON data source
 */
export interface JsonDataSourceConfig {
  /** Static JSON data */
  data: Record<string, unknown>;
  /** Optional validation schema */
  schema?: Record<string, unknown>;
}

/**
 * Configuration for a custom data source
 */
export interface CustomDataSourceConfig {
  /** Custom fetch function */
  fetch: () => Promise<Record<string, unknown>>;
  /** Optional validation function */
  validate?: (data: unknown) => boolean;
}

/**
 * Data source configuration
 */
export interface DataSourceConfig {
  /** Unique identifier for this data source */
  id: string;
  /** Display name */
  name: string;
  /** Data source type */
  type: DataSourceType;
  /** Type-specific configuration */
  config: ApiDataSourceConfig | JsonDataSourceConfig | CustomDataSourceConfig;
  /** Whether this is the active data source */
  active?: boolean;
  /** Optional description */
  description?: string;
  /** Created timestamp */
  createdAt?: string;
  /** Last modified timestamp */
  updatedAt?: string;
  /** Sample data for preview */
  sampleData?: Record<string, unknown>;
}

/**
 * Data validation error
 */
export interface DataValidationError {
  /** Field path that failed validation */
  field: string;
  /** Error message */
  message: string;
  /** Expected type */
  expectedType?: string;
  /** Actual type received */
  actualType?: string;
}

/**
 * Data validation result
 */
export interface DataValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Validation errors */
  errors: DataValidationError[];
  /** Warnings (non-fatal issues) */
  warnings?: string[];
}

/**
 * Template processing options
 */
export interface TemplateProcessingOptions {
  /** Strict mode (throw on missing variables) */
  strict?: boolean;
  /** Default value for missing variables */
  defaultValue?: string;
  /** Escape HTML in output */
  escapeHtml?: boolean;
  /** Custom helper functions */
  helpers?: Record<string, HelperFunction>;
  /** Remove whitespace */
  trim?: boolean;
  /** Allow partial rendering */
  partial?: boolean;
  /** Custom delimiters (default: {{ }}) */
  delimiters?: {
    open: string;
    close: string;
  };
}

/**
 * Helper function signature
 */
export type HelperFunction = (...args: unknown[]) => string | number | boolean;

/**
 * Template processing result
 */
export interface TemplateProcessingResult {
  /** Processed output */
  output: string;
  /** Variables that were used */
  usedVariables: string[];
  /** Variables that were missing */
  missingVariables: string[];
  /** Errors encountered during processing */
  errors: Array<{
    message: string;
    variable?: string;
    line?: number;
    column?: number;
  }>;
  /** Warnings */
  warnings?: string[];
  /** Processing statistics */
  stats?: {
    variablesReplaced: number;
    conditionalsEvaluated: number;
    loopsUnrolled: number;
    helpersInvoked: number;
  };
}

/**
 * Variable metadata for autocomplete/suggestions
 */
export interface VariableMetadata {
  /** Variable path */
  path: string;
  /** Variable type (string, number, etc.) */
  type: string;
  /** Description */
  description?: string;
  /** Example value */
  example?: unknown;
  /** Is required? */
  required?: boolean;
  /** Is array? */
  isArray?: boolean;
  /** Nested fields (for objects) */
  children?: VariableMetadata[];
}

/**
 * Data schema for type checking and autocomplete
 */
export interface DataSchema {
  /** Available variables */
  variables: VariableMetadata[];
  /** Schema version */
  version?: string;
  /** Schema description */
  description?: string;
}

/**
 * Built-in helper functions
 */
export enum BuiltInHelper {
  /** Format date: {{formatDate date "YYYY-MM-DD"}} */
  FORMAT_DATE = 'formatDate',
  /** Format currency: {{formatCurrency amount "USD"}} */
  FORMAT_CURRENCY = 'formatCurrency',
  /** Uppercase: {{upper text}} */
  UPPER = 'upper',
  /** Lowercase: {{lower text}} */
  LOWER = 'lower',
  /** Capitalize: {{capitalize text}} */
  CAPITALIZE = 'capitalize',
  /** Truncate: {{truncate text 100}} */
  TRUNCATE = 'truncate',
  /** Default value: {{default value "fallback"}} */
  DEFAULT = 'default',
  /** Join array: {{join items ", "}} */
  JOIN = 'join',
  /** Array length: {{length items}} */
  LENGTH = 'length',
  /** Math operations: {{add a b}}, {{subtract a b}}, etc. */
  ADD = 'add',
  SUBTRACT = 'subtract',
  MULTIPLY = 'multiply',
  DIVIDE = 'divide',
  /** Equals comparison: {{eq a b}} */
  EQUALS = 'eq',
  /** Not equals: {{ne a b}} */
  NOT_EQUALS = 'ne',
  /** Greater than: {{gt a b}} */
  GREATER_THAN = 'gt',
  /** Less than: {{lt a b}} */
  LESS_THAN = 'lt',
  /** Logical AND: {{and a b}} */
  AND = 'and',
  /** Logical OR: {{or a b}} */
  OR = 'or',
  /** Logical NOT: {{not a}} */
  NOT = 'not',
}

/**
 * Context for template rendering
 */
export interface RenderContext {
  /** Current data object */
  data: Record<string, unknown>;
  /** Parent context (for nested scopes) */
  parent?: RenderContext;
  /** Current loop index (if in loop) */
  index?: number;
  /** Current loop key (if in loop) */
  key?: string;
  /** Is this the first item in loop? */
  first?: boolean;
  /** Is this the last item in loop? */
  last?: boolean;
}

/**
 * Variable extraction result
 */
export interface VariableExtractionResult {
  /** All variables found in template */
  variables: string[];
  /** Variables grouped by type */
  byType: {
    fields: string[];
    conditionals: string[];
    loops: string[];
    helpers: string[];
  };
  /** Nested structure */
  tree: VariableToken[];
}
