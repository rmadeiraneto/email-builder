/**
 * Email on Acid Testing Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmailOnAcidTestingService } from './EmailOnAcidTestingService';
import type { EmailTestingConfig } from './email-testing.types';

// Mock fetch globally
global.fetch = vi.fn();

describe('EmailOnAcidTestingService', () => {
  let service: EmailOnAcidTestingService;
  let config: EmailTestingConfig;

  beforeEach(() => {
    config = {
      provider: 'email-on-acid',
      apiEndpoint: 'https://api.emailonacid.com/v4',
      authMethod: 'api-key',
      apiKey: 'test-api-key',
    };

    service = new EmailOnAcidTestingService(config);
    vi.clearAllMocks();
  });

  describe('constructor and initial state', () => {
    it('should initialize with disconnected status', () => {
      expect(service.getStatus()).toBe('disconnected');
    });

    it('should store configuration', () => {
      const storedConfig = service.getConfig();
      expect(storedConfig.provider).toBe('email-on-acid');
      expect(storedConfig.apiEndpoint).toBe('https://api.emailonacid.com/v4');
    });
  });

  describe('testConnection', () => {
    it('should successfully test connection with valid API key', async () => {
      const mockClients = [
        {
          client_id: 'outlook2019',
          name: 'Outlook 2019',
          platform: 'Desktop',
          category: 'Email Client',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ clients: mockClients }),
      });

      const result = await service.testConnection();

      expect(result.success).toBe(true);
      expect(result.serviceInfo?.name).toBe('Email on Acid');
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

  describe('connect', () => {
    it('should connect successfully with valid credentials', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ clients: [] }),
      });

      await service.connect();

      expect(service.getStatus()).toBe('connected');
    });

    it('should throw error with invalid credentials', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => 'Invalid API key',
      });

      await expect(service.connect()).rejects.toThrow(
        'Failed to connect to Email on Acid: Invalid API key'
      );
    });
  });

  describe('getAvailableClients', () => {
    it('should return available email clients', async () => {
      const mockClients = [
        {
          client_id: 'outlook2019',
          name: 'Outlook 2019',
          platform: 'Desktop',
          category: 'Email Client',
        },
        {
          client_id: 'gmail',
          name: 'Gmail',
          platform: 'Webmail',
          category: 'Webmail',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ clients: mockClients }),
      });

      const clients = await service.getAvailableClients();

      expect(clients).toHaveLength(2);
      expect(clients[0]).toEqual({
        id: 'outlook2019',
        name: 'Outlook 2019',
        platform: 'desktop',
        available: true,
      });
    });

    it('should map iOS platform correctly', async () => {
      const mockClients = [
        {
          client_id: 'iphone13',
          name: 'iPhone 13',
          platform: 'iOS Mobile',
          category: 'Mobile',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ clients: mockClients }),
      });

      const clients = await service.getAvailableClients();

      expect(clients[0].platform).toBe('mobile-ios');
    });

    it('should return empty array on error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      const clients = await service.getAvailableClients();

      expect(clients).toEqual([]);
    });
  });

  describe('sendTest', () => {
    beforeEach(async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ clients: [] }),
      });
      await service.connect();
      vi.clearAllMocks();
    });

    it('should send test successfully', async () => {
      const mockResponse = {
        id: 'test-456',
        status: 'pending',
        permalink: 'https://app.emailonacid.com/results/test-456',
        created: '2024-01-01T00:00:00Z',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.sendTest({
        name: 'Test Email',
        subject: 'Test Subject',
        htmlContent: '<html><body>Test</body></html>',
        clients: ['outlook2019', 'gmail'],
        spamTest: true,
      });

      expect(result.testId).toBe('test-456');
      expect(result.status).toBe('pending');
      expect(result.resultsUrl).toBe('https://app.emailonacid.com/results/test-456');
    });

    it('should throw error when not connected', async () => {
      const disconnectedService = new EmailOnAcidTestingService(config);

      await expect(
        disconnectedService.sendTest({
          name: 'Test',
          subject: 'Test',
          htmlContent: '<html></html>',
          clients: ['outlook2019'],
        })
      ).rejects.toThrow('Not connected to Email on Acid');
    });
  });

  describe('cancelTest', () => {
    it('should cancel test successfully', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await service.cancelTest('test-456');

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

  describe('buildAuthHeaders', () => {
    it('should build X-API-Key header with api-key auth', () => {
      const headers = (service as any).buildAuthHeaders();

      expect(headers['X-API-Key']).toBe('test-api-key');
    });

    it('should build bearer token header with bearer auth', () => {
      const bearerConfig: EmailTestingConfig = {
        provider: 'email-on-acid',
        apiEndpoint: 'https://api.emailonacid.com/v4',
        authMethod: 'bearer',
        apiKey: 'bearer-token',
      };

      const bearerService = new EmailOnAcidTestingService(bearerConfig);
      const headers = (bearerService as any).buildAuthHeaders();

      expect(headers.Authorization).toBe('Bearer bearer-token');
    });
  });
});
