/**
 * Template Versioning & Migration
 *
 * Handles semantic versioning and template migrations between versions
 */

import type { Template } from '../types/template.types';

/**
 * Version parts
 */
export interface Version {
  major: number;
  minor: number;
  patch: number;
}

/**
 * Version comparison result
 */
export type VersionComparison = 'greater' | 'equal' | 'less';

/**
 * Migration function
 */
export type MigrationFunction = (template: Template) => Template;

/**
 * Migration definition
 */
export interface Migration {
  fromVersion: string;
  toVersion: string;
  description: string;
  migrate: MigrationFunction;
}

/**
 * Template Version Manager
 *
 * Manages semantic versioning for templates
 */
export class TemplateVersionManager {
  /**
   * Parse version string to Version object
   */
  static parseVersion(versionString: string): Version {
    const parts = versionString.split('.');

    if (parts.length !== 3) {
      throw new Error(
        `Invalid version format: ${versionString}. Expected format: X.Y.Z`
      );
    }

    const [majorStr, minorStr, patchStr] = parts;
    const major = Number(majorStr);
    const minor = Number(minorStr);
    const patch = Number(patchStr);

    if (isNaN(major) || isNaN(minor) || isNaN(patch)) {
      throw new Error(`Invalid version format: ${versionString}`);
    }

    return { major, minor, patch };
  }

  /**
   * Format Version object to string
   */
  static formatVersion(version: Version): string {
    return `${version.major}.${version.minor}.${version.patch}`;
  }

  /**
   * Compare two versions
   *
   * @returns 'greater' if v1 > v2, 'equal' if v1 === v2, 'less' if v1 < v2
   */
  static compareVersions(v1: string, v2: string): VersionComparison {
    const ver1 = this.parseVersion(v1);
    const ver2 = this.parseVersion(v2);

    if (ver1.major > ver2.major) return 'greater';
    if (ver1.major < ver2.major) return 'less';

    if (ver1.minor > ver2.minor) return 'greater';
    if (ver1.minor < ver2.minor) return 'less';

    if (ver1.patch > ver2.patch) return 'greater';
    if (ver1.patch < ver2.patch) return 'less';

    return 'equal';
  }

  /**
   * Check if version v1 is greater than v2
   */
  static isGreaterThan(v1: string, v2: string): boolean {
    return this.compareVersions(v1, v2) === 'greater';
  }

  /**
   * Check if version v1 is less than v2
   */
  static isLessThan(v1: string, v2: string): boolean {
    return this.compareVersions(v1, v2) === 'less';
  }

  /**
   * Check if versions are equal
   */
  static isEqual(v1: string, v2: string): boolean {
    return this.compareVersions(v1, v2) === 'equal';
  }

  /**
   * Increment major version (breaking changes)
   */
  static incrementMajor(versionString: string): string {
    const version = this.parseVersion(versionString);
    return this.formatVersion({
      major: version.major + 1,
      minor: 0,
      patch: 0,
    });
  }

  /**
   * Increment minor version (new features, backward compatible)
   */
  static incrementMinor(versionString: string): string {
    const version = this.parseVersion(versionString);
    return this.formatVersion({
      major: version.major,
      minor: version.minor + 1,
      patch: 0,
    });
  }

  /**
   * Increment patch version (bug fixes, backward compatible)
   */
  static incrementPatch(versionString: string): string {
    const version = this.parseVersion(versionString);
    return this.formatVersion({
      major: version.major,
      minor: version.minor,
      patch: version.patch + 1,
    });
  }

  /**
   * Check if two versions are compatible (same major version)
   */
  static areCompatible(v1: string, v2: string): boolean {
    const ver1 = this.parseVersion(v1);
    const ver2 = this.parseVersion(v2);
    return ver1.major === ver2.major;
  }

  /**
   * Get the difference between two versions
   */
  static getVersionDiff(from: string, to: string): {
    type: 'major' | 'minor' | 'patch' | 'none';
    difference: number;
  } {
    const v1 = this.parseVersion(from);
    const v2 = this.parseVersion(to);

    if (v2.major !== v1.major) {
      return { type: 'major', difference: v2.major - v1.major };
    }

    if (v2.minor !== v1.minor) {
      return { type: 'minor', difference: v2.minor - v1.minor };
    }

    if (v2.patch !== v1.patch) {
      return { type: 'patch', difference: v2.patch - v1.patch };
    }

    return { type: 'none', difference: 0 };
  }
}

/**
 * Template Migration Manager
 *
 * Manages template migrations between versions
 */
export class TemplateMigrationManager {
  private migrations: Map<string, Migration> = new Map();

  /**
   * Register a migration
   */
  registerMigration(migration: Migration): void {
    const key = `${migration.fromVersion}->${migration.toVersion}`;
    this.migrations.set(key, migration);
  }

  /**
   * Register multiple migrations
   */
  registerMigrations(migrations: Migration[]): void {
    migrations.forEach((migration) => this.registerMigration(migration));
  }

  /**
   * Get migration path from one version to another
   */
  getMigrationPath(fromVersion: string, toVersion: string): Migration[] {
    const path: Migration[] = [];
    let currentVersion = fromVersion;

    // Safety limit to prevent infinite loops
    let iterations = 0;
    const maxIterations = 100;

    while (
      TemplateVersionManager.isLessThan(currentVersion, toVersion) &&
      iterations < maxIterations
    ) {
      let foundMigration = false;

      // Try to find a direct migration
      for (const migration of this.migrations.values()) {
        if (migration.fromVersion === currentVersion) {
          // Check if this migration gets us closer to target
          if (
            TemplateVersionManager.isLessThan(
              migration.toVersion,
              toVersion
            ) ||
            TemplateVersionManager.isEqual(migration.toVersion, toVersion)
          ) {
            path.push(migration);
            currentVersion = migration.toVersion;
            foundMigration = true;
            break;
          }
        }
      }

      if (!foundMigration) {
        throw new Error(
          `No migration path found from ${fromVersion} to ${toVersion}. Stopped at ${currentVersion}`
        );
      }

      iterations++;
    }

    if (iterations >= maxIterations) {
      throw new Error(
        `Migration path exceeded maximum iterations (${maxIterations}). Possible circular dependency.`
      );
    }

    return path;
  }

  /**
   * Migrate template to a specific version
   */
  migrate(template: Template, targetVersion: string): Template {
    const currentVersion = template.metadata.version;

    // Already at target version
    if (TemplateVersionManager.isEqual(currentVersion, targetVersion)) {
      return template;
    }

    // Can't migrate to older version
    if (TemplateVersionManager.isLessThan(targetVersion, currentVersion)) {
      throw new Error(
        `Cannot migrate template to older version. Current: ${currentVersion}, Target: ${targetVersion}`
      );
    }

    // Get migration path
    const migrationPath = this.getMigrationPath(currentVersion, targetVersion);

    // Apply migrations in sequence
    let migratedTemplate = template;
    for (const migration of migrationPath) {
      migratedTemplate = migration.migrate(migratedTemplate);
      migratedTemplate.metadata.version = migration.toVersion;
      migratedTemplate.metadata.updatedAt = Date.now();
    }

    return migratedTemplate;
  }

  /**
   * Check if migration is possible
   */
  canMigrate(fromVersion: string, toVersion: string): boolean {
    try {
      this.getMigrationPath(fromVersion, toVersion);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all registered migrations
   */
  getAllMigrations(): Migration[] {
    return Array.from(this.migrations.values());
  }

  /**
   * Clear all migrations
   */
  clearMigrations(): void {
    this.migrations.clear();
  }
}

/**
 * Create a backward compatibility wrapper for old template versions
 */
export function createBackwardCompatibilityWrapper(
  template: Template,
  targetVersion: string
): Template {
  const currentVersion = template.metadata.version;

  // Add compatibility metadata
  return {
    ...template,
    customData: {
      ...template.customData,
      __compatibility: {
        originalVersion: currentVersion,
        targetVersion,
        wrappedAt: Date.now(),
      },
    },
  };
}

/**
 * Check if template needs migration
 */
export function needsMigration(
  template: Template,
  currentSystemVersion: string
): boolean {
  return TemplateVersionManager.isLessThan(
    template.metadata.version,
    currentSystemVersion
  );
}

/**
 * Get template version history from customData
 */
export function getVersionHistory(template: Template): Array<{
  version: string;
  timestamp: number;
  description?: string;
}> {
  const history = template.customData?.['__versionHistory'] as Array<{
    version: string;
    timestamp: number;
    description?: string;
  }>;

  return history || [];
}

/**
 * Add version history entry
 */
export function addVersionHistory(
  template: Template,
  description?: string
): Template {
  const history = getVersionHistory(template);

  return {
    ...template,
    customData: {
      ...template.customData,
      __versionHistory: [
        ...history,
        {
          version: template.metadata.version,
          timestamp: Date.now(),
          description,
        },
      ],
    },
  };
}

/**
 * Example migration: v1.0.0 -> v1.1.0
 * Adds responsive visibility to all components
 */
export const migration_1_0_0_to_1_1_0: Migration = {
  fromVersion: '1.0.0',
  toVersion: '1.1.0',
  description: 'Add responsive visibility to all components',
  migrate: (template: Template): Template => {
    return {
      ...template,
      components: template.components.map((component) => ({
        ...component,
        visibility: component.visibility || {
          desktop: true,
          tablet: true,
          mobile: true,
        },
      })),
    };
  },
};

/**
 * Example migration: v1.1.0 -> v2.0.0
 * Breaking change: Restructure spacing from simple values to CSSValue format
 */
export const migration_1_1_0_to_2_0_0: Migration = {
  fromVersion: '1.1.0',
  toVersion: '2.0.0',
  description: 'Restructure spacing to use CSSValue format',
  migrate: (template: Template): Template => {
    // This is an example - actual implementation would depend on old format
    return {
      ...template,
      components: template.components.map((component) => ({
        ...component,
        // Migration logic would go here
      })),
    };
  },
};
