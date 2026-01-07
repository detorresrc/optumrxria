/**
 * Client data types for the Client List Page
 * Requirements: 3.1, 3.5
 */

/** Client status values */
export type ClientStatus = 'Complete' | 'Draft' | 'Pending' | 'Inactive';

/** Client record interface */
export interface Client {
  /** Unique identifier for the client */
  id: string;
  /** Display name of the client */
  clientName: string;
  /** Client ID number */
  clientId: string;
  /** Current status of the client */
  status: ClientStatus;
  /** Reference ID for the client */
  clientReferenceId: string;
  /** Effective date of the client contract (ISO date string) */
  effectiveDate: string;
  /** Number of operational units */
  operationalUnitsCount: number;
}

/** Pagination state interface */
export interface PaginationState {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items */
  totalItems: number;
  /** Total number of pages */
  totalPages: number;
}

/** Filter state interface */
export interface FilterState {
  /** Search query string */
  searchQuery: string;
  /** Optional status filter */
  statusFilter?: ClientStatus[];
  /** Optional date range filter */
  dateRange?: {
    start: string;
    end: string;
  };
}
