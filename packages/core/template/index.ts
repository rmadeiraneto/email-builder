/**
 * Template Management Module
 *
 * Exports all template-related services and utilities
 */

export { ComponentTreeBuilder } from './ComponentTreeBuilder';
export { TemplateValidator } from './TemplateValidator';
export { TemplateStorage, TemplateStorageError } from './TemplateStorage';
export {
  TemplateManager,
  TemplateManagerError,
  TemplateManagerEvent,
  type CreateTemplateOptions,
  type UpdateTemplateOptions,
} from './TemplateManager';
export { TemplateExporter, type ExportResult } from './TemplateExporter';

// Template Composition
export {
  TemplateComposer,
  createTemplate,
  createEmptyEmailTemplate,
  createEmptyWebTemplate,
  cloneTemplate,
  mergeTemplates,
  type TemplateComposerOptions,
} from './TemplateComposer';

// Template Versioning & Migration
export {
  TemplateVersionManager,
  TemplateMigrationManager,
  createBackwardCompatibilityWrapper,
  needsMigration,
  getVersionHistory,
  addVersionHistory,
  migration_1_0_0_to_1_1_0,
  migration_1_1_0_to_2_0_0,
  type Version,
  type VersionComparison,
  type MigrationFunction,
  type Migration,
} from './TemplateVersioning';

// Template Constraints & Policies
export {
  TemplateConstraintsManager,
  createDefaultConstraintsManager,
  maxComponentsConstraint,
  maxNestingDepthConstraint,
  imageAltTextConstraint,
  linkTextConstraint,
  colorContrastConstraint,
  emailWidthConstraint,
  minComponentsConstraint,
  emailBestPracticesPolicy,
  accessibilityPolicyA,
  performancePolicy,
  strictPolicy,
  ConstraintSeverity,
  type ConstraintViolation,
  type ConstraintValidationResult,
  type TemplateConstraint,
  type TemplatePolicy,
} from './TemplateConstraints';
