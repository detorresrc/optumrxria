/**
 * Unit tests for useAssignedCAGs hook
 * 
 * Tests the assigned CAGs fetching with pagination functionality (Task 4.2)
 * Tests the updateCAGStatus method functionality (Task 4.3)
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAssignedCAGs } from './useAssignedCAGs';
import { cagApiService } from '../services/cagApiService';
import type { AssignedCAG, PaginatedAssignedCAGs } from '../types/cag.types';

// Mock the API service
vi.mock('../services/cagApiService', () => ({
  cagApiService: {
    fetchAssignedCAGs: vi.fn(),
    updateCAGStatus: vi.fn(),
  },
}));

describe('useAssignedCAGs - Task 4.2: Assigned CAGs Fetching with Pagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch assigned CAGs when operationUnitInternalId is provided', async () => {
    // Arrange
    const mockAssignedCAGs: AssignedCAG[] = [
      {
        ouCagId: 'OUCAG1',
        operationUnitId: 'OU-1',
        operationUnitInternalId: 'OU-INT-1',
        cagId: 'CAG1',
        effectiveStartDate: '2024-01-01',
        effectiveEndDate: null,
        assigmentStatus: 'ACTIVE',
        carrierId: 'CARR1',
        carrierName: 'Carrier A',
        assignmentLevel: 'CARRIER',
        accountId: 'ACC1',
        accountName: 'Account A',
        groupId: 'GRP1',
        groupName: 'Group A',
      },
      {
        ouCagId: 'OUCAG2',
        operationUnitId: 'OU-1',
        operationUnitInternalId: 'OU-INT-1',
        cagId: 'CAG2',
        effectiveStartDate: '2024-02-01',
        effectiveEndDate: '2024-12-31',
        assigmentStatus: 'INACTIVE',
        carrierId: 'CARR2',
        carrierName: 'Carrier B',
        assignmentLevel: 'ACCOUNT',
        accountId: 'ACC2',
        accountName: 'Account B',
        groupId: 'GRP2',
        groupName: 'Group B',
      },
    ];

    const mockResponse: PaginatedAssignedCAGs = {
      ouCagList: mockAssignedCAGs,
      count: 2,
    };

    vi.mocked(cagApiService.fetchAssignedCAGs).mockResolvedValue({
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(() => useAssignedCAGs('OU-INT-1'));

    // Assert - Initial loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.assignedCAGs).toEqual([]);

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert - Data loaded successfully
    expect(result.current.assignedCAGs).toEqual(mockAssignedCAGs);
    expect(result.current.totalCount).toBe(2);
    expect(result.current.error).toBeNull();
    expect(cagApiService.fetchAssignedCAGs).toHaveBeenCalledWith('OU-INT-1', 0, 10);
    expect(cagApiService.fetchAssignedCAGs).toHaveBeenCalledTimes(1);
  });

  it('should not fetch when operationUnitInternalId is undefined', async () => {
    // Act
    const { result } = renderHook(() => useAssignedCAGs(undefined));

    // Wait a bit to ensure no fetch is triggered
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert - No fetch should be triggered
    expect(cagApiService.fetchAssignedCAGs).not.toHaveBeenCalled();
    expect(result.current.assignedCAGs).toEqual([]);
    expect(result.current.totalCount).toBe(0);
  });

  it('should clear data when operationUnitInternalId becomes undefined', async () => {
    // Arrange
    const mockResponse: PaginatedAssignedCAGs = {
      ouCagList: [
        {
          ouCagId: 'OUCAG1',
          operationUnitId: 'OU-1',
          operationUnitInternalId: 'OU-INT-1',
          cagId: 'CAG1',
          effectiveStartDate: '2024-01-01',
          effectiveEndDate: null,
          assigmentStatus: 'ACTIVE',
          carrierId: 'CARR1',
          carrierName: 'Carrier A',
          assignmentLevel: 'CARRIER',
          accountId: 'ACC1',
          accountName: 'Account A',
          groupId: 'GRP1',
          groupName: 'Group A',
        },
      ],
      count: 1,
    };

    vi.mocked(cagApiService.fetchAssignedCAGs).mockResolvedValue({
      data: mockResponse,
    });

    // Act - Start with a valid operationUnitInternalId
    const { result, rerender } = renderHook(
      ({ ouId }: { ouId: string | undefined }) => useAssignedCAGs(ouId),
      { initialProps: { ouId: 'OU-INT-1' as string | undefined } }
    );

    // Wait for initial data to load
    await waitFor(() => {
      expect(result.current.assignedCAGs.length).toBeGreaterThan(0);
    });

    // Assert - Data is loaded
    expect(result.current.assignedCAGs).toEqual(mockResponse.ouCagList);
    expect(result.current.totalCount).toBe(1);

    // Act - Change to undefined
    rerender({ ouId: undefined });

    // Assert - Data is cleared
    await waitFor(() => {
      expect(result.current.assignedCAGs).toEqual([]);
      expect(result.current.totalCount).toBe(0);
    });
  });

  it('should handle pagination parameters correctly', async () => {
    // Arrange
    const mockResponse: PaginatedAssignedCAGs = {
      ouCagList: [],
      count: 50,
    };

    vi.mocked(cagApiService.fetchAssignedCAGs).mockResolvedValue({
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(() => useAssignedCAGs('OU-INT-1'));

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert - Initial pagination parameters
    expect(cagApiService.fetchAssignedCAGs).toHaveBeenCalledWith('OU-INT-1', 0, 10);

    // Act - Change page
    act(() => {
      result.current.setCurrentPage(2);
    });

    // Wait for fetch with new page
    await waitFor(() => {
      expect(cagApiService.fetchAssignedCAGs).toHaveBeenCalledWith('OU-INT-1', 2, 10);
    });

    // Act - Change page size
    act(() => {
      result.current.setPageSize(25);
    });

    // Wait for fetch with new page size
    await waitFor(() => {
      expect(cagApiService.fetchAssignedCAGs).toHaveBeenCalledWith('OU-INT-1', 2, 25);
    });
  });

  it('should set loading state during fetch', async () => {
    // Arrange
    vi.mocked(cagApiService.fetchAssignedCAGs).mockImplementation(
      () => new Promise((resolve) => {
        setTimeout(() => resolve({ data: { ouCagList: [], count: 0 } }), 100);
      })
    );

    // Act
    const { result } = renderHook(() => useAssignedCAGs('OU-INT-1'));

    // Assert - Loading state is true immediately
    expect(result.current.isLoading).toBe(true);

    // Wait for completion
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should handle errors and update error state', async () => {
    // Arrange
    const errorMessage = 'Failed to fetch assigned CAGs';
    vi.mocked(cagApiService.fetchAssignedCAGs).mockResolvedValue({
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => useAssignedCAGs('OU-INT-1'));

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert - Error state is set and data is cleared
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.assignedCAGs).toEqual([]);
    expect(result.current.totalCount).toBe(0);
  });

  it('should clear error state before fetching', async () => {
    // Arrange - Mock API to fail first, then succeed
    const errorMessage = 'Initial error';
    const mockResponse: PaginatedAssignedCAGs = {
      ouCagList: [],
      count: 0,
    };

    vi.mocked(cagApiService.fetchAssignedCAGs)
      .mockResolvedValueOnce({ error: errorMessage })
      .mockResolvedValueOnce({ data: mockResponse });

    // Act
    const { result } = renderHook(() => useAssignedCAGs('OU-INT-1'));

    // Wait for initial error
    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
    });

    // Act - Trigger refresh
    act(() => {
      result.current.refreshAssignedCAGs();
    });

    // Wait for successful fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert - Error is cleared
    expect(result.current.error).toBeNull();
  });

  it('should handle empty assigned CAGs list', async () => {
    // Arrange
    const mockResponse: PaginatedAssignedCAGs = {
      ouCagList: [],
      count: 0,
    };

    vi.mocked(cagApiService.fetchAssignedCAGs).mockResolvedValue({
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(() => useAssignedCAGs('OU-INT-1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert
    expect(result.current.assignedCAGs).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('should refetch when operationUnitInternalId changes', async () => {
    // Arrange
    const mockResponse1: PaginatedAssignedCAGs = {
      ouCagList: [
        {
          ouCagId: 'OUCAG1',
          operationUnitId: 'OU-1',
          operationUnitInternalId: 'OU-INT-1',
          cagId: 'CAG1',
          effectiveStartDate: '2024-01-01',
          effectiveEndDate: null,
          assigmentStatus: 'ACTIVE',
          carrierId: 'CARR1',
          carrierName: 'Carrier A',
          assignmentLevel: 'CARRIER',
          accountId: 'ACC1',
          accountName: 'Account A',
          groupId: 'GRP1',
          groupName: 'Group A',
        },
      ],
      count: 1,
    };

    const mockResponse2: PaginatedAssignedCAGs = {
      ouCagList: [
        {
          ouCagId: 'OUCAG2',
          operationUnitId: 'OU-2',
          operationUnitInternalId: 'OU-INT-2',
          cagId: 'CAG2',
          effectiveStartDate: '2024-02-01',
          effectiveEndDate: null,
          assigmentStatus: 'ACTIVE',
          carrierId: 'CARR2',
          carrierName: 'Carrier B',
          assignmentLevel: 'ACCOUNT',
          accountId: 'ACC2',
          accountName: 'Account B',
          groupId: 'GRP2',
          groupName: 'Group B',
        },
      ],
      count: 1,
    };

    vi.mocked(cagApiService.fetchAssignedCAGs)
      .mockResolvedValueOnce({ data: mockResponse1 })
      .mockResolvedValueOnce({ data: mockResponse2 });

    // Act - Start with first OU
    const { result, rerender } = renderHook(
      ({ ouId }) => useAssignedCAGs(ouId),
      { initialProps: { ouId: 'OU-INT-1' } }
    );

    // Wait for first fetch
    await waitFor(() => {
      expect(result.current.assignedCAGs).toEqual(mockResponse1.ouCagList);
    });

    // Act - Change to second OU
    rerender({ ouId: 'OU-INT-2' });

    // Wait for second fetch
    await waitFor(() => {
      expect(result.current.assignedCAGs).toEqual(mockResponse2.ouCagList);
    });

    // Assert - Both fetches were called
    expect(cagApiService.fetchAssignedCAGs).toHaveBeenCalledTimes(2);
    expect(cagApiService.fetchAssignedCAGs).toHaveBeenNthCalledWith(1, 'OU-INT-1', 0, 10);
    expect(cagApiService.fetchAssignedCAGs).toHaveBeenNthCalledWith(2, 'OU-INT-2', 0, 10);
  });

  it('should allow manual refresh via refreshAssignedCAGs', async () => {
    // Arrange
    const mockResponse: PaginatedAssignedCAGs = {
      ouCagList: [],
      count: 0,
    };

    vi.mocked(cagApiService.fetchAssignedCAGs).mockResolvedValue({
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(() => useAssignedCAGs('OU-INT-1'));

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert - Initial fetch called once
    expect(cagApiService.fetchAssignedCAGs).toHaveBeenCalledTimes(1);

    // Act - Manual refresh
    act(() => {
      result.current.refreshAssignedCAGs();
    });

    // Wait for refresh to complete
    await waitFor(() => {
      expect(cagApiService.fetchAssignedCAGs).toHaveBeenCalledTimes(2);
    });
  });
});

describe('useAssignedCAGs - Task 4.3: Update CAG Status', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update CAG status successfully', async () => {
    // Arrange
    const mockAssignedCAGs: PaginatedAssignedCAGs = {
      ouCagList: [
        {
          ouCagId: 'OUCAG1',
          operationUnitId: 'OU-1',
          operationUnitInternalId: 'OU-INT-1',
          cagId: 'CAG1',
          effectiveStartDate: '2024-01-01',
          effectiveEndDate: null,
          assigmentStatus: 'ACTIVE',
          carrierId: 'CARR1',
          carrierName: 'Carrier A',
          assignmentLevel: 'CARRIER',
          accountId: 'ACC1',
          accountName: 'Account A',
          groupId: 'GRP1',
          groupName: 'Group A',
        },
      ],
      count: 1,
    };

    vi.mocked(cagApiService.fetchAssignedCAGs).mockResolvedValue({
      data: mockAssignedCAGs,
    });
    vi.mocked(cagApiService.updateCAGStatus).mockResolvedValue({
      data: { message: 'Status updated successfully' },
    });

    // Act
    const { result } = renderHook(() => useAssignedCAGs('OU-INT-1'));

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Select CAGs
    act(() => {
      result.current.setSelectedCAGs(['OUCAG1']);
    });

    // Update status
    let updateResult: boolean = false;
    await act(async () => {
      updateResult = await result.current.updateCAGStatus('INACTIVE');
    });

    // Assert - Update was successful
    expect(updateResult).toBe(true);
    expect(cagApiService.updateCAGStatus).toHaveBeenCalledWith({
      ouCagIds: ['OUCAG1'],
      status: 'INACTIVE',
    });
    expect(cagApiService.updateCAGStatus).toHaveBeenCalledTimes(1);
  });

  it('should refresh assigned CAGs list after successful status update', async () => {
    // Arrange
    const mockAssignedCAGs: PaginatedAssignedCAGs = {
      ouCagList: [],
      count: 0,
    };

    vi.mocked(cagApiService.fetchAssignedCAGs).mockResolvedValue({
      data: mockAssignedCAGs,
    });
    vi.mocked(cagApiService.updateCAGStatus).mockResolvedValue({
      data: { message: 'Status updated successfully' },
    });

    // Act
    const { result } = renderHook(() => useAssignedCAGs('OU-INT-1'));

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert - Initial fetch called once
    expect(cagApiService.fetchAssignedCAGs).toHaveBeenCalledTimes(1);

    // Select CAGs and update status
    act(() => {
      result.current.setSelectedCAGs(['OUCAG1', 'OUCAG2']);
    });

    await act(async () => {
      await result.current.updateCAGStatus('INACTIVE');
    });

    // Assert - Fetch was called again to refresh
    await waitFor(() => {
      expect(cagApiService.fetchAssignedCAGs).toHaveBeenCalledTimes(2);
    });
  });

  it('should clear selected CAGs after successful status update', async () => {
    // Arrange
    const mockAssignedCAGs: PaginatedAssignedCAGs = {
      ouCagList: [],
      count: 0,
    };

    vi.mocked(cagApiService.fetchAssignedCAGs).mockResolvedValue({
      data: mockAssignedCAGs,
    });
    vi.mocked(cagApiService.updateCAGStatus).mockResolvedValue({
      data: { message: 'Status updated successfully' },
    });

    // Act
    const { result } = renderHook(() => useAssignedCAGs('OU-INT-1'));

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Select CAGs
    act(() => {
      result.current.setSelectedCAGs(['OUCAG1', 'OUCAG2']);
    });

    // Assert - CAGs are selected
    expect(result.current.selectedCAGs).toEqual(['OUCAG1', 'OUCAG2']);

    // Update status
    await act(async () => {
      await result.current.updateCAGStatus('INACTIVE');
    });

    // Assert - Selection is cleared
    await waitFor(() => {
      expect(result.current.selectedCAGs).toEqual([]);
    });
  });

  it('should return false when no CAGs are selected', async () => {
    // Arrange
    const mockAssignedCAGs: PaginatedAssignedCAGs = {
      ouCagList: [],
      count: 0,
    };

    vi.mocked(cagApiService.fetchAssignedCAGs).mockResolvedValue({
      data: mockAssignedCAGs,
    });

    // Act
    const { result } = renderHook(() => useAssignedCAGs('OU-INT-1'));

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Try to update status without selecting CAGs
    let updateResult: boolean = false;
    await act(async () => {
      updateResult = await result.current.updateCAGStatus('INACTIVE');
    });

    // Assert - Update returns false and API is not called
    expect(updateResult).toBe(false);
    expect(cagApiService.updateCAGStatus).not.toHaveBeenCalled();
  });

  it('should handle errors during status update', async () => {
    // Arrange
    const mockAssignedCAGs: PaginatedAssignedCAGs = {
      ouCagList: [],
      count: 0,
    };
    const errorMessage = 'Failed to update status';

    vi.mocked(cagApiService.fetchAssignedCAGs).mockResolvedValue({
      data: mockAssignedCAGs,
    });
    vi.mocked(cagApiService.updateCAGStatus).mockResolvedValue({
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => useAssignedCAGs('OU-INT-1'));

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Select CAGs and update status
    act(() => {
      result.current.setSelectedCAGs(['OUCAG1']);
    });

    let updateResult: boolean = false;
    await act(async () => {
      updateResult = await result.current.updateCAGStatus('INACTIVE');
    });

    // Assert - Update failed and error is set
    expect(updateResult).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should set loading state during status update', async () => {
    // Arrange
    const mockAssignedCAGs: PaginatedAssignedCAGs = {
      ouCagList: [],
      count: 0,
    };

    vi.mocked(cagApiService.fetchAssignedCAGs).mockResolvedValue({
      data: mockAssignedCAGs,
    });
    vi.mocked(cagApiService.updateCAGStatus).mockImplementation(
      () => new Promise((resolve) => {
        setTimeout(() => resolve({ data: { message: 'Success' } }), 100);
      })
    );

    // Act
    const { result } = renderHook(() => useAssignedCAGs('OU-INT-1'));

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Select CAGs and start update
    act(() => {
      result.current.setSelectedCAGs(['OUCAG1']);
    });

    // Start update (don't await yet)
    act(() => {
      result.current.updateCAGStatus('INACTIVE');
    });

    // Assert - Loading state is set during update
    expect(result.current.isLoading).toBe(true);

    // Wait for completion
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should clear error state before updating status', async () => {
    // Arrange
    const mockAssignedCAGs: PaginatedAssignedCAGs = {
      ouCagList: [],
      count: 0,
    };

    vi.mocked(cagApiService.fetchAssignedCAGs).mockResolvedValue({
      data: mockAssignedCAGs,
    });
    vi.mocked(cagApiService.updateCAGStatus)
      .mockResolvedValueOnce({ error: 'Initial error' })
      .mockResolvedValueOnce({ data: { message: 'Success' } });

    // Act
    const { result } = renderHook(() => useAssignedCAGs('OU-INT-1'));

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // First update attempt (will fail)
    act(() => {
      result.current.setSelectedCAGs(['OUCAG1']);
    });

    await act(async () => {
      await result.current.updateCAGStatus('INACTIVE');
    });

    // Assert - Error is set
    expect(result.current.error).toBe('Initial error');

    // Second update attempt (will succeed)
    act(() => {
      result.current.setSelectedCAGs(['OUCAG2']);
    });

    await act(async () => {
      await result.current.updateCAGStatus('ACTIVE');
    });

    // Assert - Error is cleared
    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });
});
