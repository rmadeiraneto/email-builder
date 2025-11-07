/**
 * Tips Data Tests
 */

import { describe, it, expect } from 'vitest';
import { TIPS_DATABASE } from './tips-data';

describe('Tips Data', () => {
  describe('TIPS_DATABASE', () => {
    it('should contain array of tips', () => {
      expect(Array.isArray(TIPS_DATABASE)).toBe(true);
      expect(TIPS_DATABASE.length).toBeGreaterThan(0);
    });

    it('should have valid tip structure', () => {
      TIPS_DATABASE.forEach((tip) => {
        expect(tip).toHaveProperty('id');
        expect(tip).toHaveProperty('category');
        expect(tip).toHaveProperty('title');
        expect(tip).toHaveProperty('message');
        expect(tip).toHaveProperty('severity');
        expect(tip).toHaveProperty('trigger');
      });
    });

    it('should have unique tip IDs', () => {
      const ids = TIPS_DATABASE.map((tip) => tip.id);
      const uniqueIds = new Set(ids);

      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have valid categories', () => {
      TIPS_DATABASE.forEach((tip) => {
        expect(typeof tip.category).toBe('string');
        expect(tip.category.length).toBeGreaterThan(0);
      });
    });

    it('should have valid severity levels', () => {
      TIPS_DATABASE.forEach((tip) => {
        expect(['critical', 'warning', 'info']).toContain(tip.severity);
      });
    });

    it('should have non-empty messages', () => {
      TIPS_DATABASE.forEach((tip) => {
        expect(tip.message.length).toBeGreaterThan(0);
      });
    });

    it('should have trigger arrays', () => {
      TIPS_DATABASE.forEach((tip) => {
        expect(Array.isArray(tip.trigger)).toBe(true);
        expect(tip.trigger.length).toBeGreaterThan(0);
      });
    });
  });
});
