/**
 * Centralized API Service for CAG Management
 * 
 * This service handles all HTTP requests to the CAG API backend,
 * providing consistent error handling and type-safe responses.
 */

import type {
  ApiResponse,
  Client,
  Contract,
  OperationalUnit,
  UnassignedCAG,
  PaginatedAssignedCAGs,
  SearchCAGsParams,
  AssignCAGsRequest,
  UpdateStatusRequest,
} from '../types/cag.types';

/**
 * Base URL for the CAG API
 */
const API_BASE_URL = 'http://localhost:8080';

/**
 * CAGApiService class provides methods for all CAG-related API operations
 */
class CAGApiService {
  /**
   * Private method to handle fetch requests with consistent error handling
   * 
   * @param url - The full URL to fetch
   * @param options - Optional fetch configuration
   * @returns Promise resolving to ApiResponse with data or error
   */
  private async fetchWithErrorHandling<T>(
    url: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      // Handle HTTP status codes
      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new Error('Invalid request. Please check your input.');
          case 404:
            throw new Error('Resource not found.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred';
      return { error: errorMessage };
    }
  }

  /**
   * Fetch all active clients
   * 
   * @returns Promise resolving to ApiResponse containing client list
   */
  async fetchActiveClients(): Promise<ApiResponse<{ clientList: Client[] }>> {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/api/clients/activeClientList`
    );
  }

  /**
   * Fetch contracts for a specific client
   * 
   * @param clientId - The ID of the client
   * @returns Promise resolving to ApiResponse containing contract list
   */
  async fetchContracts(clientId: string): Promise<ApiResponse<{ contractList: Contract[] }>> {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/api/clients/contractList?clientId=${clientId}`
    );
  }

  /**
   * Fetch operational units for a specific contract
   * 
   * @param contractInternalId - The internal ID of the contract
   * @returns Promise resolving to ApiResponse containing operational unit list
   */
  async fetchOperationalUnits(
    contractInternalId: string
  ): Promise<ApiResponse<{ operationUnitList: OperationalUnit[] }>> {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/api/clients/activeOperationUnitList?contractInternalId=${contractInternalId}`
    );
  }

  /**
   * Fetch assigned CAGs for a specific operational unit with pagination
   * 
   * @param operationUnitInternalId - The internal ID of the operational unit
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   * @returns Promise resolving to ApiResponse containing paginated assigned CAGs
   */
  async fetchAssignedCAGs(
    operationUnitInternalId: string,
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PaginatedAssignedCAGs>> {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/api/cag/assignedCAGList?operationUnitInternalId=${operationUnitInternalId}&page=${page}&size=${size}`
    );
  }

  /**
   * Search for unassigned CAGs based on filter criteria
   * 
   * @param params - Search parameters for filtering CAGs
   * @returns Promise resolving to ApiResponse containing unassigned CAG list
   */
  async searchCAGs(params: SearchCAGsParams): Promise<ApiResponse<{ entities: UnassignedCAG[] }>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/api/cag/allListByConditions?${queryParams.toString()}`
    );
  }

  /**
   * Assign selected CAGs to an operational unit
   * 
   * @param request - Assignment request containing OU ID, assignment type, and CAG IDs
   * @returns Promise resolving to ApiResponse containing success message
   */
  async assignCAGs(request: AssignCAGsRequest): Promise<ApiResponse<{ message: string }>> {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/api/cag/assign`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  /**
   * Update the status of assigned CAGs
   * 
   * @param request - Status update request containing CAG IDs and new status
   * @returns Promise resolving to ApiResponse containing success message
   */
  async updateCAGStatus(request: UpdateStatusRequest): Promise<ApiResponse<{ message: string }>> {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/api/cag/updateStatus`,
      {
        method: 'PUT',
        body: JSON.stringify(request),
      }
    );
  }
}

/**
 * Singleton instance of CAGApiService for use throughout the application
 */
export const cagApiService = new CAGApiService();
