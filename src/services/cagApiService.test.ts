/**
 * Unit tests for CAGApiService
 * 
 * Tests verify the API service correctly handles successful responses,
 * error conditions, and HTTP status codes.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cagApiService } from './cagApiService';

// Mock fetch globally
globalThis.fetch = vi.fn();

describe('CAGApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchWithErrorHandling', () => {
    it('should handle successful 200 response', async () => {
      const mockData = { clientList: [{ clientId: '1', clientName: 'Test Client', clientReferenceId: 'REF1' }] };
      
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await cagApiService.fetchActiveClients();

      expect(result.data).toEqual(mockData);
      expect(result.error).toBeUndefined();
    });

    it('should handle 400 Bad Request error', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      const result = await cagApiService.fetchActiveClients();

      expect(result.data).toBeUndefined();
      expect(result.error).toBe('Invalid request. Please check your input.');
    });

    it('should handle 404 Not Found error', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      const result = await cagApiService.fetchActiveClients();

      expect(result.data).toBeUndefined();
      expect(result.error).toBe('Resource not found.');
    });

    it('should handle 500 Server Error', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const result = await cagApiService.fetchActiveClients();

      expect(result.data).toBeUndefined();
      expect(result.error).toBe('Server error. Please try again later.');
    });

    it('should handle network errors', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network connection failed')
      );

      const result = await cagApiService.fetchActiveClients();

      expect(result.data).toBeUndefined();
      expect(result.error).toBe('Network connection failed');
    });
  });

  describe('fetchActiveClients', () => {
    it('should call the correct endpoint', async () => {
      const mockData = { 
        clientList: [
          { clientId: '1', clientName: 'Client A', clientReferenceId: 'REF-A' },
          { clientId: '2', clientName: 'Client B', clientReferenceId: 'REF-B' }
        ] 
      };
      
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await cagApiService.fetchActiveClients();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/clients/activeClientList',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result.data).toEqual(mockData);
      expect(result.error).toBeUndefined();
    });

    it('should return error when fetch fails', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Failed to fetch clients')
      );

      const result = await cagApiService.fetchActiveClients();

      expect(result.data).toBeUndefined();
      expect(result.error).toBe('Failed to fetch clients');
    });
  });

  describe('fetchContracts', () => {
    it('should include clientId as query parameter', async () => {
      const mockData = { contractList: [] };
      
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      await cagApiService.fetchContracts('CLIENT123');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/clients/contractList?clientId=CLIENT123',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should return contract data successfully', async () => {
      const mockData = { 
        contractList: [
          { 
            contractInternalId: 'INT-1', 
            contractId: 'CONT-1', 
            effectiveDate: '2024-01-01', 
            terminateDate: null 
          }
        ] 
      };
      
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await cagApiService.fetchContracts('CLIENT123');

      expect(result.data).toEqual(mockData);
      expect(result.error).toBeUndefined();
    });

    it('should handle errors when fetching contracts', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      const result = await cagApiService.fetchContracts('INVALID_CLIENT');

      expect(result.data).toBeUndefined();
      expect(result.error).toBe('Resource not found.');
    });
  });

  describe('fetchOperationalUnits', () => {
    it('should include contractInternalId as query parameter', async () => {
      const mockData = { operationUnitList: [] };
      
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      await cagApiService.fetchOperationalUnits('CONTRACT-INT-123');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/clients/activeOperationUnitList?contractInternalId=CONTRACT-INT-123',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should return operational unit data successfully', async () => {
      const mockData = { 
        operationUnitList: [
          { 
            operationUnitInternalId: 'OU-INT-1', 
            operationUnitId: 'OU-1', 
            operationUnitName: 'Operations Unit A' 
          },
          { 
            operationUnitInternalId: 'OU-INT-2', 
            operationUnitId: 'OU-2', 
            operationUnitName: 'Operations Unit B' 
          }
        ] 
      };
      
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await cagApiService.fetchOperationalUnits('CONTRACT-INT-123');

      expect(result.data).toEqual(mockData);
      expect(result.error).toBeUndefined();
    });

    it('should handle errors when fetching operational units', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const result = await cagApiService.fetchOperationalUnits('CONTRACT-INT-123');

      expect(result.data).toBeUndefined();
      expect(result.error).toBe('Server error. Please try again later.');
    });
  });

  describe('fetchAssignedCAGs', () => {
    it('should include pagination parameters', async () => {
      const mockData = { ouCagList: [], count: 0 };
      
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      await cagApiService.fetchAssignedCAGs('OU123', 2, 20);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/cag/assignedCAGList?operationUnitInternalId=OU123&page=2&size=20',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should use default pagination values', async () => {
      const mockData = { ouCagList: [], count: 0 };
      
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      await cagApiService.fetchAssignedCAGs('OU123');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/cag/assignedCAGList?operationUnitInternalId=OU123&page=0&size=10',
        expect.any(Object)
      );
    });
  });

  describe('searchCAGs', () => {
    it('should construct query parameters from search params', async () => {
      const mockData = { entities: [] };
      
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      await cagApiService.searchCAGs({
        assignmentLevel: 'carrier',
        carrierId: 'CARR123',
        carrierName: 'Test Carrier',
      });

      const callUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(callUrl).toContain('assignmentLevel=carrier');
      expect(callUrl).toContain('carrierId=CARR123');
      expect(callUrl).toContain('carrierName=Test+Carrier');
    });

    it('should omit empty search parameters', async () => {
      const mockData = { entities: [] };
      
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      await cagApiService.searchCAGs({
        carrierId: 'CARR123',
      });

      const callUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(callUrl).toContain('carrierId=CARR123');
      expect(callUrl).not.toContain('assignmentLevel');
    });
  });

  describe('assignCAGs', () => {
    it('should send POST request with correct payload', async () => {
      const mockData = { message: 'Success' };
      
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const request = {
        operationUnitInternalId: 'OU123',
        assignmentType: 'Carrier' as const,
        cagIds: ['CAG1', 'CAG2'],
      };

      await cagApiService.assignCAGs(request);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/cag/assign',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(request),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });
  });

  describe('updateCAGStatus', () => {
    it('should send PUT request with correct payload', async () => {
      const mockData = { message: 'Success' };
      
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const request = {
        ouCagIds: ['OUCAG1', 'OUCAG2'],
        status: 'INACTIVE',
      };

      await cagApiService.updateCAGStatus(request);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/cag/updateStatus',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(request),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });
  });
});
