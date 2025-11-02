/**
 * Custom Error Types
 *
 * Specific error classes for different error scenarios in the email builder.
 * These provide better error handling, debugging, and user feedback.
 */

/**
 * Base error class for all builder errors
 */
export class BuilderError extends Error {
  public readonly code: string;
  public readonly context?: Record<string, unknown>;

  constructor(message: string, code: string, context?: Record<string, unknown>) {
    super(message);
    this.name = 'BuilderError';
    this.code = code;
    this.context = context;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Validation Error
 * Thrown when template or component validation fails
 */
export class ValidationError extends BuilderError {
  public readonly validationErrors: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    validationErrors: Array<{ field: string; message: string }>,
    context?: Record<string, unknown>
  ) {
    super(message, 'VALIDATION_ERROR', context);
    this.name = 'ValidationError';
    this.validationErrors = validationErrors;
  }
}

/**
 * Storage Error
 * Thrown when storage operations fail
 */
export class StorageError extends BuilderError {
  public readonly operation: 'read' | 'write' | 'delete' | 'clear';

  constructor(
    message: string,
    operation: 'read' | 'write' | 'delete' | 'clear',
    context?: Record<string, unknown>
  ) {
    super(message, 'STORAGE_ERROR', context);
    this.name = 'StorageError';
    this.operation = operation;
  }
}

/**
 * Template Not Found Error
 * Thrown when a template cannot be found
 */
export class TemplateNotFoundError extends BuilderError {
  public readonly templateId: string;

  constructor(templateId: string, context?: Record<string, unknown>) {
    super(`Template not found: ${templateId}`, 'TEMPLATE_NOT_FOUND', context);
    this.name = 'TemplateNotFoundError';
    this.templateId = templateId;
  }
}

/**
 * Component Not Found Error
 * Thrown when a component cannot be found
 */
export class ComponentNotFoundError extends BuilderError {
  public readonly componentId: string;

  constructor(componentId: string, context?: Record<string, unknown>) {
    super(`Component not found: ${componentId}`, 'COMPONENT_NOT_FOUND', context);
    this.name = 'ComponentNotFoundError';
    this.componentId = componentId;
  }
}

/**
 * Component Type Error
 * Thrown when a component type is invalid or not registered
 */
export class ComponentTypeError extends BuilderError {
  public readonly componentType: string;

  constructor(componentType: string, context?: Record<string, unknown>) {
    super(
      `Invalid or unregistered component type: ${componentType}`,
      'COMPONENT_TYPE_ERROR',
      context
    );
    this.name = 'ComponentTypeError';
    this.componentType = componentType;
  }
}

/**
 * Command Error
 * Thrown when command execution fails
 */
export class CommandError extends BuilderError {
  public readonly commandType: string;

  constructor(message: string, commandType: string, context?: Record<string, unknown>) {
    super(message, 'COMMAND_ERROR', context);
    this.name = 'CommandError';
    this.commandType = commandType;
  }
}

/**
 * Initialization Error
 * Thrown when builder initialization fails
 */
export class InitializationError extends BuilderError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'INITIALIZATION_ERROR', context);
    this.name = 'InitializationError';
  }
}

/**
 * Configuration Error
 * Thrown when configuration is invalid
 */
export class ConfigurationError extends BuilderError {
  public readonly invalidFields: string[];

  constructor(message: string, invalidFields: string[], context?: Record<string, unknown>) {
    super(message, 'CONFIGURATION_ERROR', context);
    this.name = 'ConfigurationError';
    this.invalidFields = invalidFields;
  }
}

/**
 * Export Error
 * Thrown when template export fails
 */
export class ExportError extends BuilderError {
  public readonly format: string;

  constructor(message: string, format: string, context?: Record<string, unknown>) {
    super(message, 'EXPORT_ERROR', context);
    this.name = 'ExportError';
    this.format = format;
  }
}

/**
 * Constraint Violation Error
 * Thrown when a template constraint is violated
 */
export class ConstraintViolationError extends BuilderError {
  public readonly constraintId: string;
  public readonly violations: Array<{
    field?: string;
    message: string;
    severity: string;
  }>;

  constructor(
    message: string,
    constraintId: string,
    violations: Array<{ field?: string; message: string; severity: string }>,
    context?: Record<string, unknown>
  ) {
    super(message, 'CONSTRAINT_VIOLATION', context);
    this.name = 'ConstraintViolationError';
    this.constraintId = constraintId;
    this.violations = violations;
  }
}

/**
 * Versioning Error
 * Thrown when template versioning operations fail
 */
export class VersioningError extends BuilderError {
  public readonly versionId?: string;

  constructor(message: string, versionId?: string, context?: Record<string, unknown>) {
    super(message, 'VERSIONING_ERROR', context);
    this.name = 'VersioningError';
    this.versionId = versionId;
  }
}

/**
 * Type guard to check if an error is a BuilderError
 */
export function isBuilderError(error: unknown): error is BuilderError {
  return error instanceof BuilderError;
}

/**
 * Type guard to check if an error is a ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Type guard to check if an error is a StorageError
 */
export function isStorageError(error: unknown): error is StorageError {
  return error instanceof StorageError;
}

/**
 * Type guard to check if an error is a TemplateNotFoundError
 */
export function isTemplateNotFoundError(error: unknown): error is TemplateNotFoundError {
  return error instanceof TemplateNotFoundError;
}

/**
 * Type guard to check if an error is a ComponentNotFoundError
 */
export function isComponentNotFoundError(error: unknown): error is ComponentNotFoundError {
  return error instanceof ComponentNotFoundError;
}

/**
 * Helper to create a user-friendly error message from any error
 */
export function formatErrorMessage(error: unknown): string {
  if (isBuilderError(error)) {
    return `${error.name}: ${error.message} (${error.code})`;
  }

  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  return String(error);
}

/**
 * Helper to extract error context for logging/debugging
 */
export function getErrorContext(error: unknown): Record<string, unknown> {
  if (isBuilderError(error)) {
    return {
      name: error.name,
      code: error.code,
      message: error.message,
      context: error.context,
      stack: error.stack,
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    error: String(error),
  };
}
