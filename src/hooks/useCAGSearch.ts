/**
 * Custom hook for managing CAG search functionality
 * 
 * This hook provides state management for searching and assigning unassigned CAGs including:
 * - Searching for unassigned CAGs with filter criteria
 * - Managing selected CAGs for assignment
 * - Assigning selected CAGs to an operational unit
 * 
 * It handles fetching data from the API, managing loading states, and error handling.
 */

import { useState } from 'react';
import { cagApiService } from '../services/cagApiService';
import type { UnassignedCAG, SearchCAGsParams } from '../types/cag.types';

/**
 * Return type for useCAGSearch hook
 */
export interface UseCAGSearchReturn {
  /** List of unassigned CAGs from search results */
  searchResults: UnassignedCAG[];
  /** Loading state for search operations */
  isSearching: boolean;
  /** Error message if any API call fails */
  error: string | null;
  /** Array of selected CAG IDs for assignment */
  selectedCAGs: string[];
  /** Current search parameters */
  searchParams: SearchCAGsParams;
  /** Function to update search parameters */
  setSearchParams: (params: SearchCAGsParams) => void;
  /** Function to perform search with current parameters */
  performSearch: () => Promise<void>;
  /** Function to clear search results and parameters */
  clearSearch: () => void;
  /** Function to update selected CAGs */
  setSelectedCAGs: (ids: string[]) => void;
  /** Function to assign selected CAGs to an operational unit */
  assignSelectedCAGs: (
    operationUnitInternalId: string,
    assignmentType: 'Carrier' | 'Account' | 'Group'
  ) => Promise<boolean>;
}

/**
 * Custom hook for managing CAG search functionality
 * 
 * @returns UseCAGSearchReturn object with state and methods
 */
export const useCAGSearch = (): UseCAGSearchReturn => {
  // State for search results and parameters
  const [searchResults, setSearchResults] = useState<UnassignedCAG[]>([]);
  const [searchParams, setSearchParams] = useState<SearchCAGsParams>({});
  
  // State for loading and errors
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for selection
  const [selectedCAGs, setSelectedCAGs] = useState<string[]>([]);

  /**
   * Perform search for unassigned CAGs using current search parameters
   * 
   * Requirements: 3.2, 3.3
   */
  const performSearch = async (): Promise<void> => {
    // Use a functional update to ensure we get the latest searchParams
    setIsSearching(true);
    setError(null);
    
    // Capture current searchParams to avoid stale closure
    const paramsToUse = searchParams;
    const response = await cagApiService.searchCAGs(paramsToUse);

    if (response.error) {
      setError(response.error);
      setSearchResults([]);
    } else if (response.data) {
      setSearchResults(response.data.entities);
    }
    
    setIsSearching(false);
  };

  /**
   * Clear all search parameters, results, and selections
   * 
   * Requirements: 3.5
   */
  const clearSearch = (): void => {
    setSearchParams({});
    setSearchResults([]);
    setSelectedCAGs([]);
    setError(null);
  };

  /**
   * Assign selected CAGs to an operational unit
   * 
   * @param operationUnitInternalId - The internal ID of the operational unit
   * @param assignmentType - The type of assignment (Carrier, Account, or Group)
   * @returns Promise resolving to true if successful, false otherwise
   * 
   * Requirements: 4.2, 4.5, 4.6
   */
  const assignSelectedCAGs = async (
    operationUnitInternalId: string,
    assignmentType: 'Carrier' | 'Account' | 'Group'
  ): Promise<boolean> => {
    // Validate that CAGs are selected
    if (selectedCAGs.length === 0) {
      return false;
    }

    setIsSearching(true);
    setError(null);
    
    const response = await cagApiService.assignCAGs({
      operationUnitInternalId,
      assignmentType,
      cagIds: selectedCAGs,
    });

    if (response.error) {
      setError(response.error);
      setIsSearching(false);
      return false;
    }

    // Clear selection and results after successful assignment
    setSelectedCAGs([]);
    setSearchResults([]);
    setIsSearching(false);
    
    return true;
  };

  return {
    searchResults,
    isSearching,
    error,
    selectedCAGs,
    searchParams,
    setSearchParams,
    performSearch,
    clearSearch,
    setSelectedCAGs,
    assignSelectedCAGs,
  };
};
