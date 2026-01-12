# Implementation Plan: Contract Details Step

## Overview

This implementation plan covers updating the Contract Details step (Step 2) to match the latest Figma design. The updates include new billing attribute fields, a dynamic suppressions section, and navigation footer buttons.

## Tasks

- [x] 1. Update Contract Details Step Schema
  - [x] 1.1 Add new billing attribute fields to schema
    - Add invoiceStaticData field
    - Add feeInvoicePaymentTermDayType field
    - Add claimInvoicePaymentTermDayType field
    - Update feeInvoicePaymentTerm and claimInvoicePaymentTerm to be dropdowns
    - _Requirements: 3.11-3.15_

  - [x] 1.2 Add suppressions schema
    - Add suppressionEntrySchema with suppressionType, startDate, endDate
    - Add addSuppressions enum field (yes/no)
    - Add suppressions array field
    - Remove old suppressRejectedClaims and suppressNetZeroClaims fields
    - _Requirements: 5.1-5.6_

- [x] 2. Update ContractDetailsStep Component - Billing Attributes
  - [x] 2.1 Update Billing Attributes section header
    - Change subtitle to "You may override the billing attributes outlined under the contract details section here."
    - _Requirements: 3.2_

  - [x] 2.2 Add new billing fields
    - Add Invoice Static Data text field
    - Add Fee Invoice Payment Term dropdown with day type dropdown
    - Add Claim Invoice Payment Term dropdown with day type dropdown
    - Arrange fields in three-column layout per Figma
    - _Requirements: 3.11-3.15_

  - [ ]* 2.3 Write property test for date format consistency
    - **Property 1: Date Format Consistency**
    - **Validates: Requirements 2.13**

- [x] 3. Update Autopay Information Section
  - [x] 3.1 Restructure Autopay section layout
    - Move Payment Method to separate row before ACH fields
    - Display ACH fields in three-column layout (Bank Account Type, Routing Number, Account Number)
    - Add Account Holder Name in second row
    - Add horizontal divider between Payment Method and ACH fields
    - _Requirements: 4.1-4.7_

  - [ ]* 3.2 Write property test for autopay section visibility
    - **Property 2: Autopay Section Conditional Visibility**
    - **Validates: Requirements 4.1, 4.2**

- [x] 4. Implement Add Suppressions Section
  - [x] 4.1 Add suppressions radio group
    - Add "Add Suppressions" label with Yes/No radio buttons
    - Default to "No" selected
    - _Requirements: 5.1_

  - [x] 4.2 Implement suppression row component
    - Create suppression row with: Suppression Type dropdown, Start Date, End Date
    - Add delete icon button (visible for index > 0)
    - Add horizontal divider between rows
    - _Requirements: 5.4-5.6, 5.8, 5.11_

  - [x] 4.3 Implement dynamic suppression array
    - Use react-hook-form useFieldArray for suppressions
    - Show suppression fields only when "Yes" is selected
    - Add "Add another suppression" button with plus icon
    - Implement add/remove functionality
    - _Requirements: 5.2, 5.3, 5.7, 5.9, 5.10_

  - [ ]* 4.4 Write property test for suppressions visibility
    - **Property 3: Suppressions Section Conditional Visibility**
    - **Validates: Requirements 5.2, 5.3**

  - [ ]* 4.5 Write property test for suppression array management
    - **Property 4: Suppression Array Management**
    - **Validates: Requirements 5.7, 5.8, 5.9**

- [ ] 5. Checkpoint - Ensure component renders correctly
  - Ensure all tests pass, ask the user if questions arise.

- [-] 6. Update Form Validation
  - [x] 6.1 Update required field validation
    - Ensure all required billing attribute fields are validated
    - Add conditional validation for autopay fields when ACH selected
    - _Requirements: 6.1-6.5_

  - [ ]* 6.2 Write property test for required field validation
    - **Property 5: Required Field Validation**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4**

  - [ ]* 6.3 Write property test for conditional autopay validation
    - **Property 6: Conditional Autopay Validation**
    - **Validates: Requirements 6.5**

  - [ ]* 6.4 Write property test for valid form navigation
    - **Property 7: Valid Form Enables Navigation**
    - **Validates: Requirements 6.6**

- [x] 7. Implement Navigation Footer
  - [x] 7.1 Add navigation footer component
    - Add footer bar with top border (#CBCCCD)
    - Add "Next" primary button (dark blue #002677, 46px border radius)
    - Add "Go Back" tertiary button (white background, dark gray border)
    - Align buttons to right with 10px gap
    - Apply 4px vertical padding, 84px horizontal padding
    - _Requirements: 9.1-9.4, 9.7, 9.8_

  - [x] 7.2 Implement navigation button functionality
    - Next button validates form and proceeds to Step 3
    - Go Back button navigates to Step 1 preserving data
    - _Requirements: 9.5, 9.6_

  - [ ]* 7.3 Write property test for form data persistence
    - **Property 8: Form Data Persistence Round Trip**
    - **Validates: Requirements 8.2, 8.3**

  - [ ]* 7.4 Write property test for navigation validation
    - **Property 9: Navigation Validation Trigger**
    - **Validates: Requirements 9.5**

  - [ ]* 7.5 Write property test for back navigation
    - **Property 10: Back Navigation Data Preservation**
    - **Validates: Requirements 9.6**

- [x] 8. Update Styling to Match Figma
  - [x] 8.1 Update accordion styling
    - Apply 30px top padding, 24px horizontal padding
    - Ensure 12px border radius and 1px solid #CBCCCD border
    - _Requirements: 1.5, 7.4_

  - [x] 8.2 Update billing section styling
    - Apply 24px padding and 12px border radius
    - Apply 1px solid #CBCCCD border
    - _Requirements: 7.5_

  - [x] 8.3 Update button styling
    - Add suppression button: blue text (#0C55B8), plus icon, 14px bold font
    - Delete icon: 24px size
    - _Requirements: 5.10_

- [ ] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation updates the existing ContractDetailsStep component
