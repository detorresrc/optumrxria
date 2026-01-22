# Implementation Plan: CAG API Integration

## Overview

This implementation plan converts the CAG Management page from using mock data to integrating with real API endpoints. The approach follows a bottom-up strategy: first establishing the API service layer and TypeScript types, then building custom hooks for state management, and finally updating UI components to use the hooks. Each step builds incrementally with validation through testing.

## Tasks

- [ ] 1. Create TypeScript type definitions and API service layer
  - [x] 1.1 Create TypeScript interfaces for all API types
    - Create `src/types/cag.types.ts` with interfaces for Client, Contract, OperationalUnit, AssignedCAG, UnassignedCAG, PaginatedAssignedCAGs, SearchCAGsParams, AssignCAGsRequest, UpdateStatusRequest, and ApiResponse
    - Export all interfaces for use across the application
    - _Requirements: 8.1, 8.5_
  
  - [x] 1.2 Implement centralized API service class
    - Create `src/services/cagApiService.ts` with CAGApiService class
    - Implement private `fetchWithErrorHandling` method with HTTP status code handling (200, 400, 404, 500)
    - Configure API_BASE_URL constant as 'http://localhost:8080'
    - _Requirements: 8.2, 8.4, 8.6_
  
  - [x] 1.3 Implement client and contract API methods
    - Add `fetchActiveClients()` method calling GET /api/clients/activeClientList
    - Add `fetchContracts(clientId)` method calling GET /api/clients/contractList
    - Add `fetchOperationalUnits(contractInternalId)` method calling GET /api/clients/activeOperationUnitList
    - _Requirements: 1.1, 1.2, 1.4_
  
  - [x] 1.4 Implement CAG management API methods
    - Add `fetchAssignedCAGs(operationUnitInternalId, page, size)` method calling GET /api/cag/assignedCAGList
    - Add `searchCAGs(params)` method calling GET /api/cag/allListByConditions with query parameter construction
    - Add `assignCAGs(request)` method calling POST /api/cag/assign
    - Add `updateCAGStatus(request)` method calling PUT /api/cag/updateStatus
    - _Requirements: 2.1, 3.2, 4.2, 5.2_
  
  - [ ]* 1.5 Write property test for HTTP status code handling
    - **Property 15: HTTP Status Code Handling**
    - **Validates: Requirements 8.6**
  
  - [ ]* 1.6 Write property test for error handling consistency
    - **Property 10: Error Handling Consistency**
    - **Validates: Requirements 1.5, 4.5, 5.5, 8.3**

- [ ] 2. Implement useClientData custom hook
  - [x] 2.1 Create useClientData hook with state management
    - Create `src/hooks/useClientData.ts`
    - Implement state for clients, contracts, operationalUnits, selected values, loading states, and errors
    - Define UseClientDataReturn interface
    - _Requirements: 1.1, 1.2, 1.4_
  
  - [x] 2.2 Implement client fetching on mount
    - Add useEffect to fetch active clients when component mounts
    - Set loading state during fetch
    - Handle errors and update error state
    - _Requirements: 1.1, 1.5_
  
  - [x] 2.3 Implement cascading contract fetch
    - Add useEffect that triggers when selectedClient changes
    - Clear contracts and selectedContract when no client is selected
    - Fetch contracts for selected client with validation
    - _Requirements: 1.2, 7.1_
  
  - [x] 2.4 Implement cascading operational unit fetch
    - Add useEffect that triggers when selectedContract changes
    - Clear operationalUnits and selectedOperationalUnit when no contract is selected
    - Fetch operational units for selected contract with validation
    - _Requirements: 1.4, 7.2_
  
  - [x] 2.5 Implement contract status calculation utility
    - Create utility function to calculate contract status based on effective and termination dates
    - Handle null termination dates (ongoing contracts)
    - Return 'Active' or 'Inactive' status
    - _Requirements: 1.3_
  
  - [ ]* 2.6 Write property test for cascading data fetch
    - **Property 1: Cascading Data Fetch**
    - **Validates: Requirements 1.2, 1.4, 2.1**
  
  - [ ]* 2.7 Write property test for contract status calculation
    - **Property 2: Contract Status Calculation**
    - **Validates: Requirements 1.3**
  
  - [ ]* 2.8 Write property test for prerequisite validation
    - **Property 12: Prerequisite Validation in Cascade**
    - **Validates: Requirements 7.1, 7.2, 7.3**

- [x] 3. Checkpoint - Verify API service and client data hook
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implement useAssignedCAGs custom hook
  - [x] 4.1 Create useAssignedCAGs hook with state management
    - Create `src/hooks/useAssignedCAGs.ts`
    - Implement state for assignedCAGs, totalCount, pagination, loading, errors, and selectedCAGs
    - Define UseAssignedCAGsReturn interface
    - _Requirements: 2.1, 2.2_
  
  - [x] 4.2 Implement assigned CAGs fetching with pagination
    - Add useEffect with useCallback to fetch assigned CAGs when operationUnitInternalId, currentPage, or pageSize changes
    - Validate operationUnitInternalId before fetching
    - Handle pagination parameters correctly
    - _Requirements: 2.1, 2.2, 2.4, 7.3_
  
  - [x] 4.3 Implement updateCAGStatus method
    - Add async function to call API service updateCAGStatus
    - Refresh assigned CAGs list after successful update
    - Clear selected CAGs after update
    - Handle errors appropriately
    - _Requirements: 5.2, 5.3, 5.5_
  
  - [ ]* 4.4 Write property test for pagination parameter consistency
    - **Property 3: Pagination Parameter Consistency**
    - **Validates: Requirements 2.2, 2.4**
  
  - [ ]* 4.5 Write property test for count display accuracy
    - **Property 5: Count Display Accuracy**
    - **Validates: Requirements 2.5, 3.4**
  
  - [ ]* 4.6 Write property test for data refresh after mutation
    - **Property 9: Data Refresh After Mutation**
    - **Validates: Requirements 4.3, 5.3**

- [ ] 5. Implement useCAGSearch custom hook
  - [x] 5.1 Create useCAGSearch hook with state management
    - Create `src/hooks/useCAGSearch.ts`
    - Implement state for searchResults, isSearching, error, selectedCAGs, and searchParams
    - Define UseCAGSearchReturn interface
    - _Requirements: 3.1, 3.2_
  
  - [x] 5.2 Implement performSearch method
    - Add async function to call API service searchCAGs with current searchParams
    - Handle loading state during search
    - Update searchResults with API response
    - _Requirements: 3.2, 3.3_
  
  - [x] 5.3 Implement clearSearch method
    - Reset searchParams to empty object
    - Clear searchResults and selectedCAGs
    - Clear error state
    - _Requirements: 3.5_
  
  - [x] 5.4 Implement assignSelectedCAGs method
    - Add async function to call API service assignCAGs
    - Validate required fields before assignment
    - Clear selectedCAGs and searchResults after successful assignment
    - Handle errors appropriately
    - _Requirements: 4.2, 4.5, 4.6_
  
  - [ ]* 5.5 Write property test for search parameter completeness
    - **Property 6: Search Parameter Completeness**
    - **Validates: Requirements 3.2, 3.3**
  
  - [ ]* 5.6 Write property test for assignment validation
    - **Property 11: Assignment Validation**
    - **Validates: Requirements 4.6, 7.4**
  
  - [ ]* 5.7 Write property test for date format validation
    - **Property 13: Date Format Validation**
    - **Validates: Requirements 7.6**

- [x] 6. Checkpoint - Verify all custom hooks
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Update ManageCAGsPage component to use useClientData hook
  - [x] 7.1 Integrate useClientData hook
    - Import and use useClientData hook in ManageCAGsPage
    - Replace mock client/contract/OU state with hook values
    - Update dropdown options to use real data from hook
    - _Requirements: 1.1, 1.2, 1.4_
  
  - [x] 7.2 Add loading indicators for dropdowns
    - Display loading state for client dropdown while fetching
    - Display loading state for contract dropdown while fetching
    - Display loading state for operational unit dropdown while fetching
    - _Requirements: 6.1, 6.2_
  
  - [x] 7.3 Add error handling and display
    - Display error messages when API calls fail
    - Use MUI Alert or Snackbar for error display
    - Maintain current state when errors occur
    - _Requirements: 1.5, 6.3_
  
  - [x] 7.4 Implement contract status display
    - Use contract status calculation utility to determine Active/Inactive
    - Display status with appropriate styling
    - _Requirements: 1.3_

- [ ] 8. Update AssignedCAGsAccordion to use useAssignedCAGs hook
  - [x] 8.1 Integrate useAssignedCAGs hook
    - Import and use useAssignedCAGs hook with operationUnitInternalId
    - Replace mock assigned CAGs data with hook values
    - Update total count display with real count from hook
    - _Requirements: 2.1, 2.5_
  
  - [x] 8.2 Implement pagination controls
    - Connect ClientPagination component to hook's currentPage and setCurrentPage
    - Calculate totalPages from totalCount and pageSize
    - Handle page navigation
    - _Requirements: 2.2, 2.4_
  
  - [x] 8.3 Implement bulk status update action
    - Connect bulk action dropdown to updateCAGStatus method
    - Show confirmation modal before updating
    - Display success/error messages after update
    - _Requirements: 5.2, 5.3, 5.5_
  
  - [x] 8.4 Add loading and error states
    - Display loading indicator while fetching assigned CAGs
    - Display error messages when fetch fails
    - Display empty state when no CAGs are assigned
    - _Requirements: 2.6, 6.1, 6.2, 6.3_
  
  - [ ]* 8.5 Write property test for status update request payload
    - **Property 8: Status Update Request Payload Structure**
    - **Validates: Requirements 5.2**

- [ ] 9. Update CAGAssignedTable to display real data
  - [x] 9.1 Update table to use assignedCAGs from hook
    - Replace mockData with assignedCAGs prop
    - Map API response fields to table columns
    - Handle null/empty values for account and group fields
    - _Requirements: 2.3_
  
  - [x] 9.2 Implement row selection
    - Connect checkbox selection to selectedCAGs state
    - Handle select all functionality
    - Handle individual row selection
    - _Requirements: 5.1_
  
  - [ ]* 9.3 Write property test for assigned CAG data completeness
    - **Property 4: Assigned CAG Data Completeness**
    - **Validates: Requirements 2.3**

- [ ] 10. Update AssignCAGsAccordion to use useCAGSearch hook
  - [x] 10.1 Integrate useCAGSearch hook
    - Import and use useCAGSearch hook
    - Replace mock unassigned CAGs data with searchResults
    - Connect search form fields to searchParams state
    - _Requirements: 3.1, 3.2_
  
  - [x] 10.2 Implement search functionality
    - Connect Search button to performSearch method
    - Connect Clear button to clearSearch method
    - Display search results count
    - _Requirements: 3.2, 3.4, 3.5_
  
  - [x] 10.3 Implement CAG assignment flow
    - Connect Assign button to assignSelectedCAGs method
    - Show confirmation modal before assigning
    - Refresh assigned CAGs list after successful assignment (trigger parent refresh)
    - Display success/error messages
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [x] 10.4 Add loading and error states
    - Display loading indicator while searching
    - Display error messages when search fails
    - Display empty state when no results found
    - _Requirements: 3.6, 6.1, 6.2, 6.3_
  
  - [x] 10.5 Implement date validation
    - Add date format validation for start and end date fields
    - Display validation errors inline
    - Prevent search with invalid dates
    - _Requirements: 7.6_
  
  - [ ]* 10.6 Write property test for assignment request payload
    - **Property 7: Assignment Request Payload Structure**
    - **Validates: Requirements 4.2**
  
  - [ ]* 10.7 Write property test for request deduplication
    - **Property 14: Request Deduplication**
    - **Validates: Requirements 6.4**

- [ ] 11. Final integration and testing
  - [x] 11.1 Test complete user flow end-to-end
    - Test client selection → contract selection → OU selection → view assigned CAGs
    - Test search for unassigned CAGs → select CAGs → assign to OU
    - Test select assigned CAGs → bulk status update
    - Verify all loading states display correctly
    - Verify all error states display correctly
    - _Requirements: All_
  
  - [x] 11.2 Remove mock data and unused code
    - Remove all mock data arrays from components
    - Clean up any unused imports
    - Remove commented-out code
    - _Requirements: All_
  
  - [ ]* 11.3 Write integration tests for complete flows
    - Test full client-to-CAG selection flow
    - Test full search-and-assign flow
    - Test full bulk status update flow

- [x] 12. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties with minimum 100 iterations
- Unit tests validate specific examples and edge cases
- The implementation follows a bottom-up approach: types → services → hooks → components
