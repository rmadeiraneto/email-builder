/**
 * Compatibility Service Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CompatibilityService } from './CompatibilityService';
import { SupportLevel } from './compatibility.types';
import type { EmailClientId } from './compatibility.types';

describe('CompatibilityService', () => {
  let service: CompatibilityService;

  beforeEach(() => {
    service = new CompatibilityService();
  });

  describe('getPropertyInfo', () => {
    it('should return compatibility info for border-radius', () => {
      const info = service.getPropertyInfo('border-radius');

      expect(info).toBeDefined();
      expect(info?.property).toBe('border-radius');
      expect(info?.support).toBeDefined();
    });

    it('should return undefined for unknown property', () => {
      const info = service.getPropertyInfo('nonexistent-property');

      expect(info).toBeUndefined();
    });
  });

  describe('getPropertySupportForClient', () => {
    it('should return support info for specific client', () => {
      const support = service.getPropertySupportForClient(
        'border-radius',
        'outlook-2016-win'
      );

      expect(support).toBeDefined();
      expect(support?.level).toBeDefined();
    });

    it('should return undefined for unknown property', () => {
      const support = service.getPropertySupportForClient(
        'nonexistent',
        'outlook-2016-win'
      );

      expect(support).toBeUndefined();
    });
  });

  describe('getPropertyStatistics', () => {
    it('should calculate statistics for a property', () => {
      const stats = service.getPropertyStatistics('border-radius');

      expect(stats).toBeDefined();
      expect(stats?.property).toBe('border-radius');
      expect(stats?.totalClients).toBeGreaterThan(0);
      expect(stats?.supportScore).toBeGreaterThanOrEqual(0);
      expect(stats?.supportScore).toBeLessThanOrEqual(100);
      expect(['high', 'medium', 'low', 'unknown']).toContain(stats?.supportLevel);
    });

    it('should return undefined for unknown property', () => {
      const stats = service.getPropertyStatistics('nonexistent');

      expect(stats).toBeUndefined();
    });

    it('should correctly categorize support levels', () => {
      const stats = service.getPropertyStatistics('border-radius');

      expect(stats).toBeDefined();
      if (stats) {
        const totalSupport =
          stats.fullSupport +
          stats.partialSupport +
          stats.noSupport +
          stats.unknownSupport;
        expect(totalSupport).toBe(stats.totalClients);
      }
    });
  });

  describe('getClientSupportedProperties', () => {
    it('should return list of supported properties for a client', () => {
      const properties = service.getClientSupportedProperties('gmail-webmail');

      expect(Array.isArray(properties)).toBe(true);
      expect(properties.length).toBeGreaterThan(0);

      properties.forEach((item) => {
        expect(item).toHaveProperty('property');
        expect(item).toHaveProperty('support');
        expect(item.support).toHaveProperty('level');
      });
    });

    it('should include properties with different support levels', () => {
      const properties = service.getClientSupportedProperties('outlook-2016-win');

      expect(properties.length).toBeGreaterThan(0);

      const hasFullSupport = properties.some(
        (p) => p.support.level === SupportLevel.FULL
      );
      expect(hasFullSupport).toBe(true);
    });
  });

  describe('getWorkarounds', () => {
    it('should return workarounds for a property', () => {
      const workarounds = service.getWorkarounds('border-radius');

      expect(Array.isArray(workarounds)).toBe(true);
    });

    it('should return client-specific workarounds when client is specified', () => {
      const workarounds = service.getWorkarounds(
        'border-radius',
        'outlook-2016-win'
      );

      expect(Array.isArray(workarounds)).toBe(true);
    });

    it('should return empty array for unknown property', () => {
      const workarounds = service.getWorkarounds('nonexistent');

      expect(workarounds).toEqual([]);
    });

    it('should return unique workarounds', () => {
      const workarounds = service.getWorkarounds('border-radius');

      const uniqueWorkarounds = [...new Set(workarounds)];
      expect(workarounds.length).toBe(uniqueWorkarounds.length);
    });
  });

  describe('getSafeProperties', () => {
    it('should return properties with high support', () => {
      const safeProps = service.getSafeProperties(75);

      expect(Array.isArray(safeProps)).toBe(true);
      safeProps.forEach((item) => {
        expect(item.stats.supportScore).toBeGreaterThanOrEqual(75);
      });
    });

    it('should sort properties by support score descending', () => {
      const safeProps = service.getSafeProperties(50);

      for (let i = 1; i < safeProps.length; i++) {
        expect(safeProps[i - 1].stats.supportScore).toBeGreaterThanOrEqual(
          safeProps[i].stats.supportScore
        );
      }
    });

    it('should respect custom minimum score', () => {
      const safeProps = service.getSafeProperties(90);

      safeProps.forEach((item) => {
        expect(item.stats.supportScore).toBeGreaterThanOrEqual(90);
      });
    });
  });

  describe('getProblematicProperties', () => {
    it('should return properties with low support', () => {
      const problematic = service.getProblematicProperties(40);

      expect(Array.isArray(problematic)).toBe(true);
      problematic.forEach((item) => {
        expect(item.stats.supportScore).toBeLessThanOrEqual(40);
      });
    });

    it('should sort properties by support score ascending', () => {
      const problematic = service.getProblematicProperties(50);

      for (let i = 1; i < problematic.length; i++) {
        expect(problematic[i - 1].stats.supportScore).toBeLessThanOrEqual(
          problematic[i].stats.supportScore
        );
      }
    });
  });

  describe('queryProperties', () => {
    it('should filter properties by minimum score', () => {
      const results = service.queryProperties({ minScore: 80 });

      results.forEach((info) => {
        const stats = service.getPropertyStatistics(info.property);
        expect(stats?.supportScore).toBeGreaterThanOrEqual(80);
      });
    });

    it('should filter properties by support level', () => {
      const results = service.queryProperties({ supportLevel: 'high' });

      results.forEach((info) => {
        const stats = service.getPropertyStatistics(info.property);
        expect(stats?.supportLevel).toBe('high');
      });
    });

    it('should search properties by name', () => {
      const results = service.queryProperties({ search: 'border' });

      results.forEach((info) => {
        expect(info.property.toLowerCase()).toContain('border');
      });
    });

    it('should filter by client support', () => {
      const client: EmailClientId = 'outlook-2016-win';
      const results = service.queryProperties({ client });

      results.forEach((info) => {
        const support = info.support[client];
        expect(support).toBeDefined();
        expect(support.level).not.toBe(SupportLevel.NONE);
      });
    });

    it('should combine multiple filters', () => {
      const results = service.queryProperties({
        minScore: 70,
        search: 'color',
      });

      results.forEach((info) => {
        expect(info.property.toLowerCase()).toContain('color');
        const stats = service.getPropertyStatistics(info.property);
        expect(stats?.supportScore).toBeGreaterThanOrEqual(70);
      });
    });
  });

  describe('getAllProperties', () => {
    it('should return array of all properties', () => {
      const properties = service.getAllProperties();

      expect(Array.isArray(properties)).toBe(true);
      expect(properties.length).toBeGreaterThan(0);
    });

    it('should return unique property names', () => {
      const properties = service.getAllProperties();

      const uniqueProps = [...new Set(properties)];
      expect(properties.length).toBe(uniqueProps.length);
    });
  });

  describe('hasProperty', () => {
    it('should return true for existing property', () => {
      const has = service.hasProperty('border-radius');

      expect(has).toBe(true);
    });

    it('should return false for nonexistent property', () => {
      const has = service.hasProperty('nonexistent-property');

      expect(has).toBe(false);
    });
  });

  describe('getPropertySupportSummary', () => {
    it('should return support summary for a property', () => {
      const summary = service.getPropertySupportSummary('border-radius');

      expect(summary).toBeDefined();
      expect(summary?.property).toBe('border-radius');
      expect(summary?.outlookWindows).toBeDefined();
      expect(summary?.outlookMac).toBeDefined();
      expect(summary?.webmail).toBeDefined();
      expect(summary?.mobileIOS).toBeDefined();
      expect(summary?.mobileAndroid).toBeDefined();
    });

    it('should return undefined for unknown property', () => {
      const summary = service.getPropertySupportSummary('nonexistent');

      expect(summary).toBeUndefined();
    });

    it('should have valid support levels in summary', () => {
      const summary = service.getPropertySupportSummary('border-radius');

      expect(summary).toBeDefined();
      if (summary) {
        const validLevels = Object.values(SupportLevel);
        expect(validLevels).toContain(summary.outlookWindows);
        expect(validLevels).toContain(summary.outlookMac);
        expect(validLevels).toContain(summary.webmail);
        expect(validLevels).toContain(summary.mobileIOS);
        expect(validLevels).toContain(summary.mobileAndroid);
      }
    });
  });

  describe('getClientLabel', () => {
    it('should return human-readable label for client', () => {
      const label = service.getClientLabel('outlook-2016-win');

      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    });

    it('should handle all client IDs', () => {
      const clients: EmailClientId[] = [
        'outlook-2016-win',
        'gmail-webmail',
        'apple-mail-ios',
      ];

      clients.forEach((client) => {
        const label = service.getClientLabel(client);
        expect(typeof label).toBe('string');
        expect(label).toBeTruthy();
      });
    });
  });
});
