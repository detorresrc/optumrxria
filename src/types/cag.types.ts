/**
 * TypeScript type definitions for CAG API Integration
 * 
 * This file contains all interfaces for API requests and responses
 * related to CAG (Carrier-Account-Group) management.
 */

/**
 * Represents a client entity
 */
export interface Client {
  clientId: string;
  clientName: string;
  clientReferenceId: string;
}

/**
 * Represents a contract associated with a client
 */
export interface Contract {
  contractInternalId: string;
  contractId: string;
  effectiveDate: string;
  terminateDate: string | null;
}

/**
 * Represents an operational unit within a contract
 */
export interface OperationalUnit {
  operationUnitInternalId: string;
  operationUnitId: string;
  operationUnitName: string;
}

/**
 * Represents a CAG assigned to an operational unit
 */
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

/**
 * Represents an unassigned CAG available for assignment
 */
export interface UnassignedCAG {
  cagId: string;
  carrierId: string;
  carrierName: string;
  accountId: string;
  accountName: string;
  groupId: string;
  groupName: string;
}

/**
 * Paginated response for assigned CAGs
 */
export interface PaginatedAssignedCAGs {
  ouCagList: AssignedCAG[];
  count: number;
}

/**
 * Search parameters for finding unassigned CAGs
 */
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

/**
 * Request payload for assigning CAGs to an operational unit
 */
export interface AssignCAGsRequest {
  operationUnitInternalId: string;
  assignmentType: 'Carrier' | 'Account' | 'Group';
  cagIds: string[];
}

/**
 * Request payload for updating CAG assignment status
 */
export interface UpdateStatusRequest {
  ouCagIds: string[];
  status: string;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
