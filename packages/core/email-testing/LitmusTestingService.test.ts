/**
 * Litmus Testing Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LitmusTestingService } from './LitmusTestingService';
import type { EmailTestingConfig } from './email-testing.types';

// Mock fetch globally
global.fetch = vi.fn();

describe('LitmusTestingService', () => {
  let service: LitmusTestingService;
  let config: EmailTestingConfig;

  beforeEach(() => {
    config = {
      provider: 'litmus',
      apiEndpoint: 'https://api.litmus.com/v1',
      authMethod: 'basic',
      username: 'test@example.com',
      password: 'api-key',
    };

    service = new LitmusTestingService(config);
    vi.clearAllMocks();
  });

  describe('constructor and initial state', () => {
    it('should initialize with disconnected status', () => {
      expect(service.getStatus()).toBe('disconnected');
    });

    it('should store configuration', () => {
      const storedConfig = service.getConfig();
      expect(storedConfig.provider).toBe('litmus');
      expect(storedConfig.apiEndpoint).toBe('https://api.litmus.com/v1');
    });
  });

  describe('updateConfig', () => {
    it('should update configuration', () => {
      service.updateConfig({
        apiEndpoint: 'https://new-endpoint.com',
      });

      const updatedConfig = service.getConfig();
      expect(updatedConfig.apiEndpoint).toBe('https://new-endpoint.com');
    });

    it('should reset status to disconnected after config update', () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ applications: [] }),
      });

      service.updateConfig({ timeout: 5000 });
      expect(service.getStatus()).toBe('disconnected');
    });
  });

  describe('testConnection', () => {
    it('should successfully test connection with valid credentials', async () => {
      const mockApplications = [
        {
          application: 'Outlook 2019',
          application_code: 'ol2019',
          platform_name: 'Windows',
          platform_type: 'desktop',
          status: 'available',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ applications: mockApplications }),
      });

      const result = await service.testConnection();

      expect(result.success).toBe(true);
      expect(result.serviceInfo?.name).toBe('Litmus');
      expect(service.getStatus()).toBe('connected');
    });

    it('should fail connection test with invalid credentials', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => 'Invalid credentials',
      });

      const result = await service.testConnection();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(service.getStatus()).toBe('error');
    });

    it('should handle network errors', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

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
        json: async () => ({ applications: [] }),
      });

      await service.connect();

      expect(service.getStatus()).toBe('connected');
    });

    it('should throw error with invalid credentials', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => 'Invalid credentials',
      });

      await expect(service.connect()).rejects.toThrow(
        'Failed to connect to Litmus: Invalid credentials'
      );
      expect(service.getStatus()).toBe('error');
    });
  });

  describe('disconnect', () => {
    it('should disconnect and reset status', async () => {
      await service.disconnect();
      expect(service.getStatus()).toBe('disconnected');
    });
  });

  describe('getAvailableClients', () => {
    it('should return available email clients', async () => {
      const mockApplications = [
        {
          application: 'Outlook 2019',
          application_code: 'ol2019',
          platform_name: 'Windows',
          platform_type: 'desktop',
          status: 'available',
        },
        {
          application: 'Gmail',
          application_code: 'gmail',
          platform_name: 'Web',
          platform_type: 'webmail',
          status: 'available',
        },
        {
          application: 'iPhone 13',
          application_code: 'iphone13',
          platform_name: 'iOS',
          platform_type: 'mobile_ios',
          status: 'available',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ applications: mockApplications }),
      });

      const clients = await service.getAvailableClients();

      expect(clients).toHaveLength(3);
      expect(clients[0]).toEqual({
        id: 'ol2019',
        name: 'Outlook 2019',
        platform: 'desktop',
        available: true,
      });
    });

    it('should filter out unavailable clients', async () => {
      const mockApplications = [
        {
          application: 'Outlook 2019',
          application_code: 'ol2019',
          platform_name: 'Windows',
          platform_type: 'desktop',
          status: 'available',
        },
        {
          application: 'Old Client',
          application_code: 'old',
          platform_name: 'Windows',
          platform_type: 'desktop',
          status: 'unavailable',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ applications: mockApplications }),
      });

      const clients = await service.getAvailableClients();

      expect(clients).toHaveLength(1);
      expect(clients[0].id).toBe('ol2019');
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
      // Mock successful connection
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ applications: [] }),
      });
      await service.connect();
      vi.clearAllMocks();
    });

    it('should send test successfully', async () => {
      const mockResponse = {
        id: 'test-123',
        state: 'pending',
        url_or_guid: 'abc-def-ghi',
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
        clients: ['ol2019', 'gmail'],
      });

      expect(result.testId).toBe('test-123');
      expect(result.status).toBe('pending');
      expect(result.resultsUrl).toContain('abc-def-ghi');
    });

    it('should throw error when not connected', async () => {
      const disconnectedService = new LitmusTestingService(config);

      await expect(
        disconnectedService.sendTest({
          name: 'Test',
          subject: 'Test',
          htmlContent: '<html></html>',
          clients: ['ol2019'],
        })
      ).rejects.toThrow('Not connected to Litmus');
    });

    it('should handle API errors', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        text: async () => 'Internal server error',
      });

      await expect(
        service.sendTest({
          name: 'Test',
          subject: 'Test',
          htmlContent: '<html></html>',
          clients: ['ol2019'],
        })
      ).rejects.toThrow('Failed to send test to Litmus');
    });
  });

  describe('getTestResults', () => {
    it('should fetch test results', async () => {
      const mockResponse = {
        id: 'test-123',
        state: 'completed',
        url_or_guid: 'abc-def-ghi',
        created_at: '2024-01-01T00:00:00Z',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.getTestResults('test-123');

      expect(result.testId).toBe('test-123');
      expect(result.status).toBe('completed');
    });

    it('should handle errors when fetching results', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Test not found',
      });

      await expect(service.getTestResults('invalid-id')).rejects.toThrow(
        'Failed to get test results from Litmus'
      );
    });
  });

  describe('cancelTest', () => {
    it('should return false as Litmus does not support cancellation', async () => {
      const result = await service.cancelTest('test-123');
      expect(result).toBe(false);
    });
  });

  describe('buildAuthHeaders', () => {
    it('should build basic auth headers', () => {
      const headers = (service as any).buildAuthHeaders();

      expect(headers.Authorization).toMatch(/^Basic /);
    });

    it('should build bearer token headers with api-key auth', () => {
      const apiKeyConfig: EmailTestingConfig = {
        provider: 'litmus',
        apiEndpoint: 'https://api.litmus.com/v1',
        authMethod: 'api-key',
        apiKey: 'test-api-key',
      };

      const apiKeyService = new LitmusTestingService(apiKeyConfig);
      const headers = (apiKeyService as any).buildAuthHeaders();

      expect(headers.Authorization).toBe('Bearer test-api-key');
    });
  });
});
