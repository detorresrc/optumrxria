# Implementation Plan: Operational Units Step Update

## Overview

This plan updates the existing Operational Units step (Step 4) in the Add Client wizard to match the new Figma design. The implementation adds new fields (LOB Numeric, expanded billing attributes, payment method, suppressions), updates the field layout, and adds the Assign Contacts chips functionality.

## Tasks

- [x] 1. Update schema and types for new fields
  - [x] 1.1 Update operationalUnitSchema in addClientSchema.ts
    - Add lobNumeric as required field
    - Remove runOffPeriod field
    - Add assignedContacts as string array
    - Add addSuppressions boolean field
    - _Requirements: 2.1-2.10, 8.2-8.5_
  - [x] 1.2 Create suppressionEntrySchema
    - Fields: suppressionType, startDate, endDate (all optional)
    - Add suppressions array to operationalUnitSchema
    - _Requirements: 6.3-6.5_
  - [x] 1.3 Update billingAttributesOverrideSchema with new fields
    - Add: claimInvoiceFrequency, feeInvoiceFrequency, invoiceAggregationLevel
    - Add: invoiceType, invoicingClaimQuantityCounts, deliveryOption
    - Add: supportDocumentVersion, invoiceStaticData
    - Add: feeInvoicePaymentTerm, feeInvoicePaymentTermDayType
    - Add: claimInvoicePaymentTerm, claimInvoicePaymentTermDayType
    - Add: paymentMethod, bankAccountType, routingNumber, accountNumber
    - _Requirements: 4.6-4.17, 5.1, 5.3-5.5_
  - [x] 1.4 Update default values
    - Update defaultOperationalUnitData with new fields
    - Create defaultSuppressionEntryData
    - _Requirements: 7.1_

- [x] 2. Update basic fields section layout
  - [x] 2.1 Update Row 1 fields
    - Operational Unit Name (required)
    - Operational Unit ID (required, disabled style with opacity 0.5)
    - LOB Numeric (required)
    - _Requirements: 2.1-2.3, 9.4_
  - [x] 2.2 Update Row 2 fields
    - Market Segment (optional)
    - Line of Business (required)
    - M&R Plan Type (optional)
    - _Requirements: 2.4-2.6, 9.5_
  - [x] 2.3 Update Row 3 fields
    - M&R Group/Individual (optional)
    - M&R Classification (optional)
    - Pass through/Traditional pricing (optional)
    - _Requirements: 2.7-2.9, 9.6_
  - [x] 2.4 Remove Run-off Period field and Assign Contacts from basic grid
    - _Requirements: 2.1-2.10_

- [x] 3. Implement Assign Contacts chips section
  - [x] 3.1 Create AssignContactsChips component
    - Light blue card background (#FAFCFF) with 12px border radius
    - Dropdown for selecting contacts
    - Display selected contacts as chips with X icon
    - _Requirements: 2.10-2.12, 9.7_
  - [x] 3.2 Implement chip removal functionality
    - Click X icon removes contact from selection
    - Update form state via useFieldArray or setValue
    - _Requirements: 2.13_
  - [x] 3.3 Add dropdown options for contacts
    - Use contacts from ContactsAccessStep or mock data
    - _Requirements: 2.10_

- [x] 4. Update Billing Attributes Override section
  - [x] 4.1 Update billing fields Row 1
    - Claim Invoice Frequency, Fee Invoice Frequency, Invoice Aggregation Level
    - _Requirements: 4.6-4.8_
  - [x] 4.2 Update billing fields Row 2
    - Invoice Type, Invoicing Claim Quantity Counts, Delivery Option
    - _Requirements: 4.9-4.11_
  - [x] 4.3 Update billing fields Row 3
    - Support Document Version, Invoice Static Data
    - _Requirements: 4.12-4.13_
  - [x] 4.4 Add Fee Invoice Payment Term fields
    - Fee Invoice Payment Term dropdown (No. of days)
    - Fee Invoice Payment Term Day Type dropdown
    - _Requirements: 4.14-4.15_
  - [x] 4.5 Add Claim Invoice Payment Term fields
    - Claim Invoice Payment Term dropdown (No. of days)
    - Claim Invoice Payment Term Day Type dropdown
    - _Requirements: 4.16-4.17_

- [x] 5. Implement Payment Method section
  - [x] 5.1 Add Payment Method dropdown
    - Options: ACH/EFT, Check, Wire Transfer
    - _Requirements: 5.1_
  - [x] 5.2 Add horizontal divider after Payment Method
    - _Requirements: 5.2_
  - [x] 5.3 Implement conditional bank account fields
    - Show only when Payment Method is ACH/EFT
    - Bank Account Type dropdown
    - Routing Number text input
    - Account Number text input
    - 3-column grid layout
    - _Requirements: 5.3-5.6_

- [x] 6. Implement Suppressions section
  - [x] 6.1 Add "Add Suppressions" radio group
    - Yes/No options
    - Default to No
    - _Requirements: 6.1_
  - [x] 6.2 Create SuppressionEntry component
    - Suppression Type dropdown
    - Suppression Start Date picker
    - Suppression End Date picker
    - 3-column grid layout
    - _Requirements: 6.3-6.6_
  - [x] 6.3 Implement nested useFieldArray for suppressions
    - Initialize with one entry when Yes selected
    - _Requirements: 6.2_
  - [x] 6.4 Add "Add another suppression" button
    - Plus icon with #0C55B8 text color
    - Append new suppression entry on click
    - _Requirements: 6.7, 6.8_
  - [x] 6.5 Add delete button for suppressions (except first)
    - Trash icon with #C40000 color
    - Remove suppression on click
    - _Requirements: 6.9, 6.10_
  - [x] 6.6 Add horizontal dividers between suppression entries
    - #AAAAAA color
    - _Requirements: 6.11_

- [x] 7. Update operational unit card layout
  - [x] 7.1 Update gap between operational unit cards to 16px
    - _Requirements: 7.10_
  - [x] 7.2 Verify accordion expand/collapse behavior
    - Only one expanded at a time
    - Click collapsed card to expand
    - _Requirements: 7.4, 7.9_
  - [x] 7.3 Verify collapsed card title shows unit name
    - "Operational Units - [Name]" format
    - _Requirements: 7.5_

- [ ] 8. Checkpoint - Verify form functionality
  - Test all new fields render correctly
  - Test add/remove functionality for addresses, suppressions, units
  - Test conditional rendering (payment method, suppressions)
  - Test contact chips selection and removal
  - Ask the user if questions arise

- [x] 9. Update OperationalUnitReview component for Confirmation step
  - [x] 9.1 Add LOB Numeric to review display
    - _Requirements: 12.2_
  - [x] 9.2 Add assigned contacts display
    - Show as comma-separated list
    - _Requirements: 12.4_
  - [x] 9.3 Update billing attributes review section
    - Add all new billing fields
    - _Requirements: 12.6_
  - [x] 9.4 Add payment method and bank details review
    - Show only when configured
    - _Requirements: 12.7_
  - [x] 9.5 Add suppressions review section
    - Show Type, Start Date, End Date for each
    - _Requirements: 12.8_

- [ ] 10. Final checkpoint - Verify complete integration
  - Verify form data persists across step navigation
  - Verify Confirmation step displays all new data
  - Verify validation works for all required fields
  - Ask the user if questions arise

- [ ]* 11. Write unit tests
  - [ ]* 11.1 Test operational unit list management
    - **Property 1: Operational Unit List Management Invariant**
    - **Validates: Requirements 7.3, 7.8**
  - [ ]* 11.2 Test address list management
    - **Property 2: Address List Management Invariant**
    - **Validates: Requirements 3.9, 3.11**
  - [ ]* 11.3 Test suppression list management
    - **Property 3: Suppression List Management Invariant**
    - **Validates: Requirements 6.8, 6.10**
  - [ ]* 11.4 Test contact selection management
    - **Property 4: Contact Selection Management**
    - **Validates: Requirements 2.11, 2.13**
  - [ ]* 11.5 Test accordion mutual exclusion
    - **Property 5: Accordion Mutual Exclusion**
    - **Validates: Requirements 7.4, 7.9**
  - [ ]* 11.6 Test delete button visibility
    - **Property 6: Delete Button Visibility for Dynamic Lists**
    - **Validates: Requirements 3.10, 6.9, 7.7**
  - [ ]* 11.7 Test conditional field rendering
    - **Property 8: Conditional Field Rendering - Payment Method**
    - **Property 9: Conditional Field Rendering - Suppressions**
    - **Validates: Requirements 5.3-5.5, 6.2**
  - [ ]* 11.8 Test required field validation
    - **Property 10: Required Field Validation**
    - **Validates: Requirements 8.1-8.7**

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Follow existing patterns from the current OperationalUnitsStep.tsx implementation
- Use existing FormTextField, FormSelectField, FormDateField components
- The Assign Contacts chips component is a new pattern not used elsewhere in the codebase
