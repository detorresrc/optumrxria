/**
 * Unit tests for useCAGSearch hook
 * 
 * Tests the CAG search functionality (Tasks 5.1, 5.2, 5.3, 5.4)
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCAGSearch } from './useCAGSearch';
import { cagApiService } from '../services/cagApiService';
import type { UnassignedCAG, SearchCAGsParams } from '../types/cag.types';

// Mock the API service
vi.mock('../services/cagApiService', () => ({
  cagApiService: {
    searchCAGs: vi.fn(),
    assignCAGs: vi.fn(),
  },
}));

describe('useCAGSearch - Task 5.1: Hook State Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty state', () => {
    // Act
    const { result } = renderHook(() => useCAGSearch());

    // Assert
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.isSearching).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.selectedCAGs).toEqual([]);
    expect(result.current.searchParams).toEqual({});
  });

  it('should update search parameters', () => {
    // Arrange
    const { result } = renderHook(() => useCAGSearch());
    const newParams: SearchCAGsParams = {
      assignmentLevel: 'carrier',
      carrierId: 'CARR1',
      carrierName: 'Carrier A',
    };

    // Act
    act(() => {
      result.current.setSearchParams(newParams);
    });

    // Assert
    expect(result.current.searchParams).toEqual(newParams);
  });

  it('should update selected CAGs', () => {
    // Arrange
    const { result } = renderHook(() => useCAGSearch());
    const selectedIds = ['CAG1', 'CAG2', 'CAG3'];

    // Act
    act(() => {
      result.current.setSelectedCAGs(selectedIds);
    });

    // Assert
    expect(result.current.selectedCAGs).toEqual(selectedIds);
  });
});

describe('useCAGSearch - Task 5.2: Perform Search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should perform search with search parameters', async () => {
    // Arrange
    const mockUnassignedCAGs: UnassignedCAG[] = [
      {
        cagId: 'CAG1',
        carrierId: 'CARR1',
        carrierName: 'Carrier A',
        accountId: 'ACC1',
        accountName: 'Account A',
        groupId: 'GRP1',
        groupName: 'Group A',
      },
      {
        cagId: 'CAG2',
        carrierId: 'CARR2',
        carrierName: 'Carrier B',
        accountId: 'ACC2',
        accountName: 'Account B',
        groupId: 'GRP2',
        groupName: 'Group B',
      },
    ];

    vi.mocked(cagApiService.searchCAGs).mockResolvedValue({
      data: { entities: mockUnassignedCAGs },
    });

    const { result } = renderHook(() => useCAGSearch());

    // Set search parameters
    const searchParams: SearchCAGsParams = {
      assignmentLevel: 'carrier',
      carrierId: 'CARR1',
    };

    act(() => {
      result.current.setSearchParams(searchParams);
    });

    // Act
    await act(async () => {
      await result.current.performSearch();
    });

    // Assert
    expect(cagApiService.searchCAGs).toHaveBeenCalledWith(searchParams);
    expect(result.current.searchResults).toEqual(mockUnassignedCAGs);
    expect(result.current.isSearching).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set loading state during search', async () => {
    // Arrange
    vi.mocked(cagApiService.searchCAGs).mockImplementation(
      () => new Promise((resolve) => {
        setTimeout(() => resolve({ data: { entities: [] } }), 100);
      })
    );

    const { result } = renderHook(() => useCAGSearch());

    // Act - Start search (don't await yet)
    act(() => {
      result.current.performSearch();
    });

    // Assert - Loading state is true immediately
    expect(result.current.isSearching).toBe(true);

    // Wait for completion
    await waitFor(() => {
      expect(result.current.isSearching).toBe(false);
    });
  });

  it('should handle search with empty results', async () => {
    // Arrange
    vi.mocked(cagApiService.searchCAGs).mockResolvedValue({
      data: { entities: [] },
    });

    const { result } = renderHook(() => useCAGSearch());

    // Act
    await act(async () => {
      await result.current.performSearch();
    });

    // Assert
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should handle search errors', async () => {
    // Arrange
    const errorMessage = 'Failed to search CAGs';
    vi.mocked(cagApiService.searchCAGs).mockResolvedValue({
      error: errorMessage,
    });

    const { result } = renderHook(() => useCAGSearch());

    // Act
    await act(async () => {
      await result.current.performSearch();
    });

    // Assert
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.isSearching).toBe(false);
  });

  it('should clear error state before searching', async () => {
    // Arrange
    vi.mocked(cagApiService.searchCAGs)
      .mockResolvedValueOnce({ error: 'Initial error' })
      .mockResolvedValueOnce({ data: { entities: [] } });

    const { result } = renderHook(() => useCAGSearch());

    // First search (will fail)
    await act(async () => {
      await result.current.performSearch();
    });

    // Assert - Error is set
    expect(result.current.error).toBe('Initial error');

    // Second search (will succeed)
    await act(async () => {
      await result.current.performSearch();
    });

    // Assert - Error is cleared
    expect(result.current.error).toBeNull();
  });

  it('should search with all filter parameters', async () => {
    // Arrange
    const mockUnassignedCAGs: UnassignedCAG[] = [
      {
        cagId: 'CAG1',
        carrierId: 'CARR1',
        carrierName: 'Carrier A',
        accountId: 'ACC1',
        accountName: 'Account A',
        groupId: 'GRP1',
        groupName: 'Group A',
      },
    ];

    vi.mocked(cagApiService.searchCAGs).mockResolvedValue({
      data: { entities: mockUnassignedCAGs },
    });

    const { result } = renderHook(() => useCAGSearch());

    // Set comprehensive search parameters
    const searchParams: SearchCAGsParams = {
      assignmentLevel: 'group',
      carrierId: 'CARR1',
      carrierName: 'Carrier A',
      accountId: 'ACC1',
      accountName: 'Account A',
      groupId: 'GRP1',
      groupName: 'Group A',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    };

    act(() => {
      result.current.setSearchParams(searchParams);
    });

    // Act
    await act(async () => {
      await result.current.performSearch();
    });

    // Assert - All parameters are passed to API
    expect(cagApiService.searchCAGs).toHaveBeenCalledWith(searchParams);
    expect(result.current.searchResults).toEqual(mockUnassignedCAGs);
  });

  it('should search with empty parameters', async () => {
    // Arrange
    vi.mocked(cagApiService.searchCAGs).mockResolvedValue({
      data: { entities: [] },
    });

    const { result } = renderHook(() => useCAGSearch());

    // Act - Search without setting any parameters
    await act(async () => {
      await result.current.performSearch();
    });

    // Assert - Empty parameters are passed
    expect(cagApiService.searchCAGs).toHaveBeenCalledWith({});
  });
});

describe('useCAGSearch - Task 5.3: Clear Search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should clear all search state', async () => {
    // Arrange
    const mockUnassignedCAGs: UnassignedCAG[] = [
      {
        cagId: 'CAG1',
        carrierId: 'CARR1',
        carrierName: 'Carrier A',
        accountId: 'ACC1',
        accountName: 'Account A',
        groupId: 'GRP1',
        groupName: 'Group A',
      },
    ];

    vi.mocked(cagApiService.searchCAGs).mockResolvedValue({
      data: { entities: mockUnassignedCAGs },
    });

    const { result } = renderHook(() => useCAGSearch());

    // Set up state with data
    const searchParams: SearchCAGsParams = {
      assignmentLevel: 'carrier',
      carrierId: 'CARR1',
    };

    act(() => {
      result.current.setSearchParams(searchParams);
    });

    await act(async () => {
      await result.current.performSearch();
    });

    act(() => {
      result.current.setSelectedCAGs(['CAG1']);
    });

    // Assert - State has data
    expect(result.current.searchResults).toEqual(mockUnassignedCAGs);
    expect(result.current.searchParams).toEqual(searchParams);
    expect(result.current.selectedCAGs).toEqual(['CAG1']);

    // Act - Clear search
    act(() => {
      result.current.clearSearch();
    });

    // Assert - All state is cleared
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.searchParams).toEqual({});
    expect(result.current.selectedCAGs).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should clear error state', async () => {
    // Arrange
    vi.mocked(cagApiService.searchCAGs).mockResolvedValue({
      error: 'Search failed',
    });

    const { result } = renderHook(() => useCAGSearch());

    // Perform search that will fail
    await act(async () => {
      await result.current.performSearch();
    });

    // Assert - Error is set
    expect(result.current.error).toBe('Search failed');

    // Act - Clear search
    act(() => {
      result.current.clearSearch();
    });

    // Assert - Error is cleared
    expect(result.current.error).toBeNull();
  });

  it('should be safe to call clearSearch multiple times', () => {
    // Arrange
    const { result } = renderHook(() => useCAGSearch());

    // Act - Clear multiple times
    act(() => {
      result.current.clearSearch();
      result.current.clearSearch();
      result.current.clearSearch();
    });

    // Assert - State remains empty
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.searchParams).toEqual({});
    expect(result.current.selectedCAGs).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});

describe('useCAGSearch - Task 5.4: Assign Selected CAGs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should assign selected CAGs successfully', async () => {
    // Arrange
    vi.mocked(cagApiService.assignCAGs).mockResolvedValue({
      data: { message: 'CAGs assigned successfully' },
    });

    const { result } = renderHook(() => useCAGSearch());

    // Select CAGs
    act(() => {
      result.current.setSelectedCAGs(['CAG1', 'CAG2']);
    });

    // Act
    let assignResult: boolean = false;
    await act(async () => {
      assignResult = await result.current.assignSelectedCAGs('OU-INT-1', 'Carrier');
    });

    // Assert
    expect(assignResult).toBe(true);
    expect(cagApiService.assignCAGs).toHaveBeenCalledWith({
      operationUnitInternalId: 'OU-INT-1',
      assignmentType: 'Carrier',
      cagIds: ['CAG1', 'CAG2'],
    });
  });

  it('should clear selection and results after successful assignment', async () => {
    // Arrange
    const mockUnassignedCAGs: UnassignedCAG[] = [
      {
        cagId: 'CAG1',
        carrierId: 'CARR1',
        carrierName: 'Carrier A',
        accountId: 'ACC1',
        accountName: 'Account A',
        groupId: 'GRP1',
        groupName: 'Group A',
      },
    ];

    vi.mocked(cagApiService.searchCAGs).mockResolvedValue({
      data: { entities: mockUnassignedCAGs },
    });
    vi.mocked(cagApiService.assignCAGs).mockResolvedValue({
      data: { message: 'Success' },
    });

    const { result } = renderHook(() => useCAGSearch());

    // Perform search and select CAGs
    await act(async () => {
      await result.current.performSearch();
    });

    act(() => {
      result.current.setSelectedCAGs(['CAG1']);
    });

    // Assert - State has data
    expect(result.current.searchResults).toEqual(mockUnassignedCAGs);
    expect(result.current.selectedCAGs).toEqual(['CAG1']);

    // Act - Assign CAGs
    await act(async () => {
      await result.current.assignSelectedCAGs('OU-INT-1', 'Carrier');
    });

    // Assert - Selection and results are cleared
    expect(result.current.selectedCAGs).toEqual([]);
    expect(result.current.searchResults).toEqual([]);
  });

  it('should return false when no CAGs are selected', async () => {
    // Arrange
    const { result } = renderHook(() => useCAGSearch());

    // Act - Try to assign without selecting CAGs
    let assignResult: boolean = false;
    await act(async () => {
      assignResult = await result.current.assignSelectedCAGs('OU-INT-1', 'Carrier');
    });

    // Assert
    expect(assignResult).toBe(false);
    expect(cagApiService.assignCAGs).not.toHaveBeenCalled();
  });

  it('should handle assignment errors', async () => {
    // Arrange
    const errorMessage = 'Failed to assign CAGs';
    vi.mocked(cagApiService.assignCAGs).mockResolvedValue({
      error: errorMessage,
    });

    const { result } = renderHook(() => useCAGSearch());

    // Select CAGs
    act(() => {
      result.current.setSelectedCAGs(['CAG1']);
    });

    // Act
    let assignResult: boolean = false;
    await act(async () => {
      assignResult = await result.current.assignSelectedCAGs('OU-INT-1', 'Carrier');
    });

    // Assert
    expect(assignResult).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should set loading state during assignment', async () => {
    // Arrange
    vi.mocked(cagApiService.assignCAGs).mockImplementation(
      () => new Promise((resolve) => {
        setTimeout(() => resolve({ data: { message: 'Success' } }), 100);
      })
    );

    const { result } = renderHook(() => useCAGSearch());

    // Select CAGs
    act(() => {
      result.current.setSelectedCAGs(['CAG1']);
    });

    // Act - Start assignment (don't await yet)
    act(() => {
      result.current.assignSelectedCAGs('OU-INT-1', 'Carrier');
    });

    // Assert - Loading state is set
    expect(result.current.isSearching).toBe(true);

    // Wait for completion
    await waitFor(() => {
      expect(result.current.isSearching).toBe(false);
    });
  });

  it('should clear error state before assignment', async () => {
    // Arrange
    vi.mocked(cagApiService.assignCAGs)
      .mockResolvedValueOnce({ error: 'Initial error' })
      .mockResolvedValueOnce({ data: { message: 'Success' } });

    const { result } = renderHook(() => useCAGSearch());

    // First assignment attempt (will fail)
    act(() => {
      result.current.setSelectedCAGs(['CAG1']);
    });

    await act(async () => {
      await result.current.assignSelectedCAGs('OU-INT-1', 'Carrier');
    });

    // Assert - Error is set
    expect(result.current.error).toBe('Initial error');

    // Second assignment attempt (will succeed)
    act(() => {
      result.current.setSelectedCAGs(['CAG2']);
    });

    await act(async () => {
      await result.current.assignSelectedCAGs('OU-INT-1', 'Account');
    });

    // Assert - Error is cleared
    expect(result.current.error).toBeNull();
  });

  it('should support different assignment types', async () => {
    // Arrange
    vi.mocked(cagApiService.assignCAGs).mockResolvedValue({
      data: { message: 'Success' },
    });

    const { result } = renderHook(() => useCAGSearch());

    act(() => {
      result.current.setSelectedCAGs(['CAG1']);
    });

    // Test Carrier assignment
    await act(async () => {
      await result.current.assignSelectedCAGs('OU-INT-1', 'Carrier');
    });

    expect(cagApiService.assignCAGs).toHaveBeenLastCalledWith({
      operationUnitInternalId: 'OU-INT-1',
      assignmentType: 'Carrier',
      cagIds: ['CAG1'],
    });

    // Test Account assignment
    act(() => {
      result.current.setSelectedCAGs(['CAG2']);
    });

    await act(async () => {
      await result.current.assignSelectedCAGs('OU-INT-2', 'Account');
    });

    expect(cagApiService.assignCAGs).toHaveBeenLastCalledWith({
      operationUnitInternalId: 'OU-INT-2',
      assignmentType: 'Account',
      cagIds: ['CAG2'],
    });

    // Test Group assignment
    act(() => {
      result.current.setSelectedCAGs(['CAG3']);
    });

    await act(async () => {
      await result.current.assignSelectedCAGs('OU-INT-3', 'Group');
    });

    expect(cagApiService.assignCAGs).toHaveBeenLastCalledWith({
      operationUnitInternalId: 'OU-INT-3',
      assignmentType: 'Group',
      cagIds: ['CAG3'],
    });
  });

  it('should handle assignment with multiple selected CAGs', async () => {
    // Arrange
    vi.mocked(cagApiService.assignCAGs).mockResolvedValue({
      data: { message: 'Success' },
    });

    const { result } = renderHook(() => useCAGSearch());

    // Select multiple CAGs
    const selectedIds = ['CAG1', 'CAG2', 'CAG3', 'CAG4', 'CAG5'];
    act(() => {
      result.current.setSelectedCAGs(selectedIds);
    });

    // Act
    await act(async () => {
      await result.current.assignSelectedCAGs('OU-INT-1', 'Group');
    });

    // Assert
    expect(cagApiService.assignCAGs).toHaveBeenCalledWith({
      operationUnitInternalId: 'OU-INT-1',
      assignmentType: 'Group',
      cagIds: selectedIds,
    });
  });

  it('should not clear selection on assignment failure', async () => {
    // Arrange
    vi.mocked(cagApiService.assignCAGs).mockResolvedValue({
      error: 'Assignment failed',
    });

    const { result } = renderHook(() => useCAGSearch());

    // Select CAGs
    act(() => {
      result.current.setSelectedCAGs(['CAG1', 'CAG2']);
    });

    // Act - Assignment will fail
    await act(async () => {
      await result.current.assignSelectedCAGs('OU-INT-1', 'Carrier');
    });

    // Assert - Selection is preserved on failure
    expect(result.current.selectedCAGs).toEqual(['CAG1', 'CAG2']);
  });
});

describe('useCAGSearch - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle complete search and assign workflow', async () => {
    // Arrange
    const mockUnassignedCAGs: UnassignedCAG[] = [
      {
        cagId: 'CAG1',
        carrierId: 'CARR1',
        carrierName: 'Carrier A',
        accountId: 'ACC1',
        accountName: 'Account A',
        groupId: 'GRP1',
        groupName: 'Group A',
      },
      {
        cagId: 'CAG2',
        carrierId: 'CARR1',
        carrierName: 'Carrier A',
        accountId: 'ACC2',
        accountName: 'Account B',
        groupId: 'GRP2',
        groupName: 'Group B',
      },
    ];

    vi.mocked(cagApiService.searchCAGs).mockResolvedValue({
      data: { entities: mockUnassignedCAGs },
    });
    vi.mocked(cagApiService.assignCAGs).mockResolvedValue({
      data: { message: 'Success' },
    });

    const { result } = renderHook(() => useCAGSearch());

    // Step 1: Set search parameters
    act(() => {
      result.current.setSearchParams({
        assignmentLevel: 'carrier',
        carrierId: 'CARR1',
      });
    });

    // Step 2: Perform search
    await act(async () => {
      await result.current.performSearch();
    });

    expect(result.current.searchResults).toEqual(mockUnassignedCAGs);

    // Step 3: Select CAGs
    act(() => {
      result.current.setSelectedCAGs(['CAG1', 'CAG2']);
    });

    // Step 4: Assign CAGs
    let assignResult: boolean = false;
    await act(async () => {
      assignResult = await result.current.assignSelectedCAGs('OU-INT-1', 'Carrier');
    });

    // Assert - Complete workflow succeeded
    expect(assignResult).toBe(true);
    expect(result.current.selectedCAGs).toEqual([]);
    expect(result.current.searchResults).toEqual([]);
  });

  it('should handle search, clear, and new search workflow', async () => {
    // Arrange
    const mockResults1: UnassignedCAG[] = [
      {
        cagId: 'CAG1',
        carrierId: 'CARR1',
        carrierName: 'Carrier A',
        accountId: 'ACC1',
        accountName: 'Account A',
        groupId: 'GRP1',
        groupName: 'Group A',
      },
    ];

    const mockResults2: UnassignedCAG[] = [
      {
        cagId: 'CAG2',
        carrierId: 'CARR2',
        carrierName: 'Carrier B',
        accountId: 'ACC2',
        accountName: 'Account B',
        groupId: 'GRP2',
        groupName: 'Group B',
      },
    ];

    vi.mocked(cagApiService.searchCAGs)
      .mockResolvedValueOnce({ data: { entities: mockResults1 } })
      .mockResolvedValueOnce({ data: { entities: mockResults2 } });

    const { result } = renderHook(() => useCAGSearch());

    // First search
    act(() => {
      result.current.setSearchParams({ carrierId: 'CARR1' });
    });

    await act(async () => {
      await result.current.performSearch();
    });

    expect(result.current.searchResults).toEqual(mockResults1);

    // Clear search
    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.searchResults).toEqual([]);
    expect(result.current.searchParams).toEqual({});

    // Second search with different parameters
    act(() => {
      result.current.setSearchParams({ carrierId: 'CARR2' });
    });

    await act(async () => {
      await result.current.performSearch();
    });

    expect(result.current.searchResults).toEqual(mockResults2);
  });
});
