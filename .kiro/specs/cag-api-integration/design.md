# Design Document: CAG API Integration

## Overview

This design document outlines the technical approach for integrating the CAG Management page with a REST API backend. The integration replaces mock data with real API calls, implements proper error handling, loading states, and provides a robust service layer architecture.

The design follows React best practices using functional components, custom hooks for state management, and TypeScript for type safety. The API service layer is centralized and reusable, with comprehensive error handling and loading state management.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     UI Components Layer                      │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ ManageCAGsPage   │  │ AssignedCAGs     │                │
│  │                  │  │ Accordion        │                │
│  └────────┬─────────┘  └────────┬─────────┘                │
│           │                     │                            │
│           └──────────┬──────────┘                            │
│                      │                                       │
└──────────────────────┼───────────────────────────────────────┘
                       │
┌──────────────────────┼───────────────────────────────────────┐
│                      │    Custom Hooks Layer                 │
│           ┌──────────▼──────────┐                            │
│           │  useCAGManagement   │                            │
│           │  useClientData      │                            │
│           │  useCAGAssignment   │                            │
│           └──────────┬──────────┘                            │
└──────────────────────┼───────────────────────────────────────┘
                       │
┌──────────────────────┼───────────────────────────────────────┐
│                      │    API Service Layer                  │
│           ┌──────────▼──────────┐                            │
│           │   cagApiService     │                            │
│           │   - fetchClients    │                            │
│           │   - fetchContracts  │                            │
│           │   - fetchOUs        │                            │
│           │   - fetchAssigned   │                            │
│           │   - searchCAGs      │                            │
│           │   - assignCAGs      │                            │
│           │   - updateStatus    │                            │
│           └──────────┬──────────┘                            │
└──────────────────────┼───────────────────────────────────────┘
                       │
                       ▼
              ┌────────────────┐
              │   REST API     │
              │ localhost:8080 │
              └────────────────┘
```

### Component Hierarchy

- **ManageCAGsPage**: Root component managing client/contract/OU selection
  - **AssignedCAGsAccordion**: Displays assigned CAGs with pagination and bulk actions
    - **CAGAssignedTable**: DataGrid showing assigned CAG details
    - **ClientPagination**: Pagination controls
  - **AssignCAGsAccordion**: Search and assign new CAGs
    - **ClientPagination**: Pagination controls for search results

## Components and Interfaces

### API Service Layer

#### Type Definitions

```typescript
// src/types/cag.types.ts

export interface Client {
  clientId: string;
  clientName: string;
  clientReferenceId: string;
}

export interface Contract {
  contractInternalId: string;
  contractId: string;
  effectiveDate: string;
  terminateDate: string | null;
}

export interface OperationalUnit {
  operationUnitInternalId: string;
  operationUnitId: string;
  operationUnitName: string;
}

export interface AssignedCAG {
  ouCagId: string;
  operationUnitId: string;
  operationUnitInternalId: string;
  cagId: string;
  effectiveStartDate: string;
  effectiveEndDate: string | null;
  assigmentStatus: 'ACTIVE' | 'INACTIVE';
  carrierId: string;
  carrierName: string;
  assignmentLevel: 'CARRIER' | 'ACCOUNT' | 'GROUP';
  accountId: string;
  accountName: string;
  groupId: string;
  groupName: string;
}

export interface UnassignedCAG {
  cagId: string;
  carrierId: string;
  carrierName: string;
  accountId: string;
  accountName: string;
  groupId: string;
  groupName: string;
}

export interface PaginatedAssignedCAGs {
  ouCagList: AssignedCAG[];
  count: number;
}

export interface SearchCAGsParams {
  assignmentLevel?: 'carrier' | 'account' | 'group';
  carrierId?: string;
  carrierName?: string;
  accountId?: string;
  accountName?: string;
  groupId?: string;
  groupName?: string;
  startDate?: string;
  endDate?: string;
}

export interface AssignCAGsRequest {
  operationUnitInternalId: string;
  assignmentType: 'Carrier' | 'Account' | 'Group';
  cagIds: string[];
}

export interface UpdateStatusRequest {
  ouCagIds: string[];
  status: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
```

#### API Service Implementation

```typescript
// src/services/cagApiService.ts

const API_BASE_URL = 'http://localhost:8080';

class CAGApiService {
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

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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

  async fetchActiveClients(): Promise<ApiResponse<{ clientList: Client[] }>> {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/api/clients/activeClientList`
    );
  }

  async fetchContracts(clientId: string): Promise<ApiResponse<{ contractList: Contract[] }>> {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/api/clients/contractList?clientId=${clientId}`
    );
  }

  async fetchOperationalUnits(
    contractInternalId: string
  ): Promise<ApiResponse<{ operationUnitList: OperationalUnit[] }>> {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/api/clients/activeOperationUnitList?contractInternalId=${contractInternalId}`
    );
  }

  async fetchAssignedCAGs(
    operationUnitInternalId: string,
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PaginatedAssignedCAGs>> {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/api/cag/assignedCAGList?operationUnitInternalId=${operationUnitInternalId}&page=${page}&size=${size}`
    );
  }

  async searchCAGs(params: SearchCAGsParams): Promise<ApiResponse<{ entities: UnassignedCAG[] }>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/api/cag/allListByConditions?${queryParams.toString()}`
    );
  }

  async assignCAGs(request: AssignCAGsRequest): Promise<ApiResponse<{ message: string }>> {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/api/cag/assign`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

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

export const cagApiService = new CAGApiService();
```

### Custom Hooks

#### useClientData Hook

```typescript
// src/hooks/useClientData.ts

export interface UseClientDataReturn {
  clients: Client[];
  contracts: Contract[];
  operationalUnits: OperationalUnit[];
  selectedClient: string;
  selectedContract: string;
  selectedOperationalUnit: string;
  isLoadingClients: boolean;
  isLoadingContracts: boolean;
  isLoadingOUs: boolean;
  error: string | null;
  setSelectedClient: (clientId: string) => void;
  setSelectedContract: (contractId: string) => void;
  setSelectedOperationalUnit: (ouId: string) => void;
}

export const useClientData = (): UseClientDataReturn => {
  const [clients, setClients] = useState<Client[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [operationalUnits, setOperationalUnits] = useState<OperationalUnit[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedContract, setSelectedContract] = useState('');
  const [selectedOperationalUnit, setSelectedOperationalUnit] = useState('');
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isLoadingContracts, setIsLoadingContracts] = useState(false);
  const [isLoadingOUs, setIsLoadingOUs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch clients on mount
  useEffect(() => {
    const loadClients = async () => {
      setIsLoadingClients(true);
      setError(null);
      const response = await cagApiService.fetchActiveClients();
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setClients(response.data.clientList);
      }
      setIsLoadingClients(false);
    };

    loadClients();
  }, []);

  // Fetch contracts when client changes
  useEffect(() => {
    if (!selectedClient) {
      setContracts([]);
      setSelectedContract('');
      return;
    }

    const loadContracts = async () => {
      setIsLoadingContracts(true);
      setError(null);
      const response = await cagApiService.fetchContracts(selectedClient);
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setContracts(response.data.contractList);
      }
      setIsLoadingContracts(false);
    };

    loadContracts();
  }, [selectedClient]);

  // Fetch operational units when contract changes
  useEffect(() => {
    if (!selectedContract) {
      setOperationalUnits([]);
      setSelectedOperationalUnit('');
      return;
    }

    const loadOUs = async () => {
      setIsLoadingOUs(true);
      setError(null);
      const response = await cagApiService.fetchOperationalUnits(selectedContract);
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setOperationalUnits(response.data.operationUnitList);
      }
      setIsLoadingOUs(false);
    };

    loadOUs();
  }, [selectedContract]);

  return {
    clients,
    contracts,
    operationalUnits,
    selectedClient,
    selectedContract,
    selectedOperationalUnit,
    isLoadingClients,
    isLoadingContracts,
    isLoadingOUs,
    error,
    setSelectedClient,
    setSelectedContract,
    setSelectedOperationalUnit,
  };
};
```

#### useAssignedCAGs Hook

```typescript
// src/hooks/useAssignedCAGs.ts

export interface UseAssignedCAGsReturn {
  assignedCAGs: AssignedCAG[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
  selectedCAGs: string[];
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSelectedCAGs: (ids: string[]) => void;
  refreshAssignedCAGs: () => Promise<void>;
  updateCAGStatus: (status: string) => Promise<boolean>;
}

export const useAssignedCAGs = (
  operationUnitInternalId: string | undefined
): UseAssignedCAGsReturn => {
  const [assignedCAGs, setAssignedCAGs] = useState<AssignedCAG[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCAGs, setSelectedCAGs] = useState<string[]>([]);

  const fetchAssignedCAGs = useCallback(async () => {
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
    } else if (response.data) {
      setAssignedCAGs(response.data.ouCagList);
      setTotalCount(response.data.count);
    }
    setIsLoading(false);
  }, [operationUnitInternalId, currentPage, pageSize]);

  useEffect(() => {
    fetchAssignedCAGs();
  }, [fetchAssignedCAGs]);

  const updateCAGStatus = async (status: string): Promise<boolean> => {
    if (selectedCAGs.length === 0) return false;

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

    await fetchAssignedCAGs();
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
```

#### useCAGSearch Hook

```typescript
// src/hooks/useCAGSearch.ts

export interface UseCAGSearchReturn {
  searchResults: UnassignedCAG[];
  isSearching: boolean;
  error: string | null;
  selectedCAGs: string[];
  searchParams: SearchCAGsParams;
  setSearchParams: (params: SearchCAGsParams) => void;
  performSearch: () => Promise<void>;
  clearSearch: () => void;
  setSelectedCAGs: (ids: string[]) => void;
  assignSelectedCAGs: (
    operationUnitInternalId: string,
    assignmentType: 'Carrier' | 'Account' | 'Group'
  ) => Promise<boolean>;
}

export const useCAGSearch = (): UseCAGSearchReturn => {
  const [searchResults, setSearchResults] = useState<UnassignedCAG[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCAGs, setSelectedCAGs] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState<SearchCAGsParams>({});

  const performSearch = async () => {
    setIsSearching(true);
    setError(null);
    const response = await cagApiService.searchCAGs(searchParams);

    if (response.error) {
      setError(response.error);
      setSearchResults([]);
    } else if (response.data) {
      setSearchResults(response.data.entities);
    }
    setIsSearching(false);
  };

  const clearSearch = () => {
    setSearchParams({});
    setSearchResults([]);
    setSelectedCAGs([]);
    setError(null);
  };

  const assignSelectedCAGs = async (
    operationUnitInternalId: string,
    assignmentType: 'Carrier' | 'Account' | 'Group'
  ): Promise<boolean> => {
    if (selectedCAGs.length === 0) return false;

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
```

## Data Models

### Client Selection Flow

```
Client Selection
    ↓
Contract Fetch (filtered by clientId)
    ↓
Contract Selection
    ↓
Operational Unit Fetch (filtered by contractInternalId)
    ↓
Operational Unit Selection
    ↓
Assigned CAGs Fetch (filtered by operationUnitInternalId)
```

### CAG Assignment Flow

```
Select Assignment Level (Carrier/Account/Group)
    ↓
Enter Search Criteria (dates, carrier/account/group filters)
    ↓
Search for Unassigned CAGs
    ↓
Select CAGs from Results
    ↓
Confirm Assignment
    ↓
POST to /api/cag/assign
    ↓
Refresh Assigned CAGs List
```

### Status Update Flow

```
Select Assigned CAGs (one or more)
    ↓
Choose Bulk Action (e.g., "Set Inactive")
    ↓
Confirm Action
    ↓
PUT to /api/cag/updateStatus
    ↓
Refresh Assigned CAGs List
```

## Error Handling

### Error Categories

1. **Network Errors**: Connection failures, timeouts
2. **HTTP Errors**: 400 (Bad Request), 404 (Not Found), 500 (Server Error)
3. **Validation Errors**: Missing required fields, invalid formats
4. **Business Logic Errors**: Attempting to assign already-assigned CAGs

### Error Handling Strategy

```typescript
// Centralized error handling in API service
private async fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      // Handle specific HTTP status codes
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
```

### UI Error Display

- Display errors using MUI Alert or Snackbar components
- Show field-level validation errors inline
- Provide actionable error messages with retry options
- Maintain form state when errors occur

## Testing Strategy

### Unit Testing

Unit tests will verify specific examples, edge cases, and error conditions:

1. **API Service Tests**
   - Test successful API responses
   - Test error handling for network failures
   - Test HTTP error status codes (400, 404, 500)
   - Test query parameter construction

2. **Custom Hook Tests**
   - Test initial state
   - Test state updates on user actions
   - Test cascading dropdown behavior
   - Test error state management

3. **Component Tests**
   - Test component rendering with different props
   - Test user interactions (button clicks, form submissions)
   - Test loading state display
   - Test error message display

### Property-Based Testing

Property-based tests will verify universal properties across all inputs. Each property test will run a minimum of 100 iterations with randomized inputs.


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Cascading Data Fetch

*For any* selection in the cascading dropdown hierarchy (client → contract → operational unit → assigned CAGs), when a parent selection changes, the system should fetch the corresponding child data with the correct parent identifier as a query parameter.

**Validates: Requirements 1.2, 1.4, 2.1**

### Property 2: Contract Status Calculation

*For any* contract with an effective date and optional termination date, the contract status should be "Active" if the current date is between the effective date and termination date (or if no termination date exists), and "Inactive" otherwise.

**Validates: Requirements 1.3**

### Property 3: Pagination Parameter Consistency

*For any* page number and page size combination, when fetching paginated data, the API request should include both the page number and page size as query parameters matching the user's selection.

**Validates: Requirements 2.2, 2.4**

### Property 4: Assigned CAG Data Completeness

*For any* assigned CAG returned from the API, the displayed data should include all required fields: carrier name, carrier ID, account name, account ID, group name, group ID, assignment status, start date, and end date.

**Validates: Requirements 2.3**

### Property 5: Count Display Accuracy

*For any* API response containing a count field, the displayed count should exactly match the count value from the response.

**Validates: Requirements 2.5, 3.4**

### Property 6: Search Parameter Completeness

*For any* combination of search filters (assignment level, carrier ID, carrier name, account ID, account name, group ID, group name, start date, end date), all non-empty filter values should be included as query parameters in the search API request.

**Validates: Requirements 3.2, 3.3**

### Property 7: Assignment Request Payload Structure

*For any* set of selected CAG IDs, operational unit internal ID, and assignment type, the assignment API request payload should contain exactly these three fields with the correct values and types.

**Validates: Requirements 4.2**

### Property 8: Status Update Request Payload Structure

*For any* set of selected assigned CAG IDs and target status, the status update API request payload should contain exactly the ouCagIds array and status string with the correct values.

**Validates: Requirements 5.2**

### Property 9: Data Refresh After Mutation

*For any* successful mutation operation (CAG assignment or status update), the system should immediately fetch the updated assigned CAGs list to reflect the changes.

**Validates: Requirements 4.3, 5.3**

### Property 10: Error Handling Consistency

*For any* API request that fails (network error, HTTP error, or server error), the system should return an error response, preserve the current application state, and not modify any existing data.

**Validates: Requirements 1.5, 4.5, 5.5, 8.3**

### Property 11: Assignment Validation

*For any* assignment attempt, if any required field (operational unit internal ID, assignment type, or start date) is missing or empty, the assignment should be blocked before making the API request.

**Validates: Requirements 4.6, 7.4**

### Property 12: Prerequisite Validation in Cascade

*For any* data fetch operation in the cascading hierarchy, if the prerequisite parent selection is not made (e.g., fetching contracts without a client, or fetching OUs without a contract), the fetch operation should not be executed.

**Validates: Requirements 7.1, 7.2, 7.3**

### Property 13: Date Format Validation

*For any* date input field (start date, end date), before sending the value to the API, the system should validate that the date is in the correct format (YYYY-MM-DD or MM/DD/YYYY depending on API requirements).

**Validates: Requirements 7.6**

### Property 14: Request Deduplication

*For any* API request that is currently in progress, subsequent identical requests should be blocked until the first request completes.

**Validates: Requirements 6.4**

### Property 15: HTTP Status Code Handling

*For any* HTTP response status code (200, 400, 404, 500), the system should handle it appropriately: 200 returns data, 400/404/500 return specific error messages corresponding to the error type.

**Validates: Requirements 8.6**

### Testing Implementation Notes

Each correctness property listed above must be implemented as a property-based test with a minimum of 100 iterations. The tests should:

1. Generate random valid inputs for the property being tested
2. Execute the system behavior with those inputs
3. Assert that the property holds true
4. Tag each test with: `Feature: cag-api-integration, Property {number}: {property_text}`

Unit tests should complement these property tests by covering:
- Specific examples of successful operations
- Edge cases (empty lists, null values, boundary dates)
- Integration between components
- Error scenarios with specific error messages
