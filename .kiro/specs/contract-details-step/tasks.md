# Implementation Plan: Contract Details Step

## Overview

This implementation plan covers adding the Contract Details step (Step 2) to the Add Client multi-step form. The implementation follows the existing patterns established by ClientDetailsStep and integrates with the react-hook-form based form management system.

## Tasks

- [x] 1. Create Contract Details Step Schema
  - Add contractDetailsStepSchema to src/schemas/addClientSchema.ts
  - Define all form fields with Zod validation
  - Add conditional validation for autopay fields when payment method is ACH
  - Export ContractDetailsStepFormData type and default values
  - _Requirements: 2.1-2.13, 3.1-3.13, 4.5-4.8, 6.1-6.6_

- [x] 2. Create FormDateField Component
  - [x] 2.1 Create src/components/FormDateField.tsx
    - Implement date picker with MUI DatePicker
    - Add calendar icon button matching Figma design
    - Follow FormTextField pattern for styling and error handling
    - Support MM-DD-YYYY format display
    - _Requirements: 2.12, 2.13_

  - [ ]* 2.2 Write property test for date format consistency
    - **Property 1: Date Format Consistency**
    - **Validates: Requirements 2.13**

- [x] 3. Create FormRadioGroup Component
  - [x] 3.1 Create src/components/FormRadioGroup.tsx
    - Implement radio button group with MUI Radio components
    - Support horizontal layout with label
    - Follow existing form field styling patterns
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 4. Create ContractDetailsStep Component
  - [x] 4.1 Create src/components/ContractDetailsStep.tsx
    - Implement accordion container matching ClientDetailsStep pattern
    - Add Contract Details header section with title and subtitle
    - Implement three-column grid layout for form fields
    - Add all contract information fields (Contract ID, dates, legal entities, etc.)
    - _Requirements: 1.1-1.5, 2.1-2.11, 7.1-7.4_

  - [x] 4.2 Add Billing Attributes nested section
    - Add section header with "Billing Attributes" title
    - Implement all billing configuration fields
    - Add radio button groups for claim suppression options
    - _Requirements: 3.1-3.13, 5.1-5.3_

  - [x] 4.3 Add conditional Autopay Information section
    - Watch payment method field value
    - Show/hide autopay section based on ACH selection
    - Add all autopay form fields when visible
    - _Requirements: 4.1-4.8_

  - [ ]* 4.4 Write property test for autopay section visibility
    - **Property 2: Autopay Section Conditional Visibility**
    - **Validates: Requirements 4.1, 4.2**

- [x] 5. Checkpoint - Ensure component renders correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Integrate with Add Client Form
  - [x] 6.1 Update AddClientPage to include ContractDetailsStep
    - Import ContractDetailsStep component
    - Add step 2 content rendering logic
    - Pass form control, errors, and watch to ContractDetailsStep
    - _Requirements: 8.1, 8.4_

  - [x] 6.2 Update form schema integration
    - Ensure contract details fields are part of main form state
    - Configure form to preserve data across step navigation
    - _Requirements: 8.2, 8.3_

  - [ ]* 6.3 Write property test for form data persistence
    - **Property 6: Form Data Persistence Round Trip**
    - **Validates: Requirements 8.2, 8.3**

- [x] 7. Implement Form Validation
  - [x] 7.1 Add validation logic for required fields
    - Implement validation for Effective Date and Source fields
    - Implement validation for all required Billing Attributes fields
    - Add conditional validation for autopay fields
    - _Requirements: 6.1-6.5_

  - [ ]* 7.2 Write property test for required field validation
    - **Property 3: Required Field Validation**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4**

  - [ ]* 7.3 Write property test for conditional autopay validation
    - **Property 4: Conditional Autopay Validation**
    - **Validates: Requirements 6.5**

  - [ ]* 7.4 Write property test for valid form navigation
    - **Property 5: Valid Form Enables Navigation**
    - **Validates: Requirements 6.6**

- [x] 8. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation follows existing patterns from ClientDetailsStep for consistency
