# Implementation Plan: Operational Units Step

## Overview

This plan implements the Operational Units step (Step 4) in the Add Client wizard. The implementation follows existing patterns from ContactsAccessStep and ContractDetailsStep, using react-hook-form with Zod validation and MUI components.

## Tasks

- [x] 1. Update schema and types for Operational Units
  - [x] 1.1 Update operationalUnitSchema in addClientSchema.ts
    - Update required fields: name, id, lineOfBusiness, runOffPeriod
    - Update optional fields: marketSegment, mrPlanType, mrGroupIndividual, mrClassification, passThroughTraditional, assignContacts
    - Use "Required field" error message for all required fields
    - _Requirements: 2.1-2.10, 6.1-6.6_
  - [x] 1.2 Create operationalUnitAddressSchema with all required fields
    - Fields: addressType, address1, address2, city, state, zip
    - All fields required with "Required field" error message
    - _Requirements: 3.2-3.7, 6.6_
  - [x] 1.3 Add billingAttributesOverride optional schema
    - Mirror contract billing attributes as optional fields
    - _Requirements: 4.1-4.5_
  - [x] 1.4 Update AddClientCombinedSchema to include operationalUnits array
    - Add operationalUnits field with min(1) validation
    - _Requirements: 5.1, 8.4_
  - [x] 1.5 Update default values for operational units
    - Create defaultOperationalUnitAddressData
    - Update defaultOperationalUnitData with new field structure
    - Update defaultAddClientCombinedData
    - _Requirements: 5.1_

- [x] 2. Create OperationalUnitsStep component structure
  - [x] 2.1 Create OperationalUnitsStep.tsx with component interface
    - Define props: control, errors from parent form
    - Set up useFieldArray for operationalUnits
    - Initialize expandedIndex state to 0
    - _Requirements: 1.4, 8.4_
  - [x] 2.2 Implement main accordion container
    - Title: "Operational Units"
    - Subtitle: "Complete the fields below."
    - Border: 1px solid #CBCCCD, border-radius: 12px
    - Padding: 30px top/bottom, 24px left/right
    - _Requirements: 1.1-1.6_

- [x] 3. Implement basic fields section
  - [x] 3.1 Create Row 1 fields in 3-column grid
    - Operational Unit Name (text, required, placeholder "Enter name")
    - Operational Unit ID (text, required, placeholder "Enter name")
    - Market Segment (dropdown, optional, placeholder "Select market segment")
    - _Requirements: 2.1-2.3, 7.4_
  - [x] 3.2 Create Row 2 fields in 3-column grid
    - Line of Business (dropdown, required, placeholder "Select line of business")
    - M&R Plan Type (dropdown, optional, placeholder "Select M&R plan type")
    - M&R Group/Individual (dropdown, optional, placeholder "Select M&R grouping")
    - _Requirements: 2.4-2.6, 7.5_
  - [x] 3.3 Create Row 3 fields in 3-column grid
    - M&R Classification (dropdown, optional, placeholder "Select M&R classification")
    - Pass through/Traditional pricing (dropdown, optional, placeholder "Select")
    - Run-off Period (text, required, placeholder "Enter Period")
    - _Requirements: 2.7-2.9, 7.6_
  - [x] 3.4 Create Row 4 field
    - Assign Contacts (dropdown, optional, placeholder "Select contacts")
    - _Requirements: 2.10, 7.7_
  - [x] 3.5 Define dropdown options constants
    - MARKET_SEGMENT_OPTIONS, LINE_OF_BUSINESS_OPTIONS
    - MR_PLAN_TYPE_OPTIONS, MR_GROUP_INDIVIDUAL_OPTIONS
    - MR_CLASSIFICATION_OPTIONS, PRICING_OPTIONS
    - _Requirements: 2.3-2.8_

- [x] 4. Implement address section
  - [x] 4.1 Add horizontal separator between basic fields and address section
    - Use Divider component with #AAAAAA color
    - _Requirements: 3.1_
  - [x] 4.2 Create nested useFieldArray for addresses within each operational unit
    - Initialize with one default address entry
    - _Requirements: 3.8, 3.9_
  - [x] 4.3 Implement address entry fields in 3-column grid
    - Row 1: Address Type (dropdown, required), Address 1 (text, required), Address 2 (text, required)
    - Row 2: City (text, required), State (text, required), Zip (text, required)
    - _Requirements: 3.2-3.7, 7.8, 7.9_
  - [x] 4.4 Add delete button for addresses (except first)
    - Trash icon button with #C40000 color
    - Only show for index > 0
    - _Requirements: 3.10, 3.11_
  - [x] 4.5 Add "Add another billing address" button
    - Plus icon with #0C55B8 text color
    - Append new empty address on click
    - _Requirements: 3.8, 3.9_

- [x] 5. Implement Billing Attributes Override section
  - [x] 5.1 Create nested accordion for billing attributes
    - Title: "Billing Attributes"
    - Subtitle: "You may override the billing attributes outlined under the contract details section here."
    - Border: 1px solid #CBCCCD, border-radius: 12px
    - Collapsible with chevron icon
    - _Requirements: 4.1-4.5_
  - [x] 5.2 Add billing override fields (optional)
    - Mirror fields from ContractDetailsStep billing section
    - All fields optional for override
    - _Requirements: 4.1-4.5_

- [x] 6. Implement multiple operational units management
  - [x] 6.1 Implement accordion expand/collapse logic
    - Only one card expanded at a time
    - Click collapsed card to expand and collapse others
    - _Requirements: 5.4, 5.9_
  - [x] 6.2 Implement collapsed card display
    - Title: "Operational Units - [Operational Unit Name]"
    - Subtitle: "Complete the fields below"
    - _Requirements: 5.5, 5.6_
  - [x] 6.3 Add delete button on collapsed cards
    - Trash icon, only show when multiple units exist
    - Remove operational unit on click
    - _Requirements: 5.7, 5.8_
  - [x] 6.4 Add "Add another operational unit" button
    - Plus icon with #0C55B8 text color
    - Append new operational unit and expand it
    - 56px gap between operational unit cards
    - _Requirements: 5.2, 5.3, 5.10_

- [x] 7. Integrate with AddClientStepper
  - [x] 7.1 Import and add OperationalUnitsStep to stepper
    - Add as Step 4 between Contacts & Access and Confirmation
    - Pass control and errors props
    - _Requirements: 8.1, 8.4_
  - [x] 7.2 Set up useFieldArray in parent for operationalUnits
    - Add to AddClientPage or AddClientStepper
    - Pass field array methods to OperationalUnitsStep
    - _Requirements: 8.2, 8.3_
  - [x] 7.3 Verify navigation between steps
    - "Next" navigates to Step 5 (Confirmation) on valid form
    - "Go Back" navigates to Step 3 (Contacts & Access)
    - _Requirements: 8.5, 8.6, 8.7_

- [x] 8. Checkpoint - Ensure all tests pass
  - Verify form renders correctly
  - Verify validation works for required fields
  - Verify add/remove functionality for units and addresses
  - Ask the user if questions arise

- [ ]* 9. Write unit tests for OperationalUnitsStep
  - [ ]* 9.1 Test accordion expand/collapse behavior
    - _Requirements: 1.3, 1.4, 5.4, 5.9_
  - [ ]* 9.2 Test add/remove operational unit functionality
    - _Requirements: 5.2, 5.3, 5.7, 5.8_
  - [ ]* 9.3 Test add/remove address functionality
    - _Requirements: 3.8, 3.9, 3.10, 3.11_
  - [ ]* 9.4 Test form field rendering and validation
    - _Requirements: 6.1-6.7, 9.1-9.7_

- [x] 10. Final checkpoint - Ensure all tests pass
  - Verify complete integration with multi-step form
  - Verify data persistence across step navigation
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Follow existing patterns from ContactsAccessStep.tsx and ContractDetailsStep.tsx
- Use existing FormTextField, FormSelectField, FormDateField components
