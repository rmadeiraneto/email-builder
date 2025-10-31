/**
 * Tests for TemplateVersioning
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  TemplateVersionManager,
  TemplateMigrationManager,
  needsMigration,
  getVersionHistory,
  addVersionHistory,
  type Migration,
} from './TemplateVersioning';
import { createEmptyEmailTemplate } from './TemplateComposer';
import type { Template } from '../types/template.types';

describe('TemplateVersionManager', () => {
  describe('parseVersion', () => {
    it('should parse valid version string', () => {
      const version = TemplateVersionManager.parseVersion('1.2.3');

      expect(version.major).toBe(1);
      expect(version.minor).toBe(2);
      expect(version.patch).toBe(3);
    });

    it('should throw error for invalid format', () => {
      expect(() => TemplateVersionManager.parseVersion('1.2')).toThrow();
      expect(() => TemplateVersionManager.parseVersion('invalid')).toThrow();
      expect(() => TemplateVersionManager.parseVersion('1.2.x')).toThrow();
    });
  });

  describe('formatVersion', () => {
    it('should format version object to string', () => {
      const formatted = TemplateVersionManager.formatVersion({
        major: 2,
        minor: 5,
        patch: 10,
      });

      expect(formatted).toBe('2.5.10');
    });
  });

  describe('compareVersions', () => {
    it('should return equal for same versions', () => {
      expect(TemplateVersionManager.compareVersions('1.2.3', '1.2.3')).toBe('equal');
    });

    it('should return greater for higher major version', () => {
      expect(TemplateVersionManager.compareVersions('2.0.0', '1.9.9')).toBe('greater');
    });

    it('should return greater for higher minor version', () => {
      expect(TemplateVersionManager.compareVersions('1.3.0', '1.2.9')).toBe('greater');
    });

    it('should return greater for higher patch version', () => {
      expect(TemplateVersionManager.compareVersions('1.2.4', '1.2.3')).toBe('greater');
    });

    it('should return less for lower versions', () => {
      expect(TemplateVersionManager.compareVersions('1.0.0', '2.0.0')).toBe('less');
      expect(TemplateVersionManager.compareVersions('1.2.0', '1.3.0')).toBe('less');
      expect(TemplateVersionManager.compareVersions('1.2.3', '1.2.4')).toBe('less');
    });
  });

  describe('isGreaterThan', () => {
    it('should return true when v1 > v2', () => {
      expect(TemplateVersionManager.isGreaterThan('2.0.0', '1.0.0')).toBe(true);
      expect(TemplateVersionManager.isGreaterThan('1.5.0', '1.4.9')).toBe(true);
    });

    it('should return false when v1 <= v2', () => {
      expect(TemplateVersionManager.isGreaterThan('1.0.0', '2.0.0')).toBe(false);
      expect(TemplateVersionManager.isGreaterThan('1.0.0', '1.0.0')).toBe(false);
    });
  });

  describe('isLessThan', () => {
    it('should return true when v1 < v2', () => {
      expect(TemplateVersionManager.isLessThan('1.0.0', '2.0.0')).toBe(true);
      expect(TemplateVersionManager.isLessThan('1.4.9', '1.5.0')).toBe(true);
    });

    it('should return false when v1 >= v2', () => {
      expect(TemplateVersionManager.isLessThan('2.0.0', '1.0.0')).toBe(false);
      expect(TemplateVersionManager.isLessThan('1.0.0', '1.0.0')).toBe(false);
    });
  });

  describe('isEqual', () => {
    it('should return true for equal versions', () => {
      expect(TemplateVersionManager.isEqual('1.2.3', '1.2.3')).toBe(true);
    });

    it('should return false for different versions', () => {
      expect(TemplateVersionManager.isEqual('1.2.3', '1.2.4')).toBe(false);
    });
  });

  describe('incrementMajor', () => {
    it('should increment major and reset minor and patch', () => {
      const result = TemplateVersionManager.incrementMajor('1.5.8');
      expect(result).toBe('2.0.0');
    });
  });

  describe('incrementMinor', () => {
    it('should increment minor and reset patch', () => {
      const result = TemplateVersionManager.incrementMinor('1.5.8');
      expect(result).toBe('1.6.0');
    });
  });

  describe('incrementPatch', () => {
    it('should increment patch', () => {
      const result = TemplateVersionManager.incrementPatch('1.5.8');
      expect(result).toBe('1.5.9');
    });
  });

  describe('areCompatible', () => {
    it('should return true for same major version', () => {
      expect(TemplateVersionManager.areCompatible('1.2.3', '1.5.9')).toBe(true);
    });

    it('should return false for different major versions', () => {
      expect(TemplateVersionManager.areCompatible('1.0.0', '2.0.0')).toBe(false);
    });
  });

  describe('getVersionDiff', () => {
    it('should identify major difference', () => {
      const diff = TemplateVersionManager.getVersionDiff('1.0.0', '3.0.0');
      expect(diff.type).toBe('major');
      expect(diff.difference).toBe(2);
    });

    it('should identify minor difference', () => {
      const diff = TemplateVersionManager.getVersionDiff('1.2.0', '1.5.0');
      expect(diff.type).toBe('minor');
      expect(diff.difference).toBe(3);
    });

    it('should identify patch difference', () => {
      const diff = TemplateVersionManager.getVersionDiff('1.2.3', '1.2.5');
      expect(diff.type).toBe('patch');
      expect(diff.difference).toBe(2);
    });

    it('should identify no difference', () => {
      const diff = TemplateVersionManager.getVersionDiff('1.2.3', '1.2.3');
      expect(diff.type).toBe('none');
      expect(diff.difference).toBe(0);
    });
  });
});

describe('TemplateMigrationManager', () => {
  let manager: TemplateMigrationManager;

  beforeEach(() => {
    manager = new TemplateMigrationManager();
  });

  describe('registerMigration', () => {
    it('should register a migration', () => {
      const migration: Migration = {
        fromVersion: '1.0.0',
        toVersion: '1.1.0',
        description: 'Test migration',
        migrate: (template) => template,
      };

      manager.registerMigration(migration);
      expect(manager.getAllMigrations()).toHaveLength(1);
    });

    it('should register multiple migrations', () => {
      const migrations: Migration[] = [
        {
          fromVersion: '1.0.0',
          toVersion: '1.1.0',
          description: 'Migration 1',
          migrate: (template) => template,
        },
        {
          fromVersion: '1.1.0',
          toVersion: '1.2.0',
          description: 'Migration 2',
          migrate: (template) => template,
        },
      ];

      manager.registerMigrations(migrations);
      expect(manager.getAllMigrations()).toHaveLength(2);
    });
  });

  describe('getMigrationPath', () => {
    beforeEach(() => {
      manager.registerMigrations([
        {
          fromVersion: '1.0.0',
          toVersion: '1.1.0',
          description: 'Add feature A',
          migrate: (template) => template,
        },
        {
          fromVersion: '1.1.0',
          toVersion: '1.2.0',
          description: 'Add feature B',
          migrate: (template) => template,
        },
        {
          fromVersion: '1.2.0',
          toVersion: '2.0.0',
          description: 'Breaking change',
          migrate: (template) => template,
        },
      ]);
    });

    it('should find direct migration path', () => {
      const path = manager.getMigrationPath('1.0.0', '1.1.0');
      expect(path).toHaveLength(1);
      expect(path[0].fromVersion).toBe('1.0.0');
      expect(path[0].toVersion).toBe('1.1.0');
    });

    it('should find multi-step migration path', () => {
      const path = manager.getMigrationPath('1.0.0', '2.0.0');
      expect(path).toHaveLength(3);
      expect(path[0].fromVersion).toBe('1.0.0');
      expect(path[1].fromVersion).toBe('1.1.0');
      expect(path[2].fromVersion).toBe('1.2.0');
      expect(path[2].toVersion).toBe('2.0.0');
    });

    it('should throw error if no path exists', () => {
      expect(() => manager.getMigrationPath('1.0.0', '3.0.0')).toThrow();
    });
  });

  describe('migrate', () => {
    beforeEach(() => {
      manager.registerMigrations([
        {
          fromVersion: '1.0.0',
          toVersion: '1.1.0',
          description: 'Add visibility',
          migrate: (template) => ({
            ...template,
            components: template.components.map((comp) => ({
              ...comp,
              visibility: { desktop: true, tablet: true, mobile: true },
            })),
          }),
        },
        {
          fromVersion: '1.1.0',
          toVersion: '2.0.0',
          description: 'Update structure',
          migrate: (template) => ({
            ...template,
            metadata: {
              ...template.metadata,
              description: 'Migrated to v2',
            },
          }),
        },
      ]);
    });

    it('should migrate template to target version', () => {
      const template = createEmptyEmailTemplate('Test');
      template.metadata.version = '1.0.0';

      const migrated = manager.migrate(template, '1.1.0');

      expect(migrated.metadata.version).toBe('1.1.0');
    });

    it('should return template if already at target version', () => {
      const template = createEmptyEmailTemplate('Test');
      template.metadata.version = '1.1.0';

      const migrated = manager.migrate(template, '1.1.0');

      expect(migrated).toEqual(template);
    });

    it('should apply multiple migrations in sequence', () => {
      const template = createEmptyEmailTemplate('Test');
      template.metadata.version = '1.0.0';

      const migrated = manager.migrate(template, '2.0.0');

      expect(migrated.metadata.version).toBe('2.0.0');
      expect(migrated.metadata.description).toBe('Migrated to v2');
    });

    it('should throw error when migrating to older version', () => {
      const template = createEmptyEmailTemplate('Test');
      template.metadata.version = '2.0.0';

      expect(() => manager.migrate(template, '1.0.0')).toThrow();
    });
  });

  describe('canMigrate', () => {
    beforeEach(() => {
      manager.registerMigration({
        fromVersion: '1.0.0',
        toVersion: '2.0.0',
        description: 'Test',
        migrate: (template) => template,
      });
    });

    it('should return true if migration path exists', () => {
      expect(manager.canMigrate('1.0.0', '2.0.0')).toBe(true);
    });

    it('should return false if no migration path exists', () => {
      expect(manager.canMigrate('1.0.0', '3.0.0')).toBe(false);
    });
  });

  describe('clearMigrations', () => {
    it('should clear all migrations', () => {
      manager.registerMigration({
        fromVersion: '1.0.0',
        toVersion: '2.0.0',
        description: 'Test',
        migrate: (template) => template,
      });

      expect(manager.getAllMigrations()).toHaveLength(1);

      manager.clearMigrations();
      expect(manager.getAllMigrations()).toHaveLength(0);
    });
  });
});

describe('Utility Functions', () => {
  describe('needsMigration', () => {
    it('should return true if template version is less than system version', () => {
      const template = createEmptyEmailTemplate('Test');
      template.metadata.version = '1.0.0';

      expect(needsMigration(template, '2.0.0')).toBe(true);
    });

    it('should return false if template version equals system version', () => {
      const template = createEmptyEmailTemplate('Test');
      template.metadata.version = '2.0.0';

      expect(needsMigration(template, '2.0.0')).toBe(false);
    });

    it('should return false if template version is greater than system version', () => {
      const template = createEmptyEmailTemplate('Test');
      template.metadata.version = '3.0.0';

      expect(needsMigration(template, '2.0.0')).toBe(false);
    });
  });

  describe('getVersionHistory', () => {
    it('should return empty array if no history', () => {
      const template = createEmptyEmailTemplate('Test');
      const history = getVersionHistory(template);

      expect(history).toEqual([]);
    });

    it('should return version history if present', () => {
      const template = createEmptyEmailTemplate('Test');
      template.customData = {
        __versionHistory: [
          { version: '1.0.0', timestamp: Date.now(), description: 'Initial' },
        ],
      };

      const history = getVersionHistory(template);

      expect(history).toHaveLength(1);
      expect(history[0].version).toBe('1.0.0');
    });
  });

  describe('addVersionHistory', () => {
    it('should add version history entry', () => {
      const template = createEmptyEmailTemplate('Test');
      const updated = addVersionHistory(template, 'Initial version');

      const history = getVersionHistory(updated);

      expect(history).toHaveLength(1);
      expect(history[0].version).toBe('1.0.0');
      expect(history[0].description).toBe('Initial version');
      expect(history[0].timestamp).toBeDefined();
    });

    it('should append to existing history', () => {
      let template = createEmptyEmailTemplate('Test');
      template = addVersionHistory(template, 'Version 1');
      template.metadata.version = '1.1.0';
      template = addVersionHistory(template, 'Version 2');

      const history = getVersionHistory(template);

      expect(history).toHaveLength(2);
      expect(history[0].version).toBe('1.0.0');
      expect(history[1].version).toBe('1.1.0');
    });
  });
});
