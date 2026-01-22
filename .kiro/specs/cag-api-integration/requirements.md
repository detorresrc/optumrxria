# Requirements Document: CAG API Integration

## Introduction

This specification defines the requirements for integrating the CAG (Carrier-Account-Group) Management page with a REST API backend. The current implementation uses mock data and needs to be connected to real API endpoints for client selection, contract management, operational unit configuration, CAG assignment, and status updates. The integration will enable users to manage CAG assignments through a fully functional interface backed by persistent data.

## Glossary

- **CAG**: Carrier-Account-Group - A hierarchical structure representing insurance carriers, accounts, and groups
- **Client**: An organization or entity that has contracts with Optum
- **Contract**: A formal agreement between a client and Optum with defined effective and termination dates
- **Operational_Unit**: A business unit within a contract that manages specific operations (also referred to as OU)
- **Assignment_Level**: The hierarchical level at which a CAG is assigned (Carrier, Account, or Group)
- **Assignment_Status**: The current state of a CAG assignment (Active or Inactive)
- **API_Service**: The backend REST API that provides CAG management functionality
- **UI_Component**: React components that render the user interface
- **Pagination**: The mechanism for dividing large result sets into discrete pages

## Requirements

### Requirement 1: Client and Contract Selection

**User Story:** As a user, I want to select a client and view their associated contracts, so that I can manage CAGs for specific operational contexts.

#### Acceptance Criteria

1. WHEN the page loads, THE System SHALL fetch and display all active clients from the API
2. WHEN a client is selected, THE System SHALL fetch and display all contracts associated with that client
3. WHEN a contract is selected, THE System SHALL display the contract status (Active/Inactive) based on effective and termination dates
4. WHEN a contract is selected, THE System SHALL fetch and display all operational units associated with that contract
5. IF the API request fails, THEN THE System SHALL display an error message and maintain the current state

### Requirement 2: Assigned CAGs Display

**User Story:** As a user, I want to view all CAGs assigned to an operational unit with pagination, so that I can review and manage existing assignments.

#### Acceptance Criteria

1. WHEN an operational unit is selected, THE System SHALL fetch and display assigned CAGs for that operational unit
2. THE System SHALL display assigned CAGs with pagination supporting configurable page size
3. WHEN displaying assigned CAGs, THE System SHALL show carrier name, carrier ID, account name, account ID, group name, group ID, assignment status, start date, and end date
4. WHEN the user navigates to a different page, THE System SHALL fetch and display the corresponding page of results
5. THE System SHALL display the total count of assigned CAGs for the selected operational unit
6. IF no CAGs are assigned, THEN THE System SHALL display an appropriate empty state message

### Requirement 3: CAG Search and Filter

**User Story:** As a user, I want to search for unassigned CAGs using multiple filter criteria, so that I can find specific CAGs to assign to an operational unit.

#### Acceptance Criteria

1. WHEN the user selects an assignment level (Carrier, Account, or Group), THE System SHALL enable appropriate search fields
2. WHEN the user enters search criteria and clicks search, THE System SHALL fetch CAGs matching all provided filter conditions
3. THE System SHALL support filtering by assignment level, carrier ID, carrier name, account ID, account name, group ID, group name, start date, and end date
4. WHEN search results are returned, THE System SHALL display the total count of matching CAGs
5. WHEN the user clicks clear, THE System SHALL reset all search fields and clear search results
6. IF the search returns no results, THEN THE System SHALL display an appropriate message

### Requirement 4: CAG Assignment

**User Story:** As a user, I want to assign selected CAGs to an operational unit, so that I can configure which CAGs are associated with specific operations.

#### Acceptance Criteria

1. WHEN the user selects one or more unassigned CAGs, THE System SHALL enable the assign action
2. WHEN the user confirms the assign action, THE System SHALL send the selected CAG IDs, operational unit ID, and assignment type to the API
3. WHEN the assignment is successful, THE System SHALL refresh the assigned CAGs list to reflect the new assignments
4. WHEN the assignment is successful, THE System SHALL display a success message to the user
5. IF the assignment fails, THEN THE System SHALL display an error message and maintain the current state
6. THE System SHALL validate that required fields (operational unit, assignment level, start date) are provided before allowing assignment

### Requirement 5: Bulk Status Update

**User Story:** As a user, I want to update the status of multiple assigned CAGs simultaneously, so that I can efficiently manage CAG lifecycles.

#### Acceptance Criteria

1. WHEN the user selects one or more assigned CAGs, THE System SHALL enable bulk action options
2. WHEN the user selects a status update action and confirms, THE System SHALL send the selected CAG IDs and new status to the API
3. WHEN the status update is successful, THE System SHALL refresh the assigned CAGs list to reflect the updated statuses
4. WHEN the status update is successful, THE System SHALL display a success message to the user
5. IF the status update fails, THEN THE System SHALL display an error message and maintain the current state

### Requirement 6: Loading States and User Feedback

**User Story:** As a user, I want to see clear loading indicators and feedback messages, so that I understand when the system is processing my requests.

#### Acceptance Criteria

1. WHEN an API request is in progress, THE System SHALL display a loading indicator for the affected component
2. WHEN an API request completes successfully, THE System SHALL remove the loading indicator and display the results
3. WHEN an API request fails, THE System SHALL display a user-friendly error message with details about the failure
4. THE System SHALL prevent duplicate API requests while a request is already in progress
5. WHEN displaying error messages, THE System SHALL provide actionable guidance for resolution when possible

### Requirement 7: Data Validation and Error Handling

**User Story:** As a system, I want to validate all data before sending API requests, so that I can prevent invalid operations and provide clear feedback.

#### Acceptance Criteria

1. THE System SHALL validate that a client is selected before fetching contracts
2. THE System SHALL validate that a contract is selected before fetching operational units
3. THE System SHALL validate that an operational unit is selected before fetching assigned CAGs
4. THE System SHALL validate that required fields are populated before submitting assignment or status update requests
5. WHEN validation fails, THE System SHALL display field-level error messages indicating which fields require attention
6. THE System SHALL validate date formats before sending them to the API

### Requirement 8: API Service Layer Architecture

**User Story:** As a developer, I want a well-structured API service layer with proper TypeScript types, so that the codebase is maintainable and type-safe.

#### Acceptance Criteria

1. THE System SHALL define TypeScript interfaces for all API request and response types
2. THE System SHALL implement a centralized API service module that handles all HTTP requests
3. THE System SHALL use consistent error handling patterns across all API calls
4. THE System SHALL configure the API base URL in a centralized location
5. THE System SHALL include proper TypeScript typing for all API service functions
6. THE System SHALL handle HTTP status codes appropriately (200, 400, 404, 500, etc.)
