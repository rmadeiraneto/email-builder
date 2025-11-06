/**
 * Custom Testing Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomTestingService } from './CustomTestingService';
import type { EmailTestingConfig } from './email-testing.types';

// Mock fetch globally
global.fetch = vi.fn();

describe('CustomTestingService', () => {
  let service: CustomTestingService;
  let config: EmailTestingConfig;

  beforeEach(() => {
    config = {
      provider: 'custom',
      apiEndpoint: 'https://custom-service.com/api',
      authMethod: 'bearer',
      apiKey: 'custom-token',
    };

    service = new CustomTestingService(config);
    vi.clearAllMocks();
  });

  describe('constructor and initial state', () => {
    it('should initialize with disconnected status', () => {
      expect(service.getStatus()).toBe('disconnected');
    });

    it('should store configuration', () => {
      const storedConfig = service.getConfig();
      expect(storedConfig.provider).toBe('custom');
      expect(storedConfig.apiEndpoint).toBe('https://custom-service.com/api');
    });
  });

  describe('testConnection', () => {
    it('should successfully test connection when health endpoint exists', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'ok' }),
      });

      const result = await service.testConnection();

      expect(result.success).toBe(true);
      expect(result.serviceInfo?.name).toBe('Custom Email Testing Service');
      expect(service.getStatus()).toBe('connected');
    });

    it('should fail connection test when all endpoints fail', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Connection refused')
      );

      const result = await service.testConnection();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(service.getStatus()).toBe('error');
    });
  });

  describe('getAvailableClients', () => {
    it('should return clients from /clients endpoint', async () => {
      const mockClients = [
        { id: 'desktop', name: 'Desktop', platform: 'desktop', available: true },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ clients: mockClients }),
      });

      const clients = await service.getAvailableClients();

      expect(clients).toEqual(mockClients);
    });

    it('should try alternative endpoints if /clients fails', async () => {
      const mockClients = [
        { id: 'mobile', name: 'Mobile', platform: 'mobile-ios', available: true },
      ];

      (global.fetch as ReturnType<typeof vi.fn>)
        .mockRejectedValueOnce(new Error('Not found'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockClients }),
        });

      const clients = await service.getAvailableClients();

      expect(clients).toEqual(mockClients);
    });

    it('should return empty array if no clients endpoint is available', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Not found')
      );

      const clients = await service.getAvailableClients();

      expect(clients).toEqual([]);
    });
  });

  describe('sendTest', () => {
    beforeEach(async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'ok' }),
      });
      await service.connect();
      vi.clearAllMocks();
    });

    it('should send test successfully with standard response format', async () => {
      const mockResponse = {
        id: 'custom-123',
        status: 'pending',
        resultsUrl: 'https://custom-service.com/results/custom-123',
        createdAt: '2024-01-01T00:00:00Z',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.sendTest({
        name: 'Test Email',
        subject: 'Test Subject',
        htmlContent: '<html><body>Test</body></html>',
        clients: ['desktop'],
      });

      expect(result.testId).toBe('custom-123');
      expect(result.status).toBe('pending');
      expect(result.resultsUrl).toBe('https://custom-service.com/results/custom-123');
    });

    it('should handle alternative field names in response', async () => {
      const mockResponse = {
        test_id: 'alt-456',
        state: 'processing',
        permalink: 'https://custom-service.com/view/alt-456',
        created_at: '2024-01-01T00:00:00Z',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.sendTest({
        name: 'Test',
        subject: 'Test',
        htmlContent: '<html></html>',
        clients: ['mobile'],
      });

      expect(result.testId).toBe('alt-456');
      expect(result.status).toBe('processing');
      expect(result.resultsUrl).toBe('https://custom-service.com/view/alt-456');
    });

    it('should throw error when not connected', async () => {
      const disconnectedService = new CustomTestingService(config);

      await expect(
        disconnectedService.sendTest({
          name: 'Test',
          subject: 'Test',
          htmlContent: '<html></html>',
          clients: ['desktop'],
        })
      ).rejects.toThrow('Not connected to custom service');
    });
  });

  describe('cancelTest', () => {
    it('should cancel test with DELETE method', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await service.cancelTest('custom-123');

      expect(result).toBe(true);
    });

    it('should try alternative cancel endpoint if DELETE fails', async () => {
      (global.fetch as ReturnType<typeof vi.fn>)
        .mockRejectedValueOnce(new Error('Method not supported'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        });

      const result = await service.cancelTest('custom-123');

      expect(result).toBe(true);
    });

    it('should return false if both cancel methods fail', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Failed')
      );

      const result = await service.cancelTest('custom-123');

      expect(result).toBe(false);
    });
  });

  describe('buildAuthHeaders', () => {
    it('should build bearer token header', () => {
      const headers = (service as any).buildAuthHeaders();

      expect(headers.Authorization).toBe('Bearer custom-token');
    });

    it('should build X-API-Key header with api-key auth', () => {
      const apiKeyConfig: EmailTestingConfig = {
        provider: 'custom',
        apiEndpoint: 'https://custom-service.com/api',
        authMethod: 'api-key',
        apiKey: 'api-key-value',
      };

      const apiKeyService = new CustomTestingService(apiKeyConfig);
      const headers = (apiKeyService as any).buildAuthHeaders();

      expect(headers['X-API-Key']).toBe('api-key-value');
    });

    it('should build basic auth header', () => {
      const basicConfig: EmailTestingConfig = {
        provider: 'custom',
        apiEndpoint: 'https://custom-service.com/api',
        authMethod: 'basic',
        username: 'user',
        password: 'pass',
      };

      const basicService = new CustomTestingService(basicConfig);
      const headers = (basicService as any).buildAuthHeaders();

      expect(headers.Authorization).toMatch(/^Basic /);
    });

    it('should build oauth header', () => {
      const oauthConfig: EmailTestingConfig = {
        provider: 'custom',
        apiEndpoint: 'https://custom-service.com/api',
        authMethod: 'oauth',
        oauthToken: 'oauth-token',
      };

      const oauthService = new CustomTestingService(oauthConfig);
      const headers = (oauthService as any).buildAuthHeaders();

      expect(headers.Authorization).toBe('Bearer oauth-token');
    });
  });

  describe('status mapping', () => {
    beforeEach(async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'ok' }),
      });
      await service.connect();
      vi.clearAllMocks();
    });

    it('should map various pending statuses', async () => {
      const testCases = ['pending', 'queued', 'waiting'];

      for (const status of testCases) {
        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '1', status }),
        });

        const result = await service.sendTest({
          name: 'Test',
          subject: 'Test',
          htmlContent: '<html></html>',
          clients: ['desktop'],
        });

        expect(result.status).toBe('pending');
        vi.clearAllMocks();
      }
    });

    it('should map various processing statuses', async () => {
      const testCases = ['processing', 'running', 'in_progress'];

      for (const status of testCases) {
        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '1', status }),
        });

        const result = await service.sendTest({
          name: 'Test',
          subject: 'Test',
          htmlContent: '<html></html>',
          clients: ['desktop'],
        });

        expect(result.status).toBe('processing');
        vi.clearAllMocks();
      }
    });

    it('should map various completed statuses', async () => {
      const testCases = ['complete', 'completed', 'done', 'finished'];

      for (const status of testCases) {
        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '1', status }),
        });

        const result = await service.sendTest({
          name: 'Test',
          subject: 'Test',
          htmlContent: '<html></html>',
          clients: ['desktop'],
        });

        expect(result.status).toBe('completed');
        vi.clearAllMocks();
      }
    });
  });
});
