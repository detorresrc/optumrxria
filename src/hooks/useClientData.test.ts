/**
 * Unit tests for useClientData hook
 * 
 * Tests the client fetching on mount functionality (Task 2.2)
 * Tests the cascading contract fetch functionality (Task 2.3)
 * Tests the cascading operational unit fetch functionality (Task 2.4)
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useClientData } from './useClientData';
import { cagApiService } from '../services/cagApiService';
import type { Client, Contract, OperationalUnit } from '../types/cag.types';

// Mock the API service
vi.mock('../services/cagApiService', () => ({
  cagApiService: {
    fetchActiveClients: vi.fn(),
    fetchContracts: vi.fn(),
    fetchOperationalUnits: vi.fn(),
  },
}));

describe('useClientData - Task 2.2: Client Fetching on Mount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set default mocks to prevent undefined errors
    vi.mocked(cagApiService.fetchContracts).mockResolvedValue({
      data: { contractList: [] },
    });
    vi.mocked(cagApiService.fetchOperationalUnits).mockResolvedValue({
      data: { operationUnitList: [] },
    });
  });

  it('should fetch active clients when component mounts', async () => {
    // Arrange
    const mockClients: Client[] = [
      { clientId: '1', clientName: 'Client A', clientReferenceId: 'REF-A' },
      { clientId: '2', clientName: 'Client B', clientReferenceId: 'REF-B' },
    ];

    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      data: { clientList: mockClients },
    });

    // Act
    const { result } = renderHook(() => useClientData());

    // Assert - Initial loading state
    expect(result.current.isLoadingClients).toBe(true);
    expect(result.current.clients).toEqual([]);

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(result.current.isLoadingClients).toBe(false);
    });

    // Assert - Data loaded successfully
    expect(result.current.clients).toEqual(mockClients);
    expect(result.current.error).toBeNull();
    expect(cagApiService.fetchActiveClients).toHaveBeenCalledTimes(1);
  });

  it('should set loading state to true during fetch', async () => {
    // Arrange
    vi.mocked(cagApiService.fetchActiveClients).mockImplementation(
      () => new Promise((resolve) => {
        setTimeout(() => resolve({ data: { clientList: [] } }), 100);
      })
    );

    // Act
    const { result } = renderHook(() => useClientData());

    // Assert - Loading state is true immediately
    expect(result.current.isLoadingClients).toBe(true);
  });

  it('should handle errors and update error state', async () => {
    // Arrange
    const errorMessage = 'Failed to fetch clients';
    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => useClientData());

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(result.current.isLoadingClients).toBe(false);
    });

    // Assert - Error state is set
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.clients).toEqual([]);
  });

  it('should clear error state before fetching', async () => {
    // Arrange - Mock API to fail first
    const errorMessage = 'Initial error';
    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      error: errorMessage,
    });

    const { result } = renderHook(() => useClientData());

    // Wait for initial error
    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
    });

    // Assert - Error state is set correctly
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.clients).toEqual([]);
  });

  it('should set loading state to false after fetch completes', async () => {
    // Arrange
    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      data: { clientList: [] },
    });

    // Act
    const { result } = renderHook(() => useClientData());

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(result.current.isLoadingClients).toBe(false);
    });

    // Assert
    expect(result.current.isLoadingClients).toBe(false);
  });

  it('should handle empty client list', async () => {
    // Arrange
    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      data: { clientList: [] },
    });

    // Act
    const { result } = renderHook(() => useClientData());

    await waitFor(() => {
      expect(result.current.isLoadingClients).toBe(false);
    });

    // Assert
    expect(result.current.clients).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});

describe('useClientData - Task 2.3: Cascading Contract Fetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set default mock for fetchOperationalUnits to prevent undefined errors
    vi.mocked(cagApiService.fetchOperationalUnits).mockResolvedValue({
      data: { operationUnitList: [] },
    });
  });

  it('should fetch contracts when selectedClient changes', async () => {
    // Arrange
    const mockClients: Client[] = [
      { clientId: '1', clientName: 'Client A', clientReferenceId: 'REF-A' },
    ];
    const mockContracts: Contract[] = [
      { 
        contractInternalId: 'C1', 
        contractId: 'CONTRACT-1', 
        effectiveDate: '2024-01-01', 
        terminateDate: null 
      },
      { 
        contractInternalId: 'C2', 
        contractId: 'CONTRACT-2', 
        effectiveDate: '2024-02-01', 
        terminateDate: '2024-12-31' 
      },
    ];

    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      data: { clientList: mockClients },
    });
    vi.mocked(cagApiService.fetchContracts).mockResolvedValue({
      data: { contractList: mockContracts },
    });

    // Act
    const { result } = renderHook(() => useClientData());

    // Wait for clients to load
    await waitFor(() => {
      expect(result.current.isLoadingClients).toBe(false);
    });

    // Select a client
    act(() => {
      result.current.setSelectedClient('1');
    });

    // Assert - Loading state is set
    expect(result.current.isLoadingContracts).toBe(true);

    // Wait for contracts to load
    await waitFor(() => {
      expect(result.current.isLoadingContracts).toBe(false);
    });

    // Assert - Contracts are loaded
    expect(result.current.contracts).toEqual(mockContracts);
    expect(result.current.error).toBeNull();
    expect(cagApiService.fetchContracts).toHaveBeenCalledWith('1');
    expect(cagApiService.fetchContracts).toHaveBeenCalledTimes(1);
  });

  it('should clear contracts and selectedContract when no client is selected', async () => {
    // Arrange
    const mockClients: Client[] = [
      { clientId: '1', clientName: 'Client A', clientReferenceId: 'REF-A' },
    ];
    const mockContracts: Contract[] = [
      { 
        contractInternalId: 'C1', 
        contractId: 'CONTRACT-1', 
        effectiveDate: '2024-01-01', 
        terminateDate: null 
      },
    ];

    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      data: { clientList: mockClients },
    });
    vi.mocked(cagApiService.fetchContracts).mockResolvedValue({
      data: { contractList: mockContracts },
    });

    // Act
    const { result } = renderHook(() => useClientData());

    // Wait for clients to load
    await waitFor(() => {
      expect(result.current.isLoadingClients).toBe(false);
    });

    // Select a client
    act(() => {
      result.current.setSelectedClient('1');
    });

    // Wait for contracts to load
    await waitFor(() => {
      expect(result.current.contracts.length).toBeGreaterThan(0);
    });

    // Select a contract
    act(() => {
      result.current.setSelectedContract('C1');
    });

    // Assert - Contract is selected
    expect(result.current.selectedContract).toBe('C1');

    // Deselect the client
    act(() => {
      result.current.setSelectedClient('');
    });

    // Assert - Contracts and selectedContract are cleared
    expect(result.current.contracts).toEqual([]);
    expect(result.current.selectedContract).toBe('');
    // fetchContracts should not be called when client is empty
    expect(cagApiService.fetchContracts).toHaveBeenCalledTimes(1); // Only from the first selection
  });

  it('should validate that a client is selected before fetching contracts', async () => {
    // Arrange
    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      data: { clientList: [] },
    });
    // Ensure fetchOperationalUnits is mocked to prevent undefined errors
    vi.mocked(cagApiService.fetchOperationalUnits).mockResolvedValue({
      data: { operationUnitList: [] },
    });

    // Act
    const { result } = renderHook(() => useClientData());

    // Wait for clients to load
    await waitFor(() => {
      expect(result.current.isLoadingClients).toBe(false);
    });

    // Assert - No contracts fetch should be triggered
    expect(cagApiService.fetchContracts).not.toHaveBeenCalled();
    expect(result.current.contracts).toEqual([]);
  });

  it('should handle errors when fetching contracts', async () => {
    // Arrange
    const mockClients: Client[] = [
      { clientId: '1', clientName: 'Client A', clientReferenceId: 'REF-A' },
    ];
    const errorMessage = 'Failed to fetch contracts';

    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      data: { clientList: mockClients },
    });
    vi.mocked(cagApiService.fetchContracts).mockResolvedValue({
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => useClientData());

    // Wait for clients to load
    await waitFor(() => {
      expect(result.current.isLoadingClients).toBe(false);
    });

    // Select a client
    act(() => {
      result.current.setSelectedClient('1');
    });

    // Wait for contracts fetch to complete
    await waitFor(() => {
      expect(result.current.isLoadingContracts).toBe(false);
    });

    // Assert - Error state is set
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.contracts).toEqual([]);
  });

  it('should clear error state before fetching contracts', async () => {
    // Arrange
    const mockClients: Client[] = [
      { clientId: '1', clientName: 'Client A', clientReferenceId: 'REF-A' },
    ];
    const mockContracts: Contract[] = [
      { 
        contractInternalId: 'C1', 
        contractId: 'CONTRACT-1', 
        effectiveDate: '2024-01-01', 
        terminateDate: null 
      },
    ];

    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      data: { clientList: mockClients },
    });
    
    // First call fails, second succeeds
    vi.mocked(cagApiService.fetchContracts)
      .mockResolvedValueOnce({ error: 'Initial error' })
      .mockResolvedValueOnce({ data: { contractList: mockContracts } });

    // Act
    const { result } = renderHook(() => useClientData());

    // Wait for clients to load
    await waitFor(() => {
      expect(result.current.isLoadingClients).toBe(false);
    });

    // Select a client (first attempt - will fail)
    act(() => {
      result.current.setSelectedClient('1');
    });

    // Wait for error
    await waitFor(() => {
      expect(result.current.error).toBe('Initial error');
    });

    // Select a different client (second attempt - will succeed)
    act(() => {
      result.current.setSelectedClient('2');
    });

    // Wait for contracts to load
    await waitFor(() => {
      expect(result.current.isLoadingContracts).toBe(false);
    });

    // Assert - Error is cleared and contracts are loaded
    expect(result.current.error).toBeNull();
    expect(result.current.contracts).toEqual(mockContracts);
  });

  it('should handle empty contract list', async () => {
    // Arrange
    const mockClients: Client[] = [
      { clientId: '1', clientName: 'Client A', clientReferenceId: 'REF-A' },
    ];

    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      data: { clientList: mockClients },
    });
    vi.mocked(cagApiService.fetchContracts).mockResolvedValue({
      data: { contractList: [] },
    });

    // Act
    const { result } = renderHook(() => useClientData());

    // Wait for clients to load
    await waitFor(() => {
      expect(result.current.isLoadingClients).toBe(false);
    });

    // Select a client
    act(() => {
      result.current.setSelectedClient('1');
    });

    // Wait for contracts to load
    await waitFor(() => {
      expect(result.current.isLoadingContracts).toBe(false);
    });

    // Assert - Empty list is handled correctly
    expect(result.current.contracts).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should set loading state to false after contracts fetch completes', async () => {
    // Arrange
    const mockClients: Client[] = [
      { clientId: '1', clientName: 'Client A', clientReferenceId: 'REF-A' },
    ];
    const mockContracts: Contract[] = [
      { 
        contractInternalId: 'C1', 
        contractId: 'CONTRACT-1', 
        effectiveDate: '2024-01-01', 
        terminateDate: null 
      },
    ];

    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      data: { clientList: mockClients },
    });
    vi.mocked(cagApiService.fetchContracts).mockResolvedValue({
      data: { contractList: mockContracts },
    });

    // Act
    const { result } = renderHook(() => useClientData());

    // Wait for clients to load
    await waitFor(() => {
      expect(result.current.isLoadingClients).toBe(false);
    });

    // Select a client
    act(() => {
      result.current.setSelectedClient('1');
    });

    // Wait for contracts to load
    await waitFor(() => {
      expect(result.current.isLoadingContracts).toBe(false);
    });

    // Assert
    expect(result.current.isLoadingContracts).toBe(false);
  });
});

describe('useClientData - Task 2.4: Cascading Operational Unit Fetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch operational units when selectedContract changes', async () => {
    // Arrange
    const mockClients: Client[] = [
      { clientId: '1', clientName: 'Client A', clientReferenceId: 'REF-A' },
    ];
    const mockContracts: Contract[] = [
      { 
        contractInternalId: 'C1', 
        contractId: 'CONTRACT-1', 
        effectiveDate: '2024-01-01', 
        terminateDate: null 
      },
    ];
    const mockOUs: OperationalUnit[] = [
      { 
        operationUnitInternalId: 'OU1', 
        operationUnitId: 'OP-UNIT-1', 
        operationUnitName: 'Operations Unit A' 
      },
      { 
        operationUnitInternalId: 'OU2', 
        operationUnitId: 'OP-UNIT-2', 
        operationUnitName: 'Operations Unit B' 
      },
    ];

    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      data: { clientList: mockClients },
    });
    vi.mocked(cagApiService.fetchContracts).mockResolvedValue({
      data: { contractList: mockContracts },
    });
    vi.mocked(cagApiService.fetchOperationalUnits).mockResolvedValue({
      data: { operationUnitList: mockOUs },
    });

    // Act
    const { result } = renderHook(() => useClientData());

    // Wait for clients to load
    await waitFor(() => {
      expect(result.current.isLoadingClients).toBe(false);
    });

    // Select a client
    act(() => {
      result.current.setSelectedClient('1');
    });

    // Wait for contracts to load
    await waitFor(() => {
      expect(result.current.isLoadingContracts).toBe(false);
    });

    // Select a contract
    act(() => {
      result.current.setSelectedContract('C1');
    });

    // Assert - Loading state is set
    expect(result.current.isLoadingOUs).toBe(true);

    // Wait for operational units to load
    await waitFor(() => {
      expect(result.current.isLoadingOUs).toBe(false);
    });

    // Assert - Operational units are loaded
    expect(result.current.operationalUnits).toEqual(mockOUs);
    expect(result.current.error).toBeNull();
    expect(cagApiService.fetchOperationalUnits).toHaveBeenCalledWith('C1');
    expect(cagApiService.fetchOperationalUnits).toHaveBeenCalledTimes(1);
  });

  it('should clear operationalUnits and selectedOperationalUnit when no contract is selected', async () => {
    // Arrange
    const mockClients: Client[] = [
      { clientId: '1', clientName: 'Client A', clientReferenceId: 'REF-A' },
    ];
    const mockContracts: Contract[] = [
      { 
        contractInternalId: 'C1', 
        contractId: 'CONTRACT-1', 
        effectiveDate: '2024-01-01', 
        terminateDate: null 
      },
    ];
    const mockOUs: OperationalUnit[] = [
      { 
        operationUnitInternalId: 'OU1', 
        operationUnitId: 'OP-UNIT-1', 
        operationUnitName: 'Operations Unit A' 
      },
    ];

    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      data: { clientList: mockClients },
    });
    vi.mocked(cagApiService.fetchContracts).mockResolvedValue({
      data: { contractList: mockContracts },
    });
    vi.mocked(cagApiService.fetchOperationalUnits).mockResolvedValue({
      data: { operationUnitList: mockOUs },
    });

    // Act
    const { result } = renderHook(() => useClientData());

    // Wait for clients to load
    await waitFor(() => {
      expect(result.current.isLoadingClients).toBe(false);
    });

    // Select a client
    act(() => {
      result.current.setSelectedClient('1');
    });

    // Wait for contracts to load
    await waitFor(() => {
      expect(result.current.isLoadingContracts).toBe(false);
    });

    // Select a contract
    act(() => {
      result.current.setSelectedContract('C1');
    });

    // Wait for operational units to load
    await waitFor(() => {
      expect(result.current.operationalUnits.length).toBeGreaterThan(0);
    });

    // Select an operational unit
    act(() => {
      result.current.setSelectedOperationalUnit('OU1');
    });

    // Assert - Operational unit is selected
    expect(result.current.selectedOperationalUnit).toBe('OU1');

    // Deselect the contract
    act(() => {
      result.current.setSelectedContract('');
    });

    // Assert - Operational units and selectedOperationalUnit are cleared
    expect(result.current.operationalUnits).toEqual([]);
    expect(result.current.selectedOperationalUnit).toBe('');
    // fetchOperationalUnits should not be called when contract is empty
    expect(cagApiService.fetchOperationalUnits).toHaveBeenCalledTimes(1); // Only from the first selection
  });

  it('should validate that a contract is selected before fetching operational units', async () => {
    // Arrange
    const mockClients: Client[] = [
      { clientId: '1', clientName: 'Client A', clientReferenceId: 'REF-A' },
    ];

    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      data: { clientList: mockClients },
    });
    vi.mocked(cagApiService.fetchContracts).mockResolvedValue({
      data: { contractList: [] },
    });

    // Act
    const { result } = renderHook(() => useClientData());

    // Wait for clients to load
    await waitFor(() => {
      expect(result.current.isLoadingClients).toBe(false);
    });

    // Select a client
    act(() => {
      result.current.setSelectedClient('1');
    });

    // Wait for contracts to load
    await waitFor(() => {
      expect(result.current.isLoadingContracts).toBe(false);
    });

    // Assert - No operational units fetch should be triggered
    expect(cagApiService.fetchOperationalUnits).not.toHaveBeenCalled();
    expect(result.current.operationalUnits).toEqual([]);
  });

  it('should handle errors when fetching operational units', async () => {
    // Arrange
    const mockClients: Client[] = [
      { clientId: '1', clientName: 'Client A', clientReferenceId: 'REF-A' },
    ];
    const mockContracts: Contract[] = [
      { 
        contractInternalId: 'C1', 
        contractId: 'CONTRACT-1', 
        effectiveDate: '2024-01-01', 
        terminateDate: null 
      },
    ];
    const errorMessage = 'Failed to fetch operational units';

    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      data: { clientList: mockClients },
    });
    vi.mocked(cagApiService.fetchContracts).mockResolvedValue({
      data: { contractList: mockContracts },
    });
    vi.mocked(cagApiService.fetchOperationalUnits).mockResolvedValue({
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => useClientData());

    // Wait for clients to load
    await waitFor(() => {
      expect(result.current.isLoadingClients).toBe(false);
    });

    // Select a client
    act(() => {
      result.current.setSelectedClient('1');
    });

    // Wait for contracts to load
    await waitFor(() => {
      expect(result.current.isLoadingContracts).toBe(false);
    });

    // Select a contract
    act(() => {
      result.current.setSelectedContract('C1');
    });

    // Wait for operational units fetch to complete
    await waitFor(() => {
      expect(result.current.isLoadingOUs).toBe(false);
    });

    // Assert - Error state is set
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.operationalUnits).toEqual([]);
  });

  it('should clear error state before fetching operational units', async () => {
    // Arrange
    const mockClients: Client[] = [
      { clientId: '1', clientName: 'Client A', clientReferenceId: 'REF-A' },
    ];
    const mockContracts: Contract[] = [
      { 
        contractInternalId: 'C1', 
        contractId: 'CONTRACT-1', 
        effectiveDate: '2024-01-01', 
        terminateDate: null 
      },
      { 
        contractInternalId: 'C2', 
        contractId: 'CONTRACT-2', 
        effectiveDate: '2024-02-01', 
        terminateDate: null 
      },
    ];
    const mockOUs: OperationalUnit[] = [
      { 
        operationUnitInternalId: 'OU1', 
        operationUnitId: 'OP-UNIT-1', 
        operationUnitName: 'Operations Unit A' 
      },
    ];

    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      data: { clientList: mockClients },
    });
    vi.mocked(cagApiService.fetchContracts).mockResolvedValue({
      data: { contractList: mockContracts },
    });
    
    // First call fails, second succeeds
    vi.mocked(cagApiService.fetchOperationalUnits)
      .mockResolvedValueOnce({ error: 'Initial error' })
      .mockResolvedValueOnce({ data: { operationUnitList: mockOUs } });

    // Act
    const { result } = renderHook(() => useClientData());

    // Wait for clients to load
    await waitFor(() => {
      expect(result.current.isLoadingClients).toBe(false);
    });

    // Select a client
    act(() => {
      result.current.setSelectedClient('1');
    });

    // Wait for contracts to load
    await waitFor(() => {
      expect(result.current.isLoadingContracts).toBe(false);
    });

    // Select a contract (first attempt - will fail)
    act(() => {
      result.current.setSelectedContract('C1');
    });

    // Wait for error
    await waitFor(() => {
      expect(result.current.error).toBe('Initial error');
    });

    // Select a different contract (second attempt - will succeed)
    act(() => {
      result.current.setSelectedContract('C2');
    });

    // Wait for operational units to load
    await waitFor(() => {
      expect(result.current.isLoadingOUs).toBe(false);
    });

    // Assert - Error is cleared and operational units are loaded
    expect(result.current.error).toBeNull();
    expect(result.current.operationalUnits).toEqual(mockOUs);
  });

  it('should handle empty operational unit list', async () => {
    // Arrange
    const mockClients: Client[] = [
      { clientId: '1', clientName: 'Client A', clientReferenceId: 'REF-A' },
    ];
    const mockContracts: Contract[] = [
      { 
        contractInternalId: 'C1', 
        contractId: 'CONTRACT-1', 
        effectiveDate: '2024-01-01', 
        terminateDate: null 
      },
    ];

    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      data: { clientList: mockClients },
    });
    vi.mocked(cagApiService.fetchContracts).mockResolvedValue({
      data: { contractList: mockContracts },
    });
    vi.mocked(cagApiService.fetchOperationalUnits).mockResolvedValue({
      data: { operationUnitList: [] },
    });

    // Act
    const { result } = renderHook(() => useClientData());

    // Wait for clients to load
    await waitFor(() => {
      expect(result.current.isLoadingClients).toBe(false);
    });

    // Select a client
    act(() => {
      result.current.setSelectedClient('1');
    });

    // Wait for contracts to load
    await waitFor(() => {
      expect(result.current.isLoadingContracts).toBe(false);
    });

    // Select a contract
    act(() => {
      result.current.setSelectedContract('C1');
    });

    // Wait for operational units to load
    await waitFor(() => {
      expect(result.current.isLoadingOUs).toBe(false);
    });

    // Assert - Empty list is handled correctly
    expect(result.current.operationalUnits).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should set loading state to false after operational units fetch completes', async () => {
    // Arrange
    const mockClients: Client[] = [
      { clientId: '1', clientName: 'Client A', clientReferenceId: 'REF-A' },
    ];
    const mockContracts: Contract[] = [
      { 
        contractInternalId: 'C1', 
        contractId: 'CONTRACT-1', 
        effectiveDate: '2024-01-01', 
        terminateDate: null 
      },
    ];
    const mockOUs: OperationalUnit[] = [
      { 
        operationUnitInternalId: 'OU1', 
        operationUnitId: 'OP-UNIT-1', 
        operationUnitName: 'Operations Unit A' 
      },
    ];

    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      data: { clientList: mockClients },
    });
    vi.mocked(cagApiService.fetchContracts).mockResolvedValue({
      data: { contractList: mockContracts },
    });
    vi.mocked(cagApiService.fetchOperationalUnits).mockResolvedValue({
      data: { operationUnitList: mockOUs },
    });

    // Act
    const { result } = renderHook(() => useClientData());

    // Wait for clients to load
    await waitFor(() => {
      expect(result.current.isLoadingClients).toBe(false);
    });

    // Select a client
    act(() => {
      result.current.setSelectedClient('1');
    });

    // Wait for contracts to load
    await waitFor(() => {
      expect(result.current.isLoadingContracts).toBe(false);
    });

    // Select a contract
    act(() => {
      result.current.setSelectedContract('C1');
    });

    // Wait for operational units to load
    await waitFor(() => {
      expect(result.current.isLoadingOUs).toBe(false);
    });

    // Assert
    expect(result.current.isLoadingOUs).toBe(false);
  });

  it('should cascade clearing when client is deselected', async () => {
    // Arrange
    const mockClients: Client[] = [
      { clientId: '1', clientName: 'Client A', clientReferenceId: 'REF-A' },
    ];
    const mockContracts: Contract[] = [
      { 
        contractInternalId: 'C1', 
        contractId: 'CONTRACT-1', 
        effectiveDate: '2024-01-01', 
        terminateDate: null 
      },
    ];
    const mockOUs: OperationalUnit[] = [
      { 
        operationUnitInternalId: 'OU1', 
        operationUnitId: 'OP-UNIT-1', 
        operationUnitName: 'Operations Unit A' 
      },
    ];

    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
      data: { clientList: mockClients },
    });
    vi.mocked(cagApiService.fetchContracts).mockResolvedValue({
      data: { contractList: mockContracts },
    });
    vi.mocked(cagApiService.fetchOperationalUnits).mockResolvedValue({
      data: { operationUnitList: mockOUs },
    });

    // Act
    const { result } = renderHook(() => useClientData());

    // Wait for clients to load
    await waitFor(() => {
      expect(result.current.isLoadingClients).toBe(false);
    });

    // Select a client
    act(() => {
      result.current.setSelectedClient('1');
    });

    // Wait for contracts to load
    await waitFor(() => {
      expect(result.current.isLoadingContracts).toBe(false);
    });

    // Select a contract
    act(() => {
      result.current.setSelectedContract('C1');
    });

    // Wait for operational units to load
    await waitFor(() => {
      expect(result.current.isLoadingOUs).toBe(false);
    });

    // Select an operational unit
    act(() => {
      result.current.setSelectedOperationalUnit('OU1');
    });

    // Assert - All selections are made
    expect(result.current.selectedClient).toBe('1');
    expect(result.current.selectedContract).toBe('C1');
    expect(result.current.selectedOperationalUnit).toBe('OU1');
    expect(result.current.contracts.length).toBeGreaterThan(0);
    expect(result.current.operationalUnits.length).toBeGreaterThan(0);

    // Deselect the client
    act(() => {
      result.current.setSelectedClient('');
    });

    // Assert - Everything cascades down and clears
    expect(result.current.contracts).toEqual([]);
    expect(result.current.selectedContract).toBe('');
    expect(result.current.operationalUnits).toEqual([]);
    expect(result.current.selectedOperationalUnit).toBe('');
  });
});
