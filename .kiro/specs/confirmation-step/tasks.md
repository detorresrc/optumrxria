# Implementation Plan: Confirmation Step

## Overview

This implementation plan breaks down the Confirmation Step feature into discrete coding tasks. The approach builds incrementally from reusable components to the main step component, then integrates with the existing AddClientPage.

## Tasks

- [x] 1. Create reusable components
  - [x] 1.1 Create InfoBanner component
    - Create `src/components/InfoBanner.tsx`
    - Implement MUI Alert-based component with info styling
    - Props: title, message
    - Styling: #E5F8FB background, #002677 border, 12px border radius
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 1.2 Create ReadOnlyField component
    - Create `src/components/ReadOnlyField.tsx`
    - Display label-value pairs in read-only format
    - Handle empty/undefined values with placeholder
    - Typography: label bold, value regular
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 1.3 Create ReviewAccordion component
    - Create `src/components/ReviewAccordion.tsx`
    - Implement MUI Accordion with custom styling
    - Include edit icon in header with onClick handler
    - Props: title, subtitle, defaultExpanded, onEdit, children
    - Styling: white background, 1px #CBCCCD border, 12px radius, 30px/24px padding
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [x] 2. Create section display components
  - [x] 2.1 Create ClientDetailsReview component
    - Create `src/components/ClientDetailsReview.tsx`
    - Display client details fields in read-only format
    - Display all addresses with proper layout
    - Use ReadOnlyField for each field
    - _Requirements: 3.4, 9.5_

  - [x] 2.2 Create ContractDetailsReview component
    - Create `src/components/ContractDetailsReview.tsx`
    - Display contract information fields in read-only format
    - Display billing attributes fields
    - Display autopay information if applicable
    - _Requirements: 4.4, 9.5_

  - [x] 2.3 Create ContactsReview component
    - Create `src/components/ContactsReview.tsx`
    - Display all contacts in read-only format
    - Handle multiple contacts display
    - _Requirements: 5.4, 9.5_

  - [x] 2.4 Create OperationalUnitReview component
    - Create `src/components/OperationalUnitReview.tsx`
    - Display single operational unit data in read-only format
    - Display unit addresses
    - Display billing attributes override if present
    - _Requirements: 6.4, 9.5_

- [x] 3. Create ConfirmationStep main component
  - [x] 3.1 Create ConfirmationStep component structure
    - Create `src/components/ConfirmationStep.tsx`
    - Define props interface: formData, onEditStep, onConfirm, onSaveDraft, onGoBack
    - Set up component layout with InfoBanner at top
    - _Requirements: 2.1, 2.2_

  - [x] 3.2 Implement Client Details accordion section
    - Add ReviewAccordion for Client Details
    - Include ClientDetailsReview as children
    - Wire up edit icon to navigate to step 0
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.6_

  - [x] 3.3 Implement Contract Details accordion section
    - Add ReviewAccordion for Contract Details
    - Include ContractDetailsReview as children
    - Wire up edit icon to navigate to step 1
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 4.6_

  - [x] 3.4 Implement Contacts & Access accordion section
    - Add ReviewAccordion for Contacts & Access
    - Include ContactsReview as children
    - Wire up edit icon to navigate to step 2
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6_

  - [x] 3.5 Implement Operational Units accordion sections
    - Map over operationalUnits array to create multiple accordions
    - Each accordion shows "Operational Units - [name]" header
    - Include OperationalUnitReview as children for each
    - Wire up edit icons to navigate to step 3
    - _Requirements: 6.1, 6.2, 6.3, 6.5, 6.6_

- [x] 4. Integrate with AddClientPage
  - [x] 4.1 Update AddClientPage to render ConfirmationStep
    - Import ConfirmationStep component
    - Add conditional rendering for currentStep === 4
    - Pass formData from getValues()
    - Wire up onEditStep to navigateToStep
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 4.2 Update action buttons for Confirmation step
    - Update title bar buttons for step 5 (Confirm, Save as Draft, Go Back)
    - Implement onConfirm handler for form submission
    - Wire up Go Back to navigate to step 3
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 6. Write property-based tests
  - [ ]* 6.1 Write property test for form data display completeness
    - **Property 1: Form Data Display Completeness**
    - **Validates: Requirements 3.4, 4.4, 5.4, 6.4**

  - [ ]* 6.2 Write property test for operational units accordion count
    - **Property 2: Operational Units Accordion Count**
    - **Validates: Requirements 6.1**

  - [ ]* 6.3 Write property test for operational unit name display
    - **Property 3: Operational Unit Name Display**
    - **Validates: Requirements 6.2**

  - [ ]* 6.4 Write property test for empty field placeholder display
    - **Property 4: Empty Field Placeholder Display**
    - **Validates: Requirements 9.4**

  - [ ]* 6.5 Write property test for read-only field rendering
    - **Property 5: Read-Only Field Rendering**
    - **Validates: Requirements 9.1**

- [ ]* 7. Write unit tests
  - [ ]* 7.1 Write unit tests for InfoBanner component
    - Test renders with correct title and message
    - Test styling matches design specs
    - _Requirements: 2.1, 2.2_

  - [ ]* 7.2 Write unit tests for ReviewAccordion component
    - Test expand/collapse functionality
    - Test edit icon click triggers callback
    - Test renders title and subtitle correctly
    - _Requirements: 3.6, 4.6, 5.6, 6.6, 8.7_

  - [ ]* 7.3 Write unit tests for ConfirmationStep component
    - Test all accordion sections render
    - Test edit navigation for each section
    - Test action button clicks trigger callbacks
    - _Requirements: 3.1, 4.1, 5.1, 7.1, 7.2, 7.3_

- [x] 8. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation uses existing MUI components (Accordion, Alert) with custom styling
- Form data is accessed via react-hook-form's getValues() in the parent component
