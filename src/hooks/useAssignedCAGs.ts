/**
 * Custom hook for managing assigned CAGs data
 * 
 * This hook provides state management for assigned CAGs including:
 * - Fetching assigned CAGs with pagination
 * - Managing selected CAGs for bulk operations
 * - Updating CAG status
 * 
 * It handles fetching data from the API, managing loading states, and error handling.
 */

import { useState, useEffect, useCallback } from 'react';
import { cagApiService } from '../services/cagApiService';
import type { AssignedCAG } from '../types/cag.types';

/**
 * Return type for useAssignedCAGs hook
 */
export interface UseAssignedCAGsReturn {
  /** List of assigned CAGs for the current page */
  assignedCAGs: AssignedCAG[];
  /** Total count of assigned CAGs across all pages */
  totalCount: number;
  /** Current page number (0-indexed) */
  currentPage: number;
  /** Number of items per page */
  pageSize: number;
  /** Loading state for assigned CAGs fetch */
  isLoading: boolean;
  /** Error message if any API call fails */
  error: string | null;
  /** Array of selected CAG IDs for bulk operations */
  selectedCAGs: string[];
  /** Function to update current page */
  setCurrentPage: (page: number) => void;
  /** Function to update page size */
  setPageSize: (size: number) => void;
  /** Function to update selected CAGs */
  setSelectedCAGs: (ids: string[]) => void;
  /** Function to manually refresh assigned CAGs list */
  refreshAssignedCAGs: () => Promise<void>;
  /** Function to update status of selected CAGs */
  updateCAGStatus: (status: string) => Promise<boolean>;
}

/**
 * Custom hook for managing assigned CAGs data
 * 
 * @param operationUnitInternalId - The internal ID of the operational unit (optional)
 * @returns UseAssignedCAGsReturn object with state and methods
 */
export const useAssignedCAGs = (
  operationUnitInternalId: string | undefined
): UseAssignedCAGsReturn => {
  // State for assigned CAGs data
  const [assignedCAGs, setAssignedCAGs] = useState<AssignedCAG[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  // State for loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for selection
  const [selectedCAGs, setSelectedCAGs] = useState<string[]>([]);

  /**
   * Fetch assigned CAGs from the API
   * Uses useCallback to memoize the function and prevent unnecessary re-renders
   */
  const fetchAssignedCAGs = useCallback(async () => {
    // Clear data if no operational unit is selected
    if (!operationUnitInternalId) {
      setAssignedCAGs([]);
      setTotalCount(0);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const response = await cagApiService.fetchAssignedCAGs(
      operationUnitInternalId,
      currentPage,
      pageSize
    );

    if (response.error) {
      setError(response.error);
      setAssignedCAGs([]);
      setTotalCount(0);
    } else if (response.data) {
      setAssignedCAGs(response.data.ouCagList);
      setTotalCount(response.data.count);
    }
    
    setIsLoading(false);
  }, [operationUnitInternalId, currentPage, pageSize]);

  /**
   * Fetch assigned CAGs whenever dependencies change
   */
  useEffect(() => {
    fetchAssignedCAGs();
  }, [fetchAssignedCAGs]);

  /**
   * Update the status of selected CAGs
   * 
   * @param status - The new status to set
   * @returns Promise resolving to true if successful, false otherwise
   */
  const updateCAGStatus = async (status: string): Promise<boolean> => {
    // Validate that CAGs are selected
    if (selectedCAGs.length === 0) {
      return false;
    }

    setIsLoading(true);
    setError(null);
    
    const response = await cagApiService.updateCAGStatus({
      ouCagIds: selectedCAGs,
      status,
    });

    if (response.error) {
      setError(response.error);
      setIsLoading(false);
      return false;
    }

    // Refresh the assigned CAGs list after successful update
    await fetchAssignedCAGs();
    
    // Clear selection after successful update
    setSelectedCAGs([]);
    
    return true;
  };

  return {
    assignedCAGs,
    totalCount,
    currentPage,
    pageSize,
    isLoading,
    error,
    selectedCAGs,
    setCurrentPage,
    setPageSize,
    setSelectedCAGs,
    refreshAssignedCAGs: fetchAssignedCAGs,
    updateCAGStatus,
  };
};
