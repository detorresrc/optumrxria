# Implementation Plan: Client List Page

## Overview

This implementation plan breaks down the Client List Page feature into discrete coding tasks. Each task builds incrementally on previous work, ensuring no orphaned code. The implementation uses React, TypeScript, and MUI v7 following existing codebase patterns.

## Tasks

- [x] 1. Create Client data types and mock data
  - [x] 1.1 Create Client interface and types in `src/types/client.ts`
    - Define Client interface with id, clientName, clientId, status, clientReferenceId, effectiveDate, operationalUnitsCount
    - Define ClientStatus type ('Complete' | 'Draft' | 'Pending' | 'Inactive')
    - Define PaginationState and FilterState interfaces
    - _Requirements: 3.1, 3.5_
  - [x] 1.2 Create mock client data in `src/data/mockClients.ts`
    - Generate sample client data array with various statuses
    - Include at least 50 mock clients for pagination testing
    - _Requirements: 3.1_

- [x] 2. Implement SuccessBanner component
  - [x] 2.1 Create `src/components/SuccessBanner.tsx`
    - Implement dismissable alert with green styling (#EFF6EF background, #007000 border)
    - Include success icon and dismiss (X) button
    - Accept message, visible, and onDismiss props
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [ ]* 2.2 Write unit tests for SuccessBanner
    - Test banner renders with correct message
    - Test dismiss button hides banner
    - _Requirements: 7.1, 7.4_

- [x] 3. Implement ClientPagination component
  - [x] 3.1 Create `src/components/ClientPagination.tsx`
    - Display page number buttons (1, 2, 3, 4, 5, ..., lastPage)
    - Highlight current page with filled dark blue background (#002677)
    - Show ellipsis when total pages > 7
    - Include next page chevron button
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  - [ ]* 3.2 Write property test for pagination display
    - **Property 5: Pagination Display Correctness**
    - **Validates: Requirements 6.4, 6.5**
  - [ ]* 3.3 Write unit tests for ClientPagination
    - Test page click triggers onPageChange callback
    - Test current page is highlighted
    - _Requirements: 6.6_

- [x] 4. Implement StatusChip component
  - [x] 4.1 Create `src/components/StatusChip.tsx`
    - Render chip with status text
    - Apply green (#007000) for Complete, gray (#4B4D4F) for Draft
    - Use 4px border radius per Figma specs
    - _Requirements: 3.5_
  - [ ]* 4.2 Write property test for status chip colors
    - **Property 2: Status Chip Color Mapping**
    - **Validates: Requirements 3.5**

- [x] 5. Implement ClientTable component
  - [x] 5.1 Create `src/components/ClientTable.tsx`
    - Render table with columns: Checkbox, Actions, Client Name, Client ID, Status, Client Reference ID, Effective Date, No. of Operational Units
    - Display client name as clickable link (blue #0C55B8)
    - Include delete icon in Actions column
    - Alternate row background colors (#FFFFFF, #FAFAFA)
    - Use StatusChip for status column
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
  - [ ]* 5.2 Write unit tests for ClientTable
    - Test all columns render correctly
    - Test checkbox selection works
    - Test client name click triggers callback
    - _Requirements: 3.1, 3.4, 3.7_

- [ ] 6. Checkpoint - Verify table components
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement ActionBar component
  - [x] 7.1 Create `src/components/ActionBar.tsx`
    - Display "Number of clients: X" text
    - Include Bulk actions dropdown with chevron
    - Include "Apply" label/button
    - Include "Add Client" primary button with plus icon
    - Include "Show Details" secondary/outlined button
    - Include "Filters" tertiary button with filter icon
    - _Requirements: 4.1, 4.2, 5.1, 5.3, 5.4, 5.5_
  - [ ]* 7.2 Write property test for client count accuracy
    - **Property 4: Client Count Accuracy**
    - **Validates: Requirements 5.5**
  - [ ]* 7.3 Write property test for bulk action application
    - **Property 3: Bulk Action Application**
    - **Validates: Requirements 4.4**

- [x] 8. Implement search filtering utility
  - [x] 8.1 Create `src/utils/clientFilters.ts`
    - Implement filterClientsBySearch function
    - Filter by clientName, clientId, or clientReferenceId (case-insensitive)
    - _Requirements: 2.2_
  - [ ]* 8.2 Write property test for search filtering
    - **Property 1: Search Filtering Correctness**
    - **Validates: Requirements 2.2**

- [x] 9. Implement ClientsOverviewCard component
  - [x] 9.1 Create `src/components/ClientsOverviewCard.tsx`
    - Card container with 12px border radius and #CBCCCD border
    - Display "Clients Overview" title (20px, bold, #002677)
    - Compose ActionBar, ClientTable, and ClientPagination
    - _Requirements: 8.1, 8.2, 8.3_

- [x] 10. Implement ClientListPage main component
  - [x] 10.1 Create `src/components/ClientListPage.tsx`
    - Use existing Header and Footer components
    - Add Breadcrumbs (Home > Clients)
    - Add page title "Clients" with search input (pill shape, search icon)
    - Integrate SuccessBanner (conditionally visible)
    - Integrate ClientsOverviewCard
    - Manage page state (clients, pagination, search, selection)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.3, 2.4_
  - [ ]* 10.2 Write unit tests for ClientListPage
    - Test page renders with all sections
    - Test search input filters table
    - Test Add Client button navigation
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 5.2_

- [ ] 11. Checkpoint - Full page integration
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Wire up navigation and App integration
  - [ ] 12.1 Update `src/App.tsx` to include ClientListPage route
    - Add routing logic or conditional rendering for client list
    - Wire Add Client button to navigate to AddClientPage
    - _Requirements: 5.2_
  - [ ]* 12.2 Write integration tests
    - Test navigation between ClientListPage and AddClientPage
    - Test success banner appears after adding client
    - _Requirements: 5.2, 7.1_

- [ ] 13. Final checkpoint - Complete feature verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Existing Header and Footer components will be reused
- All styling follows Figma specifications cached in `figma-cache/bRGefg0iY0ZZpgkzQcqz3E-160-13537.data`
