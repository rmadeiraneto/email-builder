/**
 * Testi@ Testing Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestiTestingService } from './TestiTestingService';
import type { EmailTestingConfig } from './email-testing.types';

// Mock fetch globally
global.fetch = vi.fn();

describe('TestiTestingService', () => {
  let service: TestiTestingService;
  let config: EmailTestingConfig;

  beforeEach(() => {
    config = {
      provider: 'testi',
      apiEndpoint: 'https://api.testi.at/v1',
      authMethod: 'api-key',
      apiKey: 'test-api-key',
    };

    service = new TestiTestingService(config);
    vi.clearAllMocks();
  });

  describe('constructor and initial state', () => {
    it('should initialize with disconnected status', () => {
      expect(service.getStatus()).toBe('disconnected');
    });

    it('should store configuration', () => {
      const storedConfig = service.getConfig();
      expect(storedConfig.provider).toBe('testi');
      expect(storedConfig.apiEndpoint).toBe('https://api.testi.at/v1');
    });
  });

  describe('testConnection', () => {
    it('should successfully test connection with valid API key', async () => {
      (global.fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ clients: [] }),
        });

      const result = await service.testConnection();

      expect(result.success).toBe(true);
      expect(result.serviceInfo?.name).toBe('Testi@');
      expect(service.getStatus()).toBe('connected');
    });

    it('should fail connection test with invalid API key', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => 'Invalid API key',
      });

      const result = await service.testConnection();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(service.getStatus()).toBe('error');
    });
  });

  describe('getAvailableClients', () => {
    it('should return clients from API if available', async () => {
      const mockClients = [
        {
          id: 'outlook',
          name: 'Outlook',
          platform: 'desktop',
          available: true,
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ clients: mockClients }),
      });

      const clients = await service.getAvailableClients();

      expect(clients).toEqual(mockClients);
    });

    it('should return fallback clients if API fails', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      const clients = await service.getAvailableClients();

      expect(clients.length).toBeGreaterThan(0);
      expect(clients).toContainEqual(
        expect.objectContaining({ id: 'outlook', name: 'Outlook' })
      );
    });
  });

  describe('sendTest', () => {
    beforeEach(async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });
      await service.connect();
      vi.clearAllMocks();
    });

    it('should send test successfully', async () => {
      const mockResponse = {
        test_id: 'testi-789',
        status: 'pending',
        preview_url: 'https://testi.at/preview/testi-789',
        created_at: '2024-01-01T00:00:00Z',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.sendTest({
        name: 'Test Email',
        subject: 'Test Subject',
        htmlContent: '<html><body>Test</body></html>',
        plainTextContent: 'Test',
        clients: ['outlook', 'gmail'],
        description: 'Test description',
      });

      expect(result.testId).toBe('testi-789');
      expect(result.status).toBe('pending');
      expect(result.resultsUrl).toBe('https://testi.at/preview/testi-789');
    });

    it('should throw error when not connected', async () => {
      const disconnectedService = new TestiTestingService(config);

      await expect(
        disconnectedService.sendTest({
          name: 'Test',
          subject: 'Test',
          htmlContent: '<html></html>',
          clients: ['outlook'],
        })
      ).rejects.toThrow('Not connected to Testi@');
    });
  });

  describe('cancelTest', () => {
    it('should cancel test successfully', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await service.cancelTest('testi-789');

      expect(result).toBe(true);
    });

    it('should return false on error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Not found')
      );

      const result = await service.cancelTest('invalid-id');

      expect(result).toBe(false);
    });
  });

  describe('getTestResults', () => {
    it('should fetch test results', async () => {
      const mockResponse = {
        test_id: 'testi-789',
        status: 'completed',
        preview_url: 'https://testi.at/preview/testi-789',
        created_at: '2024-01-01T00:00:00Z',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.getTestResults('testi-789');

      expect(result.testId).toBe('testi-789');
      expect(result.status).toBe('completed');
    });
  });

  describe('buildAuthHeaders', () => {
    it('should build X-API-Key header with api-key auth', () => {
      const headers = (service as any).buildAuthHeaders();

      expect(headers['X-API-Key']).toBe('test-api-key');
    });

    it('should build bearer token header with bearer auth', () => {
      const bearerConfig: EmailTestingConfig = {
        provider: 'testi',
        apiEndpoint: 'https://api.testi.at/v1',
        authMethod: 'bearer',
        apiKey: 'bearer-token',
      };

      const bearerService = new TestiTestingService(bearerConfig);
      const headers = (bearerService as any).buildAuthHeaders();

      expect(headers.Authorization).toBe('Bearer bearer-token');
    });
  });
});
