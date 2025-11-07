/**
 * Email Testing Service Factory Tests
 */

import { describe, it, expect } from 'vitest';
import {
  createEmailTestingService,
  getDefaultApiEndpoint,
  getRecommendedAuthMethod,
} from './EmailTestingServiceFactory';
import { LitmusTestingService } from './LitmusTestingService';
import { EmailOnAcidTestingService } from './EmailOnAcidTestingService';
import { TestiTestingService } from './TestiTestingService';
import { CustomTestingService } from './CustomTestingService';
import type { EmailTestingConfig } from './email-testing.types';

describe('EmailTestingServiceFactory', () => {
  describe('createEmailTestingService', () => {
    it('should create Litmus service instance', () => {
      const config: EmailTestingConfig = {
        provider: 'litmus',
        apiEndpoint: 'https://api.litmus.com/v1',
        authMethod: 'basic',
        username: 'test@example.com',
        password: 'api-key',
      };

      const service = createEmailTestingService(config);

      expect(service).toBeInstanceOf(LitmusTestingService);
      expect(service.getConfig().provider).toBe('litmus');
    });

    it('should create Email on Acid service instance', () => {
      const config: EmailTestingConfig = {
        provider: 'email-on-acid',
        apiEndpoint: 'https://api.emailonacid.com/v4',
        authMethod: 'api-key',
        apiKey: 'test-key',
      };

      const service = createEmailTestingService(config);

      expect(service).toBeInstanceOf(EmailOnAcidTestingService);
      expect(service.getConfig().provider).toBe('email-on-acid');
    });

    it('should create Testi service instance', () => {
      const config: EmailTestingConfig = {
        provider: 'testi',
        apiEndpoint: 'https://api.testi.at/v1',
        authMethod: 'api-key',
        apiKey: 'test-key',
      };

      const service = createEmailTestingService(config);

      expect(service).toBeInstanceOf(TestiTestingService);
      expect(service.getConfig().provider).toBe('testi');
    });

    it('should create Custom service instance', () => {
      const config: EmailTestingConfig = {
        provider: 'custom',
        apiEndpoint: 'https://custom-service.com/api',
        authMethod: 'bearer',
        apiKey: 'token',
      };

      const service = createEmailTestingService(config);

      expect(service).toBeInstanceOf(CustomTestingService);
      expect(service.getConfig().provider).toBe('custom');
    });

    it('should throw error for unknown provider', () => {
      const config = {
        provider: 'unknown',
        apiEndpoint: 'https://api.example.com',
        authMethod: 'api-key',
        apiKey: 'test',
      } as EmailTestingConfig;

      expect(() => createEmailTestingService(config)).toThrow(
        'Unknown email testing provider: unknown'
      );
    });
  });

  describe('getDefaultApiEndpoint', () => {
    it('should return correct endpoint for Litmus', () => {
      expect(getDefaultApiEndpoint('litmus')).toBe('https://api.litmus.com/v1');
    });

    it('should return correct endpoint for Email on Acid', () => {
      expect(getDefaultApiEndpoint('email-on-acid')).toBe(
        'https://api.emailonacid.com/v4'
      );
    });

    it('should return correct endpoint for Testi', () => {
      expect(getDefaultApiEndpoint('testi')).toBe('https://api.testi.at/v1');
    });

    it('should return empty string for custom provider', () => {
      expect(getDefaultApiEndpoint('custom')).toBe('');
    });
  });

  describe('getRecommendedAuthMethod', () => {
    it('should return basic auth for Litmus', () => {
      expect(getRecommendedAuthMethod('litmus')).toBe('basic');
    });

    it('should return api-key for Email on Acid', () => {
      expect(getRecommendedAuthMethod('email-on-acid')).toBe('api-key');
    });

    it('should return api-key for Testi', () => {
      expect(getRecommendedAuthMethod('testi')).toBe('api-key');
    });

    it('should return bearer for custom provider', () => {
      expect(getRecommendedAuthMethod('custom')).toBe('bearer');
    });
  });
});
