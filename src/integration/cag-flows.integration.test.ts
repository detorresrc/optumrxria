/**
 * Integration Tests for CAG Management Flows
 * 
 * These tests verify the integration between hooks and API service
 * without rendering the full UI components.
 * 
 * Requirements: All requirements from CAG API Integration spec
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useClientData } from '../hooks/useClientData';
import { useAssignedCAGs } from '../hooks/useAssignedCAGs';
import { useCAGSearch } from '../hooks/useCAGSearch';
import { cagApiService } from '../services/cagApiService';

// Mock the API service
vi.mock('../services/cagApiService');

// Mock data
const mockClients = {
  clientList: [
    { clientId: 'C001', clientName: 'Test Client 1', clientReferenceId: 'REF001' },
    { clientId: 'C002', clientName: 'Test Client 2', clientReferenceId: 'REF002' },
  ]
};

const mockContracts = {
  contractList: [
    { 
      contractInternalId: 'CT001', 
      contractId: 'CONTRACT-001', 
      effectiveDate: '2024-01-01', 
      terminateDate: '2025-12-31' 
    },
  ]
};

const mockOperationalUnits = {
  operationUnitList: [
    { 
      operationUnitInternalId: 'OU001', 
      operationUnitId: 'OP-001', 
      operationUnitName: 'Operations Unit 1' 
    },
  ]
};

const mockAssignedCAGs = {
  ouCagList: [
    {
      ouCagId: 'OUCAG001',
      operationUnitId: 'OP-001',
      operationUnitInternalId: 'OU001',
      cagId: 'CAG001',
      effectiveStartDate: '2024-01-01',
      effectiveEndDate: '2024-12-31',
      assigmentStatus: 'ACTIVE' as const,
      carrierId: 'CARR001',
      carrierName: 'Test Carrier 1',
      assignmentLevel: 'CARRIER' as const,
      accountId: 'ACC001',
      accountName: 'Test Account 1',
      groupId: 'GRP001',
      groupName: 'Test Group 1',
    },
  ],
  count: 1
};

const mockUnassignedCAGs = {
  entities: [
    {
      cagId: 'CAG003',
      carrierId: 'CARR003',
      carrierName: 'Unassigned Carrier 1',
      accountId: 'ACC003',
      accountName: 'Unassigned Account 1',
      groupId: 'GRP003',
      groupName: 'Unassigned Group 1',
    },
  ]
};

describe('CAG Management Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default successful responses
    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({ data: mockClients });
    vi.mocked(cagApiService.fetchContracts).mockResolvedValue({ data: mockContracts });
    vi.mocked(cagApiService.fetchOperationalUnits).mockResolvedValue({ data: mockOperationalUnits });
    vi.mocked(cagApiService.fetchAssignedCAGs).mockResolvedValue({ data: mockAssignedCAGs });
    vi.mocked(cagApiService.searchCAGs).mockResolvedValue({ data: mockUnassignedCAGs });
    vi.mocked(cagApiService.assignCAGs).mockResolvedValue({ data: { message: 'Success' } });
    vi.mocked(cagApiService.updateCAGStatus).mockResolvedValue({ data: { message: 'Success' } });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Flow 1: Client → Contract → OU Selection', () => {
    it('should fetch clients on mount', async () => {
      const { result } = renderHook(() => useClientData());

      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(result.current.clients).toHaveLength(2);
        expect(result.current.isLoadingClients).toBe(false);
      });
    });

    it('should fetch contracts when client is selected', async () => {
      const { result } = renderHook(() => useClientData());

      await waitFor(() => {
        expect(result.current.clients).toHaveLength(2);
      });

      // Select a client
      result.current.setSelectedClient('C001');

      await waitFor(() => {
        expect(cagApiService.fetchContracts).toHaveBeenCalledWith('C001');
      });

      await waitFor(() => {
        expect(result.current.contracts).toHaveLength(1);
        expect(result.current.isLoadingContracts).toBe(false);
      });
    });

    it('should fetch operational units when contract is selected', async () => {
      const { result } = renderHook(() => useClientData());

      await waitFor(() => {
        expect(result.current.clients).toHaveLength(2);
      });

      result.current.setSelectedClient('C001');

      await waitFor(() => {
        expect(result.current.contracts).toHaveLength(1);
      });

      result.current.setSelectedContract('CT001');

      await waitFor(() => {
        expect(cagApiService.fetchOperationalUnits).toHaveBeenCalledWith('CT001');
      });

      await waitFor(() => {
        expect(result.current.operationalUnits).toHaveLength(1);
        expect(result.current.isLoadingOUs).toBe(false);
      });
    });

    it('should clear contracts when client is deselected', async () => {
      const { result } = renderHook(() => useClientData());

      await waitFor(() => {
        expect(result.current.clients).toHaveLength(2);
      });

      result.current.setSelectedClient('C001');

      await waitFor(() => {
        expect(result.current.contracts).toHaveLength(1);
      });

      result.current.setSelectedClient('');

      await waitFor(() => {
        expect(result.current.contracts).toHaveLength(0);
        expect(result.current.selectedContract).toBe('');
      });
    });
  });

  describe('Flow 2: View Assigned CAGs', () => {
    it('should fetch assigned CAGs when OU is provided', async () => {
      const { result } = renderHook(() => useAssignedCAGs('OU001'));

      await waitFor(() => {
        expect(cagApiService.fetchAssignedCAGs).toHaveBeenCalledWith('OU001', 0, 10);
      });

      await waitFor(() => {
        expect(result.current.assignedCAGs).toHaveLength(1);
        expect(result.current.totalCount).toBe(1);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should not fetch when OU is undefined', async () => {
      const { result } = renderHook(() => useAssignedCAGs(undefined));

      await waitFor(() => {
        expect(result.current.assignedCAGs).toHaveLength(0);
        expect(result.current.totalCount).toBe(0);
      });

      expect(cagApiService.fetchAssignedCAGs).not.toHaveBeenCalled();
    });

    it('should fetch with correct pagination parameters', async () => {
      const { result } = renderHook(() => useAssignedCAGs('OU001'));

      await waitFor(() => {
        expect(result.current.assignedCAGs).toHaveLength(1);
      });

      result.current.setCurrentPage(2);

      await waitFor(() => {
        expect(cagApiService.fetchAssignedCAGs).toHaveBeenCalledWith('OU001', 2, 10);
      });
    });
  });

  describe('Flow 3: Search and Assign CAGs', () => {
    it('should perform search with correct parameters', async () => {
      const { result } = renderHook(() => useCAGSearch());

      result.current.setSearchParams({
        assignmentLevel: 'carrier',
        carrierName: 'Test Carrier',
        startDate: '01/01/2024',
      });

      // Wait for state to update before performing search
      await waitFor(() => {
        expect(result.current.searchParams).toEqual({
          assignmentLevel: 'carrier',
          carrierName: 'Test Carrier',
          startDate: '01/01/2024',
        });
      });

      await result.current.performSearch();

      await waitFor(() => {
        expect(cagApiService.searchCAGs).toHaveBeenCalledWith({
          assignmentLevel: 'carrier',
          carrierName: 'Test Carrier',
          startDate: '01/01/2024',
        });
      });

      await waitFor(() => {
        expect(result.current.searchResults).toHaveLength(1);
        expect(result.current.isSearching).toBe(false);
      });
    });

    it('should clear search results and parameters', async () => {
      const { result } = renderHook(() => useCAGSearch());

      result.current.setSearchParams({ carrierName: 'Test' });
      
      await waitFor(() => {
        expect(result.current.searchParams).toEqual({ carrierName: 'Test' });
      });

      await result.current.performSearch();

      await waitFor(() => {
        expect(result.current.searchResults).toHaveLength(1);
      });

      result.current.clearSearch();

      await waitFor(() => {
        expect(result.current.searchResults).toHaveLength(0);
        expect(result.current.searchParams).toEqual({});
        expect(result.current.selectedCAGs).toHaveLength(0);
      });
    });

    it('should assign selected CAGs successfully', async () => {
      const { result } = renderHook(() => useCAGSearch());

      result.current.setSearchParams({ assignmentLevel: 'carrier' });
      
      await waitFor(() => {
        expect(result.current.searchParams).toEqual({ assignmentLevel: 'carrier' });
      });

      await result.current.performSearch();

      await waitFor(() => {
        expect(result.current.searchResults).toHaveLength(1);
      });

      result.current.setSelectedCAGs(['CAG003']);

      await waitFor(() => {
        expect(result.current.selectedCAGs).toEqual(['CAG003']);
      });

      const success = await result.current.assignSelectedCAGs('OU001', 'Carrier');

      expect(success).toBe(true);
      expect(cagApiService.assignCAGs).toHaveBeenCalledWith({
        operationUnitInternalId: 'OU001',
        assignmentType: 'Carrier',
        cagIds: ['CAG003'],
      });

      await waitFor(() => {
        expect(result.current.selectedCAGs).toHaveLength(0);
        expect(result.current.searchResults).toHaveLength(0);
      });
    });

    it('should not assign when no CAGs are selected', async () => {
      const { result } = renderHook(() => useCAGSearch());

      const success = await result.current.assignSelectedCAGs('OU001', 'Carrier');

      expect(success).toBe(false);
      expect(cagApiService.assignCAGs).not.toHaveBeenCalled();
    });
  });

  describe('Flow 4: Bulk Status Update', () => {
    it('should update status of selected CAGs', async () => {
      const { result } = renderHook(() => useAssignedCAGs('OU001'));

      await waitFor(() => {
        expect(result.current.assignedCAGs).toHaveLength(1);
      });

      result.current.setSelectedCAGs(['OUCAG001']);

      await waitFor(() => {
        expect(result.current.selectedCAGs).toEqual(['OUCAG001']);
      });

      const success = await result.current.updateCAGStatus('INACTIVE');

      expect(success).toBe(true);
      expect(cagApiService.updateCAGStatus).toHaveBeenCalledWith({
        ouCagIds: ['OUCAG001'],
        status: 'INACTIVE',
      });

      // Verify list is refreshed
      await waitFor(() => {
        expect(cagApiService.fetchAssignedCAGs).toHaveBeenCalledTimes(2); // Initial + refresh
      });

      // Verify selection is cleared
      expect(result.current.selectedCAGs).toHaveLength(0);
    });

    it('should not update when no CAGs are selected', async () => {
      const { result } = renderHook(() => useAssignedCAGs('OU001'));

      await waitFor(() => {
        expect(result.current.assignedCAGs).toHaveLength(1);
      });

      const success = await result.current.updateCAGStatus('INACTIVE');

      expect(success).toBe(false);
      expect(cagApiService.updateCAGStatus).not.toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should show loading state while fetching clients', async () => {
      vi.mocked(cagApiService.fetchActiveClients).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: mockClients }), 100))
      );

      const { result } = renderHook(() => useClientData());

      expect(result.current.isLoadingClients).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoadingClients).toBe(false);
      });
    });

    it('should show loading state while searching', async () => {
      vi.mocked(cagApiService.searchCAGs).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: mockUnassignedCAGs }), 100))
      );

      const { result } = renderHook(() => useCAGSearch());

      result.current.setSearchParams({ carrierName: 'Test' });
      
      await waitFor(() => {
        expect(result.current.searchParams).toEqual({ carrierName: 'Test' });
      });

      const searchPromise = result.current.performSearch();

      await waitFor(() => {
        expect(result.current.isSearching).toBe(true);
      });

      await searchPromise;

      await waitFor(() => {
        expect(result.current.isSearching).toBe(false);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle client fetch error', async () => {
      vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
        error: 'Failed to fetch clients'
      });

      const { result } = renderHook(() => useClientData());

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to fetch clients');
        expect(result.current.clients).toHaveLength(0);
      });
    });

    it('should handle search error', async () => {
      vi.mocked(cagApiService.searchCAGs).mockResolvedValue({
        error: 'Search failed'
      });

      const { result } = renderHook(() => useCAGSearch());

      result.current.setSearchParams({ carrierName: 'Test' });
      await result.current.performSearch();

      await waitFor(() => {
        expect(result.current.error).toBe('Search failed');
        expect(result.current.searchResults).toHaveLength(0);
      });
    });

    it('should handle assignment error', async () => {
      vi.mocked(cagApiService.assignCAGs).mockResolvedValue({
        error: 'Assignment failed'
      });

      const { result } = renderHook(() => useCAGSearch());

      result.current.setSelectedCAGs(['CAG003']);
      
      await waitFor(() => {
        expect(result.current.selectedCAGs).toEqual(['CAG003']);
      });

      const success = await result.current.assignSelectedCAGs('OU001', 'Carrier');

      expect(success).toBe(false);
      await waitFor(() => {
        expect(result.current.error).toBe('Assignment failed');
      });
    });

    it('should handle status update error', async () => {
      vi.mocked(cagApiService.updateCAGStatus).mockResolvedValue({
        error: 'Status update failed'
      });

      const { result } = renderHook(() => useAssignedCAGs('OU001'));

      await waitFor(() => {
        expect(result.current.assignedCAGs).toHaveLength(1);
      });

      result.current.setSelectedCAGs(['OUCAG001']);
      
      await waitFor(() => {
        expect(result.current.selectedCAGs).toEqual(['OUCAG001']);
      });

      const success = await result.current.updateCAGStatus('INACTIVE');

      expect(success).toBe(false);
      await waitFor(() => {
        expect(result.current.error).toBe('Status update failed');
      });
    });
  });

  describe('Data Refresh After Mutations', () => {
    it('should refresh assigned CAGs after successful assignment', async () => {
      const searchHook = renderHook(() => useCAGSearch());
      const assignedHook = renderHook(() => useAssignedCAGs('OU001'));

      await waitFor(() => {
        expect(assignedHook.result.current.assignedCAGs).toHaveLength(1);
      });

      const initialCallCount = vi.mocked(cagApiService.fetchAssignedCAGs).mock.calls.length;

      searchHook.result.current.setSelectedCAGs(['CAG003']);
      await searchHook.result.current.assignSelectedCAGs('OU001', 'Carrier');

      // Note: In real implementation, parent component would trigger refresh
      // Here we verify the hook can refresh on demand
      await assignedHook.result.current.refreshAssignedCAGs();

      expect(vi.mocked(cagApiService.fetchAssignedCAGs).mock.calls.length).toBeGreaterThan(initialCallCount);
    });

    it('should refresh assigned CAGs after successful status update', async () => {
      const { result } = renderHook(() => useAssignedCAGs('OU001'));

      await waitFor(() => {
        expect(result.current.assignedCAGs).toHaveLength(1);
      });

      const initialCallCount = vi.mocked(cagApiService.fetchAssignedCAGs).mock.calls.length;

      result.current.setSelectedCAGs(['OUCAG001']);
      
      await waitFor(() => {
        expect(result.current.selectedCAGs).toEqual(['OUCAG001']);
      });

      await result.current.updateCAGStatus('INACTIVE');

      await waitFor(() => {
        expect(vi.mocked(cagApiService.fetchAssignedCAGs).mock.calls.length).toBeGreaterThan(initialCallCount);
      });
    });
  });
});
